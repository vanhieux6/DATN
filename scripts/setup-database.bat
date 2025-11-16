@echo off
echo 🚀 Thiết lập database cho Travel App...
echo.

echo 📋 Kiểm tra PostgreSQL...
where psql >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ PostgreSQL chưa được cài đặt
    echo Vui lòng cài đặt PostgreSQL từ: https://www.postgresql.org/download/windows/
    echo.
    pause
    exit /b 1
)

echo ✅ PostgreSQL đã được cài đặt
echo.

echo 📊 Tạo database và user...
echo.

echo 🔑 Kết nối PostgreSQL và tạo database...
echo Nhập mật khẩu cho user postgres khi được yêu cầu:
echo.

REM Tạo file SQL tạm
echo CREATE DATABASE travel_db; > temp_create_db.sql
echo CREATE USER travel_user WITH PASSWORD 'travel123'; >> temp_create_db.sql
echo GRANT ALL PRIVILEGES ON DATABASE travel_db TO travel_user; >> temp_create_db.sql
echo \c travel_db >> temp_create_db.sql
echo GRANT ALL ON SCHEMA public TO travel_user; >> temp_create_db.sql
echo GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO travel_user; >> temp_create_db.sql
echo GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO travel_user; >> temp_create_db.sql
echo ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO travel_user; >> temp_create_db.sql
echo ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO travel_user; >> temp_create_db.sql

REM Chạy script SQL
psql -U postgres -f temp_create_db.sql

REM Xóa file tạm
del temp_create_db.sql

echo.
echo ✅ Database setup hoàn tất!
echo 📊 Database: travel_db
echo 👤 User: travel_user
echo 🔑 Password: travel123
echo 🌐 Port: 5432
echo.
echo 🚀 Bây giờ bạn có thể chạy: npm run db:push
echo.
pause 