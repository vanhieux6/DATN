// app/account/bookings/tours/[bookingCode]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  CalendarIcon,
  UserIcon,
  CreditCardIcon,
  CheckBadgeIcon,
  ClockIcon,
  MapPinIcon,
  ShieldCheckIcon,
  PhoneIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

interface TourBookingDetail {
  id: string;
  bookingCode: string;
  participants: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  selectedDate?: string;
  specialRequests?: any;
  contactInfo?: any;
  package: {
    id: number;
    title: string;
    destination?: {
      city: string;
      country: string;
    };
  };
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
}

export default function TourBookingDetailPage() {
  const params = useParams();
  const bookingCode = params?.bookingCode as string;
  const router = useRouter();
  const [booking, setBooking] = useState<TourBookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (bookingCode) {
      fetchBookingDetail();
    }
  }, [bookingCode]);

  const fetchBookingDetail = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`/api/bookings/tours/${bookingCode}`, {
        credentials: "include",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setBooking(data.booking);
      } else {
        setError(data.message || "Không thể tải thông tin đặt tour");
      }
    } catch (err) {
      setError("Lỗi kết nối, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "confirmed":
        return {
          color: "bg-green-100 text-green-800 border-green-200",
          icon: CheckBadgeIcon,
          text: "Đã xác nhận",
        };
      case "cancelled":
        return {
          color: "bg-red-100 text-red-800 border-red-200",
          icon: ClockIcon,
          text: "Đã hủy",
        };
      case "pending":
        return {
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: ClockIcon,
          text: "Đang chờ xác nhận",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: ClockIcon,
          text: status,
        };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-48 bg-gray-300 rounded"></div>
                <div className="h-32 bg-gray-300 rounded"></div>
              </div>
              <div className="space-y-4">
                <div className="h-32 bg-gray-300 rounded"></div>
                <div className="h-24 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-6xl mb-4">😔</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {error || "Không tìm thấy thông tin đặt tour"}
            </h2>
            <p className="text-gray-600 mb-6">
              Vui lòng kiểm tra lại mã đặt tour hoặc liên hệ hỗ trợ
            </p>
            <button
              onClick={() => router.push("/account/bookings")}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
            >
              Quay lại danh sách tour
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(booking.status);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/account/bookings")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span className="font-medium">Quay lại danh sách tour</span>
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Chi tiết đặt tour
              </h1>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Mã đặt tour:</span>
                  <span className="font-mono font-bold text-green-600 text-lg">
                    {booking.bookingCode}
                  </span>
                </div>
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${statusConfig.color}`}
                >
                  <statusConfig.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {statusConfig.text}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tour Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold mb-1">Thông tin tour</h2>
                    <p className="text-green-100">
                      {booking.package.destination?.city},{" "}
                      {booking.package.destination?.country}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="text-sm text-gray-500">Tên tour</div>
                    <div className="font-semibold text-gray-900 text-lg">
                      {booking.package.title}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Điểm đến</div>
                    <div className="font-semibold text-gray-900">
                      {booking.package.destination?.city},{" "}
                      {booking.package.destination?.country}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <div className="text-xs text-gray-500">
                      Số người tham gia
                    </div>
                    <div className="font-semibold text-gray-900">
                      {booking.participants} người
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Ngày khởi hành</div>
                    <div className="font-semibold text-gray-900">
                      {booking.selectedDate
                        ? formatDate(booking.selectedDate)
                        : "Chưa chọn"}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Tổng tiền</div>
                    <div className="font-semibold text-green-600">
                      {booking.totalPrice.toLocaleString()} VND
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Ngày đặt</div>
                    <div className="font-semibold text-gray-900">
                      {formatDate(booking.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Special Requests */}
            {booking.specialRequests && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <UserIcon className="h-5 w-5 text-blue-600" />
                  Yêu cầu đặc biệt
                </h3>
                <div className="text-gray-700">
                  {booking.specialRequests.notes || "Không có yêu cầu đặc biệt"}
                </div>
              </div>
            )}

            {/* Contact Information */}
            {booking.contactInfo && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <UserIcon className="h-5 w-5 text-purple-600" />
                  Thông tin liên hệ
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Họ tên</div>
                    <div className="font-semibold">
                      {booking.contactInfo.fullName}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <div className="font-semibold">
                      {booking.contactInfo.email}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Số điện thoại</div>
                    <div className="font-semibold">
                      {booking.contactInfo.phone}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Địa chỉ</div>
                    <div className="font-semibold">
                      {booking.contactInfo.address}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCardIcon className="h-5 w-5 text-purple-600" />
                Tóm tắt đơn hàng
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Mã đặt tour:</span>
                  <span className="font-mono font-semibold">
                    {booking.bookingCode}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Số người:</span>
                  <span className="font-semibold">{booking.participants}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Tổng tiền:</span>
                    <span className="text-green-600">
                      {booking.totalPrice.toLocaleString()} VND
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Support */}
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <ShieldCheckIcon className="h-5 w-5 text-blue-600" />
                Hỗ trợ khách hàng
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-blue-700">
                  <PhoneIcon className="h-4 w-4" />
                  <span>1900 1234</span>
                </div>
                <div className="flex items-center gap-2 text-blue-700">
                  <EnvelopeIcon className="h-4 w-4" />
                  <span>support@travel.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
