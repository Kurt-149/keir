<?php
require_once __DIR__ . '/../core/init.php';
require_once __DIR__ . '/database.php';
require_once __DIR__ . '/../core/security.php';

$csrfToken = generateCsrfToken();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forgot Password - SHOPWAVE</title>
    <link rel="stylesheet" href="../design/main-layout.css">
    <link rel="stylesheet" href="../design/web-design/loginPage.css">
</head>
<body>
    <div class="login-wrapper">
        <a href="login-page.php" class="back-home">
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
                <path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z"/>
            </svg>
            Back to Login
        </a>
        <div class="login-container">
            <div class="login-header">
                <h1>Forgot Password</h1>
                <p>Enter your email address and we'll send you a reset link</p>
            </div>
            <div class="login-body">
                <?php
                if (isset($_GET['error'])) {
                    echo "<div class='alert alert-error'>" . htmlspecialchars($_GET['error']) . "</div>";
                } elseif (isset($_GET['success'])) {
                    echo "<div class='alert alert-success'>" . htmlspecialchars($_GET['success']) . "</div>";
                }
                ?>
                <form action="forgot-password-process.php" method="POST">
                    <input type="hidden" name="csrf_token" value="<?php echo htmlspecialchars($csrfToken); ?>">

                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <input type="email" id="email" name="email"
                            placeholder="Enter your registered email"
                            maxlength="100"
                            required>
                    </div>

                    <button type="submit" class="login-btn">Send Reset Link</button>
                </form>
            </div>
            <div class="login-footer">
                <p>Remember your password? <a href="login-page.php">Login</a></p>
            </div>
        </div>
    </div>
</body>
</html>