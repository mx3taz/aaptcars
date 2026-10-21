/**
 * Google Apps Script — AAPT Le Coin MG
 * Formulaire Unique de Commande & Devis → Google Sheets
 *
 * ═══════════════════════════════════════════════════
 *  CONFIGURATION DU GOOGLE SHEET
 * ═══════════════════════════════════════════════════
 *
 *  Colonnes enregistrées dans la feuille (11 colonnes) :
 *  1. Date / Heure
 *  2. Nom Complet
 *  3. Téléphone
 *  4. Email
 *  5. Marque du Véhicule
 *  6. Modèle du Véhicule
 *  7. N° Carte Grise
 *  8. Adresse de Livraison
 *  9. Produit(s) Commandé(s)
 *  10. Message
 *  11. Source (Commande Panier / Commande Directe / Contact)
 *
 *  NOTE : Si votre feuille est vide, la première ligne avec les titres
 *  ci-dessus sera créée automatiquement lors de la première commande !
 */

// ⚠️ Identifiant de votre Google Sheet
var SHEET_ID = '11XE-KMXAEmg2bWJiOoPTiAjqHUxNs7ICflKBUIk3p5w';

function getSheet() {
  if (SHEET_ID && SHEET_ID !== 'YOUR_SPREADSHEET_ID_HERE') {
    return SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
  }
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (ss) return ss.getActiveSheet();
  throw new Error('SHEET_ID non configuré. Ouvrez google-apps-script.gs et vérifiez votre identifiant Google Sheet.');
}

function doPost(e) {
  try {
    var sheet = getSheet();

    // Récupération des données (FormData ou JSON)
    var p = (e && e.parameter) ? e.parameter : {};
    if (e && e.postData && e.postData.contents) {
      try {
        var parsed = JSON.parse(e.postData.contents);
        for (var k in parsed) {
          if (!p[k]) p[k] = parsed[k];
        }
      } catch (err) {}
    }

    var timestamp  = p.timestamp  || new Date().toLocaleString('fr-FR');
    var name       = p.name       || '';
    var phone      = p.phone      || '';
    var email      = p.email      || '';
    var brand      = p.brand      || '';
    var model      = p.model      || '';
    var carteGrise = p.carteGrise || '';
    var adresse    = p.adresse    || '';
    var product    = p.product    || '';
    var message    = p.message    || '';
    var source     = p.source     || 'Commande';

    // Si la feuille est vierge, créer automatiquement la ligne d'en-tête stylisée
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
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
        'Source'
      ]);
      try {
        var headerRange = sheet.getRange(1, 1, 1, 11);
        headerRange.setFontWeight('bold');
        headerRange.setBackground('#E30613');
        headerRange.setFontColor('#FFFFFF');
        sheet.setFrozenRows(1);
      } catch (hErr) {}
    }

    // Ajout de la commande dans la feuille
    sheet.appendRow([
      timestamp,
      name,
      phone,
      email,
      brand,
      model,
      carteGrise,
      adresse,
      product,
      message,
      source
    ]);

    // Réponse de succès
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success', message: 'Commande enregistrée avec succès' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success', message: 'API AAPT Le Coin MG connectée et opérationnelle' }))
    .setMimeType(ContentService.MimeType.JSON);
}
