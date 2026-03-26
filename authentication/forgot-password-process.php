<?php
session_start();
require_once __DIR__ . '/../core/init.php';
require_once __DIR__ . '/database.php';
require_once __DIR__ . '/../core/security.php';

setSecurityHeaders();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: forgot-password.php");
    exit;
}

if (!validateCsrfToken($_POST['csrf_token'] ?? '')) {
    header("Location: forgot-password.php?error=" . urlencode("Security validation failed"));
    exit;
}

if (!checkRateLimit('forgot_password_' . ($_SERVER['REMOTE_ADDR'] ?? 'unknown'), 3, 600)) {
    header("Location: forgot-password.php?error=" . urlencode("Too many requests. Please try again in 10 minutes."));
    exit;
}

$email = trim($_POST['email'] ?? '');

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header("Location: forgot-password.php?error=" . urlencode("Invalid email address"));
    exit;
}

try {
    $pdo = getPdo();

    $stmt = $pdo->prepare("SELECT id, username FROM users WHERE email = ? LIMIT 1");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user) {
        header("Location: forgot-password.php?success=" . urlencode("If an account exists with that email, you will receive a password reset link."));
        exit;
    }

    $token = bin2hex(random_bytes(32));
    $expiresAt = date('Y-m-d H:i:s', strtotime('+1 hour'));

    $stmt = $pdo->prepare("DELETE FROM password_resets WHERE user_id = ?");
    $stmt->execute([$user['id']]);

    $stmt = $pdo->prepare("
        INSERT INTO password_resets (user_id, email, token, expires_at, created_at)
        VALUES (?, ?, ?, ?, NOW())
    ");
    $stmt->execute([$user['id'], $email, $token, $expiresAt]);
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https://' : 'http://';

    $resetLink = BASE_URL . "/authentication/reset-password.php?token=" . $token;
    error_log("Password reset link for {$email}: {$resetLink}");

    header("Location: forgot-password.php?success=" . urlencode("If an account exists with that email, you will receive a password reset link."));
    exit;
} catch (PDOException $e) {
    error_log("Database error in forgot password: " . $e->getMessage());
    header("Location: forgot-password.php?error=" . urlencode("An error occurred. Please try again."));
    exit;
}