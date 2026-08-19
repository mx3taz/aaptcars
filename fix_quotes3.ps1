$filePath = "c:\Users\TASSNIM\Desktop\aapt-main\js\products.js"
$content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

$replacements = @(
    "d'une",
    "d'expertise"
)

foreach ($word in $replacements) {
    # Replace only if not already escaped
    # To be safe, we can regex replace "(?<!\\)d'une" but PowerShell regex might be tricky.
    # Let's just do literal replace and then fix double escapes just in case
    $escapedWord = $word.Replace("'", "\'")
    $content = $content.Replace($word, $escapedWord)
    
    # Fix potential double escapes
    $doubleEscaped = $word.Replace("'", "\\'")
    $content = $content.Replace($doubleEscaped, $escapedWord)
}

[System.IO.File]::WriteAllText($filePath, $content, [System.Text.Encoding]::UTF8)
Write-Host "Rebranding quotes fixed!"
