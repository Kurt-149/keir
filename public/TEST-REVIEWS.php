<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
require_once dirname(__DIR__) . '/authentication/database.php';
$pdo = getPdo();

echo "<h1>Review System Diagnostic</h1>";
echo "<style>
body { font-family: Arial; padding: 20px; }
.success { color: green; }
.error { color: red; }
.info { color: blue; }
table { border-collapse: collapse; width: 100%; margin: 20px 0; }
th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
th { background: #4CAF50; color: white; }
</style>";

// Test 1: Check if logged in
echo "<h2>1. Session Status</h2>";
if (isset($_SESSION['user_id'])) {
    echo "<p class='success'>✅ Logged in as User ID: {$_SESSION['user_id']}</p>";
    echo "<p>Username: {$_SESSION['username']}</p>";
} else {
    echo "<p class='error'>❌ Not logged in</p>";
}

// Test 2: Check reviews table
echo "<h2>2. Reviews in Database</h2>";
try {
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM reviews");
    $total = $stmt->fetch()['total'];
    echo "<p class='success'>✅ Total reviews in database: {$total}</p>";
    
    // Show recent reviews
    $stmt = $pdo->query("
        SELECT r.*, u.username, p.name as product_name
        FROM reviews r
        LEFT JOIN users u ON r.user_id = u.id
        LEFT JOIN products p ON r.product_id = p.id
        ORDER BY r.created_at DESC
        LIMIT 10
    ");
    $reviews = $stmt->fetchAll();
    
    if ($reviews) {
        echo "<table>";
        echo "<tr><th>ID</th><th>Product</th><th>User</th><th>Rating</th><th>Comment</th><th>Status</th><th>Date</th></tr>";
        foreach ($reviews as $r) {
            echo "<tr>";
            echo "<td>{$r['id']}</td>";
            echo "<td>{$r['product_name']}</td>";
            echo "<td>{$r['username']}</td>";
            echo "<td>{$r['rating']} ★</td>";
            echo "<td>" . substr($r['comment'], 0, 50) . "...</td>";
            echo "<td>{$r['status']}</td>";
            echo "<td>{$r['created_at']}</td>";
            echo "</tr>";
        }
        echo "</table>";
    }
} catch (Exception $e) {
    echo "<p class='error'>❌ Error: " . $e->getMessage() . "</p>";
}

// Test 3: Check review_votes table
echo "<h2>3. Review Votes Table</h2>";
try {
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM review_votes");
    $total = $stmt->fetch()['total'];
    echo "<p class='success'>✅ Total votes: {$total}</p>";
} catch (Exception $e) {
    echo "<p class='error'>❌ review_votes table missing or error: " . $e->getMessage() . "</p>";
    echo "<p class='info'>Run the database migration SQL to create this table</p>";
}

// Test 4: Check if current user has reviewed product 1
if (isset($_SESSION['user_id'])) {
    echo "<h2>4. Your Reviews</h2>";
    $stmt = $pdo->prepare("
        SELECT r.*, p.name as product_name
        FROM reviews r
        LEFT JOIN products p ON r.product_id = p.id
        WHERE r.user_id = ?
    ");
    $stmt->execute([$_SESSION['user_id']]);
    $userReviews = $stmt->fetchAll();
    
    if ($userReviews) {
        echo "<p class='success'>✅ You have " . count($userReviews) . " review(s)</p>";
        echo "<table>";
        echo "<tr><th>Product</th><th>Rating</th><th>Comment</th><th>Status</th></tr>";
        foreach ($userReviews as $r) {
            echo "<tr>";
            echo "<td>{$r['product_name']} (ID: {$r['product_id']})</td>";
            echo "<td>{$r['rating']} ★</td>";
            echo "<td>" . htmlspecialchars($r['comment']) . "</td>";
            echo "<td>{$r['status']}</td>";
            echo "</tr>";
        }
        echo "</table>";
    } else {
        echo "<p class='info'>ℹ️ You haven't reviewed any products yet</p>";
    }
}

// Test 5: Check products
echo "<h2>5. Products</h2>";
try {
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM products WHERE status = 'active'");
    $total = $stmt->fetch()['total'];
    echo "<p class='success'>✅ Active products: {$total}</p>";
    
    // Show first 5 products
    $stmt = $pdo->query("SELECT id, name FROM products WHERE status = 'active' LIMIT 5");
    $products = $stmt->fetchAll();
    echo "<ul>";
    foreach ($products as $p) {
        echo "<li><a href='product-details.php?id={$p['id']}'>{$p['name']}</a></li>";
    }
    echo "</ul>";
} catch (Exception $e) {
    echo "<p class='error'>❌ Error: " . $e->getMessage() . "</p>";
}

// Test 6: Check for approved reviews on product 1
echo "<h2>6. Reviews on Product ID 1</h2>";
try {
    $stmt = $pdo->query("
        SELECT r.*, u.username
        FROM reviews r
        LEFT JOIN users u ON r.user_id = u.id
        WHERE r.product_id = 1 AND r.status = 'approved'
    ");
    $productReviews = $stmt->fetchAll();
    
    if ($productReviews) {
        echo "<p class='success'>✅ Product 1 has " . count($productReviews) . " approved review(s)</p>";
        foreach ($productReviews as $r) {
            echo "<div style='border: 1px solid #ddd; padding: 10px; margin: 10px 0;'>";
            echo "<strong>{$r['username']}</strong> - {$r['rating']} ★<br>";
            echo htmlspecialchars($r['comment']);
            echo "</div>";
        }
    } else {
        echo "<p class='info'>ℹ️ No approved reviews for product 1 yet</p>";
    }
} catch (Exception $e) {
    echo "<p class='error'>❌ Error: " . $e->getMessage() . "</p>";
}

echo "<hr>";
echo "<p><strong>Next Steps:</strong></p>";
echo "<ul>";
echo "<li>If reviews exist but don't show on product page → Check detailsbackend.php</li>";
echo "<li>If you can't submit reviews → Check submit-review.php and JavaScript console</li>";
echo "<li>If review_votes table is missing → Run database migration SQL</li>";
echo "</ul>";
?>