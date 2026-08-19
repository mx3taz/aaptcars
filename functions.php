<?php
/**
 * AAPT - Le Coin MG Child Theme Functions
 * Performance-optimized Astra child theme
 */

// Exit if accessed directly
if (!defined('ABSPATH')) exit;

/* ============================================
   1. THEME SETUP
   ============================================ */
add_action('after_setup_theme', function() {
    // Add theme supports
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', ['search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script']);

    // Register nav menus
    register_nav_menus([
        'primary' => __('Menu Principal', 'aapt-lecoinmg'),
    ]);
});

/* ============================================
   2. ENQUEUE STYLES & SCRIPTS
   ============================================ */
add_action('wp_enqueue_scripts', function() {
    $theme_uri = get_stylesheet_directory_uri();
    $theme_dir = get_stylesheet_directory();
    $version = filemtime($theme_dir . '/style.css');

    // Dequeue parent theme default if not needed
    // wp_dequeue_style('astra-theme-css');

    // Preconnect to Google Fonts
    // Done via wp_head hook below for performance

    // Enqueue our main stylesheet
    wp_enqueue_style(
        'aapt-main',
        $theme_uri . '/style.css',
        ['astra-theme-css'],
        $version
    );

    // Enqueue our JS (deferred)
    wp_enqueue_script(
        'aapt-main-js',
        $theme_uri . '/js/main.js',
        [],
        filemtime($theme_dir . '/js/main.js'),
        true // In footer
    );

    // Pass data to JS
    wp_localize_script('aapt-main-js', 'aaptData', [
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'homeUrl' => home_url('/'),
        'nonce'   => wp_create_nonce('aapt_nonce'),
    ]);
}, 20);

/* ============================================
   3. GOOGLE FONTS — Preconnect + Preload
   ============================================ */
add_action('wp_head', function() {
    echo '<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>' . "\n";
    echo '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' . "\n";
    echo '<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap">' . "\n";
    echo '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" media="print" onload="this.media=\'all\'">' . "\n";
    echo '<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap"></noscript>' . "\n";
}, 1);

/* ============================================
   4. PERFORMANCE OPTIMIZATIONS
   ============================================ */

// Remove WordPress bloat
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');
remove_action('admin_print_scripts', 'print_emoji_detection_script');
remove_action('admin_print_styles', 'print_emoji_styles');
remove_action('wp_head', 'wp_generator');
remove_action('wp_head', 'wlwmanifest_link');
remove_action('wp_head', 'rsd_link');
remove_action('wp_head', 'wp_shortlink_wp_head');
remove_action('wp_head', 'rest_output_link_wp_head');
remove_action('wp_head', 'wp_oembed_add_discovery_links');
remove_action('wp_head', 'wp_resource_hints', 2);
remove_action('wp_head', 'feed_links_extra', 3);
remove_action('wp_head', 'feed_links', 2);

// Remove emoji DNS prefetch
add_filter('emoji_svg_url', '__return_false');

// Disable self-pingbacks
add_action('pre_ping', function(&$links) {
    $home = home_url();
    foreach ($links as $l => $link) {
        if (strpos($link, $home) === 0) unset($links[$l]);
    }
});

// Remove jQuery migrate
add_action('wp_default_scripts', function($scripts) {
    if (!is_admin() && isset($scripts->registered['jquery'])) {
        $script = $scripts->registered['jquery'];
        if ($script->deps) {
            $script->deps = array_diff($script->deps, ['jquery-migrate']);
        }
    }
});

// Defer non-critical scripts
add_filter('script_loader_tag', function($tag, $handle) {
    // Don't defer admin scripts or jQuery
    if (is_admin() || $handle === 'jquery-core') return $tag;

    // Defer our main script
    if ($handle === 'aapt-main-js') {
        return str_replace(' src', ' defer src', $tag);
    }

    return $tag;
}, 10, 2);

// Add resource hints
add_action('wp_head', function() {
    echo '<meta name="theme-color" content="#0a0a0f">' . "\n";
}, 0);

// Disable Astra's own scroll-to-top button (we have our own)
add_filter('astra_scroll_to_top_icon', '__return_false');
add_filter('astra_enable_scroll_to_top', '__return_false');
add_filter('astra_get_option_scroll-to-top-enable', function() { return false; });

/* ============================================
   5. DISABLE ELEMENTOR ON CUSTOM TEMPLATES
   ============================================ */
add_action('wp', function() {
    if (is_page_template('page-home.php') || is_page_template('page-contact.php')) {
        // Remove Elementor styles/scripts from our custom pages
        add_action('wp_enqueue_scripts', function() {
            wp_dequeue_style('elementor-frontend');
            wp_dequeue_style('elementor-common');
            wp_dequeue_style('elementor-icons');
            wp_dequeue_style('elementor-animations');
            wp_dequeue_style('elementor-pro');
            wp_dequeue_script('elementor-frontend');
            wp_dequeue_script('elementor-pro-frontend');
        }, 999);
    }
});

/* ============================================
   6. CUSTOM PAGE TEMPLATES REGISTRATION
   ============================================ */
add_filter('theme_page_templates', function($templates) {
    $templates['page-home.php'] = 'AAPT - Accueil';
    $templates['page-contact.php'] = 'AAPT - Contact';
    return $templates;
});

/* ============================================
   7. SEO & STRUCTURED DATA
   ============================================ */
add_action('wp_head', function() {
    if (is_front_page() || is_page_template('page-home.php')) {
        echo '<meta name="description" content="AAPT - Le Coin MG : Pièces Auto MG de Haute Qualité. Vente en gros et détail. Prix compétitifs et livraison rapide en Tunisie.">' . "\n";
    }
    if (is_page_template('page-contact.php')) {
        echo '<meta name="description" content="Contactez AAPT - Le Coin MG pour vos pièces auto MG. Le Bardo, Tunisie. Devis gratuit et livraison rapide.">' . "\n";
    }

    // Local Business Schema
    ?>
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "AutoPartsStore",
        "name": "AAPT - Le Coin MG",
        "description": "Pièces Auto MG de Haute Qualité - Vente en Gros et Détail",
        "url": "<?php echo home_url(); ?>",
        "telephone": "+216-XX-XXX-XXX",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Le Bardo",
            "addressCountry": "TN"
        },
        "sameAs": [
            "https://www.facebook.com/AsianAutoPartsTunisia"
        ],
        "priceRange": "$$"
    }
    </script>
    <?php
}, 5);

/* ============================================
   8. SECURITY HEADERS
   ============================================ */
add_action('send_headers', function() {
    if (!is_admin()) {
        header('X-Content-Type-Options: nosniff');
        header('X-Frame-Options: SAMEORIGIN');
        header('Referrer-Policy: strict-origin-when-cross-origin');
    }
});
