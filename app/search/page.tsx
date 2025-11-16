"use client";
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiHome, FiAirplay, FiMap, FiArrowLeft } from 'react-icons/fi';

interface SearchResult {
  id: number;
  type: 'hotel' | 'flight' | 'tour';
  title: string;
  subtitle?: string;
  image: string;
  price: number;
  rating?: number;
  location?: string;
  duration?: string;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  const type = searchParams.get('type');
  const destination = searchParams.get('destination');
  const departure = searchParams.get('departure');
  const arrival = searchParams.get('arrival');
  const date = searchParams.get('date');
  const guests = searchParams.get('guests');

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        // Gọi API search dựa trên type
        const queryParams = new URLSearchParams();
        
        if (type === 'hotel' && destination) {
          queryParams.append('destination', destination);
          queryParams.append('checkIn', date || '');
          queryParams.append('guests', guests || '1');
        } else if (type === 'flight') {
          if (departure) queryParams.append('departure', departure);
          if (arrival) queryParams.append('arrival', arrival);
          if (date) queryParams.append('date', date);
        } else if (type === 'tour' && destination) {
          queryParams.append('destination', destination);
          queryParams.append('date', date || '');
          queryParams.append('guests', guests || '1');
        }

        const response = await fetch(`/api/search/${type}?${queryParams}`);
        const data = await response.json();
        
        if (data.success) {
          setResults(data.data);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    if (type) {
      fetchResults();
    }
  }, [type, destination, departure, arrival, date, guests]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hotel': return <FiHome className="w-5 h-5" />;
      case 'flight': return <FiAirplay className="w-5 h-5" />;
      case 'tour': return <FiMap className="w-5 h-5" />;
      default: return <FiMap className="w-5 h-5" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'hotel': return 'Khách sạn';
      case 'flight': return 'Vé máy bay';
      case 'tour': return 'Tour du lịch';
      default: return 'Kết quả';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-4">
                  <div className="h-40 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
            <FiArrowLeft className="w-5 h-5" />
            <span>Quay lại</span>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              Kết quả tìm kiếm {getTypeLabel(type || '')}
            </h1>
            <p className="text-gray-600 mt-1">
              {destination && `Địa điểm: ${destination}`}
              {departure && arrival && `Từ ${departure} đến ${arrival}`}
              {date && ` • Ngày: ${new Date(date).toLocaleDateString('vi-VN')}`}
              {guests && ` • ${guests} người`}
            </p>
          </div>
        </div>

        {/* Results */}
        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {getTypeIcon(item.type)}
                    <span className="text-sm font-medium text-blue-600">
                      {getTypeLabel(item.type)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  {item.subtitle && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {item.subtitle}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-green-600">
                      {formatPrice(item.price)}đ
                    </div>
                    {item.rating && (
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        ⭐ {item.rating}
                      </div>
                    )}
                  </div>
                  {item.duration && (
                    <div className="text-sm text-gray-500 mt-2">
                      {item.duration}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Không tìm thấy kết quả phù hợp
            </h3>
            <p className="text-gray-600 mb-6">
              Hãy thử điều chỉnh tiêu chí tìm kiếm của bạn
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiArrowLeft className="w-4 h-4" />
              Quay lại trang chủ
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}