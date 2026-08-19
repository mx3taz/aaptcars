import json
import re

def main():
    with open('scraped_final.json', 'r', encoding='utf-8') as f:
        scraped_data = json.load(f)

    with open('js/products.js', 'r', encoding='utf-8') as f:
        raw_js = f.read()

    # Define the exact order of keys per category
    categories = {
        'Carrosseries & Éclairages': [
            'parechoc', 'porte-et-capot', 'ailes-et-panneaux', 'retroviseur', 
            'vitre', 'optique-avant', 'feu-arriere', 'feu-clignotant', 'antibrouillard'
        ],
        'Pièces Électriques': [
            'alternateur', 'demarreur', 'bendix-demarreur', 'rotor', 'stator', 
            'bobine-allumage', 'fils-bougie', 'pompe-a-essence', 'sonde-lambda', 
            'jeu-de-charbons', 'porte-charbons'
        ],
        'Pièces Moteur': [
            'kit-chaine-de-distribution', 'pompe-a-eau', 'pompe-a-huile', 
            'culasse-et-soupapes', 'radiateur', 'vanne-egr', 'chemise-piston', 
            'jeu-de-segment', 'arbre-a-came'
        ],
        'Suspension & Direction': [
            'amortisseur', 'roulement-de-roue', 'cardan-tete-de-cardan', 
            'triangle-suspension-roue', 'toc-amortisseur', 'bras-de-suspension', 
            'rotule-de-direction', 'cremaillere'
        ],
        'Embrayage & Boîte de Vitesse': [
            'kit-embrayage', 'disque-embrayage', 'plateau-dembrayage', 
            'emetteur-dembrayage', 'recepteur-dembrayage', 'cable-de-vitesse-et-dembrayage', 
            'butee-embrayage', 'volant-moteur'
        ],
        'Système de Filtration': [
            'filtre-a-air', 'filtre-a-huile', 'filtre-a-carburant', 'filtre-habitacle'
        ],
        'Système de Freinage': [
            'plaquette-de-frein', 'machoire-de-frein', 'disque-de-frein', 
            'tambour-de-frein', 'cylindre-de-roue', 'maitre-cylindre'
        ],
        'Système de Refroidissement': [
            'radiateur-moteur', 'radiateur-turbo', 'radiateur-chauffage', 
            'compresseur', 'condenseur', 'thermostat', 'durite', 'vase-deau'
        ]
    }

    # Extract images for each key from raw_js
    images_map = {}
    for cat_keys in categories.values():
        for key in cat_keys:
            # Match the key block and extract the images array
            # Regex to match: 'key' : { ... images: [ ... ] }
            pattern = re.compile(rf"('{key}'|\"{key}\"|{key})\s*:\s*{{.*?images:\s*(\[.*?\])", re.IGNORECASE | re.DOTALL)
            match = pattern.search(raw_js)
            if match:
                images_map[key] = match.group(2)
            else:
                images_map[key] = "[]"
                print(f"Warning: images not found for {key}")

    new_js = "const productDetails = {\n"
    
    first_cat = True
    for cat_name, keys in categories.items():
        if not first_cat:
            new_js += ",\n"
        new_js += f"    // {cat_name.upper()}\n"
        
        first_key = True
        for key in keys:
            if not first_key:
                new_js += ",\n"
            
            # Find the scraped data key
            scrape_key = key
            if key == 'vanne-egr': scrape_key = 'vanne-erg'
            if key == 'filtre-a-carburant': scrape_key = 'filtre-a-carburan'
            if key == 'ailes-et-panneaux': scrape_key = 'ailes-et-panneaux-lateraux'

            desc_html = scraped_data.get(scrape_key, "")
            
            bullet_points = []
            if desc_html:
                for line in desc_html.split('<br>'):
                    line_stripped = line.strip()
                    if line_stripped.startswith('•') or line_stripped.startswith('✅') or line_stripped.startswith('🔹'):
                        point = re.sub(r'^[•✅🔹]\s*', '', line_stripped)
                        point = re.sub(r'<[^>]+>', '', point).strip()
                        if point and point not in bullet_points:
                            bullet_points.append(point)
                            
            escaped_desc = desc_html.replace("'", "\\'").replace("\n", "")
            products_str = ", ".join([f"'{p.replace(chr(39), chr(92)+chr(39))}'" for p in bullet_points])
            
            title = key.replace('-', ' ').title()
            if key == 'vase-deau': title = "Vase d'eau"
            if key == 'maitre-cylindre': title = 'Maître-cylindre'
            if key == 'radiateur-moteur': title = 'Radiateur Moteur'
            if key == 'porte-et-capot': title = 'Porte et Capot'
            if key == 'ailes-et-panneaux': title = 'Ailes et Panneaux Latéraux'
            
            new_js += f"    '{key}': {{\n"
            new_js += f"        title: \"{title}\",\n"
            new_js += f"        description: '{escaped_desc}',\n"
            new_js += f"        products: [{products_str}],\n"
            new_js += f"        images: {images_map[key]}\n"
            new_js += f"    }}"
            first_key = False
        first_cat = False

    new_js += "\n};\n"
    
    with open('js/products_fixed.js', 'w', encoding='utf-8') as f:
        f.write(new_js)
    print("Reconstruction complete!")

if __name__ == '__main__':
    main()
