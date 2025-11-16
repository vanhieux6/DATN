// app/account/bookings/flights/[bookingCode]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  CalendarIcon,
  UserIcon,
  CreditCardIcon,
  QrCodeIcon,
  CheckBadgeIcon,
  ClockIcon,
  MapPinIcon,
  TicketIcon,
  ShieldCheckIcon,
  PhoneIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

interface FlightBookingDetail {
  id: string;
  bookingCode: string;
  passengers: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  flight: {
    id: number;
    airline: string;
    flightNumber: string;
    departure: string;
    arrival: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    departureDate: string;
    aircraft: string;
    class: string;
    airlineLogo: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
}

export default function FlightBookingDetailPage() {
  const params = useParams();
  const bookingCode = params?.bookingCode as string;
  const router = useRouter();
  const [booking, setBooking] = useState<FlightBookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (bookingCode) {
      fetchBookingDetail();
    }
  }, [bookingCode]);

  const fetchBookingDetail = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`/api/bookings/flights/${bookingCode}`, {
        credentials: "include",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setBooking(data.booking);
      } else {
        setError(data.message || "Không thể tải thông tin đặt vé");
      }
    } catch (err) {
      setError("Lỗi kết nối, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (
      !confirm("Bạn có chắc muốn hủy đặt vé này? Phí hủy có thể được áp dụng.")
    ) {
      return;
    }

    try {
      setCancelling(true);
      const res = await fetch(`/api/bookings/flights/${bookingCode}/cancel`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        alert("Hủy vé thành công");
        fetchBookingDetail(); // Refresh data
      } else {
        alert(data.message || "Không thể hủy vé");
      }
    } catch (err) {
      alert("Lỗi kết nối, vui lòng thử lại");
    } finally {
      setCancelling(false);
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

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
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
              {error || "Không tìm thấy thông tin đặt vé"}
            </h2>
            <p className="text-gray-600 mb-6">
              Vui lòng kiểm tra lại mã đặt vé hoặc liên hệ hỗ trợ
            </p>
            <button
              onClick={() => router.push("/account/bookings")}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
            >
              Quay lại danh sách vé
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
            <span className="font-medium">Quay lại danh sách vé</span>
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Chi tiết vé máy bay
              </h1>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Mã đặt chỗ:</span>
                  <span className="font-mono font-bold text-blue-600 text-lg">
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

            <div className="flex gap-3">
              {booking.status === "confirmed" && (
                <>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    <QrCodeIcon className="h-5 w-5" />
                    In vé
                  </button>
                  <button
                    onClick={handleCancelBooking}
                    disabled={cancelling}
                    className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50"
                  >
                    {cancelling ? "Đang hủy..." : "Hủy vé"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Flight Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Flight Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold mb-1">
                      Thông tin chuyến bay
                    </h2>
                    <p className="text-blue-100">
                      {formatDate(booking.flight.departureDate)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {booking.flight.airline}
                    </div>
                    <div className="text-blue-100">
                      {booking.flight.flightNumber}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Flight Route */}
                <div className="flex items-center justify-between mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatTime(booking.flight.departureTime)}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {booking.flight.departure}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(booking.flight.departureDate)}
                    </div>
                  </div>

                  <div className="flex-1 px-6 text-center">
                    <div className="text-sm text-gray-600 mb-2">
                      {booking.flight.duration}
                    </div>
                    <div className="relative">
                      <div className="w-full h-0.5 bg-gray-300"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white p-1">
                          <MapPinIcon className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">Bay thẳng</div>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatTime(booking.flight.arrivalTime)}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {booking.flight.arrival}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(booking.flight.departureDate)}
                    </div>
                  </div>
                </div>

                {/* Flight Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <div className="text-xs text-gray-500">Hạng vé</div>
                    <div className="font-semibold text-gray-900">
                      {booking.flight.class}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Máy bay</div>
                    <div className="font-semibold text-gray-900">
                      {booking.flight.aircraft}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Số hành khách</div>
                    <div className="font-semibold text-gray-900">
                      {booking.passengers} người
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Tổng tiền</div>
                    <div className="font-semibold text-green-600">
                      {booking.totalPrice.toLocaleString()} VND
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-green-600" />
                Lịch sử đặt vé
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      Đặt vé thành công
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatDate(booking.createdAt)} lúc{" "}
                      {new Date(booking.createdAt).toLocaleTimeString("vi-VN")}
                    </div>
                    <div className="text-xs text-gray-500">
                      Mã xác nhận: {booking.bookingCode}
                    </div>
                  </div>
                </div>

                {booking.status === "cancelled" && (
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        Đã hủy vé
                      </div>
                      <div className="text-sm text-gray-600">
                        Vé đã được hủy thành công
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Summary and Actions */}
          <div className="space-y-6">
            {/* Booking Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCardIcon className="h-5 w-5 text-purple-600" />
                Tóm tắt đơn hàng
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Mã đặt chỗ:</span>
                  <span className="font-mono font-semibold">
                    {booking.bookingCode}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Hãng bay:</span>
                  <span className="font-semibold">
                    {booking.flight.airline}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Số chuyến:</span>
                  <span className="font-semibold">
                    {booking.flight.flightNumber}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Hạng vé:</span>
                  <span className="font-semibold">{booking.flight.class}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Số hành khách:</span>
                  <span className="font-semibold">{booking.passengers}</span>
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
                <p className="text-blue-600 text-xs">
                  Liên hệ chúng tôi nếu bạn cần hỗ trợ về vé hoặc có thắc mắc.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
