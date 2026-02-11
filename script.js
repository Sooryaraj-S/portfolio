// ============================================
// SMOOTH SCROLL & NAVIGATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all functionality after page load
    initNavigation();
    initScrollAnimations();
    initFormValidation();
    initInteractiveElements();
});

// Navigation Setup
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');

    // Hamburger Menu Toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Active link highlight on scroll
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollTop = window.scrollY;

        const sections = document.querySelectorAll('section[id]');
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });

        // Hide navbar on scroll down, show on scroll up
        if (scrollTop > lastScrollTop && scrollTop > 150) {
            // Scrolling down
            navbar.classList.add('hide');
        } else {
            // Scrolling up
            navbar.classList.remove('hide');
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

        // Navbar background on scroll
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 0 30px rgba(255, 23, 68, 0.2)';
        } else {
            navbar.style.boxShadow = '0 0 20px rgba(255, 23, 68, 0.1)';
        }
    });
}

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================

function initScrollAnimations() {
    const revealElements = document.querySelectorAll(
        '.section-header, .about-card, .stat-card, .skill-category, ' +
        '.project-card, .service-card, .experience-item, .info-card, .contact-form'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });

    revealElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.8s ease ${index * 0.1}s, transform 0.8s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

// ============================================
// FORM VALIDATION & SUBMISSION
// ============================================

function initFormValidation() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);

        // Real-time validation
        const inputs = contactForm.querySelectorAll('.form-input');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearError);
        });
    }
}

function validateField(e) {
    const field = e.target;
    const fieldName = field.id;
    const errorElement = document.getElementById(`${fieldName}Error`);
    let isValid = true;
    let errorMessage = '';

    // Name validation
    if (fieldName === 'name') {
        if (field.value.trim().length < 3) {
            isValid = false;
            errorMessage = 'Name must be at least 3 characters';
        } else if (!/^[a-zA-Z\s]+$/.test(field.value)) {
            isValid = false;
            errorMessage = 'Name can only contain letters and spaces';
        }
    }

    // Email validation
    if (fieldName === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }

    // Subject validation
    if (fieldName === 'subject') {
        if (field.value.trim().length < 5) {
            isValid = false;
            errorMessage = 'Subject must be at least 5 characters';
        }
    }

    // Message validation
    if (fieldName === 'message') {
        if (field.value.trim().length < 10) {
            isValid = false;
            errorMessage = 'Message must be at least 10 characters';
        }
    }

    // Show/hide error
    if (!isValid && errorElement) {
        errorElement.textContent = errorMessage;
        errorElement.classList.add('show');
        field.style.borderColor = '#ff6b6b';
    } else if (errorElement) {
        errorElement.classList.remove('show');
        field.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    }

    return isValid;
}

function clearError(e) {
    const field = e.target;
    const errorElement = document.getElementById(`${field.id}Error`);
    if (errorElement) {
        errorElement.classList.remove('show');
        field.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    }
}

function handleFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const subjectField = document.getElementById('subject');
    const messageField = document.getElementById('message');
    const formSuccess = document.getElementById('formSuccess');
    const submitButton = form.querySelector('.btn-primary');

    // Validate all fields
    const isNameValid = validateField({ target: nameField });
    const isEmailValid = validateField({ target: emailField });
    const isSubjectValid = validateField({ target: subjectField });
    const isMessageValid = validateField({ target: messageField });

    if (!isNameValid || !isEmailValid || !isSubjectValid || !isMessageValid) {
        return;
    }

    // Show loading state
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
    submitButton.disabled = true;

    // Prepare form data for Web3Forms
    const formData = new FormData(form);

    // Send to Web3Forms API
    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Success message
            formSuccess.textContent = '✓ Message sent successfully! We\'ve saved your information and will get back to you soon.';
            formSuccess.classList.add('show');
            formSuccess.style.color = '#4CAF50';

            // Reset form
            form.reset();

            // Hide success message after 5 seconds
            setTimeout(() => {
                formSuccess.classList.remove('show');
                formSuccess.style.color = '';
            }, 5000);
        } else {
            // Error message
            formSuccess.textContent = '✗ Error: ' + (data.message || 'Failed to send message');
            formSuccess.style.color = '#ff6b6b';
            formSuccess.classList.add('show');

            setTimeout(() => {
                formSuccess.classList.remove('show');
                formSuccess.style.color = '';
            }, 5000);
        }
    })
    .catch(error => {
        console.error('Form submission error:', error);
        
        // Show error message
        formSuccess.textContent = '✗ Connection error. Please try again.';
        formSuccess.style.color = '#ff6b6b';
        formSuccess.classList.add('show');

        setTimeout(() => {
            formSuccess.classList.remove('show');
            formSuccess.style.color = '';
        }, 5000);
    })
    .finally(() => {
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    });
}

