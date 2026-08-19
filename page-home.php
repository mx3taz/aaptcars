<?php
/**
 * Template Name: Page Accueil
 * Description: Page d'accueil AAPT - Le Coin MG — Custom coded
 */

include(get_stylesheet_directory() . '/header-custom.php');
?>

<main id="main-content" role="main">

<!-- =============================================
     HERO — IMMERSIVE
     ============================================= -->
<section class="hero" id="hero">
    <div class="hero-bg">
        <div class="hero-bg-image parallax-bg" data-speed="0.3" style="background: radial-gradient(ellipse at 50% 30%, #1a0508 0%, #0a0205 30%, #060609 100%);"></div>
        <div class="hero-overlay"></div>
    </div>
    <div class="hero-particles" aria-hidden="true">
        <span></span><span></span><span></span><span></span>
        <span></span><span></span><span></span><span></span>
    </div>
    <div class="hero-content">
        <div class="hero-badge reveal">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
            Qualité Premium Garantie
        </div>
        <h1 class="reveal delay-1">
            Pièces Auto <span class="highlight">MG</span><br>
            de Haute Qualité
        </h1>
        <p class="hero-subtitle reveal delay-2">
            Votre partenaire N°1 en Tunisie pour les pièces automobiles MG.
            <span id="typewriterTarget"></span><span class="typewriter-cursor" aria-hidden="true"></span>
        </p>
        <div class="hero-buttons reveal delay-3">
            <a href="#produits" class="btn btn-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                Découvrir Nos Pièces
            </a>
            <a href="<?php echo esc_url(home_url('/contact/')); ?>" class="btn btn-outline">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                Demander un Devis
            </a>
        </div>
    </div>
    <div class="scroll-indicator" aria-hidden="true"><span>Défiler</span><div class="scroll-indicator-line"></div></div>
</section>

<!-- =============================================
     BRAND STORY — STORYTELLING
     ============================================= -->
<section class="section story-section" id="apropos">
    <div class="container">
        <div class="story-grid">
            <div class="story-text">
                <div class="hero-badge reveal" style="margin-bottom:1.5rem;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    Depuis Le Bardo, Tunisie
                </div>
                <h2 class="reveal-left delay-1">
                    L'Excellence<br>Auto MG,<br>c'est <span class="highlight">AAPT</span>
                </h2>
                <div class="red-line-sep reveal-left delay-2"></div>
                <p class="reveal-left delay-2">
                    Chez <strong>AAPT — Le Coin MG</strong>, chaque pièce raconte une histoire de qualité. Nous sommes nés d'une passion profonde pour l'automobile MG et d'une conviction simple : chaque conducteur tunisien mérite des pièces fiables à un prix juste.
                </p>
                <p class="reveal-left delay-3">
                    De la <strong>MG ZS</strong> à la <strong>MG 5</strong>, en passant par la <strong>MG RX5</strong> et la <strong>MG HS</strong> — nous couvrons l'intégralité de la gamme MG avec un stock de plus de 5000 références, toujours disponibles et prêtes à être livrées partout en Tunisie.
                </p>
            </div>
            <div class="story-image reveal-right">
                <?php
                $story_image = get_stylesheet_directory_uri() . '/img/showroom.jpg';
                ?>
                <img src="<?php echo esc_url($story_image); ?>" alt="Showroom AAPT - Le Coin MG" loading="lazy" width="600" height="450"
                     onerror="this.style.display='none';this.parentElement.innerHTML='<div style=\'width:100%;height:100%;background:radial-gradient(ellipse at 70% 40%, #1a0c10 0%, #0e0e14 100%);display:flex;align-items:center;justify-content:center;min-height:320px;position:relative;\'><svg width=&quot;160&quot; height=&quot;160&quot; viewBox=&quot;0 0 200 200&quot; fill=&quot;none&quot; style=&quot;opacity:0.15;&quot;><polygon points=&quot;60,10 140,10 190,60 190,140 140,190 60,190 10,140 10,60&quot; stroke=&quot;#E30613&quot; stroke-width=&quot;3&quot; fill=&quot;none&quot;/><text x=&quot;100&quot; y=&quot;115&quot; text-anchor=&quot;middle&quot; fill=&quot;#E30613&quot; font-size=&quot;60&quot; font-weight=&quot;900&quot; font-family=&quot;Arial&quot;>MG</text></svg><div style=&quot;position:absolute;bottom:1.5rem;left:1.5rem;right:1.5rem;text-align:center;&quot;><p style=&quot;color:#E30613;font-weight:700;font-size:0.85rem;text-transform:uppercase;letter-spacing:0.1em;&quot;>Remplacez par votre photo</p><p style=&quot;color:#5a5a66;font-size:0.8rem;margin-top:0.25rem;&quot;>Image du showroom ou équipe</p></div></div>';">
            </div>
        </div>
        <div class="counters">
            <div class="counter-item reveal delay-1">
                <div class="counter-number" data-target="17500">0</div>
                <div class="counter-label">Abonnés Facebook</div>
            </div>
            <div class="counter-item reveal delay-2">
                <div class="counter-number" data-target="5000">0</div>
                <div class="counter-label">Références en Stock</div>
            </div>
            <div class="counter-item reveal delay-3">
                <div class="counter-number" data-target="3000">0</div>
                <div class="counter-label">Clients Satisfaits</div>
            </div>
        </div>
    </div>
