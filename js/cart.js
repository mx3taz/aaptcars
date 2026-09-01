/**
 * AAPT — Cart, Delivery & Carte Grise Module
 * Handles: Shopping cart state, sidebar, delivery banner, carte grise forms
 */

(function () {
  'use strict';

  // =============================================
  // GOOGLE SCRIPT URL (same as in main.js)
  // =============================================
  var GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwawNFdQ6iuQV_kauycY5cr6nIQ7W4rOg7opLCM46QOxEDKt6FYh5ANJcQooyk_ar2i/exec';

  // Brand-to-Models mapping (matches the brand-model grid in index.html)
  var BRAND_MODELS = {
    'MG':       ['MG 3','MG 5','MG 6','MG ZS','MG HS','MG GT','MG NEW GT','MG RX 5','MG RX 9'],
    'KIA':      ['KIA Picanto','KIA Rio','KIA Sportage'],
    'Hyundai':  ['HYUNDAI i10','HYUNDAI i20'],
    'Geely':    ['GEELY GC6','GEELY Coolray','GEELY GX 3'],
    'Chery':    ['CHERY Tiggo 4','CHERY Tiggo 7','CHERY Tiggo 8','CHERY QQ'],
    'Haval':    ['HAVAL H6','HAVAL Jolion'],
    'Dongfeng': ['Dongfeng'],
    'Mahindra': ['Mahindra'],
    'Suzuki':   ['Suzuki Swift / Celerio']
  };

  // =============================================
  // 1. CART STATE MANAGEMENT
  // =============================================
  var cart = JSON.parse(localStorage.getItem('aapt_cart') || '[]');

  function saveCart() {
    localStorage.setItem('aapt_cart', JSON.stringify(cart));
    updateCartUI();
  }

  function getCartCount() {
    var count = 0;
    cart.forEach(function (item) { count += item.qty; });
    return count;
  }

  // Expose global functions
  window.addToCart = function (productId, title, category) {
    // Get image from productDetails if available
    var image = '';
    if (typeof productDetails !== 'undefined' && productDetails[productId] && productDetails[productId].images && productDetails[productId].images.length > 0) {
      image = productDetails[productId].images[0];
    }
    // Capture the currently selected brand/model
    var cartBrand = (typeof getActiveBrand === 'function') ? getActiveBrand() : '';
    var cartModel = (typeof getActiveModel === 'function') ? getActiveModel() : '';
    var existing = null;
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === productId) {
        existing = cart[i];
        break;
      }
    }
    if (existing) {
      existing.qty++;
      if (!existing.image && image) existing.image = image;
      if (cartBrand) existing.brand = cartBrand;
      if (cartModel) existing.model = cartModel;
    } else {
      cart.push({ id: productId, title: title, category: category, qty: 1, image: image, brand: cartBrand, model: cartModel });
    }
    saveCart();

    // Visual feedback on button
    var btn = document.getElementById('pdAddToCart');
    if (btn) {
      btn.classList.add('added');
      btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Ajouté !';
      setTimeout(function () {
        btn.classList.remove('added');
        btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg> Ajouter au Panier';
      }, 1500);
    }

    // Pulse the badge
    var badge = document.getElementById('cartBadge');
    if (badge) {
      badge.classList.add('pulse');
      setTimeout(function () { badge.classList.remove('pulse'); }, 500);
    }

    showToastGlobal('✅ ' + title + ' ajouté au panier !', 'success');
  };

  window.removeFromCart = function (productId) {
    cart = cart.filter(function (item) { return item.id !== productId; });
    saveCart();
  };

  window.updateCartItemQty = function (productId, delta) {
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === productId) {
        cart[i].qty = Math.max(1, cart[i].qty + delta);
        break;
      }
    }
    saveCart();
  };

  window.clearCart = function () {
    cart = [];
    saveCart();
    showToastGlobal('🗑️ Panier vidé.', 'success');
  };

  // =============================================
  // 2. CART UI RENDERING
  // =============================================
  function updateCartUI() {
    var count = getCartCount();
    var badge = document.getElementById('cartBadge');
    var countLabel = document.getElementById('cartCountLabel');
    var body = document.getElementById('cartSidebarBody');
    var footer = document.getElementById('cartSidebarFooter');

    // Badge
    if (badge) {
      badge.textContent = count;
      if (count > 0) {
        badge.classList.add('visible');
      } else {
        badge.classList.remove('visible');
      }
    }

    // Count label
    if (countLabel) {
      countLabel.textContent = '(' + count + ' article' + (count !== 1 ? 's' : '') + ')';
    }

    // Footer
    if (footer) {
      footer.style.display = cart.length > 0 ? 'block' : 'none';
    }

    // Sidebar body
    if (!body) return;

    if (cart.length === 0) {
      body.innerHTML =
        '<div class="cart-empty">' +
          '<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>' +
          '<p>Votre panier est vide.<br>Parcourez nos produits et ajoutez vos pièces !</p>' +
          '<button class="btn btn-primary" onclick="openCartSidebar(false);showPage(\'products\');return false;">Voir nos Produits</button>' +
        '</div>';
      return;
    }

    var html = '';
    cart.forEach(function (item) {
      html +=
        '<div class="cart-item" data-cart-id="' + item.id + '">' +
          '<div class="cart-item-img">' +
            (item.image
              ? '<img src="' + item.image + '" alt="' + item.title + '" loading="lazy">'
              : '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 0 1 0 4h-.09c-.658.003-1.25.396-1.51 1z"/></svg>'
            ) +
          '</div>' +
          '<div class="cart-item-info">' +
            '<div class="cart-item-name">' + item.title + '</div>' +
            '<div class="cart-item-category">' + item.category + '</div>' +
          '</div>' +
          '<div class="cart-item-qty">' +
            '<button onclick="updateCartItemQty(\'' + item.id + '\', -1)" aria-label="Réduire">−</button>' +
            '<span>' + item.qty + '</span>' +
            '<button onclick="updateCartItemQty(\'' + item.id + '\', 1)" aria-label="Augmenter">+</button>' +
          '</div>' +
          '<button class="cart-item-remove" onclick="removeFromCart(\'' + item.id + '\')" aria-label="Supprimer">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
          '</button>' +
        '</div>';
    });

    body.innerHTML = html;
  }

  // =============================================
  // 3. CART SIDEBAR OPEN/CLOSE
  // =============================================
  var cartSidebar = document.getElementById('cartSidebar');
  var cartOverlay = document.getElementById('cartOverlay');
  var cartToggle = document.getElementById('cartToggle');
  var cartSidebarClose = document.getElementById('cartSidebarClose');

  function openCartSidebar(open) {
    if (open === undefined) open = true;
    if (open) {
      cartSidebar.classList.add('open');
      cartOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    } else {
      cartSidebar.classList.remove('open');
      cartOverlay.classList.remove('active');
      if (!document.body.classList.contains('menu-open')) {
        document.body.style.overflow = '';
      }
    }
  }
  window.openCartSidebar = openCartSidebar;

  if (cartToggle) {
    cartToggle.addEventListener('click', function () {
      openCartSidebar(!cartSidebar.classList.contains('open'));
    });
  }
  if (cartSidebarClose) {
    cartSidebarClose.addEventListener('click', function () { openCartSidebar(false); });
  }
  if (cartOverlay) {
    cartOverlay.addEventListener('click', function () { openCartSidebar(false); });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && cartSidebar && cartSidebar.classList.contains('open')) {
      openCartSidebar(false);
    }
  });

  // =============================================
  // 4. CART INQUIRY SUBMISSION
  // =============================================
  window.submitCartInquiry = function () {
    if (cart.length === 0) return;
    openCartSidebar(false);
    openUnifiedModal('panier');
  };

  window.submitCartDevis = function () {
    if (cart.length === 0) return;
    openCartSidebar(false);
    openUnifiedModal('devis-panier');
  };

  // =============================================
  // 5. DELIVERY REQUEST
  // =============================================
  window.requestDelivery = function (productName) {
    openUnifiedModal('livraison', null, productName);
  };

  // =============================================
  // 6. DELIVERY BANNER (after form submission)
  // =============================================
  var deliveryBanner = document.getElementById('deliveryBanner');
  var deliveryBannerClose = document.getElementById('deliveryBannerClose');

  window.showDeliveryBanner = function () {
    if (deliveryBanner) {
      deliveryBanner.classList.add('visible');
      // Auto-hide after 8 seconds
      setTimeout(function () {
        deliveryBanner.classList.remove('visible');
      }, 8000);
    }
  };

  if (deliveryBannerClose) {
    deliveryBannerClose.addEventListener('click', function () {
      deliveryBanner.classList.remove('visible');
    });
  }

  // =============================================
  // 7. CARTE GRISE — TABS
  // =============================================
  document.querySelectorAll('.cg-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      // Update active tab
      document.querySelectorAll('.cg-tab').forEach(function (t) {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      this.classList.add('active');
      this.setAttribute('aria-selected', 'true');

      // Show correct panel
      var target = this.dataset.cgTab;
      document.querySelectorAll('.cg-tab-panel').forEach(function (p) {
        p.classList.remove('active');
      });
      var panel = document.getElementById(target === 'photo' ? 'cgPhotoPanel' : 'cgManualPanel');
      if (panel) panel.classList.add('active');
    });
  });

  // =============================================
  // 8. CARTE GRISE — FILE UPLOAD
  // =============================================
  var cgUploadZone = document.getElementById('cgUploadZone');
  var cgFileInput = document.getElementById('cgFileInput');
  var cgPreview = document.getElementById('cgPreview');
  var cgPreviewImg = document.getElementById('cgPreviewImg');
  var cgRemoveFile = document.getElementById('cgRemoveFile');
  var cgFileData = null; // Store base64

  if (cgUploadZone) {
    // Drag events
    ['dragenter', 'dragover'].forEach(function (evt) {
      cgUploadZone.addEventListener(evt, function (e) {
        e.preventDefault();
        e.stopPropagation();
        cgUploadZone.classList.add('dragover');
      });
    });
    ['dragleave', 'drop'].forEach(function (evt) {
      cgUploadZone.addEventListener(evt, function (e) {
        e.preventDefault();
        e.stopPropagation();
        cgUploadZone.classList.remove('dragover');
      });
    });
    cgUploadZone.addEventListener('drop', function (e) {
      var files = e.dataTransfer.files;
      if (files.length > 0) handleCGFile(files[0]);
    });
  }

  if (cgFileInput) {
    cgFileInput.addEventListener('change', function () {
      if (this.files.length > 0) handleCGFile(this.files[0]);
    });
  }

  if (cgRemoveFile) {
    cgRemoveFile.addEventListener('click', function () {
      cgFileData = null;
      if (cgPreview) cgPreview.classList.remove('has-file');
      if (cgFileInput) cgFileInput.value = '';
      if (cgUploadZone) cgUploadZone.style.display = '';
    });
  }

  function handleCGFile(file) {
    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToastGlobal('❌ Fichier trop volumineux. Maximum 5 Mo.', 'error');
      return;
    }

    // Validate type
    var validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
    if (validTypes.indexOf(file.type) === -1) {
      showToastGlobal('❌ Format non supporté. Utilisez JPG, PNG ou PDF.', 'error');
      return;
    }

    // Preview
    if (file.type.startsWith('image/')) {
      var reader = new FileReader();
      reader.onload = function (e) {
        cgFileData = e.target.result;
        if (cgPreviewImg) cgPreviewImg.src = e.target.result;
        if (cgPreview) cgPreview.classList.add('has-file');
        if (cgUploadZone) cgUploadZone.style.display = 'none';
      };
      reader.readAsDataURL(file);
    } else {
      // PDF — show placeholder
      cgFileData = 'PDF: ' + file.name;
      if (cgPreviewImg) cgPreviewImg.src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="120" viewBox="0 0 200 120"><rect fill="#111119" width="200" height="120" rx="8"/><text fill="#E30613" font-size="14" font-family="sans-serif" x="100" y="55" text-anchor="middle">📄 ' + file.name + '</text><text fill="#a1a1a8" font-size="11" font-family="sans-serif" x="100" y="75" text-anchor="middle">PDF chargé</text></svg>');
      if (cgPreview) cgPreview.classList.add('has-file');
      if (cgUploadZone) cgUploadZone.style.display = 'none';
    }
  }

  // =============================================
  // 9. CARTE GRISE — FORM SUBMISSION
  // =============================================
  function submitCGForm(form, submitBtn) {
    // Validate required
    var isValid = true;
    form.querySelectorAll('[required]').forEach(function (field) {
      if (!field.value.trim()) {
        field.style.borderColor = '#E30613';
        isValid = false;
      } else {
        field.style.borderColor = '';
      }
    });

    if (!isValid) {
      showToastGlobal('Veuillez remplir tous les champs obligatoires.', 'error');
      return;
    }

    // For photo form, require either a file OR warn the user
    var isPhotoForm = form.id === 'cgPhotoForm';
    if (isPhotoForm && !cgFileData) {
      showToastGlobal('⚠️ N\'oubliez pas de joindre votre carte grise !', 'error');
      return;
    }

    var originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span style="display:inline-flex;align-items:center;gap:0.5rem;">Envoi en cours...</span>';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    var formData = new FormData(form);
    formData.append('timestamp', new Date().toLocaleString('fr-FR'));

    // Add file info (filename description for Sheets)
    if (isPhotoForm && cgFileData) {
      formData.append('carteGriseData', cgFileData.substring(0, 100) + '...[IMAGE]');
      formData.append('carteGriseFileName', cgFileInput && cgFileInput.files[0] ? cgFileInput.files[0].name : 'carte_grise');
    }

    if (GOOGLE_SCRIPT_URL.indexOf('YOUR_GOOGLE') !== -1) {
      // Demo mode
      setTimeout(function () {
        showToastGlobal('✅ Votre demande a été envoyée avec succès ! Nous vous contacterons bientôt.', 'success');
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        submitBtn.style.opacity = '';
        // Reset upload preview
        if (isPhotoForm) {
          cgFileData = null;
          if (cgPreview) cgPreview.classList.remove('has-file');
          if (cgUploadZone) cgUploadZone.style.display = '';
        }
        window.showDeliveryBanner();
      }, 1500);
      return;
    }

    fetch(GOOGLE_SCRIPT_URL, { method: 'POST', body: formData })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.result === 'success') {
          showToastGlobal('✅ Votre demande a été envoyée avec succès ! Nous vous contacterons bientôt.', 'success');
          form.reset();
          if (isPhotoForm) {
            cgFileData = null;
            if (cgPreview) cgPreview.classList.remove('has-file');
            if (cgUploadZone) cgUploadZone.style.display = '';
          }
          window.showDeliveryBanner();
        } else {
          showToastGlobal('❌ Une erreur est survenue. Veuillez réessayer.', 'error');
        }
      })
      .catch(function () {
        showToastGlobal('❌ Erreur de connexion. Veuillez réessayer plus tard.', 'error');
      })
      .finally(function () {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        submitBtn.style.opacity = '';
      });
  }

  var cgPhotoForm = document.getElementById('cgPhotoForm');
  var cgManualForm = document.getElementById('cgManualForm');

  if (cgPhotoForm) {
    cgPhotoForm.addEventListener('submit', function (e) {
      e.preventDefault();
      submitCGForm(cgPhotoForm, document.getElementById('cgPhotoSubmitBtn'));
    });
  }
  if (cgManualForm) {
    cgManualForm.addEventListener('submit', function (e) {
      e.preventDefault();
      submitCGForm(cgManualForm, document.getElementById('cgManualSubmitBtn'));
    });
  }

  // =============================================
  // 10. TOAST HELPER (reuses existing toast element)
  // =============================================
  function showToastGlobal(message, type) {
    var toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = 'toast ' + type + ' show';
    setTimeout(function () { toast.classList.remove('show'); }, 4000);
  }
  window.showToastGlobal = showToastGlobal;

  // =============================================
  // 11. HOOK INTO EXISTING FORM SUBMISSIONS
  //     (Show delivery banner after any form submit)
  // =============================================
  // Monkey-patch the existing showToast to also trigger delivery banner
  var origShowToast = window.showToast;
  if (typeof origShowToast === 'function') {
    // If showToast was already defined globally, wrap it
  }
  // We'll use a MutationObserver on the toast to detect success messages
  var toastEl = document.getElementById('toast');
  if (toastEl) {
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        if (m.type === 'attributes' && m.attributeName === 'class') {
          if (toastEl.classList.contains('show') && toastEl.classList.contains('success')) {
            // Show delivery banner 1.5s after success toast
            setTimeout(function () { window.showDeliveryBanner(); }, 1500);
          }
        }
      });
    });
    observer.observe(toastEl, { attributes: true });
  }

  // =============================================
  // 12. INITIAL RENDER
  // =============================================
  updateCartUI();

  // Add focus effects to new form inputs
  document.querySelectorAll('.carte-grise-section .form-group input, .carte-grise-section .form-group textarea, .carte-grise-section .form-group select').forEach(function (input) {
    input.addEventListener('focus', function () {
      this.closest('.form-group').style.transform = 'translateY(-2px)';
      this.closest('.form-group').style.transition = 'transform 0.2s ease';
    });
    input.addEventListener('blur', function () {
      this.closest('.form-group').style.transform = '';
      if (this.value.trim()) {
        this.style.borderColor = '';
      }
    });
  });
  // =============================================
  // 13. UNIFIED REQUEST MODAL
  // =============================================
  var umModal = document.getElementById('unifiedModal');
  var umClose = document.getElementById('umClose');
  var umSuccessClose = document.getElementById('umSuccessClose');
  var umCurrentType = '';
  var umCurrentProduct = '';

  function showModalSuccess() {
    var formView = document.getElementById('umFormView');
    var successView = document.getElementById('umSuccessView');
    if (formView) formView.style.display = 'none';
    if (successView) successView.style.display = 'flex';
  }

  function resetModalViews() {
    var formView = document.getElementById('umFormView');
    var successView = document.getElementById('umSuccessView');
    if (formView) formView.style.display = '';
    if (successView) successView.style.display = 'none';
  }

  function openUnifiedModal(type, productId, productTitle, categoryName) {
    if (!umModal) return;
    umCurrentType = type;
    resetModalViews();

    var titleEl = document.getElementById('umTitle');
    var prodEl = document.getElementById('umProductName');
    var cartSummary = document.getElementById('umCartSummary');
    var hiddenProduct = document.getElementById('umHiddenProduct');
    var hiddenType = document.getElementById('umHiddenType');
    var adresseGroup = document.getElementById('umAdresseGroup');
    var adresseInput = document.getElementById('umAdresse');

    hiddenType.value = type;
    cartSummary.style.display = 'none';
    cartSummary.innerHTML = '';

    // Resolve brand from active tab
    var brand = (typeof getActiveBrand === 'function') ? getActiveBrand() : '';

    // Show/hide Adresse field: only for panier (buying)
    var isPurchase = (type === 'panier');
    if (adresseGroup) adresseGroup.style.display = isPurchase ? '' : 'none';
    if (adresseInput) {
      if (isPurchase) {
        adresseInput.setAttribute('required', 'required');
      } else {
        adresseInput.removeAttribute('required');
        adresseInput.value = '';
      }
    }

    // Set title and product info based on type
    if (type === 'devis') {
      titleEl.textContent = 'Demander un Devis';
      var displayProduct = productTitle || '';
      if (categoryName) displayProduct += ' (' + categoryName + ')';
      prodEl.textContent = displayProduct;
      umCurrentProduct = displayProduct;
      hiddenProduct.value = displayProduct;
    } else if (type === 'devis-panier') {
      titleEl.textContent = 'Demander un Devis';
      prodEl.textContent = '';
      var items = JSON.parse(localStorage.getItem('aapt_cart') || '[]');
      if (items.length === 0) return;
      var totalQty = items.reduce(function(s,i){return s+i.qty;},0);
      var listHtml = '<strong>Devis \u2014 ' + totalQty + ' article(s) :</strong><ul>';
      var prodParts = [];
      items.forEach(function(item) {
        listHtml += '<li>' + item.title + ' \u00d7 ' + item.qty + ' <span style="color:var(--clr-text-muted)">(' + item.category + ')</span></li>';
        prodParts.push(item.title + ' (x' + item.qty + ')');
      });
      listHtml += '</ul>';
      cartSummary.innerHTML = listHtml;
      cartSummary.style.display = 'block';
      umCurrentProduct = 'DEVIS-PANIER: ' + prodParts.join(' | ');
      hiddenProduct.value = umCurrentProduct;
    } else if (type === 'panier') {
      titleEl.textContent = 'Commander mes Pi\u00e8ces';
      prodEl.textContent = '';
      var items2 = JSON.parse(localStorage.getItem('aapt_cart') || '[]');
      if (items2.length === 0) return;
      var totalQty2 = items2.reduce(function(s,i){return s+i.qty;},0);
      var listHtml2 = '<strong>Commande \u2014 ' + totalQty2 + ' article(s) :</strong><ul>';
      var prodParts2 = [];
      items2.forEach(function(item) {
        listHtml2 += '<li>' + item.title + ' \u00d7 ' + item.qty + ' <span style="color:var(--clr-text-muted)">(' + item.category + ')</span></li>';
        prodParts2.push(item.title + ' (x' + item.qty + ')');
      });
      listHtml2 += '</ul>';
      cartSummary.innerHTML = listHtml2;
      cartSummary.style.display = 'block';
      umCurrentProduct = 'PANIER: ' + prodParts2.join(' | ');
      hiddenProduct.value = umCurrentProduct;
    } else if (type === 'livraison') {
      titleEl.textContent = 'Demande de Livraison';
      prodEl.textContent = productTitle || '';
      umCurrentProduct = 'LIVRAISON: ' + (productTitle || '');
      hiddenProduct.value = umCurrentProduct;
    }

    // Reset form then auto-fill brand dropdown
    var form = document.getElementById('umForm');
    if (form) form.reset();

    // Resolve model from active state or from cart items
    var model = (typeof getActiveModel === 'function') ? getActiveModel() : '';
    // If opening for cart-based types and no active model, try to get from first cart item
    if (!brand || !model) {
      var cartItems = JSON.parse(localStorage.getItem('aapt_cart') || '[]');
      if (cartItems.length > 0 && cartItems[0].brand) {
        if (!brand) brand = cartItems[0].brand;
        if (!model) model = cartItems[0].model || '';
      }
    }

    var brandSelect = document.getElementById('umBrand');
    var modelSelect = document.getElementById('umModel');
    var modelGroup = document.getElementById('umModelGroup');

    if (brandSelect && brand) {
      for (var i = 0; i < brandSelect.options.length; i++) {
        if (brandSelect.options[i].value.toLowerCase() === brand.toLowerCase()) {
          brandSelect.value = brandSelect.options[i].value;
          break;
        }
      }
    }

    // Populate and auto-select model
    populateModelSelect(brandSelect ? brandSelect.value : '', model);

    umModal.classList.add('active');
    umModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(function() {
      var fi = document.getElementById('umName');
      if (fi) fi.focus();
    }, 300);
  }
  window.openUnifiedModal = openUnifiedModal;

  function closeUnifiedModal() {
    if (!umModal) return;
    umModal.classList.remove('active');
    umModal.setAttribute('aria-hidden', 'true');
    resetModalViews();
    if (!document.body.classList.contains('menu-open')) {
      document.body.style.overflow = '';
    }
  }
  window.closeUnifiedModal = closeUnifiedModal;

  if (umClose) umClose.addEventListener('click', closeUnifiedModal);
  if (umSuccessClose) umSuccessClose.addEventListener('click', closeUnifiedModal);
  if (umModal) umModal.addEventListener('click', function(e) { if (e.target === umModal) closeUnifiedModal(); });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && umModal && umModal.classList.contains('active')) closeUnifiedModal();
  });

  function onSubmitSuccess(umForm, submitBtn, originalText) {
    umForm.reset();
    // Reset model dropdown state
    var mg = document.getElementById('umModelGroup');
    var ms = document.getElementById('umModel');
    if (mg) mg.style.display = 'none';
    if (ms) { ms.removeAttribute('required'); ms.innerHTML = '<option value="">— Sélectionnez un modèle —</option>'; }
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
    submitBtn.style.opacity = '';
    if (umCurrentType === 'panier') { cart = []; saveCart(); }
    showModalSuccess();
    window.showDeliveryBanner();
  }

  // Form submission
  var umForm = document.getElementById('umForm');
  if (umForm) {
    umForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var submitBtn = document.getElementById('umSubmitBtn');
      var isValid = true;
      umForm.querySelectorAll('[required]').forEach(function(field) {
        var group = field.closest('.form-group');
        if (group && group.style.display === 'none') return;
        if (!field.value.trim()) { field.style.borderColor = '#E30613'; isValid = false; }
        else { field.style.borderColor = ''; }
      });
      if (!isValid) { showToastGlobal('Veuillez remplir tous les champs obligatoires.', 'error'); return; }

      var typeLabels = { devis: 'Devis', panier: 'Commande', livraison: 'Livraison', 'devis-panier': 'Devis Panier' };
      var sourceValue = typeLabels[umCurrentType] || 'Devis';

      var originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span style="display:inline-flex;align-items:center;gap:0.5rem;">Envoi en cours...</span>';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';

      var formData = new FormData(umForm);
      formData.append('timestamp', new Date().toLocaleString('fr-FR'));
      formData.append('source', sourceValue);
      formData.append('product', document.getElementById('umHiddenProduct').value);

      if (GOOGLE_SCRIPT_URL.indexOf('YOUR_GOOGLE') !== -1) {
        setTimeout(function() { onSubmitSuccess(umForm, submitBtn, originalText); }, 1500);
        return;
      }

      fetch(GOOGLE_SCRIPT_URL, { method: 'POST', body: formData })
        .then(function(r) { return r.json(); })
        .then(function(data) {
          if (data.result === 'success') {
            onSubmitSuccess(umForm, submitBtn, originalText);
          } else {
            showToastGlobal('\u274c Une erreur est survenue. Veuillez r\u00e9essayer.', 'error');
          }
        })
        .catch(function() { showToastGlobal('\u274c Erreur de connexion. Veuillez r\u00e9essayer plus tard.', 'error'); })
        .finally(function() { submitBtn.innerHTML = originalText; submitBtn.disabled = false; submitBtn.style.opacity = ''; });
    });
  }

  // =============================================
  // BRAND → MODEL DYNAMIC POPULATION
  // =============================================
  function populateModelSelect(brandValue, preselectedModel) {
    var modelSelect = document.getElementById('umModel');
    var modelGroup = document.getElementById('umModelGroup');
    if (!modelSelect || !modelGroup) return;

    // Clear existing options
    modelSelect.innerHTML = '<option value="">— Sélectionnez un modèle —</option>';

    var models = BRAND_MODELS[brandValue];
    if (!brandValue || brandValue === 'Autre' || !models || models.length === 0) {
      modelGroup.style.display = 'none';
      modelSelect.removeAttribute('required');
      modelSelect.value = '';
      return;
    }

    // Populate options
    models.forEach(function(m) {
      var opt = document.createElement('option');
      opt.value = m;
      opt.textContent = m;
      modelSelect.appendChild(opt);
    });

    modelGroup.style.display = '';
    modelSelect.setAttribute('required', 'required');

    // Auto-select if only one model
    if (models.length === 1) {
      modelSelect.value = models[0];
    }

    // Pre-select model if provided
    if (preselectedModel) {
      for (var i = 0; i < modelSelect.options.length; i++) {
        if (modelSelect.options[i].value === preselectedModel) {
          modelSelect.value = preselectedModel;
          break;
        }
      }
    }
  }

  // Listen for brand changes to update model dropdown
  var brandSelectEl = document.getElementById('umBrand');
  if (brandSelectEl) {
    brandSelectEl.addEventListener('change', function() {
      populateModelSelect(this.value, '');
    });
  }

  // Focus effects for unified modal inputs
  umModal && umModal.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(function(input) {
    input.addEventListener('focus', function() { this.closest('.form-group').style.transform = 'translateY(-2px)'; this.closest('.form-group').style.transition = 'transform 0.2s ease'; });
    input.addEventListener('blur', function() { this.closest('.form-group').style.transform = ''; if (this.value.trim()) this.style.borderColor = ''; });
  });

})();
