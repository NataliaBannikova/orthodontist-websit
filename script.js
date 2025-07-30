// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling to all links with href starting with #
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Add hover effects to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add click effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect with input sanitization
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(Math.abs(rect.width), Math.abs(rect.height));
            
            // Sanitize and validate coordinates
            const clientX = typeof e.clientX === 'number' ? e.clientX : 0;
            const clientY = typeof e.clientY === 'number' ? e.clientY : 0;
            const x = Math.max(0, Math.min(clientX - rect.left - size / 2, rect.width));
            const y = Math.max(0, Math.min(clientY - rect.top - size / 2, rect.height));
            
            // Use safe numeric values only
            ripple.style.width = Math.abs(size) + 'px';
            ripple.style.height = Math.abs(size) + 'px';
            ripple.style.left = Math.abs(x) + 'px';
            ripple.style.top = Math.abs(y) + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.remove();
                }
            }, 600);
        });
    });
    
    // Add parallax effect to hero section with throttling
    let isScrolling = false;
    const parallaxEffect = () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const rate = scrolled * -0.1;
        
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
        isScrolling = false;
    };
    
    const handleScroll = () => {
        if (!isScrolling) {
            requestAnimationFrame(parallaxEffect);
            isScrolling = true;
        }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Add counter animation for stats
    const animateCounters = () => {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const originalText = counter.textContent;
            const hasPlus = originalText.includes('+');
            const hasPercent = originalText.includes('%');
            const target = parseInt(originalText);
            const increment = target / 60; // 60 frames for 1 second at 60fps
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    const displayValue = Math.ceil(current);
                    counter.textContent = displayValue + (hasPlus ? '+' : '') + (hasPercent ? '%' : '');
                    requestAnimationFrame(updateCounter);
                } else {
                    // Ensure final value is exactly the target
                    counter.textContent = target + (hasPlus ? '+' : '') + (hasPercent ? '%' : '');
                }
            };
            
            updateCounter();
        });
    };
    
    // Trigger counter animation when stats section is visible
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    }
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

