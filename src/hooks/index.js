import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import { apiService } from "@services/apiService";

// Hook สำหรับจัดการข้อมูล Dashboard
export const useDashboardData = (endpoint, userId) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalAmount: 0,
    collectedAmount: 0,
    uncollectedAmount: 0,
  });

  // Helper functions
  const formatCurrency = useCallback((value) => {
    if (value === null || value === undefined || isNaN(value)) return 0;
    const rounded = Math.round(value * 100) / 100;
    return Math.abs(rounded) < 0.01 ? 0 : rounded;
  }, []);

  const calculateStats = useCallback(
    (items) => {
      const newStats = items.reduce(
        (acc, item) => ({
          totalMembers: acc.totalMembers + 1,
          totalAmount: acc.totalAmount + formatCurrency(item.total1 || 0),
          collectedAmount:
            acc.collectedAmount + formatCurrency(item.total2 || 0),
          uncollectedAmount:
            acc.uncollectedAmount +
            (item.diff < 0 ? Math.abs(formatCurrency(item.diff)) : 0),
        }),
        {
          totalMembers: 0,
          totalAmount: 0,
          collectedAmount: 0,
          uncollectedAmount: 0,
        }
      );
      setStats(newStats);
    },
    [formatCurrency]
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiService.get(endpoint, { userid: userId });

      if (response.responseCode === 200) {
        const rawData = response.data;
        setData(rawData);
        calculateStats(rawData);
        message.success("โหลดข้อมูลสำเร็จ");
        return rawData;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setLoading(false);
    }
  }, [endpoint, userId, calculateStats]);

  useEffect(() => {
    if (endpoint && userId) {
      fetchData();
    }
  }, [fetchData]);

  return {
    loading,
    data,
    stats,
    fetchData,
    formatCurrency,
  };
};

// Hook สำหรับจัดการ Filter
export const useDataFilter = (data) => {
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleFilter = useCallback(() => {
    let result = [...data];

    if (searchText) {
      const searchLower = searchText.toLowerCase();
      result = result.filter(
        (item) =>
          item.fullname?.toLowerCase().includes(searchLower) ||
          item.mb_code?.includes(searchLower) ||
          item.dept_name?.toLowerCase().includes(searchLower)
      );
    }

    if (departmentFilter !== "all") {
      result = result.filter((item) => item.dept_code === departmentFilter);
    }

    if (statusFilter !== "all") {
      const isConfirmed = statusFilter === "confirmed";
      result = result.filter((item) =>
        isConfirmed ? item.ConfirmStatus === 1 : item.ConfirmStatus !== 1
      );
    }

    setFilteredData(result);
  }, [data, searchText, departmentFilter, statusFilter]);

  useEffect(() => {
    handleFilter();
  }, [handleFilter]);

  // Get unique departments
  const departments = useCallback(() => {
    return [
      ...new Set(
        data.map((item) => ({
          code: item.dept_code,
          name: item.dept_name,
        }))
      ),
    ].sort((a, b) => a.name.localeCompare(b.name));
  }, [data]);

  return {
    filteredData,
    searchText,
    setSearchText,
    departmentFilter,
    setDepartmentFilter,
    statusFilter,
    setStatusFilter,
    departments: departments(),
  };
};
