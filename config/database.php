<?php
/**
 * Database Configuration
 * Update these settings according to your MySQL setup
 */

define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'farm_weather_db');

// Create connection
function getDBConnection() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    
    return $conn;
}

// Test connection and create database if it doesn't exist
function initializeDatabase() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS);
    
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    
    // Create database if not exists
    $sql = "CREATE DATABASE IF NOT EXISTS " . DB_NAME;
    if ($conn->query($sql) === TRUE) {
        $conn->select_db(DB_NAME);
        
        // Create users table
        $sql = "CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            full_name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            phone VARCHAR(20),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )";
        $conn->query($sql);
        
        // Create farm_profiles table
        $sql = "CREATE TABLE IF NOT EXISTS farm_profiles (
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
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )";
        $conn->query($sql);
        
        // Create irrigation_logs table
        $sql = "CREATE TABLE IF NOT EXISTS irrigation_logs (
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
            FOREIGN KEY (farm_profile_id) REFERENCES farm_profiles(id) ON DELETE CASCADE
        )";
        $conn->query($sql);
    }
    
    $conn->close();
}

// Initialize database on first run
initializeDatabase();
?>
