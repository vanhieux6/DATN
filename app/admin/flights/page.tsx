// app/admin/flights/page.tsx
"use client";
import { useState, useEffect } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import {
  MotionDiv,
  MotionH2,
  MotionButton,
} from "../../components/common/MotionWrapper";
import FlightModal from "@/app/flights/FlightModal";
import Link from "next/link";

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
  returnDate?: string;
  createdAt: string;
  features?: { id: number; name: string }[];
  bookingCount?: number; // Thêm trường mới để lưu số lượng booking
}

export default function FlightsPage() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null);
  const [selectedAirline, setSelectedAirline] = useState("");

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/flights");
      if (response.ok) {
        const data = await response.json();
        const flightsWithBookings = await Promise.all(
          (data.flights || []).map(async (flight: Flight) => {
            try {
              // Fetch số lượng booking cho mỗi chuyến bay
              const bookingsResponse = await fetch(
                `/api/admin/flights/${flight.id}/bookings/stats`
              );
              if (bookingsResponse.ok) {
                const bookingsData = await bookingsResponse.json();
                return {
                  ...flight,
                  bookingCount: bookingsData.totalBookings || 0,
                };
              }
            } catch (error) {
              console.error(
                `Failed to fetch bookings for flight ${flight.id}:`,
                error
              );
            }
            return {
              ...flight,
              bookingCount: 0,
            };
          })
        );
        setFlights(flightsWithBookings);
      } else {
        console.error("Failed to fetch flights:", response.statusText);
        setFlights([]);
      }
    } catch (error) {
      console.error("Failed to fetch flights:", error);
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa chuyến bay này?")) {
      try {
        const response = await fetch(`/api/admin/flights/${id}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setFlights(flights.filter((f) => f.id !== id));
          alert("Xóa chuyến bay thành công!");
        } else {
          alert(data.message || "Không thể xóa chuyến bay");
        }
      } catch (error) {
        console.error("Failed to delete flight:", error);
        alert("Lỗi khi xóa chuyến bay");
      }
    }
  };

  const handleEdit = (flight: Flight) => {
    const transformedFlight = {
      ...flight,
      features: flight.features?.map((f) => f.name) || [],
    };
    setEditingFlight(transformedFlight as any);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingFlight(null);
  };

  const handleSuccess = () => {
    fetchFlights();
    handleCloseModal();
  };

  const handleAddNew = () => {
    setEditingFlight(null);
    setShowModal(true);
  };

  const filteredFlights = flights.filter((flight) => {
    const matchesSearch =
      flight.airline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.departure.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.arrival.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAirline =
      !selectedAirline || flight.airline === selectedAirline;

    return matchesSearch && matchesAirline;
  });

  // Lấy danh sách hãng bay unique
  const uniqueAirlines = Array.from(
    new Set(flights.map((f) => f.airline))
  ).sort();

  // Tính tổng số booking
  const totalBookings = flights.reduce(
    (sum, flight) => sum + (flight.bookingCount || 0),
    0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <MotionH2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-gray-900"
          >
            Quản lý Chuyến bay
          </MotionH2>
          <p className="text-gray-600">
            Quản lý tất cả chuyến bay trong hệ thống ({flights.length} chuyến
            bay)
          </p>
        </div>
        <MotionButton
          onClick={handleAddNew}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <PlusIcon className="h-5 w-5" />
          <span>Thêm chuyến bay</span>
        </MotionButton>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm chuyến bay (hãng bay, mã chuyến, điểm đi/đến)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={selectedAirline}
            onChange={(e) => setSelectedAirline(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="">Tất cả hãng bay</option>
            {uniqueAirlines.map((airline) => (
              <option key={airline} value={airline}>
                {airline}
              </option>
            ))}
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm text-blue-600 font-medium">
              Tổng chuyến bay
            </div>
            <div className="text-2xl font-bold text-blue-900">
              {flights.length}
            </div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-sm text-green-600 font-medium">
              Kết quả lọc
            </div>
            <div className="text-2xl font-bold text-green-900">
              {filteredFlights.length}
            </div>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg">
            <div className="text-sm text-orange-600 font-medium">Tổng ghế</div>
            <div className="text-2xl font-bold text-orange-900">
              {flights.reduce((sum, f) => sum + f.availableSeats, 0)}
            </div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="text-sm text-purple-600 font-medium">Hãng bay</div>
            <div className="text-2xl font-bold text-purple-900">
              {uniqueAirlines.length}
            </div>
          </div>
          <div className="bg-pink-50 p-3 rounded-lg">
            <div className="text-sm text-pink-600 font-medium">
              Tổng booking
            </div>
            <div className="text-2xl font-bold text-pink-900">
              {totalBookings}
            </div>
          </div>
        </div>
      </div>

      {/* Flights Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chuyến bay
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành trình
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thông tin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bookings
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFlights.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    <div className="text-gray-400">
                      <PaperAirplaneIcon className="h-12 w-12 mx-auto mb-2" />
                      <p className="text-sm">
                        {searchTerm || selectedAirline
                          ? "Không tìm thấy chuyến bay phù hợp"
                          : "Chưa có chuyến bay nào"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredFlights.map((flight) => (
                  <tr key={flight.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <PaperAirplaneIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {flight.airline}
                          </div>
                          <div className="text-sm text-gray-500">
                            {flight.flightNumber}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {flight.departure}
                        </div>
                        <div className="text-gray-500">↓</div>
                        <div className="font-medium text-gray-900">
                          {flight.arrival}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="font-medium">
                          {flight.departureDate}
                        </div>
                        <div>
                          {flight.departureTime} - {flight.arrivalTime}
                        </div>
                        <div className="text-gray-500">{flight.duration}</div>
                        <div className="text-xs text-blue-600">
                          {flight.stops === "0"
                            ? "Bay thẳng"
                            : `${flight.stops} điểm dừng`}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <span className="line-through text-gray-500 mr-2">
                          {flight.originalPrice.toLocaleString("vi-VN")}đ
                        </span>
                        <div className="font-semibold text-red-600">
                          {flight.price.toLocaleString("vi-VN")}đ
                        </div>
                      </div>
                      <div className="text-xs text-green-600 font-medium">
                        Giảm {flight.discount}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="text-gray-900">
                          <span className="font-medium">
                            {flight.availableSeats}
                          </span>{" "}
                          ghế trống
                        </div>
                        <div className="text-xs text-gray-500">
                          {flight.aircraft}
                        </div>
                        <div className="text-xs">
                          <span className="inline-flex px-2 py-1 text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                            {flight.class}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserGroupIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm">
                          <div className="font-semibold text-gray-900">
                            {flight.bookingCount || 0}
                          </div>
                          <div className="text-xs text-gray-500">bookings</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/admin/flights/${flight.id}/bookings`}
                          className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                          title="Xem chi tiết bookings"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleEdit(flight)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded"
                          title="Chỉnh sửa"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(flight.id)}
                          className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                          title="Xóa"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <FlightModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        flight={editingFlight as any}
      />
    </div>
  );
}
