"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Globe,
  ArrowLeft,
  Share2,
  Heart,
  Phone,
  Mail,
} from "lucide-react";
import Link from "next/link";

interface InsuranceDetail {
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

export default function InsuranceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const insuranceId = params.id as string;

  const [insurance, setInsurance] = useState<InsuranceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [travelers, setTravelers] = useState(1);
  const [travelDuration, setTravelDuration] = useState(7);

  useEffect(() => {
    if (insuranceId) {
      fetchInsurance();
    }
  }, [insuranceId]);

  const fetchInsurance = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/insurance/${insuranceId}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch insurance");
      }

      const result = await response.json();
      
      if (result.success) {
        setInsurance(result.data);
      } else {
        setError(result.message || "Insurance not found");
      }
    } catch (err) {
      setError("Error loading insurance");
      console.error("Error fetching insurance:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalPrice = () => {
    if (!insurance) return 0;
    return insurance.price * travelers * (travelDuration / 7); // Price per week
  };

  const handlePurchase = () => {
    // In a real app, this would redirect to purchase page or open purchase modal
    alert(`Mua bảo hiểm: ${insurance?.title} cho ${travelers} người trong ${travelDuration} ngày`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !insurance) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error ? "Có lỗi xảy ra" : "Không tìm thấy bảo hiểm"}
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "Bảo hiểm bạn tìm kiếm không tồn tại."}
          </p>
          <Link href="/insurance">
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
          src={insurance.image}
          alt={insurance.title}
          className="w-full h-full object-cover"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Navigation */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
          <button
            onClick={() => router.push("/insurance")}
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

        {/* Insurance Info */}
        <div className="absolute bottom-6 left-6 text-white">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-bold mb-2"
          >
            {insurance.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl opacity-90 mb-4"
          >
            {insurance.subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center space-x-6"
          >
            <div className="flex items-center space-x-1">
              <Shield className="h-5 w-5 text-blue-300" />
              <span className="font-semibold">{insurance.type}</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>{insurance.coverage}</span>
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
                <div className="text-sm text-gray-600">Thời hạn</div>
                <div className="font-bold text-blue-600">{insurance.duration}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-xl text-center">
                <Users className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Tuổi tối đa</div>
                <div className="font-bold text-green-600">{insurance.maxAge}</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl text-center">
                <Globe className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Điểm đến</div>
                <div className="font-bold text-purple-600">{insurance.destinations?.length || 0}+</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-xl text-center">
                <Shield className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Bệnh nền</div>
                <div className="font-bold text-orange-600">
                  {insurance.preExistingConditions ? "Có" : "Không"}
                </div>
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
                    { key: "coverage", label: "Phạm vi bảo hiểm" },
                    { key: "exclusions", label: "Không áp dụng" },
                    { key: "claims", label: "Yêu cầu bồi thường" },
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
                      <p className="text-gray-700 leading-relaxed">
                        {insurance.subtitle}
                      </p>
                    </div>

                    {/* Key Features */}
                    <div>
                      <h4 className="font-semibold mb-3">Đặc điểm nổi bật</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {insurance.features?.slice(0, 6).map((feature, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start space-x-3"
                          >
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{feature.feature}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Coverage Tab */}
                {activeTab === "coverage" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold mb-4">Phạm vi bảo hiểm</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {insurance.features?.map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg"
                        >
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-gray-900">{feature.feature}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Covered Destinations */}
                    {insurance.destinations && insurance.destinations.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3">Điểm đến áp dụng</h4>
                        <div className="flex flex-wrap gap-2">
                          {insurance.destinations.map((destination, index) => (
                            <span
                              key={index}
                              className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                            >
                              {destination.destination}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Exclusions Tab */}
                {activeTab === "exclusions" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold mb-4">Trường hợp không áp dụng</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {insurance.exclusions?.map((exclusion, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg"
                        >
                          <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-gray-900">{exclusion.exclusion}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Claims Tab */}
                {activeTab === "claims" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold mb-4">Quy trình yêu cầu bồi thường</h3>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <p className="text-blue-800 leading-relaxed whitespace-pre-line">
                        {insurance.claimProcess || `1. Thông báo ngay khi sự cố xảy ra
2. Thu thập đầy đủ giấy tờ, hóa đơn
3. Liên hệ tổng đài hỗ trợ 24/7
4. Gửi hồ sơ yêu cầu bồi thường
5. Nhận phản hồi trong vòng 48 giờ
6. Nhận bồi thường trong vòng 7-14 ngày làm việc`}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="text-center p-6 bg-white border border-gray-200 rounded-lg">
                        <Phone className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                        <div className="font-semibold text-gray-900 mb-1">Tổng đài khẩn cấp</div>
                        <div className="text-2xl font-bold text-blue-600">1800-1234</div>
                        <div className="text-sm text-gray-600">Hỗ trợ 24/7</div>
                      </div>
                      <div className="text-center p-6 bg-white border border-gray-200 rounded-lg">
                        <Mail className="h-8 w-8 text-green-600 mx-auto mb-3" />
                        <div className="font-semibold text-gray-900 mb-1">Email hỗ trợ</div>
                        <div className="text-lg font-bold text-green-600">support@travel.com</div>
                        <div className="text-sm text-gray-600">Phản hồi trong 24h</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Purchase */}
          <div className="space-y-6">
            {/* Purchase Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg border p-6 sticky top-6"
            >
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-blue-600">
                  {insurance.price.toLocaleString("vi-VN")}đ
                </div>
                <div className="text-sm text-gray-600">mỗi người mỗi tuần</div>
              </div>

              <div className="space-y-4">
                {/* Travelers */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số người đi
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setTravelers(Math.max(1, travelers - 1))}
                      className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center font-medium">{travelers}</span>
                    <button
                      onClick={() => setTravelers(travelers + 1)}
                      className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Travel Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thời gian du lịch (ngày)
                  </label>
                  <select
                    value={travelDuration}
                    onChange={(e) => setTravelDuration(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={7}>7 ngày (1 tuần)</option>
                    <option value={14}>14 ngày (2 tuần)</option>
                    <option value={21}>21 ngày (3 tuần)</option>
                    <option value={30}>30 ngày (1 tháng)</option>
                  </select>
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
                    onClick={handlePurchase}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-semibold transition-colors"
                  >
                    Mua ngay
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Why Choose This Plan */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-green-50 border border-green-200 rounded-2xl p-6"
            >
              <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Tại sao chọn gói này?
              </h3>
              <ul className="text-sm text-green-700 space-y-2">
                <li>• Bảo hiểm y tế toàn diện</li>
                <li>• Bảo hiểm hành lý và hủy chuyến</li>
                <li>• Hỗ trợ khẩn cấp 24/7</li>
                <li>• Áp dụng toàn cầu</li>
                <li>• Quy trình bồi thường nhanh chóng</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}