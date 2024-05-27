"use client";
// components/SubLayout.js
import React from "react";
import Master from "../components/layouts/master";
import { Card, Divider } from "antd";
import axiosClient from "../../configs/axiosClient";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();
  const [products, setProducts] = React.useState([]);
  React.useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axiosClient.get("/products/all");
        setProducts(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getProducts();
  }, []);
  console.log(products);

  return (
    <Master>
      <aside>
        <h2>Home</h2>
      </aside>
      <Divider />
      <div className="flex flex-wrap">
        {products.map((product: any) => {
          return (
            <Card
              className="m-3"
              hoverable
              style={{ width: 155 }}
              cover={
                <img
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
              {product.discount > 0 && (
                <span className="float-start">
                  <del>10.000đ</del>
                </span>
              )}
              <span className="float-end font-bold">{product.price}</span>
              <p className="size-3 w-full font-bold h-fit line-clamp-3 text-ellipsis">
                {product.name}
              </p>
            </Card>
          );
        })}
        <Card
          className="m-3"
          hoverable
          style={{ width: 155 }}
          cover={
            <img
              alt="example"
              src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
            />
          }
        >
          <span className="float-start">
            <del>10.000đ</del>
          </span>
          <span className="float-end font-bold">8.000đ</span>
          <p className="size-3 w-full font-bold h-fit line-clamp-3 text-ellipsis">
            Mỳ cay bạch tuộc kim chi hàn quốc
          </p>
        </Card>
      </div>
    </Master>
  );
};

export default Home;
