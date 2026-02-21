/* ============================================
   AMAZING WEBTECH - ULTRA MODERN JAVASCRIPT
   ============================================ */

'use strict';

// ============================================
// PAGE LOADER
// ============================================
(function initLoader() {
  const loader = document.createElement('div');
  loader.className = 'page-loader';
  loader.id = 'page-loader';
  loader.innerHTML = `
    <div class="loader-inner">
      <div class="loader-bar-wrapper">
        <div class="loader-bar"></div>
      </div>
      <span class="loader-text">Loading Amazing WebTech</span>
    </div>
  `;
  document.body.prepend(loader);

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 500);
      // Trigger hero animations after load
      document.querySelector('.slide.active')?.classList.add('active');
    }, 1800);
  });
})();

// ============================================
// UTILITY FUNCTIONS
// ============================================
const utils = {
  // Debounce
  debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  },

  // Throttle
  throttle(fn, limit) {
    let inThrottle;
    return (...args) => {
      if (!inThrottle) {
        fn(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Is element in viewport
  isInViewport(el, offset = 0) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) - offset &&
      rect.bottom >= 0
    );
  },

  // Clamp value
  clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }
};

// ============================================
// CUSTOM CURSOR
// ============================================
class CustomCursor {
  constructor() {
    this.cursor = document.getElementById('cursor');
    this.follower = document.getElementById('cursor-follower');
    this.trail = document.getElementById('cursor-trail');
    this.cursorText = document.getElementById('cursor-text');

    if (!this.cursor || window.matchMedia('(hover: none)').matches) return;

    this.mouse = { x: 0, y: 0 };
    this.followerPos = { x: 0, y: 0 };
    this.trailPos = { x: 0, y: 0 };
    this.isVisible = false;
    this.rafId = null;

    this.init();
  }

  init() {
    // Track mouse position
    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;

      if (!this.isVisible) {
        this.isVisible = true;
        this.cursor.style.opacity = '1';
        this.follower.style.opacity = '1';
      }

      // Direct cursor (instant)
      this.cursor.style.left = `${e.clientX}px`;
      this.cursor.style.top = `${e.clientY}px`;
    });

    // Mouse leave
    document.addEventListener('mouseleave', () => {
      this.cursor.style.opacity = '0';
      this.follower.style.opacity = '0';
      this.trail.style.opacity = '0';
    });

    // Hover effects on interactive elements
    this.setupHoverEffects();

    // Animate follower & trail
    this.animate();
  }

  setupHoverEffects() {
    const linkSelectors = 'a, button, .feature-card, .slider-arrow, .slider-dot, .testimonial-dot, .menu-toggle';

    document.querySelectorAll(linkSelectors).forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-link');
        this.follower.style.borderColor = 'rgba(108, 99, 255, 0.8)';
      });

      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-link');
        this.follower.style.borderColor = 'rgba(108, 99, 255, 0.5)';
      });
    });

    // Click effect
    document.addEventListener('mousedown', () => {
      this.cursor.style.transform = 'translate(-50%, -50%) scale(0.7)';
    });

    document.addEventListener('mouseup', () => {
      this.cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  }

  animate() {
    // Smooth follower
    this.followerPos.x += (this.mouse.x - this.followerPos.x) * 0.12;
    this.followerPos.y += (this.mouse.y - this.followerPos.y) * 0.12;
    this.follower.style.left = `${this.followerPos.x}px`;
    this.follower.style.top = `${this.followerPos.y}px`;

    // Slower trail
    this.trailPos.x += (this.mouse.x - this.trailPos.x) * 0.06;
    this.trailPos.y += (this.mouse.y - this.trailPos.y) * 0.06;
    this.trail.style.left = `${this.trailPos.x}px`;
    this.trail.style.top = `${this.trailPos.y}px`;

    this.rafId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }
}

