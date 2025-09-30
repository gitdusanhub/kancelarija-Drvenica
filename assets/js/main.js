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