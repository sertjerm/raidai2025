import { Layout, Avatar, Dropdown, Typography, Button, Space } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { APP_CONFIG } from "@config/constants";

const { Header } = Layout;
const { Title, Text } = Typography;

function AppHeader({ user, onLogout }) {
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

  return (
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
        <Text style={{ color: "#4a6cf7" }}>ยินดีต้อนรับ, {user}</Text>
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
  );
}

export default AppHeader;
