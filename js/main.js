// OpenClaw Blog - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Check for saved theme or prefer-color-scheme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-sun';
    }
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        
        if (currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            themeIcon.className = 'fas fa-moon';
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeIcon.className = 'fas fa-sun';
            localStorage.setItem('theme', 'dark');
        }
    });
    
    // Load Blog Posts
    loadBlogPosts();
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
});

// Blog Posts Data
const blogPosts = [
    {
        id: 1,
        title: "Getting Started with OpenClaw",
        excerpt: "Learn how to set up your first OpenClaw instance and create your initial skills.",
        category: "Tutorial",
        date: "2024-03-15",
        readTime: "5 min",
        icon: "fas fa-rocket"
    },
    {
        id: 2,
        title: "Building Custom Skills",
        excerpt: "A deep dive into creating powerful custom skills for OpenClaw with Python.",
        category: "Development",
        date: "2024-03-10",
        readTime: "8 min",
        icon: "fas fa-code"
    },
    {
        id: 3,
        title: "Privacy-First AI Assistants",
        excerpt: "Why keeping your data local matters and how OpenClaw achieves this.",
        category: "Philosophy",
        date: "2024-03-05",
        readTime: "6 min",
        icon: "fas fa-shield-alt"
    },
    {
        id: 4,
        title: "Integrating with Home Automation",
        excerpt: "Connect OpenClaw with Home Assistant, SmartThings, and other home automation platforms.",
        category: "Integration",
        date: "2024-02-28",
        readTime: "10 min",
        icon: "fas fa-home"
    },
    {
        id: 5,
        title: "Multi-Model AI Support",
        excerpt: "How OpenClaw supports multiple AI models and when to use each one.",
        category: "AI",
        date: "2024-02-20",
        readTime: "7 min",
        icon: "fas fa-brain"
    },
    {
        id: 6,
        title: "Deploying to Raspberry Pi",
        excerpt: "Step-by-step guide to running OpenClaw on a Raspberry Pi for 24/7 availability.",
        category: "Deployment",
        date: "2024-02-15",
        readTime: "12 min",
        icon: "fas fa-microchip"
    }
];

// Load and display blog posts
function loadBlogPosts() {
    const postsGrid = document.getElementById('postsGrid');
    
    if (!postsGrid) return;
    
    // Clear any existing content
    postsGrid.innerHTML = '';
    
    // Create post cards
    blogPosts.forEach(post => {
        const postCard = document.createElement('article');
        postCard.className = 'post-card';
        
        postCard.innerHTML = `
            <div class="post-image">
                <i class="${post.icon}"></i>
            </div>
            <div class="post-content">
                <div class="post-meta">
                    <span class="post-category">${post.category}</span>
                    <span>${post.date}</span>
                    <span>•</span>
                    <span>${post.readTime} read</span>
                </div>
                <h3 class="post-title">${post.title}</h3>
                <p class="post-excerpt">${post.excerpt}</p>
                <a href="#" class="read-more" data-post-id="${post.id}">
                    Read More
                    <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        `;
        
        postsGrid.appendChild(postCard);
    });
    
    // Add click handlers for read more buttons
    document.querySelectorAll('.read-more').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const postId = this.getAttribute('data-post-id');
            showPostModal(postId);
        });
    });
}

// Show post modal (simulated for now)
function showPostModal(postId) {
    const post = blogPosts.find(p => p.id === parseInt(postId));
    
    if (!post) return;
    
    // In a real implementation, this would fetch and display full post content
    // For now, show an alert with post details
    alert(`Opening: ${post.title}\n\nThis would display the full blog post content in a real implementation.`);
    
    // Log to console for debugging
    console.log(`Opening post: ${post.title} (ID: ${postId})`);
}

// Simulate loading more posts on scroll
let isLoading = false;
window.addEventListener('scroll', function() {
    if (isLoading) return;
    
    const scrollPosition = window.innerHeight + window.scrollY;
    const pageHeight = document.documentElement.scrollHeight;
    
    // Load more when 80% from bottom
    if (scrollPosition >= pageHeight * 0.8) {
        // In a real implementation, this would fetch more posts from an API
        console.log('Load more posts triggered');
        
        // Simulate API call delay
        isLoading = true;
        setTimeout(() => {
            isLoading = false;
            console.log('More posts loaded (simulated)');
        }, 1000);
    }
});

// Initialize any animations or effects
function initAnimations() {
    // Add fade-in animation to elements as they scroll into view
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe all sections and post cards
    document.querySelectorAll('section, .post-card').forEach(el => {
        observer.observe(el);
    });
}

// Add CSS for fade-in animation
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        animation: fadeIn 0.6s ease-out forwards;
        opacity: 0;
    }
    
    @keyframes fadeIn {
        to {
            opacity: 1;
        }
    }
    
    section, .post-card {
        opacity: 0;
    }
`;
document.head.appendChild(style);

// Initialize animations after a short delay
setTimeout(initAnimations, 100);