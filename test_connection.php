<?php
/**
 * Connection Test Page
 * Access this at: http://localhost/Farm_Weather/test_connection.php
 */

echo "<h1>Farm Weather Advisory - System Check</h1>";
echo "<style>body{font-family:Arial;padding:20px;} .success{color:green;} .error{color:red;} .info{color:blue;}</style>";

// Test 1: PHP Version
echo "<h2>1. PHP Version</h2>";
if (version_compare(PHP_VERSION, '7.4.0', '>=')) {
    echo "<p class='success'>✓ PHP Version: " . PHP_VERSION . " (OK)</p>";
} else {
    echo "<p class='error'>✗ PHP Version: " . PHP_VERSION . " (Need 7.4+)</p>";
}

// Test 2: Required Extensions
echo "<h2>2. PHP Extensions</h2>";
$extensions = ['mysqli', 'curl', 'json', 'session'];
foreach ($extensions as $ext) {
    if (extension_loaded($ext)) {
        echo "<p class='success'>✓ {$ext} extension loaded</p>";
    } else {
        echo "<p class='error'>✗ {$ext} extension NOT loaded</p>";
    }
}

// Test 3: Config File
echo "<h2>3. Configuration Files</h2>";
if (file_exists(__DIR__ . '/config/config.php')) {
    echo "<p class='success'>✓ config.php exists</p>";
    require_once __DIR__ . '/config/config.php';
} else {
    echo "<p class='error'>✗ config.php NOT found</p>";
}

if (file_exists(__DIR__ . '/config/database.php')) {
    echo "<p class='success'>✓ database.php exists</p>";
} else {
    echo "<p class='error'>✗ database.php NOT found</p>";
}

// Test 4: Database Connection
echo "<h2>4. Database Connection</h2>";
try {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS);
    
    if ($conn->connect_error) {
        echo "<p class='error'>✗ MySQL Connection Failed: " . $conn->connect_error . "</p>";
        echo "<p class='info'>Make sure MySQL is running: sudo /opt/lampp/lampp start</p>";
    } else {
        echo "<p class='success'>✓ MySQL Connection: OK</p>";
        
        // Check if database exists
        $result = $conn->query("SHOW DATABASES LIKE '" . DB_NAME . "'");
        if ($result->num_rows > 0) {
            echo "<p class='success'>✓ Database '" . DB_NAME . "' exists</p>";
            
            // Check tables
            $conn->select_db(DB_NAME);
            $tables = ['users', 'farm_profiles', 'irrigation_logs'];
            foreach ($tables as $table) {
                $result = $conn->query("SHOW TABLES LIKE '{$table}'");
                if ($result->num_rows > 0) {
                    echo "<p class='success'>✓ Table '{$table}' exists</p>";
                } else {
                    echo "<p class='error'>✗ Table '{$table}' NOT found</p>";
                }
            }
        } else {
            echo "<p class='error'>✗ Database '" . DB_NAME . "' does NOT exist</p>";
            echo "<p class='info'>The database will be created automatically on first access to the application.</p>";
        }
    }
    $conn->close();
} catch (Exception $e) {
    echo "<p class='error'>✗ Database Error: " . $e->getMessage() . "</p>";
}

// Test 5: File Permissions
echo "<h2>5. File Permissions</h2>";
$files = [
    'php/auth.php',
    'config/config.php',
    'config/database.php'
];

foreach ($files as $file) {
    $path = __DIR__ . '/' . $file;
    if (file_exists($path)) {
        if (is_readable($path)) {
            echo "<p class='success'>✓ {$file} is readable</p>";
        } else {
            echo "<p class='error'>✗ {$file} is NOT readable</p>";
        }
    } else {
        echo "<p class='error'>✗ {$file} NOT found</p>";
    }
}

// Test 6: Weather API Key
echo "<h2>6. Weather API Configuration</h2>";
if (defined('WEATHER_API_KEY')) {
    if (WEATHER_API_KEY === 'YOUR_API_KEY_HERE') {
        echo "<p class='error'>✗ Weather API key not configured</p>";
        echo "<p class='info'>Get your API key from: https://openweathermap.org/api</p>";
        echo "<p class='info'>Then update config/config.php</p>";
    } else {
        echo "<p class='success'>✓ Weather API key is configured</p>";
    }
} else {
    echo "<p class='error'>✗ WEATHER_API_KEY not defined</p>";
}

// Test 7: Session
echo "<h2>7. Session Support</h2>";
if (session_status() === PHP_SESSION_ACTIVE) {
    echo "<p class='success'>✓ Session is active</p>";
} else {
    echo "<p class='info'>Session not started (this is OK for this test page)</p>";
}

// Summary
echo "<h2>Summary</h2>";
echo "<p><strong>If all tests pass, your system is ready!</strong></p>";
echo "<p>If you see errors above, fix them before trying to register.</p>";
echo "<hr>";
echo "<p><a href='index.html'>← Back to Homepage</a> | <a href='register.html'>Go to Registration →</a></p>";
?>
