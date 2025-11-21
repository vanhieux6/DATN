"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Star,
  MapPin,
  Clock,
  Users,
  Calendar,
  Shield,
  CheckCircle,
  ArrowLeft,
  Share2,
  Heart,
} from "lucide-react";
import Link from "next/link";

interface ActivityDetail {
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
  description?: string;
  highlights: Array<{ highlight: string }>;
  included: Array<{ item: string }>;
  availableDates: Array<{ date: string }>;
  destination?: {
    city: string;
    province: string;
  };
}

export default function ActivityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const activityId = params.id as string;

  const [activity, setActivity] = useState<ActivityDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedDate, setSelectedDate] = useState("");
  const [participants, setParticipants] = useState(1);

  useEffect(() => {
    if (activityId) {
      fetchActivity();
    }
  }, [activityId]);

  const fetchActivity = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/activities/${activityId}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch activity");
      }

      const result = await response.json();
      
      if (result.success) {
        setActivity(result.data);
        // Set first available date as default - FIXED
        if (result.data.availableDates?.length > 0) {
          setSelectedDate(result.data.availableDates[0].date);
        } else {
          // Fallback: generate some sample dates if none available
          const today = new Date();
          const sampleDates = [
            new Date(today.setDate(today.getDate() + 1)),
            new Date(today.setDate(today.getDate() + 2)),
            new Date(today.setDate(today.getDate() + 3))
          ];
          // Add sample dates to activity data
          result.data.availableDates = sampleDates.map(date => ({ 
            date: date.toISOString().split('T')[0] 
          }));
          setSelectedDate(result.data.availableDates[0].date);
        }
      } else {
        setError(result.message || "Activity not found");
      }
    } catch (err) {
      setError("Error loading activity");
      console.error("Error fetching activity:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalPrice = () => {
    if (!activity) return 0;
    return activity.price * participants;
  };

  const handleBooking = () => {
    if (!selectedDate) {
      alert("Vui lòng chọn ngày tham gia");
      return;
    }
    alert(`Đặt hoạt động: ${activity?.title} cho ${participants} người vào ngày ${new Date(selectedDate).toLocaleDateString('vi-VN')}`);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error ? "Có lỗi xảy ra" : "Không tìm thấy hoạt động"}
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "Hoạt động bạn tìm kiếm không tồn tại."}
          </p>
          <Link href="/activities">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Quay lại danh sách
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-96 lg:h-[500px] overflow-hidden">
        <img
          src={activity.image}
          alt={activity.title}
          className="w-full h-full object-cover"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Navigation */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
          <button
            onClick={() => router.push("/activities")}
            className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          
          <div className="flex space-x-3">
            <button className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors">
              <Share2 className="h-5 w-5" />
            </button>
            <button className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors">
              <Heart className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Activity Info */}
        <div className="absolute bottom-6 left-6 text-white">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-bold mb-2"
          >
            {activity.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl opacity-90 mb-4"
          >
            {activity.subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center space-x-6"
          >
            <div className="flex items-center space-x-1">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="font-semibold">{activity.rating}</span>
              <span className="opacity-80">({activity.reviewCount} đánh giá)</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="h-5 w-5" />
              <span>{activity.location}</span>
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
                <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Thời lượng</div>
                <div className="font-bold text-blue-600">{activity.duration}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-xl text-center">
                <Users className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Nhóm</div>
                <div className="font-bold text-green-600">{activity.groupSize}</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl text-center">
                <Shield className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Độ khó</div>
                <div className="font-bold text-purple-600">{activity.difficulty}</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-xl text-center">
                <Calendar className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Lịch trình</div>
                <div className="font-bold text-orange-600">Hàng ngày</div>
              </div>
            </motion.div>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border"
            >
              <div className="border-b">
                <nav className="flex space-x-8 px-6 overflow-x-auto">
                  {[
                    { key: "overview", label: "Tổng quan" },
                    { key: "highlights", label: "Điểm nổi bật" },
                    { key: "included", label: "Bao gồm" },
                    { key: "schedule", label: "Lịch trình" },
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
                      <h3 className="text-xl font-semibold mb-4">Mô tả hoạt động</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {activity.description || activity.subtitle}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Thông tin chi tiết</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Độ khó:</span>
                            <span className="font-medium">{activity.difficulty}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Yêu cầu tuổi:</span>
                            <span className="font-medium">{activity.ageRequirement}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Thời điểm tốt nhất:</span>
                            <span className="font-medium">{activity.bestTime}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-3">Địa điểm</h4>
                        <p className="text-gray-700">{activity.location}</p>
                        {activity.destination && (
                          <p className="text-sm text-gray-600 mt-1">
                            {activity.destination.city}, {activity.destination.province}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Highlights Tab */}
                {activeTab === "highlights" && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold mb-4">Điểm nổi bật</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activity.highlights?.map((highlight, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg"
                        >
                          <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{highlight.highlight}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Included Tab */}
                {activeTab === "included" && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold mb-4">Dịch vụ bao gồm</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activity.included?.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg"
                        >
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-gray-700">{item.item}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Schedule Tab */}
                {activeTab === "schedule" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold mb-4">Lịch trình hoạt động</h3>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Thời gian hoạt động</h4>
                      <p className="text-gray-700">{activity.schedule}</p>
                    </div>

                    {activity.availableDates && activity.availableDates.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3">Ngày khả dụng</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {activity.availableDates.map((date, index) => (
                            <div
                              key={index}
                              className={`text-center p-3 rounded-lg border cursor-pointer transition-colors ${
                                selectedDate === date.date
                                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                                  : 'bg-gray-50 border-gray-200 text-gray-900 hover:bg-gray-100'
                              }`}
                              onClick={() => setSelectedDate(date.date)}
                            >
                              <div className="text-sm font-medium">
                                {new Date(date.date).toLocaleDateString('vi-VN')}
                              </div>
                              <div className="text-xs text-gray-500">Còn chỗ</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Booking */}
          <div className="space-y-6">
            {/* Booking Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg border p-6 sticky top-6"
            >
              <div className="text-center mb-6">
                {activity.originalPrice > activity.price && (
                  <div className="text-sm text-gray-500 line-through mb-1">
                    {activity.originalPrice.toLocaleString("vi-VN")}đ
                  </div>
                )}
                <div className="text-3xl font-bold text-blue-600">
                  {activity.price.toLocaleString("vi-VN")}đ
                </div>
                <div className="text-sm text-gray-600">mỗi người</div>
              </div>

              <div className="space-y-4">
                {/* Date Selection - FIXED */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chọn ngày
                  </label>
                  {activity.availableDates && activity.availableDates.length > 0 ? (
                    <select
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {activity.availableDates.map((date, index) => (
                        <option key={index} value={date.date}>
                          {formatDate(date.date)}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-yellow-700 text-sm">
                        Đang tải ngày khả dụng...
                      </p>
                    </div>
                  )}
                </div>

                {/* Selected Date Display */}
                {selectedDate && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="text-sm text-blue-700">
                      <strong>Ngày đã chọn:</strong> {formatDate(selectedDate)}
                    </div>
                  </div>
                )}

                {/* Participants */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số người
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setParticipants(Math.max(1, participants - 1))}
                      className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                      disabled={participants <= 1}
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-medium">{participants}</span>
                    <button
                      onClick={() => setParticipants(participants + 1)}
                      className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Total Price */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Tổng cộng:</span>
                    <span className="text-xl font-bold text-blue-600">
                      {calculateTotalPrice().toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                  <button
                    onClick={handleBooking}
                    disabled={!selectedDate}
                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-colors ${
                      selectedDate
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-400 cursor-not-allowed text-gray-200'
                    }`}
                  >
                    {selectedDate ? 'Đặt ngay' : 'Chọn ngày'}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Safety Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-green-50 border border-green-200 rounded-2xl p-6"
            >
              <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                An toàn & Bảo mật
              </h3>
              <ul className="text-sm text-green-700 space-y-2">
                <li>• Hướng dẫn viên chuyên nghiệp</li>
                <li>• Thiết bị an toàn đầy đủ</li>
                <li>• Bảo hiểm du lịch bao gồm</li>
                <li>• Hỗ trợ 24/7</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}