# 🛡️ Hệ thống Admin Panel - Travel App

## 📋 Tổng quan

Hệ thống Admin Panel được xây dựng để quản lý toàn bộ dữ liệu của Travel App với các tính năng bảo mật và phân quyền cao cấp.

## 🚀 Tính năng chính

### 🔐 Bảo mật và Phân quyền
- **Authentication**: JWT-based authentication
- **Authorization**: Role-based access control (Admin only)
- **Middleware Protection**: Bảo vệ tất cả admin routes
- **Session Management**: Token-based session handling

### 📊 Quản lý dữ liệu
- **Dashboard**: Thống kê tổng quan real-time
- **Destinations**: CRUD operations cho điểm đến
- **Hotels**: Quản lý khách sạn
- **Flights**: Quản lý chuyến bay
- **Packages**: Quản lý gói tour
- **Activities**: Quản lý hoạt động
- **Insurance**: Quản lý bảo hiểm
- **Bookings**: Quản lý đặt chỗ
- **Users**: Quản lý người dùng

## 🏗️ Cấu trúc hệ thống

```
app/
├── admin/                    # Admin Panel Routes
│   ├── layout.tsx           # Admin Layout với Sidebar
│   ├── page.tsx             # Dashboard chính
│   ├── destinations/        # Quản lý điểm đến
│   ├── hotels/             # Quản lý khách sạn
│   ├── flights/            # Quản lý chuyến bay
│   ├── packages/           # Quản lý gói tour
│   ├── activities/         # Quản lý hoạt động
│   ├── insurance/          # Quản lý bảo hiểm
│   ├── bookings/           # Quản lý đặt chỗ
│   ├── users/              # Quản lý người dùng
│   ├── analytics/          # Phân tích dữ liệu
│   └── settings/           # Cài đặt hệ thống
├── api/
│   └── admin/              # Admin API Endpoints
│       ├── dashboard/      # Dashboard API
│       ├── destinations/   # Destinations API
│       ├── hotels/         # Hotels API
│       └── ...             # Các API khác
└── auth/
    └── admin-login/        # Admin Login Page
```

## 🔑 Đăng nhập Admin

### Demo Credentials
- **URL**: `/auth/admin-login`
- **Email**: `admin@travel.com`
- **Password**: `admin123`

### Quy trình đăng nhập
1. Truy cập `/auth/admin-login`
2. Nhập thông tin đăng nhập
3. Hệ thống verify và tạo session
4. Redirect đến `/admin` dashboard

## 🛡️ Bảo mật

