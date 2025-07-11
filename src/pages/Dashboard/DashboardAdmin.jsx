import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Spin,
  message,
  Tooltip,
  Badge,
  Typography,
  Progress,
  Alert,
  Divider,
} from "antd";
import {
  UserOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SearchOutlined,
  ReloadOutlined,
  ExportOutlined,
  FilterOutlined,
  TrophyOutlined,
  WarningOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { getApiUrl } from "@config/api";

const { Title, Text } = Typography;
const { Option } = Select;

// Glassmorphism styles
const glassMorphismStyles = `
  .admin-dashboard-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%);
    position: relative;
    overflow: hidden;
  }

  .floating-bg {
    position: absolute;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(74, 144, 226, 0.1), rgba(44, 90, 160, 0.05));
    animation: float 20s ease-in-out infinite;
    pointer-events: none;
    z-index: 0;
  }

  .floating-bg:nth-child(1) {
    width: 200px;
    height: 200px;
    top: 10%;
    left: 10%;
    animation-delay: 0s;
  }

  .floating-bg:nth-child(2) {
    width: 150px;
    height: 150px;
    top: 20%;
    right: 15%;
    animation-delay: 5s;
  }

  .floating-bg:nth-child(3) {
    width: 100px;
    height: 100px;
    bottom: 20%;
    left: 20%;
    animation-delay: 10s;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }

  .glass-card {
    background: rgba(255, 255, 255, 0.85) !important;
    backdrop-filter: blur(15px) !important;
    border: 1px solid rgba(179, 217, 255, 0.3) !important;
    border-radius: 24px !important;
    box-shadow: 0 12px 40px rgba(74, 144, 226, 0.15) !important;
    transition: all 0.3s ease !important;
    position: relative;
    z-index: 1;
  }

  .glass-card:hover {
    transform: translateY(-8px) !important;
    box-shadow: 0 20px 60px rgba(74, 144, 226, 0.25) !important;
  }

  .stat-card-gradient {
    background: linear-gradient(135deg, rgba(74, 144, 226, 0.1), rgba(44, 90, 160, 0.05)) !important;
    border: 2px solid rgba(74, 144, 226, 0.2) !important;
  }

  .stat-card-success {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05)) !important;
    border: 2px solid rgba(16, 185, 129, 0.2) !important;
  }

  .stat-card-warning {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.05)) !important;
    border: 2px solid rgba(245, 158, 11, 0.2) !important;
  }

  .stat-card-danger {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05)) !important;
    border: 2px solid rgba(239, 68, 68, 0.2) !important;
  }

  .admin-table .ant-table {
    background: rgba(255, 255, 255, 0.9) !important;
    border-radius: 20px !important;
  }

  .admin-table .ant-table-thead > tr > th {
    background: linear-gradient(135deg, #4a90e2, #2c5aa0) !important;
    color: white !important;
    font-weight: 600 !important;
    border: none !important;
  }

  .admin-table .ant-table-tbody > tr:hover > td {
    background: rgba(74, 144, 226, 0.1) !important;
  }

  .confirmed-row td {
    background: rgba(16, 185, 129, 0.05) !important;
    border-left: 4px solid #10b981 !important;
  }

  .unconfirmed-row td {
    background: rgba(245, 158, 11, 0.05) !important;
    border-left: 4px solid #f59e0b !important;
  }

  .progress-ring {
    border-radius: 50%;
    background: conic-gradient(from 0deg, #4a90e2, #2c5aa0, #4a90e2);
    padding: 4px;
  }

  .progress-inner {
    background: white;
    border-radius: 50%;
    padding: 8px;
  }
`;

// เพิ่ม styles ให้กับ document
if (typeof document !== "undefined") {
  const styleElement = document.createElement("style");
  styleElement.textContent = glassMorphismStyles;
  if (!document.head.querySelector('style[data-admin-dashboard="glass"]')) {
    styleElement.setAttribute("data-admin-dashboard", "glass");
    document.head.appendChild(styleElement);
  }
}

const DashboardAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [adminStats, setAdminStats] = useState({
    totalAmount: 0,
    totalRecords: 0,
    totalUsers: 0,
    statusBreakdown: {},
  });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        getApiUrl("/raidai2025Service/service1.svc/GetRaidaiAdmin2025") +
          `?userid=${user?.userid || "000001"}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.responseCode === 200 && result.data) {
        setData(result.data);
        calculateStats(result.data);
        message.success("ดึงข้อมูลสำเร็จ");
      } else {
        throw new Error(result.responseMessage || "ไม่สามารถดึงข้อมูลได้");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("เกิดข้อผิดพลาดในการดึงข้อมูล: " + error.message);

      // ใช้ข้อมูลตัวอย่างในกรณีที่ API ไม่สามารถเชื่อมต่อได้
      const sampleData = [
        {
          ConfirmStatus: null,
          INVC_AIDAMNT: 300.0,
          dept_code: "005",
          dept_name: "คณะวิทยาศาสตร์",
          diff: -8060.46,
          fullname: "นายกิตติพงษ์ พรมมาก",
          mb_code: "016845",
          sect_code: "017",
          sect_name: "สำนักงานเลขาฯ ",
          total1: 7760.46,
          total2: 0.0,
        },
        {
          ConfirmStatus: null,
          INVC_AIDAMNT: 300.0,
          dept_code: "008",
          dept_name: "คณะศึกษาศาสตร์",
          diff: -1763.84,
          fullname: "นายเจ๊ะฮาซัน ดาโอะ",
          mb_code: "017777",
          sect_code: "005",
          sect_name: "สำนักงานเลขานุการฯ ",
          total1: 1463.84,
          total2: 0.0,
        },
        {
          ConfirmStatus: 1,
          INVC_AIDAMNT: 300.0,
          dept_code: "021",
          dept_name: "สหกรณ์ออมทรัพย์ มก.",
          diff: -0.93,
          fullname: "นางสาวพรชนัน สมบูรณ์สวัสดิ์",
          mb_code: "010818",
          sect_code: "000",
          sect_name: "สหกรณ์ออมทรัพย์ มก.",
          total1: 15706.93,
          total2: 16006.0,
        },
        {
          ConfirmStatus: 1,
          INVC_AIDAMNT: 0.0,
          dept_code: "021",
          dept_name: "สหกรณ์ออมทรัพย์ มก.",
          diff: -39157.77,
          fullname: "นายสมัย เสริฐเจิม",
          mb_code: "012938",
          sect_code: "000",
          sect_name: "สหกรณ์ออมทรัพย์ มก.",
          total1: 39601.77,
          total2: 444.0,
        },
        {
          ConfirmStatus: null,
          INVC_AIDAMNT: 300.0,
          dept_code: "022",
          dept_name: "สถานีวิทยุ มก.",
          diff: -2500.0,
          fullname: "นางทินารมภ์ สังข์เดช",
          mb_code: "008098",
          sect_code: "001",
          sect_name: "สถานีวิทยุ มก.",
          total1: 2200.0,
          total2: 0.0,
        },
      ];

      setData(sampleData);
      calculateStats(sampleData);
    } finally {
      setLoading(false);
    }
  };

  // คำนวณสถิติ
  const calculateStats = (dataList) => {
    const totalMembers = dataList.length;
    const totalAmount = dataList.reduce(
      (sum, item) => sum + (item.total1 || 0),
      0
    );
    const collectedAmount = dataList.reduce(
      (sum, item) => sum + (item.total2 || 0),
      0
    );
    const uncollectedAmount = totalAmount - collectedAmount;
    const confirmedCount = dataList.filter(
      (item) => item.ConfirmStatus === 1
    ).length;
    const unconfirmedCount = totalMembers - confirmedCount;

    setStats({
      totalMembers,
      totalAmount,
      collectedAmount,
      uncollectedAmount,
      confirmedCount,
      unconfirmedCount,
    });
  };

  // กรองข้อมูล
  const filterData = () => {
    let filtered = [...data];

    // กรองตามการค้นหา
    if (searchText) {
      filtered = filtered.filter(
        (item) =>
          item.fullname?.toLowerCase().includes(searchText.toLowerCase()) ||
          item.mb_code?.includes(searchText) ||
          item.dept_name?.toLowerCase().includes(searchText.toLowerCase()) ||
          item.sect_name?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // กรองตามหน่วยงาน
    if (selectedDept !== "all") {
      filtered = filtered.filter((item) => item.dept_code === selectedDept);
    }

    // กรองตามสถานะ
    if (selectedStatus !== "all") {
      if (selectedStatus === "confirmed") {
        filtered = filtered.filter((item) => item.ConfirmStatus === 1);
      } else if (selectedStatus === "unconfirmed") {
        filtered = filtered.filter((item) => item.ConfirmStatus !== 1);
      }
    }

    setFilteredData(filtered);
  };

  // รีเฟรชข้อมูล
  const handleRefresh = () => {
    setSearchText("");
    setSelectedDept("all");
    setSelectedStatus("all");
    fetchData();
  };

  // Export ข้อมูล
  const handleExport = () => {
    const csvContent = [
      [
        "รหัสสมาชิก",
        "ชื่อ-นามสกุล",
        "หน่วยงาน",
        "ฝ่าย/งาน",
        "ยอดเรียกเก็บ",
        "ยอดที่เก็บได้",
        "ยอดที่เหลือ",
        "สถานะยืนยัน",
      ].join(","),
      ...filteredData.map((item) =>
        [
          item.mb_code,
          item.fullname,
          item.dept_name,
          item.sect_name,
          item.total1?.toFixed(2) || "0.00",
          item.total2?.toFixed(2) || "0.00",
          item.diff?.toFixed(2) || "0.00",
          item.ConfirmStatus === 1 ? "ยืนยันแล้ว" : "รอยืนยัน",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `admin_dashboard_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success("ส่งออกข้อมูลสำเร็จ");
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterData();
  }, [searchText, selectedDept, selectedStatus, data]);

  // คอลัมน์ของตาราง
  const columns = [
    {
      title: "รหัสสมาชิก",
      dataIndex: "mb_code",
      key: "mb_code",
      width: 120,
      render: (text) => (
        <Tag color="#4a90e2" style={{ fontWeight: "bold" }}>
          {text}
        </Tag>
      ),
    },
    {
      title: "ชื่อ-นามสกุล",
      dataIndex: "fullname",
      key: "fullname",
      width: 200,
      render: (text) => (
        <Text strong style={{ color: "#2c5aa0" }}>
          {text}
        </Text>
      ),
    },
    {
      title: "หน่วยงาน",
      dataIndex: "dept_name",
      key: "dept_name",
      width: 180,
    },
    {
      title: "ฝ่าย/งาน",
      dataIndex: "sect_name",
      key: "sect_name",
      width: 150,
    },
    {
      title: "ยอดเรียกเก็บ",
      dataIndex: "total1",
      key: "total1",
      width: 120,
      align: "right",
      render: (value) => (
        <Text style={{ color: "#4a90e2", fontWeight: "bold" }}>
          ฿
          {value?.toLocaleString("th-TH", { minimumFractionDigits: 2 }) ||
            "0.00"}
        </Text>
      ),
    },
    {
      title: "ยอดที่เก็บได้",
      dataIndex: "total2",
      key: "total2",
      width: 120,
      align: "right",
      render: (value) => (
        <Text style={{ color: "#10b981", fontWeight: "bold" }}>
          ฿
          {value?.toLocaleString("th-TH", { minimumFractionDigits: 2 }) ||
            "0.00"}
        </Text>
      ),
    },
    {
      title: "ยอดที่เหลือ",
      dataIndex: "diff",
      key: "diff",
      width: 120,
      align: "right",
      render: (value) => {
        const color = value < 0 ? "#ef4444" : "#10b981";
        return (
          <Text style={{ color, fontWeight: "bold" }}>
            ฿
            {Math.abs(value || 0).toLocaleString("th-TH", {
              minimumFractionDigits: 2,
            })}
          </Text>
        );
      },
    },
    {
      title: "สถานะยืนยัน",
      dataIndex: "ConfirmStatus",
      key: "ConfirmStatus",
      width: 130,
      align: "center",
      render: (status) => {
        if (status === 1) {
          return (
            <Badge
              status="success"
              text={
                <span style={{ color: "#10b981", fontWeight: "bold" }}>
                  ยืนยันแล้ว
                </span>
              }
            />
          );
        }
        return (
          <Badge
            status="warning"
            text={
              <span style={{ color: "#f59e0b", fontWeight: "bold" }}>
                รอยืนยัน
              </span>
            }
          />
        );
      },
    },
  ];

  // ตัวเลือกหน่วยงาน
  const departments = [...new Set(data.map((item) => item.dept_name))];

  // คำนวณ collection rate
  const collectionRate =
    stats.totalAmount > 0
      ? (stats.collectedAmount / stats.totalAmount) * 100
      : 0;
  const confirmRate =
    stats.totalMembers > 0
      ? (stats.confirmedCount / stats.totalMembers) * 100
      : 0;

  return (
    <div className="admin-dashboard-container">
      {/* Floating Background Elements */}
      <div className="floating-bg"></div>
      <div className="floating-bg"></div>
      <div className="floating-bg"></div>

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <Title
            level={2}
            style={{
              background: "linear-gradient(135deg, #2c5aa0, #4a90e2)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: "8px",
              fontSize: "32px",
              fontWeight: "bold",
            }}
          >
            <TrophyOutlined style={{ marginRight: "12px", color: "#4a90e2" }} />
            Admin Dashboard - รายการเงินปันผล 2025
          </Title>
          <Text style={{ fontSize: "16px", color: "#4a90e2" }}>
            ระบบจัดการและติดตามข้อมูลการเก็บเงินปันผลของสมาชิก
          </Text>
        </div>

        {/* Statistics Cards */}
        <Row gutter={[24, 24]} style={{ marginBottom: "32px" }}>
          <Col xs={24} sm={12} lg={6}>
            <Card
              className="glass-card stat-card-gradient"
              style={{ textAlign: "center" }}
            >
              <div
                className="progress-ring"
                style={{ display: "inline-block", marginBottom: "16px" }}
              >
                <div className="progress-inner">
                  <UserOutlined
                    style={{ fontSize: "32px", color: "#4a90e2" }}
                  />
                </div>
              </div>
              <Statistic
                title={
                  <Text style={{ color: "#2c5aa0", fontWeight: "bold" }}>
                    จำนวนสมาชิก
                  </Text>
                }
                value={stats.totalMembers}
                suffix="คน"
                valueStyle={{ color: "#4a90e2", fontWeight: "bold" }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card
              className="glass-card stat-card-gradient"
              style={{ textAlign: "center" }}
            >
              <div
                className="progress-ring"
                style={{ display: "inline-block", marginBottom: "16px" }}
              >
                <div className="progress-inner">
                  <DollarOutlined
                    style={{ fontSize: "32px", color: "#4a90e2" }}
                  />
                </div>
              </div>
              <Statistic
                title={
                  <Text style={{ color: "#2c5aa0", fontWeight: "bold" }}>
                    ยอดเรียกเก็บ
                  </Text>
                }
                value={stats.totalAmount}
                precision={2}
                prefix="฿"
                valueStyle={{ color: "#4a90e2", fontWeight: "bold" }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card
              className="glass-card stat-card-success"
              style={{ textAlign: "center" }}
            >
              <div
                className="progress-ring"
                style={{ display: "inline-block", marginBottom: "16px" }}
              >
                <div className="progress-inner">
                  <CheckCircleOutlined
                    style={{ fontSize: "32px", color: "#10b981" }}
                  />
                </div>
              </div>
              <Statistic
                title={
                  <Text style={{ color: "#059669", fontWeight: "bold" }}>
                    เก็บได้แล้ว
                  </Text>
                }
                value={stats.collectedAmount}
                precision={2}
                prefix="฿"
                valueStyle={{ color: "#10b981", fontWeight: "bold" }}
              />
              <Progress
                percent={collectionRate}
                size="small"
                strokeColor="#10b981"
                style={{ marginTop: "8px" }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card
              className="glass-card stat-card-warning"
              style={{ textAlign: "center" }}
            >
              <div
                className="progress-ring"
                style={{ display: "inline-block", marginBottom: "16px" }}
              >
                <div className="progress-inner">
                  <CloseCircleOutlined
                    style={{ fontSize: "32px", color: "#f59e0b" }}
                  />
                </div>
              </div>
              <Statistic
                title={
                  <Text style={{ color: "#d97706", fontWeight: "bold" }}>
                    ยังไม่ได้เก็บ
                  </Text>
                }
                value={stats.uncollectedAmount}
                precision={2}
                prefix="฿"
                valueStyle={{ color: "#f59e0b", fontWeight: "bold" }}
              />
              <Progress
                percent={100 - collectionRate}
                size="small"
                strokeColor="#f59e0b"
                style={{ marginTop: "8px" }}
              />
            </Card>
          </Col>
        </Row>

        {/* Status Summary */}
        <Row gutter={[24, 24]} style={{ marginBottom: "32px" }}>
          <Col xs={24} lg={12}>
            <Card
              className="glass-card"
              title={
                <Text
                  style={{
                    color: "#2c5aa0",
                    fontWeight: "bold",
                    fontSize: "18px",
                  }}
                >
                  <InfoCircleOutlined style={{ marginRight: "8px" }} />
                  สถานะการยืนยัน
                </Text>
              }
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="ยืนยันแล้ว"
                    value={stats.confirmedCount}
                    suffix={`/ ${stats.totalMembers} คน`}
                    valueStyle={{ color: "#10b981" }}
                  />
                  <Progress
                    percent={confirmRate}
                    strokeColor="#10b981"
                    style={{ marginTop: "8px" }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="รอยืนยัน"
                    value={stats.unconfirmedCount}
                    suffix={`/ ${stats.totalMembers} คน`}
                    valueStyle={{ color: "#f59e0b" }}
                  />
                  <Progress
                    percent={100 - confirmRate}
                    strokeColor="#f59e0b"
                    style={{ marginTop: "8px" }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Alert
              message="ข้อมูลสำคัญ"
              description={
                <div>
                  <Text>
                    • อัตราการเก็บเงิน:{" "}
                    <strong style={{ color: "#10b981" }}>
                      {collectionRate.toFixed(1)}%
                    </strong>
                  </Text>
                  <br />
                  <Text>
                    • อัตราการยืนยัน:{" "}
                    <strong style={{ color: "#4a90e2" }}>
                      {confirmRate.toFixed(1)}%
                    </strong>
                  </Text>
                  <br />
                  <Text>
                    • จำนวนหน่วยงาน:{" "}
                    <strong style={{ color: "#f59e0b" }}>
                      {departments.length} หน่วยงาน
                    </strong>
                  </Text>
                </div>
              }
              type="info"
              showIcon
              icon={<InfoCircleOutlined style={{ color: "#4a90e2" }} />}
              style={{
                background: "rgba(74, 144, 226, 0.1)",
                border: "1px solid rgba(74, 144, 226, 0.3)",
                borderRadius: "16px",
              }}
            />
          </Col>
        </Row>

        {/* Controls */}
        <Card className="glass-card" style={{ marginBottom: "24px" }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={8} lg={6}>
              <Input
                placeholder="ค้นหาชื่อ, รหัส, หน่วยงาน..."
                prefix={<SearchOutlined style={{ color: "#4a90e2" }} />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ borderRadius: "12px" }}
              />
            </Col>
            <Col xs={24} sm={8} lg={5}>
              <Select
                value={selectedDept}
                onChange={setSelectedDept}
                style={{ width: "100%", borderRadius: "12px" }}
                placeholder="เลือกหน่วยงาน"
              >
                <Option value="all">ทุกหน่วยงาน</Option>
                {departments.map((dept) => (
                  <Option
                    key={dept}
                    value={
                      data.find((item) => item.dept_name === dept)?.dept_code
                    }
                  >
                    {dept}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={8} lg={4}>
              <Select
                value={selectedStatus}
                onChange={setSelectedStatus}
                style={{ width: "100%", borderRadius: "12px" }}
                placeholder="สถานะ"
              >
                <Option value="all">ทุกสถานะ</Option>
                <Option value="confirmed">ยืนยันแล้ว</Option>
                <Option value="unconfirmed">รอยืนยัน</Option>
              </Select>
            </Col>
            <Col xs={24} sm={24} lg={9}>
              <Space>
                <Button
                  type="primary"
                  icon={<ReloadOutlined />}
                  onClick={handleRefresh}
                  loading={loading}
                  style={{
                    background: "linear-gradient(135deg, #4a90e2, #2c5aa0)",
                    border: "none",
                    borderRadius: "12px",
                    fontWeight: "bold",
                  }}
                >
                  รีเฟรช
                </Button>
                <Button
                  icon={<ExportOutlined />}
                  onClick={handleExport}
                  style={{
                    borderColor: "#4a90e2",
                    color: "#4a90e2",
                    borderRadius: "12px",
                    fontWeight: "bold",
                  }}
                >
                  ส่งออก CSV
                </Button>
                <Tooltip title="แสดงข้อมูลแบบ Real-time">
                  <Button
                    icon={<FilterOutlined />}
                    style={{
                      borderColor: "#10b981",
                      color: "#10b981",
                      borderRadius: "12px",
                    }}
                  >
                    กรอง ({filteredData.length})
                  </Button>
                </Tooltip>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Data Table */}
        <Card
          className="glass-card admin-table"
          title={
            <Space>
              <Text
                style={{
                  color: "#2c5aa0",
                  fontWeight: "bold",
                  fontSize: "18px",
                }}
              >
                รายการข้อมูลสมาชิก
              </Text>
              <Badge
                count={filteredData.length}
                style={{ backgroundColor: "#4a90e2" }}
              />
            </Space>
          }
          extra={
            <Text type="secondary">
              อัปเดตล่าสุด: {new Date().toLocaleString("th-TH")}
            </Text>
          }
        >
          <Spin spinning={loading}>
            <Table
              columns={columns}
              dataSource={filteredData}
              rowKey="mb_code"
              size="middle"
              scroll={{ x: 1200 }}
              pagination={{
                total: filteredData.length,
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `แสดง ${range[0]}-${range[1]} จากทั้งหมด ${total} รายการ`,
                style: { marginTop: "16px" },
              }}
              rowClassName={(record) =>
                record.ConfirmStatus === 1 ? "confirmed-row" : "unconfirmed-row"
              }
            />
          </Spin>
        </Card>
      </div>
    </div>
  );
};

export default DashboardAdmin;
