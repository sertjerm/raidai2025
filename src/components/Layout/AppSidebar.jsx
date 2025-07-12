import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu } from "antd";
import {
  BookOutlined,
  EditOutlined,
  BarChartOutlined,
  DatabaseOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { MENU_ITEMS } from "@config/constants";

const { Sider } = Layout;

function AppSidebar({ collapsed, onCollapse, user }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Filter menu items based on user role
  const getVisibleMenuItems = () => {
    return MENU_ITEMS.filter((item) => {
      // If item requires admin access and user is not admin, hide it
      if (item.adminOnly && user?.userid !== "admin") {
        return false;
      }
      return true;
    }).map((item) => ({
      key: item.path,
      icon: getMenuIcon(item.icon),
      label: item.label,
    }));
  };

  // Get icon component from string
  const getMenuIcon = (iconName) => {
    const icons = {
      BookOutlined: <BookOutlined />,
      EditOutlined: <EditOutlined />,
      BarChartOutlined: <BarChartOutlined />,
      DatabaseOutlined: <DatabaseOutlined />,
      SettingOutlined: <SettingOutlined />,
    };
    return icons[iconName] || <EditOutlined />;
  };

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
        items={getVisibleMenuItems()}
        style={{
          background: "transparent",
          border: "none",
        }}
        onClick={({ key }) => {
          navigate(key);
        }}
      />
    </Sider>
  );
}

export default AppSidebar;
