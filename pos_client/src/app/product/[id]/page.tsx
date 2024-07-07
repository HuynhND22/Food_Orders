"use client";

import React from "react";
import axiosClient from "../../../../configs/axiosClient";
import { useRouter } from "next/navigation";
import {TiMinus, TiPlus} from 'react-icons/ti';
import {ShoppingCartOutlined, CheckCircleOutlined, CloseCircleOutlined} from '@ant-design/icons';
import { Carousel, Divider, Image, Radio, RadioChangeEvent, Card, Button, Form, InputNumber, ConfigProvider, message, notification } from "antd";
import Nav from "@/components/layouts/navMenu";
import withQRCode from "@/utils/withQRCode";
import Cookie from 'js-cookie'
import useSocket from '../../../components/socket/SocketComponent';

const Product = ({ params: { id } }: any) => {
  // const socket = useSocket('http://localhost:9999');
  // const [messages, setMessages] = React.useState<string[]>([]);
  //   const [message, setMessage] = React.useState<string>('');

  //   React.useEffect(() => {
  //       if (socket) {
  //           socket.on('message', (msg: string) => {
  //               setMessages((prev) => [...prev, msg]);
  //           });
  //       }
  //   }, [socket]);

  //   const sendMessage = () => {
  //       if (socket && message) {
  //           socket.emit('message', message);
  //           setMessage('');
  //       }
  //   };


  //   {messages.map((msg, index) => (
  //       <div key={index}>{msg}</div>
  //   ))}
  //   <input
  //       type="text"
  //       value={message}
  //       onChange={(e) => setMessage(e.target.value)}
  //   />
  //   <button onClick={sendMessage}>Send</button>

  const [product, setProduct] = React.useState<any>([]);
  const [related, setRelated] = React.useState<any>([]);
  const [sizes, setSiezs] = React.useState<any>([]);
  const [size, setSize] = React.useState<any>([]);
  const [price, setPrice] = React.useState<any>();
  const [cost, setCost] = React.useState<any>();
  const [quantity, setQuantity] = React.useState<any>(1);
  const [limit, setLimit] = React.useState<any>(99);


  const getProduct = async () => {
    try {
      const response = await axiosClient.get(`/products/id/${id}`);
      setProduct(response.data);
      const res = await axiosClient.get(`/products/category/${response.data.categoryId}`)
      setRelated(res.data)
      setSiezs(
        response.data.productSizes.map((value: any) => {
          return { label: value.size.name, value: value.productSizeId };
        })
      );
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {   
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
    // background: "#F0FFF0",
  };

  const handlePrice = ({ target: { value } }: RadioChangeEvent) => {
    console.log("radio4 checked", value);
    setSize(value);
    Object.entries(product.productSizes).filter((item: any) => {
      setLimit(item[1].stock)
      if (item[1].productSizeId === value) {
        if (item[1].discount == 0) {
          setPrice(item[1].price);
          setCost(null);
        } else {
          setPrice(item[1].price * (1 - item[1].discount / 100));
          setCost(item[1].price);
        }
      }
    });
  };

  const onCreate = async (value:any) => {
    const table:any = Cookie.get('table')
    value['quantity'] = quantity
    value['tableId'] = JSON.parse(table).tableId
    
    console.log(value);  
    try {
      await axiosClient.post('carts/create', value)
      notification.info({
      message: `Thành công`,
      description: 'Đã thêm món của bạn vào giỏ hàng!',
      placement: 'topRight',
      icon: <CheckCircleOutlined style={{ color: '#58c621' }} />,  
    });
    } catch (error) {
      notification.info({
      message: `Lỗi`,
      description: 'Không thể thêm sản phẩm vào giỏ hàng!',
      placement: 'topRight',
      icon: <CloseCircleOutlined style={{ color: '#f81d22' }} />,  
    });
      console.log(error);  
    }
  }

  return (
     <ConfigProvider
    theme={{
      token: {
        colorPrimary: '#ffba00',
      },
    }}
  >
    <main className=" bg-[#F5F5F5] rounded-lg border-8 border-white-500 relative rounded-lg fixed left-0 right-0 top-0 bottom-0 text-slate-950 p-5">
      <div className="text-center bg-[#ffba00] rounded-sm font-bold text-slate-950 py-3 text-white">Chi tiết món</div>
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
      <Form name='addToCart' onFinish={(value:any)=>onCreate(value)}>
        <div>
          <p className="font-bold text-lg">{product.name}</p>
        </div>
        <div className='p-3'>
          <div className="flex gap-7">
            <Form.Item name='productSizeId' label='Size' rules={[{required: true, message: 'Vui lòng chọn size'}]}>
            <Radio.Group
              options={sizes}
              onChange={handlePrice}
              value={size}
              optionType="button"
              buttonStyle="solid"
            />
            </Form.Item>
          </div>
          {price && (
            <div className='p-2'>
              Giá: {cost && <del>{cost.toLocaleString("vi-VN", {minimumFractionDigits: 0})}đ</del>}
              <span className="text-red-600 font-bold"> {price.toLocaleString("vi-VN", {minimumFractionDigits: 0})}đ</span>
            </div>
          )}
          <Form.Item name='quantity' label='Số lượng'>
          <span className="flex gap-1">
          <Button size="small"
            onClick={()=>{if(quantity>1) setQuantity(quantity - 1)}}
          >
            <TiMinus size={10} />
          </Button>
          <InputNumber
            onChange={(value:number | null) => {
              setQuantity(value)
            }}
            className="w-[40px]"
            min={0}
            max={99}
            size="small"
            value={quantity}
            type="number"
          />
          <Button size="small" 
            onClick={()=>{if(quantity<99)setQuantity(quantity + 1)}}
          >
            <TiPlus size={10} />
          </Button>
          </span>
          <div className='text-red-500' style={quantity > limit ? {display: 'block'} : {display: 'none'}}>Vượt quá số lượng hiện có</div>
            </Form.Item>
          <div className='py-5 flex justify-center'>
            <Button type='primary' icon={<ShoppingCartOutlined />} htmlType="submit" disabled={quantity > limit ? true : false}>
              Thêm vào giỏ hàng
            </Button>
          </div>
        </div>
      </Form>

      <Divider />
      <span className='inline-block'>
        {product.description && <span className="text-lg mt-10">Mô tả: {product.description}</span>}
      </span>
        {related && <div className='font-bold text-lg pt-10'>Có thể bạn cũng thích</div>}
        <div className="overflow-x-auto whitespace-nowrap scrollbar-none bg-[#f0fffc] px-5 py-10 rounded-md">
        {related && related.map((value:any)=> {
          return (
            <Card
              className="inline-block rounded-lg mr-4 hover:bg-[#F0FFF0] transition-colors duration-300"
              hoverable
              style={{ width: 170 }}
               // actions={[<Button onClick={()=>{}}><ShoppingCartOutlined /></Button>]}
              cover={
                <Image
                  preview={false}
                  alt="example"
                  src={value.images?.map((image: any) =>
                      image.cover ? `http://localhost:9999/${image.uri}` : ""
                    )
                    .join("")}
                />
              }
              onClick={() => router.push(`/product/${value.productId}`)}
            >
              <div className="size-4 w-full font-bold h-fit line-clamp-2 text-ellipsis">
                {value.name}
              </div>
                
              <small className='pt-1 line-clamp-1 text-ellipsis'>{value.description}</small>
                
            </Card>)
        })}
      </div>
      <Nav />
    </main>
      </ConfigProvider>
  );
};

export default withQRCode(Product);
