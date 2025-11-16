"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiHome,
  FiAirplay,
  FiMap,
  FiUser,
  FiCalendar,
  FiSearch,
  FiMapPin,
} from "react-icons/fi";

const TABS = [
  { key: "hotel", label: "Khách sạn", icon: <FiHome /> },
  { key: "flight", label: "Vé máy bay", icon: <FiAirplay /> },
  { key: "tour", label: "Tour", icon: <FiMap /> },
];

export default function Banner() {
  const router = useRouter();
  const [tab, setTab] = useState("hotel");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(1);

  const handleSearch = () => {
    // Validate input
    if (!from.trim()) {
      alert("Vui lòng nhập điểm đến");
      return;
    }

    // Tạo search params dựa trên tab
    const searchParams = new URLSearchParams();

    if (tab === "flight") {
      searchParams.append("type", "flight");
      searchParams.append("departure", from);
      if (to) searchParams.append("arrival", to);
    } else if (tab === "hotel") {
      searchParams.append("type", "hotel");
      searchParams.append("destination", from);
    } else if (tab === "tour") {
      searchParams.append("type", "tour");
      searchParams.append("destination", from);
    }

    if (date) searchParams.append("date", date);
    searchParams.append("guests", guests.toString());

    // Redirect đến search page
    router.push(`/search?${searchParams.toString()}`);
  };

  const getPlaceholder = () => {
    switch (tab) {
      case "flight":
        return "Điểm khởi hành (VD: Hà Nội)";
      case "hotel":
        return "Thành phố, khách sạn hoặc điểm đến";
      case "tour":
        return "Điểm đến tour (VD: Đà Nẵng, Nha Trang)";
      default:
        return "Nhập điểm đến...";
    }
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <section className="relative h-[420px] md:h-[520px] flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-400 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-800 to-blue-600">
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 to-blue-700/20"></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg text-center animate-fade-in">
          Đặt phòng khách sạn, vé máy bay, tour du lịch giá tốt
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-8 drop-shadow text-center animate-fade-in">
          Trải nghiệm du lịch dễ dàng, tiện lợi và an toàn
        </p>

        {/* Tabs */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-white/90 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md border border-white/20">
            {TABS.map((t) => (
              <button
                key={t.key}
                className={`flex items-center gap-2 px-8 py-4 font-semibold text-base transition-all duration-300
                  ${
                    tab === t.key
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-inner"
                      : "text-blue-700 hover:bg-blue-50/80"
                  }`}
                onClick={() => setTab(t.key)}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search form */}
        <div className="bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 flex flex-col md:flex-row gap-4 items-center max-w-4xl mx-auto animate-fade-in">
          
          {/* Điểm đi/Điểm đến */}
          <div className="flex-1 w-full">
            <div className="flex items-center gap-3">
              <FiMapPin className="text-blue-500 text-lg flex-shrink-0" />
              <input
                type="text"
                className="w-full px-3 py-3 rounded-lg outline-none text-gray-900 bg-white/80 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all placeholder:text-gray-500"
                placeholder={getPlaceholder()}
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>
          </div>

          {/* Điểm đến (chỉ hiển thị với vé máy bay) */}
          {tab === "flight" && (
            <div className="flex-1 w-full">
              <div className="flex items-center gap-3">
                <FiMapPin className="text-blue-500 text-lg flex-shrink-0" />
                <input
                  type="text"
                  className="w-full px-3 py-3 rounded-lg outline-none text-gray-900 bg-white/80 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all placeholder:text-gray-500"
                  placeholder="Điểm đến (VD: TP HCM)"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Ngày */}
          <div className="flex-1 w-full">
            <div className="flex items-center gap-3">
              <FiCalendar className="text-blue-500 text-lg flex-shrink-0" />
              <input
                type="date"
                min={getTodayDate()}
                className="w-full px-3 py-3 rounded-lg outline-none text-gray-900 bg-white/80 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          {/* Số khách */}
          <div className="flex-1 w-full">
            <div className="flex items-center gap-3">
              <FiUser className="text-blue-500 text-lg flex-shrink-0" />
              <select
                className="w-full px-3 py-3 rounded-lg outline-none text-gray-900 bg-white/80 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'người' : 'người'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Nút tìm kiếm */}
          <button
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 min-w-[140px] justify-center"
            onClick={handleSearch}
          >
            <FiSearch className="text-lg" />
            Tìm kiếm
          </button>
        </div>

        {/* Quick Suggestions */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {['Hà Nội', 'TP HCM', 'Đà Nẵng', 'Nha Trang', 'Phú Quốc', 'Hạ Long'].map((city) => (
            <button
              key={city}
              onClick={() => setFrom(city)}
              className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-all border border-white/30"
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        .animate-fade-in {
          animation: fadeIn 1s ease;
        }
      `}</style>
    </section>
  );
}