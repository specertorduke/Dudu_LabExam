<?php
session_start();

// Handle registration form submission
if ($_POST && isset($_POST['action']) && $_POST['action'] === 'register') {
    header('Content-Type: application/json');
    
    // Get and sanitize input data
    $firstName = trim($_POST['firstName'] ?? '');
    $lastName = trim($_POST['lastName'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $username = trim($_POST['username'] ?? '');
    $department = trim($_POST['department'] ?? '');
    $studentId = trim($_POST['studentId'] ?? '');
    $password = trim($_POST['password'] ?? '');
    $confirmPassword = trim($_POST['confirmPassword'] ?? '');
    $agreeTerms = isset($_POST['agreeTerms']);
    $newsletter = isset($_POST['newsletter']);
    
    // Validation
    $errors = [];
    
    if (empty($firstName)) $errors['firstName'] = 'First name is required';
    if (empty($lastName)) $errors['lastName'] = 'Last name is required';
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'Valid email address is required';
    }
    if (empty($username) || strlen($username) < 3) {
        $errors['username'] = 'Username must be at least 3 characters';
    }
    if (empty($department)) $errors['department'] = 'Department selection is required';
    if (empty($studentId)) $errors['studentId'] = 'Student ID is required';
    if (empty($password) || strlen($password) < 6) {
        $errors['password'] = 'Password must be at least 6 characters';
    }
    if ($password !== $confirmPassword) {
        $errors['confirmPassword'] = 'Passwords do not match';
    }
    if (!$agreeTerms) {
        $errors['agreeTerms'] = 'You must agree to the terms and conditions';
    }
    
    if (!empty($errors)) {
        echo json_encode(['success' => false, 'errors' => $errors]);
        exit;
    }
    
    // Read existing users
    $usersFile = 'users.json';
    $users = [];
    
    if (file_exists($usersFile)) {
        $usersJson = file_get_contents($usersFile);
        $users = json_decode($usersJson, true) ?: [];
    }
    
    // Check for existing username or email
    foreach ($users as $user) {
        if ($user['username'] === $username) {
            echo json_encode(['success' => false, 'errors' => ['username' => 'Username already exists']]);
            exit;
        }
        if ($user['email'] === $email) {
            echo json_encode(['success' => false, 'errors' => ['email' => 'Email already registered']]);
            exit;
        }
        if ($user['studentId'] === $studentId) {
            echo json_encode(['success' => false, 'errors' => ['studentId' => 'Student ID already registered']]);
            exit;
        }
    }
    
    // Create new user
    $newUser = [
        'id' => uniqid('user_', true),
        'firstName' => $firstName,
        'lastName' => $lastName,
        'email' => $email,
        'username' => $username,
        'department' => $department,
        'studentId' => $studentId,
        'password' => password_hash($password, PASSWORD_DEFAULT),
        'newsletter' => $newsletter,
        'registrationDate' => date('Y-m-d H:i:s'),
        'isActive' => true
    ];
    
    // Add user to array and save
    $users[] = $newUser;
    
    if (file_put_contents($usersFile, json_encode($users, JSON_PRETTY_PRINT))) {
        // Set session for auto-login
        $_SESSION['user_id'] = $newUser['id'];
        $_SESSION['username'] = $newUser['username'];
        $_SESSION['firstName'] = $newUser['firstName'];
        $_SESSION['lastName'] = $newUser['lastName'];
        $_SESSION['department'] = $newUser['department'];
        
        echo json_encode(['success' => true, 'message' => 'Registration successful']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to save user data']);
    }
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register - UM Intramurals</title>
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
                <a href="login.php" class="nav-link login-btn">Login</a>
                <a href="register.php" class="nav-link register-btn active">Register</a>
            </div>
            <div class="hamburger" id="hamburger">
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
            </div>
        </div>
    </nav>

    <!-- Register Section -->
    <section class="auth-section">
        <div class="auth-container">
            <div class="auth-visual">
                <div class="visual-content">
                    <h2>Join the Champions League!</h2>
                    <p>Start your athletic journey at the University of Mindanao</p>
                    <div class="benefits-list">
                        <div class="benefit">
                            <i class="fas fa-trophy"></i>
                            <span>Compete in exciting tournaments</span>
                        </div>
                        <div class="benefit">
                            <i class="fas fa-users"></i>
                            <span>Connect with fellow athletes</span>
                        </div>
                        <div class="benefit">
                            <i class="fas fa-medal"></i>
                            <span>Earn recognition and rewards</span>
                        </div>
                    </div>
                    <div class="terms-content">
                        <h3><i class="fas fa-scroll"></i> Terms & Regulations</h3>
                        <div class="terms-section">
                            <h4><i class="fas fa-user-graduate"></i> Eligibility Requirements</h4>
                            <div class="terms-list">
                                <div class="term-item">
                                    <i class="fas fa-check-circle"></i>
                                    <span>Must be a currently enrolled UM student</span>
                                </div>
                                <div class="term-item">
                                    <i class="fas fa-check-circle"></i>
                                    <span>Maintain minimum GPA of 2.5</span>
                                </div>
                                <div class="term-item">
                                    <i class="fas fa-check-circle"></i>
                                    <span>Complete medical clearance</span>
                                </div>
                            </div>
                        </div>

                        <div class="terms-section">
                            <h4><i class="fas fa-clipboard-list"></i> Participation Rules</h4>
                            <div class="terms-list">
                                <div class="term-item">
                                    <i class="fas fa-check-circle"></i>
                                    <span>Attend 90% of team practices</span>
                                </div>
                                <div class="term-item">
                                    <i class="fas fa-check-circle"></i>
                                    <span>Wear proper team uniforms</span>
                                </div>
                                <div class="term-item">
                                    <i class="fas fa-check-circle"></i>
                                    <span>Follow sports code of conduct</span>
                                </div>
                            </div>
                        </div>

                        <div class="terms-section">
                            <h4><i class="fas fa-shield-alt"></i> Code of Conduct</h4>
                            <div class="terms-list">
                                <div class="term-item">
                                    <i class="fas fa-check-circle"></i>
                                    <span>Demonstrate good sportsmanship</span>
                                </div>
                                <div class="term-item">
                                    <i class="fas fa-check-circle"></i>
                                    <span>Respect officials and opponents</span>
                                </div>
                                <div class="term-item">
                                    <i class="fas fa-check-circle"></i>
                                    <span>Zero tolerance for misconduct</span>
                                </div>
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
                        <h1>Create Account</h1>
                        <p>Join thousands of athletes in UM Intramurals</p>
                    </div>
                    <form class="auth-form" id="registerForm">
                        <div class="form-row">
                            <div class="form-group half">
                                <div class="input-wrapper">
                                    <i class="fas fa-user input-icon"></i>
                                    <input type="text" id="firstName" name="firstName" placeholder="First Name" required>
                                    <label for="firstName">First Name</label>
                                </div>
                                <span class="error-message" id="firstNameError"></span>
                            </div>
                            <div class="form-group half">
                                <div class="input-wrapper">
                                    <i class="fas fa-user input-icon"></i>
                                    <input type="text" id="lastName" name="lastName" placeholder="Last Name" required>
                                    <label for="lastName">Last Name</label>
                                </div>
                                <span class="error-message" id="lastNameError"></span>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="input-wrapper">
                                <i class="fas fa-envelope input-icon"></i>
                                <input type="email" id="email" name="email" placeholder="Email Address" required>
                                <label for="email">Email Address</label>
                            </div>
                            <span class="error-message" id="emailError"></span>
                        </div>
                        <div class="form-group">
                            <div class="input-wrapper">
                                <i class="fas fa-user-circle input-icon"></i>
                                <input type="text" id="username" name="username" placeholder="Username" required>
                                <label for="username">Username</label>
                            </div>
                            <span class="error-message" id="usernameError"></span>
                        </div>
                        <div class="form-group">
                            <div class="input-wrapper">
                                <i class="fas fa-graduation-cap input-icon"></i>
                                <select id="department" name="department" required>
                                    <option value="">Select Department</option>
                                    <option value="engineering">College of Engineering</option>
                                    <option value="it">College of Information Technology</option>
                                    <option value="business">College of Business Administration</option>
                                    <option value="arts">College of Arts & Sciences</option>
                                    <option value="education">College of Education</option>
                                    <option value="medicine">College of Medicine</option>
                                    <option value="nursing">College of Nursing</option>
                                </select>
                                <label for="department">Department</label>
                            </div>
                            <span class="error-message" id="departmentError"></span>
                        </div>
                        <div class="form-group">
                            <div class="input-wrapper">
                                <i class="fas fa-id-card input-icon"></i>
                                <input type="text" id="studentId" name="studentId" placeholder="Student ID" required>
                                <label for="studentId">Student ID</label>
                            </div>
                            <span class="error-message" id="studentIdError"></span>
                        </div>
                        <div class="form-row">
                            <div class="form-group half">
                                <div class="input-wrapper">
                                    <i class="fas fa-lock input-icon"></i>
                                    <input type="password" id="password" name="password" placeholder="Password" required>
                                    <label for="password">Password</label>
                                    <i class="fas fa-eye toggle-password" data-target="password"></i>
                                </div>
                                <span class="error-message" id="passwordError"></span>
                            </div>
                            <div class="form-group half">
                                <div class="input-wrapper">
                                    <i class="fas fa-lock input-icon"></i>
                                    <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm Password" required>
                                    <label for="confirmPassword">Confirm Password</label>
                                    <i class="fas fa-eye toggle-password" data-target="confirmPassword"></i>
                                </div>
                                <span class="error-message" id="confirmPasswordError"></span>
                            </div>
                        </div>
                        <div class="form-options">
                            <label class="checkbox-container">
                                <input type="checkbox" id="agreeTerms" name="agreeTerms" required>
                                <span class="checkmark"></span>
                                I agree to the <a href="#" class="terms-link">Terms & Conditions</a>
                            </label>
                            <label class="checkbox-container">
                                <input type="checkbox" id="newsletter" name="newsletter">
                                <span class="checkmark"></span>
                                Subscribe to tournament updates
                            </label>
                        </div>
                        <button type="submit" class="btn btn-primary auth-btn">
                            <span class="btn-text">Create Account</span>
                            <i class="fas fa-arrow-right btn-icon"></i>
                        </button>
                        <div class="divider">
                            <span>or</span>
                        </div>
                        <div class="social-login">
                            <button type="button" class="social-btn google-btn">
                                <i class="fab fa-google"></i>
                                Sign up with Google
                            </button>
                            <button type="button" class="social-btn facebook-btn">
                                <i class="fab fa-facebook-f"></i>
                                Sign up with Facebook
                            </button>
                        </div>
                    </form>
                    <div class="auth-footer">
                        <p>Already have an account? <a href="login.php" class="auth-link">Sign in here</a></p>
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
                <h3>Registration Successful!</h3>
            </div>
            <div class="modal-body">
                <p>Welcome to UM Intramurals! You will be redirected to the homepage in <span id="countdown">3</span> seconds.</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" onclick="redirectToHome()">Go Now</button>
            </div>
        </div>
    </div>

    <script src="js/script.js"></script>
    <script>
        // Enhanced registration form handling
        document.getElementById('registerForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Clear previous errors
            clearErrors();
            
            const formData = new FormData(this);
            formData.append('action', 'register');
            
            // Show loading state
            const submitBtn = this.querySelector('.auth-btn');
            const btnText = submitBtn.querySelector('.btn-text');
            const originalText = btnText.textContent;
            btnText.textContent = 'Creating Account...';
            submitBtn.disabled = true;
            
            try {
                const response = await fetch('register.php', {
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
                    // Handle validation errors
                    if (result.errors) {
                        displayErrors(result.errors);
                    } else {
                        alert(result.message || 'Registration failed. Please try again.');
                    }
                }
            } catch (error) {
                alert('An error occurred. Please try again.');
                console.error('Registration error:', error);
            }
            
            // Reset button state
            btnText.textContent = originalText;
            submitBtn.disabled = false;
        });
        
        // Function to clear all error messages
        function clearErrors() {
            const errorElements = document.querySelectorAll('.error-message');
            errorElements.forEach(element => {
                element.textContent = '';
                element.parentElement.querySelector('.input-wrapper').classList.remove('error');
            });
        }
        
        // Function to display validation errors
        function displayErrors(errors) {
            Object.keys(errors).forEach(field => {
                const errorElement = document.getElementById(field + 'Error');
                const inputWrapper = document.querySelector(`#${field}`).closest('.input-wrapper');
                
                if (errorElement && inputWrapper) {
                    errorElement.textContent = errors[field];
                    inputWrapper.classList.add('error');
                }
            });
        }
        
        // Password toggle functionality
        document.querySelectorAll('.toggle-password').forEach(toggle => {
            toggle.addEventListener('click', function() {
                const targetId = this.getAttribute('data-target');
                const passwordInput = document.getElementById(targetId);
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                this.classList.toggle('fa-eye-slash');
            });
        });
        
        // Real-time password confirmation validation
        document.getElementById('confirmPassword').addEventListener('input', function() {
            const password = document.getElementById('password').value;
            const confirmPassword = this.value;
            const errorElement = document.getElementById('confirmPasswordError');
            const inputWrapper = this.closest('.input-wrapper');
            
            if (confirmPassword && password !== confirmPassword) {
                errorElement.textContent = 'Passwords do not match';
                inputWrapper.classList.add('error');
            } else {
                errorElement.textContent = '';
                inputWrapper.classList.remove('error');
            }
        });
        
        // Username validation (basic)
        document.getElementById('username').addEventListener('blur', function() {
            const username = this.value.trim();
            const errorElement = document.getElementById('usernameError');
            const inputWrapper = this.closest('.input-wrapper');
            
            if (username.length > 0 && username.length < 3) {
                errorElement.textContent = 'Username must be at least 3 characters';
                inputWrapper.classList.add('error');
            } else {
                errorElement.textContent = '';
                inputWrapper.classList.remove('error');
            }
        });
        
        // Email validation
        document.getElementById('email').addEventListener('blur', function() {
            const email = this.value.trim();
            const errorElement = document.getElementById('emailError');
            const inputWrapper = this.closest('.input-wrapper');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (email && !emailRegex.test(email)) {
                errorElement.textContent = 'Please enter a valid email address';
                inputWrapper.classList.add('error');
            } else {
                errorElement.textContent = '';
                inputWrapper.classList.remove('error');
            }
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