</section>

<!-- =============================================
     SERVICES
     ============================================= -->
<section class="section services-section" id="services">
    <div class="container">
        <div class="section-header">
            <h2 class="reveal">Pourquoi <span class="highlight">Nous Choisir</span></h2>
            <hr class="section-divider reveal delay-1">
            <p class="reveal delay-2">Des avantages exclusifs pour chaque client MG</p>
        </div>
        <div class="services-grid">
            <div class="service-card reveal delay-1">
                <div class="service-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></div>
                <h3>Qualité OEM Garantie</h3>
                <p>Pièces certifiées aux normes d'origine MG. Tests rigoureux pour une fiabilité maximale sur chaque référence.</p>
            </div>
            <div class="service-card reveal delay-2">
                <div class="service-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg></div>
                <h3>Livraison Express</h3>
                <p>Service de livraison rapide partout en Tunisie. Vos pièces MG livrées en un temps record, de Tunis à Sfax.</p>
            </div>
            <div class="service-card reveal delay-3">
                <div class="service-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg></div>
                <h3>Prix Imbattables</h3>
                <p>Tarifs de gros accessibles même en détail. Des économies réelles sans compromis sur la qualité.</p>
            </div>
            <div class="service-card reveal delay-4">
                <div class="service-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></div>
                <h3>Conseil Expert</h3>
                <p>Une équipe de spécialistes MG à votre service. Identification précise des pièces par VIN et assistance technique.</p>
            </div>
        </div>
    </div>
</section>

<!-- =============================================
     PRODUCTS — CATALOGUE MG
     ============================================= -->
