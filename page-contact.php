<?php
/**
 * Template Name: Page Contact
 * Description: Page de contact AAPT - Le Coin MG — Custom coded
 */

include(get_stylesheet_directory() . '/header-custom.php');
?>

<main id="main-content" role="main">

<!-- CONTACT HERO -->
<section class="contact-hero">
    <div class="hero-bg">
        <div class="hero-bg-image parallax-bg" data-speed="0.3" style="background: radial-gradient(ellipse at 50% 30%, #1a0508 0%, #0a0205 30%, #060609 100%);"></div>
        <div class="hero-overlay"></div>
    </div>
    <div class="hero-content">
        <div class="hero-badge reveal">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/></svg>
            Contactez-Nous
        </div>
        <h1 class="reveal delay-1">On est là <span class="highlight">pour vous</span></h1>
        <p class="hero-subtitle reveal delay-2">Devis gratuit sous 24h. Notre équipe de spécialistes MG est à votre disposition.</p>
        <div class="breadcrumb reveal delay-3">
            <a href="<?php echo esc_url(home_url('/')); ?>">Accueil</a>
            <span class="breadcrumb-sep">›</span>
            <span>Contact</span>
        </div>
    </div>
</section>

<!-- CONTACT CONTENT -->
<section class="section contact-content-section" id="contact-section">
    <div class="container">
        <div class="contact-grid">
            <div class="contact-form-card reveal-left">
                <h2>Envoyez-nous un <span class="text-red">message</span></h2>
                <div class="red-line-sep"></div>
                <p>Remplissez le formulaire et nous vous répondrons dans les plus brefs délais.</p>
                <form id="contactForm" novalidate>
                    <input type="hidden" name="source" value="Page Contact">
                    <div class="form-group"><label for="contactName">Nom Complet *</label><input type="text" id="contactName" name="name" placeholder="Votre nom complet" required autocomplete="name"></div>
                    <div class="form-group"><label for="contactPhone">Téléphone *</label><input type="tel" id="contactPhone" name="phone" placeholder="+216 XX XXX XXX" required autocomplete="tel"></div>
                    <div class="form-group"><label for="contactEmail">Email</label><input type="email" id="contactEmail" name="email" placeholder="votre@email.com" autocomplete="email"></div>
                    <div class="form-group">
                        <label for="contactSubject">Sujet</label>
                        <select id="contactSubject" name="subject">
                            <option value="">— Sélectionnez —</option>
                            <option value="Demande de devis">Demande de devis</option>
                            <option value="Disponibilité pièce">Disponibilité d'une pièce</option>
                            <option value="Question technique">Question technique</option>
                            <option value="Réclamation">Réclamation</option>
                            <option value="Autre">Autre</option>
                        </select>
                    </div>
                    <div class="form-group"><label for="contactMessage">Message *</label><textarea id="contactMessage" name="message" placeholder="Décrivez votre besoin... (modèle MG, année, référence, VIN)" required rows="5"></textarea></div>
                    <button type="submit" class="btn btn-primary form-submit" id="contactSubmitBtn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        Envoyer le Message
                    </button>
                </form>
            </div>
            <div class="contact-info-cards">
                <div class="info-card reveal-right delay-1">
                    <div class="info-card-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>
                    <div><h3>Adresse</h3><p>Boulvard mohamed Bouazizi, Le Bardo, Tunisia</p></div>
                </div>
                <div class="info-card reveal-right delay-2">
                    <div class="info-card-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg></div>
                    <div><h3>Téléphone</h3><p>+216 98 601 610</p></div>
                </div>
                <div class="info-card reveal-right delay-3">
                    <div class="info-card-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg></div>
                    <div><h3>Email</h3><p>asian.auto.parts.tunisia@gmail.com</p></div>
                </div>
                <div class="info-card reveal-right delay-4">
                    <div class="info-card-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></div>
                    <div><h3>Horaires</h3><p>Lun - Sam : 08h00 - 18h00<br>Dimanche : Fermé</p></div>
                </div>
                <div class="info-card reveal-right delay-5">
                    <div class="info-card-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></div>
                    <div><h3>Facebook</h3><p><a href="https://www.facebook.com/AsianAutoPartsTunisia" target="_blank" rel="noopener noreferrer">AAPT - Le Coin MG (+17.5k)</a></p></div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- MAP -->
<section class="map-section">
    <div class="container">
        <div class="map-wrapper reveal-scale">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3192.926!2d10.1221!3d36.8095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd337f3c0c8b97%3A0x0!2sLe%20Bardo%2C%20Tunisia!5e0!3m2!1sfr!2stn!4v1" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Localisation AAPT - Le Coin MG au Bardo, Tunisie"></iframe>
        </div>
    </div>
</section>

</main>

<?php include(get_stylesheet_directory() . '/footer-custom.php'); ?>
