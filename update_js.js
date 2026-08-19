const fs = require('fs');
const path = require('path');

const jsFile = path.join(__dirname, 'js/products.js');
const jsonFile = path.join(__dirname, 'scraped_final.json');

const rawJs = fs.readFileSync(jsFile, 'utf8');
const scrapedData = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));

// We need to parse products.js
let resultJs = rawJs;

for (const key of Object.keys(scrapedData)) {
    let cleanKey = key;
    // Map keys correctly
    if (cleanKey === 'vanne-erg') cleanKey = 'vanne-egr';
    if (cleanKey === 'filtre-a-carburan') cleanKey = 'filtre-a-carburant';
    if (cleanKey === 'ailes-et-panneaux-lateraux') cleanKey = 'ailes-et-panneaux';
    
    // Some others might not be an exact match, let's just try to match the object key.
    let fullHtmlDesc = scrapedData[key];
    
    // extract bullet points from HTML desc. They start with • or ✅
    let bulletPoints = [];
    const lines = fullHtmlDesc.split('<br>');
    for (const line of lines) {
        if (line.trim().startsWith('•') || line.trim().startsWith('✅') || line.trim().startsWith('🔹')) {
            let point = line.replace(/^[•✅🔹]\s*/, '').replace(/<[^>]+>/g, '').trim();
            if (point && !bulletPoints.includes(point)) {
                bulletPoints.push(point);
            }
        }
    }
    
    // strip the bullet points from the main description
    let cleanDesc = fullHtmlDesc;
    
    // Remove the trailing <br><br><strong>...
    // Actually we can just keep the full HTML description as it is requested by the user.
    // The user said "copy exactly the same description for each product word by word".
    
    const regex = new RegExp(`('${cleanKey}'|"${cleanKey}"|${cleanKey})\\s*:\\s*{[^{]*?title:\\s*['"\`].*?['"\`],\\s*description:\\s*['"\`]([^'"\`]*?)['"\`],\\s*products:\\s*\\[([^\\]]*?)\\]`, 'is');
    
    if (regex.test(resultJs)) {
        // We replace it!
        let escapedDesc = fullHtmlDesc.replace(/'/g, "\\'").replace(/\n/g, "");
        let productsStr = bulletPoints.map(p => `'${p.replace(/'/g, "\\'")}'`).join(', ');
        
        resultJs = resultJs.replace(regex, (match, p1, p2, p3) => {
            return match.replace(/description:\s*['"`].*?['"`]/s, `description: '${escapedDesc}'`).replace(/products:\s*\[.*?\]/s, `products: [${productsStr}]`);
        });
        console.log(`Updated ${cleanKey}`);
    } else {
        console.log(`Could not find regex match for ${cleanKey}`);
    }
}

fs.writeFileSync('js/products_updated.js', resultJs, 'utf8');
console.log('Done!');
