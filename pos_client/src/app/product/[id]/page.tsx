"use client";

import React from "react";
import axiosClient from "../../../../configs/axiosClient";
import { useRouter } from "next/navigation";
import { Carousel, Divider, Image, Radio, RadioChangeEvent } from "antd";
import Nav from "@/components/layouts/navMenu";

const Product = ({ params: { id } }: any) => {
  const [product, setProduct] = React.useState<any>([]);
  React.useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await axiosClient.get(`/products/id/${id}`);
        console.log(response.data);
        setProduct(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getProduct();
  }, []);
  const router = useRouter();
  const contentStyle: React.CSSProperties = {
    margin: 15,
    height: "300px",
    minWidth: "140px",
    color: "#fff",
    lineHeight: "150px",
    textAlign: "center",
    borderRadius: "20px",
    background: "#364d79",
  };
  const [size, setSize] = React.useState();
  const [price, setPrice] = React.useState<any>();
  const [cost, setCost] = React.useState<any>();

  const sizeData = product?.productSizes?.map((size: any) => {
    return {
      label: size.size.name,
      value: size.sizeId,
      disabled: size.stock === 0 ? true : false,
    };
  });

  const handlePrice = ({ target: { value } }: RadioChangeEvent) => {
    console.log("radio4 checked", value);
    Object.entries(product.productSizes).filter((item: any) => {
      // console.log(item[1].sizeId);
      if (item[1].sizeId === value) {
        if (item[1].discount == 0) {
          setPrice(item[1].price);
          setCost(null);
        } else {
          setPrice(item[1].price * (1 - item[1].discount / 100));
          setCost(item[1].price);
        }
      }
    });
    setSize(value);
  };

  return (
    <main className=" bg-white rounded-lg fixed left-0 right-0 top-0 bottom-0 text-slate-950 p-5">
      <div className="text-center text-slate-950 p-3">Chi tiết món</div>
      <div className="">
        <Carousel arrows>
          {product.images?.map((image: any) => {
            return (
              <div className="pr-5" key={image.imageId}>
                {/* <h3 style={contentStyle}>1</h3> */}
                <Image
                  width={"100%"}
                  preview={false}
                  src={`http://localhost:9999/${image.uri}`}
                  style={contentStyle}
                  className=" object-cover rounded-sm"
                />
              </div>
            );
          })}
        </Carousel>
      </div>
      <Divider />
      <div>
        <p className="font-bold text-lg">{product.name}</p>
      </div>
      <div className="flex gap-7">
        <span className="text-lg ">Size </span>
        <Radio.Group
          options={sizeData}
          onChange={handlePrice}
          value={size}
          optionType="button"
          buttonStyle="solid"
        />
      </div>
      {price && (
        <div>
          Giá: {cost && <del>{cost}đ</del>}
          <span className="text-red-600 font-bold"> {price}đ</span>
        </div>
      )}
      <Divider />
      <div>
        <span className="text-lg mt-10">Mô tả: {product.description}</span>
      </div>
      <Nav />
    </main>
  );
};

export default Product;
