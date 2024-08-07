import { Button, Card, DatePicker, Form, Input, Modal, Popconfirm, Select, Space, Table, TableColumnsType, message, Upload, Cascader } from 'antd';
import React from 'react';
import { DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { CalendarOutlined, FolderAddOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import numeral from 'numeral';
import { Link } from 'react-router-dom';
import { InputNumber, Radio } from 'antd'; // Example import assuming InputNumber is from Ant Design library
import { table } from 'console';
import axiosClient from '../configs/axiosClient';
import { FieldType } from '../types/orders/index';
import dayjs from 'dayjs';

type Props = {};
export default function Order({ }: Props) {
  const [createForm] = Form.useForm<FieldType>();
  const [updateForm] = Form.useForm<FieldType>();
  const [orders, setOrders] = React.useState([]);
  const [selectedOrder, setSelectedOrder] = React.useState<any>(null);
  // Search products
  const [products, setProducts] = React.useState([]);
  // Selected products
  const [selectedProducts, setSelectedProducts] = React.useState<any[]>([]);
  const [tables, setTables] = React.useState<FieldType[]>([]);
  const [status, setStatus] = React.useState<FieldType[]>([]);
  const [users, setUsers] = React.useState<FieldType[]>([]);
  const [promotions, setPromotions] = React.useState<FieldType[]>([]);
  //get oder
  const getOrders = async () => {
    try {
      const response = await axiosClient.get('/orders/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      console.log(response.data);  
      setOrders(response.data);
    } catch (error) {
      console.log('Error:', error);
    }
  };
  //get orderDetails
  const getOrderDetails = async () => {
    try {
      const response = await axiosClient.get('/orders/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setPromotions(response.data);
    } catch (error) {
      console.log('Error:', error);
    }
  };
  //get status
  const getStatus = async () => {
    try {
      const response = await axiosClient.get('/status/orders', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setStatus(response.data);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  React.useEffect(() => {
    getStatus();
    getOrders();
  }, []);
  //create new order
  const onFinish = async (values: FieldType) => {
    try {
      console.log('Success:', values);
      await axiosClient.post('/orders/create', values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      getOrders();
      createForm.resetFields();
      message.success('Create order successfully!');
    } catch (error) {
      console.log('Error:', error);
    }
  };
  // delete order
  const onDelete = async (orderId: number) => {
    try {
      await axiosClient.delete(`/orders/remove/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      getOrders();
      message.success('Order deleted successfully!');
    } catch (error) {
      console.log('Error:', error);
    }
  };
  //update order
  const onUpdate = async (values: any) => {
    try {
      console.log('Success:', values);
      await axiosClient.patch(`/orders/update/${selectedOrder.orderId}`, values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      getOrders();
      setSelectedOrder(null);
      message.success('Order updated successfully!');
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const updateStatus = async (orderId:number, statusId: number) => {
    try {
      await axiosClient.patch(`/orders/update/status/${orderId}`, {statusId: statusId}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      message.success('Cập nhật thành công')
      getOrders()
    } catch (error) {
      console.log(error);  
      message.error('Lỗi, không thể cập nhật trạng thái')
    }
  }

  //create table
  const columns = [
    {
      title: 'ID',
      dataIndex: 'orderId',
      key: 'orderId',
      width: '1%',
    },{
      title: 'Bàn',
      dataIndex: 'tableId',
      key: 'table',
      width: '10%',
      render: (text:string, record:any) => {
          return record.table.name
      }
    },
    {
      title: 'Thanh toán',
      dataIndex: 'payment',
      key: 'payment',
      width: '10%',
    },
    {
      title: 'Nhân viên',
      dataIndex: 'user',
      key: 'user',
      width: '10%',
    },
    {
      title: 'Chi tiết',
      dataIndex: 'orderDetails',
      key: 'orderDetails',
      children: [
        {
          title: 'Món',
          key: 'productSizeId',
          render: (text:string, record:any) => {
            return <div>
              {record.orderDetails.map((item:any) => {
                return <div>{item.promotion?.name ?? item.productSize?.product?.name + ` [${item.productSize?.size?.name}]`}</div>
              })}
            </div>
          },
          width: '10%'
        },
        {
          title: 'Số lượng',
          key: 'quantity',
          render: (text:string, record:any) => {
          return <div>
              {record.orderDetails.map((item:any) => {
                return <div>{item.quantity}</div>
              })}
            </div>
          },
          width: '6%'
        },
        {
          title: 'Giá',
          dataIndex: 'price',
          key: 'price',
          width: '1%',
          render: (text:string, record:any) => {
          return <div>
            {record.orderDetails.map((item:any) => {
              return <div>{numeral(item.price).format('0,0')}đ</div>
            })}
          </div>
          }
        },
      ],
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: '30%',
      render: (text:string, record:any) => {
          return (<Radio.Group defaultValue={record.status.statusId} disabled={record.status.statusId == 12 || record.status.statusId == 13} size="small" onChange={(value:any) => updateStatus(record.orderId, value.target.value)}>
            {status.map((value:any) => {
              return <Radio.Button value={value.statusId}>{value.name}</Radio.Button>
            })}
          </Radio.Group>)
        // record.status.name
      }
    },
    {
      title: 'Ngày tạo - cập nhật gần nhất',
      key: 'createdAt',
      render: (text: any, record: any) => {
        
          return <span>{dayjs(record.createdAt).format( 'HH:mm DD/MM/YYYY')} - {dayjs(record.updatedAt).format( 'HH:mm DD/MM/YYYY')}</span>
      },
      width: '10$'
    },
    // {
    //   title: 'Thao tác',
    //   dataIndex: 'actions',
    //   key: 'actions',
    //   width: '10%',
    //   render: (text: any, record: any) => {
    //     return (
    //       <Space size='small'>
    //         <Button
    //           type='primary'
    //           icon={<EditOutlined />}
    //           disabled={record.statusId == 12 || record.statusId == 13}
    //           onClick={() => {
    //             setSelectedOrder(record);
    //             updateForm.setFieldsValue(record);
    //           }}
    //         />
    //         <Popconfirm
    //           title='Xoá đơn đặt món'
    //           description='Bạn có chắc muốn xoá?'
    //           onConfirm={() => {
    //             onDelete(record.orderId);
    //           }}
    //         >
    //           <Button type='primary' danger icon={<DeleteOutlined />} />
    //         </Popconfirm>
    //       </Space>
    //     );
    //   },
    // },
  ];

const options = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
      },
    ],
  },
];



  return (
    <div style={{ padding: 36 }}>
      {/* listOrder */}
      <Card title='Danh sách đơn đặt món' style={{ width: '100%', marginTop: 36 }}>
        <Table dataSource={orders} columns={columns} />
      </Card>

      <Modal
        width={1200}
        centered
        title='Edit product'
        open={selectedOrder}
        okText='Save changes'
        onOk={() => {
          updateForm.submit();
        }}
        onCancel={() => {
          setSelectedOrder(null);
        }}
      >
        <Form form={updateForm} name='update-order' labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} initialValues={{ tableId: '', description: '', createAt: '', statusId: '', userId: '', payment: '', updatedAt: '', productSizeId: '', deletedAt: '', discount: '', price: '', quantity: '', orderDetails: '' }} onFinish={onUpdate}>
          <Form.Item<FieldType> name='tableId' label='Table' rules={[{ required: true }]} hasFeedback>
            <Select
              options={tables.map((item: any) => {
                return {
                  label: item.name,
                  value: item.tableId,
                };
              })}
            />
          </Form.Item>
          {/* userId */}
          <Form.Item<FieldType> name='userId' label='User' rules={[{ required: true }]} hasFeedback>
            <Select
              options={users.map((item: any) => {
                const fullName = `${item.firstName} ${item.lastName}`;
                return {
                  label: fullName,
                  value: item.userId,
                };
              })}
            />

          </Form.Item>
          {/* statusId */}
          <Form.Item<FieldType> name='statusId' label='Status' rules={[{ required: true }]} hasFeedback>
            <Select
              options={status.map((item: any) => {
                return {
                  label: item.name,
                  value: item.statusId,
                };
              })}
            />
          </Form.Item>
          {/* payment */}
          <Form.Item<FieldType> name='payment' label='payment' rules={[{ required: true }]} hasFeedback>
            <Select
              options={[
                { label: 'Tiền mặt', value: 'Tiền mặt' },
                { label: 'Ngân hàng', value: 'Ngân hàng' },
              ]}
            />
          </Form.Item>
          {/* order */}
          <Form.List name='orderDetails'  >
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Space key={field.key} style={{ display: '', marginBottom: 10, }} align='baseline' >
                    <Form.Item
                      {...field}
                      name={[field.name, 'productSizeId']}
                      fieldKey={[field.fieldKey ?? index, 'productSizeId']} // Use index as fallback
                      label='ProductSizeId' labelCol={{ span: 18 }} 
                      rules={[{ required: true }]}
                    >
                      <Cascader options={options}/>
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, 'quantity']}
                      fieldKey={[field.fieldKey ?? index, 'quantity']} // Use index as fallback
                      label='Quantity' labelCol={{ span: 10 }}
                      rules={[{ required: true, type: 'number', min: 1 }]}
                    >
                      <InputNumber />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, 'price']}
                      fieldKey={[field.fieldKey ?? index, 'price']} // Use index as fallback
                      label='price' labelCol={{ span: 10 }}
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, 'discount']}
                      fieldKey={[field.fieldKey ?? index, 'discount']} // Use index as fallback
                      label='discount' labelCol={{ span: 10 }}
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, 'description']}
                      fieldKey={[field.fieldKey ?? index, 'description']} // Use index as fallback
                      label='description' labelCol={{ span: 10 }}

                    >
                      <Input />
                    </Form.Item>
                    <Button onClick={() => remove(field.name)}>Remove</Button>
                  </Space>
                ))}
                <Form.Item label=' Order Details' labelCol={{ span: 5 }} rules={[{ required: true, message: 'Please input Quantity!' }]} >

                  <Button type='dashed' onClick={() => add()} block> + Add Order Detail</Button>
                </Form.Item>
              </>
            )}
          </Form.List>          
        </Form>

      </Modal>
    </div >
  );
}

