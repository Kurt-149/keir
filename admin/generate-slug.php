<?php
// FIX: Removed session_start() here. init.php loads session-handler.php which
// starts the session with the correct DB handler and cookie params.
require_once dirname(__DIR__) . '/core/init.php';
require_once dirname(__DIR__) . '/authentication/database.php';
require_once dirname(__DIR__) . '/core/slug-helper.php';

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    die('<h1>Unauthorized</h1><p>Admin access required.</p>');
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generate Product Slugs</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; max-width: 900px; margin: 0 auto; }
        .success { color: green; }
        .error   { color: red; }
        .info    { color: blue; }
        .product { padding: 10px; border-bottom: 1px solid #ddd; }
        .btn     { padding: 10px 20px; background: #3b82f6; color: white; border: none; cursor: pointer; }
    </style>
</head>
<body>
    <h1>Generate Product Slugs</h1>
    <p>This will create SEO-friendly URLs for all your products.</p>

    <?php
    if (isset($_POST['generate'])) {
        echo "<hr><h2>Processing...</h2>";

        $pdo = getPdo(); // FIX: was using global $pdo directly

        $stmt    = $pdo->query("
            SELECT p.id, p.name, p.slug, c.name as category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            ORDER BY p.id ASC
        ");
        $products = $stmt->fetchAll();

        $updated = 0;
        $skipped = 0;

        foreach ($products as $product) {
            echo "<div class='product'>";

            if (!empty($product['slug']) && !isset($_POST['force'])) {
                echo "<span class='info'>⏭️ Skipped:</span> {$product['name']} ";
                echo "<em>(already has slug: {$product['slug']})</em>";
                $skipped++;
            } else {
                $categorySlug = $product['category_name']
                    ? generateCategorySlug($product['category_name'])
                    : '';

                $slug = generateProductSlug($product['name'], $product['id'], $categorySlug);

                try {
                    $pdo->prepare("UPDATE products SET slug = ? WHERE id = ?")
                        ->execute([$slug, $product['id']]);
                    echo "<span class='success'>✅ Generated:</span> {$product['name']} → <strong>$slug</strong>";
                    $updated++;
                } catch (PDOException $e) {
                    echo "<span class='error'>Error:</span> {$product['name']} - {$e->getMessage()}";
                }
            }

            echo "</div>";
        }

        echo "<hr>";
        echo "<h2>Summary</h2>";
        echo "<p class='success'>✅ Updated: $updated products</p>";
        echo "<p class='info'>⏭️ Skipped: $skipped products</p>";
        echo "<p><a href='products.php'>← Back to Products</a></p>";

    } else {
    ?>
        <form method="POST">
            <p>
                <label>
                    <input type="checkbox" name="force" value="1">
                    Force regenerate ALL slugs (even if they already exist)
                </label>
            </p>
            <button type="submit" name="generate" class="btn">🚀 Generate Slugs Now</button>
        </form>
        <p><a href="products.php">← Back to Products</a></p>
    <?php
    }
    ?>
</body>
</html>
