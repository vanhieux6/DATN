// app/hotels/page.tsx
"use client";
import { useState, useEffect, Suspense, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Star,
  MapPin,
  Wifi,
  Car,
  Utensils,
  Snowflake,
  Dumbbell,
  Waves,
  SlidersHorizontal,
  Sparkles,
  Clock,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Hotel {
  id: string;
  name: string;
  image: string;
  location: string;
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice?: number;
  discount?: number;
  amenities: string[];
  roomTypes: string[];
  description: string;
}

interface SearchFilters {
  location: string;
  priceRange: number[];
  rating: string;
  amenities: string[];
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

// Helper functions - ĐƯA LÊN TRƯỚC
const getPriceRangeValue = (maxPrice: number) => {
  if (maxPrice <= 1000000) return "budget";
  if (maxPrice <= 3000000) return "mid";
  if (maxPrice <= 5000000) return "high";
  return "luxury";
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN").format(price);
};

// Hotel Card Skeleton Component với kích thước cố định
const HotelCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden h-[380px] animate-pulse">
    <div className="bg-gray-300 h-48 w-full"></div>
    <div className="p-4 space-y-3">
      <div className="bg-gray-300 h-4 rounded w-3/4"></div>
      <div className="bg-gray-300 h-3 rounded w-1/2"></div>
      <div className="flex items-center space-x-2">
        <div className="bg-gray-300 h-6 rounded w-16"></div>
        <div className="bg-gray-300 h-3 rounded w-20"></div>
      </div>
      <div className="flex gap-1">
        <div className="bg-gray-300 h-5 rounded w-16"></div>
        <div className="bg-gray-300 h-5 rounded w-14"></div>
      </div>
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <div className="bg-gray-300 h-3 rounded w-20"></div>
          <div className="bg-gray-300 h-5 rounded w-24"></div>
        </div>
        <div className="bg-gray-300 h-8 rounded w-20"></div>
      </div>
    </div>
  </div>
);

// Hotel Card Component với kích thước cố định
const HotelCard = ({ hotel }: { hotel: Hotel }) => {
  const amenitiesList = [
    { id: "wifi", name: "WiFi", icon: Wifi },
    { id: "parking", name: "Bãi đỗ xe", icon: Car },
    { id: "restaurant", name: "Nhà hàng", icon: Utensils },
    { id: "pool", name: "Hồ bơi", icon: Waves },
    { id: "gym", name: "Phòng gym", icon: Dumbbell },
    { id: "ac", name: "Điều hòa", icon: Snowflake },
  ];

  const getAmenityIcon = (amenity: string) => {
    const amenityObj = amenitiesList.find((a) => a.id === amenity);
    return amenityObj ? amenityObj.icon : null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 h-[380px] flex flex-col"
    >
      <div className="relative flex-shrink-0">
        <img
          src={hotel.image || "/api/placeholder/400/250"}
          alt={hotel.name}
          className="w-full h-48 object-cover"
        />
        {hotel.discount && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold shadow-lg">
            -{hotel.discount}%
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight text-sm h-10">
          {hotel.name}
        </h3>

        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
          <span className="text-xs line-clamp-1">{hotel.location}</span>
        </div>

        <div className="flex items-center mb-3">
          <div className="flex items-center bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs flex-shrink-0">
            <Star className="w-3 h-3 fill-current mr-1" />
            {hotel.rating}
          </div>
          <span className="text-xs text-gray-600 ml-2">
            ({hotel.reviewCount} đánh giá)
          </span>
        </div>

        <div className="mb-3 flex-1">
          <div className="flex flex-wrap gap-1">
            {hotel.amenities.slice(0, 2).map((amenity, amenityIndex) => {
              const Icon = getAmenityIcon(amenity);
              return Icon ? (
                <div
                  key={amenityIndex}
                  className="flex items-center text-gray-600 text-xs bg-gray-100 px-1.5 py-0.5 rounded flex-shrink-0"
                >
                  <Icon className="w-2.5 h-2.5 mr-1" />
                  {amenity}
                </div>
              ) : null;
            })}
            {hotel.amenities.length > 2 && (
              <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                +{hotel.amenities.length - 2} khác
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mt-auto">
          <div className="min-w-0">
            {hotel.originalPrice && (
              <div className="text-xs text-gray-500 line-through">
                {formatPrice(hotel.originalPrice)}đ
              </div>
            )}
            <div className="font-bold text-green-600 text-sm">
              {formatPrice(hotel.price)}đ
              <span className="text-xs font-normal text-gray-600">/đêm</span>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg font-semibold text-sm transition-colors shadow-md flex-shrink-0"
          >
            Chọn phòng
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Client component để xử lý search params
function HotelsContent() {
  const searchParams = useSearchParams();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter state
  const [filters, setFilters] = useState<SearchFilters>({
    location: searchParams.get("location") || "",
    priceRange: [0, 5000000],
    rating: searchParams.get("rating") || "all",
    amenities: [],
    mobileDrawer: false,
  });

  // Collapsible sections state
  const [openSections, setOpenSections] = useState({
    price: true,
    rating: true,
    amenities: true,
    mobileDrawer: false,
  });

  const destination = searchParams.get("destination") || "";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const guests = searchParams.get("guests") || "";

  // Debounce filters để tránh call API quá nhiều
  const debouncedFilters = useDebounce(filters, 500);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Tạo query params từ filters - SỬA LẠI
  const queryParams = useMemo(() => {
    const params = new URLSearchParams();

    if (debouncedFilters.location)
      params.append("location", debouncedFilters.location);
    if (debouncedFilters.priceRange[1] !== 5000000) {
      params.append(
        "priceRange",
        getPriceRangeValue(debouncedFilters.priceRange[1])
      );
    }
    if (debouncedFilters.rating !== "all")
      params.append("rating", debouncedFilters.rating);
    if (destination) params.append("destination", destination);

    return params;
  }, [debouncedFilters, destination]);

  // Fetch hotels data
  useEffect(() => {
    fetchHotels();
  }, [queryParams.toString()]);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/hotels?${queryParams}`);
      const result = await response.json();

      if (result.success) {
        setHotels(result.data);
      }
    } catch (error) {
      console.error("Error fetching hotels:", error);
    } finally {
      setLoading(false);
    }
  };

  // Các hàm xử lý filter
  const handleFilterChange = useCallback(
    (key: keyof SearchFilters, value: any) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  const handleAmenityToggle = useCallback((amenity: string) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({
      location: "",
      priceRange: [0, 5000000],
      rating: "all",
      amenities: [],
      mobileDrawer: false,
    });
    setSearchTerm("");
  }, []);

  const toggleSection = useCallback((section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, []);

  // Filter hotels client-side dựa trên search term
  const filteredHotels = useMemo(() => {
    if (!debouncedSearchTerm) return hotels;

    return hotels.filter(
      (hotel) =>
        hotel.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        hotel.location.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [hotels, debouncedSearchTerm]);

  const priceRanges = [
    { value: 1000000, label: "Dưới 1tr", display: "Dưới 1.000.000đ" },
    { value: 2000000, label: "Dưới 2tr", display: "Dưới 2.000.000đ" },
    { value: 3000000, label: "Dưới 3tr", display: "Dưới 3.000.000đ" },
    { value: 5000000, label: "Tất cả", display: "Tất cả" },
  ];

  const ratings = [
    { value: "all", label: "Tất cả" },
    { value: "4.5", label: "4.5+ ⭐" },
    { value: "4", label: "4.0+ ⭐" },
    { value: "3", label: "3.0+ ⭐" },
  ];

  const amenitiesList = [
    { id: "wifi", name: "WiFi", icon: Wifi },
    { id: "parking", name: "Bãi đỗ xe", icon: Car },
    { id: "restaurant", name: "Nhà hàng", icon: Utensils },
    { id: "pool", name: "Hồ bơi", icon: Waves },
    { id: "gym", name: "Phòng gym", icon: Dumbbell },
    { id: "ac", name: "Điều hòa", icon: Snowflake },
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

        {/* Location Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm theo địa điểm..."
              value={filters.location}
              onChange={(e) => handleFilterChange("location", e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
            />
          </div>
        </div>

        {/* Price Range */}
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
                className="space-y-4 overflow-hidden"
              >
                <motion.input
                  type="range"
                  min={0}
                  max={5000000}
                  step={100000}
                  value={filters.priceRange[1]}
                  onChange={(e) =>
                    handleFilterChange("priceRange", [
                      0,
                      parseInt(e.target.value),
                    ])
                  }
                  className="w-full accent-orange-500"
                />
                <div className="flex justify-between text-xs text-gray-600">
                  <span>0đ</span>
                  <span className="font-semibold text-orange-600">
                    {formatPrice(filters.priceRange[1])}đ
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {priceRanges.map((range) => (
                    <motion.button
                      key={range.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        handleFilterChange("priceRange", [0, range.value])
                      }
                      className={`px-2 py-1 rounded border text-xs font-medium transition-all ${
                        filters.priceRange[1] === range.value
                          ? "bg-orange-500 text-white border-orange-500"
                          : "bg-gray-50 text-gray-700 border-gray-300 hover:border-orange-300"
                      }`}
                    >
                      {range.label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Rating Filter */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <button
            onClick={() => toggleSection("rating")}
            className="flex items-center justify-between w-full mb-4"
          >
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              Đánh giá
            </h4>
            {openSections.rating ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>

          <AnimatePresence>
            {openSections.rating && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 overflow-hidden"
              >
                {ratings.map((rating) => (
                  <motion.button
                    key={rating.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleFilterChange("rating", rating.value)}
                    className={`flex items-center gap-2 w-full p-2 rounded-lg border text-sm font-medium transition-all ${
                      filters.rating === rating.value
                        ? "bg-purple-50 border-purple-500 text-purple-700"
                        : "bg-white border-gray-200 text-gray-700 hover:border-purple-300"
                    }`}
                  >
                    <Star className="w-3 h-3" />
                    <span>{rating.label}</span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Amenities */}
        <div className="pb-2">
          <button
            onClick={() => toggleSection("amenities")}
            className="flex items-center justify-between w-full mb-4"
          >
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              Tiện nghi
            </h4>
            {openSections.amenities ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>

          <AnimatePresence>
            {openSections.amenities && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 overflow-hidden"
              >
                {amenitiesList.map((amenity) => {
                  const Icon = amenity.icon;
                  const isSelected = filters.amenities.includes(amenity.id);
                  return (
                    <motion.button
                      key={amenity.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAmenityToggle(amenity.id)}
                      className={`flex items-center gap-2 w-full p-2 rounded-lg border text-sm font-medium transition-all ${
                        isSelected
                          ? "bg-blue-50 border-blue-500 text-blue-700"
                          : "bg-white border-gray-200 text-gray-700 hover:border-blue-300"
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{amenity.name}</span>
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    ),
    [
      filters,
      openSections,
      clearAllFilters,
      handleFilterChange,
      handleAmenityToggle,
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
                Tìm kiếm khách sạn
              </h1>
              {destination && (
                <p className="text-gray-600">
                  Kết quả tìm kiếm cho:{" "}
                  <span className="font-semibold text-orange-600">
                    {destination}
                  </span>
                </p>
              )}
            </div>

            {/* Search Bar - Desktop only */}
            <div className="hidden md:flex items-center gap-4 mt-4 lg:mt-0">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm khách sạn..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Search Summary */}
          {destination && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3"
            >
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="text-xs text-gray-600">Điểm đến</div>
                <div className="font-semibold text-blue-700 text-sm">
                  {destination}
                </div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <div className="text-xs text-gray-600">Check-in</div>
                <div className="font-semibold text-green-700 text-sm">
                  {checkIn}
                </div>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                <div className="text-xs text-gray-600">Check-out</div>
                <div className="font-semibold text-orange-700 text-sm">
                  {checkOut}
                </div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <div className="text-xs text-gray-600">Khách & Phòng</div>
                <div className="font-semibold text-purple-700 text-sm">
                  {guests}
                </div>
              </div>
            </motion.div>
          )}

          {/* Mobile Search Bar */}
          <div className="md:hidden mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm khách sạn..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters - Hidden on mobile by default, show with drawer */}
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
                  ? "Đang tìm khách sạn..."
                  : `${filteredHotels.length} khách sạn được tìm thấy`}
              </motion.h2>

              {!loading && filteredHotels.length > 0 && (
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

            {/* Hotels Grid với kích thước cố định */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {loading ? (
                // Loading state với skeleton cards có cùng kích thước
                <>
                  {[...Array(6)].map((_, i) => (
                    <HotelCardSkeleton key={i} />
                  ))}
                </>
              ) : filteredHotels.length > 0 ? (
                // Actual hotel cards với kích thước cố định
                filteredHotels.map((hotel, index) => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))
              ) : (
                // Empty state
                <div className="col-span-full">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 bg-white rounded-xl shadow-md"
                  >
                    <div className="text-5xl mb-3">🏨</div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">
                      Không tìm thấy khách sạn phù hợp
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
          </div>
        </div>
      </div>
    </div>
  );
}

// Main page component với Suspense
export default function HotelsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <HotelCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <HotelsContent />
    </Suspense>
  );
}