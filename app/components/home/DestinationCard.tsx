"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Star, MapPin, Heart, Users, Zap } from "lucide-react";
import { useState } from "react";

interface DestinationCardProps {
  destination: {
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
    highlights?: Array<{
      name: string;
      image: string;
    }>;
    activities?: Array<{
      name: string;
      icon: string;
    }>;
    isFeatured?: boolean;
    discount?: number;
    tags?: string[];
  };
  index: number;
  viewMode?: "grid" | "list";
}

export default function DestinationCard({
  destination,
  index,
  viewMode = "grid",
}: DestinationCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden group"
      >
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="md:w-1/3 relative overflow-hidden">
            <div className="aspect-video md:aspect-square md:h-64 relative">
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
              )}
              <img
                src={destination.image}
                alt={destination.city}
                className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setImageLoaded(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                {destination.isFeatured && (
                  <span className="bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Nổi bật
                  </span>
                )}
                {destination.discount && (
                  <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    -{destination.discount}%
                  </span>
                )}
              </div>

              {/* Like Button */}
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all hover:scale-110"
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${
                    isLiked ? "fill-red-500 text-red-500" : "text-gray-600"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Content Section */}
          <div className="md:w-2/3 p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {destination.city}
                </h3>
                <div className="flex items-center gap-1 text-gray-600 mt-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{destination.country}</span>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-semibold text-gray-900">
                  {destination.rating}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-4 line-clamp-2">
              Khám phá vẻ đẹp tuyệt vời của {destination.city} với nhiều trải
              nghiệm độc đáo và đáng nhớ.
            </p>

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{destination.reviewCount.toLocaleString()} đánh giá</span>
              </div>
              <div>
                <span>{destination.hotels.toLocaleString()} khách sạn</span>
              </div>
            </div>

            {/* Tags */}
            {destination.tags && destination.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {destination.tags.slice(0, 3).map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Price và CTA */}
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  từ {destination.fromPrice.toLocaleString()}đ
                </div>
                <div className="text-sm text-gray-500">/người</div>
              </div>

              <Link href={`/destinations/${destination.slug}`}>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform group-hover:scale-105">
                  Khám phá
                </button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid View (mặc định)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer transform hover:-translate-y-2"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-[4/3]">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
        )}
        <img
          src={destination.image}
          alt={destination.city}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {destination.isFeatured && (
            <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 w-fit">
              <Zap className="w-3 h-3" />
              Nổi bật
            </span>
          )}
          {destination.discount && (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold w-fit">
              -{destination.discount}%
            </span>
          )}
        </div>

        {/* Like Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all hover:scale-110 hover:bg-white/30"
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isLiked ? "fill-red-500 text-red-500" : "text-white"
            }`}
          />
        </button>

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex justify-between items-end mb-3">
            <div>
              <h3 className="text-xl font-bold mb-1 group-hover:text-amber-300 transition-colors">
                {destination.city}
              </h3>
              <div className="flex items-center gap-1 text-white/90">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{destination.country}</span>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold">
                {destination.rating}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold text-amber-300">
                từ {destination.fromPrice.toLocaleString()}đ
              </div>
              <div className="text-sm text-white/80">/người</div>
            </div>

            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-105">
              <div className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold">
                Khám phá
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="p-4">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{destination.reviewCount.toLocaleString()} đánh giá</span>
          </div>
          <div>
            <span>{destination.hotels.toLocaleString()} khách sạn</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
