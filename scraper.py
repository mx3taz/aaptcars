import requests
from bs4 import BeautifulSoup
import json
import time

url = "https://cotumau.com/nos-produits/"
response = requests.get(url)
soup = BeautifulSoup(response.text, 'html.parser')

product_links = []
# Assuming the products are in links
for a in soup.find_all('a', href=True):
    href = a['href']
    if 'cotumau.com/' in href and href != url and href not in product_links:
        # Check if it looks like a product link. They are usually under categories.
        pass

# Let's just find the accordion or grid that holds the products.
# Looking at the website, the categories are probably in a grid.
print("Fetched HTML length:", len(response.text))
with open('cotumau_products.html', 'w', encoding='utf-8') as f:
    f.write(response.text)

