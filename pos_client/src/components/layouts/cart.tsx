"use client";

import { Button, Drawer, FloatButton, InputNumber, Table, message, Segmented } from "antd";
import React from "react";
import { BsCart } from "react-icons/bs";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { TiMinus, TiPlus } from "react-icons/ti";
import axiosClient from "../../../configs/axiosClient";
import Cookies from "js-cookie";
import { debounce } from "lodash";

export default function Cart() {
  const [drawer, setDrawer] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [refresh, setRefresh] = React.useState(true);
  const [price, setPrice] = React.useState(0);
  const [payment, setPayment] = React.useState('Tiền mặt');
  const cookieStore: any = Cookies.get("table");
  const table: any = cookieStore ? JSON.parse(cookieStore) : null;
  const router = useRouter();

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
        return <ProductItem key={index} product={record} />;
      },
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      key: "price",
      render: (text: any, record: any, index: any) => {
        return (
          <div>
            <span>{record.price.toLocaleString("vi-VN", 0) + "đ"}</span>
            <span className="w-0">
            <Button size="small" type="text" onClick={()=>{
              axiosClient.patch(`/carts/update/${record.cartId}`, {quantity: 0})
              setRefresh(!refresh)
            }}>
              <RiDeleteBin5Line />
            </Button>
          </span>
          </div>
        )
      },
      width: '20%'
    }
  ];

  const getData = async () => {
    try {
      const response: any = await axiosClient.get(`/carts/id/${table.tableId}`);
      console.log(response.data);  
      const filteredData = response.data.map((item: any) => {
        const name = item.productSize
          ? item.productSize.product.name + ' ' + item.productSize.size.name
          : item.promotion.name;
        const price = item.promotion
          ? item.promotion.price * item.quantity
          : item.productSize.price *
            (1 - item.productSize.discount / 100) *
            item.quantity;
        return {
          cartId: item.cartId,
          name: name,
          quantity: item.quantity,
          price: price
        };
      });
      // console.log(filteredData);  
      setData(filteredData);

      const totalPrice = filteredData.reduce(
        (accumulator: any, currentValue: any) =>
          accumulator + currentValue.price,
        0
      );
      setPrice(totalPrice);
    } catch (error) {
      console.log("Failed to fetch data: ", error);
    } finally {
      // setLoading(false);
    }
  };

  React.useEffect(() => {
    getData();
  }, [refresh]);

const ProductItem = ({ product }: any) => {
    const [quantity, setQuantity] = React.useState(product.quantity);

    const handleIncrease = () => {
      if (quantity < 99) {
        setTimeout(() => {
          setRefresh(!refresh)
        }, 1000);
        setQuantity(quantity + 1);
      }
    };

    const handleDecrease = () => {
      if (quantity > 0) {
        setTimeout(() => {
          setRefresh(!refresh)
        }, 1000);
        setQuantity(quantity - 1);
      }
    };
    React.useEffect(() => {
      const updateCart = debounce(async () => {
        try {
          await axiosClient.patch(`/carts/update/${product.cartId}`, {
            quantity: quantity,
          });
        } catch (error) {
          console.log("Failed to fetch data: ", error);
        }
      }, 500);
      updateCart();
    });

    return (
      <span className="flex gap-1">
        <Button size="small" onClick={handleDecrease}>
          <TiMinus size={10} />
        </Button>
        <InputNumber
          onChange={(value:number | null) => {
            setQuantity(value)
            setTimeout(() => {
              setRefresh(!refresh)
            }, 1000);
          }}
          className="w-[40px]"
          min={0}
          max={99}
          size="small"
          value={quantity}
          type="number"
        />
        <Button size="small" onClick={handleIncrease}>
          <TiPlus size={10} />
        </Button>
      </span>
    );
  };

  const createOrder = async () => {
    try {
      // console.log({tableId: table.tableId, payment: payment});  
      const response = await axiosClient.post('/orders/create', {tableId: table.tableId, payment: payment})
      console.log(response.data);  
      message.success('Đặt món thành công!')
      router.push(`/orders/details/${response.data.orderId}`)
    } catch (error) {
      console.log(error);
      message.error('Đặt món thất bại')  
    }
  }

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
                  {price.toLocaleString("vi-VN") + "đ"}
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )}
          />
        </div>
        { data[0] &&
        <div>
          <div className='flex p-4 gap-4 justify-between'>
            <div className='font-bold'>
                Thanh toán:
            </div>
            <Segmented<string>
                options={['Tiền mặt', 'Ngân hàng']}
                onChange={(value:any) => {
                  setPayment(value)
                }}
              />
          </div>
          <div className="flex p-3">
            <Button
              type="primary"
              className="right-0 flex-grow"
              onClick={createOrder}
            >
              Đặt món
            </Button>
          </div>
        </div>
        }
      </Drawer>
    </div>
  );
}
