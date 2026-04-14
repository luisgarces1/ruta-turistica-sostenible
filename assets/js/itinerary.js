// l:/PORYECTOS DE PAGINAS/juan3/ruta-turistica-sostenible/mapa-interactivo/assets/js/itinerary.js

const ItineraryPlanner = {
    selectedInterests: new Set(),
    startDate: null,
    endDate: null,
    currentDayView: 1,
    fullItinerary: null,
    flatpickrInstance: null,
    startCity: 'Cartagena',

    // Coordenadas aproximadas de centros de ciudades
    cityCoords: {
        'Cartagena': [10.4248, -75.5474],
        'Barranquilla': [10.9685, -74.7813]
    },

    init() {
        this.createOverlay();
        this.addEventListeners();
    },

    createOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'itinerary-overlay';
        overlay.className = 'fixed inset-0 z-[200] transform translate-y-full transition-transform duration-500 ease-in-out flex flex-col items-center justify-center p-6 text-white text-center sm:overflow-y-auto bg-cover bg-center bg-no-repeat';
        overlay.style.backgroundImage = 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("assets/images/puntos/puente-del-viaducto-el-gran-manglar.webp")';
        
        overlay.innerHTML = `
            <button id="close-itinerary" class="absolute top-8 right-8 text-white hover:scale-110 transition-transform">
                <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div class="max-w-xl w-full space-y-6 py-6 transition-all">
                <div id="step-1" class="space-y-6 animate-fade-in w-full px-4">
                    <h2 class="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white">¿Desde dónde inicias?</h2>
                    <p class="text-blue-100/80 text-sm font-medium">Punto de partida para optimizar el recorrido</p>
                    <div class="flex flex-wrap justify-center gap-3">
                        <button class="city-tag px-4 py-3 rounded-xl border-2 border-white/20 hover:border-white transition-all font-black text-base uppercase tracking-widest bg-white text-[#004a99] min-w-[140px]" data-value="Cartagena">
                            Cartagena
                        </button>
                        <button class="city-tag px-4 py-3 rounded-xl border-2 border-white/20 hover:border-white transition-all font-black text-base uppercase tracking-widest min-w-[140px]" data-value="Barranquilla">
                            Barranquilla
                        </button>
                    </div>
                    <div class="pt-4">
                        <button id="next-to-step-2" class="bg-white text-[#004a99] px-10 py-3 rounded-full font-black uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all text-sm">Siguiente</button>
                    </div>
                </div>

                <div id="step-2" class="space-y-6 hidden animate-fade-in">
                    <h2 class="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white">¿Qué te interesa?</h2>
                    <div class="flex flex-wrap justify-center gap-2">
                        ${categories.filter(c => c.id !== 'todas' && c.id !== 'otros').map(cat => `
                            <button class="interest-tag px-4 py-2 rounded-full border border-white/20 hover:border-white hover:bg-white/10 transition-all font-bold text-sm" data-value="${cat.id}">${cat.label}</button>
                        `).join('')}
                    </div>
                    <div class="pt-4 flex justify-center gap-3">
                        <button id="back-to-step-1" class="border border-white/20 px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-white/10 transition-all text-xs">Atrás</button>
                        <button id="next-to-step-3" class="bg-white text-[#004a99] px-8 py-3 rounded-full font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all text-sm">Siguiente</button>
                    </div>
                </div>

                <div id="step-3" class="space-y-6 hidden animate-fade-in">
                    <h2 class="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white">¿Cuándo viajas?</h2>
                    
                    <div class="bg-white p-2 rounded-3xl shadow-2xl inline-block">
                        <div id="calendar-container" class="text-gray-800 scale-90 origin-top"></div>
                        <input type="text" id="date-range-input" class="absolute opacity-0 pointer-events-none">
                    </div>

                    <div class="pt-4 flex justify-center gap-3">
                        <button id="back-to-step-2" class="border border-white/20 px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-white/10 transition-all text-xs">Atrás</button>
                        <button id="generate-itinerary" class="bg-white text-[#004a99] px-8 py-3 rounded-full font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all text-sm">Generar mi Ruta</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        this.initFlatpickr();
    },

    initFlatpickr() {
        this.flatpickrInstance = flatpickr("#date-range-input", {
            mode: "range",
            inline: true,
            locale: "es",
            minDate: "today",
            dateFormat: "Y-m-d",
            appendTo: document.getElementById('calendar-container'),
            onChange: (selectedDates) => {
                if (selectedDates.length === 2) {
                    this.startDate = selectedDates[0];
                    this.endDate = selectedDates[1];
                }
            }
        });
    },

    open() {
        const overlay = document.getElementById('itinerary-overlay');
        if (overlay) {
            overlay.classList.remove('translate-y-full');
            this.resetForm();
        }
    },

    addEventListeners() {
        const routesBtn = document.getElementById('rutas-link');
        const mapaBtn = document.getElementById('mapa-link');
        const overlay = document.getElementById('itinerary-overlay');
        const closeBtn = document.getElementById('close-itinerary');

        mapaBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.resetToMainMap();
        });

        routesBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.open();
        });

        closeBtn.addEventListener('click', () => {
            overlay.classList.add('translate-y-full');
        });

        document.querySelectorAll('.city-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                document.querySelectorAll('.city-tag').forEach(t => t.classList.remove('bg-white', 'text-[#004a99]', 'border-white'));
                tag.classList.add('bg-white', 'text-[#004a99]', 'border-white');
                this.startCity = tag.dataset.value;
            });
        });

        document.getElementById('next-to-step-2').addEventListener('click', () => {
            document.getElementById('step-1').classList.add('hidden');
            document.getElementById('step-2').classList.remove('hidden');
        });

        document.querySelectorAll('.interest-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                const isActive = tag.classList.contains('bg-white');
                if (isActive) {
                    tag.classList.remove('bg-white', 'text-[#004a99]', 'border-white');
                    tag.classList.add('border-white/20');
                    this.selectedInterests.delete(tag.dataset.value);
                } else {
                    tag.classList.add('bg-white', 'text-[#004a99]', 'border-white');
                    tag.classList.remove('border-white/20');
                    this.selectedInterests.add(tag.dataset.value);
                }
            });
        });

        document.getElementById('back-to-step-1').addEventListener('click', () => {
            document.getElementById('step-2').classList.add('hidden');
            document.getElementById('step-1').classList.remove('hidden');
        });

        document.getElementById('next-to-step-3').addEventListener('click', () => {
            if (this.selectedInterests.size === 0) {
                alert('Selecciona al menos un interés');
                return;
            }
            document.getElementById('step-2').classList.add('hidden');
            document.getElementById('step-3').classList.remove('hidden');
        });

        document.getElementById('back-to-step-2').addEventListener('click', () => {
            document.getElementById('step-3').classList.add('hidden');
            document.getElementById('step-2').classList.remove('hidden');
        });

        document.getElementById('generate-itinerary').addEventListener('click', () => {
            if (!this.startDate || !this.endDate) {
                alert('Por favor selecciona un rango de fechas en el calendario');
                return;
            }
            const diffDays = Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24)) + 1;
            if (diffDays > 5) { alert('Soporta hasta 5 días.'); return; }
            this.generate(diffDays);
            overlay.classList.add('translate-y-full');
        });
    },

    resetForm() {
        this.selectedInterests.clear();
        document.querySelectorAll('.interest-tag').forEach(el => {
            el.classList.remove('bg-white', 'text-[#004a99]', 'border-white');
            el.classList.add('border-white/20');
        });
        if (this.flatpickrInstance) this.flatpickrInstance.clear();
        this.startDate = null; this.endDate = null;
        ['step-1'].forEach(id => document.getElementById(id).classList.remove('hidden'));
        ['step-2', 'step-3'].forEach(id => document.getElementById(id).classList.add('hidden'));
    },

    resetToMainMap() {
        if (this.routePolyline) {
            map.removeLayer(this.routePolyline);
            this.routePolyline = null;
        }
        this.fullItinerary = null;
        currentActiveFilter = 'todas';
        const filterContainer = document.getElementById('filter-container');
        filterContainer.innerHTML = '';
        renderFilters(); updateFilterUI(); filterMarkers(); closeSidePanel();
    },

    calculateTravelTime(pointA, pointB) {
        // Cálculo de distancia Haversine simplificado
        const lat1 = pointA[0], lon1 = pointA[1];
        const lat2 = pointB[0], lon2 = pointB[1];
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
                Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        
        // 45 km/h promedio en la zona (considerando paradas y tráfico)
        const timeInMinutes = Math.round((distance / 45) * 60);
        return Math.max(15, timeInMinutes); // Mínimo 15 minutos
    },

    generate(numDays) {
        let filtered = mockData.filter(item => {
            if (item.category === 'eventos' && item.title.includes('Fiestas novembrinas')) {
                if (this.startDate.getMonth() !== 10) return false;
            }
            return this.selectedInterests.has(item.category);
        });

        if (filtered.length === 0) { alert('Sin coincidencias.'); return; }

        if (this.startCity === 'Cartagena') filtered.sort((a,b) => a.lat - b.lat);
        else filtered.sort((a,b) => b.lat - a.lat);

        const selectedPoints = filtered.slice(0, numDays * 4);
        this.fullItinerary = {};
        const itemsPerDay = Math.ceil(selectedPoints.length / numDays);
        for (let i = 0; i < numDays; i++) {
            this.fullItinerary[i + 1] = selectedPoints.slice(i * itemsPerDay, (i + 1) * itemsPerDay);
        }

        this.currentDayView = 1;
        this.renderItinerarySidebar();
        this.updateMapForDay(1);
    },

    renderItinerarySidebar() {
        const filterContainer = document.getElementById('filter-container');
        const numDays = Object.keys(this.fullItinerary).length;
        let tabsHtml = '';
        for (let i = 1; i <= numDays; i++) {
            tabsHtml += `<button onclick="ItineraryPlanner.switchDay(${i})" class="flex-1 py-2 text-[10px] font-black tracking-widest rounded-lg transition-all ${i === this.currentDayView ? 'bg-[#004a99] text-white shadow-lg' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}">DÍA ${i}</button>`;
        }

        const items = this.fullItinerary[this.currentDayView] || [];
        const date = new Date(this.startDate);
        date.setDate(date.getDate() + (this.currentDayView - 1));

        filterContainer.innerHTML = `
            <div class="space-y-6">
                <div class="flex items-center justify-between border-b pb-4">
                    <button onclick="ItineraryPlanner.resetToMainMap()" class="text-[10px] font-bold text-gray-400 hover:text-gray-900 flex items-center gap-1 group">
                        <svg class="w-3 h-3 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg> SALIR
                    </button>
                    <span class="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded shadow-sm">INICIO: ${this.startCity.toUpperCase()}</span>
                </div>
                <div class="flex gap-2 bg-gray-50 p-1 rounded-xl">${tabsHtml}</div>
                <div class="space-y-1">
                    <h3 class="text-xl font-black text-gray-900 italic">Ruta del Día ${this.currentDayView}</h3>
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">${date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                </div>
                <div id="itinerary-list" class="space-y-3">
                    ${items.map((item, idx) => {
                        let prevCoord = idx === 0 ? this.cityCoords[this.startCity] : [items[idx-1].lat, items[idx-1].lng];
                        let time = this.calculateTravelTime(prevCoord, [item.lat, item.lng]);
                        let label = idx === 0 ? `Desde centro de ${this.startCity}` : `Desde punto anterior`;
                        
                        return `
                            <div class="flex items-center gap-2 py-1 pl-4">
                                <div class="w-[1px] h-4 border-l border-dashed border-gray-300"></div>
                                <span class="text-[9px] font-bold text-gray-400 italic">${label}: ~${time} min</span>
                            </div>
                            <div onclick="ItineraryPlanner.focusPoint(${item.id})" class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#004a99]/20 transition-all cursor-pointer group relative overflow-hidden">
                                <div class="absolute left-0 top-0 bottom-0 w-1 bg-gray-100 group-hover:bg-[#004a99] transition-colors"></div>
                                <div class="flex justify-between items-start">
                                    <div class="max-w-[80%]">
                                        <p class="font-bold text-gray-800 text-sm group-hover:text-[#004a99] transition-colors">${item.title}</p>
                                        <p class="text-[10px] text-gray-400 font-medium mt-0.5">${item.location}</p>
                                    </div>
                                    <span class="text-[10px] font-black text-gray-300">#${idx + 1}</span>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    },

    switchDay(day) {
        this.currentDayView = day;
        this.renderItinerarySidebar();
        this.updateMapForDay(day);
    },

    focusPoint(id) {
        const marker = allMarkers.find(m => m.itemData.id === id);
        if (marker) marker.fire('click');
    },

    updateMapForDay(day) {
        const points = this.fullItinerary[day] || [];
        allMarkers.forEach(m => {
            if (points.find(p => p.id === m.itemData.id)) { if (!markerGroup.hasLayer(m)) markerGroup.addLayer(m); }
            else { if (markerGroup.hasLayer(m)) markerGroup.removeLayer(m); }
        });
        if (this.routePolyline) map.removeLayer(this.routePolyline);
        if (points.length > 0) {
            map.flyToBounds(markerGroup.getBounds(), { padding: [100, 100], duration: 1.5 });
            this.routePolyline = L.polyline(points.map(i => [i.lat, i.lng]), {
                color: '#004a99', weight: 4, opacity: 0.8, dashArray: '8, 12', lineCap: 'round', lineJoin: 'round'
            }).addTo(map);
        }
    }
};

window.ItineraryPlanner = ItineraryPlanner;
document.addEventListener('DOMContentLoaded', () => ItineraryPlanner.init());
