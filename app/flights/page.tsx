// app/flights/page.tsx
"use client";
import { useState, useEffect, Suspense, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Star,
  MapPin,
  Plane,
  Clock,
  Users,
  Calendar,
  SlidersHorizontal,
  Sparkles,
  X,
  ChevronDown,
  ChevronUp,
  ArrowRightLeft,
  User,
  CreditCard,
} from "lucide-react";

interface Flight {
  id: number;
  airline: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  originalPrice: number;
  discount: string;
  stops: string;
  aircraft: string;
  class: string;
  availableSeats: number;
  departureDate: string;
  features: string[];
  airlineLogo: string;
}

interface SearchFilters {
  from: string;
  to: string;
  departureDate: string;
  returnDate: string;
  passengers: string;
  class: string;
  priceRange: number[];
  stops: string;
  airlines: string[];
  mobileDrawer: boolean;
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Helper functions
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN").format(price);
};

// Flight Card Skeleton Component
const FlightCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden h-[280px] animate-pulse">
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="bg-gray-300 h-4 rounded w-32"></div>
          <div className="bg-gray-300 h-3 rounded w-24"></div>
        </div>
        <div className="bg-gray-300 h-6 rounded w-20"></div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-center">
          <div className="bg-gray-300 h-6 rounded w-16 mb-1"></div>
          <div className="bg-gray-300 h-3 rounded w-20"></div>
        </div>
        <div className="flex-1 px-4 text-center">
          <div className="bg-gray-300 h-3 rounded w-24 mx-auto mb-2"></div>
          <div className="w-full h-px bg-gray-300"></div>
        </div>
        <div className="text-center">
          <div className="bg-gray-300 h-6 rounded w-16 mb-1"></div>
          <div className="bg-gray-300 h-3 rounded w-20"></div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <div className="space-y-1">
          <div className="bg-gray-300 h-3 rounded w-20"></div>
          <div className="bg-gray-300 h-5 rounded w-24"></div>
        </div>
        <div className="bg-gray-300 h-8 rounded w-24"></div>
      </div>
    </div>
  </div>
);

