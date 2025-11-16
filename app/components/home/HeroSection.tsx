"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  MapPin,
  Users,
  Plane,
  Hotel,
  Bus,
  Car,
  Mountain,
  Grid3X3,
  ArrowLeftRight,
  Plus,
  Minus,
  Search,
  Bell,
  Sparkles,
  Home,
  Building2,
  Bed,
} from "lucide-react";

export default function TravelokaBanner() {
  const router = useRouter();
  const [activeMainTab, setActiveMainTab] = useState("Hotels");
  const [activeSubTab, setActiveSubTab] = useState("Hotels");
  const [checkInDate, setCheckInDate] = useState("2025-08-17");
  const [checkOutDate, setCheckOutDate] = useState("2025-08-18");
  const [guests, setGuests] = useState("2 Adult(s), 0 Child, 1 Room");
  const [destination, setDestination] = useState("");
  const [showGuestPicker, setShowGuestPicker] = useState(false);
  const [guestCount, setGuestCount] = useState({
    adults: 2,
    children: 0,
    rooms: 1,
  });

  const mainTabs = [
    { id: "Hotels", label: "Hotels", icon: Hotel, path: "/hotels" },
    { id: "Flights", label: "Flights", icon: Plane, path: "/flights" },
    { id: "Bus & Shuttle", label: "Bus & Shuttle", icon: Bus, path: "/bus" },
    {
      id: "Airport Transfer",
      label: "Airport Transfer",
      icon: Car,
      path: "/transfer",
    },
    { id: "Car Rental", label: "Car Rental", icon: Car, path: "/car-rental" },
    {
      id: "Things to Do",
      label: "Things to Do",
      icon: Mountain,
      path: "/activities",
    },
    { id: "More", label: "More", icon: Grid3X3, path: "/packages" },
  ];

  const hotelSubTabs = [
    { id: "Hotels", label: "Hotels", icon: Hotel },
    { id: "Villa", label: "Villa", icon: Home },
    { id: "Apartment", label: "Apartment", icon: Building2 },
  ];

  const handleSearch = () => {
    if (!destination.trim()) {
      alert("Vui lòng nhập điểm đến");
      return;
    }

    // Navigate based on active tab
    const activeTab = mainTabs.find((tab) => tab.id === activeMainTab);
    if (activeTab) {
      const searchParams = new URLSearchParams({
        destination: destination,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests: `${guestCount.adults} Adult(s), ${guestCount.children} Child, ${guestCount.rooms} Room`,
      });

      router.push(`${activeTab.path}?${searchParams.toString()}`);
    }
  };

  const updateGuestString = () => {
    setGuests(
      `${guestCount.adults} Adult(s), ${guestCount.children} Child, ${guestCount.rooms} Room`
    );
  };

  useEffect(() => {
    updateGuestString();
  }, [guestCount]);

  const handleGuestChange = (
    type: "adults" | "children" | "rooms",
    action: "increase" | "decrease"
  ) => {
    setGuestCount((prev) => {
      const newCount = { ...prev };
      if (action === "increase") {
        newCount[type]++;
      } else if (action === "decrease" && newCount[type] > 0) {
        newCount[type]--;
      }
      return newCount;
    });
  };

  return (
    <div
      className="min-h-[60vh] relative"
      style={{
        backgroundImage:
          'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Top Navigation */}
      <div className="bg-blue-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-center space-x-8">
            {mainTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveMainTab(tab.id)}
                className="text-gray-900 hover:text-blue-200 font-medium text-sm transition-colors"
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-[55vh] px-4">
        {/* Secondary Tab Navigation */}
        <div className="mb-8">
          <div className="flex bg-white/10 backdrop-blur-sm rounded-full p-2 space-x-2">
            {mainTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveMainTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all ${
                    activeMainTab === tab.id
                      ? "bg-white text-gray-800 shadow-lg"
                      : "text-gray-900 hover:bg-white/20"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Hotels Sub-tabs */}
        {activeMainTab === "Hotels" && (
          <div className="mb-6">
            <div className="flex bg-white/90 rounded-lg p-1 space-x-1">
              {hotelSubTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSubTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                      activeSubTab === tab.id
                        ? "bg-blue-500 text-gray-900"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium text-sm">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Search Form */}
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8">
            {/* Form Labels */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  City, destination, or hotel name
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Check-in & Check-out Dates
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Guests and Rooms
                </label>
              </div>
            </div>

            {/* Form Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Destination Input */}
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-900" />
                <input
                  type="text"
                  placeholder="City, hotel, place to go"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Date Inputs */}
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-900" />
                <input
                  type="text"
                  value={`${checkInDate} - ${checkOutDate}`}
                  readOnly
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                />
              </div>

              {/* Guests Input */}
              <div className="relative flex">
                <div className="relative flex-1">
                  <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-900" />
                  <input
                    type="text"
                    value={guests}
                    readOnly
                    onClick={() => setShowGuestPicker(!showGuestPicker)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                  />

                  {/* Guest Picker Dropdown */}
                  {showGuestPicker && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 mt-1 p-4">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Adults</span>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                handleGuestChange("adults", "decrease")
                              }
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center">
                              {guestCount.adults}
                            </span>
                            <button
                              onClick={() =>
                                handleGuestChange("adults", "increase")
                              }
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Children</span>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                handleGuestChange("children", "decrease")
                              }
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center">
                              {guestCount.children}
                            </span>
                            <button
                              onClick={() =>
                                handleGuestChange("children", "increase")
                              }
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Rooms</span>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                handleGuestChange("rooms", "decrease")
                              }
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center">
                              {guestCount.rooms}
                            </span>
                            <button
                              onClick={() =>
                                handleGuestChange("rooms", "increase")
                              }
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  className="bg-orange-500 hover:bg-orange-600 text-gray-900 px-8 py-4 rounded-r-lg font-semibold transition-colors flex items-center space-x-2"
                  onClick={handleSearch}
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Trusted Partners */}
          <div className="bg-gray-50 px-8 py-6">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <span>Trusted by</span>
              <div className="flex items-center space-x-4 ml-4">
                <div className="bg-red-600 text-gray-900 px-2 py-1 rounded text-xs font-bold">
                  MILLENNIUM
                </div>
                <div className="bg-gray-800 text-gray-900 px-2 py-1 rounded text-xs font-bold">
                  ALL
                </div>
                <div className="bg-blue-800 text-gray-900 px-2 py-1 rounded text-xs font-bold">
                  ARCHIPELAGO
                </div>
                <div className="bg-blue-600 text-gray-900 px-2 py-1 rounded text-xs font-bold">
                  Best Western
                </div>
                <div className="bg-green-700 text-gray-900 px-2 py-1 rounded text-xs font-bold">
                  IHG
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
