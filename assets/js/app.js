/**
 * Inicialización del Mapa Leaflet
 * Configura la vista inicial, límites de zoom y controles personalizados.
 */
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

/**
 * Estado Global y Grupos de Marcadores
 * markerGroup: Grupo de Leaflet para gestionar la visibilidad de los pines.
 * allMarkers: Arreglo de referencia con todos los objetos marcador creados.
 * activeMunicipalityContext: Almacena el ID del municipio si se está explorando uno específico.
 */
const markerGroup = L.featureGroup().addTo(map);
let allMarkers = [];
let currentActiveFilter = 'todas';
let activeMunicipalityContext = null;
let activeRouteContext = null;
window.activeRoutePolyline = null;

window.clearActiveRoutePolyline = function() {
    if (window.activeRoutePolyline) {
        map.removeLayer(window.activeRoutePolyline);
        window.activeRoutePolyline = null;
    }
};

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
            if (activeRouteContext) {
                activeRouteContext = null;
                window.clearActiveRoutePolyline();
            }
            if (cat.subcategories) {
                renderFilters(cat.subcategories, true);
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

/**
 * Renderizado de Marcadores (Puntos de Interés)
 * Itera sobre mockData para crear marcadores físicos en el mapa.
 * Asocia eventos de clic para abrir el panel lateral con información detallada.
 */
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

/**
 * Lógica de Filtrado de Marcadores
 * Filtra la visibilidad de los marcadores basándose en la categoría seleccionada
 * o en el contexto de municipio activo.
 */

function filterMarkers() {
    // If we are in Itinerary Mode, let ItineraryPlanner handle it
    if (window.ItineraryPlanner && window.ItineraryPlanner.fullItinerary) {
        window.ItineraryPlanner.updateMapForDay(window.ItineraryPlanner.currentDayView);
        return;
    }

    if (activeRouteContext) {
        const ruta = rutasExistentes.find(r => r.id === activeRouteContext);
        if (ruta) {
            allMarkers.forEach(marker => {
                if (ruta.pointsIds.includes(marker.itemData.id)) {
                    if (!markerGroup.hasLayer(marker)) markerGroup.addLayer(marker);
                } else {
                    if (markerGroup.hasLayer(marker)) markerGroup.removeLayer(marker);
                }
            });
            return;
        }
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

                <!-- 2. Audioguide Section -->
                <div id="audio-wave" class="hidden items-center justify-between bg-blue-50/80 backdrop-blur-md p-4 rounded-2xl border border-blue-100 shadow-inner">
                    <div class="wave-container">
                        <div class="wave-bar"></div>
                        <div class="wave-bar"></div>
                        <div class="wave-bar"></div>
                        <div class="wave-bar"></div>
                        <div class="wave-bar"></div>
                        <div class="wave-bar"></div>
                        <div class="wave-bar"></div>
                        <div class="wave-bar"></div>
                        <div class="wave-bar"></div>
                        <div class="wave-bar"></div>
                    </div>
                    <div class="flex flex-col items-end">
                        <span class="text-[8px] font-black text-[#003087] uppercase tracking-[0.2em] mb-0.5">Audioguía Activa</span>
                        <span class="text-[10px] font-bold text-blue-500/60 tabular-nums" id="audio-timer">00:00</span>
                    </div>
                </div>

                <button id="narrate-btn" onclick="toggleNarration('${data.description.replace(/'/g, "\\'")}', this)" 
                        class="audioguide-btn w-full py-4 rounded-xl flex items-center justify-center gap-4 font-black text-[10px] uppercase tracking-[0.2em] shadow-sm group relative overflow-hidden">
                    <div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-300 relative z-10">
                        <i class="fa-solid fa-play text-[#003087] ml-0.5 transition-transform group-hover:scale-110" id="narrate-icon"></i>
                    </div>
                    <span class="relative z-10" id="narrate-text">Escuchar Audioguía</span>
                    <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 opacity-0 group-[.active]:opacity-100 transition-opacity duration-500"></div>
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
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
    if (window.audioInterval) {
        clearInterval(window.audioInterval);
        window.audioInterval = null;
    }
}

// Ensure panel is closed at start
closeSidePanel();

// 5. Accessibility Logic (TTS with UI Feedback)
let currentUtterance = null;
window.audioInterval = null;
let audioSeconds = 0;

window.toggleNarration = function(text, btn) {
    const wave = document.getElementById('audio-wave');
    const icon = document.getElementById('narrate-icon');
    const textSpan = document.getElementById('narrate-text');
    const timer = document.getElementById('audio-timer');
    
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        stopAudioUI(wave, btn, icon, textSpan);
        return;
    }

    if ('speechSynthesis' in window) {
        currentUtterance = new SpeechSynthesisUtterance(text);
        currentUtterance.lang = 'es-ES';
        currentUtterance.rate = 0.9; // Slightly slower for more professional feel
        
        currentUtterance.onstart = () => {
            wave.classList.remove('hidden');
            wave.classList.add('flex');
            btn.classList.add('active');
            icon.classList.replace('fa-play', 'fa-stop');
            icon.parentElement.classList.replace('bg-blue-50', 'bg-white/20');
            textSpan.innerText = 'Detener Audioguía';
            
            // Start timer
            audioSeconds = 0;
            timer.innerText = '00:00';
            window.audioInterval = setInterval(() => {
                audioSeconds++;
                const mins = Math.floor(audioSeconds / 60).toString().padStart(2, '0');
                const secs = (audioSeconds % 60).toString().padStart(2, '0');
                timer.innerText = `${mins}:${secs}`;
            }, 1000);
        };

        currentUtterance.onend = () => {
            stopAudioUI(wave, btn, icon, textSpan);
        };

        currentUtterance.onerror = () => {
            stopAudioUI(wave, btn, icon, textSpan);
        };

        window.speechSynthesis.speak(currentUtterance);
    } else {
        alert("Lo siento, tu navegador no soporta la lectura de voz.");
    }
}

