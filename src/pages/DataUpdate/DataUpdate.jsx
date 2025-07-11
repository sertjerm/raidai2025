import React, { useState, useEffect } from "react";
import "../../styles/components/_data-update.scss";
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
  Tooltip,
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
  SearchOutlined,
  InfoCircleOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { getApiUrl } from "@config/api";
import axios from "axios";

// CSS สำหรับ tooltip และ table row styling
const tooltipStyles = `
  .custom-note-tooltip {
    z-index: 9999 !important;
  }
  
  .custom-note-tooltip .ant-tooltip-inner {
    background-color: #fff !important;
    color: #333 !important;
    border: 1px solid #d9d9d9 !important;
    border-radius: 6px !important;
    box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05) !important;
    padding: 8px 12px !important;
    max-width: 350px !important;
    white-space: pre-wrap !important;
    word-break: break-word !important;
    font-size: 13px !important;
    line-height: 1.5 !important;
    min-height: auto !important;
  }
  
  .custom-note-tooltip .ant-tooltip-arrow {
    display: block !important;
  }
  
  .custom-note-tooltip .ant-tooltip-arrow::before,
  .custom-note-tooltip .ant-tooltip-arrow::after {
    background: #fff !important;
    border: 1px solid #d9d9d9 !important;
  }

  /* ป้องกันการ scroll ของตาราง */
  .ant-table-wrapper {
    overflow: hidden !important;
  }
  
  .ant-table-container {
    overflow: hidden !important;
  }
  
  .ant-table-content {
    overflow: hidden !important;
  }
  
  .ant-table-body {
    overflow: hidden !important;
  }

  /* สีพื้นหลังสลับกันสำหรับแถว */
  .table-row-light td {
    background-color: #f8f9fa !important;
  }
  
  .table-row-dark td {
    background-color: #ffffff !important;
  }
  
  .table-row-light:hover td,
  .table-row-dark:hover td {
    background-color: #e6f7ff !important;
  }
  }
  
  .ant-table {
    table-layout: fixed !important;
    width: 100% !important;
  }
  
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
  }
`;

// เพิ่ม styles ให้กับ document
if (typeof document !== "undefined") {
  const styleElement = document.createElement("style");
  styleElement.textContent = tooltipStyles;
  if (!document.head.querySelector('style[data-tooltip="custom-note"]')) {
    styleElement.setAttribute("data-tooltip", "custom-note");
    document.head.appendChild(styleElement);
  }
}

