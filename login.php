<?php
session_start();

// Handle login form submission
if ($_POST && isset($_POST['action']) && $_POST['action'] === 'login') {
    header('Content-Type: application/json');
    
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');
    $rememberMe = isset($_POST['rememberMe']);
    
    // Validate input
    if (empty($username) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Username and password are required']);
        exit;
    }
    
    // Read users from JSON file
    $usersFile = 'users.json';
    if (!file_exists($usersFile)) {
        echo json_encode(['success' => false, 'message' => 'User database not found']);
        exit;
    }
    
    $usersJson = file_get_contents($usersFile);
    $users = json_decode($usersJson, true);
    
    if (!$users) {
        echo json_encode(['success' => false, 'message' => 'Error reading user database']);
        exit;
    }
    
    // Check credentials
    $userFound = false;
    foreach ($users as $user) {
        if (($user['username'] === $username || $user['email'] === $username) && 
            password_verify($password, $user['password'])) {
            $userFound = true;
            
            // Set session
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['firstName'] = $user['firstName'];
            $_SESSION['lastName'] = $user['lastName'];
            $_SESSION['department'] = $user['department'];
            
            // Set remember me cookie if requested
            if ($rememberMe) {
                setcookie('remember_user', $user['username'], time() + (30 * 24 * 60 * 60)); // 30 days
            }
            
            echo json_encode(['success' => true, 'message' => 'Login successful']);
            exit;
        }
    }
    
    if (!$userFound) {
        echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
        exit;
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - UM Intramurals</title>
    <link rel="stylesheet" href="css/style.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800&display=swap" rel="stylesheet">
</head>
<body class="auth-page">
    <!-- Navigation -->
    <nav class="navbar" id="navbar">
        <div class="nav-container">
            <div class="nav-logo">
                <i class="fas fa-trophy"></i>
                <span>UM Intramurals</span>
            </div>
            <div class="nav-menu" id="nav-menu">
                <a href="index.html" class="nav-link">Home</a>
                <a href="index.html#sports" class="nav-link">Sports</a>
                <a href="index.html#tournaments" class="nav-link">Tournaments</a>
                <a href="index.html#leaderboard" class="nav-link">Leaderboard</a>
                <a href="login.php" class="nav-link login-btn active">Login</a>
                <a href="register.php" class="nav-link register-btn">Register</a>
            </div>
            <div class="hamburger" id="hamburger">
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
            </div>
        </div>
    </nav>

    <!-- Login Section -->
    <section class="auth-section">
        <div class="auth-container">
            <div class="auth-visual">
                <div class="visual-content">
                    <h2>Welcome Back, Student!</h2>
                    <p>Access your athlete dashboard!</p>                    
                    <div class="quick-stats">
                        <h3><i class="fas fa-chart-line"></i> Live Tournament Stats</h3>
                        <div class="stats-grid">
                            <div class="stat-card">
                                <i class="fas fa-basketball-ball"></i>
                                <div class="stat-info">
                                    <h4>Active Games</h4>
                                    <span class="stat-number">12</span>
                                </div>
                            </div>
                            <div class="stat-card">
                                <i class="fas fa-users"></i>
                                <div class="stat-info">
                                    <h4>Players Online</h4>
                                    <span class="stat-number">234</span>
                                </div>
                            </div>
                            <div class="stat-card">
                                <i class="fas fa-trophy"></i>
                                <div class="stat-info">
                                    <h4>Live Matches</h4>
                                    <span class="stat-number">8</span>
                                </div>
                            </div>
                            <div class="stat-card">
                                <i class="fas fa-medal"></i>
                                <div class="stat-info">
                                    <h4>Today's Finals</h4>
                                    <span class="stat-number">3</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="upcoming-events">
                        <h3><i class="fas fa-calendar-alt"></i> Today's Highlights</h3>
                        <div class="event-list">
                            <div class="event-item">
                                <div class="event-time">2:00 PM</div>
                                <div class="event-details">
                                    <h4>Basketball Finals</h4>
                                    <p>Engineering vs IT Department</p>
                                </div>
                                <div class="event-status live">LIVE</div>
                            </div>
                        </div>
                    </div>

                    <div class="animated-elements">
                        <div class="floating-element trophy">
                            <i class="fas fa-trophy"></i>
                        </div>
                        <div class="floating-element medal">
                            <i class="fas fa-medal"></i>
                        </div>
                        <div class="floating-element star">
                            <i class="fas fa-star"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="auth-form-container">
                <div class="form-wrapper">
                    <div class="form-header">
                        <h1>Sign In</h1>
                        <p>Enter your credentials to access your account</p>
                    </div>
                    <form class="auth-form" id="loginForm">
                        <div class="form-group">
                            <div class="input-wrapper">
                                <i class="fas fa-user input-icon"></i>
                                <input type="text" id="username" name="username" placeholder="Username or Email" required value="<?php echo isset($_COOKIE['remember_user']) ? htmlspecialchars($_COOKIE['remember_user']) : ''; ?>">
                                <label for="username">Username or Email</label>
                            </div>
                            <span class="error-message" id="usernameError"></span>
                        </div>
                        <div class="form-group">
                            <div class="input-wrapper">
                                <i class="fas fa-lock input-icon"></i>
                                <input type="password" id="password" name="password" placeholder="Password" required>
                                <label for="password">Password</label>
                                <i class="fas fa-eye toggle-password" id="togglePassword"></i>
                            </div>
                            <span class="error-message" id="passwordError"></span>
                        </div>
                        <div class="form-options">
                            <label class="checkbox-container">
                                <input type="checkbox" id="rememberMe" name="rememberMe" <?php echo isset($_COOKIE['remember_user']) ? 'checked' : ''; ?>>
                                <span class="checkmark"></span>
                                Remember me
                            </label>
                            <a href="#" class="forgot-password">Forgot Password?</a>
                        </div>
                        <button type="submit" class="btn btn-primary auth-btn">
                            <span class="btn-text">Sign In</span>
                            <i class="fas fa-arrow-right btn-icon"></i>
                        </button>
                        <div class="divider">
                            <span>or</span>
                        </div>
                        <div class="social-login">
                            <button type="button" class="social-btn google-btn">
                                <i class="fab fa-google"></i>
                                Sign in with Google
                            </button>
                            <button type="button" class="social-btn facebook-btn">
                                <i class="fab fa-facebook-f"></i>
                                Sign in with Facebook
                            </button>
                        </div>
                    </form>
                    <div class="auth-footer">
                        <p>Don't have an account? <a href="register.php" class="auth-link">Sign up here</a></p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Success Modal -->
    <div class="modal" id="successModal">
        <div class="modal-content">
            <div class="modal-header">
                <i class="fas fa-check-circle success-icon"></i>
                <h3>Login Successful!</h3>
            </div>
            <div class="modal-body">
                <p>Welcome back! You will be redirected to the homepage in <span id="countdown">3</span> seconds.</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" onclick="redirectToHome()">Go Now</button>
            </div>
        </div>
    </div>

    <script src="js/script.js"></script>
    <script>
        // Enhanced login form handling
        document.getElementById('loginForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            formData.append('action', 'login');
            
            // Show loading state
            const submitBtn = this.querySelector('.auth-btn');
            const btnText = submitBtn.querySelector('.btn-text');
            const originalText = btnText.textContent;
            btnText.textContent = 'Signing In...';
            submitBtn.disabled = true;
            
            try {
                const response = await fetch('login.php', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Show success modal
                    document.getElementById('successModal').style.display = 'block';
                    
                    // Start countdown
                    let countdown = 3;
                    const countdownElement = document.getElementById('countdown');
                    const countdownInterval = setInterval(() => {
                        countdown--;
                        countdownElement.textContent = countdown;
                        if (countdown <= 0) {
                            clearInterval(countdownInterval);
                            window.location.href = 'index.html';
                        }
                    }, 1000);
                } else {
                    // Show error message
                    alert(result.message);
                }
            } catch (error) {
                alert('An error occurred. Please try again.');
            }
            
            // Reset button state
            btnText.textContent = originalText;
            submitBtn.disabled = false;
        });
        
        // Password toggle functionality
        document.getElementById('togglePassword').addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye-slash');
        });
        
        // Redirect function for modal
        function redirectToHome() {
            window.location.href = 'index.html';
        }
        
        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            const modal = document.getElementById('successModal');
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    </script>
</body>
</html>