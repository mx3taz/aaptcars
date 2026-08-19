/**
 * Google Apps Script — AAPT Le Coin MG
 * Receives form submissions and writes them to a Google Sheet
 *
 * SETUP INSTRUCTIONS:
 * 1. Go to https://sheets.google.com and create a new spreadsheet
 * 2. Name it "AAPT - Demandes Clients"
 * 3. In Row 1, add these headers:
 *    Timestamp | Nom | Téléphone | Produit | Message | Source | Marque | Adresse
 * 4. Go to Extensions → Apps Script
 * 5. Delete any existing code and paste this entire file
 * 6. Click Deploy → New deployment
 * 7. Select type: Web app
 * 8. Set "Execute as" → Me
 * 9. Set "Who has access" → Anyone
 * 10. Click Deploy and copy the URL
 * 11. Paste the URL into js/main.js → GOOGLE_SCRIPT_URL constant
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Parse form data
    var timestamp = e.parameter.timestamp || new Date().toLocaleString('fr-FR');
    var name = e.parameter.name || '';
    var phone = e.parameter.phone || '';
    var product = e.parameter.product || '';
    var message = e.parameter.message || '';
    var source = e.parameter.source || '';
    var brand = e.parameter.brand || '';
    var adresse = e.parameter.adresse || '';

    // Append row to spreadsheet
    sheet.appendRow([
      timestamp,
      name,
      phone,
      product,
      message,
      source,
      brand,
      adresse
    ]);

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success', message: 'Data saved successfully' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success', message: 'AAPT Le Coin MG API is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Optional: Send email notification when a new submission arrives
 * Uncomment and set your email address to receive notifications
 */
/*
function sendNotification(name, phone, product) {
  var email = 'YOUR_EMAIL@gmail.com';
  var subject = 'Nouvelle demande AAPT - ' + name;
  var body = 'Nouvelle demande reçue:\n\n' +
             'Nom: ' + name + '\n' +
             'Téléphone: ' + phone + '\n' +
             'Produit: ' + product + '\n\n' +
             'Consultez votre Google Sheet pour plus de détails.';

  MailApp.sendEmail(email, subject, body);
}
*/
