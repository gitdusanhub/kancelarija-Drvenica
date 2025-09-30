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
// ---- Back to top (uvek vidljivo na kratkim stranicama) ----
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.createElement('button');
  btn.className = 'btn btn-primary shadow back-to-top show'; // odmah show
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Nazad na vrh');
  btn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 3.293l4.146 4.147-.708.707L8 4.707 4.562 8.147l-.708-.707L8 3.293z"/>
      <path d="M8 6.5a.5.5 0 0 1 .5.5v5.5h-1V7a.5.5 0 0 1 .5-.5z"/>
    </svg>
  `;
  document.body.appendChild(btn);

  // Smooth scroll na vrh
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Ako stranica ima skrol, dugme se prikazuje tek posle 100px
  const toggleBtn = () => {
    const canScroll = document.documentElement.scrollHeight > window.innerHeight;
    if (canScroll) {
      btn.classList.toggle('show', window.scrollY > 100);
    } else {
      btn.classList.add('show'); // uvek prikazano na kratkim stranicama
    }
  };

  toggleBtn(); // inicijalno
  window.addEventListener('scroll', toggleBtn, { passive: true });
});
