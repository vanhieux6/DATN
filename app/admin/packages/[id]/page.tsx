"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import {
  MotionDiv,
  MotionH2,
  MotionButton,
} from "../../../components/common/MotionWrapper";

interface TourPackage {
  id: number;
  title: string;
  subtitle: string;
  description?: string;
  image: string;
  badge?: string;
  discount: string;
  originalPrice: number;
  price: number;
  duration: string;
  groupSize: string;
  departure: string;
  destination?: {
    city: string;
    province: string;
    country: string;
  };
  rating: number;
  reviewCount: number;
  validUntil: string;
  category: string;
  highlights: any[];
  itinerary: any[];
  included: any[];
  notIncluded: any[];
  sections: any[];
  stops: any[];
  images: any[];
}

interface EditFormData {
  // Basic Info
  title: string;
  subtitle: string;
  description: string;
  image: string;
  badge: string;
  discount: string;
  originalPrice: string;
  price: string;
  duration: string;
  groupSize: string;
  departure: string;
  category: string;
  validUntil: string;
  
  // Tab-specific data
  highlights: { id?: number; description: string }[];
  itinerary: { id?: number; day: string; content: string; startTime?: string; transport?: string; meals?: string }[];
  included: { id?: number; item: string }[];
  notIncluded: { id?: number; item: string }[];
  sections: { id?: number; title: string; content: string; photos: string[] }[];
  stops: { id?: number; title: string; description: string; guide: string; photos: string[]; tips: string[] }[];
  additionalImages: { id?: number; url: string; caption: string }[];
}

