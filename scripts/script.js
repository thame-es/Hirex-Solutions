const performanceOptimizer = {
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    optimizeAnimations: () => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const shouldReduceMotion = mediaQuery.matches || !window.matchMedia('(min-width: 768px)').matches;
        
        if (shouldReduceMotion) {
            const particles = document.querySelectorAll('.particle');
            particles.forEach(particle => {
                particle.style.animationDuration = '4s';
                if (window.innerWidth < 480) {
                    particle.style.display = 'none';
                }
            });

            document.body.style.backgroundAttachment = 'scroll';
            
            const brandText = document.querySelector('.brand-text');
            if (brandText) {
                brandText.style.animationDuration = '4s';
            }

            const countdownNumber = document.querySelector('.countdown-number');
            if (countdownNumber) {
                countdownNumber.style.animationDuration = '3s';
            }
        }
    },

    lazyLoadElements: () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.classList.contains('social-button')) {
                        entry.target.style.visibility = 'visible';
                    }
                    observer.unobserve(entry.target);
                }
            });
        });

        document.querySelectorAll('.social-button').forEach(button => {
            button.style.visibility = 'hidden';
            observer.observe(button);
        });
    },

    optimizeMobileMenu: () => {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu) {
            mobileMenu.style.transition = 'transform 0.3s ease-in-out';
            mobileMenu.style.transform = 'translateY(-20%)';
        }
    },

    optimizeScroll: () => {
        const scrollHandler = performanceOptimizer.debounce(() => {
            requestAnimationFrame(() => {
                const scrollPosition = window.scrollY;
                if (scrollPosition > 50) {
                    document.querySelector('.glass-nav')?.classList.add('scrolled');
                } else {
                    document.querySelector('.glass-nav')?.classList.remove('scrolled');
                }
            });
        }, 16);

        window.addEventListener('scroll', scrollHandler, { passive: true });
    },

    optimizeParticles: () => {
        const devicePixelRatio = window.devicePixelRatio || 1;
        const isLowEndDevice = devicePixelRatio < 2 || navigator.hardwareConcurrency <= 4;
        
        if (isLowEndDevice) {
            window.createParticles = () => {
                const container = document.getElementById('particles');
                if (!container) return;
                
                const particleCount = window.innerWidth < 768 ? 5 : 10;
                for (let i = 0; i < particleCount; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'particle';
                    particle.style.width = Math.random() * 3 + 2 + 'px';
                    particle.style.height = particle.style.width;
                    particle.style.left = Math.random() * 100 + '%';
                    particle.style.top = Math.random() * 100 + '%';
                    particle.style.animationDelay = Math.random() * 2 + 's';
                    container.appendChild(particle);
                }
            };
        }
    },

    init: () => {
        document.addEventListener('DOMContentLoaded', () => {
            performanceOptimizer.optimizeAnimations();
            performanceOptimizer.lazyLoadElements();
            performanceOptimizer.optimizeMobileMenu();
            performanceOptimizer.optimizeScroll();
            performanceOptimizer.optimizeParticles();
        });

        window.addEventListener('resize', 
            performanceOptimizer.debounce(() => {
                performanceOptimizer.optimizeAnimations();
            }, 250), 
            { passive: true }
        );
    }
};

performanceOptimizer.init();

function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const menuIcon = document.getElementById('menuIcon');
    
    if (menu.classList.contains('h-0')) {
        menu.classList.remove('h-0', 'overflow-hidden');
        menu.classList.add('h-auto');
        menuIcon.setAttribute('d', 'M6 18L18 6M6 6l12 12');
    } else {
        menu.classList.add('h-0', 'overflow-hidden');
        menu.classList.remove('h-auto');
        menuIcon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
    }
}

function createParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.width = Math.random() * 4 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 2 + 's';
        container.appendChild(particle);
    }
}

function updateCountdown() {
    const launchDate = new Date('2025-02-13T23:59:59');
    const now = new Date();
    const difference = launchDate - now;
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    
    const daysElement = document.getElementById('days');
    daysElement.textContent = days.toString().padStart(3, '0');
    
    const progress = document.querySelector('.countdown-progress');
    const totalDays = 365;
    const circumference = 2 * Math.PI * 120;
    const offset = ((totalDays - days) / totalDays) * circumference;
    progress.style.strokeDasharray = `${circumference} ${circumference}`;
    progress.style.strokeDashoffset = offset;
}

function createRipple(event) {
    const button = event.currentTarget;
    
    const ripples = button.getElementsByClassName("ripple");
    for (let ripple of ripples) {
        ripple.remove();
    }

    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left - radius;
    const y = event.clientY - rect.top - radius;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;
    circle.classList.add("ripple");

    button.appendChild(circle);
}

document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    updateCountdown();
    setInterval(updateCountdown, 1000);
});