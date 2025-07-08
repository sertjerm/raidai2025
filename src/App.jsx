import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, message } from 'antd';
import { raidaiTheme } from '@config/theme';
import { ROUTES } from '@config/constants';
import Login from '@pages/Login';
import Dashboard from '@pages/Dashboard';

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
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%)'
        }}>
          <Routes>
            <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
            <Route path={ROUTES.DATA_MANAGEMENT} element={
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                📋 หน้าข้อมูลหลัก - พร้อมสำหรับพัฒนา
              </div>
            } />
            <Route path={ROUTES.REPORTS} element={
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                📈 หน้ารายงาน - พร้อมสำหรับพัฒนา
              </div>
            } />
            <Route path={ROUTES.SETTINGS} element={
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                ⚙️ หน้าตั้งค่า - พร้อมสำหรับพัฒนา
                <br /><br />
                <button 
                  onClick={handleLogout}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  ออกจากระบบ
                </button>
              </div>
            } />
            <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          </Routes>
        </div>
      </Router>
    </ConfigProvider>
  );
}

export default App;