function stopAudioUI(wave, btn, icon, textSpan) {
    if (!wave) return;
    wave.classList.add('hidden');
    wave.classList.remove('flex');
    btn.classList.remove('active');
    icon.classList.replace('fa-stop', 'fa-play');
    icon.parentElement.classList.replace('bg-white/20', 'bg-blue-50');
    textSpan.innerText = 'Escuchar Audioguía';
    
    if (window.audioInterval) {
        clearInterval(window.audioInterval);
        window.audioInterval = null;
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
        image: "assets/images/puntos/foto-principal-para-la-pagina-m.t.webp",
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
    },
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
                        <h4 class="text-[#003087] font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
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
                                    <h5 class="font-bold text-gray-900 group-hover:text-[#003087] transition-colors">${point.title}</h5>
                                    <p class="text-xs text-gray-500 line-clamp-2 mt-1">${point.description}</p>
                                </div>
                                <i class="fa-solid fa-chevron-right text-gray-300 group-hover:text-blue-500 transition-all mr-2"></i>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <button onclick="window.showMunicipioPointsOnMap('${muni.id}')" class="w-full bg-[#003087] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:shadow-2xl hover:shadow-blue-900/40 transition-all uppercase tracking-widest text-sm">
                    Ver todos en el mapa interactivo
                    <i class="fa-solid fa-map-location-dot"></i>
                </button>
            </div>
        </div>
    `;

    window.showView('municipio-detail');
}

/**
 * Función para navegar y centrar un punto específico desde una lista.
 * Utilizada principalmente desde la vista de municipios.
 */
window.showPointOnMap = function(pointId, fromMunicipio = true) {
    const point = mockData.find(p => p.id === pointId);
    if (!point) return;

    if (activeRouteContext && !fromMunicipio) {
        activeRouteContext = null;
        window.clearActiveRoutePolyline();
    }

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

/**
 * Filtra el mapa para mostrar EXCLUSIVAMENTE los puntos de un municipio.
 * Realiza un zoom fit para encuadrar todos los sitios pertenecientes.
 */
window.showMunicipioPointsOnMap = function(muniId) {
    const muni = municipiosData.find(m => m.id === muniId);
    if (!muni) return;

    if (activeRouteContext) {
        activeRouteContext = null;
        window.clearActiveRoutePolyline();
    }

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

function renderExistentesGrid() {
    const grid = document.getElementById('existentes-grid');
    if (!grid) return;
    grid.innerHTML = '';

    rutasExistentes.forEach(ruta => {
        const card = document.createElement('div');
        card.className = "bg-white rounded-[2rem] overflow-hidden shadow-lg border border-gray-100 flex flex-col h-full hover:shadow-2xl hover:-translate-y-1 transition-all duration-300";
        
        card.innerHTML = `
            <div class="relative h-48 w-full overflow-hidden">
                <img src="${ruta.imagen}" class="w-full h-full object-cover transition-transform duration-700 hover:scale-105" alt="${ruta.nombre}">
                <span class="absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md z-10">${ruta.categoria}</span>
            </div>
            <div class="p-6 flex-1 flex flex-col justify-between">
                <div>
                    <h3 class="text-xl font-bold text-gray-900 leading-snug mb-3">${ruta.nombre}</h3>
                    <p class="text-xs text-gray-500 line-clamp-3 mb-4 leading-relaxed">${ruta.descripcion}</p>
                    <div class="space-y-2 mb-6">
                        <div class="flex items-start gap-2">
                            <i class="fa-solid fa-map-pin text-[#003087] mt-0.5 text-xs"></i>
                            <span class="text-xs text-gray-700"><strong>Ubicación:</strong> ${ruta.ubicacion}</span>
                        </div>
                        <div class="flex items-start gap-2">
                            <i class="fa-solid fa-star text-amber-500 mt-0.5 text-xs"></i>
                            <span class="text-xs text-gray-700"><strong>Destacado:</strong> ${ruta.puntosDestacados}</span>
                        </div>
                    </div>
                </div>
                <button onclick="window.showRoutePointsOnMap('${ruta.id}')" class="w-full bg-[#003087] hover:bg-[#003d80] text-white font-black py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all uppercase tracking-wider text-xs shadow-md">
                    Ver ruta en el mapa
                    <i class="fa-solid fa-map-location-dot"></i>
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

window.showRoutePointsOnMap = function(routeId) {
    const ruta = rutasExistentes.find(r => r.id === routeId);
    if (!ruta) return;

    activeRouteContext = routeId;
    activeMunicipalityContext = null;
    currentActiveFilter = 'todas';
    updateFilterUI();

    window.showView('map');
    if (window.closeSidePanel) window.closeSidePanel(false);
    if (window.ItineraryPlanner) {
        window.ItineraryPlanner.resetToMainMap();
    }

    window.clearActiveRoutePolyline();

    // Filter markers
    allMarkers.forEach(marker => {
        if (ruta.pointsIds.includes(marker.itemData.id)) {
            if (!markerGroup.hasLayer(marker)) markerGroup.addLayer(marker);
        } else {
            if (markerGroup.hasLayer(marker)) markerGroup.removeLayer(marker);
        }
    });

    // Draw route polyline linking points in order
    const routePoints = ruta.pointsIds.map(id => mockData.find(p => p.id === id)).filter(p => p !== undefined);
    const latlngs = routePoints.map(p => [p.lat, p.lng]);
    if (latlngs.length > 0) {
        window.activeRoutePolyline = L.polyline(latlngs, {
            color: '#003087',
            weight: 6,
            opacity: 0.8,
            dashArray: '8, 12',
            lineCap: 'round',
            lineJoin: 'round'
        }).addTo(map);
        
        setTimeout(() => {
            map.flyToBounds(markerGroup.getBounds(), { padding: [100, 100], duration: 1.5 });
        }, 500);
    }

    renderRouteSidebar(ruta);
};

function renderRouteSidebar(ruta) {
    const filterContainer = document.getElementById('filter-container');
    if (!filterContainer) return;

    const routePoints = ruta.pointsIds.map(id => mockData.find(p => p.id === id)).filter(p => p !== undefined);

    filterContainer.innerHTML = `
        <div class="space-y-6">
            <div class="flex items-center justify-between border-b pb-4">
                <button onclick="window.exitRouteView()" class="text-xs font-black text-gray-400 hover:text-[#003087] flex items-center gap-2 group transition-colors px-1">
                    <i class="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> SALIR
                </button>
                <span class="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded shadow-sm border border-blue-100 uppercase">${ruta.categoria}</span>
            </div>
            <div class="space-y-2">
                <h3 class="text-xl font-black text-gray-900 leading-snug">${ruta.nombre}</h3>
                <p class="text-[11px] text-gray-500 leading-relaxed">${ruta.descripcion}</p>
            </div>
            <div class="space-y-1">
                <span class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Paradas en la ruta (${routePoints.length})</span>
            </div>
            <div class="space-y-3">
                ${routePoints.map((item, idx) => `
                    <div onclick="window.focusRoutePoint(${item.id})" class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#003087]/20 transition-all cursor-pointer group relative overflow-hidden">
                        <div class="absolute left-0 top-0 bottom-0 w-1 bg-gray-100 group-hover:bg-[#003087] transition-colors"></div>
                        <div class="flex justify-between items-start">
                            <div class="max-w-[85%]">
                                <p class="font-bold text-gray-800 text-sm group-hover:text-[#003087] transition-colors">${item.title}</p>
                                <p class="text-[10px] text-gray-400 font-medium mt-0.5">${item.location}</p>
                            </div>
                            <span class="text-[10px] font-black text-gray-300">#${idx + 1}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

window.exitRouteView = function() {
    activeRouteContext = null;
    window.clearActiveRoutePolyline();
    
    // reset sidebar and map to default
    currentActiveFilter = 'todas';
    renderFilters();
    updateFilterUI();
    filterMarkers();
    closeSidePanel();
    
    // open the existentes selection view again
    window.showView('existentes');
};

window.focusRoutePoint = function(id) {
    const marker = allMarkers.find(m => m.itemData.id === id);
    if (marker) {
        marker.fire('click');
        map.setView(marker.getLatLng(), 14);
        setTimeout(() => {
            const mapElement = document.getElementById('map');
            if (mapElement && window.innerWidth < 768) {
                mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    }
};

// Initializers
renderMunicipiosGrid();
renderExistentesGrid();

// Event listener for the card in routes view
document.addEventListener('DOMContentLoaded', () => {
    const cardMuni = document.getElementById('route-card-municipios');
    if (cardMuni) {
        cardMuni.addEventListener('click', () => {
            window.showView('municipios');
        });
    }
    const cardExistentes = document.getElementById('route-card-existentes');
    if (cardExistentes) {
        cardExistentes.addEventListener('click', () => {
            window.showView('existentes');
        });
    }
});


// Rutas optimizadas exportadas para tu otro proyecto

const viaAlMarCoords = [
  [11.010407, -74.837996],
  [11.010425, -74.838029],
  [11.011469, -74.839998],
  [11.011718, -74.840480],
  [11.012517, -74.842003],
  [11.012593, -74.842141],
  [11.012839, -74.842555],
  [11.013102, -74.843057],
  [11.014117, -74.844942],
  [11.014471, -74.845623],
  [11.014704, -74.846098],
  [11.014721, -74.846130],
  [11.014947, -74.846557],
  [11.014968, -74.846595],
  [11.015207, -74.847038],
  [11.015236, -74.847092],
  [11.015967, -74.848409],
  [11.016241, -74.848946],
  [11.016466, -74.849487],
  [11.016639, -74.849918],
  [11.016824, -74.850424],
  [11.016940, -74.850840],
  [11.017050, -74.851337],
  [11.017107, -74.851670],
  [11.017190, -74.852350],
  [11.017215, -74.852702],
  [11.017228, -74.853033],
  [11.017228, -74.853591],
  [11.017187, -74.854281],
  [11.016850, -74.857024],
  [11.016562, -74.859249],
  [11.016476, -74.859939],
  [11.016441, -74.860224],
  [11.016384, -74.860671],
  [11.016179, -74.862346],
  [11.016166, -74.862476],
  [11.015728, -74.865974],
  [11.015725, -74.865995],
  [11.015493, -74.867801],
  [11.015430, -74.868152],
  [11.015230, -74.869717],
  [11.015114, -74.870621],
  [11.015107, -74.870677],
  [11.015040, -74.871201],
  [11.015017, -74.871379],
  [11.014800, -74.873077],
  [11.014674, -74.874274],
  [11.014559, -74.875063],
  [11.014439, -74.876074],
  [11.014432, -74.876125],
  [11.014411, -74.876284],
  [11.014327, -74.876937],
  [11.014204, -74.877828],
  [11.014187, -74.877949],
  [11.014077, -74.878744],
  [11.014069, -74.878810],
  [11.014033, -74.879139],
  [11.013956, -74.879784],
  [11.013751, -74.881541],
  [11.013500, -74.883551],
  [11.013464, -74.883879],
  [11.013314, -74.885254],
  [11.013235, -74.885785],
  [11.012977, -74.887812],
  [11.012832, -74.889103],
  [11.012785, -74.889533],
  [11.012776, -74.889607],
  [11.012605, -74.890935],
  [11.012587, -74.891071],
  [11.012367, -74.892870],
  [11.012282, -74.893563],
  [11.011914, -74.896592],
  [11.011895, -74.896739],
  [11.011835, -74.897308],
  [11.011765, -74.897838],
  [11.011737, -74.898054],
  [11.011606, -74.899128],
  [11.011140, -74.902942],
  [11.010752, -74.906108],
  [11.010435, -74.908700],
  [11.010311, -74.909512],
  [11.010195, -74.910062],
  [11.010123, -74.910402],
  [11.010094, -74.910521],
  [11.009954, -74.911016],
  [11.009942, -74.911055],
  [11.009775, -74.911586],
  [11.009592, -74.912111],
  [11.009546, -74.912241],
  [11.009439, -74.912484],
  [11.009406, -74.912560],
  [11.009070, -74.913230],
  [11.008868, -74.913605],
  [11.008468, -74.914279],
  [11.007481, -74.915937],
  [11.007146, -74.916500],
  [11.006841, -74.916952],
  [11.005786, -74.918699],
  [11.004733, -74.920463],
  [11.004460, -74.920923],
  [11.004408, -74.921020],
  [11.004308, -74.921178],
  [11.001990, -74.925060],
  [11.001239, -74.926366],
  [11.001030, -74.926710],
  [11.000849, -74.927008],
  [11.000770, -74.927139],
  [11.000602, -74.927471],
  [11.000317, -74.928115],
  [11.000102, -74.928689],
  [10.999844, -74.929628],
  [10.999313, -74.932186],
  [10.998806, -74.934998],
  [10.998577, -74.936145],
  [10.998479, -74.936639],
  [10.997616, -74.941080],
  [10.997499, -74.941570],
  [10.997399, -74.941815],
  [10.997279, -74.942038],
  [10.997151, -74.942228],
  [10.997047, -74.942360],
  [10.996934, -74.942483],
  [10.996733, -74.942667],
  [10.996570, -74.942788],
  [10.995158, -74.943737],
  [10.994447, -74.944197],
  [10.994355, -74.944249],
  [10.994040, -74.944426],
  [10.993736, -74.944539],
  [10.993414, -74.944629],
  [10.993098, -74.944692],
  [10.992561, -74.944739],
  [10.992323, -74.944738],
  [10.992025, -74.944724],
  [10.991912, -74.944710],
  [10.991575, -74.944660],
  [10.991291, -74.944578],
  [10.990686, -74.944430],
  [10.989697, -74.944155],
  [10.989019, -74.943996],
  [10.988193, -74.943898],
  [10.985729, -74.943628],
  [10.984829, -74.943538],
  [10.983912, -74.943477],
  [10.983431, -74.943508],
  [10.982890, -74.943605],
  [10.982380, -74.943735],
  [10.981652, -74.943999],
  [10.980916, -74.944252],
  [10.980021, -74.944556],
  [10.979733, -74.944633],
  [10.979564, -74.944678],
  [10.979241, -74.944764],
  [10.979057, -74.944796],
  [10.978857, -74.944821],
  [10.978680, -74.944838],
  [10.978383, -74.944863],
  [10.977947, -74.944900],
  [10.977588, -74.944943],
  [10.977232, -74.945006],
  [10.973736, -74.945919],
  [10.973333, -74.946045],
  [10.972736, -74.946286],
  [10.972435, -74.946460],
  [10.972155, -74.946649],
  [10.971650, -74.947081],
  [10.971329, -74.947453],
  [10.970800, -74.948205],
  [10.970282, -74.948946],
  [10.969225, -74.950475],
  [10.968377, -74.951736],
  [10.968212, -74.952028],
  [10.968057, -74.952340],
  [10.967937, -74.952688],
  [10.967828, -74.953095],
  [10.967790, -74.953469],
  [10.967776, -74.954001],
  [10.967784, -74.955252],
  [10.967819, -74.955645],
  [10.967826, -74.955783],
  [10.967832, -74.955921],
  [10.967834, -74.956041],
  [10.967835, -74.956076],
  [10.967835, -74.956123],
  [10.967835, -74.956198],
  [10.967834, -74.956336],
  [10.967830, -74.956474],
  [10.967823, -74.956612],
  [10.967819, -74.956753],
  [10.967799, -74.956954],
  [10.967782, -74.957104],
  [10.967768, -74.957218],
  [10.967745, -74.957385],
  [10.967695, -74.957693],
  [10.967443, -74.958800],
  [10.967417, -74.958916],
  [10.967275, -74.959452],
  [10.966145, -74.967726],
  [10.966077, -74.968654],
  [10.966109, -74.969700],
  [10.966209, -74.970403],
  [10.966413, -74.971559],
  [10.966510, -74.972191],
  [10.966517, -74.972241],
  [10.967534, -74.978990],
  [10.967718, -74.980315],
  [10.968542, -74.985789],
  [10.968629, -74.986742],
  [10.968621, -74.988083],
  [10.968515, -74.990211],
  [10.968449, -74.991280],
  [10.968372, -74.992390],
  [10.968335, -74.992676],
  [10.968273, -74.993006],
  [10.968197, -74.993337],
  [10.968094, -74.993680],
  [10.968015, -74.993928],
  [10.967936, -74.994129],
  [10.967778, -74.994513],
  [10.967612, -74.994832],
  [10.967441, -74.995113],
  [10.967241, -74.995428],
  [10.967120, -74.995591],
  [10.967025, -74.995720],
  [10.966927, -74.995846],
  [10.966790, -74.996014],
  [10.966590, -74.996222],
  [10.966330, -74.996470],
  [10.965242, -74.997411],
  [10.964114, -74.998366],
  [10.962586, -74.999674],
  [10.962552, -74.999698],
  [10.962325, -74.999886],
  [10.961994, -75.000103],
  [10.961557, -75.000314],
  [10.959469, -75.001154],
  [10.959223, -75.001304],
  [10.958980, -75.001492],
  [10.958201, -75.002267],
  [10.957710, -75.002760],
  [10.957303, -75.003147],
  [10.957155, -75.003260],
  [10.956926, -75.003393],
  [10.956789, -75.003466],
  [10.956621, -75.003539],
  [10.956404, -75.003623],
  [10.956140, -75.003682],
  [10.953810, -75.004013],
  [10.953124, -75.004075],
  [10.952779, -75.004097],
  [10.952589, -75.004099],
  [10.952392, -75.004095],
  [10.952176, -75.004071],
  [10.951897, -75.004030],
  [10.951670, -75.003971],
  [10.950472, -75.003606],
  [10.950217, -75.003531],
  [10.949928, -75.003465],
  [10.949630, -75.003432],
  [10.949382, -75.003431],
  [10.949132, -75.003454],
  [10.948788, -75.003527],
  [10.948357, -75.003668],
  [10.948173, -75.003764],
  [10.947907, -75.003914],
  [10.947028, -75.004531],
  [10.945806, -75.005340],
  [10.944996, -75.005915],
  [10.944618, -75.006245],
  [10.944416, -75.006496],
  [10.944346, -75.006586],
  [10.943803, -75.007364],
  [10.943675, -75.007630],
  [10.943544, -75.007903],
  [10.943393, -75.008360],
  [10.943247, -75.008954],
  [10.942590, -75.011996],
  [10.942469, -75.012598],
  [10.942393, -75.013207],
  [10.942364, -75.013821],
  [10.942397, -75.014435],
  [10.942695, -75.016644],
  [10.942734, -75.017132],
  [10.942696, -75.017591],
  [10.942601, -75.018012],
  [10.942480, -75.018387],
  [10.942302, -75.018787],
  [10.942072, -75.019171],
  [10.941905, -75.019407],
  [10.941576, -75.019728],
  [10.941403, -75.019888],
  [10.940942, -75.020235],
  [10.940270, -75.020715],
  [10.936784, -75.023242],
  [10.936382, -75.023492],
  [10.935897, -75.023717],
  [10.935543, -75.023822],
  [10.935125, -75.023900],
  [10.934694, -75.023923],
  [10.934243, -75.023878],
  [10.933853, -75.023792],
  [10.933140, -75.023540],
  [10.932846, -75.023414],
  [10.930742, -75.022550],
  [10.930728, -75.022661],
  [10.930800, -75.023189],
  [10.930796, -75.024095],
  [10.930768, -75.024455],
  [10.930594, -75.025277],
  [10.930530, -75.026017],
  [10.929639, -75.026372],
  [10.928899, -75.026729],
  [10.928516, -75.026855],
  [10.928188, -75.026879],
  [10.928340, -75.027555],
  [10.928419, -75.027781],
  [10.928625, -75.028097],
  [10.928783, -75.028226],
  [10.928883, -75.028360],
  [10.928885, -75.028481],
  [10.928833, -75.028915],
  [10.928949, -75.029650],
  [10.929041, -75.029980],
  [10.929265, -75.030382],
  [10.929309, -75.030667],
  [10.929307, -75.030814],
  [10.929209, -75.031034],
  [10.928851, -75.031423],
  [10.928722, -75.031603],
  [10.928635, -75.031780],
  [10.928609, -75.031900],
  [10.928477, -75.032040],
  [10.928261, -75.032193],
  [10.928174, -75.032284],
  [10.928151, -75.032338],
  [10.928138, -75.032405],
  [10.928172, -75.032654],
  [10.928095, -75.033209],
  [10.928077, -75.033392],
  [10.928008, -75.033507],
  [10.927943, -75.033655],
  [10.927906, -75.033773],
  [10.927848, -75.033808],
  [10.927782, -75.033821],
  [10.927706, -75.033778],
  [10.927595, -75.033711],
  [10.927500, -75.033711],
  [10.927408, -75.033743],
  [10.927313, -75.033799],
  [10.927229, -75.033829],
  [10.927087, -75.033813],
  [10.926837, -75.033689],
  [10.926663, -75.033614],
  [10.926597, -75.033547],
  [10.926526, -75.033480],
  [10.926597, -75.033547],
  [10.926663, -75.033614],
  [10.926837, -75.033689],
  [10.927087, -75.033813],
  [10.927087, -75.033813],
  [10.927229, -75.033829],
  [10.927313, -75.033799],
  [10.927408, -75.033743],
  [10.927500, -75.033711],
  [10.927595, -75.033711],
  [10.927706, -75.033778],
  [10.927782, -75.033821],
  [10.927848, -75.033808],
  [10.927906, -75.033773],
  [10.927943, -75.033655],
  [10.928008, -75.033507],
  [10.928077, -75.033392],
  [10.928095, -75.033209],
  [10.928172, -75.032654],
  [10.928138, -75.032405],
  [10.928151, -75.032338],
  [10.928174, -75.032284],
  [10.928261, -75.032193],
  [10.928477, -75.032040],
  [10.928609, -75.031900],
  [10.928635, -75.031780],
  [10.928722, -75.031603],
  [10.928851, -75.031423],
  [10.929209, -75.031034],
  [10.929307, -75.030814],
  [10.929309, -75.030667],
  [10.929265, -75.030382],
  [10.929041, -75.029980],
  [10.928949, -75.029650],
  [10.928833, -75.028915],
  [10.928885, -75.028481],
  [10.928883, -75.028360],
  [10.928783, -75.028226],
  [10.928625, -75.028097],
  [10.928419, -75.027781],
  [10.928340, -75.027555],
  [10.928188, -75.026879],
  [10.928516, -75.026855],
  [10.928899, -75.026729],
  [10.929639, -75.026372],
  [10.930530, -75.026017],
  [10.930594, -75.025277],
  [10.930768, -75.024455],
  [10.930796, -75.024095],
  [10.930800, -75.023189],
  [10.930728, -75.022661],
  [10.930742, -75.022550],
  [10.930654, -75.022517],
  [10.928788, -75.021724],
  [10.927758, -75.021292],
  [10.927318, -75.021113],
  [10.926860, -75.020954],
  [10.926423, -75.020835],
  [10.926052, -75.020771],
  [10.925620, -75.020724],
  [10.925054, -75.020724],
  [10.924480, -75.020790],
  [10.923949, -75.020880],
  [10.922424, -75.021208],
  [10.919773, -75.021787],
  [10.919267, -75.021893],
  [10.918981, -75.021956],
  [10.918691, -75.022037],
  [10.918369, -75.022150],
  [10.917898, -75.022360],
  [10.917545, -75.022551],
  [10.917194, -75.022815],
  [10.916962, -75.023029],
  [10.916659, -75.023317],
  [10.916299, -75.023772],
  [10.916130, -75.023991],
  [10.915682, -75.024575],
  [10.913957, -75.026822],
  [10.913706, -75.027120],
  [10.913488, -75.027359],
  [10.913259, -75.027592],
  [10.912859, -75.027919],
  [10.912409, -75.028214],
  [10.912093, -75.028373],
  [10.911794, -75.028491],
  [10.911449, -75.028601],
  [10.910917, -75.028727],
  [10.910426, -75.028821],
  [10.910063, -75.028880],
  [10.906822, -75.029452],
  [10.906160, -75.029562],
  [10.905621, -75.029685],
  [10.905226, -75.029820],
  [10.904820, -75.030024],
  [10.904489, -75.030248],
  [10.904008, -75.030659],
  [10.903240, -75.031470],
  [10.902966, -75.031769],
  [10.901761, -75.033084],
  [10.901096, -75.033779],
  [10.900997, -75.033885],
  [10.899815, -75.035139],
  [10.899319, -75.035627],
  [10.898776, -75.036172],
  [10.898434, -75.036466],
  [10.896267, -75.038218],
  [10.895445, -75.038933],
  [10.894921, -75.039480],
  [10.894532, -75.040002],
  [10.894336, -75.040282],
  [10.894077, -75.040649],
  [10.893391, -75.041567],
  [10.892980, -75.042165],
  [10.892551, -75.042779],
  [10.892314, -75.043281],
  [10.892174, -75.043732],
  [10.892082, -75.044145],
  [10.892032, -75.044560],
  [10.892014, -75.044785],
  [10.892005, -75.044897],
  [10.891968, -75.045355],
  [10.891929, -75.045949],
  [10.891918, -75.046138],
  [10.891905, -75.046355],
  [10.891894, -75.046474],
  [10.891827, -75.047451],
  [10.891791, -75.047743],
  [10.891706, -75.048273],
  [10.891659, -75.048498],
  [10.891550, -75.048876],
  [10.891083, -75.050438],
  [10.890994, -75.050734],
  [10.890923, -75.050984],
  [10.890843, -75.051264],
  [10.890715, -75.051713],
  [10.890629, -75.052013],
  [10.890612, -75.052073],
  [10.890481, -75.052524],
  [10.890375, -75.052883],
  [10.890302, -75.053126],
  [10.889847, -75.054677],
  [10.889556, -75.055670],
  [10.889445, -75.056047],
  [10.889328, -75.056445],
  [10.889243, -75.056736],
  [10.889095, -75.057239],
  [10.888341, -75.059812],
  [10.888217, -75.060110],
  [10.888160, -75.060244],
  [10.887965, -75.060699],
  [10.887378, -75.061968],
  [10.887154, -75.062467],
  [10.886917, -75.063073],
  [10.886653, -75.064108],
  [10.886571, -75.064467],
  [10.886292, -75.065691],
  [10.886174, -75.066184],
  [10.885968, -75.066657],
  [10.885742, -75.067056],
  [10.885410, -75.067493],
  [10.884973, -75.067903],
  [10.883394, -75.069168],
  [10.883347, -75.069206],
  [10.882843, -75.069606],
  [10.881924, -75.070317],
  [10.880922, -75.071137],
  [10.880710, -75.071346],
  [10.880663, -75.071394],
  [10.880334, -75.071725],
  [10.879900, -75.072396],
  [10.879571, -75.073064],
  [10.879478, -75.073268],
  [10.879272, -75.073778],
  [10.878950, -75.074486],
  [10.877948, -75.076908],
  [10.877787, -75.077293],
  [10.877610, -75.077711],
  [10.877267, -75.078573],
  [10.876690, -75.079881],
  [10.876422, -75.080478],
  [10.876153, -75.081085],
  [10.875905, -75.081589],
  [10.875724, -75.081933],
  [10.875625, -75.082083],
  [10.875507, -75.082257],
  [10.875274, -75.082585],
  [10.874742, -75.083292],
  [10.873380, -75.084954],
  [10.873331, -75.085009],
  [10.870537, -75.088417],
  [10.870184, -75.088856],
  [10.870153, -75.088885],
  [10.869818, -75.089323],
  [10.869492, -75.089763],
  [10.868446, -75.091295],
  [10.868438, -75.091308],
  [10.868020, -75.091951],
  [10.867878, -75.092170],
  [10.867172, -75.093184],
  [10.866082, -75.094852],
  [10.865642, -75.095636],
  [10.865428, -75.096100],
  [10.865154, -75.096847],
  [10.864043, -75.100259],
  [10.862874, -75.103963],
  [10.862594, -75.104615],
  [10.861818, -75.106023],
  [10.860908, -75.107634],
  [10.860716, -75.107976],
  [10.860131, -75.109060],
  [10.859852, -75.109882],
  [10.859766, -75.110421],
  [10.859712, -75.110914],
  [10.859699, -75.111369],
  [10.859767, -75.112062],
  [10.859939, -75.113626],
  [10.860313, -75.116916],
  [10.860323, -75.117542],
  [10.860285, -75.117987],
  [10.860185, -75.118526],
  [10.860059, -75.118994],
  [10.859895, -75.119417],
  [10.858546, -75.122428],
  [10.858438, -75.122671],
  [10.858173, -75.123262],
  [10.857937, -75.123773],
  [10.857741, -75.124142],
  [10.857526, -75.124464],
  [10.857177, -75.124866],
  [10.856708, -75.125263],
  [10.856504, -75.125416],
  [10.856240, -75.125571],
  [10.855843, -75.125748],
  [10.852554, -75.127239],
  [10.849481, -75.128630],
  [10.848720, -75.128976],
  [10.848173, -75.129278],
  [10.847779, -75.129560],
  [10.847410, -75.129908],
  [10.847097, -75.130246],
  [10.846837, -75.130651],
  [10.846602, -75.131099],
  [10.846354, -75.131740],
  [10.845321, -75.134915],
  [10.845160, -75.135380],
  [10.844976, -75.135970],
  [10.844735, -75.136536],
  [10.844441, -75.136985],
  [10.844115, -75.137384],
  [10.843821, -75.137671],
  [10.843527, -75.137935],
  [10.843248, -75.138131],
  [10.842881, -75.138339],
  [10.842429, -75.138538],
  [10.832709, -75.142700],
  [10.832615, -75.142740],
  [10.831472, -75.143224],
  [10.831100, -75.143388],
  [10.830768, -75.143582],
  [10.830361, -75.143892],
  [10.829939, -75.144284],
  [10.829752, -75.144516],
  [10.829445, -75.145071],
  [10.829086, -75.145931],
  [10.827893, -75.149721],
  [10.826783, -75.153312],
  [10.825890, -75.156191],
  [10.825698, -75.156703],
  [10.825440, -75.157393],
  [10.825395, -75.157476],
  [10.825152, -75.157924],
  [10.824864, -75.158355],
  [10.824510, -75.158765],
  [10.824080, -75.159179],
  [10.822766, -75.160220],
  [10.820168, -75.162216],
  [10.811867, -75.168600],
  [10.810046, -75.169975],
  [10.808941, -75.170802],
  [10.808104, -75.171429],
  [10.807285, -75.172150],
  [10.806834, -75.172657],
  [10.806318, -75.173344],
  [10.805268, -75.174987],
  [10.801792, -75.180425],
  [10.800480, -75.182464],
  [10.800029, -75.183030],
  [10.799613, -75.183384],
  [10.799559, -75.183421],
  [10.799223, -75.183657],
  [10.798718, -75.183904],
  [10.792128, -75.186216],
  [10.789793, -75.187035],
  [10.787541, -75.187817],
  [10.785443, -75.188545],
  [10.784920, -75.188768],
  [10.784389, -75.189091],
  [10.783907, -75.189526],
  [10.783608, -75.189876],
  [10.783278, -75.190359],
  [10.781406, -75.193270],
  [10.779775, -75.195773],
  [10.778882, -75.197162],
  [10.777725, -75.198911],
  [10.776808, -75.200365],
  [10.775673, -75.202134],
  [10.775431, -75.202502],
  [10.774500, -75.203921],
  [10.774010, -75.204683],
  [10.773678, -75.205236],
  [10.773456, -75.205649],
  [10.773237, -75.206141],
  [10.773100, -75.206583],
  [10.772981, -75.207035],
  [10.772086, -75.210998],
  [10.771996, -75.211401],
  [10.771960, -75.211557],
  [10.770457, -75.217933],
  [10.769942, -75.220119],
  [10.769033, -75.224006],
  [10.768184, -75.227609],
  [10.767432, -75.230671],
  [10.767081, -75.232030],
  [10.766729, -75.232814],
  [10.766401, -75.233396],
  [10.766025, -75.233941],
  [10.762518, -75.238838],
  [10.762078, -75.239452],
  [10.759549, -75.243093],
  [10.759397, -75.243305],
  [10.758864, -75.244051],
  [10.758287, -75.244685],
  [10.758053, -75.244903],
  [10.757787, -75.245099],
  [10.757452, -75.245377],
  [10.756832, -75.245758],
  [10.755122, -75.246756],
  [10.749403, -75.250053],
  [10.749087, -75.250232],
  [10.743971, -75.253107],
  [10.742988, -75.253721],
  [10.742519, -75.254066],
  [10.742116, -75.254484],
  [10.741802, -75.254943],
  [10.741609, -75.255333],
  [10.741483, -75.255687],
  [10.741359, -75.256289],
  [10.740891, -75.258167],
  [10.740719, -75.258749],
  [10.740555, -75.259094],
  [10.740348, -75.259408],
  [10.740265, -75.259515],
  [10.740149, -75.259650],
  [10.740011, -75.259791],
  [10.739888, -75.259901],
  [10.739325, -75.260278],
  [10.738835, -75.260572],
  [10.738751, -75.260619],
  [10.738415, -75.260807],
  [10.738179, -75.260940],
  [10.737617, -75.261257],
  [10.737058, -75.261572],
  [10.736502, -75.261882],
  [10.735941, -75.262198],
  [10.735658, -75.262359],
  [10.735575, -75.262403],
  [10.735379, -75.262513],
  [10.735119, -75.262660],
  [10.733880, -75.263357],
  [10.733250, -75.263711],
  [10.733106, -75.263791],
  [10.732272, -75.264259],
  [10.732203, -75.264298],
  [10.731415, -75.264739],
  [10.731241, -75.264839],
  [10.731055, -75.264944],
  [10.730703, -75.265141],
  [10.729538, -75.265820],
  [10.729189, -75.266015],
  [10.728587, -75.266353],
  [10.727995, -75.266672],
  [10.725861, -75.267646],
  [10.717034, -75.271462],
  [10.716458, -75.271757],
  [10.715845, -75.272114],
  [10.714952, -75.272675],
  [10.711938, -75.274689],
  [10.711484, -75.274982],
  [10.711019, -75.275292],
  [10.706718, -75.278139],
  [10.704024, -75.279964],
  [10.703270, -75.280521],
  [10.702539, -75.281142],
  [10.701855, -75.281812],
  [10.701212, -75.282596],
  [10.700591, -75.283450],
  [10.699470, -75.285221],
  [10.698026, -75.287514],
  [10.696313, -75.290257],
  [10.696181, -75.290460],
  [10.694818, -75.292627],
  [10.689119, -75.301684],
  [10.686555, -75.305759],
  [10.684871, -75.308471],
  [10.684100, -75.309703],
  [10.682438, -75.312358],
  [10.680031, -75.316170],
  [10.679436, -75.317023],
  [10.678626, -75.318184],
  [10.677620, -75.319629],
  [10.677133, -75.320333],
  [10.676678, -75.321086],
  [10.676443, -75.321626],
  [10.676346, -75.321851],
  [10.675086, -75.324828],
  [10.674768, -75.325651],
  [10.674583, -75.326380],
  [10.674488, -75.327201],
  [10.674330, -75.329443],
  [10.674255, -75.330590],
  [10.674170, -75.331230],
  [10.674016, -75.331739],
  [10.673769, -75.332262],
  [10.673424, -75.332818],
  [10.671533, -75.334856],
  [10.670482, -75.336035],
  [10.668387, -75.338195],
  [10.667872, -75.338681],
  [10.667363, -75.339108],
  [10.666512, -75.339711],
  [10.664026, -75.341275],
  [10.662713, -75.342078],
  [10.661444, -75.342877],
  [10.661050, -75.343230],
  [10.660654, -75.343642],
  [10.660356, -75.344061],
  [10.660101, -75.344550],
  [10.659880, -75.345157],
  [10.659713, -75.345773],
  [10.659406, -75.346985],
  [10.659025, -75.348854],
  [10.658547, -75.351048],
  [10.658095, -75.353529],
  [10.658081, -75.353676],
  [10.657995, -75.354484],
  [10.657991, -75.355081],
  [10.658042, -75.355797],
  [10.658946, -75.360134],
  [10.659003, -75.360598],
  [10.659062, -75.361093],
  [10.659038, -75.361682],
  [10.658973, -75.362164],
  [10.658785, -75.362932],
  [10.658110, -75.365219],
  [10.657812, -75.366249],
  [10.657618, -75.366895],
  [10.657084, -75.368330],
  [10.655827, -75.371604],
  [10.655590, -75.372234],
  [10.655337, -75.372959],
  [10.655178, -75.373605],
  [10.655019, -75.374784],
  [10.654596, -75.377432],
  [10.654575, -75.377608],
  [10.654202, -75.379978],
  [10.654184, -75.380379],
  [10.654218, -75.380766],
  [10.654278, -75.381131],
  [10.654374, -75.381519],
  [10.654696, -75.382337],
  [10.655335, -75.383851],
  [10.655907, -75.385237],
  [10.656156, -75.386045],
  [10.656302, -75.386739],
  [10.656372, -75.387323],
  [10.656385, -75.387986],
  [10.656317, -75.388551],
  [10.656176, -75.389346],
  [10.655930, -75.390192],
  [10.654656, -75.393670],
  [10.654586, -75.393883],
  [10.654384, -75.394380],
  [10.654150, -75.394888],
  [10.654084, -75.395004],
  [10.654039, -75.395083],
  [10.653687, -75.395572],
  [10.653243, -75.396040],
  [10.652784, -75.396431],
  [10.652252, -75.396800],
  [10.651317, -75.397385],
  [10.649652, -75.398448],
  [10.647109, -75.400063],
  [10.644893, -75.401448],
  [10.644588, -75.401653],
  [10.643320, -75.402503],
  [10.641762, -75.403809],
  [10.641049, -75.404428],
  [10.640795, -75.404647],
  [10.640312, -75.405169],
  [10.639965, -75.405666],
  [10.639938, -75.405716],
  [10.639788, -75.405991],
  [10.639556, -75.406482],
  [10.639548, -75.406508],
  [10.639153, -75.407574],
  [10.638176, -75.410172],
  [10.637646, -75.411705],
  [10.637197, -75.413267],
  [10.637062, -75.413759],
  [10.635884, -75.418038],
  [10.635778, -75.418358],
  [10.635672, -75.418677],
  [10.635402, -75.419199],
  [10.635083, -75.419685],
  [10.634761, -75.420074],
  [10.631901, -75.423224],
  [10.630809, -75.424434],
  [10.630419, -75.424867],
  [10.630181, -75.425192],
  [10.629918, -75.425643],
  [10.629740, -75.425999],
  [10.629348, -75.426959],
  [10.628753, -75.428446],
  [10.628339, -75.429320],
  [10.626495, -75.433822],
  [10.625869, -75.435379],
  [10.624986, -75.438195],
  [10.623945, -75.441511],
  [10.623871, -75.441746],
  [10.623365, -75.443360],
  [10.622542, -75.445995],
  [10.622221, -75.447018],
  [10.621914, -75.447671],
  [10.621535, -75.448215],
  [10.620762, -75.449061],
  [10.619126, -75.450824],
  [10.618352, -75.451657],
  [10.617924, -75.452101],
  [10.617750, -75.452240],
  [10.617547, -75.452393],
  [10.617412, -75.452479],
  [10.617307, -75.452538],
  [10.617120, -75.452624],
  [10.616921, -75.452702],
  [10.616762, -75.452747],
  [10.616505, -75.452808],
  [10.615979, -75.452851],
  [10.615933, -75.452855],
  [10.615535, -75.452826],
  [10.615425, -75.452798],
  [10.615111, -75.452716],
  [10.614719, -75.452577],
  [10.613425, -75.451925],
  [10.611347, -75.450853],
  [10.610021, -75.450171],
  [10.609475, -75.449790],
  [10.609251, -75.449618],
  [10.608899, -75.449321],
  [10.608640, -75.449039],
  [10.608393, -75.448732],
  [10.607714, -75.447777],
  [10.607419, -75.447328],
  [10.606860, -75.446507],
  [10.606444, -75.445942],
  [10.606153, -75.445606],
  [10.605827, -75.445300],
  [10.605464, -75.445053],
  [10.605142, -75.444888],
  [10.604851, -75.444770],
  [10.604422, -75.444655],
  [10.604010, -75.444593],
  [10.603497, -75.444603],
  [10.603192, -75.444648],
  [10.602694, -75.444772],
  [10.602322, -75.444886],
  [10.601027, -75.445279],
  [10.599940, -75.445627],
  [10.595085, -75.447163],
  [10.591665, -75.448264],
  [10.590196, -75.448699],
  [10.589375, -75.448930],
  [10.588715, -75.449060],
  [10.586560, -75.449179],
  [10.583652, -75.449289],
  [10.581491, -75.449401],
  [10.580903, -75.449441],
  [10.580147, -75.449557],
  [10.579172, -75.449730],
  [10.578627, -75.449847],
  [10.577746, -75.450048],
  [10.577405, -75.450119],
  [10.576522, -75.450300],
  [10.575826, -75.450451],
  [10.575206, -75.450582],
  [10.574881, -75.450650],
  [10.574584, -75.450712],
  [10.574546, -75.450719],
  [10.574512, -75.450727],
  [10.574173, -75.450799],
  [10.573950, -75.450846],
  [10.572477, -75.451143],
  [10.571824, -75.451275],
  [10.570759, -75.451514],
  [10.570058, -75.451709],
  [10.569694, -75.451856],
  [10.568478, -75.452402],
  [10.567352, -75.452856],
  [10.567100, -75.452957],
  [10.566546, -75.453139],
  [10.565999, -75.453249],
  [10.565640, -75.453275],
  [10.565122, -75.453271],
  [10.564478, -75.453209],
  [10.562722, -75.452945],
  [10.562230, -75.452873],
  [10.561734, -75.452852],
  [10.561238, -75.452884],
  [10.560748, -75.452967],
  [10.560268, -75.453101],
  [10.559805, -75.453284],
  [10.559363, -75.453514],
  [10.557003, -75.454668],
  [10.556971, -75.454684],
  [10.556579, -75.454874],
  [10.556441, -75.454941],
  [10.555866, -75.455220],
  [10.555196, -75.455545],
  [10.555097, -75.455593],
  [10.552364, -75.456920],
  [10.551855, -75.457150],
  [10.550660, -75.457689],
  [10.549645, -75.458210],
  [10.549330, -75.458347],
  [10.548747, -75.458529],
  [10.548000, -75.458718],
  [10.547274, -75.458856],
  [10.546259, -75.458967],
  [10.546110, -75.458990],
  [10.545910, -75.459025],
  [10.545708, -75.459061],
  [10.545212, -75.459103],
  [10.545108, -75.459119],
  [10.544808, -75.459159],
  [10.544693, -75.459172],
  [10.538896, -75.460005],
  [10.537916, -75.460330],
  [10.537826, -75.460358],
  [10.527013, -75.464172],
  [10.524307, -75.465254],
  [10.523914, -75.465441],
  [10.523678, -75.465557],
  [10.522990, -75.465857],
  [10.522778, -75.465950],
  [10.521342, -75.466576],
  [10.519664, -75.467297],
  [10.519340, -75.467446],
  [10.516461, -75.468707],
  [10.515708, -75.469072],
  [10.515297, -75.469288],
  [10.515259, -75.469306],
  [10.515096, -75.469382],
  [10.514970, -75.469442],
  [10.514787, -75.469528],
  [10.514742, -75.469549],
  [10.513512, -75.470132],
  [10.512713, -75.470548],
  [10.511930, -75.470957],
  [10.511381, -75.471119],
  [10.511015, -75.471194],
  [10.510396, -75.471340],
  [10.510102, -75.471422],
  [10.509807, -75.471525],
  [10.509323, -75.471709],
  [10.509003, -75.471854],
  [10.508171, -75.472231],
  [10.505752, -75.473311],
  [10.504745, -75.473731],
  [10.504352, -75.473898],
  [10.503686, -75.474214],
  [10.502888, -75.474639],
  [10.502112, -75.475107],
  [10.501362, -75.475616],
  [10.501099, -75.475787],
  [10.500718, -75.476037],
  [10.498926, -75.477206],
  [10.498573, -75.477434],
  [10.497909, -75.477869],
  [10.495605, -75.479348],
  [10.495210, -75.479609],
  [10.492277, -75.481523],
  [10.491164, -75.482247],
  [10.490365, -75.482766],
  [10.489940, -75.483048],
  [10.489860, -75.483099],
  [10.488722, -75.483823],
  [10.487500, -75.484549],
  [10.485605, -75.485630],
  [10.483487, -75.486851],
  [10.483135, -75.487053],
  [10.480550, -75.488526],
  [10.479762, -75.488950],
  [10.478993, -75.489423],
  [10.478274, -75.489972],
  [10.478247, -75.490000],
  [10.477203, -75.491049],
  [10.476658, -75.491589],
  [10.476189, -75.492055],
  [10.475555, -75.492680],
  [10.474779, -75.493445],
  [10.474400, -75.493743],
  [10.473864, -75.494156],
  [10.473806, -75.494197],
  [10.473364, -75.494523],
  [10.472895, -75.494870],
  [10.472383, -75.495249],
  [10.471859, -75.495637],
  [10.470994, -75.496278],
  [10.470960, -75.496306],
  [10.470708, -75.496490],
  [10.470196, -75.496877],
  [10.469762, -75.497209],
  [10.469650, -75.497285],
  [10.469415, -75.497458],
  [10.468884, -75.497842],
  [10.468786, -75.497908],
  [10.468588, -75.498043],
  [10.468220, -75.498302],
  [10.468124, -75.498370],
  [10.467636, -75.498740],
  [10.467098, -75.499175],
  [10.466560, -75.499671],
  [10.465856, -75.500312],
  [10.465335, -75.500791],
  [10.464798, -75.501287],
  [10.464177, -75.501862],
  [10.463606, -75.502383],
  [10.463018, -75.502922],
  [10.462526, -75.503389],
  [10.461952, -75.503918],
  [10.461033, -75.504750],
  [10.460642, -75.505102],
  [10.459803, -75.505872],
  [10.459542, -75.506113],
  [10.459343, -75.506339],
  [10.459047, -75.506701],
  [10.458862, -75.506959],
  [10.458628, -75.507353],
  [10.458319, -75.507939],
  [10.457876, -75.508749],
  [10.457383, -75.509607],
  [10.457036, -75.510129],
  [10.456935, -75.510211],
  [10.456902, -75.510243],
  [10.456864, -75.510266],
  [10.456821, -75.510279],
  [10.456777, -75.510283],
  [10.456733, -75.510275],
  [10.456691, -75.510258],
  [10.456655, -75.510231],
  [10.456626, -75.510197],
  [10.456605, -75.510157],
  [10.456594, -75.510113],
  [10.456593, -75.510068],
  [10.456602, -75.510023],
  [10.456621, -75.509982],
  [10.456683, -75.509841],
  [10.457014, -75.509571],
  [10.457220, -75.509401],
  [10.457314, -75.509309],
  [10.457479, -75.509122],
  [10.457626, -75.508919],
  [10.457752, -75.508703],
  [10.457902, -75.508432],
  [10.458041, -75.508194],
  [10.458088, -75.508117],
  [10.458140, -75.508022],
  [10.458205, -75.507900],
  [10.458592, -75.507176],
  [10.458832, -75.506773],
  [10.458993, -75.506540],
  [10.459172, -75.506321],
  [10.459368, -75.506116],
  [10.459471, -75.506020],
  [10.459538, -75.505952],
  [10.464483, -75.501430],
  [10.465251, -75.500687],
  [10.465680, -75.500194],
  [10.466292, -75.499403],
  [10.467412, -75.497945],
  [10.468747, -75.496221],
  [10.469359, -75.495441],
  [10.470278, -75.494381],
  [10.471724, -75.492793],
  [10.472907, -75.491608],
  [10.473267, -75.491248],
  [10.475398, -75.489308],
  [10.476057, -75.488772],
  [10.476989, -75.488014],
  [10.477650, -75.487520],
  [10.479357, -75.486252],
  [10.481120, -75.485065],
  [10.482935, -75.483964],
  [10.484799, -75.482949],
  [10.486707, -75.482023],
  [10.488655, -75.481188],
  [10.489376, -75.480895],
  [10.489644, -75.480854],
  [10.489914, -75.480885],
  [10.490167, -75.480985],
  [10.490387, -75.481147],
  [10.490559, -75.481361],
  [10.490671, -75.481613],
  [10.490716, -75.481885],
  [10.490692, -75.482160],
  [10.490599, -75.482419],
  [10.490547, -75.482530],
  [10.490365, -75.482766],
  [10.489940, -75.483048],
  [10.489860, -75.483099],
  [10.488722, -75.483823],
  [10.487500, -75.484549],
  [10.485605, -75.485630],
  [10.483487, -75.486851],
  [10.483135, -75.487053],
  [10.480550, -75.488526],
  [10.479762, -75.488950],
  [10.478993, -75.489423],
  [10.478274, -75.489972],
  [10.478247, -75.490000],
  [10.477203, -75.491049],
  [10.476658, -75.491589],
  [10.476189, -75.492055],
  [10.475555, -75.492680],
  [10.474779, -75.493445],
  [10.474400, -75.493743],
  [10.473864, -75.494156],
  [10.473806, -75.494197],
  [10.473364, -75.494523],
  [10.472895, -75.494870],
  [10.472383, -75.495249],
  [10.471859, -75.495637],
  [10.470994, -75.496278],
  [10.470960, -75.496306],
  [10.470708, -75.496490],
  [10.470196, -75.496877],
  [10.469762, -75.497209],
  [10.469650, -75.497285],
  [10.469415, -75.497458],
  [10.468884, -75.497842],
  [10.468786, -75.497908],
  [10.468588, -75.498043],
  [10.468220, -75.498302],
  [10.468124, -75.498370],
  [10.467636, -75.498740],
  [10.467098, -75.499175],
  [10.466560, -75.499671],
  [10.465856, -75.500312],
  [10.465335, -75.500791],
  [10.464798, -75.501287],
  [10.464177, -75.501862],
  [10.463606, -75.502383],
  [10.463018, -75.502922],
  [10.462526, -75.503389],
  [10.461952, -75.503918],
  [10.461033, -75.504750],
  [10.460642, -75.505102],
  [10.459803, -75.505872],
  [10.459542, -75.506113],
  [10.459343, -75.506339],
  [10.459047, -75.506701],
  [10.458862, -75.506959],
  [10.458628, -75.507353],
  [10.458319, -75.507939],
  [10.457876, -75.508749],
  [10.457383, -75.509607],
  [10.457036, -75.510129],
  [10.456951, -75.510262],
  [10.456844, -75.510372],
  [10.456250, -75.510951],
  [10.455555, -75.511705],
  [10.455344, -75.511952],
  [10.455258, -75.512052],
  [10.455210, -75.512107],
  [10.453152, -75.514255],
  [10.452199, -75.515299],
  [10.452007, -75.515544],
  [10.451834, -75.515868],
  [10.451697, -75.516193],
  [10.451446, -75.516851],
  [10.451313, -75.517134],
  [10.451122, -75.517403],
  [10.450898, -75.517659],
  [10.450558, -75.518005],
  [10.449051, -75.519588],
  [10.447125, -75.521784],
  [10.445504, -75.523737],
  [10.444243, -75.525369],
  [10.443306, -75.526563],
  [10.442334, -75.527803],
  [10.441776, -75.528507],
  [10.441709, -75.528589],
  [10.441661, -75.528640],
  [10.441591, -75.528699],
  [10.441508, -75.528739],
  [10.441466, -75.528764],
  [10.441421, -75.528784],
  [10.441375, -75.528799],
  [10.441327, -75.528809],
  [10.441278, -75.528813],
  [10.441229, -75.528811],
  [10.441181, -75.528804],
  [10.441133, -75.528792],
  [10.441088, -75.528774],
  [10.441044, -75.528751],
  [10.441004, -75.528723],
  [10.440966, -75.528691]
];

const prosperidadCoords = [
  [10.828525, -74.770605],
  [10.828534, -74.770715],
  [10.828509, -74.771035],
  [10.828150, -74.773545],
  [10.827865, -74.775463],
  [10.827721, -74.776568],
  [10.827537, -74.778351],
  [10.827502, -74.778617],
  [10.827458, -74.778845],
  [10.827133, -74.780470],
  [10.826622, -74.783590],
  [10.826221, -74.786249],
  [10.826069, -74.787329],
  [10.826038, -74.787544],
  [10.825988, -74.788107],
  [10.825984, -74.788213],
  [10.825991, -74.788680],
  [10.826049, -74.789204],
  [10.826092, -74.789446],
  [10.826153, -74.789742],
  [10.826231, -74.790025],
  [10.826324, -74.790347],
  [10.826452, -74.790655],
  [10.826747, -74.791230],
  [10.827253, -74.792244],
  [10.829037, -74.795868],
  [10.830119, -74.798069],
  [10.830203, -74.798234],
  [10.830721, -74.799231],
  [10.831368, -74.800536],
  [10.831605, -74.801016],
  [10.832129, -74.802082],
  [10.832387, -74.802605],
  [10.832495, -74.802824],
  [10.833442, -74.804704],
  [10.833756, -74.805249],
  [10.834379, -74.806333],
  [10.835283, -74.807862],
  [10.835913, -74.808957],
  [10.836532, -74.809965],
  [10.837143, -74.810849],
  [10.837716, -74.811715],
  [10.837783, -74.811820],
  [10.837978, -74.812193],
  [10.838131, -74.812492],
  [10.838790, -74.813840],
  [10.839088, -74.814354],
  [10.839433, -74.814941],
  [10.839861, -74.815737],
  [10.840606, -74.817015],
  [10.841324, -74.818123],
  [10.841950, -74.818936],
  [10.842520, -74.819589],
  [10.843072, -74.820145],
  [10.843562, -74.820581],
  [10.843941, -74.820885],
  [10.844340, -74.821207],
  [10.845059, -74.821704],
  [10.845655, -74.822061],
  [10.846435, -74.822477],
  [10.847384, -74.822898],
  [10.847671, -74.822995],
  [10.848515, -74.823279],
  [10.850554, -74.823755],
  [10.850725, -74.823792],
  [10.851964, -74.824064],
  [10.853295, -74.824346],
  [10.854852, -74.824590],
  [10.855204, -74.824630],
  [10.855587, -74.824727],
  [10.855988, -74.824824],
  [10.857428, -74.825275],
  [10.858254, -74.825492],
  [10.861902, -74.826251],
  [10.862922, -74.826467],
  [10.864461, -74.826826],
  [10.864821, -74.826908],
  [10.867225, -74.827439],
  [10.868671, -74.827758],
  [10.869943, -74.828020],
  [10.871004, -74.828183],
  [10.871650, -74.828305],
  [10.872265, -74.828448],
  [10.872332, -74.828465],
  [10.873449, -74.828769],
  [10.873757, -74.828849],
  [10.874742, -74.829081],
  [10.875227, -74.829194],
  [10.876398, -74.829470],
  [10.877893, -74.829790],
  [10.878174, -74.829864],
  [10.878393, -74.829938],
  [10.878847, -74.830141],
  [10.879121, -74.830301],
  [10.879531, -74.830601],
  [10.879890, -74.830943],
  [10.880149, -74.831304],
  [10.880394, -74.831707],
  [10.880612, -74.832190],
  [10.880803, -74.832837],
  [10.881572, -74.835483],
  [10.881712, -74.835961],
  [10.881786, -74.836202],
  [10.881873, -74.836438],
  [10.881961, -74.836660],
  [10.882064, -74.836864],
  [10.882634, -74.837852],
  [10.883168, -74.838772],
  [10.883811, -74.839872],
  [10.884444, -74.840954],
  [10.884970, -74.841883],
  [10.885607, -74.842833],
  [10.885687, -74.842952],
  [10.885943, -74.843310],
  [10.885982, -74.843368],
  [10.886312, -74.843865],
  [10.886563, -74.844244],
  [10.886626, -74.844346],
  [10.886666, -74.844410],
  [10.886895, -74.844830],
  [10.887255, -74.845508],
  [10.887350, -74.845695],
  [10.887775, -74.846576],
  [10.887981, -74.846982],
  [10.888161, -74.847297],
  [10.888729, -74.848294],
  [10.889254, -74.849218],
  [10.889998, -74.850509],
  [10.890535, -74.851482],
  [10.891109, -74.852435],
  [10.891763, -74.853541],
  [10.893749, -74.856919],
  [10.894111, -74.857492],
  [10.894302, -74.857779],
  [10.894977, -74.858717],
  [10.895171, -74.859000],
  [10.895264, -74.859147],
  [10.895348, -74.859306],
  [10.895502, -74.859645],
  [10.896115, -74.860900],
  [10.896299, -74.861248],
  [10.896938, -74.862376],
  [10.898185, -74.864522],
  [10.898633, -74.865153],
  [10.898931, -74.865506],
  [10.899064, -74.865646],
  [10.899274, -74.865850],
  [10.899761, -74.866229],
  [10.900054, -74.866422],
  [10.900340, -74.866583],
  [10.900595, -74.866714],
  [10.900914, -74.866860],
  [10.902703, -74.867569],
  [10.909618, -74.870357],
  [10.909991, -74.870518],
  [10.910325, -74.870653],
  [10.910729, -74.870842],
  [10.910986, -74.870991],
  [10.912664, -74.871950],
  [10.912875, -74.872070],
  [10.913401, -74.872371],
  [10.913817, -74.872587],
  [10.914082, -74.872730],
  [10.914368, -74.872898],
  [10.915717, -74.873682],
  [10.916012, -74.873847],
  [10.916353, -74.874029],
  [10.916681, -74.874236],
  [10.916993, -74.874466],
  [10.917287, -74.874719],
  [10.917575, -74.875056],
  [10.917842, -74.875410],
  [10.918088, -74.875779],
  [10.918251, -74.876073],
  [10.918747, -74.877338],
  [10.919171, -74.878530],
  [10.919312, -74.878859],
  [10.919471, -74.879176],
  [10.919620, -74.879425],
  [10.919770, -74.879649],
  [10.920008, -74.879956],
  [10.920287, -74.880234],
  [10.920607, -74.880520],
  [10.921002, -74.880827],
  [10.921261, -74.880994],
  [10.921501, -74.881125],
  [10.921736, -74.881237],
  [10.921962, -74.881356],
  [10.922267, -74.881469],
  [10.922409, -74.881521],
  [10.922636, -74.881618],
  [10.922785, -74.881691],
  [10.922931, -74.881770],
  [10.923424, -74.882108],
  [10.923686, -74.882340],
  [10.923881, -74.882543],
  [10.924140, -74.882866],
  [10.924391, -74.883264],
  [10.924580, -74.883661],
  [10.924723, -74.884071],
  [10.924853, -74.884516],
  [10.925062, -74.885337],
  [10.925328, -74.886375],
  [10.925496, -74.887190],
  [10.925517, -74.887285],
  [10.925657, -74.887993],
  [10.925743, -74.888359],
  [10.925876, -74.888913],
  [10.926093, -74.889819],
  [10.926202, -74.890259],
  [10.926351, -74.890635],
  [10.926527, -74.890993],
  [10.926792, -74.891396],
  [10.926978, -74.891641],
  [10.928679, -74.893688],
  [10.929305, -74.894373],
  [10.929353, -74.894435],
  [10.929406, -74.894505],
  [10.929543, -74.894690],
  [10.929895, -74.895167],
  [10.930643, -74.896098],
  [10.931405, -74.896994],
  [10.931897, -74.897473],
  [10.932248, -74.897727],
  [10.932830, -74.898006],
  [10.933289, -74.898148],
  [10.934110, -74.898283],
  [10.934734, -74.898259],
  [10.935156, -74.898175],
  [10.935725, -74.897974],
  [10.936348, -74.897692],
  [10.940522, -74.895927],
  [10.940985, -74.895768],
  [10.941282, -74.895659],
  [10.941414, -74.895631],
  [10.941769, -74.895588],
  [10.942133, -74.895566],
  [10.942485, -74.895580],
  [10.942827, -74.895593],
  [10.943534, -74.895612],
  [10.946829, -74.895755],
  [10.947636, -74.895835],
  [10.948681, -74.895904],
  [10.950692, -74.896091],
  [10.951866, -74.896195],
  [10.952414, -74.896245],
  [10.952776, -74.896311],
  [10.952957, -74.896354],
  [10.953109, -74.896394],
  [10.953485, -74.896520],
  [10.953829, -74.896651],
  [10.954631, -74.896953],
  [10.956518, -74.897723],
  [10.958705, -74.898535],
  [10.960331, -74.898996],
  [10.960654, -74.899107],
  [10.960922, -74.899237],
  [10.961647, -74.899609],
  [10.962524, -74.900058],
  [10.962787, -74.900192],
  [10.963325, -74.900424],
  [10.964371, -74.900836],
  [10.964621, -74.900931],
  [10.964912, -74.901013],
  [10.965155, -74.901065],
  [10.965437, -74.901097],
  [10.965843, -74.901121],
  [10.966283, -74.901090],
  [10.966755, -74.901004],
  [10.967198, -74.900859],
  [10.967613, -74.900641],
  [10.968107, -74.900282],
  [10.968394, -74.900024],
  [10.968673, -74.899705],
  [10.970406, -74.897293],
  [10.972876, -74.893945],
  [10.973440, -74.893234],
  [10.973777, -74.892877],
  [10.974688, -74.892125],
  [10.974988, -74.891932],
  [10.975233, -74.891804],
  [10.976004, -74.891470],
  [10.976265, -74.891382],
  [10.976533, -74.891304],
  [10.980314, -74.890802],
  [10.980719, -74.890754],
  [10.981770, -74.890612],
  [10.982785, -74.890480],
  [10.983727, -74.890346],
  [10.985339, -74.890139],
  [10.986586, -74.889970],
  [10.987948, -74.889800],
  [10.989012, -74.889638],
  [10.989441, -74.889498],
  [10.989748, -74.889368],
  [10.990210, -74.889122],
  [10.990654, -74.888816],
  [10.991421, -74.888341],
  [10.995991, -74.885387],
  [10.996903, -74.884729],
  [10.997770, -74.884109],
  [10.998157, -74.883833],
  [10.998558, -74.883608],
  [10.998698, -74.883530],
  [10.999429, -74.883136],
  [11.000707, -74.882358],
  [11.005464, -74.879287],
  [11.005858, -74.879052],
  [11.008690, -74.877229],
  [11.008981, -74.877039],
  [11.009926, -74.876439],
  [11.010312, -74.876251],
  [11.010628, -74.876133],
  [11.010954, -74.876042],
  [11.011255, -74.875985],
  [11.011556, -74.875951],
  [11.012021, -74.875945],
  [11.012364, -74.875975],
  [11.012829, -74.876083],
  [11.013898, -74.876331],
  [11.014111, -74.876380],
  [11.014321, -74.876429]
];


// ==========================================
// CÓDIGO DE DIBUJO Y COLOR (Leaflet)
// Copia esto donde inicializas tu mapa
// ==========================================
// --- Highlight Vía al Mar (Ruta 90A) ---
L.polyline(viaAlMarCoords, {
    color: '#003087',
    weight: 12,
    opacity: 0.2,
    lineJoin: 'round'
}).addTo(map);

L.polyline(viaAlMarCoords, {
    color: '#0066cc',
    weight: 6,
    opacity: 0.8,
    lineJoin: 'round'
}).addTo(map).bindTooltip("Vía al Mar - Ruta Turística", { sticky: true });

// --- Highlight Circunvalar de la Prosperidad ---

// Highlight styling for Prosperidad (slightly different blue/cyan glow)
L.polyline(prosperidadCoords, {
    color: '#005bb7',
    weight: 12,
    opacity: 0.2,
    lineJoin: 'round'
}).addTo(map);

L.polyline(prosperidadCoords, {
    color: '#0084ff',
    weight: 6,
    opacity: 0.8,
    lineJoin: 'round'
}).addTo(map).bindTooltip("Circunvalar de la Prosperidad", { sticky: true });


L.polyline(prosperidadCoords, {
    color: '#0084ff',
    weight: 6,
    opacity: 0.8,
    lineJoin: 'round'
}).addTo(map).bindTooltip("Circunvalar de la Prosperidad", { sticky: true });

