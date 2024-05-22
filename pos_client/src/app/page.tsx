"use client";

import React from "react";
import Master from "../components/layouts/master";
import { Modal, Upload } from "antd";
import { Icon } from "@chakra-ui/icons";
import { BiPlus } from "react-icons/bi";

const Home = () => {
  const [imageUrl, setImageUrl] = React.useState("");
  return (
    <Master>
      <aside>
        <h2>Home</h2>
        <div className="clearfix">
          <Upload
            className="avatar-uploader"
            name="avatar"
            showUploadList={false}
            action="//jsonplaceholder.typicode.com/posts/"
          >
            {imageUrl ? (
              <img
                src={"http://localhost:9999/qrcode/tables/ban2.png"}
                alt=""
                className="avatar"
              />
            ) : (
              <BiPlus />
            )}
          </Upload>
        </div>
      </aside>
    </Master>
  );
};

export default Home;
