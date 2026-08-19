import asyncio
import aiohttp
from bs4 import BeautifulSoup
import json
import re

async def fetch(session, url):
    try:
        async with session.get(url, timeout=10) as response:
            return await response.text()
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return ""

async def main():
    url = "https://cotumau.com/nos-produits/"
    async with aiohttp.ClientSession() as session:
        html = await fetch(session, url)
        soup = BeautifulSoup(html, 'html.parser')
        
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
                
        print(f"Found {len(unique_urls)} products. Fetching all...")
        
        tasks = []
        for t, h in unique_urls:
            tasks.append(fetch(session, h))
            
        results = await asyncio.gather(*tasks)
        
        final_data = {}
        
        for (t, h), res_html in zip(unique_urls, results):
            if not res_html:
                continue
            
            soup = BeautifulSoup(res_html, 'html.parser')
            content_div = soup.find('div', class_='elementor-widget-theme-post-content')
            if not content_div:
                content_div = soup.find('div', class_='entry-content')
            if not content_div:
                continue
                
            for share in content_div.find_all('div', class_='elementor-widget-share-buttons'):
                share.decompose()
                
            clean_html = ""
            for elem in content_div.find_all(recursive=False):
                if elem.name == 'section':
                    text = elem.get_text().lower()
                    if 'newsletter' in text and 'rejoignez notre communauté' in text:
                        break
                    if 'contactez-nous' in text or 'contactez nous' in text:
                        break
                    
                    for widget in elem.find_all('div', class_='elementor-widget-container'):
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
                                    li_text = re.sub(r'^✅\s*', '✅ ', li_text)
                                    if not li_text.startswith('✅') and not li_text.startswith('-'):
                                        clean_html += f"• {li_text}<br>"
                                    else:
                                        clean_html += f"{li_text}<br>"
                                clean_html += "<br>"
                else:
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

            clean_html = re.sub(r'(<br>\s*){3,}', '<br><br>', clean_html)
            clean_html = clean_html.replace("'", "\\'") # escape for JS
            clean_html = clean_html.strip('<br>')
            
            slug = h.strip('/').split('/')[-1]
            final_data[slug] = clean_html
            
        with open('scraped_fast.json', 'w', encoding='utf-8') as f:
            json.dump(final_data, f, ensure_ascii=False, indent=2)
            
        print("Done!")

if __name__ == '__main__':
    asyncio.run(main())
