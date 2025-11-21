// app/packages/page.tsx
"use client";
import { useState, useEffect, Suspense, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Star,
  MapPin,
  Calendar,
  Users,
  Clock,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";

interface Package {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  badge: string;
  discount: string;
  originalPrice: number;
  price: number;
  duration: string;
  groupSize: string;
  departure: string;
  rating: number;
  reviewCount: number;
  validUntil: string;
  highlights: string[];
}

interface SearchFilters {
  destination: string;
  priceRange: string;
  duration: string;
  mobileDrawer: boolean;
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Helper functions
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN").format(price);
};

// Package Card Skeleton Component
const PackageCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden h-[520px] animate-pulse">
    <div className="bg-gray-300 h-64 w-full"></div>
    <div className="p-6 space-y-4">
      <div className="bg-gray-300 h-6 rounded w-3/4"></div>
      <div className="bg-gray-300 h-4 rounded w-1/2"></div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-300 h-16 rounded-xl"></div>
        <div className="bg-gray-300 h-16 rounded-xl"></div>
      </div>
      <div className="bg-gray-300 h-5 rounded w-24"></div>
      <div className="space-y-2">
        <div className="bg-gray-300 h-3 rounded"></div>
        <div className="bg-gray-300 h-3 rounded"></div>
      </div>
      <div className="bg-gray-300 h-12 rounded-xl mt-4"></div>
    </div>
  </div>
);

