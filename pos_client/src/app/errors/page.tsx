// components/SubLayout.js
import { Button, Result } from "antd";
import React from "react";

const Error = () => {
  return (
    <div className="fixed top-0 right-0 left-0 bottom-0 bg-[#ffba00]">
      <h1 className="inline-block h-full w-full text-center items-baseline">
        Mã QR không đúng hoặc đã hết hạn
      </h1>
    </div>
  );
};

export default Error;
