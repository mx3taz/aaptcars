from bs4 import BeautifulSoup
import json

with open('cotumau_products.html', 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

products_dict = {}

# The products are inside elements that contain the categories.
# In the screenshot, we see categories like "CARROSSERIES & ÉCLAIRAGES"
# Let's find all links.
links = soup.find_all('a', href=True)
product_urls = []
for a in links:
    href = a['href']
    if 'cotumau.com/' in href and href != 'https://cotumau.com/nos-produits/':
        # typically product links don't have many slashes
        if href.count('/') == 4 and 'category' not in href and 'tag' not in href:
            text = a.get_text(strip=True)
            if text:
                product_urls.append((text, href))

# Remove duplicates
seen = set()
unique_urls = []
for t, h in product_urls:
    if h not in seen:
        seen.add(h)
        unique_urls.append((t, h))

for t, h in unique_urls:
    print(t, h)

