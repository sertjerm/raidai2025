import axios from "axios";
import { getApiUrl } from "@config/api";
import { APP_CONFIG } from "@config/constants";

// สร้าง axios instance
const apiClient = axios.create({
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Service สำหรับจัดการ API calls
export const apiService = {
  // GET request
  async get(endpoint, params = {}) {
    try {
      const url = getApiUrl(endpoint);
      const queryString = new URLSearchParams(params).toString();
      const fullUrl = queryString ? `${url}?${queryString}` : url;

      const response = await apiClient.get(fullUrl);
      return response.data;
    } catch (error) {
      console.error("API GET Error:", error);
      throw error;
    }
  },

  // POST request
  async post(endpoint, data = {}) {
    try {
      const url = getApiUrl(endpoint);
      const response = await apiClient.post(url, data);
      return response.data;
    } catch (error) {
      console.error("API POST Error:", error);
      throw error;
    }
  },

  // PUT request
  async put(endpoint, data = {}) {
    try {
      const url = getApiUrl(endpoint);
      const response = await apiClient.put(url, data);
      return response.data;
    } catch (error) {
      console.error("API PUT Error:", error);
      throw error;
    }
  },

  // DELETE request
  async delete(endpoint) {
    try {
      const url = getApiUrl(endpoint);
      const response = await apiClient.delete(url);
      return response.data;
    } catch (error) {
      console.error("API DELETE Error:", error);
      throw error;
    }
  },
};

// Specific API endpoints
export const raidaiAPI = {
  // Dashboard APIs
  getDashboardData: (userId = APP_CONFIG.defaultUser) =>
    apiService.get("/raidai2025Service/service1.svc/GetRaidai2025", {
      userid: userId,
    }),

  getAdminDashboardData: (userId = APP_CONFIG.defaultUser) =>
    apiService.get("/raidai2025Service/service1.svc/GetRaidaiAdmin2025", {
      userid: userId,
    }),

  // Data Management APIs
  updateMemberData: (data) =>
    apiService.post("/raidai2025Service/service1.svc/UpdateMember", data),

  deleteMemberData: (memberId) =>
    apiService.delete(
      `/raidai2025Service/service1.svc/DeleteMember/${memberId}`
    ),

  // Reports APIs
  getReportData: (params) =>
    apiService.get("/raidai2025Service/service1.svc/GetReports", params),
};
