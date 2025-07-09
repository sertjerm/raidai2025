import { useState, useEffect } from "react";
import {
  Table,
  Card,
  Typography,
  Statistic,
  Row,
  Col,
  Spin,
  message,
  Tag,
  Space,
} from "antd";
import {
  TeamOutlined,
  DollarOutlined,
  BankOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Title, Text } = Typography;

const DataManagement = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Initialize user from props or localStorage
  useEffect(() => {
    if (user) {
      setCurrentUser(user);
    } else {
      // Try to get user from localStorage if not provided
      const savedUser = localStorage.getItem("currentUser");
      if (savedUser) {
        try {
          setCurrentUser(JSON.parse(savedUser));
        } catch (error) {
          console.error("Error parsing saved user:", error);
          localStorage.removeItem("currentUser");
        }
      }
    }
  }, [user]);

  // Fetch data from API
  const fetchData = async () => {
    const userToUse = currentUser?.userid || currentUser;
    if (!userToUse) {
      message.error("ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่");
      return;
    }

    setLoading(true);
    try {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `/api/raidai2025Service/service1.svc/GetRaidaiByUser2025?userid=${userToUse}`,
        headers: {
          Cookie: "ASP.NET_SessionId=jxsggjja23h31adphlkb15tl",
        },
      };

      const response = await axios.request(config);

      if (response.data && response.data.responseCode === 200) {
        setData(response.data.data);
      } else {
        message.error("ไม่สามารถโหลดข้อมูลได้");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "4rem" }}>
        <Spin size="large" />
        <div style={{ marginTop: "1rem" }}>
          <Text>กำลังโหลดข้อมูล...</Text>
        </div>
      </div>
    );
  }

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "4rem" }}>
        <Text>ไม่พบข้อมูล</Text>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      <Card>
        <Title level={2}>📊 จัดการข้อมูลสมาชิก 2025</Title>
        <Text>จำนวนข้อมูลทั้งหมด: {data.length} รายการ</Text>
      </Card>
    </div>
  );
};

export default DataManagement;
