export const APP_CONFIG = {
  name: "RD2025",
  headerTitle: "ระบบเงินรายได้ 2025",
  version: "1.0.0",
  year: "2025",
  defaultUser: "021000",
};

export const ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  DASHBOARD_ADMIN: "/dashboard-admin",
  DATA_MANAGEMENT: "/data",
  DATA_UPDATE: "/",
  SETTINGS: "/settings",
};

export const MENU_ITEMS = [
  {
    key: "dashboard",
    path: ROUTES.DASHBOARD,
    label: "หน้าแรก",
    icon: "DashboardOutlined",
  },
  {
    key: "dashboard-admin",
    path: ROUTES.DASHBOARD_ADMIN,
    label: "Admin Dashboard",
    icon: "FundOutlined",
  },
  {
    key: "data",
    path: ROUTES.DATA_MANAGEMENT,
    label: "ข้อมูลหลัก",
    icon: "DatabaseOutlined",
  },
  {
    key: "data-update",
    path: ROUTES.DATA_UPDATE,
    label: "ปรับปรุงข้อมูล",
    icon: "EditOutlined",
  },
  {
    key: "settings",
    path: ROUTES.SETTINGS,
    label: "ตั้งค่า",
    icon: "SettingOutlined",
  },
];

export const TABLE_STYLES = {
  LIGHT_ROW: "table-row-light",
  DARK_ROW: "table-row-dark",
};

export const STATUS_COLORS = {
  SUCCESS: "#52c41a",
  WARNING: "#faad14",
  ERROR: "#ff4d4f",
  NEUTRAL: "#bbb",
  PRIMARY: "#1890ff",
};

export const TOOLTIP_STYLES = `
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
`;

export const TABLE_SHARED_STYLES = `
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

  .${TABLE_STYLES.LIGHT_ROW} td {
    background-color: #f8f9fa !important;
  }
  
  .${TABLE_STYLES.DARK_ROW} td {
    background-color: #ffffff !important;
  }
  
  .${TABLE_STYLES.LIGHT_ROW}:hover td,
  .${TABLE_STYLES.DARK_ROW}:hover td {
    background-color: #e6f7ff !important;
  }
`;

export const CARD_SHARED_STYLES = `
  .dashboard-stat-card {
    border-radius: 12px !important;
    box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12) !important;
    backdrop-filter: blur(10px) !important;
    background: rgba(255, 255, 255, 0.85) !important;
    border: 1px solid rgba(255, 255, 255, 0.3) !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }
  
  .dashboard-stat-card:hover {
    transform: translateY(-4px) !important;
    box-shadow: 0 12px 24px 0 rgba(0, 0, 0, 0.12), 0 6px 12px -6px rgba(0, 0, 0, 0.16) !important;
  }

  .dashboard-stat-card .ant-card-body {
    padding: 24px !important;
  }

  .dashboard-stat-card .ant-statistic-title {
    color: rgba(0, 0, 0, 0.65) !important;
    font-size: 14px !important;
    margin-bottom: 8px !important;
  }

  .dashboard-stat-card .ant-statistic-content {
    color: #1890ff !important;
    font-size: 24px !important;
    font-weight: 600 !important;
  }
`;

export const STATUS_OPTIONS = [
  { value: "all", label: "ทุกสถานะ" },
  { value: "confirmed", label: "ยืนยันแล้ว" },
  { value: "unconfirmed", label: "รอยืนยัน" },
];

export const TABLE_PAGINATION_CONFIG = {
  pageSize: 10,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total) => `ทั้งหมด ${total} รายการ`,
};

export const PASTEL_COLORS = {
  BLUE: {
    LIGHT: "#e6f7ff",
    DEFAULT: "#91d5ff",
    DEEP: "#69c0ff",
  },
  GREEN: {
    LIGHT: "#f6ffed",
    DEFAULT: "#b7eb8f",
    DEEP: "#95de64",
  },
  RED: {
    LIGHT: "#fff1f0",
    DEFAULT: "#ffa39e",
    DEEP: "#ff7875",
  },
  YELLOW: {
    LIGHT: "#fffbe6",
    DEFAULT: "#ffe58f",
    DEEP: "#ffd666",
  },
};

export const GRADIENT_STYLES = {
  CARD: {
    BLUE: "linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)",
    GREEN: "linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)",
    RED: "linear-gradient(135deg, #fff1f0 0%, #ffccc7 100%)",
    YELLOW: "linear-gradient(135deg, #fffbe6 0%, #fff1b8 100%)",
  },
  BACKGROUND: "linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%)",
};

export const CARD_STYLES = {
  BASE: {
    borderRadius: "16px",
    border: "1px solid rgba(0, 0, 0, 0.06)",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
    overflow: "hidden",
  },
  STAT_CARD: {
    padding: "20px",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    transition: "all 0.3s ease",
  },
};
