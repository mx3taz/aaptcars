const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'js', 'products.js');
let content = fs.readFileSync(filePath, 'utf8');

// ============================================================
// FIX 1: Missing opening '<' before 'strong>' at description starts
// Pattern: description: 'strong>' should be description: '<strong>'
// ============================================================
content = content.replace(/description: 'strong>/g, "description: '<strong>");

// ============================================================
// FIX 2: Fix broken HTML at end of descriptions
// ============================================================
// Fix: <strong></strong  (missing closing >)  at end of vase-deau
content = content.replace(/<strong><\/strong'/g, "<strong></strong>'");
// Fix: <strong><  missing closing tag  
content = content.replace(/<strong><'/g, "'");
// Fix: </strong'  at end of radiateur-turbo (missing >)
content = content.replace(/<\/strong'/g, "</strong>'");

// ============================================================
// FIX 3: Fix missing spaces (systemic from HTML scraping)
// These are caused by stripped <strong> tags merging adjacent words
// ============================================================
const spacingFixes = [
    // Words merged with AAPT brand
    [/AAPTest /g, 'AAPT est '],
    [/AAPTest\b/g, 'AAPT est'],
    [/chezAAPT/g, 'chez AAPT'],
    [/ChezAAPT/g, 'Chez AAPT'],
    [/choisissantAAPT/g, 'choisissant AAPT'],
    [/àAAPT/g, 'à AAPT'],
    [/àAAPT/g, 'à AAPT'],
    [/confiance\.AAPT/g, 'confiance. AAPT'],
    
    // Common missing spaces from bold tags
    [/enpare-chocs/g, 'en pare-chocs'],
    [/depare-chocs/g, 'de pare-chocs'],
    [/desmarques/g, 'des marques'],
    [/lesmarques/g, 'les marques'],
    [/desplus/g, 'des plus'],
    [/lesplus/g, 'les plus'],
    [/despièces/g, 'des pièces'],
    [/lespièces/g, 'les pièces'],
    [/depièces/g, 'de pièces'],
    [/demarques/g, 'de marques'],
    [/automobilesen/g, 'automobiles en'],
    [/fiabilitésur/g, 'fiabilité sur'],
    [/facileet/g, 'facile et'],
    [/rapidesur/g, 'rapide sur'],
    [/fiableset/g, 'fiables et'],
    [/reconnuessur/g, 'reconnues sur'],
    [/reconnuesen/g, 'reconnues en'],
    [/reconnuesdans/g, 'reconnues dans'],
    [/reconnuespour/g, 'reconnues pour'],
    [/populairesen/g, 'populaires en'],
    [/populaireset/g, 'populaires et'],
    [/populairesdisponibles/g, 'populaires disponibles'],
    [/résistanceaux/g, 'résistance aux'],
    [/durabilitéet/g, 'durabilité et'],
    [/Durabilitéet/g, 'Durabilité et'],
    [/completcouvrant/g, 'complet couvrant'],
    [/completde/g, 'complet de'],
    [/réactifen/g, 'réactif en'],
    [/réactifet/g, 'réactif et'],
    [/compétitifset/g, 'compétitifs et'],
    [/compétitifspour/g, 'compétitifs pour'],
    [/compétitifsadaptés/g, 'compétitifs adaptés'],
    [/certifiéeset/g, 'certifiées et'],
    [/certifiéspour/g, 'certifiés pour'],
    [/disponiblepour/g, 'disponible pour'],
    [/permanentet/g, 'permanent et'],
    [/personnaliséspour/g, 'personnalisés pour'],
    [/personnaliséspar/g, 'personnalisés par'],
    [/techniqueet/g, 'technique et'],
    [/confiancepour/g, 'confiance pour'],
    [/confiancedes/g, 'confiance des'],
    [/confiancedans/g, 'confiance dans'],
    [/confiancede/g, 'confiance de'],
    [/dédiéet/g, 'dédié et'],
    [/expertisedans/g, 'expertise dans'],
    [/expertisede/g, 'expertise de'],
    [/reconnuedans/g, 'reconnue dans'],
    [/reconnueet/g, 'reconnue et'],
    [/reconnuecouvrant/g, 'reconnue couvrant'],
    [/devolants/g, 'de volants'],
    [/deradiateurs/g, 'de radiateurs'],
    [/destatorsde/g, 'de stators de'],
    [/debobines/g, 'de bobines'],
    [/defils/g, 'de fils'],
    [/depompes/g, 'de pompes'],
    [/dekits/g, 'de kits'],
    [/deculasses/g, 'de culasses'],
    [/deVannes/g, 'de Vannes'],
    [/dechemises/g, 'de chemises'],
    [/dejeux/g, 'de jeux'],
    [/d'arbres/g, "d'arbres"],
    [/decardans/g, 'de cardans'],
    [/decrémaillères/g, 'de crémaillères'],
    [/detriangles/g, 'de triangles'],
    [/debras/g, 'de bras'],
    [/decâbles/g, 'de câbles'],
    [/deplateaux/g, 'de plateaux'],
    [/dedisques/g, 'de disques'],
    [/demâchoires/g, 'de mâchoires'],
    [/detambours/g, 'de tambours'],
    [/demaîtres/g, 'de maîtres'],
    [/deplaquettes/g, 'de plaquettes'],
    [/decompresseurs/g, 'de compresseurs'],
    [/decondenseurs/g, 'de condenseurs'],
    [/dedurites/g, 'de durites'],
    [/devases/g, 'de vases'],
    [/defiltres/g, 'de filtres'],
    [/deporte/g, 'de porte'],
    [/dekits/g, 'de kits'],
    [/derétroviseurs/g, 'de rétroviseurs'],
    [/devitres/g, 'de vitres'],
    [/d'optiques/g, "d'optiques"],
    [/defeux/g, 'de feux'],
    [/d'alternateurs/g, "d'alternateurs"],
    [/deBendix/g, 'de Bendix'],
    [/derotors/g, 'de rotors'],
    [/d'émetteurs/g, "d'émetteurs"],
    [/derécepteurs/g, 'de récepteurs'],
    [/d'amortisseurs/g, "d'amortisseurs"],
    [/lerefroidissement/g, 'le refroidissement'],
    [/lefiltre/g, 'le filtre'],
    [/Lefiltre/g, 'Le filtre'],
    [/lethermostat/g, 'le thermostat'],
    [/lecylindre/g, 'le cylindre'],
    [/Lecylindre/g, 'Le cylindre'],
    [/lebras/g, 'le bras'],
    [/Lebras/g, 'Le bras'],
    [/lerécepteur/g, 'le récepteur'],
    [/Lerécepteur/g, 'Le récepteur'],
    [/leBendix/g, 'le Bendix'],
    [/LeBendix/g, 'Le Bendix'],
    [/lestator/g, 'le stator'],
    [/Lestator/g, 'Le stator'],
    [/Ledisque/g, 'Le disque'],
    [/Lemécanisme/g, 'Le mécanisme'],
    [/Labutée/g, 'La butée'],
    [/Levase/g, 'Le vase'],
    [/Leradiateur/g, 'Le radiateur'],
    [/Lavanne/g, 'La vanne'],
    [/lavanne/g, 'la vanne'],
    [/leschemises/g, 'les chemises'],
    [/L'alternateur/g, "L'alternateur"],
    [/l'alternateur/g, "l'alternateur"],
    [/unelarge/g, 'une large'],
    [/Unelarge/g, 'Une large'],
    [/Uneperformance/g, 'Une performance'],
    [/uneperformance/g, 'une performance'],
    [/Unelongévité/g, 'Une longévité'],
    [/unelongévité/g, 'une longévité'],
    [/Uneconsommation/g, 'Une consommation'],
    [/uneconsommation/g, 'une consommation'],
    [/Uneréduction/g, 'Une réduction'],
    [/uneréduction/g, 'une réduction'],
    [/Unefiabilité/g, 'Une fiabilité'],
    [/unefiabilité/g, 'une fiabilité'],
    [/Unedurée/g, 'Une durée'],
    [/unedurée/g, 'une durée'],
    [/Unecompatibilité/g, 'Une compatibilité'],
    [/unecompatibilité/g, 'une compatibilité'],
    [/Unerésistance/g, 'Une résistance'],
    [/unerésistance/g, 'une résistance'],
    [/Uneinstallation/g, 'Une installation'],
    [/uneinstallation/g, 'une installation'],
    [/Unecombustion/g, 'Une combustion'],
    [/unecombustion/g, 'une combustion'],
    [/Unemeilleure/g, 'Une meilleure'],
    [/unemeilleure/g, 'une meilleure'],
    [/Uneexcellente/g, 'Une excellente'],
    [/uneexcellente/g, 'une excellente'],
    [/Unétanchéité/g, 'Une étanchéité'],
    [/uneétanchéité/g, 'une étanchéité'],
    [/unconduite/g, 'une conduite'],
    [/Unservice/g, 'Un service'],
    [/unservice/g, 'un service'],
    [/Unlarge/g, 'Un large'],
    [/unlarge/g, 'un large'],
    [/Unstock/g, 'Un stock'],
    [/unstock/g, 'un stock'],
    [/Unréseau/g, 'Un réseau'],
    [/unréseau/g, 'un réseau'],
    [/lesconduite/g, 'les conduite'],
    [/lesfeux/g, 'les feux'],
    [/Lesfeux/g, 'Les feux'],
    [/lesamortisseurs/g, 'les amortisseurs'],
    [/Nosfeux/g, 'Nos feux'],
    [/nosfeux/g, 'nos feux'],
    [/Nosphares/g, 'Nos phares'],
    [/nosphares/g, 'nos phares'],
    [/lesoptiques?/g, function(m) { return m.replace('les', 'les '); }],
    [/desoptiques/g, 'des optiques'],
    [/tousfiltres/g, 'tous filtres'],
    [/tousdisques/g, 'tous disques'],
    [/sécuriséepartout/g, 'sécurisée partout'],
    [/d'origineou/g, "d'origine ou"],
    [/d'origineet/g, "d'origine et"],
    [/d'originepour/g, "d'origine pour"],
    [/reconnuesà/g, 'reconnues à'],
    [/certifiéesqui/g, 'certifiées qui'],
    [/larésistance/g, 'la résistance'],
    [/laperformance/g, 'la performance'],
    [/lasécurité/g, 'la sécurité'],
    [/lapompe/g, 'la pompe'],
    [/lapièce/g, 'la pièce'],
    [/lameilleure/g, 'la meilleure'],
    [/laprécision/g, 'la précision'],
    [/ladistribution/g, 'la distribution'],
    [/lasatisfaction/g, 'la satisfaction'],
    [/lefeu/g, 'le feu'],
    [/lejeu/g, 'le jeu'],
    [/leporte/g, 'le porte'],
    [/lefiltres/g, 'le filtres'],
    [/Desprix/g, 'Des prix'],
    [/desprix/g, 'des prix'],
    [/disponibleet/g, 'disponible et'],
    [/assuréeavec/g, 'assurée avec'],
    [/garantieavec/g, 'garantie avec'],
    [/immédiategrâce/g, 'immédiate grâce'],
    [/immédiatement\b/g, 'immédiatement'],
    [/professionnelpour/g, 'professionnel pour'],
    [/nationalrapide/g, 'national rapide'],
    [/expertet/g, 'expert et'],
    [/sontrigoureusement/g, 'sont rigoureusement'],
    [/estrigoureusement/g, 'est rigoureusement'],
    [/stockde/g, 'stock de'],
    [/stockcomplet/g, 'stock complet'],
    [/Large stockde/g, 'Large stock de'],
    [/expertiseet/g, 'expertise et'],
    [/lesamortisseurs/g, 'les amortisseurs'],
    [/meilleuresmarques/g, 'meilleures marques'],
    [/tousles/g, 'tous les'],
    [/tousmodèles/g, 'tous modèles'],
    [/toustypes/g, 'tous types'],
    // Fix "forts de notre expertise" used as bullet point text
    [/Plus denotre expertise/g, 'Une expertise reconnue'],
];

for (const [pattern, replacement] of spacingFixes) {
    content = content.replace(pattern, replacement);
}

// ============================================================
// FIX 4: Fix awkward rebranding phrases
// ============================================================
// "forts de notre expertise" used redundantly in certain patterns
const rebrandingFixes = [
    // "Expertise forts de notre expertise" → "Expertise reconnue"
    [/Expertise forts de notre expertise/g, 'Expertise reconnue'],
    // "expertise forts de notre expertise" → "expertise reconnue"  
    [/expertise forts de notre expertise/g, 'expertise reconnue'],
    // "Notre expertise forts de notre expertise" → "Notre expertise reconnue"
    [/Notre expertise forts de notre expertise/g, 'Notre expertise reconnue'],
    // Remove trailing "forts de notre expertise." at end of taglines
    [/AAPT – Votre spécialiste en pièces détachées automobiles en Tunisie forts de notre expertise\./g, 
     'AAPT – Votre spécialiste en pièces détachées automobiles en Tunisie.'],
    [/AAPT – Votre expert en pièces détachées automobiles forts de notre expertise\./g,
     'AAPT – Votre expert en pièces détachées automobiles en Tunisie.'],
    // "forts de notre expertise" in mid-sentence where it's redundant
    [/en Tunisie forts de notre expertise, nous/g, 'en Tunisie, nous'],
    [/en Tunisie forts de notre expertise nous/g, 'en Tunisie, nous'],
    [/automobiles forts de notre expertise, nous/g, 'automobiles en Tunisie, nous'],
    [/automobiles forts de notre expertise nous/g, 'automobiles en Tunisie, nous'],
    [/automobile forts de notre expertise, nous/g, 'automobile en Tunisie, nous'],
    [/automobile forts de notre expertise nous/g, 'automobile en Tunisie, nous'],
    // "spécialiste en pièces de freinage forts de notre expertise"
    [/freinage forts de notre expertise/g, 'freinage en Tunisie'],
    // "votre partenaire automobile forts de notre expertise"
    [/automobile forts de notre expertise/g, 'automobile en Tunisie'],
    // "Votre référence en pièces de rechange automobile en Tunisie forts de notre expertise"
    [/en Tunisie forts de notre expertise/g, 'en Tunisie'],
    // "pièce de rechange automobile forts de notre expertise, AAPT"
    [/forts de notre expertise, AAPT/g, 'en Tunisie, AAPT'],
    // "expertise reconnueforts de notre expertise" 
    [/reconnue forts de notre expertise/g, 'reconnue'],
    // Remaining standalone "forts de notre expertise" at awkward positions
    [/Forts de notre expertise, AAPT/g, 'AAPT'],
    [/forts de notre expertise/g, ''],
    // Clean up double spaces left from removals
    [/  +/g, ' '],
    // "Expertise de plus de plusieurs années" → "Expertise reconnue"
    [/Expertise de plus de plusieurs années/g, 'Expertise reconnue'],
    [/expertise de plus de plusieurs années/g, 'expertise reconnue'],
    // "Plus de plusieurs années" → "Expertise reconnue"  
    [/plus de plusieurs années/g, 'plusieurs années d\'expertise'],
    [/Plus de plusieurs années/g, 'Plusieurs années d\'expertise'],
    // "de une expertise reconnue" → "d'une expertise reconnue"
    [/de une expertise reconnue/g, "d'une expertise reconnue"],
    // "Forts de une expertise reconnue" → "Forts d'une expertise reconnue"  
    [/de une expertise/g, "d'une expertise"],
    // "Depuis plus de plusieurs années" in disque-embrayage
    [/Depuisplus de plusieurs années/g, "Depuis plusieurs années"],
    [/Depuis plus de plusieurs années/g, "Depuis plusieurs années"],
];

for (const [pattern, replacement] of rebrandingFixes) {
    content = content.replace(pattern, replacement);
}

// ============================================================
// FIX 5: Remove duplicated bullet content in descriptions
// The pattern is: after bullet list items (• item1<br>• item2), 
// the same items are repeated without bullets.
// We need to find and remove the duplicated non-bullet repetitions.
// ============================================================

// This is complex to do with regex on the full file.
// Instead, we'll target the specific pattern:
// <br><br>TEXT<br><br>TEXT  after a bullet list
// The duplicate starts right after the last bullet item and before the next <strong> section

// Pattern: after a series of •items ending with <br>, 
// there's a <br><br> then the same items repeated without •
// We'll use a function to clean each description

function removeDuplicatedBullets(desc) {
    // Split by <br><br> to find sections
    const parts = desc.split('<br><br>');
    const cleanParts = [];
    let i = 0;
    
    while (i < parts.length) {
        const current = parts[i];
        
        // Check if current part contains bullet points
        if (current.includes('• ') || current.includes('✅') || current.includes('🔹')) {
            cleanParts.push(current);
            
            // Extract the bullet text items (without the bullet markers)
            const bulletTexts = [];
            const bulletLines = current.split('<br>');
            for (const line of bulletLines) {
                const cleaned = line.replace(/^[•✅🔹]\s*/, '').trim();
                if (cleaned && cleaned.length > 5) {
                    bulletTexts.push(cleaned);
                }
            }
            
            // Skip following parts that are just repeats of the bullet text
            let j = i + 1;
            while (j < parts.length) {
                const nextPart = parts[j];
                // Check if this part is a duplicate of a bullet item
                const isDuplicate = bulletTexts.some(bt => {
                    // Compare first 20 chars to handle slight variations
                    const compareLen = Math.min(20, bt.length, nextPart.length);
                    return compareLen > 5 && nextPart.substring(0, compareLen) === bt.substring(0, compareLen);
                });
                
                if (isDuplicate) {
                    j++;
                } else {
                    break;
                }
            }
            i = j;
        } else {
            cleanParts.push(current);
            i++;
        }
    }
    
    return cleanParts.join('<br><br>');
}

// Apply to all descriptions in the content
content = content.replace(/description: '([^']*)'/g, function(match, desc) {
    if (desc.length > 0) {
        const cleaned = removeDuplicatedBullets(desc);
        return "description: '" + cleaned + "'";
    }
    return match;
});

// ============================================================
// FIX 6: Add descriptions for empty products
// ============================================================

const emptyDescriptions = {
    'porte-et-capot': {
        description: "Chez AAPT, nous vous proposons une large gamme de <strong>portes et capots</strong> pour tous les modèles et marques populaires en Tunisie. Que vous recherchiez des pièces pour voitures particulières, utilitaires ou 4×4, nous avons la solution adaptée à vos besoins.<br><br><strong>Nos produits</strong><br>Nous distribuons uniquement des produits de haute qualité, provenant des marques les plus reconnues sur le marché. Nos portes et capots garantissent :<br><br>• Qualité d'origine et compatibilité parfaite avec votre véhicule<br>• Résistance aux chocs et aux intempéries<br>• Finition soignée pour une intégration esthétique optimale<br><br><strong>Pourquoi choisir AAPT ?</strong><br>• Large choix de marques et modèles pour tous types de véhicules.<br>• Prix compétitifs avec un excellent rapport qualité-prix.<br>• Service client expert pour vous aider à choisir la pièce adaptée.<br>• Livraison rapide sur tout le territoire tunisien.<br><br>AAPT – Votre partenaire pour toutes vos pièces de carrosserie en Tunisie.",
        products: ["Qualité d'origine et compatibilité parfaite avec votre véhicule", "Résistance aux chocs et aux intempéries", "Finition soignée pour une intégration esthétique optimale", "Large choix de marques et modèles pour tous types de véhicules.", "Prix compétitifs avec un excellent rapport qualité-prix.", "Service client expert pour vous aider à choisir la pièce adaptée.", "Livraison rapide sur tout le territoire tunisien."]
    },
    'demarreur': {
        description: "Chez AAPT, nous mettons à votre disposition une large gamme de <strong>démarreurs</strong> de haute qualité pour tous types de véhicules. Le démarreur est un composant essentiel qui permet de lancer le moteur de votre voiture. Un démarreur défectueux peut entraîner des difficultés de démarrage ou un arrêt complet du véhicule.<br><br><strong>Nos produits</strong><br>Nous distribuons les démarreurs des marques les plus populaires et fiables du marché tunisien, notamment : Bosch, Valeo, Denso, Magneti Marelli, Hella, et bien d'autres.<br><br><strong>Pourquoi choisir AAPT ?</strong><br>• Large stock disponible pour toutes les marques et modèles.<br>• Qualité certifiée – produits testés et garantis.<br>• Conseils techniques personnalisés par nos experts.<br>• Livraison rapide partout en Tunisie.<br>• Prix compétitifs et service après-vente professionnel.<br><br>📞 Contactez-nous dès aujourd'hui pour trouver le démarreur adapté à votre véhicule !",
        products: ["Large stock disponible pour toutes les marques et modèles.", "Qualité certifiée – produits testés et garantis.", "Conseils techniques personnalisés par nos experts.", "Livraison rapide partout en Tunisie.", "Prix compétitifs et service après-vente professionnel."]
    },
    'sonde-lambda': {
        description: "Chez AAPT, nous vous proposons une large gamme de <strong>sondes lambda</strong> adaptées à tous les modèles et marques de véhicules populaires en Tunisie. La sonde lambda est un capteur essentiel du système d'échappement qui mesure la quantité d'oxygène dans les gaz d'échappement, permettant au moteur d'ajuster le mélange air-carburant pour une combustion optimale.<br><br><strong>Pourquoi choisir nos sondes lambda ?</strong><br>• Qualité certifiée : toutes nos sondes sont conformes aux standards des constructeurs automobiles.<br>• Compatibilité universelle : nous proposons des sondes pour toutes les marques présentes sur le marché tunisien.<br>• Performance optimale : nos sondes assurent une régulation efficace du mélange air-carburant, réduisant les émissions polluantes et optimisant la consommation.<br>• Disponibilité immédiate : grâce à notre stock important, vous trouvez rapidement la sonde correspondant à votre véhicule.<br><br><strong>Pourquoi choisir AAPT ?</strong><br>• Expertise reconnue dans la distribution de pièces automobiles.<br>• Service client expert et conseils techniques personnalisés.<br>• Livraison rapide partout en Tunisie.<br><br>AAPT – Votre partenaire de confiance pour les pièces automobiles en Tunisie.",
        products: ["Qualité certifiée : toutes nos sondes sont conformes aux standards des constructeurs automobiles.", "Compatibilité universelle : nous proposons des sondes pour toutes les marques présentes sur le marché tunisien.", "Performance optimale : régulation efficace du mélange air-carburant.", "Disponibilité immédiate : stock important pour une livraison rapide."]
    },
    'roulement-de-roue': {
        description: "Chez AAPT, nous mettons à votre disposition une large gamme de <strong>roulements de roue</strong> de haute qualité pour tous types de véhicules. Le roulement de roue est un composant essentiel qui assure la rotation fluide et sans friction de vos roues, garantissant sécurité et confort de conduite.<br><br><strong>Nos produits</strong><br>Nous distribuons les roulements de roue des marques les plus reconnues : SKF, FAG, NTN, SNR, Timken, et bien d'autres.<br><br><strong>Pourquoi choisir AAPT ?</strong><br>• Large choix de marques reconnues pour tous types de véhicules.<br>• Compatibilité garantie avec les modèles les plus populaires en Tunisie.<br>• Qualité certifiée et produits d'origine ou équivalents OEM.<br>• Stock permanent et livraison rapide sur tout le territoire tunisien.<br>• Conseil technique et accompagnement personnalisé.<br><br>AAPT – Votre spécialiste en pièces de suspension et direction en Tunisie.",
        products: ["Large choix de marques reconnues pour tous types de véhicules.", "Compatibilité garantie avec les modèles les plus populaires en Tunisie.", "Qualité certifiée et produits d'origine ou équivalents OEM.", "Stock permanent et livraison rapide sur tout le territoire tunisien.", "Conseil technique et accompagnement personnalisé."]
    },
    'toc-amortisseur': {
        description: "Chez AAPT, nous proposons une large gamme de <strong>tocs d'amortisseur</strong> (coupelles d'amortisseur) pour tous types de véhicules. Le toc d'amortisseur joue un rôle essentiel dans le système de suspension, assurant la liaison entre l'amortisseur et la carrosserie tout en absorbant les vibrations.<br><br><strong>Pourquoi choisir nos tocs d'amortisseur ?</strong><br>• Qualité certifiée : pièces conformes aux standards des constructeurs automobiles.<br>• Compatibilité garantie : tocs adaptés à toutes les marques populaires en Tunisie.<br>• Durabilité et performance : conçus pour offrir une tenue de route optimale.<br>• Disponibilité immédiate : stock local et service rapide.<br><br><strong>Pourquoi choisir AAPT ?</strong><br>• Expertise reconnue dans la distribution de pièces de suspension.<br>• Large stock disponible pour une livraison rapide en Tunisie.<br>• Conseils techniques personnalisés pour choisir la pièce adaptée.<br><br>AAPT – Votre partenaire de confiance pour les pièces de suspension en Tunisie.",
        products: ["Qualité certifiée : pièces conformes aux standards des constructeurs automobiles.", "Compatibilité garantie : tocs adaptés à toutes les marques populaires en Tunisie.", "Durabilité et performance : conçus pour offrir une tenue de route optimale.", "Disponibilité immédiate : stock local et service rapide."]
    },
    'rotule-de-direction': {
        description: "Chez AAPT, nous mettons à votre disposition une large gamme de <strong>rotules de direction</strong> de haute qualité pour tous types de véhicules. La rotule de direction est un élément clé du système de direction, permettant le pivotement des roues et assurant une conduite précise et sécurisée.<br><br><strong>Nos produits</strong><br>Nous distribuons les rotules de direction des marques les plus réputées : TRW, Lemförder, MOOG, Delphi, Febi Bilstein, et bien d'autres.<br><br><strong>Pourquoi choisir AAPT ?</strong><br>• Large choix de références pour toutes les marques de véhicules populaires en Tunisie.<br>• Produits certifiés et conformes aux normes internationales.<br>• Prix compétitifs et stock permanent.<br>• Conseil technique professionnel et service client réactif.<br>• Livraison rapide partout en Tunisie.<br><br>AAPT – Votre spécialiste en pièces de direction en Tunisie.",
        products: ["Large choix de références pour toutes les marques de véhicules populaires en Tunisie.", "Produits certifiés et conformes aux normes internationales.", "Prix compétitifs et stock permanent.", "Conseil technique professionnel et service client réactif.", "Livraison rapide partout en Tunisie."]
    },
    'butee-embrayage': {
        description: "Chez AAPT, nous vous proposons une large gamme de <strong>butées d'embrayage</strong> pour tous les modèles et marques de véhicules populaires en Tunisie. La butée d'embrayage est un composant essentiel du système d'embrayage, assurant le débrayage fluide et la transmission de puissance optimale entre le moteur et la boîte de vitesses.<br><br><strong>Pourquoi choisir nos butées d'embrayage ?</strong><br>• Qualité garantie : des produits testés et approuvés pour leur fiabilité.<br>• Large choix : compatible avec toutes les marques et modèles de véhicules.<br>• Disponibilité immédiate : stock suffisant pour répondre rapidement à vos besoins.<br>• Expertise AAPT : une expertise reconnue dans le domaine des pièces automobiles.<br><br><strong>Nos marques disponibles</strong><br>Valeo, Luk, Sachs, Exedy, Aisin, et bien d'autres grandes marques reconnues.<br><br>AAPT – Votre partenaire de confiance pour les pièces d'embrayage en Tunisie.",
        products: ["Qualité garantie : des produits testés et approuvés pour leur fiabilité.", "Large choix : compatible avec toutes les marques et modèles de véhicules.", "Disponibilité immédiate : stock suffisant pour répondre rapidement à vos besoins.", "Expertise AAPT : une expertise reconnue dans le domaine des pièces automobiles."]
    },
    'filtre-habitacle': {
        description: "Chez AAPT, nous mettons à votre disposition une large gamme de <strong>filtres habitacle</strong> pour tous types de véhicules. Le filtre habitacle purifie l'air entrant dans l'habitacle de votre véhicule, retenant la poussière, le pollen et les particules nocives pour votre confort et votre santé.<br><br><strong>Pourquoi choisir nos filtres habitacle ?</strong><br>• Qualité certifiée : toutes nos pièces répondent aux normes les plus strictes de l'industrie automobile.<br>• Compatibilité universelle : filtres adaptés à toutes les marques automobiles présentes sur le marché tunisien.<br>• Performance optimale : filtration efficace pour un air pur et sain dans votre véhicule.<br>• Disponibilité immédiate : grâce à notre stock important, vous trouvez rapidement le filtre correspondant à votre véhicule.<br><br><strong>Nos marques disponibles</strong><br>Bosch, Mann Filter, Filtron, Mahle, Purflux, UFI, et bien d'autres.<br><br><strong>Pourquoi choisir AAPT ?</strong><br>• Expertise reconnue dans la distribution de pièces automobiles en Tunisie.<br>• Service client expert et conseils techniques personnalisés.<br>• Livraison rapide partout en Tunisie.<br><br>AAPT – Votre partenaire de confiance pour les systèmes de filtration en Tunisie.",
        products: ["Qualité certifiée : toutes nos pièces répondent aux normes les plus strictes.", "Compatibilité universelle : filtres adaptés à toutes les marques automobiles.", "Performance optimale : filtration efficace pour un air pur et sain.", "Disponibilité immédiate : stock important pour une livraison rapide."]
    }
};

// Apply empty descriptions
for (const [key, data] of Object.entries(emptyDescriptions)) {
    const descPattern = new RegExp(
        `('${key}':\\s*\\{[^}]*?description:\\s*')('')`,
    );
    const productsPattern = new RegExp(
        `('${key}':\\s*\\{[^}]*?products:\\s*)(\\[\\])`,
    );
    
    content = content.replace(descPattern, `$1${data.description}$2`);
    content = content.replace(productsPattern, `$1${JSON.stringify(data.products)}`);
}

// ============================================================
// FIX 7: Final cleanup passes
// ============================================================
// Remove any remaining double spaces
content = content.replace(/  +/g, ' ');

// Fix ",AAPT" → ", AAPT"
content = content.replace(/,AAPT/g, ', AAPT');
// Fix ".AAPT" → ". AAPT"
content = content.replace(/\.AAPT/g, '. AAPT');

// Write the fixed file
fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ All fixes applied successfully to js/products.js');
console.log('Fixes applied:');
console.log('  1. Missing <strong> opening tags fixed');
console.log('  2. Broken HTML at end of descriptions fixed');
console.log('  3. Missing spaces between words fixed');
console.log('  4. Awkward rebranding phrases cleaned up');
console.log('  5. Duplicated bullet content removed');
console.log('  6. Empty descriptions filled with AAPT-branded content');
console.log('  7. Final cleanup (double spaces, punctuation spacing)');
