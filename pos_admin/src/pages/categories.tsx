import { useRequest } from 'ahooks';
import {  Card, DatePicker, Form, Input, message, Modal } from 'antd';
import React from 'react';

import { FieldType } from '../types/Categories/index';
import axiosClient from '../configs/axiosClient';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Space, Table } from 'antd';
import { Link } from 'react-router-dom';
const Categories: React.FC = () => {
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

  const [categories, setCategories] = React.useState([]);
  const [selectedCategory, setSelectedCategory] = React.useState<any>(null);
  const [createForm] = Form.useForm<FieldType>();
  const [updateForm] = Form.useForm<FieldType>();

  const getCategories = async () => {
    try {
      const response = await axiosClient.get('/categories/all');
      setCategories(response.data);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  React.useEffect(() => {
    getCategories();
  }, []);

  const onFinish = async (values: any) => {
    try {
      console.log('Success:', values);
      await axiosClient.post('/categories/create', values);
      getCategories();
      createForm.resetFields();
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const onDelete = async (categoryId: number) => {
    try {
      await axiosClient.delete(`/categories/remove/${categoryId}`);
      getCategories();
      message.success('Category deleted successfully!');
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const onUpdate = async (values: any) => {
    try {
      console.log('Success:', values);
      await axiosClient.patch(`/categories/update/${selectedCategory.categoryId}`, values);
      getCategories();
      setSelectedCategory(null);
      message.success('Category updated successfully!');
    } catch (error) {
      console.log('Error:', error);
    }
  };
  const columns = [
    {
      title: 'ID',
      dataIndex: 'categoryId',
      key: 'categoryId',
      width: '1%',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
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
                setSelectedCategory(record);
                updateForm.setFieldsValue(record);
              }}
            />
            <Popconfirm
              title='Are you sure to delete this category?'
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
      <Card title='Create new category' style={{ width: '100%' }}>
        <Form form={createForm} name='create-category' labelCol={{ span: 2 }} wrapperCol={{ span: 12 }} initialValues={{ name: '', description: '', createdAt: '', updatedAt: '', deletedAt: '', }} onFinish={onFinish}>
          <Form.Item
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
          <Form.Item label='Description' labelCol={{ span: 6 }} name='description'>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item label='Created Date' labelCol={{ span: 6 }} name='createdAt'  rules={[{ required: true}]}>
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
      <Table dataSource={categories} columns={columns} />
          
      
      </Card>

      <Modal
        centered
        title='Edit category'
        visible={!!selectedCategory}
        okText='Save changes'
        onOk={() => {
          updateForm.submit();
        }}
        onCancel={() => {
          setSelectedCategory(null);
        }}
      >
        <Form form={updateForm} name='update-category' labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} initialValues={{ name: '', description: '', createdAt: '', deletedAt: '', updatedAt: '' }} onFinish={onUpdate}>
          <Form.Item label='Name' name='name' rules={[{ required: true, message: 'Please input name!' }]} hasFeedback>
            <Input />
          </Form.Item>
          <Form.Item label='Description' name='description'>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item label='Create Date' name='createdAt'  rules={[{ required: true}]}>
            <DatePicker />
          </Form.Item>
       
        </Form>
      </Modal>
    </div>
  );
};

export default Categories;
