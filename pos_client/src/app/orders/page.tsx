"use client";

import React from "react";
import Master from "../../components/layouts/master";
import { Avatar, Button, Divider, InputNumber, Space, Table } from "antd";
import { BiUser } from "react-icons/bi";
import { TiMinus, TiPlus } from "react-icons/ti";
import { RiDeleteBin5Line } from "react-icons/ri";
import axiosClient from "../../../configs/axiosClient";
import withQRCode from "@/utils/withQRCode";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import dayjs from 'dayjs'

const Order = () => {
  const router = useRouter();
  const tmp: any = Cookies.get("table");
  const table = tmp ? JSON.parse(tmp) : null;
  const [orders, setOrders] = React.useState([]);
  const [status, setStatus] = React.useState([]);

  React.useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await axiosClient.get(`/orders/table/${table.tableId}`);
        setOrders(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getOrders();

    const getStatus = async () => {
      try {
        const response = await axiosClient.get('/status/orders')
        setStatus(response.data)
      } catch (error) {
        console.log(error);  
      }
    }
    getStatus()

  }, []);

  const columns = [
    {
      title: "Đơn món",
      dataIndex: "orderId",
      key: "name",
    },
    {
      title: "Trạng thái",
      dataIndex: "statusId",
      key: "statusId",
      render: (text: any, record: any, index: any) => {
        return (
          <span>
        {status?.map((value:any) => {
          if(value.statusId == record.statusId) return value.name
        })}
        </span>
        )
      },
    },
    {
      title: "Ngày đặt",
      key: "createdAt",
      render: (text:string, record:any) => {
        return dayjs(record.createdAt).format('hh:mm DD/MM/YYYY')
      }
    }
  ];

  const onRowClick = (record: any) => {
  return {
    onClick: () => {
      router.push(`/orders/details/${record.orderId}`)
    },
  };
};

  return (
    <Master>
      <aside>
        <div className="bg-slate-400 w-full h-20 flex">
          <Space wrap size={16}>
            <Avatar size={64} icon={<BiUser />} />
          </Space>
          <div className="p-4 flex-col">
            {table?.name && <b className="">{table?.name}</b>}
            <div>Số chổ ngồi: {table?.seat}</div>
          </div>
        </div>
      </aside>
      <Divider />
      <div className="">
        <h2 className="text-2xl">Đơn đặt</h2>
        <div className="bg-white p-4 rounded-md">
          <Table columns={columns} dataSource={orders} onRow={onRowClick} rowClassName={() => 'hover:bg-gray-300'}/>
        </div>
      </div>
    </Master>
  );
};

export default withQRCode(Order);
