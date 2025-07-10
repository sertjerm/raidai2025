import { useState } from "react";
import { Form, Input, Button, Card, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { APP_CONFIG } from "@config/constants";
import { getApiUrl } from "@config/api";
import axios from "axios";
import Swal from "sweetalert2";

// Import โลโก้ KUSCC
import kusccLogo from "@assets/images/kuscc-logo.png";

const { Title } = Typography;

const Login = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      // เรียก API Login
      const data = JSON.stringify({
        userid: values.username,
        pwd: values.password,
      });

      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: getApiUrl("/raidai2025Service/service1.svc/Login"),
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      const response = await axios.request(config);

      // ตรวจสอบ response
      if (response.data && response.data.responseCode === 200) {
        const userData = response.data.data;
        await Swal.fire({
          icon: "success",
          title: "เข้าสู่ระบบสำเร็จ!",
          text: `ยินดีต้อนรับคุณ ${
            userData.username || userData.name || userData.userid
          }`,
          timer: 2500,
          timerProgressBar: true,
          showConfirmButton: false,
          toast: true,
          position: "top-end",
          background: "#f6ffed",
          color: "#52c41a",
          iconColor: "#52c41a",
        });
        // ส่ง userData object ทั้งหมดไปให้ parent component
        onLogin(userData);
      } else {
        // ใช้ responseMessage จาก API หรือ fallback เป็นข้อความเริ่มต้น
        const errorMessage =
          response.data?.responseMessage ||
          "รหัสผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง";

        await Swal.fire({
          icon: "error",
          title: "เข้าสู่ระบบไม่สำเร็จ",
          text: errorMessage,
          confirmButtonText: "ลองใหม่",
          confirmButtonColor: "#1890ff",
          background: "#fff2f0",
          iconColor: "#ff4d4f",
          customClass: {
            title: "swal-title-error",
            content: "swal-content-error",
          },
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage = "เกิดข้อผิดพลาดในการเข้าสู่ระบบ";

      if (error.response && error.response.data) {
        errorMessage = error.response.data.responseMessage || errorMessage;
      } else if (error.message) {
        errorMessage = `เกิดข้อผิดพลาด: ${error.message}`;
      }

      await Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: errorMessage,
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#1890ff",
        background: "#fff2f0",
        iconColor: "#ff4d4f",
        customClass: {
          title: "swal-title-error",
          content: "swal-content-error",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg, #2c5aa0 0%, #4a90e2 100%)",
      }}
    >
      {/* Animated Background Elements */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: `
            radial-gradient(circle at 20% 80%, rgba(44, 90, 160, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(74, 144, 226, 0.2) 0%, transparent 50%)
          `,
          animation: "float 6s ease-in-out infinite",
        }}
      />

      {/* Floating Particles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: `${Math.random() * 20 + 10}px`,
            height: `${Math.random() * 20 + 10}px`,
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "50%",
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}

      {/* Left Side - Hero Section */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "0 60px",
          color: "white",
          textAlign: "center",
          zIndex: 2,
        }}
      >
        {/* โลโก้ KUSCC */}
        <div
          style={{
            marginBottom: "2rem",
            animation: "fadeInUp 1s ease-out 0.1s both",
          }}
        >
          <img
            src={kusccLogo}
            alt="KUSCC Logo"
            style={{
              width: "120px",
              height: "120px",
              objectFit: "contain",
              filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
            }}
          />
        </div>

        <Title
          level={1}
          style={{
            color: "white",
            fontSize: "3.5rem",
            fontWeight: 700,
            marginBottom: "1rem",
            textShadow: "0 4px 8px rgba(0,0,0,0.3)",
            animation: "fadeInUp 1s ease-out 0.2s both",
          }}
        >
          {APP_CONFIG.headerTitle}
        </Title>
        <Title
          level={2}
          style={{
            color: "rgba(255, 255, 255, 0.9)",
            fontWeight: 400,
            marginBottom: "2rem",
            lineHeight: 1.6,
            animation: "fadeInUp 1s ease-out 0.4s both",
          }}
        >
          ระบบเงินรายได้ 2025
        </Title>
      </div>

      {/* Right Side - Login Form */}
      <div
        style={{
          flex: "0 0 500px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 40px",
          zIndex: 2,
        }}
      >
        <Card
          style={{
            width: "100%",
            maxWidth: "420px",
            borderRadius: "24px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            border: "none",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            animation: "slideInRight 1s ease-out",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div
              style={{
                width: "100px",
                height: "100px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
                borderRadius: "20px",
                background: "linear-gradient(135deg, #2c5aa0 0%, #4a90e2 100%)",
                boxShadow: "0 8px 16px rgba(74, 144, 226, 0.4)",
                padding: "10px",
              }}
            >
              {/* โลโก้ KUSCC */}
              <img
                src={kusccLogo}
                alt="KUSCC Logo"
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "contain",
                }}
              />
            </div>
            <Title
              level={2}
              style={{
                color: "#1a365d",
                background: "linear-gradient(45deg, #2c5aa0, #4a90e2)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "0.5rem",
                fontWeight: 600,
              }}
            >
              เข้าสู่ระบบ
            </Title>
            <p
              style={{
                color: "#64748b",
                margin: 0,
                fontSize: "14px",
              }}
            >
              ยินดีต้อนรับเข้าสู่ระบบจัดการข้อมูล
            </p>
          </div>

          <Form
            name="login"
            onFinish={handleSubmit}
            autoComplete="off"
            size="large"
            initialValues={{ username: "021000" }}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: "กรุณากรอกรหัสผู้ใช้งาน!" }]}
            >
              <Input
                prefix={<UserOutlined style={{ color: "#4a90e2" }} />}
                placeholder="รหัสผู้ใช้งาน"
                style={{
                  borderRadius: "12px",
                  border: "2px solid #e2e8f0",
                  padding: "12px 16px",
                  fontSize: "16px",
                  transition: "all 0.3s ease",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#4a90e2";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(74, 144, 226, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.boxShadow = "none";
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "กรุณากรอกรหัสผ่าน!" }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "#4a90e2" }} />}
                placeholder="รหัสผ่าน"
                style={{
                  borderRadius: "12px",
                  border: "2px solid #e2e8f0",
                  padding: "12px 16px",
                  fontSize: "16px",
                  transition: "all 0.3s ease",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#4a90e2";
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(74, 144, 226, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.boxShadow = "none";
                }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                style={{
                  height: "56px",
                  fontWeight: 600,
                  fontSize: "16px",
                  borderRadius: "12px",
                  background:
                    "linear-gradient(135deg, #2c5aa0 0%, #4a90e2 100%)",
                  border: "none",
                  boxShadow: "0 8px 16px rgba(74, 144, 226, 0.4)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow =
                    "0 12px 24px rgba(74, 144, 226, 0.5)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow =
                    "0 8px 16px rgba(74, 144, 226, 0.4)";
                }}
              >
                {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
              </Button>
            </Form.Item>
          </Form>

          {/* Build Information */}
          <div
            style={{
              textAlign: "center",
              marginTop: "2rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid #e2e8f0",
              fontSize: "12px",
              color: "#64748b",
            }}
          >
            <div style={{ marginBottom: "4px", fontWeight: 500 }}>
              เวอร์ชัน 1.0.0
            </div>
            <div>
              อัปเดตล่าสุด:{" "}
              {new Date().toLocaleDateString("th-TH", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </Card>
      </div>

      {/* Responsive Design */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @media (max-width: 1024px) {
          .hero-section {
            display: none;
          }
          .login-section {
            flex: 1;
            padding: 40px 20px;
          }
        }

        @media (max-width: 768px) {
          .login-card {
            margin: 20px;
            border-radius: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
