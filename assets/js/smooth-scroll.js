// Smooth scroll for anchor links
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header');
    const homeSection = document.getElementById('home');
    
    // Scroll detection for header visibility
    function handleScroll() {
        if (!homeSection || !header) return;
        
        const homeSectionBottom = homeSection.offsetTop + homeSection.offsetHeight;
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        
        // Show header when scrolled past the landing page (home section)
        if (scrollPosition > homeSectionBottom - 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    
    // Check initial state
    handleScroll();
    
    // Get all anchor links that start with #
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#" or empty
            if (href === '#' || href === '#top') {
                return;
            }
            
            e.preventDefault();
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Get header height for offset
                const headerHeight = header ? header.offsetHeight : 0;
                
                // Calculate position with offset
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                
                // Smooth scroll to target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                if (history.pushState) {
                    history.pushState(null, null, href);
                }
            }
        });
    });
    
    // Handle initial page load with hash
    if (window.location.hash) {
        setTimeout(() => {
            const targetId = window.location.hash.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }
    
    // Automatic URL update based on scroll position
    // Track which section is currently in view
    const sections = document.querySelectorAll('section[id]');
    let currentSection = '';
    
    // Use Intersection Observer for efficient scroll detection
    const observerOptions = {
        rootMargin: '-20% 0px -70% 0px', // Trigger when section is roughly in the middle of viewport
        threshold: 0
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                
                // Update URL based on which section is visible
                if (sectionId === 'home') {
                    // Remove hash when scrolled back to home section
                    if (window.location.hash) {
                        history.replaceState(null, null, window.location.pathname);
                        currentSection = '';
                    }
                } else {
                    // Update hash for other sections
                    if (currentSection !== sectionId) {
                        history.replaceState(null, null, '#' + sectionId);
                        currentSection = sectionId;
                    }
                }
            }
        });
    }, observerOptions);
    
    // Observe all sections
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
});

