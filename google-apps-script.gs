/**
 * AAPT — Asian Auto Parts Tunisia
 * Google Apps Script (Web App) : formulaires du site → Google Sheets
 *
 * Gère les DEUX formulaires du site :
 *   1) Le modal Commande / Devis   (#umForm)
 *   2) Le formulaire de la page Contact (#contactForm)
 *
 * Colonnes écrites dans la feuille (12) :
 *   A  Date / Heure
 *   B  Nom Complet
 *   C  Téléphone
 *   D  Email
 *   E  Marque
 *   F  Modèle
 *   G  N° Carte Grise
 *   H  Adresse de Livraison
 *   I  Produit(s) Commandé(s)
 *   J  Message
 *   K  Source   (Commande Panier / Demande de Devis / Contact ...)
 *   L  Sujet    (Commande / Demande de devis / sujet du formulaire Contact)
 *
 * La ligne d'en-tête est créée automatiquement si la feuille est vide.
 */

// ─────────────── CONFIGURATION ───────────────
// ID de votre Google Sheet : c'est la partie entre /d/ et /edit dans l'URL
// https://docs.google.com/spreadsheets/d/  <<< ID >>>  /edit
var SHEET_ID = '11XE-KMXAEmg2bWJiOoPTiAjqHUxNs7ICflKBUIk3p5w';

// Nom de l'onglet où écrire (créé automatiquement s'il n'existe pas)
var SHEET_NAME = 'Commandes';

// Fuseau horaire utilisé pour la date / heure
var TIMEZONE = 'Africa/Tunis';

// Longueur maximale conservée par champ (protection anti-abus)
var MAX_LEN = 3000;
// ──────────────────────────────────────────────

var HEADERS = [
  'Date / Heure',
  'Nom Complet',
  'Téléphone',
  'Email',
  'Marque',
  'Modèle',
  'N° Carte Grise',
  'Adresse de Livraison',
  'Produit(s) Commandé(s)',
  'Message',
  'Source',
  'Sujet'
];

/**
 * Appelée automatiquement quand le site envoie un formulaire (requête POST).
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    // Évite que deux commandes simultanées s'écrasent sur la même ligne
    lock.waitLock(30000);

    var p = readParams_(e);

    var name  = clean_(p.name);
    var phone = clean_(p.phone);
    if (!name || !phone) {
      return json_({ result: 'error', message: 'Le nom et le téléphone sont obligatoires.' });
    }

    var row = [
      Utilities.formatDate(new Date(), TIMEZONE, 'dd/MM/yyyy HH:mm:ss'),
      name,
      phone,
      clean_(p.email),
      clean_(p.brand),
      clean_(p.model),
      clean_(p.carteGrise),
      clean_(p.adresse),
      clean_(p.product),
      clean_(p.message),
      clean_(p.source) || 'Commande',
      clean_(p.subject)
    ];

    var sheet = getSheet_();
    ensureHeader_(sheet);

    var targetRow = sheet.getLastRow() + 1;
    // Format "texte brut" : garde "+216 98 601 610" tel quel (sinon Sheets
    // le transforme en formule/erreur) et neutralise tout texte commençant par "=".
    sheet.getRange(targetRow, 1, 1, row.length).setNumberFormat('@').setValues([row]);

    return json_({ result: 'success', message: 'Demande enregistrée avec succès' });

  } catch (error) {
    return json_({ result: 'error', message: String(error) });
  } finally {
    try { lock.releaseLock(); } catch (ignore) {}
  }
}

/**
 * Test rapide : ouvrir l'URL du Web App dans le navigateur doit afficher ce message.
 */
function doGet() {
  return json_({ result: 'success', message: 'API AAPT connectée et opérationnelle' });
}

/**
 * À EXÉCUTER UNE FOIS depuis l'éditeur (bouton ▶ Exécuter) :
 *  - déclenche la demande d'autorisation Google
 *  - ajoute une ligne de test dans la feuille
 */
function testSubmit() {
  var fake = {
    parameter: {
      name: 'Client Test',
      phone: '+216 98 601 610',
      email: 'test@example.com',
      brand: 'MG',
      model: 'MG ZS',
      carteGrise: 'TU 1234 0125',
      adresse: 'Le Bardo, Tunis',
      product: 'Alternateur × 1 (Pièces Électriques)',
      message: 'Ligne de test — vous pouvez la supprimer',
      source: 'TEST (éditeur Apps Script)',
      subject: 'Commande'
    }
  };
  var out = doPost(fake);
  Logger.log(out.getContent());
}

// ═══════════════ Fonctions internes ═══════════════

function getSheet_() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  return ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
}

function ensureHeader_(sheet) {
  if (sheet.getLastRow() > 0) {
    var current = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
    // Pas notre en-tête (feuille personnalisée) → on n'y touche pas
    if (current[0] !== HEADERS[0]) return;
    // En-tête déjà à jour
    if (current[HEADERS.length - 1] === HEADERS[HEADERS.length - 1]) return;
  }
  var range = sheet.getRange(1, 1, 1, HEADERS.length);
  range.setValues([HEADERS]);
  try {
    range.setFontWeight('bold').setBackground('#E30613').setFontColor('#FFFFFF');
    sheet.setFrozenRows(1);
  } catch (ignore) {}
}

function readParams_(e) {
  var p = {};
  if (e && e.parameter) {
    for (var k in e.parameter) p[k] = e.parameter[k];
  }
  // Support optionnel d'un envoi JSON
  if (e && e.postData && e.postData.contents && e.postData.type &&
      e.postData.type.indexOf('json') !== -1) {
    try {
      var parsed = JSON.parse(e.postData.contents);
      for (var key in parsed) {
        if (p[key] === undefined) p[key] = parsed[key];
      }
    } catch (ignore) {}
  }
  return p;
}

function clean_(value) {
  if (value === null || value === undefined) return '';
  return String(value).trim().substring(0, MAX_LEN);
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
