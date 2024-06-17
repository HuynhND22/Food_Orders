import React from 'react';
import {Card, Form, Input, message, Modal, Radio, Button, Popconfirm, Space, Table, Tooltip} from 'antd';
import { FieldType } from '../types/Categories/index';
import axiosClient from '../configs/axiosClient';
import { DeleteOutlined, EditOutlined, UndoOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import dayjs from "dayjs";
const Categories: React.FC = () => {
   const [categories, setCategories] = React.useState([]);
  const [selectedCategory, setSelectedCategory] = React.useState<any>(null);
  const [createForm] = Form.useForm<FieldType>();
  const [updateForm] = Form.useForm<FieldType>();
  const [deleted, setDeleted] = React.useState<'all' | 'deleted'>('all');
  const getCategories = async () => {
    try {
      const response = await axiosClient.get(`/categories/${deleted}`);
      setCategories(response.data);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  React.useEffect(() => {
    getCategories();
  }, [deleted]);

  const handleCreate = async (values: any) => {
    try {
      console.log('Success:', values);
      await axiosClient.post('/categories/create', values);
      getCategories();
      createForm.resetFields();
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const handleUpdate = async (values: any) => {
    try {
      console.log('Success:', values);
      await axiosClient.patch(`/categories/update/${selectedCategory.categoryId}`, values);
      getCategories();
      setSelectedCategory(null);
      message.success('Cập nhật thành công!');
    } catch (error) {
      console.log('Error:', error);
      message.error('Thao tác thất bại!')
    }
  };

  const handleRemove = async (categoryId: number) => {
    try {
      await axiosClient.delete(`/categories/remove/${categoryId}`);
      getCategories();
      message.success('Đã xóa!');
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const handleDelete = async (categoryId: number) => {
    try {
      await axiosClient.delete(`/categories/delete/${categoryId}`);
      getCategories();
      message.success('Đã xóa!')
    } catch (error) {
      message.error('Thao tác thất bại!')
      console.log(error);
    }
  }

  const handleRestore  = async (categoryId: number) => {
    try {
      await axiosClient.post(`/categories/restore/${categoryId}`)
      getCategories();
      message.success('Khôi phục thành công!')
    } catch (error) {
      console.log(error);
      message.error('Thao tác thất bại!')
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'categoryId',
      key: 'categoryId',
      width: '1%',
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: deleted == 'all' ? 'Ngày tạo - cập nhật gần nhất' : 'Ngày xóa',
      dataIndex: 'createdAt',
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
      title: 'Thao tác',
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
                        setSelectedCategory(record);
                        updateForm.setFieldsValue(record);
                        console.log(record);
                      }}
                  />
                </Tooltip>
                <Tooltip title='Xóa'>
                    <Button type='primary' danger icon={<DeleteOutlined />} onClick={()=>handleRemove(record.categoryId)} />
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
                      onClick={() => handleRestore(record.categoryId)}
                  />
                </Tooltip>
                <Tooltip title='Xóa Vĩnh viễn'>
                  <Popconfirm
                      title='Chắc chắn muốn xóa vĩnh viễn?'
                      icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                      onConfirm={() => {
                        handleDelete(record.categoryId);
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
  const checkNameUnique = async (cb: any, name: string, oldName?:string) => {
    try {
      const res = await axiosClient.get(`/categories/check/unique?field=name&value=${name}&ignore=${oldName}`);
      console.log(res);
      cb(undefined)
    } catch (error) {
      cb(true);
    }
  };
  const { data, run: checkNameUniqueDebounce } = useRequest(checkNameUnique, {
    debounceWait: 500,
    manual: true,
    cacheTime: 0,
  });
  return (
    <div style={{ padding: 36 }}>
      <Card title='Thêm danh mục mới' style={{ width: '100%' }}>
        <Form form={createForm} name='create-category' labelCol={{ span: 2 }} wrapperCol={{ span: 12 }} initialValues={{ name: '', description: '', createdAt: '', updatedAt: '', deletedAt: '', }} onFinish={(value)=>handleCreate(value)}>
          <Form.Item
            label='Tên danh mục' labelCol={{ span: 6 }}
            name='name'
            rules={[
              { required: true, message: 'Tên danh mục là bắt buộc!' },
              {
                validator(rule, value, callback) {
                  checkNameUniqueDebounce(callback, value, );
                },message: "Tên danh mục đã tồn tại!"
              },
            ]}
            hasFeedback
          >
            <Input />
          </Form.Item>
          <Form.Item label='Mô tả' labelCol={{ span: 6 }} name='description'>
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
            <Button type='primary' htmlType='submit'>
              Save changes
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title={
        <Space>
          Danh sách danh mục
          <Radio.Group value={deleted} onChange={(e) => setDeleted(e.target.value)}>
            <Radio.Button style={{color: '#1677FF'}} value="all">Đang hoạt động</Radio.Button>
            <Radio.Button style={{color: 'red'}} value="deleted">Đã xóa</Radio.Button>
        </Radio.Group>
        </Space>
      }
      style={{ width: '100%', marginTop: 36 }}>
      <Table dataSource={categories} columns={columns} />
          
      
      </Card>

      <Modal
        centered
        open={selectedCategory}
        title='Chỉnh sửa danh mục'
        okText='Lưu thay đổi'
        onOk={() => {
          updateForm.submit();
        }}
        onCancel={() => {
          setSelectedCategory(null);
        }}
      >
        <Form form={updateForm} name='update-category' labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} initialValues={{ name: '', description: '', createdAt: '', deletedAt: '', updatedAt: '' }} onFinish={handleUpdate}>
          <Form.Item label='Tên danh mục' name='name' rules={[
            { required: true, message: 'Tên danh mục là bắt buộc!' },
            {
              validator(rule, value, callback) {
                checkNameUniqueDebounce(callback, value, selectedCategory.name);
              },message: "Tên danh mục đã tồn tại"
            },
          ]} hasFeedback>
            <Input />
          </Form.Item>
          <Form.Item label='Mô tả' name='description'>
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Categories;
