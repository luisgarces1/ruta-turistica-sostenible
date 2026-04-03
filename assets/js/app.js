// Init Leaflet Map
const map = L.map('map', {
    zoomControl: false, // Customizing zoom position
    minZoom: 8, // Prevent zooming out worldwide
    scrollWheelZoom: false, // Prevent zoom during page scrolling
    tap: false // Recommended for modern touch devices
}).setView([11.0, -74.8], 9);

// Fix blank tile issue if Flex layout renders slightly after DOM
setTimeout(() => { map.invalidateSize(); }, 300);

// Add Zoom Control Position
L.control.zoom({
    position: 'bottomright'
}).addTo(map);

// Add Light Base Map (Carto Positron for a very clean, modern look)
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://carto.com/">Carto</a>'
}).addTo(map);

// Groups and State
const markerGroup = L.featureGroup().addTo(map);
let allMarkers = [];
let currentActiveFilter = 'todas';

// DOM Elements
const filterContainer = document.getElementById('filter-container');
const sidePanel = document.getElementById('side-panel');

// 1. Render Filter Buttons
function renderFilters() {
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = `filter-btn w-full text-left px-4 py-3 rounded-2xl transition-all duration-500 flex items-center justify-between border group ${cat.id === 'todas'
            ? 'glass-card border-brand-200/50 shadow-md translate-x-1'
            : 'bg-white/50 border-transparent hover:bg-white hover:shadow-sm'
            }`;
        btn.dataset.category = cat.id;

        btn.innerHTML = `
            <div class="flex items-center gap-4">
                <span class="flex items-center justify-center w-10 h-10 rounded-xl ${cat.color} text-white text-base shadow-lg shadow-${cat.color.split('-')[1]}-500/20 group-hover:scale-110 transition-transform duration-500">${cat.icon}</span>
                <div class="flex flex-col">
                    <span class="font-bold text-[14px] ${cat.id === 'todas' ? 'text-brand-900' : 'text-gray-600 group-hover:text-gray-900'}">${cat.label}</span>
                    <span class="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">Explorar sitios</span>
                </div>
            </div>
            <div class="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 ${cat.id === 'todas' ? 'bg-brand-500 text-white' : 'bg-gray-100 text-transparent'}">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M5 13l4 4L19 7" />
                </svg>
            </div>
        `;

        btn.addEventListener('click', () => {
            currentActiveFilter = cat.id;
            updateFilterUI();
            filterMarkers();
            closeSidePanel();
        });

        filterContainer.appendChild(btn);
    });
}

function updateFilterUI() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        const checkCircle = btn.lastElementChild;
        const textSpan = btn.querySelector('span.font-bold');
        if (btn.dataset.category === currentActiveFilter) {
            btn.classList.add('glass-card', 'border-brand-200/50', 'shadow-md', 'translate-x-1');
            btn.classList.remove('bg-white/50', 'border-transparent');
            textSpan.classList.add('text-brand-900');
            textSpan.classList.remove('text-gray-600', 'group-hover:text-gray-900');
            checkCircle.classList.remove('bg-gray-100', 'text-transparent');
            checkCircle.classList.add('bg-brand-500', 'text-white');
        } else {
            btn.classList.remove('glass-card', 'border-brand-200/50', 'shadow-md', 'translate-x-1');
            btn.classList.add('bg-white/50', 'border-transparent');
            textSpan.classList.remove('text-brand-900');
            textSpan.classList.add('text-gray-600', 'group-hover:text-gray-900');
            checkCircle.classList.add('bg-gray-100', 'text-transparent');
            checkCircle.classList.remove('bg-brand-500', 'text-white');
        }
    });
}

