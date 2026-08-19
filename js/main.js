/**
 * AAPT - Le Coin MG — Main JavaScript
 * Vanilla JS only — No jQuery, no libraries
 * Features: Parallax, Scroll Reveal, Navbar, Mobile Menu,
 *           Product Filter, Modal, Form → Google Sheets, Counters, Back to Top
 */

(function () {
    'use strict';

    // =============================================
    // CONFIG
    // =============================================
    // IMPORTANT: Replace this URL with your deployed Google Apps Script Web App URL
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwawNFdQ6iuQV_kauycY5cr6nIQ7W4rOg7opLCM46QOxEDKt6FYh5ANJcQooyk_ar2i/exec';

    // =============================================
    // DOM ELEMENTS
    // =============================================
    const header = document.getElementById('siteHeader');
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const backToTopBtn = document.getElementById('backToTop');
    const toast = document.getElementById('toast');
    // productModal removed — unified modal now handled by cart.js

    // =============================================
    // 1. NAVBAR SCROLL EFFECT
    // =============================================
    let lastScrollY = 0;
    let ticking = false;

    function updateHeader() {
        const scrollY = window.scrollY;
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        lastScrollY = window.scrollY;
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }, { passive: true });

    // =============================================
    // 2. MOBILE MENU (with overlay backdrop)
    // =============================================
    // Create overlay element for mobile menu backdrop
    var navOverlay = document.createElement('div');
    navOverlay.className = 'nav-overlay';
    navOverlay.id = 'navOverlay';
    document.body.appendChild(navOverlay);

    function openMobileMenu() {
        navLinks.classList.add('open');
        menuToggle.classList.add('active');
        navOverlay.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
        menuToggle.setAttribute('aria-label', 'Fermer le menu');
        document.body.classList.add('menu-open');
    }

    function closeMobileMenu() {
        navLinks.classList.remove('open');
        menuToggle.classList.remove('active');
        navOverlay.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Ouvrir le menu');
        document.body.classList.remove('menu-open');
    }

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            if (navLinks.classList.contains('open')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        // Close menu when clicking a nav link
        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                closeMobileMenu();
            });
        });

        // Close menu when clicking overlay backdrop
        navOverlay.addEventListener('click', function () {
            closeMobileMenu();
        });

        // Close on ESC key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navLinks.classList.contains('open')) {
                closeMobileMenu();
            }
        });

        // Close on window resize to desktop
        window.addEventListener('resize', function () {
            if (window.innerWidth > 768 && navLinks.classList.contains('open')) {
                closeMobileMenu();
            }
        });
    }

    // =============================================
    // 3. PARALLAX SCROLLING
    // =============================================
    const parallaxElements = document.querySelectorAll('.parallax-bg');

    function updateParallax() {
        const scrollY = window.scrollY;
        parallaxElements.forEach(function (el) {
            const speed = parseFloat(el.dataset.speed) || 0.3;
            const parent = el.closest('section') || el.parentElement;
            const rect = parent.getBoundingClientRect();
            // Only animate when in viewport
            if (rect.bottom > 0 && rect.top < window.innerHeight) {
                const yOffset = scrollY * speed;
                el.style.transform = 'translateY(' + yOffset + 'px)';
            }
        });
    }

    window.addEventListener('scroll', function () {
        requestAnimationFrame(updateParallax);
    }, { passive: true });

    // =============================================
    // 4. SCROLL REVEAL (IntersectionObserver)
    // =============================================
    // Signal to CSS that JS is ready — enables reveal animations.
    // Without this class, all content stays visible (safe fallback).
    document.documentElement.classList.add('js-ready');

    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(function (el) {
            revealObserver.observe(el);
        });
    } else {
        // Fallback: show all elements immediately
        revealElements.forEach(function (el) {
            el.classList.add('revealed');
        });
    }

    // =============================================
    // 5. COUNTER ANIMATION
    // =============================================
    const counters = document.querySelectorAll('.counter-number[data-target]');

    function animateCounter(el) {
        const target = parseInt(el.dataset.target, 10);
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);
            el.textContent = current.toLocaleString('fr-FR');

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                el.textContent = target.toLocaleString('fr-FR') + '+';
            }
        }

        requestAnimationFrame(updateCounter);
    }

    if ('IntersectionObserver' in window && counters.length) {
        const counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(function (counter) {
            counterObserver.observe(counter);
        });
    }

    // =============================================
    // 6. PRODUCT CATEGORY FILTER
    // =============================================
    const filterTabs = document.querySelectorAll('.filter-tab');
    const productCards = document.querySelectorAll('.product-card[data-category]');

    filterTabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            // Update active state
            filterTabs.forEach(function (t) {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');

            const filter = tab.dataset.filter;

            productCards.forEach(function (card) {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // Old product modal code removed — unified modal in cart.js
    const contactForm = document.getElementById('contactForm');

    // =============================================
    // 8. FORM SUBMISSION → GOOGLE SHEETS
    // =============================================
    function showToast(message, type) {
        if (!toast) return;
        toast.textContent = message;
        toast.className = 'toast ' + type + ' show';

        setTimeout(function () {
            toast.classList.remove('show');
        }, 4000);
    }

    function validateForm(form) {
        var isValid = true;
        var requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(function (field) {
            if (!field.value.trim()) {
                field.style.borderColor = '#E30613';
                isValid = false;
            } else {
                field.style.borderColor = '';
            }
        });
        // Validate email if present
        var emailField = form.querySelector('[type="email"]');
        if (emailField && emailField.value.trim()) {
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value.trim())) {
                emailField.style.borderColor = '#E30613';
                isValid = false;
            }
        }
        return isValid;
    }

    function submitToGoogleSheets(form, submitBtn) {
        if (!validateForm(form)) {
            showToast('Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }

        var originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span style="display:inline-flex;align-items:center;gap:0.5rem;">Envoi en cours...</span>';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';

        var formData = new FormData(form);
        // Add timestamp
        formData.append('timestamp', new Date().toLocaleString('fr-FR'));

        if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
            // Demo mode: simulate success
            setTimeout(function () {
                showToast('✅ Votre demande a été envoyée avec succès ! Nous vous contacterons bientôt.', 'success');
                form.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '';
            }, 1500);
            return;
        }

        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: formData
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                if (data.result === 'success') {
                    showToast('✅ Votre demande a été envoyée avec succès ! Nous vous contacterons bientôt.', 'success');
                    form.reset();
                } else {
                    showToast('❌ Une erreur est survenue. Veuillez réessayer.', 'error');
                }
            })
            .catch(function () {
                showToast('❌ Erreur de connexion. Veuillez réessayer plus tard.', 'error');
            })
            .finally(function () {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '';
            });
    }

    // Product inquiry form removed — now handled by unified modal in cart.js


    // Contact page form
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var submitBtn = document.getElementById('contactSubmitBtn');
            submitToGoogleSheets(contactForm, submitBtn);
        });
    }

    // =============================================
    // 9. TYPEWRITER EFFECT
    // =============================================
    var typewriterTarget = document.getElementById('typewriterTarget');
    if (typewriterTarget) {
        var phrases = [
            'Vente en Gros & Détail.',
            'Prix Compétitifs.',
            'Livraison Rapide.',
            'Qualité Garantie.'
        ];
        var phraseIndex = 0;
        var charIndex = 0;
        var isDeleting = false;
        var typeSpeed = 80;

        function typeWriter() {
            var currentPhrase = phrases[phraseIndex];

            if (isDeleting) {
                typewriterTarget.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 40;
            } else {
                typewriterTarget.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 80;
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                typeSpeed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typeSpeed = 500;
            }

            setTimeout(typeWriter, typeSpeed);
        }

        // Start after a delay
        setTimeout(typeWriter, 1500);
    }

    // =============================================
    // 10. BACK TO TOP BUTTON
    // =============================================
    if (backToTopBtn) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }, { passive: true });

        backToTopBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // =============================================
    // 11. SMOOTH SCROLL FOR ANCHOR LINKS
    // =============================================
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                var headerOffset = 80;
                var elementPosition = target.getBoundingClientRect().top;
                var offsetPosition = elementPosition + window.scrollY - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // =============================================
    // 12. FORM INPUT FOCUS EFFECTS
    // =============================================
    document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(function (input) {
        input.addEventListener('focus', function () {
            this.closest('.form-group').style.transform = 'translateY(-2px)';
            this.closest('.form-group').style.transition = 'transform 0.2s ease';
        });
        input.addEventListener('blur', function () {
            this.closest('.form-group').style.transform = '';
            // Clear error border on blur if filled
            if (this.value.trim()) {
                this.style.borderColor = '';
            }
        });
    });

    // =============================================
    // 13. INITIAL CALLS
    // =============================================
    updateHeader();
    updateParallax();

})();
