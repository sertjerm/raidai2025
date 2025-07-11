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
  TABLE_SHARED_STYLES,
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

// Add custom styles to document
if (typeof document !== "undefined") {
  const styleElement = document.createElement("style");
  styleElement.textContent = `
    ${TOOLTIP_STYLES}
    ${TABLE_SHARED_STYLES}
    ${CARD_SHARED_STYLES}
    .admin-dashboard-stat-card {
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease !important;
    }
    .admin-dashboard-stat-card:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
    }
    .admin-dashboard-stat-card::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%);
      pointer-events: none;
    }
    .stat-title {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
      margin-bottom: 12px;
    }
    .stat-value {
      font-size: 28px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.85);
      line-height: 1.2;
    }
    .stat-footer {
      margin-top: 12px;
      font-size: 13px;
      color: rgba(0, 0, 0, 0.45);
    }
    .ant-card {
      border-radius: 16px !important;
    }
    .ant-progress {
      margin-top: 12px;
    }
  `;
  if (!document.head.querySelector('style[data-admin-dashboard="custom"]')) {
    styleElement.setAttribute("data-admin-dashboard", "custom");
    document.head.appendChild(styleElement);
  }
}

const DashboardAdmin = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalAmount: 0,
    collectedAmount: 0,
    uncollectedAmount: 0,
  });

  // Helper functions
  const formatCurrency = (value) => {
    if (value === null || value === undefined || isNaN(value)) return 0;
    const rounded = Math.round(value * 100) / 100;
    return Math.abs(rounded) < 0.01 ? 0 : rounded;
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat("th-TH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${getApiUrl(
          "/raidai2025Service/service1.svc/GetRaidaiAdmin2025"
        )}?userid=${user?.userid || APP_CONFIG.defaultUser}`,
        { withCredentials: true }
      );

      if (response.data.responseCode === 200) {
        const rawData = response.data.data;
        setData(rawData);
        setFilteredData(rawData);
        calculateStats(rawData);
        message.success("โหลดข้อมูลสำเร็จ");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = (items) => {
    const stats = items.reduce(
      (acc, item) => ({
        totalMembers: acc.totalMembers + 1,
        totalAmount: acc.totalAmount + formatCurrency(item.total1 || 0),
        collectedAmount: acc.collectedAmount + formatCurrency(item.total2 || 0),
        uncollectedAmount:
          acc.uncollectedAmount +
          (item.diff < 0 ? Math.abs(formatCurrency(item.diff)) : 0),
      }),
      {
        totalMembers: 0,
        totalAmount: 0,
        collectedAmount: 0,
        uncollectedAmount: 0,
      }
    );
    setStats(stats);
  };

  // Filter data
  const handleFilter = () => {
    let result = [...data];

    if (searchText) {
      const searchLower = searchText.toLowerCase();
      result = result.filter(
        (item) =>
          item.fullname?.toLowerCase().includes(searchLower) ||
          item.mb_code?.includes(searchLower) ||
          item.dept_name?.toLowerCase().includes(searchLower)
      );
    }

    if (departmentFilter !== "all") {
      result = result.filter((item) => item.dept_code === departmentFilter);
    }

    if (statusFilter !== "all") {
      const isConfirmed = statusFilter === "confirmed";
      result = result.filter((item) =>
        isConfirmed ? item.ConfirmStatus === 1 : item.ConfirmStatus !== 1
      );
    }

    setFilteredData(result);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    handleFilter();
  }, [searchText, departmentFilter, statusFilter]);

  // Get unique departments
  const departments = [
    ...new Set(
      data.map((item) => ({
        code: item.dept_code,
        name: item.dept_name,
      }))
    ),
  ].sort((a, b) => a.name.localeCompare(b.name));

  // Calculate rates
  const collectionRate = stats.totalAmount
    ? (stats.collectedAmount / stats.totalAmount) * 100
    : 0;

  const confirmedCount = data.filter((item) => item.ConfirmStatus === 1).length;
  const confirmationRate = data.length
    ? (confirmedCount / data.length) * 100
    : 0;

  // Table columns
  const columns = [
    {
      title: "รหัสสมาชิก",
      dataIndex: "mb_code",
      key: "mb_code",
      width: 120,
      render: (text) => (
        <Tag
          color={PASTEL_COLORS.BLUE.DEFAULT}
          style={{ fontWeight: 500, borderRadius: "4px" }}
        >
          {text}
        </Tag>
      ),
    },
    {
      title: "ชื่อ-สกุล",
      dataIndex: "fullname",
      key: "fullname",
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: "หน่วยงาน",
      dataIndex: "dept_name",
      key: "dept_name",
      ellipsis: true,
      render: (text) => (
        <Tooltip
          title={text}
          destroyOnHidden={true}
          classNames={{ root: "custom-tooltip" }}
        >
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "ยอดเรียกเก็บ",
      dataIndex: "total1",
      key: "total1",
      align: "right",
      render: (value) => <Text>฿{formatNumber(formatCurrency(value))}</Text>,
    },
    {
      title: "ยอดชำระ",
      dataIndex: "total2",
      key: "total2",
      align: "right",
      render: (value) => <Text>฿{formatNumber(formatCurrency(value))}</Text>,
    },
    {
      title: "คงเหลือ",
      dataIndex: "diff",
      key: "diff",
      align: "right",
      render: (value) => (
        <Text>฿{formatNumber(Math.abs(formatCurrency(value)))}</Text>
      ),
    },
    {
      title: "สถานะ",
      dataIndex: "ConfirmStatus",
      key: "ConfirmStatus",
      align: "center",
      render: (status) => (
        <Badge
          status={status === 1 ? "success" : "warning"}
          text={status === 1 ? "ยืนยันแล้ว" : "รอยืนยัน"}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0, color: "#1f1f1f" }}>
          ภาพรวมการรับเงินปันผล (ผู้ดูแลระบบ)
        </Title>
        <Text type="secondary">
          ระบบบริหารจัดการข้อมูลการเก็บเงินปันผล ประจำปี {APP_CONFIG.year}
        </Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card
            className="admin-dashboard-stat-card"
            style={{
              ...CARD_STYLES.BASE,
              ...CARD_STYLES.STAT_CARD,
              background: GRADIENT_STYLES.CARD.GOLD,
            }}
          >
            <div>
              <div className="stat-title">สมาชิกทั้งหมด</div>
              <div className="stat-value">
                {stats.totalMembers.toLocaleString()} คน
              </div>
            </div>
            <div className="stat-footer">
              ยืนยันแล้ว {confirmedCount.toLocaleString()} คน (
              {confirmationRate.toFixed(1)}%)
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            className="admin-dashboard-stat-card"
            style={{
              ...CARD_STYLES.BASE,
              ...CARD_STYLES.STAT_CARD,
              background: GRADIENT_STYLES.CARD.PURPLE,
            }}
          >
            <div>
              <div className="stat-title">ยอดเรียกเก็บรวม</div>
              <div className="stat-value">
                ฿{formatNumber(stats.totalAmount)}
              </div>
            </div>
            <div className="stat-footer">
              จำนวน {departments.length.toLocaleString()} หน่วยงาน
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            className="admin-dashboard-stat-card"
            style={{
              ...CARD_STYLES.BASE,
              ...CARD_STYLES.STAT_CARD,
              background: GRADIENT_STYLES.CARD.GREEN,
            }}
          >
            <div>
              <div className="stat-title">เก็บได้แล้ว</div>
              <div className="stat-value">
                ฿{formatNumber(stats.collectedAmount)}
              </div>
            </div>
            <Progress
              percent={collectionRate}
              strokeColor={PASTEL_COLORS.GREEN.DEEP}
              trailColor={PASTEL_COLORS.GREEN.LIGHT}
              size="small"
              format={(percent) => `${percent.toFixed(1)}%`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            className="admin-dashboard-stat-card"
            style={{
              ...CARD_STYLES.BASE,
              ...CARD_STYLES.STAT_CARD,
              background: GRADIENT_STYLES.CARD.RED,
            }}
          >
            <div>
              <div className="stat-title">ยังไม่ได้เก็บ</div>
              <div className="stat-value">
                ฿{formatNumber(stats.uncollectedAmount)}
              </div>
            </div>
            <Progress
              percent={100 - collectionRate}
              strokeColor={PASTEL_COLORS.RED.DEEP}
              trailColor={PASTEL_COLORS.RED.LIGHT}
              size="small"
              format={(percent) => `${percent.toFixed(1)}%`}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ ...CARD_STYLES.BASE, marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8} md={6}>
            <Input
              placeholder="ค้นหา ชื่อ, รหัส, หน่วยงาน..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={
                <SearchOutlined style={{ color: PASTEL_COLORS.BLUE.DEEP }} />
              }
              style={{ borderRadius: "6px" }}
            />
          </Col>
          <Col xs={24} sm={8} md={6}>
            <Select
              style={{ width: "100%" }}
              value={departmentFilter}
              onChange={setDepartmentFilter}
              placeholder="เลือกหน่วยงาน"
            >
              <Option value="all">ทุกหน่วยงาน</Option>
              {departments.map((dept) => (
                <Option key={dept.code} value={dept.code}>
                  {dept.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={8} md={6}>
            <Select
              style={{ width: "100%" }}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="สถานะการยืนยัน"
            >
              {STATUS_OPTIONS.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Filter Info */}
      {filteredData.length !== data.length && (
        <Alert
          message={
            <Space>
              <FilterOutlined />
              <span>
                กำลังแสดง {filteredData.length.toLocaleString()} จาก{" "}
                {data.length.toLocaleString()} รายการ
              </span>
            </Space>
          }
          type="info"
          showIcon={false}
          style={{ marginBottom: 24, borderRadius: "8px" }}
        />
      )}

      {/* Table */}
      <Card style={{ ...CARD_STYLES.BASE }}>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="mb_code"
          loading={loading}
          scroll={{ x: true }}
          pagination={{
            ...TABLE_PAGINATION_CONFIG,
            total: filteredData.length,
          }}
          rowClassName={(record, index) =>
            index % 2 === 0 ? TABLE_STYLES.LIGHT_ROW : TABLE_STYLES.DARK_ROW
          }
        />
      </Card>
    </div>
  );
};

export default DashboardAdmin;
