// ========================================
// AUTHENTICATION FUNCTIONALITY
// ========================================

// Form validation rules
const validationRules = {
    firstName: {
        required: true,
        minLength: 2,
        pattern: /^[a-zA-Z\s]+$/,
        message: 'First name should contain only letters and be at least 2 characters long'
    },
    lastName: {
        required: true,
        minLength: 2,
        pattern: /^[a-zA-Z\s]+$/,
        message: 'Last name should contain only letters and be at least 2 characters long'
    },
    email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address'
    },
    username: {
        required: true,
        minLength: 3,
        maxLength: 20,
        pattern: /^[a-zA-Z0-9_]+$/,
        message: 'Username should be 3-20 characters long and contain only letters, numbers, and underscores'
    },
    studentId: {
        required: true,
        pattern: /^\d{6}$/,
        message: 'Student ID should be 6 digits (e.g., 123456)'
    },
    department: {
        required: true,
        message: 'Please select your department'
    },
    password: {
        required: true,
        minLength: 8,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_\-#])[A-Za-z\d@$!%*?&_\-#]*$/,
        message: 'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character (@$!%*?&_-#)'
    },
    confirmPassword: {
        required: true,
        matchField: 'password',
        message: 'Passwords do not match'
    },
    agreeTerms: {
        required: true,
        message: 'You must agree to the Terms & Conditions'
    }
};

// ========================================
// FORM VALIDATION FUNCTIONS
// ========================================
function validateField(fieldName, value, formData = {}) {
    const rules = validationRules[fieldName];
    if (!rules) return { isValid: true, message: '' };

    // Convert value to string if it's not already (handles checkboxes and other form elements)
    const stringValue = String(value || '');

    // Check if field is required
    if (rules.required && (!value || stringValue.trim() === '')) {
        return { isValid: false, message: `${fieldName} is required` };
    }

    // Skip other validations if field is empty and not required
    if (!value || stringValue.trim() === '') {
        return { isValid: true, message: '' };
    }

    // Check minimum length
    if (rules.minLength && stringValue.length < rules.minLength) {
        return { isValid: false, message: `${fieldName} must be at least ${rules.minLength} characters long` };
    }

    // Check maximum length
    if (rules.maxLength && stringValue.length > rules.maxLength) {
        return { isValid: false, message: `${fieldName} must not exceed ${rules.maxLength} characters` };
    }

    // Check pattern
    if (rules.pattern && !rules.pattern.test(stringValue)) {
        return { isValid: false, message: rules.message };
    }

    // Check if field matches another field (for confirm password)
    if (rules.matchField && formData[rules.matchField] && stringValue !== String(formData[rules.matchField] || '')) {
        return { isValid: false, message: rules.message };
    }

    // Special validation for checkboxes
    if (fieldName === 'agreeTerms') {
        if (rules.required && !value) {
            return { isValid: false, message: rules.message };
        }
        return { isValid: true, message: '' };
    }

    return { isValid: true, message: '' };
}

function showError(fieldName, message) {
    const errorElement = document.getElementById(`${fieldName}Error`);
    const inputWrapper = document.querySelector(`input[name="${fieldName}"]`)?.closest('.input-wrapper') || 
                        document.querySelector(`select[name="${fieldName}"]`)?.closest('.input-wrapper');
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }

    if (inputWrapper) {
        inputWrapper.querySelector('input, select').style.borderColor = '#e74c3c';
    }
}

function clearError(fieldName) {
    const errorElement = document.getElementById(`${fieldName}Error`);
    const inputWrapper = document.querySelector(`input[name="${fieldName}"]`)?.closest('.input-wrapper') || 
                        document.querySelector(`select[name="${fieldName}"]`)?.closest('.input-wrapper');
    
    if (errorElement) {
        errorElement.classList.remove('show');
        setTimeout(() => {
            errorElement.textContent = '';
        }, 300);
    }

    if (inputWrapper) {
        inputWrapper.querySelector('input, select').style.borderColor = '#e0e0e0';
    }
}

function validateForm(formData, isLogin = false) {
    let isFormValid = true;
    const fieldsToValidate = isLogin ? ['username', 'password'] : 
                           ['firstName', 'lastName', 'email', 'username', 'department', 'studentId', 'password', 'confirmPassword', 'agreeTerms'];

    fieldsToValidate.forEach(fieldName => {
        const validation = validateField(fieldName, formData[fieldName], formData);
        
        if (!validation.isValid) {
            showError(fieldName, validation.message);
            isFormValid = false;
        } else {
            clearError(fieldName);
        }
    });

    return isFormValid;
}

