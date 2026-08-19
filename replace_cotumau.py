#!/usr/bin/env python3
"""
Smart replacement script for products.js
Replaces all Cotumau-specific content with AAPT (Asian Auto Parts Tunisia) content.

AAPT Profile (from Facebook):
- Full name: Asian Auto Parts Tunisia
- Short: AAPT
- Location: Le Bardo, Tunisia
- Specialization: Pièces Auto de Haute Qualité (focus on Asian brands like MG)
- Services: Vente en Gros & Détail
- Values: Prix compétitifs, Livraison rapide
"""

import re

INPUT_FILE = '/home/mayb/Desktop/aapt/js/products.js'
OUTPUT_FILE = '/home/mayb/Desktop/aapt/js/products.js'
BACKUP_FILE = '/home/mayb/Desktop/aapt/js/products.js.bak'

# Read file
with open(INPUT_FILE, 'r', encoding='utf-8') as f:
    content = f.read()

# Save backup
with open(BACKUP_FILE, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Original file size: {len(content)} bytes")
print(f"Backup saved to: {BACKUP_FILE}")

# ============================================================
# REPLACEMENT RULES (order matters - most specific first)
# ============================================================

replacements = [
    # --- 1. COTUMAU URLs and emails ---
    ('www.cotumau.com', 'www.aapt.tn'),
    ('cotumau.com', 'aapt.tn'),
    ('contact@cotumau.com', 'contact@aapt.tn'),
    
    # --- 2. Specific legacy/history claims (Cotumau founded 1972, 50+ years) ---
    # "Depuis 1972" variations
    ('Depuis 1972', 'Forts de notre expertise'),
    ('depuis 1972', 'forts de notre expertise'),
    ('Depuis plus de 50 ans', 'Forts de notre expertise'),
    ('depuis plus de 50 ans', 'forts de notre expertise'),
    ('Depuis plus de50 ans', 'Forts de notre expertise'),
    ('depuis plus de50 ans', 'forts de notre expertise'),
    ('Depuis plus decinq décennies', 'Forts de notre expertise'),
    ('Plus de 50 ans d\\\'expérience', 'Une expertise reconnue'),
    ('plus de 50 ans d\\\'expérience', 'une expertise reconnue'),
    ('Plus de50 ans d\\\'expérience', 'Une expertise reconnue'),
    ('plus de50 ans d\\\'expérience', 'une expertise reconnue'),
    ("Plus de 50 ans d\u2019expérience", "Une expertise reconnue"),
    ("plus de 50 ans d\u2019expérience", "une expertise reconnue"),
    ("Plus de50 ans d\u2019expérience", "Une expertise reconnue"),
    ("plus de50 ans d\u2019expérience", "une expertise reconnue"),
    
    # "50 ans" standalone variations
    ('50 ans d\\\'expérience', 'notre expertise'),
    ("50 ans d\u2019expérience", "notre expertise"),
    ('50 ans d\\\'expertise', 'notre expertise'),
    ("50 ans d\u2019expertise", "notre expertise"),
    ('50 ans', 'plusieurs années'),
    
    # "5 décennies" variations
    ('Plus de 5 décennies d\\\'expérience', 'Forts de notre expertise'),
    ("Plus de 5 décennies d\u2019expérience", "Forts de notre expertise"),
    ('Plus de5 décennies d\\\'expérience', 'Forts de notre expertise'),
    ("Plus de5 décennies d\u2019expérience", "Forts de notre expertise"),
    ('5 décennies', 'plusieurs années'),
    ('cinq décennies', 'plusieurs années'),
    
    # "depuis 1972" at end of taglines
    ('depuis 1972.', '.'),
    ('depuis 1972', ''),
    
    # --- 3. Company name replacements (all case variants) ---
    # "Chez COTUMAU" (with various spacing)
    ('ChezCOTUMAU', 'Chez AAPT'),
    ('Chez COTUMAU', 'Chez AAPT'),
    ('chez COTUMAU', 'chez AAPT'),
    ('chezCOTUMAU', 'chez AAPT'),
    # "Chez Vitre" was a copy mistake - product name used as company name
    ('Chez Vitre', 'Chez AAPT'),
    ('Pourquoi choisir Vitre', 'Pourquoi choisir AAPT'),
    
    # Tagline patterns
    ('COTUMAU – La référence en pièces automobiles en Tunisie.', 'AAPT – Votre spécialiste en pièces automobiles en Tunisie.'),
    ('COTUMAU – Votre partenaire pour tous vos rétroviseurs en Tunisie.', 'AAPT – Votre partenaire pour tous vos rétroviseurs en Tunisie.'),
    ('COTUMAU – Votre partenaire de confiance pour les pièces automobiles en Tunisie.', 'AAPT – Votre partenaire de confiance pour les pièces automobiles en Tunisie.'),
    ('COTUMAU – Votre expert en pièces détachées automobiles', 'AAPT – Votre expert en pièces détachées automobiles'),
    ('COTUMAU – La référence en pièces détachées automobiles en Tunisie', 'AAPT – Votre spécialiste en pièces détachées automobiles en Tunisie'),
    ('COTUMAU – Votre partenaire en pièces de rechange automobiles', 'AAPT – Votre partenaire en pièces de rechange automobiles'),
    
    # "Expertise COTUMAU" 
    ('Expertise COTUMAU', 'Expertise AAPT'),
    ('expertise COTUMAU', 'expertise AAPT'),
    
    # All remaining COTUMAU/Cotumau/cotumau
    ('COTUMAU', 'AAPT'),
    ('Cotumau', 'AAPT'),
    ('cotumau', 'AAPT'),
    
    # --- 4. "Leader" claims (too strong for a newer company) ---
    ('leader dans la distribution', 'spécialiste de la distribution'),
    ('Leader dans la vente', 'Spécialiste de la vente'),
    ('leader tunisien dans la distribution', 'spécialiste de la distribution'),
    ('leader tunisien de la distribution', 'spécialiste de la distribution'),
    ('leader de la distribution', 'spécialiste de la distribution'),
    ("s\\'impose comme unleader", "est votre partenaire"),
    ("s\\'impose comme un acteur majeur", "est un acteur de confiance"),
    ("s\\&#039;impose comme unleader tunisien", "est votre partenaire de confiance"),
    ("s\u2019impose comme unleader tunisien", "est votre partenaire de confiance"),
    ("s\u2019impose comme unleader", "est votre partenaire"),
    ("s\u2019impose comme un acteur majeur", "est un acteur de confiance"),
    ('le leader tunisien', 'votre partenaire de confiance'),
    ('un leader du marché tunisien', 'un acteur de confiance du marché tunisien'),
    ('lepartenaire de confiance des grossistes et professionnels', 'le partenaire de confiance des professionnels'),
    
    # --- 5. European brand emphasis → Asian brand emphasis ---
    # Brand lists that prominently feature European brands
    # "Peugeot, Citroën, Renault, Volkswagen, Fiat, Toyota, Hyundai, Kia"
    # → Replace with Asian-focused list
    ('Peugeot, Citroën, Renault, Volkswagen, Fiat, Toyota, Hyundai, Kia, Ford, Nissan, Opel, et bien d\\\'autres', 'MG, Geely, Chery, Haval, Toyota, Hyundai, Kia, Nissan, Suzuki, Honda, et bien d\\\'autres'),
    ("Peugeot, Citroën, Renault, Volkswagen, Fiat, Toyota, Hyundai, Kia, Ford, Nissan, Opel, et bien d\u2019autres", "MG, Geely, Chery, Haval, Toyota, Hyundai, Kia, Nissan, Suzuki, Honda, et bien d\u2019autres"),
    ('Peugeot, Citroën, Renault, Volkswagen, Fiat, Toyota, Hyundai, Kia, etc.', 'MG, Geely, Chery, Haval, Toyota, Hyundai, Kia, Nissan, Suzuki, Honda, etc.'),
    ('Renault, Peugeot, Citroën, Volkswagen, Fiat, Hyundai, Kia, Toyota, Nissan, et bien d\\\'autres', 'MG, Geely, Chery, Haval, Toyota, Hyundai, Kia, Nissan, Suzuki, Honda, et bien d\\\'autres'),
    ("Renault, Peugeot, Citroën, Volkswagen, Fiat, Hyundai, Kia, Toyota, Nissan, et bien d\u2019autres", "MG, Geely, Chery, Haval, Toyota, Hyundai, Kia, Nissan, Suzuki, Honda, et bien d\u2019autres"),
    ('Peugeot, Renault, Toyota, Nissan, Fiat, et bien d\\\'autres encore', 'MG, Geely, Chery, Haval, Toyota, Hyundai, Kia, et bien d\\\'autres encore'),
    ("Peugeot, Renault, Toyota, Nissan, Fiat, et bien d\u2019autres encore", "MG, Geely, Chery, Haval, Toyota, Hyundai, Kia, et bien d\u2019autres encore"),
    ('Peugeot,Citroën,Renault,Volkswagen,Fiat,Ford,Toyota,Hyundai,Kia, et bien d\\\'autres', 'MG, Geely, Chery, Haval, Toyota, Hyundai, Kia, Nissan, Suzuki, Honda, et bien d\\\'autres'),
    ("Peugeot,Citroën,Renault,Volkswagen,Fiat,Ford,Toyota,Hyundai,Kia, et bien d\u2019autres", "MG, Geely, Chery, Haval, Toyota, Hyundai, Kia, Nissan, Suzuki, Honda, et bien d\u2019autres"),
    ('Peugeot, Citroën, Renault, Volkswagen, Toyota, Hyundai, Kia, et bien d\\\'autres', 'MG, Geely, Chery, Haval, Toyota, Hyundai, Kia, et bien d\\\'autres'),
    ("Peugeot, Citroën, Renault, Volkswagen, Toyota, Hyundai, Kia, et bien d\u2019autres", "MG, Geely, Chery, Haval, Toyota, Hyundai, Kia, et bien d\u2019autres"),
    ('Peugeot, Citroën, Renault, Volkswagen, Fiat, Toyota, Volkswagen, etc.', 'MG, Geely, Chery, Haval, Toyota, Hyundai, Kia, etc.'),
    
    # Tambour de frein specific
    ('(Peugeot, Renault, Citroën, Fiat, Toyota, Volkswagen, etc.)', '(MG, Geely, Chery, Haval, Toyota, Hyundai, Kia, Nissan, etc.)'),
    
    # Condenseur specific  
    ('Peugeot, Citroën, Renault, Volkswagen, Fiat, Toyota, Hyundai, Kia, Ford, Nissan, et bien d\\\'autres', 'MG, Geely, Chery, Haval, Toyota, Hyundai, Kia, Nissan, Suzuki, Honda, et bien d\\\'autres'),
    ("Peugeot, Citroën, Renault, Volkswagen, Fiat, Toyota, Hyundai, Kia, Ford, Nissan, et bien d\u2019autres", "MG, Geely, Chery, Haval, Toyota, Hyundai, Kia, Nissan, Suzuki, Honda, et bien d\u2019autres"),
    
    # Radiateur moteur specific
    ('Peugeot, Citroën, Renault, Volkswagen, Toyota, Hyundai, Kia, Nissan', 'MG, Geely, Chery, Haval, Toyota, Hyundai, Kia, Nissan'),

    # Vase d'eau specific
    ('Renault, Peugeot, Citroën, Volkswagen, Fiat, Hyundai, Kia, Toyota, Nissan', 'MG, Geely, Chery, Haval, Toyota, Hyundai, Kia, Nissan'),
    
    # Bullet-point brand lists in parechoc
    ('• Renault<br>• Peugeot<br>• Citroën<br>• Volkswagen<br>• Toyota<br>• Hyundai<br>• Kia<br>• Nissan<br>• Ford<br>• Et bien d\\\'autres.', '• MG<br>• Geely<br>• Chery<br>• Haval<br>• Toyota<br>• Hyundai<br>• Kia<br>• Nissan<br>• Suzuki<br>• Et bien d\\\'autres.'),
    ("• Renault<br>• Peugeot<br>• Citroën<br>• Volkswagen<br>• Toyota<br>• Hyundai<br>• Kia<br>• Nissan<br>• Ford<br>• Et bien d\u2019autres.", "• MG<br>• Geely<br>• Chery<br>• Haval<br>• Toyota<br>• Hyundai<br>• Kia<br>• Nissan<br>• Suzuki<br>• Et bien d\u2019autres."),
    
    # Duplicated brand lines in parechoc (plain text without bullets)
    ('Renault<br><br>Peugeot<br><br>Citroën<br><br>Volkswagen<br><br>Toyota<br><br>Hyundai<br><br>Kia<br><br>Nissan<br><br>Ford<br><br>Et bien d\\\'autres.', 'MG<br><br>Geely<br><br>Chery<br><br>Haval<br><br>Toyota<br><br>Hyundai<br><br>Kia<br><br>Nissan<br><br>Suzuki<br><br>Et bien d\\\'autres.'),
    ("Renault<br><br>Peugeot<br><br>Citroën<br><br>Volkswagen<br><br>Toyota<br><br>Hyundai<br><br>Kia<br><br>Nissan<br><br>Ford<br><br>Et bien d\u2019autres.", "MG<br><br>Geely<br><br>Chery<br><br>Haval<br><br>Toyota<br><br>Hyundai<br><br>Kia<br><br>Nissan<br><br>Suzuki<br><br>Et bien d\u2019autres."),
    
    # Products array brand items
    ("'Renault'", "'MG'"),
    ("'Peugeot'", "'Geely'"),
    ("'Citroën'", "'Chery'"),
    ("'Volkswagen'", "'Haval'"),
    ("'Ford'", "'Suzuki'"),
    
    # Feu clignotant: "Renault, Peugeot, Hyundai, Volkswagen"
    ('Renault, Peugeot, Hyundai, Volkswagen', 'MG, Geely, Chery, Hyundai'),
    
    # Porte charbons: "Renault, Peugeot, Fiat, Volkswagen"
    ('Renault, Peugeot, Fiat, Volkswagen', 'MG, Geely, Chery, Haval'),
    
    # Triangle/bras: "Peugeot, Citroën, Renault, Volkswagen, Fiat, Toyota, Hyundai, Kia"
    ('Peugeot, Citroën, Renault, Volkswagen, Fiat, Toyota, Hyundai, Kia', 'MG, Geely, Chery, Haval, Toyota, Hyundai, Kia, Nissan'),
    
    # "européenne, asiatique ou américaine" → "asiatique"
    ('européenne, asiatique ou américaine', 'asiatique'),
    ('européens, asiatiques et américains', 'asiatiques'),
    ('européens, asiatiques et tunisiens', 'asiatiques'),
    ('européennes, asiatiques, et américaines', 'asiatiques'),
    ('européennes, asiatiques et américaines', 'asiatiques'),
    ('(européennes, asiatiques, et américaines)', ''),
    ('(européennes, asiatiques et américaines)', ''),
    
    # Bras de suspension specific: "Peugeot, Citroën, Renault, Volkswagen, Fiat, Toyota, Hyundai, Kia, etc."
    # already handled above
    
    # --- 6. "Distributeur officiel" → more neutral ---
    ('Distributeur officiel de pièces de rechange en Tunisie', 'Votre spécialiste en pièces de rechange en Tunisie'),
    ('distributeur officiel', 'spécialiste'),
    
    # --- 7. Fondée en 1972 ---
    ('Fondée en1972,', ''),
    ('Fondée en 1972,', ''),
    ('fondée en 1972', ''),
    
    # --- 8. "Expertise depuis plus de 50 ans" → generic ---
    ('Expertise depuis plus de 50 ans', 'Expertise reconnue'),
    ('🏆Expertise depuis plus de 50 ans', '🏆Expertise reconnue'),
    ('🏆50 ans d\\\'expertise', '🏆Expertise reconnue'),
    ("🏆50 ans d\u2019expertise", "🏆Expertise reconnue"),
    
    # --- 9. "cotumau.com" references in closing lines ---
    ('surcotumau.com', 'sur notre site'),
    ('sur cotumau.com', 'sur notre site'),
    ('🌐www.cotumau.com', ''),
    ('🌐www.aapt.tn', ''),
    ('✉️contact@cotumau.com', ''),
    ('✉️contact@aapt.tn', ''),
    ('📧contact@cotumau.com', ''),
    ('📧contact@aapt.tn', ''),
]

# Apply all replacements
count = 0
for old, new in replacements:
    if old in content:
        occurrences = content.count(old)
        content = content.replace(old, new)
        count += occurrences
        print(f"  Replaced '{old[:60]}...' → '{new[:60]}...' ({occurrences}x)")

print(f"\nTotal replacements made: {count}")

# --- REGEX-BASED CLEANUP ---

# Clean up double spaces that may have been introduced
content = re.sub(r'  +', ' ', content)

# Clean up empty <br> sequences that may be left
content = re.sub(r'(<br>){3,}', '<br><br>', content)

# Clean up leading/trailing spaces in strings
# Fix "Chez  AAPT" → "Chez AAPT"
content = content.replace('Chez  AAPT', 'Chez AAPT')
content = content.replace('chez  AAPT', 'chez AAPT')

# Clean up leftover "depuis " with nothing after it at sentence boundaries
content = re.sub(r'depuis\s*\.', '.', content)
content = re.sub(r'depuis\s*,', ',', content)

# Write output
with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"\nOutput written to: {OUTPUT_FILE}")
print(f"New file size: {len(content)} bytes")

