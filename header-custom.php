<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo('charset'); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="site-header" id="siteHeader" role="banner">
    <!-- Top Info Bar -->
    <div class="header-top-bar" id="headerTopBar">
      <div class="header-top-inner">
        <div class="header-top-left">
          <a href="<?php echo esc_url(home_url('/')); ?>" class="logo" aria-label="AAPT - Accueil">
            <div class="logo-text">AAP<span class="logo-t">T</span><span class="logo-sub">Asian Auto Parts
                Tunisia</span></div>
          </a>
          <div class="header-top-info">
            <a href="tel:+21698601610"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2">
                <path
                  d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z">
                </path>
              </svg> +216 98 601 610</a>
            <a href="mailto:asian.auto.parts.tunisia@gmail.com"><svg width="14" height="14" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg> asian.auto.parts.tunisia@gmail.com</a>
          </div>
        </div>
        <div class="header-top-right">
          <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg> Le Bardo, Tunisie</span>
        </div>
      </div>
    </div>
    <!-- Main Navbar -->
    <div class="header-navbar" id="headerNavbar">
      <div class="header-nav-inner">
        <nav class="nav-links" id="navLinks" role="navigation" aria-label="Navigation principale">
          <a href="<?php echo esc_url(home_url('/')); ?>" <?php if (is_front_page()) echo 'class="active"'; ?>>Accueil</a>
          <a href="<?php echo esc_url(home_url('/#produits')); ?>">Produits</a>
          <a href="<?php echo esc_url(home_url('/contact/')); ?>" <?php if (is_page('contact')) echo 'class="active"'; ?>>Contact</a>
        </nav>
        <a href="https://www.facebook.com/AsianAutoPartsTunisia" target="_blank" rel="noopener noreferrer"
          class="nav-social-link" aria-label="Notre page Facebook">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path
              d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </a>
        <button class="menu-toggle" id="menuToggle" aria-label="Ouvrir le menu" aria-expanded="false"
          aria-controls="navLinks">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
</header>
