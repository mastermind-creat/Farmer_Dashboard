<?php
/**
 * Weather API Test Script
 * Access at: http://localhost/Farm_Weather/test_weather_api.php
 */

require_once __DIR__ . '/config/config.php';

echo "<h1>Weather API Test</h1>";
echo "<style>body{font-family:Arial;padding:20px;} .success{color:green;} .error{color:red;} .info{color:blue;} pre{background:#f4f4f4;padding:10px;border-radius:5px;}</style>";

// Display API Key (partially hidden for security)
$api_key = WEATHER_API_KEY;
$masked_key = substr($api_key, 0, 8) . '...' . substr($api_key, -4);
echo "<h2>1. API Configuration</h2>";
echo "<p><strong>API Key:</strong> {$masked_key}</p>";
echo "<p><strong>Full Key:</strong> {$api_key}</p>";

// Test with a known location
$test_location = 'Nairobi';
echo "<h2>2. Testing with Location: {$test_location}</h2>";

$api_url = WEATHER_API_URL . "?q={$test_location}&appid={$api_key}&units=metric";
echo "<p class='info'><strong>API URL:</strong> " . str_replace($api_key, $masked_key, $api_url) . "</p>";

// Make the request
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $api_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curl_error = curl_error($ch);
curl_close($ch);

echo "<h2>3. API Response</h2>";
echo "<p><strong>HTTP Status Code:</strong> {$http_code}</p>";

if ($curl_error) {
    echo "<p class='error'><strong>cURL Error:</strong> {$curl_error}</p>";
}

if ($http_code === 200) {
    echo "<p class='success'>✓ <strong>SUCCESS!</strong> Weather API is working correctly.</p>";
    
    $weather_data = json_decode($response, true);
    
    echo "<h3>Weather Data for {$test_location}:</h3>";
    echo "<ul>";
    echo "<li><strong>Location:</strong> " . ($weather_data['name'] ?? 'N/A') . "</li>";
    echo "<li><strong>Temperature:</strong> " . ($weather_data['main']['temp'] ?? 'N/A') . "°C</li>";
    echo "<li><strong>Humidity:</strong> " . ($weather_data['main']['humidity'] ?? 'N/A') . "%</li>";
    echo "<li><strong>Description:</strong> " . ($weather_data['weather'][0]['description'] ?? 'N/A') . "</li>";
    echo "<li><strong>Wind Speed:</strong> " . ($weather_data['wind']['speed'] ?? 'N/A') . " m/s</li>";
    echo "</ul>";
    
    echo "<h3>Full API Response:</h3>";
    echo "<pre>" . json_encode($weather_data, JSON_PRETTY_PRINT) . "</pre>";
    
} elseif ($http_code === 401) {
    echo "<p class='error'>✗ <strong>ERROR 401: Invalid API Key</strong></p>";
    echo "<p class='info'><strong>Possible reasons:</strong></p>";
    echo "<ul>";
    echo "<li>Your API key is not activated yet (new keys take 10-15 minutes to activate)</li>";
    echo "<li>The API key is incorrect</li>";
    echo "<li>The API key has been revoked or expired</li>";
    echo "</ul>";
    echo "<p class='info'><strong>Solution:</strong></p>";
    echo "<ul>";
    echo "<li>Wait 10-15 minutes if you just created the key</li>";
    echo "<li>Check your OpenWeatherMap dashboard: <a href='https://home.openweathermap.org/api_keys' target='_blank'>https://home.openweathermap.org/api_keys</a></li>";
    echo "<li>Verify the key is copied correctly in config/config.php</li>";
    echo "</ul>";
    
    $error_data = json_decode($response, true);
    echo "<h3>API Error Response:</h3>";
    echo "<pre>" . json_encode($error_data, JSON_PRETTY_PRINT) . "</pre>";
    
} elseif ($http_code === 404) {
    echo "<p class='error'>✗ <strong>ERROR 404: Location Not Found</strong></p>";
    echo "<p>The location '{$test_location}' was not found. Try a different city name.</p>";
    
} elseif ($http_code === 429) {
    echo "<p class='error'>✗ <strong>ERROR 429: Rate Limit Exceeded</strong></p>";
    echo "<p>You've made too many requests. Free tier allows 1,000 calls per day.</p>";
    
} elseif ($http_code === 0) {
    echo "<p class='error'>✗ <strong>ERROR: Cannot Connect to API</strong></p>";
    echo "<p class='info'><strong>Possible reasons:</strong></p>";
    echo "<ul>";
    echo "<li>No internet connection</li>";
    echo "<li>Firewall blocking the request</li>";
    echo "<li>cURL not configured properly</li>";
    echo "</ul>";
    
} else {
    echo "<p class='error'>✗ <strong>ERROR {$http_code}</strong></p>";
    $error_data = json_decode($response, true);
    echo "<h3>API Response:</h3>";
    echo "<pre>" . json_encode($error_data, JSON_PRETTY_PRINT) . "</pre>";
}

echo "<hr>";
echo "<h2>4. Recommendations</h2>";

if ($http_code === 401) {
    echo "<div style='background:#fff3cd;padding:15px;border-radius:5px;border-left:4px solid #ffc107;'>";
    echo "<h3>⏳ API Key Activation Time</h3>";
    echo "<p>New OpenWeatherMap API keys take <strong>10-15 minutes</strong> to activate after creation.</p>";
    echo "<p><strong>What to do:</strong></p>";
    echo "<ol>";
    echo "<li>Wait 10-15 minutes after creating your API key</li>";
    echo "<li>Refresh this page to test again</li>";
    echo "<li>If still not working after 30 minutes, check your OpenWeatherMap account</li>";
    echo "</ol>";
    echo "</div>";
} elseif ($http_code === 200) {
    echo "<div style='background:#d4edda;padding:15px;border-radius:5px;border-left:4px solid #28a745;'>";
    echo "<h3>✅ Everything is Working!</h3>";
    echo "<p>Your API key is active and working correctly. You can now use the dashboard.</p>";
    echo "<p><a href='dashboard.html' style='color:#28a745;font-weight:bold;'>Go to Dashboard →</a></p>";
    echo "</div>";
}

echo "<hr>";
echo "<p><a href='index.html'>← Back to Homepage</a> | <a href='test_connection.php'>System Check</a> | <a href='dashboard.html'>Dashboard →</a></p>";
?>
