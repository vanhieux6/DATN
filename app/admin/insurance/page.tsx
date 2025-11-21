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
  ShieldCheckIcon,
  ClockIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import {
  MotionButton,
  MotionDiv,
  MotionH2,
} from "@/app/components/common/MotionWrapper";

interface Insurance {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  type: string;
  price: number;
  duration: string;
  coverage: string;
  rating: number;
  reviewCount: number;
  claimProcess: string;
  maxAge: number;
  preExistingConditions: boolean;
  destinations: Array<{ destination: string }>;
  features: Array<{ feature: string }>;
  exclusions: Array<{ exclusion: string }>;
}

export default function InsurancePage() {
  const [insurances, setInsurances] = useState<Insurance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingInsurance, setEditingInsurance] = useState<Insurance | null>(
    null
  );
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image: "",
    type: "",
    price: "",
    duration: "",
    coverage: "",
    claimProcess: "",
    maxAge: "65",
    preExistingConditions: "false",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInsurances();
  }, []);

  const fetchInsurances = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/insurance", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setInsurances(data.insurance || []);
      }
    } catch (error) {
      console.error("Failed to fetch insurance:", error);
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
      const insuranceData = {
        ...formData,
        price: parseFloat(formData.price),
        maxAge: parseInt(formData.maxAge),
        preExistingConditions: formData.preExistingConditions === "true",
      };

      const response = await fetch("/api/admin/insurance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(insuranceData),
      });

      if (response.ok) {
        const newInsurance = await response.json();
        setInsurances((prev) => [newInsurance, ...prev]);
        setShowModal(false);
        resetForm();
      }
    } catch (error) {
      console.error("Failed to create insurance:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa gói bảo hiểm này?")) {
      try {
        const response = await fetch(`/api/admin/insurance/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (response.ok) {
          setInsurances((prev) => prev.filter((i) => i.id !== id));
        }
      } catch (error) {
        console.error("Failed to delete insurance:", error);
      }
    }
  };

  const openEditModal = (insurance: Insurance) => {
    setEditingInsurance(insurance);
    setFormData({
      title: insurance.title,
      subtitle: insurance.subtitle,
      image: insurance.image,
      type: insurance.type,
      price: insurance.price.toString(),
      duration: insurance.duration,
      coverage: insurance.coverage,
      claimProcess: insurance.claimProcess,
      maxAge: insurance.maxAge.toString(),
      preExistingConditions: insurance.preExistingConditions.toString(),
    });
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingInsurance(null);
    resetForm();
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      image: "",
      type: "",
      price: "",
      duration: "",
      coverage: "",
      claimProcess: "",
      maxAge: "65",
      preExistingConditions: "false",
    });
  };

  const filteredInsurances = insurances.filter(
    (insurance) =>
      insurance.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      insurance.type.toLowerCase().includes(searchTerm.toLowerCase())
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
            Quản lý Bảo hiểm
          </MotionH2>
          <p className="text-gray-600">Quản lý các gói bảo hiểm du lịch</p>
        </div>
        <MotionButton
          onClick={openCreateModal}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Thêm bảo hiểm</span>
        </MotionButton>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm bảo hiểm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Insurance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInsurances.map((insurance) => (
          <MotionDiv
            key={insurance.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48">
              <img
                src={insurance.image}
                alt={insurance.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                {insurance.type}
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {insurance.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3">{insurance.subtitle}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <ClockIcon className="h-4 w-4 mr-2" />
                  {insurance.duration}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <ShieldCheckIcon className="h-4 w-4 mr-2" />
                  {insurance.coverage}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <UserIcon className="h-4 w-4 mr-2" />
                  Độ tuổi tối đa: {insurance.maxAge}
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-400">⭐</span>
                  <span className="text-sm font-medium">
                    {insurance.rating}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({insurance.reviewCount})
                  </span>
                </div>
                <div
                  className={`text-xs px-2 py-1 rounded-full ${
                    insurance.preExistingConditions
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {insurance.preExistingConditions
                    ? "Có bệnh nền"
                    : "Không bệnh nền"}
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">
                    {insurance.price.toLocaleString("vi-VN")}đ
                  </div>
                  <div className="text-sm text-gray-500">/người</div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => openEditModal(insurance)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm font-medium"
                >
                  <EyeIcon className="h-4 w-4 inline mr-1" />
                  Xem
                </button>
                <button
                  onClick={() => openEditModal(insurance)}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-3 rounded text-sm font-medium"
                >
                  <PencilIcon className="h-4 w-4 inline mr-1" />
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(insurance.id)}
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

      {filteredInsurances.length === 0 && (
        <div className="text-center py-12">
          <CubeIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Không có bảo hiểm nào
          </h3>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingInsurance ? "Chỉnh sửa Bảo hiểm" : "Thêm Bảo hiểm Mới"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên bảo hiểm *
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
                    onChange={(e) =>
                      handleInputChange("subtitle", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại bảo hiểm *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange("type", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Chọn loại</option>
                    <option value="Cơ bản">Cơ bản</option>
                    <option value="Nâng cao">Nâng cao</option>
                    <option value="Toàn diện">Toàn diện</option>
                    <option value="Gia đình">Gia đình</option>
                  </select>
                </div>
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thời hạn *
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) =>
                      handleInputChange("duration", e.target.value)
                    }
                    placeholder="VD: 7 ngày"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Độ tuổi tối đa
                  </label>
                  <input
                    type="number"
                    value={formData.maxAge}
                    onChange={(e) =>
                      handleInputChange("maxAge", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phạm vi bảo hiểm *
                </label>
                <input
                  type="text"
                  value={formData.coverage}
                  onChange={(e) =>
                    handleInputChange("coverage", e.target.value)
                  }
                  placeholder="VD: Y tế, hành lý, hủy tour"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quy trình yêu cầu bồi thường
                </label>
                <textarea
                  value={formData.claimProcess}
                  onChange={(e) =>
                    handleInputChange("claimProcess", e.target.value)
                  }
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bệnh nền có sẵn
                </label>
                <select
                  value={formData.preExistingConditions}
                  onChange={(e) =>
                    handleInputChange("preExistingConditions", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="false">Không chấp nhận</option>
                  <option value="true">Chấp nhận</option>
                </select>
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
                  {submitting
                    ? "Đang xử lý..."
                    : editingInsurance
                    ? "Cập nhật"
                    : "Tạo mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
