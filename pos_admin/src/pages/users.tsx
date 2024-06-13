import { Button, Card, Form, Input, Space, Table, Popconfirm, message, Modal, InputNumber, Select, Upload, DatePicker } from 'antd';
import React from 'react';
import { DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import numeral from 'numeral';
import axios from 'axios';
import { FieldType } from '../types/users/index'
import axiosClient from '../configs/axiosClient';
import { useRequest } from 'ahooks';
import { getDefaultDate } from '../helpers/getDate'
type Props = {};
export default function Users({ }: Props) {
    const checkNameUnique = async (name: string) => {
        try {
            const res = await axiosClient.get(`/users/check/unique?name=${name}`);
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
    const [users, setUsers] = React.useState([]);
    const [status, setStatus] = React.useState([]);
    const [wards, setWards] = React.useState([]);
    const [selectedUser, setSelectedUser] = React.useState<any>(null);
    const [createForm] = Form.useForm<FieldType>();
    const [updateForm] = Form.useForm<FieldType>();
    //get data users
    const getUsers = async () => {
        try {
            const response = await axiosClient.get('/users/all');
            setUsers(response.data);
        } catch (error) {
            console.log('Error:', error);
        }
    };
    //get data status
    const getStatus = async () => {
        try {
            const response = await axiosClient.get('/status/all');
            setStatus(response.data);
        } catch (error) {
            console.log('Error:', error);
        }
    };
    //get data wards
    const getWards = async () => {
        try {
            const response = await axiosClient.get('/wards/all');
            setStatus(response.data);
        } catch (error) {
            console.log('Error:', error);
        }
    };


    React.useEffect(() => {
        getUsers();
        getStatus();
        getWards();

    }, []);
    // onfinish
    const onFinish = async (values: any) => {
        try {
            console.log('Success:', values);
            const response = await axiosClient.post('/users/create', values);
            console.log(response.data);
            getUsers();
            createForm.resetFields();
        } catch (error) {
            console.log('Error:', error);
        }
    };
    const onDelete = async (userId: number) => {
        try {
            await axiosClient.delete(`/users/remove${userId}`);
            getUsers();
            message.success('User deleted successfully!');
        } catch (error) {
            console.log('Error:', error);
        }
    };

    const onUpdate = async (values: any) => {
        try {
            console.log('Success:', values);
            await axiosClient.patch(`/promotions/update/${selectedUser.userId}`, values);
            getUsers();
            setSelectedUser(null);
            message.success('  User updated successfully!');
        } catch (error) {
            console.log('Error:', error);
        }
    };
    const columns = [
        {
            title: 'User_Id',
            dataIndex: 'userId',
            key: 'userId',
            width: '10%',
        },
        {
            title: 'FullName',
            dataIndex: 'fullName',
            key: 'fullName',
            width: '10%',
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
            width: '10%',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: '10%',
        },
        {
            title: 'Phone_Number',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            width: '10%',
        },

        {
            title: 'Status',
            dataIndex: 'statusId',
            key: 'statusId',
            width: '10%',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'wardId',
            width: '10%',
        },
        {
            title: 'CreatedAt',
            dataIndex: 'createdAt',
            key: 'createdAt',
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
                                setSelectedUser(record);
                                updateForm.setFieldsValue(record);
                            }}
                        />

                        <Popconfirm
                            title='Delete the user'
                            description='Are you sure to delete user?'
                            onConfirm={() => {
                                onDelete(record.userId);
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
            <Card title='Create new user' style={{ width: '100%' }}>
                <Form form={createForm} name='create-user' labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} initialValues={{ firstName: '', lastName: '', email: '', statusId: '', gender: '', createAt: '', role: '',phoneNumber:'' }} onFinish={onFinish}>
                    {/* input name */}
                    <Form.Item<FieldType>
                        label='First Name' labelCol={{ span: 5 }}
                        name='firstName'
                        rules={[
                            { required: true, message: 'Please input firstName!' },
                        ]}
                        hasFeedback
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label='Last Name' labelCol={{ span: 5 }}
                        name='lastName'
                        rules={[
                            { required: true, message: 'Please input lastName!' },
                        ]}
                        hasFeedback
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label='Email'
                        labelCol={{ span: 5 }}
                        name='email'
                        rules={[
                            { required: true, message: 'Please input email!' },
                            { type: 'email', message: 'Please enter a valid email address!' }, // Rule to check if it's a valid email
                        ]}
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
                    <Form.Item<FieldType> name='gender' label='Gender' rules={[{ required: true }]} hasFeedback>
                        <Select
                            options={[
                                { label: 'Nam', value: 'Nữ' },
                                { label: 'Nữ', value: 'Nữ' },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item<FieldType> name='role' label='Role' rules={[{ required: true }]} hasFeedback>
                        <Select
                            options={[
                                { label: 'Nhân viên', value: 'Nhân viên' },
                                { label: 'Quản lí', value: 'Quản lí' },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label='Phone Number'
                        labelCol={{ span: 5 }}
                        name='phoneNumber'
                        rules={[
                            { required: true, message: 'Please input phone number!' },
                            { pattern: /^\d{10,11}$/, message: 'Please enter a valid phone number!' }, // Rule to check if it's a valid phone number
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type='primary' htmlType='submit'>
                            Save changes
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
            <Card title='List of users' style={{ width: '100%', marginTop: 36 }}>
                <Table dataSource={users} columns={columns} />
            </Card>
            <Modal
                centered
                title='Edit user'
                open={selectedUser}
                okText='Save changes'
                onOk={() => {
                    updateForm.submit();
                }}
                onCancel={() => {
                    setSelectedUser(null);
                }}
            >
                <Form form={updateForm} name='update-user' labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} initialValues={{  firstName: '', lastName: '', email: '', statusId: '', gender: '', createAt: '', role: '',phoneNumber:'' }} onFinish={onUpdate}></Form>
                <Form.Item<FieldType>
                        label='Name' labelCol={{ span: 5 }}
                        name='firstName'
                        rules={[
                            { required: true, message: 'Please input firstName!' },
                        ]}
                        hasFeedback
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label='Name' labelCol={{ span: 5 }}
                        name='lastName'
                        rules={[
                            { required: true, message: 'Please input lastName!' },
                        ]}
                        hasFeedback
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label='Email'
                        labelCol={{ span: 6 }}
                        name='email'
                        rules={[
                            { required: true, message: 'Please input email!' },
                            { type: 'email', message: 'Please enter a valid email address!' }, // Rule to check if it's a valid email
                        ]}
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
                    <Form.Item<FieldType> name='gender' label='Gender' rules={[{ required: true }]} hasFeedback>
                        <Select
                            options={[
                                { label: 'Nam', value: 'Nữ' },
                                { label: 'Nam', value: 'Nữ' },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item<FieldType> name='role' label='Role' rules={[{ required: true }]} hasFeedback>
                        <Select
                            options={[
                                { label: 'Nhân viên', value: 'Nhân viên' },
                                { label: 'Quản lí', value: 'Quản lí' },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label='Phone Number'
                        labelCol={{ span: 6 }}
                        name='phoneNumber'
                        rules={[
                            { required: true, message: 'Please input phone number!' },
                            { pattern: /^\d{10,11}$/, message: 'Please enter a valid phone number!' }, // Rule to check if it's a valid phone number
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    
                    </Modal>
        </div>
    );
}

