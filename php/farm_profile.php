<?php
require_once __DIR__ . '/../config/config.php';

header('Content-Type: application/json');

if (!isLoggedIn()) {
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit();
}

$action = $_POST['action'] ?? $_GET['action'] ?? '';
$user_id = $_SESSION['user_id'];

if ($action === 'create' || $action === 'update') {
    $farm_name = trim($_POST['farm_name'] ?? '');
    $location = trim($_POST['location'] ?? '');
    $crop_type = trim($_POST['crop_type'] ?? '');
    $soil_type = trim($_POST['soil_type'] ?? '');
    $farm_size = floatval($_POST['farm_size'] ?? 0);
    $latitude = floatval($_POST['latitude'] ?? 0);
    $longitude = floatval($_POST['longitude'] ?? 0);
    
    if (empty($location) || empty($crop_type) || empty($soil_type)) {
        echo json_encode(['success' => false, 'message' => 'Location, crop type, and soil type are required']);
        exit();
    }
    
    $conn = getDBConnection();
    
    // Check if profile exists
    $stmt = $conn->prepare("SELECT id FROM farm_profiles WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $profile_exists = $result->num_rows > 0;
    $stmt->close();
    
    if ($profile_exists) {
        // Update existing profile
        $stmt = $conn->prepare("UPDATE farm_profiles SET farm_name = ?, location = ?, latitude = ?, longitude = ?, crop_type = ?, soil_type = ?, farm_size = ? WHERE user_id = ?");
        $stmt->bind_param("ssddssdi", $farm_name, $location, $latitude, $longitude, $crop_type, $soil_type, $farm_size, $user_id);
    } else {
        // Create new profile
        $stmt = $conn->prepare("INSERT INTO farm_profiles (user_id, farm_name, location, latitude, longitude, crop_type, soil_type, farm_size) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("issddssd", $user_id, $farm_name, $location, $latitude, $longitude, $crop_type, $soil_type, $farm_size);
    }
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Farm profile saved successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to save farm profile']);
    }
    
    $stmt->close();
    $conn->close();
    
} elseif ($action === 'get') {
    $conn = getDBConnection();
    $stmt = $conn->prepare("SELECT * FROM farm_profiles WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $profile = $result->fetch_assoc();
        echo json_encode(['success' => true, 'profile' => $profile]);
    } else {
        echo json_encode(['success' => false, 'message' => 'No farm profile found']);
    }
    
    $stmt->close();
    $conn->close();
    
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid action']);
}
?>
