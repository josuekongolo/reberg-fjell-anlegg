/**
 * Reberg Fjell & Anlegg - Main JavaScript
 * Grunnarbeid i Gauldalen
 */

(function() {
    'use strict';

    // DOM Elements
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    const formError = document.getElementById('formError');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    /**
     * Mobile Menu Toggle
     */
    function initMobileMenu() {
        if (!menuToggle || !nav) return;

        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking on nav links
        const navLinks = nav.querySelectorAll('.nav-link');
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (nav.classList.contains('active') &&
                !nav.contains(e.target) &&
                !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    /**
     * Header Scroll Effect
     */
    function initHeaderScroll() {
        if (!header) return;

        let lastScroll = 0;

        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;

            // Add shadow on scroll
            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        });
    }

    /**
     * Smooth Scroll for Anchor Links
     */
    function initSmoothScroll() {
        const anchors = document.querySelectorAll('a[href^="#"]');

        anchors.forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');

                if (href === '#') return;

                const target = document.querySelector(href);

                if (target) {
                    e.preventDefault();

                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /**
     * Contact Form Handler
     */
    function initContactForm() {
        if (!contactForm) return;

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Hide any existing messages
            if (formSuccess) formSuccess.classList.remove('show');
            if (formError) formError.classList.remove('show');

            // Get form data
            const formData = {
                name: contactForm.querySelector('#name').value,
                email: contactForm.querySelector('#email').value,
                phone: contactForm.querySelector('#phone').value,
                address: contactForm.querySelector('#address').value,
                projectType: contactForm.querySelector('#projectType').value,
                description: contactForm.querySelector('#description').value,
                siteVisit: contactForm.querySelector('#siteVisit').checked
            };

            // Get submit button
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Sender...</span>';

            try {
                // Simulate API call (replace with actual Resend API integration)
                await simulateFormSubmission(formData);

                // Show success message
                if (formSuccess) formSuccess.classList.add('show');

                // Reset form
                contactForm.reset();

                // Scroll to message
                formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

            } catch (error) {
                console.error('Form submission error:', error);

                // Show error message
                if (formError) formError.classList.add('show');

                // Scroll to message
                formError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        });
    }

    /**
     * Simulate Form Submission
     * Replace this with actual Resend API integration
     */
    function simulateFormSubmission(data) {
        return new Promise(function(resolve, reject) {
            // Simulate network delay
            setTimeout(function() {
                // Log form data for debugging
                console.log('Form submitted:', data);

                // For demo purposes, always succeed
                // In production, integrate with Resend API here
                resolve({ success: true });

                // Example Resend API integration:
                /*
                fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer YOUR_API_KEY',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        from: 'noreply@rebergfjell.no',
                        to: 'post@rebergfjell.no',
                        subject: `Ny henvendelse fra ${data.name}`,
                        html: `
                            <h2>Ny henvendelse fra nettsiden</h2>
                            <p><strong>Navn:</strong> ${data.name}</p>
                            <p><strong>E-post:</strong> ${data.email}</p>
                            <p><strong>Telefon:</strong> ${data.phone}</p>
                            <p><strong>Adresse:</strong> ${data.address || 'Ikke oppgitt'}</p>
                            <p><strong>Type prosjekt:</strong> ${data.projectType}</p>
                            <p><strong>Beskrivelse:</strong></p>
                            <p>${data.description}</p>
                            <p><strong>Ønsker befaring:</strong> ${data.siteVisit ? 'Ja' : 'Nei'}</p>
                        `
                    })
                })
                .then(response => response.json())
                .then(data => resolve(data))
                .catch(error => reject(error));
                */

            }, 1500);
        });
    }

    /**
     * Project Filter (for Projects page)
     */
    function initProjectFilter() {
        if (!filterBtns.length || !projectCards.length) return;

        filterBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                // Update active state
                filterBtns.forEach(function(b) {
                    b.classList.remove('active');
                });
                btn.classList.add('active');

                // Get filter value
                const filter = btn.getAttribute('data-filter');

                // Filter projects
                projectCards.forEach(function(card) {
                    const category = card.getAttribute('data-category');

                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        setTimeout(function() {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.9)';
                        setTimeout(function() {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    /**
     * Lazy Loading for Images
     */
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const lazyImages = document.querySelectorAll('img[loading="lazy"]');

            const imageObserver = new IntersectionObserver(function(entries, observer) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.classList.add('fade-in');
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '100px 0px'
            });

            lazyImages.forEach(function(img) {
                imageObserver.observe(img);
            });
        }
    }

    /**
     * Scroll Reveal Animation
     */
    function initScrollReveal() {
        if ('IntersectionObserver' in window) {
            const revealElements = document.querySelectorAll('.service-card, .value-card, .why-us-item, .price-card');

            const revealObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('slide-up');
                        revealObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            revealElements.forEach(function(el) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                revealObserver.observe(el);
            });
        }
    }

    /**
     * Form Validation
     */
    function initFormValidation() {
        const forms = document.querySelectorAll('form');

        forms.forEach(function(form) {
            const inputs = form.querySelectorAll('.form-control');

            inputs.forEach(function(input) {
                // Add validation styles on blur
                input.addEventListener('blur', function() {
                    if (input.required && !input.value.trim()) {
                        input.style.borderColor = 'var(--color-error)';
                    } else if (input.type === 'email' && input.value && !isValidEmail(input.value)) {
                        input.style.borderColor = 'var(--color-error)';
                    } else {
                        input.style.borderColor = '';
                    }
                });

                // Clear validation on input
                input.addEventListener('input', function() {
                    input.style.borderColor = '';
                });
            });
        });
    }

    /**
     * Email Validation Helper
     */
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    /**
     * Phone Number Formatting
     */
    function initPhoneFormatting() {
        const phoneInputs = document.querySelectorAll('input[type="tel"]');

        phoneInputs.forEach(function(input) {
            input.addEventListener('input', function(e) {
                // Remove non-digits
                let value = e.target.value.replace(/\D/g, '');

                // Format as Norwegian phone number (XXX XX XXX)
                if (value.length > 3 && value.length <= 5) {
                    value = value.slice(0, 3) + ' ' + value.slice(3);
                } else if (value.length > 5) {
                    value = value.slice(0, 3) + ' ' + value.slice(3, 5) + ' ' + value.slice(5, 8);
                }

                e.target.value = value;
            });
        });
    }

    /**
     * Current Year for Footer
     */
    function updateCopyrightYear() {
        const yearSpans = document.querySelectorAll('.footer-bottom p');
        const currentYear = new Date().getFullYear();

        yearSpans.forEach(function(span) {
            span.innerHTML = span.innerHTML.replace(/\d{4}/, currentYear);
        });
    }

    /**
     * Escape HTML to prevent XSS
     */
    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    /**
     * Initialize All Functions
     */
    function init() {
        initMobileMenu();
        initHeaderScroll();
        initSmoothScroll();
        initContactForm();
        initProjectFilter();
        initLazyLoading();
        initScrollReveal();
        initFormValidation();
        initPhoneFormatting();
        updateCopyrightYear();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
