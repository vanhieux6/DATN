"use client";
import { useState } from "react";
import { motion } from "framer-motion";

const tabs = [
  { key: "hotel", label: "Khách sạn" },
  { key: "flight", label: "Vé máy bay" },
  { key: "combo", label: "Gói du lịch" },
];

export default function SearchTabs() {
  const [activeTab, setActiveTab] = useState("hotel");

  return (
    <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl mx-auto">
      {/* Tabs */}
      <div className="flex border-b relative">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.key ? "text-blue-600" : "text-gray-600"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
            {activeTab === tab.key && (
              <motion.div
                layoutId="underline"
                className="h-0.5 bg-blue-600 absolute bottom-0 left-0 right-0"
                initial={false}
              />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === "hotel" && (
          <motion.div
            key="hotel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-3"
          >
            <input
              type="text"
              placeholder="Nhập điểm đến..."
              className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-gray-900 px-6 py-3 rounded-lg font-semibold">
              Tìm khách sạn
            </button>
          </motion.div>
        )}

        {activeTab === "flight" && (
          <motion.div
            key="flight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-3"
          >
            <input
              type="text"
              placeholder="Nơi đi"
              className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Nơi đến"
              className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-gray-900 px-6 py-3 rounded-lg font-semibold">
              Tìm chuyến bay
            </button>
          </motion.div>
        )}

        {activeTab === "combo" && (
          <motion.div
            key="combo"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-3"
          >
            <input
              type="text"
              placeholder="Điểm đến"
              className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-gray-900 px-6 py-3 rounded-lg font-semibold">
              Tìm Combo
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
