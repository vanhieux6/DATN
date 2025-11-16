"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  MapPin,
  Clock,
  Users,
  Filter,
  Search,
  Calendar,
  Heart,
  Zap,
  Utensils,
  Hotel,
  Mountain,
  X,
  SlidersHorizontal,
  Sparkles,
  ArrowRight,
  Eye,
} from "lucide-react";

interface TourPackage {
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
  category: string;
  destination: {
    city: string;
    country: string;
    image: string;
  };
  highlights: string[];
}

type SortOption = "popular" | "price-low" | "price-high" | "rating" | "newest";
type ViewMode = "grid" | "list";
type PriceRange = [number, number];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN").format(price);
};

function BeachIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    </svg>
  );
}

// Enhanced Loading Skeleton với animation
function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="bg-gradient-to-br from-gray-300 to-gray-200 h-48 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-6 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Filter Chips Component
function FilterChips({
  selectedCategories,
  setSelectedCategories,
  selectedDurations,
  setSelectedDurations,
  priceRange,
  setPriceRange,
}: any) {
  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedDurations([]);
    setPriceRange([0, 5000000]);
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedDurations.length > 0 ||
    priceRange[1] < 5000000;

  if (!hasActiveFilters) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-2 mb-4"
    >
      {selectedCategories.map((category: string) => (
        <motion.button
          key={category}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() =>
            setSelectedCategories((prev: string[]) =>
              prev.filter((c: string) => c !== category)
            )
          }
          className="flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-orange-200 transition-colors border border-orange-200"
        >
          {category}
          <X className="w-3 h-3" />
        </motion.button>
      ))}

      {selectedDurations.map((duration: string) => (
        <motion.button
          key={duration}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() =>
            setSelectedDurations((prev: string[]) =>
              prev.filter((d: string) => d !== duration)
            )
          }
          className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors border border-blue-200"
        >
          {duration}
          <X className="w-3 h-3" />
        </motion.button>
      ))}

      {priceRange[1] < 5000000 && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setPriceRange([0, 5000000])}
          className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-green-200 transition-colors border border-green-200"
        >
          Dưới {formatPrice(priceRange[1])}đ
          <X className="w-3 h-3" />
        </motion.button>
      )}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={clearAllFilters}
        className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors border border-gray-300"
      >
        Xóa tất cả
        <X className="w-3 h-3" />
      </motion.button>
    </motion.div>
  );
}

