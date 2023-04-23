import { Menu } from "antd";
import React, { useState } from "react";
import { UserOutlined, SettingOutlined } from "@ant-design/icons";
import { getItem } from "../../until";
import AdminUser from "../../components/AdminUser/AdminUser";
import AdminProduct from "../../components/AdminProduct/AdminProduct";

const rootSubmenuKeys = ["user", "product"];
const AdminPage = () => {
  const [openKeys, setOpenKeys] = useState(["user"]);
  const [keySelected, setKeySelected] = useState("");

  const renderPage = (key) => {
    switch (key) {
      case "user":
        return <AdminUser />;
      case "product":
        return <AdminProduct />;
      default:
        return;
    }
  };
  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const handleOnClick = ({ key }) => {
    setKeySelected(key);
  };

  console.log({ keySelected });
  const items = [
    getItem("Quản lý người dùng", "user", <UserOutlined />),
    getItem("Quản lý sản phẩm", "product", <SettingOutlined />),
  ];
  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <Menu
        openKeys={openKeys}
        onClick={handleOnClick}
        style={{
          width: 256,
          boxShadow: "1px 1px 2px #ccc",
          height: "100vh",
        }}
        onOpenChange={onOpenChange}
        mode="inline"
        items={items}
      />
      <div style={{ flex: 1 , padding: "15px"}}>{renderPage(keySelected)}</div>
    </div>
  );
};

export default AdminPage;
