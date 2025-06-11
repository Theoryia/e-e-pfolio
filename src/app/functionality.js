// ----- Smooth scrolling for navigation links -----
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Adjust for header height
                    behavior: 'smooth'
                });
                
                // Close mobile menu after clicking (if open)
                const navMenu = document.querySelector('nav ul');
                if (navMenu && navMenu.classList.contains('active')) {
                    toggleMobileMenu();
                }
            }
        });
    });
}

// ----- Sticky header -----
function setupStickyHeader() {
    const header = document.getElementById('header');
    
    function updateHeader() {
        if (window.scrollY > 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    }
    
    window.addEventListener('scroll', updateHeader);
    updateHeader(); // Initial check
}

// ----- Mobile Menu Toggle -----
function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }
}

function toggleMobileMenu() {
    const navMenu = document.querySelector('nav ul');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (navMenu) navMenu.classList.toggle('active');
    if (menuToggle) menuToggle.classList.toggle('active');
}

// ----- Animation on scroll -----
function setupScrollAnimations() {
    const sections = document.querySelectorAll('.section');
    
    // Create an Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                // Once animated, no need to observe it anymore
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2 // Trigger when 20% of the element is visible
    });
    
    // Observe each section
    sections.forEach(section => {
        observer.observe(section);
    });
}

// ----- Form handling -----
function setupContactForm() {
    const contactForm = document.querySelector('#contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Basic validation
        if (!name || !email || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate form submission (replace with actual endpoint)
        showNotification('Message sent successfully!', 'success');
        contactForm.reset();
    });
}

// ----- Notification system -----
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// ----- Theme toggle (if you want to add light/dark mode later) -----
function setupThemeToggle() {
    const themeToggle = document.querySelector('#theme-toggle');
    if (!themeToggle) return;
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
    });
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    }
}

// ----- Lazy loading for images -----
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ----- Initialize all functionality -----
function initializePortfolio() {
    setupSmoothScrolling();
    setupStickyHeader();
    setupMobileMenu();
    setupScrollAnimations();
    setupContactForm();
    setupThemeToggle();
    setupLazyLoading();
    
    console.log('Portfolio functionality initialized');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePortfolio);