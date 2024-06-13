import { Button, Card, Form, Input, Space, Table, Popconfirm, message, Modal, InputNumber, Select, Upload, DatePicker, Divider, Tooltip, Radio } from 'antd';
import React from 'react';
import { DeleteOutlined, EditOutlined, UploadOutlined, MinusCircleOutlined,QuestionCircleOutlined,UndoOutlined } from '@ant-design/icons';
import numeral from 'numeral';
import axios from 'axios';
import { FieldType, PromotionDetail } from '../types/promotions/index'
import axiosClient from '../configs/axiosClient';
import { useRequest } from 'ahooks';
import {getDefaultDate} from '../helpers/getDate'
import dayjs from 'dayjs'
type Props = {};
export default function Promotions({ }: Props) {
    const { RangePicker } = DatePicker;
    const [promotions, setPromotions] = React.useState([]);
    const [status, setStatus] = React.useState([]);
    const [products, setProducts] = React.useState([]);
    const [sizes, setSizes] = React.useState<any>([]);
    const [duration, setDuration] = React.useState<any>([]);
    const [selectedPromotion, setSelectedPromotion] = React.useState<any>(null);
    const [createForm] = Form.useForm<FieldType>();
    const [updateForm] = Form.useForm<FieldType>();
    const [deleted, setDeleted] = React.useState('all');

    React.useEffect(() => {
      if (updateForm && updateForm.getFieldValue('promotionDetails')) {
        const productIds = updateForm.getFieldValue('promotionDetails').map((detail:any) => detail.productSize.productId);

        // Set values for productId
        updateForm.setFieldsValue({
          'promotionDetails': updateForm.getFieldValue('promotionDetails').map((detail:any, index:number) => ({
            ...detail,
            productId: productIds[index]
          }))
        });
      }
    }, [updateForm]);


    const getPromotions = async () => {
        try {
            const response = await axiosClient.get(`/promotions/${deleted}`);
            setPromotions(response.data);
        } catch (error) {
            console.log('Error:', error);
        }
    };

    const getStatus = async () => {
        try {
            const response = await axiosClient.get('/status/promotions');
            setStatus(response.data);
        } catch (error) {
            console.log('Error:', error);
        }
    };
    const getProducts = async () => {
        try {
            const response = await axiosClient.get('/products/all');
            setProducts(response.data);
        } catch (error) {
            console.log('Error:', error);
        }
    };

    React.useEffect(() => {
        getProducts()
        getPromotions();
        getStatus();
    }, [deleted]);

    const onFinish = async (values: any) => {
        console.log(values);  
        // try {
        //     console.log('Success:', values);
        //     const response = await axiosClient.post('/promotions/create', values);
        //     console.log(response.data);
        //     getPromotions();
        //     createForm.resetFields();
        // } catch (error) {
        //     console.log('Error:', error);
        // }
    };

    const onUpdate = async (values: any) => {
        try {
            console.log('Success:', values);
            await axiosClient.patch(`/promotions/update/${selectedPromotion.promotionId}`, values);
            getPromotions();
            setSelectedPromotion(null);
            message.success('Cập nhật thành công!');
        } catch (error) {
            console.log('Error:', error);
        }
    };


  const handleRemove = async (promotions: number) => {
    try {
      await axiosClient.delete(`/promotions/remove/${promotions}`);
      getPromotions();
      message.success('Đã xóa!');
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const handleDelete = async (promotions: number) => {
    try {
      await axiosClient.delete(`/promotions/delete/${promotions}`);
      getPromotions();
      message.success('Đã xóa!')
    } catch (error) {
      message.error('Thao tác thất bại!')
      console.log(error);
    }
  }

  const handleRestore  = async (promotions: number) => {
    try {
      await axiosClient.post(`/promotions/restore/${promotions}`)
      getPromotions();
      message.success('Khôi phục thành công!')
    } catch (error) {
      console.log(error);
      message.error('Thao tác thất bại!')
    }
  }    

    const columns = [
        {
            title: 'Tên khuyến mãi',
            dataIndex: 'name',
            key: 'name',
            width: '10%',
        },
        {
            title: 'Giới hạn sử dụng',
            dataIndex: 'limit',
            key: 'limit',
            width: '10%',
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            width: '5%',
            render: (text: string, record: any, index: number) => {
                return <div style={{ textAlign: 'right' }}>{numeral(text).format('0,0')}đ</div>;
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'statusId',
            key: 'status',
            width: '10%',
            render: (text:string, record:any) => {
                return status.map((value:any)=>{
                    return value.statusId == record.statusId ? value.name : null
                })
            }
        },
        {
            title: 'Chi tiết',
            dataIndex: 'Chi tiết',
            key: 'promotionDetails',
            children: [
                {
                    title: 'Món',
                    key: 'productSizeId',
                    render: (text:string, record:any)=>{
                        return record?.promotionDetails.map((value:any, index:number)=>{
                            return <div key={index}>{`[${value.quantity}]${value.productSize?.product.name}[${value.productSize?.size.name}]`}</div>
                        })
                    },
                    width: '20%'
                },
                {
                    title: 'Ghi chú',
                    dataIndex: 'description',
                    key: 'description',
                    render: (text:string, record:any)=>{
                        return record?.promotionDetails.map((value:any, index:number)=>{
                            return <div key={index}>{value.description}</div>
                        })
                    },
                    withd: '50%'
                },
            ],
            with: '10%'
        },
        {
          title: deleted === 'all' ? 'Ngày tạo - Cập nhật gần nhất' : 'Ngày xoá',
          key: 'createdAt',
          render: (text: any, record: any) => {
            if (deleted == 'all') {
              return <span>{dayjs(record.createdAt).format( 'HH:mm DD/MM/YYYY')} - {dayjs(record.updatedAt).format( 'HH:mm DD/MM/YYYY')}</span>
            } else {
              return <span>{dayjs(record.deletedAt).format( 'HH:mm DD/MM/YYYY')}</span>
            }
          }
        },
          {
          title: 'Actions',
          dataIndex: 'actions',
          key: 'actions',
          width: '1%',
          render: (text: any, record: any) => {
            if (deleted == 'all') {
              return (
                  <Space size='small'>
                    <Tooltip title="Chỉnh sửa">
                      <Button
                          type='primary'
                          icon={<EditOutlined />}
                          onClick={() => {
                            setSelectedPromotion(record);
                            updateForm.setFieldsValue(record);
                            updateForm.setFieldValue('productId', 123)
                          }}
                      />
                    </Tooltip>
                    <Tooltip title='Xóa'>
                        <Button type='primary' danger icon={<DeleteOutlined />} onClick={()=>handleRemove(record.promotionId)} />
                    </Tooltip>
                  </Space>
              );
            } else if (deleted == 'deleted') {
              return (
                  <Space size='small'>
                    <Tooltip title="Khôi phục">
                      <Button
                          type='primary'
                          icon={<UndoOutlined />}
                          onClick={() => handleRestore(record.promotionId)}
                      />
                    </Tooltip>
                    <Tooltip title='Xóa Vĩnh viễn'>
                      <Popconfirm
                          title='Chắc chắn muốn xóa vĩnh viễn?'
                          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                          onConfirm={() => {
                            handleDelete(record.promotionId);
                          }}
                      >
                        <Button type='primary' danger icon={<DeleteOutlined />} />
                      </Popconfirm>
                    </Tooltip>
                  </Space>
              )
            }

          },
        },
    ];
    return (
        <div style={{ padding: 36 }}>
            <Card title='Thêm mới Khuyến mãi' style={{ width: '100%' }}>
                <Form form={createForm} name='create-promotion' labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} initialValues={{ name: '', limit: '', price: '', startDate: '', endDate: '', createAt: '', updatedAt: '', deletedAt: '', promotionDetails: '' }} onFinish={onFinish}>
                    {/* input name */}
                    <Form.Item<FieldType>
                        label='Tên khuyến mãi' labelCol={{ span: 5 }}
                        name='name'
                        rules={[
                            { required: true, message: 'Tên khuyến mãi là bắt buộc!' },
                            {
                                validator(rule, value, callback) {
                                    callback()
                                    // checkNameUniqueDebounce(value);
                                    // console.log(data);
                                    // if (data === true) {
                                    //     callback('Name must be unique!');
                                    // } else {
                                    //     callback();
                                    // }
                                },
                            },
                        ]}
                        hasFeedback
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<FieldType> name='statusId' label='Trạng thái' rules={[{ required: true }]} hasFeedback>
                        <Select
                            options={status.map((item: any) => {
                                return {
                                    key: item.statusId,
                                    label: item.name,
                                    value: item.statusId,
                                };
                            })}
                        />
                    </Form.Item>

                    {/* input limit */}
                    <Form.Item<FieldType> label='Limit' name='limit' rules={[{ required: true, type: 'number', min: 1 }]}>
                        <InputNumber />
                    </Form.Item>
                    {/* price*/}
                    <Form.Item<FieldType> label='Price' name='price' rules={[{ required: true, type: 'number', min: 1 }]}>
                        <InputNumber suffix={'đ'} />
                    </Form.Item>
                    <Form.Item label='Thời gian' name='duration' rules={[{required:true, message: 'Thời hạn là bắt buộc!'}]} >
                        <RangePicker onChange={(dates, dateString)=>{
                            setDuration(dateString)
                        }} />    
                    </Form.Item>
                    {/* list Promotion */}
                    <Divider/>
                    <Form.List  name='promotionDetail' >
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map((field, index) => (
                                        <Space key={field.key} style={{ display: 'flex', gap:50, marginBottom: 10 , paddingLeft: 220 }}  align='baseline'>
                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'productId']}
                                                fieldKey={[field.fieldKey ?? index, 'productId']} // Use index as fallback
                                                label='Sản phẩm'  labelCol={{ span: 12 }}
                                                rules={[{required:true, message:'Món là bắt buộc!'}]}
                                            >
                                               <Select
                                                   onChange={(value, object:any)=>{
                                                       setSizes(object?.productSizes)
                                                       console.log(object.productSizes);
                                                   }}
                                                   style={{minWidth: 150}}
                                                    options={products.map((item: any) => {
                                                        return {
                                                            label: item.name,
                                                            value: item.productId,
                                                            productSizes: item.productSizes,
                                                            key: item.productId
                                                        };
                                                    })}
                                                />
                                            </Form.Item>
                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'productSizeId']}
                                                fieldKey={[field.fieldKey ?? index, 'productSizeId']} // Use index as fallback
                                                label='Size'  labelCol={{ span: 8 }}
                                                  rules={[{required: true, message: 'Size là bắt buộc!'}]}
                                            >
                                               <Select
                                                   style={{minWidth: 150}}
                                                    options={sizes?.map((item: any) => {
                                                        return {
                                                            key: item.size?.sizeId,
                                                            label: `${item.size?.name}[${numeral(item.price).format('0,0')}đ]`,
                                                            value: item.productSizeId,
                                                        };
                                                    })}
                                                />
                                            </Form.Item>
                                              <Form.Item
                                                {...field}
                                                name={[field.name, 'quantity']}
                                                fieldKey={[field.fieldKey ?? index, 'quantity']} // Use index as fallback
                                                label='Quantity'  labelCol={{ span: 40 }}
                                                rules={[{  required: true, message:'Số lượng là bắt buộc!', type: 'number', min: 1}]}
                                            >
                                                <InputNumber />
                                            </Form.Item>
                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'description']}
                                                fieldKey={[field.fieldKey ?? index, 'description']} // Use index as fallback
                                                label='Ghi chú'  labelCol={{ span: 5 }}
                                              
                                            >
                                                <Input />
                                            </Form.Item>
                                            <Button onClick={() => remove(field.name)}><MinusCircleOutlined/></Button>
                                        </Space>
                                    ))}
                                    <Form.Item   label='Chi tiết'>
                                        <Button type='dashed' onClick={() => add()} block> + Thêm chi tiết khuyến mãi</Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                        <Divider/>
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type='primary' htmlType='submit'>
                            Thêm mới
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
            <Card title={
                    <Space>
                      Danh sách khuyến mãi
                      <Radio.Group value={deleted} onChange={(e) => setDeleted(e.target.value)}>
                        <Radio.Button style={{color: '#1677FF'}} value="all">Đang hoạt động</Radio.Button>
                        <Radio.Button style={{color: 'red'}} value="deleted">Đã xóa</Radio.Button>
                      </Radio.Group>
                    </Space>
                  } style={{ width: '100%', marginTop: 36 }}>
                <Table dataSource={promotions} columns={columns} />
            </Card>

            <Modal
                centered
                title='Chỉnh sửa khuyến mãi'
                open={selectedPromotion}
                okText='Cập nhật'
                onOk={() => {
                    updateForm.submit();
                }}
                width={1000}
                onCancel={() => {
                    setSelectedPromotion(null);
                }}
            >
                <Form form={updateForm} name='update-promotion' wrapperCol={{ span: 20 }} initialValues={{ productId: 1118, description: '' }} onFinish={onUpdate}>
                    {/* input name */}
                    <Form.Item<FieldType>
                        labelCol={{ span: 4 }}
                        label='Tên khuyến mãi'
                        name='name'
                        rules={[
                            { required: true, message: 'Tên là bắt buộc!' },
                            {
                                validator(rule, value, callback) {
                                    // checkNameUniqueDebounce(value);
                                    // console.log(data);
                                    // if (data === true) {
                                    //     callback('Name must be unique!');
                                    // } else {
                                    //     callback();
                                    // }
                                },
                            },
                        ]}
                        hasFeedback
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<FieldType> name='statusId' label='Trạng thái' labelCol={{ span: 4 }} rules={[{ required: true }]} hasFeedback>
                        <Select
                            options={status.map((item: any) => {
                                return {
                                    label: item.name,
                                    value: item.statusId,
                                    key: item.statusId
                                };
                            })}
                        />
                    </Form.Item>

                    {/* input limit */}
                    <Form.Item<FieldType> label='Giới hạn' labelCol={{ span: 4 }} name='limit' rules={[{ required: true, type: 'number', min: 1 }]}>
                        <InputNumber />
                    </Form.Item>
                    {/* price*/}
                    <Form.Item<FieldType> label='Giá' labelCol={{ span: 4 }} name='price' rules={[{ required: true, type: 'number', min: 1 }]}>
                        <InputNumber suffix={'đ'} />
                    </Form.Item>
                     {/* list Promotion */}
                     <Form.List  name='promotionDetails' >
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map((field, index) => (
                                        <Space key={field.key} style={{ display: 'flex', marginBottom: 10 , paddingLeft:40}}  align='baseline'>
                                            <div key={field.key}>
                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'productId']}
                                                fieldKey={[field.fieldKey ?? index, 'productId']} // Use index as fallback
                                                label='Món'  
                                            >
                                                <Select
                                                    defaultValue={(value:any)=>{
                                                        updateForm.getFieldValue('promotionDetails').map((value:any)=>{
                                                            return value.productSize.productId
                                                        })
                                                    }}
                                                    onChange={(value, object:any)=>{
                                                        console.log(field);
                                                        // console.log(selectedPromotion)
                                                        setSizes(object?.productSizes)
                                                       // console.log(object.productSizes);
                                                    }}
                                                    style={{minWidth: 150}}
                                                    options={products.map((item: any) => {
                                                        return {
                                                            label: item.name,
                                                            value: item.productId,
                                                            productSizes: item.productSizes,
                                                            key: item.productId
                                                        };
                                                    })}
                                                />
                                            </Form.Item>
                                            </div>
                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'sizeId']}
                                                fieldKey={[field.fieldKey ?? index, 'sizeId']} // Use index as fallback
                                                label='Size'
                                                // labelCol={{span: 18}}
                                            >
                                                <Select
                                                   onChange={(value, object:any)=>{
                                                       setSizes(object?.productSizes)
                                                       console.log(updateForm.getFieldsValue());
                                                   }}
                                                   style={{minWidth: 150}}
                                                    options={sizes.map((item: any) => {
                                                        return {
                                                            label: item.name,
                                                            value: item.productId,
                                                            productSizes: item.productSizes,
                                                            key: item.productId
                                                        };
                                                    })}
                                                />
                                            </Form.Item>
                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'quantity']}
                                                fieldKey={[field.fieldKey ?? index, 'quantity']} // Use index as fallback
                                                label='Số lượng'
                                                rules={[{ type: 'number', min: 1}]}
                                            >
                                                <InputNumber />
                                            </Form.Item>
                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'description']}
                                                fieldKey={[field.fieldKey ?? index, 'description']} // Use index as fallback
                                                label='Ghi chú'                                              
                                            >
                                                <Input />
                                            </Form.Item>
                                            <Button onClick={() => remove(field.name)}><MinusCircleOutlined/></Button>
                                        </Space>
                                    ))}
                                    <Form.Item   label='Chi tiết' labelCol={{span: 4}} rules={[{ required: true, message: 'Please input Quantity!' }]} >
            
                                        <Button type='dashed' onClick={() => add()} block> + Thêm mới</Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                </Form>
            </Modal>
        </div>
    );
}

