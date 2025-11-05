<?php
require_once __DIR__ . '/../config/config.php';

header('Content-Type: application/json');
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');

if (!isLoggedIn()) {
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit();
}

$location = $_GET['location'] ?? '';
$lat = $_GET['lat'] ?? '';
$lon = $_GET['lon'] ?? '';

if (empty($location) && (empty($lat) || empty($lon))) {
    echo json_encode(['success' => false, 'message' => 'Location or coordinates required']);
    exit();
}

// Build API URL
if (!empty($lat) && !empty($lon)) {
    $api_url = WEATHER_API_URL . "?lat={$lat}&lon={$lon}&appid=" . WEATHER_API_KEY . "&units=metric";
} else {
    $api_url = WEATHER_API_URL . "?q={$location}&appid=" . WEATHER_API_KEY . "&units=metric";
}

// Fetch weather data
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $api_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($http_code === 200) {
    $weather_data = json_decode($response, true);
    
    // Format the response
    $formatted_data = [
        'success' => true,
        'location' => $weather_data['name'] ?? 'Unknown',
        'temperature' => round($weather_data['main']['temp'] ?? 0, 1),
        'feels_like' => round($weather_data['main']['feels_like'] ?? 0, 1),
        'humidity' => $weather_data['main']['humidity'] ?? 0,
        'pressure' => $weather_data['main']['pressure'] ?? 0,
        'description' => $weather_data['weather'][0]['description'] ?? 'N/A',
        'icon' => $weather_data['weather'][0]['icon'] ?? '01d',
        'wind_speed' => round($weather_data['wind']['speed'] ?? 0, 1),
        'clouds' => $weather_data['clouds']['all'] ?? 0,
        'rainfall' => isset($weather_data['rain']['1h']) ? $weather_data['rain']['1h'] : 0,
        'coordinates' => [
            'lat' => $weather_data['coord']['lat'] ?? 0,
            'lon' => $weather_data['coord']['lon'] ?? 0
        ]
    ];
    
    echo json_encode($formatted_data);
} else {
    // Decode error response
    $error_data = json_decode($response, true);
    $error_message = 'Failed to fetch weather data.';
    
    // Provide specific error messages based on HTTP code
    if ($http_code === 401) {
        $error_message = 'Invalid API key. Your key might not be activated yet (wait 10-15 minutes) or is incorrect.';
    } elseif ($http_code === 404) {
        $error_message = 'Location not found. Please check the city name or coordinates.';
    } elseif ($http_code === 429) {
        $error_message = 'API rate limit exceeded. Please try again in a few minutes.';
    } elseif ($http_code === 0) {
        $error_message = 'Cannot connect to weather service. Please check your internet connection.';
    } else {
        $error_message .= ' HTTP Code: ' . $http_code;
        if (isset($error_data['message'])) {
            $error_message .= ' - ' . $error_data['message'];
        }
    }
    
    echo json_encode([
        'success' => false, 
        'message' => $error_message,
        'http_code' => $http_code,
        'api_response' => $error_data
    ]);
}
?>
