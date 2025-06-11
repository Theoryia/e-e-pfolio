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
                if (document.querySelector('nav ul').classList.contains('active')) {
                    toggleMobileMenu();
                }
            }
        });
    });
}

// ----- Sticky header -----
function setupStickyHeader() {
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
}

// ----- Mobile Menu Toggle -----
function setupMobileMenu() {
    const header = document.getElementById('header');
    // Create a menu toggle button for mobile view
    const menuToggle = document.createElement('div');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '<span></span><span></span><span></span>';
    header.querySelector('.container').appendChild(menuToggle);
    
    menuToggle.addEventListener('click', toggleMobileMenu);
}

function toggleMobileMenu() {
    document.querySelector('nav ul').classList.toggle('active');
    document.querySelector('.menu-toggle').classList.toggle('active');
}

// ----- Theme Toggle (Dark/Light) -----
function setupThemeToggle() {
    const footer = document.querySelector('footer .social-links');
    
    // Create theme toggle button
    const themeToggle = document.createElement('a');
    themeToggle.href = '#';
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    footer.appendChild(themeToggle);
    
    themeToggle.addEventListener('click', function(e) {
        e.preventDefault();
        document.body.classList.toggle('dark-theme');
        
        // Update icon
        const icon = this.querySelector('i');
        if (document.body.classList.contains('dark-theme')) {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
        
        // Save preference to localStorage
        const theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
    });
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.remove('dark-theme');
        themeToggle.querySelector('i').className = 'fas fa-moon';
    } else {
        document.body.classList.add('dark-theme');
        themeToggle.querySelector('i').className = 'fas fa-sun';
    }
}

// ----- Contact Form Handling -----
function setupContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };
            
            // Here you would typically send the data to a server
            // For demonstration, we'll just log it and show a success message
            console.log('Form submission:', formData);
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = 'Thanks for your message! I\'ll get back to you soon.';
            
            // Replace form with success message
            contactForm.innerHTML = '';
            contactForm.appendChild(successMessage);
        });
    }
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

// ----- Projects Loading -----
async function loadProjects() {
    try {
        // Fetch projects data from JSON file
        const response = await fetch('/src/assets/data/projects.json');
        const projectsData = await response.json();
        
        const projectsContainer = document.getElementById('projects-container');
        if (!projectsContainer) return;
        
        projectsData.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            
            // Create technologies list
            const techList = project.technologies.map(tech => 
                `<span class="tech-tag">${tech}</span>`
            ).join('');
            
            // Only create buttons if links exist and aren't empty
            let projectLinks = '';
            
            if (project.github && project.github.trim() !== '') {
                projectLinks += `
                    <a href="${project.github}" target="_blank" class="btn github-btn">
                        <i class="fab fa-github"></i> GitHub
                    </a>
                `;
            }
            
            if (project.demo && project.demo.trim() !== '') {
                projectLinks += `
                    <a href="${project.demo}" target="_blank" class="btn demo-btn">
                        <i class="fas fa-external-link-alt"></i> Live Demo
                    </a>
                `;
            }
            
            projectCard.innerHTML = `
                <div class="project-image">
                    <img src="${project.image}" alt="${project.title}">
                </div>
                <div class="project-info">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="tech-stack">
                        ${techList}
                    </div>
                    <div class="project-links">
                        ${projectLinks}
                    </div>
                </div>
            `;
            
            projectsContainer.appendChild(projectCard);
        });
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// ----- initialise all functionality -----
function initialisePortfolio() {
    setupSmoothScrolling();
    setupStickyHeader();
    setupMobileMenu();
    setupContactForm();
    setupScrollAnimations();
    loadProjects();
}

// Export functions
export { 
    initialisePortfolio,
    setupSmoothScrolling,
    setupStickyHeader,
    setupMobileMenu,
    setupContactForm,
    setupScrollAnimations,
    loadProjects
};