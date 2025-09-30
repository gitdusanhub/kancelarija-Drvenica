// Bootstrap front validation (ostaje isto)
(() => {
  'use strict';
  const forms = document.querySelectorAll('.needs-validation');
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });
})();

// ---- Contact form (Formspree AJAX) ----
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const submitBtn = document.getElementById('submitBtn');
  const alertBox  = document.getElementById('formAlert');

  form.addEventListener('submit', async (e) => {
    if (!form.checkValidity()) return;
    e.preventDefault();

    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
      <span class="ms-2">Slanje…</span>
    `;

    try {
      const resp = await fetch(form.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      });

      if (resp.ok) {
        alertBox.className = 'alert alert-success mt-3';
        alertBox.textContent = 'Hvala na poruci! Javićemo se uskoro.';
        form.reset();
        form.classList.remove('was-validated');
      } else {
        alertBox.className = 'alert alert-danger mt-3';
        alertBox.textContent = 'Greška pri slanju. Pokušajte ponovo ili nas kontaktirajte telefonom/e-mailom.';
      }
    } catch {
      alertBox.className = 'alert alert-danger mt-3';
      alertBox.textContent = 'Mrežna greška. Proverite internet vezu i pokušajte ponovo.';
    } finally {
      alertBox.classList.remove('d-none');
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
});
// ---- Back to top (podešeno za kratke stranice) ----
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.createElement('button');
  btn.className = 'btn btn-primary shadow back-to-top';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Nazad na vrh');
  btn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 3.293l4.146 4.147-.708.707L8 4.707 4.562 8.147l-.708-.707L8 3.293z"/>
      <path d="M8 6.5a.5.5 0 0 1 .5.5v5.5h-1V7a.5.5 0 0 1 .5-.5z"/>
    </svg>
  `;
  document.body.appendChild(btn);

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const smoothScrollTop = () => {
    if (prefersReduced) window.scrollTo(0, 0);
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  btn.addEventListener('click', smoothScrollTop);

  // Ako je stranica kratka, prikaži dugme odmah; inače posle 100px skrola
  const toggleBtn = () => {
    const doc = document.documentElement;
    const canScroll = (doc.scrollHeight - window.innerHeight) > 0;
    const shouldShow = canScroll ? (window.scrollY > 100) : true;
    btn.classList.toggle('show', shouldShow);
  };

  // Inicijalno stanje + praćenje skrola
  toggleBtn();
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => { toggleBtn(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });
});
