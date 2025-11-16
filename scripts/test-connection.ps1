# Script kiểm tra kết nối database PostgreSQL
Write-Host "🔍 Kiểm tra kết nối database..." -ForegroundColor Blue

# Kiểm tra biến môi trường
Write-Host "📋 Kiểm tra biến môi trường..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "✅ File .env tồn tại" -ForegroundColor Green
    
    # Đọc DATABASE_URL từ .env
    $envContent = Get-Content ".env"
    $dbUrl = $envContent | Where-Object { $_ -match "DATABASE_URL" }
    
    if ($dbUrl) {
        Write-Host "✅ DATABASE_URL: $dbUrl" -ForegroundColor Green
    } else {
        Write-Host "❌ Không tìm thấy DATABASE_URL trong .env" -ForegroundColor Red
    }
} else {
    Write-Host "❌ File .env không tồn tại" -ForegroundColor Red
}

# Kiểm tra kết nối trực tiếp với PostgreSQL
Write-Host "🔌 Kiểm tra kết nối PostgreSQL..." -ForegroundColor Yellow

try {
    $testConnection = psql -U travel_user -d travel_db -h localhost -c "SELECT version();" 2>$null
    if ($testConnection) {
        Write-Host "✅ Kết nối database thành công!" -ForegroundColor Green
        Write-Host "📊 Thông tin database:" -ForegroundColor Cyan
        Write-Host $testConnection -ForegroundColor White
    } else {
        Write-Host "❌ Không thể kết nối database" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Lỗi kết nối: $_" -ForegroundColor Red
}

# Kiểm tra Prisma
Write-Host "🔧 Kiểm tra Prisma..." -ForegroundColor Yellow

try {
    $prismaVersion = npx prisma --version 2>$null
    if ($prismaVersion) {
        Write-Host "✅ Prisma CLI hoạt động: $prismaVersion" -ForegroundColor Green
    } else {
        Write-Host "❌ Prisma CLI không hoạt động" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Lỗi Prisma: $_" -ForegroundColor Red
}

Write-Host "✅ Kiểm tra hoàn tất!" -ForegroundColor Green 