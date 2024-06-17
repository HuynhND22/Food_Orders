import React from 'react';
import {Card, Form, Input, message, Modal, Radio, Button, Popconfirm, Space, Table, Tooltip, Select} from 'antd';
import { FieldType } from '../types/Categories/index';
import axiosClient from '../configs/axiosClient';
import { DeleteOutlined, EditOutlined, UndoOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import dayjs from "dayjs";
const Categories: React.FC = () => {
   const [banks, setBanks] = React.useState<any>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<any>(null);
  const [createForm] = Form.useForm<FieldType>();
  const [updateForm] = Form.useForm<FieldType>();
  const [deleted, setDeleted] = React.useState<'all' | 'deleted'>('all');

  const getBanks = async () => {
    try {
      const response = await axiosClient.get('/payments/banks/all');
      if(response.data) {
        console.log(response.data);  
        setBanks(response.data)
        createForm.setFieldsValue(response.data)
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  React.useEffect(() => {
    getBanks();
  }, [deleted]);

  const handleUpdate = async (values: any) => {
    console.log(values);   
    try {
      await axiosClient.patch('/payments/banks/update', values);
      getBanks();
      createForm.resetFields();
      message.success('Cập nhật thành công!')
    } catch (error) {
      console.log('Error:', error);
      message.error('Cập nhật Thất bại!')
    }
  };

  return (
    <div style={{ padding: 36 }} >
      <Card title={<div>Cập nhật tài khoản ngân hàng <span style={{marginLeft: 100}}>{banks?.author + ' - '+ banks?.accountNumber}</span></div>} style={{ width: '100%' }}>
        <Form form={createForm} name='create-category' labelCol={{ span: 2 }} wrapperCol={{ span: 12 }} 
        onFinish={(value)=>handleUpdate(value)}
        >
          <Form.Item
            label='Tên Người sở hữu' labelCol={{ span: 6 }}
            name='author'
            rules={[
              { required: true, message: 'Tên người sở hữu là bắt buộc!' },
            ]}
            hasFeedback
          >
            <Input />
          </Form.Item>
          <Form.Item label='Số tài khoản' labelCol={{ span: 6 }} name='accountNumber' rules={[{required:true, message:'Số tài khoản là bắt buộc!'}]}>
            <Input/>
          </Form.Item>

          <Form.Item label='Ngân hàng' labelCol={{ span: 6 }} name='bankName' rules={[{required: true, message: 'Tên ngân hàng là bắt buộc!'}]}>
            <Select 
              options={[{
                label: 'Ngân hàng tiên phong - TP Bank',
                value: 'tpBank'
              }]}
            />
          </Form.Item>
          
          <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
            <Button type='primary' htmlType='submit'>
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Categories;
