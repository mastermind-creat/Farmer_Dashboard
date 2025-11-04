<?php
/**
 * Application Configuration
 */

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// OpenWeatherMap API Configuration
define('WEATHER_API_KEY', '23e185ce712128574bc2ec9317bf4e51'); // OpenWeatherMap Free API Key
define('WEATHER_API_URL', 'https://api.openweathermap.org/data/2.5/weather');

// Application Settings
define('APP_NAME', 'Farm Weather Advisory');
define('APP_URL', 'http://localhost/Farm_Weather');

// Timezone
date_default_timezone_set('Africa/Nairobi');

// Include database configuration
require_once __DIR__ . '/database.php';

// Helper function to check if user is logged in
function isLoggedIn() {
    return isset($_SESSION['user_id']);
}

// Helper function to redirect
function redirect($page) {
    header("Location: " . APP_URL . "/" . $page);
    exit();
}

// Helper function to get current user
function getCurrentUser() {
    if (!isLoggedIn()) {
        return null;
    }
    
    $conn = getDBConnection();
    $user_id = $_SESSION['user_id'];
    $stmt = $conn->prepare("SELECT id, full_name, email, phone FROM users WHERE id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $stmt->close();
    $conn->close();
    
    return $user;
}
?>
