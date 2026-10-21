/**
 * AAPT — sheet-submit.js
 * Envoie le modal Commande/Devis (#umForm) et le formulaire Contact (#contactForm)
 * vers Google Sheets via le Web App Google Apps Script.
 *
 * À charger APRÈS js/cart.js dans index.html :
 *   <script src="js/cart.js"></script>
 *   <script src="js/sheet-submit.js"></script>
 */
(function () {
  'use strict';

  // ══════════ 1) COLLEZ ICI L'URL DE VOTRE WEB APP (elle se termine par /exec) ══════════
  var SCRIPT_URL = 'PASTE_YOUR_WEB_APP_URL_HERE';

  // Vider automatiquement le panier après une commande réussie ?
  var CLEAR_CART_AFTER_ORDER = true;

  var TIMEOUT_MS = 25000;
  var busy = false;

  // ───────────── utilitaires ─────────────
  function $(id) { return document.getElementById(id); }
  function val(id) { var el = $(id); return el ? String(el.value || '').trim() : ''; }
  function isShown(el) { return !!el && el.getClientRects().length > 0; }
  function isConfigured() { return /^https:\/\/script\.google\.com\/.+\/exec$/.test(SCRIPT_URL); }
  function validPhone(p) { var d = String(p).replace(/\D/g, ''); return d.length >= 8 && d.length <= 15; }
  function validEmail(m) { return !m || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m); }

  function setMessage(form, text, ok) {
    var box = form.querySelector('.sheet-msg');
    if (!box) {
      box = document.createElement('div');
      box.className = 'sheet-msg';
      box.setAttribute('role', 'alert');
      box.style.cssText = 'margin-top:.75rem;font-size:.9rem;line-height:1.4;text-align:center;';
      form.appendChild(box);
    }
    box.style.color = ok ? '#22c55e' : '#ff6b6b';
    box.textContent = text || '';
    box.style.display = text ? 'block' : 'none';
  }

  function setBusy(form, isBusy) {
    var btn = form.querySelector('button[type="submit"]');
    if (!btn) return;
    if (isBusy) {
      btn._orig = btn.innerHTML;
      btn.disabled = true;
      btn.textContent = 'Envoi en cours…';
    } else {
      btn.disabled = false;
      if (btn._orig) btn.innerHTML = btn._orig;
    }
  }

  // ───────────── lecture des champs ─────────────
  function cartSummaryText() {
    var box = $('umCartSummary');
    if (!isShown(box)) return '';
    return box.innerText.split('\n')
      .map(function (l) { return l.trim(); })
      .filter(function (l) { return l && !/^commande\b/i.test(l); })
      .join(' | ');
  }

  function collectOrder() {
    var type = val('umHiddenType');
    var product = val('umHiddenProduct') || cartSummaryText();
    if (!product && isShown($('umProductName'))) product = $('umProductName').textContent.trim();

    var source = val('umHiddenSource') || (type === 'devis' ? 'Demande de Devis' : 'Commande Panier');

    return {
      name:       val('umName'),
      phone:      val('umPhone'),
      email:      val('umEmail'),
      brand:      val('umBrand'),
      model:      isShown($('umModelGroup'))   ? val('umModel')   : '',
      carteGrise: val('umCarteGrise'),
      adresse:    isShown($('umAdresseGroup')) ? val('umAdresse') : '',
      product:    product,
      message:    val('umMessage'),
      source:     source,
      subject:    type === 'devis' ? 'Demande de devis' : 'Commande'
    };
  }

  function collectContact(form) {
    var src = form.querySelector('input[name="source"]');
    return {
      name:    val('contactName'),
      phone:   val('contactPhone'),
      email:   val('contactEmail'),
      subject: val('contactSubject'),
      message: val('contactMessage'),
      source:  (src && src.value) || 'Contact'
    };
  }

  // ───────────── validation ─────────────
  function validateOrder(d) {
    if (!d.name) return { msg: 'Veuillez saisir votre nom complet.', field: 'umName' };
    if (!validPhone(d.phone)) return { msg: 'Numéro de téléphone invalide (8 chiffres minimum).', field: 'umPhone' };
    if (!validEmail(d.email)) return { msg: 'Adresse e-mail invalide.', field: 'umEmail' };
    if (!d.brand) return { msg: 'Veuillez choisir la marque de votre véhicule.', field: 'umBrand' };
    if (isShown($('umModelGroup')) && !d.model) return { msg: 'Veuillez choisir le modèle de votre véhicule.', field: 'umModel' };
    if (isShown($('umAdresseGroup')) && !d.adresse) return { msg: 'Veuillez saisir votre adresse de livraison.', field: 'umAdresse' };
    return null;
  }

  function validateContact(d) {
    if (!d.name) return { msg: 'Veuillez saisir votre nom complet.', field: 'contactName' };
    if (!validPhone(d.phone)) return { msg: 'Numéro de téléphone invalide (8 chiffres minimum).', field: 'contactPhone' };
    if (!validEmail(d.email)) return { msg: 'Adresse e-mail invalide.', field: 'contactEmail' };
    if (!d.message) return { msg: 'Veuillez écrire votre message.', field: 'contactMessage' };
    return null;
  }

  // ───────────── envoi ─────────────
  function postToSheet(data) {
    var body = new URLSearchParams();
    Object.keys(data).forEach(function (k) { body.append(k, data[k]); });

    var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, TIMEOUT_MS) : null;

    return fetch(SCRIPT_URL, {
      method: 'POST',
      body: body,
      redirect: 'follow',
      signal: ctrl ? ctrl.signal : undefined
    })
      .then(function (res) { return res.json(); })
      .then(function (json) {
        if (!json || json.result !== 'success') {
          throw new Error((json && json.message) || 'Erreur serveur');
        }
        return json;
      })
      .finally(function () { if (timer) clearTimeout(timer); });
  }

  function onSuccess(form, isOrder) {
    if (isOrder) {
      var wasCart = isShown($('umCartSummary'));
      $('umFormView').style.display = 'none';
      $('umSuccessView').style.display = 'block';
      form.reset();
      if (wasCart && CLEAR_CART_AFTER_ORDER && typeof window.clearCart === 'function') {
        try { window.clearCart(); } catch (e) { /* ignore */ }
      }
    } else {
      form.reset();
      setMessage(form, 'Message envoyé avec succès ! Nous vous répondrons très vite.', true);
    }
  }

  function handle(form) {
    if (!form || busy) return;

    if (!isConfigured()) {
      setMessage(form, "Configuration manquante : collez l'URL du Web App dans js/sheet-submit.js.", false);
      return;
    }

    var isOrder = form.id === 'umForm';
    var data = isOrder ? collectOrder() : collectContact(form);
    var err = isOrder ? validateOrder(data) : validateContact(data);
    if (err) {
      setMessage(form, err.msg, false);
      if (err.field && $(err.field)) $(err.field).focus();
      return;
    }

    busy = true;
    setBusy(form, true);
    setMessage(form, '', true);

    postToSheet(data)
      .then(function () { onSuccess(form, isOrder); })
      .catch(function (e) {
        console.error('[AAPT] Envoi échoué :', e);
        setMessage(form, 'Envoi impossible pour le moment. Réessayez ou appelez-nous au +216 98 601 610.', false);
      })
      .then(function () {
        busy = false;
        setBusy(form, false);
      });
  }

  // ───────────── branchement ─────────────
  // Phase de capture sur document : passe avant les anciens gestionnaires de cart.js.
  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (!f || (f.id !== 'umForm' && f.id !== 'contactForm')) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    handle(f);
  }, true);

  document.addEventListener('click', function (e) {
    var btn = e.target && e.target.closest ? e.target.closest('#umSubmitBtn, #contactSubmitBtn') : null;
    if (!btn) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    handle(btn.closest('form'));
  }, true);
})();
