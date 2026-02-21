/* ===== block. BODY. — Interactions ===== */

document.addEventListener('DOMContentLoaded', () => {

  // ===== Scroll-triggered animations =====
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
  document.querySelectorAll('.timeline__step').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.2}s`;
    observer.observe(el);
  });

  // Observe the timeline container for line fill
  const timeline = document.querySelector('.timeline');
  if (timeline) observer.observe(timeline);

  // Add fade-up class to standard elements and observe
  const fadeTargets = [
    '.section-eyebrow',
    '.section-title',
    '.section-body',
    '.batch__counter',
    '.waitlist__form',
  ];

  fadeTargets.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      if (el.closest('.hero')) return;
      el.classList.add('fade-up');
      observer.observe(el);
    });
  });

  // Ingredient cards — staggered with pour animation
  document.querySelectorAll('.ingredient-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.12}s`;
    card.style.setProperty('--float-delay', `${i * 0.8}s`);
    card.classList.add('fade-up');
    observer.observe(card);
  });

  // Wrap section — slide in from sides
  const wrapText = document.querySelector('.wrap__text');
  const wrapVisual = document.querySelector('.wrap__visual');
  if (wrapText) {
    wrapText.classList.add('slide-in-left');
    observer.observe(wrapText);
  }
  if (wrapVisual) {
    wrapVisual.classList.add('slide-in-right');
    observer.observe(wrapVisual);
  }

  // Provenance — slide in
  const provText = document.querySelector('.provenance__text');
  const provVisual = document.querySelector('.provenance__visual');
  if (provText) {
    provText.classList.add('slide-in-right');
    observer.observe(provText);
  }
  if (provVisual) {
    provVisual.classList.add('slide-in-left');
    observer.observe(provVisual);
  }

  // Pricing card — scale reveal
  const pricingCard = document.querySelector('.pricing__card');
  if (pricingCard) {
    pricingCard.classList.add('scale-reveal');
    observer.observe(pricingCard);
  }


  // ===== Batch counter — count-up animation =====
  const batchSection = document.querySelector('.batch');
  if (batchSection) {
    const batchObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          batchObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    batchObserver.observe(batchSection);
  }

  function animateCounters() {
    const barsEl = document.getElementById('barsAvailable');
    if (!barsEl) return;

    const target = 97;
    const duration = 1200;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      const current = Math.round(eased * target);
      barsEl.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        barsEl.classList.add('animate');
      }
    }
    requestAnimationFrame(tick);
  }


  // ===== Parallax effects =====
  if (window.innerWidth > 768) {
    const heroPhoto = document.querySelector('.hero__photo');
    const wrapImage = document.querySelector('.wrap__image');

    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;

      // Hero photo subtle rotation + lift
      if (heroPhoto) {
        const rate = scrolled * 0.15;
        heroPhoto.style.transform = `rotate(${-3 + scrolled * 0.008}deg) translateY(${rate}px)`;
      }

      // Wrap image parallax
      if (wrapImage) {
        const rect = wrapImage.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        if (inView) {
          const center = (rect.top + rect.bottom) / 2;
          const offset = (window.innerHeight / 2 - center) * 0.06;
          wrapImage.style.transform = `translateY(${offset}px)`;
        }
      }

      // Ingredient images subtle parallax
      document.querySelectorAll('.ingredient-card__img img').forEach((img) => {
        const rect = img.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const center = (rect.top + rect.bottom) / 2;
          const offset = (window.innerHeight / 2 - center) * 0.04;
          if (!img.closest('.ingredient-card:hover')) {
            img.style.transform = `translateY(${offset}px) scale(1)`;
          }
        }
      });
    }, { passive: true });
  }


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

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Joining...';
      submitBtn.classList.add('btn--loading');

      const data = new FormData(form);
      const entry = {
        name: data.get('name'),
        email: data.get('email'),
        phone: data.get('phone') || '',
        barNumber: data.get('barNumber') || 'next available',
        timestamp: new Date().toISOString()
      };

      // Entry stored locally

      // Store locally as fallback
      const existing = JSON.parse(localStorage.getItem('blockWaitlist') || '[]');
      existing.push(entry);
      localStorage.setItem('blockWaitlist', JSON.stringify(existing));

      // Simulate network delay for polish, then show success
      setTimeout(() => {
        submitBtn.classList.remove('btn--loading');
        form.style.display = 'none';
        success.style.display = 'block';
        success.classList.add('fade-up', 'visible');
      }, 800);
    });
  }


  // ===== Nav background on scroll + scroll hint hide =====
  const nav = document.querySelector('.nav');
  const scrollHint = document.querySelector('.hero__scroll-hint');
  let scrollHintHidden = false;

  if (nav) {
    window.addEventListener('scroll', () => {
      const y = window.pageYOffset;

      if (y > 80) {
        nav.style.background = 'rgba(245, 237, 228, 0.95)';
        nav.style.backdropFilter = 'blur(10px)';
        nav.style.borderBottom = '1px solid rgba(0,0,0,0.05)';
      } else {
        nav.style.background = 'transparent';
        nav.style.backdropFilter = 'none';
        nav.style.borderBottom = 'none';
      }

      // Hide scroll hint after first scroll
      if (!scrollHintHidden && y > 50 && scrollHint) {
        scrollHint.classList.add('hidden');
        scrollHintHidden = true;
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

  // Hero photo entrance
  const heroPhoto = document.querySelector('.hero__photo');
  if (heroPhoto) {
    heroPhoto.style.opacity = '0';
    heroPhoto.style.transform = 'rotate(-3deg) scale(0.8)';
    heroPhoto.style.transition = 'all 1s 0.5s var(--ease-spring)';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        heroPhoto.style.opacity = '1';
        heroPhoto.style.transform = 'rotate(-3deg) scale(1)';
      });
    });
  }

});
