"use client";
import { useEffect, useMemo, useState } from "react";
import {
  MotionDiv,
  MotionH2,
  MotionH3,
  MotionP,
  MotionButton,
} from "../../components/common/MotionWrapper";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/hooks/useAuth";
import { Star, Upload, X } from "lucide-react";

type ItineraryItem = { day: string; content: string };
type Review = {
  id: number;
  name: string;
  rating: number;
  comment: string;
  photos: string[];
  createdAt: string;
  user?: {
    name: string;
    avatar?: string;
  };
};

type Section = { title: string; content: string; photos: string[] };

type Stop = {
  title: string;
  description: string;
  guide: string;
  photos: string[];
};

type ReviewFormData = {
  rating: number;
  comment: string;
  photos: string[];
};

// Star Rating Component
const StarRating = ({
  rating,
  onRate,
  interactive = false,
  disabled = false,
}: {
  rating: number;
  onRate?: (rating: number) => void;
  interactive?: boolean;
  disabled?: boolean;
}) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && onRate?.(star)}
          className={`${
            interactive && !disabled
              ? "hover:scale-110 transition-transform cursor-pointer"
              : "cursor-default"
          } ${star <= rating ? "text-yellow-400" : "text-gray-300"} ${
            disabled ? "opacity-50" : ""
          }`}
          disabled={!interactive || disabled}
        >
          <Star size={24} fill={star <= rating ? "currentColor" : "none"} />
        </button>
      ))}
    </div>
  );
};

