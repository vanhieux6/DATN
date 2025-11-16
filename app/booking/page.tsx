"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface BookingFormData {
  packageId: string;
  participants: number;
  selectedDate: string;
  specialRequests: string;
  contactInfo: {
    fullName: string;
    email: string;
    phone: string;
    emergencyContact: string;
  };
}

// Component con sử dụng useSearchParams
function BookingFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const packageId = searchParams.get("packageId");
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tourPackage, setTourPackage] = useState<any>(null);
  const [availableSpots, setAvailableSpots] = useState<number>(0);
  const [user, setUser] = useState<any>(null);

  const [formData, setFormData] = useState<BookingFormData>({
    packageId: packageId || "",
    participants: 2,
    selectedDate: "",
    specialRequests: "",
    contactInfo: {
      fullName: "",
      email: "",
      phone: "",
      emergencyContact: "",
    },
  });

  // Check authentication và fetch data
  useEffect(() => {
    if (!packageId) {
      setError("Không tìm thấy thông tin tour");
      return;
    }

    checkAuth();
  }, [packageId]);

  const checkAuth = async () => {
    try {
      console.log("Checking authentication...");

      // Gọi API để check session/current user
      const res = await fetch("/api/auth/me"); // Hoặc endpoint phù hợp

      if (!res.ok) {
        throw new Error("Failed to check authentication");
      }

      const data = await res.json();
      console.log("Auth response:", data);

      // Kiểm tra theo structure từ API của bạn
      if (data.user || (data.id && data.role !== "admin")) {
        // Có user data và không phải admin - đã đăng nhập
        setIsAuthenticated(true);
        const userData = data.user || data;
        setUser(userData);

        // Pre-fill user info
        setFormData((prev) => ({
          ...prev,
          contactInfo: {
            ...prev.contactInfo,
            fullName: userData.name || "",
            email: userData.email || "",
            phone: userData.phone || "",
          },
        }));

        // Fetch tour package sau khi xác thực thành công
        fetchTourPackage();
      } else {
        // Không có user data hoặc là admin - chưa đăng nhập
        setIsAuthenticated(false);
        console.log(
          "User not authenticated or is admin, redirecting to login..."
        );
        router.push(
          `/auth/signin?callbackUrl=${encodeURIComponent(
            `/booking?packageId=${packageId}`
          )}`
        );
      }
    } catch (err) {
      console.error("Auth check error:", err);
      setIsAuthenticated(false);
      // Thử check bằng cách khác - kiểm tra cookie trực tiếp
      checkAuthAlternative();
    }
  };

  // Phương thức dự phòng để check auth
  const checkAuthAlternative = async () => {
    try {
      // Thử gọi một API đơn giản để kiểm tra
      const res = await fetch("/api/auth/verify");
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setIsAuthenticated(true);
          setUser(data.user);
          fetchTourPackage();
          return;
        }
      }
    } catch (err) {
      console.log("Alternative auth check failed");
    }

    // Nếu cả hai cách đều thất bại, chuyển hướng đến login
    router.push(
      `/auth/signin?callbackUrl=${encodeURIComponent(
        `/booking?packageId=${packageId}`
      )}`
    );
  };

  const fetchTourPackage = async () => {
    try {
      console.log("Fetching tour package:", packageId);
      const res = await fetch(`/api/packages/${packageId}?rich=1`);

      if (!res.ok) {
        throw new Error("Failed to fetch tour package");
      }

      const data = await res.json();
      console.log("Tour package data:", data);

      if (data.success && data.data) {
        setTourPackage(data.data);

        // Set default date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split("T")[0];

        setFormData((prev) => ({
          ...prev,
          selectedDate: tomorrowStr,
        }));

        // Check availability for default date
        checkAvailability(tomorrowStr);
      } else {
        setError("Không thể tải thông tin tour");
      }
    } catch (err) {
      console.error("Error fetching tour package:", err);
      setError("Không thể tải thông tin tour");
    }
  };

  const checkAvailability = async (date: string) => {
    try {
      const res = await fetch(
        `/api/packages/${packageId}/availability?date=${date}`
      );
      if (res.ok) {
        const data = await res.json();
        setAvailableSpots(data.availableSpots || 0);

        setFormData((prev) => {
          if (prev.participants > (data.availableSpots || 0)) {
            return {
              ...prev,
              participants: Math.max(1, data.availableSpots || 0),
            };
          }
          return prev;
        });
      }
    } catch (err) {
      console.error("Error checking availability:", err);
      setAvailableSpots(0);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("contactInfo.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "participants" ? parseInt(value) : value,
      }));
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setFormData((prev) => ({ ...prev, selectedDate: date }));
    checkAvailability(date);
  };

  const validateForm = (): boolean => {
    if (!formData.selectedDate) {
      setError("Vui lòng chọn ngày khởi hành");
      return false;
    }

    if (formData.participants < 1) {
      setError("Số người tham gia phải lớn hơn 0");
      return false;
    }

    if (formData.participants > availableSpots) {
      setError(`Chỉ còn ${availableSpots} chỗ trống cho ngày này`);
      return false;
    }

    if (!formData.contactInfo.fullName.trim()) {
      setError("Vui lòng nhập họ tên");
      return false;
    }

    if (!formData.contactInfo.email.trim()) {
      setError("Vui lòng nhập email");
      return false;
    }

    if (!formData.contactInfo.phone.trim()) {
      setError("Vui lòng nhập số điện thoại");
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Kiểm tra authentication lại trước khi submit
    if (!isAuthenticated || !user) {
      setError("Vui lòng đăng nhập để đặt tour");
      setLoading(false);
      router.push(
        `/auth/signin?callbackUrl=${encodeURIComponent(
          `/booking?packageId=${packageId}`
        )}`
      );
      return;
    }

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userId: user.id, // Thêm userId từ user data
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Booking failed");
      }

      // Redirect to confirmation page
      if (data.booking?.bookingCode) {
        router.push(
          `/booking/confirmation?bookingCode=${data.booking.bookingCode}`
        );
      } else if (data.data?.bookingCode) {
        router.push(
          `/booking/confirmation?bookingCode=${data.data.bookingCode}`
        );
      } else {
        throw new Error("Không nhận được mã đặt tour");
      }
    } catch (err: any) {
      console.error("Booking error:", err);
      setError(err.message || "Có lỗi xảy ra khi đặt tour");
    } finally {
      setLoading(false);
    }
  };

  // Hiển thị loading khi đang check auth
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg">Đang kiểm tra đăng nhập...</div>
        </div>
      </div>
    );
  }

  // Hiển thị thông báo chuyển hướng
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg mb-4">Bạn cần đăng nhập để đặt tour</div>
          <div className="text-gray-600">
            Đang chuyển hướng đến trang đăng nhập...
          </div>
        </div>
      </div>
    );
  }

  if (!packageId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-center">
          <div className="text-lg font-semibold mb-2">
            Không tìm thấy thông tin tour
          </div>
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-800"
          >
            Quay lại trang trước
          </button>
        </div>
      </div>
    );
  }

  if (!tourPackage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg">Đang tải thông tin tour...</div>
        </div>
      </div>
    );
  }

  const totalPrice = tourPackage.price * formData.participants;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
            <h1 className="text-2xl font-bold">Đặt Tour</h1>
            <p className="opacity-90">{tourPackage.title}</p>
            <div className="text-sm opacity-80 mt-2">
              Xin chào, {user?.name || user?.email || "Khách"}!
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Tour Summary */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-semibold text-lg mb-2">Thông tin Tour</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p>
                    <strong>Điểm đến:</strong> {tourPackage.destination?.city}
                  </p>
                  <p>
                    <strong>Thời lượng:</strong> {tourPackage.duration}
                  </p>
                  <p>
                    <strong>Khởi hành:</strong> {tourPackage.departure}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Nhóm:</strong> {tourPackage.groupSize} người
                  </p>
                  <p>
                    <strong>Đánh giá:</strong> ⭐ {tourPackage.rating} (
                    {tourPackage.reviewCount})
                  </p>
                  <p>
                    <strong>Giá/người:</strong>{" "}
                    {new Intl.NumberFormat("vi-VN").format(tourPackage.price)}đ
                  </p>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Thông tin đặt tour</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Ngày khởi hành *
                  </label>
                  <input
                    type="date"
                    name="selectedDate"
                    value={formData.selectedDate}
                    onChange={handleDateChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Số người tham gia *
                  </label>
                  <select
                    name="participants"
                    value={formData.participants}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {[...Array(Math.min(availableSpots, 20))].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} người
                      </option>
                    ))}
                  </select>
                  {availableSpots > 0 ? (
                    <p className="text-sm text-green-600 mt-1">
                      Còn {availableSpots} chỗ trống
                    </p>
                  ) : (
                    <p className="text-sm text-red-600 mt-1">
                      Đã hết chỗ cho ngày này
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Thông tin liên hệ</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Họ tên *
                  </label>
                  <input
                    type="text"
                    name="contactInfo.fullName"
                    value={formData.contactInfo.fullName}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="contactInfo.email"
                    value={formData.contactInfo.email}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    name="contactInfo.phone"
                    value={formData.contactInfo.phone}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Liên hệ khẩn cấp
                  </label>
                  <input
                    type="text"
                    name="contactInfo.emergencyContact"
                    value={formData.contactInfo.emergencyContact}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Số điện thoại người liên hệ khẩn cấp"
                  />
                </div>
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Yêu cầu đặc biệt
              </label>
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleInputChange}
                rows={3}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Chế độ ăn uống, yêu cầu đặc biệt, dị ứng..."
              />
            </div>

            {/* Price Summary */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <span>Giá tour/người:</span>
                <span>
                  {new Intl.NumberFormat("vi-VN").format(tourPackage.price)}đ
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span>Số người:</span>
                <span>{formData.participants}</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                <span>Tổng cộng:</span>
                <span className="text-red-600">
                  {new Intl.NumberFormat("vi-VN").format(totalPrice)}đ
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Quay lại
              </button>
              <button
                type="submit"
                disabled={loading || availableSpots === 0}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Đang xử lý..." : "Xác nhận đặt tour"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

// Loading component
function BookingLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <div className="text-lg">Đang tải trang đặt tour...</div>
      </div>
    </div>
  );
}

// Component chính
export default function BookingPage() {
  return (
    <Suspense fallback={<BookingLoading />}>
      <BookingFormContent />
    </Suspense>
  );
}
