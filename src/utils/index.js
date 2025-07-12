// ===== UTILITY FUNCTIONS =====

// 1. Number and Currency Formatting
export const formatNumber = (value) => {
  return new Intl.NumberFormat("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatCurrency = (value) => {
  if (value === null || value === undefined || isNaN(value)) return 0;
  const rounded = Math.round(value * 100) / 100;
  return Math.abs(rounded) < 0.01 ? 0 : rounded;
};

export const formatThaiCurrency = (value) => {
  return `฿${formatNumber(formatCurrency(value))}`;
};

// 2. Date Formatting
export const formatDate = (date, format = "DD/MM/YYYY") => {
  if (!date) return "";
  return dayjs(date).format(format);
};

export const formatDateTime = (date) => {
  if (!date) return "";
  return dayjs(date).format("DD/MM/YYYY HH:mm:ss");
};

// 3. Array and Object Utilities
export const getUniqueValues = (array, key) => {
  return [...new Set(array.map((item) => item[key]))];
};

export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

export const sortBy = (array, key, direction = "asc") => {
  return [...array].sort((a, b) => {
    if (direction === "asc") {
      return a[key] > b[key] ? 1 : -1;
    }
    return a[key] < b[key] ? 1 : -1;
  });
};

// 4. Search and Filter Utilities
export const searchInObject = (obj, searchTerm) => {
  const searchLower = searchTerm.toLowerCase();
  return Object.values(obj).some(
    (value) => value && value.toString().toLowerCase().includes(searchLower)
  );
};

export const filterByStatus = (data, status) => {
  if (status === "all") return data;

  if (status === "confirmed") {
    return data.filter((item) => item.ConfirmStatus === 1);
  }

  if (status === "unconfirmed") {
    return data.filter((item) => item.ConfirmStatus !== 1);
  }

  return data;
};

// 5. Validation Utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/[-\s]/g, ""));
};

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value !== "";
};

// 6. Local Storage Utilities
export const storage = {
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  },

  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return defaultValue;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing from localStorage:", error);
    }
  },

  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  },
};

// 7. Debounce Utility
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// 8. Error Handling Utilities
export const handleApiError = (error, customMessage = null) => {
  console.error("API Error:", error);

  const message =
    customMessage ||
    error.response?.data?.message ||
    error.message ||
    "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ";

  return {
    success: false,
    message,
    error,
  };
};

// 9. Table Utilities
export const getTableColumns = (type) => {
  const baseColumns = [
    {
      title: "รหัสสมาชิก",
      dataIndex: "mb_code",
      key: "mb_code",
      width: 120,
    },
    {
      title: "ชื่อ-สกุล",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "หน่วยงาน",
      dataIndex: "dept_name",
      key: "dept_name",
      ellipsis: true,
    },
  ];

  const financialColumns = [
    {
      title: "ยอดเรียกเก็บ",
      dataIndex: "total1",
      key: "total1",
      align: "right",
    },
    {
      title: "ยอดชำระ",
      dataIndex: "total2",
      key: "total2",
      align: "right",
    },
    {
      title: "คงเหลือ",
      dataIndex: "diff",
      key: "diff",
      align: "right",
    },
  ];

  const statusColumn = {
    title: "สถานะ",
    dataIndex: "ConfirmStatus",
    key: "ConfirmStatus",
    align: "center",
  };

  switch (type) {
    case "dashboard":
      return [...baseColumns, ...financialColumns, statusColumn];
    case "admin":
      return [...baseColumns, ...financialColumns, statusColumn];
    case "basic":
      return baseColumns;
    default:
      return baseColumns;
  }
};
