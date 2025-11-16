"use client";
import { useState, useEffect } from "react";
import {
  MapPinIcon,
  BuildingOfficeIcon,
  PaperAirplaneIcon,
  CubeIcon,
  PuzzlePieceIcon,
  ShieldCheckIcon,
  CalendarIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import {
  MotionDiv,
  MotionH2,
  MotionH3,
  MotionP,
} from "../components/common/MotionWrapper";
// app/admin/page.tsx
interface DashboardStats {
  destinations: number;
  hotels: number;
  flights: number;
  packages: number;
  activities: number;
  insurance: number;
  bookings: number;
  users: number;
  revenue: number;
  growth: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    destinations: 0,
    hotels: 0,
    flights: 0,
    packages: 0,
    activities: 0,
    insurance: 0,
    bookings: 0,
    users: 0,
    revenue: 0,
    growth: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch("/api/admin/dashboard/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
      // Fallback data
      setStats({
        destinations: 12,
        hotels: 156,
        flights: 89,
        packages: 45,
        activities: 67,
        insurance: 23,
        bookings: 234,
        users: 1234,
        revenue: 45678900,
        growth: 15.6,
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      name: "Destinations",
      value: stats.destinations,
      icon: MapPinIcon,
      color: "bg-blue-500",
      change: "+12%",
      changeType: "positive",
    },
    {
      name: "Hotels",
      value: stats.hotels,
      icon: BuildingOfficeIcon,
      color: "bg-green-500",
      change: "+8%",
      changeType: "positive",
    },
    {
      name: "Flights",
      value: stats.flights,
      icon: PaperAirplaneIcon,
      color: "bg-purple-500",
      change: "+15%",
      changeType: "positive",
    },
    {
      name: "Packages",
      value: stats.packages,
      icon: CubeIcon,
      color: "bg-yellow-500",
      change: "+5%",
      changeType: "positive",
    },
    {
      name: "Activities",
      value: stats.activities,
      icon: PuzzlePieceIcon,
      color: "bg-pink-500",
      change: "+20%",
      changeType: "positive",
    },
    {
      name: "Insurance",
      value: stats.insurance,
      icon: ShieldCheckIcon,
      color: "bg-indigo-500",
      change: "+3%",
      changeType: "positive",
    },
    {
      name: "Bookings",
      value: stats.bookings,
      icon: CalendarIcon,
      color: "bg-red-500",
      change: "+25%",
      changeType: "positive",
    },
    {
      name: "Users",
      value: stats.users,
      icon: UsersIcon,
      color: "bg-teal-500",
      change: "+18%",
      changeType: "positive",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <MotionH2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-gray-900"
        >
          Dashboard
        </MotionH2>
        <MotionP
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-600"
        >
          Tổng quan về hoạt động của hệ thống du lịch
        </MotionP>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <MotionDiv
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`${stat.color} rounded-md p-3`}>
                    <stat.icon className="h-6 w-6 text-gray-900" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stat.value.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <span
                  className={`font-medium ${
                    stat.changeType === "positive"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-gray-500"> so với tháng trước</span>
              </div>
            </div>
          </MotionDiv>
        ))}
      </div>

      {/* Revenue and Growth */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white shadow rounded-lg p-6"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Doanh thu tháng này
                </dt>
                <dd className="text-2xl font-bold text-gray-900">
                  {stats.revenue.toLocaleString("vi-VN")} VNĐ
                </dd>
              </dl>
            </div>
          </div>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white shadow rounded-lg p-6"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Tăng trưởng
                </dt>
                <dd className="text-2xl font-bold text-gray-900">
                  +{stats.growth}%
                </dd>
              </dl>
            </div>
          </div>
        </MotionDiv>
      </div>

      {/* Recent Activity */}
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white shadow rounded-lg"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <MotionH3 className="text-lg font-medium text-gray-900">
            Hoạt động gần đây
          </MotionH3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <MapPinIcon className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  Thêm điểm đến mới: Đà Lạt
                </p>
                <p className="text-sm text-gray-500">2 giờ trước</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <BuildingOfficeIcon className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  Cập nhật thông tin khách sạn InterContinental
                </p>
                <p className="text-sm text-gray-500">4 giờ trước</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <PaperAirplaneIcon className="h-4 w-4 text-purple-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  Thêm chuyến bay mới: Hà Nội - Phú Quốc
                </p>
                <p className="text-sm text-gray-500">6 giờ trước</p>
              </div>
            </div>
          </div>
        </div>
      </MotionDiv>
    </div>
  );
}
