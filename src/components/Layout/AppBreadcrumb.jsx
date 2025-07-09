import { useLocation } from "react-router-dom";
import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { ROUTES } from "@config/constants";

function AppBreadcrumb() {
  const location = useLocation();

  // Get breadcrumb based on current path
  const getBreadcrumb = () => {
    const breadcrumbMap = {
      [ROUTES.DASHBOARD]: [{ title: <HomeOutlined /> }, { title: "หน้าแรก" }],
      [ROUTES.DATA_MANAGEMENT]: [
        { title: <HomeOutlined /> },
        { title: "ข้อมูลหลัก" },
      ],
      [ROUTES.REPORTS]: [{ title: <HomeOutlined /> }, { title: "รายงาน" }],
      [ROUTES.SETTINGS]: [{ title: <HomeOutlined /> }, { title: "ตั้งค่า" }],
    };
    return breadcrumbMap[location.pathname] || [{ title: <HomeOutlined /> }];
  };

  return (
    <div
      style={{
        padding: "16px 24px 0",
        background: "transparent",
      }}
    >
      <Breadcrumb items={getBreadcrumb()} />
    </div>
  );
}

export default AppBreadcrumb;