// ========================================
// PASSWORD VISIBILITY TOGGLE
// ========================================
function initPasswordToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.dataset.target || this.closest('.input-wrapper').querySelector('input').id;
            const targetInput = document.getElementById(targetId);
            
            if (targetInput.type === 'password') {
                targetInput.type = 'text';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            } else {
                targetInput.type = 'password';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            }
        });
    });
}

// ========================================
// REAL-TIME VALIDATION
// ========================================
function initRealTimeValidation() {
    const formInputs = document.querySelectorAll('.auth-form input, .auth-form select');
    
    formInputs.forEach(input => {
        // Validate on blur
        input.addEventListener('blur', function() {
            const fieldName = this.name;
            const value = this.type === 'checkbox' ? this.checked : this.value;
            
            // Get all form data for cross-field validation
            const formData = {};
            formInputs.forEach(inp => {
                formData[inp.name] = inp.type === 'checkbox' ? inp.checked : inp.value;
            });
            
            const validation = validateField(fieldName, value, formData);
            
            if (!validation.isValid) {
                showError(fieldName, validation.message);
            } else {
                clearError(fieldName);
            }
        });

        // Clear errors on input
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                clearError(this.name);
            }
        });
    });
}

// ========================================
// ========================================
// FORM SUBMISSION HANDLERS
// ========================================
function handleLogin(formData) {
    console.log('Sending login request with data:', { username: formData.username, password: '[HIDDEN]' });
    
    // Send login request to PHP backend
    return fetch('api/users.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: 'login',
            username: formData.username,
            password: formData.password
        })
    })
    .then(response => {
        console.log('Login response status:', response.status);
        console.log('Login response headers:', response.headers);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Parsed login response data:', data);
        if (data.success) {
            return data;
        } else {
            throw new Error(data.message || 'Login failed');
        }
    })
    .catch(error => {
        console.error('Login error:', error);
        throw error;
    });
}

function handleRegistration(formData) {
    // Send registration request to PHP backend
    return fetch('api/users.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: 'register',
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            username: formData.username,
            studentId: formData.studentId,
            department: formData.department,
            password: formData.password
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            return data;
        } else {
            throw new Error(data.message || 'Registration failed');
        }
    })
    .catch(error => {
        console.error('Registration error:', error);
        throw error;
    });
}

