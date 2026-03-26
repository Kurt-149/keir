<?php
require_once __DIR__ . '/../core/init.php';
require_once __DIR__ . '/../core/session-handler.php';
require_once __DIR__ . '/../authentication/database.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'], $_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$userId  = (int) $_SESSION['user_id'];
$page    = max(1, (int) ($_GET['page']    ?? 1));
$perPage = max(1, min(50, (int) ($_GET['per_page'] ?? 10)));
$offset  = ($page - 1) * $perPage;

try {
    $pdo = getPdo();

    $countStmt = $pdo->prepare("SELECT COUNT(*) FROM notifications WHERE user_id = ?");
    $countStmt->execute([$userId]);
    $total = (int) $countStmt->fetchColumn();

    $stmt = $pdo->prepare(
        "SELECT id, type, message, is_read, created_at
         FROM notifications
         WHERE user_id = ?
         ORDER BY created_at DESC
         LIMIT ? OFFSET ?"
    );
    $stmt->execute([$userId, $perPage, $offset]);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $notifications = array_map(function ($n) {
        $diff = (new DateTime())->diff(new DateTime($n['created_at']));
        if ($diff->y)      $ago = $diff->y . ' year'  . ($diff->y  > 1 ? 's' : '') . ' ago';
        elseif ($diff->m)  $ago = $diff->m . ' month' . ($diff->m  > 1 ? 's' : '') . ' ago';
        elseif ($diff->d)  $ago = $diff->d . ' day'   . ($diff->d  > 1 ? 's' : '') . ' ago';
        elseif ($diff->h)  $ago = $diff->h . ' hour'  . ($diff->h  > 1 ? 's' : '') . ' ago';
        elseif ($diff->i)  $ago = $diff->i . ' min'   . ($diff->i  > 1 ? 's' : '') . ' ago';
        else               $ago = 'Just now';

        return [
            'id'         => (int) $n['id'],
            'type'       => $n['type'],
            'message'    => $n['message'],
            'is_read'    => (bool) $n['is_read'],
            'time_ago'   => $ago,
            'created_at' => $n['created_at'],
        ];
    }, $rows);

    echo json_encode([
        'success'       => true,
        'notifications' => $notifications,
        'pagination'    => [
            'current_page'        => $page,
            'per_page'            => $perPage,
            'total_notifications' => $total,
            'total_pages'         => (int) ceil($total / $perPage),
        ],
    ]);

} catch (PDOException $e) {
    error_log('[get-notifications] ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Database error']);
}