// Enhanced Tour Card với nhiều animation và thông tin phong phú
function TourCard({
  tour,
  isFavorite,
  onToggleFavorite,
}: {
  tour: TourPackage;
  isFavorite: boolean;
  onToggleFavorite: (tourId: number) => void;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const calculateDiscount = () => {
    if (tour.originalPrice && tour.price && tour.originalPrice > tour.price) {
      return Math.round(
        ((tour.originalPrice - tour.price) / tour.originalPrice) * 100
      );
    }
    return 0;
  };

  const discount = calculateDiscount();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 cursor-pointer"
    >
      <Link href={`/tour/${tour.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
          )}

          {/* Main Image */}
          <motion.img
            src={tour.image}
            alt={tour.title}
            className={`w-full h-full object-cover transition-all duration-700 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            } ${isHovered ? "scale-110" : "scale-100"}`}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Gradient Overlay với animation */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: isHovered ? 0.8 : 0.6 }}
            transition={{ duration: 0.3 }}
          />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {tour.badge && (
                <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  {tour.badge}
                </span>
              )}
            </motion.div>
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {discount > 0 && (
                <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  -{discount}%
                </span>
              )}
            </motion.div>
          </div>

          {/* Favorite Button với animation */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite(tour.id);
            }}
            className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all shadow-lg"
          >
            <motion.div
              animate={{ scale: isFavorite ? 1.2 : 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Heart
                className={`w-5 h-5 transition-all duration-300 ${
                  isFavorite
                    ? "fill-red-500 text-red-500"
                    : "text-gray-600 group-hover:text-red-500"
                }`}
              />
            </motion.div>
          </motion.button>

          {/* Rating với animation */}
          <motion.div
            className="absolute top-14 right-3 flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-bold">{tour.rating}</span>
          </motion.div>

          {/* Destination Info Overlay - HIỂN THỊ RÕ RÀNG */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            {/* Destination Name */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2 mb-2"
            >
              <MapPin className="w-4 h-4 text-orange-300" />
              <span className="font-semibold text-orange-300 text-sm">
                {tour.destination.city}
              </span>
            </motion.div>

            {/* Tour Title */}
            <motion.h3
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg font-bold mb-2 line-clamp-2 leading-tight group-hover:text-orange-300 transition-colors"
            >
              {tour.title}
            </motion.h3>

            {/* Tour Description */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-gray-200 mb-3 line-clamp-2 leading-relaxed"
            >
              {tour.subtitle}
            </motion.p>

            {/* Features */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-4 text-xs text-gray-300 mb-3"
            >
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{tour.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{tour.groupSize}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{tour.departure}</span>
              </div>
            </motion.div>

            {/* Price & CTA */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-between"
            >
              <div>
                {tour.originalPrice > tour.price && (
                  <div className="text-xs text-gray-300 line-through">
                    {formatPrice(tour.originalPrice)}đ
                  </div>
                )}
                <div className="text-xl font-bold text-orange-300">
                  {formatPrice(tour.price)}đ
                </div>
              </div>

              {/* Animated CTA Button */}
              <motion.div
                animate={{
                  opacity: isHovered ? 1 : 0,
                  x: isHovered ? 0 : 10,
                }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2 bg-white text-orange-600 px-3 py-2 rounded-lg font-semibold shadow-lg"
              >
                <span className="text-sm">Xem ngay</span>
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </motion.div>
          </div>

          {/* Hover Overlay với Quick View */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="text-white text-center"
                >
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 inline-block mb-2">
                    <Eye className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold">Xem chi tiết tour</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Link>

      {/* Bottom Content với Highlights */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="p-4 bg-gradient-to-r from-gray-50 to-white"
      >
        {/* Highlights */}
        {tour.highlights && tour.highlights.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tour.highlights.slice(0, 3).map((highlight, index) => (
              <motion.span
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="inline-block bg-orange-50 text-orange-700 px-2 py-1 rounded-md text-xs font-medium border border-orange-200"
              >
                {highlight}
              </motion.span>
            ))}
          </div>
        )}

        {/* Review Count */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{tour.reviewCount} đánh giá</span>
          </div>
          <div className="text-green-600 font-semibold">Còn chỗ</div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Enhanced Filters Panel với animation
function FiltersPanel({
  showFilters,
  categories,
  durations,
  selectedCategories,
  setSelectedCategories,
  selectedDurations,
  setSelectedDurations,
  priceRange,
  setPriceRange,
}: any) {
  return (
    <AnimatePresence>
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6 overflow-hidden"
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Price Range */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-orange-600" />
                Khoảng giá
              </h3>
              <div className="space-y-4">
                <motion.input
                  type="range"
                  min={0}
                  max={5000000}
                  step={100000}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full accent-orange-500"
                  whileFocus={{ scale: 1.02 }}
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>0đ</span>
                  <span className="font-semibold text-orange-600">
                    {formatPrice(priceRange[1])}đ
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[1000000, 2000000, 3000000, 5000000].map((price) => (
                    <motion.button
                      key={price}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setPriceRange([0, price])}
                      className={`px-2 py-2 rounded-lg border text-xs font-medium transition-all ${
                        priceRange[1] === price
                          ? "bg-orange-500 text-white border-orange-500 shadow-md"
                          : "bg-gray-50 text-gray-700 border-gray-300 hover:border-orange-300"
                      }`}
                    >
                      {price === 5000000
                        ? "Tất cả"
                        : `Dưới ${formatPrice(price)}đ`}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Loại tour
              </h3>
              <div className="space-y-2">
                {categories.map((category: any, index: number) => {
                  const Icon = category.icon;
                  const isSelected = selectedCategories.includes(category.id);
                  return (
                    <motion.button
                      key={category.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        setSelectedCategories((prev: string[]) =>
                          isSelected
                            ? prev.filter((c: string) => c !== category.id)
                            : [...prev, category.id]
                        )
                      }
                      className={`flex items-center gap-3 w-full p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        isSelected
                          ? "bg-orange-50 border-orange-500 text-orange-700 shadow-md"
                          : "bg-white border-gray-200 text-gray-700 hover:border-orange-300 hover:shadow-sm"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{category.name}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Duration */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Thời gian
              </h3>
              <div className="space-y-2">
                {durations.map((duration: string, index: number) => (
                  <motion.button
                    key={duration}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() =>
                      setSelectedDurations((prev: string[]) =>
                        prev.includes(duration)
                          ? prev.filter((d: string) => d !== duration)
                          : [...prev, duration]
                      )
                    }
                    className={`w-full p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      selectedDurations.includes(duration)
                        ? "bg-blue-50 border-blue-500 text-blue-700 shadow-md"
                        : "bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:shadow-sm"
                    }`}
                  >
                    {duration}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Main Component
export default function FeaturedTours() {
  const [tours, setTours] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<PriceRange>([0, 5000000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);

  const categories = [
    { id: "beach", name: "Biển đảo", icon: BeachIcon },
    { id: "mountain", name: "Núi rừng", icon: Mountain },
    { id: "cultural", name: "Văn hóa", icon: Utensils },
    { id: "adventure", name: "Phiêu lưu", icon: Zap },
    { id: "luxury", name: "Cao cấp", icon: Hotel },
  ];

  const durations = ["1-3 ngày", "4-7 ngày", "8-14 ngày", "15+ ngày"];

  // Fetch tours từ API
  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams({
          limit: "12",
          page: "1",
          sort: sortBy,
        });

        if (searchTerm) queryParams.append("search", searchTerm);
        if (selectedCategories.length > 0) {
          selectedCategories.forEach((cat) =>
            queryParams.append("category", cat)
          );
        }

        const res = await fetch(`/api/packages?${queryParams}`);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const json = await res.json();

        if (json.success) {
          setTours(json.data);
        } else {
          console.error("Failed to fetch tours:", json.message);
          setTours([]);
        }
      } catch (error) {
        console.error("Error fetching tours:", error);
        setTours([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchTours();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, sortBy, selectedCategories]);

  // Filter tours locally based on criteria
  const filteredTours = useMemo(() => {
    return tours.filter((tour) => {
      const matchesSearch =
        !searchTerm ||
        tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.destination.city.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPrice =
        tour.price >= priceRange[0] && tour.price <= priceRange[1];
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(tour.category);
      const matchesDuration =
        selectedDurations.length === 0 ||
        selectedDurations.some((dur) => tour.duration.includes(dur));

      return (
        matchesSearch && matchesPrice && matchesCategory && matchesDuration
      );
    });
  }, [tours, searchTerm, priceRange, selectedCategories, selectedDurations]);

  const toggleFavorite = useCallback((tourId: number) => {
    setFavorites((prev) =>
      prev.includes(tourId)
        ? prev.filter((id) => id !== tourId)
        : [...prev, tourId]
    );
  }, []);

  const sortedTours = useMemo(() => {
    const toursCopy = [...filteredTours];
    switch (sortBy) {
      case "price-low":
        return toursCopy.sort((a, b) => a.price - b.price);
      case "price-high":
        return toursCopy.sort((a, b) => b.price - a.price);
      case "rating":
        return toursCopy.sort((a, b) => b.rating - a.rating);
      case "newest":
        return toursCopy.sort(
          (a, b) =>
            new Date(b.validUntil).getTime() - new Date(a.validUntil).getTime()
        );
      default:
        return toursCopy.sort((a, b) => b.reviewCount - a.reviewCount);
    }
  }, [filteredTours, sortBy]);

  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 via-white to-blue-50/20">
      <div className="container mx-auto px-4">
        {/* Header với animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full text-sm font-bold mb-6 shadow-lg"
          >
            <Zap className="w-5 h-5" />
            🎯 TOUR NỔI BẬT
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-gray-900 mb-6"
          >
            Khám Phá{" "}
            <span className="bg-gradient-to-r from-orange-600 via-red-600 to-purple-600 bg-clip-text text-transparent">
              Hành Trình
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            Tìm kiếm tour du lịch hoàn hảo với nhiều lựa chọn đa dạng
          </motion.p>
        </motion.div>

        {/* Search & Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 space-y-4"
        >
          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-1 w-full">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm tour, điểm đến..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-transparent border-none focus:ring-0 text-lg placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all ${
                    showFilters
                      ? "bg-orange-500 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Filter className="w-5 h-5" />
                  Bộ lọc
                </motion.button>

                <motion.select
                  whileFocus={{ scale: 1.02 }}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-4 py-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-medium"
                >
                  <option value="popular">Phổ biến</option>
                  <option value="newest">Mới nhất</option>
                  <option value="rating">Đánh giá cao</option>
                  <option value="price-low">Giá thấp</option>
                  <option value="price-high">Giá cao</option>
                </motion.select>
              </div>
            </div>

            {/* Active Filter Chips */}
            <FilterChips
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              selectedDurations={selectedDurations}
              setSelectedDurations={setSelectedDurations}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
            />
          </div>

          {/* Filters Panel */}
          <FiltersPanel
            showFilters={showFilters}
            categories={categories}
            durations={durations}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            selectedDurations={selectedDurations}
            setSelectedDurations={setSelectedDurations}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
          />
        </motion.div>

        {/* Results Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-between items-center mb-6"
        >
          <div className="text-gray-600">
            Tìm thấy <strong>{sortedTours.length}</strong> tour phù hợp
            {searchTerm && (
              <span>
                {" "}
                cho "<strong>{searchTerm}</strong>"
              </span>
            )}
          </div>
        </motion.div>

        {/* Tours Grid */}
        {loading ? (
          <LoadingSkeleton />
        ) : sortedTours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedTours.map((tour) => (
              <TourCard
                key={tour.id}
                tour={tour}
                isFavorite={favorites.includes(tour.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-orange-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Không tìm thấy tour phù hợp
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Hãy thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSearchTerm("");
                setSelectedCategories([]);
                setSelectedDurations([]);
                setPriceRange([0, 5000000]);
              }}
              className="px-8 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors shadow-lg"
            >
              Xóa bộ lọc
            </motion.button>
          </motion.div>
        )}

        {/* CTA */}
        {sortedTours.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/tours">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(249, 115, 22, 0.3)",
                }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-bold transition-all duration-300 shadow-2xl"
              >
                Xem tất cả tour
              </motion.button>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
