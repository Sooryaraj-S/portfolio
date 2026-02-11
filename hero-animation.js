// ============================================
// TYPING ANIMATION FOR HERO SECTION
// ============================================

const typingTexts = [
    'Photographer',
    'Full Stack Developer',
    'Videographer',
    'UI/UX Designer',
    'Video & Photo Editor',
    'Web Developer',
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingSpeed = 100;
const deletingSpeed = 50;
const pauseSpeed = 1500;

const typingElement = document.querySelector('.typing-text');
const typingCursorElement = document.querySelector('.typing-cursor');

function typeAnimation() {
    const currentText = typingTexts[textIndex];
    
    if (!isDeleting) {
        // Typing
        if (charIndex < currentText.length) {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            setTimeout(typeAnimation, typingSpeed);
        } else {
            // Pause after typing
            isDeleting = true;
            setTimeout(typeAnimation, pauseSpeed);
        }
    } else {
        // Deleting
        if (charIndex > 0) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            setTimeout(typeAnimation, deletingSpeed);
        } else {
            // Move to next text
            isDeleting = false;
            textIndex = (textIndex + 1) % typingTexts.length;
            setTimeout(typeAnimation, 500);
        }
    }
}

// Start animation when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', typeAnimation);
} else {
    typeAnimation();
}

// ============================================
// SCROLL ANIMATION
// ============================================

const heroSection = document.querySelector('.hero');

if (heroSection) {
    const heroLeft = heroSection.querySelector('.hero-left');
    const heroRight = heroSection.querySelector('.hero-right');
    const scrollIndicator = heroSection.querySelector('.scroll-indicator');

    // Animate on page load with staggered delays
    if (heroLeft) {
        heroLeft.style.animation = 'slideInLeft 0.9s ease-out forwards';
    }
    if (heroRight) {
        heroRight.style.animation = 'slideInRight 0.9s ease-out forwards';
    }

    // Parallax effect on scroll
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const heroHeight = heroSection.offsetHeight;
        const scrollPercent = scrollPosition / heroHeight;

        if (scrollPercent < 1) {
            if (heroLeft) {
                heroLeft.style.transform = `translateY(${scrollPosition * 0.5}px)`;
            }
            if (heroRight) {
                heroRight.style.transform = `translateY(${scrollPosition * 0.3}px)`;
            }
        }
    });

    // Smooth scroll on scroll indicator click
    if (scrollIndicator) {
        const nextSection = heroSection.nextElementSibling;
        if (nextSection) {
            scrollIndicator.style.cursor = 'pointer';
            scrollIndicator.addEventListener('click', () => {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            });
        }
    }
}

// ============================================
// UTILITY: Intersection Observer for fade-in animations
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all scroll-reveal elements
document.querySelectorAll('.scroll-reveal').forEach(el => {
    observer.observe(el);
});

// ============================================
// FALLING ICONS STARTUP ANIMATION
// ============================================

const iconsList = [
    { class: 'fab fa-github', name: 'icon-github' },
    { class: 'fab fa-linkedin', name: 'icon-linkedin' },
    { class: 'fab fa-html5', name: 'icon-html' },
    { class: 'fab fa-css3-alt', name: 'icon-css' },
    { class: 'fab fa-js-square', name: 'icon-js' },
    { class: 'fab fa-bootstrap', name: 'icon-bootstrap' },
    { class: 'fab fa-react', name: 'icon-react' }
];

function initFallingIconsAnimation() {
    // Create container
    const container = document.createElement('div');
    container.className = 'falling-icons-container';
    document.body.prepend(container);

    const animationDuration = 5000; // 5 seconds
    const iconCreationInterval = 300; // Create new icon every 300ms
    let iconCount = 0;
    let creationTimer;

    function createFallingIcon() {
        // Randomly select an icon
        const icon = iconsList[Math.floor(Math.random() * iconsList.length)];
        
        // Create icon element
        const iconElement = document.createElement('i');
        iconElement.className = `falling-icon ${icon.class} ${icon.name} fade-in`;
        
        // Random horizontal position
        const leftPosition = Math.random() * 100;
        iconElement.style.left = leftPosition + '%';
        
        // Random fall duration (3-6 seconds)
        const fallDuration = 3 + Math.random() * 3;
        
        // Random rotation
        const rotation = Math.random() * 720 - 360; // -360 to 360
        
        // Random horizontal drift
        const driftX = (Math.random() - 0.5) * 200;
        
        // Apply CSS custom properties for animation
        iconElement.style.setProperty('--rotation', rotation + 'deg');
        iconElement.style.setProperty('--tx', driftX + 'px');
        iconElement.style.animationDuration = fallDuration + 's';
        
        container.appendChild(iconElement);
        iconCount++;

        // Fade out animation after icon is created
        setTimeout(() => {
            if (iconElement.parentNode) {
                iconElement.classList.remove('fade-in');
                iconElement.classList.add('fade-out');
            }
        }, fallDuration * 1000 - 1000);

        // Remove element from DOM after animation completes
        setTimeout(() => {
            if (iconElement.parentNode) {
                iconElement.remove();
            }
        }, fallDuration * 1000);
    }

    // Create icons periodically
    creationTimer = setInterval(createFallingIcon, iconCreationInterval);

    // Stop creating new icons after 5 seconds
    setTimeout(() => {
        clearInterval(creationTimer);
        
        // Remove container after all animations complete (longest icon falls)
        setTimeout(() => {
            if (container.parentNode) {
                container.remove();
            }
        }, 7000);
    }, animationDuration);
}

// Start falling icons animation when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFallingIconsAnimation);
} else {
    initFallingIconsAnimation();
}