// ============================================
// HERO SLIDER
// ============================================
class HeroSlider {
  constructor() {
    this.slider = document.getElementById('hero-slider');
    if (!this.slider) return;

    this.slides = this.slider.querySelectorAll('.slide');
    this.dotsContainer = document.getElementById('slider-dots');
    this.prevBtn = document.getElementById('prev-slide');
    this.nextBtn = document.getElementById('next-slide');

    this.currentIndex = 0;
    this.totalSlides = this.slides.length;
    this.autoPlayInterval = null;
    this.autoPlayDelay = 5000;
    this.isAnimating = false;
    this.touchStartX = 0;
    this.touchEndX = 0;

    this.init();
  }

  init() {
    this.createDots();
    this.goTo(0);
    this.startAutoPlay();
    this.bindEvents();
  }

  createDots() {
    if (!this.dotsContainer) return;
    this.dotsContainer.innerHTML = '';

    this.slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = `slider-dot${i === 0 ? ' active' : ''}`;
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => this.goTo(i));
      this.dotsContainer.appendChild(dot);
    });
  }

  goTo(index) {
    if (this.isAnimating) return;
    this.isAnimating = true;

    // Remove active from current
    this.slides[this.currentIndex].classList.remove('active');
    this.updateDots(index);
    this.currentIndex = index;

    // Add active to new
    setTimeout(() => {
      this.slides[this.currentIndex].classList.add('active');
      setTimeout(() => this.isAnimating = false, 800);
    }, 100);
  }

  next() {
    const nextIndex = (this.currentIndex + 1) % this.totalSlides;
    this.goTo(nextIndex);
  }

  prev() {
    const prevIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
    this.goTo(prevIndex);
  }

  updateDots(index) {
    const dots = this.dotsContainer?.querySelectorAll('.slider-dot');
    dots?.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  startAutoPlay() {
    this.stopAutoPlay();
    this.autoPlayInterval = setInterval(() => this.next(), this.autoPlayDelay);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  bindEvents() {
    this.prevBtn?.addEventListener('click', () => {
      this.prev();
      this.resetAutoPlay();
    });

    this.nextBtn?.addEventListener('click', () => {
      this.next();
      this.resetAutoPlay();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      const heroSection = document.getElementById('hero');
      if (!heroSection) return;

      if (e.key === 'ArrowLeft') { this.prev(); this.resetAutoPlay(); }
      if (e.key === 'ArrowRight') { this.next(); this.resetAutoPlay(); }
    });

    // Touch / swipe
    const heroEl = document.getElementById('hero');
    if (heroEl) {
      heroEl.addEventListener('touchstart', (e) => {
        this.touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      heroEl.addEventListener('touchend', (e) => {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
      }, { passive: true });
    }

    // Pause on hover
    this.slider?.addEventListener('mouseenter', () => this.stopAutoPlay());
    this.slider?.addEventListener('mouseleave', () => this.startAutoPlay());
  }

  handleSwipe() {
    const diff = this.touchStartX - this.touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) this.next();
      else this.prev();
      this.resetAutoPlay();
    }
  }

  resetAutoPlay() {
    this.stopAutoPlay();
    this.startAutoPlay();
  }
}

// ============================================
// TESTIMONIALS SLIDER
// ============================================
class TestimonialsSlider {
  constructor() {
    this.container = document.getElementById('testimonials-slider');
    if (!this.container) return;

    this.items = this.container.querySelectorAll('.testimonial-item');
    this.dotsContainer = document.getElementById('testimonial-dots');
    this.currentIndex = 0;
    this.interval = null;

    this.init();
  }

  init() {
    this.createDots();
    this.startAutoPlay();
  }

  createDots() {
    if (!this.dotsContainer) return;
    this.dotsContainer.innerHTML = '';

    this.items.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = `testimonial-dot${i === 0 ? ' active' : ''}`;
      dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
      dot.addEventListener('click', () => this.goTo(i));
      this.dotsContainer.appendChild(dot);
    });
  }

  goTo(index) {
    this.items[this.currentIndex].classList.remove('active');
    this.currentIndex = index;
    this.items[this.currentIndex].classList.add('active');
    this.updateDots();
  }

  next() {
    const nextIndex = (this.currentIndex + 1) % this.items.length;
    this.goTo(nextIndex);
  }

  updateDots() {
    const dots = this.dotsContainer?.querySelectorAll('.testimonial-dot');
    dots?.forEach((dot, i) => {
      dot.classList.toggle('active', i === this.currentIndex);
    });
  }

  startAutoPlay() {
    this.interval = setInterval(() => this.next(), 5000);
  }
}

