import { useState, useEffect } from "react";
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
import DataManagement from "@pages/DataManagement";
import DataUpdate from "@pages/DataUpdate";
import { AppLayout } from "@components/Layout";

const { Title, Text } = Typography;

// Main App Component
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Check localStorage for existing user session on app load
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    const savedLoginStatus = localStorage.getItem("isLoggedIn");

    if (savedUser && savedLoginStatus === "true") {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Error parsing saved user data:", error);
        localStorage.removeItem("currentUser");
        localStorage.removeItem("isLoggedIn");
      }
    }

    setIsInitialized(true);
  }, []);

  // Don't render anything until we've checked localStorage
  if (!isInitialized) {
    return null;
  }

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData); // เก็บ user object ทั้งหมด
    // Save to localStorage
    localStorage.setItem("currentUser", JSON.stringify(userData));
    localStorage.setItem("isLoggedIn", "true");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    // Clear localStorage
    localStorage.removeItem("currentUser");
    localStorage.removeItem("isLoggedIn");
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
        {/* Virtual path ที่ user เห็นใน URL */}
        <AppLayout user={user} onLogout={handleLogout}>
          <Routes>
            <Route
              path={ROUTES.DATA_UPDATE}
              element={<DataUpdate user={user} />}
            />

            <Route
              path={ROUTES.DASHBOARD}
              element={<Dashboard user={user} />}
            />

            <Route
              path={ROUTES.DATA_MANAGEMENT}
              element={<DataManagement user={user} />}
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
              element={<Navigate to={ROUTES.DATA_UPDATE} replace />}
            />
          </Routes>
        </AppLayout>
      </Router>
    </ConfigProvider>
  );
}

export default App;