// ========================================
// FORM INITIALIZATION
// ========================================
function initAuthForms() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                username: this.username.value,
                password: this.password.value,
                rememberMe: this.rememberMe?.checked || false
            };

            const isValid = validateForm(formData, true);
            if (!isValid) return;

            // Show loading state
            const submitBtn = this.querySelector('.auth-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
            submitBtn.disabled = true;

            try {
                const result = await handleLogin(formData);
                
                console.log('Login result:', result); // Debug log
                console.log('Result type:', typeof result); // Debug log
                console.log('Result keys:', result ? Object.keys(result) : 'null/undefined'); // Debug log
                
                // Store user data (in real app, use secure storage)
                if (result && result.user) {
                    sessionStorage.setItem('user', JSON.stringify(result.user));
                } else {
                    console.error('Invalid response structure:', result);
                    throw new Error('Invalid response from server');
                }
                if (formData.rememberMe) {
                    localStorage.setItem('rememberedUser', formData.username);
                }

                // Show success modal
                showSuccessModal('Login Successful!', 'Welcome back! You will be redirected to the homepage.');
                
            } catch (error) {
                showError('username', error.message || 'Login failed. Please try again.');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Registration form submission
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                firstName: this.firstName.value,
                lastName: this.lastName.value,
                email: this.email.value,
                username: this.username.value,
                department: this.department.value,
                studentId: this.studentId.value,
                password: this.password.value,
                confirmPassword: this.confirmPassword.value,
                agreeTerms: this.agreeTerms.checked,
                newsletter: this.newsletter?.checked || false
            };

            const isValid = validateForm(formData, false);
            if (!isValid) return;

            // Show loading state
            const submitBtn = this.querySelector('.auth-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
            submitBtn.disabled = true;

            try {
                const result = await handleRegistration(formData);
                
                console.log('Registration result:', result); // Debug log
                console.log('Registration result type:', typeof result); // Debug log
                console.log('Registration result keys:', result ? Object.keys(result) : 'null/undefined'); // Debug log
                
                // Store user data
                if (result && result.user) {
                    sessionStorage.setItem('user', JSON.stringify(result.user));
                } else {
                    console.error('Invalid response structure:', result);
                    throw new Error('Invalid response from server');
                }

                // Show success modal
                showSuccessModal('Registration Successful!', 'Welcome to UM Intramurals! You will be redirected to the homepage.');
                
            } catch (error) {
                const errorMessage = error.message || 'Registration failed. Please try again.';
                if (errorMessage.toLowerCase().includes('username')) {
                    showError('username', errorMessage);
                } else if (errorMessage.toLowerCase().includes('email')) {
                    showError('email', errorMessage);
                } else {
                    showError('firstName', errorMessage);
                }
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

// ========================================
// SUCCESS MODAL
// ========================================
function showSuccessModal(title, message) {
    const modal = document.getElementById('successModal');
    const modalTitle = modal.querySelector('.modal-header h3');
    const modalMessage = modal.querySelector('.modal-body p');
    const countdown = document.getElementById('countdown');
    
    modalTitle.textContent = title;
    modalMessage.innerHTML = message.replace(/(\d+)/, '<span id="countdown">$1</span>');
    
    modal.classList.add('show');
    
    // Countdown redirect
    let timeLeft = 3;
    const countdownInterval = setInterval(() => {
        timeLeft--;
        const countdownElement = document.getElementById('countdown');
        if (countdownElement) {
            countdownElement.textContent = timeLeft;
        }
        
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            redirectToHome();
        }
    }, 1000);
}

function redirectToHome() {
    window.location.href = 'index.html';
}

// ========================================
// SOCIAL LOGIN (Placeholder)
// ========================================
function initSocialLogin() {
    const socialBtns = document.querySelectorAll('.social-btn');
    
    socialBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const provider = this.classList.contains('google-btn') ? 'Google' : 'Facebook';
            
            // In a real application, this would integrate with OAuth providers
            alert(`${provider} login would be implemented here. For demo purposes, this will redirect to the homepage.`);
            
            // Simulate successful social login
            setTimeout(() => {
                sessionStorage.setItem('user', JSON.stringify({
                    username: `${provider.toLowerCase()}User`,
                    firstName: `${provider}`,
                    lastName: 'User',
                    email: `user@${provider.toLowerCase()}.com`,
                    studentId: '999999',
                    department: 'it',
                    role: 'student',
                    provider: provider
                }));
                
                showSuccessModal(`${provider} Login Successful!`, `Welcome! You will be redirected to the homepage.`);
            }, 1000);
        });
    });
}

// ========================================
// AUTO-FILL REMEMBERED USER
// ========================================
function loadRememberedUser() {
    const rememberedUser = localStorage.getItem('rememberedUser');
    const usernameInput = document.querySelector('input[name="username"]');
    const rememberCheckbox = document.querySelector('input[name="rememberMe"]');
    
    if (rememberedUser && usernameInput) {
        usernameInput.value = rememberedUser;
        if (rememberCheckbox) {
            rememberCheckbox.checked = true;
        }
        
        // Focus password field
        const passwordInput = document.querySelector('input[name="password"]');
        if (passwordInput) {
            passwordInput.focus();
        }
    }
}

// ========================================
// STUDENT ID FORMAT HELPER
// ========================================
function initStudentIdFormatter() {
    const studentIdInput = document.querySelector('input[name="studentId"]');
    
    if (studentIdInput) {
        studentIdInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, ''); // Remove non-digits
            
            // Limit to 6 digits
            if (value.length > 6) {
                value = value.substring(0, 6);
            }
            
            this.value = value;
        });
        
        studentIdInput.setAttribute('placeholder', '123456');
        studentIdInput.setAttribute('maxlength', '6');
    }
}

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    initPasswordToggle();
    initRealTimeValidation();
    initAuthForms();
    initSocialLogin();
    loadRememberedUser();
    initStudentIdFormatter();
    
    console.log('Authentication system initialized! 🔐');
});

// ========================================
// UTILITY FUNCTIONS FOR EXTERNAL USE
// ========================================
window.AuthSystem = {
    validateField,
    showError,
    clearError,
    redirectToHome,
    showSuccessModal
};