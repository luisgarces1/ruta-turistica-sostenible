const fs = require('fs');
let dataContent = fs.readFileSync('assets/js/data.js', 'utf8');

// evaluate to get mockData
eval(dataContent);

console.log("Total length:", mockData.length);

for(let i=0; i<mockData.length; i++) {
    let item = mockData[i];
    if (typeof item.lat !== 'number' || typeof item.lng !== 'number' || isNaN(item.lat) || isNaN(item.lng)) {
        console.error("BAD COORDS:", item.id, item.lat, item.lng);
    }
}
console.log("Coords checked.");
