"use client";
import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface Destination {
  id?: number;
  city: string;
  province: string;
  country: string;
  description: string;
  image: string;
  heroImage: string | null;
  rating: number;
  reviewCount: number;
  hotels: number;
  fromPrice: number;
  toPrice: number;
  bestTime: string;
  category: string;
  popularity: string;
  temperature: string | null;
  condition: string | null;
  humidity: string | null;
  rainfall: string | null;
  flightTime: string | null;
  ferryTime: string | null;
  carTime: string | null;
}

interface DestinationModalProps {
  destination?: Destination | null;
  onClose: () => void;
}

const categories = [
  "Biển đảo",
  "Núi rừng",
  "Thành phố",
  "Văn hóa lịch sử",
  "Ẩm thực",
  "Thiên nhiên",
];

const popularityLevels = ["low", "medium", "high"];

export default function DestinationModal({
  destination,
  onClose,
}: DestinationModalProps) {
  const [formData, setFormData] = useState<Destination>({
    city: "",
    province: "",
    country: "Việt Nam",
    description: "",
    image: "",
    heroImage: "",
    rating: 0,
    reviewCount: 0,
    hotels: 0,
    fromPrice: 0,
    toPrice: 0,
    bestTime: "",
    category: "",
    popularity: "medium",
    temperature: "",
    condition: "",
    humidity: "",
    rainfall: "",
    flightTime: "",
    ferryTime: "",
    carTime: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (destination) setFormData(destination);
  }, [destination]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? 0 : parseFloat(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const url = destination?.id
        ? `/api/admin/destinations/${destination.id}`
        : "/api/admin/destinations";
      const method = destination?.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onClose();
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Có lỗi xảy ra");
      }
    } catch {
      setError("Có lỗi xảy ra khi kết nối đến server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="relative w-11/12 md:w-3/4 lg:w-2/3 bg-white rounded-2xl shadow-xl animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <h3 className="text-2xl font-semibold text-gray-900">
            {destination ? "✏️ Chỉnh sửa địa điểm" : "➕ Thêm địa điểm mới"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="m-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6 max-h-[70vh] overflow-y-auto"
        >
          {/* Group 1: Thông tin chính */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-gray-800">
              🏙️ Thông tin địa điểm
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Thành phố *"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
              <Input
                label="Tỉnh/Thành *"
                name="province"
                value={formData.province}
                onChange={handleChange}
                required
              />
            </div>
            <Input
              label="Quốc gia"
              name="country"
              value={formData.country}
              onChange={handleChange}
            />
            <Textarea
              label="Mô tả *"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </fieldset>

          {/* Group 2: Ảnh */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-gray-800">
              🖼️ Hình ảnh
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Ảnh đại diện *"
                name="image"
                type="url"
                value={formData.image}
                onChange={handleChange}
                required
              />
              <Input
                label="Ảnh banner"
                name="heroImage"
                type="url"
                value={formData.heroImage || ""}
                onChange={handleChange}
              />
            </div>
          </fieldset>

          {/* Group 3: Đánh giá & Giá */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-gray-800">
              ⭐ Đánh giá & Giá cả
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Đánh giá"
                name="rating"
                type="number"
                value={formData.rating}
                onChange={handleNumberChange}
              />
              <Input
                label="Số đánh giá"
                name="reviewCount"
                type="number"
                value={formData.reviewCount}
                onChange={handleNumberChange}
              />
              <Input
                label="Số khách sạn"
                name="hotels"
                type="number"
                value={formData.hotels}
                onChange={handleNumberChange}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Giá từ (VND)"
                name="fromPrice"
                type="number"
                value={formData.fromPrice}
                onChange={handleNumberChange}
              />
              <Input
                label="Giá đến (VND)"
                name="toPrice"
                type="number"
                value={formData.toPrice}
                onChange={handleNumberChange}
              />
            </div>
          </fieldset>

          {/* Group 4: Thời gian, Danh mục */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-gray-800">
              📅 Thông tin thêm
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Thời điểm tốt nhất"
                name="bestTime"
                value={formData.bestTime}
                onChange={handleChange}
              />
              <Select
                label="Danh mục *"
                name="category"
                value={formData.category}
                onChange={handleChange}
                options={categories}
              />
            </div>
            <Select
              label="Độ phổ biến"
              name="popularity"
              value={formData.popularity}
              onChange={handleChange}
              options={["Thấp", "Trung bình", "Cao"]}
              values={popularityLevels}
            />
          </fieldset>

          {/* Group 5: Thời tiết */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-gray-800">
              🌦️ Thời tiết
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nhiệt độ"
                name="temperature"
                value={formData.temperature || ""}
                onChange={handleChange}
              />
              <Input
                label="Điều kiện thời tiết"
                name="condition"
                value={formData.condition || ""}
                onChange={handleChange}
              />
              <Input
                label="Độ ẩm"
                name="humidity"
                value={formData.humidity || ""}
                onChange={handleChange}
              />
              <Input
                label="Lượng mưa"
                name="rainfall"
                value={formData.rainfall || ""}
                onChange={handleChange}
              />
            </div>
          </fieldset>

          {/* Group 6: Di chuyển */}
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-gray-800">
              🚗 Thời gian di chuyển
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Thời gian bay"
                name="flightTime"
                value={formData.flightTime || ""}
                onChange={handleChange}
              />
              <Input
                label="Thời gian phà"
                name="ferryTime"
                value={formData.ferryTime || ""}
                onChange={handleChange}
              />
              <Input
                label="Thời gian ô tô"
                name="carTime"
                value={formData.carTime || ""}
                onChange={handleChange}
              />
            </div>
          </fieldset>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium disabled:opacity-50"
            >
              {loading ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ------------------- COMPONENT INPUT TÁCH RIÊNG ------------------- */
const Input = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
}: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-800">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
    />
  </div>
);

const Textarea = ({ label, name, value, onChange, required = false }: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-800">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      rows={3}
      className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
    />
  </div>
);

const Select = ({
  label,
  name,
  value,
  onChange,
  options,
  values,
  required = false,
}: any) => (
  <div>
    <label className="block text-sm font-medium text-gray-800">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
    >
      <option value="">-- Chọn --</option>
      {options.map((opt: string, idx: number) => (
        <option key={opt} value={values ? values[idx] : opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);
