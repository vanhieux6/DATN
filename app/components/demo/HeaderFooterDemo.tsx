"use client";
import Header from "../common/Header";
import Footer from "../common/Footer";
import SearchBar from "../common/SearchBar";
import Promotions from "../home/Promotion";
import Destinations from "../home/DestinationSection";

export default function HeaderFooterDemo() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content with spacing for fixed header */}
      <main className="pt-20 lg:pt-24">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-gray-900 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Khám phá thế giới cùng Traveloka
            </h1>
            <p className="text-xl lg:text-2xl mb-8 opacity-90">
              Đặt vé máy bay, khách sạn và gói du lịch với giá tốt nhất
            </p>
          </div>
        </div>

        {/* Search Bar Section */}
        <div className="container mx-auto px-4 -mt-10 relative z-10">
          <SearchBar />
        </div>

        {/* Promotions Section */}
        <Promotions />

        {/* Destinations Section */}
        <Destinations />

        {/* Content Sections */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Cards */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🏨</div>
              <h3 className="text-xl font-bold mb-2">Khách sạn chất lượng</h3>
              <p className="text-gray-600">
                Hơn 1 triệu khách sạn trên toàn thế giới với giá tốt nhất
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">✈️</div>
              <h3 className="text-xl font-bold mb-2">Vé máy bay giá rẻ</h3>
              <p className="text-gray-600">
                So sánh giá từ hơn 600 hãng bay và đặt vé với giá tốt nhất
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🎒</div>
              <h3 className="text-xl font-bold mb-2">Gói du lịch trọn gói</h3>
              <p className="text-gray-600">
                Khám phá các điểm đến mới với gói du lịch tiết kiệm
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-red-600 mb-2">50M+</div>
                <div className="text-gray-600">Khách hàng</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-600 mb-2">200+</div>
                <div className="text-gray-600">Quốc gia</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-600 mb-2">1M+</div>
                <div className="text-gray-600">Khách sạn</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-600 mb-2">24/7</div>
                <div className="text-gray-600">Hỗ trợ</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
