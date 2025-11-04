<?php
require_once __DIR__ . '/../config/config.php';

header('Content-Type: application/json');

if (!isLoggedIn()) {
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit();
}

$action = $_POST['action'] ?? $_GET['action'] ?? '';
$user_id = $_SESSION['user_id'];

if ($action === 'calculate') {
    $crop_type = $_POST['crop_type'] ?? '';
    $soil_type = $_POST['soil_type'] ?? '';
    $temperature = floatval($_POST['temperature'] ?? 25);
    $humidity = floatval($_POST['humidity'] ?? 50);
    $rainfall = floatval($_POST['rainfall'] ?? 0);
    
    // Crop water requirements (liters per square meter per day)
    $crop_water_needs = [
        'maize' => 5.0,
        'beans' => 4.0,
        'tomatoes' => 6.0,
        'cabbage' => 5.5,
        'potatoes' => 5.0,
        'wheat' => 4.5,
        'rice' => 7.0,
        'vegetables' => 5.0,
        'fruits' => 6.0
    ];
    
    // Soil water retention factor
    $soil_factors = [
        'sandy' => 1.3,      // Sandy soil drains quickly, needs more water
        'loamy' => 1.0,      // Loamy soil is ideal
        'clay' => 0.8,       // Clay retains water well
        'silt' => 0.9
    ];
    
    $base_water_need = $crop_water_needs[strtolower($crop_type)] ?? 5.0;
    $soil_factor = $soil_factors[strtolower($soil_type)] ?? 1.0;
    
    // Calculate water need based on weather conditions
    $temp_factor = 1.0;
    if ($temperature > 30) {
        $temp_factor = 1.3;
    } elseif ($temperature > 25) {
        $temp_factor = 1.15;
    } elseif ($temperature < 15) {
        $temp_factor = 0.8;
    }
    
    $humidity_factor = 1.0;
    if ($humidity < 40) {
        $humidity_factor = 1.2;
    } elseif ($humidity > 70) {
        $humidity_factor = 0.85;
    }
    
    // Calculate recommended water amount
    $recommended_water = $base_water_need * $soil_factor * $temp_factor * $humidity_factor;
    
    // Adjust for rainfall
    $adjusted_water = max(0, $recommended_water - $rainfall);
    
    // Determine irrigation frequency
    $frequency = 'daily';
    if ($adjusted_water < 2) {
        $frequency = 'every 2-3 days';
    } elseif ($adjusted_water > 7) {
        $frequency = 'twice daily';
    }
    
    // Generate recommendation text
    $recommendation = generateRecommendation($adjusted_water, $frequency, $temperature, $humidity, $rainfall, $crop_type, $soil_type);
    
    // Save to irrigation logs
    $conn = getDBConnection();
    $stmt = $conn->prepare("SELECT id FROM farm_profiles WHERE user_id = ? LIMIT 1");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $profile = $result->fetch_assoc();
        $farm_profile_id = $profile['id'];
        $irrigation_date = date('Y-m-d');
        
        $stmt = $conn->prepare("INSERT INTO irrigation_logs (user_id, farm_profile_id, irrigation_date, water_amount, temperature, humidity, rainfall, recommendation) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("iisdddds", $user_id, $farm_profile_id, $irrigation_date, $adjusted_water, $temperature, $humidity, $rainfall, $recommendation);
        $stmt->execute();
    }
    
    $stmt->close();
    $conn->close();
    
    echo json_encode([
        'success' => true,
        'water_amount' => round($adjusted_water, 2),
        'frequency' => $frequency,
        'recommendation' => $recommendation,
        'details' => [
            'base_need' => round($base_water_need, 2),
            'soil_factor' => $soil_factor,
            'temp_factor' => round($temp_factor, 2),
            'humidity_factor' => round($humidity_factor, 2),
            'rainfall_deduction' => round($rainfall, 2)
        ]
    ]);
    
} elseif ($action === 'history') {
    $limit = intval($_GET['limit'] ?? 7);
    
    $conn = getDBConnection();
    $stmt = $conn->prepare("SELECT * FROM irrigation_logs WHERE user_id = ? ORDER BY irrigation_date DESC LIMIT ?");
    $stmt->bind_param("ii", $user_id, $limit);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $logs = [];
    while ($row = $result->fetch_assoc()) {
        $logs[] = $row;
    }
    
    echo json_encode(['success' => true, 'logs' => $logs]);
    
    $stmt->close();
    $conn->close();
    
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid action']);
}

function generateRecommendation($water_amount, $frequency, $temp, $humidity, $rainfall, $crop, $soil) {
    $recommendation = "";
    
    if ($water_amount === 0) {
        $recommendation = "No irrigation needed today due to sufficient rainfall. ";
    } elseif ($water_amount < 2) {
        $recommendation = "Light irrigation recommended. Apply approximately {$water_amount} liters per square meter. ";
    } elseif ($water_amount < 5) {
        $recommendation = "Moderate irrigation needed. Apply approximately {$water_amount} liters per square meter. ";
    } else {
        $recommendation = "Heavy irrigation required. Apply approximately {$water_amount} liters per square meter. ";
    }
    
    $recommendation .= "Irrigation frequency: {$frequency}. ";
    
    if ($temp > 30) {
        $recommendation .= "High temperature detected - consider irrigating during early morning or evening to reduce evaporation. ";
    }
    
    if ($humidity < 40) {
        $recommendation .= "Low humidity levels may increase water loss through evaporation. ";
    }
    
    if ($soil === 'sandy') {
        $recommendation .= "Sandy soil drains quickly - monitor soil moisture regularly. ";
    } elseif ($soil === 'clay') {
        $recommendation .= "Clay soil retains moisture well - avoid overwatering to prevent waterlogging. ";
    }
    
    return $recommendation;
}
?>
