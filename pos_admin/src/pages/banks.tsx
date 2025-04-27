import React, { useEffect } from 'react';
import {Card, Form, Input, message, Modal, Radio, Button, Popconfirm, Space, Table, Tooltip, Select} from 'antd';
import { FieldType } from '../types/Categories/index';
import axiosClient from '../configs/axiosClient';
import { DeleteOutlined, EditOutlined, UndoOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import dayjs from "dayjs";
const Categories: React.FC = () => {
  //  const [banks, setBanks] = React.useState<any>([]);
  const {Option} = Select;

  const [createForm] = Form.useForm<FieldType>();
  const [loggedBank, setLoggedBank] = React.useState<boolean>(false);
  const [listBank, setListBank] = React.useState([]);

  useEffect(()=>{
    if(localStorage.getItem('logged_in_bank')) setLoggedBank(true)
  },[loggedBank])

  const getBanks = async () => {
    try {
      const response = await axiosClient.get('/payments/banks/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if(response.data) {
        setListBank(response.data)
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  React.useEffect(() => {
    getBanks();
  }, []);

  React.useEffect(() => {
  }, [listBank]);

  const handleLogin = async (values: any) => {
    console.log(values);   
    try {
      const login = await axiosClient.post('/payments/banks/login', values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if(!login) message.error('Đăng nhập thất bại')
        setListBank(login.data)
        localStorage.setItem('logged_in_bank', 'true')
        setLoggedBank(true)
        // getBanks();
      // createForm.resetFields();
      message.success('Cập nhật thành công!')
    } catch (error) {
      console.log('Error:', error);
      message.error('Cập nhật Thất bại!')
    }
  };

  const handleFetch = async (accountNumber:any) => {
    console.log('dsvssvd', accountNumber)
    try {
      await axiosClient.post('/payments/banks/run-fetch', {accountNumber: accountNumber}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      message.success('Đã chuyển số tài khoản!')
    } catch (error) {
      
    }
  }

  return (
    <div style={{ padding: 36 }} >
      <Card title={
        loggedBank ?         
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <span>
            <span style={{marginRight: 10}}>Lịch sử giao dịch</span>
            <span>
               <Select
                style={{ width: 400 }}
                onChange={(data) => handleFetch(data)}
                placeholder="Chọn một giá trị"
              >
              {listBank && listBank.map((item:any)=>(
                <Option key={item.value} value={item.accountNumber}>
                {item.author} - {item.accountNumber}
              </Option>
              ))}
               
              </Select>
            </span>
          </span>
            <span style={{justifyContent: 'end'}}>
              <Button onClick={async()=>{
                localStorage.removeItem('logged_in_bank'); 
                setLoggedBank(false);
                await axiosClient.post('/payments/banks/logout', {}, {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                  },
                });
                }} danger type='dashed'>Đăng xuất ngân hàng</Button>
            </span>
        </div>
        :
        <div>Đăng nhập ngân hàng (TP Bank)</div>
      } style={{ width: '100%' }}>
        {!loggedBank && 
        <Form form={createForm} name='create-category' labelCol={{ span: 2 }} wrapperCol={{ span: 12 }} 
          onFinish={(value)=>handleLogin(value)}
        >
          <Form.Item
            label='Tên đăng nhập' labelCol={{ span: 6 }}
            name='username'
            rules={[
              { required: true, message: 'Tên đăng nhập là bắt buộc!' },
            ]}
            hasFeedback
          >
            <Input />
          </Form.Item>
          <Form.Item label='Mật khẩu' labelCol={{ span: 6 }} name='password' rules={[{required:true, message:'Mật khẩu là bắt buộc!'}]}>
            <Input.Password/>
          </Form.Item>
          
          <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
            <Button type='primary' htmlType='submit'>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>}
      </Card>
    </div>
  );
};

export default Categories;
