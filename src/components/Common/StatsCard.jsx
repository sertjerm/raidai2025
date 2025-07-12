import React from "react";
import { Card, Row, Col, Typography, Progress } from "antd";
import {
  UserOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { PASTEL_COLORS, GRADIENT_STYLES, CARD_STYLES } from "@config/constants";

const { Text } = Typography;

// Reusable Stats Card Component
export const StatsCard = ({
  title,
  value,
  footer,
  gradient,
  icon,
  progress,
  className = "stats-card",
}) => {
  return (
    <Card
      className={className}
      style={{
        ...CARD_STYLES.BASE,
        ...CARD_STYLES.STAT_CARD,
        background: gradient,
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s ease",
      }}
      bodyStyle={{ padding: "20px" }}
    >
      {/* Background Effect */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <Row align="middle" justify="space-between">
          <Col span={18}>
            <div>
              <Text
                style={{
                  fontSize: "14px",
                  color: "rgba(0, 0, 0, 0.65)",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                {title}
              </Text>
              <Text
                style={{
                  fontSize: "28px",
                  fontWeight: "600",
                  color: "rgba(0, 0, 0, 0.85)",
                  lineHeight: "1.2",
                  display: "block",
                }}
              >
                {value}
              </Text>
            </div>
          </Col>

          {icon && (
            <Col span={6} style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: "32px",
                  color: "rgba(0, 0, 0, 0.25)",
                }}
              >
                {icon}
              </div>
            </Col>
          )}
        </Row>

        {footer && (
          <Text
            style={{
              fontSize: "13px",
              color: "rgba(0, 0, 0, 0.45)",
              marginTop: "12px",
              display: "block",
            }}
          >
            {footer}
          </Text>
        )}

        {progress && (
          <Progress
            percent={progress.percent}
            strokeColor={progress.strokeColor || PASTEL_COLORS.BLUE.DEEP}
            trailColor={progress.trailColor || PASTEL_COLORS.BLUE.LIGHT}
            size="small"
            format={(percent) => `${percent.toFixed(1)}%`}
            style={{ marginTop: "12px" }}
          />
        )}
      </div>
    </Card>
  );
};

// เอาไปใช้ในหน้า Dashboard ได้เลย:
// <StatsCard
//   title="สมาชิกทั้งหมด"
//   value="1,234 คน"
//   footer="ยืนยันแล้ว 856 คน (69.4%)"
//   gradient={GRADIENT_STYLES.CARD.BLUE}
//   icon={<UserOutlined />}
// />

export default StatsCard;