# ============================================================
# VERIFICATION: Check for any remaining Cotumau references
# ============================================================
print("\n" + "="*60)
print("VERIFICATION: Scanning for remaining Cotumau references...")
print("="*60)

remaining = []
for i, line in enumerate(content.split('\n'), 1):
    lower = line.lower()
    if 'cotumau' in lower:
        remaining.append((i, line.strip()[:120]))
    if 'cotumau.com' in lower:
        remaining.append((i, f"[URL] {line.strip()[:120]}"))
    if '1972' in line:
        remaining.append((i, f"[YEAR] {line.strip()[:120]}"))
    # Check for "50 ans" still present
    if '50 ans' in lower and 'aapt' not in lower:
        remaining.append((i, f"[50ANS] {line.strip()[:120]}"))

if remaining:
    print(f"\n⚠️  Found {len(remaining)} remaining references:")
    for lineno, text in remaining:
        print(f"  Line {lineno}: {text}")
else:
    print("\n✅ No remaining Cotumau/1972/50ans references found! All clean.")

# Verify JS syntax is still valid (basic check)
print("\n" + "="*60)
print("SYNTAX CHECK: Verifying JavaScript string integrity...")
print("="*60)

# Count quotes to make sure they're balanced
single_quotes = content.count("'")
if single_quotes % 2 == 0:
    print(f"✅ Single quotes balanced: {single_quotes}")
else:
    print(f"⚠️  Single quotes may be unbalanced: {single_quotes}")

# Check that the file starts and ends correctly
if content.strip().startswith('const productDetails = {'):
    print("✅ File starts correctly")
else:
    print("⚠️  File start doesn't match expected pattern")

if content.strip().endswith('};'):
    print("✅ File ends correctly")
else:
    print("⚠️  File end doesn't match expected pattern")

print("\n🎉 Done! Products.js has been updated with AAPT branding.")
