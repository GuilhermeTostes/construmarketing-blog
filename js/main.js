/* =====================================================
   ConstruMarketing Blog — main.js
   ===================================================== */

(function () {
  'use strict';

  const header     = document.getElementById('header');
  const nav        = document.getElementById('nav');
  const menuToggle = document.getElementById('menuToggle');

  /* --------------------------------------------------
     Menu mobile — abrir / fechar
  -------------------------------------------------- */
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  /* Fecha o menu ao clicar em qualquer link de nav */
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* Fecha o menu ao clicar fora dele */
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) {
      nav.classList.remove('open');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });

  /* --------------------------------------------------
     Header — sombra ao rolar
  -------------------------------------------------- */
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  /* --------------------------------------------------
     Nav ativa conforme seção visível (IntersectionObserver)
  -------------------------------------------------- */
  const sections  = document.querySelectorAll('section[id], footer[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const setActive = (id) => {
    navLinks.forEach(link => {
      const matches = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active', matches);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, {
    rootMargin: '-35% 0px -55% 0px',
    threshold: 0,
  });

  sections.forEach(s => observer.observe(s));

  /* --------------------------------------------------
     Máscara de telefone — aplica em todos os campos tel da página
  -------------------------------------------------- */
  const telInput = document.getElementById('telA') || document.getElementById('tel');
  if (telInput) {
    telInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 10) {
        v = v.replace(/^(\d{2})(\d{1})(\d{4})(\d{4})$/, '($1) $2.$3-$4');
      } else if (v.length > 6) {
        v = v.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
      } else if (v.length > 2) {
        v = v.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
      } else {
        v = v.replace(/^(\d*)$/, '($1');
      }
      e.target.value = v;
    });
  }

  /* --------------------------------------------------
     Validação e envio do formulário
  -------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const feedback    = document.getElementById('formFeedback');

  if (contactForm) {
    const required = contactForm.querySelectorAll('[required]');

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      required.forEach(field => {
        const empty = !field.value.trim();
        field.classList.toggle('invalid', empty);
        if (empty) valid = false;
      });

      if (!valid) {
        feedback.textContent = 'Preencha todos os campos obrigatórios.';
        feedback.className = 'form-feedback error';
        return;
      }

      /* Aqui entraria a integração com backend/e-mail.
         Por ora, exibe mensagem de sucesso como placeholder. */
      feedback.textContent = 'Mensagem enviada! Em breve entraremos em contato.';
      feedback.className = 'form-feedback success';
      contactForm.reset();
    });

    /* Remove classe .invalid ao corrigir o campo */
    required.forEach(field => {
      field.addEventListener('input', () => field.classList.remove('invalid'));
      field.addEventListener('change', () => field.classList.remove('invalid'));
    });
  }

  /* Formulário da página de artigo (consultoria gratuita) */
  const formArtigo   = document.getElementById('contactFormArtigo');
  const feedbackArt  = document.getElementById('formFeedbackArtigo');

  if (formArtigo) {
    const required = formArtigo.querySelectorAll('[required]');

    formArtigo.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      required.forEach(field => {
        const empty = !field.value.trim();
        field.classList.toggle('invalid', empty);
        if (empty) valid = false;
      });

      if (!valid) {
        feedbackArt.textContent = 'Preencha todos os campos obrigatórios.';
        feedbackArt.className = 'form-feedback error';
        return;
      }

      feedbackArt.textContent = 'Solicitação recebida! Entraremos em contato em breve.';
      feedbackArt.className = 'form-feedback success';
      formArtigo.reset();
    });

    required.forEach(field => {
      field.addEventListener('input',  () => field.classList.remove('invalid'));
      field.addEventListener('change', () => field.classList.remove('invalid'));
    });
  }

})();
