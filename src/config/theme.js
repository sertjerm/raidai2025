export const raidaiTheme = {
  token: {
    // Primary colors
    colorPrimary: '#4a90e2',
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorInfo: '#3b82f6',
    
    // Background colors
    colorBgBase: '#f0f8ff',
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBgLayout: '#f0f8ff',
    
    // Border & Radius
    borderRadius: 12,
    borderRadiusLG: 16,
    colorBorder: '#b3d9ff',
    colorBorderSecondary: '#e6f3ff',
    
    // Typography
    fontFamily: '"Segoe UI", "Kanit", Tahoma, Geneva, Verdana, sans-serif',
    fontSize: 14,
    fontSizeLG: 16,
    
    // Box Shadow
    boxShadow: '0 4px 16px rgba(74, 144, 226, 0.15)',
    boxShadowSecondary: '0 2px 8px rgba(74, 144, 226, 0.1)',
  },
  components: {
    Layout: {
      bodyBg: '#f0f8ff',
      headerBg: 'linear-gradient(135deg, #2c5aa0 0%, #4a90e2 100%)',
      headerHeight: 64,
      siderBg: '#f0f8ff',
    },
    Menu: {
      itemBg: 'transparent',
      itemSelectedBg: '#d1ecff',
      itemHoverBg: '#e6f3ff',
      itemActiveBg: '#d1ecff',
      itemSelectedColor: '#2c5aa0',
    },
    Card: {
      borderRadiusLG: 16,
      paddingLG: 24,
    },
    Button: {
      borderRadiusLG: 10,
      fontWeight: 500,
    },
    Input: {
      borderRadius: 8,
      paddingBlock: 8,
    },
  },
};

export default raidaiTheme;
