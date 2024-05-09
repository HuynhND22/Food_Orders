import { Button, Card, Form, Input, Space, Table, Popconfirm, message, Modal, InputNumber, Select, Upload, DatePicker } from 'antd';
import React from 'react';
import { DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import numeral from 'numeral';
import axios from 'axios';
import { FieldType, PromotionDetail } from '../types/promotions/index'
import axiosClient from '../configs/axiosClient';
import { useRequest } from 'ahooks';
import {getDefaultDate} from '../constants/index'
type Props = {};
export default function Promotions({ }: Props) {
    const checkNameUnique = async (name: string) => {
        try {
            const res = await axiosClient.get(`/suppliers/check/unique?name=${name}`);
            console.log(res.data);
            return res.data.ok;
        } catch (error) {
            return false;
        }
    };
    const { data, run: checkNameUniqueDebounce } = useRequest(checkNameUnique, {
        debounceWait: 300,
        manual: true,
        cacheTime: 0,
    });
    const [promotions, setPromotions] = React.useState([]);
    const [status, setStatus] = React.useState([]);
    const [selectedPromotion, setSelectedPromotion] = React.useState<any>(null);
    const [createForm] = Form.useForm<FieldType>();
    const [updateForm] = Form.useForm<FieldType>();
    const getPromotions = async () => {
        try {
            const response = await axiosClient.get('/promotions/all');
            setPromotions(response.data);
        } catch (error) {
            console.log('Error:', error);
        }
    };

    const getStatus = async () => {
        try {
            const response = await axiosClient.get('/status/all');
            setStatus(response.data);
        } catch (error) {
            console.log('Error:', error);
        }
    };


    React.useEffect(() => {
        getPromotions();
        getStatus();

    }, []);

    const onFinish = async (values: any) => {
        try {
            console.log('Success:', values);
            const response = await axiosClient.post('/promotions/create', values);
            console.log(response.data);
            getPromotions();
            createForm.resetFields();
        } catch (error) {
            console.log('Error:', error);
        }
    };
    const onDelete = async (promotionId: number) => {
        try {
            await axiosClient.delete(`/promotions/remove${promotionId}`);
            getPromotions();
            message.success('Promotion deleted successfully!');
        } catch (error) {
            console.log('Error:', error);
        }
    };

    const onUpdate = async (values: any) => {
        try {
            console.log('Success:', values);
            await axiosClient.patch(`/promotions/update/${selectedPromotion.promotionId}`, values);
            getPromotions();
            setSelectedPromotion(null);
            message.success('Promotion updated successfully!');
        } catch (error) {
            console.log('Error:', error);
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '10%',
        },
        {
            title: 'Limit',
            dataIndex: 'discount',
            key: 'discount',
            width: '10%',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            width: '10%',
            render: (text: string, record: any, index: number) => {
                return <div style={{ textAlign: 'right' }}>{numeral(text).format('$0,0')}</div>;
            },
        },
        {
            title: 'Status',
            dataIndex: 'statusId',
            key: 'discount',
            width: '10%',
        },
        {
            title: 'PromotionDetails',
            dataIndex: 'promotionDetails',
            key: 'promotionDetails',
            children: [
                {
                    title: 'ProductSizeId',
                    dataIndex: 'productSizeId',
                    key: 'productSizeId',
                },
                {
                    title: 'Quantity',
                    dataIndex: 'quantity',
                    key: 'quantity',

                },
                {
                    title: 'description',
                    dataIndex: 'description',
                    key: 'description',
                },
            ],
        },

        {
            title: 'createAt',
            dataIndex: 'createAt',
            key: 'createAt',
            width: '10%',

        },
      
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            width: '10%',
            render: (text: any, record: any) => {
                return (
                    <Space size='small'>
                        <Button
                            type='primary'
                            icon={<EditOutlined />}
                            onClick={() => {
                                setSelectedPromotion(record);
                                updateForm.setFieldsValue(record);
                            }}
                        />

                        <Popconfirm
                            title='Delete the promotions'
                            description='Are you sure to promotion this promotion?'
                            onConfirm={() => {
                                onDelete(record._id);
                            }}
                        >
                            <Button type='primary' danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                    </Space>
                );
            },
        },
    ];
    return (
        <div style={{ padding: 36 }}>
            <Card title='Create new promotion' style={{ width: '100%' }}>
                <Form form={createForm} name='create-promotion' labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} initialValues={{ name: '', limit: '', price: '', startDate: '', endDate: '', createAt: '', updatedAt: '', deletedAt: '', promotionDetails: '' }} onFinish={onFinish}>
                    {/* input name */}
                    <Form.Item<FieldType>
                        label='Name' labelCol={{ span: 5 }}
                        name='name'
                        rules={[
                            { required: true, message: 'Please input name!' },
                            {
                                validator(rule, value, callback) {
                                    checkNameUniqueDebounce(value);
                                    console.log(data);
                                    if (data === true) {
                                        callback('Name must be unique!');
                                    } else {
                                        callback();
                                    }
                                },
                            },
                        ]}
                        hasFeedback
                    >
                        <Input />
                    </Form.Item>
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

                    {/* input limit */}
                    <Form.Item<FieldType> label='Limit' name='limit' rules={[{ required: true, type: 'number', min: 1 }]}>
                        <InputNumber />
                    </Form.Item>
                    {/* price*/}
                    <Form.Item<FieldType> label='Price' name='price' rules={[{ required: true, type: 'number', min: 1 }]}>
                        <InputNumber />
                    </Form.Item>
                    {/* list Promotion */}
                    <Form.List  name='promotionDetail'  >
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map((field, index) => (
                                        <Space key={field.key} style={{ display: '', marginBottom: 10 , }}  align='baseline'>
                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'productSizeId']}
                                                fieldKey={[field.fieldKey ?? index, 'productSizeId']} // Use index as fallback
                                                label='ProductSizeId'  labelCol={{ span: 18 }}
                                                
                                            >
                                                <Input />
                                            </Form.Item>
                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'quantity']}
                                                fieldKey={[field.fieldKey ?? index, 'quantity']} // Use index as fallback
                                                label='Quantity'  labelCol={{ span: 10 }}
                                                rules={[{  required: true,type: 'number', min: 1}]}
                                            >
                                                <InputNumber />
                                            </Form.Item>
                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'description']}
                                                fieldKey={[field.fieldKey ?? index, 'description']} // Use index as fallback
                                                label='Description'  labelCol={{ span: 10 }}
                                              
                                            >
                                                <Input />
                                            </Form.Item>
                                            <Button onClick={() => remove(field.name)}>Remove</Button>
                                        </Space>
                                    ))}
                                    <Form.Item   label=' PromotionDetails' labelCol={{ span: 5 }}  rules={[{ required: true, message: 'Please input Quantity!' }]} >
            
                                        <Button type='dashed' onClick={() => add()} block> + Add Promotion Detail</Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>

                   
                    {/* <Form.Item<FieldType> label='Start Date' name='startDate' rules={[{ required: true }]} hasFeedback>
                        <DatePicker />
                    </Form.Item>
                    {/* end Date*/}
                    {/* <Form.Item<FieldType> label='End Day' name='endDate' rules={[{ required: true }]} >
                        <DatePicker />
                    </Form.Item> */}
                    {/* button */}
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type='primary' htmlType='submit'>
                            Save changes
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
            <Card title='List of promotions' style={{ width: '100%', marginTop: 36 }}>
                <Table dataSource={promotions} columns={columns} />
            </Card>

            <Modal
                centered
                title='Edit promotion'
                open={selectedPromotion}
                okText='Save changes'
                onOk={() => {
                    updateForm.submit();
                }}
                onCancel={() => {
                    setSelectedPromotion(null);
                }}
            >
                <Form form={updateForm} name='update-promotion' labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} initialValues={{ name: '', description: '' }} onFinish={onUpdate}>
                    {/* input name */}
                    <Form.Item<FieldType>
                        label='Name' labelCol={{ span: 5 }}
                        name='name'
                        rules={[
                            { required: true, message: 'Please input name!' },
                            {
                                validator(rule, value, callback) {
                                    checkNameUniqueDebounce(value);
                                    console.log(data);
                                    if (data === true) {
                                        callback('Name must be unique!');
                                    } else {
                                        callback();
                                    }
                                },
                            },
                        ]}
                        hasFeedback
                    >
                        <Input />
                    </Form.Item>
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

                    {/* input limit */}
                    <Form.Item<FieldType> label='Limit' name='limit' rules={[{ required: true, type: 'number', min: 1 }]}>
                        <InputNumber />
                    </Form.Item>
                    {/* price*/}
                    <Form.Item<FieldType> label='Price' name='price' rules={[{ required: true, type: 'number', min: 1 }]}>
                        <InputNumber />
                    </Form.Item>
                     {/* list Promotion */}
                     <Form.List  name='promotionDetails'  >
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map((field, index) => (
                                        <Space key={field.key} style={{ display: '', marginBottom: 10 , }}  align='baseline'>
                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'productSizeId']}
                                                fieldKey={[field.fieldKey ?? index, 'productSizeId']} // Use index as fallback
                                                label='ProductSizeId'  labelCol={{ span: 18 }}
                                                
                                            >
                                                <Input />
                                            </Form.Item>
                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'quantity']}
                                                fieldKey={[field.fieldKey ?? index, 'quantity']} // Use index as fallback
                                                label='Quantity'  labelCol={{ span: 10 }}
                                                rules={[{ type: 'number', min: 1}]}
                                            >
                                                <InputNumber />
                                            </Form.Item>
                                            <Form.Item
                                                {...field}
                                                name={[field.name, 'description']}
                                                fieldKey={[field.fieldKey ?? index, 'description']} // Use index as fallback
                                                label='Description'  labelCol={{ span: 10 }}
                                              
                                            >
                                                <Input />
                                            </Form.Item>
                                            <Button onClick={() => remove(field.name)}>Remove</Button>
                                        </Space>
                                    ))}
                                    <Form.Item   label='Name' labelCol={{ span: 5 }}  rules={[{ required: true, message: 'Please input Quantity!' }]} >
            
                                        <Button type='dashed' onClick={() => add()} block> + Add Promotion Detail</Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    {/* Start Date*/}
                    <Form.Item<FieldType> label='Start Date' name='startDate' rules={[{ required: true }]} hasFeedback>
                        <DatePicker />
                    </Form.Item>
                    {/* end Date*/}
                    <Form.Item<FieldType> label='End Day' name='endDate'>
                        <DatePicker />
                    </Form.Item>
                    {/* CREAT AT */}
                    <Form.Item<FieldType> label='CreatedAt' name='createdAt'>
                        <DatePicker />
                    </Form.Item>
                
                </Form>
            </Modal>
        </div>
    );
}