export default function TourDetailPage() {
  const params = useParams();
  const tourId = params.id as string;
  const { user, loading: authLoading } = useAuth();

  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tourData, setTourData] = useState<any | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  // Review form state
  const [reviewForm, setReviewForm] = useState<ReviewFormData>({
    rating: 0,
    comment: "",
    photos: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const formatVnd = (n: number) =>
    new Intl.NumberFormat("vi-VN").format(n) + "đ";

  const getHighlightContent = (highlight: any): string => {
    if (typeof highlight === "string") return highlight;
    if (highlight && typeof highlight === "object") {
      return highlight.description || highlight.content || highlight.name || "";
    }
    return "";
  };

  const getItineraryContent = (item: any): string => {
    if (typeof item === "string") return item;
    if (item && typeof item === "object") {
      return item.content || item.description || "";
    }
    return "";
  };

  const getItineraryDay = (item: any, index: number): string => {
    if (typeof item === "string") return String(index + 1);
    if (item && typeof item === "object") {
      return item.day || String(index + 1);
    }
    return String(index + 1);
  };

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/packages/${tourId}/reviews`);
      if (res.ok) {
        const json = await res.json();
        setReviews(json.data || []);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!tourId) {
          setError("Tour ID không hợp lệ");
          return;
        }
        const res = await fetch(`/api/packages/${tourId}?rich=1`);
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        setTourData(json.data);
        await fetchReviews();
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    if (tourId) fetchData();
  }, [tourId]);

  // Handle review submission
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setSubmitError("Vui lòng đăng nhập để gửi đánh giá");
      return;
    }

    if (reviewForm.rating === 0) {
      setSubmitError("Vui lòng chọn số sao đánh giá");
      return;
    }

    if (!reviewForm.comment.trim()) {
      setSubmitError("Vui lòng nhập nội dung đánh giá");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch(`/api/packages/${tourId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewForm),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit review");
      }

      // Reset form
      setReviewForm({
        rating: 0,
        comment: "",
        photos: [],
      });
      setSubmitSuccess(true);

      // Refresh reviews and tour data
      await fetchReviews();

      // Refresh tour data to update rating
      const tourRes = await fetch(`/api/packages/${tourId}?rich=1`);
      if (tourRes.ok) {
        const tourJson = await tourRes.json();
        setTourData(tourJson.data);
      }

      // Hide success message after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error: any) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPhotos: string[] = [];
    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        setSubmitError("Ảnh không được vượt quá 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        setSubmitError("Chỉ được upload file ảnh");
        return;
      }
      newPhotos.push(URL.createObjectURL(file));
    });

    if (reviewForm.photos.length + newPhotos.length > 5) {
      setSubmitError("Chỉ được upload tối đa 5 ảnh");
      return;
    }

    setReviewForm((prev) => ({
      ...prev,
      photos: [...prev.photos, ...newPhotos],
    }));
    setSubmitError(null);
  };

  const removePhoto = (index: number) => {
    setReviewForm((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  // Calculate rating distribution
  const calculateRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      const rating = Math.round(review.rating);
      distribution[rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const ratingDistribution = calculateRatingDistribution();
  const totalReviews = reviews.length;

  const images: string[] = useMemo(() => {
    if (!tourData) return [];
    const extra = (tourData.images ?? []).map((i: any) => i.url);
    return [tourData.image, ...extra].filter(Boolean);
  }, [tourData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error || !tourData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Không tải được tour.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Image Gallery */}
      <section className="relative h-96 lg:h-[600px] overflow-hidden">
        {/* Main Image */}
        <img
          src={images[selectedImage]}
          alt={tourData.title}
          className="w-full h-full object-cover"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

        {/* Back Button */}
        <MotionButton
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-6 left-6 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ←
        </MotionButton>

        {/* Image Gallery Thumbnails */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <MotionButton
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === index ? "border-white" : "border-white/50"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  src={image}
                  alt={`Tour image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </MotionButton>
            ))}
          </div>
        </div>

        {/* Tour Info Overlay */}
        <div className="absolute bottom-6 right-6 text-right text-white">
          <MotionH2 className="text-3xl lg:text-4xl font-bold mb-2">
            {tourData.title}
          </MotionH2>
          <MotionP className="text-base opacity-90 mb-2">
            {tourData.tagline ||
              `Khám phá ${tourData?.destination?.city} – kỳ quan thiên nhiên và văn hóa đặc sắc`}
          </MotionP>
          <MotionP className="text-lg opacity-90 mb-2">
            {tourData?.destination?.city}, {tourData?.destination?.country} •{" "}
            {tourData.duration}
          </MotionP>
          <div className="flex items-center justify-end space-x-2 mb-2">
            <span className="text-yellow-400">⭐</span>
            <span className="font-semibold">{tourData.rating}</span>
            <span className="opacity-80">
              ({tourData.reviewCount} đánh giá)
            </span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Tour Details */}
          <div className="lg:col-span-2">
            {/* Price Card */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-3xl font-bold text-red-600">
                    {formatVnd(tourData.price)}
                  </div>
                  <div className="text-lg text-gray-600 line-through">
                    {formatVnd(tourData.originalPrice)}
                  </div>
                </div>
                <div className="text-right">
                  <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {tourData.discount}
                  </span>
                  <div className="text-sm text-gray-600 mt-1">
                    {tourData.duration}
                  </div>
                </div>
              </div>

              <Link href={`/booking?packageId=${tourData.id}`}>
                <MotionButton
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Đặt tour ngay
                </MotionButton>
              </Link>
            </MotionDiv>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex space-x-4 border-b mb-6 overflow-x-auto">
                {[
                  { key: "overview", label: "Tổng quan" },
                  { key: "itinerary", label: "Lịch trình" },
                  { key: "included", label: "Bao gồm" },
                  { key: "stops", label: "Điểm tham quan" },
                  { key: "reviews", label: "Đánh giá" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`py-3 px-4 -mb-px border-b-2 whitespace-nowrap ${
                      activeTab === tab.key
                        ? "border-red-600 text-red-600"
                        : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeTab === "overview" && (
                <div className="space-y-8">
                  {Array.isArray(tourData.sections) &&
                  tourData.sections.length > 0 ? (
                    <>
                      {/* Intro */}
                      <div>
                        <MotionH3 className="text-xl font-semibold mb-3">
                          Giới thiệu
                        </MotionH3>
                        <MotionP className="text-gray-700 whitespace-pre-line">
                          {tourData.description ||
                            "Hành trình đưa bạn đến những cảnh sắc tuyệt đẹp và trải nghiệm văn hóa bản địa chân thực."}
                        </MotionP>
                      </div>

                      {/* Highlights */}
                      <div>
                        <MotionH3 className="text-xl font-semibold mb-3">
                          Điểm nổi bật
                        </MotionH3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {Array.isArray(tourData.highlights) &&
                            tourData.highlights.map((h: any, idx: number) => {
                              const content = getHighlightContent(h);
                              return content ? (
                                <div
                                  key={idx}
                                  className="flex items-center space-x-2 text-gray-700"
                                >
                                  <span className="text-green-600">✓</span>
                                  <span>{content}</span>
                                </div>
                              ) : null;
                            })}
                        </div>
                      </div>

                      {/* Rich sections */}
                      {tourData.sections.map((s: any, idx: number) => (
                        <div key={idx}>
                          <MotionH3 className="text-xl font-semibold mb-3">
                            {s.title}
                          </MotionH3>
                          <MotionP className="text-gray-700 whitespace-pre-line">
                            {s.content}
                          </MotionP>
                          {s.photos?.length > 0 && (
                            <div className="mt-3 grid grid-cols-2 gap-3">
                              {s.photos.map((p: string, i: number) => (
                                <img
                                  key={i}
                                  src={p}
                                  alt="section"
                                  className="rounded-xl object-cover w-full h-40"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                      {/* Intro */}
                      <div>
                        <MotionH3 className="text-xl font-semibold mb-3">
                          Giới thiệu
                        </MotionH3>
                        <MotionP className="text-gray-700 whitespace-pre-line">
                          {tourData.description ||
                            "Hành trình đưa bạn đến những cảnh sắc tuyệt đẹp và trải nghiệm văn hóa bản địa chân thực."}
                        </MotionP>
                      </div>

                      {/* Highlights */}
                      <div>
                        <MotionH3 className="text-xl font-semibold mb-3">
                          Điểm nổi bật
                        </MotionH3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {Array.isArray(tourData.highlights) &&
                            tourData.highlights.map((h: any, idx: number) => {
                              const content = getHighlightContent(h);
                              return content ? (
                                <div
                                  key={idx}
                                  className="flex items-center space-x-2 text-gray-700"
                                >
                                  <span className="text-green-600">✓</span>
                                  <span>{content}</span>
                                </div>
                              ) : null;
                            })}
                        </div>
                      </div>

                      {/* Culture & Food */}
                      <div>
                        <MotionH3 className="text-xl font-semibold mb-3">
                          Văn hóa & Ẩm thực
                        </MotionH3>
                        <MotionP className="text-gray-700 whitespace-pre-line">
                          Khám phá văn hóa địa phương và thưởng thức ẩm thực đặc
                          trưng vùng miền.
                        </MotionP>
                      </div>

                      {/* Featured Experiences */}
                      <div>
                        <MotionH3 className="text-xl font-semibold mb-3">
                          Trải nghiệm nổi bật
                        </MotionH3>
                        <MotionP className="text-gray-700 whitespace-pre-line">
                          Tắm biển, chèo kayak, ngắm hoàng hôn, khám phá chợ đêm
                          và nhiều hơn nữa.
                        </MotionP>
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeTab === "itinerary" && (
                <div>
                  <MotionH3 className="text-xl font-semibold mb-4">
                    Lịch trình chi tiết
                  </MotionH3>
                  <div className="space-y-4">
                    {Array.isArray(tourData.itinerary) &&
                      tourData.itinerary.map((item: any, idx: number) => {
                        const day = getItineraryDay(item, idx);
                        const content = getItineraryContent(item);
                        const startTime = item?.startTime
                          ? String(item.startTime)
                          : null;
                        const transport = item?.transport
                          ? String(item.transport)
                          : null;
                        const meals = item?.meals ? String(item.meals) : null;

                        return (
                          <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center justify-between">
                              <div className="font-semibold text-gray-700">
                                Ngày {day}
                              </div>
                              <div className="text-sm text-gray-600">
                                {startTime && (
                                  <span className="mr-3">🕒 {startTime}</span>
                                )}
                                {transport && (
                                  <span className="mr-3">🚗 {transport}</span>
                                )}
                                {meals && <span>🍽 {meals}</span>}
                              </div>
                            </div>
                            <p className="text-gray-700 mt-2 whitespace-pre-line">
                              {content}
                            </p>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {activeTab === "included" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <MotionH3 className="text-lg font-semibold mb-3">
                      Bao gồm
                    </MotionH3>
                    <ul className="space-y-2">
                      {Array.isArray(tourData.included) &&
                        tourData.included.map((inc: any, idx: number) => {
                          const content =
                            typeof inc === "string" ? inc : inc?.item || "";
                          return content ? (
                            <li
                              key={idx}
                              className="flex items-center text-gray-700"
                            >
                              <span className="text-green-600 mr-2">✓</span>
                              {content}
                            </li>
                          ) : null;
                        })}
                    </ul>
                  </div>
                  <div>
                    <MotionH3 className="text-lg font-semibold mb-3">
                      Không bao gồm
                    </MotionH3>
                    <ul className="space-y-2">
                      {Array.isArray(tourData.notIncluded) &&
                        tourData.notIncluded.map((exc: any, idx: number) => {
                          const content =
                            typeof exc === "string" ? exc : exc?.item || "";
                          return content ? (
                            <li
                              key={idx}
                              className="flex items-center text-gray-700"
                            >
                              <span className="text-red-600 mr-2">✗</span>
                              {content}
                            </li>
                          ) : null;
                        })}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === "stops" && Array.isArray(tourData.stops) && (
                <div className="space-y-6">
                  {tourData.stops.map((stop: any, idx: number) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        {stop.mapThumb && (
                          <img
                            src={stop.mapThumb}
                            alt="map"
                            className="w-24 h-24 rounded object-cover"
                          />
                        )}
                        <div>
                          <MotionH3 className="text-lg font-semibold">
                            {stop.title}
                          </MotionH3>
                          {stop.bestTime && (
                            <div className="text-xs text-gray-600">
                              Thời gian lý tưởng: {stop.bestTime}
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-700 mt-2 whitespace-pre-line">
                        {stop.description}
                      </p>
                      {Array.isArray(stop.tips) && stop.tips.length > 0 && (
                        <div className="mt-3">
                          <div className="font-semibold mb-1">
                            Mẹo tham quan
                          </div>
                          <ul className="list-disc pl-5 text-gray-700 space-y-1">
                            {stop.tips.map((t: string, i: number) => (
                              <li key={i}>{t}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {stop.photos?.length > 0 && (
                        <div className="mt-3 grid grid-cols-2 gap-3">
                          {stop.photos.map((p: string, i: number) => (
                            <img
                              key={i}
                              src={p}
                              alt="stop"
                              className="rounded-xl object-cover w-full h-40"
                            />
                          ))}
                        </div>
                      )}
                      <div className="text-sm text-gray-600 mt-2">
                        Hướng dẫn: {stop.guide}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-6">
                  {/* Rating Summary */}
                  <div className="p-6 bg-white rounded-xl border">
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-yellow-500">
                          {tourData?.rating?.toFixed(1) || "0.0"}★
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {totalReviews} đánh giá
                        </div>
                      </div>

                      <div className="flex-1 space-y-2">
                        {[5, 4, 3, 2, 1].map((star) => {
                          const count =
                            ratingDistribution[
                              star as keyof typeof ratingDistribution
                            ];
                          const percent = totalReviews
                            ? Math.round((count / totalReviews) * 100)
                            : 0;

                          return (
                            <div
                              key={star}
                              className="flex items-center gap-3 text-sm"
                            >
                              <span className="w-8">{star}★</span>
                              <div className="flex-1 h-2 bg-gray-200 rounded-full">
                                <div
                                  className="h-2 bg-yellow-400 rounded-full transition-all duration-500"
                                  style={{ width: `${percent}%` }}
                                />
                              </div>
                              <span className="w-12 text-right text-gray-600">
                                {count} ({percent}%)
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Reviews List */}
                  <div>
                    <MotionH3 className="text-xl font-semibold mb-4">
                      Đánh giá ({totalReviews})
                    </MotionH3>

                    {reviews.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        Chưa có đánh giá nào cho tour này.
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {reviews.map((review) => (
                          <div
                            key={review.id}
                            className="p-6 bg-gray-50 rounded-xl"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                {review.user?.avatar ? (
                                  <img
                                    src={review.user.avatar}
                                    alt={review.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                    {review.name.charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <div>
                                  <div className="font-semibold text-gray-900">
                                    {review.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {new Date(
                                      review.createdAt
                                    ).toLocaleDateString("vi-VN")}
                                  </div>
                                </div>
                              </div>
                              <StarRating rating={review.rating} />
                            </div>

                            <p className="text-gray-700 mt-2 whitespace-pre-line leading-relaxed">
                              {review.comment}
                            </p>

                            {review.photos?.length > 0 && (
                              <div className="flex gap-3 mt-4 flex-wrap">
                                {review.photos.map((photo, index) => (
                                  <img
                                    key={index}
                                    className="h-24 w-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity border"
                                    src={photo}
                                    alt={`Review photo ${index + 1}`}
                                    onClick={() => window.open(photo, "_blank")}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Review Form */}
                  {authLoading ? (
                    <div className="p-6 bg-white rounded-xl border text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-gray-600 mt-2">
                        Đang kiểm tra đăng nhập...
                      </p>
                    </div>
                  ) : user ? (
                    <div className="p-6 bg-white rounded-xl border">
                      <MotionH3 className="text-xl font-semibold mb-4">
                        Viết đánh giá của bạn
                      </MotionH3>

                      {submitSuccess && (
                        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg border border-green-200">
                          ✅ Đánh giá của bạn đã được gửi thành công!
                        </div>
                      )}

                      {submitError && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg border border-red-200">
                          ❌ {submitError}
                        </div>
                      )}

                      <form onSubmit={handleSubmitReview} className="space-y-4">
                        {/* Star Rating */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Đánh giá của bạn *
                          </label>
                          <StarRating
                            rating={reviewForm.rating}
                            onRate={(rating) =>
                              setReviewForm((prev) => ({ ...prev, rating }))
                            }
                            interactive={true}
                            disabled={isSubmitting}
                          />
                          <div className="text-sm text-gray-500 mt-1">
                            {reviewForm.rating > 0
                              ? `Bạn đã chọn ${reviewForm.rating} sao`
                              : "Vui lòng chọn số sao"}
                          </div>
                        </div>

                        {/* Comment */}
                        <div>
                          <label
                            htmlFor="comment"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Nhận xét *
                          </label>
                          <textarea
                            id="comment"
                            value={reviewForm.comment}
                            onChange={(e) =>
                              setReviewForm((prev) => ({
                                ...prev,
                                comment: e.target.value,
                              }))
                            }
                            rows={4}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
                            placeholder="Chia sẻ trải nghiệm của bạn về tour này..."
                            required
                            disabled={isSubmitting}
                          />
                          <div className="text-sm text-gray-500 mt-1">
                            {reviewForm.comment.length}/1000 ký tự
                          </div>
                        </div>

                        {/* Photo Upload */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Hình ảnh (tối đa 5 ảnh)
                          </label>

                          {/* Photo Preview */}
                          {reviewForm.photos.length > 0 && (
                            <div className="flex gap-3 mb-3 flex-wrap">
                              {reviewForm.photos.map((photo, index) => (
                                <div key={index} className="relative">
                                  <img
                                    src={photo}
                                    alt={`Preview ${index + 1}`}
                                    className="h-20 w-28 object-cover rounded-lg border"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removePhoto(index)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors disabled:opacity-50"
                                    disabled={isSubmitting}
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          {reviewForm.photos.length < 5 && (
                            <label
                              className={`flex items-center justify-center border-2 border-dashed rounded-lg p-4 transition-colors ${
                                isSubmitting
                                  ? "border-gray-300 cursor-not-allowed opacity-50"
                                  : "border-gray-300 cursor-pointer hover:border-blue-500"
                              }`}
                            >
                              <Upload
                                size={20}
                                className="mr-2 text-gray-400"
                              />
                              <span className="text-gray-600">Tải ảnh lên</span>
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handlePhotoUpload}
                                className="hidden"
                                disabled={
                                  isSubmitting || reviewForm.photos.length >= 5
                                }
                              />
                            </label>
                          )}
                          <div className="text-sm text-gray-500 mt-1">
                            Định dạng: JPG, PNG. Tối đa 5MB/ảnh
                          </div>
                        </div>

                        {/* Submit Button */}
                        <MotionButton
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                        >
                          {isSubmitting ? (
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Đang gửi...
                            </div>
                          ) : (
                            "Gửi đánh giá"
                          )}
                        </MotionButton>
                      </form>
                    </div>
                  ) : (
                    <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-xl text-center">
                      <p className="text-yellow-800 mb-3">
                        Vui lòng đăng nhập để gửi đánh giá về tour này.
                      </p>
                      <Link href="/auth/login">
                        <MotionButton
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Đăng nhập
                        </MotionButton>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Booking Widget */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <div className="text-xl font-semibold mb-4">Đặt tour nhanh</div>
              <div className="space-y-3">
                <input type="date" className="w-full border p-3 rounded" />
                <input
                  type="number"
                  min={1}
                  defaultValue={2}
                  className="w-full border p-3 rounded"
                  placeholder="Số người"
                  onChange={(e) => {
                    const n = Math.max(1, Number(e.target.value || 1));
                    const total = n * (tourData.price || 0);
                    const el = document.getElementById("booking-total");
                    if (el)
                      el.textContent =
                        new Intl.NumberFormat("vi-VN").format(total) + "đ";
                  }}
                />
                <Link href={`/booking?packageId=${tourData.id}`}>
                  <MotionButton className="w-full bg-green-600 text-white py-3 rounded-lg">
                    Tiếp tục đặt chỗ
                  </MotionButton>
                </Link>
              </div>
              <div className="mt-4 text-sm text-gray-600 flex items-center justify-between">
                <span>Tổng dự kiến</span>
                <span id="booking-total" className="font-semibold text-red-600">
                  {new Intl.NumberFormat("vi-VN").format(tourData.price)}đ
                </span>
              </div>
              <div className="mt-6 text-sm text-gray-600">
                <div>Khởi hành: {tourData.departure}</div>
                <div>Thời lượng: {tourData.duration}</div>
                <div>Nhóm: {tourData.groupSize}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}