<section class="section products-section" id="produits">
    <div class="container">
        <div class="section-header">
            <h2 class="reveal">Nos <span class="highlight">Pièces MG</span></h2>
            <hr class="section-divider reveal delay-1">
            <p class="reveal delay-2">Catalogue complet pour MG ZS, MG 5, MG RX5 et MG HS</p>
        </div>
        <div class="filter-tabs reveal" role="tablist" aria-label="Filtrer par catégorie">
            <button class="filter-tab active" data-filter="all" role="tab" aria-selected="true">Tous</button>
            <button class="filter-tab" data-filter="moteur" role="tab" aria-selected="false">Moteur</button>
            <button class="filter-tab" data-filter="freinage" role="tab" aria-selected="false">Freinage</button>
            <button class="filter-tab" data-filter="suspension" role="tab" aria-selected="false">Suspension</button>
            <button class="filter-tab" data-filter="carrosserie" role="tab" aria-selected="false">Carrosserie</button>
            <button class="filter-tab" data-filter="filtration" role="tab" aria-selected="false">Filtration</button>
        </div>
        <div class="products-grid" id="productsGrid">

            <!-- P1: Kit Distribution MG ZS -->
            <div class="product-card reveal" data-category="moteur">
                <div class="product-image">
                    <div class="product-visual" style="background:linear-gradient(160deg,#0d0810,#140a0d 60%,#0d0810);">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#E30613" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                    </div>
                    <span class="product-category-badge">Moteur</span>
                </div>
                <div class="product-info">
                    <h3>Kit Chaîne Distribution — MG ZS</h3>
                    <p>Kit complet (chaîne, tendeur, guides) pour moteur 1.5L MG ZS. Qualité OEM.</p>
                    <button class="product-cta" data-product="Kit Chaîne Distribution — MG ZS" aria-label="Demander un devis pour Kit Chaîne Distribution MG ZS">Demander un Devis</button>
                </div>
            </div>

            <!-- P2: Pompe à Eau MG 5 -->
            <div class="product-card reveal delay-1" data-category="moteur">
                <div class="product-image">
                    <div class="product-visual" style="background:linear-gradient(160deg,#0d0810,#100a0e 60%,#0d0810);">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#E30613" stroke-width="1.2" stroke-linecap="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
                    </div>
                    <span class="product-category-badge">Moteur</span>
                </div>
                <div class="product-info">
                    <h3>Pompe à Eau — MG 5</h3>
                    <p>Pompe à eau haute performance pour MG 5 1.5L. Durabilité et refroidissement optimal.</p>
                    <button class="product-cta" data-product="Pompe à Eau — MG 5" aria-label="Demander un devis pour Pompe à Eau MG 5">Demander un Devis</button>
                </div>
            </div>

            <!-- P3: Plaquettes de Frein MG HS -->
            <div class="product-card reveal delay-2" data-category="freinage">
                <div class="product-image">
                    <div class="product-visual" style="background:linear-gradient(160deg,#0d0810,#120b0d 60%,#0d0810);">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#E30613" stroke-width="1.2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                    </div>
                    <span class="product-category-badge">Freinage</span>
                </div>
                <div class="product-info">
                    <h3>Plaquettes de Frein Avant — MG HS</h3>
                    <p>Plaquettes céramique haute performance pour MG HS. Freinage puissant et silencieux.</p>
                    <button class="product-cta" data-product="Plaquettes de Frein Avant — MG HS" aria-label="Demander un devis pour Plaquettes de Frein">Demander un Devis</button>
                </div>
            </div>

            <!-- P4: Disques de Frein MG ZS -->
            <div class="product-card reveal delay-3" data-category="freinage">
                <div class="product-image">
                    <div class="product-visual" style="background:linear-gradient(160deg,#0d0810,#120b0d 60%,#0d0810);">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#E30613" stroke-width="1.2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="8"/><line x1="12" y1="16" x2="12" y2="22"/><line x1="2" y1="12" x2="8" y2="12"/><line x1="16" y1="12" x2="22" y2="12"/></svg>
                    </div>
                    <span class="product-category-badge">Freinage</span>
                </div>
                <div class="product-info">
                    <h3>Disques de Frein Ventilés — MG ZS</h3>
                    <p>Disques ventilés pour une dissipation thermique optimale. Compatible MG ZS toutes versions.</p>
                    <button class="product-cta" data-product="Disques de Frein Ventilés — MG ZS" aria-label="Demander un devis pour Disques de Frein">Demander un Devis</button>
                </div>
            </div>

            <!-- P5: Amortisseurs MG RX5 -->
            <div class="product-card reveal" data-category="suspension">
                <div class="product-image">
                    <div class="product-visual" style="background:linear-gradient(160deg,#0d0810,#0d100e 60%,#0d0810);">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#E30613" stroke-width="1.2" stroke-linecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                    </div>
                    <span class="product-category-badge">Suspension</span>
                </div>
                <div class="product-info">
                    <h3>Amortisseurs Avant — MG RX5</h3>
                    <p>Amortisseurs à gaz qualité OEM pour MG RX5. Confort de conduite et tenue de route supérieurs.</p>
                    <button class="product-cta" data-product="Amortisseurs Avant — MG RX5" aria-label="Demander un devis pour Amortisseurs">Demander un Devis</button>
                </div>
            </div>

            <!-- P6: Rotules MG HS -->
            <div class="product-card reveal delay-1" data-category="suspension">
                <div class="product-image">
                    <div class="product-visual" style="background:linear-gradient(160deg,#0d0810,#0d100e 60%,#0d0810);">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#E30613" stroke-width="1.2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="8"/><line x1="12" y1="16" x2="12" y2="22"/></svg>
                    </div>
                    <span class="product-category-badge">Suspension</span>
                </div>
                <div class="product-info">
                    <h3>Rotules de Direction — MG HS</h3>
                    <p>Rotules renforcées pour une direction précise et une tenue de route impeccable sur MG HS.</p>
                    <button class="product-cta" data-product="Rotules de Direction — MG HS" aria-label="Demander un devis pour Rotules">Demander un Devis</button>
                </div>
            </div>

            <!-- P7: Rétroviseur MG 5 -->
            <div class="product-card reveal delay-2" data-category="carrosserie">
                <div class="product-image">
                    <div class="product-visual" style="background:linear-gradient(160deg,#0d0810,#0e0d12 60%,#0d0810);">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#E30613" stroke-width="1.2" stroke-linecap="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                    </div>
                    <span class="product-category-badge">Carrosserie</span>
                </div>
                <div class="product-info">
                    <h3>Rétroviseur Électrique — MG 5</h3>
                    <p>Rétroviseur latéral avec rabattement électrique et miroir dégivrant. Identique à l'origine.</p>
                    <button class="product-cta" data-product="Rétroviseur Électrique — MG 5" aria-label="Demander un devis pour Rétroviseur">Demander un Devis</button>
                </div>
            </div>

            <!-- P8: Filtre à Air MG ZS -->
            <div class="product-card reveal delay-3" data-category="filtration">
                <div class="product-image">
                    <div class="product-visual" style="background:linear-gradient(160deg,#0d0810,#110e0d 60%,#0d0810);">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#E30613" stroke-width="1.2" stroke-linecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                    </div>
                    <span class="product-category-badge">Filtration</span>
                </div>
                <div class="product-info">
                    <h3>Filtre à Air Performance — MG ZS</h3>
                    <p>Filtre à air haute filtration pour une meilleure respiration moteur. Kit de remplacement facile.</p>
                    <button class="product-cta" data-product="Filtre à Air Performance — MG ZS" aria-label="Demander un devis pour Filtre à Air">Demander un Devis</button>
                </div>
            </div>

        </div>
    </div>
