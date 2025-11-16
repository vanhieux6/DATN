@echo off
echo 🔍 Kiểm tra kết nối database...
echo.

echo 📋 Kiểm tra biến môi trường...
if exist ".env" (
    echo ✅ File .env tồn tại
    findstr "DATABASE_URL" .env
) else (
    echo ❌ File .env không tồn tại
)
echo.

echo 🔌 Kiểm tra kết nối PostgreSQL...
echo Thử kết nối với database travel_db...
psql -U travel_user -d travel_db -h localhost -c "SELECT version();" 2>nul
if %errorlevel% equ 0 (
    echo ✅ Kết nối database thành công!
) else (
    echo ❌ Không thể kết nối database
    echo Kiểm tra:
    echo - PostgreSQL service đang chạy
    echo - Database travel_db đã được tạo
    echo - User travel_user có quyền truy cập
)
echo.

echo 🔧 Kiểm tra Prisma...
npx prisma --version >nul 2>nul
if %errorlevel% equ 0 (
    echo ✅ Prisma CLI hoạt động
) else (
    echo ❌ Prisma CLI không hoạt động
    echo Chạy: npm install
)
echo.

echo ✅ Kiểm tra hoàn tất!
echo.
pause 