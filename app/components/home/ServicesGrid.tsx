"use client";
import React from "react";
import { useRouter } from "next/navigation";
import {
  Hotel,
  Plane,
  Map,
  Car,
  Mountain,
  Utensils,
  Shield,
  Heart,
  Zap,
  Globe,
  ArrowRight,
} from "lucide-react";

export default function ModernServicesSection() {
  const router = useRouter();

  const mainServices = [
    {
      id: 1,
      name: "Tour Du Lịch",
      description: "Khám phá những tour du lịch đặc sắc khắp mọi miền",
      icon: Mountain,
      link: "/packages",
      color: "from-green-500 to-emerald-600",
      image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      features: ["Tour đa dạng", "Hướng dẫn viên", "Giá tốt nhất"]
    },
    {
      id: 2,
      name: "Khách Sạn",
      description: "Đặt phòng khách sạn với giá ưu đãi đặc biệt",
      icon: Hotel,
      link: "/hotels",
      color: "from-blue-500 to-cyan-600",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      features: ["Ưu đãi đặc biệt", "Đặt ngay - Nhận phòng", "Hủy miễn phí"]
    },
    {
      id: 3,
      name: "Vé Máy Bay",
      description: "Đặt vé máy bay giá rẻ đến mọi điểm đến",
      icon: Plane,
      link: "/flights",
      color: "from-purple-500 to-indigo-600",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      features: ["Giá tốt nhất", "Nhiều hãng bay", "Đổi linh hoạt"]
    },
    {
      id: 4,
      name: "Thuê Xe",
      description: "Dịch vụ thuê xe tự lái và có tài xế",
      icon: Car,
      link: "/car-rental",
      color: "from-orange-500 to-red-500",
      image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      features: ["Đa dạng loại xe", "Bảo hiểm đầy đủ", "Giao xe tận nơi"]
    }
  ];

  const quickServices = [
    { name: "Combo Tiết Kiệm", icon: Zap, description: "Tour + Khách sạn", link: "/combo" },
    { name: "Bảo Hiểm Du Lịch", icon: Heart, description: "An tâm suốt chuyến", link: "/insurance" },
    { name: "Visa Du Lịch", icon: Shield, description: "Xử lý nhanh chóng", link: "/visa" },
    { name: "Đưa Đón Sân Bay", icon: Car, description: "Dịch vụ 24/7", link: "/transfer" },
  ];

  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Dịch Vụ{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Toàn Diện
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Mọi thứ bạn cần cho một chuyến du lịch hoàn hảo - tất cả trong một nền tảng
          </p>
        </div>

        {/* Quick Services */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {quickServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 hover:border-blue-200"
                onClick={() => router.push(service.link)}
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-sm text-gray-500">{service.description}</p>
              </div>
            );
          })}
        </div>

        {/* Main Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {mainServices.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer"
                onClick={() => router.push(service.link)}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image Section */}
                  <div className="md:w-2/5 relative overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-48 md:h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${service.color} opacity-20`}></div>
                  </div>

                  {/* Content Section */}
                  <div className="md:w-3/5 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${service.color} rounded-full flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{service.name}</h3>
                    </div>

                    <p className="text-gray-600 mb-4">{service.description}</p>

                    <div className="space-y-2 mb-6">
                      {service.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <button className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors group">
                      <span>Khám phá ngay</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}