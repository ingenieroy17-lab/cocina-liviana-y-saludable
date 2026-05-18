document.addEventListener('DOMContentLoaded', () => {
  // Scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.15 });
  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  // FAQ accordion
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const wasActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!wasActive) item.classList.add('active');
    });
  });

  // Sticky bar show on scroll (mobile)
  const stickyBar = document.querySelector('.sticky-bar');
  if (stickyBar) {
    window.addEventListener('scroll', () => {
      stickyBar.style.display = window.scrollY > 600 ? 'block' : 'none';
    });
  }

  // Smooth counter animation for stats
  const animateCount = (el, target) => {
    let current = 0;
    const step = target / 40;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { el.textContent = target; clearInterval(timer); }
      else el.textContent = Math.floor(current);
    }, 30);
  };

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const target = parseInt(e.target.dataset.count);
        if (target) animateCount(e.target, target);
        statsObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => statsObserver.observe(el));

  // Timer countdown logic (48 hours)
  const timerEl = document.getElementById('countdown-timer');
  if (timerEl) {
    let endTime = localStorage.getItem('offerEndTime');
    if (!endTime) {
      endTime = Date.now() + (48 * 3600 * 1000);
      localStorage.setItem('offerEndTime', endTime);
    }
    
    const updateTimer = () => {
      const now = Date.now();
      let diff = Math.floor((endTime - now) / 1000);
      if (diff <= 0) {
        diff = 0;
        timerEl.textContent = "00:00:00";
        return;
      }
      const h = Math.floor(diff / 3600).toString().padStart(2, '0');
      const m = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
      const s = (diff % 60).toString().padStart(2, '0');
      timerEl.textContent = `${h}:${m}:${s}`;
    };
    
    updateTimer();
    setInterval(updateTimer, 1000);
  }

  // Checkout form logic
  const form = document.getElementById('checkout-form');
  const btnSubmit = document.getElementById('btn-submit');
  const formError = document.getElementById('form-error');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const nombre = document.getElementById('nombre').value;
      const apellido = document.getElementById('apellido').value;
      const email = document.getElementById('email').value;

      formError.style.display = 'none';
      const originalText = btnSubmit.innerHTML;
      btnSubmit.innerHTML = '⏳ Generando pago seguro...';
      btnSubmit.disabled = true;

      try {
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre, apellido, email })
        });

        const data = await response.json();

        if (response.ok && data.init_point) {
          window.location.href = data.init_point;
        } else {
          throw new Error(data.error || 'Error desconocido');
        }
      } catch (err) {
        console.error(err);
        formError.textContent = 'Ocurrió un error al procesar el pago. Intentá nuevamente.';
        formError.style.display = 'block';
        btnSubmit.innerHTML = originalText;
        btnSubmit.disabled = false;
      }
    });
  }

  // Smooth scroll for CTAs
  document.querySelectorAll('.scroll-to-checkout').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector('#comprar').scrollIntoView({ behavior: 'smooth' });
      // Focus the name input after scrolling
      setTimeout(() => document.getElementById('nombre')?.focus(), 500);
    });
  });
});
