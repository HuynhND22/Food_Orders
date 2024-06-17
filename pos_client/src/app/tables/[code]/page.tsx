"use client";

import React from "react";
import base64url from "base64url";
import axiosClient from "../../../../configs/axiosClient";
import { useRouter } from "next/navigation";
import { Spin } from "antd";
import Cookies from "js-cookie";

const Table = ({ params: { code } }: any) => {
  const router = useRouter();
  const contentStyle: React.CSSProperties = {
    padding: 50,
    background: "rgba(0, 0, 0, 0.05)",
    borderRadius: 4,
  };
  const content = <div style={contentStyle} />;
  let a = base64url.decode(code);
  axiosClient
    .get(`tables/name/${a}`)
    .then((response: any) => {
      Cookies.set("table", JSON.stringify(response.data));
      router.push("/");
    })
    .catch((error: any) => {
      Cookies.remove("table");
      router.push("/errors");
    });
  return (
    <Spin
      tip="Chờ một chút..."
      // className="bg-[#ffba00]"
      size="large"
      fullscreen
    >
      {content}
    </Spin>
  );
};

export default Table;