// Booking Form Component
const BookingForm = ({ 
  flight, 
  onSuccess, 
  onCancel 
}: { 
  flight: Flight;
  onSuccess: (booking: any) => void;
  onCancel: () => void;
}) => {
  const [passengers, setPassengers] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const totalPrice = flight.price * passengers;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
     const res = await fetch('api/auth/me')

     if(!res.ok){
      throw new Error("Faild to check authentication")
     }
     const user = await res.json()
      const response = await fetch('/api/flights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          flightId: flight.id,
          userId: user.id,
          passengers: passengers,
          totalPrice: totalPrice
        }),
      });

      const data = await response.json();

      if (data.success) {
        onSuccess(data.data);
      } else {
        setError(data.message || 'Có lỗi xảy ra khi đặt vé');
      }
    } catch (error) {
      setError('Lỗi kết nối, vui lòng thử lại');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Xác nhận đặt vé</h2>
        
        {/* Flight Info */}
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold">{flight.airline}</h3>
              <p className="text-sm text-gray-600">{flight.flightNumber}</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-red-600">
                {formatPrice(flight.price)}đ
              </div>
              <div className="text-sm text-gray-600">{flight.class}</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="text-center">
              <div className="font-semibold">{flight.departureTime}</div>
              <div className="text-gray-600">{flight.departure}</div>
            </div>
            
            <div className="flex-1 px-4 text-center">
              <div className="text-gray-500">{flight.duration}</div>
              <div className="w-full h-px bg-gray-300 mt-1"></div>
            </div>
            
            <div className="text-center">
              <div className="font-semibold">{flight.arrivalTime}</div>
              <div className="text-gray-600">{flight.arrival}</div>
            </div>
          </div>
          
          <div className="text-center text-sm text-gray-500 mt-2">
            {flight.departureDate}
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số hành khách
            </label>
            <select
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'người' : 'người'}
                </option>
              ))}
            </select>
          </div>

          {/* Price Summary */}
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Giá vé x {passengers}:</span>
              <span>{formatPrice(flight.price * passengers)}đ</span>
            </div>
            <div className="flex justify-between font-semibold text-lg border-t border-blue-200 pt-2">
              <span>Tổng cộng:</span>
              <span className="text-red-600">
                {formatPrice(totalPrice)}đ
              </span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-200"
              disabled={isLoading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition duration-200 font-semibold flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  Xác nhận đặt vé
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Flight Card Component
const FlightCard = ({ flight, onBookFlight }: { flight: Flight; onBookFlight: (flight: Flight) => void }) => {
  const getStopsText = (stops: string) => {
    switch (stops) {
      case '0': return 'Bay thẳng';
      case '1': return '1 điểm dừng';
      case '2': return '2 điểm dừng';
      default: return `${stops} điểm dừng`;
    }
  };

  const getClassText = (cls: string) => {
    switch (cls) {
      case 'economy': return 'Phổ thông';
      case 'premium_economy': return 'Phổ thông đặc biệt';
      case 'business': return 'Thương gia';
      case 'first': return 'Hạng nhất';
      default: return cls;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <img
              src={flight.airlineLogo}
              alt={flight.airline}
              className="w-8 h-8 object-contain"
              onError={(e) => {
                e.currentTarget.src = '/airlines/default.png';
              }}
            />
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">
                {flight.airline}
              </h3>
              <p className="text-xs text-gray-600">
                {flight.flightNumber} • {getClassText(flight.class)}
              </p>
            </div>
          </div>
          <div className="text-right">
            {flight.originalPrice && flight.originalPrice > flight.price && (
              <div className="text-xs text-gray-500 line-through mb-1">
                {formatPrice(flight.originalPrice)}đ
              </div>
            )}
            <div className="font-bold text-green-600 text-lg">
              {formatPrice(flight.price)}đ
            </div>
            {flight.discount && (
              <div className="text-xs text-green-600 font-semibold">
                -{flight.discount}%
              </div>
            )}
          </div>
        </div>

        {/* Flight Route */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {flight.departureTime}
            </div>
            <div className="text-sm text-gray-600 mt-1">{flight.departure}</div>
            <div className="text-xs text-gray-500">{flight.departureDate}</div>
          </div>

          <div className="flex-1 px-4 text-center">
            <div className="text-sm text-gray-600 mb-2">{flight.duration}</div>
            <div className="relative">
              <div className="w-full h-px bg-gray-300"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Plane className="w-4 h-4 text-orange-500 bg-white px-1" />
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {getStopsText(flight.stops)}
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {flight.arrivalTime}
            </div>
            <div className="text-sm text-gray-600 mt-1">{flight.arrival}</div>
            <div className="text-xs text-gray-500">{flight.departureDate}</div>
          </div>
        </div>

        {/* Features and Action */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <div className="flex-1">
            <div className="text-xs text-gray-600 mb-1">
              Còn {flight.availableSeats} chỗ
            </div>
            <div className="flex flex-wrap gap-1">
              {flight.features.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                >
                  {feature}
                </span>
              ))}
              {flight.features.length > 3 && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  +{flight.features.length - 3} khác
                </span>
              )}
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onBookFlight(flight)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors shadow-md flex-shrink-0 ml-4"
          >
            Chọn chuyến
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Client component để xử lý search params
function FlightsContent() {
  const searchParams = useSearchParams();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);

  // Filter state - SỬA: Khởi tạo state với giá trị mặc định
  const [filters, setFilters] = useState<SearchFilters>({
    from: "",
    to: "",
    departureDate: "",
    returnDate: "",
    passengers: "1",
    class: "all",
    priceRange: [0, 10000000],
    stops: "all",
    airlines: [],
    mobileDrawer: false,
  });

  // Collapsible sections state
  const [openSections, setOpenSections] = useState({
    price: true,
    stops: true,
    airlines: true,
    class: true,
    mobileDrawer: false,
  });

  // Initialize filters from URL params - SỬA: Dùng useEffect để set filters từ URL
  useEffect(() => {
    const from = searchParams.get("from") || "";
    const to = searchParams.get("to") || "";
    const departureDate = searchParams.get("departureDate") || "";
    const returnDate = searchParams.get("returnDate") || "";
    const passengers = searchParams.get("passengers") || "1";
    const classType = searchParams.get("class") || "all";

    setFilters(prev => ({
      ...prev,
      from,
      to,
      departureDate,
      returnDate,
      passengers,
      class: classType,
    }));
  }, [searchParams]);

  // Debounce filters để tránh call API quá nhiều
  const debouncedFilters = useDebounce(filters, 500);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Tạo query params từ filters
  const queryParams = useMemo(() => {
    const params = new URLSearchParams();

    if (debouncedFilters.from) params.append("from", debouncedFilters.from);
    if (debouncedFilters.to) params.append("to", debouncedFilters.to);
    if (debouncedFilters.departureDate) params.append("departureDate", debouncedFilters.departureDate);
    if (debouncedFilters.returnDate) params.append("returnDate", debouncedFilters.returnDate);
    if (debouncedFilters.passengers) params.append("passengers", debouncedFilters.passengers);
    if (debouncedFilters.class && debouncedFilters.class !== "all") params.append("class", debouncedFilters.class);
    if (debouncedFilters.stops && debouncedFilters.stops !== "all") params.append("stops", debouncedFilters.stops);
    if (debouncedFilters.priceRange[1] !== 10000000) {
      params.append("maxPrice", debouncedFilters.priceRange[1].toString());
    }

    return params;
  }, [debouncedFilters]);

  // Fetch flights data
  useEffect(() => {
    fetchFlights();
  }, [queryParams.toString()]);

  const fetchFlights = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/flights?${queryParams}`);
      const result = await response.json();

      if (result.success) {
        setFlights(result.data);
      }
    } catch (error) {
      console.error("Error fetching flights:", error);
    } finally {
      setLoading(false);
    }
  };

  // Các hàm xử lý filter
  const handleFilterChange = useCallback(
    (key: keyof SearchFilters, value: any) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  const handleAirlineToggle = useCallback((airline: string) => {
    setFilters((prev) => ({
      ...prev,
      airlines: prev.airlines.includes(airline)
        ? prev.airlines.filter((a) => a !== airline)
        : [...prev.airlines, airline],
    }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({
      from: "",
      to: "",
      departureDate: "",
      returnDate: "",
      passengers: "1",
      class: "all",
      priceRange: [0, 10000000],
      stops: "all",
      airlines: [],
      mobileDrawer: false,
    });
    setSearchTerm("");
  }, []);

  const toggleSection = useCallback((section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, []);

  const swapLocations = useCallback(() => {
    setFilters(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from
    }));
  }, []);

  const handleBookFlight = useCallback((flight: Flight) => {
    setSelectedFlight(flight);
    setShowBookingForm(true);
  }, []);

  const handleBookingSuccess = useCallback((booking: any) => {
    setShowBookingForm(false);
    setSelectedFlight(null);
    setBookingSuccess(booking);
    // Refresh flights to update available seats
    fetchFlights();
  }, [fetchFlights]);

  const handleBookingCancel = useCallback(() => {
    setShowBookingForm(false);
    setSelectedFlight(null);
  }, []);

  // Filter flights client-side dựa trên search term
  const filteredFlights = useMemo(() => {
    if (!debouncedSearchTerm) return flights;

    return flights.filter(
      (flight) =>
        flight.airline.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        flight.flightNumber.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        flight.departure.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        flight.arrival.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [flights, debouncedSearchTerm]);

  const priceRanges = [
    { value: 2000000, label: "Dưới 2tr", display: "Dưới 2.000.000đ" },
    { value: 5000000, label: "Dưới 5tr", display: "Dưới 5.000.000đ" },
    { value: 10000000, label: "Dưới 10tr", display: "Dưới 10.000.000đ" },
    { value: 20000000, label: "Tất cả", display: "Tất cả" },
  ];

  const stopsOptions = [
    { value: "all", label: "Tất cả" },
    { value: "0", label: "Bay thẳng" },
    { value: "1", label: "1 điểm dừng" },
    { value: "2", label: "2 điểm dừng" },
  ];

  const classOptions = [
    { value: "all", label: "Tất cả hạng" },
    { value: "economy", label: "Phổ thông" },
    { value: "premium_economy", label: "Phổ thông đặc biệt" },
    { value: "business", label: "Thương gia" },
    { value: "first", label: "Hạng nhất" },
  ];

  const airlinesList = [
    { id: "vietnam-airlines", name: "Vietnam Airlines" },
    { id: "vietjet-air", name: "Vietjet Air" },
    { id: "bamboo-airways", name: "Bamboo Airways" },
    { id: "jetstar-pacific", name: "Jetstar Pacific" },
  ];

  // Filter Sidebar Component
  const FilterSidebar = useCallback(
    () => (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 h-fit sticky top-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
            <Filter className="w-5 h-5 text-orange-600" />
            Bộ lọc
          </h3>
          <button
            onClick={clearAllFilters}
            className="text-sm text-orange-600 hover:text-orange-700 font-medium"
          >
            Xóa tất cả
          </button>
        </div>

        {/* Price Range */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <button
            onClick={() => toggleSection("price")}
            className="flex items-center justify-between w-full mb-4"
          >
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-orange-600" />
              Khoảng giá
            </h4>
            {openSections.price ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>

          <AnimatePresence>
            {openSections.price && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 overflow-hidden"
              >
                <motion.input
                  type="range"
                  min={0}
                  max={20000000}
                  step={1000000}
                  value={filters.priceRange[1]}
                  onChange={(e) =>
                    handleFilterChange("priceRange", [
                      0,
                      parseInt(e.target.value),
                    ])
                  }
                  className="w-full accent-orange-500"
                />
                <div className="flex justify-between text-xs text-gray-600">
                  <span>0đ</span>
                  <span className="font-semibold text-orange-600">
                    {formatPrice(filters.priceRange[1])}đ
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {priceRanges.map((range) => (
                    <motion.button
                      key={range.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        handleFilterChange("priceRange", [0, range.value])
                      }
                      className={`px-2 py-1 rounded border text-xs font-medium transition-all ${
                        filters.priceRange[1] === range.value
                          ? "bg-orange-500 text-white border-orange-500"
                          : "bg-gray-50 text-gray-700 border-gray-300 hover:border-orange-300"
                      }`}
                    >
                      {range.label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Stops Filter */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <button
            onClick={() => toggleSection("stops")}
            className="flex items-center justify-between w-full mb-4"
          >
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Plane className="w-4 h-4 text-blue-600" />
              Điểm dừng
            </h4>
            {openSections.stops ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>

          <AnimatePresence>
            {openSections.stops && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 overflow-hidden"
              >
                {stopsOptions.map((stop) => (
                  <motion.button
                    key={stop.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleFilterChange("stops", stop.value)}
                    className={`flex items-center gap-2 w-full p-2 rounded-lg border text-sm font-medium transition-all ${
                      filters.stops === stop.value
                        ? "bg-blue-50 border-blue-500 text-blue-700"
                        : "bg-white border-gray-200 text-gray-700 hover:border-blue-300"
                    }`}
                  >
                    <span>{stop.label}</span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Class Filter */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <button
            onClick={() => toggleSection("class")}
            className="flex items-center justify-between w-full mb-4"
          >
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              Hạng vé
            </h4>
            {openSections.class ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>

          <AnimatePresence>
            {openSections.class && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 overflow-hidden"
              >
                {classOptions.map((classOption) => (
                  <motion.button
                    key={classOption.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleFilterChange("class", classOption.value)}
                    className={`flex items-center gap-2 w-full p-2 rounded-lg border text-sm font-medium transition-all ${
                      filters.class === classOption.value
                        ? "bg-purple-50 border-purple-500 text-purple-700"
                        : "bg-white border-gray-200 text-gray-700 hover:border-purple-300"
                    }`}
                  >
                    <span>{classOption.label}</span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Airlines */}
        <div className="pb-2">
          <button
            onClick={() => toggleSection("airlines")}
            className="flex items-center justify-between w-full mb-4"
          >
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-green-600" />
              Hãng bay
            </h4>
            {openSections.airlines ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>

          <AnimatePresence>
            {openSections.airlines && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 overflow-hidden"
              >
                {airlinesList.map((airline) => {
                  const isSelected = filters.airlines.includes(airline.id);
                  return (
                    <motion.button
                      key={airline.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAirlineToggle(airline.id)}
                      className={`flex items-center gap-2 w-full p-2 rounded-lg border text-sm font-medium transition-all ${
                        isSelected
                          ? "bg-green-50 border-green-500 text-green-700"
                          : "bg-white border-gray-200 text-gray-700 hover:border-green-300"
                      }`}
                    >
                      <span>{airline.name}</span>
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    ),
    [
      filters,
      openSections,
      clearAllFilters,
      handleFilterChange,
      handleAirlineToggle,
      toggleSection,
    ]
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Booking Success Notification */}
        <AnimatePresence>
          {bookingSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">🎉</div>
                <div>
                  <div className="font-semibold">Đặt vé thành công!</div>
                  <div className="text-sm">Mã đặt chỗ: {bookingSuccess.bookingCode}</div>
                </div>
                <button
                  onClick={() => setBookingSuccess(null)}
                  className="ml-4 text-white hover:text-gray-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Header */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Tìm kiếm chuyến bay
              </h1>
              {filters.from && filters.to && (
                <p className="text-gray-600">
                  Kết quả tìm kiếm cho:{" "}
                  <span className="font-semibold text-orange-600">
                    {filters.from} → {filters.to}
                  </span>
                </p>
              )}
            </div>

            {/* Search Bar - Desktop only */}
            <div className="hidden md:flex items-center gap-4 mt-4 lg:mt-0">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm chuyến bay..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Quick Search Form */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* From */}
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Điểm đi
                </label>
                <input
                  type="text"
                  value={filters.from}
                  onChange={(e) => handleFilterChange("from", e.target.value)}
                  placeholder="Thành phố hoặc sân bay..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                />
              </div>

              {/* Swap Button */}
              <div className="md:col-span-1 flex items-center justify-center">
                <button
                  type="button"
                  onClick={swapLocations}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-200 mt-6"
                  title="Đổi điểm đi và điểm đến"
                >
                  <ArrowRightLeft className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* To */}
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Điểm đến
                </label>
                <input
                  type="text"
                  value={filters.to}
                  onChange={(e) => handleFilterChange("to", e.target.value)}
                  placeholder="Thành phố hoặc sân bay..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                />
              </div>

              {/* Departure Date */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày đi
                </label>
                <input
                  type="date"
                  value={filters.departureDate}
                  onChange={(e) => handleFilterChange("departureDate", e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                />
              </div>

              {/* Passengers */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hành khách
                </label>
                <select
                  value={filters.passengers}
                  onChange={(e) => handleFilterChange("passengers", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'người' : 'người'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Button */}
              <div className="md:col-span-1 flex items-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={fetchFlights}
                  className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                >
                  Tìm
                </motion.button>
              </div>
            </div>
          </div>

          {/* Search Summary */}
          {(filters.from || filters.to) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3"
            >
              {filters.from && (
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <div className="text-xs text-gray-600">Điểm đi</div>
                  <div className="font-semibold text-blue-700 text-sm">
                    {filters.from}
                  </div>
                </div>
              )}
              {filters.to && (
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <div className="text-xs text-gray-600">Điểm đến</div>
                  <div className="font-semibold text-green-700 text-sm">
                    {filters.to}
                  </div>
                </div>
              )}
              {filters.departureDate && (
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                  <div className="text-xs text-gray-600">Ngày đi</div>
                  <div className="font-semibold text-orange-700 text-sm">
                    {filters.departureDate}
                  </div>
                </div>
              )}
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <div className="text-xs text-gray-600">Hành khách</div>
                <div className="font-semibold text-purple-700 text-sm">
                  {filters.passengers} người
                </div>
              </div>
            </motion.div>
          )}

          {/* Mobile Search Bar */}
          <div className="md:hidden mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm chuyến bay..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters - Hidden on mobile by default, show with drawer */}
          <div className="hidden lg:block lg:w-1/4">
            <FilterSidebar />
          </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() =>
                setOpenSections((prev) => ({
                  ...prev,
                  mobileDrawer: !prev.mobileDrawer,
                }))
              }
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Hiển thị bộ lọc
            </motion.button>
          </div>

          {/* Mobile Filter Drawer */}
          <AnimatePresence>
            {openSections.mobileDrawer && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden mb-6 overflow-hidden"
              >
                <FilterSidebar />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Section */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-lg font-semibold text-gray-900 mb-2 sm:mb-0"
              >
                {loading
                  ? "Đang tìm chuyến bay..."
                  : `${filteredFlights.length} chuyến bay được tìm thấy`}
              </motion.h2>

              {!loading && filteredFlights.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm text-gray-600"
                >
                  Sắp xếp theo:
                  <select className="ml-2 border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-orange-500 text-sm">
                    <option>Giá thấp đến cao</option>
                    <option>Giá cao đến thấp</option>
                    <option>Thời gian bay ngắn nhất</option>
                    <option>Khởi hành sớm nhất</option>
                  </select>
                </motion.div>
              )}
            </div>

            {/* Flights Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {loading ? (
                // Loading state với skeleton cards
                <>
                  {[...Array(4)].map((_, i) => (
                    <FlightCardSkeleton key={i} />
                  ))}
                </>
              ) : filteredFlights.length > 0 ? (
                // Actual flight cards
                filteredFlights.map((flight, index) => (
                  <FlightCard 
                    key={flight.id} 
                    flight={flight} 
                    onBookFlight={handleBookFlight}
                  />
                ))
              ) : (
                // Empty state
                <div className="col-span-full">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 bg-white rounded-xl shadow-md"
                  >
                    <div className="text-5xl mb-3">✈️</div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">
                      Không tìm thấy chuyến bay phù hợp
                    </h3>
                    <p className="text-gray-600 mb-4 max-w-md mx-auto text-sm">
                      Hãy thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={clearAllFilters}
                      className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-orange-600 shadow-md"
                    >
                      Xóa bộ lọc
                    </motion.button>
                  </motion.div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Booking Form Modal */}
        <AnimatePresence>
          {showBookingForm && selectedFlight && (
            <BookingForm
              flight={selectedFlight}
              onSuccess={handleBookingSuccess}
              onCancel={handleBookingCancel}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Main page component với Suspense
export default function FlightsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <FlightCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <FlightsContent />
    </Suspense>
  );
}