</section>

<!-- PRODUCT INQUIRY MODAL -->
<div class="modal-overlay" id="productModal" role="dialog" aria-modal="true" aria-labelledby="modalTitle" aria-hidden="true">
    <div class="modal">
        <button class="modal-close" id="modalClose" aria-label="Fermer">&times;</button>
        <h2 id="modalTitle">Demander un Devis</h2>
        <p class="modal-product-name" id="modalProductName"></p>
        <form id="productInquiryForm" novalidate>
            <input type="hidden" id="formProductName" name="product">
            <input type="hidden" name="source" value="Home - Produit">
            <div class="form-group"><label for="inquiryName">Nom Complet *</label><input type="text" id="inquiryName" name="name" placeholder="Votre nom complet" required autocomplete="name"></div>
            <div class="form-group"><label for="inquiryPhone">Téléphone *</label><input type="tel" id="inquiryPhone" name="phone" placeholder="+216 XX XXX XXX" required autocomplete="tel"></div>
            <div class="form-group"><label for="inquiryEmail">Email</label><input type="email" id="inquiryEmail" name="email" placeholder="votre@email.com" autocomplete="email"></div>
            <div class="form-group"><label for="inquiryMessage">Message</label><textarea id="inquiryMessage" name="message" placeholder="Précisez le modèle MG, l'année, le numéro VIN si possible..." rows="4"></textarea></div>
            <button type="submit" class="btn btn-primary form-submit" id="inquirySubmitBtn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                Envoyer la Demande
            </button>
        </form>
    </div>
