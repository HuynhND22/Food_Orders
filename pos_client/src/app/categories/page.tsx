"use client";
// components/SubLayout.js
import React from "react";
import Master from "../../components/layouts/master";
import { Card, Divider, Button, Image } from "antd";
import {ShoppingCartOutlined} from '@ant-design/icons'
import axiosClient from "../../../configs/axiosClient";
import { useRouter } from "next/navigation";
import withQRCode from "@/utils/withQRCode";

const Categories = () => {
  const router = useRouter();
  const [products, setProducts] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [selectCategory, setSelectCategory] = React.useState<Number>();
  

  React.useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await axiosClient.get('/categories/all')
        setCategories(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    const getProducts = async () => {
      try {
        const response = selectCategory ? await axiosClient.get(`/products/table/${selectCategory}`) : await axiosClient.get("/products/client") 
        setProducts(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getProducts();
    getCategories()
  }, [selectCategory]);

  return (
    <Master>
      <aside>
        <h2>Món</h2>
        <div className="overflow-x-auto whitespace-nowrap scrollbar-none bg-gray-200 rounded-md px-5 py-5 ">
          {categories.map((category: any) => {
            return (
              <div className="inline-block px-2 py-1 rounded-lg mr-4 hover:bg-gray-300 transition-colors duration-300">
                <Button key={category.categoryId} type={category.categoryId == selectCategory ? 'primary': 'default'} onClick={(e:any)=>{
                  setSelectCategory(Number(e.currentTarget.value))
                }} value={category.categoryId}>
                  {category.name}
                </Button>
              </div>
            );
          })}
        </div>
      </aside>
      <Divider />
      <div className="flex flex-wrap">
        {products && products?.map((product: any) => {
          return (
            <Card
              className="m-3"
              hoverable
              style={{ width: 155 }}
              // actions={[<Button onClick={()=>{}}><ShoppingCartOutlined /></Button>]}
              cover={
                <Image
                minScale={1}
                  preview={false}
                  alt="example"
                  src={product.images
                    .map((image: any) =>
                      image.cover ? `http://localhost:9999/${image.uri}` : ""
                    )
                    .join("")}
                />
              }
              onClick={() => router.push(`/product/${product.productId}`)}
            >
              <div className="size-4 w-full font-bold h-fit line-clamp-3 text-ellipsis">
                {product.name}
              </div>
                <span className="float-start">
                  <small className='line-clamp-2 text-ellipsis'>{product.description}</small>
                </span>
            </Card>
          );
        })}

      </div>
    </Master>
  );
};

export default withQRCode(Categories);
