import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../data-source";
import { Product } from "../entities/product.entity";
import { Image } from "../entities/image.entity";
import { handleUniqueError } from "../helpers/handleUniqueError";
import { ProductSize } from "../entities/productSize.entity";
import fs from "fs";
import { IsNull, Not } from "typeorm";
import checkUnique from "../helpers/checkUnique";
// import { upload } from "../helpers/uploadFile";
const multer = require('multer');
const path = require('path');

const repository = AppDataSource.getRepository(Product);

const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await repository.find({relations: ['images', 'category', 'supplier', 'status', 'productSizes.size']});
        if (products.length === 0) {
            return res.status(204).send({
                error: "No content",
            });
        }
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const getById = async (req: Request, res: Response, next: NextFunction) => { 
    try {
        const product = await repository.findOne({
            where: { productId: parseInt(req.params.id) },
            relations: ['category', 'supplier', 'status', 'productSizes.size', 'images'],
        });
        product ? res.status(200).json(product) : res.sendStatus(410)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const create = async (req: any, res: Response, next: NextFunction) => { 
    try {
        const queryRunner = repository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const storage = multer.diskStorage({
                contentType: multer.AUTO_CONTENT_TYPE,
                destination: function (req:Request, file:any, cb:Function) {
                    if (!fs.existsSync(`./public/uploads/products/`)) {
                        fs.mkdirSync(`./public/uploads/products/`, { recursive: true });
                      }
                  return cb(null, `./public/uploads/products/`);
                },
                filename: function (req:any, file:any, cb:any) {
                  cb(null, Date.now() + '-' + file.originalname)
                  return Date.now() + '-' + file.originalname
                }
            });

            const upload = multer({ storage: storage }).array("images", 5);

            // const images = product.images?.map((img:any) => {
            //     return {...img, productId: result.productId, uri: '/uploads/products/'};
            // })
            
            await upload(req, res, async function (err:any) {
                if (err) {
                    console.log(err);
                    throw err;
                } else {
                    try {   
                        const product = req.body;
                        const removeSurroundingQuotes = (value:any) => {
                            if (typeof value === 'string' && value.startsWith('"') && value.endsWith('"')) {
                              return value.slice(1, -1);
                            }
                            return value;
                          };
                          Object.keys(product).forEach(key => {
                            product[key] = removeSurroundingQuotes(product[key]);
                          });
                          
                        console.log(product);	
                        const saveData = {
                            name: product.name,
                            description: product.description,
                            categoryId: product.categoryId,
                            supplierId: product.supplierId,
                            statusId: product.statusId,
                        }
                        const result = await queryRunner.manager.save(Product, saveData);
                        const images = req.files?.map((file:any) => {
                            return {uri: 'uploads/products/'+file?.filename, productId: result.productId, cover: file?.filename.includes(product.cover)}
                        });
                        console.log(images);	
                        await queryRunner.manager.save(Image, images);

                        const sizes = await JSON.parse(product.productSize).map((size:any) => {
                            console.log(size);	
                            return {sizeId: size.sizeId, productId: result.productId, price: size.price, discount: size.discount};
                        })
                        console.log(sizes);	
                        await queryRunner.manager.save(ProductSize, sizes);

                        await queryRunner.commitTransaction();

                        const success = await repository.findOne({where: {productId: result.productId}, relations: ['category', 'supplier', 'status', 'productSizes.size', 'images']})
                        return res.status(200).json(success);
                    } catch (error:any) {
                        if(error.number == 2627) {
                            const message = handleUniqueError(error);
                            return res.status(400).json({ error: message });
                        }
                        console.log(error);
                        return res.status(500).json({ error: "Transaction failed" });
                    }
                }
            });

        } catch (error) {
            console.log(error);	
            return res.status(500).json({ error: "Upload error" });
        } finally {
            // await queryRunner.release();
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const update = async (req:any, res:Response, next: NextFunction) => {
    try {
        const queryRunner = repository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const productId = parseInt(req.params.id);
            const product:any = await queryRunner.manager.findOne(Product, {where: {productId: productId}});
            if (!product) return res.sendStatus(410);

            try {
                const storage = multer.diskStorage({
                    contentType: multer.AUTO_CONTENT_TYPE,
                    destination: function (req:Request, file:any, cb:Function) {
                        if (!fs.existsSync(`./public/uploads/products/`)) {
                            fs.mkdirSync(`./public/uploads/products/`, { recursive: true });
                          }
                      return cb(null, `./public/uploads/products/`);
                    },
                    filename: function (req:any, file:any, cb:any) {
                      cb(null, Date.now() + '-' + file.originalname)
                      return Date.now() + '-' + file.originalname
                    }
                });
    
                const upload = multer({ storage: storage }).array("images", 5);
                
                await upload(req, res, async function (err:any) {

                })
            } catch (error:any) {
                console.log(error);	
            }

            const data = req.body;

            Object.entries(data).forEach(([key, value]:any) => {
                product[key] = value;
            });

            await queryRunner.manager.save(Product, product);
            
            const image = await queryRunner.manager.find(Image, {where: {productId: productId}});
            
            // console.log(image);	
            if(data.images){

                const images = req.files?.map((file:any) => {
                    return {uri: 'uploads/products/'+file?.filename, productId: productId, cover: file?.filename.includes(product.cover)}
                });
                console.log(images);	
                await queryRunner.manager.save(Image, images);

                await Promise.all( image.map( async(value:any) => {
                    const matchingItem = data.images.find((img:any) => img.uri == value.uri)
                    if (!matchingItem) {
                        queryRunner.manager.delete(Image, { imageId: value.imageId})
                        fs.unlink(`public/${value.uri}`, (err:any) => {
                            if (err) throw err
                        })
                    }
                }));
            }

            const storage = multer.diskStorage({
                destination: function (req:Request, file:any, cb:Function) {
                return cb(null, path.join(__dirname, '../../public/uploads/products/'));
                },
                filename: async function (req:Request, file:any, cb:Function) {
                    const images = product.images?.map((img:any) => {
                        return {...img, productId: productId, uri: '/uploads/products/'};
                    })
                    console.log('fileNmae ' + path.extname(file.originalname));	
                    await queryRunner.manager.save(Image, images);
                    return cb(null, Date.now() + path.extname(file.originalname));
                },
            });

            const upload = multer({ storage: storage }).array("images", 5);
            await upload(req, res, function (err:any) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('upload ok');
                }
            });


            if (data.sizes) {

                const sizes = await JSON.parse(product.productSizes).map((size:any) => {
                    console.log(size);	
                    return {sizeId: size.sizeId, productId: productId, price: size.price, discount: size.discount};
                })


                const currentSizes = await queryRunner.manager.find(ProductSize, { where: { productId: productId } });

                await Promise.all(currentSizes.map(async (size: any) => {
                    const matchingItem = data.sizes.find((item: any) => item.productSizeId === size.productSizeId);
                    if (matchingItem) {
                        await queryRunner.manager.save(ProductSize, matchingItem);
                    } else {
                        await queryRunner.manager.softDelete(ProductSize, size.productSizeId);
                    }
                }));

                await Promise.all(data.sizes.map(async (item: any) => {
                    if (!currentSizes.some((size: any) => size.productSizeId === item.productSizeId)) {
                        let newSize = {...item, productId: productId};
                        await queryRunner.manager.save(ProductSize, newSize);
                    }
                }));
            }

            await queryRunner.commitTransaction();

            const success = await repository.findOne({where: {productId: productId}, relations: ['category', 'supplier', 'status', 'productSizes.size', 'images']})
            return res.status(200).json(success);

        } catch (error:any) {
            await queryRunner.rollbackTransaction();
            if(error.number == 2627) {
                const message = handleUniqueError(error);
                return res.status(400).json({ error: message });
            }
            console.log(error);
            return res.status(500).json({ error: "Transaction failed" });
        } finally {
            await queryRunner.release();
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const softDelete = async (req: Request, res:Response, next:NextFunction) => {
    try {
        const productId = parseInt(req.params.id);
        console.log(productId);
        const found = await repository.findOneBy({productId: productId})
        if (!found) return res.status(410).json('Product not found');
        await repository.softDelete({productId: productId});
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const restore = async (req: Request, res:Response, next:NextFunction) => {
    try {
        const productId = parseInt(req.params.id);
        const found = await repository.findOne({where: {productId: productId, deletedAt: Not(IsNull())}, withDeleted: true, })
        if (!found) return res.status(410).json('Product not found');
        await repository.restore({productId: productId});
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const getDeleted = async (req: Request, res:Response, next:NextFunction) => {
    try {
        const products = await repository.find({withDeleted: true, where: {deletedAt: Not(IsNull())}, relations: ['images', 'category', 'supplier', 'status', 'productSizes.size']});
        if (products.length === 0) {
            return res.status(204).send({
                error: "No content",
            });
        }
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const hardDelete = async (req:Request, res:Response)=>{
    try {
        const productId = parseInt(req.params.id);
        const product = await repository.findOne({withDeleted: true, where: {productId:productId, deletedAt: Not(IsNull())}});
        if (!product) return res.sendStatus(410);
        await repository.delete({productId: productId});
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const checkProductUnique = async (req: Request, res:Response, next:NextFunction) => {
    const {value, ignore, field} = req.query;
    if(ignore && ignore == value) {
        return res.sendStatus(200)
    }
    
    try {
        const check = await checkUnique(Product, `${field}`, value);
        check ? res.sendStatus(200) : res.sendStatus(400)
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getByCategory = async (req:Request, res:Response) => {
    try {
        const {categoryId} = req.params;
        const products = await repository.find({where: {statusId: 41, categoryId: parseInt(categoryId)}, relations: ['images', 'category', 'supplier', 'status', 'productSizes.size']});
        if (products.length === 0) {
            return res.status(204).send({
                error: "No content",
            });
        }
        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Internal server error'})
    }
}

const client = async (req:Request, res:Response) => {
    try {
        const products = await repository.find({where: {statusId: 41}, relations: ['images', 'category', 'supplier', 'status', 'productSizes.size']});
        if (products.length === 0) {
            return res.status(204).send({
                error: "No content",
            });
        }
        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Internal server error'})
    }
}

export default {getAll, getById, create, update, softDelete, restore, hardDelete, getDeleted, checkProductUnique, getByCategory, client}
