"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Star,
  MapPin,
  Calendar,
  Users,
  ArrowLeft,
  Share2,
  Heart,
  Camera,
  Navigation,
  Clock,
  DollarSign,
} from "lucide-react";
import Link from "next/link";

interface DestinationDetail {
  id: number;
  city: string;
  country: string;
  province: string;
  description: string;
  image: string;
  heroImage?: string;
  rating: number;
  reviewCount: number;
  hotels: number;
  fromPrice: number;
  toPrice: number;
  bestTime: string;
  category: string;
  popularity: string;
  slug: string;
  temperature?: string;
  condition?: string;
  humidity?: string;
  rainfall?: string;
  flightTime?: string;
  ferryTime?: string;
  carTime?: string;
  highlights: Array<{
    id: number;
    name: string;
    description: string;
    image: string;
    rating: number;
  }>;
  activities: Array<{
    id: number;
    name: string;
    icon: string;
    description: string;
  }>;
}

export default function DestinationDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [destination, setDestination] = useState<DestinationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/destinations/${slug}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch destination");
        }

        const result = await response.json();
        
        if (result.success) {
          setDestination(result.data);
        } else {
          setError(result.message || "Destination not found");
        }
      } catch (err) {
        setError("Error loading destination");
        console.error("Error fetching destination:", err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchDestination();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error ? "Có lỗi xảy ra" : "Không tìm thấy điểm đến"}
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "Điểm đến bạn tìm kiếm không tồn tại."}
          </p>
          <Link href="/destinations">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Quay lại danh sách
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const images = [destination.image, ...(destination.highlights?.map(h => h.image) || [])].filter(Boolean);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-96 lg:h-[500px] overflow-hidden">
        <img
          src={images[selectedImage]}
          alt={destination.city}
          className="w-full h-full object-cover"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Navigation */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
          <Link href="/destinations">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </motion.button>
          </Link>
          
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
            >
              <Share2 className="h-5 w-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
            >
              <Heart className="h-5 w-5" />
            </motion.button>
          </div>
        </div>

        {/* Image Thumbnails */}
        {images.length > 1 && (
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <motion.button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index ? "border-white" : "border-white/50"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${destination.city} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Destination Info */}
        <div className="absolute bottom-6 left-6 text-white">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-bold mb-2"
          >
            {destination.city}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl opacity-90 mb-4"
          >
            {destination.province}, {destination.country}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center space-x-6"
          >
            <div className="flex items-center space-x-1">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="font-semibold">{destination.rating}</span>
              <span className="opacity-80">({destination.reviewCount} đánh giá)</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="h-5 w-5" />
              <span>{destination.hotels} khách sạn</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Content */}
          <div className="lg:col-span-2">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
              <div className="bg-blue-50 p-4 rounded-xl text-center">
                <DollarSign className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Giá từ</div>
                <div className="font-bold text-blue-600">
                  {destination.fromPrice.toLocaleString("vi-VN")}đ
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-xl text-center">
                <Calendar className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Thời điểm đẹp</div>
                <div className="font-bold text-green-600">{destination.bestTime}</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl text-center">
                <Clock className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Bay từ</div>
                <div className="font-bold text-purple-600">{destination.flightTime}</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-xl text-center">
                <Users className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Độ phổ biến</div>
                <div className="font-bold text-orange-600">{destination.popularity}</div>
              </div>
            </motion.div>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg"
            >
              <div className="border-b">
                <nav className="flex space-x-8 px-6 overflow-x-auto">
                  {[
                    { key: "overview", label: "Tổng quan" },
                    { key: "highlights", label: "Điểm nổi bật" },
                    { key: "activities", label: "Hoạt động" },
                    { key: "weather", label: "Thời tiết" },
                    { key: "reviews", label: "Đánh giá" },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`py-4 px-1 border-b-2 whitespace-nowrap font-medium text-sm ${
                        activeTab === tab.key
                          ? "border-blue-600 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Giới thiệu</h3>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {destination.description}
                      </p>
                    </div>

                    {/* Transportation */}
                    {(destination.flightTime || destination.carTime) && (
                      <div>
                        <h4 className="text-lg font-semibold mb-3">Di chuyển</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {destination.flightTime && (
                            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                              <Navigation className="h-6 w-6 text-blue-600" />
                              <div>
                                <div className="font-medium">Máy bay</div>
                                <div className="text-sm text-gray-600">{destination.flightTime}</div>
                              </div>
                            </div>
                          )}
                          {destination.carTime && (
                            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                              <MapPin className="h-6 w-6 text-green-600" />
                              <div>
                                <div className="font-medium">Ô tô</div>
                                <div className="text-sm text-gray-600">{destination.carTime}</div>
                              </div>
                            </div>
                          )}
                          {destination.ferryTime && (
                            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                              <Navigation className="h-6 w-6 text-purple-600" />
                              <div>
                                <div className="font-medium">Phà</div>
                                <div className="text-sm text-gray-600">{destination.ferryTime}</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Highlights Tab */}
                {activeTab === "highlights" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold mb-4">Điểm nổi bật</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {destination.highlights?.map((highlight, index) => (
                        <motion.div
                          key={highlight.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                        >
                          <img
                            src={highlight.image}
                            alt={highlight.name}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-4">
                            <h4 className="font-semibold text-lg mb-2">{highlight.name}</h4>
                            <p className="text-gray-600 text-sm mb-3">
                              {highlight.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="text-sm font-medium">{highlight.rating}</span>
                              </div>
                              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                Xem thêm
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Activities Tab */}
                {activeTab === "activities" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold mb-4">Hoạt động phổ biến</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {destination.activities?.map((activity, index) => (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">{activity.icon}</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{activity.name}</h4>
                            <p className="text-sm text-gray-600">{activity.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Weather Tab */}
                {activeTab === "weather" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold mb-4">Thông tin thời tiết</h3>
                    {destination.temperature && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-xl">
                          <div className="text-2xl font-bold text-blue-600">
                            {destination.temperature}
                          </div>
                          <div className="text-sm text-gray-600">Nhiệt độ</div>
                        </div>
                        {destination.condition && (
                          <div className="text-center p-4 bg-green-50 rounded-xl">
                            <div className="text-lg font-bold text-green-600 capitalize">
                              {destination.condition}
                            </div>
                            <div className="text-sm text-gray-600">Tình trạng</div>
                          </div>
                        )}
                        {destination.humidity && (
                          <div className="text-center p-4 bg-purple-50 rounded-xl">
                            <div className="text-lg font-bold text-purple-600">
                              {destination.humidity}
                            </div>
                            <div className="text-sm text-gray-600">Độ ẩm</div>
                          </div>
                        )}
                        {destination.rainfall && (
                          <div className="text-center p-4 bg-orange-50 rounded-xl">
                            <div className="text-lg font-bold text-orange-600">
                              {destination.rainfall}
                            </div>
                            <div className="text-sm text-gray-600">Lượng mưa</div>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-yellow-800">
                        <strong>Thời điểm lý tưởng:</strong> {destination.bestTime}
                      </p>
                    </div>
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === "reviews" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold mb-4">Đánh giá từ du khách</h3>
                    <div className="text-center py-8 text-gray-500">
                      Tính năng đánh giá đang được phát triển
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Booking & Related */}
          <div className="space-y-6">
            {/* Quick Booking Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-6"
            >
              <h3 className="text-xl font-semibold mb-4">Khám phá {destination.city}</h3>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    Từ {destination.fromPrice.toLocaleString("vi-VN")}đ
                  </div>
                  <div className="text-sm text-gray-600">cho chuyến đi 3 ngày 2 đêm</div>
                </div>
                
                <Link href={`/packages?destination=${destination.slug}`}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-semibold transition-colors"
                  >
                    Xem tour du lịch
                  </motion.button>
                </Link>
                
                <Link href={`/hotels?destination=${destination.slug}`}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl font-semibold transition-colors"
                  >
                    Tìm khách sạn
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* Related Destinations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Điểm đến liên quan</h3>
              <div className="space-y-3">
                <p className="text-gray-600 text-sm">
                  Khám phá thêm các điểm đến hấp dẫn khác trong khu vực {destination.province}.
                </p>
                <Link href="/destinations">
                  <button className="w-full text-blue-600 hover:text-blue-700 font-medium py-2">
                    Xem tất cả điểm đến →
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}