// 2. Custom Icons
function getMarkerIcon(categoryStr) {
    const catData = categories.find(c => c.id === categoryStr) || categories[0];
    return L.divIcon({
        className: 'custom-div-icon bg-transparent border-none',
        html: `<div class="${catData.color} w-7 h-7 rounded-full flex items-center justify-center text-white shadow-[0_4px_10px_rgba(0,0,0,0.3)] border-[2px] border-white text-xs transform transition-transform duration-300 hover:scale-110 hover:shadow-xl">${catData.icon}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
    });
}

// 3. Render Markers
function renderMarkers() {
    markerGroup.clearLayers();
    allMarkers = [];

    mockData.forEach(item => {
        const marker = L.marker([item.lat, item.lng], {
            icon: getMarkerIcon(item.category),
            title: item.title // Esto habilita el tooltip nativo de hover
        });

        marker.itemData = item;

        marker.on('click', () => {
            openSidePanel(item);
            // Center map smoothly on mobile taking offset into account
            const isMobile = window.innerWidth < 768;
            const latOffset = isMobile ? -0.05 : 0; // Look a bit lower on mobile so panel doesn't cover marker
            map.flyTo([item.lat + latOffset, item.lng], 13, { duration: 0.8 });
        });

        markerGroup.addLayer(marker);
        allMarkers.push(marker);
    });
}

function filterMarkers() {
    // If we are in Itinerary Mode, let ItineraryPlanner handle it
    if (window.ItineraryPlanner && window.ItineraryPlanner.fullItinerary) {
        window.ItineraryPlanner.updateMapForDay(window.ItineraryPlanner.currentDayView);
        return;
    }

    allMarkers.forEach(marker => {
        if (currentActiveFilter === 'todas' || marker.itemData.category === currentActiveFilter) {
            if (!markerGroup.hasLayer(marker)) markerGroup.addLayer(marker);
        } else {
            if (markerGroup.hasLayer(marker)) markerGroup.removeLayer(marker);
        }
    });

    // Fit bounds appropriately with constraints
    if (Object.keys(markerGroup._layers).length > 0) {
        map.flyToBounds(markerGroup.getBounds(), { padding: [80, 80], maxZoom: 11.5, duration: 1.2 });
    }
}

// 4. Side Panel Logic
function openSidePanel(data) {
    const categoryData = categories.find(c => c.id === data.category);

    sidePanel.innerHTML = `
        <!-- Image Header (Fast Reveal + Skeleton) -->
        <div class="relative h-36 md:h-48 w-full shrink overflow-hidden rounded-t-3xl md:rounded-t-2xl p-3 skeleton min-h-[140px]">
            <img src="${data.image}" 
                 loading="eager"
                 onload="this.classList.add('img-fade-in'); this.parentElement.classList.remove('skeleton')"
                 onerror="this.src='https://images.unsplash.com/photo-1543884877-a8eb0bf1775f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'; this.parentElement.classList.remove('skeleton')" 
                 class="w-full h-full object-cover rounded-2xl shadow-xl border-4 border-white/40 opacity-0 transition-opacity" 
                 alt="${data.title}">
            
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
            
            <button onclick="closeSidePanel()" class="absolute top-5 right-5 bg-white/30 hover:bg-white/90 focus:bg-white backdrop-blur-md p-2 rounded-full text-white hover:text-gray-900 transition-all shadow-lg border border-white/30 z-[60] group">
                <svg class="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <div class="absolute bottom-6 left-6 z-[50]">
                <span class="px-3 py-1.5 ${categoryData?.color || 'bg-gray-800'} text-white text-[9px] font-black uppercase tracking-[0.1em] rounded-full shadow-2xl border border-white/40 backdrop-blur-md flex items-center gap-2 w-fit">
                    ${categoryData?.icon || ''} ${categoryData?.label || 'Categoría'}
                </span>
            </div>
        </div>

            <!-- Content Body with Glass Effect -->
            <div class="px-5 md:px-6 py-4 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-4">
                <!-- 1. Title Section -->
                <div class="space-y-0">
                    <p class="text-hierarchy-subtitle text-[9px] mb-[-2px]">${data.location.split(',')[0]} / ${data.category.toUpperCase()}</p>
                    <h2 class="text-hierarchy-title text-lg md:text-xl leading-tight">${data.title}</h2>
                </div>

                <!-- 2. Audioguide Button -->
                <button onclick="speakDescription('${data.description.replace(/'/g, "\\'")}')" class="flex items-center gap-2.5 text-[#004a99] font-black text-[10px] hover:scale-102 active:scale-95 transition-all w-full md:w-fit py-1.5 px-3 glass-card rounded-xl uppercase tracking-widest group">
                    <div class="w-7 h-7 rounded-lg bg-[#004a99] text-white flex items-center justify-center shadow-lg shadow-blue-900/20 group-hover:rotate-[360deg] transition-transform duration-700">
                        <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.85 14,18.71V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16.02C15.5,15.29 16.5,13.77 16.5,12M3,9V15H7L12,20V4L7,9H3Z" /></svg>
                    </div>
                    <span class="flex flex-col items-start translate-y-[-1px]">
                        <span class="opacity-40 text-[7px] mb-[-2px]">Audioguía</span>
                        Escuchar narración
                    </span>
                </button>

                <!-- 3. Information Grid -->
                <div class="grid grid-cols-2 gap-2">
                    <div class="glass-card rounded-xl p-3 border border-white/30 flex flex-col gap-0.5">
                        <p class="text-[9px] text-gray-400 font-black uppercase tracking-wider">Atención</p>
                        <p class="text-[12px] font-bold text-gray-800">${data.hours}</p>
                    </div>
                    <div class="glass-card rounded-xl p-3 border border-white/30 flex flex-col gap-0.5">
                        <p class="text-[9px] text-gray-400 font-black uppercase tracking-wider">Ingreso</p>
                        <p class="text-[12px] font-bold text-gray-800">${data.price}</p>
                    </div>
                </div>

                <!-- 4. Google Maps Button -->
                <button onclick="openGoogleMaps(${data.lat}, ${data.lng})" class="w-full h-12 flex items-center justify-center btn-primary-glow text-white font-black text-base rounded-xl relative overflow-hidden group shrink-0">
                    <span class="relative z-10 flex items-center gap-2 uppercase tracking-tighter">
                        Ver ruta en mapa
                        <i class="fa-solid fa-arrow-right-long group-hover:translate-x-1 transition-transform"></i>
                    </span>
                    <div class="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none"></div>
                </button>

                <!-- 5. Description -->
                <div class="glass-card rounded-xl p-3 text-[12px] md:text-[13px] text-gray-700 leading-tight font-medium italic">
                    ${data.description}
                </div>
            </div>
    `;

    // Slide in
    sidePanel.classList.remove('translate-y-full', 'md:translate-x-[120%]');
}

window.closeSidePanel = function () {
    // Slide out
    sidePanel.classList.add('translate-y-full', 'md:translate-x-[120%]');
    // Reset view to show all markers
    filterMarkers();
    // Stop any ongoing narration
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
}

// Ensure panel is closed at start
closeSidePanel();

// 5. Accessibility Logic (TTS) - Voice Selection
let selectedVoice = null;
function loadVoices() {
    const voices = window.speechSynthesis.getVoices();
    // Prefer high-quality voices (Google or Microsoft) for Spanish
    selectedVoice = voices.find(v => v.lang.includes('es') && (v.name.includes('Google') || v.name.includes('Natural'))) 
                 || voices.find(v => v.lang.includes('es'))
                 || voices[0];
}

// Voices are loaded asynchronously in some browsers
if ('speechSynthesis' in window) {
    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
    }
}

window.speakDescription = function(text) {
    if ('speechSynthesis' in window) {
        // If it's already speaking, stop it (toggle behavior)
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        
        // Ensure we have a voice loaded
        if (!selectedVoice) loadVoices();
        if (selectedVoice) utterance.voice = selectedVoice;
        
        utterance.lang = 'es-ES';
        utterance.rate = 0.95; // Slightly slower for more natural flow
        utterance.pitch = 1;
        
        window.speechSynthesis.speak(utterance);
    } else {
        alert("Lo siento, tu navegador no soporta la lectura de voz.");
    }
}

// 6. Navigation Logic (Google Maps with dynamic origin)
window.openGoogleMaps = function(lat, lng) {
    // Coordenadas de centros por defecto si no hay Planificador activo
    const cityCoords = {
        'Cartagena': '10.4248,-75.5474',
        'Barranquilla': '10.9685,-74.7813'
    };
    
    // Intentar obtener la ciudad del ItineraryPlanner, si no, usar Cartagena por defecto
    const startCity = (window.ItineraryPlanner && window.ItineraryPlanner.startCity) || 'Cartagena';
    const origin = cityCoords[startCity];
    
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${lat},${lng}`;
    window.open(url, '_blank');
}

// 7. Performance Optimizer: Preload first 10 images
function preloadImages() {
    mockData.slice(0, 10).forEach(item => {
        const img = new Image();
        img.src = item.image;
    });
}

// Init Base Render
renderFilters();
renderMarkers();
filterMarkers();
preloadImages();
