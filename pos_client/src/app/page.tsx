"use client";
import React from "react";
import Master from "../components/layouts/master";
import withQRCode from "@/utils/withQRCode";
import axiosClient from "../../configs/axiosClient";
import { useRouter } from "next/navigation";
import { Divider, Button } from "antd";
import useSocket from '../components//socket/SocketComponent';

const Home = () => {

    const socket = useSocket('http://localhost:9999'); // Địa chỉ của server Node.js

    const [messages, setMessages] = React.useState<string[]>([]);
    const [message, setMessage] = React.useState<string>('');

    React.useEffect(() => {
        if (socket) {
            socket.on('message', (msg: string) => {
                setMessages((prev) => [...prev, msg]);
            });
        }
    }, [socket]);

    const sendMessage = () => {
        if (socket && message) {
            socket.emit('message', message);
            setMessage('');
        }
    };


  const router = useRouter();
  const [promotions, setPromotions] = React.useState([]);
  const [selectPromotion, setSelectPromotion] = React.useState<Number>();
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

  return (
    <Master>
      <aside>
        <h2>Sidebar</h2>
        <div className="overflow-x-auto whitespace-nowrap">
          {promotions.map((promotion: any) => {
            return (
              <div className="inline-block px-4 py-2 bg-gray-200 rounded-lg mr-4 hover:bg-gray-300 transition-colors duration-300">
                <Button key={promotion.promotionId} onClick={(e:any)=>{
                  setSelectPromotion(Number(e.currentTarget.value))
                }} value={promotion.promotionId}>
                  {promotion.name}
                </Button>
              </div>
            );
          })}
        </div>
      </aside>
      <Divider />
      <section>
      <div>
            <h1>Chat</h1>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
        </div></section>
    </Master>
  );
};

export default withQRCode(Home);
