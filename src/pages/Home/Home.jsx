import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Typography,
  Steps,
  Alert,
  Button,
  Space,
  Divider,
  Tag,
  Timeline,
} from "antd";
import {
  BookOutlined,
  UserOutlined,
  SettingOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  QuestionCircleOutlined,
  SafetyCertificateOutlined,
  BulbOutlined,
  EditOutlined,
  FundOutlined,
  RightOutlined,
} from "@ant-design/icons";
import {
  CARD_STYLES,
  PASTEL_COLORS,
  APP_CONFIG,
  ROUTES,
} from "@config/constants";

const { Title, Text, Paragraph } = Typography;

const Home = ({ user }) => {
  const navigate = useNavigate();

  console.log("Home component rendered with user:", user);
  console.log("Current location:", window.location.href);

  // Quick action สำหรับ user แต่ละประเภท
  const getQuickActions = () => {
    if (user?.userid === "admin") {
      return [
        {
          title: "Dashboard ผู้ดูแล",
          description: "ดูสรุปการเก็บเงินและสถิติของทั้งระบบ",
          icon: <FundOutlined />,
          color: PASTEL_COLORS.PURPLE.DEFAULT,
          path: ROUTES.DASHBOARD_ADMIN,
          primary: true,
        },
        {
          title: "จัดการข้อมูล",
          description: "เพิ่ม แก้ไข หรือลบข้อมูลสมาชิกสหกรณ์",
          icon: <DatabaseOutlined />,
          color: PASTEL_COLORS.GREEN.DEFAULT,
          path: ROUTES.DATA_MANAGEMENT,
        },
        {
          title: "อัปเดตข้อมูล",
          description: "รายงานยอดเก็บได้และปรับปรุงข้อมูลสมาชิก",
          icon: <EditOutlined />,
          color: PASTEL_COLORS.BLUE.DEFAULT,
          path: ROUTES.DATA_UPDATE,
        },
      ];
    }

    return [
      {
        title: "อัปเดตข้อมูล",
        description: "รายงานยอดเก็บได้และปรับปรุงข้อมูลสมาชิกในหน่วยงาน",
        icon: <EditOutlined />,
        color: PASTEL_COLORS.BLUE.DEFAULT,
        path: ROUTES.DATA_UPDATE,
        primary: true,
      },
    ];
  };
  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <Card
        style={{ ...CARD_STYLES.BASE, marginBottom: 24, textAlign: "center" }}
      >
        <Title
          level={2}
          style={{ color: PASTEL_COLORS.BLUE.DEEP, marginBottom: 8 }}
        >
          🏛️ ยินดีต้อนรับสู่ระบบเงินรายได้ {APP_CONFIG.year}
        </Title>
        <Text
          type="secondary"
          style={{ fontSize: "16px", display: "block", marginBottom: 16 }}
        >
          ระบบสหกรณ์แจ้งยอดเรียกเก็บและรายงานยอดชำระสำหรับพนักงานเงินรายได้
          มหาวิทยาลัยเกษตรศาสตร์
        </Text>

        {user && (
          <Space direction="vertical" size="small">
            <Text
              strong
              style={{ fontSize: "16px", color: PASTEL_COLORS.GREEN.DEEP }}
            >
              👋 สวัสดี {user.fullname || user.userid}
            </Text>
            <Space wrap>
              <Tag color={user.userid === "admin" ? "purple" : "blue"}>
                {user.userid === "admin" ? "👑 ผู้ดูแลระบบ" : "👤 ผู้ใช้งาน"}
              </Tag>
              <Tag color="green">ID: {user.userid}</Tag>
              {user.dept_name && (
                <Tag color="orange">หน่วยงาน: {user.dept_name}</Tag>
              )}
            </Space>
          </Space>
        )}
      </Card>

      {/* Quick Actions */}
      <Card style={{ ...CARD_STYLES.BASE, marginBottom: 24 }}>
        <Title level={4} style={{ marginBottom: 16, textAlign: "center" }}>
          🚀 เริ่มต้นการใช้งาน
        </Title>
        <Row gutter={[16, 16]} justify="center">
          {getQuickActions().map((action, index) => (
            <Col xs={24} sm={12} md={8} key={index}>
              <Card
                hoverable
                style={{
                  borderColor: action.color,
                  borderWidth: action.primary ? "2px" : "1px",
                  height: "100%",
                  textAlign: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
                onClick={() => navigate(action.path)}
              >
                {action.primary && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      background: action.color,
                      color: "white",
                      padding: "4px 12px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      borderBottomLeftRadius: "8px",
                    }}
                  >
                    แนะนำ
                  </div>
                )}
                <div
                  style={{
                    fontSize: "32px",
                    color: action.color,
                    marginBottom: "12px",
                  }}
                >
                  {action.icon}
                </div>
                <Title level={5} style={{ marginBottom: 8 }}>
                  {action.title}
                </Title>
                <Text type="secondary" style={{ fontSize: "14px" }}>
                  {action.description}
                </Text>
                <div style={{ marginTop: "12px" }}>
                  <Button
                    type={action.primary ? "primary" : "default"}
                    icon={<RightOutlined />}
                    style={{
                      backgroundColor: action.primary
                        ? action.color
                        : undefined,
                      borderColor: action.color,
                    }}
                  >
                    เข้าใช้งาน
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {user?.userid === "admin" && (
          <Alert
            message="สำหรับผู้ดูแลระบบ"
            description="คุณมีสิทธิ์เข้าถึงฟีเจอร์พิเศษสำหรับการจัดการระบบ"
            type="info"
            showIcon
            style={{ marginTop: 16 }}
          />
        )}
      </Card>

      <Row gutter={[24, 24]}>
        {/* ภาพรวมระบบ */}
        <Col xs={24} lg={12}>
          <Card
            style={{ ...CARD_STYLES.BASE, height: "100%" }}
            title={
              <Space>
                <InfoCircleOutlined
                  style={{ color: PASTEL_COLORS.BLUE.DEEP }}
                />
                <span>ภาพรวมระบบ</span>
              </Space>
            }
          >
            <Paragraph>
              ระบบเงินรายได้ {APP_CONFIG.year}{" "}
              เป็นระบบที่สหกรณ์ใช้สำหรับแจ้งยอดเรียกเก็บไปยังสมาชิก
              เพื่อให้พนักงานเงินรายได้ในหน่วยงานต่างๆ ของมหาวิทยาลัยเกษตรศาสตร์
              รายงานยอดที่เก็บได้จริงและปรับปรุงข้อมูลเงินเดือน
              เงินเหลือรับของสมาชิก
            </Paragraph>

            <Title level={5}>🎯 วัตถุประสงค์หลัก:</Title>
            <ul style={{ paddingLeft: "20px" }}>
              <li>� รับแจ้งยอดเรียกเก็บจากสหกรณ์</li>
              <li>💰 รายงานยอดที่เก็บได้จริงจากสมาชิก</li>
              <li>👥 ปรับปรุงข้อมูลเงินเดือน เงินเหลือรับของสมาชิก</li>
              <li>📈 สร้างรายงานสรุปการเก็บเงินแต่ละหน่วยงาน</li>
              <li>✅ ตรวจสอบและยืนยันความถูกต้องของข้อมูล</li>
            </ul>
          </Card>
        </Col>

        {/* สิทธิ์การเข้าใช้งาน */}
        <Col xs={24} lg={12}>
          <Card
            style={{ ...CARD_STYLES.BASE, height: "100%" }}
            title={
              <Space>
                <SafetyCertificateOutlined
                  style={{ color: PASTEL_COLORS.GREEN.DEEP }}
                />
                <span>สิทธิ์การเข้าใช้งาน</span>
              </Space>
            }
          >
            <Timeline
              items={[
                {
                  dot: (
                    <UserOutlined style={{ color: PASTEL_COLORS.BLUE.DEEP }} />
                  ),
                  children: (
                    <div>
                      <Text strong>พนักงานเงินรายได้</Text>
                      <br />
                      <Text type="secondary">
                        เข้าใช้หน้า "อัปเดตข้อมูล"
                        เพื่อรายงานยอดเก็บได้และปรับปรุงข้อมูลสมาชิก
                      </Text>
                    </div>
                  ),
                },
                {
                  dot: (
                    <SettingOutlined
                      style={{ color: PASTEL_COLORS.PURPLE.DEEP }}
                    />
                  ),
                  children: (
                    <div>
                      <Text strong>ผู้ดูแลระบบ</Text>
                      <br />
                      <Text type="secondary">
                        เข้าใช้หน้า "Dashboard ผู้ดูแล"
                        เพื่อดูสรุปการเก็บเงินทั้งหมดและจัดการข้อมูล
                      </Text>
                    </div>
                  ),
                },
              ]}
            />
          </Card>
        </Col>

        {/* ขั้นตอนการใช้งานสำหรับผู้ใช้ทั่วไป */}
        <Col xs={24}>
          <Card
            style={{ ...CARD_STYLES.BASE }}
            title={
              <Space>
                <UserOutlined style={{ color: PASTEL_COLORS.BLUE.DEEP }} />
                <span>ขั้นตอนการใช้งานสำหรับผู้ใช้ทั่วไป</span>
              </Space>
            }
          >
            <Steps
              direction="vertical"
              current={-1}
              items={[
                {
                  title: "เข้าสู่ระบบ",
                  description: "ใส่ Username และ Password เพื่อเข้าสู่ระบบ",
                  icon: <CheckCircleOutlined />,
                },
                {
                  title: "ตรวจสอบข้อมูลส่วนตัว",
                  description: "ตรวจสอบข้อมูลรายชื่อ หน่วยงาน และยอดเงินของคุณ",
                  icon: <DatabaseOutlined />,
                },
                {
                  title: "แก้ไขข้อมูล (ถ้าจำเป็น)",
                  description:
                    "แก้ไขข้อมูลที่ไม่ถูกต้อง และเพิ่มหมายเหตุเพิ่มเติม",
                  icon: <FileTextOutlined />,
                },
                {
                  title: "บันทึกการเปลี่ยนแปลง",
                  description: "กดบันทึกเพื่อยืนยันการเปลี่ยนแปลงข้อมูล",
                  icon: <CheckCircleOutlined />,
                },
              ]}
            />
          </Card>
        </Col>

        {/* ขั้นตอนการใช้งานสำหรับ Admin */}
        <Col xs={24}>
          <Card
            style={{ ...CARD_STYLES.BASE }}
            title={
              <Space>
                <SettingOutlined style={{ color: PASTEL_COLORS.PURPLE.DEEP }} />
                <span>ขั้นตอนการใช้งานสำหรับผู้ดูแลระบบ</span>
              </Space>
            }
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card
                  size="small"
                  style={{ backgroundColor: PASTEL_COLORS.BLUE.LIGHT }}
                >
                  <Title level={5}>📊 Dashboard ผู้ดูแล</Title>
                  <ul>
                    <li>ดูสถิติภาพรวมของระบบ</li>
                    <li>ติดตามยอดเงินรวมและสถานะการยืนยัน</li>
                    <li>ตรวจสอบข้อมูลตามหน่วยงาน</li>
                    <li>ดูรายงานแบบ Real-time</li>
                  </ul>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card
                  size="small"
                  style={{ backgroundColor: PASTEL_COLORS.GREEN.LIGHT }}
                >
                  <Title level={5}>🔧 การจัดการข้อมูล</Title>
                  <ul>
                    <li>เพิ่ม/แก้ไข/ลบข้อมูลสมาชิก</li>
                    <li>อนุมัติการเปลี่ยนแปลงข้อมูล</li>
                    <li>จัดการหน่วยงานและแผนก</li>
                    <li>ส่งออกรายงานเป็นไฟล์</li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* คำถามที่พบบ่อย */}
        <Col xs={24}>
          <Card
            style={{ ...CARD_STYLES.BASE }}
            title={
              <Space>
                <QuestionCircleOutlined
                  style={{ color: PASTEL_COLORS.YELLOW.DEEP }}
                />
                <span>คำถามที่พบบ่อย (FAQ)</span>
              </Space>
            }
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card size="small">
                  <Title level={5}>❓ ลืม Password ทำอย่างไร?</Title>
                  <Text>ติดต่อผู้ดูแลระบบเพื่อขอรีเซ็ต Password ใหม่</Text>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card size="small">
                  <Title level={5}>❓ ข้อมูลไม่ถูกต้องต้องทำอย่างไร?</Title>
                  <Text>
                    แก้ไขข้อมูลในหน้า "อัปเดตข้อมูล" และเพิ่มหมายเหตุเพิ่มเติม
                  </Text>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card size="small">
                  <Title level={5}>❓ ไม่เห็นข้อมูลของตัวเอง?</Title>
                  <Text>
                    ตรวจสอบ Username ที่ใช้เข้าสู่ระบบ หรือติดต่อผู้ดูแล
                  </Text>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card size="small">
                  <Title level={5}>❓ ระบบช้าหรือขัดข้อง?</Title>
                  <Text>
                    รีเฟรชหน้าเว็บ หรือติดต่อทีม IT สำหรับการช่วยเหลือ
                  </Text>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* เคล็ดลับการใช้งาน */}
        <Col xs={24}>
          <Card
            style={{ ...CARD_STYLES.BASE }}
            title={
              <Space>
                <BulbOutlined style={{ color: PASTEL_COLORS.ORANGE.DEEP }} />
                <span>เคล็ดลับการใช้งาน</span>
              </Space>
            }
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <Alert
                  message="💡 การค้นหาข้อมูล"
                  description="ใช้ช่องค้นหาเพื่อหาข้อมูลสมาชิกได้อย่างรวดเร็ว"
                  type="info"
                  showIcon
                />
              </Col>
              <Col xs={24} md={8}>
                <Alert
                  message="💡 การใช้ Filter"
                  description="กรองข้อมูลตามหน่วยงานหรือสถานะเพื่อดูข้อมูลที่ต้องการ"
                  type="success"
                  showIcon
                />
              </Col>
              <Col xs={24} md={8}>
                <Alert
                  message="💡 การบันทึกข้อมูล"
                  description="อย่าลืมกดบันทึกหลังจากแก้ไขข้อมูลทุกครั้ง"
                  type="warning"
                  showIcon
                />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* ข้อมูลติดต่อ */}
        <Col xs={24}>
          <Card
            style={{ ...CARD_STYLES.BASE, textAlign: "center" }}
            title="📞 ข้อมูลติดต่อ"
          >
            <Space direction="vertical" size="middle">
              <Text>หากมีปัญหาหรือข้อสงสัยเกี่ยวกับการใช้งานระบบ</Text>
              <Space wrap>
                <Tag color={PASTEL_COLORS.BLUE.DEFAULT}>
                  📧 support@raidai2025.com
                </Tag>
                <Tag color={PASTEL_COLORS.GREEN.DEFAULT}>📱 02-xxx-xxxx</Tag>
                <Tag color={PASTEL_COLORS.PURPLE.DEFAULT}>
                  💬 Line: @raidai2025
                </Tag>
              </Space>
              <Text type="secondary">
                ทีมงานพร้อมให้บริการ วันจันทร์-ศุกร์ เวลา 08:30-17:30 น.
              </Text>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