// ============================================
// COUNTER ANIMATION
// ============================================
class CounterAnimation {
  constructor() {
    this.counters = document.querySelectorAll('.stat-number');
    this.animated = new Set();
    this.init();
  }

  init() {
    if (!this.counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.animated.has(entry.target)) {
          this.animated.add(entry.target);
          this.animateCounter(entry.target);
        }
      });
    }, { threshold: 0.3 });

    this.counters.forEach(counter => observer.observe(counter));
  }

  animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 2200;
    const steps = 60;
    const stepTime = duration / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      // Ease out effect
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      current = Math.round(eased * target);
      el.textContent = current.toLocaleString();

      if (step >= steps) {
        clearInterval(timer);
        el.textContent = target.toLocaleString();
      }
    }, stepTime);
  }
}

// ============================================
// AOS (ANIMATE ON SCROLL)
// ============================================
class AnimateOnScroll {
  constructor() {
    this.elements = document.querySelectorAll('[data-aos]');
    if (!this.elements.length) return;
    this.init();
  }

  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute('data-aos-delay') || 0;
          setTimeout(() => {
            entry.target.classList.add('aos-animate');
          }, parseInt(delay));
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -80px 0px'
    });

    this.elements.forEach(el => observer.observe(el));
  }
}

// ============================================
// BACK TO TOP
// ============================================
class BackToTop {
  constructor() {
    this.btn = document.getElementById('back-to-top');
    if (!this.btn) return;
    this.init();
  }

  init() {
    window.addEventListener('scroll', utils.throttle(() => {
      if (window.scrollY > 400) {
        this.btn.classList.add('visible');
      } else {
        this.btn.classList.remove('visible');
      }
    }, 100));

    this.btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// ============================================
// CONTACT FORM
// ============================================
class ContactForm {
  constructor() {
    this.form = document.getElementById('contact-form');
    this.messageEl = document.getElementById('form-message');
    if (!this.form) return;
    this.init();
  }

  init() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));

    // Real-time validation
    this.form.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
          this.validateField(input);
        }
      });
    });
  }

  validateField(field) {
    const isValid = field.checkValidity();
    field.style.borderColor = isValid ? 'rgba(67, 233, 123, 0.5)' : 'rgba(255, 101, 132, 0.5)';
    return isValid;
  }

  async handleSubmit(e) {
    e.preventDefault();

    const btn = this.form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    // Validate all fields
    let isValid = true;
    this.form.querySelectorAll('input[required], textarea[required]').forEach(field => {
      if (!this.validateField(field)) isValid = false;
    });

    if (!isValid) {
      this.showMessage('Please fill in all required fields correctly.', 'error');
      return;
    }

    // Loading state
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    // Simulate async send
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Reset button & form
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Message Sent!';
    btn.style.background = 'linear-gradient(135deg, #43e97b 0%, #00d2ff 100%)';

    this.showMessage(
      '🎉 Thank you! Your message has been sent successfully. We\'ll get back to you soon.',
      'success'
    );

    this.form.reset();
    this.form.querySelectorAll('input, textarea').forEach(f => {
      f.style.borderColor = '';
    });

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = '';
      btn.disabled = false;
    }, 4000);
  }

  showMessage(text, type) {
    if (!this.messageEl) return;
    this.messageEl.textContent = text;
    this.messageEl.className = `form-message ${type}`;
    this.messageEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// ============================================
// NEWSLETTER FORM
// ============================================
class NewsletterForm {
  constructor() {
    this.form = document.getElementById('newsletter-form');
    if (!this.form) return;
    this.init();
  }

  init() {
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = this.form.querySelector('input[type="email"]');
      const btn = this.form.querySelector('button');

      if (!input.value || !input.checkValidity()) {
        input.style.borderColor = 'rgba(255, 101, 132, 0.5)';
        return;
      }

      const originalText = btn.textContent;
      btn.textContent = 'Subscribing...';
      btn.disabled = true;

      await new Promise(resolve => setTimeout(resolve, 1500));

      btn.textContent = 'Subscribed! ✓';
      btn.style.background = 'linear-gradient(135deg, #43e97b 0%, #00d2ff 100%)';
      input.value = '';

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    });
  }
}

