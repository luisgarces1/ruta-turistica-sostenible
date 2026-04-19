// Init Leaflet Map
const map = L.map('map', {
    zoomControl: false, // Customizing zoom position
    minZoom: 8, // Prevent zooming out worldwide
    scrollWheelZoom: false, // Prevent zoom during page scrolling
    tap: false, // Recommended for modern touch devices
    dragging: !L.Browser.mobile // Disable dragging on mobile to allow page scroll
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
let activeMunicipalityContext = null;

// DOM Elements
const filterContainer = document.getElementById('filter-container');
const sidePanel = document.getElementById('side-panel');

// 1. Render Filter Buttons
function renderFilters(targetCategories = categories, isSubmenu = false) {
    filterContainer.innerHTML = '';

    if (isSubmenu) {
        const backBtn = document.createElement('button');
        backBtn.className = "flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-brand-600 mb-4 transition-all group px-2 uppercase tracking-widest";
        backBtn.innerHTML = `<i class="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> Volver al menú`;
        backBtn.onclick = () => renderFilters(categories, false);
        filterContainer.appendChild(backBtn);
    }

    targetCategories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = `filter-btn w-full text-left px-4 py-3 rounded-2xl transition-all duration-500 flex items-center justify-between border group ${cat.id === currentActiveFilter
            ? 'glass-card border-brand-200/50 shadow-md translate-x-1'
            : 'bg-white/50 border-transparent hover:bg-white hover:shadow-sm'
            }`;
        btn.dataset.category = cat.id;

        btn.innerHTML = `
            <div class="flex items-center gap-4">
                <span class="flex items-center justify-center w-10 h-10 rounded-xl ${cat.color} text-white text-base shadow-lg shadow-${cat.color.split('-')[1]}-500/20 group-hover:scale-110 transition-transform duration-500">${cat.icon}</span>
                <div class="flex flex-col">
                    <span class="font-bold text-[14px] ${cat.id === currentActiveFilter ? 'text-brand-900' : 'text-gray-600 group-hover:text-gray-900'}">${cat.label}</span>
                    <span class="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">${cat.subcategories ? 'Ver subcategorías' : 'Explorar sitios'}</span>
                </div>
            </div>
            <div class="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 ${cat.id === currentActiveFilter ? 'bg-brand-500 text-white' : 'bg-gray-100 text-transparent'}">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M5 13l4 4L19 7" />
                </svg>
            </div>
        `;

        btn.addEventListener('click', () => {
            if (cat.subcategories) {
                renderFilters(cat.subcategories, true);
                // Also optionally filter markers by ALL subcategories
                currentActiveFilter = cat.id;
                filterMarkers();
            } else {
                currentActiveFilter = cat.id;
                updateFilterUI();
                filterMarkers();
                closeSidePanel();
            }
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
    let catData = categories.find(c => c.id === categoryStr);
    
    // Buscar en subcategorías si no está en el nivel principal
    if (!catData) {
        categories.forEach(parent => {
            if (parent.subcategories) {
                const sub = parent.subcategories.find(s => s.id === categoryStr);
                if (sub) catData = sub;
            }
        });
    }

    catData = catData || categories[0];

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
        let isVisible = currentActiveFilter === 'todas' || marker.itemData.category === currentActiveFilter;

        // Soporte para selección de categoría padre (Naturaleza)
        const activeCat = categories.find(c => c.id === currentActiveFilter);
        if (activeCat && activeCat.subcategories) {
            if (activeCat.subcategories.find(sub => sub.id === marker.itemData.category)) {
                isVisible = true;
            }
        }

        if (isVisible) {
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

window.closeSidePanel = function (returnToContext = true) {
    // Slide out
    sidePanel.classList.add('translate-y-full', 'md:translate-x-[120%]');
    // Reset view to show all markers if not in municipality context
    if (activeMunicipalityContext && returnToContext) {
        window.showView('municipio-detail');
        // No reseteamos el filtro de marcadores aquí para que si vuelve al mapa siga viendo los del municipio
    } else if (!activeMunicipalityContext) {
        filterMarkers();
    }
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

// 8. Municipios Section Logic
const municipiosData = [
    {
        id: "barranquilla",
        name: "Barranquilla",
        image: "assets/images/puntos/foto-principal-para-la-pagina-g.m.webp",
        description: "Conocida como la 'Puerta de Oro de Colombia', es una ciudad vibrante donde el río Magdalena se une con el mar Caribe. Cuna de cultura, música y progreso.",
        pointsIds: [20, 21, 22, 23, 24, 29, 31],
        routes: {
            fromBAQ: "Estás en el punto de partida. Comienza explorando el Gran Malecón del Río y la Ciénaga de Mallorquín.",
            fromCTG: "Toma la Vía al Mar hacia el noreste durante aproximadamente 1 hora y 45 minutos (110-120 km) cruzando el Viaducto El Gran Manglar."
        }
    },
    {
        id: "puerto-colombia",
        name: "Puerto Colombia",
        image: "assets/images/puntos/foto-principal-para-la-pagina-m.p.webp",
        description: "Un municipio cargado de historia, hogar del muelle por donde entró el progreso al país. Ofrece una mezcla única de patrimonio arquitectónico y playas encantadoras.",
        pointsIds: [6, 7, 8, 9, 10, 26, 42, 43, 44, 59],
        routes: {
            fromBAQ: "A solo 15 minutos de Barranquilla por la Vía al Mar o la Autopista Norte.",
            fromCTG: "Toma la Vía al Mar hacia Barranquilla; Puerto Colombia está justo antes de llegar a la ciudad, a unos 90 minutos de Cartagena."
        }
    },
    {
        id: "tubara",
        name: "Tubará",
        image: "assets/images/puntos/foto-principal-para-la-pagina-m.t..webp",
        description: "Tierra de ancestros Mokaná, donde las montañas se encuentran con el mar. Ofrece miradores espectaculares y playas tranquilas como Puerto Velero.",
        pointsIds: [15, 27, 28, 45, 46, 60, 61],
        routes: {
            fromBAQ: "A unos 30-40 minutos por la Vía al Mar hacia el sur.",
            fromCTG: "Aproximadamente a 1 hora y 15 minutos por la Vía al Mar hacia el norte."
        }
    },
    {
        id: "juan-de-acosta",
        name: "Juan de Acosta",
        image: "assets/images/puntos/fotografia-para-la-pagina-d.n.webp",
        description: "Famoso por sus vientos constantes ideales para el Kitesurf en Salinas del Rey y la tranquilidad de sus playas como Santa Verónica.",
        pointsIds: [11, 12, 13, 14, 33],
        routes: {
            fromBAQ: "A unos 45 minutos por la Vía al Mar.",
            fromCTG: "A unos 60 minutos por la Vía al Mar."
        }
    },
    {
        id: "piojo",
        name: "Piojó",
        image: "assets/images/puntos/foto-principal-l.v.webp",
        description: "El punto más alto del Atlántico, un destino de naturaleza pura, bosques secos y vistas panorámicas inigualables desde el Cerro La Vieja.",
        pointsIds: [3, 4, 5, 40, 41, 57, 58],
        routes: {
            fromBAQ: "A 1 hora por la Vía al Mar, tomando el desvío hacia el interior.",
            fromCTG: "A unos 50 minutos por la Vía al Mar, entrando por la vía a Piojó."
        }
    },
    {
        id: "santa-catalina",
        name: "Santa Catalina",
        image: "assets/images/puntos/fotografia-para-la-pagina-vt.webp",
        description: "Hogar del famoso Volcán del Totumo y las Salinas de Galerazamba (Mar Rosado). Un encuentro mágico entre la geología y el mar.",
        pointsIds: [1, 2, 25, 39, 55, 56],
        routes: {
            fromBAQ: "A unos 50-60 minutos por la Vía al Mar hacia el sur.",
            fromCTG: "A unos 40-50 minutos por la Vía al Mar hacia el norte."
        }
    },
    {
        id: "cartagena",
        name: "Cartagena",
        image: "assets/images/puntos/puente-del-viaducto-el-gran-manglar.webp",
        description: "La joya de la corona, una ciudad amurallada que respira historia colonial en cada esquina, rodeada de lagunas, manglares y playas modernas.",
        pointsIds: [30, 32, 34, 35, 36, 37, 53, 54],
        routes: {
            fromBAQ: "Toma la Vía al Mar hacia el suroeste durante aproximadamente 1 hora y 45 minutos.",
            fromCTG: "Estás en el punto de partida. Explora el Centro Histórico, Manga y el nuevo Viaducto."
        }
    }
];

function renderMunicipiosGrid() {
    const grid = document.getElementById('municipios-grid');
    if (!grid) return;
    grid.innerHTML = '';

    municipiosData.forEach(muni => {
        const card = document.createElement('div');
        card.className = "group relative h-80 rounded-[2rem] overflow-hidden shadow-xl cursor-pointer transition-all hover:-translate-y-2";
        card.onclick = () => showMunicipioDetail(muni.id);
        
        card.innerHTML = `
            <img src="${muni.image}" class="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="${muni.name}">
            <div class="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent"></div>
            <div class="absolute bottom-6 left-6 right-6">
                <p class="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-1">Municipio</p>
                <h3 class="text-2xl font-black text-white uppercase tracking-tight leading-none">${muni.name}</h3>
                <div class="mt-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <span class="text-white/70 text-[11px] font-medium">Ver ruta y sitios</span>
                    <div class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                        <i class="fa-solid fa-arrow-right"></i>
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function showMunicipioDetail(muniId) {
    const muni = municipiosData.find(m => m.id === muniId);
    if (!muni) return;

    const detailView = document.getElementById('municipio-detail-view');
    const content = document.getElementById('municipio-detail-content');
    
    // Set municipality context
    activeMunicipalityContext = muniId;
    
    // Get points for this municipality
    const muniPoints = mockData.filter(p => muni.pointsIds.includes(p.id));

    content.innerHTML = `
        <div class="relative h-[40vh] md:h-[50vh] w-full">
            <img src="${muni.image}" class="w-full h-full object-cover" alt="${muni.name}">
            <div class="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
            <button onclick="window.showView('municipios')" class="absolute top-6 left-6 bg-white/80 backdrop-blur-md p-3 rounded-full text-gray-900 shadow-xl z-20 hover:bg-white transition-all">
                <i class="fa-solid fa-arrow-left"></i>
            </button>
        </div>

        <div class="max-w-4xl mx-auto px-6 -mt-32 relative z-10 pb-20">
            <div class="bg-white rounded-[3rem] shadow-2xl p-8 md:p-12 border border-gray-100">
                <h1 class="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter mb-6">${muni.name}</h1>
                <p class="text-xl text-gray-600 leading-relaxed mb-10 font-medium">
                    ${muni.description}
                </p>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div class="bg-blue-50 rounded-3xl p-6 border border-blue-100">
                        <h4 class="text-[#004a99] font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                            <i class="fa-solid fa-car"></i> Desde Barranquilla
                        </h4>
                        <p class="text-gray-700 text-sm leading-relaxed">${muni.routes.fromBAQ}</p>
                    </div>
                    <div class="bg-emerald-50 rounded-3xl p-6 border border-emerald-100">
                        <h4 class="text-emerald-700 font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                            <i class="fa-solid fa-car"></i> Desde Cartagena
                        </h4>
                        <p class="text-gray-700 text-sm leading-relaxed">${muni.routes.fromCTG}</p>
                    </div>
                </div>

                <div class="mb-8">
                    <h3 class="text-2xl font-black text-gray-900 uppercase tracking-tight mb-6">Puntos de Interés</h3>
                    <div class="space-y-4">
                        ${muniPoints.map(point => `
                            <div class="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer group" onclick="window.showPointOnMap(${point.id})">
                                <img src="${point.image}" class="w-20 h-20 rounded-xl object-cover shadow-md" alt="${point.title}">
                                <div class="flex-1">
                                    <h5 class="font-bold text-gray-900 group-hover:text-[#004a99] transition-colors">${point.title}</h5>
                                    <p class="text-xs text-gray-500 line-clamp-2 mt-1">${point.description}</p>
                                </div>
                                <i class="fa-solid fa-chevron-right text-gray-300 group-hover:text-blue-500 transition-all mr-2"></i>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <button onclick="window.showMunicipioPointsOnMap('${muni.id}')" class="w-full bg-[#004a99] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:shadow-2xl hover:shadow-blue-900/40 transition-all uppercase tracking-widest text-sm">
                    Ver todos en el mapa interactivo
                    <i class="fa-solid fa-map-location-dot"></i>
                </button>
            </div>
        </div>
    `;

    window.showView('municipio-detail');
}

window.showPointOnMap = function(pointId, fromMunicipio = true) {
    const point = mockData.find(p => p.id === pointId);
    if (!point) return;

    if (fromMunicipio) {
        // Marcamos que venimos de un municipio pero no cambiamos el contexto actual
    } else {
        activeMunicipalityContext = null;
    }

    window.showView('map');
    
    // Find the marker
    const marker = allMarkers.find(m => m.itemData.id === pointId);
    if (marker) {
        setTimeout(() => {
            map.flyTo([point.lat, point.lng], 15, { duration: 1.5 });
            marker.fire('click');
        }, 500);
    }
}

window.showMunicipioPointsOnMap = function(muniId) {
    const muni = municipiosData.find(m => m.id === muniId);
    if (!muni) return;

    activeMunicipalityContext = muniId;
    window.showView('map');
    if (window.closeSidePanel) window.closeSidePanel(false);

    // Desactivar filtros previos
    currentActiveFilter = 'todas';
    updateFilterUI();

    // Filtrar marcadores para mostrar solo los de este municipio
    allMarkers.forEach(marker => {
        if (muni.pointsIds.includes(marker.itemData.id)) {
            if (!markerGroup.hasLayer(marker)) markerGroup.addLayer(marker);
        } else {
            if (markerGroup.hasLayer(marker)) markerGroup.removeLayer(marker);
        }
    });

    if (Object.keys(markerGroup._layers).length > 0) {
        setTimeout(() => {
            map.flyToBounds(markerGroup.getBounds(), { padding: [80, 80], maxZoom: 12, duration: 1.5 });
        }, 500);
    }
}

window.resetMunicipalityContext = function() {
    activeMunicipalityContext = null;
}

// Initializers
renderMunicipiosGrid();

// Event listener for the card in routes view
document.addEventListener('DOMContentLoaded', () => {
    const cardMuni = document.getElementById('route-card-municipios');
    if (cardMuni) {
        cardMuni.addEventListener('click', () => {
            window.showView('municipios');
        });
    }
});
