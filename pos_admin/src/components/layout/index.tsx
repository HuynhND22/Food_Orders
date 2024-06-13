import React from "react";
import { BrowserRouter as Router, Route, Routes, Link,useNavigate } from "react-router-dom";
import Categories from "../../pages/categories";
import Suppliers from "../../pages/suppliers";
import Products from "../../pages/products";
import Orders from "../../pages/orders";
import Promotions from "../../pages/promotions";
import Users from "../../pages/users";
import Tables from "../../pages/tables";
import Styles from "../../styles/layout/layout.module.css";
import { UserOutlined } from "@ant-design/icons";
import {Avatar, Button, Space} from "antd";
import NotPermisstion from "../../pages/notPermisstion";

function Layout() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem('accessToken')
    sessionStorage.removeItem('accessToken')
    localStorage.removeItem('user')
    sessionStorage.removeItem('user')
    navigate('/login')
  }
  return (
    <div className={Styles.container}>
      {/*<Router>*/}
        <nav>
          <div>
            <span>
              <Space direction="horizontal" size={10}>
                <Space wrap size={16}></Space>
                <Avatar size={64} icon={<UserOutlined />} />
              </Space>
            </span>
          </div>
          <div className={Styles.item}>
            <Link to="/">Danh mục</Link>
            <Link to="/tables">Bàn</Link>
            <Link to="/suppliers">Nhà cung cấp</Link>
            <Link to="/products">Món ăn</Link>
            <Link to="/orders">Đơn gọi món</Link>
            <Link to="/promotions">Khuyến mãi</Link>
            <Link to="/users">Người dùng</Link>
            <Button onClick={()=>logout()}>Đăng xuất</Button>
          </div>
        </nav>
        <h1>Admin Management</h1>
        <Routes>
          <Route path="/" element={<Categories />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/tables" element={<Tables />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/promotions" element={<Promotions />} />
          <Route path="/users" element={<Users />} />
          <Route path="/not-permission" element={<NotPermisstion />} />
        </Routes>
      {/*</Router>*/}
    </div>
  );
}

export default Layout;
