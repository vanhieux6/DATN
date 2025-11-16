"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  DocumentArrowDownIcon,
  ArrowPathIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  TicketIcon,
  CheckBadgeIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

type Booking = {
  id: string;
  bookingCode: string;
  passengers: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  user?: { id: string; name?: string; email?: string };
};

export default function AdminFlightBookingsPage() {
  const params = useParams();
  const flightId = params?.id as string;
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!flightId) return;
    fetchBookings();
    fetchStats();
  }, [flightId]);

  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/flights/${flightId}/bookings`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) setBookings(data.bookings || []);
      else setError(data.message || "Lỗi tải dữ liệu");
    } catch {
      setError("Lỗi kết nối");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`/api/admin/flights/${flightId}/bookings/stats`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) setStats(data);
    } catch (err) {
      console.error("Lỗi tải thống kê:", err);
    }
  };

  const handleCancel = async (bookingId: string) => {
    if (!confirm("Bạn có chắc muốn hủy booking này?")) return;
    try {
      const res = await fetch(`/api/admin/flights/cancel/${bookingId}`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        alert("Hủy thành công");
        fetchBookings();
        fetchStats();
      } else {
        alert(data.message || "Lỗi khi hủy");
      }
    } catch {
      alert("Lỗi kết nối");
    }
  };

  const handleExport = () => {
    window.open(`/api/admin/flights/${flightId}/bookings/export`, "_blank");
  };

  const getUserDisplay = (user: Booking["user"]) => {
    return user?.name || user?.email || user?.id || "Không xác định";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckBadgeIcon className="h-4 w-4" />;
      case "cancelled":
        return <XCircleIcon className="h-4 w-4" />;
      default:
        return <TicketIcon className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  if (!flightId) return <div className="p-6">Không tìm thấy chuyến bay</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => router.push("/admin/flights")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 hover:border-gray-300"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Quay lại danh sách</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Quản lý Bookings
              </h1>
              <p className="text-gray-600 text-lg">
                Chuyến bay{" "}
                <span className="font-mono font-semibold text-blue-600">
                  #{flightId}
                </span>
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition-all duration-200 font-medium"
              >
                <DocumentArrowDownIcon className="h-5 w-5" />
                Export CSV
              </button>
              <button
                onClick={fetchBookings}
                disabled={loading}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg shadow font-medium transition-all duration-200 ${
                  loading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                }`}
              >
                <ArrowPathIcon
                  className={`h-5 w-5 ${loading ? "animate-spin" : ""}`}
                />
                {loading ? "Đang tải..." : "Làm mới"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 text-red-800">
            <XCircleIcon className="h-5 w-5" />
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserGroupIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">
                  Tổng booking
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.totalBookings}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">
                  Doanh thu
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {(stats.totalRevenue || 0).toLocaleString()} VND
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TicketIcon className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">
                  Ghế đã bán
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.seatsSold}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CheckBadgeIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">
                  Chỗ trống
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.availableSeats}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Danh sách Bookings ({bookings.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Mã Booking
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Khách hàng
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Số hành khách
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Tổng tiền
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                        {booking.bookingCode}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {getUserDisplay(booking.user)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <UserGroupIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {booking.passengers ?? 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {(booking.totalPrice ?? 0).toLocaleString()} VND
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {getStatusIcon(booking.status)}
                        <span className="capitalize">{booking.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {booking.status !== "cancelled" && (
                        <button
                          onClick={() => handleCancel(booking.id)}
                          className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-200 text-sm font-medium shadow-sm"
                        >
                          <XCircleIcon className="h-4 w-4" />
                          Hủy
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                      <TicketIcon className="h-12 w-12" />
                      <div>
                        <p className="font-medium text-lg">
                          Không có booking nào
                        </p>
                        <p className="text-sm">
                          Chưa có booking nào cho chuyến bay này
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
