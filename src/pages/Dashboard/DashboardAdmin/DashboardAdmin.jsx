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
  Badge,
  Typography,
  Tooltip,
  Alert,
  Progress,
  message,
} from "antd";
import {
  TeamOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  SyncOutlined,
  SearchOutlined,
  DownloadOutlined,
  FilterOutlined,
  BankOutlined,
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
} from "@config/constants";
import axios from "axios";

// เพิ่ม styles ให้กับ document
if (typeof document !== "undefined") {
  const styleElement = document.createElement("style");
  styleElement.textContent = `${TOOLTIP_STYLES}${TABLE_SHARED_STYLES}${CARD_SHARED_STYLES}`;
  if (!document.head.querySelector('style[data-tooltip="custom-note"]')) {
    styleElement.setAttribute("data-tooltip", "custom-note");
    document.head.appendChild(styleElement);
  }
}

const { Title, Text } = Typography;
const { Option } = Select;

// Helper functions
const formatCurrency = (value) => {
  if (value === null || value === undefined || isNaN(value)) return 0;
  const rounded = Math.round(value * 100) / 100;
  return Math.abs(rounded) < 0.01 ? 0 : rounded;
};

const getDifferenceColor = (value) => {
  const numValue = parseFloat(value) || 0;
  if (numValue === 0 || Math.abs(numValue) < 0.01) {
    return STATUS_COLORS.NEUTRAL;
  }
  return numValue < 0 ? STATUS_COLORS.ERROR : STATUS_COLORS.SUCCESS;
};

const getStatusColor = (status) => {
  return status === 1 ? STATUS_COLORS.SUCCESS : STATUS_COLORS.WARNING;
};

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

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${getApiUrl()}/raidai2025Service/service1.svc/GetRaidaiAdmin2025?userid=${
          user?.userid || "021000"
        }`,
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

  // Export to CSV
  const handleExport = () => {
    const csvContent = [
      [
        "รหัสสมาชิก",
        "ชื่อ-สกุล",
        "หน่วยงาน",
        "แผนก",
        "ยอดเรียกเก็บ",
        "ยอดชำระ",
        "คงเหลือ",
        "สถานะ",
      ].join(","),
      ...filteredData.map((item) =>
        [
          item.mb_code,
          item.fullname,
          item.dept_name,
          item.sect_name,
          formatCurrency(item.total1),
          formatCurrency(item.total2),
          Math.abs(formatCurrency(item.diff)),
          item.ConfirmStatus === 1 ? "ยืนยันแล้ว" : "รอยืนยัน",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `รายงานเงินปันผล_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();
    message.success("ส่งออกข้อมูลสำเร็จ");
  };

  // Get unique departments for filter
  const departments = [
    ...new Set(
      data.map((item) => ({
        code: item.dept_code,
        name: item.dept_name,
      }))
    ),
  ].sort((a, b) => a.name.localeCompare(b.name));

  // Calculate completion rate
  const collectionRate = stats.totalAmount
    ? (stats.collectedAmount / stats.totalAmount) * 100
    : 0;

  // Table columns
  const columns = [
    {
      title: "รหัสสมาชิก",
      dataIndex: "mb_code",
      key: "mb_code",
      width: 120,
      render: (text) => (
        <Tag color={STATUS_COLORS.PRIMARY} style={{ fontWeight: 500 }}>
          {text}
        </Tag>
      ),
    },
    {
      title: "ชื่อ-สกุล",
      dataIndex: "fullname",
      key: "fullname",
      render: (text) => <Text style={{ color: "#262626" }}>{text}</Text>,
    },
    {
      title: "หน่วยงาน",
      dataIndex: "dept_name",
      key: "dept_name",
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "ยอดเรียกเก็บ",
      dataIndex: "total1",
      key: "total1",
      align: "right",
      render: (value) => (
        <Text>
          ฿
          {formatCurrency(value)?.toLocaleString("th-TH", {
            minimumFractionDigits: 2,
          })}
        </Text>
      ),
    },
    {
      title: "ยอดชำระ",
      dataIndex: "total2",
      key: "total2",
      align: "right",
      render: (value) => (
        <Text
          style={{
            color:
              formatCurrency(value) > 0
                ? STATUS_COLORS.SUCCESS
                : STATUS_COLORS.NEUTRAL,
          }}
        >
          ฿
          {formatCurrency(value)?.toLocaleString("th-TH", {
            minimumFractionDigits: 2,
          })}
        </Text>
      ),
    },
    {
      title: "คงเหลือ",
      dataIndex: "diff",
      key: "diff",
      align: "right",
      render: (value) => (
        <Text style={{ color: getDifferenceColor(value) }}>
          ฿
          {Math.abs(formatCurrency(value))?.toLocaleString("th-TH", {
            minimumFractionDigits: 2,
          })}
        </Text>
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
          text={
            <Text style={{ color: getStatusColor(status) }}>
              {status === 1 ? "ยืนยันแล้ว" : "รอยืนยัน"}
            </Text>
          }
        />
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>
          ภาพรวมการรับเงินปันผล
        </Title>
        <Text type="secondary">
          ระบบบริหารจัดการข้อมูลการเก็บเงินปันผล ประจำปี {APP_CONFIG.year}
        </Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={
                <Space>
                  <TeamOutlined style={{ color: STATUS_COLORS.PRIMARY }} />
                  <Text>จำนวนสมาชิก</Text>
                </Space>
              }
              value={stats.totalMembers}
              suffix="คน"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={
                <Space>
                  <BankOutlined style={{ color: STATUS_COLORS.PRIMARY }} />
                  <Text>ยอดเรียกเก็บรวม</Text>
                </Space>
              }
              value={stats.totalAmount}
              precision={2}
              prefix="฿"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={
                <Space>
                  <CheckCircleOutlined
                    style={{ color: STATUS_COLORS.SUCCESS }}
                  />
                  <Text>เก็บได้แล้ว</Text>
                </Space>
              }
              value={stats.collectedAmount}
              precision={2}
              prefix="฿"
            />
            <Progress
              percent={collectionRate.toFixed(1)}
              strokeColor={STATUS_COLORS.SUCCESS}
              size="small"
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={
                <Space>
                  <WarningOutlined style={{ color: STATUS_COLORS.ERROR }} />
                  <Text>ยังไม่ได้เก็บ</Text>
                </Space>
              }
              value={stats.uncollectedAmount}
              precision={2}
              prefix="฿"
            />
            <Progress
              percent={(100 - collectionRate).toFixed(1)}
              strokeColor={STATUS_COLORS.ERROR}
              size="small"
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8} md={6}>
            <Input
              placeholder="ค้นหา ชื่อ, รหัส, หน่วยงาน..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={
                <SearchOutlined style={{ color: STATUS_COLORS.PRIMARY }} />
              }
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
          <Col xs={24} md={6} style={{ textAlign: "right" }}>
            <Space>
              <Tooltip title="รีเฟรชข้อมูล">
                <Button
                  type="primary"
                  icon={<SyncOutlined />}
                  onClick={fetchData}
                  loading={loading}
                >
                  รีเฟรช
                </Button>
              </Tooltip>
              <Tooltip title="ส่งออกข้อมูล">
                <Button icon={<DownloadOutlined />} onClick={handleExport}>
                  ส่งออก CSV
                </Button>
              </Tooltip>
            </Space>
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
                กำลังแสดง {filteredData.length} จาก {data.length} รายการ
              </span>
            </Space>
          }
          type="info"
          showIcon={false}
          style={{ marginBottom: 24 }}
        />
      )}

      {/* Table */}
      <Card>
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
