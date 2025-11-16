// app/account/bookings/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarIcon,
  TicketIcon,
  MapPinIcon,
  UserGroupIcon,
  CreditCardIcon,
  CheckBadgeIcon,
  ClockIcon,
  XCircleIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

interface FlightBooking {
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
    departureDate: string;
    departureTime: string;
    arrivalTime: string;
  };
}

interface TourBooking {
  id: string;
  bookingCode: string;
  participants: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  selectedDate?: string;
  specialRequests?: any;
  package: {
    id: number;
    title: string;
    destination?: {
      city: string;
    };
  };
}

type BookingType = "flights" | "tours";

export default function UserBookingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<BookingType>("flights");
  const [flightBookings, setFlightBookings] = useState<FlightBooking[]>([]);
  const [tourBookings, setTourBookings] = useState<TourBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBookings();
  }, [activeTab]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      if (activeTab === "flights") {
        const res = await fetch("/api/flights/bookings/me", {
          credentials: "include",
        });
        const data = await res.json();

        if (res.ok && data.success) {
          setFlightBookings(data.bookings || []);
        } else {
          setError(data.message || "Lỗi tải danh sách vé máy bay");
        }
      } else {
        const res = await fetch("/api/bookings/tours/bookings/me", {
          credentials: "include",
        });
        const data = await res.json();

        if (res.ok && data.success) {
          setTourBookings(data.bookings || []);
        } else {
          setError(data.message || "Lỗi tải danh sách tour");
        }
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
          icon: XCircleIcon,
          text: "Đã hủy",
        };
      case "pending":
        return {
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: ClockIcon,
          text: "Đang chờ",
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
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  const handleViewDetails = (bookingCode: string, type: BookingType) => {
    if (type === "flights") {
      router.push(`/account/bookings/flights/${bookingCode}`);
    } else {
      router.push(`/account/bookings/tours/${bookingCode}`);
    }
  };

  const currentBookings =
    activeTab === "flights" ? flightBookings : tourBookings;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quản lý đặt chỗ của tôi
          </h1>
          <p className="text-gray-600">
            Theo dõi và quản lý tất cả các đặt chỗ của bạn
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab("flights")}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "flights"
                    ? "border-blue-500 text-blue-600 bg-blue-50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <TicketIcon className="h-5 w-5" />
                Vé máy bay ({flightBookings.length})
              </button>
              <button
                onClick={() => setActiveTab("tours")}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "tours"
                    ? "border-green-500 text-green-600 bg-green-50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <MapPinIcon className="h-5 w-5" />
                Tour du lịch ({tourBookings.length})
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-800">
                  <XCircleIcon className="h-5 w-5" />
                  <span>{error}</span>
                </div>
              </div>
            )}

            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-24 bg-gray-300 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : currentBookings.length > 0 ? (
              <div className="space-y-4">
                {activeTab === "flights"
                  ? // Flight Bookings
                    flightBookings.map((booking) => {
                      const statusConfig = getStatusConfig(booking.status);
                      return (
                        <div
                          key={booking.id}
                          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-4 mb-3">
                                <div
                                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${statusConfig.color}`}
                                >
                                  <statusConfig.icon className="h-4 w-4" />
                                  <span className="text-sm font-medium">
                                    {statusConfig.text}
                                  </span>
                                </div>
                                <div className="text-sm text-gray-500">
                                  {formatDate(booking.createdAt)}
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                  <div className="text-sm text-gray-500">
                                    Chuyến bay
                                  </div>
                                  <div className="font-semibold text-gray-900">
                                    {booking.flight.airline}{" "}
                                    {booking.flight.flightNumber}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-500">
                                    Hành trình
                                  </div>
                                  <div className="font-semibold text-gray-900">
                                    {booking.flight.departure} →{" "}
                                    {booking.flight.arrival}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-500">
                                    Ngày bay
                                  </div>
                                  <div className="font-semibold text-gray-900">
                                    {formatDate(booking.flight.departureDate)}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-6 text-sm">
                                <div className="flex items-center gap-2">
                                  <UserGroupIcon className="h-4 w-4 text-gray-400" />
                                  <span>{booking.passengers} hành khách</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <CreditCardIcon className="h-4 w-4 text-gray-400" />
                                  <span className="font-semibold text-green-600">
                                    {formatPrice(booking.totalPrice)} VND
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  handleViewDetails(
                                    booking.bookingCode,
                                    "flights"
                                  )
                                }
                                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                              >
                                <EyeIcon className="h-4 w-4" />
                                Chi tiết
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  : // Tour Bookings
                    tourBookings.map((booking) => {
                      const statusConfig = getStatusConfig(booking.status);
                      return (
                        <div
                          key={booking.id}
                          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-4 mb-3">
                                <div
                                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${statusConfig.color}`}
                                >
                                  <statusConfig.icon className="h-4 w-4" />
                                  <span className="text-sm font-medium">
                                    {statusConfig.text}
                                  </span>
                                </div>
                                <div className="text-sm text-gray-500">
                                  {formatDate(booking.createdAt)}
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                  <div className="text-sm text-gray-500">
                                    Tour
                                  </div>
                                  <div className="font-semibold text-gray-900">
                                    {booking.package.title}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-500">
                                    Điểm đến
                                  </div>
                                  <div className="font-semibold text-gray-900">
                                    {booking.package.destination?.city || "N/A"}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-500">
                                    Ngày đi
                                  </div>
                                  <div className="font-semibold text-gray-900">
                                    {booking.selectedDate
                                      ? formatDate(booking.selectedDate)
                                      : "Chưa chọn"}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-6 text-sm">
                                <div className="flex items-center gap-2">
                                  <UserGroupIcon className="h-4 w-4 text-gray-400" />
                                  <span>
                                    {booking.participants} người tham gia
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <CreditCardIcon className="h-4 w-4 text-gray-400" />
                                  <span className="font-semibold text-green-600">
                                    {formatPrice(booking.totalPrice)} VND
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  handleViewDetails(
                                    booking.bookingCode,
                                    "tours"
                                  )
                                }
                                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                              >
                                <EyeIcon className="h-4 w-4" />
                                Chi tiết
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">
                  {activeTab === "flights" ? "✈️" : "🏝️"}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Chưa có đặt chỗ nào
                </h3>
                <p className="text-gray-600 mb-6">
                  {activeTab === "flights"
                    ? "Bạn chưa đặt vé máy bay nào. Hãy bắt đầu tìm chuyến bay!"
                    : "Bạn chưa đặt tour du lịch nào. Khám phá các tour hấp dẫn ngay!"}
                </p>
                <button
                  onClick={() =>
                    router.push(activeTab === "flights" ? "/flights" : "/tours")
                  }
                  className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
                >
                  {activeTab === "flights" ? "Tìm chuyến bay" : "Khám phá tour"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
