// ========================================
// GLOBAL VARIABLES AND UTILITIES
// ========================================
let isScrolling = false;
let currentUser = null;

// Smooth scrolling utility function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// ========================================
// USER SESSION MANAGEMENT
// ========================================
function checkUserSession() {
    // Check if user is logged in
    const userData = sessionStorage.getItem('user');
    if (userData) {
        currentUser = JSON.parse(userData);
        updateNavigationForLoggedInUser();
        return true;
    }
    return false;
}

function updateNavigationForLoggedInUser() {
    const navMenu = document.getElementById('nav-menu');
    const loginBtn = navMenu.querySelector('.login-btn');
    const registerBtn = navMenu.querySelector('.register-btn');
    
    if (currentUser && loginBtn && registerBtn) {
        // Create user info dropdown
        const userDropdown = createUserDropdown();
        
        // Replace login and register buttons with user dropdown
        loginBtn.replaceWith(userDropdown);
        registerBtn.remove();
        
        // Update hero section for logged-in user
        updateHeroForLoggedInUser();
    }
}

function updateHeroForLoggedInUser() {
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroButtons = document.querySelector('.hero-buttons');
    
    if (heroSubtitle && currentUser) {
        // Add personalized welcome message
        const welcomeMessage = document.createElement('div');
        welcomeMessage.className = 'welcome-message';
        welcomeMessage.innerHTML = `
            <div class="welcome-content">
                <h3>Welcome back, ${currentUser.firstName || currentUser.username}! 🏆</h3>
                <p>Ready to dominate the ${getDepartmentShortName(currentUser.department)} tournaments?</p>
                <div class="user-stats">
                    <div class="stat-item">
                        <i class="fas fa-id-card"></i>
                        <span>ID: ${currentUser.studentId}</span>
                    </div>
                    <div class="stat-item">
                        <i class="fas fa-graduation-cap"></i>
                        <span>${getDepartmentShortName(currentUser.department)}</span>
                    </div>
                </div>
            </div>
        `;
        
        // Insert welcome message before hero buttons
        heroButtons.parentNode.insertBefore(welcomeMessage, heroButtons);
        
        // Update button text for logged-in user
        const primaryBtn = heroButtons.querySelector('.btn-primary .btn-text') || 
                          heroButtons.querySelector('.btn-primary');
        if (primaryBtn) {
            primaryBtn.innerHTML = '<i class="fas fa-trophy"></i> View My Dashboard';
        }
    }
}

function getDepartmentShortName(dept) {
    const departments = {
        'engineering': 'CEE',
        'it': 'CCE',
        'business': 'CBAE',
        'arts': 'CASE',
        'education': 'CTE',
        'medicine': 'CFAE',
        'nursing': 'CCJE',
        'administration': 'Admin'
    };
    return departments[dept] || 'UM';
}

function createUserDropdown() {
    const dropdown = document.createElement('div');
    dropdown.className = 'user-dropdown';
    dropdown.innerHTML = `
        <div class="user-info" onclick="toggleDropdown()">
            <div class="user-avatar">
                <i class="fas fa-user-circle"></i>
            </div>
            <div class="user-details">
                <span class="user-name">${currentUser.firstName || currentUser.username}</span>
                <span class="user-role">${getDepartmentShortName(currentUser.department) || 'Student'}</span>
            </div>
            <i class="fas fa-chevron-down dropdown-arrow"></i>
        </div>
        <div class="dropdown-menu" id="userDropdownMenu">
            <div class="dropdown-header">
                <div class="user-full-info">
                    <h4>${(currentUser.firstName && currentUser.lastName) ? 
                        `${currentUser.firstName} ${currentUser.lastName}` : 
                        currentUser.username}</h4>
                    <p>ID: ${currentUser.studentId || 'N/A'}</p>
                    <p>${currentUser.email || ''}</p>
                    <p>${getDepartmentFullName(currentUser.department) || ''}</p>
                </div>
            </div>
            <div class="dropdown-divider"></div>
            <a href="#" class="dropdown-item" onclick="viewProfile()">
                <i class="fas fa-user"></i>
                <span>My Profile</span>
            </a>
            <a href="#" class="dropdown-item" onclick="viewMyTournaments()">
                <i class="fas fa-trophy"></i>
                <span>My Tournaments</span>
            </a>
            <a href="#" class="dropdown-item" onclick="viewSettings()">
                <i class="fas fa-cog"></i>
                <span>Settings</span>
            </a>
            <div class="dropdown-divider"></div>
            <a href="#" class="dropdown-item logout-item" onclick="logout()">
                <i class="fas fa-sign-out-alt"></i>
                <span>Sign Out</span>
            </a>
        </div>
    `;
    return dropdown;
}

