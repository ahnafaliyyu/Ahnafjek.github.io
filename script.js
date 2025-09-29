// ===== MODERN AHNAFJEK WEBSITE SCRIPT =====

class AhnafJekApp {
  constructor() {
    this.currentSection = 0;
    this.sections = [];
    this.isScrolling = false;
    this.touchStartY = 0;
    this.touchEndY = 0;
    this.testimonialIndex = 0;
    this.testimonialTimer = null;
    
    this.init();
  }

  init() {
    this.setupElements();
    this.setupEventListeners();
    this.setupIntersectionObserver();
    this.setupTestimonialSlider();
    this.setupCitySearch();
    this.setupScrollRotation();
    this.setupAnimations();
    
    // Initialize first section as active
    this.updateActiveSection(0);
  }

  setupElements() {
    this.header = document.getElementById('header');
    this.hamburger = document.getElementById('hamburger');
    this.nav = document.getElementById('nav');
    this.mobileOverlay = document.getElementById('mobile-overlay');
    this.sections = Array.from(document.querySelectorAll('.section'));
    this.navLinks = Array.from(document.querySelectorAll('.nav-link'));
    this.partnerModal = document.getElementById('partner-modal');
    this.partnerForm = document.getElementById('partner-form');
    this.citySearch = document.getElementById('city-search');
    this.citiesGrid = document.getElementById('cities-grid');
  }

setupEventListeners() {
  // Header scroll effect
  window.addEventListener('scroll', this.handleScroll.bind(this));
  
  // Hamburger menu
  this.hamburger.addEventListener('click', this.toggleMobileMenu.bind(this));
  this.mobileOverlay.addEventListener('click', this.closeMobileMenu.bind(this));
  
  // Navigation links → scroll normal
  this.navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      this.closeMobileMenu();
      // biarkan browser scroll default sesuai href
    });
  });

  // --- Section rotation (WHEEL & TOUCH) dihapus agar scroll default berjalan ---
  // window.addEventListener('wheel', this.handleWheelScroll.bind(this), { passive: false });
  // window.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
  // window.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });

  // Keyboard navigation (opsional, bisa dihapus juga kalau ingin full scroll default)
  // window.addEventListener('keydown', this.handleKeyNavigation.bind(this));
  
  // Partner form
  if (this.partnerForm) {
    this.partnerForm.addEventListener('submit', this.handlePartnerForm.bind(this));
  }
  
  // Resize handler
  window.addEventListener('resize', this.handleResize.bind(this));
  
  // Prevent default scroll behavior on modal/slider → ini masih oke, biar modal bisa scroll terpisah
  document.addEventListener('wheel', (e) => {
    if (e.target.closest('.modal') || e.target.closest('.testimonials-slider')) {
      return;
    }
  });
}


  setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionIndex = this.sections.indexOf(entry.target);
          if (sectionIndex !== -1 && sectionIndex !== this.currentSection) {
            this.updateActiveSection(sectionIndex);
          }
        }
      });
    }, options);

    this.sections.forEach(section => {
      this.observer.observe(section);
    });
  }

  setupScrollRotation() {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add scroll indicators
    this.createScrollIndicators();
  }

  createScrollIndicators() {
    const indicators = document.createElement('div');
    indicators.className = 'scroll-indicators';
    indicators.innerHTML = this.sections.map((_, index) => 
      `<button class="scroll-indicator ${index === 0 ? 'active' : ''}" data-section="${index}"></button>`
    ).join('');
    
    // Add CSS for indicators
    const style = document.createElement('style');
    style.textContent = `
      .scroll-indicators {
        position: fixed;
        right: 2rem;
        top: 50%;
        transform: translateY(-50%);
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      
      .scroll-indicator {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid var(--primary-blue);
        background: transparent;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      
      .scroll-indicator.active {
        background: var(--primary-blue);
        transform: scale(1.2);
      }
      
      .scroll-indicator:hover {
        transform: scale(1.1);
      }
      
      @media (max-width: 768px) {
        .scroll-indicators {
          right: 1rem;
        }
        
        .scroll-indicator {
          width: 10px;
          height: 10px;
        }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(indicators);
    
    // Add click handlers for indicators
    indicators.addEventListener('click', (e) => {
      if (e.target.classList.contains('scroll-indicator')) {
        const sectionIndex = parseInt(e.target.dataset.section);
        this.navigateToSection(sectionIndex);
      }
    });
    
    this.scrollIndicators = indicators;
  }

  handleScroll() {
    // Header scroll effect
    if (window.scrollY > 50) {
      this.header.classList.add('scrolled');
    } else {
      this.header.classList.remove('scrolled');
    }
  }

  handleWheelScroll(e) {
    if (this.isScrolling || e.target.closest('.modal') || e.target.closest('.cities-search')) {
      return;
    }

    e.preventDefault();
    
    const delta = e.deltaY;
    const threshold = 50;
    
    if (Math.abs(delta) > threshold) {
      if (delta > 0 && this.currentSection < this.sections.length - 1) {
        // Scroll down
        this.navigateToSection(this.currentSection + 1);
      } else if (delta < 0 && this.currentSection > 0) {
        // Scroll up
        this.navigateToSection(this.currentSection - 1);
      }
    }
  }

  handleTouchStart(e) {
    this.touchStartY = e.touches[0].clientY;
  }

  handleTouchEnd(e) {
    if (this.isScrolling) return;
    
    this.touchEndY = e.changedTouches[0].clientY;
    const deltaY = this.touchStartY - this.touchEndY;
    const threshold = 50;
    
    if (Math.abs(deltaY) > threshold) {
      if (deltaY > 0 && this.currentSection < this.sections.length - 1) {
        // Swipe up - go to next section
        this.navigateToSection(this.currentSection + 1);
      } else if (deltaY < 0 && this.currentSection > 0) {
        // Swipe down - go to previous section
        this.navigateToSection(this.currentSection - 1);
      }
    }
  }

  handleKeyNavigation(e) {
    if (this.isScrolling) return;
    
    switch(e.key) {
      case 'ArrowDown':
      case 'PageDown':
        e.preventDefault();
        if (this.currentSection < this.sections.length - 1) {
          this.navigateToSection(this.currentSection + 1);
        }
        break;
      case 'ArrowUp':
      case 'PageUp':
        e.preventDefault();
        if (this.currentSection > 0) {
          this.navigateToSection(this.currentSection - 1);
        }
        break;
      case 'Home':
        e.preventDefault();
        this.navigateToSection(0);
        break;
      case 'End':
        e.preventDefault();
        this.navigateToSection(this.sections.length - 1);
        break;
      case 'Escape':
        this.closePartnerModal();
        this.closeMobileMenu();
        break;
    }
  }

  navigateToSection(index) {
    if (index < 0 || index >= this.sections.length || index === this.currentSection || this.isScrolling) {
      return;
    }

    this.isScrolling = true;
    this.currentSection = index;
    
    // Smooth scroll to section
    this.sections[index].scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
    
    // Update active states
    this.updateActiveSection(index);
    
    // Reset scrolling flag after animation
    setTimeout(() => {
      this.isScrolling = false;
    }, 1000);
  }

  updateActiveSection(index) {
    // Update sections
    this.sections.forEach((section, i) => {
      section.classList.toggle('active', i === index);
    });
    
    // Update navigation
    this.navLinks.forEach((link, i) => {
      link.classList.toggle('active', i === index);
    });
    
    // Update scroll indicators
    if (this.scrollIndicators) {
      const indicators = this.scrollIndicators.querySelectorAll('.scroll-indicator');
      indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === index);
      });
    }
    
    this.currentSection = index;
  }

  toggleMobileMenu() {
    this.hamburger.classList.toggle('active');
    this.nav.classList.toggle('active');
    this.mobileOverlay.classList.toggle('active');
    document.body.style.overflow = this.nav.classList.contains('active') ? 'hidden' : '';
  }

  closeMobileMenu() {
    this.hamburger.classList.remove('active');
    this.nav.classList.remove('active');
    this.mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  setupTestimonialSlider() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const testimonialBtns = document.querySelectorAll('.testimonial-btn');
    
    if (testimonialCards.length === 0) return;
    
    // Auto-rotate testimonials
    this.startTestimonialTimer();
    
    // Manual navigation
    testimonialBtns.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        this.showTestimonial(index);
        this.resetTestimonialTimer();
      });
    });
    
    // Pause on hover
    const testimonialSection = document.querySelector('.testimonials-slider');
    if (testimonialSection) {
      testimonialSection.addEventListener('mouseenter', () => {
        this.stopTestimonialTimer();
      });
      
      testimonialSection.addEventListener('mouseleave', () => {
        this.startTestimonialTimer();
      });
    }
  }

  showTestimonial(index) {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const testimonialBtns = document.querySelectorAll('.testimonial-btn');
    
    testimonialCards.forEach((card, i) => {
      card.classList.toggle('active', i === index);
    });
    
    testimonialBtns.forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
    });
    
    this.testimonialIndex = index;
  }

  startTestimonialTimer() {
    this.testimonialTimer = setInterval(() => {
      const testimonialCards = document.querySelectorAll('.testimonial-card');
      const nextIndex = (this.testimonialIndex + 1) % testimonialCards.length;
      this.showTestimonial(nextIndex);
    }, 5000);
  }

  stopTestimonialTimer() {
    if (this.testimonialTimer) {
      clearInterval(this.testimonialTimer);
      this.testimonialTimer = null;
    }
  }

  resetTestimonialTimer() {
    this.stopTestimonialTimer();
    this.startTestimonialTimer();
  }

  setupCitySearch() {
    if (!this.citySearch || !this.citiesGrid) return;
    
    this.citySearch.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const cityCards = this.citiesGrid.querySelectorAll('.city-card');
      
      cityCards.forEach(card => {
        const cityName = card.querySelector('h3').textContent.toLowerCase();
        const isVisible = cityName.includes(searchTerm);
        card.style.display = isVisible ? 'block' : 'none';
        
        if (isVisible && searchTerm) {
          card.style.animation = 'fadeInUp 0.3s ease-out';
        }
      });
      
      // Show "no results" message if needed
      const visibleCards = Array.from(cityCards).filter(card => 
        card.style.display !== 'none'
      );
      
      if (visibleCards.length === 0 && searchTerm) {
        this.showNoResultsMessage();
      } else {
        this.hideNoResultsMessage();
      }
    });
  }

  showNoResultsMessage() {
    let noResultsMsg = this.citiesGrid.querySelector('.no-results');
    if (!noResultsMsg) {
      noResultsMsg = document.createElement('div');
      noResultsMsg.className = 'no-results';
      noResultsMsg.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--gray-500);">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
          <h3>Kota tidak ditemukan</h3>
          <p>Coba kata kunci lain atau lihat daftar kota yang tersedia</p>
        </div>
      `;
      this.citiesGrid.appendChild(noResultsMsg);
    }
    noResultsMsg.style.display = 'block';
  }

  hideNoResultsMessage() {
    const noResultsMsg = this.citiesGrid.querySelector('.no-results');
    if (noResultsMsg) {
      noResultsMsg.style.display = 'none';
    }
  }

  setupAnimations() {
    // Animate elements on scroll
    const animateOnScroll = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = entry.target.dataset.animation || 'fadeInUp 0.6s ease-out forwards';
          observer.unobserve(entry.target);
        }
      });
    };

    const animationObserver = new IntersectionObserver(animateOnScroll, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Observe elements with data-aos attributes
    document.querySelectorAll('[data-aos]').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.dataset.animation = 'fadeInUp 0.6s ease-out forwards';
      animationObserver.observe(el);
    });

    // Add stagger animation for grids
    document.querySelectorAll('.services-grid .service-card').forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
    });

    document.querySelectorAll('.partners-grid .partner-card').forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
    });
  }

  handleResize() {
    // Update mobile menu state on resize
    if (window.innerWidth > 768) {
      this.closeMobileMenu();
    }
  }

  // Partner Modal Functions
  openPartnerModal(type) {
    const modal = this.partnerModal;
    const title = document.getElementById('modal-title');
    const subtitle = document.getElementById('modal-subtitle');
    
    if (!modal) return;
    
    // Set modal content based on type
    const modalContent = {
      driver: {
        title: 'Daftar Mitra Driver',
        subtitle: 'Bergabunglah dengan ribuan driver AhnafJek dan raih penghasilan hingga Rp8 juta/bulan'
      },
      merchant: {
        title: 'Daftar Mitra Merchant',
        subtitle: 'Kembangkan bisnis kuliner Anda dengan platform AhnafJek'
      },
      corporate: {
        title: 'Solusi Korporat',
        subtitle: 'Dapatkan layanan khusus untuk kebutuhan perusahaan Anda'
      }
    };
    
    const content = modalContent[type] || modalContent.driver;
    title.textContent = content.title;
    subtitle.textContent = content.subtitle;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus on first input
    setTimeout(() => {
      const firstInput = modal.querySelector('input');
      if (firstInput) firstInput.focus();
    }, 300);
  }

  closePartnerModal() {
    const modal = this.partnerModal;
    if (!modal) return;
    
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Reset form
    const form = modal.querySelector('form');
    const successMsg = modal.querySelector('.form-success');
    
    if (form) {
      form.style.display = 'flex';
      form.reset();
    }
    
    if (successMsg) {
      successMsg.style.display = 'none';
    }
  }

  handlePartnerForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Basic validation
    if (!data.name || !data.email || !data.phone || !data.city) {
      this.showFormError('Semua field wajib diisi!');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      this.showFormError('Format email tidak valid!');
      return;
    }
    
    // Phone validation
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(data.phone)) {
      this.showFormError('Format nomor telepon tidak valid!');
      return;
    }
    
    // Simulate form submission
    this.submitPartnerForm(data);
  }

  showFormError(message) {
    // Create or update error message
    let errorMsg = this.partnerModal.querySelector('.form-error');
    if (!errorMsg) {
      errorMsg = document.createElement('div');
      errorMsg.className = 'form-error';
      errorMsg.style.cssText = `
        background: var(--danger);
        color: white;
        padding: 0.75rem;
        border-radius: var(--border-radius);
        margin-bottom: 1rem;
        text-align: center;
        font-size: var(--font-size-sm);
      `;
      this.partnerForm.insertBefore(errorMsg, this.partnerForm.firstChild);
    }
    
    errorMsg.textContent = message;
    errorMsg.style.display = 'block';
    
    // Hide error after 5 seconds
    setTimeout(() => {
      if (errorMsg) errorMsg.style.display = 'none';
    }, 5000);
  }

  submitPartnerForm(data) {
    // Show loading state
    const submitBtn = this.partnerForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Mengirim...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
      // Hide form and show success message
      this.partnerForm.style.display = 'none';
      const successMsg = document.getElementById('form-success');
      if (successMsg) {
        successMsg.style.display = 'block';
      }
      
      // Reset button
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      
      // Auto close modal after 3 seconds
      setTimeout(() => {
        this.closePartnerModal();
      }, 3000);
      
      // Log data (in real app, send to server)
      console.log('Partner registration data:', data);
      
    }, 2000);
  }
}