### Middleware Protection
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  if (pathname.startsWith('/admin')) {
    const token = request.headers.get('authorization')?.replace('Bearer ', '') ||
                  request.cookies.get('admin_token')?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL('/auth/admin-login', request.url));
    }
  }
}
```

### API Protection
- Tất cả API admin routes được bảo vệ
- Kiểm tra token trong Authorization header
- Role-based access control

### Session Management
- Token được lưu trong localStorage
- Auto-logout khi token hết hạn
- Secure token storage

## 📊 Dashboard Features

### Thống kê tổng quan
- Số lượng destinations, hotels, flights
- Số lượng bookings và users
- Doanh thu và tăng trưởng
- Hoạt động gần đây

### Real-time Updates
- Auto-refresh data
- Live notifications
- Activity logs

## 🗃️ CRUD Operations

### Destinations Management
```typescript
// API Endpoints
GET    /api/admin/destinations     # Lấy danh sách
POST   /api/admin/destinations     # Tạo mới
GET    /api/admin/destinations/:id # Lấy chi tiết
PUT    /api/admin/destinations/:id # Cập nhật
DELETE /api/admin/destinations/:id # Xóa
```

### Features
- **Search & Filter**: Tìm kiếm theo tên, tỉnh, danh mục
- **Pagination**: Phân trang dữ liệu
- **Bulk Operations**: Thao tác hàng loạt
- **Image Management**: Upload và quản lý hình ảnh
- **Validation**: Kiểm tra dữ liệu đầu vào

## 🔧 API Endpoints

### Dashboard
- `GET /api/admin/dashboard/stats` - Thống kê dashboard

### Destinations
- `GET /api/admin/destinations` - Danh sách destinations
- `POST /api/admin/destinations` - Tạo destination mới
- `GET /api/admin/destinations/:id` - Chi tiết destination
- `PUT /api/admin/destinations/:id` - Cập nhật destination
- `DELETE /api/admin/destinations/:id` - Xóa destination

### Authentication
- `POST /api/auth/verify` - Verify admin token

## 🎨 UI Components

### Admin Layout
- **Sidebar Navigation**: Menu chính với icons
- **Top Bar**: Thông tin user và date
- **Responsive Design**: Mobile-friendly
- **Dark/Light Mode**: Tùy chọn theme

### Data Tables
- **Sortable Columns**: Sắp xếp theo cột
- **Search & Filter**: Tìm kiếm nâng cao
- **Pagination**: Điều hướng trang
- **Action Buttons**: Edit, Delete, View

### Forms
- **Validation**: Real-time validation
- **File Upload**: Hình ảnh và documents
- **Auto-save**: Lưu tự động
- **Error Handling**: Xử lý lỗi thân thiện

## 🚨 Error Handling

### Client-side Errors
- Form validation errors
- Network errors
- Authentication errors
- Permission errors

### Server-side Errors
- Database errors
- Validation errors
- Authentication failures
- Rate limiting

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Features
- Mobile-first approach
- Touch-friendly interactions
- Optimized layouts
- Adaptive navigation

## 🔒 Security Best Practices

### Authentication
- JWT tokens với expiration
- Secure token storage
- Auto-logout functionality
- Session management

### Authorization
- Role-based access control
- Route protection
- API endpoint security
- Permission checking

### Data Protection
- Input validation
- SQL injection prevention
- XSS protection
- CSRF protection

## 🚀 Deployment

### Environment Variables
```env
# Admin Configuration
ADMIN_EMAIL=admin@travel.com
ADMIN_PASSWORD=secure_password
JWT_SECRET=your_jwt_secret
ADMIN_TOKEN_EXPIRY=24h

# Database
DATABASE_URL=postgresql://...
```

### Production Considerations
- HTTPS enforcement
- Rate limiting
- Logging và monitoring
- Backup strategies
- Error tracking

## 🧪 Testing

### Test Cases
- Authentication flows
- CRUD operations
- Permission checks
- Error scenarios
- UI interactions

### Tools
- Jest for unit testing
- Cypress for E2E testing
- API testing với Postman
- Performance testing

## 📚 Documentation

### API Documentation
- OpenAPI/Swagger specs
- Endpoint descriptions
- Request/Response examples
- Error codes

### User Guides
- Admin user manual
- Feature walkthroughs
- Troubleshooting guides
- Best practices

## 🔄 Future Enhancements

### Planned Features
- **Multi-language Support**: Đa ngôn ngữ
- **Advanced Analytics**: Phân tích nâng cao
- **Audit Logs**: Ghi log hoạt động
- **Bulk Import/Export**: Import/Export dữ liệu
- **Real-time Notifications**: Thông báo real-time
- **Mobile App**: Ứng dụng mobile cho admin

### Technical Improvements
- **GraphQL API**: Thay thế REST API
- **Microservices**: Kiến trúc microservices
- **Caching**: Redis caching
- **CDN**: Content delivery network
- **Monitoring**: Advanced monitoring tools

## 📞 Support

### Getting Help
1. Kiểm tra documentation
2. Xem troubleshooting guides
3. Contact development team
4. Submit bug reports

### Common Issues
- **Login Problems**: Kiểm tra credentials
- **Permission Errors**: Verify user role
- **API Errors**: Check request format
- **Performance Issues**: Monitor resources

---

🎉 **Hệ thống Admin Panel đã sẵn sàng!** 

Bắt đầu bằng cách:
1. Truy cập `/auth/admin-login`
2. Đăng nhập với demo credentials
3. Khám phá dashboard và các tính năng
4. Quản lý dữ liệu của Travel App 