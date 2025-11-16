@echo off
echo 🗄️ Khởi tạo Database Schema với Prisma...
echo.

echo 📋 Kiểm tra Prisma...
npx prisma --version >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Prisma CLI không hoạt động
    echo Chạy: npm install
    pause
    exit /b 1
)
echo ✅ Prisma CLI hoạt động
echo.

echo 🔧 Tạo Prisma Client...
npx prisma generate
if %errorlevel% neq 0 (
    echo ❌ Lỗi tạo Prisma Client
    pause
    exit /b 1
)
echo ✅ Prisma Client đã được tạo
echo.

echo 🚀 Đẩy schema lên database...
echo Kiểm tra kết nối database...
npx prisma db push
if %errorlevel% neq 0 (
    echo ❌ Lỗi đẩy schema lên database
    echo Kiểm tra:
    echo - PostgreSQL service đang chạy
    echo - Database travel_db đã được tạo
    echo - User travel_user có quyền truy cập
    echo - File .env có đúng DATABASE_URL
    pause
    exit /b 1
)
echo ✅ Schema đã được đẩy lên database
echo.

echo 🌱 Chạy seed data...
echo Bạn có muốn chạy seed data không? (y/n)
set /p choice=
if /i "%choice%"=="y" (
    echo Chạy seed data...
    npm run db:seed
    if %errorlevel% neq 0 (
        echo ❌ Lỗi chạy seed data
    ) else (
        echo ✅ Seed data đã được chạy
    )
) else (
    echo Bỏ qua seed data
)
echo.

echo 🎉 Khởi tạo database hoàn tất!
echo.
echo 📊 Xem database với Prisma Studio:
echo npm run db:studio
echo.
echo 🔍 Kiểm tra kết nối:
echo .\scripts\test-connection.bat
echo.
pause 