function getDepartmentFullName(dept) {
    const departments = {
        'engineering': 'College of Engineering (CEE)',
        'it': 'College of Computing (CCE)',
        'business': 'College of Business Administration (CBAE)',
        'arts': 'College of Arts & Sciences (CASE)',
        'education': 'College of Teaching (CTE)',
        'medicine': 'College of Fine Arts (CFAE)',
        'nursing': 'College of Criminal Justice (CCJE)'
    };
    return departments[dept] || dept;
}

function toggleDropdown() {
    const dropdownMenu = document.getElementById('userDropdownMenu');
    const dropdown = document.querySelector('.user-dropdown');
    const arrow = dropdown.querySelector('.dropdown-arrow');
    
    if (dropdownMenu.classList.contains('show')) {
        dropdownMenu.classList.remove('show');
        arrow.style.transform = 'rotate(0deg)';
    } else {
        dropdownMenu.classList.add('show');
        arrow.style.transform = 'rotate(180deg)';
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = document.querySelector('.user-dropdown');
    if (dropdown && !dropdown.contains(event.target)) {
        const dropdownMenu = document.getElementById('userDropdownMenu');
        const arrow = dropdown.querySelector('.dropdown-arrow');
        if (dropdownMenu) {
            dropdownMenu.classList.remove('show');
            arrow.style.transform = 'rotate(0deg)';
        }
    }
});

// User actions
function viewProfile() {
    alert('Profile page would be shown here with detailed user information and statistics.');
}

function viewMyTournaments() {
    alert('My Tournaments page would show user\'s registered tournaments, match history, and achievements.');
}

function viewSettings() {
    alert('Settings page would allow users to update their profile, change password, and set preferences.');
}

function logout() {
    if (confirm('Are you sure you want to sign out?')) {
        // Clear session data
        sessionStorage.removeItem('user');
        localStorage.removeItem('rememberedUser');
        currentUser = null;
        
        // Show success message
        showLogoutMessage();
        
        // Redirect to home page after a short delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }
}

function showLogoutMessage() {
    // Create temporary message
    const message = document.createElement('div');
    message.className = 'logout-message';
    message.innerHTML = `
        <div class="message-content">
            <i class="fas fa-check-circle"></i>
            <p>You have been successfully signed out!</p>
        </div>
    `;
    document.body.appendChild(message);
    
    // Remove message after animation
    setTimeout(() => {
        message.remove();
    }, 2500);
}

// ========================================
// NAVIGATION FUNCTIONALITY
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    hamburger?.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Animate hamburger bars
        const bars = hamburger.querySelectorAll('.bar');
        if (hamburger.classList.contains('active')) {
            bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
            
            // Reset hamburger animation
            const bars = hamburger?.querySelectorAll('.bar');
            if (bars) {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
    });

    // Navbar scroll effect
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        if (!isScrolling) {
            window.requestAnimationFrame(function() {
                const currentScrollY = window.scrollY;
                
                // Add/remove scrolled class
                if (currentScrollY > 50) {
                    navbar?.classList.add('scrolled');
                } else {
                    navbar?.classList.remove('scrolled');
                }

                // Hide/show navbar on scroll
                if (currentScrollY > lastScrollY && currentScrollY > 200) {
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    navbar.style.transform = 'translateY(0)';
                }
                
                lastScrollY = currentScrollY;
                isScrolling = false;
            });
        }
        isScrolling = true;
    });

    // Active link highlighting based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -80% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active class from all nav links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to current section's nav link
                const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                activeLink?.classList.add('active');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
});

// ========================================
// SCROLL ANIMATIONS
// ========================================
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Elements to animate
    const animatedElements = document.querySelectorAll('.sport-card, .match-card, .ranking-item');
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        fadeInObserver.observe(el);
    });
}

// ========================================
// SPORTS SECTION INTERACTIONS
// ========================================
function initSportsSection() {
    const sportCards = document.querySelectorAll('.sport-card');
    
    sportCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });

        card.addEventListener('click', function() {
            const sport = this.dataset.sport;
            showSportDetails(sport);
        });
    });
}

function showSportDetails(sport) {
    // This would typically open a modal or navigate to a detailed page
    console.log(`Showing details for ${sport}`);
    
    // Simple alert for demonstration
    const sportNames = {
        'basketball': 'Basketball',
        'volleyball': 'Volleyball',
        'football': 'Football',
        'badminton': 'Badminton',
        'table-tennis': 'Table Tennis',
        'chess': 'Chess'
    };
    
    alert(`You selected ${sportNames[sport]}! Registration and tournament details would be shown here.`);
}

// ========================================
// TOURNAMENT SECTION FUNCTIONALITY
// ========================================
function initTournamentSection() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            // Remove active class from all tabs and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.getElementById(targetTab)?.classList.add('active');
            
            // Animate content change
            const activeContent = document.getElementById(targetTab);
            if (activeContent) {
                activeContent.style.opacity = '0';
                setTimeout(() => {
                    activeContent.style.opacity = '1';
                }, 150);
            }
        });
    });

    // Simulate live score updates
    updateLiveScores();
}

