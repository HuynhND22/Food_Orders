"use client";

import React from "react";
import { Layout, theme } from "antd";
import Search from "antd/es/input/Search";
import Header from "./header";
import Nav from "./navMenu";
import Cart from "./cart";

const { Content } = Layout;

export default function Master({ children }: any) {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <main className=" bg-white relative rounded-lg">
      <Header />

      <div className="bg-[#ffba00] w-[100%] h-18 sticky top-0 mt-16 z-20">
        <Search placeholder="Tìm kiếm" className=" pb-4 p-5" />
      </div>
      <Layout>
        <Content style={{ padding: "" }}>
          <Layout
            style={{
              padding: "24px 0",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Cart />
            <Content style={{ padding: "0 24px", minHeight: 8000 }}>
              <main>{children}</main>
            </Content>
          </Layout>
        </Content>
        <Nav />
      </Layout>
    </main>
  );
}
