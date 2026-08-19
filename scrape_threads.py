import requests
from bs4 import BeautifulSoup
import json
import re
import concurrent.futures

def extract_description(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    
    content_div = soup.find('div', class_='page-content')
    if not content_div:
        return ""
        
    for share in content_div.find_all('div', class_='elementor-widget-share-buttons'):
        share.decompose()
        
    clean_html = ""
    for elem in content_div.find_all(recursive=False):
        if elem.name == 'section':
            text = elem.get_text().lower()
            if 'newsletter' in text and 'rejoignez notre' in text:
                break
            if 'contactez-nous' in text or 'besoin d' in text:
                break
            
            for widget in elem.find_all('div', class_='elementor-widget-container'):
                for child in widget.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol']):
                    if child.name in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']:
                        text_val = child.get_text(strip=True)
                        if 'newsletter' in text_val.lower() or 'contactez' in text_val.lower():
                            break
                        clean_html += f"<br><br><strong>{text_val}</strong><br>"
                    elif child.name == 'p':
                        text_val = child.get_text(strip=True)
                        if text_val:
                            clean_html += f"{text_val}<br><br>"
                    elif child.name in ['ul', 'ol']:
                        for li in child.find_all('li'):
                            li_text = li.get_text(strip=True)
                            li_text = re.sub(r'^✅\s*', '✅ ', li_text)
                            if not li_text.startswith('✅') and not li_text.startswith('-'):
                                clean_html += f"• {li_text}<br>"
                            else:
                                clean_html += f"{li_text}<br>"
                        clean_html += "<br>"
        else:
            # Maybe the content is nested directly in divs since Elementor uses divs
            for child in elem.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol']):
                if child.name in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']:
                    text_val = child.get_text(strip=True)
                    if 'newsletter' in text_val.lower() or 'contactez' in text_val.lower():
                        break
                    clean_html += f"<br><br><strong>{text_val}</strong><br>"
                elif child.name == 'p':
                    text_val = child.get_text(strip=True)
                    if text_val:
                        clean_html += f"{text_val}<br><br>"
                elif child.name in ['ul', 'ol']:
                    for li in child.find_all('li'):
                        li_text = li.get_text(strip=True)
                        if not li_text.startswith('✅') and not li_text.startswith('-'):
                            clean_html += f"• {li_text}<br>"
                        else:
                            clean_html += f"{li_text}<br>"
                    clean_html += "<br>"

    clean_html = re.sub(r'(<br>\s*){3,}', '<br><br>', clean_html)
    clean_html = clean_html.replace("'", "\\'") # escape for JS
    return clean_html.strip('<br>')

def process_url(url_tuple):
    title, href = url_tuple
    try:
        res = requests.get(href, timeout=10)
        desc = extract_description(res.text)
        slug = href.strip('/').split('/')[-1]
        return slug, desc
    except Exception as e:
        return href.strip('/').split('/')[-1], ""

def main():
    url = "https://cotumau.com/nos-produits/"
    try:
        res = requests.get(url, timeout=10)
        soup = BeautifulSoup(res.text, 'html.parser')
    except Exception as e:
        print("Failed to load main page", e)
        return

    links = soup.find_all('a', href=True)
    product_urls = []
    for a in links:
        href = a['href']
        if 'cotumau.com/' in href and href != url:
            if href.count('/') == 4 and 'category' not in href and 'tag' not in href:
                text = a.get_text(strip=True)
                if text:
                    product_urls.append((text, href))

    unique_urls = []
    seen = set()
    for t, h in product_urls:
        if h not in seen:
            seen.add(h)
            unique_urls.append((t, h))

    print(f"Scraping {len(unique_urls)} products...")
    
    final_data = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
        results = executor.map(process_url, unique_urls)
        for slug, desc in results:
            if desc:
                final_data[slug] = desc
                
    with open('scraped_final.json', 'w', encoding='utf-8') as f:
        json.dump(final_data, f, ensure_ascii=False, indent=2)

    print("SUCCESS")

if __name__ == '__main__':
    main()
