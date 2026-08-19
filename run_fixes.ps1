$filePath = "c:\Users\TASSNIM\Desktop\aapt-main\js\products.js"
$jsonPath = "c:\Users\TASSNIM\Desktop\aapt-main\fixes.json"

$content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)
$fixesJson = [System.IO.File]::ReadAllText($jsonPath, [System.Text.Encoding]::UTF8)

# Use regex to remove JSON comments if any, but ConvertFrom-Json requires clean JSON
$fixes = ConvertFrom-Json $fixesJson

# 1-4. Apply exact replacements
foreach ($replacePair in $fixes.exact_replaces) {
    $content = $content.Replace($replacePair[0], $replacePair[1])
}

# 5. Remove duplicated bullet content
$pattern = "(?s)description:\s*'([^']*)'"
$content = [regex]::Replace($content, $pattern, {
    param($match)
    $desc = $match.Groups[1].Value
    if ($desc -eq "") {
        return $match.Groups[0].Value
    }
    
    $parts = $desc -split '<br><br>'
    $cleanParts = @()
    $i = 0
    while ($i -lt $parts.Length) {
        $current = $parts[$i]
        $hasBullets = ($current -match '• |✅|🔹')
        
        if ($hasBullets) {
            $cleanParts += $current
            
            $bulletTexts = @()
            $bulletLines = $current -split '<br>'
            foreach ($line in $bulletLines) {
                $cleaned = $line.Trim()
                foreach ($marker in @('• ', '✅ ', '✅', '🔹 ', '🔹')) {
                    if ($cleaned.StartsWith($marker)) {
                        $cleaned = $cleaned.Substring($marker.Length)
                        break
                    }
                }
                if ($cleaned.Length -gt 5) {
                    $bulletTexts += $cleaned
                }
            }
            
            $j = $i + 1
            while ($j -lt $parts.Length) {
                $nextPart = $parts[$j].Trim()
                $isDuplicate = $false
                foreach ($bt in $bulletTexts) {
                    $compareLen = [Math]::Min(25, [Math]::Min($bt.Length, $nextPart.Length))
                    if ($compareLen -gt 5 -and $nextPart.Substring(0, $compareLen) -eq $bt.Substring(0, $compareLen)) {
                        $isDuplicate = $true
                        break
                    }
                }
                if ($isDuplicate) {
                    $j++
                } else {
                    break
                }
            }
            $i = $j
        } else {
            $cleanParts += $current
            $i++
        }
    }
    
    $newDesc = $cleanParts -join '<br><br>'
    return "description: '$newDesc'"
})


# 6. Fill empty descriptions
foreach ($key in $fixes.empty_descriptions.psobject.properties.name) {
    $data = $fixes.empty_descriptions.$key
    
    # Replace description: '' with description: 'new_desc'
    $patternDesc = "(?s)('$key':\s*\{[^}]*?description:\s*)('')"
    $content = [regex]::Replace($content, $patternDesc, "`${1}'" + $data.desc + "'")
    
    # Replace products: [] with products: [new_prods]
    $patternProd = "(?s)('$key':\s*\{[^}]*?products:\s*)(\[\])"
    $content = [regex]::Replace($content, $patternProd, "`${1}" + $data.prod)
}

# 7. Final cleanup
$lines = $content -split "`n"
$cleanedLines = @()
foreach ($line in $lines) {
    if ($line -notmatch "img/" -and $line.Trim().Length -gt 0 -and (-not $line.StartsWith("//"))) {
        $stripped = $line.TrimStart()
        $indent = $line.Substring(0, $line.Length - $stripped.Length)
        while ($stripped.Contains("  ")) {
            $stripped = $stripped.Replace("  ", " ")
        }
        $line = $indent + $stripped
    }
    $cleanedLines += $line
}
$content = $cleanedLines -join "`n"

[System.IO.File]::WriteAllText($filePath, $content, [System.Text.Encoding]::UTF8)

Write-Host "✅ All fixes applied successfully! File saved: $filePath"
