<?php
require_once __DIR__ . '/../core/init.php';

header('Content-Type: application/json');

$response = [
    'success' => true,
    'session_id' => session_id(),
    'session_status' => session_status(),
    'session_name' => session_name(),
    'logged_in' => isset($_SESSION['user_id']) && isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true,
    'user_id' => $_SESSION['user_id'] ?? null,
    'username' => $_SESSION['username'] ?? null,
    'session_data' => $_SESSION,
    'cookie_params' => session_get_cookie_params(),
    'server' => [
        'https' => $_SERVER['HTTPS'] ?? 'not set',
        'http_host' => $_SERVER['HTTP_HOST'],
        'request_uri' => $_SERVER['REQUEST_URI'],
        'http_x_forwarded_proto' => $_SERVER['HTTP_X_FORWARDED_PROTO'] ?? 'not set',
    ]
];

echo json_encode($response, JSON_PRETTY_PRINT);