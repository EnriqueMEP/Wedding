/**
 * ================================================
 * PREMIUM WEDDING WEBSITE - SCRIPT.JS
 * Rich interactions and animations
 * ================================================
 *
 * CUSTOMIZATION GUIDE:
 * - Wedding Date: Change the weddingDate variable below
 * - RSVP Endpoint: Modify handleRSVPSubmit function
 * - Guestbook: Data stored in localStorage (key: 'weddingGuestbook')
 *
 * ================================================
 */

(function () {
    'use strict';

    // ================================================
    // CONFIGURACIÓN
    // ================================================

    /**
     * PERSONALIZACIÓN: Establece la fecha de tu boda aquí
     * Formato: 'Mes Día, Año Hora:Minuto:Segundo'
     */
    const weddingDate = new Date('March 21, 2026 12:30:00');

    /**
     * Verificar si el usuario prefiere movimiento reducido
     */
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ================================================
    // UTILITY FUNCTIONS
    // ================================================

    /**
     * Debounce function for scroll handlers
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     */
    function debounce(func, wait = 10) {
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

    /**
     * Throttle function for frequent events
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in milliseconds
     */
    function throttle(func, limit = 100) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Format date for display
     * @param {Date} date - Date object
     */
    function formatDate(date) {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // ================================================
    // DARK MODE TOGGLE
    // ================================================

    // ================================================
    // DYNAMIC NAME SWITCHING
    // ================================================

    function updateNames(theme) {
        const name1Elements = document.querySelectorAll('.name-1');
        const name2Elements = document.querySelectorAll('.name-2');
        const initial1Elements = document.querySelectorAll('.initial-1');
        const initial2Elements = document.querySelectorAll('.initial-2');

        const isDark = theme === 'dark'; // Pink Mode

        // Dark/Pink Mode: Inma & Rosendo
        // Light/Blue Mode: Rosendo & Inma

        const name1Text = isDark ? 'Inma' : 'Rosendo';
        const name2Text = isDark ? 'Rosendo' : 'Inma';
        const initial1Text = isDark ? 'I' : 'R';
        const initial2Text = isDark ? 'R' : 'I';

        name1Elements.forEach(el => el.textContent = name1Text);
        name2Elements.forEach(el => el.textContent = name2Text);
        initial1Elements.forEach(el => el.textContent = initial1Text);
        initial2Elements.forEach(el => el.textContent = initial2Text);
    }

    const themeToggle = document.getElementById('themeToggle');

    function initTheme() {
        // Check for saved theme preference or default to light
        const savedTheme = localStorage.getItem('weddingTheme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        let theme = 'light';
        if (savedTheme) {
            theme = savedTheme;
        } else if (prefersDark) {
            theme = 'dark';
        }

        document.documentElement.setAttribute('data-theme', theme);
        updateNames(theme);
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('weddingTheme', newTheme);
        updateNames(newTheme);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Initialize theme on page load
    initTheme();

    // ================================================
    // NAVIGATION
    // ================================================

    const mainNav = document.getElementById('mainNav');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    // Scroll handler for navigation background
    function handleNavScroll() {
        if (window.scrollY > 50) {
            mainNav.classList.add('scrolled');
        } else {
            mainNav.classList.remove('scrolled');
        }
    }

    // Mobile menu toggle
    function toggleMobileMenu() {
        const isOpen = navMenu.classList.contains('open');
        navMenu.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', !isOpen);

        // Prevent body scroll when menu is open
        document.body.style.overflow = isOpen ? '' : 'hidden';
    }

    // Close mobile menu
    function closeMobileMenu() {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    // Active nav link on scroll
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id], header[id]');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Event listeners for navigation
    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileMenu);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Debounced scroll handlers
    window.addEventListener('scroll', debounce(handleNavScroll, 10));
    window.addEventListener('scroll', throttle(updateActiveNavLink, 100));

    // Initialize nav state
    handleNavScroll();

    // ================================================
    // COUNTDOWN TIMER
    // ================================================

    const countDays = document.getElementById('countDays');
    const countHours = document.getElementById('countHours');
    const countMinutes = document.getElementById('countMinutes');
    const countSeconds = document.getElementById('countSeconds');

    let previousValues = { days: '', hours: '', minutes: '', seconds: '' };

    function updateCountdown() {
        const now = new Date();
        const difference = weddingDate - now;

        if (difference <= 0) {
            // Wedding day has arrived!
            if (countDays) countDays.textContent = '0';
            if (countHours) countHours.textContent = '00';
            if (countMinutes) countMinutes.textContent = '00';
            if (countSeconds) countSeconds.textContent = '00';
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Format values
        const daysStr = String(days).padStart(3, '0');
        const hoursStr = String(hours).padStart(2, '0');
        const minutesStr = String(minutes).padStart(2, '0');
        const secondsStr = String(seconds).padStart(2, '0');

        // Update with animation only if changed
        if (countDays && daysStr !== previousValues.days) {
            countDays.textContent = daysStr;
            if (!prefersReducedMotion) countDays.classList.add('flip');
        }
        if (countHours && hoursStr !== previousValues.hours) {
            countHours.textContent = hoursStr;
            if (!prefersReducedMotion) countHours.classList.add('flip');
        }
        if (countMinutes && minutesStr !== previousValues.minutes) {
            countMinutes.textContent = minutesStr;
            if (!prefersReducedMotion) countMinutes.classList.add('flip');
        }
        if (countSeconds && secondsStr !== previousValues.seconds) {
            countSeconds.textContent = secondsStr;
            if (!prefersReducedMotion) countSeconds.classList.add('flip');
        }

        // Remove flip class after animation
        setTimeout(() => {
            [countDays, countHours, countMinutes, countSeconds].forEach(el => {
                if (el) el.classList.remove('flip');
            });
        }, 600);

        // Store previous values
        previousValues = {
            days: daysStr,
            hours: hoursStr,
            minutes: minutesStr,
            seconds: secondsStr
        };
    }

    // Initialize and update countdown every second
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ================================================
    // SCROLL REVEAL ANIMATIONS (Intersection Observer)
    // ================================================

    function initScrollReveal() {
        if (prefersReducedMotion) {
            // If user prefers reduced motion, show all elements immediately
            document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-text')
                .forEach(el => el.classList.add('visible'));
            return;
        }

        const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-text');

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    initScrollReveal();

    // ================================================
    // GALLERY LIGHTBOX
    // ================================================

    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const galleryItems = document.querySelectorAll('.gallery-item');

    let currentImageIndex = 0;
    let galleryImages = [];

    // Build gallery images array
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        const caption = item.querySelector('figcaption');

        if (img) {
            galleryImages.push({
                src: img.dataset.full || img.src,
                alt: img.alt,
                caption: caption ? caption.textContent : ''
            });

            // Click handler for each gallery item
            item.addEventListener('click', () => openLightbox(index));
            item.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') openLightbox(index);
            });
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'button');
            item.setAttribute('aria-label', `View image: ${img.alt}`);
        }
    });

    function openLightbox(index) {
        currentImageIndex = index;
        updateLightboxImage();
        lightbox.hidden = false;
        lightbox.focus();
        document.body.style.overflow = 'hidden';

        // Trap focus inside lightbox
        lightboxClose.focus();
    }

    function closeLightbox() {
        lightbox.hidden = true;
        document.body.style.overflow = '';

        // Return focus to the gallery item that opened the lightbox
        if (galleryItems[currentImageIndex]) {
            galleryItems[currentImageIndex].focus();
        }
    }

    function updateLightboxImage() {
        const imageData = galleryImages[currentImageIndex];
        if (imageData) {
            lightboxImage.src = imageData.src;
            lightboxImage.alt = imageData.alt;
            lightboxCaption.textContent = imageData.caption;
        }
    }

    function prevImage() {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        updateLightboxImage();
    }

    function nextImage() {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        updateLightboxImage();
    }

    // Lightbox event listeners
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);
    if (lightboxNext) lightboxNext.addEventListener('click', nextImage);

    // Close on backdrop click
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox && !lightbox.hidden) {
            switch (e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    prevImage();
                    break;
                case 'ArrowRight':
                    nextImage();
                    break;
            }
        }
    });

    // ================================================
    // FAQ ACCORDION
    // ================================================

    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            const content = header.nextElementSibling;

            // Close all other accordions (optional - remove for multi-open)
            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== header) {
                    otherHeader.setAttribute('aria-expanded', 'false');
                    const otherContent = otherHeader.nextElementSibling;
                    if (otherContent) otherContent.hidden = true;
                }
            });

            // Toggle current accordion
            header.setAttribute('aria-expanded', !isExpanded);
            if (content) content.hidden = isExpanded;
        });

        // Keyboard support
        header.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                header.click();
            }
        });
    });

    // ================================================
    // MULTI-STEP RSVP FORM
    // ================================================

    const rsvpForm = document.getElementById('rsvpForm');
    const formSteps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const btnNext = document.querySelectorAll('.btn-next');
    const btnPrev = document.querySelectorAll('.btn-prev');
    const formSuccess = document.getElementById('formSuccess');
    const resetFormBtn = document.getElementById('resetForm');
    const guestsGroup = document.getElementById('guestsGroup');
    const attendYes = document.getElementById('attendYes');
    const attendNo = document.getElementById('attendNo');

    let currentStep = 1;
    const totalSteps = 3;

    // Show/hide guests field based on attendance
    function toggleGuestsField() {
        if (attendYes && attendYes.checked) {
            guestsGroup.style.display = 'block';
        } else {
            guestsGroup.style.display = 'none';
        }
    }

    if (attendYes) attendYes.addEventListener('change', toggleGuestsField);
    if (attendNo) attendNo.addEventListener('change', toggleGuestsField);

    // Show/hide allergy field based on dietary selection
    const dietarySelect = document.getElementById('rsvpDietary');
    const allergyGroup = document.getElementById('allergyGroup');

    if (dietarySelect && allergyGroup) {
        dietarySelect.addEventListener('change', function () {
            if (this.value === 'allergy') {
                allergyGroup.style.display = 'block';
            } else {
                allergyGroup.style.display = 'none';
            }
        });
    }

    // Guest counter buttons
    const guestInput = document.getElementById('rsvpGuests');
    const minusBtn = document.querySelector('.counter-btn.minus');
    const plusBtn = document.querySelector('.counter-btn.plus');

    if (minusBtn && guestInput) {
        minusBtn.addEventListener('click', () => {
            const currentValue = parseInt(guestInput.value) || 1;
            if (currentValue > 1) {
                guestInput.value = currentValue - 1;
            }
        });
    }

    if (plusBtn && guestInput) {
        plusBtn.addEventListener('click', () => {
            const currentValue = parseInt(guestInput.value) || 1;
            const max = parseInt(guestInput.max) || 6;
            if (currentValue < max) {
                guestInput.value = currentValue + 1;
            }
        });
    }

    // Update progress indicator
    function updateProgress() {
        progressSteps.forEach((step, index) => {
            const stepNum = index + 1;
            step.classList.remove('active', 'completed');

            if (stepNum < currentStep) {
                step.classList.add('completed');
            } else if (stepNum === currentStep) {
                step.classList.add('active');
            }
        });
    }

    // Show specific step
    function showStep(step) {
        formSteps.forEach(formStep => {
            const stepNum = parseInt(formStep.dataset.step);
            formStep.classList.toggle('active', stepNum === step);
        });
        currentStep = step;
        updateProgress();
    }

    // Validate current step
    function validateStep(step) {
        const currentFormStep = document.querySelector(`.form-step[data-step="${step}"]`);
        if (!currentFormStep) return true;

        const requiredFields = currentFormStep.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            const errorMessage = field.closest('.form-group')?.querySelector('.error-message');

            // Clear previous error
            if (errorMessage) errorMessage.textContent = '';
            field.classList.remove('error');

            // Check validity
            if (!field.value.trim()) {
                isValid = false;
                if (errorMessage) errorMessage.textContent = 'This field is required';
                field.classList.add('error');
            } else if (field.type === 'email' && !isValidEmail(field.value)) {
                isValid = false;
                if (errorMessage) errorMessage.textContent = 'Please enter a valid email';
                field.classList.add('error');
            }
        });

        // Special validation for radio buttons (attendance)
        if (step === 2) {
            const attendanceSelected = document.querySelector('input[name="attending"]:checked');
            const attendanceError = document.querySelector('.attendance-options .error-message');
            if (!attendanceSelected) {
                isValid = false;
                if (attendanceError) attendanceError.textContent = 'Please select an option';
            } else if (attendanceError) {
                attendanceError.textContent = '';
            }
        }

        return isValid;
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Next button handlers
    btnNext.forEach(btn => {
        btn.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                if (currentStep < totalSteps) {
                    showStep(currentStep + 1);
                }
            }
        });
    });

    // Previous button handlers
    btnPrev.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 1) {
                showStep(currentStep - 1);
            }
        });
    });

    // Form submission
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (!validateStep(currentStep)) return;

            // Gather form data
            const formData = new FormData(rsvpForm);
            const data = Object.fromEntries(formData.entries());

            /**
             * CUSTOMIZATION: Handle RSVP submission
             * Replace this with your actual form submission logic
             * (e.g., send to a server, Google Forms, Airtable, etc.)
             */
            handleRSVPSubmit(data);
        });
    }

    function handleRSVPSubmit(data) {
        // Log data for demo purposes
        console.log('RSVP Submitted:', data);

        /**
         * CUSTOMIZATION: To connect to a real backend:
         *
         * Example with fetch:
         * fetch('YOUR_ENDPOINT_URL', {
         *     method: 'POST',
         *     headers: { 'Content-Type': 'application/json' },
         *     body: JSON.stringify(data)
         * })
         * .then(response => response.json())
         * .then(result => {
         *     showSuccessMessage(data);
         * })
         * .catch(error => {
         *     console.error('Error:', error);
         *     alert('There was an error submitting your RSVP. Please try again.');
         * });
         */

        // For demo: show success immediately
        showSuccessMessage(data);
    }

    function showSuccessMessage(data) {
        // Hide form steps
        formSteps.forEach(step => step.classList.remove('active'));

        // Update success message based on attendance
        const successMessage = document.getElementById('successMessage');
        if (successMessage) {
            if (data.attending === 'yes') {
                successMessage.textContent = `Thank you, ${data.name}! We're thrilled you'll be joining us. See you at the wedding!`;
            } else {
                successMessage.textContent = `Thank you, ${data.name}, for letting us know. We'll miss you, but we appreciate your response!`;
            }
        }

        // Show success state
        if (formSuccess) {
            formSuccess.hidden = false;
        }

        // Hide progress
        document.querySelector('.rsvp-progress')?.classList.add('hidden');
    }

    // Reset form
    if (resetFormBtn) {
        resetFormBtn.addEventListener('click', () => {
            rsvpForm.reset();
            formSuccess.hidden = true;
            document.querySelector('.rsvp-progress')?.classList.remove('hidden');
            currentStep = 1;
            showStep(1);
            guestsGroup.style.display = 'none';
        });
    }

    // ================================================
    // GUESTBOOK (localStorage)
    // ================================================

    const guestbookForm = document.getElementById('guestbookForm');
    const guestbookMessages = document.getElementById('guestbookMessages');
    const GUESTBOOK_KEY = 'weddingGuestbook';

    function loadGuestbookMessages() {
        const messages = JSON.parse(localStorage.getItem(GUESTBOOK_KEY)) || [];

        if (messages.length === 0) {
            guestbookMessages.innerHTML = '<p class="no-messages">Be the first to leave a message!</p>';
            return;
        }

        // Sort by date (newest first)
        messages.sort((a, b) => new Date(b.date) - new Date(a.date));

        guestbookMessages.innerHTML = messages.map(msg => `
            <div class="message-card">
                <p class="message-author">${escapeHTML(msg.name)}</p>
                <p class="message-text">${escapeHTML(msg.message)}</p>
                <p class="message-date">${formatDate(new Date(msg.date))}</p>
            </div>
        `).join('');
    }

    function saveGuestbookMessage(name, message) {
        const messages = JSON.parse(localStorage.getItem(GUESTBOOK_KEY)) || [];

        messages.push({
            name: name,
            message: message,
            date: new Date().toISOString()
        });

        localStorage.setItem(GUESTBOOK_KEY, JSON.stringify(messages));
        loadGuestbookMessages();
    }

    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    if (guestbookForm) {
        guestbookForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('guestName');
            const messageInput = document.getElementById('guestMessage');

            const name = nameInput.value.trim();
            const message = messageInput.value.trim();

            if (name && message) {
                saveGuestbookMessage(name, message);
                guestbookForm.reset();
            }
        });
    }

    // Load messages on page load
    if (guestbookMessages) {
        loadGuestbookMessages();
    }

    // ================================================
    // BACK TO TOP BUTTON
    // ================================================

    const backToTop = document.getElementById('backToTop');

    function handleBackToTopVisibility() {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });
        });

        window.addEventListener('scroll', debounce(handleBackToTopVisibility, 50));
    }

    // ================================================
    // PARALLAX EFFECT (Subtle)
    // ================================================

    function initParallax() {
        if (prefersReducedMotion) return;

        const bokehElements = document.querySelectorAll('.bokeh');

        function updateParallax() {
            const scrollY = window.scrollY;
            const heroHeight = document.querySelector('.hero')?.offsetHeight || 0;

            // Only apply parallax in hero section
            if (scrollY > heroHeight) return;

            bokehElements.forEach((bokeh, index) => {
                const speed = 0.05 + (index * 0.02);
                const yOffset = scrollY * speed;
                bokeh.style.transform = `translateY(${yOffset}px)`;
            });
        }

        window.addEventListener('scroll', throttle(updateParallax, 16));
    }

    initParallax();

    // ================================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ================================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();

                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: prefersReducedMotion ? 'auto' : 'smooth'
                });
            }
        });
    });

    // ================================================
    // HERO PARTICLES (Optional CSS-based enhancement)
    // ================================================

    function createParticles() {
        if (prefersReducedMotion) return;

        const container = document.getElementById('heroParticles');
        if (!container) return;

        const particleCount = 20;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: particleFloat ${Math.random() * 10 + 15}s ease-in-out infinite;
                animation-delay: ${Math.random() * -20}s;
            `;
            container.appendChild(particle);
        }

        // Add particle animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes particleFloat {
                0%, 100% {
                    transform: translate(0, 0) scale(1);
                    opacity: 0.6;
                }
                25% {
                    transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px) scale(1.2);
                    opacity: 0.8;
                }
                50% {
                    transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px) scale(0.8);
                    opacity: 0.4;
                }
                75% {
                    transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px) scale(1.1);
                    opacity: 0.7;
                }
            }
        `;
        document.head.appendChild(style);
    }

    createParticles();

    // ================================================
    // INPUT ANIMATIONS
    // ================================================

    const formInputs = document.querySelectorAll('input, textarea, select');

    formInputs.forEach(input => {
        // Add focus/blur animations
        input.addEventListener('focus', () => {
            input.closest('.form-group')?.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            input.closest('.form-group')?.classList.remove('focused');
        });
    });

    // ================================================
    // INTERSECTION OBSERVER FOR TIMELINE ANIMATION
    // ================================================

    function initTimelineAnimation() {
        if (prefersReducedMotion) return;

        const timelineMarkers = document.querySelectorAll('.timeline-marker');

        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'pulseGlow 2s ease-in-out infinite';
                } else {
                    entry.target.style.animation = '';
                }
            });
        }, { threshold: 0.5 });

        timelineMarkers.forEach(marker => timelineObserver.observe(marker));

        // Add the animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulseGlow {
                0%, 100% {
                    box-shadow: 0 10px 15px -3px rgba(11, 27, 58, 0.1),
                                0 4px 6px -2px rgba(11, 27, 58, 0.05),
                                0 0 20px rgba(47, 128, 237, 0.4);
                }
                50% {
                    box-shadow: 0 10px 15px -3px rgba(11, 27, 58, 0.1),
                                0 4px 6px -2px rgba(11, 27, 58, 0.05),
                                0 0 40px rgba(122, 215, 255, 0.6);
                }
            }
        `;
        document.head.appendChild(style);
    }

    initTimelineAnimation();

    // ================================================
    // PRELOAD CRITICAL IMAGES
    // ================================================

    function preloadImages() {
        const criticalImages = document.querySelectorAll('.hero img, .venue-image img');
        criticalImages.forEach(img => {
            if (img.dataset.src) {
                const preloader = new Image();
                preloader.src = img.dataset.src;
            }
        });
    }

    preloadImages();

    // ================================================
    // PAGE VISIBILITY API (Pause animations when tab is hidden)
    // ================================================

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Pause intensive animations
            document.body.classList.add('tab-hidden');
        } else {
            document.body.classList.remove('tab-hidden');
        }
    });

    // ================================================
    // CONSOLE BRANDING
    // ================================================

    console.log(
        '%c💍 Welcome to our Wedding Website! 💍',
        'color: #2F80ED; font-size: 20px; font-weight: bold;'
    );
    console.log(
        '%cBuilt with love using vanilla HTML, CSS, and JavaScript',
        'color: #7AD7FF; font-size: 12px;'
    );

    // ================================================
    // PÉTALOS CAYENDO
    // ================================================

    function createFallingPetals() {
        const container = document.getElementById('petalsContainer');
        if (!container || prefersReducedMotion) return;

        function createPetal() {
            const petal = document.createElement('div');
            petal.className = 'petal';

            // Random position and animation properties
            const leftPosition = Math.random() * 100;
            const animationDuration = 8 + Math.random() * 6;
            const animationDelay = Math.random() * 5;
            const size = 8 + Math.random() * 6;

            petal.style.left = `${leftPosition}%`;
            petal.style.animationDuration = `${animationDuration}s`;
            petal.style.animationDelay = `${animationDelay}s`;
            petal.style.width = `${size}px`;
            petal.style.height = `${size}px`;

            container.appendChild(petal);

            // Remove petal after animation
            setTimeout(() => {
                petal.remove();
            }, (animationDuration + animationDelay) * 1000);
        }

        // Create initial petals
        for (let i = 0; i < 15; i++) {
            setTimeout(() => createPetal(), i * 300);
        }

        // Continue creating petals
        setInterval(() => {
            if (container.children.length < 20) {
                createPetal();
            }
        }, 2000);
    }

    // Start petals after a short delay
    setTimeout(createFallingPetals, 1000);

    // ================================================
    // CONTADOR ANIMADO EN SECCIÓN DE DATOS CURIOSOS
    // ================================================

    function animateCounters() {
        const counters = document.querySelectorAll('.fact-number');

        const observerOptions = {
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-count'));
                    const duration = 2000;
                    const increment = target / (duration / 16);
                    let current = 0;

                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.textContent = Math.floor(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target;
                        }
                    };

                    updateCounter();
                    observer.unobserve(counter);
                }
            });
        }, observerOptions);

        counters.forEach(counter => observer.observe(counter));
    }

    animateCounters();

    // ================================================
    // EFECTO PARALLAX EN SCROLL
    // ================================================

    function initParallax() {
        if (prefersReducedMotion) return;

        const parallaxElements = document.querySelectorAll('.hero-bg, .bokeh');

        window.addEventListener('scroll', throttle(() => {
            const scrolled = window.pageYOffset;

            parallaxElements.forEach(el => {
                const speed = el.classList.contains('bokeh') ? 0.3 : 0.5;
                el.style.transform = `translateY(${scrolled * speed}px)`;
            });
        }, 10));
    }

    initParallax();

    // ================================================
    // ANIMACIÓN DE HOVER EN TARJETAS CON BRILLO
    // ================================================

    function initCardShineEffect() {
        const cards = document.querySelectorAll('.glass-card, .fact-card, .schedule-card');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });

        // Add shine effect CSS
        const style = document.createElement('style');
        style.textContent = `
            .glass-card, .fact-card, .schedule-card {
                position: relative;
                overflow: hidden;
            }
            .glass-card::before, .fact-card::before, .schedule-card::before {
                content: '';
                position: absolute;
                width: 150px;
                height: 150px;
                background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
                opacity: 0;
                transform: translate(-50%, -50%);
                pointer-events: none;
                transition: opacity 0.3s ease;
                left: var(--mouse-x, 50%);
                top: var(--mouse-y, 50%);
            }
            .glass-card:hover::before, .fact-card:hover::before, .schedule-card:hover::before {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }

    initCardShineEffect();

    // ================================================
    // CONFETTI AL HACER CLICK EN CORAZONES
    // ================================================

    function createConfetti(x, y) {
        if (prefersReducedMotion) return;

        for (let i = 0; i < 15; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${['#2F80ED', '#7AD7FF', '#FFB4C6', '#C9B037'][Math.floor(Math.random() * 4)]};
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
                z-index: 9999;
            `;

            document.body.appendChild(confetti);

            const angle = (Math.PI * 2 * i) / 15;
            const velocity = 3 + Math.random() * 3;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;

            let posX = x;
            let posY = y;
            let opacity = 1;

            const animate = () => {
                posX += vx;
                posY += vy + 2;
                opacity -= 0.02;

                confetti.style.left = posX + 'px';
                confetti.style.top = posY + 'px';
                confetti.style.opacity = opacity;
                confetti.style.transform = `rotate(${posX}deg)`;

                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    confetti.remove();
                }
            };

            animate();
        }
    }

    // Add confetti effect to floating hearts
    const floatingHearts = document.querySelectorAll('.floating-hearts i, .divider-icon i');
    floatingHearts.forEach(heart => {
        heart.style.cursor = 'pointer';
        heart.style.pointerEvents = 'auto';
        heart.addEventListener('click', (e) => {
            createConfetti(e.clientX, e.clientY);
        });
    });

    // ================================================
    // SMOOTH REVEAL ANIMATION MEJORADA
    // ================================================

    function enhancedRevealAnimation() {
        const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealElements.forEach(el => observer.observe(el));
    }

    enhancedRevealAnimation();

    // ================================================
    // MÚSICA DE FONDO
    // ================================================

    function initBackgroundMusic() {
        const audio = document.getElementById('bgMusic');
        const musicToggle = document.getElementById('musicToggle');

        if (!audio || !musicToggle) return;

        audio.volume = 0.3;
        let isPlaying = true;

        // Intentar reproducir automáticamente
        audio.play().then(() => {
            musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
            musicToggle.setAttribute('aria-label', 'Pausar música');
            musicToggle.setAttribute('title', 'Pausar música');
        }).catch(() => {
            // Si el navegador bloquea autoplay, esperar primer clic del usuario
            isPlaying = false;
            document.addEventListener('click', function playOnFirstClick() {
                if (!isPlaying) {
                    audio.play();
                    musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
                    musicToggle.setAttribute('aria-label', 'Pausar música');
                    musicToggle.setAttribute('title', 'Pausar música');
                    isPlaying = true;
                }
                document.removeEventListener('click', playOnFirstClick);
            }, { once: true });
        });

        musicToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isPlaying) {
                audio.pause();
                musicToggle.innerHTML = '<i class="fas fa-music"></i>';
                musicToggle.setAttribute('aria-label', 'Reproducir música');
                musicToggle.setAttribute('title', 'Reproducir música');
            } else {
                audio.play();
                musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
                musicToggle.setAttribute('aria-label', 'Pausar música');
                musicToggle.setAttribute('title', 'Pausar música');
            }
            isPlaying = !isPlaying;
        });
    }

    initBackgroundMusic();

})();
