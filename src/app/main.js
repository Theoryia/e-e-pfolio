import { initialisePortfolio } from './functionality.js';

document.addEventListener('DOMContentLoaded', function() {
    // initialise all portfolio functionality
    initialisePortfolio();

    // ----- Smooth scrolling for navigation links -----
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
                if (document.querySelector('nav ul').classList.contains('active')) {
                    toggleMobileMenu();
                }
            }
        });
    });
    
    // ----- Sticky header -----
    const header = document.getElementById('header');
    const headerHeight = header.offsetHeight;
    
    function updateHeader() {
        if (window.scrollY > 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    }
    
    window.addEventListener('scroll', updateHeader);
    updateHeader(); // Initial check
    
    // ----- Animation on scroll -----
    function animateSections() {
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
    
    animateSections();
});