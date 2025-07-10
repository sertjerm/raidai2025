import { useState } from "react";
import { Form, Input, Button, Card, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { APP_CONFIG } from "@config/constants";
import { getApiUrl } from "@config/api";
import axios from "axios";
import Swal from "sweetalert2";

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
        const errorMessage = response.data?.responseMessage || "รหัสผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง";
        
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
            {APP_CONFIG.headerTitle}
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
              ลงชื่อเข้าใช้
            </Button>
          </Form.Item>
        </Form>

        {/* Build Information */}
        <div
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            paddingTop: "1rem",
            borderTop: "1px solid #e6f3ff",
            fontSize: "12px",
            color: "#999",
          }}
        >
          <div>เวอร์ชัน 1.0.0</div>
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
  );
};

export default Login;
