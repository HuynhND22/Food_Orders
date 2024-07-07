import { Button, Card, Form, Input, Space, Table, Popconfirm, message, Modal, InputNumber, Select, Upload, DatePicker, Divider, Image, GetProp, UploadFile, UploadProps, Radio, Tooltip } from 'antd';
import React from 'react';
import { DeleteOutlined, EditOutlined, UploadOutlined, MinusCircleOutlined,PlusOutlined,QuestionCircleOutlined,UndoOutlined } from '@ant-design/icons';
import numeral from 'numeral';
import axios from 'axios';
import { FieldType } from '../types/products/index';
import axiosClient from '../configs/axiosClient';
import FormData from 'form-data';
import {debounce} from "ahooks/es/utils/lodash-polyfill";
import dayjs from 'dayjs'
type Props = {};
export default function Products({ }: Props) {
  const [products, setProducts] = React.useState<any>([]);
  const [categories, setCategories] = React.useState([]);
  const [suppliers, setSuppliers] = React.useState([]);
  const [sizes, setSizes] = React.useState([]);
  const [status, setStatus] = React.useState([]);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const [createForm] = Form.useForm<FieldType>();
  const [updateForm] = Form.useForm<FieldType>();
  const [file, setFile] = React.useState([]);
  const [deleted, setDeleted] = React.useState('all');

  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState('');
  const [fileList, setFileList] = React.useState<UploadFile[]>([]);
  const [cover, setCover] = React.useState<any>();
  const [fileListUpdate, setFileListUpdate] = React.useState<UploadFile[]>([]);
  type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });


  const checkExist = (file:any) =>  {
    const isDuplicate = fileList.some(uploadedFile => 
      uploadedFile.name === file.name && uploadedFile.size === file.size
    );

    if (isDuplicate) {
      message.error(`${file.name} đã tồn tại.`);
      return Upload.LIST_IGNORE;
    }
    
    return false;
  }

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    console.log(newFileList);
    // let fileName:any = [];
    // fileList.map((value:any) => {
    //   fileName.push(value.name)
    // })
    // const a = fileName.filter((value:any, index:any)=> fileName.indexOf(value)===index)
    // console.log(a);
  }
  const handleChangeUpdate: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileListUpdate(newFileList);
    console.log('newFileList',newFileList);
    // let fileName:any = [];
    // fileList.map((value:any) => {
    //   fileName.push(value.name)
    // })
    // const a = fileName.filter((value:any, index:any)=> fileName.indexOf(value)===index)
    // console.log(a);
  }
    const uploadButton = (
      <button style={{ border: 0, background: 'none' }} type="button">
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </button>
    );

    const fileListMerge = fileListUpdate.concat(fileList)

    const coverList =  (
      <Form.Item label='cover' name="cover" rules={[{required:true, message: 'Ảnh cover là bắt buộc'}]}>
        <Radio.Group buttonStyle="solid">
          {
            fileListMerge.map((value)=>{
            return <Radio.Button style={{width:110}} value={value.name}><span style={
              {
                display: 'block',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }
            }>{value.name}</span></Radio.Button>
          })}
         </Radio.Group>
      </Form.Item>
    )

  const getProducts = async () => {
    try {
      const response = await axiosClient.get(`/products/${deleted}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      let product = new Array();
      await Promise.all(response.data.map(async(value:any)=> {
        // console.log(value);
        const res = await axiosClient.get(`/sizes/product/${value.productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
        await product.push({...value, productSizes: res.data})
        // console.log(product);
      }))
        setProducts(product);
      console.log(product);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const getCategories = async () => {
    try {
      const response = await axiosClient.get('/categories/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setCategories(response.data);
    } catch (error) {
      console.log('Error:', error);
    }
  };
  const getSizes = async () => {
    try {
      const response = await axiosClient.get('/sizes/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setSizes(response.data);
    } catch (error) {
      console.log('Error:', error);
    }
  };
  const getStatus = async () => {
    try {
      const response = await axiosClient.get('/status/products', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setStatus(response.data);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const getSuppliers = async () => {
    try {
      const response = await axiosClient.get('/suppliers/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setSuppliers(response.data);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  React.useEffect(() => {
    getProducts();
  }, [deleted]);
React.useEffect(() => {
    getSizes()
    getStatus()
    getCategories();
    getSuppliers();
}, [])  


  const onFinish = async (values: any) => {
    const formData:any = new FormData();
    if (fileList) {
      fileList.map((value)=>{
        formData.append('images', value.originFileObj);
      })
    }

    Object.entries(values).forEach(([key, value]:any)=>{
      console.log('key ', key, 'value ', value);  
      if (value) {
        formData.append(key, JSON.stringify(value))
      }
    })
    try {
      const response = await axiosClient.post('/products/create', formData,{
         headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      getProducts();
      createForm.resetFields();
      setFileList([])
      message.success('Thêm thành công!')
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const onUpdate = async (values: any) => {
    const a = {...values, oldImages: fileListUpdate, images: fileList}
    console.log(a);
    const formData:any = new FormData();
    if (fileList) {
      fileList.map((value)=>{
        formData.append('images', value.originFileObj);
      })
    }
    if (fileListUpdate) {
      fileListUpdate.map((value)=>{
        formData.append('oldImages', value.uid);
      })
    }
    Object.entries(values).forEach(([key, value]:any)=>{
      console.log('key ', key, 'value ', value);  
      if (value) {
        formData.append(key, JSON.stringify(value))
      }
    })

    try {
      await axiosClient.patch(`/products/update/${selectedProduct.productId}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      getProducts();
      setSelectedProduct(null);
      message.success('Cập nhật thành công!');
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const handleRemove = async(productId:number) =>{
    try {
      await axiosClient.delete(`/products/remove/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      getProducts();
      message.success('Đã xóa!');
    } catch (error) {
      console.log('Error:', error);
    }
  }

    const handleDelete = async (productId: number) => {
    try {
      await axiosClient.delete(`/products/delete/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      getProducts();
      message.success('Đã xóa!')
    } catch (error) {
      message.error('Thao tác thất bại!')
      console.log(error);
    }
  }

  const handleRestore  = async (categoryId: number) => {
    try {
      await axiosClient.post(`/products/restore/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      getProducts();
      message.success('Khôi phục thành công!')
    } catch (error) {
      console.log(error);
      message.error('Thao tác thất bại!')
    }
  }

  const onDelete = async (productId: number) => {
    try {
      await axiosClient.delete(`/products/remove${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      getProducts();
      message.success('Product deleted successfully!');
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const columns = [
    {
      title: 'Tên món',
      dataIndex: 'name',
      key: 'name',
      width: '10%',
    },
    {
      title: 'Ảnh minh hoạ',
      dataIndex: 'image',
      key: 'image',
      width: '10%',
      render: (text: string, record: any, index: number) => {
        return record.images && record.images.map((value:any)=>{
          if (value.cover) {
            return <Image src={process.env.REACT_APP_API_BASE_URL +'/' + value.uri} fallback={process.env.REACT_APP_API_BASE_URL + '/ImgError.png'} />
          }
        })
      },
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      width: '7%',
      render: (text: string, record: any, index: number) => {
        return (record.category && <span>{record.category.name}</span>)
      },
    },
    {
      title: 'Nhà cung cấp',
      dataIndex: 'supplier',
      key: 'supplier',
      width: '7%',
      render: (text: string, record: any, index: number) => {
        return <span>{record.supplier?.name}</span>;
      },
    },
    {
      title: 'Size - Giá',
      dataIndex: 'productSizes',
      key: 'productSizes',
      with: '20%',
      children: [
       {
            title: 'Size',
            key: 'size',
            with: '1%',
            render: (text:string, record:any)=>{
                if (record.productSizes) {
                  return record.productSizes.map((value:any)=>{
                    return <div>{value.size.name}</div> 
                  })
                }
            }
        },
        {
            title: 'Giá',
            // dataIndex: '',
            key: 'quantity',
            with: '1%',
            render: (text:string, record:any)=>{
                if (record.productSizes) {
                  return record.productSizes.map((value:any)=>{
                    return <div>{numeral(value.price).format(',000')}đ</div> 
                  })
                }
            }
        },
        {
            title: 'Giảm giá',
            // dataIndex: 'productSizes.sizeId',
            key: 'discount',
            with: '1%',
            render: (text:string, record:any)=>{
                if (record.productSizes) {
                  return record.productSizes.map((value:any)=>{
                    return <div>{value.discount}%</div> 
                  })
                }
            }
        },
      ],
      width: '10%',
    },
    {
        title: 'Mô tả',
        dataIndex: 'description',
        key: 'description',
        with: '10%'
    },   
    {
      title: 'Ngày tạo - cập nhật gần nhất',      
      key: 'createAt',
      width: '10%',
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
      width: '10%',
      render: (text: any, record: any) => {
        if(deleted == 'all') {
          return (
            <Space size='small'>
            <Tooltip title="Chỉnh sửa">
              <Button
                type='primary'
                icon={<EditOutlined />}
                onClick={() => {
                  setSelectedProduct(record);
                  let tmp = record.images.map((value:any)=>{
                    return {
                    uid: value.imageId.toString(),
                    name: value.uri.split('-').pop(),
                    status: 'done',
                    url: process.env.REACT_APP_API_BASE_URL + '/' + value.uri,
                    cover: value.cover
                    }
                  }) 
                  setFileList([])
                  // setCover(record.map((value:any)=>))
                  const coverImage = record.images.map((value:any)=> {if(value.cover) return value.uri.split('-').pop()})
                  .find((item:any) => typeof item === 'string')
                  setCover(coverImage)
                  console.log(coverImage);  
                  setFileListUpdate(tmp)
                  updateForm.setFieldsValue(record);
                }}
              />
              </Tooltip>
              <Tooltip title="Xoá">
                <Button type='primary' danger icon={<DeleteOutlined />} onClick={()=>handleRemove(record.productId)} />
              </Tooltip>
            </Space>
          );
        } else {
          return (
              <Space size='small'>
                <Tooltip title="Khôi phục">
                  <Button
                      type='primary'
                      icon={<UndoOutlined />}
                      onClick={() => handleRestore(record.productId)}
                  />
                </Tooltip>
                <Tooltip title='Xóa Vĩnh viễn'>
                  <Popconfirm
                      title='Chắc chắn muốn xóa vĩnh viễn?'
                      icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                      onConfirm={() => {
                        handleDelete(record.productId);
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

  const checkNameUnique = debounce( async(cb:any, value: string, ignore?:string) => {
    try{
      await axiosClient.get(`/products/check/unique?field=name&value=${value}&ignore=${ignore}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      cb(undefined)
    } catch(error) {
      cb(true)
    }
  }, 500)

  return (
    <div style={{ padding: 36 }}>
      <Card title='Tạo món mới' style={{ width: '100%' }}>
        <Form form={createForm} name='create-product' labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} onFinish={onFinish}>
          {/* name */}
          <Form.Item<FieldType> label='Tên món' name='name' rules={[
              { required: true, message: 'Tên món là bắt buộc!' },
              {
                validator(rule, value, callback) {
                  checkNameUnique(callback, value)
                },message: 'Tên món đã tồn tại!'
              },
            ]} hasFeedback>
            <Input />
          </Form.Item>
          {/* categories */}
          <Form.Item<FieldType> name='categoryId' label='Danh mục' rules={[{ required: true, message: 'Danh mục là bắt buộc!'}]} hasFeedback>
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
          <Form.Item<FieldType> name='supplierId' label='Nhà cung cấp' rules={[{ required: true, message: 'Nhà cung cấp là bắt buộc!' }]} hasFeedback>
            <Select
              options={suppliers.map((item: any) => {
                return {
                  label: item.name,
                  value: item.supplierId,
                };
              })}
            />
          </Form.Item>
          <Form.Item<FieldType> name='statusId' label='Trạng thái' rules={[{ required: true, message: 'Trạng thái là bắt buộc!' }]} hasFeedback>
            <Select
              options={status.map((item: any) => {
                return {
                  label: item.name,
                  value: item.statusId,
                };
              })}
            />
          </Form.Item>
          {/* description */}
          <Form.Item<FieldType> label='Mô tả' name='description'>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Divider/>
            <Form.List name="productSize">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', gap:10, marginBottom: 8, marginLeft:250, marginRight:250, justifyContent: 'space-around'  }} align="baseline">
                      <Form.Item
                        label='Size'
                        {...restField}
                        labelCol={{span:500}}
                        name={[name, 'sizeId']}
                        rules={[{ required: true, message: 'Size là bắt buộc!' }]}
                      >
                       <Select
                         style={{minWidth: 100}}
                          options={sizes.map((item: any) => {
                            return {
                              label: item.name,
                              value: item.sizeId,
                            };
                          })}
                        />
                      </Form.Item>
                      <Form.Item
                        label='Giá'
                        labelCol={{span:500}}
                        {...restField}
                        name={[name, 'price']}
                        rules={[{ required: true, message: 'Giá là bắt buộc!' }]}
                      >
                        <InputNumber placeholder="Giá" min={0} suffix={'đ'} />
                      </Form.Item>  
                      <Form.Item
                        label='Giảm giá'
                        labelCol={{span:500}}
                        {...restField}
                        name={[name, 'discount']}
                      >
                        <InputNumber min={0} max={50} defaultValue={0} suffix={'%'} />
                      </Form.Item>
                      <Form.Item
                        label='Tồn kho'
                        labelCol={{span:500}}
                        {...restField}
                        name={[name, 'stock']}
                      >
                        <InputNumber min={0} max={999} defaultValue={0} />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item style={{alignItems:'center'}} label="Chi tiết món">
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      Thêm chi tiết
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
            <Divider/>
    <Form.Item name="images" label="Upload ảnh"
     valuePropName="fileList" getValueFromEvent={e => Array.isArray(e) ? e : e && [e.file]}>
      <Upload
        multiple
        maxCount={5}
        action="https://localhost:9999/upload"
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        beforeUpload={(file) => checkExist(file)}
      >
        {fileList.length >= 5 ? null : uploadButton}
      </Upload>
      {previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}
        </Form.Item>
        {fileList.length == 0 ? null : coverList}
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type='primary' htmlType='submit'>
              Thêm mới
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card title={
        <Space>
          Danh sách món
          <Radio.Group value={deleted} onChange={(e) => setDeleted(e.target.value)}>
            <Radio.Button style={{color: '#1677FF'}} value="all">Đang hoạt động</Radio.Button>
            <Radio.Button style={{color: 'red'}} value="deleted">Đã xóa</Radio.Button>
          </Radio.Group>
        </Space>
      } style={{ width: '100%', marginTop: 36 }}>
        <Table dataSource={products} columns={columns} />
      </Card>

      <Modal
        width={900} // Điều chỉnh chiều rộng của modal
        centered
        title='Chỉnh sửa món'
        open={selectedProduct}
        okText='Cập nhật'
        cancelText="Huỷ"
        onOk={() => {
          updateForm.submit();
        }}
        onCancel={() => {
          setSelectedProduct(null);
          setFileList([])
          setFileListUpdate([])
          setCover(null)
        }}
      >
        <Form form={updateForm} initialValues={selectedProduct?.productSize} name='update-product' labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} onFinish={onUpdate}>
          {/* name */}
          <Form.Item<FieldType> label='Tên món' name='name' rules={[
              { required: true, message: 'Tên món là bắt buộc!' },
              {
                validator(rule, value, callback) {
                  checkNameUnique(callback, value, selectedProduct.name);
                }, message: 'Tên món đã tồn tại!'
              },
            ]} hasFeedback>
            <Input />
          </Form.Item>
          {/* categories */}
          <Form.Item<FieldType> name='categoryId' label='Danh mục' rules={[{ required: true }]} hasFeedback>
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
          <Form.Item<FieldType> name='supplierId' label='Nhà cung cấp' rules={[{ required: true }]} hasFeedback>
            <Select
              options={suppliers.map((item: any) => {
                return {
                  label: item.name,
                  value: item.supplierId,
                };
              })}
            />
          </Form.Item>
           <Form.Item<FieldType> label='Mô tả' name='description'>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Divider/>
            <Form.List name="productSizes">
              {(fields, { add, remove }) => (
                <>

                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', gap:10, marginBottom: 8, justifyContent: 'space-around'  }} align="baseline">
                      <Form.Item
                        label='Size'
                        {...restField}
                        labelCol={{span:500}}
                        name={[name, 'sizeId']}
                        rules={[{ required: true, message: 'Size là bắt buộc!' }]}
                      >
                       <Select
                         style={{minWidth: 100}}
                          options={sizes.map((item: any) => {
                            return {
                              label: item.name,
                              value: item.sizeId,
                            };
                          })}
                        />
                      </Form.Item>
                      <Form.Item
                        label='Giá'
                        labelCol={{span:500}}
                        {...restField}
                        name={[name, 'price']}
                        rules={[{ required: true, message: 'Giá là bắt buộc!' }]}
                      >
                        <InputNumber placeholder="Giá" min={0} suffix={'đ'} />
                      </Form.Item>  
                      <Form.Item
                        label='Giảm giá'
                        labelCol={{span:500}}
                        {...restField}
                        name={[name, 'discount']}
                      >
                        <InputNumber min={0} max={50} defaultValue={0} suffix={'%'} />
                      </Form.Item>
                      <Form.Item
                        label='Tồn kho'
                        labelCol={{span:500}}
                        {...restField}
                        name={[name, 'stock']}
                      >
                        <InputNumber min={0} max={999} defaultValue={0} />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item style={{alignItems:'center'}} labelCol={{span:4}} label="Chi tiết món">
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      Thêm chi tiết
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
            <Divider/>
            <Form.Item name="oldImages" label="ảnh"
            valuePropName="fileList" getValueFromEvent={e => Array.isArray(e) ? e : e && [e.file]}>
              <Upload
                multiple
                maxCount={5}
                listType="picture-card"
                fileList={fileListUpdate}
                onPreview={handlePreview}
                onChange={handleChangeUpdate}
                beforeUpload={(file) => checkExist(file)}
              >
              </Upload>
              {previewImage && (
                <Image
                  wrapperStyle={{ display: 'none' }}
                  preview={{
                    visible: previewOpen,
                    onVisibleChange: (visible) => setPreviewOpen(visible),
                    afterOpenChange: (visible) => !visible && setPreviewImage(''),
                  }}
                  src={previewImage}
                />
              )}
              </Form.Item>
              <Form.Item name="images" label="Upload ảnh mới"
                valuePropName="fileList" getValueFromEvent={e => Array.isArray(e) ? e : e && [e.file]}>
              <Upload
                multiple
                maxCount={5-fileListUpdate.length}
                action="https://localhost:9999/upload"
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                beforeUpload={(file) => checkExist(file)}
              >
                {(fileListUpdate.length + fileList.length) >= 5 ? null : uploadButton}
              </Upload>
              {previewImage && (
                <Image
                  wrapperStyle={{ display: 'none' }}
                  preview={{
                    visible: previewOpen,
                    onVisibleChange: (visible) => setPreviewOpen(visible),
                    afterOpenChange: (visible) => !visible && setPreviewImage(''),
                  }}
                  src={previewImage}
                />
              )}
              </Form.Item>
              {coverList}
        </Form>
      </Modal>
    </div>
  );
}

