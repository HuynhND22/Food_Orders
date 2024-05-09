import { Button, Card, Form, Input, Space, Table, Popconfirm, message, Modal, InputNumber, Select, Upload, DatePicker } from 'antd';
import React from 'react';
import { DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import numeral from 'numeral';
import axios from 'axios';
import { FieldType } from '../types/products/index';
import axiosClient from '../configs/axiosClient';
type Props = {};
export default function Products({ }: Props) {
  const [products, setProducts] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [suppliers, setSuppliers] = React.useState([]);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const [createForm] = Form.useForm<FieldType>();
  const [updateForm] = Form.useForm<FieldType>();
  const [file, setFile] = React.useState([]);

  const getProducts = async () => {
    try {
      const response = await axiosClient.get('/products/all');
      setProducts(response.data);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const getCategories = async () => {
    try {
      const response = await axiosClient.get('/categories/all');
      setCategories(response.data);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const getSuppliers = async () => {
    try {
      const response = await axiosClient.get('/suppliers/all');
      setSuppliers(response.data);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  React.useEffect(() => {
    getProducts();
    getCategories();
    getSuppliers();
  }, []);

  const onFinish = async (values: any) => {
    try {
      console.log('Success:', values);
      const response = await axiosClient.post('/products/create', values);
      console.log(response.data);
      getProducts();
      createForm.resetFields();
    } catch (error) {
      console.log('Error:', error);
    }
  };
  const onDelete = async (productId: number) => {
    try {
      await axiosClient.delete(`/products/remove${productId}`);
      getProducts();
      message.success('Product deleted successfully!');
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const onUpdate = async (values: any) => {
    try {
      console.log('Success:', values);
      await axiosClient.patch(`/products/update/${selectedProduct.productId}`, values);
      getProducts();
      setSelectedProduct(null);
      message.success('Product updated successfully!');
    } catch (error) {
      console.log('Error:', error);
    }
  };

  // const handleFileUpload = async () => {
  //   try {
  //     const formData = new FormData();
  //     formData.append('file', file);
  //     // Gửi hình ảnh lên máy chủ
  //     const response = await axios.post('/api/upload', formData);
  //     // Nhận lại đường dẫn đến hình ảnh từ máy chủ và lưu trữ thông tin của hình ảnh trong cơ sở dữ liệu
  //     const imageUrl = response.data.imageUrl;
  //     // Tiếp tục xử lý lưu trữ thông tin hình ảnh vào cơ sở dữ liệu
  //   } catch (error) {
  //     console.error('Error uploading image:', error);
  //   }
  // };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '10%',
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount',
      width: '10%',
      render: (text: string, record: any, index: number) => {
        return <div >{numeral(text).format('0,0.0')}%</div>;
      },
    },

    // {
    //   title: 'Image',
    //   key: 'images',
    //   dataIndex: 'images',
    //   width: '1%',
    //   render: (text: string, record: any, index: number) => {
    //     const productId = record.productId; // Lấy productId từ bản ghi hiện tại
    //     const imageInfo = images.find((image: any) => image.productId === productId); // Tìm hình ảnh tương ứng với productId
    //     if (imageInfo) {
    //       return <img src={'http://localhost9000:' + imageInfo.imageUrl} style={{ height: 60 }} alt='' />;
    //     } else {
    //       return null; // Trả về null nếu không tìm thấy hình ảnh tương ứng
    //     }
    //   },

    // },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: '10%',
      render: (text: string, record: any, index: number) => {
        return <span>{record.category.name}</span>;
      },
    },
    {
      title: 'Supplier',
      dataIndex: 'supplier',
      key: 'supplier',
      width: '1%',
      render: (text: string, record: any, index: number) => {
        return <span>{record.supplier.name}</span>;
      },
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
                setSelectedProduct(record);
                updateForm.setFieldsValue(record);
              }}
            />

            <Popconfirm
              title='Delete the product'
              description='Are you sure to delete this product?'
              onConfirm={() => {
                onDelete(record.productId);
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
      <Card title='Create new product' style={{ width: '100%' }}>
        <Form form={createForm} name='create-product' labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} initialValues={{ name: '', discount: 0, stock: 0, description: '', createAt: '', updatedAt: '', deletedAt: '' }} onFinish={onFinish}>
          <Form.Item label='Image'>
            <Upload
              listType='text'
              showUploadList={true}
              beforeUpload={(f: any) => {
                setFile(f);
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>

          {/* name */}
          <Form.Item<FieldType> label='Name' name='name' rules={[{ required: true }]} hasFeedback>
            <Input />
          </Form.Item>
          {/* categories */}
          <Form.Item<FieldType> name='categoryId' label='Category' rules={[{ required: true }]} hasFeedback>
            <Select
              options={categories.map((item: any) => {
                return {
                  label: item.name,
                  value: item.categoryId,
                };
              })}
            />
          </Form.Item>
          {/* supplier */}
          <Form.Item<FieldType> name='supplierId' label='Supplier' rules={[{ required: true }]} hasFeedback>
            <Select
              options={suppliers.map((item: any) => {
                return {
                  label: item.name,
                  value: item.supplierid,
                };
              })}
            />
          </Form.Item>
          {/* DISCOUNT */}
          <Form.Item<FieldType> label='Discount' name='discount' rules={[{ required: true }]} hasFeedback>
            <InputNumber min={0} max={90} />
          </Form.Item>

          {/* description */}
          <Form.Item<FieldType> label='Description' name='description'>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item<FieldType> label='CreatedAt' name='createdAt' rules={[{ required: true }]}>
            <DatePicker />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type='primary' htmlType='submit'>
              Save changes
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card title='List of products' style={{ width: '100%', marginTop: 36 }}>
        <Table dataSource={products} columns={columns} />
      </Card>

      <Modal
        centered
        title='Edit product'
        open={selectedProduct}
        okText='Save changes'
        onOk={() => {
          updateForm.submit();
        }}
        onCancel={() => {
          setSelectedProduct(null);
        }}
      >
        <Form form={updateForm} name='update-product' labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} initialValues={{ name: '', discount: 0, stock: 0, description: '', createAt: '', updatedAt: '', deletedAt: '' }} onFinish={onUpdate}>


          {/* name */}
          <Form.Item<FieldType> label='Name' name='name' rules={[{ required: true }]} hasFeedback>
            <Input />
          </Form.Item>
          {/* categories */}
          <Form.Item<FieldType> name='categoryId' label='Category' rules={[{ required: true }]} hasFeedback>
            <Select
              options={categories.map((item: any) => {
                return {
                  label: item.name,
                  value: item.categoryId,
                };
              })}
            />
          </Form.Item>
          {/* supplier */}
          <Form.Item<FieldType> name='supplierId' label='Supplier' rules={[{ required: true }]} hasFeedback>
            <Select
              options={suppliers.map((item: any) => {
                return {
                  label: item.name,
                  value: item.supplierid,
                };
              })}
            />
          </Form.Item>
          {/* DISCOUNT */}
          <Form.Item<FieldType> label='Discount' name='discount' rules={[{ required: true }]} hasFeedback>
            <InputNumber min={0} max={90} />
          </Form.Item>

          {/* description */}
          <Form.Item<FieldType> label='Description' name='description'>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item<FieldType> label='CreatedAt' name='createdAt' rules={[{ required: true }]}>
            <DatePicker />
          </Form.Item>
        
        </Form>
      </Modal>
    </div>
  );
}

