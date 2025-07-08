import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { 
  ConfigProvider, 
  Layout, 
  Menu, 
  Avatar, 
  Dropdown, 
  Typography, 
  Button,
  Space,
  Breadcrumb,
  message 
} from 'antd';
import { 
  DashboardOutlined, 
  DatabaseOutlined, 
  FileTextOutlined, 
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { raidaiTheme } from '@config/theme';
import { ROUTES, APP_CONFIG } from '@config/constants';
import Login from '@pages/Login';
import Dashboard from '@pages/Dashboard';

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;

// Layout Component for logged-in users
function AppLayout({ user, onLogout, children }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  // Menu items based on your constants
  const menuItems = [
    {
      key: ROUTES.DASHBOARD,
      icon: <DashboardOutlined />,
      label: 'หน้าแรก',
    },
    {
      key: ROUTES.DATA_MANAGEMENT,
      icon: <DatabaseOutlined />,
      label: 'ข้อมูลหลัก',
    },
    {
      key: ROUTES.REPORTS,
      icon: <FileTextOutlined />,
      label: 'รายงาน',
    },
    {
      key: ROUTES.SETTINGS,
      icon: <SettingOutlined />,
      label: 'ตั้งค่า',
    },
  ];

  // User dropdown menu
  const userMenu = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: 'โปรไฟล์',
      },
      {
        type: 'divider',
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'ออกจากระบบ',
        onClick: onLogout,
      },
    ],
  };

  // Get breadcrumb based on current path
  const getBreadcrumb = () => {
    const breadcrumbMap = {
      [ROUTES.DASHBOARD]: [{ title: <HomeOutlined /> }, { title: 'หน้าแรก' }],
      [ROUTES.DATA_MANAGEMENT]: [{ title: <HomeOutlined /> }, { title: 'ข้อมูลหลัก' }],
      [ROUTES.REPORTS]: [{ title: <HomeOutlined /> }, { title: 'รายงาน' }],
      [ROUTES.SETTINGS]: [{ title: <HomeOutlined /> }, { title: 'ตั้งค่า' }],
    };
    return breadcrumbMap[location.pathname] || [{ title: <HomeOutlined /> }];
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        style={{
          background: 'linear-gradient(180deg, #4a90e2 0%, #2c5aa0 100%)',
          boxShadow: '2px 0 8px rgba(74, 144, 226, 0.15)',
        }}
        theme="light"
      >
        {/* Logo */}
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255, 255, 255, 0.1)',
          marginBottom: 8,
        }}>
          <div style={{
            fontSize: collapsed ? '20px' : '24px',
            transition: 'all 0.3s',
          }}>
            {collapsed ? '🏛️' : '🏛️ RaiDai2025'}
          </div>
        </div>

        {/* Menu */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{
            background: 'transparent',
            border: 'none',
          }}
          onClick={({ key }) => {
            window.location.pathname = key;
          }}
        />
      </Sider>

      {/* Main Layout */}
      <Layout>
        {/* Header */}
        <Header style={{
          padding: '0 24px',
          background: '#ffffff',
          boxShadow: '0 2px 8px rgba(74, 144, 226, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 1000,
        }}>
          <div>
            <Title level={4} style={{ 
              margin: 0, 
              color: '#1a365d',
              background: 'linear-gradient(45deg, #2c5aa0, #4a90e2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              {APP_CONFIG.name}
            </Title>
          </div>

          <Space>
            <Text style={{ color: '#4a6cf7' }}>
              ยินดีต้อนรับ, {user}
            </Text>
            <Dropdown menu={userMenu} placement="bottomRight" arrow>
              <Button 
                type="text" 
                shape="circle"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Avatar 
                  size="small" 
                  icon={<UserOutlined />} 
                  style={{
                    background: 'linear-gradient(45deg, #4a90e2, #2c5aa0)',
                  }}
                />
              </Button>
            </Dropdown>
          </Space>
        </Header>

        {/* Content */}
        <Content style={{
          margin: 0,
          background: 'linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%)',
          minHeight: 'calc(100vh - 64px - 70px)', // Full height minus header and footer
        }}>
          {/* Breadcrumb */}
          <div style={{
            padding: '16px 24px 0',
            background: 'transparent',
          }}>
            <Breadcrumb items={getBreadcrumb()} />
          </div>

          {/* Page Content */}
          <div style={{
            padding: '24px',
            minHeight: 'calc(100vh - 64px - 70px - 56px)', // Adjust for breadcrumb
          }}>
            {children}
          </div>
        </Content>

        {/* Footer */}
        <Footer style={{
          textAlign: 'center',
          background: '#ffffff',
          borderTop: '1px solid #e6f3ff',
          padding: '16px 24px',
        }}>
          <Text type="secondary">
            {APP_CONFIG.name} ©{APP_CONFIG.year} | 
            พัฒนาสำหรับระบบราชการไทย ❤️
          </Text>
        </Footer>
      </Layout>
    </Layout>
  );
}

