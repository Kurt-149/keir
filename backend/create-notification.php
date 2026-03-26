<?php
require_once __DIR__ . '/../core/init.php';
require_once __DIR__ . '/../authentication/database.php';

function createNotification(int $userId, string $type, string $message): bool
{
    $allowed = ['order', 'promo', 'review', 'alert'];
    if (!in_array($type, $allowed, true)) {
        $type = 'alert';
    }

    try {
        $pdo  = getPdo();
        $stmt = $pdo->prepare(
            "INSERT INTO notifications (user_id, type, message) VALUES (?, ?, ?)"
        );
        return $stmt->execute([$userId, $type, $message]);
    } catch (PDOException $e) {
        error_log('[createNotification] ' . $e->getMessage());
        return false;
    }
}