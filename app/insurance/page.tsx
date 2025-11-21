"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Users, 
  Globe,
  Search,
  Filter
} from "lucide-react";
import Link from "next/link";

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
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCoverage, setSelectedCoverage] = useState("all");

  useEffect(() => {
    fetchInsurances();
  }, []);

  const fetchInsurances = async () => {
    try {
      const response = await fetch("/api/insurance");
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

  const types = ["all", ...new Set(insurances.map(i => i.type))];
  const coverages = ["all", "Cơ bản", "Nâng cao", "Toàn diện"];

  const filteredInsurances = insurances.filter(insurance => {
    const matchesSearch = insurance.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         insurance.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || insurance.type === selectedType;
    const matchesCoverage = selectedCoverage === "all" || 
                           insurance.coverage.toLowerCase().includes(selectedCoverage.toLowerCase());
    
    return matchesSearch && matchesType && matchesCoverage;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Shield className="w-4 h-4" />
            Bảo vệ chuyến đi của bạn
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bảo hiểm Du lịch
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            An tâm khám phá thế giới với các gói bảo hiểm du lịch toàn diện, 
            bảo vệ bạn trong mọi tình huống
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <div className="text-2xl font-bold text-blue-600 mb-2">{insurances.length}+</div>
            <div className="text-sm text-gray-600">Gói bảo hiểm</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <div className="text-2xl font-bold text-green-600 mb-2">24/7</div>
            <div className="text-sm text-gray-600">Hỗ trợ khẩn cấp</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <div className="text-2xl font-bold text-purple-600 mb-2">50+</div>
            <div className="text-sm text-gray-600">Quốc gia áp dụng</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <div className="text-2xl font-bold text-orange-600 mb-2">99%</div>
            <div className="text-sm text-gray-600">Hài lòng</div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm bảo hiểm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả loại</option>
              {types.filter(type => type !== "all").map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            {/* Coverage Filter */}
            <select
              value={selectedCoverage}
              onChange={(e) => setSelectedCoverage(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả phạm vi</option>
              {coverages.filter(coverage => coverage !== "all").map(coverage => (
                <option key={coverage} value={coverage}>{coverage}</option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Insurance Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredInsurances.map((insurance, index) => (
            <motion.div
              key={insurance.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              <Link href={`/insurance/${insurance.id}`}>
                <div className="cursor-pointer">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={insurance.image}
                      alt={insurance.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {insurance.type}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <div className="p-6">
                    <h3 className="font-semibold text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {insurance.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {insurance.subtitle}
                    </p>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        {insurance.duration}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        Độ tuổi tối đa: {insurance.maxAge}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Globe className="h-4 w-4 mr-2" />
                        {insurance.destinations?.length || 0} điểm đến
                      </div>
                    </div>

                    {/* Features Preview */}
                    <div className="mb-4">
                      <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Bao gồm:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {insurance.features?.slice(0, 3).map((feature, idx) => (
                          <span
                            key={idx}
                            className="inline-block bg-green-50 text-green-700 text-xs px-2 py-1 rounded"
                          >
                            {feature.feature}
                          </span>
                        ))}
                        {insurance.features?.length > 3 && (
                          <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                            +{insurance.features.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">
                          {insurance.preExistingConditions ? "Có bệnh nền" : "Không bệnh nền"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm font-medium">{insurance.rating}</span>
                        <span className="text-sm text-gray-500">({insurance.reviewCount})</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">
                          {insurance.price.toLocaleString("vi-VN")}đ
                        </div>
                        <div className="text-sm text-gray-500">/người</div>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = `/insurance/${insurance.id}`;
                        }}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Chọn gói
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {filteredInsurances.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Filter className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Không tìm thấy bảo hiểm phù hợp
            </h3>
            <p className="text-gray-600">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
          </motion.div>
        )}

        {/* Why Choose Us */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 bg-blue-600 rounded-2xl p-8 text-white"
        >
          <h2 className="text-2xl font-bold text-center mb-8">Tại sao chọn bảo hiểm của chúng tôi?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="font-semibold mb-2">Bảo vệ toàn diện</h3>
              <p className="text-blue-100 text-sm">
                Bảo hiểm y tế, hành lý, hủy chuyến và các rủi ro khác
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="font-semibold mb-2">Hỗ trợ 24/7</h3>
              <p className="text-blue-100 text-sm">
                Đội ngũ hỗ trợ khẩn cấp luôn sẵn sàng giúp đỡ bạn
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8" />
              </div>
              <h3 className="font-semibold mb-2">Toàn cầu</h3>
              <p className="text-blue-100 text-sm">
                Áp dụng tại hơn 50 quốc gia trên toàn thế giới
              </p>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}