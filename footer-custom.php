<footer class="site-footer" role="contentinfo">
    <div class="container">
        <div class="footer-grid">
            <div class="footer-about">
                <a href="<?php echo esc_url(home_url('/')); ?>" class="logo">
                    <?php if (has_custom_logo()): ?>
                        <?php
                        $logo_id = get_theme_mod('custom_logo');
                        $logo_url = wp_get_attachment_image_url($logo_id, 'medium');
                        ?>
                        <img src="<?php echo esc_url($logo_url); ?>" alt="MG Logo" class="logo-img" width="48" height="48">
                    <?php else: ?>
                        <img src="<?php echo esc_url(get_stylesheet_directory_uri()); ?>/img/mg-logo.png" alt="MG Logo" class="logo-img" width="48" height="48" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
                        <div class="logo-icon" style="display:none;" aria-hidden="true">MG</div>
                    <?php endif; ?>
                    <div class="logo-text">AAP<span class="logo-t">T</span><span class="logo-sub">Asian Auto Parts Tunisia</span></div>
                </a>
                <p>Votre partenaire de confiance pour les pièces auto MG en Tunisie. Qualité OEM, prix compétitifs, livraison rapide.</p>
                <div class="footer-social">
                    <a href="https://www.facebook.com/AsianAutoPartsTunisia" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </a>
                </div>
            </div>
            <div>
                <h4 class="footer-heading">Liens Rapides</h4>
                <ul class="footer-links">
                    <li><a href="<?php echo esc_url(home_url('/')); ?>">Accueil</a></li>
                    <li><a href="<?php echo esc_url(home_url('/#apropos')); ?>">À Propos</a></li>
                    <li><a href="<?php echo esc_url(home_url('/#produits')); ?>">Nos Pièces</a></li>
                    <li><a href="<?php echo esc_url(home_url('/contact/')); ?>">Contact</a></li>
                </ul>
            </div>
            <div>
                <h4 class="footer-heading">Modèles MG</h4>
                <ul class="footer-links">
                    <li><a href="<?php echo esc_url(home_url('/#produits')); ?>">MG ZS</a></li>
                    <li><a href="<?php echo esc_url(home_url('/#produits')); ?>">MG 5</a></li>
                    <li><a href="<?php echo esc_url(home_url('/#produits')); ?>">MG RX5</a></li>
                    <li><a href="<?php echo esc_url(home_url('/#produits')); ?>">MG HS</a></li>
                </ul>
            </div>
            <div>
                <h4 class="footer-heading">Contact</h4>
                <div class="footer-contact-item">
                    <span class="footer-contact-icon" aria-hidden="true">📍</span>
                    <span>Boulvard Mohamed Bouazizi, Le Bardo, Tunisia</span>
                </div>
                <div class="footer-contact-item">
                    <span class="footer-contact-icon" aria-hidden="true">📞</span>
                    <span>+216 98 601 610</span>
                </div>
                <div class="footer-contact-item">
                    <span class="footer-contact-icon" aria-hidden="true">✉️</span>
                    <span>asian.auto.parts.tunisia@gmail.com</span>
                </div>
                <div class="footer-contact-item">
                    <span class="footer-contact-icon" aria-hidden="true">🕐</span>
                    <span>Lun - Sam: 8h00 - 18h00</span>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; <?php echo date('Y'); ?> AAPT - Le Coin MG. Tous droits réservés.</p>
            <p>Pièces Auto MG — Qualité OEM en Tunisie</p>
        </div>
    </div>
</footer>

<button class="back-to-top" id="backToTop" aria-label="Retour en haut">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
</button>
<div class="toast" id="toast" role="alert" aria-live="polite"></div>

<?php wp_footer(); ?>
</body>
</html>
