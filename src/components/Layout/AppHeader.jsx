import {
  Layout,
  Avatar,
  Dropdown,
  Typography,
  Button,
  Space,
  Tour,
  Card,
  Descriptions,
  Tag,
} from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { APP_CONFIG } from "@config/constants";
import { useState, useRef } from "react";

const { Header } = Layout;
const { Title, Text } = Typography;

function AppHeader({ user, onLogout }) {
  const [tourOpen, setTourOpen] = useState(false);
  const avatarRef = useRef(null);

  // User dropdown menu
  const userMenu = {
    items: [
      {
        key: "profile",
        icon: <InfoCircleOutlined />,
        label: "ข้อมูลผู้ใช้",
        onClick: () => setTourOpen(true),
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

  // Tour steps
  const tourSteps = [
    {
      title: "ข้อมูลผู้ใช้",
      description: (
        <Card
          size="small"
          style={{
            margin: 0,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            borderRadius: "8px",
            maxWidth: "400px",
          }}
        >
          <Descriptions
            column={1}
            size="small"
            styles={{
              label: { fontWeight: 600, color: "#1890ff" },
              content: { color: "#333" },
            }}
          >
            <Descriptions.Item label="รหัสผู้ใช้">
              <Tag color="blue">{user?.userid || "ไม่ระบุ"}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="ชื่อผู้ใช้">
              {user?.username || "ไม่ระบุ"}
            </Descriptions.Item>
            <Descriptions.Item label="ผู้บังคับบัญชา">
              {user?.boss || user?.supervisor || "ไม่ระบุ"}
            </Descriptions.Item>
            <Descriptions.Item label="หน่วยงานที่รับผิดชอบ">
              {/* ย้ายกล่องหน่วยงานมาไว้บรรทัดใหม่ */}
            </Descriptions.Item>
          </Descriptions>

          {/* ส่วนหน่วยงานแยกออกมาจาก Descriptions */}
          <div
            style={{
              maxHeight: "200px",
              overflowY: "auto",
              marginTop: "8px",
            }}
          >
            {user?.depts && user.depts.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {user.depts.map((dept, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "12px",
                      background: "#f8f9fa",
                      borderRadius: "8px",
                      border: "1px solid #e9ecef",
                      width: "100%",
                      boxSizing: "border-box",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 600,
                        color: "#1890ff",
                        marginBottom: "6px",
                        lineHeight: "1.4",
                        fontSize: "14px",
                      }}
                    >
                      {dept.dept_name}
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#666",
                        marginBottom: "4px",
                        lineHeight: "1.3",
                      }}
                    >
                      {dept.sect_name}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#999",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span>
                        รหัส: {dept.dept_code}-{dept.sect_code}
                      </span>
                      <span>จำนวน: {dept.cnt} คน</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <span style={{ color: "#999", fontStyle: "italic" }}>
                ไม่มีข้อมูลหน่วยงาน
              </span>
            )}
          </div>
        </Card>
      ),
      target: () => avatarRef.current,
      placement: "bottomRight",
    },
  ];

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
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
          {APP_CONFIG.headerTitle}
        </Title>
      </div>

      <Space>
        <Text style={{ color: "#4a6cf7" }}>
          ยินดีต้อนรับ,{" "}
          {typeof user === "string"
            ? user
            : user?.username || user?.userid || "ผู้ใช้"}
        </Text>
        <Dropdown menu={userMenu} placement="bottomRight" arrow>
          <Button
            ref={avatarRef}
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

      <Tour
        open={tourOpen}
        onClose={() => setTourOpen(false)}
        steps={tourSteps}
        indicatorsRender={(current, total) => (
          <span style={{ color: "#1890ff", fontWeight: 600 }}>
            ข้อมูลผู้ใช้งาน ({current + 1}/{total})
          </span>
        )}
        type="primary"
        arrow={{ pointAtCenter: true }}
        zIndex={1001}
        mask={false}
        current={0}
        onChange={() => {}}
        renderPanel={(_, { current }) => {
          return (
            <div style={{ position: "relative" }}>
              {tourSteps[current]?.description}
              <style>{`
                .ant-tour-footer {
                  display: none !important;
                }
                .ant-tour-buttons {
                  display: none !important;
                }
              `}</style>
            </div>
          );
        }}
      />
    </Header>
  );
}

export default AppHeader;
