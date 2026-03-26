<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

echo "<h2>🔍 SHOPWAVE Database Debug Tool</h2>";

echo "<h3>Test 1: Loading database.php</h3>";
if (file_exists('database.php')) {
    echo "✅ database.php found<br>";
    require_once 'database.php';
    echo "✅ database.php loaded successfully<br>";
} else {
    echo "❌ database.php not found in current directory<br>";
    echo "Current directory: " . __DIR__ . "<br>";
}

echo "<h3>Test 2: Database Connection</h3>";
try {
    $pdo = getPdo();
    echo "✅ Connected to database successfully!<br>";
    echo "Database: " . $database_name . "<br>";
    echo "Host: " . $host . ":" . $port . "<br>";
} catch (Exception $e) {
    echo "❌ Connection failed: " . $e->getMessage() . "<br>";
}

echo "<h3>Test 3: Users Table Check</h3>";
try {
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM users");
    $result = $stmt->fetch();
    echo "✅ Users table exists with " . $result['count'] . " records<br>";
    
    $stmt = $pdo->query("SELECT id, username, email, role, created_at FROM users LIMIT 5");
    $users = $stmt->fetchAll();
    
    echo "<h4>Sample Users:</h4>";
    echo "<table border='1' cellpadding='5'>";
    echo "<tr><th>ID</th><th>Username</th><th>Email</th><th>Role</th><th>Created</th></tr>";
    foreach ($users as $user) {
        echo "<tr>";
        echo "<td>" . $user['id'] . "</td>";
        echo "<td>" . $user['username'] . "</td>";
        echo "<td>" . $user['email'] . "</td>";
        echo "<td>" . $user['role'] . "</td>";
        echo "<td>" . $user['created_at'] . "</td>";
        echo "</tr>";
    }
    echo "</table>";
    
} catch (Exception $e) {
    echo "❌ Error accessing users table: " . $e->getMessage() . "<br>";
}

echo "<h3>Test 4: Test Login Query</h3>";
try {
    $testUsername = 'rhey';
    $stmt = $pdo->prepare("SELECT id, username, email, password, role FROM users WHERE username = ? OR email = ? LIMIT 1");
    $stmt->execute([$testUsername, $testUsername]);
    $user = $stmt->fetch();
    
    if ($user) {
        echo "✅ User 'rhey' found in database<br>";
        echo "User ID: " . $user['id'] . "<br>";
        echo "Email: " . $user['email'] . "<br>";
        echo "Role: " . $user['role'] . "<br>";
        echo "Password hash: " . substr($user['password'], 0, 20) . "...<br>";
    } else {
        echo "❌ User 'rhey' not found<br>";
    }
} catch (Exception $e) {
    echo "❌ Error in login query: " . $e->getMessage() . "<br>";
}

echo "<h3>Test 5: PHP Extensions</h3>";
$required = ['pdo_mysql', 'session', 'json'];
foreach ($required as $ext) {
    if (extension_loaded($ext)) {
        echo "✅ $ext loaded<br>";
    } else {
        echo "❌ $ext NOT loaded<br>";
    }
}

echo "<h3>Next Steps:</h3>";
echo "1. If all tests pass above, the issue is in login-process.php<br>";
echo "2. Check if session is starting properly<br>";
echo "3. Check if there are any PHP errors in the logs<br>";