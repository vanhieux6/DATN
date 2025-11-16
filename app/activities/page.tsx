"use client";

export default function ActivitiesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Hoạt động & Giải trí
          </h1>

          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏔️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Trang hoạt động & giải trí
            </h2>
            <p className="text-gray-600 mb-6">
              Tính năng tìm kiếm hoạt động sẽ được phát triển trong tương lai.
            </p>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-blue-600 text-gray-900 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Quay lại trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