// ============================================
// PARALLAX EFFECT
// ============================================
class ParallaxEffect {
  constructor() {
    this.hero = document.querySelector('.hero-section');
    this.circles = document.querySelectorAll('.hero-bg-elements .circle');
    if (!this.hero || window.matchMedia('(hover: none)').matches) return;
    this.init();
  }

  init() {
    window.addEventListener('mousemove', utils.throttle((e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / innerWidth;
      const y = (e.clientY - innerHeight / 2) / innerHeight;

      this.circles.forEach((circle, i) => {
        const depth = (i + 1) * 15;
        circle.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
      });
    }, 30));
  }
}

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }
}

// ============================================
// TILT EFFECT ON FEATURE CARDS
// ============================================
class TiltEffect {
  constructor() {
    this.cards = document.querySelectorAll('.feature-card');
    if (!this.cards.length || window.matchMedia('(hover: none)').matches) return;
    this.init();
  }

  init() {
    this.cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = utils.clamp(((y - centerY) / centerY) * -8, -8, 8);
        const rotateY = utils.clamp(((x - centerX) / centerX) * 8, -8, 8);

        card.style.transform = `
          translateY(-10px) 
          rotateX(${rotateX}deg) 
          rotateY(${rotateY}deg)
          scale(1.02)
        `;
        card.style.transition = 'transform 0.1s ease';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = '';
      });
    });
  }
}

// ============================================
// GLITCH TEXT EFFECT (CTA)
// ============================================
class GlitchEffect {
  constructor() {
    this.el = document.querySelector('.cta-email');
    if (!this.el) return;
    this.originalText = this.el.textContent;
    this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@._';
    this.init();
  }

  init() {
    this.el.addEventListener('mouseenter', () => this.glitch());
  }

  glitch() {
    let iterations = 0;
    const maxIterations = this.originalText.length * 3;

    const interval = setInterval(() => {
      this.el.textContent = this.originalText
        .split('')
        .map((char, i) => {
          if (i < iterations / 3) return char;
          if (char === ' ') return char;
          return this.chars[Math.floor(Math.random() * this.chars.length)];
        })
        .join('');

      iterations++;
      if (iterations >= maxIterations) {
        clearInterval(interval);
        this.el.textContent = this.originalText;
      }
    }, 40);
  }
}

// ============================================
// PARTICLE BACKGROUND (LIGHTWEIGHT)
// ============================================
class ParticleEffect {
  constructor() {
    const heroSection = document.getElementById('hero');
    if (!heroSection) return;

    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText = `
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      pointer-events: none;
      z-index: 1;
      opacity: 0.4;
    `;
    heroSection.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animFrame = null;

    this.resize();
    this.createParticles();
    this.animate();

    window.addEventListener('resize', utils.debounce(() => {
      this.resize();
      this.createParticles();
    }, 300));
  }

