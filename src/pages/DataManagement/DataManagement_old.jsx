import { useState, useEffect } from "react";
i  // Fetch data from API
  const fetchData = async () => {
    const userToUse = currentUser?.userid || currentUser;
    if (!userToUse) {
      message.error('ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่');
      return;
    }

    setLoading(true);
    try {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `/api/raidai2025Service/service1.svc/GetRaidaiByUser2025?userid=${userToUse}`,  Table,
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
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        try {
          setCurrentUser(JSON.parse(savedUser));
        } catch (error) {
          console.error('Error parsing saved user:', error);
          localStorage.removeItem('currentUser');
        }
      }
    }
  }, [user]);

  // Fetch data from API
  const fetchData = async () => {
    const userToUse = currentUser?.userid || currentUser;
    if (!userToUse) {
      message.error('ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่');
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

  // Columns for member table - แสดงตามรูปแบบเดิม
  const memberColumns = [
    {
      title: "เลขสมาชิก",
      dataIndex: "mb_code",
      key: "mb_code",
      width: 120,
      align: "center",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "ชื่อ-สกุล",
      dataIndex: "fullname",
      key: "fullname",
      width: 200,
    },
    {
      title: "เงินเดือน",
      dataIndex: "mb_salary",
      key: "mb_salary",
      width: 120,
      align: "right",
      render: (value) => (
        <Text>
          {value?.toLocaleString("th-TH", { minimumFractionDigits: 0 })}
        </Text>
      ),
    },
    {
      title: "เหลือรับ",
      dataIndex: "mb_salary",
      key: "remaining",
      width: 120,
      align: "right",
      render: (value) => (
        <Text>
          {value?.toLocaleString("th-TH", { minimumFractionDigits: 0 })}
        </Text>
      ),
    },
    {
      title: "เรียกเก็บ",
      dataIndex: "mb_money",
      key: "mb_money",
      width: 120,
      align: "right",
      render: (value) => (
        <Text style={{ color: "#1890ff" }}>
          {value?.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
        </Text>
      ),
    },
    {
      title: "เก็บได้",
      dataIndex: "total1",
      key: "total1",
      width: 120,
      align: "right",
      render: (value) => (
        <Text style={{ color: "#52c41a" }}>
          {value?.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
        </Text>
      ),
    },
    {
      title: "ผลต่าง",
      dataIndex: "total2",
      key: "total2",
      width: 120,
      align: "right",
      render: (value) => (
        <Text style={{ color: value > 0 ? "#52c41a" : "#ff4d4f" }}>
          {value?.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
        </Text>
      ),
    },
    {
      title: "หมายเหตุ",
      dataIndex: "mb_note",
      key: "mb_note",
      width: 150,
      render: (note) => note || "-",
    },
  ];

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

  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "4rem" }}>
        <Text>ไม่พบข้อมูล</Text>
      </div>
    );
  }

  const departmentData = data[0];
  const sectionData = departmentData.sects[0];
  const members = sectionData.members;

  return (
    <div style={{ padding: "24px" }}>
      {/* Header */}
      <Card style={{ marginBottom: "24px" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Title level={2} style={{ color: "#1a365d", marginBottom: "8px" }}>
            📋 ข้อมูลหลัก - {departmentData.dept_name}
          </Title>
          <Space>
            <Tag color="blue">{departmentData.dept_code}</Tag>
            <Tag color="green" icon={<CheckCircleOutlined />}>
              ยืนยันแล้ว
            </Tag>
          </Space>
        </div>

        {/* Statistics - แสดงตามรูปแบบเดิม */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8} lg={8}>
            <Card
              style={{
                background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
              }}
            >
              <Statistic
                title="เรียกเก็บ"
                value={departmentData.sum_money}
                precision={2}
                valueStyle={{
                  color: "#1976d2",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
                suffix="บาท"
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} lg={8}>
            <Card
              style={{
                background: "linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)",
              }}
            >
              <Statistic
                title="เก็บได้"
                value={departmentData.sum1}
                precision={2}
                valueStyle={{
                  color: "#388e3c",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
                suffix="บาท"
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} lg={8}>
            <Card
              style={{
                background: "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)",
              }}
            >
              <Statistic
                title="เก็บไม่ได้"
                value={departmentData.sum_money - departmentData.sum1}
                precision={2}
                valueStyle={{
                  color: "#f57c00",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
                suffix="บาท"
              />
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Members Table */}
      <Card
        title={
          <div>
            <TeamOutlined style={{ marginRight: "8px" }} />
            รายชื่อสมาชิก - {sectionData.sect_name}
          </div>
        }
        extra={<Tag color="blue">รวม {members.length} คน</Tag>}
      >
        <Table
          columns={memberColumns}
          dataSource={members}
          rowKey="mb_code"
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} จาก ${total} รายการ`,
          }}
          size="small"
        />
      </Card>
    </div>
  );
};

export default DataManagement;
