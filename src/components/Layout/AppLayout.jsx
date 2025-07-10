import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Typography,
  Button,
  Space,
  Breadcrumb,
} from "antd";
import {
  DashboardOutlined,
  DatabaseOutlined,
  EditOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { ROUTES, APP_CONFIG } from "@config/constants";
import AppHeader from "./AppHeader";

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;

// Main Layout Component for logged-in users
function AppLayout({ user, onLogout, children }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Menu items based on your constants
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
      key: ROUTES.DATA_UPDATE,
      icon: <EditOutlined />,
      label: "ปรับปรุงข้อมูล",
    },
    {
      key: ROUTES.SETTINGS,
      icon: <SettingOutlined />,
      label: "ตั้งค่า",
    },
  ];

  // Get breadcrumb based on current path
  const getBreadcrumb = () => {
    const breadcrumbMap = {
      [ROUTES.DATA_UPDATE]: [
        { title: <HomeOutlined /> },
        { title: "ปรับปรุงข้อมูล" },
      ],
      [ROUTES.DASHBOARD]: [
        { title: <HomeOutlined /> },
        { title: "ปรับปรุงข้อมูล" },
        { title: "หน้าแรก" },
      ],
      [ROUTES.DATA_MANAGEMENT]: [
        { title: <HomeOutlined /> },
        { title: "ปรับปรุงข้อมูล" },
        { title: "ข้อมูลหลัก" },
      ],
      [ROUTES.SETTINGS]: [
        { title: <HomeOutlined /> },
        { title: "ปรับปรุงข้อมูล" },
        { title: "ตั้งค่า" },
      ],
    };
    return breadcrumbMap[location.pathname] || [{ title: <HomeOutlined /> }];
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        style={{
          background: "linear-gradient(180deg, #4a90e2 0%, #2c5aa0 100%)",
          boxShadow: "2px 0 8px rgba(74, 144, 226, 0.15)",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1001,
        }}
        theme="light"
        width={200}
        collapsedWidth={80}
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
            {collapsed ? "🏛️" : "🏛️ RD2025"}
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
            fontSize: "14px",
          }}
          onClick={({ key }) => {
            navigate(key);
          }}
          // Custom styles for menu items
          className="custom-sidebar-menu"
        />
      </Sider>

      {/* Main Layout */}
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 200,
          transition: "margin-left 0.2s",
        }}
      >
        {/* Header */}
        <AppHeader user={user} onLogout={onLogout} />

        {/* Content */}
        <Content
          style={{
            margin: 0,
            background: "linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%)",
            minHeight: "100vh",
            paddingBottom: "60px", // เว้นพื้นที่สำหรับ footer
          }}
        >
          {/* Breadcrumb */}
          <div
            style={{
              padding: "16px 24px 0",
              background: "transparent",
            }}
          >
            <Breadcrumb items={getBreadcrumb()} />
          </div>

          {/* Page Content */}
          <div
            style={{
              padding: "24px",
              minHeight: "calc(100vh - 64px - 56px)", // ปรับให้เหมาะกับ sticky header และ breadcrumb
            }}
          >
            {children}
          </div>
        </Content>

        {/* Footer */}
        <Footer
          style={{
            textAlign: "center",
            background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
            borderTop: "1px solid #dee2e6",
            padding: "12px 24px",
            fontSize: "12px",
            color: "#6c757d",
            boxShadow: "0 -2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <Text
            type="secondary"
            style={{ fontSize: "12px", lineHeight: "1.4" }}
          >
            <strong>{APP_CONFIG.name}</strong> ©{APP_CONFIG.year} |
            ฝ่ายเทคโนโลยีสารสนเทศ
            <br />
            สหกรณ์ออมทรัพย์มหาวิทยาลัยเกษตรศาสตร์
          </Text>
        </Footer>
      </Layout>
    </Layout>
  );
}

export default AppLayout;
