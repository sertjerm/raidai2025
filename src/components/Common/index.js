// ===== COMMON COMPONENTS =====

// 1. Card Components
export const StatsCard = ({ title, value, footer, gradient, icon }) => {
  return (
    <Card className="stats-card" style={{ background: gradient }}>
      <div className="stats-content">
        <div className="stats-icon">{icon}</div>
        <div className="stats-info">
          <div className="stats-title">{title}</div>
          <div className="stats-value">{value}</div>
          {footer && <div className="stats-footer">{footer}</div>}
        </div>
      </div>
    </Card>
  );
};

// 2. Search and Filter Bar
export const FilterBar = ({
  searchText,
  onSearchChange,
  departments,
  departmentFilter,
  onDepartmentChange,
  statusFilter,
  onStatusChange,
  statusOptions,
}) => {
  return (
    <Card style={CARD_STYLES.BASE}>
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={8} md={6}>
          <Input
            placeholder="ค้นหา ชื่อ, รหัส, หน่วยงาน..."
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            prefix={
              <SearchOutlined style={{ color: PASTEL_COLORS.BLUE.DEEP }} />
            }
            style={{ borderRadius: "6px" }}
          />
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Select
            style={{ width: "100%" }}
            value={departmentFilter}
            onChange={onDepartmentChange}
            placeholder="เลือกหน่วยงาน"
          >
            <Option value="all">ทุกหน่วยงาน</Option>
            {departments.map((dept) => (
              <Option key={dept.code} value={dept.code}>
                {dept.name}
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Select
            style={{ width: "100%" }}
            value={statusFilter}
            onChange={onStatusChange}
            placeholder="สถานะการยืนยัน"
          >
            {statusOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>
    </Card>
  );
};

// 3. Data Table
export const DataTable = ({
  columns,
  dataSource,
  loading,
  pagination,
  rowClassName,
}) => {
  return (
    <Card style={CARD_STYLES.BASE}>
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="mb_code"
        loading={loading}
        scroll={{ x: true }}
        pagination={pagination}
        rowClassName={rowClassName}
      />
    </Card>
  );
};

// 4. Page Header
export const PageHeader = ({ title, subtitle }) => {
  return (
    <div style={{ marginBottom: 24 }}>
      <Title level={4} style={{ margin: 0, color: "#1f1f1f" }}>
        {title}
      </Title>
      <Text type="secondary">{subtitle}</Text>
    </div>
  );
};

// 5. Loading Wrapper
export const LoadingWrapper = ({ loading, children }) => {
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }
  return children;
};