  resize() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  }

  createParticles() {
    const count = Math.floor((this.canvas.width * this.canvas.height) / 15000);
    this.particles = [];

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        color: Math.random() > 0.5 ? '108, 99, 255' : '255, 101, 132'
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < 0) p.x = this.canvas.width;
      if (p.x > this.canvas.width) p.x = 0;
      if (p.y < 0) p.y = this.canvas.height;
      if (p.y > this.canvas.height) p.y = 0;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
      this.ctx.fill();
    });

    // Connect nearby particles with lines
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.strokeStyle = `rgba(108, 99, 255, ${0.08 * (1 - dist / 100)})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    }

    this.animFrame = requestAnimationFrame(() => this.animate());
  }
}

// ============================================
// NAVBAR SCROLL EFFECT (ADDITIONAL)
// ============================================
class NavbarScroll {
  constructor() {
    this.navbar = document.getElementById('navbar');
    if (!this.navbar) return;
    this.init();
  }

  init() {
    const handler = utils.throttle(() => {
      if (window.scrollY > 80) {
        this.navbar.classList.add('scrolled');
      } else {
        this.navbar.classList.remove('scrolled');
      }
    }, 50);

    window.addEventListener('scroll', handler, { passive: true });
    handler(); // Run on init
  }
}

// ============================================
// MAGNETIC BUTTONS
// ============================================
class MagneticButtons {
  constructor() {
    this.buttons = document.querySelectorAll('.btn, .slider-arrow, .back-to-top');
    if (!this.buttons.length || window.matchMedia('(hover: none)').matches) return;
    this.init();
  }

  init() {
    this.buttons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        btn.style.transition = 'transform 0.1s ease';
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
      });
    });
  }
}

// ============================================
// TYPEWRITER EFFECT
// ============================================
class TypewriterEffect {
  constructor() {
    // Add typewriter to hero subheading on first slide
    const subheadings = document.querySelectorAll('.slide .subheading');
    if (!subheadings.length) return;
    // Effect only on active slide subheadings
  }
}

// ============================================
// SCROLL PROGRESS INDICATOR
// ============================================
class ScrollProgress {
  constructor() {
    this.bar = document.createElement('div');
    this.bar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 0%;
      height: 3px;
      background: linear-gradient(90deg, #6c63ff, #ff6584, #43e97b);
      z-index: 99999;
      transition: width 0.1s linear;
      pointer-events: none;
    `;
    document.body.appendChild(this.bar);
    this.init();
  }

  init() {
    window.addEventListener('scroll', utils.throttle(() => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      this.bar.style.width = `${progress}%`;
    }, 16), { passive: true });
  }
}

// ============================================
// SECTION REVEAL WITH STAGGER
// ============================================
class SectionReveal {
  constructor() {
    this.sections = document.querySelectorAll('.section');
    if (!this.sections.length) return;
    this.init();
  }

  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'none';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });

    this.sections.forEach(section => {
      section.style.opacity = '0';
      section.style.transform = 'translateY(20px)';
      section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      observer.observe(section);
    });
  }
}

// ============================================
// INITIALIZE ALL MODULES
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Core features
  new CustomCursor();
  new HeroSlider();
  new TestimonialsSlider();
  new CounterAnimation();
  new AnimateOnScroll();
  new BackToTop();
  new ContactForm();
  new NewsletterForm();
  new NavbarScroll();
  new SmoothScroll();

  // Visual enhancements
  new ParallaxEffect();
  new TiltEffect();
  new GlitchEffect();
  new MagneticButtons();
  new ScrollProgress();
  new SectionReveal();

  // Heavy features (with slight delay)
  setTimeout(() => {
    new ParticleEffect();
  }, 2000);

  console.log('%c🚀 Amazing WebTech Initialized', 
    'color: #6c63ff; font-size: 1.2rem; font-weight: bold;'
  );
});

// Performance: cleanup on page hide
document.addEventListener('visibilitychange', () => {
  // Pause video when tab is hidden
  const video = document.getElementById('hero-video');
  if (video) {
    document.hidden ? video.pause() : video.play();
  }
});