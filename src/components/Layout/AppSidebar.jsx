import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { ROUTES } from "@config/constants";

const { Sider } = Layout;

function AppSidebar({ collapsed, onCollapse }) {
  const location = useLocation();

  // Menu items
  const menuItems = [
    {
      key: ROUTES.DASHBOARD,
      icon: <DashboardOutlined />,
      label: "หน้าแรก",
    },
    {
      key: ROUTES.DATA_MANAGEMENT,
      icon: <DatabaseOutlined />,
      label: "ข้อมูลหลัก",
    },
    {
      key: ROUTES.REPORTS,
      icon: <FileTextOutlined />,
      label: "รายงาน",
    },
    {
      key: ROUTES.SETTINGS,
      icon: <SettingOutlined />,
      label: "ตั้งค่า",
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      style={{
        background: "linear-gradient(180deg, #4a90e2 0%, #2c5aa0 100%)",
        boxShadow: "2px 0 8px rgba(74, 144, 226, 0.15)",
      }}
      theme="light"
    >
      {/* Logo */}
      <div
        style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(255, 255, 255, 0.1)",
          marginBottom: 8,
        }}
      >
        <div
          style={{
            fontSize: collapsed ? "20px" : "24px",
            transition: "all 0.3s",
            color: "#ffffff",
            fontWeight: "bold",
          }}
        >
          {collapsed ? "🏛️" : "🏛️ RaiDai2025"}
        </div>
      </div>

      {/* Menu */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        style={{
          background: "transparent",
          border: "none",
        }}
        onClick={({ key }) => {
          window.location.pathname = key;
        }}
      />
    </Sider>
  );
}

export default AppSidebar;
