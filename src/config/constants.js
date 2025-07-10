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
