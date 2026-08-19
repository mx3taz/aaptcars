import json
import re

def main():
    missing_keys = [
        'plaquette-de-frein', 'machoire-de-frein', 'disque-de-frein', 'tambour-de-frein',
        'cylindre-de-roue', 'maitre-cylindre', 'radiateur-moteur', 'radiateur-turbo',
        'radiateur-chauffage', 'compresseur', 'condenseur', 'thermostat', 'durite', 'vase-deau'
    ]

    with open('scraped_final.json', 'r', encoding='utf-8') as f:
        scraped_data = json.load(f)

    with open('js/products.js', 'r', encoding='utf-8') as f:
        raw_js = f.read()

    new_objects = []
    
    # Let's organize them into categories for better structure
    freinage_keys = ['plaquette-de-frein', 'machoire-de-frein', 'disque-de-frein', 'tambour-de-frein', 'cylindre-de-roue', 'maitre-cylindre']
    refroidissement_keys = ['radiateur-moteur', 'radiateur-turbo', 'radiateur-chauffage', 'compresseur', 'condenseur', 'thermostat', 'durite', 'vase-deau']
    
    def create_obj_str(key, category_comment=None):
        if key not in scraped_data:
            return ""
        
        full_html_desc = scraped_data[key]
        
        bullet_points = []
        lines = full_html_desc.split('<br>')
        for line in lines:
            line_stripped = line.strip()
            if line_stripped.startswith('•') or line_stripped.startswith('✅') or line_stripped.startswith('🔹'):
                point = re.sub(r'^[•✅🔹]\s*', '', line_stripped)
                point = re.sub(r'<[^>]+>', '', point).strip()
                if point and point not in bullet_points:
                    bullet_points.append(point)

        escaped_desc = full_html_desc.replace("'", "\\'").replace("\n", "")
        products_str = ", ".join([f"'{p.replace('`', '').replace(chr(39), chr(92)+chr(39))}'" for p in bullet_points])
        
        title = key.replace('-', ' ').title()
        if key == 'vase-deau': title = "Vase d'eau"
        if key == 'maitre-cylindre': title = 'Maître-cylindre'
        if key == 'radiateur-moteur': title = 'Radiateur Moteur'
        
        res = ""
        if category_comment:
            res += f"\n    // {category_comment}\n"
        
        res += f"    '{key}': {{\n"
        res += f"        title: '{title}',\n"
        res += f"        description: '{escaped_desc}',\n"
        res += f"        products: [{products_str}],\n"
        res += f"        images: []\n"
        res += f"    }}"
        return res

    parts = []
    for i, key in enumerate(freinage_keys):
        comment = "SYSTÈME DE FREINAGE" if i == 0 else None
        parts.append(create_obj_str(key, comment))
        
    for i, key in enumerate(refroidissement_keys):
        comment = "SYSTÈME DE REFROIDISSEMENT" if i == 0 else None
        parts.append(create_obj_str(key, comment))

    append_str = ",\n" + ",\n".join(parts) + "\n};\n"
    
    # insert before last "};"
    if "};" in raw_js:
        last_index = raw_js.rfind("};")
        new_js = raw_js[:last_index] + append_str
        
        with open('js/products.js', 'w', encoding='utf-8') as f:
            f.write(new_js)
        print("Successfully appended missing categories.")
    else:
        print("Could not find end of products.js")

if __name__ == '__main__':
    main()
