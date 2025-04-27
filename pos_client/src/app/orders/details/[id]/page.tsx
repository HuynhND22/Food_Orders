"use client";

import React, {useRef, useEffect} from "react";
import axiosClient from "../../../../../configs/axiosClient";
import { useRouter } from "next/navigation";
import {ShoppingCartOutlined, CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, CopyOutlined} from '@ant-design/icons';
import { Divider, ConfigProvider, message, notification, Table, Button, Modal, Image, Statistic, Tag, Tooltip } from "antd";
import Nav from "@/components/layouts/navMenu";
import withQRCode from "@/utils/withQRCode";
import Cookie from 'js-cookie'
import {io} from 'socket.io-client'

const { Countdown } = Statistic;


const Product = ({ params: { id } }: any) => {
  const [order, setOrder] = React.useState<any>([]);
  const [price, setPrice] = React.useState<any>(0);
  const [status, setStatus] = React.useState<any>(0);
  const [banks, setBanks] = React.useState<any>([]);
  const [quantity, setQuantity] = React.useState(1);
  const [modal, contextHolder] = Modal.useModal();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [open, setOpen] = React.useState<boolean>(false);

  const socketRef = useRef<any>(null);
  
  useEffect(() => {
    socketRef.current = io("http://phuctv.local:9999");
    socketRef.current.emit("join-session", 'paymentSessionId');

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.on("payment-success", () => {
      console.log("🟢 Nhận được webhook thanh toán thành công");
      message.success("Đã nhận thanh toán");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    });

    return () => {
      socket.off("payment-success");
    };
  }, [socketRef]);

  const getOrder = async () => {
    try {
      const response = await axiosClient.get(`/orders/id/${id}`);
      const totalPrice:any = await axiosClient.get(`/orders/total-price/${id}`);
      setOrder(response.data);
      // console.log('sđ', totalPrice)
      setPrice(totalPrice.data[0].calculatetotalprice)
      console.log(totalPrice.data[0].calculatetotalprice);  
    } catch (error) {
      console.log(error);
    }
  };

  const getBanks = async () => {
    try {
      const response = await axiosClient.get('/payments/banks/all')
      const activeAccounts = response.data.filter((item:any) => item.activate === '1');
      console.log('jygvsdc', activeAccounts)
      setBanks(activeAccounts[0])
    } catch (error) {
      console.log(error);  
    }
  }

  React.useEffect(() => {   
    getBanks();
    getOrder();
  }, []);

  const column = [
    {
      title: 'Tên món',
      key: 'name',
      render: (text:string, record:any) => {
        return (record.promotion ? record.promotion?.name : record.productSize?.product?.name + " " + record.productSize?.size?.name)
      }
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      // render: (text:string, record:any) => {
      //   return 
      // }
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      key: "price",
      render: (text: any, record: any, index: any) => {
        return <span>{record.price.toLocaleString("vi-VN", 0) + "đ"}</span>;
      },
    },
  ]

    const confirm = () => {
      modal.confirm({
        title: 'Xác nhận huỷ',
        centered: true,
        icon: <ExclamationCircleOutlined />,
        content: 'Bạn có chắc muốn huỷ đơn này?' ,
        okText: 'Xác nhận',
        cancelText: 'Đóng',
        onOk: async () => {
          try {
            await axiosClient.post(`/orders/cancel/${id}`)
            message.success('Đã huỷ đơn món!')
            getOrder()
          } catch (error) {
            message.error('Lỗi, không thể huỷ đơn món!')
            console.log(error);  
          }
        }
      });
    };
    let qrModal:any = undefined
    const QR = () => {
      qrModal = modal.info({
        centered: true,
        title: 'Quét mã hoặc nhập thông tin bên dưới để thanh toán',
        okText: 'Huỷ thanh toán',
        content: (
          <div>
          {
            <Image preview={false} src={`https://img.vietqr.io/image/tpbank-${banks.accountNumber}-compact2.jpg?amount=${price}&addInfo=${id}&accountName=${banks.author}`}/>
          }
          <div>
            Ngân hàng: <Tooltip title="copy" placement="right"><Tag onClick={() => {navigator.clipboard.writeText('Tiên phong - TPbank')}} icon={<CopyOutlined />} color='warning'>Tiên phong - TPbank</Tag> </Tooltip> 
          </div>
          <div>
            Người thụ hưởng: <Tooltip title="copy" placement="right"><Tag onClick={() => {navigator.clipboard.writeText(banks.author)}} icon={<CopyOutlined />} color='warning'>{banks.author}</Tag> </Tooltip>
          </div>
          <div>
            Số tài khoản: <Tooltip title="copy" placement="right"><Tag onClick={() => {navigator.clipboard.writeText(banks.accountNumber)}} icon={<CopyOutlined />} color='warning'>{banks.accountNumber}</Tag> </Tooltip>
          </div>
          <div>
            Số tiền: <Tooltip title="copy" placement="right"><Tag onClick={() => {navigator.clipboard.writeText(price)}} icon={<CopyOutlined />} color='warning'>{price.toLocaleString("vi-VN", 0)}đ</Tag> </Tooltip>
          </div>
          <div>
            Nội dung chuyển khoản: <Tooltip title="copy" placement="right"><Tag onClick={() => {navigator.clipboard.writeText(id)}} icon={<CopyOutlined />} color='warning'>{id}</Tag> </Tooltip>
          </div>
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <span>
              Hiệu lực trong: <Countdown value={Date.now() + 5 * 60 * 1000} />
            </span>
          </div>
          </div>
        ),
        onOk() {},
      });
    };

    const handlePayment = async () => {
      try{
        QR()
        await axiosClient.post(`/payments/handler/${id}`)
        // message.success('Thành công')
        // qrModal.destroy();
        // getOrder()
        
        setTimeout(() => {
          qrModal.destroy();
        }, 5 * 60 * 1000);

      }catch (error) {
        console.log(error);
        message.error('Thanh toán đang bị lỗi')
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
    <main className=" bg-[#F5F5F5] rounded-lg border-8 border-white-500 relative rounded-lg fixed left-0 right-0 top-0 bottom-0 text-slate-950 p-5 min-h-[900px]">
      <div className="text-center bg-[#ffba00] rounded-sm font-bold text-slate-950 py-3 text-white">Chi tiết đơn món</div>
      <div>
        <div className='py-5 font-bold'>
          Đơn món {order.orderId}
        </div>
        <div>
          <Table columns={column} dataSource={order?.orderDetails} pagination={false} summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={2}>
                  <b>Tổng cộng</b>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3} className="">
                  {price && price.toLocaleString("vi-VN", 0) + "đ"}
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )}/>
        </div>
        <Divider/>
        <div>
          <div className='font-bold'>
            Phương thức thanh toán
          </div>
          <div className='p-2'>
            {order.payment}
          </div>
        </div>
        <Divider/>
        <div>
          <div className='font-bold'>
            Trạng thái
          </div>
          <div className='p-2'>
            { order.status?.name }
          </div>
        </div>
        <Divider/>
        { order.status?.statusId == 10 &&
          <div>
            <div className='flex justify-center'>
              {order?.payment == 'Tiền mặt' ?  <p>Vui lòng chờ nhân viên để thực hiện thanh toán</p> : <Button onClick={handlePayment} type='primary'>Thanh toán ngay</Button>}
            </div>
            <Divider/>
            <div className='flex justify-center'> 
              <Button type='primary' block onClick={confirm}>Huỷ đơn</Button>  
            </div>
          </div>
        }
      </div>
    {contextHolder}
    <Modal
        title={<p>Thanh toán</p>}
        // loading={loading}
        open={open}
        onCancel={() => setOpen(false)}
        centered
      >
        
      </Modal>
      <Nav />
    </main>
      </ConfigProvider>
  );
};

export default withQRCode(Product);
