"use client";
import React from "react";
import Master from "../components/layouts/master";
import withQRCode from "@/utils/withQRCode";
import axiosClient from "../../configs/axiosClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookie from 'js-cookie'
import {TiPlus,TiMinus} from 'react-icons/ti';
import { Divider, Button, Card, Image, Drawer, InputNumber,message } from "antd";

const Home = () => {
  const router = useRouter();
  const [drawer, setDrawer] = React.useState(false);
  const [disable, setDisable] = React.useState(false);
  const [promotions, setPromotions] = React.useState<any>([]);
  const [promotionName, setPromotionName] = React.useState<any>();
  const [promotionId, setPromotionId] = React.useState<any>();
  const [selectPromotion, setSelectPromotion] = React.useState<number>();
  const [promotionPrice, setpromotionPrice] = React.useState<any>();
  const [promotionLimit, setpromotionLimit] = React.useState<number>(0);
  const [quantity, setQuantity] = React.useState<any>(1);
  React.useEffect(() => {
    const getProducts = async () => {
      try {
        console.log(selectPromotion);  
        const response = selectPromotion ? await axiosClient.get(`/promotions/id/${selectPromotion}`) : await axiosClient.get("/promotions/client");
        setPromotions(response.data);
        // console.log(response.data);  
      } catch (error) {
        console.log(error);
      }
    };
    getProducts();
  }, [selectPromotion]);
  // console.log(promotions);

  const addToCart = async () => {
    try {
      const table:any = Cookie.get('table')
      const tableId = JSON.parse(table).tableId;
      console.log({promotionId: promotionId, quantity: quantity, tableId: tableId});  
      await axiosClient.post('/carts/create', {tableId: tableId, promotionId: promotionId, quantity: quantity})
      message.success('Đã thêm vào giỏ hàng')
      setDrawer(false)
    } catch (error) {
      console.log(error);  
      message.error('Lỗi, không thể thêm vào giỏ hàng!')
    }
  }

  return (
    <Master>
      <aside>
        <h2>Combo khuyến mãi</h2>
      </aside>
      <Divider />
      <section>
        <div>
        {
          promotions?.map((promotion:any)=> {
            return (
              <Card title={promotion.name + ' chỉ với ' + promotion.price.toLocaleString("vi-VN", 0) +'đ'} className='mb-5'>
                {
                  promotion?.promotionDetails?.map((detail:any)=>{
                    return (
                      <Card type="inner" title={detail.productSize?.product?.name + ' - ' + detail.productSize?.price.toLocaleString("vi-VN", 0) +'đ'} extra={<Link href={`product/${detail.productSize?.product?.productId}`}>Chi tiết món</Link>}>
                        <Image preview={false} src={'http://localhost:9999/' + detail.productSize?.product?.images[0]?.uri}/>
                      </Card> 
                    )
                  })
                }
                <div className='flex justify-between'>
                    <Button type='primary' onClick={()=>{
                      setPromotionName(promotion.name);
                      setQuantity(1);
                      setpromotionLimit(promotion.limit)
                      setpromotionPrice(promotion.price)
                      setPromotionId(promotion.promotionId);
                      setDrawer(true)
                       }} className="right-0 flex-grow">Thêm vào giỏ hàng</Button>
                </div>
              </Card>
            )
          })
        }
        </div>
        <Drawer title="Thêm vào giỏ hàng" placement='bottom' onClose={() => setDrawer(false)} open={drawer}>
                <div className="text-black">
                    Món: 
                    <span> {promotionName}</span>
                </div>
                <div className="text-black">
                    Giá: 
                    <span> {promotionPrice?.toLocaleString("vi-VN", 0) +'đ'}</span>
                </div>
                <div>
                  <span className="flex gap-1">
                      Số lượng
                    <Button size="small" onClick={()=>{
                       if (quantity > 1) {
                        setQuantity(quantity - 1);
                    }
                    }}>
                      <TiMinus size={10} />
                    </Button>
                    <InputNumber
                      onChange={(value:number | null) => {
                        setQuantity(value)
                      }}
                      className="w-[40px]"
                      min={0}
                      max={promotionLimit}
                      size="small"
                      value={quantity}
                      type="number"
                      onBlur={()=>{if(quantity>promotionLimit)setDisable(true)}}
                    />
                    <Button size="small" onClick={()=>{
                      if(quantity < 99) {
                          setQuantity(quantity + 1)
                      }
                    }}>
                      <TiPlus size={10} />
                    </Button>
                  </span>
                </div>
                <Divider/>
                <div className='flex justify-between'>
                    <Button type='primary' onClick={()=>addToCart()} disabled={disable} className="right-0 flex-grow">Thêm</Button>
                </div>
              </Drawer>
      </section>
    </Master>
  );
};

export default withQRCode(Home);
