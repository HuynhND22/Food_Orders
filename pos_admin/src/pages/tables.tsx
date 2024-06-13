import React from 'react';
import {Card, Form, Input, message, Modal, Radio, Button, Popconfirm, Space, Table, Tooltip, InputNumber, Image} from 'antd';
import { FieldType } from '../types/Tables/index';
import axiosClient from '../configs/axiosClient';
import { DeleteOutlined, EditOutlined, UndoOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Link } from 'react-router-dom';
import dayjs from "dayjs";
const Tables: React.FC = () => {
  const [tables, setTables] = React.useState([]);
  const [selectedTables, setSelectedTables] = React.useState<any>(null);
  const [createForm] = Form.useForm<FieldType>();
  const [updateForm] = Form.useForm<FieldType>();
  const [deleted, setDeleted] = React.useState<'all' | 'deleted'>('all');
  const getTables = async () => {
    try {
      const response = await axiosClient.get(`/tables/${deleted}`);
      setTables(response.data);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  React.useEffect(() => {
    getTables();
    console.log(tables);  
  }, [deleted]);

  const handleCreate = async (values: any) => {
    try {
      console.log('Success:', values);
      await axiosClient.post('/tables/create', values);
      getTables();
      createForm.resetFields();
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const handleUpdate = async (values: any) => {
    try {
      console.log('Success:', values);
      await axiosClient.patch(`/tables/update/${selectedTables.tableId}`, values);
      getTables();
      setSelectedTables(null);
      message.success('Cập nhật thành công!');
    } catch (error) {
      console.log('Error:', error);
      message.error('Thao tác thất bại!')
    }
  };

  const handleRemove = async (tableId: number) => {
    try {
      await axiosClient.delete(`/tables/remove/${tableId}`);
      getTables();
      message.success('Đã xóa!');
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const handleDelete = async (tableId: number) => {
    try {
      await axiosClient.delete(`/tables/delete/${tableId}`);
      getTables();
      message.success('Đã xóa!')
    } catch (error) {
      message.error('Thao tác thất bại!')
      console.log(error);
    }
  }

  const handleRestore  = async (tableId: number) => {
    try {
      await axiosClient.post(`/tables/restore/${tableId}`)
      getTables();
      message.success('Khôi phục thành công!')
    } catch (error) {
      console.log(error);
      message.error('Thao tác thất bại!')
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'tableId',
      key: 'tableId',
      width: '1%',
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Chổ ngồi',
      dataIndex: 'seat',
      key: 'seat',
    },
    {
      title: 'Mã QR',
      key: 'qrCode',
      render: (text:string, record:any) =>{
        return <Link to={process.env.REACT_APP_API_BASE_URL +'/tables/download?uri='+ record.qrCode}><Image preview={false} onClick={()=>{}} src={process.env.REACT_APP_API_BASE_URL + record.qrCode}/></Link>
      }
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
                        setSelectedTables(record);
                        updateForm.setFieldsValue(record);
                        console.log(record);
                      }}
                  />
                </Tooltip>
                <Tooltip title='Xóa'>
                    <Button type='primary' danger icon={<DeleteOutlined />} onClick={()=>handleRemove(record.tableId)} />
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
                      onClick={() => handleRestore(record.tableId)}
                  />
                </Tooltip>
                <Tooltip title='Xóa Vĩnh viễn'>
                  <Popconfirm
                      title='Chắc chắn muốn xóa vĩnh viễn?'
                      icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                      onConfirm={() => {
                        handleDelete(record.tableId);
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
      const res = await axiosClient.get(`/tables/check/unique?field=name&value=${name}&ignore=${oldName}`);
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
      <Card title='Thêm bàn mới' style={{ width: '100%' }}>
        <Form form={createForm} name='create-table' labelCol={{ span: 2 }} wrapperCol={{ span: 12 }} initialValues={{ name: '', description: '', createdAt: '', updatedAt: '', deletedAt: '', }} onFinish={(value)=>handleCreate(value)}>
          <Form.Item
            label='Tên bàn' labelCol={{ span: 6 }}
            name='name'
            rules={[
              { required: true, message: 'Tên bàn là bắt buộc!' },
              {
                validator(rule, value, callback) {
                  checkNameUniqueDebounce(callback, value);
                },message: "Bàn đã tồn tại!"
              },
            ]}
            hasFeedback
          >
            <Input />
          </Form.Item>
          <Form.Item label='Chổ ngồi' labelCol={{ span: 6 }} name='seat'>
            <InputNumber />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
            <Button type='primary' htmlType='submit'>
              Thêm mới
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
      <Table dataSource={tables} columns={columns} />
          
      
      </Card>

      <Modal
        centered
        open={selectedTables}
        title='Chỉnh sửa danh mục'
        okText='Lưu thay đổi'
        onOk={() => {
          updateForm.submit();
        }}
        onCancel={() => {
          setSelectedTables(null);
        }}
      >
        <Form form={updateForm} name='update-category' labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} initialValues={{ name: '', description: '', createdAt: '', deletedAt: '', updatedAt: '' }} onFinish={handleUpdate}>
          <Form.Item label='Tên danh mục' name='name' rules={[
            { required: true, message: 'Tên danh mục là bắt buộc!' },
            {
              validator(rule, value, callback) {
                checkNameUniqueDebounce(callback, value, selectedTables.name);
              },message: "Tên danh mục đã tồn tại"
            },
          ]} hasFeedback>
            <Input />
          </Form.Item>
          <Form.Item label='Chổ ngồi' name='seat'>
            <InputNumber min={1} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Tables;
