const fs = require('fs');
const { JSDOM } = require("jsdom");

const html = `
<!DOCTYPE html>
<html><body>
    <div id="map"></div>
    <div id="filter-container"></div>
    <div id="side-panel"></div>
</body></html>
`;

const dom = new JSDOM(html);
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

// Mock Leaflet
global.L = {
    map: () => ({
        setView: () => {},
        invalidateSize: () => {},
        flyTo: () => {},
        flyToBounds: () => {}
    }),
    control: { zoom: () => ({ addTo: () => {} }) },
    tileLayer: () => ({ addTo: () => {} }),
    featureGroup: () => ({ addTo: () => {}, clearLayers: () => {}, addLayer: () => {}, hasLayer: () => false, getBounds: () => ({}), removeLayer: () => {}, _layers: {} }),
    marker: (coords, options) => ({ itemData: null, on: () => {}, coords, options }),
    divIcon: (opts) => opts
};

let dataContent = fs.readFileSync('assets/js/data.js', 'utf8');
eval(dataContent);
global.categories = categories;
global.mockData = mockData;

let appContent = fs.readFileSync('assets/js/app.js', 'utf8');
try {
    eval(appContent);
    console.log('App logic ran successfully!');
    console.log('Markers generated:', allMarkers.length);
} catch (e) {
    console.error('Error running app.js:', e);
}
