
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Categories from '../../pages/categories';
import Suppliers from '../../pages/suppliers';
import Products from '../../pages/products';
import Orders from '../../pages/orders';
import Promotions from '../../pages/promotions';
import Users from '../../pages/users';
import Styles from '../../styles/layout/layout.module.css'
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Space } from 'antd';

function Layout() {
  return (
    <div className={Styles.container}>
      <Router>
        <nav>
          <div>
          <span>
          <Space direction="vertical" size={10}>
            <Space wrap size={16}></Space>
            <Avatar size={64} icon={<UserOutlined />} />
          </Space>
          </span>
          </div>
          <div className={Styles.item}>
            <Link to="/">Categories</Link>
            <Link to="/suppliers">Suppliers</Link>
            <Link to="/products">Products</Link>
            <Link to="/orders">Orders</Link>
            <Link to="/promotions">Promotions</Link>
            <Link to="/users">Users</Link>
          </div>
        </nav>
        <h1>Admin Management</h1>
        <Routes>
          <Route path="/" element={<Categories />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/promotions" element={<Promotions />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </Router>
    </div>
  );
}

export default Layout;
