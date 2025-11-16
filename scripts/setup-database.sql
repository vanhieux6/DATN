-- Script thiết lập database PostgreSQL cho Travel App
-- Chạy script này với user postgres

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

-- Hiển thị thông tin
\dt
\du

-- Thoát
\q 