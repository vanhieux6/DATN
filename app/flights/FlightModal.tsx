// app/admin/flights/FlightModal.tsx
"use client";
import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export interface Flight {
  id?: number;
  airline: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  originalPrice: number;
  discount?: string;
  stops: string;
  aircraft: string;
  class: string;
  availableSeats: number;
  departureDate: string;
  returnDate?: string;
  features?: string[];
}

interface FlightModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  flight?: Flight | null;
}

const airlines = [
  "Vietnam Airlines",
  "VietJet Air",
  "Bamboo Airways",
  "Jetstar Pacific",
];

const classOptions = [
  { value: "economy", label: "Phổ thông" },
  { value: "premium_economy", label: "Phổ thông đặc biệt" },
  { value: "business", label: "Thương gia" },
  { value: "first", label: "Hạng nhất" },
];

const stopsOptions = ["0", "1", "2"];

const featureOptions = [
  "WiFi miễn phí",
  "Giải trí trên máy bay",
  "Bữa ăn miễn phí",
  "Hành lý ký gửi 23kg",
  "Ghế ngồi thoải mái",
  "USB charging",
  "Chọn chỗ ngồi miễn phí",
];

export default function FlightModal({
  isOpen,
  onClose,
  onSuccess,
  flight,
}: FlightModalProps) {
  const [formData, setFormData] = useState<Flight>({
    airline: "",
    flightNumber: "",
    departure: "",
    arrival: "",
    departureTime: "",
    arrivalTime: "",
    duration: "",
    price: 0,
    originalPrice: 0,
    stops: "0",
    aircraft: "",
    class: "economy",
    availableSeats: 0,
    departureDate: "",
    returnDate: "",
    features: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (flight) {
      setFormData({
        ...flight,
        features: flight.features || [],
      });
    } else {
      // Reset form khi mở modal thêm mới
      setFormData({
        airline: "",
        flightNumber: "",
        departure: "",
        arrival: "",
        departureTime: "",
        arrivalTime: "",
        duration: "",
        price: 0,
        originalPrice: 0,
        stops: "0",
        aircraft: "",
        class: "economy",
        availableSeats: 0,
        departureDate: "",
        returnDate: "",
        features: [],
      });
    }
  }, [flight, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features?.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...(prev.features || []), feature],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = flight
        ? `/api/admin/flights/${flight.id}`
        : "/api/admin/flights";

      const method = flight ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        onSuccess();
        onClose();
      } else {
        setError(data.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Error submitting flight:", error);
      setError("Lỗi kết nối, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-4xl w-full p-6 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {flight ? "Cập nhật chuyến bay" : "Thêm chuyến bay mới"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Thông tin cơ bản */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Thông tin cơ bản
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hãng bay *
                </label>
                <select
                  name="airline"
                  value={formData.airline}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="">Chọn hãng bay</option>
                  {airlines.map((airline) => (
                    <option key={airline} value={airline}>
                      {airline}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mã chuyến bay *
                </label>
                <input
                  type="text"
                  name="flightNumber"
                  value={formData.flightNumber}
                  onChange={handleChange}
                  placeholder="VN123"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Điểm đi *
                </label>
                <input
                  type="text"
                  name="departure"
                  value={formData.departure}
                  onChange={handleChange}
                  placeholder="Hà Nội (HAN)"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Điểm đến *
                </label>
                <input
                  type="text"
                  name="arrival"
                  value={formData.arrival}
                  onChange={handleChange}
                  placeholder="TP.HCM (SGN)"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Máy bay
                </label>
                <input
                  type="text"
                  name="aircraft"
                  value={formData.aircraft}
                  onChange={handleChange}
                  placeholder="Boeing 787"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hạng vé *
                </label>
                <select
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                  required
                >
                  {classOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Điểm dừng *
                </label>
                <select
                  name="stops"
                  value={formData.stops}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                  required
                >
                  {stopsOptions.map((stop) => (
                    <option key={stop} value={stop}>
                      {stop === "0" ? "Bay thẳng" : `${stop} điểm dừng`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số ghế trống *
                </label>
                <input
                  type="number"
                  name="availableSeats"
                  value={formData.availableSeats}
                  onChange={handleChange}
                  min="0"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Thời gian */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Thời gian
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày khởi hành *
                </label>
                <input
                  type="date"
                  name="departureDate"
                  value={formData.departureDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày về (nếu có)
                </label>
                <input
                  type="date"
                  name="returnDate"
                  value={formData.returnDate || ""}
                  onChange={handleChange}
                  min={formData.departureDate}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giờ khởi hành *
                </label>
                <input
                  type="time"
                  name="departureTime"
                  value={formData.departureTime}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giờ đến *
                </label>
                <input
                  type="time"
                  name="arrivalTime"
                  value={formData.arrivalTime}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thời gian bay *
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="2h 15m"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Giá */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Giá</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá gốc *
                </label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  min="0"
                  step="1000"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá khuyến mãi *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="1000"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
            </div>
            {formData.originalPrice > 0 && formData.price > 0 && (
              <div className="mt-2 text-sm text-green-600">
                Giảm giá:{" "}
                {Math.round(
                  ((formData.originalPrice - formData.price) /
                    formData.originalPrice) *
                    100
                )}
                % (Tiết kiệm{" "}
                {(formData.originalPrice - formData.price).toLocaleString(
                  "vi-VN"
                )}
                đ)
              </div>
            )}
          </div>

          {/* Tiện ích */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Tiện ích
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {featureOptions.map((feature) => (
                <label
                  key={feature}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.features?.includes(feature)}
                    onChange={() => handleFeatureToggle(feature)}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">{feature}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-200"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-200 font-semibold flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Đang xử lý...
                </>
              ) : (
                <>{flight ? "Cập nhật" : "Thêm chuyến bay"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
