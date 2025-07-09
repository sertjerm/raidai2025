import { useState } from "react";
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

  // User dropdown menu
  const userMenu = {
    items: [
      {
        key: "profile",
        icon: <UserOutlined />,
        label: "โปรไฟล์",
      },
      {
        type: "divider",
      },
      {
        key: "logout",
        icon: <LogoutOutlined />,
        label: "ออกจากระบบ",
        onClick: onLogout,
      },
    ],
  };

  // Get breadcrumb based on current path
  const getBreadcrumb = () => {
    const breadcrumbMap = {
      [ROUTES.DASHBOARD]: [{ title: <HomeOutlined /> }, { title: "หน้าแรก" }],
      [ROUTES.DATA_MANAGEMENT]: [
        { title: <HomeOutlined /> },
        { title: "ข้อมูลหลัก" },
      ],
      [ROUTES.DATA_UPDATE]: [
        { title: <HomeOutlined /> },
        { title: "ปรับปรุงข้อมูล" },
      ],
      [ROUTES.SETTINGS]: [{ title: <HomeOutlined /> }, { title: "ตั้งค่า" }],
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
            navigate(key);
          }}
        />
      </Sider>

      {/* Main Layout */}
      <Layout>
        {/* Header */}
        <Header
          style={{
            padding: "0 24px",
            background: "#ffffff",
            boxShadow: "0 2px 8px rgba(74, 144, 226, 0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 1000,
          }}
        >
          <div>
            <Title
              level={4}
              style={{
                margin: 0,
                color: "#1a365d",
                background: "linear-gradient(45deg, #2c5aa0, #4a90e2)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {APP_CONFIG.name}
            </Title>
          </div>

          <Space>
            <Text style={{ color: "#4a6cf7" }}>
              ยินดีต้อนรับ, {user?.username || user?.userid}
            </Text>
            <Dropdown menu={userMenu} placement="bottomRight" arrow>
              <Button
                type="text"
                shape="circle"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Avatar
                  size="small"
                  icon={<UserOutlined />}
                  style={{
                    background: "linear-gradient(45deg, #4a90e2, #2c5aa0)",
                  }}
                />
              </Button>
            </Dropdown>
          </Space>
        </Header>

        {/* Content */}
        <Content
          style={{
            margin: 0,
            background: "linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%)",
            minHeight: "calc(100vh - 64px - 70px)", // Full height minus header and footer
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
              minHeight: "calc(100vh - 64px - 70px - 56px)", // Adjust for breadcrumb
            }}
          >
            {children}
          </div>
        </Content>

        {/* Footer */}
        <Footer
          style={{
            textAlign: "center",
            background: "#ffffff",
            borderTop: "1px solid #e6f3ff",
            padding: "16px 24px",
          }}
        >
          <Text type="secondary">
            {APP_CONFIG.name} ©{APP_CONFIG.year} | พัฒนาสำหรับระบบราชการไทย ❤️
          </Text>
        </Footer>
      </Layout>
    </Layout>
  );
}

export default AppLayout;
