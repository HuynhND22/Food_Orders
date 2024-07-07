"use client";

import React from "react";
import { Layout, theme, ConfigProvider  } from "antd";
import Search from "antd/es/input/Search";
import Header from "./header";
import Nav from "./navMenu";
import Cart from "./cart";
import { useRouter } from "next/navigation";

const { Content } = Layout;

export default function Master({ children }: any) {
  const router = useRouter();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const onSearch = (value:string) => {
    if (value.trim()) {
      router.push(`/categories?search=${encodeURIComponent(value)}`);
    }
  }

  return (
 <ConfigProvider
    theme={{
      token: {
        colorPrimary: '#ffba00',
      },
    }}
  >
    <main className=" bg-slate-400 relative rounded-lg">
      <Header />
      <div className="bg-[#ffba00] w-[100%] h-18 sticky top-0 mt-16 z-20">
        <Search placeholder="Tìm kiếm" className=" pb-4 p-5" onSearch={(value:string)=>onSearch(value)} />
      </div>
      <Layout>
        <Content style={{ padding: "" }}>
          <Layout
            style={{
              padding: "24px 0",
              borderRadius: borderRadiusLG,
            }}
          >
            <Cart />
            <Content style={{ padding: "0 24px", minHeight: 800,
             // background: '#F0FFF0'
           }}>
              <main className='pb-8'>{children}</main>
            </Content>
          </Layout>
        </Content>
        <Nav />
      </Layout>
    </main>
      </ConfigProvider>
  );
}