// Package Card Component
const PackageCard = ({ pkg }: { pkg: Package }) => {
  return (
      <Link href={`/tour/${pkg.id}`} className="block">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 h-[520px] flex flex-col"
    >
      {/* Package Image */}
      <div className="relative h-64 flex-shrink-0">
        <img
          src={pkg.image}
          alt={pkg.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
          {pkg.badge}
        </div>
        <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
          {pkg.discount}
        </div>
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
          <div className="flex items-center space-x-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="font-bold text-gray-900 text-xs">
              {pkg.rating}
            </span>
            <span className="text-gray-600 text-xs">
              ({pkg.reviewCount.toLocaleString()})
            </span>
          </div>
        </div>
      </div>

      {/* Package Info */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
          {pkg.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {pkg.subtitle}
        </p>

        {/* Quick Info */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 text-blue-600 text-xs font-medium mb-1">
              <Clock className="w-3 h-3" />
              Thời gian
            </div>
            <div className="text-gray-800 font-semibold text-sm">
              {pkg.duration}
            </div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 text-green-600 text-xs font-medium mb-1">
              <Users className="w-3 h-3" />
              Nhóm
            </div>
            <div className="text-gray-800 font-semibold text-sm">
              {pkg.groupSize}
            </div>
          </div>
        </div>

        {/* Departure */}
        <div className="flex items-center text-gray-600 mb-4 text-sm">
          <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
          <span className="line-clamp-1">Khởi hành: {pkg.departure}</span>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xl font-bold text-red-600">
              {formatPrice(pkg.price)}đ
            </span>
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(pkg.originalPrice)}đ
            </span>
          </div>
          <span className="text-xs text-gray-600">/người</span>
        </div>

        {/* Highlights */}
        <div className="mb-4 flex-1">
          <h4 className="font-semibold text-gray-900 text-sm mb-2">
            Điểm nổi bật
          </h4>
          <div className="space-y-1">
            {pkg.highlights.slice(0, 3).map((highlight, idx) => (
              <div
                key={idx}
                className="flex items-center space-x-2 text-xs text-gray-600"
              >
                <span className="text-green-500 text-xs">✓</span>
                <span className="line-clamp-1">{highlight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex space-x-2 mt-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold text-sm transition-colors shadow-md"
          >
            Đặt ngay
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 border border-orange-500 text-orange-500 rounded-lg font-semibold text-sm hover:bg-orange-50 transition-colors"
          >
            Chi tiết
          </motion.button>
        </div>
      </div>
    </motion.div>
    </Link>
  );
};

// Client component để xử lý search params
function PackagesContent() {
  const searchParams = useSearchParams();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filter state
  const [filters, setFilters] = useState<SearchFilters>({
    destination: searchParams.get("destination") || "all",
    priceRange: searchParams.get("priceRange") || "all",
    duration: searchParams.get("duration") || "all",
    mobileDrawer: false,
  });

  // Collapsible sections state
  const [openSections, setOpenSections] = useState({
    destination: true,
    price: true,
    duration: true,
    mobileDrawer: false,
  });

  // Debounce filters
  const debouncedFilters = useDebounce(filters, 500);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Tạo query params từ filters
  const queryParams = useMemo(() => {
    const params = new URLSearchParams();

    if (debouncedFilters.destination !== "all")
      params.append("destination", debouncedFilters.destination);
    if (debouncedFilters.priceRange !== "all")
      params.append("priceRange", debouncedFilters.priceRange);
    if (debouncedFilters.duration !== "all")
      params.append("duration", debouncedFilters.duration);
    params.append("page", page.toString());
    params.append("limit", "9");

    return params;
  }, [debouncedFilters, page]);

  // Fetch packages data
  useEffect(() => {
    fetchPackages();
  }, [queryParams.toString()]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/packages?${queryParams}`);
      const result = await response.json();

      if (result.success) {
        setPackages(result.data);
        setTotalPages(result.totalPages);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoading(false);
    }
  };

  // Các hàm xử lý filter
  const handleFilterChange = useCallback(
    (key: keyof SearchFilters, value: string) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
      setPage(1); // Reset về trang 1 khi filter thay đổi
    },
    []
  );

  const clearAllFilters = useCallback(() => {
    setFilters({
      destination: "all",
      priceRange: "all",
      duration: "all",
      mobileDrawer: false,
    });
    setSearchTerm("");
    setPage(1);
  }, []);

  const toggleSection = useCallback((section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, []);

  // Filter packages client-side dựa trên search term
  const filteredPackages = useMemo(() => {
    if (!debouncedSearchTerm) return packages;

    return packages.filter(
      (pkg) =>
        pkg.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        pkg.subtitle.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        pkg.departure.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [packages, debouncedSearchTerm]);

  const destinations = [
    { value: "all", label: "Tất cả điểm đến" },
    { value: "Phú Quốc", label: "Phú Quốc" },
    { value: "Sapa", label: "Sapa" },
    { value: "Đà Nẵng", label: "Đà Nẵng" },
    { value: "Nha Trang", label: "Nha Trang" },
    { value: "Hà Nội", label: "Hà Nội" },
    { value: "TP.HCM", label: "TP.HCM" },
    
  ];

  const priceRanges = [
    { value: "all", label: "Tất cả giá" },
    { value: "budget", label: "Dưới 2 triệu" },
    { value: "mid", label: "2-4 triệu" },
    { value: "high", label: "4-6 triệu" },
    { value: "luxury", label: "Trên 6 triệu" },
  ];

  const durations = [
    { value: "all", label: "Tất cả thời gian" },
    { value: "1-2", label: "1-2 ngày" },
    { value: "3-4", label: "3-4 ngày" },
    { value: "5+", label: "5+ ngày" },
  ];

  // Filter Sidebar Component
  const FilterSidebar = useCallback(
    () => (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 h-fit sticky top-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
            <Filter className="w-5 h-5 text-orange-600" />
            Bộ lọc
          </h3>
          <button
            onClick={clearAllFilters}
            className="text-sm text-orange-600 hover:text-orange-700 font-medium"
          >
            Xóa tất cả
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm gói du lịch..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
            />
          </div>
        </div>

        {/* Destination Filter */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <button
            onClick={() => toggleSection("destination")}
            className="flex items-center justify-between w-full mb-4"
          >
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              Điểm đến
            </h4>
            {openSections.destination ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>

          <AnimatePresence>
            {openSections.destination && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 overflow-hidden"
              >
                {destinations.map((destination) => (
                  <motion.button
                    key={destination.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleFilterChange("destination", destination.value)}
                    className={`flex items-center gap-2 w-full p-2 rounded-lg border text-sm font-medium transition-all ${
                      filters.destination === destination.value
                        ? "bg-blue-50 border-blue-500 text-blue-700"
                        : "bg-white border-gray-200 text-gray-700 hover:border-blue-300"
                    }`}
                  >
                    <span>{destination.label}</span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Price Range Filter */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <button
            onClick={() => toggleSection("price")}
            className="flex items-center justify-between w-full mb-4"
          >
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-orange-600" />
              Khoảng giá
            </h4>
            {openSections.price ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>

          <AnimatePresence>
            {openSections.price && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 overflow-hidden"
              >
                {priceRanges.map((range) => (
                  <motion.button
                    key={range.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleFilterChange("priceRange", range.value)}
                    className={`flex items-center gap-2 w-full p-2 rounded-lg border text-sm font-medium transition-all ${
                      filters.priceRange === range.value
                        ? "bg-orange-50 border-orange-500 text-orange-700"
                        : "bg-white border-gray-200 text-gray-700 hover:border-orange-300"
                    }`}
                  >
                    <span>{range.label}</span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Duration Filter */}
        <div className="pb-2">
          <button
            onClick={() => toggleSection("duration")}
            className="flex items-center justify-between w-full mb-4"
          >
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-600" />
              Thời gian
            </h4>
            {openSections.duration ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>

          <AnimatePresence>
            {openSections.duration && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 overflow-hidden"
              >
                {durations.map((durationOption) => (
                  <motion.button
                    key={durationOption.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleFilterChange("duration", durationOption.value)}
                    className={`flex items-center gap-2 w-full p-2 rounded-lg border text-sm font-medium transition-all ${
                      filters.duration === durationOption.value
                        ? "bg-purple-50 border-purple-500 text-purple-700"
                        : "bg-white border-gray-200 text-gray-700 hover:border-purple-300"
                    }`}
                  >
                    <span>{durationOption.label}</span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    ),
    [
      filters,
      openSections,
      searchTerm,
      clearAllFilters,
      handleFilterChange,
      toggleSection,
    ]
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Search Header */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Gói du lịch trọn gói
              </h1>
              <p className="text-gray-600 text-sm">
                Khám phá những điểm đến tuyệt vời với gói du lịch trọn gói, tiết kiệm thời gian và chi phí
              </p>
            </div>

            {/* Search Bar - Desktop only */}
            <div className="hidden md:flex items-center gap-4 mt-4 lg:mt-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm gói du lịch..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm gói du lịch..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <div className="hidden lg:block lg:w-1/4">
            <FilterSidebar />
          </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() =>
                setOpenSections((prev) => ({
                  ...prev,
                  mobileDrawer: !prev.mobileDrawer,
                }))
              }
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Hiển thị bộ lọc
            </motion.button>
          </div>

          {/* Mobile Filter Drawer */}
          <AnimatePresence>
            {openSections.mobileDrawer && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden mb-6 overflow-hidden"
              >
                <FilterSidebar />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Section */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-lg font-semibold text-gray-900 mb-2 sm:mb-0"
              >
                {loading
                  ? "Đang tìm gói du lịch..."
                  : `${filteredPackages.length} gói du lịch được tìm thấy`}
              </motion.h2>

              {!loading && filteredPackages.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm text-gray-600"
                >
                  Sắp xếp theo:
                  <select className="ml-2 border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-orange-500 text-sm">
                    <option>Phổ biến nhất</option>
                    <option>Giá thấp đến cao</option>
                    <option>Giá cao đến thấp</option>
                    <option>Đánh giá cao nhất</option>
                  </select>
                </motion.div>
              )}
            </div>

            {/* Packages Grid với kích thước cố định */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {loading ? (
                // Loading state với skeleton cards
                <>
                  {[...Array(6)].map((_, i) => (
                    <PackageCardSkeleton key={i} />
                  ))}
                </>
              ) : filteredPackages.length > 0 ? (
                // Actual package cards
                filteredPackages.map((pkg, index) => (
                  <PackageCard key={pkg.id} pkg={pkg} />
                ))
              ) : (
                // Empty state
                <div className="col-span-full">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 bg-white rounded-xl shadow-md"
                  >
                    <div className="text-5xl mb-3">🎒</div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">
                      Không tìm thấy gói du lịch phù hợp
                    </h3>
                    <p className="text-gray-600 mb-4 max-w-md mx-auto text-sm">
                      Hãy thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={clearAllFilters}
                      className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-orange-600 shadow-md"
                    >
                      Xóa bộ lọc
                    </motion.button>
                  </motion.div>
                </div>
              )}
            </div>

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex justify-center mt-12 space-x-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <motion.button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                      page === i + 1
                        ? "bg-orange-500 text-white"
                        : "bg-white border border-gray-300 text-gray-700 hover:border-orange-300"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {i + 1}
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main page component với Suspense
export default function PackagesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <PackageCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <PackagesContent />
    </Suspense>
  );
}