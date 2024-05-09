"use client";

import {} from "next/font/google";
import React from "react";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import {
  Breadcrumb,
  Divider,
  Layout,
  Menu,
  theme,
  Button,
  Drawer,
  FloatButton,
} from "antd";
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { FiBell } from "react-icons/fi";
import { IconBase } from "react-icons";
import { LuAccessibility } from "react-icons/lu";
import { BsCart, BsList, BsPerson } from "react-icons/bs";
import { BiHome } from "react-icons/bi";
import Search from "antd/es/input/Search";

const { Content } = Layout;

export default function SocialProfileWithImage() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(0);
  const onClose = () => {
    setOpen(false);
  };

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <main className="p-5 bg-white relative">
      <header className=" bg-[#000]">
        <div className=" w-[100%] bg-[#FFBA00] text-center p-1 flex justify-center items-center sticky">
          <img
            src="/images/logo/logo-transparent.png"
            alt="logo order food"
            className="w-[30%] h-[30%]"
          />
        </div>
      </header>

      <div className="bg-[#FFBA00] w-[100%] h-10 sticky top-0">
        <Search placeholder="Tìm kiếm" className="h-10 m-1 pl-5 pr-14" />
      </div>
      {/* <Container> */}
      <Layout>
        <Content style={{ padding: "0 48px" }}>
          <Layout
            style={{
              padding: "24px 0",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <FloatButton onClick={toggleDrawer(true)} icon={<BsCart />} />
            <Drawer title="Basic Drawer" onClose={onClose} open={open}>
              <div className="text-black">
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
              </div>
            </Drawer>
            <Content style={{ padding: "0 24px", minHeight: 8000 }}>
              Content
            </Content>
          </Layout>
        </Content>
        <Box className="sticky w-auto right-0 left-0 bottom-0 transition-transform">
          <BottomNavigation
            showLabels
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
          >
            <BottomNavigationAction label="Home" icon={<BiHome />} />
            <BottomNavigationAction label="Categories" icon={<BsList />} />
            <BottomNavigationAction label="Profile" icon={<BsPerson />} />
          </BottomNavigation>
        </Box>
      </Layout>
      {/* </Container> */}
    </main>
  );
}
