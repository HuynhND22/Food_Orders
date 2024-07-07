import React from "react";
import { BrowserRouter as Router, Route, Routes, Link,useNavigate } from "react-router-dom";
import Categories from "../../pages/categories";
import Suppliers from "../../pages/suppliers";
import Products from "../../pages/products";
import Orders from "../../pages/orders";
import Promotions from "../../pages/promotions";
import Users from "../../pages/users";
import Tables from "../../pages/tables";
import Banks from "../../pages/banks";
import Home from "../../pages/home";
import Styles from "../../styles/layout/layout.module.css";
import { HomeOutlined } from "@ant-design/icons";
import {Avatar, Button, Space, Breadcrumb} from "antd";
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
  const user:any = localStorage.getItem('user') ?? sessionStorage.getItem('user')
  const name = JSON.parse(user).name

  const isAdmin = JSON.parse(user).role

       

  return (
    <div className={Styles.container}>
      {/*<Router>*/}
        <nav>
          <div>
            <span>
              <Space direction="horizontal" size={10}>
                <Space wrap size={16}></Space>
                <Avatar size={64} icon={<HomeOutlined onClick={()=>{navigate('/')}} />} />
                <div style={{color:'white'}}>
                {
                  name
                }
                </div>
              </Space>
            </span>
          </div>
          <div className={Styles.item}>
            {
              isAdmin == "Quản trị viên" && <Link to="/categories">Danh mục</Link>
            }
            {
              isAdmin == "Quản trị viên" && <Link to="/tables">Bàn</Link>
            }
            {
              isAdmin == "Quản trị viên" && <Link to="/suppliers">Nhà cung cấp</Link>
            }
            {
              isAdmin == "Quản trị viên" && <Link to="/products">Món ăn</Link>
            }
            {
              isAdmin == "Quản trị viên" && <Link to="/orders">Đơn gọi món</Link>
            }
            {
              isAdmin == "Quản trị viên" && <Link to="/promotions">Khuyến mãi</Link>
            }
            {
              isAdmin == "Quản trị viên" && <Link to="/users">Người dùng</Link>
            }
            {
              isAdmin == "Quản trị viên" && <Link to="/banks">Thông tin ngân hàng</Link>
            }
            
            <div style={{ margin:10, marginLeft:100 }}>
              <Button onClick={()=>logout()}>Đăng xuất</Button>
            </div>
          </div>
        </nav>
        <h2>
       
        </h2>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/tables" element={<Tables />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/promotions" element={<Promotions />} />
          <Route path="/users" element={<Users />} />
          <Route path="/banks" element={<Banks />} />
          <Route path="/not-permission" element={<NotPermisstion />} />
        </Routes>
      {/*</Router>*/}
    </div>
  );
}

export default Layout;
