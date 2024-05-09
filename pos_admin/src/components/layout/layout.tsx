import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { Layout, Menu, Breadcrumb, theme } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Badge, Space } from 'antd';
import Categories from '../../pages/categories';
import Suppliers from '../../pages/suppliers';
import Products from '../../pages/products';
import Order from '../../pages/orders';
import Promotion from '../../pages/promotions';
import User from '../../pages/users'

const { Header, Content, Footer } = Layout;

const menuItems = [
  { key: '1', label: 'Categories', path: '/' },
  { key: '2', label: 'Suppliers', path: '/suppliers' },
  { key: '3', label: 'Products', path: '/products' },
  { key: '4', label: 'Orders', path: '/oders' },
  { key: '5', label: 'Promotions', path: '/promotions' },
  { key: '6', label: 'Users', path: '/user' },
  // Add more menu items as needed
];

const App: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Router>
      <Layout>
        <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="demo-logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            style={{ flex: 1, minWidth: 0 }}
          >
            {menuItems.map(item => (
              <Menu.Item key={item.key}>
                <Link to={item.path}>{item.label}</Link>
              </Menu.Item>
            ))}
          </Menu>
        </Header>
        <Content className="app-content">
          <Breadcrumb style={{ margin: '16px 0', fontSize: '25px' }}>
            <Breadcrumb.Item>Admin
            <Avatar size={30} icon={<UserOutlined />} />
            </Breadcrumb.Item>
         

          </Breadcrumb>
          <div
            className="content-wrapper"
            style={{ background: colorBgContainer, minHeight: 280, padding: 24, borderRadius: borderRadiusLG }}
          >
            <Switch>
              <Route exact path="/" component={Categories} />
              <Route path="/suppliers" component={Suppliers} />
              <Route path="/products" component={Products} />
              <Route path="/oders" component={Order} />
              <Route path="/promotions" component={Promotion} />
              <Route path="/user" component={User} />
            </Switch>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Ant Design ©{new Date().getFullYear()} Created by Your Company
        </Footer>
      </Layout>
    </Router>
  );
};

export default App;
