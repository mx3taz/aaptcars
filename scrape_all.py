import requests
from bs4 import BeautifulSoup
import json
import re
import time

url = "https://cotumau.com/nos-produits/"
try:
    response = requests.get(url, timeout=10)
    soup = BeautifulSoup(response.text, 'html.parser')
except Exception as e:
    print(f"Error fetching main page: {e}")
    exit(1)

# Get all product links
links = soup.find_all('a', href=True)
product_urls = []
for a in links:
    href = a['href']
    if 'cotumau.com/' in href and href != url:
        if href.count('/') == 4 and 'category' not in href and 'tag' not in href:
            text = a.get_text(strip=True)
            if text:
                product_urls.append((text, href))

# Remove duplicates
unique_urls = []
seen = set()
for t, h in product_urls:
    if h not in seen:
        seen.add(h)
        unique_urls.append((t, h))

def extract_description(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # The content is usually in elementor-widget-theme-post-content or entry-content
    content_div = soup.find('div', class_='elementor-widget-theme-post-content')
    if not content_div:
        content_div = soup.find('div', class_='entry-content')
    if not content_div:
        return ""
    
    # We want to remove social links (facebook, linkedin)
    # They are usually at the top or bottom. We can just extract text in a structured way.
    # To keep it "word by word", we'll convert paragraphs, headers and lists to a clean string with HTML tags
    # like <br> or just text with \n. Since the frontend puts it in <p>, we can use <br> for newlines
    # and <strong> for bold to simulate headers, and simple bullets for lists.
    
    # We want to remove the share buttons which are usually in an elementor widget.
    for share in content_div.find_all('div', class_='elementor-widget-share-buttons'):
        share.decompose()
        
    # We want to remove newsletter and contact footer
    # Stop processing when we hit a header containing "newsletter" or "contactez-nous" or "besoin d"
    clean_html = ""
    for elem in content_div.find_all(recursive=False):
        # some pages have sections
        if elem.name == 'section':
            # Check if this section contains the newsletter or footer
            text = elem.get_text().lower()
            if 'newsletter' in text and 'rejoignez notre communauté' in text:
                break
            if 'contactez-nous' in text or 'contactez nous' in text:
                break
            
            # Extract content from this section
            for widget in elem.find_all('div', class_='elementor-widget-container'):
                # Extract text preserving lists and headers
                for child in widget.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol']):
                    if child.name in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']:
                        text_val = child.get_text(strip=True)
                        if 'newsletter' in text_val.lower() or 'contactez-nous' in text_val.lower() or 'besoin d' in text_val.lower():
                            break
                        clean_html += f"<br><br><strong>{text_val}</strong><br>"
                    elif child.name == 'p':
                        text_val = child.get_text(strip=True)
                        if text_val:
                            clean_html += f"{text_val}<br><br>"
                    elif child.name in ['ul', 'ol']:
                        for li in child.find_all('li'):
                            li_text = li.get_text(strip=True)
                            # Remove double checkmarks if any
                            li_text = re.sub(r'^✅\s*', '✅ ', li_text)
                            if not li_text.startswith('✅') and not li_text.startswith('-'):
                                clean_html += f"• {li_text}<br>"
                            else:
                                clean_html += f"{li_text}<br>"
                        clean_html += "<br>"
        else:
            # direct elements
            if elem.name in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']:
                text_val = elem.get_text(strip=True)
                if 'newsletter' in text_val.lower() or 'contactez-nous' in text_val.lower() or 'besoin d' in text_val.lower():
                    break
                clean_html += f"<br><br><strong>{text_val}</strong><br>"
            elif elem.name == 'p':
                text_val = elem.get_text(strip=True)
                if text_val:
                    clean_html += f"{text_val}<br><br>"
            elif elem.name in ['ul', 'ol']:
                for li in elem.find_all('li'):
                    li_text = li.get_text(strip=True)
                    if not li_text.startswith('✅') and not li_text.startswith('-'):
                        clean_html += f"• {li_text}<br>"
                    else:
                        clean_html += f"{li_text}<br>"
                clean_html += "<br>"

    # Clean up excessive newlines
    clean_html = re.sub(r'(<br>\s*){3,}', '<br><br>', clean_html)
    clean_html = clean_html.replace("'", "\\'") # escape for JS
    return clean_html.strip('<br>')

results = {}
for title, href in unique_urls:
    try:
        res = requests.get(href, timeout=10)
        desc = extract_description(res.text)
        
        # We need to map to the keys used in products.js.
        # The key is usually the URL slug.
        slug = href.strip('/').split('/')[-1]
        
        results[slug] = desc
        print(f"Scraped {slug}")
    except Exception as e:
        print(f"Error scraping {href}: {e}")
    time.sleep(0.5)

with open('scraped_descriptions.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("Scraping complete.")
