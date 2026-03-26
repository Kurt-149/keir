<?php
// Auto-detect environment
$isLocalhost = in_array($_SERVER['REMOTE_ADDR'] ?? '', ['127.0.0.1', '::1']) || 
               strpos($_SERVER['HTTP_HOST'] ?? '', 'localhost') !== false;

if ($isLocalhost) {
    $host = "localhost";
    $database_name = "shopwave_db";  
    $user = "root";                   
    $port = 3307;                     
    $password = "keir_09";                   
} else {
    $host = "sql100.infinityfree.com";  
    $database_name = "if0_41125989_shopwave_db"; 
    $user = "if0_41125989";         
    $port = 3306;
    $password = "kUdoiZbiNH";              
}

$charset = "utf8mb4";
$dsn = "mysql:host=$host;port=$port;dbname=$database_name;charset=$charset";

$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
    PDO::ATTR_PERSISTENT => false,
    PDO::ATTR_TIMEOUT => 30, // Increased timeout
];

try {
    $pdo = new PDO($dsn, $user, $password, $options);
    $pdo->exec("SET NAMES utf8mb4");
} catch (PDOException $e) {
    error_log("Database connection failed: " . $e->getMessage());
    
    if ($isLocalhost) {
        // On localhost, show error for debugging
        die("Database connection failed: " . $e->getMessage());
    } else {
        // On live, show generic message
        die("Site under maintenance. Please try again later.");
    }
}

function getPdo() {
    global $pdo;
    
    // Test connection
    try {
        $pdo->query("SELECT 1");
        return $pdo;
    } catch (Exception $e) {
        error_log("Connection lost, attempting to reconnect: " . $e->getMessage());
        
        // Try to reconnect once
        try {
            global $dsn, $user, $password, $options;
            $pdo = new PDO($dsn, $user, $password, $options);
            return $pdo;
        } catch (Exception $e2) {
            error_log("Reconnection failed: " . $e2->getMessage());
            return null;
        }
    }
}

// Helper functions
function isLoggedIn() {
    return isset($_SESSION['user_id'], $_SESSION['logged_in']) && $_SESSION['logged_in'] === true;
}

function getCurrentUserId() {
    return $_SESSION['user_id'] ?? 0;
}

function getCurrentUserRole() {
    return $_SESSION['role'] ?? 'guest';
}