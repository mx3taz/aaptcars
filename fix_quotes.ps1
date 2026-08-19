$filePath = "c:\Users\TASSNIM\Desktop\aapt-main\js\products.js"
$content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

# Fix unescaped quotes in the newly added descriptions
$replacements = @(
    "d'origine",
    "d'autres",
    "d'échappement",
    "d'amortisseur",
    "d'embrayage",
    "l'habitacle",
    "l'industrie",
    "aujourd'hui",
    "l'air"
)

foreach ($word in $replacements) {
    # Replace the word, ensuring it's not already escaped
    # We can just do a simple replacement of the exact word with an escaped quote
    $escapedWord = $word.Replace("'", "\'")
    $content = $content.Replace($word, $escapedWord)
}

# In 'products' array, we used single quotes to wrap items in the JSON:
# "prod": "['Qualité d\\'origine ...']"
# Wait, the arrays in the JSON used single quotes for the strings:
# "['Large choix de marques reconnues pour tous types de véhicules.', 'Compatibilité garantie avec les modèles les plus populaires en Tunisie.', 'Qualité certifiée et produits d''origine ou équivalents OEM.', 'Stock permanent et livraison rapide en Tunisie.', 'Conseil technique et accompagnement personnalisé.']"
# If the products array has unescaped single quotes inside the single-quoted strings, that's also a syntax error!
# Let's just fix the known ones.
$content = $content.Replace("d''origine", "d\'origine")

# Save back
[System.IO.File]::WriteAllText($filePath, $content, [System.Text.Encoding]::UTF8)
Write-Host "Quotes fixed!"
