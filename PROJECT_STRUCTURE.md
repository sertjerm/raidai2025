# 📁 โครงสร้าง Project - RAIDAI 2025

## 🎯 หลักการออกแบบ

- **Reusable Components**: ใช้ components ที่สามารถนำไปใช้ซ้ำได้
- **Centralized Configuration**: รวบรวม config และ constants ไว้ที่เดียว
- **Separation of Concerns**: แยกหน้าที่ของแต่ละส่วนให้ชัดเจน
- **Modern React Patterns**: ใช้ Hooks และ Functional Components

## 📂 โครงสร้างไฟล์

```
src/
├── 🎨 components/           # Reusable UI Components
│   ├── Common/             # ส่วนประกอบทั่วไป
│   │   └── index.js       # StatsCard, FilterBar, DataTable, PageHeader, LoadingWrapper
│   └── Layout/            # Layout components
│       ├── AppLayout.jsx
│       ├── AppHeader.jsx
│       ├── AppSidebar.jsx
│       └── AppFooter.jsx
│
├── ⚙️ config/              # การตั้งค่าและค่าคงที่
│   ├── api.js             # API configuration
│   ├── constants.js       # แอปค่าคงที่, สี, สไตล์
│   └── theme.js           # Ant Design theme
│
├── 🔧 hooks/               # Custom React Hooks
│   └── index.js           # useDashboardData, useDataFilter
│
├── 📄 pages/               # หน้าต่างๆ ของแอป
│   ├── Dashboard/
│   │   ├── Main/          # Dashboard หลัก
│   │   ├── Admin/         # Dashboard สำหรับ Admin
│   │   └── index.js       # Export dashboards
│   ├── DataManagement/
│   ├── DataUpdate/
│   ├── Login/
│   ├── Reports/
│   └── Settings/
│
├── 🌐 services/            # API Services
│   └── index.js           # apiService, raidaiAPI
│
├── 🎨 styles/              # Global Styles
│   ├── main.scss
│   ├── base/
│   ├── components/
│   ├── mixins/
│   ├── utilities/
│   └── variables/
│
└── 🔧 utils/               # Utility Functions
    └── index.js           # formatters, validators, helpers
```

## 🧩 Component Architecture

### 1. **Common Components** (`src/components/Common/`)

Reusable UI components ที่ใช้ได้ทั่วโปรเจกต์:

- `StatsCard` - การ์ดแสดงสถิติ
- `FilterBar` - แถบค้นหาและกรองข้อมูล
- `DataTable` - ตารางข้อมูลแบบมาตรฐาน
- `PageHeader` - หัวข้อหน้า
- `LoadingWrapper` - Wrapper สำหรับ loading state

### 2. **Custom Hooks** (`src/hooks/`)

- `useDashboardData` - จัดการข้อมูล dashboard และสถิติ
- `useDataFilter` - จัดการการกรองและค้นหาข้อมูล

### 3. **Services** (`src/services/`)

- `apiService` - Generic API service สำหรับ HTTP requests
- `raidaiAPI` - Specific API endpoints สำหรับ RAIDAI

### 4. **Utilities** (`src/utils/`)

- การจัดรูปแบบตัวเลขและสกุลเงิน
- การจัดการวันที่และเวลา
- Validation functions
- Local storage helpers
- อื่นๆ

## 🚀 การใช้งาน

### การใช้ Common Components

```jsx
import { StatsCard, FilterBar, DataTable, PageHeader } from '@components/Common';

// Stats Card
<StatsCard
  title="สมาชิกทั้งหมด"
  value="1,234 คน"
  footer="เพิ่มขึ้น 5%"
  gradient={GRADIENT_STYLES.CARD.BLUE}
  icon={<UserOutlined />}
/>

// Filter Bar
<FilterBar
  searchText={searchText}
  onSearchChange={setSearchText}
  departments={departments}
  departmentFilter={departmentFilter}
  onDepartmentChange={setDepartmentFilter}
  statusFilter={statusFilter}
  onStatusChange={setStatusFilter}
  statusOptions={STATUS_OPTIONS}
/>
```

### การใช้ Custom Hooks

```jsx
import { useDashboardData, useDataFilter } from "@hooks";

const Dashboard = ({ user }) => {
  // ใช้ hook สำหรับจัดการข้อมูล
  const { loading, data, stats, fetchData } = useDashboardData(
    "/raidai2025Service/service1.svc/GetRaidai2025",
    user?.userid
  );

  // ใช้ hook สำหรับกรองข้อมูล
  const {
    filteredData,
    searchText,
    setSearchText,
    departmentFilter,
    setDepartmentFilter,
    statusFilter,
    setStatusFilter,
    departments,
  } = useDataFilter(data);

  // ใช้งานได้เลย!
};
```

### การใช้ API Services

```jsx
import { raidaiAPI } from "@services";

// ใช้ specific API
const data = await raidaiAPI.getDashboardData(userId);

// หรือใช้ generic API service
import { apiService } from "@services";
const response = await apiService.get("/endpoint", { param: "value" });
```

### การใช้ Utilities

```jsx
import { formatThaiCurrency, validateEmail, storage } from "@utils";

// จัดรูปแบบเงิน
const formattedAmount = formatThaiCurrency(1234.56); // "฿1,234.56"

// Validation
const isValid = validateEmail("test@example.com");

// Local Storage
storage.set("userData", userData);
const userData = storage.get("userData");
```

## ✅ ประโยชน์ของโครงสร้างใหม่

1. **ลดการเขียนโค้ดซ้ำ** - ใช้ components และ functions ซ้ำได้
2. **ง่ายต่อการบำรุงรักษา** - แก้ไขที่เดียว ได้ผลทุกที่
3. **ทดสอบง่าย** - แต่ละส่วนทำงานแยกกัน
4. **ขยายได้** - เพิ่มฟีเจอร์ใหม่ได้ง่าย
5. **อ่านง่าย** - โครงสร้างชัดเจน ตั้งชื่อเข้าใจง่าย

## 🔄 การ Migration

ขั้นตอนการย้ายจากโครงสร้างเก่า:

1. ✅ สร้าง Common Components
2. ✅ สร้าง Custom Hooks
3. ✅ สร้าง API Services
4. ✅ สร้าง Utilities
5. ✅ ลบไฟล์ซ้ำซ้อน
6. 🔄 อัปเดต existing components ให้ใช้โครงสร้างใหม่
7. 🔄 ทดสอบการทำงาน

## 📝 Notes

- ใช้ path aliases (`@components`, `@hooks`, `@services`, etc.) สำหรับ import
- ทุก component ควรมี PropTypes หรือ TypeScript interfaces
- ใช้ ESLint และ Prettier สำหรับ code formatting
- เขียน JSDoc comments สำหรับ functions ที่ซับซ้อน
