"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import DestinationCard from "./DestinationCard";
import { Filter, MapPin, Grid3X3, List } from "lucide-react";

interface Destination {
  id: number;
  city: string;
  country: string;
  image: string;
  rating: number;
  reviewCount: number;
  hotels: number;
  fromPrice: number;
  toPrice: number;
  slug: string;
  highlights: Array<{
    name: string;
    image: string;
  }>;
  activities: Array<{
    name: string;
    icon: string;
  }>;
  isFeatured?: boolean;
  discount?: number;
  tags: string[];
}

type ViewMode = "grid" | "list";
type SortOption = "popular" | "price-low" | "price-high" | "rating";

export default function DestinationSection() {
  const [data, setData] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState(8);

  // Lấy danh sách tags duy nhất từ data
  const allTags = ["all", ...new Set(data.flatMap(dest => dest.tags || []))];

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/destinations");
        const result = await response.json();

        if (result.success) {
          setData(result.data);
        } else {
          setError(result.message || "Failed to fetch destinations");
        }
      } catch (err) {
        setError("Network error occurred");
        console.error("Error fetching destinations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  // Filter và sort data
  const filteredAndSortedData = data
    .filter(dest => selectedTag === "all" || dest.tags?.includes(selectedTag))
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.fromPrice - b.fromPrice;
        case "price-high":
          return b.fromPrice - a.fromPrice;
        case "rating":
          return b.rating - a.rating;
        case "popular":
        default:
          return b.reviewCount - a.reviewCount;
      }
    })
    .slice(0, visibleCount);

  const loadMore = () => {
    setVisibleCount(prev => prev + 8);
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-96 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-300 h-48 rounded-t-2xl"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !data.length) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto"
          >
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {error ? "Có lỗi xảy ra" : "Chưa có điểm đến nào"}
            </h2>
            <p className="text-gray-600 mb-6">
              {error || "Hiện chưa có điểm đến nào được cập nhật."}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Thử lại
              </button>
              <Link href="/contact">
                <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                  Liên hệ hỗ trợ
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="container mx-auto px-4">
        {/* Header với controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <MapPin className="w-4 h-4" />
            Khám phá thế giới
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Điểm đến{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              nổi bật
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Khám phá những điểm đến hấp dẫn nhất với trải nghiệm du lịch đáng nhớ và giá cả hợp lý
          </p>
        </motion.div>

        {/* Controls Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8 p-6 bg-white rounded-2xl shadow-lg"
        >
          {/* Filter Tags */}
          <div className="flex flex-wrap gap-2">
            {allTags.slice(0, 6).map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedTag === tag
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tag === "all" ? "Tất cả" : tag}
              </button>
            ))}
          </div>

          {/* Sort và View Controls */}
          <div className="flex items-center gap-4">
            {/* Sort Options */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="popular">Phổ biến nhất</option>
              <option value="rating">Đánh giá cao</option>
              <option value="price-low">Giá thấp đến cao</option>
              <option value="price-high">Giá cao đến thấp</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "grid"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "list"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Destination Grid/List */}
        <motion.div
          layout
          className={`${
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              : "space-y-6"
          }`}
        >
          {filteredAndSortedData.map((destination: Destination, index: number) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              index={index}
              viewMode={viewMode}
            />
          ))}
        </motion.div>

        {/* Load More / View All */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          {visibleCount < data.length ? (
            <button
              onClick={loadMore}
              className="px-8 py-4 bg-white border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 mx-auto"
            >
              <span>Xem thêm điểm đến</span>
              <span className="text-sm text-gray-500">({data.length - visibleCount} còn lại)</span>
            </button>
          ) : (
            <div className="text-center">
              <div className="w-16 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>
              <p className="text-gray-500 mb-6">Bạn đã xem tất cả điểm đến</p>
              <Link href="/destinations">
                <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                  Khám phá tất cả điểm đến
                </button>
              </Link>
            </div>
          )}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-2xl p-8 text-white"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">{data.length}+</div>
              <div className="text-blue-100">Điểm đến</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">
                {Math.max(...data.map(d => d.rating))}/5
              </div>
              <div className="text-blue-100">Đánh giá cao nhất</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">
                {Math.min(...data.map(d => d.fromPrice)).toLocaleString()}đ
              </div>
              <div className="text-blue-100">Giá tốt nhất</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">
                {data.reduce((sum, d) => sum + d.reviewCount, 0).toLocaleString()}+
              </div>
              <div className="text-blue-100">Đánh giá</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}