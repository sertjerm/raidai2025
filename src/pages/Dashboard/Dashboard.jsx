import { Card, Row, Col, Statistic, Typography } from 'antd';
import { DollarOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Dashboard = () => {
  const statsData = [
    {
      title: 'รายได้ทั้งหมด',
      value: 790532.96,
      precision: 2,
      valueStyle: { color: '#4a90e2' },
      prefix: <DollarOutlined />,
      suffix: '฿',
    },
    {
      title: 'เก็บได้',
      value: 790532.96,
      precision: 2,
      valueStyle: { color: '#10b981' },
      prefix: <CheckCircleOutlined />,
      suffix: '฿',
    },
    {
      title: 'เก็บไม่ได้',
      value: 0,
      precision: 2,
      valueStyle: { color: '#ef4444' },
      prefix: <CloseCircleOutlined />,
      suffix: '฿',
    },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <Title level={2} style={{ marginBottom: 24, color: '#1a365d' }}>
        📊 แดชบอร์ด
      </Title>
      
      <Row gutter={[24, 24]}>
        {statsData.map((stat, index) => (
          <Col xs={24} sm={12} lg={8} key={index}>
            <Card style={{
              borderRadius: 16,
              boxShadow: '0 4px 16px rgba(74, 144, 226, 0.15)',
              border: '1px solid #e6f3ff',
              background: 'linear-gradient(135deg, #ffffff 0%, #f0f8ff 100%)',
            }}>
              <Statistic {...stat} />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card
            title="ข้อมูลสรุป"
            style={{
              borderRadius: 16,
              boxShadow: '0 4px 16px rgba(74, 144, 226, 0.15)',
              border: '1px solid #e6f3ff',
            }}
          >
            <p style={{ fontSize: 16, color: '#4a6cf7', textAlign: 'center', padding: '2rem' }}>
              ยินดีต้อนรับสู่ระบบเงินรายได้ 2025 🎉
              <br />
              พื้นที่นี้พร้อมสำหรับเพิ่มเนื้อหาและฟีเจอร์ต่างๆ
            </p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
