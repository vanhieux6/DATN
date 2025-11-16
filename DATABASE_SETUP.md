# 🗄️ Hướng dẫn thiết lập Database PostgreSQL

## 📋 Yêu cầu hệ thống

- Windows 10/11
- PowerShell
- Node.js và npm

## 🚀 Bước 1: Cài đặt PostgreSQL

### Tự động (khuyến nghị):
```powershell
# Cài đặt Chocolatey trước (nếu chưa có)
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Cài đặt PostgreSQL
choco install postgresql
```

### Thủ công:
1. Truy cập: https://www.postgresql.org/download/windows/
2. Tải phiên bản mới nhất
3. Chạy installer với cài đặt mặc định
4. **Ghi nhớ mật khẩu cho user `postgres`**

## 🔧 Bước 2: Thiết lập Database

### Chạy script tự động:
```powershell
# Chạy script thiết lập database
.\scripts\setup-database.ps1
```

### Hoặc thực hiện thủ công:

1. **Mở PostgreSQL Command Prompt** (từ Start Menu)
2. **Kết nối với PostgreSQL:**
   ```sql
   psql -U postgres
   ```
3. **Tạo database và user:**
   ```sql
   CREATE DATABASE travel_db;
   CREATE USER travel_user WITH PASSWORD 'travel123';
   GRANT ALL PRIVILEGES ON DATABASE travel_db TO travel_user;
   \c travel_db
   GRANT ALL ON SCHEMA public TO travel_user;
   \q
   ```

## 🔍 Bước 3: Kiểm tra kết nối

```powershell
# Kiểm tra kết nối
.\scripts\test-connection.ps1
```

## 🗃️ Bước 4: Tạo Database Schema

```bash
# Tạo Prisma client
npm run db:generate

# Đẩy schema lên database
npm run db:push

# Chạy seed data (tùy chọn)
npm run db:seed
```

## 📊 Cấu trúc Database

Database `travel_db` sẽ chứa các bảng:

- **users** - Thông tin người dùng
- **destinations** - Điểm đến du lịch
- **hotels** - Khách sạn
- **flights** - Chuyến bay
- **packages** - Gói tour
- **activities** - Hoạt động
- **insurance** - Bảo hiểm
- **bookings** - Đặt chỗ

## 🔗 Thông tin kết nối

- **Host:** localhost
- **Port:** 5432
- **Database:** travel_db
- **Username:** travel_user
- **Password:** travel123
- **Connection String:** `postgresql://travel_user:travel123@localhost:5432/travel_db?schema=public&sslmode=disable`

## 🛠️ Lệnh hữu ích

```bash
# Xem database
npm run db:studio

# Tạo migration
npm run db:migrate

# Reset database
npx prisma migrate reset

# Xem logs database
npx prisma db pull
```

## ❗ Xử lý lỗi thường gặp

### Lỗi kết nối:
- Kiểm tra PostgreSQL service đang chạy
- Kiểm tra port 5432 không bị block
- Kiểm tra firewall

### Lỗi quyền:
- Chạy script setup với quyền Administrator
- Kiểm tra user `travel_user` có quyền đầy đủ

### Lỗi Prisma:
- Chạy `npm install` để cài đặt dependencies
- Chạy `npx prisma generate` để tạo client

## 📞 Hỗ trợ

Nếu gặp vấn đề, hãy kiểm tra:
1. PostgreSQL service status
2. File `.env` có đúng thông tin
3. Quyền truy cập database
4. Logs lỗi chi tiết 