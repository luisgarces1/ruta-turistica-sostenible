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
                        <button class="city-tag px-4 py-3 rounded-xl border-2 border-white/20 hover:border-white transition-all font-black text-base uppercase tracking-widest bg-white text-[#003087] min-w-[140px]" data-value="Cartagena">
                            Cartagena
                        </button>
                        <button class="city-tag px-4 py-3 rounded-xl border-2 border-white/20 hover:border-white transition-all font-black text-base uppercase tracking-widest min-w-[140px]" data-value="Barranquilla">
                            Barranquilla
                        </button>
                    </div>
                    <div class="pt-4">
                        <button id="next-to-step-2" class="bg-white text-[#003087] px-10 py-3 rounded-full font-black uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all text-sm">Siguiente</button>
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
                        <button id="next-to-step-3" class="bg-white text-[#003087] px-8 py-3 rounded-full font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all text-sm">Siguiente</button>
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
                        <button id="generate-itinerary" class="bg-white text-[#003087] px-8 py-3 rounded-full font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all text-sm">Generar mi Ruta</button>
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
            // Close overlay if open
            const overlay = document.getElementById('itinerary-overlay');
            if (overlay) overlay.classList.add('translate-y-full');
            this.resetToMainMap();
        });

        closeBtn.addEventListener('click', () => {
            overlay.classList.add('translate-y-full');
        });

        document.querySelectorAll('.city-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                document.querySelectorAll('.city-tag').forEach(t => t.classList.remove('bg-white', 'text-[#003087]', 'border-white'));
                tag.classList.add('bg-white', 'text-[#003087]', 'border-white');
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
                    tag.classList.remove('bg-white', 'text-[#003087]', 'border-white');
                    tag.classList.add('border-white/20');
                    this.selectedInterests.delete(tag.dataset.value);
                } else {
                    tag.classList.add('bg-white', 'text-[#003087]', 'border-white');
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
            if (diffDays > 100) { alert('Soporta hasta 100 días.'); return; }
            this.generate(diffDays);
            overlay.classList.add('translate-y-full');
            if (window.showView) window.showView('map');
        });
    },

    resetForm() {
        this.selectedInterests.clear();
        document.querySelectorAll('.interest-tag').forEach(el => {
            el.classList.remove('bg-white', 'text-[#003087]', 'border-white');
            el.classList.add('border-white/20');
        });
        if (this.flatpickrInstance) this.flatpickrInstance.clear();
        this.startDate = null; this.endDate = null;
        ['step-1'].forEach(id => document.getElementById(id).classList.remove('hidden'));
        ['step-2', 'step-3'].forEach(id => document.getElementById(id).classList.add('hidden'));
    },

    resetToMainMap(reOpen = false) {
        if (this.routePolyline) {
            map.removeLayer(this.routePolyline);
            this.routePolyline = null;
        }
        this.fullItinerary = null;
        currentActiveFilter = 'todas';
        const filterContainer = document.getElementById('filter-container');
        filterContainer.innerHTML = '';
        renderFilters(); updateFilterUI(); filterMarkers(); closeSidePanel();
        
        if (reOpen) this.open();
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
            // 1. Validar fechas para eventos estacionales
            if (item.eventMonth !== undefined) {
                const startM = this.startDate.getMonth();
                const endM = this.endDate.getMonth();
                if (startM !== item.eventMonth && endM !== item.eventMonth) return false;
            }

            // 2. Validar categorías e intereses
            if (this.selectedInterests.size === 0) return true;
            
            // Coincidencia directa
            if (this.selectedInterests.has(item.category)) return true;

            // Expandir búsqueda a subcategorías
            for (const interestId of this.selectedInterests) {
                const parentCat = categories.find(c => c.id === interestId);
                if (parentCat && parentCat.subcategories) {
                    if (parentCat.subcategories.some(sub => sub.id === item.category)) return true;
                }
            }

            return false;
        });

        if (filtered.length === 0) { alert('Sin coincidencias.'); return; }

        if (this.startCity === 'Cartagena') filtered.sort((a,b) => a.lat - b.lat);
        else filtered.sort((a,b) => b.lat - a.lat);

        this.fullItinerary = {};
        const totalPointsAvailable = filtered.length;
        
        // Nueva lógica: Asegurar que CADA día tenga al menos 3 actividades
        // Si se acaban los puntos únicos, empezamos a repetir el ciclo para llenar los días
        for (let i = 0; i < numDays; i++) {
            const dayPoints = [];
            const numPointsToday = 3; // Forzamos 3 por día como mínimo
            
            for (let j = 0; j < numPointsToday; j++) {
                // Usamos el operador módulo (%) para volver al principio de la lista si se agotan
                const pointIdx = (i * numPointsToday + j) % totalPointsAvailable;
                dayPoints.push(filtered[pointIdx]);
            }
            
            this.fullItinerary[i + 1] = dayPoints;
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
            tabsHtml += `<button onclick="ItineraryPlanner.switchDay(${i})" class="flex-shrink-0 snap-center px-5 py-2.5 text-[11px] font-black tracking-widest rounded-lg transition-all ${i === this.currentDayView ? 'bg-[#003087] text-white shadow-lg' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}">DÍA ${i}</button>`;
        }

        const items = this.fullItinerary[this.currentDayView] || [];
        const date = new Date(this.startDate);
        date.setDate(date.getDate() + (this.currentDayView - 1));

        filterContainer.innerHTML = `
            <div class="space-y-6">
                <div class="flex items-center justify-between border-b pb-4">
                    <button onclick="ItineraryPlanner.resetToMainMap(true)" class="text-xs font-black text-gray-400 hover:text-[#003087] flex items-center gap-2 group transition-colors px-1">
                        <i class="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> SALIR
                    </button>
                    <button id="save-itinerary-btn" onclick="ItineraryPlanner.saveCurrentItinerary()" class="text-xs font-black text-gray-400 hover:text-emerald-600 flex items-center gap-1.5 transition-colors px-2 py-1 rounded-lg border border-transparent hover:border-gray-200">
                        <i class="fa-solid fa-floppy-disk text-[10px]"></i> Guardar
                    </button>
                    <span class="text-[9px] font-black text-blue-600 bg-blue-50 px-2.1 py-1 rounded shadow-sm border border-blue-100 uppercase">INICIO: ${this.startCity}</span>
                </div>
                <div id="itinerary-days-container" class="flex gap-2 bg-gray-50 p-1.5 rounded-xl overflow-x-auto snap-x snap-mandatory hide-scrollbar whitespace-nowrap w-full cursor-pointer" style="scrollbar-width: none; -ms-overflow-style: none; -webkit-overflow-scrolling: touch;">${tabsHtml}</div>
                <div class="space-y-1">
                    <h3 class="text-xl font-black text-gray-900 italic">Ruta del Día ${this.currentDayView}</h3>
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">${date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                </div>
                <div id="itinerary-list" class="space-y-3">
                    ${items.length > 0 ? items.map((item, idx) => {
                        let prevCoord = idx === 0 ? this.cityCoords[this.startCity] : [items[idx-1].lat, items[idx-1].lng];
                        let time = this.calculateTravelTime(prevCoord, [item.lat, item.lng]);
                        let label = idx === 0 ? `Desde centro de ${this.startCity}` : `Desde punto anterior`;
                        
                        return `
                            <div class="flex items-center gap-2 py-1 pl-4">
                                <div class="w-[1px] h-4 border-l border-dashed border-gray-300"></div>
                                <span class="text-[9px] font-bold text-gray-400 italic">${label}: ~${time} min</span>
                            </div>
                            <div onclick="ItineraryPlanner.focusPoint(${item.id})" class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#003087]/20 transition-all cursor-pointer group relative overflow-hidden flex flex-col gap-3">
                                <div class="absolute left-0 top-0 bottom-0 w-1 bg-gray-100 group-hover:bg-[#003087] transition-colors"></div>
                                <div class="flex justify-between items-start w-full">
                                    <div class="max-w-[75%]">
                                        <p class="font-bold text-[#003087] text-sm transition-colors">${item.title}</p>
                                        <p class="text-[10px] text-gray-400 font-medium mt-0.5">${item.location}</p>
                                    </div>
                                    <div class="flex items-center gap-1">
                                        <span class="text-[10px] font-black text-gray-300 mr-2">#${idx + 1}</span>
                                        <div class="flex flex-col gap-0.5">
                                            ${idx > 0 ? `<button onclick="ItineraryPlanner.reorderStop(${this.currentDayView}, ${idx}, 'up', event)" class="p-1 text-[8px] text-gray-400 hover:text-[#003087] bg-gray-50 hover:bg-gray-100 rounded transition-colors" title="Subir Parada"><i class="fa-solid fa-chevron-up"></i></button>` : ''}
                                            ${idx < items.length - 1 ? `<button onclick="ItineraryPlanner.reorderStop(${this.currentDayView}, ${idx}, 'down', event)" class="p-1 text-[8px] text-gray-400 hover:text-[#003087] bg-gray-50 hover:bg-gray-100 rounded transition-colors" title="Bajar Parada"><i class="fa-solid fa-chevron-down"></i></button>` : ''}
                                        </div>
                                    </div>
                                </div>
                                <div class="flex justify-end items-center gap-3 border-t pt-2 border-gray-50">
                                    <button onclick="ItineraryPlanner.toggleAlternatives(${this.currentDayView}, ${idx}, event)" class="text-[9px] font-black text-gray-400 hover:text-[#003087] flex items-center gap-1 uppercase tracking-wider transition-colors" title="Cambiar por parada cercana">
                                        <i class="fa-solid fa-arrows-rotate text-[10px]"></i> Cambiar
                                    </button>
                                    <button onclick="ItineraryPlanner.deleteStop(${this.currentDayView}, ${idx}, event)" class="text-[9px] font-black text-gray-400 hover:text-rose-600 flex items-center gap-1 uppercase tracking-wider transition-colors" title="Eliminar parada">
                                        <i class="fa-solid fa-trash-can text-[10px]"></i> Eliminar
                                    </button>
                                </div>
                                <div id="alternatives-panel-${this.currentDayView}-${idx}" class="hidden mt-2 p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-2 pointer-events-auto">
                                    <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest">Alternativas cercanas:</p>
                                    <div class="flex flex-col gap-1.5" id="alternatives-list-${this.currentDayView}-${idx}"></div>
                                </div>
                            </div>
                        `;
                    }).join('') : '<p class="text-xs text-gray-400 italic py-4">No hay paradas en este día.</p>'}
                </div>
            </div>
        `;

        // Permitir scroll horizontal con la rueda del ratón y mantener posición
        setTimeout(() => {
            const tabsContainer = document.getElementById('itinerary-days-container');
            if (tabsContainer) {
                // 1. Centrar el botón activo automáticamente
                const activeBtn = tabsContainer.querySelector('button.bg-\\[\\#003087\\]');
                if (activeBtn) {
                    activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                }

                // 2. Wheel scroll listener
                tabsContainer.addEventListener('wheel', (evt) => {
                    if (evt.deltaY !== 0) {
                        evt.preventDefault();
                        tabsContainer.scrollLeft += evt.deltaY * 1.5;
                    }
                }, { passive: false });
            }
        }, 50);
    },

    switchDay(day) {
        this.currentDayView = day;
        this.renderItinerarySidebar();
        this.updateMapForDay(day);
    },

    focusPoint(id) {
        const marker = allMarkers.find(m => m.itemData.id === id);
        if (marker) {
            // 1. Disparar el click para abrir el panel
            marker.fire('click');
            
            // 2. Centrar mapa con zoom
            map.setView(marker.getLatLng(), 14);

            // 3. En móviles, forzar el scroll hacia el mapa
            setTimeout(() => {
                const mapElement = document.getElementById('map');
                if (mapElement) {
                    mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
        }
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
                color: '#003087', weight: 4, opacity: 0.8, dashArray: '8, 12', lineCap: 'round', lineJoin: 'round'
            }).addTo(map);
        }
    },

    calculateDistance(pointA, pointB) {
        const lat1 = pointA[0], lon1 = pointA[1];
        const lat2 = pointB[0], lon2 = pointB[1];
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
                Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return parseFloat((R * c).toFixed(1));
    },

    saveCurrentItinerary() {
        if (!this.fullItinerary) {
            alert("No hay ningún itinerario para guardar.");
            return;
        }
        const dataToSave = {
            startCity: this.startCity,
            startDate: this.startDate ? this.startDate.toISOString() : null,
            endDate: this.endDate ? this.endDate.toISOString() : null,
            fullItinerary: this.fullItinerary,
            savedAt: new Date().toISOString()
        };
        localStorage.setItem('saved_itinerary', JSON.stringify(dataToSave));

        // Update button feedback
        const saveBtn = document.getElementById('save-itinerary-btn');
        if (saveBtn) {
            const originalHtml = saveBtn.innerHTML;
            saveBtn.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-500"></i> Guardado`;
            saveBtn.classList.add('bg-emerald-50', 'text-emerald-700', 'border-emerald-200');
            saveBtn.classList.remove('text-gray-400');
            setTimeout(() => {
                saveBtn.innerHTML = originalHtml;
                saveBtn.classList.remove('bg-emerald-50', 'text-emerald-700', 'border-emerald-200');
                saveBtn.classList.add('text-gray-400');
            }, 3000);
        }

        // Show informative toast
        this._showSaveToast();

        if (window.checkSavedRouteUI) window.checkSavedRouteUI();
    },

    _showSaveToast() {
        // Remove existing toast if any
        const existing = document.getElementById('save-success-toast');
        if (existing) existing.remove();

        const numDays = this.fullItinerary ? Object.keys(this.fullItinerary).length : 0;
        const dateStr = this.startDate
            ? this.startDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
            : '';

        const toast = document.createElement('div');
        toast.id = 'save-success-toast';
        toast.style.cssText = `
            position: fixed;
            bottom: 24px;
            left: 50%;
            transform: translateX(-50%) translateY(120px);
            z-index: 9999;
            transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease;
            opacity: 0;
            max-width: 380px;
            width: calc(100% - 32px);
        `;
        toast.innerHTML = `
            <div style="background: white; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.05); overflow: hidden;">
                <div style="background: linear-gradient(135deg, #059669, #047857); padding: 16px 20px; display: flex; align-items: center; gap: 12px;">
                    <div style="width: 40px; height: 40px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <i class="fa-solid fa-floppy-disk" style="color: white; font-size: 18px;"></i>
                    </div>
                    <div>
                        <p style="color: white; font-weight: 900; font-size: 14px; margin: 0;">¡Ruta guardada con éxito!</p>
                        <p style="color: rgba(255,255,255,0.85); font-size: 11px; margin: 2px 0 0;">${numDays} día${numDays !== 1 ? 's' : ''} · Desde ${this.startCity}${dateStr ? ' · ' + dateStr : ''}</p>
                    </div>
                    <button onclick="document.getElementById('save-success-toast').remove()" style="margin-left: auto; background: rgba(255,255,255,0.2); border: none; width: 28px; height: 28px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <i class="fa-solid fa-xmark" style="color: white; font-size: 12px;"></i>
                    </button>
                </div>
                <div style="padding: 14px 20px; background: #f0fdf4;">
                    <p style="color: #166534; font-size: 12px; font-weight: 600; margin: 0 0 10px; display: flex; align-items: center; gap: 8px;">
                        <i class="fa-solid fa-circle-info"></i>
                        ¿Cómo volver a ver tu ruta?
                    </p>
                    <div style="display: flex; flex-direction: column; gap: 6px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="width: 20px; height: 20px; background: #003087; color: white; border-radius: 50%; font-size: 10px; font-weight: 900; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">1</span>
                            <span style="font-size: 11px; color: #374151; font-weight: 500;">Ve a la sección <strong>RUTAS</strong> en el menú superior</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="width: 20px; height: 20px; background: #003087; color: white; border-radius: 50%; font-size: 10px; font-weight: 900; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">2</span>
                            <span style="font-size: 11px; color: #374151; font-weight: 500;">Haz clic en la tarjeta <strong>"Mi Ruta Guardada"</strong></span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="width: 20px; height: 20px; background: #059669; color: white; border-radius: 50%; font-size: 10px; font-weight: 900; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i class="fa-solid fa-check" style="font-size: 8px;"></i></span>
                            <span style="font-size: 11px; color: #374151; font-weight: 500;">¡Tu itinerario se cargará automáticamente!</span>
                        </div>
                    </div>
                    <button onclick="ItineraryPlanner._goToSavedFromToast()" style="margin-top: 12px; width: 100%; background: #003087; color: white; border: none; border-radius: 12px; padding: 10px; font-size: 12px; font-weight: 900; cursor: pointer; letter-spacing: 0.05em; display: flex; align-items: center; justify-content: center; gap: 6px; transition: background 0.2s;" onmouseover="this.style.background='#002266'" onmouseout="this.style.background='#003087'">
                        <i class="fa-solid fa-folder-open"></i> Ver mi ruta guardada ahora
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                toast.style.transform = 'translateX(-50%) translateY(0)';
                toast.style.opacity = '1';
            });
        });

        // Auto-dismiss after 8 seconds
        this._toastTimer = setTimeout(() => {
            toast.style.transform = 'translateX(-50%) translateY(120px)';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 400);
        }, 8000);
    },

    _goToSavedFromToast() {
        const toast = document.getElementById('save-success-toast');
        if (toast) toast.remove();
        if (window.showView) window.showView('routes');
        // Highlight saved card briefly
        setTimeout(() => {
            const savedCard = document.getElementById('route-card-saved');
            if (savedCard) {
                savedCard.style.transform = 'scale(1.03)';
                savedCard.style.transition = 'transform 0.3s ease';
                setTimeout(() => { savedCard.style.transform = ''; }, 600);
            }
        }, 300);
    },

    loadSavedItinerary() {
        const saved = localStorage.getItem('saved_itinerary');
        if (!saved) return false;
        try {
            const data = JSON.parse(saved);
            this.startCity = data.startCity;
            this.startDate = data.startDate ? new Date(data.startDate) : null;
            this.endDate = data.endDate ? new Date(data.endDate) : null;
            this.fullItinerary = data.fullItinerary;
            this.currentDayView = 1;

            // Render and update
            this.renderItinerarySidebar();
            this.updateMapForDay(1);

            // Go to map view
            if (window.showView) window.showView('map');

            // Close initial planner overlay if open
            const overlay = document.getElementById('itinerary-overlay');
            if (overlay) overlay.classList.add('translate-y-full');

            // Show load confirmation toast
            const numDays = this.fullItinerary ? Object.keys(this.fullItinerary).length : 0;
            const savedAt = data.savedAt ? new Date(data.savedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' }) : '';
            this._showLoadToast(numDays, savedAt);

            return true;
        } catch (e) {
            console.error("Error loading saved itinerary", e);
            return false;
        }
    },

    _showLoadToast(numDays, savedAt) {
        const existing = document.getElementById('load-success-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.id = 'load-success-toast';
        toast.style.cssText = `
            position: fixed;
            top: 90px;
            right: 16px;
            z-index: 9999;
            transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease;
            transform: translateX(120%);
            opacity: 0;
            max-width: 300px;
        `;
        toast.innerHTML = `
            <div style="background: white; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05); overflow: hidden; display: flex; align-items: stretch;">
                <div style="width: 5px; background: linear-gradient(135deg, #059669, #047857); flex-shrink: 0;"></div>
                <div style="padding: 14px 16px; display: flex; align-items: center; gap: 12px;">
                    <div style="width: 36px; height: 36px; background: #f0fdf4; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <i class="fa-solid fa-folder-open" style="color: #059669; font-size: 16px;"></i>
                    </div>
                    <div>
                        <p style="color: #111827; font-weight: 800; font-size: 13px; margin: 0;">Ruta cargada</p>
                        <p style="color: #6b7280; font-size: 11px; margin: 2px 0 0;">${numDays} día${numDays !== 1 ? 's' : ''} · Desde ${this.startCity}${savedAt ? ' · guardada el ' + savedAt : ''}</p>
                    </div>
                    <button onclick="document.getElementById('load-success-toast').remove()" style="margin-left: 4px; background: #f3f4f6; border: none; width: 24px; height: 24px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <i class="fa-solid fa-xmark" style="color: #6b7280; font-size: 10px;"></i>
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                toast.style.transform = 'translateX(0)';
                toast.style.opacity = '1';
            });
        });

        setTimeout(() => {
            toast.style.transform = 'translateX(120%)';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    },

    reorderStop(day, index, direction, event) {
        if (event) event.stopPropagation();
        const list = this.fullItinerary[day];
        if (!list) return;

        const targetIdx = direction === 'up' ? index - 1 : index + 1;
        if (targetIdx < 0 || targetIdx >= list.length) return;

        // Swap items
        const temp = list[index];
        list[index] = list[targetIdx];
        list[targetIdx] = temp;

        this.renderItinerarySidebar();
        this.updateMapForDay(day);
    },

    deleteStop(day, index, event) {
        if (event) event.stopPropagation();
        const list = this.fullItinerary[day];
        if (!list) return;

        list.splice(index, 1);

        this.renderItinerarySidebar();
        this.updateMapForDay(day);
    },

    toggleAlternatives(day, index, event) {
        if (event) event.stopPropagation();
        const panel = document.getElementById(`alternatives-panel-${day}-${index}`);
        const listContainer = document.getElementById(`alternatives-list-${day}-${index}`);
        if (!panel || !listContainer) return;

        if (!panel.classList.contains('hidden')) {
            panel.classList.add('hidden');
            return;
        }

        const currentItem = this.fullItinerary[day][index];
        const eligible = mockData.filter(item => {
            if (item.id === currentItem.id) return false;
            const todayPoints = this.fullItinerary[day] || [];
            if (todayPoints.some(p => p.id === item.id)) return false;
            
            if (this.selectedInterests.size > 0) {
                if (this.selectedInterests.has(item.category) || item.category === currentItem.category) return true;
                for (const interestId of this.selectedInterests) {
                    const parentCat = categories.find(c => c.id === interestId);
                    if (parentCat && parentCat.subcategories) {
                        if (parentCat.subcategories.some(sub => sub.id === item.category)) return true;
                    }
                }
                return false;
            }
            return true;
        });

        eligible.forEach(item => {
            item.tempDistance = this.calculateDistance([currentItem.lat, currentItem.lng], [item.lat, item.lng]);
        });
        eligible.sort((a, b) => a.tempDistance - b.tempDistance);
        const top3 = eligible.slice(0, 3);

        if (top3.length === 0) {
            listContainer.innerHTML = `<p class="text-[10px] text-gray-400 italic">No hay paradas alternativas disponibles.</p>`;
        } else {
            listContainer.innerHTML = top3.map(alt => `
                <button onclick="ItineraryPlanner.selectAlternative(${day}, ${index}, ${alt.id}, event)" class="w-full text-left p-2.5 bg-white hover:bg-[#003087]/5 border border-gray-100 hover:border-[#003087]/20 rounded-xl transition-all flex justify-between items-center group/alt text-[11px] font-bold text-gray-700">
                    <span class="truncate max-w-[70%] group-hover/alt:text-[#003087] transition-colors">${alt.title}</span>
                    <span class="text-[9px] text-[#003087] bg-blue-50 px-1.5 py-0.5 rounded">${alt.tempDistance} km</span>
                </button>
            `).join('');
        }

        panel.classList.remove('hidden');
    },

    selectAlternative(day, index, newPointId, event) {
        if (event) event.stopPropagation();
        const newPoint = mockData.find(p => p.id === newPointId);
        if (!newPoint) return;

        this.fullItinerary[day][index] = newPoint;
        this.renderItinerarySidebar();
        this.updateMapForDay(day);
    }
};

window.ItineraryPlanner = ItineraryPlanner;
document.addEventListener('DOMContentLoaded', () => ItineraryPlanner.init());
