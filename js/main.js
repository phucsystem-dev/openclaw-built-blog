// OpenClaw Blog - Main JavaScript
// Uses centralized configuration from js/config.js

document.addEventListener('DOMContentLoaded', function() {
    // Log configuration if available
    if (window.BlogConfig) {
        console.log('📋 OpenClaw Blog v' + BlogConfig.version);
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            BlogConfig.logConfig();
        }
    }
    
    // Theme Toggle
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
    },
    {
        id: 7,
        title: "The 7 Most Groundbreaking AI Breakthroughs of 2024",
        excerpt: "From multimodal understanding to agentic systems, discover the AI advancements shaping 2024.",
        category: "AI Research",
        date: "2024-03-28",
        readTime: "8 min",
        icon: "fas fa-lightbulb"
    },
    {
        id: 8,
        title: "Top Trending Open-Source AI Projects on GitHub",
        excerpt: "Discover the most exciting open-source AI projects of 2024 and learn how to integrate them with OpenClaw.",
        category: "Open Source",
        date: "2024-03-27",
        readTime: "10 min",
        icon: "fab fa-github"
    },
    {
        id: 9,
        title: "AI Ethics & Data Privacy: A 2024 Guide for OpenClaw Developers",
        excerpt: "Learn how to build ethical, privacy-preserving AI skills with OpenClaw.",
        category: "Ethics",
        date: "2024-03-26",
        readTime: "12 min",
        icon: "fas fa-balance-scale"
    },
    {
        id: 10,
        title: "How AI is Transforming Business Automation in 2024",
        excerpt: "Discover real-world AI automation use cases and implement them with OpenClaw for maximum productivity.",
        category: "Applications",
        date: "2024-03-25",
        readTime: "15 min",
        icon: "fas fa-robot"
    },
    {
        id: 11,
        title: "AI Agents in 2024: What's Next for Autonomous Digital Assistance?",
        excerpt: "Explore the evolution of AI assistants from chatbots to autonomous agents.",
        category: "Future Trends",
        date: "2024-03-24",
        readTime: "14 min",
        icon: "fas fa-crystal-ball"
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

// Show post modal with actual content
function showPostModal(postId) {
    const post = blogPosts.find(p => p.id === parseInt(postId));
    
    if (!post) return;
    
    // Map post IDs to markdown files
    const postFiles = {
        1: 'getting-started.md',
        2: 'building-skills.md',
        3: 'privacy-first-ai-assistants.md', // Note: This post doesn't exist yet
        4: 'integrating-home-automation.md', // Note: This post doesn't exist yet
        5: 'multi-model-ai-support.md', // Note: This post doesn't exist yet
        6: 'deploying-raspberry-pi.md', // Note: This post doesn't exist yet
        7: 'ai-advancements-2024.md',
        8: 'open-source-ai-projects-2024.md',
        9: 'ai-ethics-privacy-2024.md',
        10: 'practical-ai-applications-2024.md',
        11: 'future-ai-assistants-2024.md'
    };
    
    const filename = postFiles[postId];
    
    if (!filename) {
        // Fallback to alert for posts without markdown files
        alert(`Opening: ${post.title}\n\nFull post content coming soon!`);
        return;
    }
    
    // Create modal container
    const modal = document.createElement('div');
    modal.className = 'post-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <div class="modal-header">
                <div class="post-meta">
                    <span class="post-category">${post.category}</span>
                    <span>${post.date}</span>
                    <span>•</span>
                    <span>${post.readTime} read</span>
                </div>
                <h2 class="modal-title">${post.title}</h2>
                <p class="modal-excerpt">${post.excerpt}</p>
            </div>
            <div class="modal-body" id="postContent-${postId}">
                <div class="loading">Loading post content...</div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary close-modal">Close</button>
                <a href="../#contact" class="btn btn-primary">Join Discussion</a>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.querySelector('.modal-close').addEventListener('click', () => closeModal(modal));
    modal.querySelector('.close-modal').addEventListener('click', () => closeModal(modal));
    modal.querySelector('.modal-overlay').addEventListener('click', () => closeModal(modal));
    
    // Load post content
    loadPostContent(postId, filename);
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
}

// Load post content from markdown file
async function loadPostContent(postId, filename) {
    try {
        const response = await fetch(`posts/${filename}`);
        if (!response.ok) throw new Error('Post not found');
        
        const markdown = await response.text();
        const contentElement = document.getElementById(`postContent-${postId}`);
        
        // Simple markdown to HTML conversion (basic)
        const html = convertMarkdownToHtml(markdown);
        contentElement.innerHTML = html;
        
    } catch (error) {
        console.error('Error loading post:', error);
        const contentElement = document.getElementById(`postContent-${postId}`);
        contentElement.innerHTML = `
            <div class="error-message">
                <p>Unable to load post content. Please try again later.</p>
                <p>Error: ${error.message}</p>
            </div>
        `;
    }
}

// Basic markdown to HTML conversion
function convertMarkdownToHtml(markdown) {
    // Remove frontmatter if present
    let content = markdown.replace(/^---[\s\S]*?---\n/, '');
    
    // Convert headers
    content = content.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    content = content.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    content = content.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Convert bold and italic
    content = content.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
    content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    content = content.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Convert lists
    content = content.replace(/^- (.*$)/gim, '<li>$1</li>');
    content = content.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');
    
    // Convert code blocks
    content = content.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    content = content.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Convert paragraphs
    content = content.replace(/^(?!<[a-z])(?!<\/[a-z]>)(?!<h[1-6]>)(?!<ul>)(?!<li>)(?!<pre>)(?!<code>)(.*$)/gim, '<p>$1</p>');
    
    // Convert links
    content = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    
    // Clean up nested paragraphs in lists
    content = content.replace(/<li><p>(.*?)<\/p><\/li>/g, '<li>$1</li>');
    
    return content;
}

// Close modal
function closeModal(modal) {
    document.body.style.overflow = '';
    if (modal && modal.parentNode) {
        modal.parentNode.removeChild(modal);
    }
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