 const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('navLinks');
        const mobileOverlay = document.getElementById('mobileOverlay');
        const navbar = document.getElementById('navbar');
        const servicesDropdown = document.getElementById('servicesDropdown');
        const servicesToggle = document.getElementById('servicesToggle');
        const mobileCloseBtn = document.getElementById('mobileCloseBtn');

        // ===== OPEN MOBILE MENU =====
        function openMenu() {
            hamburger.classList.add('active');
            navLinks.classList.add('active');
            mobileOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        // ===== CLOSE MOBILE MENU =====
        function closeMenu() {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
            // Also close services dropdown
            servicesDropdown.classList.remove('mobile-open');
        }

        // ===== HAMBURGER TOGGLE =====
        hamburger.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // ===== CLOSE BUTTON =====
        mobileCloseBtn.addEventListener('click', closeMenu);

        // ===== CLOSE ON OVERLAY CLICK =====
        mobileOverlay.addEventListener('click', closeMenu);

        // ===== SERVICES TOGGLE (Mobile) =====
        servicesToggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();
                servicesDropdown.classList.toggle('mobile-open');
            }
        });

        // ===== CLOSE MENU ON NAV LINK CLICK =====
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                // Don't close for services toggle
                if (link === servicesToggle) return;
                // Don't close for view all or mobile logo
                if (link.classList.contains('view-all-link')) return;
                if (link.classList.contains('mobile-logo')) return;

                if (window.innerWidth <= 768) {
                    closeMenu();
                }
            });
        });

        // ===== SCROLL EFFECT =====
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;
            navbar.classList.toggle('scrolled', currentScroll > 50);
            lastScroll = currentScroll;
        });

        // ===== CLOSE MOBILE MENU ON RESIZE TO DESKTOP =====
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                closeMenu();
            }
        });

        // ===== CLOSE MEGA MENU ON OUTSIDE CLICK (Mobile) =====
        document.addEventListener('click', (e) => {
            if (window.innerWidth > 768) return;
            if (!servicesDropdown.contains(e.target)) {
                servicesDropdown.classList.remove('mobile-open');
            }
        });

        // ===== PREVENT BODY SCROLL WHEN MENU OPEN (iOS fix) =====
        navLinks.addEventListener('touchmove', (e) => {
            if (navLinks.scrollHeight <= navLinks.clientHeight) {
                e.preventDefault();
            }
        }, { passive: false });

        // ===== ESCAPE KEY TO CLOSE =====
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeMenu();
            }
        });