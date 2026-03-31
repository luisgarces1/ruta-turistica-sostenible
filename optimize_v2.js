const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'assets/images/puntos/');
const tempDir = path.join(__dirname, 'assets/images/puntos_temp/');

if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
}

async function optimizeImages() {
    console.log('--- Iniciando Optimización de Imágenes ---');
    const files = fs.readdirSync(dir);
    const convertedFiles = [];

    for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        if (!['.webp', '.jpg', '.jpeg', '.png'].includes(ext)) continue;

        const inputPath = path.join(dir, file);
        let outputName = file;
        
        // Regla JPG -> WebP
        if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
            outputName = path.basename(file, ext) + '.webp';
            convertedFiles.push({ old: file, new: outputName });
        }

        const outputPath = path.join(tempDir, outputName);

        try {
            console.log(`Procesando: ${file} -> ${outputName}`);
            
            let pipeline = sharp(inputPath)
                .resize({
                    width: 1920,
                    withoutEnlargement: true,
                    fit: 'inside'
                })
                .webp({ quality: 75 });

            await pipeline.toFile(outputPath);
            console.log(`✅ ${outputName} optimizada exitosamente.`);
        } catch (err) {
            console.error(`❌ Error procesando ${file}:`, err.message);
        }
    }

    console.log('\n--- Sustituyendo archivos originales ---');
    // Mover archivos optimizados de vuelta
    const optimizedFiles = fs.readdirSync(tempDir);
    for (const file of optimizedFiles) {
        const src = path.join(tempDir, file);
        const dest = path.join(dir, file);
        
        // Si el nombre cambió (de .jpg a .webp), eliminamos el viejo .jpg
        const oldRef = convertedFiles.find(c => c.new === file);
        if (oldRef) {
            const oldPath = path.join(dir, oldRef.old);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        fs.renameSync(src, dest);
    }

    // Limpiar carpeta temporal
    fs.rmdirSync(tempDir);

    console.log('--- Optimización Finalizada ---');
    
    // Proceso de búsqueda y reemplazo en data.js para los .webp nuevos
    if (convertedFiles.length > 0) {
        console.log('\n--- Actualizando referencias en data.js ---');
        const dataPath = path.join(__dirname, 'assets/js/data.js');
        if (fs.existsSync(dataPath)) {
            let dataContent = fs.readFileSync(dataPath, 'utf8');
            convertedFiles.forEach(file => {
                const oldName = file.old;
                const newName = file.new;
                dataContent = dataContent.replace(new RegExp(oldName, 'g'), newName);
                console.log(`  Actualizado enlace: ${oldName} -> ${newName} en data.js`);
            });
            fs.writeFileSync(dataPath, dataContent);
        }
    }
    
    return convertedFiles;
}

optimizeImages().then(converted => {
    if (converted.length > 0) {
        console.log('\n⚠️ Archivos convertidos detectados. Por favor, actualiza las referencias en el código:');
        converted.forEach(c => console.log(`  - ${c.old} -> ${c.new}`));
    }
});
