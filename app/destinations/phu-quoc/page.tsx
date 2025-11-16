"use client";
import { useState, useEffect } from "react";
import {
  MotionDiv,
  MotionH2,
  MotionH3,
  MotionP,
  MotionButton,
} from "../../components/common/MotionWrapper";
import { useApi } from "../../hooks/useApi";

interface DestinationDetail {
  id: number;
  name: string;
  slug: string;
  country: string;
  province: string;
  description: string;
  heroImage: string;
  rating: number;
  reviewCount: number;
  bestTime: string;
  weather: {
    temperature: string;
    condition: string;
    humidity: string;
    rainfall: string;
  };
  transportation: {
    flight: string;
    ferry: string;
    car: string;
  };
  highlights: Array<{
    name: string;
    description: string;
    image: string;
    rating: number;
  }>;
  activities: Array<{
    name: string;
    icon: string;
    description: string;
  }>;
  hotels: Array<{
    name: string;
    image: string;
    rating: number;
    price: string;
    location: string;
    features: string[];
  }>;
  restaurants: Array<{
    name: string;
    cuisine: string;
    price: string;
    rating: number;
    image: string;
    specialties: string[];
  }>;
  tips: string[];
}

export default function PhuQuocDetailPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedImage, setSelectedImage] = useState(0);

  const tabs = [
    { id: "overview", label: "Tổng quan", icon: "📖" },
    { id: "highlights", label: "Điểm nổi bật", icon: "⭐" },
    { id: "activities", label: "Hoạt động", icon: "🎯" },
    { id: "hotels", label: "Khách sạn", icon: "🏨" },
    { id: "food", label: "Ẩm thực", icon: "🍽️" },
    { id: "tips", label: "Mẹo du lịch", icon: "💡" },
  ];

  // Use API hook
  const {
    data: phuQuocData,
    loading,
    error,
  } = useApi<DestinationDetail>("/api/destinations/phu-quoc");

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin điểm đến...</p>
        </div>
      </div>
    );
  }

  if (error || !phuQuocData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Có lỗi xảy ra
          </h2>
          <p className="text-gray-600 mb-4">
            {error || "Không thể tải thông tin điểm đến"}
          </p>
        </div>
      </div>
    );
  }

  const imageGallery = [
    phuQuocData.heroImage,
    phuQuocData.highlights[0].image,
    phuQuocData.highlights[1].image,
    phuQuocData.highlights[2].image,
    phuQuocData.highlights[3].image,
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative h-screen">
        <div className="absolute inset-0">
          <img
            src={phuQuocData.heroImage}
            alt={phuQuocData.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-gray-900">
            <h1 className="text-6xl lg:text-8xl font-bold mb-6">
              {phuQuocData.name}
            </h1>
            <MotionP
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl lg:text-2xl text-blue-100 max-w-4xl mx-auto mb-8"
            >
              {phuQuocData.description}
            </MotionP>

            <MotionDiv
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex items-center justify-center space-x-6 mb-8"
            >
              <div className="flex items-center space-x-2">
                <span className="text-yellow-400 text-2xl">⭐</span>
                <span className="text-xl font-bold">{phuQuocData.rating}</span>
                <span className="text-blue-100">
                  ({phuQuocData.reviewCount.toLocaleString()})
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-300">📍</span>
                <span className="text-xl">
                  {phuQuocData.province}, {phuQuocData.country}
                </span>
              </div>
            </MotionDiv>

            <MotionButton
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
            >
              🚀 Khám phá ngay
            </MotionButton>
          </div>
        </div>

        {/* Scroll Indicator */}
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </MotionDiv>
      </section>

      {/* Quick Info Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: "🌡️",
                label: "Thời tiết",
                value: phuQuocData.weather.temperature,
              },
              {
                icon: "📅",
                label: "Thời gian tốt nhất",
                value: phuQuocData.bestTime,
              },
              {
                icon: "✈️",
                label: "Thời gian bay",
                value: phuQuocData.transportation.flight,
              },
              {
                icon: "💰",
                label: "Chi phí trung bình",
                value: "2-5 triệu/người",
              },
            ].map((item, index) => (
              <MotionDiv
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-100"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <div className="text-sm text-gray-600 mb-2">{item.label}</div>
                <div className="font-bold text-gray-900">{item.value}</div>
              </MotionDiv>
            ))}
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <MotionH2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-gray-900 mb-12 text-center"
          >
            Khám phá vẻ đẹp {phuQuocData.name}
          </MotionH2>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {imageGallery.map((image, index) => (
              <MotionDiv
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative overflow-hidden rounded-2xl cursor-pointer transform hover:scale-105 transition-all duration-300 ${
                  index === 0 ? "lg:col-span-2 lg:row-span-2" : ""
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <img
                  src={image}
                  alt={`${phuQuocData.name} ${index + 1}`}
                  className={`w-full h-full object-cover ${
                    index === 0 ? "h-96 lg:h-full" : "h-48"
                  }`}
                />
                <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-all duration-300"></div>
              </MotionDiv>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="py-8 bg-white border-b border-gray-200 sticky top-20 z-30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center space-x-2">
            {tabs.map((tab) => (
              <MotionButton
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-gray-900 shadow-lg"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </MotionButton>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <MotionH2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Tổng quan về {phuQuocData.name}
              </MotionH2>

              <div className="prose prose-lg max-w-none">
                <MotionP className="text-lg text-gray-900 leading-relaxed mb-8">
                  {phuQuocData.description}
                </MotionP>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Thông tin cơ bản
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-center space-x-3">
                        <span className="text-blue-500">📍</span>
                        <span>
                          <strong>Vị trí:</strong> {phuQuocData.province},{" "}
                          {phuQuocData.country}
                        </span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <span className="text-blue-500">🌡️</span>
                        <span>
                          <strong>Thời tiết:</strong>{" "}
                          {phuQuocData.weather.condition}
                        </span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <span className="text-blue-500">📅</span>
                        <span>
                          <strong>Thời gian tốt nhất:</strong>{" "}
                          {phuQuocData.bestTime}
                        </span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <span className="text-blue-500">✈️</span>
                        <span>
                          <strong>Thời gian bay:</strong>{" "}
                          {phuQuocData.transportation.flight}
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Đặc điểm nổi bật
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-center space-x-3">
                        <span className="text-green-500">✓</span>
                        <span>Bãi biển đẹp nhất Việt Nam</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <span className="text-green-500">✓</span>
                        <span>Khí hậu nhiệt đới dễ chịu</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <span className="text-green-500">✓</span>
                        <span>Ẩm thực hải sản phong phú</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <span className="text-green-500">✓</span>
                        <span>Văn hóa địa phương độc đáo</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </MotionDiv>
          )}

          {/* Highlights Tab */}
          {activeTab === "highlights" && (
            <div>
              <MotionH2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                Điểm nổi bật tại {phuQuocData.name}
              </MotionH2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {phuQuocData.highlights.map((highlight, index) => (
                  <MotionDiv
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                  >
                    <div className="relative h-64">
                      <img
                        src={highlight.image}
                        alt={highlight.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-400">⭐</span>
                          <span className="font-bold text-gray-900">
                            {highlight.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {highlight.name}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {highlight.description}
                      </p>
                    </div>
                  </MotionDiv>
                ))}
              </div>
            </div>
          )}

          {/* Activities Tab */}
          {activeTab === "activities" && (
            <div>
              <MotionH2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                Hoạt động tại {phuQuocData.name}
              </MotionH2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {phuQuocData.activities.map((activity, index) => (
                  <MotionDiv
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200"
                  >
                    <div className="text-4xl mb-4">{activity.icon}</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      {activity.name}
                    </h3>
                    <p className="text-gray-600">{activity.description}</p>
                  </MotionDiv>
                ))}
              </div>
            </div>
          )}

          {/* Hotels Tab */}
          {activeTab === "hotels" && (
            <div>
              <MotionH2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                Khách sạn tại {phuQuocData.name}
              </MotionH2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {phuQuocData.hotels.map((hotel, index) => (
                  <MotionDiv
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                  >
                    <div className="relative h-48">
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-400">⭐</span>
                          <span className="font-bold text-gray-900">
                            {hotel.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {hotel.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {hotel.location}
                      </p>
                      <div className="text-2xl font-bold text-blue-600 mb-4">
                        {hotel.price}
                      </div>
                      <div className="space-y-2">
                        {hotel.features.map((feature, idx) => (
                          <div
                            key={idx}
                            className="flex items-center space-x-2 text-sm text-gray-600"
                          >
                            <span className="text-green-500">✓</span>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </MotionDiv>
                ))}
              </div>
            </div>
          )}

          {/* Food Tab */}
          {activeTab === "food" && (
            <div>
              <MotionH2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                Ẩm thực tại {phuQuocData.name}
              </MotionH2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {phuQuocData.restaurants.map((restaurant, index) => (
                  <MotionDiv
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                  >
                    <div className="relative h-48">
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-400">⭐</span>
                          <span className="font-bold text-gray-900">
                            {restaurant.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {restaurant.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {restaurant.cuisine}
                      </p>
                      <p className="text-blue-600 font-semibold mb-3">
                        {restaurant.price}
                      </p>
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-900">
                          Món đặc trưng:
                        </div>
                        {restaurant.specialties.map((specialty, idx) => (
                          <div
                            key={idx}
                            className="flex items-center space-x-2 text-sm text-gray-600"
                          >
                            <span className="text-orange-500">🍽️</span>
                            <span>{specialty}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </MotionDiv>
                ))}
              </div>
            </div>
          )}

          {/* Tips Tab */}
          {activeTab === "tips" && (
            <div>
              <MotionH2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                Mẹo du lịch {phuQuocData.name}
              </MotionH2>

              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {phuQuocData.tips.map((tip, index) => (
                    <MotionDiv
                      key={index}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">💡</div>
                        <p className="text-gray-900">{tip}</p>
                      </div>
                    </MotionDiv>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-gray-900">
        <div className="container mx-auto px-4 text-center">
          <MotionH2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold mb-6"
          >
            Sẵn sàng khám phá {phuQuocData.name}?
          </MotionH2>
          <MotionP
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto"
          >
            Đặt ngay chuyến du lịch đến đảo ngọc {phuQuocData.name} và tận hưởng
            những trải nghiệm tuyệt vời
          </MotionP>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <MotionButton
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
            >
              🏨 Đặt khách sạn
            </MotionButton>
            <MotionButton
              className="border-2 border-white text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
            >
              ✈️ Đặt vé máy bay
            </MotionButton>
          </div>
        </div>
      </section>
    </div>
  );
}
