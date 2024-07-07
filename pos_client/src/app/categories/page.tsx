"use client";
// components/SubLayout.js
import React,  { Suspense } from "react";
import Master from "../../components/layouts/master";
import { Card, Divider, Button, Image, Collapse, Slider } from "antd";
import type { CollapseProps, SliderSingleProps } from 'antd';
import {ShoppingCartOutlined} from '@ant-design/icons'
import { VscSettings } from "react-icons/vsc";
import axiosClient from "../../../configs/axiosClient";
import { useRouter, useSearchParams  } from "next/navigation";
import withQRCode from "@/utils/withQRCode";
import Numeral from "numeral";

const CategoriesContent = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  console.log(searchQuery); 
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
        const response = selectCategory ? await axiosClient.get(`/products/category/${selectCategory}?search=${searchQuery}`) : await axiosClient.get(`/products/client?search=${searchQuery}`) 
        setProducts(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getProducts();
    getCategories()
  }, [selectCategory, searchQuery]);

  const formatter: NonNullable<SliderSingleProps['tooltip']>['formatter'] = (value:any) => {return Numeral(value).format("0,000") + 'đ'}
          // Giá (VND)
          // <Slider range tooltip={{ formatter }} defaultValue={[0, 500000]} label={'dva'} max={500000} step={10000} />

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: 'Lọc',
      children: (
        <div>
          <Divider/>
          Danh mục
          <div className="overflow-x-auto whitespace-nowrap scrollbar-none bg-gray-200 rounded-md px-5 py-1 ">
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
          <Divider/>
        </div>
        ),
    }
  ];

  return (
    <Master>
      <aside>
        <h2>Món</h2>
        <Collapse bordered={false} size='small' expandIcon={({ isActive }:any) => <VscSettings size={isActive ? 30 : 20} />} items={items} onChange={()=>{}} />
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

const Categories = () => {
  return (
      <Suspense fallback={<div>Loading...</div>}>
        <CategoriesContent />
      </Suspense>
  );
};

export default withQRCode(Categories);
