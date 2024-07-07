import { Button, Card, Form, Input, Space, Table, Popconfirm, message, Modal, InputNumber, Select, Upload, DatePicker, Segmented } from 'antd';
import { Option } from "antd/es/mentions";
import React from 'react';
import { DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import numeral from 'numeral';
import dayjs from 'dayjs'
import axios from 'axios';
import { FieldType } from '../types/users/index'
import axiosClient from '../configs/axiosClient';
import { useRequest } from 'ahooks';
import { getDefaultDate } from '../helpers/getDate'


type Props = {};
export default function Users({ }: Props) {
    const checkNameUnique = async (name: string) => {
        try {
            const res = await axiosClient.get(`/users/check/unique?name=${name}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
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
    const [selectedUser, setSelectedUser] = React.useState<any>(null);
    const [createForm] = Form.useForm<FieldType>();
    const [updateForm] = Form.useForm<FieldType>();
    const [wards, setWards] = React.useState<FieldType[]>([]);
    const [districts, setDistricts] = React.useState<FieldType[]>([]);
    const [provinces, setProvinces] = React.useState<FieldType[]>([]);

      const getData = async () => {
        try {
          const [status, provinces] = await Promise.all([
            axiosClient.get("/status/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
            axiosClient.get("/address/provinces", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
          ]);
          setStatus(status.data);
          setProvinces(provinces.data);
        } catch (error) {
          console.log(error);
        }
      };
      React.useEffect(() => {
        getData();
      }, []);

      const getDistricts = async (provinceId: number) => {
        const districts = await axiosClient.get(`/address/districts/${provinceId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
        if (districts) {
          setDistricts(districts.data);
        } else {
          setDistricts([]);
        }
      };
      const getWards = async (districtId: number) => {
        const wards = await axiosClient.get(`/address/wards/${districtId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
        if (wards) {
          setWards(wards.data);
        } else {
          setWards([]);
        }
      };

    const getUsers = async () => {
        try {
            const response = await axiosClient.get('/users/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
            setUsers(response.data);
        } catch (error) {
            console.log('Error:', error);
        }
    };

    React.useEffect(() => {
        getUsers();
    }, []);
    // onfinish
    const onFinish = async (values: any) => {
        try {
            console.log('Success:', values);
            const response = await axiosClient.post('/users/create', values, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
              });
            getUsers();
            createForm.resetFields();
            message.success('Tạo mới thành công!');
        } catch (error) {
            console.log('Error:', error);
        }
    };
    const onDelete = async (userId: number) => {
        try {
            await axiosClient.delete(`/users/remove${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
            getUsers();
            message.success('Đã xoá!');
        } catch (error) {
            console.log('Error:', error);
        }
    };

    const onUpdate = async (values: any) => {
        try {
            console.log('Success:', values);
            await axiosClient.patch(`/users/update/${selectedUser.userId}`, values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
            getUsers();
            setSelectedUser(null);
            message.success('Cập nhật thành công!');
        } catch (error) {
            console.log('Error:', error);
        }
    };
    const columns = [
        {
            title: 'ID',
            dataIndex: 'userId',
            key: 'userId',
            width: '1%',
        },
        {
            title: 'Họ tên',
            key: 'fullName',
            width: '10%',
            render: (text:string, record:any) => {
                return `${record.firstName} ${record.lastName}`
            }
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            key: 'gender',
            width: '7%',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: '10%',
        },
        {
            title: 'Số điên thoại',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            width: '10%',
        },
        {
            title: 'Địa chỉ',
            key: 'address',
            render: (text:string, record:any) => {
                return (
                  record.ward && (
                    <span>
                      {record.address +
                        " - " +
                        record.ward?.name +
                        " - " +
                        record.ward?.district?.name +
                        " - " +
                        record.ward?.district?.province?.name}
                    </span>
                  )
                );
            }
        },
        {
            title: 'Trạng thái',
            key: 'statusId',
            width: '10%',
            render: (text:string, record:any) => {
                return record.status?.name
            }
        },
        {
            title: 'Quyền',
            dataIndex: 'role',
            key: 'wardId',
            width: '10%',
        },
        {
            title: 'Ngày tạo',
            key: 'createdAt',
            render: (text:string, record:any) => {
                return dayjs(record.createdAt).format('HH:MM - DD/MM/YYYY')
            }
        },
        {
            title: 'Thao tác',
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
                                updateForm.setFieldValue('provinceId', record.ward?.district?.province?.provinceId)
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
            <Card title='Tạo thành viên mới' style={{ width: '100%' }}>
                <Form form={createForm} name='create-user' labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} onFinish={onFinish}>
                    {/* input name */}
                    <Form.Item labelCol={{ span: 5 }} label="Họ tên" name='' rules={[{required: true, message: 'Họ tên là bắt buộc'}]} hasFeedback>
                        <Space style={{ display: "flex", flex: "wrap" }}>
                            <Form.Item noStyle name='firstName' >
                                <Input placeholder="Nhập họ"/>
                            </Form.Item>
                            <Form.Item noStyle name='lastName'>
                                <Input placeholder="Nhập tên"/>
                            </Form.Item>
                        </Space>
                    </Form.Item>
                    <Form.Item<FieldType> name='gender' label='Giới tính' rules={[{ required: true, message: 'Giới tính là bắt buộc!' }]} hasFeedback>
                        <Select
                            options={[
                                { label: 'Nam', value: 'Nữ' },
                                { label: 'Nữ', value: 'Nữ' },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label='Email'
                        labelCol={{ span: 5 }}
                        name='email'
                        rules={[
                            { required: true, message: 'Email là bắt buộc!' },
                            { type: 'email', message: 'Địa chỉ email chưa chính xác!' }, // Rule to check if it's a valid email
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label='Số điện thoại'
                        labelCol={{ span: 5 }}
                        name='phoneNumber'
                        rules={[
                            { required: true, message: 'Số điện thoại là bắt buộc!' },
                            { pattern: /^\d{10,11}$/, message: 'Số điện thoại chưa chính xác!' }, // Rule to check if it's a valid phone number
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item labelCol={{ span: 5 }} label="Địa chỉ">
                        <Space style={{ display: "flex", flex: "wrap" }}>
                          <Form.Item noStyle>
                            <Select
                              style={{ width: "160px" }}
                              placeholder="Tỉnh/Thành phố"
                              onChange={(value) => getDistricts(value)}
                            >
                              {provinces.map((value: any) => {
                                return (
                                  <Option key={value.provinceId} value={value.provinceId}>
                                    {value.name}
                                  </Option>
                                );
                              })}
                            </Select>
                          </Form.Item>
                          <Form.Item noStyle>
                            <Select
                              style={{ width: "170px" }}
                              placeholder="Quận/Huyện"
                              onChange={(value) => getWards(value)}
                            >
                              {districts.map((value: any) => {
                                return (
                                  <Option key={value.districtId} value={value.districtId}>
                                    {value.name}
                                  </Option>
                                );
                              })}
                            </Select>
                          </Form.Item>
                          <Form.Item<FieldType> name={"wardId"} noStyle>
                            <Select placeholder="Phường/Xã" style={{ width: "180px" }}>
                              {wards.map((value: any) => {
                                return (
                                  <Option key={value.wardId} value={value.wardId}>
                                    {value.name}
                                  </Option>
                                );
                              })}
                            </Select>
                          </Form.Item>
                          <Form.Item<FieldType> name={"address"} noStyle>
                            <Input
                              style={{ width: "280px" }}
                              placeholder="Địa chỉ cụ thể"
                            />
                          </Form.Item>
                        </Space>
                    </Form.Item>



                    <Form.Item<FieldType> name='statusId' label='Trạng thái' rules={[{ required: true, message: 'Trạng thái là bắt buộc' }]} hasFeedback>
                        <Select
                            options={status.map((item: any) => {
                                return {
                                    label: item.name,
                                    value: item.statusId,
                                };
                            })}
                        />
                    </Form.Item>

                    <Form.Item<FieldType> name='password' label='Mật khẩu' rules={[{ required: true, message: 'Mật khẩu là bắt buộc' }]} hasFeedback>
                        <Input.Password/>
                    </Form.Item>

                    <Form.Item<FieldType> name='role' label='Quyền' hasFeedback>
                        <Segmented options={['Nhân viên', 'Quản trị viên']} />
                    </Form.Item>
                    
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type='primary' htmlType='submit'>
                            Thêm mới
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
            <Card title='List of users' style={{ width: '100%', marginTop: 36 }}>
                <Table dataSource={users} columns={columns} />
            </Card>
            <Modal
                width='900px'
                centered
                title='Chỉnh sửa thành viên'
                open={selectedUser}
                okText='Cập nhật'
                cancelText='Huỷ'
                onOk={() => {
                    updateForm.submit();
                }}
                onCancel={() => {
                    setSelectedUser(null);
                }}
            >
                <Form form={updateForm} name='update-user' initialValues={{  firstName: '', lastName: '', email: '', statusId: '', gender: '', createAt: '', role: '',phoneNumber:'' }} onFinish={onUpdate}>
                     <Form.Item label="Họ tên" name='' rules={[{required: true, message: 'Họ tên là bắt buộc'}]} hasFeedback>
                        <Space style={{ display: "flex", flex: "wrap" }}>
                            <Form.Item noStyle name='firstName' >
                                <Input placeholder="Nhập họ"/>
                            </Form.Item>
                            <Form.Item noStyle name='lastName'>
                                <Input placeholder="Nhập tên"/>
                            </Form.Item>
                        </Space>
                    </Form.Item>
                    <Form.Item<FieldType> name='gender' label='Giới tính' rules={[{ required: true, message: 'Giới tính là bắt buộc!' }]} hasFeedback>
                        <Select
                            options={[
                                { label: 'Nam', value: 'Nữ' },
                                { label: 'Nữ', value: 'Nữ' },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label='Email'
                        // labelCol={{ span: 5 }}
                        name='email'
                        rules={[
                            { required: true, message: 'Email là bắt buộc!' },
                            { type: 'email', message: 'Địa chỉ email chưa chính xác!' }, // Rule to check if it's a valid email
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label='Số điện thoại'
                        // labelCol={{ span: 5 }}
                        name='phoneNumber'
                        rules={[
                            { required: true, message: 'Số điện thoại là bắt buộc!' },
                            { pattern: /^\d{10,11}$/, message: 'Số điện thoại chưa chính xác!' }, // Rule to check if it's a valid phone number
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label="Địa chỉ">
                        <Space style={{ display: "flex", flex: "wrap" }}>
                          <Form.Item noStyle>
                            <Select
                              style={{ width: "160px" }}
                              placeholder="Tỉnh/Thành phố"
                              onChange={(value) => getDistricts(value)}
                            >
                              {provinces.map((value: any) => {
                                return (
                                  <Option key={value.provinceId} value={value.provinceId}>
                                    {value.name}
                                  </Option>
                                );
                              })}
                            </Select>
                          </Form.Item>
                          <Form.Item noStyle>
                            <Select
                              style={{ width: "170px" }}
                              placeholder="Quận/Huyện"
                              onChange={(value) => getWards(value)}
                            >
                              {districts.map((value: any) => {
                                return (
                                  <Option key={value.districtId} value={value.districtId}>
                                    {value.name}
                                  </Option>
                                );
                              })}
                            </Select>
                          </Form.Item>
                          <Form.Item<FieldType> name={"wardId"} noStyle>
                            <Select placeholder="Phường/Xã" style={{ width: "180px" }}>
                              {wards.map((value: any) => {
                                return (
                                  <Option key={value.wardId} value={value.wardId}>
                                    {value.name}
                                  </Option>
                                );
                              })}
                            </Select>
                          </Form.Item>
                          <Form.Item<FieldType> name={"address"} noStyle>
                            <Input
                              style={{ width: "280px" }}
                              placeholder="Địa chỉ cụ thể"
                            />
                          </Form.Item>
                        </Space>
                    </Form.Item>



                    <Form.Item<FieldType> name='statusId' label='Trạng thái' hasFeedback>
                        <Select
                            options={status.map((item: any) => {
                                return {
                                    label: item.name,
                                    value: item.statusId,
                                };
                            })}
                        />
                    </Form.Item>

                    <Form.Item<FieldType> name='password' label='Mật khẩu' hasFeedback>
                        <Input.Password />
                    </Form.Item>

                    <Form.Item<FieldType> name='role' label='Quyền' hasFeedback>
                        <Segmented options={['Nhân viên', 'Quản trị viên']} />
                    </Form.Item>
                    </Form>
                    
                    </Modal>
        </div>
    );
}

