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
} from "@heroicons/react/24/outline";
import {
  MotionDiv,
  MotionH2,
  MotionButton,
} from "../../components/common/MotionWrapper";

interface TourPackage {
  id: number;
  name: string;
  image: string;
  destination: string;
  duration: string;
  price: number;
  originalPrice: number;
  discount: string;
  description: string;
  rating: number;
  reviewCount: number;
  maxGroupSize: number;
  difficulty: string;
  category: string;
  createdAt: string;
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState<TourPackage | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    destination: "",
    duration: "",
    price: "",
    originalPrice: "",
    discount: "",
    maxGroupSize: "",
    difficulty: "Dễ",
    category: "General",
    image: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, []);

  // ✅ Lấy danh sách packages (tự gửi cookie)
  const fetchPackages = async () => {
    try {
      const response = await fetch("/api/admin/packages", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setPackages(data.packages || []);
      } else if (response.status === 401) {
        alert("Bạn cần đăng nhập lại.");
        window.location.href = "/admin/login";
      } else {
        console.error("Failed to fetch packages:", response.statusText);
      }
    } catch (error) {
      console.error("Failed to fetch packages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ Tạo mới tour
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const packageData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice:
          parseFloat(formData.originalPrice) || parseFloat(formData.price),
        maxGroupSize: parseInt(formData.maxGroupSize) || 20,
      };

      const response = await fetch("/api/admin/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(packageData),
      });

      if (response.ok) {
        const newPackage = await response.json();
        setPackages((prev) => [newPackage, ...prev]);
        setShowModal(false);
        resetForm();
      } else if (response.status === 401) {
        alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
        window.location.href = "/admin/login";
      } else {
        const error = await response.json();
        alert(`Lỗi: ${error.error}`);
      }
    } catch (error) {
      console.error("Failed to create package:", error);
      alert("Có lỗi xảy ra khi tạo tour");
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Cập nhật tour
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackage) return;

    setSubmitting(true);

    try {
      const packageData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice:
          parseFloat(formData.originalPrice) || parseFloat(formData.price),
        maxGroupSize: parseInt(formData.maxGroupSize) || 20,
      };

      const response = await fetch(`/api/admin/packages/${editingPackage.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(packageData),
      });

      if (response.ok) {
        const updatedPackage = await response.json();
        setPackages((prev) =>
          prev.map((p) => (p.id === editingPackage.id ? updatedPackage : p))
        );
        setEditingPackage(null);
        setShowModal(false);
        resetForm();
      } else if (response.status === 401) {
        alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
        window.location.href = "/admin/login";
      } else {
        const error = await response.json();
        alert(`Lỗi: ${error.error}`);
      }
    } catch (error) {
      console.error("Failed to update package:", error);
      alert("Có lỗi xảy ra khi cập nhật tour");
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Xóa tour
  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa tour này?")) {
      try {
        const response = await fetch(`/api/admin/packages/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (response.ok) {
          setPackages((prev) => prev.filter((p) => p.id !== id));
        } else if (response.status === 401) {
          alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
          window.location.href = "/admin/login";
        } else {
          const error = await response.json();
          alert(`Lỗi: ${error.error}`);
        }
      } catch (error) {
        console.error("Failed to delete package:", error);
        alert("Có lỗi xảy ra khi xóa tour");
      }
    }
  };

  const openEditModal = (pkg: TourPackage) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      description: pkg.description,
      destination: pkg.destination,
      duration: pkg.duration,
      price: pkg.price.toString(),
      originalPrice: pkg.originalPrice.toString(),
      discount: pkg.discount,
      maxGroupSize: pkg.maxGroupSize.toString(),
      difficulty: pkg.difficulty,
      category: pkg.category,
      image: pkg.image,
    });
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingPackage(null);
    resetForm();
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      destination: "",
      duration: "",
      price: "",
      originalPrice: "",
      discount: "",
      maxGroupSize: "",
      difficulty: "Dễ",
      category: "General",
      image: "",
    });
  };

  const filteredPackages = packages.filter(
    (pkg) =>
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.category.toLowerCase().includes(searchTerm.toLowerCase())
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
          <MotionH2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-gray-900"
          >
            Quản lý Tour Packages
          </MotionH2>
          <p className="text-gray-600">
            Quản lý tất cả tour packages trong hệ thống
          </p>
        </div>
        <MotionButton
          onClick={openCreateModal}
          className="bg-red-600 hover:bg-red-700 text-gray-900 px-4 py-2 rounded-lg flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <PlusIcon className="h-5 w-5" />
          <span>Thêm tour</span>
        </MotionButton>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex space-x-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-900" />
              <input
                type="text"
                placeholder="Tìm kiếm tour..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
            <option value="">Tất cả danh mục</option>
            <option value="Beach">Beach</option>
            <option value="Mountain">Mountain</option>
            <option value="Cultural">Cultural</option>
            <option value="Adventure">Adventure</option>
          </select>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPackages.map((pkg) => (
          <MotionDiv
            key={pkg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48">
              <img
                src={pkg.image}
                alt={pkg.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-red-600 text-gray-900 px-2 py-1 rounded-full text-xs font-semibold">
                {pkg.discount}
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {pkg.name}
              </h3>
              <p className="text-gray-600 text-sm mb-3">{pkg.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Điểm đến:</span>
                  <span className="font-medium">{pkg.destination}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Thời gian:</span>
                  <span className="font-medium">{pkg.duration}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Độ khó:</span>
                  <span className="font-medium">{pkg.difficulty}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Nhóm tối đa:</span>
                  <span className="font-medium">{pkg.maxGroupSize} người</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-400">⭐</span>
                  <span className="text-sm font-medium">{pkg.rating}</span>
                  <span className="text-sm text-gray-500">
                    ({pkg.reviewCount})
                  </span>
                </div>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {pkg.category}
                </span>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="text-right">
                  <div className="text-sm text-gray-500 line-through">
                    {pkg.originalPrice.toLocaleString("vi-VN")}đ
                  </div>
                  <div className="text-lg font-bold text-red-600">
                    {pkg.price.toLocaleString("vi-VN")}đ
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => openEditModal(pkg)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-gray-900 py-2 px-3 rounded text-sm font-medium"
                >
                  <EyeIcon className="h-4 w-4 inline mr-1" />
                  Xem
                </button>
                <button
                  onClick={() => openEditModal(pkg)}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-gray-900 py-2 px-3 rounded text-sm font-medium"
                >
                  <PencilIcon className="h-4 w-4 inline mr-1" />
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(pkg.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-gray-900 py-2 px-3 rounded text-sm font-medium"
                >
                  <TrashIcon className="h-4 w-4 inline mr-1" />
                  Xóa
                </button>
              </div>
            </div>
          </MotionDiv>
        ))}
      </div>

      {filteredPackages.length === 0 && (
        <div className="text-center py-12">
          <CubeIcon className="mx-auto h-12 w-12 text-gray-900" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Không có tour nào
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Bắt đầu tạo tour đầu tiên.
          </p>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingPackage ? "Chỉnh sửa Tour" : "Thêm Tour Mới"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-900 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form
              onSubmit={editingPackage ? handleEdit : handleSubmit}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Tên tour *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Điểm đến *
                  </label>
                  <input
                    type="text"
                    value={formData.destination}
                    onChange={(e) =>
                      handleInputChange("destination", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Mô tả *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Thời gian *
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) =>
                      handleInputChange("duration", e.target.value)
                    }
                    placeholder="VD: 3 ngày 2 đêm"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Giá (VNĐ) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Giá gốc
                  </label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) =>
                      handleInputChange("originalPrice", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Giảm giá
                  </label>
                  <input
                    type="text"
                    value={formData.discount}
                    onChange={(e) =>
                      handleInputChange("discount", e.target.value)
                    }
                    placeholder="VD: 20%"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Nhóm tối đa
                  </label>
                  <input
                    type="number"
                    value={formData.maxGroupSize}
                    onChange={(e) =>
                      handleInputChange("maxGroupSize", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Độ khó
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) =>
                      handleInputChange("difficulty", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="Dễ">Dễ</option>
                    <option value="Trung bình">Trung bình</option>
                    <option value="Khó">Khó</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Danh mục
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="General">General</option>
                  <option value="Beach">Beach</option>
                  <option value="Mountain">Mountain</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Adventure">Adventure</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  URL hình ảnh
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => handleInputChange("image", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-900 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-red-600 text-gray-900 rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {submitting
                    ? "Đang xử lý..."
                    : editingPackage
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
