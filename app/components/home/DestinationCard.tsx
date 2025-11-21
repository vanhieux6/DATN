import { motion } from "framer-motion";
import Link from "next/link";
import { Star, MapPin, Heart } from "lucide-react";

interface Destination {
  id: number;
  city: string;
  country: string;
  image: string;
  rating: number;
  reviewCount: number;
  hotels: number;
  fromPrice: number;
  toPrice: number;
  slug: string;
  highlights: Array<{
    name: string;
    image: string;
  }>;
  activities: Array<{
    name: string;
    icon: string;
  }>;
  isFeatured?: boolean;
  discount?: number;
  tags: string[];
}

interface DestinationCardProps {
  destination: Destination;
  index: number;
  viewMode: "grid" | "list";
}

export default function DestinationCard({ destination, index, viewMode }: DestinationCardProps) {
  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
      >
        <Link href={`/destinations/${destination.slug}`} className="flex">
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {destination.city}
                </h3>
                <p className="text-gray-600 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {destination.country}
                </p>
              </div>
              <button className="text-gray-400 hover:text-red-500 transition-colors">
                <Heart className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="font-medium">{destination.rating}</span>
                <span className="text-gray-500">({destination.reviewCount})</span>
              </div>
              <div className="text-gray-500">•</div>
              <div className="text-gray-600">{destination.hotels} khách sạn</div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {destination.fromPrice.toLocaleString("vi-VN")}đ
                </div>
                <div className="text-sm text-gray-500">cho 3 ngày 2 đêm</div>
              </div>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Khám phá
              </button>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  // Grid View
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="group"
    >
      <Link href={`/destinations/${destination.slug}`}>
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform group-hover:scale-105">
          {/* Image Container */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={destination.image}
              alt={destination.city}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            
            {/* Favorite Button */}
            <button className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors">
              <Heart className="h-4 w-4" />
            </button>

            {/* Discount Badge */}
            {destination.discount && (
              <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                -{destination.discount}%
              </div>
            )}

            {/* Location */}
            <div className="absolute bottom-3 left-3 text-white">
              <div className="flex items-center space-x-1 text-sm">
                <MapPin className="h-4 w-4" />
                <span>{destination.country}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {destination.city}
            </h3>

            {/* Rating and Reviews */}
            <div className="flex items-center space-x-2 mb-3">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">{destination.rating}</span>
              </div>
              <span className="text-gray-500 text-sm">({destination.reviewCount})</span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-500 text-sm">{destination.hotels} hotels</span>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-blue-600">
                  {destination.fromPrice.toLocaleString("vi-VN")}đ
                </div>
                <div className="text-xs text-gray-500">bắt đầu từ</div>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                Xem chi tiết
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}