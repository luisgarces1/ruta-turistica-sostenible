const fs = require('fs');

const updates = {
    40: [10.750, -75.108],
    41: [10.751, -75.109],
    42: [10.988, -74.959],
    43: [10.989, -74.955],
    44: [10.987, -74.958],
    45: [10.871, -74.974],
    46: [10.872, -74.973],
    47: [10.899, -74.886],
    48: [10.898, -74.885],
    49: [10.862, -74.774],
    50: [10.861, -74.773],
    51: [10.860, -74.772],
    52: [10.863, -74.775],
    53: [10.439, -75.522],
    54: [10.434, -75.529],
    55: [10.605, -75.253],
    56: [10.794, -75.253],
    57: [10.749, -75.107],
    58: [10.795, -75.224],
    59: [10.986, -74.957],
    60: [10.870, -74.970],
    61: [10.873, -74.975],
    62: [10.897, -74.884]
};

const rawData = fs.readFileSync('pts_processed.json', 'utf8');
const data = JSON.parse(rawData);

let newItemsStr = data.map(item => {
    if (updates[item.id]) {
        item.lat = updates[item.id][0];
        item.lng = updates[item.id][1];
    }
    
    item.location = item.location.replace(/\.\./g, '.').replace(/\.,/g, ',');

    return `  {
    id: ${item.id}, category: "${item.category}", title: "${item.title}", 
    description: "${item.description.replace(/"/g, '\\"')}", 
    lat: ${item.lat}, lng: ${item.lng}, image: "${item.image}", 
    location: "${item.location}", hours: "${item.hours}", price: "${item.price}", 
    tags: ${JSON.stringify(item.tags)}
  }`;
}).join(',\n');

let jsFile = fs.readFileSync('assets/js/data.js', 'utf8');

let lastIndex = jsFile.lastIndexOf('];');
if (lastIndex !== -1) {
    let before = jsFile.substring(0, lastIndex).trimEnd();
    let after = jsFile.substring(lastIndex);
    
    let finalOutput = before + ',\n' + newItemsStr + '\n' + after;
    
    fs.writeFileSync('assets/js/data.js', finalOutput, 'utf8');
    console.log("Success");
} else {
    console.error("Could not find array end");
}