// ============================================
// INTERACTIVE ELEMENTS
// ============================================

function initInteractiveElements() {
    // Loader fade out
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.pointerEvents = 'none';
        }, 2400);
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add click animations to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Counter animation for stats
    const statCards = document.querySelectorAll('.stat-card h4');
    let hasAnimated = false;

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
            hasAnimated = true;
            statCards.forEach(card => {
                const target = parseInt(card.textContent);
                animateCounter(card, target);
            });
            observer.unobserve(entries[0].target);
        }
    });

    if (statCards.length > 0) {
        observer.observe(statCards[0].parentElement);
    }
}

// Counter animation function
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 30;
    const originalText = element.textContent;

    const counter = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = originalText;
            clearInterval(counter);
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 30);
}

// ============================================
// MOUSE PARALLAX EFFECT (Optional)
// ============================================

document.addEventListener('mousemove', (e) => {
    const orbs = document.querySelectorAll('.gradient-orb');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    orbs.forEach((orb, index) => {
        const speed = (index + 1) * 20;
        orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
});

// ============================================
// KEYBOARD NAVIGATION
// ============================================

document.addEventListener('keydown', (e) => {
    // Close mobile menu on Escape
    if (e.key === 'Escape') {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        if (hamburger && hamburger.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

// ============================================
// ACCESSIBILITY IMPROVEMENTS
// ============================================

// Add focus visible for keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// ============================================
// SCROLL-TO-TOP BUTTON (Optional Enhancement)
// ============================================

function createScrollToTop() {
    const button = document.createElement('button');
    button.id = 'scrollToTop';
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    button.className = 'scroll-to-top';
    document.body.appendChild(button);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            button.classList.add('visible');
        } else {
            button.classList.remove('visible');
        }
    });

    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize scroll to top button
createScrollToTop();

// ============================================
// PERFORMANCE OPTIMIZATIONS
// ============================================

// Lazy load images (for future optimization)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============================================
// CSS FOR SCROLL TO TOP BUTTON
// ============================================

const style = document.createElement('style');
style.textContent = `
    .scroll-to-top {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #ff1744, #ff5983);
        color: white;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.3rem;
        box-shadow: 0 0 20px rgba(255, 23, 68, 0.5);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 999;
    }

    .scroll-to-top.visible {
        opacity: 1;
        visibility: visible;
    }

    .scroll-to-top:hover {
        transform: translateY(-5px);
        box-shadow: 0 0 40px rgba(255, 23, 68, 0.8);
    }

    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: rippleEffect 0.6s ease-out;
        pointer-events: none;
    }

    @keyframes rippleEffect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    /* Keyboard navigation focus styles */
    body.keyboard-nav *:focus-visible {
        outline: 2px solid #ff1744;
        outline-offset: 2px;
    }

    @media (max-width: 768px) {
        .scroll-to-top {
            bottom: 20px;
            right: 20px;
            width: 45px;
            height: 45px;
            font-size: 1.1rem;
        }
    }
`;

document.head.appendChild(style);

// ============================================
// PRELOAD CRITICAL RESOURCES
// ============================================

window.addEventListener('load', () => {
    // Optimize performance after page load
    document.body.style.setProperty('--optimize', 'true');
});

// ============================================
// ERROR BOUNDARY FOR FORMS
// ============================================

try {
    initNavigation();
    initScrollAnimations();
    initFormValidation();
    initInteractiveElements();
} catch (error) {
    console.error('Initialization error:', error);
}
