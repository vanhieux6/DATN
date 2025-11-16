# 🗄️ Thiết lập Database PostgreSQL - Travel App

## 📋 Tổng quan

Dự án Travel App sử dụng PostgreSQL làm database chính với Prisma ORM để quản lý schema và kết nối.

## 🚀 Các bước thiết lập

### 1. Cài đặt PostgreSQL
- **Windows**: Tải từ https://www.postgresql.org/download/windows/
- **macOS**: `brew install postgresql`
- **Linux**: `sudo apt install postgresql`

### 2. Thiết lập Database
```bash
# Windows (PowerShell)
.\scripts\setup-database.ps1

# Windows (Command Prompt)
.\scripts\setup-database.bat

# Thủ công
psql -U postgres -f scripts\setup-database.sql
```

### 3. Khởi tạo Schema
```bash
# Tự động
.\scripts\init-database.bat

# Thủ công
npm run db:generate
npm run db:push
npm run db:seed  # Tùy chọn
```

### 4. Kiểm tra kết nối
```bash
.\scripts\test-connection.bat
```

## 📁 Cấu trúc thư mục

```
scripts/
├── setup-database.bat      # Script thiết lập database (Windows)
├── setup-database.ps1      # Script thiết lập database (PowerShell)
├── setup-database.sql      # SQL script thiết lập
├── test-connection.bat     # Kiểm tra kết nối
└── init-database.bat       # Khởi tạo schema

prisma/
├── schema.prisma           # Schema database
└── seed.ts                 # Dữ liệu mẫu

app/
└── lib/
    └── prisma.ts          # Prisma client instance
```

## 🔧 Scripts có sẵn

| Script | Mô tả | Sử dụng |
|--------|-------|---------|
| `setup-database.bat` | Thiết lập database và user | Sau khi cài PostgreSQL |
| `init-database.bat` | Khởi tạo schema và seed | Sau khi setup database |
| `test-connection.bat` | Kiểm tra kết nối | Bất cứ lúc nào |

## 📊 Thông tin Database

- **Host**: localhost
- **Port**: 5432
- **Database**: travel_db
- **Username**: travel_user
- **Password**: travel123
- **Schema**: public

## 🗃️ Cấu trúc Database

### Bảng chính:
- **users** - Người dùng
- **destinations** - Điểm đến
- **hotels** - Khách sạn
- **flights** - Chuyến bay
- **packages** - Gói tour
- **activities** - Hoạt động
- **insurance** - Bảo hiểm
- **bookings** - Đặt chỗ

### Quan hệ:
- Destinations ↔ Hotels (1:N)
- Destinations ↔ Activities (1:N)
- Users ↔ Bookings (1:N)
- Destinations ↔ Packages (1:N)

## 🛠️ Lệnh Prisma

```bash
# Tạo client
npm run db:generate

# Đẩy schema
npm run db:push

# Tạo migration
npm run db:migrate

# Chạy seed
npm run db:seed

# Mở Prisma Studio
npm run db:studio
```

## 🔍 Kiểm tra và Debug

### Kiểm tra kết nối:
```bash
.\scripts\test-connection.bat
```

### Xem database:
```bash
npm run db:studio
```

### Logs database:
```bash
npx prisma db pull
npx prisma migrate status
```

## ❗ Xử lý lỗi

### Lỗi thường gặp:

1. **PostgreSQL không chạy**
   - Kiểm tra service: `services.msc`
   - Khởi động PostgreSQL service

2. **Lỗi kết nối**
   - Kiểm tra port 5432
   - Kiểm tra firewall
   - Kiểm tra file .env

3. **Lỗi quyền**
   - Chạy script với quyền Administrator
   - Kiểm tra user travel_user có quyền đầy đủ

4. **Lỗi Prisma**
   - Chạy `npm install`
   - Chạy `npx prisma generate`
   - Kiểm tra schema.prisma

## 📚 Tài liệu tham khảo

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Next.js Database Integration](https://nextjs.org/docs/app/building-your-application/data-fetching)

## 🎯 Kết quả mong đợi

Sau khi hoàn thành:
- ✅ PostgreSQL database đã được cài đặt
- ✅ Database `travel_db` đã được tạo
- ✅ User `travel_user` có quyền truy cập
- ✅ Schema đã được khởi tạo
- ✅ Dữ liệu mẫu đã được populate
- ✅ Prisma client đã được generate
- ✅ Ứng dụng có thể kết nối database

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra logs lỗi
2. Chạy script test-connection
3. Kiểm tra PostgreSQL service
4. Xem file DATABASE_SETUP.md để biết chi tiết 