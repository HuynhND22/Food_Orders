import React, { useState, useEffect } from 'react';
import { Button, Card, Form, Input, Space, Table, Popconfirm, message, Modal, Select } from 'antd';
import { useRequest } from 'ahooks';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { DatePicker } from 'antd';
import axiosClient from '../configs/axiosClient';
import { FieldType } from '../types/suppliers/index';

// Custom hook for using the name uniqueness check
export default function Suppliers(props: {}) {
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

  const [categories, setCategories] = useState<FieldType[]>([]);
  const [suppliers, setSuppliers] = useState<FieldType[]>([]);
  const [wards, setWards] = useState<FieldType[]>([]);
  const [status, setStatus] = useState<FieldType[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [createForm] = Form.useForm<FieldType>();
  const [updateForm] = Form.useForm<FieldType>();
  useEffect(() => {
    getSuppliers();
    getStatus();
    getWards();
  }, []);

  const getSuppliers = async () => {
    try {
      const response = await axiosClient.get('/suppliers/all');
      setSuppliers(response.data);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const getWards = async () => {
    try {
      const response = await axiosClient.get('/wards/all');
      setWards(response.data);
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
    getStatus();
    getWards();
    getSuppliers();
  }, []);

  const onFinish = async (values: any) => {
    try {
      console.log('Success:', values);
      await axiosClient.post('/suppliers/create', values);
      getSuppliers();
      createForm.resetFields();
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const onDelete = async (supplierId: number) => {
    try {
      await axiosClient.delete(`/products/${supplierId}`);
      getSuppliers();
      message.success('Suppliers deleted successfully!');
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const onUpdate = async (values: any) => {
    try {
      console.log('Success:', values);
      await axiosClient.patch(`/suppliers/update/${selectedSupplier.supplierId}`, values);
      getSuppliers();
      setSelectedSupplier(null);
      message.success('Product updated successfully!');
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const columns = [
    {
      title: 'SupplierId',
      dataIndex: 'supplierId',
      key: 'supplierId',
      width: '10%',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '10%',
    },
    {
      title: 'Ward',
      dataIndex: 'wardId',
      key: 'wardId',
      render: (text: string, record: any, index: number) => {
        return <span>{record.wards.wardId}</span>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'statusId',
      key: 'statusId',
      render: (text: string, record: any, index: number) => {
        return <span>{record.categories.wardId}</span>;
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
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
      width: '1%',
      render: (text: any, record: any) => {
        return (
          <Space size='small'>
            <Button
              type='primary'
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedSupplier(record);
                updateForm.setFieldsValue(record);
              }}
            />

            <Popconfirm
              title='Delete the supplier'
              description='Are you sure to delete this supplier?'
              onConfirm={() => {
                onDelete(record.categoryId);
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
      <Card title='Create new supplier' style={{ width: '100%' }}>
        <Form form={createForm} name='create-supplier' labelCol={{ span: 2 }} wrapperCol={{ span: 12 }} initialValues={{ name: '', phoneNumber: '', createdAt: '', email: '', updatedAt: '', deletedAt: '', wardId: '', statusId: '' }} onFinish={onFinish}>
          <Form.Item<FieldType>
            label='Name' labelCol={{ span: 6 }}
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
          <Form.Item<FieldType> name='wardId' labelCol={{ span: 6 }} label='ward' hasFeedback>
            <Select
              options={wards.map((item: any) => {
                return {
                  label: item.name,
                  value: item.wardId,
                };
              })}
            />
          </Form.Item>
          <Form.Item<FieldType> name='statusId' labelCol={{ span: 6 }} label='status' hasFeedback  rules={[{ required: true}]}>
            <Select
              options={status.map((item: any) => {
                return {
                  label: item.name,
                  value: item.statusId,
                };
              })}
            />
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
          <Form.Item<FieldType> label='Creat Date' labelCol={{ span: 6 }} name='createdAt'  rules={[{ required: true}]}>
            <DatePicker />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
            <Button type='primary' htmlType='submit'>
              Save changes
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card title='List of categories' style={{ width: '100%', marginTop: 36 }}>
        <Table dataSource={suppliers} columns={columns} />
      </Card>

      <Modal
        centered
        title='Edit category'
        open={selectedSupplier}
        okText='Save changes'
        onOk={() => {
          updateForm.submit();
        }}
        onCancel={() => {
          setSelectedSupplier(null);
        }}
      >
        <Form form={updateForm} name='update-supplier' labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} initialValues={{ name: '', phoneNumber: '', createdAt: '', email: '', updatedAt: '', deletedAt: '', wardId: '', statusId: '', }} onFinish={onUpdate}>

          <Form.Item<FieldType>
            label='Name' labelCol={{ span: 6 }}
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
          <Form.Item<FieldType> name='wardId' labelCol={{ span: 6 }} label='ward' hasFeedback>
            <Select
              options={wards.map((item: any) => {
                return {
                  label: item.name,
                  value: item.wardId,
                };
              })}
            />
          </Form.Item>
          <Form.Item<FieldType> name='statusId' labelCol={{ span: 6 }} label='status'  rules={[{ required: true}]} hasFeedback>
            <Select
              options={status.map((item: any) => {
                return {
                  label: item.name,
                  value: item.statusId,
                };
              })}
            />
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
          <Form.Item<FieldType> label='Creat Date' labelCol={{ span: 6 }} name='createdAt'>
            <DatePicker />
          </Form.Item>
     
        </Form>
      </Modal>
    </div>
  );
}
