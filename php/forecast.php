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

// Build API URL for 7-day forecast
// Note: Free tier OpenWeatherMap only provides 5-day forecast
// For 7-day, you need One Call API 3.0 (requires subscription)
// We'll use 5-day/3-hour forecast and aggregate to daily

$forecast_url = 'https://api.openweathermap.org/data/2.5/forecast';

if (!empty($lat) && !empty($lon)) {
    $api_url = $forecast_url . "?lat={$lat}&lon={$lon}&appid=" . WEATHER_API_KEY . "&units=metric";
} else {
    $api_url = $forecast_url . "?q={$location}&appid=" . WEATHER_API_KEY . "&units=metric";
}

// Fetch forecast data
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $api_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($http_code === 200) {
    $forecast_data = json_decode($response, true);
    
    // Process and aggregate forecast data by day
    $daily_forecast = [];
    
    foreach ($forecast_data['list'] as $item) {
        $date = date('Y-m-d', $item['dt']);
        
        if (!isset($daily_forecast[$date])) {
            $daily_forecast[$date] = [
                'date' => $date,
                'day_name' => date('l', $item['dt']),
                'temps' => [],
                'humidity' => [],
                'rainfall' => 0,
                'descriptions' => [],
                'icons' => []
            ];
        }
        
        $daily_forecast[$date]['temps'][] = $item['main']['temp'];
        $daily_forecast[$date]['humidity'][] = $item['main']['humidity'];
        
        if (isset($item['rain']['3h'])) {
            $daily_forecast[$date]['rainfall'] += $item['rain']['3h'];
        }
        
        $daily_forecast[$date]['descriptions'][] = $item['weather'][0]['description'];
        $daily_forecast[$date]['icons'][] = $item['weather'][0]['icon'];
    }
    
    // Calculate daily averages and most common conditions
    $formatted_forecast = [];
    foreach ($daily_forecast as $date => $data) {
        $temp_min = min($data['temps']);
        $temp_max = max($data['temps']);
        $temp_avg = array_sum($data['temps']) / count($data['temps']);
        $humidity_avg = array_sum($data['humidity']) / count($data['humidity']);
        
        // Get most common description and icon
        $description_counts = array_count_values($data['descriptions']);
        arsort($description_counts);
        $most_common_desc = key($description_counts);
        
        $icon_counts = array_count_values($data['icons']);
        arsort($icon_counts);
        $most_common_icon = key($icon_counts);
        
        $formatted_forecast[] = [
            'date' => $date,
            'day_name' => $data['day_name'],
            'temp_min' => round($temp_min, 1),
            'temp_max' => round($temp_max, 1),
            'temp_avg' => round($temp_avg, 1),
            'humidity' => round($humidity_avg),
            'rainfall' => round($data['rainfall'], 1),
            'description' => $most_common_desc,
            'icon' => $most_common_icon
        ];
    }
    
    // Limit to 7 days
    $formatted_forecast = array_slice($formatted_forecast, 0, 7);
    
    echo json_encode([
        'success' => true,
        'location' => $forecast_data['city']['name'] ?? 'Unknown',
        'forecast' => $formatted_forecast
    ]);
} else {
    $error_data = json_decode($response, true);
    $error_message = 'Failed to fetch forecast data.';
    
    if ($http_code === 401) {
        $error_message = 'Invalid API key. Please check your configuration.';
    } elseif ($http_code === 404) {
        $error_message = 'Location not found.';
    } elseif ($http_code === 429) {
        $error_message = 'API rate limit exceeded.';
    } elseif ($http_code === 0) {
        $error_message = 'Cannot connect to weather service.';
    }
    
    echo json_encode([
        'success' => false, 
        'message' => $error_message,
        'http_code' => $http_code
    ]);
}
?>
