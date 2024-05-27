"use client";

import React from "react";
import base64url from "base64url";
import axiosClient from "../../../../configs/axiosClient";
import { useRouter } from "next/navigation";
import { Spin } from "antd";

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
      localStorage.setItem("table", JSON.stringify(response.data));
      router.push("/");
    })
    .catch((error: any) => {
      router.push("/errors");
    });
  console.log(localStorage.getItem("table"));
  return (
    <div className="bg-[#ffba00]">
      <Spin
        tip="Chờ một chút..."
        className="bg-[#ffba00]"
        size="large"
        fullscreen
      >
        {content}
      </Spin>
    </div>
  );
};

export default Table;
