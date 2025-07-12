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
import {
  STATUS_COLORS,
  TABLE_STYLES,
  TOOLTIP_STYLES,
  CARD_SHARED_STYLES,
  STATUS_OPTIONS,
  TABLE_PAGINATION_CONFIG,
  APP_CONFIG,
  PASTEL_COLORS,
  GRADIENT_STYLES,
  CARD_STYLES,
} from "@config/constants";
import axios from "axios";

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

const Dashboard = ({ user }) => {
  console.log("Dashboard user object:", user); // Debug user structure
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalAmount: 0,
    collectedAmount: 0,
    paidCount: 0,
    unpaidCount: 0,
    departments: [],
  });

  // ตรวจสอบว่าเป็น admin หรือไม่
  const isAdmin = user?.userid === "admin";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${getApiUrl(
          "/raidai2025Service/service1.svc/GetRaidaiAdmin2025"
        )}?userid=${user?.userid || APP_CONFIG.defaultUser}`,
        { withCredentials: true }
      );

      if (response.data && response.data.responseCode === 200) {
        let responseData = response.data.data || [];

        // กรองข้อมูลตาม user ถ้าไม่ใช่ admin
        if (!isAdmin && user?.dept_id) {
          responseData = responseData.filter(
            (item) => item.dept_code === user.dept_id
          );
        }

        setData(responseData);
        calculateStats(responseData);
        message.success(`โหลดข้อมูลสำเร็จ ${responseData.length} รายการ`);
      } else {
        throw new Error(response.data?.responseMessage || "เกิดข้อผิดพลาด");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error(`เกิดข้อผิดพลาดในการโหลดข้อมูล: ${error.message}`);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const totalMembers = data.length;
    const totalAmount = data.reduce(
      (sum, item) => sum + (parseFloat(item.total1) || 0),
      0
    );
    const collectedAmount = data.reduce(
      (sum, item) => sum + (parseFloat(item.total2) || 0),
      0
    );
    const paidCount = data.filter((item) => item.ConfirmStatus === 1).length;
    const unpaidCount = data.filter((item) => item.ConfirmStatus !== 1).length;

    // สร้างรายการหน่วยงาน
    const deptMap = {};
    data.forEach((item) => {
      if (!deptMap[item.dept_code]) {
        deptMap[item.dept_code] = {
          dept_id: item.dept_code,
          dept_name: item.dept_name,
          count: 0,
          amount: 0,
          paid: 0,
          unpaid: 0,
        };
      }
      deptMap[item.dept_code].count++;
      deptMap[item.dept_code].amount += parseFloat(item.total1) || 0;
      if (item.ConfirmStatus === 1) {
        deptMap[item.dept_code].paid++;
      } else {
        deptMap[item.dept_code].unpaid++;
      }
    });

    const departments = Object.values(deptMap);

    setStats({
      totalMembers,
      totalAmount,
      collectedAmount,
      paidCount,
      unpaidCount,
      departments,
    });
  };

  // ฟิลเตอร์ข้อมูล
  const filteredData = data.filter((item) => {
    const matchSearch =
      item.fullname?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.mb_code?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.dept_name?.toLowerCase().includes(searchText.toLowerCase());

    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "confirmed" && item.ConfirmStatus === 1) ||
      (statusFilter === "pending" && item.ConfirmStatus !== 1);

    const matchDept = deptFilter === "all" || item.dept_code === deptFilter;

    return matchSearch && matchStatus && matchDept;
  });

  // Columns สำหรับ table
  const columns = [
    {
      title: "รหัสสมาชิก",
      dataIndex: "mb_code",
      key: "mb_code",
      width: 120,
      sorter: (a, b) => a.mb_code?.localeCompare(b.mb_code),
    },
    {
      title: "ชื่อ-นามสกุล",
      dataIndex: "fullname",
      key: "fullname",
      sorter: (a, b) => a.fullname?.localeCompare(b.fullname),
      render: (text) => (
        <Text strong style={{ color: "#1a365d" }}>
          {text}
        </Text>
      ),
    },
    // แสดง column หน่วยงานเฉพาะ admin
    ...(isAdmin
      ? [
          {
            title: "หน่วยงาน",
            dataIndex: "dept_name",
            key: "dept_name",
            sorter: (a, b) => a.dept_name?.localeCompare(b.dept_name),
            render: (text) => (
              <Tag color="blue" style={{ borderRadius: "6px" }}>
                {text}
              </Tag>
            ),
          },
        ]
      : []),
    {
      title: "ยอดเรียกเก็บ",
      dataIndex: "total1",
      key: "total1",
      width: 120,
      sorter: (a, b) => parseFloat(a.total1) - parseFloat(b.total1),
      render: (amount) => (
        <Text strong style={{ color: PASTEL_COLORS.YELLOW.DEEP }}>
          ฿{parseFloat(amount || 0).toLocaleString()}
        </Text>
      ),
    },
    {
      title: "ยอดชำระ",
      dataIndex: "total2",
      key: "total2",
      width: 120,
      sorter: (a, b) => parseFloat(a.total2) - parseFloat(b.total2),
      render: (amount) => (
        <Text strong style={{ color: PASTEL_COLORS.GREEN.DEEP }}>
          ฿{parseFloat(amount || 0).toLocaleString()}
        </Text>
      ),
    },
    {
      title: "สถานะ",
      dataIndex: "ConfirmStatus",
      key: "ConfirmStatus",
      width: 100,
      filters: [
        { text: "ยืนยันแล้ว", value: 1 },
        { text: "รอยืนยัน", value: 0 },
      ],
      onFilter: (value, record) => record.ConfirmStatus === value,
      render: (status) => (
        <Badge
          status={status === 1 ? "success" : "warning"}
          text={
            <Text
              style={{
                color:
                  status === 1
                    ? PASTEL_COLORS.GREEN.DEEP
                    : PASTEL_COLORS.YELLOW.DEEP,
              }}
            >
              {status === 1 ? "ยืนยันแล้ว" : "รอยืนยัน"}
            </Text>
          }
        />
      ),
    },
  ];

  // คำนวณเปอร์เซ็นต์การชำระเงิน (ตามจำนวนคน)
  const paymentRate =
    stats.totalMembers > 0 ? (stats.paidCount / stats.totalMembers) * 100 : 0;

  return (
    <div style={{ padding: "0" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <Title
          level={2}
          style={{
            margin: 0,
            color: "#1a365d",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <TrophyOutlined style={{ color: PASTEL_COLORS.YELLOW.DEEP }} />
          {isAdmin
            ? "Dashboard ผู้ดูแลระบบ"
            : `Dashboard ${user?.username || "ผู้ใช้งาน"}`}
        </Title>
        <Text type="secondary" style={{ fontSize: "16px" }}>
          {isAdmin
            ? "ภาพรวมการเก็บเงินทั้งระบบ"
            : `ภาพรวมการเก็บเงินของ ${user?.username || "หน่วยงาน"}`}
        </Text>
      </div>

      {/* Summary Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              ...CARD_STYLES.BASE,
              background: GRADIENT_STYLES.CARD.BLUE,
            }}
          >
            <Statistic
              title={
                <span style={{ color: "#1a365d", fontWeight: 600 }}>
                  จำนวนสมาชิก
                </span>
              }
              value={stats.totalMembers}
              prefix={
                <UserOutlined style={{ color: PASTEL_COLORS.BLUE.DEEP }} />
              }
              valueStyle={{ color: "#1a365d", fontWeight: "bold" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              ...CARD_STYLES.BASE,
              background: GRADIENT_STYLES.CARD.YELLOW,
            }}
          >
            <Statistic
              title={
                <span style={{ color: "#1a365d", fontWeight: 600 }}>
                  ยอดเรียกเก็บ
                </span>
              }
              value={stats.totalAmount}
              prefix={
                <DollarOutlined style={{ color: PASTEL_COLORS.YELLOW.DEEP }} />
              }
              formatter={(value) => `฿${value.toLocaleString()}`}
              valueStyle={{ color: "#1a365d", fontWeight: "bold" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              ...CARD_STYLES.BASE,
              background: GRADIENT_STYLES.CARD.GREEN,
            }}
          >
            <Statistic
              title={
                <span style={{ color: "#1a365d", fontWeight: 600 }}>
                  เก็บได้แล้ว
                </span>
              }
              value={stats.collectedAmount}
              prefix={
                <CheckCircleOutlined
                  style={{ color: PASTEL_COLORS.GREEN.DEEP }}
                />
              }
              formatter={(value) => `฿${value.toLocaleString()}`}
              valueStyle={{ color: "#1a365d", fontWeight: "bold" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              ...CARD_STYLES.BASE,
              background: GRADIENT_STYLES.CARD.RED,
            }}
          >
            <Statistic
              title={
                <span style={{ color: "#1a365d", fontWeight: 600 }}>
                  รอยืนยัน
                </span>
              }
              value={stats.unpaidCount}
              prefix={
                <CloseCircleOutlined
                  style={{ color: PASTEL_COLORS.RED.DEEP }}
                />
              }
              valueStyle={{ color: "#1a365d", fontWeight: "bold" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Payment Progress */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col span={24}>
          <Card style={CARD_STYLES.BASE}>
            <Title level={4} style={{ color: "#1a365d", marginBottom: "16px" }}>
              <InfoCircleOutlined
                style={{ color: PASTEL_COLORS.BLUE.DEEP, marginRight: "8px" }}
              />
              ความคืบหน้าการชำระเงิน
            </Title>
            <Progress
              percent={paymentRate}
              format={(percent) => `${percent.toFixed(1)}%`}
              strokeColor={PASTEL_COLORS.GREEN.DEEP}
              trailColor={PASTEL_COLORS.RED.LIGHT}
              style={{ marginBottom: "12px" }}
            />
            <Row gutter={16}>
              <Col span={12}>
                <Text strong style={{ color: PASTEL_COLORS.GREEN.DEEP }}>
                  ชำระแล้ว: {stats.paidCount} คน
                </Text>
              </Col>
              <Col span={12}>
                <Text strong style={{ color: PASTEL_COLORS.RED.DEEP }}>
                  ยังไม่ชำระ: {stats.unpaidCount} คน
                </Text>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Department Summary (เฉพาะ admin) */}
      {isAdmin && stats.departments.length > 0 && (
        <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
          <Col span={24}>
            <Card style={CARD_STYLES.BASE}>
              <Title
                level={4}
                style={{ color: "#1a365d", marginBottom: "16px" }}
              >
                <FilterOutlined
                  style={{
                    color: PASTEL_COLORS.PURPLE.DEEP,
                    marginRight: "8px",
                  }}
                />
                สรุปตามหน่วยงาน
              </Title>
              <Row gutter={[12, 12]}>
                {stats.departments.map((dept) => (
                  <Col xs={24} sm={12} lg={8} key={dept.dept_id}>
                    <Card
                      size="small"
                      style={{
                        background: GRADIENT_STYLES.CARD.PURPLE,
                        border: `1px solid ${PASTEL_COLORS.PURPLE.LIGHT}`,
                        borderRadius: "12px",
                      }}
                    >
                      <Text
                        strong
                        style={{
                          color: "#1a365d",
                          display: "block",
                          marginBottom: "8px",
                        }}
                      >
                        {dept.dept_name}
                      </Text>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "4px",
                        }}
                      >
                        <Text type="secondary">สมาชิก:</Text>
                        <Text strong>{dept.count} คน</Text>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "4px",
                        }}
                      >
                        <Text type="secondary">ยอดเงิน:</Text>
                        <Text
                          strong
                          style={{ color: PASTEL_COLORS.GREEN.DEEP }}
                        >
                          ฿{dept.amount.toLocaleString()}
                        </Text>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Tag color="green" size="small">
                          ชำระ: {dept.paid}
                        </Tag>
                        <Tag color="red" size="small">
                          ค้าง: {dept.unpaid}
                        </Tag>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>
        </Row>
      )}

      {/* Filters */}
      <Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
        <Col xs={24} md={8}>
          <Search
            placeholder="ค้นหาชื่อ, รหัสสมาชิก, หน่วยงาน"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: "100%" }}
            allowClear
          />
        </Col>
        <Col xs={12} md={4}>
          <Select
            placeholder="สถานะ"
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: "100%" }}
          >
            <Option value="all">ทั้งหมด</Option>
            <Option value="confirmed">ยืนยันแล้ว</Option>
            <Option value="pending">รอยืนยัน</Option>
          </Select>
        </Col>
        {isAdmin && (
          <Col xs={12} md={4}>
            <Select
              placeholder="หน่วยงาน"
              value={deptFilter}
              onChange={setDeptFilter}
              style={{ width: "100%" }}
            >
              <Option value="all">ทุกหน่วยงาน</Option>
              {stats.departments.map((dept) => (
                <Option key={dept.dept_id} value={dept.dept_id}>
                  {dept.dept_name}
                </Option>
              ))}
            </Select>
          </Col>
        )}
        <Col xs={24} md={8}>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchData}>
              รีเฟรช
            </Button>
            <Button icon={<ExportOutlined />} type="primary">
              ส่งออกข้อมูล
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Data Table */}
      <Card style={CARD_STYLES.BASE}>
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="mb_code"
            pagination={{
              ...TABLE_PAGINATION_CONFIG,
              showTotal: (total, range) =>
                `แสดง ${range[0]}-${range[1]} จาก ${total} รายการ`,
            }}
            scroll={{ x: 800 }}
            size="middle"
            rowClassName={(record, index) =>
              index % 2 === 0 ? "table-row-even" : "table-row-odd"
            }
          />
        </Spin>
      </Card>
    </div>
  );
};

export default Dashboard;
