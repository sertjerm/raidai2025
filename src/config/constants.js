export const APP_CONFIG = {
  name: 'ระบบเงินรายได้ 2025',
  version: '1.0.0',
  year: '2025',
  defaultUser: '021000',
};

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  DATA_MANAGEMENT: '/data',
  REPORTS: '/reports',
  SETTINGS: '/settings',
};

export const MENU_ITEMS = [
  {
    key: 'dashboard',
    path: ROUTES.DASHBOARD,
    label: 'หน้าแรก',
    icon: 'DashboardOutlined',
  },
  {
    key: 'data',
    path: ROUTES.DATA_MANAGEMENT,
    label: 'ข้อมูลหลัก',
    icon: 'DatabaseOutlined',
  },
  {
    key: 'reports',
    path: ROUTES.REPORTS,
    label: 'รายงาน',
    icon: 'FileTextOutlined',
  },
  {
    key: 'settings',
    path: ROUTES.SETTINGS,
    label: 'ตั้งค่า',
    icon: 'SettingOutlined',
  },
];
