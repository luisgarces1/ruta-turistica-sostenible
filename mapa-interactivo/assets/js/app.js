// Init Leaflet Map
const map = L.map('map', {
    zoomControl: false, // Customizing zoom position
    minZoom: 8 // Prevent zooming out worldwide
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
        btn.className = `filter-btn w-full text-left px-3 py-2.5 rounded-xl transition-all duration-300 flex items-center justify-between border group ${cat.id === 'todas'
            ? 'bg-brand-50 border-brand-200 shadow-sm'
            : 'bg-white border-transparent hover:bg-gray-50'
            }`;
        btn.dataset.category = cat.id;

        btn.innerHTML = `
            <div class="flex items-center gap-3">
                <span class="flex items-center justify-center w-8 h-8 rounded-full ${cat.color} text-white text-sm shadow-sm opacity-90 group-hover:opacity-100 transition-opacity">${cat.icon}</span>
                <span class="font-medium text-[14px] ${cat.id === 'todas' ? 'text-brand-900' : 'text-gray-600 group-hover:text-gray-900'}">${cat.label}</span>
            </div>
            <svg class="w-5 h-5 transition-opacity duration-300 check-icon ${cat.id === 'todas' ? 'opacity-100 text-brand-500' : 'opacity-0 text-gray-400'}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
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
        const checkIcon = btn.querySelector('.check-icon');
        const textSpan = btn.querySelector('span.font-medium');
        if (btn.dataset.category === currentActiveFilter) {
            btn.classList.add('bg-brand-50', 'border-brand-200', 'shadow-sm');
            btn.classList.remove('bg-white', 'border-transparent');
            textSpan.classList.add('text-brand-900');
            textSpan.classList.remove('text-gray-600', 'group-hover:text-gray-900');
            checkIcon.classList.remove('opacity-0', 'text-gray-400');
            checkIcon.classList.add('opacity-100', 'text-brand-500');
        } else {
            btn.classList.remove('bg-brand-50', 'border-brand-200', 'shadow-sm');
            btn.classList.add('bg-white', 'border-transparent');
            textSpan.classList.remove('text-brand-900');
            textSpan.classList.add('text-gray-600', 'group-hover:text-gray-900');
            checkIcon.classList.remove('opacity-100', 'text-brand-500');
            checkIcon.classList.add('opacity-0', 'text-gray-400');
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
        <!-- Image Header -->
        <div class="relative h-48 md:h-56 w-full shrink-0">
            <img src="${data.image}" onerror="this.src='https://images.unsplash.com/photo-1543884877-a8eb0bf1775f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'" class="w-full h-full object-cover rounded-t-3xl md:rounded-t-2xl" alt="${data.title}">
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:rounded-t-2xl rounded-t-3xl"></div>
            
            <button onclick="closeSidePanel()" class="absolute top-4 right-4 bg-white/20 hover:bg-white/90 focus:bg-white backdrop-blur-md p-2 rounded-full text-white hover:text-gray-800 transition-all shadow-md group">
                <svg class="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <div class="absolute bottom-4 left-5">
                <span class="px-3 py-1.5 ${categoryData?.color || 'bg-gray-800'} text-white text-[11px] font-bold uppercase tracking-widest rounded-full shadow-lg border border-white/20 backdrop-blur-sm flex items-center gap-1.5 w-fit">
                    ${categoryData?.icon || ''} ${categoryData?.label || 'Categoría'}
                </span>
            </div>
        </div>

            <!-- Content Body (Scrollable part) -->
            <div class="px-6 md:px-8 py-5 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-4">
                <h2 class="text-2xl md:text-[28px] font-black leading-tight text-gray-900">${data.title}</h2>
                
                <div class="mt-1">
                    <p class="flex items-start text-sm md:text-base text-brand-600 font-medium">
                        <svg class="w-5 h-5 mr-1.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <span>${data.location}</span>
                    </p>
                </div>

                <p class="text-[14px] md:text-base text-justify text-gray-700 leading-relaxed font-medium mt-2">
                    ${data.description}
                </p>

                <div class="bg-gray-50/80 rounded-2xl p-4 mt-2 border border-gray-100 flex flex-col gap-4 shrink-0">
                    <div class="flex items-center gap-3">
                        <div class="p-2.5 bg-white rounded-xl shadow-sm text-brand-500 border border-gray-50 shrink-0">
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                            <p class="text-[11px] text-gray-400 font-bold uppercase tracking-wide">Horario de atención</p>
                            <p class="text-[14px] font-semibold text-gray-800">${data.hours}</p>
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-3">
                        <div class="p-2.5 bg-white rounded-xl shadow-sm text-brand-500 border border-gray-50 shrink-0">
                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div>
                            <p class="text-[11px] text-gray-400 font-bold uppercase tracking-wide">Tarifa / Ingreso</p>
                            <p class="text-[14px] font-semibold text-gray-800">${data.price}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer con Boton Fijo (No scrollable) -->
            <div class="px-6 md:px-8 pb-6 md:pb-8 pt-4 bg-white/50 backdrop-blur-2xl border-t border-gray-100 shrink-0">
                <a href="https://www.google.com/maps/dir/?api=1&destination=${data.lat},${data.lng}" target="_blank" rel="noopener noreferrer" class="w-full h-14 flex items-center justify-center bg-gradient-to-r from-brand-600 to-teal-500 hover:from-brand-700 hover:to-teal-600 text-white font-bold text-lg rounded-xl transition-all shadow-lg shadow-brand-500/25 transform hover:-translate-y-0.5 active:translate-y-0 relative overflow-hidden group">
                    <span class="relative z-10 flex items-center gap-2">
                        Ver Cómo Llegar
                        <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                    </span>
                    <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none"></div>
                </a>
            </div>
    `;

    // Slide in
    sidePanel.classList.remove('translate-y-full', 'md:translate-x-[120%]');
}

window.closeSidePanel = function () {
    // Slide out
    sidePanel.classList.add('translate-y-full', 'md:translate-x-[120%]');
}

// Ensure panel is closed at start
closeSidePanel();

// Init Base Render
renderFilters();
renderMarkers();
filterMarkers();
