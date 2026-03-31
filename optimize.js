const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = 'assets/images/puntos/';
const files = [
    'foto-principal-m.1888.webp',
    'foto-principal-para-la-pagina-e.c.webp',
    'foto-principal-c.a.webp',
    'foto-principal-para-la-pagina-ef.webp',
    'foto-principal-para-la-pagina-g.m.webp',
    'museo-del-carnaval-de-barranquilla.webp'
];

async function run() {
    console.log("Starting optimization...");
    for (const f of files) {
        const p = path.join(__dirname, dir, f);
        if (fs.existsSync(p)) {
            console.log(`Optimizing ${f}...`);
            try {
                const buf = await sharp(p).resize(1280).webp({ quality: 75 }).toBuffer();
                fs.writeFileSync(p, buf);
                console.log(`Optimized ${f} SUCCESS.`);
            } catch (e) {
                console.error(`Error optimizing ${f}: ${e.message}`);
            }
        } else {
            console.log(`File not found: ${p}`);
        }
    }
}

run();
