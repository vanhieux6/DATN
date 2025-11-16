"use client";
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface BookingConfirmation {
  bookingCode: string;
  package: string;
  destination: string;
  participants: number;
  totalPrice: number;
  selectedDate: string;
  status: string;
  specialRequests?: string;
  contactInfo?: any;
}

// Component con sử dụng useSearchParams
function ConfirmationDetails() {
  const searchParams = useSearchParams();
  const bookingCode = searchParams.get('bookingCode');
  const [booking, setBooking] = useState<BookingConfirmation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bookingCode) {
      fetchBookingDetails();
    } else {
      setError('Không tìm thấy mã đặt tour');
      setLoading(false);
    }
  }, [bookingCode]);

  const fetchBookingDetails = async () => {
    try {
      // application programing interface -- 
      const res = await fetch(`/api/bookings/${bookingCode}`);
      if (!res.ok) {
        throw new Error('Failed to fetch booking details');
      }
      const data = await res.json();
      setBooking(data.booking);
    } catch (err) {
      setError('Không thể tải thông tin đặt tour');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Đang tải thông tin đặt tour...</div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col">
        <div className="text-red-600 text-xl mb-4">{error || 'Không tìm thấy thông tin đặt tour'}</div>
        <Link href="/" className="text-blue-600 hover:underline">
          Về trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden text-center"
        >
          {/* Success Icon */}
          <div className="bg-green-50 p-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-green-600 mb-2">
              Đặt Tour Thành Công!
            </h1>
            <p className="text-gray-600">
              Cảm ơn bạn đã đặt tour. Dưới đây là thông tin đặt tour của bạn.
            </p>
          </div>

          {/* Booking Details */}
          <div className="p-6 space-y-4 text-left">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Mã đặt tour:</strong>
              </div>
              <div className="font-mono text-blue-600">{booking.bookingCode}</div>

              <div>
                <strong>Tour:</strong>
              </div>
              <div>{booking.package}</div>

              <div>
                <strong>Điểm đến:</strong>
              </div>
              <div>{booking.destination}</div>

              <div>
                <strong>Số người:</strong>
              </div>
              <div>{booking.participants}</div>

              <div>
                <strong>Ngày khởi hành:</strong>
              </div>
              <div>{new Date(booking.selectedDate).toLocaleDateString('vi-VN')}</div>

              <div>
                <strong>Tổng tiền:</strong>
              </div>
              <div className="text-red-600 font-bold">
                {new Intl.NumberFormat('vi-VN').format(booking.totalPrice)}đ
              </div>

              <div>
                <strong>Trạng thái:</strong>
              </div>
              <div>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                  {booking.status === 'confirmed' ? 'Đã xác nhận' : booking.status}
                </span>
              </div>
            </div>

            {/* Special Requests */}
            {booking.specialRequests && (
              <div className="border-t pt-4">
                <strong>Yêu cầu đặc biệt:</strong>
                <p className="text-gray-700 mt-1">{booking.specialRequests}</p>
              </div>
            )}
          </div>

          {/* Next Steps */}
          <div className="bg-gray-50 p-6 border-t">
            <h3 className="font-semibold mb-3">Bước tiếp theo:</h3>
            <ul className="text-sm text-gray-600 space-y-2 text-left">
              <li>• Bạn sẽ nhận được email xác nhận trong vòng 5 phút</li>
              <li>• Vui lòng thanh toán trước 50% trong vòng 24h</li>
              <li>• Hướng dẫn viên sẽ liên hệ trước ngày khởi hành 3 ngày</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="p-6 border-t flex gap-4">
            <Link
              href="/"
              className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              Về trang chủ
            </Link>
            <button
              onClick={() => window.print()}
              className="flex-1 border border-blue-600 text-blue-600 py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors"
            >
              In hóa đơn
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Loading component
function ConfirmationLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg">Đang tải trang xác nhận...</div>
    </div>
  );
}

// Component chính
export default function ConfirmationPage() {
  return (
    <Suspense fallback={<ConfirmationLoading />}>
      <ConfirmationDetails />
    </Suspense>
  );
}