<?php
require_once __DIR__ . '/core/init.php';

echo "<h1>🔍 Session Debug Tool</h1>";

echo "<h2>Session Information</h2>";
echo "<pre>";
echo "Session ID: " . session_id() . "\n";
echo "Session Name: " . session_name() . "\n";
echo "Session Status: " . session_status() . "\n";
echo "Session Save Path: " . session_save_path() . "\n";
echo "Session Cookie Params:\n";
print_r(session_get_cookie_params());
echo "\n\nSession Data:\n";
print_r($_SESSION);
echo "</pre>";

echo "<h2>Server Information</h2>";
echo "<pre>";
echo "HTTPS: " . ($_SERVER['HTTPS'] ?? 'not set') . "\n";
echo "HTTP_X_FORWARDED_PROTO: " . ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? 'not set') . "\n";
echo "HTTP_HOST: " . $_SERVER['HTTP_HOST'] . "\n";
echo "REQUEST_URI: " . $_SERVER['REQUEST_URI'] . "\n";
echo "SCRIPT_NAME: " . $_SERVER['SCRIPT_NAME'] . "\n";
echo "</pre>";

echo "<h2>Actions</h2>";
echo '<p><a href="?action=set">Set Test Session</a> | ';
echo '<a href="?action=clear">Clear Session</a> | ';
echo '<a href="?action=destroy">Destroy Session</a> | ';
echo '<a href="?action=check">Check Login Status</a></p>';

if (isset($_GET['action'])) {
    switch ($_GET['action']) {
        case 'set':
            $_SESSION['test'] = 'Session is working at ' . date('Y-m-d H:i:s');
            $_SESSION['user_id'] = 999;
            $_SESSION['logged_in'] = true;
            echo "<p style='color:green'>✓ Test session set!</p>";
            break;
        case 'clear':
            $_SESSION = [];
            echo "<p style='color:orange'>Session cleared!</p>";
            break;
        case 'destroy':
            session_destroy();
            echo "<p style='color:red'>Session destroyed!</p>";
            echo '<script>setTimeout(function(){ window.location.href="session-debug.php"; }, 2000);</script>';
            break;
        case 'check':
            if (isset($_SESSION['user_id']) && isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true) {
                echo "<p style='color:green'>✓ User is logged in (ID: " . $_SESSION['user_id'] . ")</p>";
            } else {
                echo "<p style='color:red'>✗ User is NOT logged in</p>";
            }
            break;
    }
}