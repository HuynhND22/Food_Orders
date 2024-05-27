"use client";

import { Button, Drawer, FloatButton, InputNumber, Table } from "antd";
import React from "react";
import { BsCart } from "react-icons/bs";
import { RiDeleteBin5Line } from "react-icons/ri";
import { TiMinus, TiPlus } from "react-icons/ti";
import axiosClient from "../../../configs/axiosClient";

export default function Cart() {
  const [drawer, setDrawer] = React.useState(false);
  const [data, setData] = React.useState([]);
  const tmp: any = localStorage.getItem("table");
  const table = JSON.parse(tmp);
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
      // title: "",
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

  React.useEffect(() => {
    const getData = async () => {
      try {
        const response: any = await axiosClient.get(
          `/carts/id/${table.tableId}`
        );
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

        setData(filteredData);
      } catch (error) {
        console.log("Failed to fetch data: ", error);
      } finally {
        // setLoading(false);
      }
    };
    getData();
  }, []);

  return (
    <div>
      <FloatButton
        onClick={() => {
          setDrawer(true);
        }}
        icon={<BsCart />}
      />
      <Drawer title="Giỏ hàng" onClose={() => setDrawer(false)} open={drawer}>
        <div className="text-black">
          <Table
            dataSource={data}
            columns={columns}
            pagination={false}
            summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={2}>
                  <b>Tổng cộng</b>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3} className="">
                  {data.map((item: any) => {
                    return 0;
                  })}
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )}
          />
        </div>
        <div className="flex p-3">
          <Button
            type="primary"
            className="right-0 flex-grow"
            onClick={async () => {
              // console.log(filteredData);
            }}
          >
            Đặt món
          </Button>
        </div>
      </Drawer>
    </div>
  );
}
