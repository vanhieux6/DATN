# Script thiết lập database PostgreSQL cho Travel App
# Chạy script này sau khi cài đặt PostgreSQL

Write-Host "🚀 Thiết lập database cho Travel App..." -ForegroundColor Green

# Kiểm tra PostgreSQL đã được cài đặt chưa
try {
    $pgVersion = psql --version 2>$null
    if ($pgVersion) {
        Write-Host "✅ PostgreSQL đã được cài đặt: $pgVersion" -ForegroundColor Green
    } else {
        Write-Host "❌ PostgreSQL chưa được cài đặt" -ForegroundColor Red
        Write-Host "Vui lòng cài đặt PostgreSQL từ: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "❌ PostgreSQL chưa được cài đặt" -ForegroundColor Red
    Write-Host "Vui lòng cài đặt PostgreSQL từ: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    exit 1
}

# Tạo database và user
Write-Host "📊 Tạo database và user..." -ForegroundColor Blue

# Kết nối PostgreSQL và tạo database
$createDbScript = @"
-- Tạo database
CREATE DATABASE travel_db;

-- Tạo user
CREATE USER travel_user WITH PASSWORD 'travel123';

-- Cấp quyền cho user
GRANT ALL PRIVILEGES ON DATABASE travel_db TO travel_user;

-- Kết nối vào database travel_db
\c travel_db;

-- Cấp quyền schema public
GRANT ALL ON SCHEMA public TO travel_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO travel_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO travel_user;

-- Cấp quyền cho các bảng tương lai
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO travel_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO travel_user;
"@

# Lưu script vào file tạm
$createDbScript | Out-File -FilePath "temp_create_db.sql" -Encoding UTF8

Write-Host "🔑 Chạy script tạo database..." -ForegroundColor Blue
Write-Host "Nhập mật khẩu cho user postgres khi được yêu cầu:" -ForegroundColor Yellow

# Chạy script tạo database
psql -U postgres -f "temp_create_db.sql"

# Xóa file tạm
Remove-Item "temp_create_db.sql"

Write-Host "✅ Database setup hoàn tất!" -ForegroundColor Green
Write-Host "📊 Database: travel_db" -ForegroundColor Cyan
Write-Host "👤 User: travel_user" -ForegroundColor Cyan
Write-Host "🔑 Password: travel123" -ForegroundColor Cyan
Write-Host "🌐 Port: 5432" -ForegroundColor Cyan

Write-Host "🚀 Bây giờ bạn có thể chạy: npm run db:push" -ForegroundColor Green 