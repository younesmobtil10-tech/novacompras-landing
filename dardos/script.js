/**
 * Porta-Dardos Diana - Landing Page JS
 * Scroll reveal animations, FAQ interactions, and product gallery
 */

/**
 * Product Gallery - Change main image
 */
function changeImage(src, thumbnail) {
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        mainImage.src = src;
    }

    // Update active thumbnail
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(t => t.classList.remove('active'));
    thumbnail.classList.add('active');
}

/**
 * Generate personalized preview via Gemini API
 */
async function generatePreview() {
    const nameInput = document.getElementById('customName');
    const btnText = document.getElementById('btnText');
    const btnSpinner = document.getElementById('btnSpinner');
    const previewResult = document.getElementById('previewResult');
    const previewImage = document.getElementById('previewImage');
    const generateBtn = document.getElementById('generateBtn');

    const name = nameInput.value.trim();

    if (!name) {
        alert('Por favor, escribe un nombre');
        nameInput.focus();
        return;
    }

    // Show loading state
    btnText.textContent = 'Generando...';
    btnSpinner.classList.remove('hidden');
    generateBtn.disabled = true;
    previewResult.classList.add('hidden');

    try {
        const response = await fetch('/api/generate-preview', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name })
        });

        const data = await response.json();

        if (data.success && data.image) {
            previewImage.src = data.image;
            previewResult.classList.remove('hidden');
        } else {
            alert(data.error || 'Error al generar la imagen. Inténtalo de nuevo.');
        }
    } catch (error) {
        console.error('Preview error:', error);
        alert('Error de conexión. Inténtalo de nuevo.');
    } finally {
        // Reset button state
        btnText.textContent = 'Ver Preview';
        btnSpinner.classList.add('hidden');
        generateBtn.disabled = false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize scroll reveal
    initScrollReveal();

    // Initialize smooth scroll for anchor links
    initSmoothScroll();

    // Initialize touch swipe for gallery
    initTouchSwipe();

    // Initialize countdown timer
    initCountdown();

    // Initialize character counter for personalization
    initCharCounter();

    // Initialize checkout buttons with personalization
    initCheckoutButtons();
});

/**
 * Touch Swipe for Product Gallery
 */
function initTouchSwipe() {
    const galleryMain = document.querySelector('.gallery-main');
    const thumbnails = document.querySelectorAll('.thumbnail');

    if (!galleryMain || thumbnails.length === 0) return;

    let touchStartX = 0;
    let touchEndX = 0;
    let currentIndex = 0;

    const images = Array.from(thumbnails).map(t => t.querySelector('img').src);

    galleryMain.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    galleryMain.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next image
                currentIndex = (currentIndex + 1) % images.length;
            } else {
                // Swipe right - previous image
                currentIndex = (currentIndex - 1 + images.length) % images.length;
            }

            // Update main image
            const mainImage = document.getElementById('mainImage');
            if (mainImage) {
                mainImage.src = images[currentIndex];
            }

            // Update active thumbnail
            thumbnails.forEach((t, i) => {
                t.classList.toggle('active', i === currentIndex);
            });
        }
    }
}

/**
 * Scroll Reveal Animation
 * Uses Intersection Observer for performance
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        '.benefit-card, .review-card, .personalization-content, .cta-box, .faq-item'
    );

    // Add reveal class to elements
    revealElements.forEach(el => {
        el.classList.add('reveal');
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        observer.observe(el);
    });
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            if (href === '#') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Add stagger delay to grid items for reveal animation
 */
function addStaggerDelay() {
    const grids = document.querySelectorAll('.benefits-grid, .reviews-grid');

    grids.forEach(grid => {
        const items = grid.children;
        Array.from(items).forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.1}s`;
        });
    });
}

// Call stagger delay on load
addStaggerDelay();

/**
 * Countdown Timer for Urgency
 */
function initCountdown() {
    const countdownEl = document.getElementById('countdown');
    if (!countdownEl) return;

    // Get or set end time in localStorage (5 hours from now)
    let endTime = localStorage.getItem('dardos_countdown_end');

    if (!endTime || parseInt(endTime) < Date.now()) {
        endTime = Date.now() + (5 * 60 * 60 * 1000); // 5 hours
        localStorage.setItem('dardos_countdown_end', endTime);
    }

    function updateCountdown() {
        const now = Date.now();
        const remaining = parseInt(endTime) - now;

        if (remaining <= 0) {
            // Reset countdown
            endTime = Date.now() + (5 * 60 * 60 * 1000);
            localStorage.setItem('dardos_countdown_end', endTime);
        }

        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

        countdownEl.textContent =
            String(hours).padStart(2, '0') + ':' +
            String(minutes).padStart(2, '0') + ':' +
            String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

/**
 * Character Counter for Personalization Input
 */
function initCharCounter() {
    const input = document.getElementById('personalizationName');
    const counter = document.getElementById('charCount');

    if (!input || !counter) return;

    input.addEventListener('input', () => {
        counter.textContent = input.value.length;
    });
}

/**
 * Checkout Buttons - Pass personalization to checkout page
 */
function initCheckoutButtons() {
    const buttons = document.querySelectorAll('.btn-checkout, .btn-cod');
    const input = document.getElementById('personalizationName');

    if (!buttons.length || !input) return;

    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const name = input.value.trim();
            const baseUrl = btn.getAttribute('href');
            const separator = baseUrl.includes('?') ? '&' : '?';
            const url = name ? `${baseUrl}${separator}name=${encodeURIComponent(name)}` : baseUrl;
            window.location.href = url;
        });
    });
}
