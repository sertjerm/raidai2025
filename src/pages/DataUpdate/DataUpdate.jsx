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
  Collapse,
  Button,
  Input,
  InputNumber,
  Popconfirm,
} from "antd";
import {
  TeamOutlined,
  DollarOutlined,
  BankOutlined,
  CheckCircleOutlined,
  CaretRightOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { getApiUrl } from "@config/api";
import axios from "axios";

const { Title, Text } = Typography;
const { Panel } = Collapse;

const DataUpdate = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [processedData, setProcessedData] = useState(null);
  const [paginationSettings, setPaginationSettings] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [sectionExpandedKeys, setSectionExpandedKeys] = useState({});
  const [departmentExpandedKeys, setDepartmentExpandedKeys] = useState([]);
  const [editingRows, setEditingRows] = useState({}); // เก็บ row ที่กำลัง edit
  const [editingData, setEditingData] = useState({}); // เก็บข้อมูลที่กำลัง edit

  // Helper functions
  const formatCurrency = (value) => {
    if (value === null || value === undefined || isNaN(value)) return 0;
    const rounded = Math.round(value * 100) / 100;
    // ป้องกัน -0.00 โดยแปลงเป็น 0 ถ้าค่าใกล้ศูนย์มาก
    return Math.abs(rounded) < 0.01 ? 0 : rounded;
  };

  const getDifferenceColor = (value) => {
    if (value < 0) return "#ff4d4f"; // แดง (ลบ)
    return "#52c41a"; // เขียว (ศูนย์และบวก)
  };

  // Initialize user from props or localStorage
  useEffect(() => {
    if (user) {
      setCurrentUser(user);
      // Don't overwrite localStorage here - App.jsx handles it
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
        url: getApiUrl(
          `/raidai2025Service/service1.svc/GetRaidaiByUser2025?userid=${userToUse}`
        ),
        headers: {
          Cookie: "ASP.NET_SessionId=jxsggjja23h31adphlkb15tl",
        },
      };

      const response = await axios.request(config);

      if (response.data && response.data.responseCode === 200) {
        setData(response.data.data);
        processDataStructure(response.data.data);
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

  // Process data to group by department and section
  const processDataStructure = (rawData) => {
    const departments = {};

    rawData.forEach((item) => {
      const deptKey = item.dept_code;
      const sectKey = item.sect_code;

      // Initialize department if not exists
      if (!departments[deptKey]) {
        departments[deptKey] = {
          dept_code: item.dept_code,
          dept_name: item.dept_name,
          sections: {},
          totals: {
            count: 0,
            salary: 0,
            money: 0,
            aidAmount: 0,
            total1: 0,
            total2: 0,
            difference: 0,
          },
        };
      }

      // Initialize section if not exists
      if (!departments[deptKey].sections[sectKey]) {
        departments[deptKey].sections[sectKey] = {
          sect_code: item.sect_code,
          sect_name: item.sect_name,
          members: [],
          totals: {
            count: 0,
            salary: 0,
            money: 0,
            aidAmount: 0,
            total1: 0,
            total2: 0,
            difference: 0,
          },
        };
      }

      // Calculate difference: total1 + aidAmount - total2
      // แก้ไขปัญหา -0.00 โดยใช้ Math.round และตรวจสอบค่าใกล้ 0
      const rawDifference =
        (item.TOTAL1 || 0) + (item.INVC_AIDAMNT || 0) - (item.TOTAL2 || 0);
      const difference =
        Math.abs(rawDifference) < 0.01
          ? 0
          : Math.round(rawDifference * 100) / 100;

      // Add member to section
      const member = {
        ...item,
        difference: formatCurrency(difference),
      };

      departments[deptKey].sections[sectKey].members.push(member);

      // Update section totals
      const section = departments[deptKey].sections[sectKey];
      section.totals.count += 1;
      section.totals.salary += item.mb_salary || 0;
      section.totals.money += item.mb_money || 0;
      section.totals.aidAmount += item.INVC_AIDAMNT || 0;
      section.totals.total1 += item.TOTAL1 || 0;
      section.totals.total2 += item.TOTAL2 || 0;
      section.totals.difference += difference;

      // Update department totals
      const dept = departments[deptKey];
      dept.totals.count += 1;
      dept.totals.salary += item.mb_salary || 0;
      dept.totals.money += item.mb_money || 0;
      dept.totals.aidAmount += item.INVC_AIDAMNT || 0;
      dept.totals.total1 += item.TOTAL1 || 0;
      dept.totals.total2 += item.TOTAL2 || 0;
      dept.totals.difference += difference;
    });

    // Sort members in each section by mb_code (เลขสมาชิก) เรียงจากน้อยไปมาก
    Object.values(departments).forEach((dept) => {
      Object.values(dept.sections).forEach((section) => {
        section.members.sort((a, b) => {
          const numA = parseInt(a.mb_code) || 0;
          const numB = parseInt(b.mb_code) || 0;
          return numA - numB;
        });
      });
    });

    // แก้ไขปัญหา -0.00 ใน totals โดยใช้ formatCurrency
    Object.values(departments).forEach((dept) => {
      dept.totals.difference = formatCurrency(dept.totals.difference);

      Object.values(dept.sections).forEach((section) => {
        section.totals.difference = formatCurrency(section.totals.difference);
      });
    });

    setProcessedData(departments);

    // Initialize section expanded keys for first department
    const sortedDepts = Object.keys(departments).sort();
    if (sortedDepts.length > 0) {
      // Set first department as expanded
      setDepartmentExpandedKeys([sortedDepts[0]]);

      const firstDept = departments[sortedDepts[0]];
      const firstSectionKey = Object.keys(firstDept.sections).sort()[0];
      if (firstSectionKey) {
        setSectionExpandedKeys({
          [sortedDepts[0]]: [`${sortedDepts[0]}-${firstSectionKey}`],
        });
      }
    }
  };

  // Handle department panel change
  const handleDepartmentChange = (activeKeys) => {
    if (!processedData) return;

    // Update department expanded keys
    setDepartmentExpandedKeys(activeKeys);

    const newSectionKeys = { ...sectionExpandedKeys };

    activeKeys.forEach((deptKey) => {
      // If department is newly opened and doesn't have section keys set
      if (!newSectionKeys[deptKey] && processedData[deptKey]) {
        const sections = processedData[deptKey].sections;
        const firstSectionKey = Object.keys(sections).sort()[0];
        if (firstSectionKey) {
          newSectionKeys[deptKey] = [`${deptKey}-${firstSectionKey}`];
        }
      }
    });

    setSectionExpandedKeys(newSectionKeys);
  };

  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  // Columns for member table
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
      render: (value, record) => {
        const rowKey = record.mb_code;
        const isEditing = editingRows[rowKey];

        if (isEditing) {
          return (
            <InputNumber
              value={editingData[rowKey]?.mb_money}
              onChange={(val) => updateEditingData(rowKey, "mb_money", val)}
              style={{ width: "100%" }}
              precision={2}
              min={0}
            />
          );
        }

        return (
          <Text style={{ color: "#1890ff" }}>
            {value?.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
          </Text>
        );
      },
    },
    {
      title: "เงินทำบุญ",
      dataIndex: "INVC_AIDAMNT",
      key: "INVC_AIDAMNT",
      width: 120,
      align: "right",
      render: (value, record) => {
        const rowKey = record.mb_code;
        const isEditing = editingRows[rowKey];

        if (isEditing) {
          return (
            <InputNumber
              value={editingData[rowKey]?.INVC_AIDAMNT}
              onChange={(val) => updateEditingData(rowKey, "INVC_AIDAMNT", val)}
              style={{ width: "100%" }}
              precision={2}
              min={0}
            />
          );
        }

        return (
          <Text style={{ color: "#fa8c16" }}>
            {value?.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
          </Text>
        );
      },
    },
    {
      title: "เก็บได้",
      dataIndex: "TOTAL1",
      key: "TOTAL1",
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
      dataIndex: "difference",
      key: "difference",
      width: 120,
      align: "right",
      render: (value) => {
        const formatted = formatCurrency(value);
        return (
          <Text
            style={{ color: getDifferenceColor(formatted), fontWeight: "600" }}
          >
            {formatted.toFixed(2)}
          </Text>
        );
      },
    },
    {
      title: "หมายเหตุ",
      dataIndex: "mb_note",
      key: "mb_note",
      width: 150,
      render: (note, record) => {
        const rowKey = record.mb_code;
        const isEditing = editingRows[rowKey];

        if (isEditing) {
          return (
            <Input
              value={editingData[rowKey]?.mb_note}
              onChange={(e) =>
                updateEditingData(rowKey, "mb_note", e.target.value)
              }
              placeholder="หมายเหตุ"
            />
          );
        }

        return note || "-";
      },
    },
    {
      title: "จัดการ",
      key: "action",
      width: 120,
      align: "center",
      render: (_, record) => {
        const rowKey = record.mb_code;
        const isEditing = editingRows[rowKey];

        if (isEditing) {
          return (
            <Space>
              <Popconfirm
                title="บันทึกการเปลี่ยนแปลง?"
                onConfirm={() => saveEdit(record)}
                okText="บันทึก"
                cancelText="ยกเลิก"
              >
                <Button type="primary" size="small" icon={<SaveOutlined />} />
              </Popconfirm>
              <Button
                size="small"
                icon={<CloseOutlined />}
                onClick={() => cancelEdit(record)}
              />
            </Space>
          );
        }

        return (
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => startEdit(record)}
          />
        );
      },
    },
  ];

  // ฟังก์ชันเริ่มแก้ไข
  const startEdit = (record) => {
    const rowKey = record.mb_code;
    setEditingRows({ ...editingRows, [rowKey]: true });
    setEditingData({
      ...editingData,
      [rowKey]: {
        mb_money: record.mb_money,
        INVC_AIDAMNT: record.INVC_AIDAMNT,
        mb_note: record.mb_note || "",
      },
    });
  };

  // ฟังก์ชันยกเลิกการแก้ไข
  const cancelEdit = (record) => {
    const rowKey = record.mb_code;
    const newEditingRows = { ...editingRows };
    const newEditingData = { ...editingData };
    delete newEditingRows[rowKey];
    delete newEditingData[rowKey];
    setEditingRows(newEditingRows);
    setEditingData(newEditingData);
  };

  // ฟังก์ชันบันทึกข้อมูล
  const saveEdit = async (record) => {
    const rowKey = record.mb_code;
    const editData = editingData[rowKey];

    try {
      // เรียก API เพื่อบันทึกข้อมูล
      const updateData = {
        mb_code: record.mb_code,
        mb_money: editData.mb_money,
        INVC_AIDAMNT: editData.INVC_AIDAMNT,
        mb_note: editData.mb_note,
      };

      // TODO: เรียก API update จริง
      console.log("Saving data:", updateData);

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      message.success("บันทึกข้อมูลสำเร็จ");

      // ออกจาก edit mode
      cancelEdit(record);

      // Refresh ข้อมูลใหม่
      fetchData();
    } catch (error) {
      console.error("Error saving data:", error);
      message.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  // ฟังก์ชันอัพเดทข้อมูลที่กำลังแก้ไข
  const updateEditingData = (rowKey, field, value) => {
    setEditingData({
      ...editingData,
      [rowKey]: {
        ...editingData[rowKey],
        [field]: value,
      },
    });
  };

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

  if (!processedData) {
    return (
      <div style={{ textAlign: "center", padding: "4rem" }}>
        <Text>ไม่พบข้อมูล</Text>
      </div>
    );
  }

  // Calculate grand totals
  const grandTotals = Object.values(processedData).reduce(
    (acc, dept) => ({
      count: acc.count + dept.totals.count,
      salary: acc.salary + dept.totals.salary,
      money: acc.money + dept.totals.money,
      aidAmount: acc.aidAmount + dept.totals.aidAmount,
      total1: acc.total1 + dept.totals.total1,
      total2: acc.total2 + dept.totals.total2,
      difference: formatCurrency(acc.difference + dept.totals.difference),
    }),
    {
      count: 0,
      salary: 0,
      money: 0,
      aidAmount: 0,
      total1: 0,
      total2: 0,
      difference: 0,
    }
  );

  return (
    <div style={{ padding: "24px" }}>
      {/* Header */}
      <Card style={{ marginBottom: "24px" }}>
        {/* Grand Totals */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={6} lg={6}>
            <Card
              style={{
                background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
              }}
            >
              <Statistic
                title="เรียกเก็บรวม"
                value={grandTotals.money}
                precision={2}
                valueStyle={{
                  color: "#1976d2",
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
                suffix="บาท"
              />
            </Card>
          </Col>
          <Col xs={24} sm={6} lg={6}>
            <Card
              style={{
                background: "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)",
              }}
            >
              <Statistic
                title="เงินทำบุญรวม"
                value={grandTotals.aidAmount}
                precision={2}
                valueStyle={{
                  color: "#f57c00",
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
                suffix="บาท"
              />
            </Card>
          </Col>
          <Col xs={24} sm={6} lg={6}>
            <Card
              style={{
                background: "linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)",
              }}
            >
              <Statistic
                title="เก็บได้รวม"
                value={grandTotals.total1}
                precision={2}
                valueStyle={{
                  color: "#388e3c",
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
                suffix="บาท"
              />
            </Card>
          </Col>
          <Col xs={24} sm={6} lg={6}>
            <Card
              style={{
                background: "linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)",
              }}
            >
              <Statistic
                title="ผลต่างรวม"
                value={formatCurrency(grandTotals.difference)}
                precision={2}
                valueStyle={{
                  color: getDifferenceColor(
                    formatCurrency(grandTotals.difference)
                  ),
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
                suffix="บาท"
              />
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Department Data */}
      <Collapse
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
        style={{ marginBottom: "24px" }}
        defaultActiveKey={
          Object.keys(processedData).length > 0
            ? [Object.keys(processedData).sort()[0]]
            : []
        }
        onChange={handleDepartmentChange}
      >
        {Object.values(processedData)
          .sort((a, b) => a.dept_code.localeCompare(b.dept_code))
          .map((dept, deptIndex) => (
            <Panel
              header={
                <div style={{ width: "100%" }}>
                  {/* แถวหลัก: ชื่อหน่วยงาน + สรุปยอด */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    {/* ชื่อหน่วยงาน */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        minWidth: "320px",
                      }}
                    >
                      <Text strong>
                        {dept.dept_code} - {dept.dept_name}
                      </Text>
                      <Tag color="blue" style={{ marginLeft: "8px" }}>
                        {dept.totals.count} คน
                      </Tag>
                    </div>

                    {/* สรุปยอดตาม columns ตาราง - แสดงเสมอ */}
                    <div
                      style={{
                        display: "flex",
                        fontSize: "12px",
                        overflow: "hidden",
                        width: "1320px", // ตรงกับ table scroll width
                      }}
                    >
                      {/* เลขสมาชิก */}
                      <div style={{ width: "120px", padding: "4px 8px" }}></div>

                      {/* ชื่อ-สกุล */}
                      <div style={{ width: "200px", padding: "4px 8px" }}></div>

                      {/* เงินเดือน */}
                      <div
                        style={{
                          width: "120px",
                          textAlign: "right",
                          padding: "4px 8px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "10px",
                            color: "#999",
                            marginBottom: "2px",
                          }}
                        >
                          เงินเดือน
                        </div>
                        <Text strong>
                          {dept.totals.salary.toLocaleString("th-TH", {
                            minimumFractionDigits: 0,
                          })}
                        </Text>
                      </div>

                      {/* เหลือรับ */}
                      <div
                        style={{
                          width: "120px",
                          textAlign: "right",
                          padding: "4px 8px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "10px",
                            color: "#999",
                            marginBottom: "2px",
                          }}
                        >
                          เหลือรับ
                        </div>
                        <Text strong>
                          {dept.totals.salary.toLocaleString("th-TH", {
                            minimumFractionDigits: 0,
                          })}
                        </Text>
                      </div>

                      {/* เรียกเก็บ */}
                      <div
                        style={{
                          width: "120px",
                          textAlign: "right",
                          padding: "4px 8px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "10px",
                            color: "#999",
                            marginBottom: "2px",
                          }}
                        >
                          เรียกเก็บ
                        </div>
                        <Text strong style={{ color: "#1890ff" }}>
                          {dept.totals.money.toLocaleString("th-TH", {
                            minimumFractionDigits: 2,
                          })}
                        </Text>
                      </div>

                      {/* เงินทำบุญ */}
                      <div
                        style={{
                          width: "120px",
                          textAlign: "right",
                          padding: "4px 8px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "10px",
                            color: "#999",
                            marginBottom: "2px",
                          }}
                        >
                          เงินทำบุญ
                        </div>
                        <Text strong style={{ color: "#fa8c16" }}>
                          {dept.totals.aidAmount.toLocaleString("th-TH", {
                            minimumFractionDigits: 2,
                          })}
                        </Text>
                      </div>

                      {/* เก็บได้ */}
                      <div
                        style={{
                          width: "120px",
                          textAlign: "right",
                          padding: "4px 8px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "10px",
                            color: "#999",
                            marginBottom: "2px",
                          }}
                        >
                          เก็บได้
                        </div>
                        <Text strong style={{ color: "#52c41a" }}>
                          {dept.totals.total1.toLocaleString("th-TH", {
                            minimumFractionDigits: 2,
                          })}
                        </Text>
                      </div>

                      {/* ผลต่าง */}
                      <div
                        style={{
                          width: "120px",
                          textAlign: "right",
                          padding: "4px 8px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "10px",
                            color: "#999",
                            marginBottom: "2px",
                          }}
                        >
                          ผลต่าง
                        </div>
                        <Text
                          strong
                          style={{
                            color: getDifferenceColor(dept.totals.difference),
                          }}
                        >
                          {formatCurrency(dept.totals.difference).toFixed(2)}
                        </Text>
                      </div>

                      {/* หมายเหตุ */}
                      <div style={{ width: "150px", padding: "4px 8px" }}></div>

                      {/* จัดการ */}
                      <div style={{ width: "120px", padding: "4px 8px" }}></div>
                    </div>
                  </div>
                </div>
              }
              key={dept.dept_code}
            >
              <Collapse
                size="small"
                activeKey={sectionExpandedKeys[dept.dept_code] || []}
                onChange={(keys) => {
                  setSectionExpandedKeys((prev) => ({
                    ...prev,
                    [dept.dept_code]: keys,
                  }));
                }}
              >
                {Object.values(dept.sections)
                  .sort((a, b) => a.sect_code.localeCompare(b.sect_code))
                  .map((section) => (
                    <Panel
                      header={
                        <div style={{ width: "100%" }}>
                          {/* แถวหลัก: ชื่อ section + สรุปยอด */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              width: "100%",
                            }}
                          >
                            {/* ชื่อ section */}
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                minWidth: "320px",
                              }}
                            >
                              <Text>
                                {section.sect_code} - {section.sect_name}
                              </Text>
                              <Tag color="orange" style={{ marginLeft: "8px" }}>
                                รวม {section.totals.count} คน
                              </Tag>
                            </div>

                            {/* สรุปยอดตาม columns ตาราง (เมื่อปิดอยู่) */}
                            {!sectionExpandedKeys[dept.dept_code]?.includes(
                              `${dept.dept_code}-${section.sect_code}`
                            ) && (
                              <div
                                style={{
                                  display: "flex",
                                  fontSize: "12px",
                                  overflow: "hidden",
                                  width: "1320px", // ตรงกับ table scroll width
                                }}
                              >
                                {/* เลขสมาชิก */}
                                <div
                                  style={{ width: "120px", padding: "4px 8px" }}
                                ></div>

                                {/* ชื่อ-สกุล */}
                                <div
                                  style={{ width: "200px", padding: "4px 8px" }}
                                ></div>

                                {/* เงินเดือน */}
                                <div
                                  style={{
                                    width: "120px",
                                    textAlign: "right",
                                    padding: "4px 8px",
                                  }}
                                >
                                  <div
                                    style={{
                                      fontSize: "10px",
                                      color: "#999",
                                      marginBottom: "2px",
                                    }}
                                  >
                                    เงินเดือน
                                  </div>
                                  <Text strong>
                                    {section.totals.salary.toLocaleString(
                                      "th-TH",
                                      { minimumFractionDigits: 0 }
                                    )}
                                  </Text>
                                </div>

                                {/* เหลือรับ */}
                                <div
                                  style={{
                                    width: "120px",
                                    textAlign: "right",
                                    padding: "4px 8px",
                                  }}
                                >
                                  <div
                                    style={{
                                      fontSize: "10px",
                                      color: "#999",
                                      marginBottom: "2px",
                                    }}
                                  >
                                    เหลือรับ
                                  </div>
                                  <Text strong>
                                    {section.totals.salary.toLocaleString(
                                      "th-TH",
                                      { minimumFractionDigits: 0 }
                                    )}
                                  </Text>
                                </div>

                                {/* เรียกเก็บ */}
                                <div
                                  style={{
                                    width: "120px",
                                    textAlign: "right",
                                    padding: "4px 8px",
                                  }}
                                >
                                  <div
                                    style={{
                                      fontSize: "10px",
                                      color: "#999",
                                      marginBottom: "2px",
                                    }}
                                  >
                                    เรียกเก็บ
                                  </div>
                                  <Text strong style={{ color: "#1890ff" }}>
                                    {section.totals.money.toLocaleString(
                                      "th-TH",
                                      { minimumFractionDigits: 2 }
                                    )}
                                  </Text>
                                </div>

                                {/* เงินทำบุญ */}
                                <div
                                  style={{
                                    width: "120px",
                                    textAlign: "right",
                                    padding: "4px 8px",
                                  }}
                                >
                                  <div
                                    style={{
                                      fontSize: "10px",
                                      color: "#999",
                                      marginBottom: "2px",
                                    }}
                                  >
                                    เงินทำบุญ
                                  </div>
                                  <Text strong style={{ color: "#fa8c16" }}>
                                    {section.totals.aidAmount.toLocaleString(
                                      "th-TH",
                                      { minimumFractionDigits: 2 }
                                    )}
                                  </Text>
                                </div>

                                {/* เก็บได้ */}
                                <div
                                  style={{
                                    width: "120px",
                                    textAlign: "right",
                                    padding: "4px 8px",
                                  }}
                                >
                                  <div
                                    style={{
                                      fontSize: "10px",
                                      color: "#999",
                                      marginBottom: "2px",
                                    }}
                                  >
                                    เก็บได้
                                  </div>
                                  <Text strong style={{ color: "#52c41a" }}>
                                    {section.totals.total1.toLocaleString(
                                      "th-TH",
                                      { minimumFractionDigits: 2 }
                                    )}
                                  </Text>
                                </div>

                                {/* ผลต่าง */}
                                <div
                                  style={{
                                    width: "120px",
                                    textAlign: "right",
                                    padding: "4px 8px",
                                  }}
                                >
                                  <div
                                    style={{
                                      fontSize: "10px",
                                      color: "#999",
                                      marginBottom: "2px",
                                    }}
                                  >
                                    ผลต่าง
                                  </div>
                                  <Text
                                    strong
                                    style={{
                                      color: getDifferenceColor(
                                        section.totals.difference
                                      ),
                                    }}
                                  >
                                    {formatCurrency(
                                      section.totals.difference
                                    ).toFixed(2)}
                                  </Text>
                                </div>

                                {/* หมายเหตุ */}
                                <div
                                  style={{ width: "150px", padding: "4px 8px" }}
                                ></div>

                                {/* จัดการ */}
                                <div
                                  style={{ width: "120px", padding: "4px 8px" }}
                                ></div>
                              </div>
                            )}
                          </div>
                        </div>
                      }
                      key={`${dept.dept_code}-${section.sect_code}`}
                    >
                      <Table
                        columns={memberColumns}
                        dataSource={section.members}
                        rowKey="mb_code"
                        scroll={{ x: 1320 }}
                        pagination={{
                          current:
                            paginationSettings[
                              `${dept.dept_code}-${section.sect_code}`
                            ]?.current || 1,
                          pageSize:
                            paginationSettings[
                              `${dept.dept_code}-${section.sect_code}`
                            ]?.pageSize || 20,
                          showSizeChanger: true,
                          showQuickJumper: true,
                          showTotal: (total, range) =>
                            `แสดง ${range[0]}-${range[1]} จาก ${total} รายการ`,
                          pageSizeOptions: ["10", "20", "50", "100", "200"],
                          onChange: (page, pageSize) => {
                            const key = `${dept.dept_code}-${section.sect_code}`;
                            setPaginationSettings((prev) => ({
                              ...prev,
                              [key]: { current: page, pageSize },
                            }));
                          },
                          onShowSizeChange: (current, size) => {
                            const key = `${dept.dept_code}-${section.sect_code}`;
                            setPaginationSettings((prev) => ({
                              ...prev,
                              [key]: { current: 1, pageSize: size },
                            }));
                          },
                        }}
                        size="small"
                      />

                      {/* Summary แยกออกมาข้างนอก Table - ใช้ table structure ให้ตรงกับ Ant Design */}
                      <div
                        style={{
                          marginTop: "16px",
                          backgroundColor: "#f0f9ff",
                          border: "1px solid #bfdbfe",
                          borderRadius: 8,
                          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                          overflow: "hidden",
                        }}
                      >
                        <table
                          style={{
                            width: "100%",
                            tableLayout: "fixed",
                            borderCollapse: "collapse",
                            fontSize: "14px",
                          }}
                        >
                          <colgroup>
                            <col style={{ width: "120px" }} />
                            <col style={{ width: "200px" }} />
                            <col style={{ width: "120px" }} />
                            <col style={{ width: "120px" }} />
                            <col style={{ width: "120px" }} />
                            <col style={{ width: "120px" }} />
                            <col style={{ width: "120px" }} />
                            <col style={{ width: "120px" }} />
                            <col style={{ width: "150px" }} />
                            <col style={{ width: "120px" }} />
                          </colgroup>
                          <tbody>
                            <tr>
                              {/* เลขสมาชิก */}
                              <td
                                style={{
                                  padding: "8px 8px",
                                  textAlign: "center",
                                  fontWeight: "600",
                                  color: "#1890ff",
                                  borderBottom: "none",
                                }}
                              >
                                รวม {section.totals.count} คน
                              </td>

                              {/* ชื่อ-สกุล */}
                              <td
                                style={{
                                  padding: "8px 8px",
                                  borderBottom: "none",
                                }}
                              >
                                {/* ว่างไว้ */}
                              </td>

                              {/* เงินเดือน */}
                              <td
                                style={{
                                  padding: "8px 8px",
                                  textAlign: "right",
                                  fontWeight: "600",
                                  borderBottom: "none",
                                }}
                              >
                                {section.totals.salary.toLocaleString("th-TH", {
                                  minimumFractionDigits: 0,
                                })}
                              </td>

                              {/* เหลือรับ */}
                              <td
                                style={{
                                  padding: "8px 8px",
                                  textAlign: "right",
                                  fontWeight: "600",
                                  borderBottom: "none",
                                }}
                              >
                                {section.totals.salary.toLocaleString("th-TH", {
                                  minimumFractionDigits: 0,
                                })}
                              </td>

                              {/* เรียกเก็บ */}
                              <td
                                style={{
                                  padding: "8px 8px",
                                  textAlign: "right",
                                  fontWeight: "600",
                                  color: "#1890ff",
                                  borderBottom: "none",
                                }}
                              >
                                {section.totals.money.toLocaleString("th-TH", {
                                  minimumFractionDigits: 2,
                                })}
                              </td>

                              {/* เงินทำบุญ */}
                              <td
                                style={{
                                  padding: "8px 8px",
                                  textAlign: "right",
                                  fontWeight: "600",
                                  color: "#fa8c16",
                                  borderBottom: "none",
                                }}
                              >
                                {section.totals.aidAmount.toLocaleString(
                                  "th-TH",
                                  {
                                    minimumFractionDigits: 2,
                                  }
                                )}
                              </td>

                              {/* เก็บได้ */}
                              <td
                                style={{
                                  padding: "8px 8px",
                                  textAlign: "right",
                                  fontWeight: "600",
                                  color: "#52c41a",
                                  borderBottom: "none",
                                }}
                              >
                                {section.totals.total1.toLocaleString("th-TH", {
                                  minimumFractionDigits: 2,
                                })}
                              </td>

                              {/* ผลต่าง */}
                              <td
                                style={{
                                  padding: "8px 8px",
                                  textAlign: "right",
                                  fontWeight: "600",
                                  color: getDifferenceColor(
                                    section.totals.difference
                                  ),
                                  borderBottom: "none",
                                }}
                              >
                                {formatCurrency(
                                  section.totals.difference
                                ).toFixed(2)}
                              </td>

                              {/* หมายเหตุ */}
                              <td
                                style={{
                                  padding: "8px 8px",
                                  borderBottom: "none",
                                }}
                              >
                                {/* ว่างไว้ */}
                              </td>

                              {/* จัดการ */}
                              <td
                                style={{
                                  padding: "8px 8px",
                                  borderBottom: "none",
                                }}
                              >
                                {/* ว่างไว้ */}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </Panel>
                  ))}
              </Collapse>
            </Panel>
          ))}
      </Collapse>
    </div>
  );
};

export default DataUpdate;
