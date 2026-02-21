/* ===== block. BODY. — Interactions ===== */

document.addEventListener('DOMContentLoaded', () => {

  // ===== Scroll-triggered fade-in =====
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe timeline steps
  document.querySelectorAll('.timeline__step').forEach(el => observer.observe(el));

  // Add fade-up class to key elements and observe
  const fadeTargets = [
    '.section-eyebrow',
    '.section-title',
    '.section-body',
    '.ingredient-card',
    '.batch__counter',
    '.pricing__card',
    '.waitlist__form',
    '.wrap__text',
    '.wrap__visual'
  ];

  fadeTargets.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      // Don't double-animate hero elements
      if (el.closest('.hero')) return;
      el.classList.add('fade-up');
      observer.observe(el);
    });
  });

  // Stagger ingredient cards
  document.querySelectorAll('.ingredient-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.1}s`;
  });


  // ===== Populate bar number selector =====
  const barSelect = document.querySelector('select[name="barNumber"]');
  if (barSelect) {
    for (let i = 4; i <= 100; i++) {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = `#${String(i).padStart(3, '0')}`;
      barSelect.appendChild(opt);
    }
  }


  // ===== Waitlist form submission =====
  const form = document.getElementById('waitlistForm');
  const success = document.getElementById('waitlistSuccess');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = new FormData(form);
      const entry = {
        name: data.get('name'),
        email: data.get('email'),
        phone: data.get('phone') || '',
        barNumber: data.get('barNumber') || 'next available',
        timestamp: new Date().toISOString()
      };

      // For now, log to console. Will hook up backend later.
      console.log('Waitlist signup:', entry);

      // Store locally as fallback
      const existing = JSON.parse(localStorage.getItem('blockWaitlist') || '[]');
      existing.push(entry);
      localStorage.setItem('blockWaitlist', JSON.stringify(existing));

      // Show success state
      form.style.display = 'none';
      success.style.display = 'block';
      success.classList.add('fade-up', 'visible');
    });
  }


  // ===== Smooth parallax on hero soap block =====
  const soapBlock = document.querySelector('.soap-block');
  if (soapBlock && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * 0.15;
      soapBlock.style.transform = `rotate(${-5 + scrolled * 0.01}deg) translateY(${rate}px)`;
    }, { passive: true });
  }


  // ===== Nav background on scroll =====
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 80) {
        nav.style.background = 'rgba(245, 237, 228, 0.95)';
        nav.style.backdropFilter = 'blur(10px)';
        nav.style.borderBottom = '1px solid rgba(0,0,0,0.05)';
      } else {
        nav.style.background = 'transparent';
        nav.style.backdropFilter = 'none';
        nav.style.borderBottom = 'none';
      }
    }, { passive: true });
  }


  // ===== Hero entrance animation =====
  const heroElements = [
    '.hero__eyebrow',
    '.hero__title',
    '.hero__subtitle',
    '.hero .btn'
  ];

  heroElements.forEach((sel, i) => {
    const el = document.querySelector(sel);
    if (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = `all 0.8s ${0.2 + i * 0.15}s var(--ease-smooth)`;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        });
      });
    }
  });

  // Soap block entrance
  if (soapBlock) {
    soapBlock.style.opacity = '0';
    soapBlock.style.transform = 'rotate(-5deg) scale(0.8)';
    soapBlock.style.transition = 'all 1s 0.5s var(--ease-spring)';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        soapBlock.style.opacity = '1';
        soapBlock.style.transform = 'rotate(-5deg) scale(1)';
      });
    });
  }

});