// Main App Component
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (username) => {
    setIsLoggedIn(true);
    setUser(username);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    message.success('ออกจากระบบเรียบร้อยแล้ว');
  };

  if (!isLoggedIn) {
    return (
      <ConfigProvider theme={raidaiTheme}>
        <Login onLogin={handleLogin} />
      </ConfigProvider>
    );
  }

  return (
    <ConfigProvider theme={raidaiTheme}>
      <Router>
        <AppLayout user={user} onLogout={handleLogout}>
          <Routes>
            <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
            
            <Route path={ROUTES.DATA_MANAGEMENT} element={
              <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '2rem',
                textAlign: 'center',
                boxShadow: '0 4px 16px rgba(74, 144, 226, 0.15)',
                border: '1px solid #e6f3ff',
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                <Title level={3} style={{ color: '#1a365d', marginBottom: '0.5rem' }}>
                  ข้อมูลหลัก
                </Title>
                <Text style={{ color: '#4a6cf7', fontSize: '16px' }}>
                  หน้านี้พร้อมสำหรับการพัฒนาฟีเจอร์การจัดการข้อมูล
                </Text>
              </div>
            } />

            <Route path={ROUTES.REPORTS} element={
              <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '2rem',
                textAlign: 'center',
                boxShadow: '0 4px 16px rgba(74, 144, 226, 0.15)',
                border: '1px solid #e6f3ff',
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📈</div>
                <Title level={3} style={{ color: '#1a365d', marginBottom: '0.5rem' }}>
                  รายงาน
                </Title>
                <Text style={{ color: '#4a6cf7', fontSize: '16px' }}>
                  หน้านี้พร้อมสำหรับการพัฒนาฟีเจอร์รายงานและการวิเคราะห์ข้อมูล
                </Text>
              </div>
            } />

            <Route path={ROUTES.SETTINGS} element={
              <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '2rem',
                textAlign: 'center',
                boxShadow: '0 4px 16px rgba(74, 144, 226, 0.15)',
                border: '1px solid #e6f3ff',
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚙️</div>
                <Title level={3} style={{ color: '#1a365d', marginBottom: '0.5rem' }}>
                  ตั้งค่าระบบ
                </Title>
                <Text style={{ color: '#4a6cf7', fontSize: '16px', display: 'block', marginBottom: '2rem' }}>
                  หน้านี้พร้อมสำหรับการพัฒนาฟีเจอร์การตั้งค่าระบบ
                </Text>
                <Button 
                  type="primary" 
                  danger 
                  icon={<LogoutOutlined />}
                  onClick={handleLogout}
                  style={{
                    borderRadius: '8px',
                    height: '40px',
                    paddingLeft: '20px',
                    paddingRight: '20px',
                  }}
                >
                  ออกจากระบบ
                </Button>
              </div>
            } />

            <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          </Routes>
        </AppLayout>
      </Router>
    </ConfigProvider>
  );
}

export default App;