const { Title, Text } = Typography;

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
  const [saveMode, setSaveMode] = useState("auto"); // 'auto' หรือ 'batch'
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [batchChanges, setBatchChanges] = useState({}); // สำหรับ batch mode
  const [savingRows, setSavingRows] = useState({}); // เก็บ row ที่กำลัง save
  const [searchTexts, setSearchTexts] = useState({}); // เก็บ search text ของแต่ละ section

  // Helper functions
  const formatCurrency = (value) => {
    if (value === null || value === undefined || isNaN(value)) return 0;
    const rounded = Math.round(value * 100) / 100;
    // ป้องกัน -0.00 โดยแปลงเป็น 0 ถ้าค่าใกล้ศูนย์มาก
    return Math.abs(rounded) < 0.01 ? 0 : rounded;
  };

  const getDifferenceColor = (value) => {
    const numValue = parseFloat(value) || 0;

    if (numValue === 0 || Math.abs(numValue) < 0.01) {
      return "#bbb"; // สีเทาจาง สำหรับ 0
    }
    if (numValue < 0) {
      return "#ff4d4f"; // แดง (ลบ)
    }
    return "#52c41a"; // เขียว (บวก)
  };

  // Initialize user from props or localStorage
  useEffect(() => {
    console.log("=== User Initialization Debug ===");
    console.log("User prop received:", user);

    if (user) {
      console.log("Setting currentUser from prop:", user);
      setCurrentUser(user);
      // Don't overwrite localStorage here - App.jsx handles it
    } else {
      // Try to get user from localStorage if not provided
      const savedUser = localStorage.getItem("currentUser");
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          console.log("Setting currentUser from localStorage:", parsedUser);
          setCurrentUser(parsedUser);
        } catch (error) {
          console.error("Error parsing saved user:", error);
          localStorage.removeItem("currentUser");
        }
      }
    }
    console.log("================================");
  }, [user]);

  // Fetch data from API
  const fetchData = async (forceRefresh = false) => {
    const userToUse = currentUser?.userid || currentUser?.user || currentUser;
    if (!userToUse) {
      message.error("ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่");
      return;
    }

    console.log(
      "Fetching data for userid:",
      userToUse,
      "currentUser:",
      currentUser
    );

    setLoading(true);
    try {
      // เพิ่ม timestamp เพื่อป้องกัน cache
      const timestamp = forceRefresh ? `&_t=${Date.now()}` : "";

      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: getApiUrl(
          `/raidai2025Service/service1.svc/GetRaidaiByUser2025?userid=${userToUse}${timestamp}`
        ),
        headers: {
          // ลบ Cookie header เพราะบราวเซอร์ไม่อนุญาต
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      };

      const response = await axios.request(config);

      console.log("Fetch data response:", response.data);

      if (response.data && response.data.responseCode === 200) {
        console.log("Fetched data count:", response.data.data?.length); // Debug: ดูข้อมูลที่เปลี่ยนแปลง (ปิดเพื่อ performance)
        /* 
      if (data && response.data.data) {
        const newData = response.data.data;
        const changes = newData.filter((newItem) => {
          const oldItem = data.find((old) => old.mb_code === newItem.mb_code);
          if (!oldItem) return true;

          return (
            oldItem.mb_salary !== newItem.mb_salary ||
            oldItem.mb_money !== newItem.mb_money ||
            oldItem.TOTAL1 !== newItem.TOTAL1 ||
            oldItem.TOTAL2 !== newItem.TOTAL2 ||
            oldItem.NOTE !== newItem.NOTE
          );
        });

        console.log("Data changes detected:", changes.length, changes);
      }
      */

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

      // Calculate difference: total2 - (total1 + aidAmount)
      // แก้ไขปัญหา -0.00 โดยใช้ Math.round และตรวจสอบค่าใกล้ 0
      const rawDifference =
        (item.TOTAL2 || 0) - ((item.TOTAL1 || 0) + (item.INVC_AIDAMNT || 0));
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
      section.totals.money += item.mb_money || 0; // เหลือรับ
      section.totals.aidAmount += item.INVC_AIDAMNT || 0;
      section.totals.total1 += item.TOTAL1 || 0; // เรียกเก็บ
      section.totals.total2 += item.TOTAL2 || 0; // เก็บได้
      section.totals.difference += difference;

      // Update department totals
      const dept = departments[deptKey];
      dept.totals.count += 1;
      dept.totals.salary += item.mb_salary || 0;
      dept.totals.money += item.mb_money || 0; // เหลือรับ
      dept.totals.aidAmount += item.INVC_AIDAMNT || 0;
      dept.totals.total1 += item.TOTAL1 || 0; // เรียกเก็บ
      dept.totals.total2 += item.TOTAL2 || 0; // เก็บได้
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
      title: "ลำดับ",
      key: "index",
      width: "6%",
      align: "center",
      render: (_, record, index) => (
        <Text strong style={{ color: "#666" }}>
          {index + 1}
        </Text>
      ),
    },
    {
      title: "เลขสมาชิก",
      dataIndex: "mb_code",
      key: "mb_code",
      width: "9%",
      align: "center",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "ชื่อ-สกุล",
      dataIndex: "fullname",
      key: "fullname",
      width: "15%",
      render: (text) => (
        <Tooltip
          title={text}
          placement="topLeft"
          mouseEnterDelay={0.5}
          trigger={text && text.length > 20 ? ["hover", "focus"] : []}
        >
          <Text
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              display: "block",
            }}
          >
            {text}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: "เงินเดือน",
      dataIndex: "mb_salary",
      key: "mb_salary",
      width: "11%",
      align: "right",
      render: (value, record) => {
        const rowKey = record.mb_code;
        const isEditing = editingRows[rowKey];

        if (isEditing) {
          return (
            <InputNumber
              value={editingData[rowKey]?.mb_salary}
              onChange={(val) =>
                updateEditingData(rowKey, "mb_salary", val || 0)
              }
              style={{ width: "100%", textAlign: "right" }}
              precision={2}
              min={0}
              placeholder="0"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          );
        }

        return (
          <Text>
            {value?.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
          </Text>
        );
      },
    },
    {
      title: "เหลือรับ",
      dataIndex: "mb_money", // แก้ไขเป็น mb_money
      key: "remaining",
      width: "11%",
      align: "right",
      render: (value, record) => {
        const rowKey = record.mb_code;
        const isEditing = editingRows[rowKey];

        if (isEditing) {
          return (
            <InputNumber
              value={editingData[rowKey]?.remaining}
              onChange={(val) =>
                updateEditingData(rowKey, "remaining", val || 0)
              }
              style={{ width: "100%", textAlign: "right" }}
              precision={2}
              min={0}
              placeholder="0"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            />
          );
        }

        return (
          <Text>
            {value?.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
          </Text>
        );
      },
    },
    {
      title: "เรียกเก็บ",
      dataIndex: "TOTAL1", // แก้ไขเป็น TOTAL1
      key: "collect",
      width: "11%",
      align: "right",
      render: (value, record) => {
        const rowKey = record.mb_code;
        const isEditing = editingRows[rowKey];

        if (isEditing) {
          return (
            <InputNumber
              value={editingData[rowKey]?.collect}
              onChange={(val) => updateEditingData(rowKey, "collect", val || 0)}
              style={{ width: "100%", textAlign: "right" }}
              precision={2}
              min={0}
              placeholder="0"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
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
      width: "10%",
      align: "right",
      render: (value) => (
        <Text style={{ color: "#fa8c16" }}>
          {value?.toLocaleString("th-TH", { minimumFractionDigits: 0 })}
        </Text>
      ),
    },
    {
      title: "เก็บได้",
      dataIndex: "TOTAL2", // แก้ไขเป็น TOTAL2
      key: "collected",
      width: "11%",
      align: "right",
      render: (value, record) => {
        const rowKey = record.mb_code;
        const isEditing = editingRows[rowKey];

        if (isEditing) {
          return (
            <InputNumber
              value={editingData[rowKey]?.collected ?? record.TOTAL2}
              onChange={(val) => {
                // อนุญาตให้ใส่ค่า 0 หรือ null
                const newValue = val === null || val === undefined ? 0 : val;
                updateEditingData(rowKey, "collected", newValue);
              }}
              style={{ width: "100%", textAlign: "right" }}
              precision={2}
              min={0}
              placeholder="0.00"
              formatter={(value) => {
                if (value === null || value === undefined || value === "")
                  return "0.00";
                return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              }}
              parser={(value) => {
                if (!value) return 0;
                return value.replace(/\$\s?|(,*)/g, "");
              }}
            />
          );
        }

        return (
          <Text style={{ color: "#52c41a" }}>
            {(value ?? 0).toLocaleString("th-TH", { minimumFractionDigits: 2 })}
          </Text>
        );
      },
    },
    {
      title: "ผลต่าง",
      dataIndex: "difference",
      key: "difference",
      width: "9%",
      align: "right",
      render: (value, record) => {
        const rowKey = record.mb_code;
        const editData = editingData[rowKey];

        // คำนวณผลต่างใหม่จากข้อมูลที่แก้ไข (ถ้ามี)
        let calculatedDifference = value;
        if (editData && editingRows[rowKey]) {
          // ใช้ข้อมูลจาก editingData เฉพาะเมื่อกำลัง edit
          const collect =
            editData.collect !== undefined ? editData.collect : record.TOTAL1;
          const collected =
            editData.collected !== undefined
              ? editData.collected
              : record.TOTAL2;
          // ใช้ INVC_AIDAMNT จากข้อมูลต้นฉบับเสมอ (ไม่ให้แก้ไข)
          const aidAmount = record.INVC_AIDAMNT;

          calculatedDifference =
            (collected || 0) - ((collect || 0) + (aidAmount || 0));
        } else {
          // ใช้ข้อมูลจาก record ตรงๆ เมื่อไม่ได้ edit
          calculatedDifference =
            (record.TOTAL2 || 0) -
            ((record.TOTAL1 || 0) + (record.INVC_AIDAMNT || 0));
        }

        const formatted = formatCurrency(calculatedDifference);
        const isZero = Math.abs(calculatedDifference) < 0.01;

        return (
          <Text
            style={{
              color: getDifferenceColor(calculatedDifference),
              fontWeight: isZero ? "normal" : "600",
            }}
          >
            {calculatedDifference < 0 ? "-" : ""}
            {Math.abs(calculatedDifference).toLocaleString("th-TH", {
              minimumFractionDigits: 2,
            })}
          </Text>
        );
      },
    },
    {
      title: "หมายเหตุ",
      dataIndex: "NOTE", // แก้ไขเป็น NOTE
      key: "NOTE",
      width: "8%",
      align: "center",
      render: (note, record) => {
        const rowKey = record.mb_code;
        const isEditing = editingRows[rowKey];

        if (isEditing) {
          return (
            <Input.TextArea
              value={editingData[rowKey]?.NOTE || ""}
              onChange={(e) =>
                updateEditingData(rowKey, "NOTE", e.target.value)
              }
              placeholder="หมายเหตุ"
              autoSize={{ minRows: 1, maxRows: 3 }}
              style={{ fontSize: "13px" }}
            />
          );
        }

        // ถ้าไม่มีหมายเหตุหรือว่าง ไม่แสดงอะไรเลย
        if (!note || note.trim() === "") {
          return null;
        }

        // ถ้ามีหมายเหตุ แสดงเป็น icon พร้อม tooltip
        return (
          <Tooltip
            title={
              <div style={{ maxWidth: "350px", whiteSpace: "pre-wrap" }}>
                {note}
              </div>
            }
            placement="topLeft"
            mouseEnterDelay={0.2}
            mouseLeaveDelay={0.1}
            classNames={{ root: "custom-note-tooltip" }}
            trigger={["hover", "focus"]}
            destroyOnHidden={true}
          >
            <InfoCircleOutlined
              style={{
                color: "#1890ff",
                fontSize: "16px",
                cursor: "help",
              }}
            />
          </Tooltip>
        );
      },
    },
    {
      title: <SettingOutlined style={{ fontSize: "16px", color: "#666" }} />,
      key: "action",
      width: "5%",
      align: "center",
      render: (_, record) => {
        const rowKey = record.mb_code;
        const isEditing = editingRows[rowKey];
        const isSaving = savingRows[rowKey];

        if (isEditing) {
          return (
            <Space>
              {saveMode === "auto" ? (
                // Auto save mode: บันทึกทันที
                <Popconfirm
                  title="บันทึกการเปลี่ยนแปลง?"
                  onConfirm={() => saveEdit(record)}
                  okText="บันทึก"
                  cancelText="ยกเลิก"
                  disabled={isSaving}
                >
                  <Button
                    type="primary"
                    size="small"
                    icon={<SaveOutlined />}
                    loading={isSaving}
                    disabled={isSaving}
                  />
                </Popconfirm>
              ) : (
                // Batch mode: เก็บไว้แล้วบันทึกทีเดียว
                <Button
                  type="primary"
                  size="small"
                  icon={<CheckCircleOutlined />}
                  onClick={() => {
                    const newEditingRows = { ...editingRows };
                    delete newEditingRows[record.mb_code];
                    setEditingRows(newEditingRows);
                    message.success("เก็บการเปลี่ยนแปลงแล้ว");
                  }}
                  style={{ backgroundColor: "#52c41a" }}
                  disabled={isSaving}
                />
              )}
              <Button
                size="small"
                icon={<CloseOutlined />}
                onClick={() => cancelEdit(record)}
                disabled={isSaving}
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
            disabled={isSaving}
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
        mb_salary: record.mb_salary,
        remaining: record.mb_money, // เหลือรับ ใช้ mb_money
        collect: record.TOTAL1, // เรียกเก็บ ใช้ TOTAL1
        collected: record.TOTAL2, // เก็บได้ ใช้ TOTAL2
        NOTE: record.NOTE || "", // แก้ไขเป็น NOTE
      },
    });

    // ถ้าเป็น batch mode ให้เพิ่มเข้า batchChanges
    if (saveMode === "batch") {
      setBatchChanges({
        ...batchChanges,
        [rowKey]: {
          mb_salary: record.mb_salary,
          remaining: record.mb_money,
          collect: record.TOTAL1,
          collected: record.TOTAL2,
          NOTE: record.NOTE || "", // แก้ไขเป็น NOTE
        },
      });
    }
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

    // ถ้าเป็น batch mode ให้ลบออกจาก batchChanges ด้วย
    if (saveMode === "batch") {
      const newBatchChanges = { ...batchChanges };
      delete newBatchChanges[rowKey];
      setBatchChanges(newBatchChanges);
      setHasUnsavedChanges(Object.keys(newBatchChanges).length > 0);
    }
  };

  // ฟังก์ชันบันทึกข้อมูล (แบบทันที)
  const saveEdit = async (record) => {
    const rowKey = record.mb_code;
    const editData = editingData[rowKey];

    // Set saving state
    setSavingRows((prev) => ({ ...prev, [rowKey]: true }));

    try {
      // เตรียมข้อมูลสำหรับ API
      const apiData = {
        userid: currentUser?.userid || currentUser?.user || currentUser,
        PeriodID: record.PeriodID || 139, // ใช้จาก record หรือ default
        data: [
          {
            NOTE: editData.NOTE || "",
            TOTAL1:
              editData.collect !== undefined ? editData.collect : record.TOTAL1,
            TOTAL2:
              editData.collected !== undefined
                ? editData.collected
                : record.TOTAL2,
            mb_code: record.mb_code,
            mb_money:
              editData.remaining !== undefined
                ? editData.remaining
                : record.mb_money,
            mb_salary:
              editData.mb_salary !== undefined
                ? editData.mb_salary
                : record.mb_salary,
          },
        ],
      };

      console.log("=== Save Edit Debug ===");
      console.log("Current user object:", currentUser);
      console.log(
        "Using userid:",
        currentUser?.userid || currentUser?.user || currentUser
      );
      console.log("Original record:", record);
      console.log("Record LASTUPDATE:", record.LASTUPDATE);
      console.log("Edit data:", editData);
      console.log("API payload:", JSON.stringify(apiData, null, 2));
      console.log("======================");

      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: getApiUrl("/raidai2025Service/service1.svc/SaveRaidai"),
        headers: {
          "Content-Type": "application/json",
          // ลบ Cookie header เพราะบราวเซอร์ไม่อนุญาต
        },
        data: apiData,
      };

      const response = await axios.request(config);

      console.log("API Response:", response.data?.responseCode);

      if (response.data && response.data.responseCode === 200) {
        message.success("บันทึกข้อมูลสำเร็จ");

        console.log(
          "Save successful, updating data optimistically for:",
          rowKey
        );

        // Optimistic update: อัปเดต data state ทันที
        if (data) {
          const updatedData = data.map((item) => {
            if (item.mb_code === record.mb_code) {
              return {
                ...item,
                mb_salary: editData.mb_salary || item.mb_salary,
                mb_money: editData.remaining || item.mb_money,
                TOTAL1: editData.collect || item.TOTAL1,
                TOTAL2: editData.collected || item.TOTAL2,
                NOTE: editData.NOTE || item.NOTE,
              };
            }
            return item;
          });

          setData(updatedData);
          processDataStructure(updatedData);
        }

        // Clear edit state ทันที
        const newEditingRows = { ...editingRows };
        const newEditingData = { ...editingData };
        delete newEditingRows[rowKey];
        delete newEditingData[rowKey];
        setEditingRows(newEditingRows);
        setEditingData(newEditingData);

        // Clear saving state
        setSavingRows((prev) => {
          const newState = { ...prev };
          delete newState[rowKey];
          return newState;
        });

        // Sync กับ server ใน background (ไม่บล็อก UI)
        setTimeout(() => {
          console.log("Background sync with server...");
          fetchData(true).catch((err) => {
            console.error("Background sync failed:", err);
            // ถ้า sync ล้มเหลว อาจต้อง revert การเปลี่ยนแปลง
          });
        }, 200);
      } else {
        // Clear saving state on error
        setSavingRows((prev) => {
          const newState = { ...prev };
          delete newState[rowKey];
          return newState;
        });
        console.error("Save failed - API response:", response.data);
        message.error(
          `ไม่สามารถบันทึกข้อมูลได้: ${
            response.data?.message || "Unknown error"
          }`
        );
      }
    } catch (error) {
      // Clear saving state on error
      setSavingRows((prev) => {
        const newState = { ...prev };
        delete newState[rowKey];
        return newState;
      });
      console.error("Error saving data:", error);
      message.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  // Helper function เพื่อหา record ต้นฉบับจาก mb_code
  const findRecordByMbCode = (mb_code) => {
    if (!data) return null;
    return data.find((record) => record.mb_code === mb_code);
  };

  // ฟังก์ชันบันทึกแบบ batch (ทั้งหมดพร้อมกัน)
  const saveBatchChanges = async () => {
    if (Object.keys(batchChanges).length === 0) {
      message.warning("ไม่มีข้อมูลที่ต้องบันทึก");
      return;
    }

    try {
      // เตรียมข้อมูลสำหรับ API batch
      const batchDataArray = Object.entries(batchChanges).map(
        ([mb_code, editData]) => {
          // หา record ต้นฉบับ
          const originalRecord = findRecordByMbCode(mb_code);

          return {
            NOTE: editData.NOTE || "",
            TOTAL1:
              editData.collect !== undefined
                ? editData.collect
                : originalRecord?.TOTAL1,
            TOTAL2:
              editData.collected !== undefined
                ? editData.collected
                : originalRecord?.TOTAL2,
            mb_code: mb_code,
            mb_money:
              editData.remaining !== undefined
                ? editData.remaining
                : originalRecord?.mb_money,
            mb_salary:
              editData.mb_salary !== undefined
                ? editData.mb_salary
                : originalRecord?.mb_salary,
          };
        }
      );

      const apiData = {
        userid: currentUser?.userid || currentUser?.user || currentUser,
        PeriodID: 139, // หรือ get จาก record แรก
        data: batchDataArray,
      };

      console.log("=== Batch Save Debug ===");
      console.log("Current user object:", currentUser);
      console.log(
        "Using userid:",
        currentUser?.userid || currentUser?.user || currentUser
      );
      console.log("Saving batch changes:", apiData);

      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: getApiUrl("/raidai2025Service/service1.svc/SaveRaidai"),
        headers: {
          "Content-Type": "application/json",
          // ลบ Cookie header เพราะบราวเซอร์ไม่อนุญาต
        },
        data: apiData,
      };

      const response = await axios.request(config);

      console.log("Batch API Response:", response.data);

      if (response.data && response.data.responseCode === 200) {
        message.success(`บันทึกข้อมูลสำเร็จ ${batchDataArray.length} รายการ`);

        // Optimistic update: อัปเดต data state ทันที
        if (data) {
          const updatedData = data.map((item) => {
            const batchChange = batchChanges[item.mb_code];
            if (batchChange) {
              return {
                ...item,
                mb_salary: batchChange.mb_salary || item.mb_salary,
                mb_money: batchChange.remaining || item.mb_money,
                TOTAL1: batchChange.collect || item.TOTAL1,
                TOTAL2: batchChange.collected || item.TOTAL2,
                NOTE: batchChange.NOTE || item.NOTE,
              };
            }
            return item;
          });

          setData(updatedData);
          processDataStructure(updatedData);
        }

        // Clear all changes
        setBatchChanges({});
        setHasUnsavedChanges(false);
        setEditingRows({});
        setEditingData({});

        // Sync กับ server ใน background
        setTimeout(() => {
          fetchData(true).catch((err) => {
            console.error("Background sync failed:", err);
          });
        }, 200);
      } else {
        console.error("Batch save failed - API response:", response.data);
        message.error(
          `ไม่สามารถบันทึกข้อมูลได้: ${
            response.data?.message || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Error saving batch data:", error);
      message.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  // ฟังก์ชันเปิด/ปิด batch mode
  const toggleSaveMode = () => {
    const newMode = saveMode === "auto" ? "batch" : "auto";
    setSaveMode(newMode);

    if (newMode === "auto" && Object.keys(batchChanges).length > 0) {
      // ถามผู้ใช้ว่าต้องการบันทึกข้อมูลที่ pending อยู่หรือไม่
      if (
        window.confirm(
          "มีข้อมูลที่ยังไม่ได้บันทึก ต้องการบันทึกก่อนเปลี่ยนโหมดหรือไม่?"
        )
      ) {
        saveBatchChanges();
      } else {
        setBatchChanges({});
        setHasUnsavedChanges(false);
      }
    }
  };

  // ฟังก์ชันยกเลิกการเปลี่ยนแปลงทั้งหมด (สำหรับ batch mode)
  const cancelAllChanges = () => {
    setBatchChanges({});
    setHasUnsavedChanges(false);
    setEditingRows({});
    setEditingData({});
    message.info("ยกเลิกการเปลี่ยนแปลงทั้งหมดแล้ว");
  };

  // ฟังก์ชันอัพเดทข้อมูลที่กำลังแก้ไข
  const updateEditingData = (rowKey, field, value) => {
    const newEditingData = {
      ...editingData,
      [rowKey]: {
        ...editingData[rowKey],
        [field]: value,
      },
    };
    setEditingData(newEditingData);

    // ถ้าเป็น batch mode ให้อัพเดท batchChanges ด้วย
    if (saveMode === "batch") {
      setBatchChanges({
        ...batchChanges,
        [rowKey]: {
          ...batchChanges[rowKey],
          [field]: value,
        },
      });
      setHasUnsavedChanges(true);
    }
  };

  // ฟังก์ชันค้นหา/กรองข้อมูลสำหรับแต่ละ section
  const handleSectionSearch = (sectionKey, searchValue) => {
    setSearchTexts((prev) => ({
      ...prev,
      [sectionKey]: searchValue,
    }));
  };

  // ฟิลเตอร์ข้อมูลตาม search text
  const getFilteredData = (data, sectionKey) => {
    const searchText = searchTexts[sectionKey]?.toLowerCase() || "";
    if (!searchText) return data;

    return data.filter((record) => {
      const memberCode = record.mb_code?.toString().toLowerCase() || "";
      const memberName = record.fullname?.toLowerCase() || "";
      const note = record.NOTE?.toLowerCase() || "";

      return (
        memberCode.includes(searchText) ||
        memberName.includes(searchText) ||
        note.includes(searchText)
      );
    });
  };

  // ฟังก์ชันคำนวณ summary ใหม่สำหรับข้อมูลที่ถูกกรอง
  const calculateFilteredSummary = (filteredData) => {
    return filteredData.reduce(
      (acc, record) => {
        acc.count += 1;
        acc.salary += record.mb_salary || 0;
        acc.money += record.mb_money || 0;
        acc.aidAmount += record.INVC_AIDAMNT || 0;
        acc.total1 += record.TOTAL1 || 0;
        acc.total2 += record.TOTAL2 || 0;
        const rawDifference =
          (record.TOTAL2 || 0) -
          ((record.TOTAL1 || 0) + (record.INVC_AIDAMNT || 0));
        const difference =
          Math.abs(rawDifference) < 0.01
            ? 0
            : Math.round(rawDifference * 100) / 100;
        acc.difference += difference;
        return acc;
      },
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
    <div className="data-update-container">
      {/* Control Panel */}
      <Card className="data-update-control-panel">
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Text strong>โหมดการบันทึก:</Text>
              <Button
                type={saveMode === "auto" ? "primary" : "default"}
                onClick={toggleSaveMode}
                icon={saveMode === "auto" ? <SaveOutlined /> : <TeamOutlined />}
              >
                {saveMode === "auto" ? "บันทึกทันที" : "บันทึกครั้งเดียว"}
              </Button>
              {saveMode === "batch" && hasUnsavedChanges && (
                <Tag color="orange">
                  มีการเปลี่ยนแปลง {Object.keys(batchChanges).length} รายการ
                </Tag>
              )}
            </Space>
          </Col>
          <Col>
            {saveMode === "batch" && (
              <Space>
                <Button
                  type="primary"
                  onClick={saveBatchChanges}
                  disabled={Object.keys(batchChanges).length === 0}
                  loading={loading}
                >
                  บันทึกทั้งหมด ({Object.keys(batchChanges).length})
                </Button>
                <Button
                  onClick={cancelAllChanges}
                  disabled={Object.keys(batchChanges).length === 0}
                >
                  ยกเลิกทั้งหมด
                </Button>
              </Space>
            )}
          </Col>
        </Row>
      </Card>

      {/* Header */}
      <Card className="data-update-header-card">
        {/* Grand Totals */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={6} lg={6}>
            <Card className="data-update-statistic-card data-update-statistic-card--blue">
              <Statistic
                title="เรียกเก็บรวม"
                value={grandTotals.total1}
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
            <Card className="data-update-statistic-card data-update-statistic-card--orange">
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
            <Card className="data-update-statistic-card data-update-statistic-card--green">
              <Statistic
                title="เก็บได้รวม"
                value={grandTotals.total2}
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
            <Card className="data-update-statistic-card data-update-statistic-card--red">
              <Statistic
                title="ผลต่างรวม"
                value={Math.abs(formatCurrency(grandTotals.difference))}
                precision={2}
                prefix={grandTotals.difference < 0 ? "-" : ""}
                valueStyle={{
                  color: getDifferenceColor(grandTotals.difference),
                  fontSize: "20px",
                  fontWeight:
                    Math.abs(grandTotals.difference) < 0.01 ? "normal" : "bold",
                }}
                suffix="บาท"
              />
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Department Data */}
      <Collapse
        className="data-update-department-collapse"
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
        items={Object.values(processedData)
          .sort((a, b) => a.dept_code.localeCompare(b.dept_code))
          .map((dept, deptIndex) => ({
            key: dept.dept_code,
            label: (
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
                      maxWidth: "320px",
                    }}
                  >
                    <Text
                      strong
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "240px",
                      }}
                      title={`${dept.dept_code} - ${dept.dept_name}`}
                    >
                      {dept.dept_code} - {dept.dept_name}
                    </Text>
                    <Tag
                      color="blue"
                      style={{ marginLeft: "8px", flexShrink: 0 }}
                    >
                      {dept.totals.count} คน
                    </Tag>
                  </div>

                  {/* สรุปยอดตาม columns ตาราง - แสดงเสมอ */}
                  <div className="data-update-table-summary">
                    {/* ลำดับ */}
                    <div className="summary-cell summary-cell--sequence"></div>

                    {/* เลขสมาชิก */}
                    <div className="summary-cell summary-cell--member-id"></div>

                    {/* ชื่อ-สกุล */}
                    <div className="summary-cell summary-cell--name"></div>

                    {/* เงินเดือน */}
                    <div className="summary-cell summary-cell--salary">
                      <div className="summary-label">เงินเดือน</div>
                      <Text strong>
                        {dept.totals.salary.toLocaleString("th-TH", {
                          minimumFractionDigits: 2,
                        })}
                      </Text>
                    </div>

                    {/* เหลือรับ */}
                    <div className="summary-cell summary-cell--remaining">
                      <div className="summary-label">เหลือรับ</div>
                      <Text strong>
                        {dept.totals.money.toLocaleString("th-TH", {
                          minimumFractionDigits: 2,
                        })}
                      </Text>
                    </div>

                    {/* เรียกเก็บ */}
                    <div className="summary-cell summary-cell--collect">
                      <div className="summary-label">เรียกเก็บ</div>
                      <Text strong style={{ color: "#1890ff" }}>
                        {dept.totals.total1.toLocaleString("th-TH", {
                          minimumFractionDigits: 2,
                        })}
                      </Text>
                    </div>

                    {/* เงินทำบุญ */}
                    <div className="summary-cell summary-cell--aid">
                      <div className="summary-label">เงินทำบุญ</div>
                      <Text strong style={{ color: "#fa8c16" }}>
                        {dept.totals.aidAmount.toLocaleString("th-TH", {
                          minimumFractionDigits: 0,
                        })}
                      </Text>
                    </div>

                    {/* เก็บได้ */}
                    <div className="summary-cell summary-cell--got">
                      <div className="summary-label">เก็บได้</div>
                      <Text strong style={{ color: "#52c41a" }}>
                        {dept.totals.total2.toLocaleString("th-TH", {
                          minimumFractionDigits: 2,
                        })}
                      </Text>
                    </div>

                    {/* ผลต่าง */}
                    <div className="summary-cell summary-cell--difference">
                      <div className="summary-label">ผลต่าง</div>
                      <Text
                        strong={Math.abs(dept.totals.difference) >= 0.01}
                        style={{
                          color: getDifferenceColor(dept.totals.difference),
                          fontWeight:
                            Math.abs(dept.totals.difference) < 0.01
                              ? "normal"
                              : "600",
                        }}
                      >
                        {dept.totals.difference < 0 ? "-" : ""}
                        {Math.abs(dept.totals.difference).toLocaleString(
                          "th-TH",
                          { minimumFractionDigits: 2 }
                        )}
                      </Text>
                    </div>

                    {/* หมายเหตุ */}
                    <div className="summary-cell summary-cell--notes"></div>

                    {/* จัดการ */}
                    <div className="summary-cell summary-cell--actions"></div>
                  </div>
                </div>
              </div>
            ),
            children: (
              <Collapse
                size="small"
                activeKey={sectionExpandedKeys[dept.dept_code] || []}
                onChange={(keys) => {
                  setSectionExpandedKeys((prev) => ({
                    ...prev,
                    [dept.dept_code]: keys,
                  }));
                }}
                items={Object.values(dept.sections)
                  .sort((a, b) => a.sect_code.localeCompare(b.sect_code))
                  .map((section) => ({
                    key: `${dept.dept_code}-${section.sect_code}`,
                    label: (
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
                              maxWidth: "320px",
                            }}
                          >
                            <Text
                              style={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: "240px",
                              }}
                              title={`${section.sect_code} - ${section.sect_name}`}
                            >
                              {section.sect_code} - {section.sect_name}
                            </Text>
                            <Tag
                              color="orange"
                              style={{ marginLeft: "8px", flexShrink: 0 }}
                            >
                              รวม {section.totals.count} คน
                            </Tag>
                          </div>

                          {/* สรุปยอดตาม columns ตาราง (เมื่อปิดอยู่) */}
                          {!sectionExpandedKeys[dept.dept_code]?.includes(
                            `${dept.dept_code}-${section.sect_code}`
                          ) && (
                            <div className="data-update-table-summary">
                              {/* ลำดับ */}
                              <div className="summary-cell summary-cell--sequence"></div>

                              {/* เลขสมาชิก */}
                              <div className="summary-cell summary-cell--member-id"></div>

                              {/* ชื่อ-สกุล */}
                              <div className="summary-cell summary-cell--name"></div>

                              {/* เงินเดือน */}
                              <div className="summary-cell summary-cell--salary">
                                <div className="summary-label">เงินเดือน</div>
                                <Text strong>
                                  {section.totals.salary.toLocaleString(
                                    "th-TH",
                                    { minimumFractionDigits: 2 }
                                  )}
                                </Text>
                              </div>

                              {/* เหลือรับ */}
                              <div className="summary-cell summary-cell--remaining">
                                <div className="summary-label">เหลือรับ</div>
                                <Text strong>
                                  {section.totals.money.toLocaleString(
                                    "th-TH",
                                    { minimumFractionDigits: 2 }
                                  )}
                                </Text>
                              </div>

                              {/* เรียกเก็บ */}
                              <div className="summary-cell summary-cell--collect">
                                <div className="summary-label">เรียกเก็บ</div>
                                <Text strong style={{ color: "#1890ff" }}>
                                  {section.totals.total1.toLocaleString(
                                    "th-TH",
                                    { minimumFractionDigits: 2 }
                                  )}
                                </Text>
                              </div>

                              {/* เงินทำบุญ */}
                              <div className="summary-cell summary-cell--aid">
                                <div className="summary-label">เงินทำบุญ</div>
                                <Text strong style={{ color: "#fa8c16" }}>
                                  {section.totals.aidAmount.toLocaleString(
                                    "th-TH",
                                    { minimumFractionDigits: 0 }
                                  )}
                                </Text>
                              </div>

                              {/* เก็บได้ */}
                              <div className="summary-cell summary-cell--got">
                                <div className="summary-label">เก็บได้</div>
                                <Text strong style={{ color: "#52c41a" }}>
                                  {section.totals.total2.toLocaleString(
                                    "th-TH",
                                    { minimumFractionDigits: 2 }
                                  )}
                                </Text>
                              </div>

                              {/* ผลต่าง */}
                              <div className="summary-cell summary-cell--difference">
                                <div className="summary-label">ผลต่าง</div>
                                <Text
                                  strong={
                                    Math.abs(section.totals.difference) >= 0.01
                                  }
                                  style={{
                                    color: getDifferenceColor(
                                      section.totals.difference
                                    ),
                                    fontWeight:
                                      Math.abs(section.totals.difference) < 0.01
                                        ? "normal"
                                        : "600",
                                  }}
                                >
                                  {section.totals.difference < 0 ? "-" : ""}
                                  {Math.abs(
                                    section.totals.difference
                                  ).toLocaleString("th-TH", {
                                    minimumFractionDigits: 2,
                                  })}
                                </Text>
                              </div>

                              {/* หมายเหตุ */}
                              <div className="summary-cell summary-cell--notes"></div>

                              {/* จัดการ */}
                              <div className="summary-cell summary-cell--actions"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    ),
                    children: (
                      <div>
                        {/* Search box สำหรับแต่ละ section */}
                        <div style={{ marginBottom: "16px" }}>
                          <Input
                            placeholder="ค้นหาเลขสมาชิก, ชื่อ-สกุล, หรือหมายเหตุ..."
                            prefix={<SearchOutlined />}
                            value={
                              searchTexts[
                                `${dept.dept_code}-${section.sect_code}`
                              ] || ""
                            }
                            onChange={(e) =>
                              handleSectionSearch(
                                `${dept.dept_code}-${section.sect_code}`,
                                e.target.value
                              )
                            }
                            allowClear
                            style={{
                              maxWidth: 400,
                              marginBottom: 8,
                            }}
                          />
                          {searchTexts[
                            `${dept.dept_code}-${section.sect_code}`
                          ] && (
                            <div
                              style={{
                                fontSize: "12px",
                                color: "#666",
                                marginLeft: 24,
                              }}
                            >
                              พบ{" "}
                              {
                                getFilteredData(
                                  section.members,
                                  `${dept.dept_code}-${section.sect_code}`
                                ).length
                              }{" "}
                              รายการ จากทั้งหมด {section.members.length} รายการ
                            </div>
                          )}
                        </div>

                        <div className="data-update-table-container">
                          <Table
                            columns={memberColumns}
                            dataSource={getFilteredData(
                              section.members,
                              `${dept.dept_code}-${section.sect_code}`
                            )}
                            rowKey="mb_code"
                            scroll={false}
                            tableLayout="fixed"
                            style={{
                              width: "100%",
                              overflowX: "hidden",
                            }}
                            rowClassName={(record, index) =>
                              index % 2 === 0
                                ? "table-row-light"
                                : "table-row-dark"
                            }
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
                                `แสดง ${range[0]}-${
                                  range[1]
                                } จาก ${total} รายการ${
                                  searchTexts[
                                    `${dept.dept_code}-${section.sect_code}`
                                  ]
                                    ? " (ถูกกรอง)"
                                    : ""
                                }`,
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
                        </div>

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
                              <col style={{ width: "80px" }} />
                              <col style={{ width: "110px" }} />
                              <col style={{ width: "180px" }} />
                              <col style={{ width: "110px" }} />
                              <col style={{ width: "110px" }} />
                              <col style={{ width: "110px" }} />
                              <col style={{ width: "120px" }} />
                              <col style={{ width: "110px" }} />
                              <col style={{ width: "90px" }} />
                              <col style={{ width: "80px" }} />
                              <col style={{ width: "165px" }} />
                            </colgroup>
                            <tbody>
                              <tr>
                                {/* ลำดับ */}
                                <td
                                  style={{
                                    padding: "8px 8px",
                                    textAlign: "center",
                                    fontWeight: "600",
                                    color: "#666",
                                    borderBottom: "none",
                                  }}
                                >
                                  {/* ว่างไว้ */}
                                </td>

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
                                  {(() => {
                                    const filteredData = getFilteredData(
                                      section.members,
                                      `${dept.dept_code}-${section.sect_code}`
                                    );
                                    const hasFilter =
                                      searchTexts[
                                        `${dept.dept_code}-${section.sect_code}`
                                      ];
                                    return hasFilter
                                      ? `รวม ${filteredData.length}/${section.totals.count} คน`
                                      : `รวม ${section.totals.count} คน`;
                                  })()}
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
                                  {(() => {
                                    const filteredData = getFilteredData(
                                      section.members,
                                      `${dept.dept_code}-${section.sect_code}`
                                    );
                                    const hasFilter =
                                      searchTexts[
                                        `${dept.dept_code}-${section.sect_code}`
                                      ];
                                    if (hasFilter) {
                                      const filteredSummary =
                                        calculateFilteredSummary(filteredData);
                                      return filteredSummary.salary.toLocaleString(
                                        "th-TH",
                                        { minimumFractionDigits: 2 }
                                      );
                                    }
                                    return section.totals.salary.toLocaleString(
                                      "th-TH",
                                      { minimumFractionDigits: 2 }
                                    );
                                  })()}
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
                                  {(() => {
                                    const filteredData = getFilteredData(
                                      section.members,
                                      `${dept.dept_code}-${section.sect_code}`
                                    );
                                    const hasFilter =
                                      searchTexts[
                                        `${dept.dept_code}-${section.sect_code}`
                                      ];
                                    if (hasFilter) {
                                      const filteredSummary =
                                        calculateFilteredSummary(filteredData);
                                      return filteredSummary.money.toLocaleString(
                                        "th-TH",
                                        { minimumFractionDigits: 2 }
                                      );
                                    }
                                    return section.totals.money.toLocaleString(
                                      "th-TH",
                                      { minimumFractionDigits: 2 }
                                    );
                                  })()}
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
                                  {(() => {
                                    const filteredData = getFilteredData(
                                      section.members,
                                      `${dept.dept_code}-${section.sect_code}`
                                    );
                                    const hasFilter =
                                      searchTexts[
                                        `${dept.dept_code}-${section.sect_code}`
                                      ];
                                    if (hasFilter) {
                                      const filteredSummary =
                                        calculateFilteredSummary(filteredData);
                                      return filteredSummary.total1.toLocaleString(
                                        "th-TH",
                                        { minimumFractionDigits: 2 }
                                      );
                                    }
                                    return section.totals.total1.toLocaleString(
                                      "th-TH",
                                      { minimumFractionDigits: 2 }
                                    );
                                  })()}
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
                                  {(() => {
                                    const filteredData = getFilteredData(
                                      section.members,
                                      `${dept.dept_code}-${section.sect_code}`
                                    );
                                    const hasFilter =
                                      searchTexts[
                                        `${dept.dept_code}-${section.sect_code}`
                                      ];
                                    if (hasFilter) {
                                      const filteredSummary =
                                        calculateFilteredSummary(filteredData);
                                      return filteredSummary.aidAmount.toLocaleString(
                                        "th-TH",
                                        { minimumFractionDigits: 0 }
                                      );
                                    }
                                    return section.totals.aidAmount.toLocaleString(
                                      "th-TH",
                                      { minimumFractionDigits: 0 }
                                    );
                                  })()}
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
                                  {(() => {
                                    const filteredData = getFilteredData(
                                      section.members,
                                      `${dept.dept_code}-${section.sect_code}`
                                    );
                                    const hasFilter =
                                      searchTexts[
                                        `${dept.dept_code}-${section.sect_code}`
                                      ];
                                    if (hasFilter) {
                                      const filteredSummary =
                                        calculateFilteredSummary(filteredData);
                                      return filteredSummary.total2.toLocaleString(
                                        "th-TH",
                                        { minimumFractionDigits: 2 }
                                      );
                                    }
                                    return section.totals.total2.toLocaleString(
                                      "th-TH",
                                      { minimumFractionDigits: 2 }
                                    );
                                  })()}
                                </td>

                                {/* ผลต่าง */}
                                <td
                                  style={{
                                    padding: "8px 8px",
                                    textAlign: "right",
                                    fontWeight: "600",
                                    color: (() => {
                                      const filteredData = getFilteredData(
                                        section.members,
                                        `${dept.dept_code}-${section.sect_code}`
                                      );
                                      const hasFilter =
                                        searchTexts[
                                          `${dept.dept_code}-${section.sect_code}`
                                        ];
                                      if (hasFilter) {
                                        const filteredSummary =
                                          calculateFilteredSummary(
                                            filteredData
                                          );
                                        return getDifferenceColor(
                                          filteredSummary.difference
                                        );
                                      }
                                      return getDifferenceColor(
                                        section.totals.difference
                                      );
                                    })(),
                                    borderBottom: "none",
                                  }}
                                >
                                  {(() => {
                                    const filteredData = getFilteredData(
                                      section.members,
                                      `${dept.dept_code}-${section.sect_code}`
                                    );
                                    const hasFilter =
                                      searchTexts[
                                        `${dept.dept_code}-${section.sect_code}`
                                      ];
                                    if (hasFilter) {
                                      const filteredSummary =
                                        calculateFilteredSummary(filteredData);
                                      return (
                                        (filteredSummary.difference < 0
                                          ? "-"
                                          : "") +
                                        Math.abs(
                                          filteredSummary.difference
                                        ).toLocaleString("th-TH", {
                                          minimumFractionDigits: 2,
                                        })
                                      );
                                    }
                                    return (
                                      (section.totals.difference < 0
                                        ? "-"
                                        : "") +
                                      Math.abs(
                                        section.totals.difference
                                      ).toLocaleString("th-TH", {
                                        minimumFractionDigits: 2,
                                      })
                                    );
                                  })()}
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
                      </div>
                    ),
                  }))}
              />
            ),
          }))}
      />
    </div>
  );
};

export default DataUpdate;
