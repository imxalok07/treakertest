// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');

menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !menuToggle.contains(e.target) && nav.classList.contains('active')) {
        nav.classList.remove('active');
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        // Close mobile menu if open
        if (nav.classList.contains('active')) {
            nav.classList.remove('active');
        }

        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80, // Adjust for header height
                behavior: 'smooth'
            });
        }
    });
});

// Handle contact form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        // In a real application, you would send this data to a server
        // For now, we'll just log it and show a success message
        console.log({ name, email, subject, message });

        // Clear form
        contactForm.reset();

        // Show success message
        alert('Thank you for your message! We\'ll get back to you soon.');
    });
}

// Newsletter subscription
const newsletterForm = document.querySelector('.footer-newsletter form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = this.querySelector('input').value;

        if (email) {
            // In a real application, you would send this to your server
            console.log('Newsletter subscription:', email);

            // Clear form
            this.reset();

            // Show success message
            alert('Thank you for subscribing to our newsletter!');
        }
    });
}

// Add animation on scroll for elements
// Card animation on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.trail-card, .guide-card, .value-card, .forum-post, .gallery-item');
    const sections = document.querySelectorAll('.section-title, .value-grid, .trails-container, .guides-container, .gallery-container');

    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;

        if (elementPosition < screenPosition) {
            element.style.opacity = 1;
            element.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
        }
    });

    sections.forEach(section => {
        const sectionPosition = section.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.1;

        if (sectionPosition < screenPosition) {
            section.classList.add('visible');
        }
    });
};

// Parallax effect for hero sections
const parallaxEffect = () => {
    const heroElements = document.querySelectorAll('.hero, .trails-hero');

    heroElements.forEach(element => {
        const scrollPosition = window.pageYOffset;
        element.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
    });
};

// 3D tilt effect for cards
const addTiltEffect = () => {
    const cards = document.querySelectorAll('.trail-card, .guide-card, .value-card, .gallery-item');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const cardRect = card.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;

            const mouseX = e.clientX - cardCenterX;
            const mouseY = e.clientY - cardCenterY;

            // Calculate rotation (maximum 10 degrees)
            const rotateY = 10 * mouseX / (cardRect.width / 2);
            const rotateX = -10 * mouseY / (cardRect.height / 2);

            // Calculate distance from center for depth effect
            const distance = Math.sqrt(Math.pow(mouseX, 2) + Math.pow(mouseY, 2));
            const maxDistance = Math.sqrt(Math.pow(cardRect.width / 2, 2) + Math.pow(cardRect.height / 2, 2));
            const z = 20 * (1 - distance / maxDistance);

            // Apply transform with depth
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${z}px) scale3d(1.05, 1.05, 1.05)`;

            // Add dynamic light reflection effect
            const glareX = (mouseX / cardRect.width) * 100 + 50;
            const glareY = (mouseY / cardRect.height) * 100 + 50;
            card.style.backgroundImage = `linear-gradient(${glareX}deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.03) ${glareY}%, rgba(255,255,255,0) 100%)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.backgroundImage = '';
            // Reset transition to allow smooth reset
            card.style.transition = 'transform 0.5s ease, background-image 0.5s ease';
        });
    });
};

// Debounce function
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

// Trek card click handler
function handleTrekCardClick(e) {
    if (!e.target.classList.contains('view-details')) {
        return;
    }
    
    const card = e.currentTarget;
    const title = card.querySelector('h3').textContent;
    const difficulty = card.querySelector('.difficulty').textContent;
    const description = card.querySelector('p').textContent;
    const altitude = card.querySelector('.trail-meta span:first-child').textContent;
    const duration = card.querySelector('.trail-meta span:nth-child(2)').textContent;
    const season = card.querySelector('.trail-meta span:last-child').textContent;
    const imgSrc = card.querySelector('.trail-img').style.backgroundImage.slice(4, -1).replace(/"/g, "");
    
    // Store trek data in sessionStorage
    sessionStorage.setItem('trekData', JSON.stringify({
        title, difficulty, description, altitude, duration, season, imgSrc
    }));
}

window.addEventListener('DOMContentLoaded', () => {
    // Add click handlers to trek cards
    document.querySelectorAll('.trail-card').forEach(card => {
        card.addEventListener('click', handleTrekCardClick);
    });
    document.querySelectorAll('.trail-card, .guide-card, .value-card, .forum-post, .gallery-item')
        .forEach(element => {
            element.style.opacity = 0;
            element.style.transform = 'translateY(40px) rotateX(5deg) rotateY(0)';
            element.style.transition = 'opacity 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275), transform 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        });

    animateOnScroll();
    addTiltEffect();

    const pageLoader = document.querySelector('.page-loader');
    if (pageLoader) {
        setTimeout(() => {
            pageLoader.classList.add('fade-out');
        }, 1500);
    }

    document.body.style.opacity = 0;
    requestAnimationFrame(() => {
        document.body.style.transition = 'opacity 1s ease';
        document.body.style.opacity = 1;
    }, 1600);

    // **Refined Active Link Highlighting (for all pages)**
    const navLinks = document.querySelectorAll('header nav ul li.nav-item a.nav-link');
    const currentPath = window.location.pathname;

    navLinks.forEach(link => {
        const linkPath = new URL(link.href, window.location.origin).pathname;
        const cleanCurrentPath = currentPath.replace(/\/$/, '');
        const cleanLinkPath = linkPath.replace(/\/$/, '');

        // Handle exact match (for all pages)
        if (cleanCurrentPath === cleanLinkPath) {
            link.parentNode.classList.add('active');
        }
        // Handle homepage variations (/, /index.html)
        else if ((cleanCurrentPath === '/' || cleanCurrentPath === '/index.html') &&
                 (cleanLinkPath === '/' || cleanLinkPath === '/index.html')) {
            link.parentNode.classList.add('active');
        }
        // Remove active class from all other links
        else {
            link.parentNode.classList.remove('active');
        }
    });

});

window.addEventListener('scroll', () => {
    animateOnScroll();
    parallaxEffect();
});

const resizeObserver = new ResizeObserver(debounce(() => {
    animateOnScroll();
}, 100));

resizeObserver.observe(document.body);