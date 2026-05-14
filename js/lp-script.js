/* =====================================================
   ConstruMarketing — lp-script.js
   LP: Script de Atendimento
   ===================================================== */

(function () {
  'use strict';

  /* --------------------------------------------------
     Header — sombra ao rolar
  -------------------------------------------------- */
  const lpHeader = document.getElementById('lpHeader');
  if (lpHeader) {
    window.addEventListener('scroll', () => {
      lpHeader.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  /* --------------------------------------------------
     Máscara de WhatsApp
     Aplica em todos os inputs tel da LP
  -------------------------------------------------- */
  function maskPhone(e) {
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
  }

  document.querySelectorAll('input[type="tel"]').forEach(el => {
    el.addEventListener('input', maskPhone);
  });

  /* --------------------------------------------------
     Envio dos formulários
     Substitua LP_WEBHOOK_URL pela URL do webhook Make
  -------------------------------------------------- */
  const LP_WEBHOOK_URL = 'SEU_WEBHOOK_MAKE_AQUI'; // TODO: substituir pela URL real do Make

  function setupForm(formId, feedbackId) {
    const form     = document.getElementById(formId);
    const feedback = document.getElementById(feedbackId);
    if (!form || !feedback) return;

    const required = form.querySelectorAll('[required]');

    /* Remove .invalid ao corrigir */
    required.forEach(field => {
      field.addEventListener('input',  () => field.classList.remove('invalid'));
      field.addEventListener('change', () => field.classList.remove('invalid'));
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      /* Validação */
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

      /* Coleta dados */
      const data = {
        nome:     form.querySelector('[name="nome"]').value.trim(),
        email:    form.querySelector('[name="email"]').value.trim(),
        whatsapp: form.querySelector('[name="whatsapp"]').value.trim(),
        origem:   formId,
      };

      /* Estado de carregamento */
      const btn = form.querySelector('[type="submit"]');
      const btnOriginal = btn.textContent;
      btn.textContent = 'Enviando...';
      btn.disabled = true;

      try {
        if (LP_WEBHOOK_URL === 'SEU_WEBHOOK_MAKE_AQUI') {
          /* Simulação local enquanto webhook não está configurado */
          await new Promise(r => setTimeout(r, 800));
          throw new Error('webhook_not_configured');
        }

        await fetch(LP_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        feedback.textContent = 'Perfeito! Verifique seu e-mail — o script já está a caminho.';
        feedback.className = 'form-feedback success';
        form.reset();

      } catch (err) {
        if (err.message === 'webhook_not_configured') {
          /* Ambiente local sem webhook: simula sucesso para testes */
          feedback.textContent = '(Modo teste) Formulário válido — integre o webhook do Make para ativar.';
          feedback.className = 'form-feedback success';
        } else {
          feedback.textContent = 'Erro ao enviar. Tente novamente ou entre em contato pelo WhatsApp.';
          feedback.className = 'form-feedback error';
        }
      } finally {
        btn.textContent = btnOriginal;
        btn.disabled = false;
      }
    });
  }

  setupForm('lpFormHero',  'feedbackHero');
  setupForm('lpFormFinal', 'feedbackFinal');

})();
