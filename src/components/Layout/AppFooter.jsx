import { Layout, Typography } from "antd";
import { APP_CONFIG } from "@config/constants";

const { Footer } = Layout;
const { Text } = Typography;

function AppFooter() {
  return (
    <Footer
      style={{
        textAlign: "center",
        background: "#ffffff",
        borderTop: "1px solid #e6f3ff",
        padding: "16px 24px",
      }}
    >
      <Text type="secondary">
        {APP_CONFIG.name} ©{APP_CONFIG.year} | พัฒนาสำหรับระบบราชการไทย ❤️
      </Text>
    </Footer>
  );
}

export default AppFooter;
