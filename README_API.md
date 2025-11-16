# Travel API Documentation

## Tổng quan

Dự án Travel Next.js đã được cập nhật để sử dụng các API endpoints thay vì dữ liệu JSON cứng. Tất cả các API đều được xây dựng bằng Next.js App Router và trả về dữ liệu mock để mô phỏng môi trường thực tế.

## Cấu trúc API

### 1. Hotels API

**Endpoint:** `/api/hotels`

**Methods:**
- `GET` - Lấy danh sách khách sạn với bộ lọc
- `POST` - Tạo đặt phòng mới

**Query Parameters (GET):**
- `location` - Lọc theo địa điểm (all, Phú Quốc, Đà Nẵng, etc.)
- `priceRange` - Lọc theo khoảng giá (all, budget, mid, high, luxury)
- `rating` - Lọc theo đánh giá (all, 4.5, 4.0, 3.5)

**Example Request:**
```bash
GET /api/hotels?location=Phú Quốc&priceRange=mid&rating=4.5
```

**Response Format:**
```json
{
  "success": true,
  "data": [...],
  "total": 3,
  "filters": {
    "location": "Phú Quốc",
    "priceRange": "mid",
    "rating": "4.5"
  }
}
```

### 2. Flights API

**Endpoint:** `/api/flights`

**Methods:**
- `GET` - Tìm kiếm chuyến bay
- `POST` - Đặt vé máy bay

**Query Parameters (GET):**
- `from` - Điểm đi
- `to` - Điểm đến
- `departureDate` - Ngày đi
- `returnDate` - Ngày về (cho chuyến khứ hồi)
- `passengers` - Số hành khách
- `class` - Hạng vé

**Example Request:**
```bash
GET /api/flights?from=Hà Nội&to=TP.HCM&departureDate=2024-02-15&passengers=2&class=economy
```

### 3. Tour Packages API

**Endpoint:** `/api/packages`

**Methods:**
- `GET` - Lấy danh sách gói du lịch
- `POST` - Đặt gói du lịch

**Query Parameters (GET):**
- `destination` - Điểm đến
- `priceRange` - Khoảng giá
- `duration` - Thời gian du lịch
- `category` - Loại gói (Combo, Tour)

**Example Request:**
```bash
GET /api/packages?destination=Phú Quốc&priceRange=mid&duration=3-4
```

### 4. Activities API

**Endpoint:** `/api/activities`

**Methods:**
- `GET` - Lấy danh sách hoạt động
- `POST` - Đặt hoạt động

**Query Parameters (GET):**
- `category` - Danh mục hoạt động
- `location` - Địa điểm
- `priceRange` - Khoảng giá
- `difficulty` - Độ khó

**Example Request:**
```bash
GET /api/activities?category=Thể thao biển&location=Phú Quốc&priceRange=mid
```

### 5. Insurance API

**Endpoint:** `/api/insurance`

**Methods:**
- `GET` - Lấy danh sách gói bảo hiểm
- `POST` - Mua bảo hiểm

**Query Parameters (GET):**
- `type` - Loại bảo hiểm
- `duration` - Thời hạn
- `priceRange` - Khoảng giá
- `coverage` - Mức bồi thường

**Example Request:**
```bash
GET /api/insurance?type=Cơ bản&duration=1-7&priceRange=budget
```

### 6. Destinations API

**Endpoint:** `/api/destinations`

**Methods:**
- `GET` - Lấy danh sách điểm đến
- `POST` - Tạo đánh giá điểm đến

**Query Parameters (GET):**
- `category` - Loại điểm đến
- `popularity` - Mức độ phổ biến
- `priceRange` - Khoảng giá
- `rating` - Đánh giá

**Example Request:**
```bash
GET /api/destinations?category=Biển đảo&popularity=Rất cao&rating=4.5
```

### 7. Destination Detail API

**Endpoint:** `/api/destinations/[slug]`

**Methods:**
- `GET` - Lấy thông tin chi tiết điểm đến

**Example Request:**
```bash
GET /api/destinations/phu-quoc
GET /api/destinations/da-nang
```

## Custom Hook - useApi

Đã tạo custom hook `useApi` để dễ dàng sử dụng các API trong React components:

