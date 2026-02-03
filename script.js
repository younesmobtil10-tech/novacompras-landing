/**
 * SONORA X1 - Premium Speaker Landing Page
 * JavaScript Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavigation();
    initScrollEffects();
    initNewsletterForm();
    initSmoothReveal();
});

/**
 * Navigation Functionality
 */
function initNavigation() {
    const header = document.querySelector('.header');
    const menuToggle = document.querySelector('.nav__menu-toggle');
    const navLinks = document.querySelector('.nav__links');

    // Header scroll effect
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add/remove background opacity based on scroll
        if (currentScroll > 50) {
            header.style.backgroundColor = 'rgba(10, 10, 10, 0.98)';
        } else {
            header.style.backgroundColor = 'rgba(10, 10, 10, 0.9)';
        }

        // Hide/show header on scroll (optional)
        if (currentScroll > lastScroll && currentScroll > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks?.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }

    // Close menu on link click
    document.querySelectorAll('.nav__links a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle?.classList.remove('active');
            navLinks?.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
}

/**
 * Scroll-based Effects
 */
function initScrollEffects() {
    // Parallax effect for hero (subtle)
    const hero = document.querySelector('.hero');
    const heroImage = document.querySelector('.hero__image');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;

        if (hero && scrolled < window.innerHeight) {
            if (heroImage) {
                heroImage.style.transform = `translateY(${rate * 0.2}px)`;
            }
        }
    });
}

/**
 * Newsletter Form Handling
 */
function initNewsletterForm() {
    const form = document.querySelector('.newsletter__form');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const input = form.querySelector('.newsletter__input');
            const email = input?.value;

            if (email && validateEmail(email)) {
                // Success feedback
                const button = form.querySelector('.btn');
                const originalText = button.textContent;

                button.textContent = '¡Gracias!';
                button.style.backgroundColor = '#4CAF50';
                input.value = '';

                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.backgroundColor = '';
                }, 3000);

                console.log('Newsletter subscription:', email);
            } else {
                // Error feedback
                const input = form.querySelector('.newsletter__input');
                input.style.borderColor = '#ff4444';

                setTimeout(() => {
                    input.style.borderColor = '';
                }, 2000);
            }
        });
    }
}

/**
 * Smooth Reveal Animation on Scroll
 */
function initSmoothReveal() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elements to reveal
    const revealElements = document.querySelectorAll(
        '.gallery__item, .brand-story__container, .product-details__container, ' +
        '.specs-category, .benefit, .support__content'
    );

    revealElements.forEach(el => {
        el.classList.add('reveal-on-scroll');
        observer.observe(el);
    });

    // Add CSS for reveal animation
    const style = document.createElement('style');
    style.textContent = `
        .reveal-on-scroll {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .reveal-on-scroll.revealed {
            opacity: 1;
            transform: translateY(0);
        }
        
        .gallery__item.reveal-on-scroll:nth-child(2) { transition-delay: 0.1s; }
        .gallery__item.reveal-on-scroll:nth-child(3) { transition-delay: 0.2s; }
        
        .specs-category.reveal-on-scroll:nth-child(1) { transition-delay: 0s; }
        .specs-category.reveal-on-scroll:nth-child(2) { transition-delay: 0.1s; }
        .specs-category.reveal-on-scroll:nth-child(3) { transition-delay: 0.2s; }
        .specs-category.reveal-on-scroll:nth-child(4) { transition-delay: 0.3s; }
    `;
    document.head.appendChild(style);
}

/**
 * Utility Functions
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Add to Cart Animation (placeholder)
 */
document.querySelectorAll('.btn--primary').forEach(btn => {
    if (btn.textContent.includes('Añadir')) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            // Visual feedback
            const originalText = btn.textContent;
            btn.textContent = '✓ Añadido';
            btn.style.transform = 'scale(1.05)';

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.transform = '';
            }, 2000);
        });
    }
});
