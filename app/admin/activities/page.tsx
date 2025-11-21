"use client";
import { useState, useEffect } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  CubeIcon,
  XMarkIcon,
  CalendarIcon,
  MapPinIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { MotionButton, MotionDiv, MotionH2 } from "@/app/components/common/MotionWrapper";


interface Activity {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  category: string;
  location: string;
  duration: string;
  groupSize: string;
  price: number;
  originalPrice: number;
  discount: string;
  rating: number;
  reviewCount: number;
  difficulty: string;
  ageRequirement: string;
  schedule: string;
  bestTime: string;
  destination?: {
    city: string;
    province: string;
  };
  highlights: Array<{ highlight: string }>;
  included: Array<{ item: string }>;
  availableDates: Array<{ date: string }>;
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image: "",
    category: "",
    location: "",
    duration: "",
    groupSize: "",
    price: "",
    originalPrice: "",
    discount: "",
    difficulty: "Dễ",
    ageRequirement: "Trên 6 tuổi",
    schedule: "",
    bestTime: "",
    destinationId: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/activities", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setActivities(data.activities || []);
      }
    } catch (error) {
      console.error("Failed to fetch activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const activityData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: parseFloat(formData.originalPrice) || parseFloat(formData.price),
      };

      const response = await fetch("/api/admin/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(activityData),
      });

      if (response.ok) {
        const newActivity = await response.json();
        setActivities((prev) => [newActivity, ...prev]);
        setShowModal(false);
        resetForm();
      }
    } catch (error) {
      console.error("Failed to create activity:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa hoạt động này?")) {
      try {
        const response = await fetch(`/api/admin/activities/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (response.ok) {
          setActivities((prev) => prev.filter((a) => a.id !== id));
        }
      } catch (error) {
        console.error("Failed to delete activity:", error);
      }
    }
  };

  const openEditModal = (activity: Activity) => {
    setEditingActivity(activity);
    setFormData({
      title: activity.title,
      subtitle: activity.subtitle,
      image: activity.image,
      category: activity.category,
      location: activity.location,
      duration: activity.duration,
      groupSize: activity.groupSize,
      price: activity.price.toString(),
      originalPrice: activity.originalPrice.toString(),
      discount: activity.discount,
      difficulty: activity.difficulty,
      ageRequirement: activity.ageRequirement,
      schedule: activity.schedule,
      bestTime: activity.bestTime,
      destinationId: "",
    });
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingActivity(null);
    resetForm();
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      image: "",
      category: "",
      location: "",
      duration: "",
      groupSize: "",
      price: "",
      originalPrice: "",
      discount: "",
      difficulty: "Dễ",
      ageRequirement: "Trên 6 tuổi",
      schedule: "",
      bestTime: "",
      destinationId: "",
    });
  };

  const filteredActivities = activities.filter(
    (activity) =>
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div className="flex justify-between items-center">
        <div>
          <MotionH2 className="text-2xl font-bold text-gray-900">
            Quản lý Hoạt động
          </MotionH2>
          <p className="text-gray-600">Quản lý các hoạt động du lịch và trải nghiệm</p>
        </div>
        <MotionButton
          onClick={openCreateModal}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Thêm hoạt động</span>
        </MotionButton>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm hoạt động..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredActivities.map((activity) => (
          <MotionDiv
            key={activity.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48">
              <img
                src={activity.image}
                alt={activity.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                {activity.discount}
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {activity.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3">{activity.subtitle}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPinIcon className="h-4 w-4 mr-2" />
                  {activity.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {activity.duration}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <UserGroupIcon className="h-4 w-4 mr-2" />
                  {activity.groupSize}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">📊</span>
                  Độ khó: {activity.difficulty}
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-400">⭐</span>
                  <span className="text-sm font-medium">{activity.rating}</span>
                  <span className="text-sm text-gray-500">({activity.reviewCount})</span>
                </div>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {activity.category}
                </span>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="text-right">
                  <div className="text-sm text-gray-500 line-through">
                    {activity.originalPrice.toLocaleString("vi-VN")}đ
                  </div>
                  <div className="text-lg font-bold text-red-600">
                    {activity.price.toLocaleString("vi-VN")}đ
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => openEditModal(activity)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm font-medium"
                >
                  <EyeIcon className="h-4 w-4 inline mr-1" />
                  Xem
                </button>
                <button
                  onClick={() => openEditModal(activity)}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-3 rounded text-sm font-medium"
                >
                  <PencilIcon className="h-4 w-4 inline mr-1" />
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(activity.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm font-medium"
                >
                  <TrashIcon className="h-4 w-4 inline mr-1" />
                  Xóa
                </button>
              </div>
            </div>
          </MotionDiv>
        ))}
      </div>

      {filteredActivities.length === 0 && (
        <div className="text-center py-12">
          <CubeIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Không có hoạt động nào</h3>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingActivity ? "Chỉnh sửa Hoạt động" : "Thêm Hoạt động Mới"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên hoạt động *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tiêu đề phụ
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => handleInputChange("subtitle", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Danh mục *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Chọn danh mục</option>
                    <option value="Tham quan">Tham quan</option>
                    <option value="Ẩm thực">Ẩm thực</option>
                    <option value="Thể thao">Thể thao</option>
                    <option value="Văn hóa">Văn hóa</option>
                    <option value="Giải trí">Giải trí</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa điểm *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thời lượng *
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => handleInputChange("duration", e.target.value)}
                    placeholder="VD: 2 giờ"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá (VNĐ) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá gốc
                  </label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => handleInputChange("originalPrice", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giảm giá
                  </label>
                  <input
                    type="text"
                    value={formData.discount}
                    onChange={(e) => handleInputChange("discount", e.target.value)}
                    placeholder="VD: 20%"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Độ khó
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => handleInputChange("difficulty", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="Dễ">Dễ</option>
                    <option value="Trung bình">Trung bình</option>
                    <option value="Khó">Khó</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Yêu cầu tuổi
                  </label>
                  <input
                    type="text"
                    value={formData.ageRequirement}
                    onChange={(e) => handleInputChange("ageRequirement", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lịch trình
                </label>
                <input
                  type="text"
                  value={formData.schedule}
                  onChange={(e) => handleInputChange("schedule", e.target.value)}
                  placeholder="VD: Hàng ngày 8:00-18:00"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thời điểm tốt nhất
                </label>
                <input
                  type="text"
                  value={formData.bestTime}
                  onChange={(e) => handleInputChange("bestTime", e.target.value)}
                  placeholder="VD: Tháng 11 đến tháng 4"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL hình ảnh
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => handleInputChange("image", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {submitting ? "Đang xử lý..." : editingActivity ? "Cập nhật" : "Tạo mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}