// Global functions for onclick handlers
window.openPartnerModal = function(type) {
  if (window.ahnafJekApp) {
    window.ahnafJekApp.openPartnerModal(type);
  }
};

window.closePartnerModal = function() {
  if (window.ahnafJekApp) {
    window.ahnafJekApp.closePartnerModal();
  }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.ahnafJekApp = new AhnafJekApp();
  
  // Add some additional interactive features
  addInteractiveFeatures();
});

function addInteractiveFeatures() {
  // Add hover effects to service cards
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });
  
  // Add click effects to buttons
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      // Create ripple effect
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
      `;
      
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
  
  // Add CSS for ripple animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Add parallax effect to hero section
  const heroSection = document.querySelector('.home-section');
  if (heroSection) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      heroSection.style.transform = `translateY(${rate}px)`;
    });
  }
  
  // Add loading animation for images
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', function() {
      this.style.animation = 'fadeInUp 0.5s ease-out';
    });
  });
  
  // Add smooth hover transitions to all interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .service-card, .partner-card, .city-card, .testimonial-card');
  interactiveElements.forEach(el => {
    el.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  });
}

// Add performance monitoring
if ('performance' in window) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      console.log(`Page loaded in ${perfData.loadEventEnd - perfData.loadEventStart}ms`);
    }, 0);
  });
}

// Add error handling
window.addEventListener('error', (e) => {
  console.error('JavaScript error:', e.error);
});

// Add service worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Uncomment to enable service worker
    // navigator.serviceWorker.register('/sw.js')
    //   .then(registration => console.log('SW registered'))
    //   .catch(error => console.log('SW registration failed'));
  });
}