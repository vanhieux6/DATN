# 🚀 Hướng dẫn nhanh - Thiết lập Database

## ⚡ 3 bước đơn giản

### 1️⃣ Cài đặt PostgreSQL
- Tải từ: https://www.postgresql.org/download/windows/
- Cài đặt với cài đặt mặc định
- **Ghi nhớ mật khẩu postgres!**

### 2️⃣ Thiết lập Database
```bash
# Chạy script tự động
.\scripts\setup-database.bat

# Hoặc chạy thủ công
psql -U postgres -f scripts\setup-database.sql
```

### 3️⃣ Tạo Schema và Data
```bash
# Tạo Prisma client
npm run db:generate

# Đẩy schema lên database
npm run db:push

# Chạy seed data (tùy chọn)
npm run db:seed
```

## 🔍 Kiểm tra kết nối
```bash
.\scripts\test-connection.bat
```

## 📊 Xem Database
```bash
npm run db:studio
```

## ✅ Thành công!
Database đã sẵn sàng với:
- **Database:** `travel_db`
- **User:** `travel_user`
- **Password:** `travel123`
- **Port:** `5432`

---

📖 **Chi tiết đầy đủ:** Xem `DATABASE_SETUP.md` 