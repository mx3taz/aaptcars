import json
import re

def main():
    with open('js/products.js', 'r', encoding='utf-8') as f:
        raw_js = f.read()

    with open('scraped_final.json', 'r', encoding='utf-8') as f:
        scraped_data = json.load(f)

    result_js = raw_js

    for key, full_html_desc in scraped_data.items():
        clean_key = key
        if clean_key == 'vanne-erg':
            clean_key = 'vanne-egr'
        if clean_key == 'filtre-a-carburan':
            clean_key = 'filtre-a-carburant'
        if clean_key == 'ailes-et-panneaux-lateraux':
            clean_key = 'ailes-et-panneaux'

        bullet_points = []
        lines = full_html_desc.split('<br>')
        for line in lines:
            line_stripped = line.strip()
            if line_stripped.startswith('•') or line_stripped.startswith('✅') or line_stripped.startswith('🔹'):
                # remove the bullet prefix and any html tags
                point = re.sub(r'^[•✅🔹]\s*', '', line_stripped)
                point = re.sub(r'<[^>]+>', '', point).strip()
                if point and point not in bullet_points:
                    bullet_points.append(point)

        escaped_desc = full_html_desc.replace("'", "\\'").replace("\n", "")
        products_str = ", ".join([f"'{p.replace('`', '').replace(chr(39), chr(92)+chr(39))}'" for p in bullet_points])

        # regex to find the block
        pattern = re.compile(
            rf"('{clean_key}'|\"{clean_key}\"|{clean_key})\s*:\s*{{[^{{]*?title:\s*['\"].*?['\"],\s*description:\s*['\"].*?['\"],\s*products:\s*\[.*?\]",
            re.IGNORECASE | re.DOTALL
        )

        match = pattern.search(result_js)
        if match:
            block = match.group(0)
            
            # replace description
            block_updated = re.sub(r"description:\s*['\"].*?['\"]", f"description: '{escaped_desc}'", block, count=1, flags=re.DOTALL)
            
            # replace products
            block_updated = re.sub(r"products:\s*\[.*?\]", f"products: [{products_str}]", block_updated, count=1, flags=re.DOTALL)
            
            result_js = result_js[:match.start()] + block_updated + result_js[match.end():]
            print(f"Updated {clean_key}")
        else:
            print(f"Could not find regex match for {clean_key}")

    with open('js/products_updated.js', 'w', encoding='utf-8') as f:
        f.write(result_js)
        
    print("Done!")

if __name__ == '__main__':
    main()