```typescript
import { useApi } from '../hooks/useApi';

// Sử dụng hook
const { data, loading, error, total, fetchData, postData } = useApi<Hotel[]>('/api/hotels', {
  immediate: false,
  onSuccess: (data) => console.log('Success:', data),
  onError: (error) => console.error('Error:', error)
});

// Fetch data với parameters
useEffect(() => {
  fetchData({
    location: selectedLocation,
    priceRange: selectedPriceRange
  });
}, [selectedLocation, selectedPriceRange]);

// Post data
const handleSubmit = async (formData) => {
  try {
    await postData(formData);
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```

## Tính năng của API

### 1. Filtering & Search
- Tất cả API đều hỗ trợ bộ lọc đa chiều
- Tìm kiếm theo nhiều tiêu chí khác nhau
- Kết hợp nhiều bộ lọc cùng lúc

### 2. Pagination & Sorting
- Trả về tổng số kết quả
- Hỗ trợ phân trang (có thể mở rộng)
- Sắp xếp theo nhiều tiêu chí

### 3. Error Handling
- Xử lý lỗi chuẩn với HTTP status codes
- Thông báo lỗi rõ ràng bằng tiếng Việt
- Fallback cho các trường hợp lỗi

### 4. Mock Data
- Dữ liệu mock phong phú và thực tế
- Simulate API delay để test loading states
- Dữ liệu đa dạng cho testing

## Cách sử dụng trong Components

### 1. Hotels Page
```typescript
const { data: hotels, loading, error, total, fetchData } = useApi<Hotel[]>('/api/hotels', {
  immediate: false
});

useEffect(() => {
  fetchData({
    location: selectedLocation,
    priceRange: selectedPriceRange,
    rating: selectedRating
  });
}, [selectedLocation, selectedPriceRange, selectedRating]);
```

### 2. Destinations Section
```typescript
const { data: destinations, loading, error } = useApi<Destination[]>('/api/destinations');

if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
if (!destinations) return <NoDataMessage />;
```

### 3. Destination Detail Page
```typescript
const { data: destination, loading, error } = useApi<DestinationDetail>(`/api/destinations/${slug}`);

if (loading) return <LoadingSpinner />;
if (error || !destination) return <ErrorMessage error={error} />;
```

## Mở rộng trong tương lai

### 1. Database Integration
- Thay thế mock data bằng database thực
- Sử dụng Prisma, TypeORM hoặc MongoDB
- Implement authentication và authorization

### 2. Real-time Features
- WebSocket cho chat support
- Real-time booking updates
- Live notifications

### 3. Advanced Search
- Full-text search với Elasticsearch
- AI-powered recommendations
- Advanced filtering với multiple criteria

### 4. Caching
- Redis cache cho performance
- CDN cho static assets
- Service worker cho offline support

## Testing API

### 1. Development
```bash
npm run dev
# API endpoints sẽ có sẵn tại http://localhost:3000/api/*
```

### 2. API Testing
Sử dụng Postman hoặc curl để test:

```bash
# Test hotels API
curl "http://localhost:3000/api/hotels?location=Phú Quốc&priceRange=mid"

# Test flights API
curl "http://localhost:3000/api/flights?from=Hà Nội&to=TP.HCM"

# Test POST request
curl -X POST "http://localhost:3000/api/hotels" \
  -H "Content-Type: application/json" \
  -d '{"hotelId": 1, "userId": "user123", "checkIn": "2024-02-20", "checkOut": "2024-02-22", "guests": 2, "totalPrice": 9000000}'
```

## Lưu ý

1. **Mock Data**: Tất cả dữ liệu hiện tại là mock data, không phải dữ liệu thực
2. **API Delay**: Có simulate delay để test loading states
3. **Error Handling**: Implement đầy đủ error handling cho production
4. **TypeScript**: Sử dụng TypeScript interfaces cho type safety
5. **Responsive**: API responses được thiết kế để dễ dàng mở rộng

## Kết luận

Việc chuyển từ dữ liệu JSON cứng sang API endpoints giúp:

- **Scalability**: Dễ dàng mở rộng và maintain
- **Performance**: Có thể implement caching và optimization
- **User Experience**: Loading states và error handling tốt hơn
- **Development**: Dễ dàng test và debug
- **Production Ready**: Sẵn sàng cho production với database thực 