</div>

<!-- =============================================
     TESTIMONIALS
     ============================================= -->
<section class="section why-section" id="temoignages">
    <div class="container">
        <div class="section-header">
            <h2 class="reveal">Ils Nous <span class="highlight">Font Confiance</span></h2>
            <hr class="section-divider reveal delay-1">
            <p class="reveal delay-2">+17 500 abonnés sur Facebook. Découvrez pourquoi.</p>
        </div>
        <div class="testimonials-track reveal">
            <div class="testimonial-card">
                <div class="stars" aria-label="5 étoiles">★★★★★</div>
                <p class="testimonial-text">J'ai commandé un kit de distribution pour ma MG ZS. La qualité est identique à l'origine et le prix est imbattable. AAPT est devenu mon fournisseur principal.</p>
                <div class="testimonial-author"><div class="testimonial-avatar">MA</div><div><div class="testimonial-name">Mohamed A.</div><div class="testimonial-role">Mécanicien — Tunis</div></div></div>
            </div>
            <div class="testimonial-card">
                <div class="stars" aria-label="5 étoiles">★★★★★</div>
                <p class="testimonial-text">Livraison super rapide et pièces toujours en stock. Mon garage achète exclusivement chez AAPT pour les véhicules MG. Service client au top !</p>
                <div class="testimonial-author"><div class="testimonial-avatar">SK</div><div><div class="testimonial-name">Slim K.</div><div class="testimonial-role">Propriétaire garage — Sousse</div></div></div>
            </div>
            <div class="testimonial-card">
                <div class="stars" aria-label="5 étoiles">★★★★★</div>
                <p class="testimonial-text">Des pièces introuvables ailleurs en Tunisie ! AAPT a trouvé exactement ce qu'il me fallait pour ma MG RX5 en 24h. Impressionnant.</p>
                <div class="testimonial-author"><div class="testimonial-avatar">FB</div><div><div class="testimonial-name">Fares B.</div><div class="testimonial-role">Client MG RX5 — Sfax</div></div></div>
            </div>
            <div class="testimonial-card">
                <div class="stars" aria-label="4 étoiles">★★★★☆</div>
                <p class="testimonial-text">Première commande et très satisfaite. Les plaquettes de frein pour ma MG HS sont parfaites. Le conseiller m'a guidée pour choisir la bonne référence.</p>
                <div class="testimonial-author"><div class="testimonial-avatar">NH</div><div><div class="testimonial-name">Nadia H.</div><div class="testimonial-role">Conductrice MG HS — Le Bardo</div></div></div>
            </div>
        </div>
    </div>
</section>

<!-- =============================================
     CTA — PARALLAX
     ============================================= -->
<section class="cta-section" id="cta">
    <div class="cta-bg"><div class="cta-bg-image parallax-bg" data-speed="0.2" style="background: radial-gradient(ellipse at 50% 50%, #1a0508 0%, #0a0205 40%, #060609 100%);"></div><div class="cta-overlay"></div></div>
    <div class="container cta-content">
        <h2 class="reveal">Besoin d'une Pièce <span class="highlight">MG</span> ?<br>Contactez-nous !</h2>
        <p class="reveal delay-1">Devis gratuit sous 24h. Conseil personnalisé par notre équipe de spécialistes MG.</p>
        <div class="cta-buttons reveal delay-2">
            <a href="<?php echo esc_url(home_url('/contact/')); ?>" class="btn btn-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                Contactez-Nous
            </a>
            <a href="https://www.facebook.com/AsianAutoPartsTunisia" target="_blank" rel="noopener noreferrer" class="btn btn-outline">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Notre Facebook (+17.5k)
            </a>
        </div>
    </div>
</section>

</main>

<?php include(get_stylesheet_directory() . '/footer-custom.php'); ?>