export default function PackageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const packageId = params.id as string;

  const [tourPackage, setTourPackage] = useState<TourPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("basic");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<EditFormData>({
    title: "",
    subtitle: "",
    description: "",
    image: "",
    badge: "",
    discount: "",
    originalPrice: "",
    price: "",
    duration: "",
    groupSize: "",
    departure: "",
    category: "",
    validUntil: "",
    highlights: [],
    itinerary: [],
    included: [],
    notIncluded: [],
    sections: [],
    stops: [],
    additionalImages: []
  });

  useEffect(() => {
    if (packageId) {
      fetchPackage();
    }
  }, [packageId]);

  const fetchPackage = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/packages/${packageId}?rich=1`, {
        credentials: "include",
      });
      
      if (response.ok) {
        const data = await response.json();
        setTourPackage(data);
        initializeFormData(data);
      } else {
        console.error("Failed to fetch package");
      }
    } catch (error) {
      console.error("Error fetching package:", error);
    } finally {
      setLoading(false);
    }
  };

  const initializeFormData = (pkg: TourPackage) => {
    setFormData({
      title: pkg.title || "",
      subtitle: pkg.subtitle || "",
      description: pkg.description || "",
      image: pkg.image || "",
      badge: pkg.badge || "",
      discount: pkg.discount || "",
      originalPrice: pkg.originalPrice?.toString() || "",
      price: pkg.price?.toString() || "",
      duration: pkg.duration || "",
      groupSize: pkg.groupSize || "",
      departure: pkg.departure || "",
      category: pkg.category || "",
      validUntil: pkg.validUntil || "",
      highlights: pkg.highlights?.map(h => ({
        id: h.id,
        description: h.description || ""
      })) || [],
      itinerary: pkg.itinerary?.map(i => ({
        id: i.id,
        day: i.day || "",
        content: i.content || "",
        startTime: i.startTime || "",
        transport: i.transport || "",
        meals: i.meals || ""
      })) || [],
      included: pkg.included?.map(i => ({
        id: i.id,
        item: i.item || ""
      })) || [],
      notIncluded: pkg.notIncluded?.map(i => ({
        id: i.id,
        item: i.item || ""
      })) || [],
      sections: pkg.sections?.map(s => ({
        id: s.id,
        title: s.title || "",
        content: s.content || "",
        photos: s.photos || []
      })) || [],
      stops: pkg.stops?.map(s => ({
        id: s.id,
        title: s.title || "",
        description: s.description || "",
        guide: s.guide || "",
        photos: s.photos || [],
        tips: s.tips || []
      })) || [],
      additionalImages: pkg.images?.map(img => ({
        id: img.id,
        url: img.url || "",
        caption: img.caption || ""
      })) || []
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const response = await fetch(`/api/admin/packages/${packageId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedPackage = await response.json();
        setTourPackage(updatedPackage);
        setEditing(false);
        alert("Cập nhật thành công!");
      } else {
        const error = await response.json();
        alert(`Lỗi: ${error.error}`);
      }
    } catch (error) {
      console.error("Error updating package:", error);
      alert("Có lỗi xảy ra khi cập nhật");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (tourPackage) {
      initializeFormData(tourPackage);
    }
    setEditing(false);
  };

  // Helper functions for dynamic arrays
  const addArrayItem = (field: keyof EditFormData, template: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], template]
    }));
  };

  const updateArrayItem = (field: keyof EditFormData, index: number, updates: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as any[]).map((item, i) => 
        i === index ? { ...item, ...updates } : item
      )
    }));
  };

  const removeArrayItem = (field: keyof EditFormData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as any[]).filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!tourPackage) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Không tìm thấy tour.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <MotionButton
            onClick={() => router.push("/admin/packages")}
            className="bg-gray-200 hover:bg-gray-300 text-gray-900 p-2 rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </MotionButton>
          <div>
            <MotionH2 className="text-2xl font-bold text-gray-900">
              {tourPackage.title}
            </MotionH2>
            <p className="text-gray-600">{tourPackage.subtitle}</p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          {editing ? (
            <>
              <button
                onClick={handleCancel}
                className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <XMarkIcon className="h-5 w-5" />
                <span>Hủy</span>
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50"
              >
                <CheckIcon className="h-5 w-5" />
                <span>{saving ? "Đang lưu..." : "Lưu"}</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <PencilIcon className="h-5 w-5" />
              <span>Chỉnh sửa</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <nav className="flex space-x-8 px-6 overflow-x-auto">
            {[
              { key: "basic", label: "Thông tin cơ bản" },
              { key: "highlights", label: "Điểm nổi bật" },
              { key: "itinerary", label: "Lịch trình" },
              { key: "included", label: "Dịch vụ" },
              { key: "sections", label: "Nội dung" },
              { key: "stops", label: "Điểm tham quan" },
              { key: "images", label: "Hình ảnh" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-4 px-1 border-b-2 whitespace-nowrap font-medium text-sm ${
                  activeTab === tab.key
                    ? "border-red-600 text-red-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Basic Info Tab */}
          {activeTab === "basic" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên tour *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    disabled={!editing}
                    className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiêu đề phụ *
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                    disabled={!editing}
                    className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả chi tiết
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  disabled={!editing}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-100"
                />
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá (VNĐ) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    disabled={!editing}
                    className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giá gốc
                  </label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
                    disabled={!editing}
                    className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giảm giá
                  </label>
                  <input
                    type="text"
                    value={formData.discount}
                    onChange={(e) => setFormData(prev => ({ ...prev, discount: e.target.value }))}
                    disabled={!editing}
                    className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thời lượng *
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    disabled={!editing}
                    className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quy mô nhóm
                  </label>
                  <input
                    type="text"
                    value={formData.groupSize}
                    onChange={(e) => setFormData(prev => ({ ...prev, groupSize: e.target.value }))}
                    disabled={!editing}
                    className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Điểm khởi hành
                  </label>
                  <input
                    type="text"
                    value={formData.departure}
                    onChange={(e) => setFormData(prev => ({ ...prev, departure: e.target.value }))}
                    disabled={!editing}
                    className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Danh mục
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    disabled={!editing}
                    className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-100"
                  >
                    <option value="General">General</option>
                    <option value="Beach">Beach</option>
                    <option value="Mountain">Mountain</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Adventure">Adventure</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hạn đặt tour
                  </label>
                  <input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData(prev => ({ ...prev, validUntil: e.target.value }))}
                    disabled={!editing}
                    className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ảnh chính
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  disabled={!editing}
                  className="w-full p-3 border border-gray-300 rounded-lg disabled:bg-gray-100"
                />
                {formData.image && (
                  <img src={formData.image} alt="Preview" className="mt-2 h-32 object-cover rounded" />
                )}
              </div>
            </div>
          )}

          {/* Highlights Tab */}
          {activeTab === "highlights" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Điểm nổi bật</h3>
                {editing && (
                  <button
                    onClick={() => addArrayItem("highlights", { description: "" })}
                    className="bg-green-600 text-white px-3 py-1 rounded flex items-center space-x-1"
                  >
                    <PlusIcon className="h-4 w-4" />
                    <span>Thêm</span>
                  </button>
                )}
              </div>
              
              {formData.highlights.map((highlight, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                  {editing && (
                    <button
                      onClick={() => removeArrayItem("highlights", index)}
                      className="text-red-600 hover:text-red-800 mt-1"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                  <div className="flex-1">
                    {editing ? (
                      <input
                        type="text"
                        value={highlight.description}
                        onChange={(e) => updateArrayItem("highlights", index, { description: e.target.value })}
                        placeholder="Mô tả điểm nổi bật..."
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span className="text-green-600">✓</span>
                        <span>{highlight.description}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {formData.highlights.length === 0 && !editing && (
                <p className="text-gray-500 text-center py-4">Chưa có điểm nổi bật nào</p>
              )}
            </div>
          )}

          {/* Itinerary Tab */}
          {activeTab === "itinerary" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Lịch trình</h3>
                {editing && (
                  <button
                    onClick={() => addArrayItem("itinerary", { 
                      day: "", 
                      content: "", 
                      startTime: "", 
                      transport: "", 
                      meals: "" 
                    })}
                    className="bg-green-600 text-white px-3 py-1 rounded flex items-center space-x-1"
                  >
                    <PlusIcon className="h-4 w-4" />
                    <span>Thêm ngày</span>
                  </button>
                )}
              </div>
              
              {formData.itinerary.map((day, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {editing && (
                        <button
                          onClick={() => removeArrayItem("itinerary", index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      )}
                      <h4 className="font-semibold">
                        {editing ? (
                          <input
                            type="text"
                            value={day.day}
                            onChange={(e) => updateArrayItem("itinerary", index, { day: e.target.value })}
                            placeholder="Ngày (VD: Ngày 1)"
                            className="p-1 border border-gray-300 rounded"
                          />
                        ) : (
                          `Ngày ${day.day}`
                        )}
                      </h4>
                    </div>
                    
                    {editing && (
                      <div className="flex space-x-2 text-sm">
                        <input
                          type="text"
                          value={day.startTime || ""}
                          onChange={(e) => updateArrayItem("itinerary", index, { startTime: e.target.value })}
                          placeholder="Giờ bắt đầu"
                          className="p-1 border border-gray-300 rounded w-24"
                        />
                        <input
                          type="text"
                          value={day.transport || ""}
                          onChange={(e) => updateArrayItem("itinerary", index, { transport: e.target.value })}
                          placeholder="Phương tiện"
                          className="p-1 border border-gray-300 rounded w-32"
                        />
                        <input
                          type="text"
                          value={day.meals || ""}
                          onChange={(e) => updateArrayItem("itinerary", index, { meals: e.target.value })}
                          placeholder="Bữa ăn"
                          className="p-1 border border-gray-300 rounded w-24"
                        />
                      </div>
                    )}
                  </div>
                  
                  {editing ? (
                    <textarea
                      value={day.content}
                      onChange={(e) => updateArrayItem("itinerary", index, { content: e.target.value })}
                      placeholder="Nội dung lịch trình..."
                      rows={3}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  ) : (
                    <p className="text-gray-700 whitespace-pre-line">{day.content}</p>
                  )}
                </div>
              ))}
              
              {formData.itinerary.length === 0 && !editing && (
                <p className="text-gray-500 text-center py-4">Chưa có lịch trình nào</p>
              )}
            </div>
          )}

          {/* Included/Excluded Tab */}
          {activeTab === "included" && (
            <div className="grid grid-cols-2 gap-6">
              {/* Included */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-green-700">Bao gồm</h3>
                  {editing && (
                    <button
                      onClick={() => addArrayItem("included", { item: "" })}
                      className="bg-green-600 text-white px-3 py-1 rounded flex items-center space-x-1"
                    >
                      <PlusIcon className="h-4 w-4" />
                      <span>Thêm</span>
                    </button>
                  )}
                </div>
                
                {formData.included.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 border rounded">
                    {editing && (
                      <button
                        onClick={() => removeArrayItem("included", index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}
                    {editing ? (
                      <input
                        type="text"
                        value={item.item}
                        onChange={(e) => updateArrayItem("included", index, { item: e.target.value })}
                        className="flex-1 p-1 border border-gray-300 rounded"
                      />
                    ) : (
                      <>
                        <span className="text-green-600">✓</span>
                        <span>{item.item}</span>
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* Not Included */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-red-700">Không bao gồm</h3>
                  {editing && (
                    <button
                      onClick={() => addArrayItem("notIncluded", { item: "" })}
                      className="bg-green-600 text-white px-3 py-1 rounded flex items-center space-x-1"
                    >
                      <PlusIcon className="h-4 w-4" />
                      <span>Thêm</span>
                    </button>
                  )}
                </div>
                
                {formData.notIncluded.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 border rounded">
                    {editing && (
                      <button
                        onClick={() => removeArrayItem("notIncluded", index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}
                    {editing ? (
                      <input
                        type="text"
                        value={item.item}
                        onChange={(e) => updateArrayItem("notIncluded", index, { item: e.target.value })}
                        className="flex-1 p-1 border border-gray-300 rounded"
                      />
                    ) : (
                      <>
                        <span className="text-red-600">✗</span>
                        <span>{item.item}</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sections Tab */}
          {activeTab === "sections" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Nội dung chi tiết</h3>
                {editing && (
                  <button
                    onClick={() => addArrayItem("sections", { title: "", content: "", photos: [] })}
                    className="bg-green-600 text-white px-3 py-1 rounded flex items-center space-x-1"
                  >
                    <PlusIcon className="h-4 w-4" />
                    <span>Thêm section</span>
                  </button>
                )}
              </div>
              
              {formData.sections.map((section, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3 flex-1">
                      {editing && (
                        <button
                          onClick={() => removeArrayItem("sections", index)}
                          className="text-red-600 hover:text-red-800 mt-1"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      )}
                      {editing ? (
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) => updateArrayItem("sections", index, { title: e.target.value })}
                          placeholder="Tiêu đề section..."
                          className="flex-1 p-2 border border-gray-300 rounded"
                        />
                      ) : (
                        <h4 className="text-lg font-semibold">{section.title}</h4>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    {editing ? (
                      <textarea
                        value={section.content}
                        onChange={(e) => updateArrayItem("sections", index, { content: e.target.value })}
                        placeholder="Nội dung section..."
                        rows={4}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    ) : (
                      <p className="text-gray-700 whitespace-pre-line">{section.content}</p>
                    )}
                  </div>
                  
                  {/* Photo management for sections would go here */}
                </div>
              ))}
            </div>
          )}

          {/* Images Tab */}
          {activeTab === "images" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Quản lý hình ảnh</h3>
                {editing && (
                  <button
                    onClick={() => addArrayItem("additionalImages", { url: "", caption: "" })}
                    className="bg-green-600 text-white px-3 py-1 rounded flex items-center space-x-1"
                  >
                    <PlusIcon className="h-4 w-4" />
                    <span>Thêm ảnh</span>
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {formData.additionalImages.map((image, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    {editing && (
                      <button
                        onClick={() => removeArrayItem("additionalImages", index)}
                        className="text-red-600 hover:text-red-800 float-right"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}
                    
                    {editing ? (
                      <div className="space-y-2">
                        <input
                          type="url"
                          value={image.url}
                          onChange={(e) => updateArrayItem("additionalImages", index, { url: e.target.value })}
                          placeholder="URL ảnh"
                          className="w-full p-1 border border-gray-300 rounded text-sm"
                        />
                        <input
                          type="text"
                          value={image.caption}
                          onChange={(e) => updateArrayItem("additionalImages", index, { caption: e.target.value })}
                          placeholder="Chú thích"
                          className="w-full p-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                    ) : (
                      <>
                        <img src={image.url} alt={image.caption} className="w-full h-24 object-cover rounded mb-2" />
                        <p className="text-sm text-gray-600">{image.caption}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}