function updateLiveScores() {
    const liveScores = document.querySelectorAll('.match-card.live .team-score');
    
    setInterval(() => {
        liveScores.forEach(score => {
            const currentScore = parseInt(score.textContent);
            const chance = Math.random();
            
            // 10% chance to update score
            if (chance < 0.1) {
                score.textContent = currentScore + 1;
                
                // Add animation effect
                score.style.transform = 'scale(1.2)';
                score.style.color = '#ff4757';
                
                setTimeout(() => {
                    score.style.transform = 'scale(1)';
                    score.style.color = 'var(--accent-gold)';
                }, 300);
            }
        });
    }, 3000); // Update every 3 seconds
}

// ========================================
// LEADERBOARD ANIMATIONS
// ========================================
function initLeaderboard() {
    const podiumPositions = document.querySelectorAll('.podium-position');
    const rankingItems = document.querySelectorAll('.ranking-item');

    // Animate podium positions on scroll
    const leaderboardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate podium positions
                podiumPositions.forEach((position, index) => {
                    setTimeout(() => {
                        position.style.opacity = '1';
                        position.style.transform = 'translateY(0) scale(1)';
                    }, index * 200);
                });

                // Animate ranking items
                rankingItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateX(0)';
                    }, (index + 3) * 150);
                });
            }
        });
    }, { threshold: 0.3 });

    const leaderboardSection = document.querySelector('.leaderboard-section');
    if (leaderboardSection) {
        // Set initial styles
        podiumPositions.forEach(position => {
            position.style.opacity = '0';
            position.style.transform = 'translateY(50px) scale(0.8)';
            position.style.transition = 'all 0.6s ease';
        });

        rankingItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-50px)';
            item.style.transition = 'all 0.5s ease';
        });

        leaderboardObserver.observe(leaderboardSection);
    }
}

// ========================================
// SCROLL INDICATOR
// ========================================
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    scrollIndicator?.addEventListener('click', function() {
        scrollToSection('sports');
    });

    // Hide scroll indicator after user scrolls
    window.addEventListener('scroll', function() {
        if (scrollIndicator && window.scrollY > 200) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.pointerEvents = 'none';
        } else if (scrollIndicator) {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.pointerEvents = 'auto';
        }
    });
}

// ========================================
// PERFORMANCE OPTIMIZATIONS
// ========================================
function optimizeAnimations() {
    // Reduce animations on mobile devices
    if (window.innerWidth <= 768) {
        const style = document.createElement('style');
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.5s !important;
                animation-delay: 0s !important;
                transition-duration: 0.3s !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Pause animations when tab is not visible
    document.addEventListener('visibilitychange', function() {
        const animatedElements = document.querySelectorAll('[style*="animation"]');
        
        if (document.hidden) {
            animatedElements.forEach(el => {
                el.style.animationPlayState = 'paused';
            });
        } else {
            animatedElements.forEach(el => {
                el.style.animationPlayState = 'running';
            });
        }
    });
}

// ========================================
// PRELOADER (Optional)
// ========================================
function initPreloader() {
    // Add a simple loading animation
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = `
        <div class="preloader-content">
            <i class="fas fa-trophy" style="font-size: 3rem; color: var(--accent-gold); animation: spin 1s linear infinite;"></i>
            <p style="margin-top: 20px; color: var(--primary-burgundy);">Loading UM Intramurals...</p>
        </div>
    `;
    
    // Add preloader styles
    const style = document.createElement('style');
    style.textContent = `
        .preloader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--white);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            transition: opacity 0.5s ease;
        }
        
        .preloader-content {
            text-align: center;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    // Show preloader
    document.body.appendChild(preloader);
    
    // Hide preloader after page load
    window.addEventListener('load', function() {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.remove();
            }, 500);
        }, 1000);
    });
}

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // Check user session first
    checkUserSession();
    
    // Initialize all features
    initScrollAnimations();
    initSportsSection();
    initTournamentSection();
    initLeaderboard();
    initScrollIndicator();
    optimizeAnimations();
    
    // Optional: Enable preloader
    // initPreloader();
    
    console.log('UM Intramurals website loaded successfully! 🏆');
    if (currentUser) {
        console.log(`Welcome back, ${currentUser.firstName || currentUser.username}!`);
    }
});

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Add smooth reveal animations for elements coming into view
const revealElements = throttle(() => {
    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            el.classList.add('revealed');
        }
    });
}, 100);

window.addEventListener('scroll', revealElements);

// Export functions for use in other scripts
window.UM_Intramurals = {
    scrollToSection,
    showSportDetails,
    updateLiveScores
};