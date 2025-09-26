# UM Intramurals Website 🏆

A modern, interactive website for the University of Mindanao Intramurals program featuring stunning animations, responsive design, and comprehensive user management.

## 🌟 Features

### Landing Page
- **Stunning Hero Section** with animated text and floating elements
- **Interactive Sports Cards** with hover effects and animations
- **Live Tournament Dashboard** with real-time score updates
- **Dynamic Leaderboard** with podium animations
- **Smooth Scrolling Navigation** with active section highlighting
- **Mobile-Responsive Design** with hamburger menu

### Authentication System
- **Login Page** with advanced validation and password visibility toggle
- **Registration Page** with comprehensive form validation
- **Real-time Form Validation** with custom error messages
- **Social Login Integration** (Google & Facebook placeholders)
- **Remember Me Functionality** with local storage
- **Success Modals** with countdown redirects

### Navigation & UX
- **Consistent Navigation** across all pages
- **Smooth Animations** and transitions
- **Performance Optimized** with throttled scroll events
- **Accessibility Features** and proper ARIA labels
- **Mobile-First Approach** with responsive breakpoints

## 🎨 Design System

### Color Palette (University of Mindanao Theme)
- **Primary Burgundy**: #8B1538
- **Secondary Burgundy**: #A91B47  
- **Accent Gold**: #FFD700
- **Light Gold**: #FFF8DC
- **Cream**: #F5F5DC
- **Dark Red**: #6B0F2A

### Typography
- **Font Family**: Poppins (Google Fonts)
- **Weights**: 300, 400, 600, 700, 800

## 📁 Project Structure

```
Dudu_LabExam/
├── index.html          # Landing page with hero, sports, tournaments, leaderboard
├── login.html          # Login page with validation
├── register.html       # Registration page with comprehensive form
├── css/
│   └── style.css      # Complete stylesheet with animations & responsive design
├── js/
│   ├── script.js      # Main functionality and animations
│   └── auth.js        # Authentication system and form validation
└── README.md          # This file
```

## 🚀 Quick Start

1. **Clone or Download** the repository
2. **Place in XAMPP htdocs** folder (or any web server)
3. **Start your web server** (XAMPP, WAMP, etc.)
4. **Navigate to** `http://localhost/Dudu_LabExam`
5. **Explore the website!**

## 💻 Technology Stack

- **HTML5** - Semantic structure
- **CSS3** - Advanced animations, Flexbox, Grid
- **Vanilla JavaScript** - Interactive functionality
- **Font Awesome** - Icon library
- **Google Fonts** - Typography (Poppins)

## ✨ Key Highlights

### Interactive Elements
- **Floating animations** on hero section
- **Sport cards** with hover transformations
- **Live score updates** in tournament section
- **Podium animations** in leaderboard
- **Smooth scrolling** between sections
- **Mobile hamburger menu** with animations

### Form Features
- **Real-time validation** with custom messages
- **Password strength requirements**
- **Student ID auto-formatting** (YYYY-NNNNN)
- **Remember me functionality**
- **Loading states** during submission
- **Success modals** with countdown

### Performance Features
- **Throttled scroll events** for smooth performance
- **Intersection Observer** for scroll animations
- **Debounced form validation** 
- **Animation optimization** for mobile devices
- **Lazy loading** animations

## 🔧 Customization

### Adding New Sports
Edit the sports grid in `index.html` and add corresponding functionality in `script.js`:

```javascript
function showSportDetails(sport) {
    // Add your custom sport details logic here
}
```

### Modifying Colors
Update the CSS variables in `style.css`:

```css
:root {
    --primary-burgundy: #8B1538;
    --accent-gold: #FFD700;
    /* Add your custom colors */
}
```

### Form Validation Rules
Modify validation rules in `auth.js`:

```javascript
const validationRules = {
    // Add or modify validation rules
};
```

## 📱 Browser Support

- ✅ Chrome (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ✅ Edge (Latest)
- ✅ Mobile browsers

## 🎯 Demo Credentials

For testing the login functionality:
- **Admin Access**: username: `admin`, password: `Admin123!`
- **Student Access**: Any username (3+ chars) and password (6+ chars)

## 📧 Contact

For questions about this project, please contact the development team.

---

**Made with ❤️ for the University of Mindanao Intramurals Program**