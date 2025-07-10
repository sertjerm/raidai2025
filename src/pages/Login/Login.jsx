import { useState } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { APP_CONFIG } from "@config/constants";
import { getApiUrl } from "@config/api";
import axios from "axios";

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
        message.success(
          `เข้าสู่ระบบสำเร็จ! ยินดีต้อนรับคุณ ${
            userData.username || userData.name || userData.userid
          }`
        );
        // ส่ง userData object ทั้งหมดไปให้ parent component
        onLogin(userData);
      } else {
        message.error("รหัสผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response && error.response.data) {
        message.error(
          error.response.data.responseMessage ||
            "เกิดข้อผิดพลาดในการเข้าสู่ระบบ"
        );
      } else if (error.message) {
        message.error(`เกิดข้อผิดพลาด: ${error.message}`);
      } else {
        message.error("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 50%, #cce7ff 100%)",
        padding: "24px",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: "450px",
          borderRadius: "20px",
          boxShadow: "0 8px 32px rgba(74, 144, 226, 0.25)",
          border: "1px solid #e6f3ff",
          background: "linear-gradient(135deg, #ffffff 0%, #f0f8ff 100%)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          {/* <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏛️</div> */}
          <Title
            level={2}
            style={{
              color: "#1a365d",
              background: "linear-gradient(45deg, #2c5aa0, #4a90e2)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: 0,
            }}
          >
            {APP_CONFIG.name}
          </Title>
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
            <Input prefix={<UserOutlined />} placeholder="รหัสผู้ใช้งาน" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "กรุณากรอกรหัสผ่าน!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="รหัสผ่าน" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{
                height: "48px",
                fontWeight: 600,
                fontSize: "16px",
              }}
            >
              เข้าสู่ระบบ
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
