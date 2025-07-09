import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ConfigProvider, Typography, Button, message } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { raidaiTheme } from "@config/theme";
import { ROUTES, APP_CONFIG } from "@config/constants";
import Login from "@pages/Login";
import Dashboard from "@pages/Dashboard";
import { AppLayout } from "@components/Layout";

const { Title, Text } = Typography;

// Main App Component
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (username) => {
    setIsLoggedIn(true);
    setUser(username);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    message.success("ออกจากระบบเรียบร้อยแล้ว");
  };

  if (!isLoggedIn) {
    return (
      <ConfigProvider theme={raidaiTheme}>
        <Login onLogin={handleLogin} />
      </ConfigProvider>
    );
  }

  return (
    <ConfigProvider theme={raidaiTheme}>
      <Router basename="/raidai2025">
        <AppLayout user={user} onLogout={handleLogout}>
          <Routes>
            <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />

            <Route
              path={ROUTES.DATA_MANAGEMENT}
              element={
                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: "16px",
                    padding: "2rem",
                    textAlign: "center",
                    boxShadow: "0 4px 16px rgba(74, 144, 226, 0.15)",
                    border: "1px solid #e6f3ff",
                  }}
                >
                  <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                    📋
                  </div>
                  <Title
                    level={3}
                    style={{ color: "#1a365d", marginBottom: "0.5rem" }}
                  >
                    ข้อมูลหลัก
                  </Title>
                  <Text style={{ color: "#4a6cf7", fontSize: "16px" }}>
                    หน้านี้พร้อมสำหรับการพัฒนาฟีเจอร์การจัดการข้อมูล
                  </Text>
                </div>
              }
            />

            <Route
              path={ROUTES.REPORTS}
              element={
                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: "16px",
                    padding: "2rem",
                    textAlign: "center",
                    boxShadow: "0 4px 16px rgba(74, 144, 226, 0.15)",
                    border: "1px solid #e6f3ff",
                  }}
                >
                  <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                    📈
                  </div>
                  <Title
                    level={3}
                    style={{ color: "#1a365d", marginBottom: "0.5rem" }}
                  >
                    รายงาน
                  </Title>
                  <Text style={{ color: "#4a6cf7", fontSize: "16px" }}>
                    หน้านี้พร้อมสำหรับการพัฒนาฟีเจอร์รายงานและการวิเคราะห์ข้อมูล
                  </Text>
                </div>
              }
            />

            <Route
              path={ROUTES.SETTINGS}
              element={
                <div
                  style={{
                    background: "#ffffff",
                    borderRadius: "16px",
                    padding: "2rem",
                    textAlign: "center",
                    boxShadow: "0 4px 16px rgba(74, 144, 226, 0.15)",
                    border: "1px solid #e6f3ff",
                  }}
                >
                  <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                    ⚙️
                  </div>
                  <Title
                    level={3}
                    style={{ color: "#1a365d", marginBottom: "0.5rem" }}
                  >
                    ตั้งค่าระบบ
                  </Title>
                  <Text
                    style={{
                      color: "#4a6cf7",
                      fontSize: "16px",
                      display: "block",
                      marginBottom: "2rem",
                    }}
                  >
                    หน้านี้พร้อมสำหรับการพัฒนาฟีเจอร์การตั้งค่าระบบ
                  </Text>
                  <Button
                    type="primary"
                    danger
                    icon={<LogoutOutlined />}
                    onClick={handleLogout}
                    style={{
                      borderRadius: "8px",
                      height: "40px",
                      paddingLeft: "20px",
                      paddingRight: "20px",
                    }}
                  >
                    ออกจากระบบ
                  </Button>
                </div>
              }
            />

            <Route
              path="*"
              element={<Navigate to={ROUTES.DASHBOARD} replace />}
            />
          </Routes>
        </AppLayout>
      </Router>
    </ConfigProvider>
  );
}

export default App;
