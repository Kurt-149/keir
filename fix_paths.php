<?php
$files_to_fix = [
    // Root files
    'index.php',
    
    // Public files
    'public/shop.php',
    'public/cart.php',
    'public/checkout.php',
    'public/product-details.php',
    'public/me-page.php',
    'public/order-success.php',
    'public/product-redirect.php',
    'public/TEST-REVIEWS.php',
    
    // Admin files
    'admin/reviews.php',
    'admin/addProducts.php',
    'admin/analytics.php',
    'admin/categories.php',
    'admin/customers.php',
    'admin/dashboard.php',
    'admin/editProducts.php',
    'admin/generate-codes.php',
    'admin/generate-slug.php',
    'admin/orders.php',
    'admin/orders-details.php',
    'admin/products.php',
    'admin/settings.php',
    'admin/delete-review-admin.php',
];

foreach ($files_to_fix as $file) {
    $path = __DIR__ . '/' . $file;
    if (!file_exists($path)) {
        echo "❌ File not found: $file\n";
        continue;
    }
    
    $content = file_get_contents($path);
    $original = $content;
    
    // Fix root index.php specially
    if ($file === 'index.php') {
        $content = str_replace(
            "require_once __DIR__ . '/../core/init.php';",
            "require_once __DIR__ . '/core/init.php';",
            $content
        );
    } else {
        // For all other files
        $content = str_replace(
            "__DIR__ . '/../core/",
            "dirname(__DIR__) . '/core/",
            $content
        );
        $content = str_replace(
            "__DIR__ . '/../authentication/",
            "dirname(__DIR__) . '/authentication/",
            $content
        );
        $content = str_replace(
            "__DIR__ . '/../backend/",
            "dirname(__DIR__) . '/backend/",
            $content
        );
    }
    
    if ($content !== $original) {
        file_put_contents($path, $content);
        echo "✅ Fixed: $file\n";
    } else {
        echo "⏭️ No changes needed: $file\n";
    }
}

echo "\n🎉 All done! Your paths are now fixed.\n";