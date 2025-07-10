// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// Helper function สำหรับสร้าง API URL
export const getApiUrl = (endpoint) => {
  // ถ้าเป็น development ใช้ proxy (/api/)
  if (import.meta.env.DEV) {
    return `/api${endpoint}`;
  }

  // ถ้าเป็น production ใช้ full URL
  return `${API_BASE_URL}${endpoint}`;
};

export { API_BASE_URL };
