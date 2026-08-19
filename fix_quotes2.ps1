$filePath = "c:\Users\TASSNIM\Desktop\aapt-main\js\products.js"
$content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

$replacements = @(
    "d'oxygène",
    "d'ajuster"
)

foreach ($word in $replacements) {
    $escapedWord = $word.Replace("'", "\'")
    $content = $content.Replace($word, $escapedWord)
}

[System.IO.File]::WriteAllText($filePath, $content, [System.Text.Encoding]::UTF8)
Write-Host "Missed quotes fixed!"
