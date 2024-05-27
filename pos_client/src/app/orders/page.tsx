"use client";

// components/SubLayout.js
import React from "react";
import Master from "../../components/layouts/master";
import { Avatar, Button, Divider, InputNumber, Space, Table } from "antd";
import { BiUser } from "react-icons/bi";
import { TiMinus, TiPlus } from "react-icons/ti";
import { RiDeleteBin5Line } from "react-icons/ri";
import axiosClient from "../../../configs/axiosClient";

const Order = () => {
  const tmp: any = localStorage.getItem("table");
  const table = JSON.parse(tmp);
  const [orders, setOrders] = React.useState([]);

  React.useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await axiosClient.get(`/orders/id/${table.tableId}`);
        const filteredData = response.data.map((item: any) => {
          const name = item.productSizes
            ? item.productSizes.product.name
            : item.promotion.name;
          const price = item.promotion
            ? item.promotion.price
            : item.productSizes.price *
              (1 - item.productSizes.discount / 100) *
              item.quantity;
          return {
            name: name,
            quantity: item.quantity,
            price: price,
            total: +price,
          };
        });
        console.log(filteredData);
        setOrders(filteredData);
      } catch (error) {
        console.log(error);
      }
    };
    getOrders();
  }, [table.tableId]);

  const columns = [
    {
      title: "Món",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (text: any, record: any, index: any) => {
        return (
          <span className="flex gap-1">
            <Button size="small">
              <TiMinus size={10} />
            </Button>
            <InputNumber
              className="w-[100%]"
              min={0}
              max={99}
              size="small"
              defaultValue={record.quantity}
              itemType="number"
            />
            <Button size="small">
              <TiPlus size={10} />
            </Button>
          </span>
        );
      },
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      key: "price",
    },
    {
      dataIndex: "action",
      key: "action",
      render: (text: any, record: any, index: any) => {
        return (
          <span className="w-0">
            <Button size="small" type="text">
              <RiDeleteBin5Line />
            </Button>
          </span>
        );
      },
      width: 1,
    },
  ];

  return (
    <Master>
      <aside>
        <div className="bg-slate-400 w-full h-20 flex">
          <Space wrap size={16}>
            <Avatar size={64} icon={<BiUser />} />
          </Space>
          <div className="p-4 flex-col">
            <b className="">{table.name}</b>
            <div>Số chổ ngồi: {table.seat}</div>
          </div>
        </div>
      </aside>
      <Divider />
      <div className="">
        <h2 className="text-2xl">Đơn đặt</h2>
        <div className="bg-white p-4 rounded-md">
          <Table columns={columns} dataSource={orders} />
        </div>
      </div>
    </Master>
  );
};

export default Order;
