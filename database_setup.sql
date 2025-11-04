-- Farm Weather Advisory Database Setup
-- This file is for manual database setup if needed
-- The application will create these automatically on first run

-- Create database
CREATE DATABASE IF NOT EXISTS farm_weather_db;
USE farm_weather_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Farm profiles table
CREATE TABLE IF NOT EXISTS farm_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    farm_name VARCHAR(100),
    location VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    crop_type VARCHAR(50) NOT NULL,
    soil_type VARCHAR(50) NOT NULL,
    farm_size DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Irrigation logs table
CREATE TABLE IF NOT EXISTS irrigation_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    farm_profile_id INT NOT NULL,
    irrigation_date DATE NOT NULL,
    water_amount DECIMAL(10, 2),
    temperature DECIMAL(5, 2),
    humidity DECIMAL(5, 2),
    rainfall DECIMAL(10, 2),
    recommendation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (farm_profile_id) REFERENCES farm_profiles(id) ON DELETE CASCADE,
    INDEX idx_user_date (user_id, irrigation_date),
    INDEX idx_irrigation_date (irrigation_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample data (optional - for testing)
-- Uncomment the following lines if you want to insert sample data

/*
-- Sample user (password: password123)
INSERT INTO users (full_name, email, password, phone) VALUES 
('John Farmer', 'john@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+254700000000');

-- Sample farm profile
INSERT INTO farm_profiles (user_id, farm_name, location, latitude, longitude, crop_type, soil_type, farm_size) VALUES 
(1, 'Green Valley Farm', 'Nairobi', -1.286389, 36.817223, 'maize', 'loamy', 5.5);

-- Sample irrigation logs
INSERT INTO irrigation_logs (user_id, farm_profile_id, irrigation_date, water_amount, temperature, humidity, rainfall, recommendation) VALUES 
(1, 1, CURDATE() - INTERVAL 6 DAY, 4.5, 28.5, 55, 0, 'Moderate irrigation needed. Apply approximately 4.5 liters per square meter.'),
(1, 1, CURDATE() - INTERVAL 5 DAY, 5.2, 30.2, 48, 0, 'Moderate irrigation needed. Apply approximately 5.2 liters per square meter.'),
(1, 1, CURDATE() - INTERVAL 4 DAY, 3.8, 26.8, 62, 2, 'Light irrigation recommended. Apply approximately 3.8 liters per square meter.'),
(1, 1, CURDATE() - INTERVAL 3 DAY, 0, 24.5, 75, 15, 'No irrigation needed today due to sufficient rainfall.'),
(1, 1, CURDATE() - INTERVAL 2 DAY, 4.2, 27.3, 58, 0, 'Moderate irrigation needed. Apply approximately 4.2 liters per square meter.'),
(1, 1, CURDATE() - INTERVAL 1 DAY, 5.8, 31.5, 45, 0, 'Heavy irrigation required. Apply approximately 5.8 liters per square meter.'),
(1, 1, CURDATE(), 4.8, 29.0, 52, 0, 'Moderate irrigation needed. Apply approximately 4.8 liters per square meter.');
*/

-- Display tables
SHOW TABLES;

-- Display table structures
DESCRIBE users;
DESCRIBE farm_profiles;
DESCRIBE irrigation_logs;
