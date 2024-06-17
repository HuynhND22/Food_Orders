import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  Space,
  Table,
  Popconfirm,
  message,
  Modal,
  Select,
  Tooltip,
  Radio,
} from "antd";
import { useRequest } from "ahooks";
import {
  DeleteOutlined,
  EditOutlined,
  QuestionCircleOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import { DatePicker } from "antd";
import axiosClient from "../configs/axiosClient";
import { FieldType } from "../types/suppliers/index";
import { Option } from "antd/es/mentions";
import dayjs from "dayjs";
import { debounce } from "ahooks/es/utils/lodash-polyfill";

// Custom hook for using the name uniqueness check
export default function Suppliers(props: {}) {
  const [categories, setCategories] = useState<FieldType[]>([]);
  const [suppliers, setSuppliers] = useState<FieldType[]>([]);
  const [status, setStatus] = useState<FieldType[]>([]);
  const [wards, setWards] = useState<FieldType[]>([]);
  const [districts, setDistricts] = useState<FieldType[]>([]);
  const [provinces, setProvinces] = useState<FieldType[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [deleted, setDeleted] = React.useState<"all" | "deleted">("all");
  const [createForm] = Form.useForm<FieldType>();
  const [updateForm] = Form.useForm<FieldType>();

  const getSuppliers = async () => {
    try {
      const response = await axiosClient.get(`/suppliers/${deleted}`);
      setSuppliers(response.data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  React.useEffect(() => {
    getSuppliers();
  }, [deleted]);

  const getData = async () => {
    try {
      const [status, provinces] = await Promise.all([
        axiosClient.get("/status/suppliers"),
        axiosClient.get("/address/provinces"),
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
    const districts = await axiosClient.get(`/address/districts/${provinceId}`);
    if (districts) {
      setDistricts(districts.data);
    } else {
      setDistricts([]);
    }
  };
  const getWards = async (districtId: number) => {
    const wards = await axiosClient.get(`/address/wards/${districtId}`);
    if (wards) {
      setWards(wards.data);
    } else {
      setWards([]);
    }
  };

  const onFinish = async (values: any) => {
    try {
      console.log(values);
      console.log("Success:", values);
      await axiosClient.post("/suppliers/create", values);
      getSuppliers();
      createForm.resetFields();
      message.success("Tạo mới thành công!");
    } catch (error) {
      message.error("Tạo mới thất bại!");
      console.log("Error:", error);
    }
  };

  const onDelete = async (supplierId: number) => {
    try {
      await axiosClient.delete(`/suppliers/${supplierId}`);
      getSuppliers();
      message.success("Đã xóa!");
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const onUpdate = async (values: any) => {
    try {
      console.log("Success:", values);
      await axiosClient.patch(
        `/suppliers/update/${selectedSupplier.supplierId}`,
        values
      );
      getSuppliers();
      setSelectedSupplier(null);
      message.success("Cập nhật thành công!");
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleRemove = async (categoryId: number) => {
    try {
      await axiosClient.delete(`/suppliers/remove/${categoryId}`);
      getSuppliers();
      message.success("Đã xóa!");
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleDelete = async (categoryId: number) => {
    try {
      await axiosClient.delete(`/suppliers/delete/${categoryId}`);
      getSuppliers();
      message.success("Đã xóa!");
    } catch (error) {
      message.error("Thao tác thất bại!");
      console.log(error);
    }
  };

  const handleRestore = async (categoryId: number) => {
    try {
      await axiosClient.post(`/suppliers/restore/${categoryId}`);
      getSuppliers();
      message.success("Khôi phục thành công!");
    } catch (error) {
      console.log(error);
      message.error("Thao tác thất bại!");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "supplierId",
      key: "supplierId",
      width: "1%",
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "name",
      key: "name",
      width: "10%",
    },
    {
      title: "Trạng thái",
      dataIndex: "statusId",
      key: "statusId",
      render: (text: string, record: any, index: number) => {
        return (
          <span>
            {status.map((value) => {
              if (value.statusId == record.statusId) return value.name;
            })}
          </span>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Địa chỉ",
      key: "address",
      render: (text: string, record: any) => {
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
      },
    },
    {
      title: deleted === "all" ? "Ngày tạo - Cập nhật gần nhất" : "Ngày xoá",
      key: "createdAt",
      render: (text: any, record: any) => {
        if (deleted == "all") {
          return (
            <span>
              {dayjs(record.createdAt).format("HH:mm DD/MM/YYYY")} -{" "}
              {dayjs(record.updatedAt).format("HH:mm DD/MM/YYYY")}
            </span>
          );
        } else {
          return (
            <span>{dayjs(record.deletedAt).format("HH:mm DD/MM/YYYY")}</span>
          );
        }
      },
    },

    {
      title: "Thao tác",
      dataIndex: "actions",
      key: "actions",
      width: "1%",
      render: (text: any, record: any) => {
        if (deleted == "all") {
          return (
            <Space size="small">
              <Tooltip title="Chỉnh sửa">
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => {
                    setSelectedSupplier(record);
                    let form = {
                      ...record,
                      provinceId: record.ward?.district?.province?.provinceId,
                      districtId: record.ward?.district?.districtId,
                    };
                    if (form.provinceId) {
                      getDistricts(form.provinceId);
                    } else {
                      setDistricts([]);
                    }
                    if (form.districtId) {
                      getWards(form.districtId);
                    } else {
                      setWards([]);
                    }
                    updateForm.setFieldsValue(form);
                  }}
                />
              </Tooltip>
              <Tooltip title="Xóa">
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemove(record.supplierId)}
                />
              </Tooltip>
            </Space>
          );
        } else if (deleted == "deleted") {
          return (
            <Space size="small">
              <Tooltip title="Khôi phục">
                <Button
                  type="primary"
                  icon={<UndoOutlined />}
                  onClick={() => handleRestore(record.supplierId)}
                />
              </Tooltip>
              <Tooltip title="Xóa Vĩnh viễn">
                <Popconfirm
                  title="Chắc chắn muốn xóa vĩnh viễn?"
                  icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                  onConfirm={() => {
                    handleDelete(record.supplierId);
                  }}
                >
                  <Button type="primary" danger icon={<DeleteOutlined />} />
                </Popconfirm>
              </Tooltip>
            </Space>
          );
        }
      },
    },
  ];

  const checkNameUnique = debounce(
    async (cb: any, value: string, ignore?: string) => {
      try {
        await axiosClient.get(
          `/suppliers/check/unique?field=name&value=${value}&ignore=${ignore}`
        );
        cb(undefined);
      } catch (error) {
        cb(true);
      }
    },
    500
  );
  const checkEmailUnique = debounce(
    async (cb: any, value: string, ignore?: string) => {
      try {
        await axiosClient.get(
          `/suppliers/check/unique?field=email&value=${value}&ignore=${ignore}`
        );
        cb(undefined);
      } catch (error) {
        cb(true);
      }
    },
    500
  );
  const checkPhoneNumberUnique = debounce(
    async (cb: any, value: string, ignore?: string) => {
      try {
        await axiosClient.get(
          `/suppliers/check/unique?field=phoneNumber&value=${value}&ignore=${ignore}`
        );
        cb(undefined);
      } catch (error) {
        cb(true);
      }
    },
    500
  );

  return (
    <div style={{ padding: 36 }}>
      <Card title="Thêm Nhà cung cấp mới" style={{ width: "100%" }}>
        <Form
          form={createForm}
          name="create-supplier"
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 12 }}
          onFinish={(value) => onFinish(value)}
        >
          <Form.Item<FieldType>
            label="Name"
            labelCol={{ span: 6 }}
            name="name"
            rules={[
              { required: true, message: "Tên nhà cung cấp là bắt buộc!" },
              {
                validator(rule, value, callback) {
                  checkNameUnique(callback, value);
                },
                message: "Nhà cung cấp đã tồn tại!",
              },
            ]}
            hasFeedback
          >
            <Input />
          </Form.Item>
          <Form.Item labelCol={{ span: 6 }} label="Address">
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
                  style={{ width: "300px" }}
                  placeholder="Địa chỉ cụ thể"
                />
              </Form.Item>
            </Space>
          </Form.Item>
          <Form.Item<FieldType>
            name="statusId"
            labelCol={{ span: 6 }}
            label="status"
            hasFeedback
            rules={[{ required: true }]}
          >
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
            label="Email"
            labelCol={{ span: 6 }}
            name="email"
            rules={[
              { required: true, message: "Email là bắt buộc!" },
              { type: "email", message: "Địa chỉ email chưa chính xác!" },
              {
                validator: (rule, value, callback) => {
                  checkEmailUnique(callback, value);
                },
                message: "Email đã tồn tại!",
              },
            ]}
            hasFeedback
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="Phone Number"
            labelCol={{ span: 6 }}
            name="phoneNumber"
            rules={[
              { required: true, message: "Số điện thoại là bắt buộc!" },
              {
                pattern: /^\d{10,11}$/,
                message: "Please enter a valid phone number!",
              },
              {
                validator: (rule, value, callback) => {
                  checkPhoneNumberUnique(callback, value);
                },
                message: "Số điện thoại đã tồn tại!",
              },
            ]}
            hasFeedback
          >
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
            <Button type="primary" htmlType="submit">
              Tạo mới
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card
        title={
          <Space>
            Danh sách nhà cung cấp
            <Radio.Group
              value={deleted}
              onChange={(e) => setDeleted(e.target.value)}
            >
              <Radio.Button style={{ color: "#1677FF" }} value="all">
                Đang hoạt động
              </Radio.Button>
              <Radio.Button style={{ color: "red" }} value="deleted">
                Đã xóa
              </Radio.Button>
            </Radio.Group>
          </Space>
        }
        style={{ width: "100%", marginTop: 36 }}
      >
        <Table dataSource={suppliers} columns={columns} />
      </Card>

      <Modal
        centered
        title="Chỉnh sửa danh mục"
        open={selectedSupplier}
        okText="Cập nhật"
        onOk={() => {
          updateForm.submit();
        }}
        onCancel={() => {
          setSelectedSupplier(null);
        }}
      >
        <Form
          form={updateForm}
          name="update-supplier"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={onUpdate}
        >
          <Form.Item<FieldType>
            label="Name"
            labelCol={{ span: 6 }}
            name="name"
            rules={[
              { required: true, message: "Tên nhà cung cấp là bắt buộc!" },
              {
                validator(rule, value, callback) {
                  checkNameUnique(callback, value, selectedSupplier.name);
                },
                message: "Nhà cung cấp đã tồn tại!",
              },
            ]}
            hasFeedback
          >
            <Input />
          </Form.Item>
          <Form.Item labelCol={{ span: 6 }} label="Địa chỉ">
            <Space>
              <Form.Item noStyle name={"provinceId"}>
                <Select
                  style={{ width: "150px" }}
                  placeholder="Tỉnh/Thành phố"
                  onChange={(value: number) => getDistricts(value)}
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
              <Form.Item noStyle name={"districtId"}>
                <Select
                  style={{ width: "160px" }}
                  placeholder="Quận/Huyện"
                  onChange={(value) => getWards(value)}
                >
                  {districts &&
                    districts.map((value: any) => {
                      return (
                        <Option key={value.districtId} value={value.districtId}>
                          {value.name}
                        </Option>
                      );
                    })}
                </Select>
              </Form.Item>
            </Space>
            <Space style={{ margin: "10px 0 0 0" }}>
              <Form.Item<FieldType> name={"wardId"} noStyle>
                <Select placeholder="Phường/Xã" style={{ width: "150px" }}>
                  {wards &&
                    wards.map((value: any) => {
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
                  style={{ width: "160px" }}
                  placeholder="Địa chỉ cụ thể"
                />
              </Form.Item>
            </Space>
          </Form.Item>
          <Form.Item<FieldType>
            name="statusId"
            labelCol={{ span: 6 }}
            label="Trạng thái"
            rules={[{ required: true }]}
            hasFeedback
          >
            <Select
              options={status.map((item: any) => {
                // console.log({label: item.name, value: item.statusId});
                return {
                  label: item.name,
                  value: item.statusId,
                };
              })}
            />
          </Form.Item>
          <Form.Item<FieldType>
            label="Email"
            labelCol={{ span: 6 }}
            name="email"
            rules={[
              { required: true, message: "Email là bắt buộc!" },
              { type: "email", message: "Địa chỉ email chưa chính xác!" },
              {
                validator(rule, value, callback) {
                  checkEmailUnique(callback, value, selectedSupplier.email);
                },
                message: "Email đã tồn tại!",
              },
            ]}
            hasFeedback
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="Phone Number"
            labelCol={{ span: 6 }}
            name="phoneNumber"
            rules={[
              { required: true, message: "Số điện thoại là bắt buộc!" },
              {
                pattern: /^\d{10,11}$/,
                message: "Số điện thoại chưa chính xác!",
              },
              {
                validator(rule, value, callback) {
                  checkPhoneNumberUnique(
                    callback,
                    value,
                    selectedSupplier.phoneNumber
                  );
                },
                message: "Số điện thoại đã tồn tại!",
              },
            ]}
            hasFeedback
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
