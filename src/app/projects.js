// Function to fetch and generate project cards
async function loadProjects() {
    try {
        // Use relative path for Netlify
        const response = await fetch('./assets/data/projects.json');
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
            
            // Helper function to check if URL is valid
            function hasValidUrl(url) {
                return url && url.trim() !== '' && url.trim() !== '#';
            }
            
            // Create GitHub button conditionally
            let githubButton = '';
            if (hasValidUrl(project.github)) {
                githubButton = `
                    <a href="${project.github}" target="_blank" class="btn github-btn">
                        <i class="fab fa-github"></i> GitHub
                    </a>
                `;
            } else {
                githubButton = `
                    <span class="btn github-btn disabled">
                        <i class="fab fa-github"></i> GitHub
                    </span>
                `;
            }
            
            // Create Demo button conditionally
            let demoButton = '';
            if (hasValidUrl(project.demo)) {
                demoButton = `
                    <a href="${project.demo}" target="_blank" class="btn demo-btn">
                        <i class="fas fa-external-link-alt"></i> Live Demo
                    </a>
                `;
            } else {
                demoButton = `
                    <span class="btn demo-btn disabled">
                        <i class="fas fa-external-link-alt"></i> Live Demo
                    </span>
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
                        ${githubButton}
                        ${demoButton}
                    </div>
                </div>
            `;
            
            projectsContainer.appendChild(projectCard);
        });
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// Load projects when DOM is fully loaded
document.addEventListener('DOMContentLoaded', loadProjects);