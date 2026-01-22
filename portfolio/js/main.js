/**
 * Portfolio Main JavaScript
 * Handles: Theme toggle, navigation, animations, project filters, typewriter effect
 */

// ===========================================
// DOM Elements
// ===========================================
const navbar = document.getElementById('navbar');
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const themeToggle = document.getElementById('theme-toggle');
const navLinks = document.querySelectorAll('.nav-link');
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const statNumbers = document.querySelectorAll('.stat-number');
const typewriterElement = document.getElementById('typewriter');

// ===========================================
// Theme Toggle (Dark/Light Mode)
// ===========================================
const initTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
        document.body.classList.add('light-mode');
        updateThemeIcon(true);
    }
};

const toggleTheme = () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    updateThemeIcon(isLight);
};

const updateThemeIcon = (isLight) => {
    const icon = themeToggle.querySelector('i');
    icon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
};

themeToggle.addEventListener('click', toggleTheme);
initTheme();

// ===========================================
// Mobile Navigation Toggle
// ===========================================
const toggleNav = () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
};

navToggle.addEventListener('click', toggleNav);

// Close menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            toggleNav();
        }
    });
});

// ===========================================
// Navbar Scroll Effect
// ===========================================
let lastScroll = 0;

const handleNavScroll = () => {
    const currentScroll = window.scrollY;
    
    // Add/remove scrolled class for background
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Hide/show navbar on scroll direction
    if (currentScroll > lastScroll && currentScroll > 200) {
        navbar.classList.add('hidden');
    } else {
        navbar.classList.remove('hidden');
    }
    
    lastScroll = currentScroll;
};

window.addEventListener('scroll', handleNavScroll);

// ===========================================
// Active Navigation Link on Scroll
// ===========================================
const sections = document.querySelectorAll('section[id]');

const highlightNavLink = () => {
    const scrollY = window.scrollY;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
};

window.addEventListener('scroll', highlightNavLink);

// ===========================================
// Project Filters
// ===========================================
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.dataset.filter;
        
        // Filter projects with animation
        projectCards.forEach((card, index) => {
            const category = card.dataset.category;
            
            if (filter === 'all' || category === filter) {
                card.style.display = 'block';
                card.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.1}s`;
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// ===========================================
// Typewriter Effect
// ===========================================
const titles = [
    'Full-Stack Developer',
    'Mobile App Developer',
    'AI Enthusiast',
    'Problem Solver'
];

let titleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

const typeWriter = () => {
    const currentTitle = titles[titleIndex];
    
    if (isDeleting) {
        typewriterElement.textContent = currentTitle.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
    } else {
        typewriterElement.textContent = currentTitle.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100;
    }
    
    // Word complete
    if (!isDeleting && charIndex === currentTitle.length) {
        typeSpeed = 2000; // Pause at end
        isDeleting = true;
    }
    
    // Word deleted
    if (isDeleting && charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        typeSpeed = 500; // Pause before next word
    }
    
    setTimeout(typeWriter, typeSpeed);
};

// Start typewriter after page load
document.addEventListener('DOMContentLoaded', () => {
    if (typewriterElement) {
        setTimeout(typeWriter, 1000);
    }
});

// ===========================================
// Scroll Reveal Animation
// ===========================================
const revealElements = document.querySelectorAll(
    '.project-card, .skill-category, .about-text, .about-stats, .contact-content, .section-title'
);

const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    
    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const revealPoint = 150;
        
        if (elementTop < windowHeight - revealPoint) {
            element.classList.add('revealed');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// ===========================================
// Animate Stats Counter
// ===========================================
let statsAnimated = false;

const animateStats = () => {
    if (statsAnimated) return;
    
    const statsSection = document.querySelector('.about-stats');
    if (!statsSection) return;
    
    const sectionTop = statsSection.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    
    if (sectionTop < windowHeight - 100) {
        statsAnimated = true;
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.dataset.count);
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    stat.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target;
                }
            };
            
            updateCounter();
        });
    }
};

window.addEventListener('scroll', animateStats);

// ===========================================
// Smooth Scroll for Anchor Links
// ===========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const navHeight = navbar.offsetHeight;
            const targetPosition = targetElement.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===========================================
// Parallax Effect for Hero
// ===========================================
const heroVisual = document.querySelector('.hero-visual');

const parallaxHero = () => {
    if (!heroVisual) return;
    const scrolled = window.scrollY;
    const rate = scrolled * 0.3;
    
    if (scrolled < window.innerHeight) {
        heroVisual.style.transform = `translateY(${rate}px)`;
    }
};

window.addEventListener('scroll', parallaxHero);

// ===========================================
// Cursor Effect (Optional - for desktop)
// ===========================================
const createCursorEffect = () => {
    if (window.innerWidth < 768) return;
    
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorDot);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';
    });
    
    // Hover effect on links and buttons
    const hoverElements = document.querySelectorAll('a, button, .project-card');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
};

// Uncomment to enable custom cursor
// createCursorEffect();

// ===========================================
// Console Easter Egg
// ===========================================
console.log('%c👋 Hey there, curious developer!', 'font-size: 20px; font-weight: bold;');
console.log('%cThanks for checking out my portfolio code.', 'font-size: 14px;');
console.log('%c📧 Reach out if you want to collaborate!', 'font-size: 14px; color: #6366f1;');
