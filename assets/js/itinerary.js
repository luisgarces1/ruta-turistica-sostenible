// l:/PORYECTOS DE PAGINAS/juan3/ruta-turistica-sostenible/mapa-interactivo/assets/js/itinerary.js

const ItineraryPlanner = {
    selectedInterests: new Set(),
    startDate: null,
    endDate: null,
    currentDayView: 1,
    fullItinerary: null,
    flatpickrInstance: null,
    startCity: 'Cartagena',
    activeStopIndex: 0,
    selectedCompanion: 'En Pareja',
    selectedBudget: 'Moderado',
    selectedPace: 'Moderado',
    userEmail: '',

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
        overlay.className = 'fixed inset-0 z-[200] transform translate-y-full transition-transform duration-500 ease-in-out flex flex-col items-center justify-center p-6 text-white text-center sm:overflow-y-auto bg-cover bg-center bg-no-repeat pointer-events-none';
        overlay.style.backgroundImage = 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("assets/images/puntos/puente-del-viaducto-el-gran-manglar.webp")';
        
        overlay.innerHTML = `
            <button id="close-itinerary" class="absolute top-8 right-8 text-white hover:scale-110 transition-transform">
                <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div class="max-w-2xl w-full space-y-6 py-6 transition-all">
                <!-- STEP 1: Starting City -->
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

                <!-- STEP 2: Interests -->
                <div id="step-2" class="space-y-6 hidden animate-fade-in">
                    <h2 class="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white">¿Qué te interesa?</h2>
                    <div class="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
                        ${categories.filter(c => c.id !== 'todas' && c.id !== 'otros').map(cat => `
                            <button class="interest-tag px-4 py-2 rounded-full border border-white/20 hover:border-white hover:bg-white/10 transition-all font-bold text-sm" data-value="${cat.id}">${cat.label}</button>
                        `).join('')}
                    </div>
                    <div class="pt-4 flex justify-center gap-3">
                        <button id="back-to-step-1" class="border border-white/20 px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-white/10 transition-all text-xs">Atrás</button>
                        <button id="next-to-step-3" class="bg-white text-[#003087] px-8 py-3 rounded-full font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all text-sm">Siguiente</button>
                    </div>
                </div>

                <!-- STEP 3: Companion -->
                <div id="step-3" class="space-y-6 hidden animate-fade-in">
                    <h2 class="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white">¿Con quién viajas?</h2>
                    <p class="text-blue-100/80 text-sm font-medium">Adaptamos las actividades para ti y tus acompañantes</p>
                    <div class="flex flex-wrap justify-center gap-3">
                        <button class="companion-tag px-4 py-3 rounded-xl border-2 border-white/20 hover:border-white transition-all font-black text-sm uppercase tracking-widest min-w-[130px]" data-value="Solo">
                            👤 Solo
                        </button>
                        <button class="companion-tag px-4 py-3 rounded-xl border-2 border-white bg-white text-[#003087] transition-all font-black text-sm uppercase tracking-widest min-w-[130px]" data-value="En Pareja">
                            💕 En Pareja
                        </button>
                        <button class="companion-tag px-4 py-3 rounded-xl border-2 border-white/20 hover:border-white transition-all font-black text-sm uppercase tracking-widest min-w-[130px]" data-value="Con Amigos">
                            🍻 Con Amigos
                        </button>
                        <button class="companion-tag px-4 py-3 rounded-xl border-2 border-white/20 hover:border-white transition-all font-black text-sm uppercase tracking-widest min-w-[130px]" data-value="En Familia">
                            👨‍👩‍👧‍👦 En Familia
                        </button>
                    </div>
                    <div class="pt-4 flex justify-center gap-3">
                        <button id="back-to-step-2" class="border border-white/20 px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-white/10 transition-all text-xs">Atrás</button>
                        <button id="next-to-step-4" class="bg-white text-[#003087] px-8 py-3 rounded-full font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all text-sm">Siguiente</button>
                    </div>
                </div>

                <!-- STEP 4: Budget & Pace -->
                <div id="step-4" class="space-y-8 hidden animate-fade-in max-w-lg mx-auto">
                    <div class="space-y-4">
                        <h2 class="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white">¿Cuál es tu presupuesto?</h2>
                        <div class="flex flex-wrap justify-center gap-3">
                            <button class="budget-tag px-4 py-2.5 rounded-xl border border-white/20 hover:border-white transition-all font-extrabold text-xs uppercase tracking-wider min-w-[110px]" data-value="Económico">
                                Económico
                            </button>
                            <button class="budget-tag px-4 py-2.5 rounded-xl border border-white bg-white text-[#003087] transition-all font-extrabold text-xs uppercase tracking-wider min-w-[110px]" data-value="Moderado">
                                Moderado
                            </button>
                            <button class="budget-tag px-4 py-2.5 rounded-xl border border-white/20 hover:border-white transition-all font-extrabold text-xs uppercase tracking-wider min-w-[110px]" data-value="Lujoso">
                                Lujoso
                            </button>
                        </div>
                    </div>

                    <div class="space-y-4">
                        <h2 class="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white">¿Qué ritmo prefieres?</h2>
                        <div class="flex flex-wrap justify-center gap-3">
                            <button class="pace-tag px-4 py-2.5 rounded-xl border border-white/20 hover:border-white transition-all font-extrabold text-xs uppercase tracking-wider min-w-[110px]" data-value="Relajado">
                                Relajado
                            </button>
                            <button class="pace-tag px-4 py-2.5 rounded-xl border border-white bg-white text-[#003087] transition-all font-extrabold text-xs uppercase tracking-wider min-w-[110px]" data-value="Moderado">
                                Moderado
                            </button>
                            <button class="pace-tag px-4 py-2.5 rounded-xl border border-white/20 hover:border-white transition-all font-extrabold text-xs uppercase tracking-wider min-w-[110px]" data-value="Activo">
                                Activo
                            </button>
                        </div>
                    </div>

                    <div class="pt-4 flex justify-center gap-3 border-t border-white/10">
                        <button id="back-to-step-3" class="border border-white/20 px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-white/10 transition-all text-xs">Atrás</button>
                        <button id="next-to-step-5" class="bg-white text-[#003087] px-8 py-3 rounded-full font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all text-sm">Siguiente</button>
                    </div>
                </div>

                <!-- STEP 5: Calendar range -->
                <div id="step-5" class="space-y-6 hidden animate-fade-in w-full px-4 max-w-lg mx-auto">
                    <h2 class="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white">¿Cuándo viajas?</h2>
                    
                    <div class="flex flex-col md:flex-row gap-6 items-center justify-center">
                        <div class="bg-white p-2 rounded-3xl shadow-2xl inline-block shrink-0">
                            <div id="calendar-container" class="text-gray-800 scale-90 origin-top"></div>
                            <input type="text" id="date-range-input" class="absolute opacity-0 pointer-events-none">
                        </div>

                        <!-- Calendar Festivals Panel -->
                        <div id="calendar-festivals-info" class="hidden text-xs text-left bg-black/40 backdrop-blur-xl p-5 rounded-3xl w-full max-w-sm border border-white/10 space-y-3 custom-scrollbar">
                            <p class="font-black uppercase tracking-widest text-[#FF6900] flex items-center gap-1.5 border-b border-white/10 pb-2">
                                <i class="fa-solid fa-calendar-days"></i> Calendario de Eventos
                            </p>
                            <div id="calendar-festivals-list" class="max-h-56 overflow-y-auto custom-scrollbar space-y-2.5 text-blue-100 font-medium pr-1">
                                <!-- Injected dynamically -->
                            </div>
                        </div>
                    </div>

                    <div class="pt-4 flex justify-center gap-3">
                        <button id="back-to-step-4" class="border border-white/20 px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-white/10 transition-all text-xs">Atrás</button>
                        <button id="next-to-step-6" class="bg-white text-[#003087] px-8 py-3 rounded-full font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all text-sm">Siguiente</button>
                    </div>
                </div>

                <!-- STEP 6: Confirm & Send -->
                <div id="step-6" class="space-y-6 hidden animate-fade-in w-full px-4 max-w-md mx-auto">
                    <h2 class="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white">¿A dónde te enviamos la guía?</h2>
                    <p class="text-blue-100/80 text-sm font-medium">Ingresa tu correo para recibir el itinerario detallado y tenerlo siempre a mano</p>
                    
                    <div class="space-y-4">
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <i class="fa-solid fa-envelope text-gray-400 text-base"></i>
                            </div>
                            <input type="email" id="itinerary-email-input" placeholder="correo@ejemplo.com" class="block w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#FF6900] transition-all font-bold text-gray-800 placeholder:text-gray-400 text-sm shadow-xl">
                        </div>
                        <div class="flex items-center justify-center gap-2.5 text-xs text-blue-100/90 font-medium">
                            <input type="checkbox" id="itinerary-privacy-check" checked class="rounded border-white/20 text-[#003087] focus:ring-0 w-4 h-4 cursor-pointer">
                            <label for="itinerary-privacy-check" class="cursor-pointer select-none">Acepto recibir la guía y políticas de privacidad</label>
                        </div>
                    </div>

                    <div class="pt-6 flex justify-center gap-3">
                        <button id="back-to-step-5" class="border border-white/20 px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-white/10 transition-all text-xs">Atrás</button>
                        <button id="generate-itinerary" class="bg-white text-[#003087] px-8 py-3 rounded-full font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all text-sm flex items-center gap-2">
                            <span>Crear mi guía</span>
                            <i class="fa-solid fa-wand-magic-sparkles text-xs text-[#FF6900]"></i>
                        </button>
                    </div>
                </div>

                <!-- LOADING SCREEN -->
                <div id="itinerary-loading" class="space-y-6 flex flex-col items-center justify-center py-10 hidden">
                    <div class="relative w-20 h-20">
                        <div class="animate-spin rounded-full h-20 w-20 border-4 border-white/20 border-t-white"></div>
                        <div class="absolute inset-0 flex items-center justify-center">
                            <i class="fa-solid fa-paper-plane text-white text-xl animate-bounce"></i>
                        </div>
                    </div>
                    <h3 class="text-xl font-bold uppercase tracking-wider text-white">Diseñando tu viaje...</h3>
                    <p class="text-blue-100/70 text-xs max-w-xs">Buscando paradas ideales y enviando la guía a tu correo electrónico.</p>
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
            },
            onDayCreate: (dObj, dStr, fp, dayElem) => {
                const date = dayElem.dateObj;
                const month = date.getMonth();
                const dayNum = date.getDate();
                const events = mockData.filter(item => {
                    if (item.category !== 'eventos') return false;
                    if (item.eventMonth !== month) return false;
                    if (item.startDay !== undefined && item.endDay !== undefined) {
                        return dayNum >= item.startDay && dayNum <= item.endDay;
                    }
                    return true;
                });
                if (events.length > 0) {
                    dayElem.classList.add('has-festival-day');
                    dayElem.setAttribute('title', events.map(e => `${e.title} (${e.location.split(',')[0]})`).join(', '));
                }
            }
        });
    },

    open() {
        const overlay = document.getElementById('itinerary-overlay');
        if (overlay) {
            overlay.classList.remove('translate-y-full', 'pointer-events-none');
            this.resetForm();
        }
    },

    close() {
        const overlay = document.getElementById('itinerary-overlay');
        if (overlay) {
            overlay.classList.add('translate-y-full', 'pointer-events-none');
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
            this.close();
            this.resetToMainMap();
        });

        closeBtn.addEventListener('click', () => {
            this.close();
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

        document.querySelectorAll('.companion-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                document.querySelectorAll('.companion-tag').forEach(t => t.classList.remove('bg-white', 'text-[#003087]', 'border-white'));
                tag.classList.add('bg-white', 'text-[#003087]', 'border-white');
                this.selectedCompanion = tag.dataset.value;
            });
        });

        document.getElementById('back-to-step-2').addEventListener('click', () => {
            document.getElementById('step-3').classList.add('hidden');
            document.getElementById('step-2').classList.remove('hidden');
        });

        document.getElementById('next-to-step-4').addEventListener('click', () => {
            document.getElementById('step-3').classList.add('hidden');
            document.getElementById('step-4').classList.remove('hidden');
        });

        document.querySelectorAll('.budget-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                document.querySelectorAll('.budget-tag').forEach(t => t.classList.remove('bg-white', 'text-[#003087]', 'border-white'));
                tag.classList.add('bg-white', 'text-[#003087]', 'border-white');
                this.selectedBudget = tag.dataset.value;
            });
        });

        document.querySelectorAll('.pace-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                document.querySelectorAll('.pace-tag').forEach(t => t.classList.remove('bg-white', 'text-[#003087]', 'border-white'));
                tag.classList.add('bg-white', 'text-[#003087]', 'border-white');
                this.selectedPace = tag.dataset.value;
            });
        });

        document.getElementById('back-to-step-3').addEventListener('click', () => {
            document.getElementById('step-4').classList.add('hidden');
            document.getElementById('step-3').classList.remove('hidden');
        });

        document.getElementById('next-to-step-5').addEventListener('click', () => {
            document.getElementById('step-4').classList.add('hidden');
            document.getElementById('step-5').classList.remove('hidden');
            
            // Show/hide festival info panel
            const festInfo = document.getElementById('calendar-festivals-info');
            const festList = document.getElementById('calendar-festivals-list');
            if (festInfo && festList) {
                if (this.selectedInterests.has('eventos')) {
                    festInfo.classList.remove('hidden');
                    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
                    const events = mockData.filter(item => item.category === 'eventos').sort((a,b) => {
                        if (a.eventMonth !== b.eventMonth) return a.eventMonth - b.eventMonth;
                        return (a.startDay || 0) - (b.startDay || 0);
                    });
                    
                    festList.innerHTML = events.map(ev => {
                        let dateRangeStr = monthNames[ev.eventMonth];
                        if (ev.startDay !== undefined) {
                            if (ev.endDay !== undefined && ev.endDay !== ev.startDay) {
                                dateRangeStr += ` ${ev.startDay}-${ev.endDay}`;
                            } else {
                                dateRangeStr += ` ${ev.startDay}`;
                            }
                        }
                        return `
                            <div onclick="ItineraryPlanner.generateRouteForEvent(${ev.id})" class="flex justify-between items-start gap-4 border-b border-white/5 pb-1.5 last:border-b-0 last:pb-0 cursor-pointer hover:bg-white/10 p-1.5 rounded transition-all group" title="Click para generar ruta con este evento">
                                <span class="font-bold text-[#FF6900] uppercase text-[10px] shrink-0 w-24 group-hover:text-white transition-colors">${dateRangeStr}</span>
                                <div class="flex-1 min-w-0 text-left">
                                    <p class="text-white font-bold truncate text-[11px] group-hover:text-[#FF6900] transition-colors">${ev.title}</p>
                                    <p class="text-blue-200/60 text-[9px] uppercase tracking-wider">${ev.location.split(',')[0]}</p>
                                </div>
                            </div>
                        `;
                    }).join('');
                } else {
                    festInfo.classList.add('hidden');
                }
            }
        });

        document.getElementById('back-to-step-4').addEventListener('click', () => {
            document.getElementById('step-5').classList.add('hidden');
            document.getElementById('step-4').classList.remove('hidden');
        });

        document.getElementById('next-to-step-6').addEventListener('click', () => {
            if (!this.startDate || !this.endDate) {
                alert('Por favor selecciona un rango de fechas en el calendario');
                return;
            }

            // Check if events are selected and if they match the date range
            if (this.selectedInterests.has('eventos')) {
                const selectedDates = [];
                let curr = new Date(this.startDate);
                while (curr <= this.endDate) {
                    selectedDates.push(new Date(curr));
                    curr.setDate(curr.getDate() + 1);
                }
                
                // Buscar eventos que coincidan con CUALQUIER día del rango
                const matchingEvents = mockData.filter(item => {
                    if (item.category !== 'eventos') return false;
                    return selectedDates.some(d => {
                        const m = d.getMonth();
                        const dayNum = d.getDate();
                        if (item.eventMonth !== m) return false;
                        if (item.startDay !== undefined && item.endDay !== undefined) {
                            return dayNum >= item.startDay && dayNum <= item.endDay;
                        }
                        return true;
                    });
                });
                
                if (matchingEvents.length === 0) {
                    ItineraryPlanner.showCustomAlert(
                        'Sin eventos programados',
                        'No hay festividades ni eventos programados para las fechas seleccionadas. Por favor, selecciona una fecha diferente o cambia tus intereses.'
                    );
                    return;
                }

                // Encontrar el rango de días en el que hay eventos activos
                const daysWithEvents = selectedDates.filter(d => {
                    const m = d.getMonth();
                    const dayNum = d.getDate();
                    return matchingEvents.some(item => {
                        if (item.eventMonth !== m) return false;
                        if (item.startDay !== undefined && item.endDay !== undefined) {
                            return dayNum >= item.startDay && dayNum <= item.endDay;
                        }
                        return true;
                    });
                });

                // Si hay días sin eventos y el usuario SOLO seleccionó 'eventos' como interés, le avisamos
                if (daysWithEvents.length < selectedDates.length && this.selectedInterests.size === 1) {
                    const lastEventDate = new Date(Math.max(...daysWithEvents.map(d => d.getTime())));
                    const dateStr = lastEventDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
                    
                    ItineraryPlanner.showCustomAlert(
                        'Días sin festividades',
                        `Solo hay festividades programadas hasta el <strong>${dateStr}</strong>. Si deseas viajar más días (hasta el <strong>${this.endDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</strong>), por favor regresa al paso anterior y selecciona categorías adicionales (como Playas, Ecoturismo, Gastronomía) para rellenar los días restantes.`
                    );
                    return;
                }
            }

            document.getElementById('step-5').classList.add('hidden');
            document.getElementById('step-6').classList.remove('hidden');
        });

        document.getElementById('back-to-step-5').addEventListener('click', () => {
            document.getElementById('step-6').classList.add('hidden');
            document.getElementById('step-5').classList.remove('hidden');
        });

        document.getElementById('generate-itinerary').addEventListener('click', () => {
            const emailInput = document.getElementById('itinerary-email-input');
            const privacyCheck = document.getElementById('itinerary-privacy-check');
            
            const email = emailInput ? emailInput.value.trim() : '';
            
            // Simple email validation regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailRegex.test(email)) {
                alert('Por favor ingresa un correo electrónico válido.');
                return;
            }
            
            if (privacyCheck && !privacyCheck.checked) {
                alert('Debes aceptar las políticas de privacidad.');
                return;
            }
            
            this.userEmail = email;

            const diffDays = Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24)) + 1;
            if (diffDays > 100) { 
                ItineraryPlanner.showCustomAlert('Ruta demasiado larga', 'Soporta hasta 100 días.'); 
                return; 
            }
            
            // Show loading animation
            document.getElementById('step-6').classList.add('hidden');
            document.getElementById('itinerary-loading').classList.remove('hidden');
            
            setTimeout(() => {
                this.generate(diffDays);
                
                // Hide loading screen, close overlay, show view
                document.getElementById('itinerary-loading').classList.add('hidden');
                this.close();
            }, 1800);
        });
    },

    showCustomAlert(title, text) {
        // Remove existing custom modal if any
        const existing = document.getElementById('itinerary-custom-alert');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'itinerary-custom-alert';
        modal.className = 'fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300';
        
        modal.innerHTML = `
            <div class="bg-white rounded-[24px] max-w-md w-full overflow-hidden shadow-2xl border border-gray-100 transform scale-95 opacity-0 transition-all duration-300 flex flex-col">
                <div class="p-6 pb-4 flex items-start gap-4">
                    <div class="w-12 h-12 rounded-2xl bg-[#FF6900]/10 flex items-center justify-center shrink-0">
                        <i class="fa-solid fa-circle-exclamation text-[#FF6900] text-xl"></i>
                    </div>
                    <div class="flex-1 space-y-1">
                        <h3 class="text-lg font-black text-[#003087] uppercase tracking-tight">${title}</h3>
                        <p class="text-xs text-gray-500 font-medium leading-relaxed">${text}</p>
                    </div>
                </div>
                <div class="bg-gray-50 px-6 py-4 flex justify-end">
                    <button id="close-custom-alert" class="bg-[#003087] text-white hover:bg-[#002266] px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider text-[11px] shadow-md transition-all active:scale-95">Aceptar</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Trigger animations
        setTimeout(() => {
            modal.querySelector('div').classList.remove('scale-95', 'opacity-0');
            modal.querySelector('div').classList.add('scale-100', 'opacity-100');
        }, 10);

        const closeModal = () => {
            modal.querySelector('div').classList.remove('scale-100', 'opacity-100');
            modal.querySelector('div').classList.add('scale-95', 'opacity-0');
            modal.classList.add('opacity-0');
            setTimeout(() => modal.remove(), 300);
        };

        modal.querySelector('#close-custom-alert').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    },

    resetForm() {
        this.selectedInterests.clear();
        this.selectedCompanion = 'En Pareja';
        this.selectedBudget = 'Moderado';
        this.selectedPace = 'Moderado';
        this.userEmail = '';
        
        document.querySelectorAll('.interest-tag').forEach(el => {
            el.classList.remove('bg-white', 'text-[#003087]', 'border-white');
            el.classList.add('border-white/20');
        });
        
        document.querySelectorAll('.companion-tag').forEach(el => {
            if (el.dataset.value === 'En Pareja') {
                el.classList.add('bg-white', 'text-[#003087]', 'border-white');
                el.classList.remove('border-white/20');
            } else {
                el.classList.remove('bg-white', 'text-[#003087]', 'border-white');
                el.classList.add('border-white/20');
            }
        });
        
        document.querySelectorAll('.budget-tag').forEach(el => {
            if (el.dataset.value === 'Moderado') {
                el.classList.add('bg-white', 'text-[#003087]', 'border-white');
                el.classList.remove('border-white/20');
            } else {
                el.classList.remove('bg-white', 'text-[#003087]', 'border-white');
                el.classList.add('border-white/20');
            }
        });

        document.querySelectorAll('.pace-tag').forEach(el => {
            if (el.dataset.value === 'Moderado') {
                el.classList.add('bg-white', 'text-[#003087]', 'border-white');
                el.classList.remove('border-white/20');
            } else {
                el.classList.remove('bg-white', 'text-[#003087]', 'border-white');
                el.classList.add('border-white/20');
            }
        });
        
        const emailInput = document.getElementById('itinerary-email-input');
        if (emailInput) emailInput.value = '';
        
        if (this.flatpickrInstance) this.flatpickrInstance.clear();
        this.startDate = null; this.endDate = null;
        
        // Hide all steps and show step 1
        for (let i = 1; i <= 6; i++) {
            const stepEl = document.getElementById(`step-${i}`);
            if (stepEl) {
                if (i === 1) stepEl.classList.remove('hidden');
                else stepEl.classList.add('hidden');
            }
        }
        const loadingEl = document.getElementById('itinerary-loading');
        if (loadingEl) loadingEl.classList.add('hidden');
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
        // Build list of dates
        const selectedDates = [];
        let curr = new Date(this.startDate);
        while (curr <= this.endDate) {
            selectedDates.push(new Date(curr));
            curr.setDate(curr.getDate() + 1);
        }

        let filtered = mockData.filter(item => {
            // 1. Validar fechas para eventos estacionales
            if (item.eventMonth !== undefined) {
                const overlaps = selectedDates.some(d => {
                    const m = d.getMonth();
                    const dayNum = d.getDate();
                    if (item.eventMonth !== m) return false;
                    if (item.startDay !== undefined && item.endDay !== undefined) {
                        return dayNum >= item.startDay && dayNum <= item.endDay;
                    }
                    return true;
                });
                if (!overlaps) return false;
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
        
        // Separamos puntos estáticos/no-eventos y eventos para poder programar con precisión de fecha
        const nonEventPoints = filtered.filter(item => item.category !== 'eventos');
        const eventPoints = filtered.filter(item => item.category === 'eventos');

        // Para cada día del viaje, calculamos la fecha correspondiente para validar qué eventos ocurren ESE día
        for (let i = 0; i < numDays; i++) {
            const dayDate = new Date(this.startDate);
            dayDate.setDate(dayDate.getDate() + i);
            const dayMonth = dayDate.getMonth();
            const dayNum = dayDate.getDate();

            // Eventos que ocurren en este día específico
            const activeEventsToday = eventPoints.filter(ev => {
                if (ev.eventMonth !== dayMonth) return false;
                if (ev.startDay !== undefined && ev.endDay !== undefined) {
                    return dayNum >= ev.startDay && dayNum <= ev.endDay;
                }
                return true;
            });

            const dayPoints = [];
            
            // Si hay eventos ocurriendo hoy, los priorizamos
            activeEventsToday.forEach(ev => {
                if (dayPoints.length < 3 && !dayPoints.some(p => p.id === ev.id)) {
                    dayPoints.push(ev);
                }
            });

            // Rellenamos el resto de las 3 actividades diarias usando puntos no-evento (únicos)
            const numPointsToday = 3;
            let fillIndex = 0;
            let attempts = 0;
            
            // Primero intentamos llenar con puntos de no-eventos que no estén ya repetidos en el mismo día
            while (dayPoints.length < numPointsToday && nonEventPoints.length > 0 && attempts < nonEventPoints.length) {
                const pointIdx = (i * numPointsToday + fillIndex) % nonEventPoints.length;
                const candidate = nonEventPoints[pointIdx];
                if (!dayPoints.some(p => p.id === candidate.id)) {
                    dayPoints.push(candidate);
                }
                fillIndex++;
                attempts++;
            }

            // Si aún faltan y se agotan las opciones sin repetición, permitimos rellenar con lo que haya de filtered (pero evitando duplicados en el mismo día)
            if (dayPoints.length < numPointsToday && filtered.length > 0) {
                let backupAttempts = 0;
                while (dayPoints.length < numPointsToday && backupAttempts < filtered.length) {
                    const pointIdx = (i * numPointsToday + fillIndex) % filtered.length;
                    const candidate = filtered[pointIdx];
                    if (!dayPoints.some(p => p.id === candidate.id)) {
                        dayPoints.push(candidate);
                    }
                    fillIndex++;
                    backupAttempts++;
                }
            }

            this.fullItinerary[i + 1] = dayPoints;
        }

        this.currentDayView = 1;
        this.activeStopIndex = 0;
        this.renderFullItineraryPage();
        this.renderItinerarySidebar();
        this.updateMapForDay(1);
        if (window.showView) window.showView('itinerary');
        this.sendEmailMailto();
    },

    renderItinerarySidebar() {
        const filterContainer = document.getElementById('filter-container');
        const numDays = Object.keys(this.fullItinerary).length;
        let tabsHtml = '';
        for (let i = 1; i <= numDays; i++) {
            tabsHtml += `<button onclick="ItineraryPlanner.switchDay(${i})" class="flex-shrink-0 snap-center px-5 py-2.5 text-[11px] font-extrabold tracking-widest rounded-xl transition-all duration-300 ${i === this.currentDayView ? 'bg-[#003087] text-white shadow-[0_4px_12px_rgba(0,48,135,0.25)] scale-105 border border-[#003087]/10' : 'bg-white text-gray-500 hover:bg-gray-100 hover:text-[#003087] border border-gray-200/60'}">DÍA ${i}</button>`;
        }

        const items = this.fullItinerary[this.currentDayView] || [];
        const date = new Date(this.startDate);
        date.setDate(date.getDate() + (this.currentDayView - 1));

        filterContainer.innerHTML = `
            <div class="space-y-6">
                <!-- Upper Action Panel -->
                <div class="flex items-center justify-between border-b pb-4 border-gray-100">
                    <button onclick="ItineraryPlanner.resetToMainMap(true)" class="text-[11px] font-black text-gray-500 hover:text-[#003087] flex items-center gap-2 group transition-all px-3 py-1.5 rounded-full border border-gray-200 hover:border-[#003087]/20 hover:bg-blue-50/50">
                        <i class="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i> SALIR
                    </button>
                    <div class="flex items-center gap-2">
                        <button id="save-itinerary-btn" onclick="ItineraryPlanner.saveCurrentItinerary()" class="text-[11px] font-black text-emerald-700 bg-emerald-50 hover:bg-emerald-600 hover:text-white border border-emerald-200 hover:border-emerald-600 px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 shadow-sm active:scale-95">
                            <i class="fa-solid fa-floppy-disk text-[10px]"></i> Guardar
                        </button>
                        <span class="text-[9px] font-black text-blue-700 bg-blue-50/80 px-2.5 py-1.5 rounded-full border border-blue-100 uppercase tracking-wide flex items-center gap-1">
                            <i class="fa-solid fa-location-dot text-[9px] text-[#FF6900]"></i> ${this.startCity}
                        </span>
                    </div>
                </div>

                <!-- Day Tabs Container -->
                <div id="itinerary-days-container" class="flex gap-2 bg-gray-55/80 p-2 rounded-2xl border border-gray-100 overflow-x-auto snap-x snap-mandatory hide-scrollbar whitespace-nowrap w-full cursor-pointer shadow-inner" style="scrollbar-width: none; -ms-overflow-style: none; -webkit-overflow-scrolling: touch;">${tabsHtml}</div>
                
                <!-- Day Title and Calendar Date -->
                <div class="space-y-1 bg-gradient-to-r from-blue-50/50 to-transparent p-3 rounded-2xl border border-blue-50/30">
                    <h3 class="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                        <span class="w-1.5 h-6 bg-[#003087] rounded-full"></span>
                        Ruta del Día ${this.currentDayView}
                    </h3>
                    <p class="text-[9px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-1.5 pl-3.5">
                        <i class="fa-regular fa-calendar text-[10px]"></i> ${date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                </div>

                <!-- Stops Timeline list -->
                <div id="itinerary-list" class="space-y-1">
                    ${items.length > 0 ? items.map((item, idx) => {
                        let prevCoord = idx === 0 ? this.cityCoords[this.startCity] : [items[idx-1].lat, items[idx-1].lng];
                        let time = this.calculateTravelTime(prevCoord, [item.lat, item.lng]);
                        let label = idx === 0 ? `Desde centro de ${this.startCity}` : `Desde punto anterior`;
                        
                        const isBeyond = idx > this.activeStopIndex;
                        const isCurrent = idx === this.activeStopIndex;
                        const opacityClass = isBeyond ? 'itinerary-faded' : 'opacity-100 transition-all duration-300';
                        
                        let cardClass = "";
                        let borderBarClass = "";
                        
                        if (isCurrent) {
                            cardClass = "itinerary-card-active p-5 rounded-2xl transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col gap-4";
                            borderBarClass = "absolute left-0 top-0 bottom-0 w-2 bg-[#003087] transition-all duration-300";
                        } else {
                            cardClass = `bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_24px_rgba(0,48,135,0.06)] hover:border-[#003087]/20 transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col gap-4 ${opacityClass}`;
                            borderBarClass = "absolute left-0 top-0 bottom-0 w-1.5 bg-gray-200 group-hover:bg-[#003087] transition-all duration-300";
                        }
                        
                        return `
                            <!-- Connection Timeline Line & Time -->
                            <div class="flex items-center gap-3 py-2.5 pl-4 relative ${opacityClass}">
                                <div class="absolute left-[27px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-gray-200 to-gray-200"></div>
                                <div class="w-6 h-6 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 z-10 shadow-sm">
                                    <i class="fa-solid fa-car text-[10px] text-[#003087]"></i>
                                </div>
                                <div class="flex flex-col">
                                    <span class="text-[9px] font-bold text-gray-400 uppercase tracking-wider">${label}</span>
                                    <span class="text-[10px] font-extrabold text-[#003087] mt-0.5 bg-blue-50/50 px-2 py-0.5 rounded-md border border-blue-50 w-fit">~${time} min de viaje</span>
                                </div>
                            </div>

                            <!-- Stop Activity Card -->
                            <div onclick="ItineraryPlanner.focusPoint(${item.id})" class="${cardClass}">
                                <div class="${borderBarClass}"></div>
                                <div class="flex justify-between items-start w-full gap-2">
                                    <div class="max-w-[75%] space-y-1">
                                        <p class="font-extrabold text-[#003087] text-sm group-hover:text-[#002266] transition-colors leading-tight">${item.title}</p>
                                        <p class="text-[10px] text-gray-400 font-semibold flex items-center gap-1">
                                            <i class="fa-solid fa-location-dot text-[9px] text-gray-300"></i> ${item.location}
                                        </p>
                                    </div>
                                    <div class="flex items-center gap-2 shrink-0 bg-gray-50/85 p-1 rounded-xl border border-gray-100">
                                        <span class="w-6 h-6 rounded-lg bg-[#003087] text-white font-black text-xs flex items-center justify-center shadow-sm">
                                            ${idx + 1}
                                        </span>
                                        <div class="flex flex-col gap-0.5">
                                            ${idx > 0 ? `<button onclick="ItineraryPlanner.reorderStop(${this.currentDayView}, ${idx}, 'up', event)" class="p-1 text-[9px] text-gray-400 hover:text-[#003087] hover:bg-white rounded-md transition-all shadow-sm active:scale-90" title="Subir Parada"><i class="fa-solid fa-chevron-up"></i></button>` : ''}
                                            ${idx < items.length - 1 ? `<button onclick="ItineraryPlanner.reorderStop(${this.currentDayView}, ${idx}, 'down', event)" class="p-1 text-[9px] text-gray-400 hover:text-[#003087] hover:bg-white rounded-md transition-all shadow-sm active:scale-90" title="Bajar Parada"><i class="fa-solid fa-chevron-down"></i></button>` : ''}
                                        </div>
                                    </div>
                                </div>
                                <div class="flex justify-end items-center gap-2 border-t pt-3 border-gray-100">
                                    <button onclick="ItineraryPlanner.toggleAlternatives(${this.currentDayView}, ${idx}, event)" class="text-[9px] font-black text-[#003087] bg-blue-50 hover:bg-[#003087] hover:text-white px-3 py-2 rounded-xl flex items-center gap-1.5 uppercase tracking-wider transition-all shadow-sm active:scale-95" title="Cambiar por parada cercana">
                                        <i class="fa-solid fa-arrows-rotate text-[9px]"></i> Cambiar
                                    </button>
                                    <button onclick="ItineraryPlanner.deleteStop(${this.currentDayView}, ${idx}, event)" class="text-[9px] font-black text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white px-3 py-2 rounded-xl flex items-center gap-1.5 uppercase tracking-wider transition-all shadow-sm active:scale-95" title="Eliminar parada">
                                        <i class="fa-solid fa-trash-can text-[9px]"></i> Eliminar
                                    </button>
                                </div>
                                <div id="alternatives-panel-${this.currentDayView}-${idx}" class="hidden mt-1 p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-2.5 pointer-events-auto">
                                    <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                        <i class="fa-solid fa-lightbulb text-amber-500"></i> Alternativas cercanas:
                                    </p>
                                    <div class="flex flex-col gap-1.5" id="alternatives-list-${this.currentDayView}-${idx}"></div>
                                </div>
                            </div>
                        `;
                    }).join('') : '<p class="text-xs text-gray-400 italic py-4 pl-4">No hay paradas en este día.</p>'}
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
        this.activeStopIndex = 0;
        this.renderItinerarySidebar();
        this.updateMapForDay(day);
    },

    focusPoint(id) {
        const points = this.fullItinerary[this.currentDayView] || [];
        const idx = points.findIndex(p => p.id === id);
        if (idx !== -1) {
            this.activeStopIndex = idx;
            this.updateMapForDay(this.currentDayView);
            this.renderItinerarySidebar();
        }

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
        if (this.routePolyline) {
            map.removeLayer(this.routePolyline);
            this.routePolyline = null;
        }

        const activeIndex = this.activeStopIndex !== undefined ? this.activeStopIndex : 0;
        const pointsToRoute = points.slice(0, activeIndex + 1);

        if (pointsToRoute.length > 0) {
            map.flyToBounds(markerGroup.getBounds(), { padding: [100, 100], duration: 1.5 });
            
            // Track active request to prevent race conditions
            this.activeRouteFetchDay = day;
            const currentFetchDay = day;
            
            const startCityCoords = this.cityCoords[this.startCity];
            const cityLngLat = `${startCityCoords[1]},${startCityCoords[0]}`;
            const pointsLngLat = pointsToRoute.map(p => `${p.lng},${p.lat}`);
            const coordsQuery = [cityLngLat, ...pointsLngLat].join(';');
            
            const url = `https://router.project-osrm.org/route/v1/driving/${coordsQuery}?overview=full&geometries=geojson`;
            
            fetch(url)
                .then(res => res.json())
                .then(data => {
                    if (this.activeRouteFetchDay !== currentFetchDay) return;
                    
                    if (this.routePolyline) map.removeLayer(this.routePolyline);
                    
                    if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
                        const route = data.routes[0];
                        const latlngs = route.geometry.coordinates.map(c => [c[1], c[0]]);
                        this.routePolyline = L.polyline(latlngs, {
                            color: '#003087', weight: 5, opacity: 0.85, lineCap: 'round', lineJoin: 'round'
                        }).addTo(map);
                    } else {
                        // Fallback straight lines
                        const startCityLatLng = [startCityCoords[0], startCityCoords[1]];
                        const straightLatLngs = [startCityLatLng, ...pointsToRoute.map(i => [i.lat, i.lng])];
                        this.routePolyline = L.polyline(straightLatLngs, {
                            color: '#003087', weight: 4, opacity: 0.8, dashArray: '8, 12', lineCap: 'round', lineJoin: 'round'
                        }).addTo(map);
                    }
                })
                .catch(err => {
                    console.error("OSRM Route fetch error:", err);
                    if (this.activeRouteFetchDay !== currentFetchDay) return;
                    
                    if (this.routePolyline) map.removeLayer(this.routePolyline);
                    const startCityLatLng = [startCityCoords[0], startCityCoords[1]];
                    const straightLatLngs = [startCityLatLng, ...pointsToRoute.map(i => [i.lat, i.lng])];
                    this.routePolyline = L.polyline(straightLatLngs, {
                        color: '#003087', weight: 4, opacity: 0.8, dashArray: '8, 12', lineCap: 'round', lineJoin: 'round'
                    }).addTo(map);
                });
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
            this.close();

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
    },

    generateRouteForEvent(eventId) {
        const ev = mockData.find(item => item.id === eventId);
        if (!ev) return;

        const currentYear = new Date().getFullYear();
        this.selectedInterests.add('eventos');

        // Update interest tags UI to show 'eventos' is selected
        const eventTag = document.querySelector(`.interest-tag[data-value="eventos"]`);
        if (eventTag) {
            eventTag.classList.add('bg-white', 'text-[#003087]', 'border-white');
            eventTag.classList.remove('border-white/20');
        }

        const start = new Date(currentYear, ev.eventMonth, ev.startDay || 1);
        const end = new Date(currentYear, ev.eventMonth, ev.endDay || ev.startDay || 1);
        
        this.startDate = start;
        this.endDate = end;

        if (this.flatpickrInstance) {
            this.flatpickrInstance.set('minDate', null);
            this.flatpickrInstance.setDate([start, end], true);
        }

        const diffDays = Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24)) + 1;
        this.generate(diffDays);

        if (window.showView) window.showView('map');
    },

    renderFullItineraryPage() {
        const container = document.getElementById('itinerary-view');
        if (!container) return;

        const numDays = Object.keys(this.fullItinerary).length;
        const dateStartStr = this.startDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
        const dateEndStr = this.endDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
        
        // Build Day Selectors HTML
        let dayTabsHtml = '';
        for (let i = 1; i <= numDays; i++) {
            const date = new Date(this.startDate);
            date.setDate(date.getDate() + (i - 1));
            const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' });
            const dayNum = date.getDate();
            dayTabsHtml += `
                <a href="#itinerary-day-section-${i}" class="day-scroll-link flex items-center justify-between p-3.5 rounded-xl border border-gray-100 hover:border-[#003087]/20 hover:bg-blue-50/30 transition-all font-extrabold text-xs text-gray-500 hover:text-[#003087] group ${i === 1 ? 'bg-blue-50/50 border-[#003087]/20 text-[#003087]' : ''}" data-day="${i}">
                    <div class="flex items-center gap-3">
                        <span class="w-6 h-6 rounded-lg bg-gray-100 group-hover:bg-[#003087]/10 group-hover:text-[#003087] flex items-center justify-center text-[10px] text-gray-400 font-black transition-colors ${i === 1 ? 'bg-[#003087] text-white' : ''}">
                            D${i}
                        </span>
                        <div class="text-left leading-tight">
                            <p class="font-black uppercase tracking-wider text-[10px]">Día ${i}</p>
                            <p class="text-[9px] font-semibold text-gray-400">${dayName.toUpperCase()} ${dayNum}</p>
                        </div>
                    </div>
                    <i class="fa-solid fa-chevron-right text-[9px] text-gray-300 group-hover:translate-x-0.5 transition-transform"></i>
                </a>
            `;
        }

        // Build Itinerary Timeline HTML
        let timelineDaysHtml = '';
        for (let i = 1; i <= numDays; i++) {
            const date = new Date(this.startDate);
            date.setDate(date.getDate() + (i - 1));
            const dayLabel = date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
            const stops = this.fullItinerary[i] || [];

            let stopsHtml = '';
            if (stops.length === 0) {
                stopsHtml = `<p class="text-xs text-gray-400 italic py-6">No hay paradas programadas para este día.</p>`;
            } else {
                stopsHtml = stops.map((item, idx) => {
                    let prevCoord = idx === 0 ? this.cityCoords[this.startCity] : [stops[idx-1].lat, stops[idx-1].lng];
                    let travelTime = this.calculateTravelTime(prevCoord, [item.lat, item.lng]);
                    let connectionHtml = '';
                    
                    if (idx === 0) {
                        connectionHtml = `
                            <div class="flex items-center gap-2 mb-4 pl-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                <i class="fa-solid fa-house-chimney text-[#003087]"></i>
                                <span>Punto de partida: Centro de ${this.startCity}</span>
                            </div>
                        `;
                    } else {
                        connectionHtml = `
                            <!-- Travel Time indicator -->
                            <div class="my-3 pl-8 relative flex items-center gap-3">
                                <div class="w-7 h-7 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 shadow-sm">
                                    <i class="fa-solid fa-car text-[10px] text-[#003087]"></i>
                                </div>
                                <div class="flex flex-col text-left">
                                    <span class="text-[9px] font-black text-gray-400 uppercase tracking-wider">Desde parada anterior</span>
                                    <span class="text-[10px] font-black text-[#003087] bg-blue-50/50 px-2 py-0.5 rounded-md border border-blue-50/30 w-fit">🚗 ~${travelTime} min de viaje</span>
                                </div>
                            </div>
                        `;
                    }

                    // Find category details
                    const categoryObj = categories.find(c => c.id === item.category);
                    const parentCategory = categories.find(c => c.subcategories && c.subcategories.some(sub => sub.id === item.category));
                    const catLabel = categoryObj ? categoryObj.label : (parentCategory ? parentCategory.label : 'Turismo');
                    const catIcon = categoryObj ? categoryObj.icon : (parentCategory ? parentCategory.icon : '📍');
                    const catBgColor = categoryObj ? categoryObj.color : (parentCategory ? parentCategory.color : 'bg-blue-600');

                    // Format tags list
                    const tagsHtml = item.tags ? item.tags.map(t => `<span class="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wide border border-gray-200/55">${t}</span>`).join('') : '';

                    return `
                        ${connectionHtml}

                        <!-- Stop Card -->
                        <div class="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,48,135,0.06)] hover:border-[#003087]/10 transition-all duration-500 overflow-hidden flex flex-col md:flex-row group">
                            <!-- Image Left -->
                            <div class="md:w-1/3 h-52 md:h-auto min-h-[180px] relative overflow-hidden shrink-0">
                                <img src="${item.image}" alt="${item.title}" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                                <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                                <span class="absolute top-4 left-4 w-7 h-7 rounded-xl bg-[#003087] text-white font-black text-xs flex items-center justify-center shadow-lg border border-white/20">
                                    ${idx + 1}
                                </span>
                            </div>
                            
                            <!-- Info Right -->
                            <div class="p-6 md:p-8 flex-1 flex flex-col justify-between text-left space-y-4">
                                <div class="space-y-3">
                                    <div class="flex flex-wrap gap-2 items-center">
                                        <span class="${catBgColor} text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5 border-none">
                                            <span>${catIcon}</span>
                                            <span>${catLabel}</span>
                                        </span>
                                        <span class="text-[9px] text-[#FF6900] bg-orange-50 font-black uppercase tracking-widest px-3 py-1 rounded-full border border-orange-100">
                                            Parada ${idx + 1}
                                        </span>
                                    </div>
                                    <h4 class="text-xl font-black text-[#003087] leading-tight group-hover:text-[#002266] transition-colors">${item.title}</h4>
                                    <p class="text-xs text-gray-400 font-bold flex items-center gap-1.5">
                                        <i class="fa-solid fa-location-dot text-gray-300"></i> ${item.location}
                                    </p>
                                    <p class="text-xs text-gray-600 leading-relaxed font-medium">${item.description}</p>
                                </div>

                                <div class="border-t border-gray-55 pt-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                                    <div class="flex flex-wrap gap-1.5">
                                        ${tagsHtml}
                                    </div>
                                    <button onclick="ItineraryPlanner.viewStopOnMap(${i}, ${item.id})" class="text-[10px] font-black text-[#003087] bg-blue-50/50 border border-blue-100 hover:bg-[#003087] hover:text-white px-4 py-2 rounded-xl flex items-center gap-1.5 uppercase tracking-wider transition-all shadow-sm active:scale-95 shrink-0">
                                        <i class="fa-solid fa-map-location-dot"></i> Ver en Mapa
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');
            }

            timelineDaysHtml += `
                <!-- Day Section -->
                <div id="itinerary-day-section-${i}" class="space-y-6 pt-6 border-b border-gray-100 pb-10 last:border-b-0">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-blue-50/50 to-transparent p-4 rounded-2xl border border-blue-50/30">
                        <div class="space-y-1">
                            <h3 class="text-2xl font-black text-[#003087] tracking-tight flex items-center gap-2">
                                <span class="w-2 h-7 bg-[#FF6900] rounded-full"></span>
                                Día ${i}: Ruta del Viaje
                            </h3>
                            <p class="text-[10px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-1.5 pl-3.5">
                                <i class="fa-regular fa-calendar-check text-[11px] text-[#003087]"></i> ${dayLabel.toUpperCase()}
                            </p>
                        </div>
                        <span class="text-xs font-black text-blue-700 bg-blue-50/80 border border-blue-100 px-4 py-2 rounded-full w-fit uppercase tracking-widest">
                            ${stops.length} Parada${stops.length !== 1 ? 's' : ''} Programada${stops.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    <div class="space-y-4">
                        ${stopsHtml}
                    </div>
                </div>
            `;
        }

        // Complete View HTML
        container.innerHTML = `
            <!-- HEADER HERO BANNER -->
            <div class="relative min-h-[300px] w-full flex items-center justify-center overflow-hidden bg-cover bg-center print:bg-none print:h-auto print:min-h-0" style="background-image: linear-gradient(rgba(0, 48, 135, 0.88), rgba(0, 24, 78, 0.95)), url('assets/images/puntos/puente-del-viaducto-el-gran-manglar.webp')">
                <div class="relative z-10 text-center px-6 max-w-5xl py-12 space-y-6 text-white">
                    <span class="bg-[#FF6900] text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border-none shadow-lg">
                        ✨ Tu Itinerario Generado con Éxito
                    </span>
                    
                    <h2 class="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                        Guía de viaje <span class="text-[#0099FF]">Ruta Turística Sostenible</span>
                    </h2>
                    
                    <p class="text-blue-100/90 text-sm md:text-base font-bold max-w-3xl mx-auto leading-relaxed">
                        ¡Hola! Hemos diseñado este recorrido inteligente especialmente para ti. Está pensado para maximizar tu experiencia a lo largo del corredor vial.
                    </p>

                    <!-- Summary Cards Grid -->
                    <div class="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-4xl mx-auto pt-4 text-left">
                        <div class="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 flex flex-col justify-between">
                            <span class="text-[9px] font-black text-blue-200 uppercase tracking-widest">📍 Ciudad Origen</span>
                            <span class="text-sm font-black text-white mt-1 uppercase">${this.startCity}</span>
                        </div>
                        <div class="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 flex flex-col justify-between">
                            <span class="text-[9px] font-black text-blue-200 uppercase tracking-widest">👥 Compañía</span>
                            <span class="text-sm font-black text-white mt-1 uppercase">${this.selectedCompanion}</span>
                        </div>
                        <div class="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 flex flex-col justify-between">
                            <span class="text-[9px] font-black text-blue-200 uppercase tracking-widest">💰 Presupuesto</span>
                            <span class="text-sm font-black text-white mt-1 uppercase">${this.selectedBudget}</span>
                        </div>
                        <div class="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 flex flex-col justify-between">
                            <span class="text-[9px] font-black text-blue-200 uppercase tracking-widest">⚡ Ritmo del Viaje</span>
                            <span class="text-sm font-black text-white mt-1 uppercase">${this.selectedPace}</span>
                        </div>
                        <div class="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 flex flex-col justify-between col-span-2 md:col-span-1">
                            <span class="text-[9px] font-black text-blue-200 uppercase tracking-widest">📅 Duración</span>
                            <span class="text-sm font-black text-white mt-1 uppercase">${numDays} Día${numDays !== 1 ? 's' : ''}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- MAIN CONTAINER -->
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 print:py-0 print:px-0">
                
                <!-- EMAIL SUCCESS BANNER -->
                <div class="bg-emerald-55 border border-emerald-200 rounded-3xl p-5 md:p-6 flex items-start gap-4 shadow-sm animate-fade-in print:hidden">
                    <div class="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0">
                        <i class="fa-solid fa-paper-plane text-emerald-600 text-lg"></i>
                    </div>
                    <div class="text-left space-y-1">
                        <h4 class="text-sm font-black text-[#047857] uppercase tracking-wider">¡Guía enviada a tu correo!</h4>
                        <p class="text-xs text-[#065f46] font-medium leading-relaxed">
                            Hemos enviado una copia digital de esta planificación a <strong>${this.userEmail}</strong>. Consérvala para acceder a las direcciones y coordenadas incluso sin conexión.
                        </p>
                    </div>
                </div>

                <!-- ACTIONS BAR -->
                <div class="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between border-b border-gray-200/60 pb-6 print:hidden">
                    <div class="flex items-center gap-2">
                        <button onclick="window.goBack('routes')" class="text-xs font-black text-gray-500 hover:text-[#003087] flex items-center gap-2 transition-all px-4 py-2.5 rounded-xl border border-gray-200 hover:border-blue-100 hover:bg-white bg-[#f8fafc]">
                            <i class="fa-solid fa-arrow-left"></i> VOLVER
                        </button>
                    </div>
                    <div class="flex flex-wrap gap-2.5">
                        <button onclick="window.showView('map')" class="text-xs font-black text-white bg-[#003087] hover:bg-[#002266] px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-lg hover:-translate-y-0.5 active:scale-95">
                            <i class="fa-solid fa-map-location-dot"></i> Ver en Mapa Interactivo
                        </button>
                        <button onclick="ItineraryPlanner.sendEmailMailto()" class="text-xs font-black text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-sm hover:-translate-y-0.5 active:scale-95">
                            <i class="fa-solid fa-envelope text-[#0099FF]"></i> Enviar por Correo
                        </button>
                        <button onclick="window.print()" class="text-xs font-black text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-sm hover:-translate-y-0.5 active:scale-95">
                            <i class="fa-solid fa-file-pdf text-[#FF6900]"></i> Imprimir / Guardar PDF
                        </button>
                        <button onclick="ItineraryPlanner.open()" class="text-xs font-black text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-sm hover:-translate-y-0.5 active:scale-95">
                            <i class="fa-solid fa-wand-magic-sparkles"></i> Planificar otro viaje
                        </button>
                    </div>
                </div>

                <!-- DESKTOP GRID LAYOUT (Sticky navigation on left, scroll timeline on right) -->
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
                    <!-- Left Sidebar - Day Selector (Sticky on desktop, horizontal scroll on mobile) -->
                    <aside class="lg:col-span-3 lg:sticky lg:top-6 space-y-4 print:hidden">
                        <div class="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm space-y-4">
                            <h4 class="text-xs font-black text-gray-400 uppercase tracking-widest text-left">Resumen de Días</h4>
                            <div class="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0" id="itinerary-view-days-list" style="scrollbar-width: none;">
                                ${dayTabsHtml}
                            </div>
                        </div>
                        
                        <div class="hidden lg:block bg-gradient-to-br from-[#003087] to-[#00184E] rounded-3xl p-5 text-white text-left space-y-3 shadow-md">
                            <i class="fa-solid fa-lightbulb text-[#FFC600] text-xl"></i>
                            <h5 class="text-sm font-black uppercase tracking-wider">¿Sabías que?</h5>
                            <p class="text-[11px] text-blue-100/80 leading-relaxed font-medium">
                                El corredor vial cuenta con más de 100 km de paisajes únicos. Al presionar "Ver en Mapa", podrás navegar paso a paso con GPS e indicaciones en tiempo real.
                            </p>
                        </div>
                    </aside>

                    <!-- Right Column - Timeline Sections -->
                    <main class="lg:col-span-9 space-y-8 max-w-full">
                        <div class="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm">
                            <div class="space-y-6">
                                ${timelineDaysHtml}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
            
            <!-- FOOTER SIGNATURE -->
            <div class="bg-gray-100 border-t border-gray-200/60 py-6 text-center text-xs font-extrabold text-gray-400 uppercase tracking-wider print:hidden">
                Ruta Costera Sostenible · Planificador de Viajes Sostenibles
            </div>
        `;

        // Add smooth scrolling to sections and active class tracking
        setTimeout(() => {
            const links = container.querySelectorAll('.day-scroll-link');
            
            // Click Handler for smooth scrolling
            links.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href');
                    const targetEl = document.querySelector(targetId);
                    if (targetEl) {
                        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                    
                    // Update active styles instantly
                    links.forEach(l => {
                        l.classList.remove('bg-blue-50/50', 'border-[#003087]/20', 'text-[#003087]');
                        l.querySelector('span').classList.remove('bg-[#003087]', 'text-white');
                        l.querySelector('span').classList.add('bg-gray-100', 'text-gray-400');
                    });
                    
                    link.classList.add('bg-blue-50/50', 'border-[#003087]/20', 'text-[#003087]');
                    link.querySelector('span').classList.add('bg-[#003087]', 'text-white');
                    link.querySelector('span').classList.remove('bg-gray-100', 'text-gray-400');
                });
            });

            // Intersection Observer to highlight active day on scroll
            const observerOptions = {
                root: null,
                rootMargin: '0px 0px -60% 0px',
                threshold: 0
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute('id');
                        const dayNum = id.split('-').pop();
                        
                        links.forEach(l => {
                            const linkDay = l.dataset.day;
                            if (linkDay === dayNum) {
                                l.classList.add('bg-blue-50/50', 'border-[#003087]/20', 'text-[#003087]');
                                l.querySelector('span').classList.add('bg-[#003087]', 'text-white');
                                l.querySelector('span').classList.remove('bg-gray-100', 'text-gray-400');
                                
                                // scroll tab into view on mobile (removed l.scrollIntoView which locked the parent page)
                            } else {
                                l.classList.remove('bg-blue-50/50', 'border-[#003087]/20', 'text-[#003087]');
                                l.querySelector('span').classList.remove('bg-[#003087]', 'text-white');
                                l.querySelector('span').classList.add('bg-gray-100', 'text-gray-400');
                            }
                        });
                    }
                });
            }, observerOptions);

            for (let i = 1; i <= numDays; i++) {
                const sec = document.getElementById(`itinerary-day-section-${i}`);
                if (sec) observer.observe(sec);
            }
        }, 100);
    },

    viewStopOnMap(day, stopId) {
        // 1. Switch to Map View
        if (window.showView) window.showView('map');

        // 2. Load the specific day route and focus the stop
        this.switchDay(day);
        
        // 3. Focus point on map
        setTimeout(() => {
            this.focusPoint(stopId);
        }, 300);
    },

    sendEmailMailto() {
        if (!this.fullItinerary || !this.userEmail) return;

        const numDays = Object.keys(this.fullItinerary).length;
        let bodyText = `¡Hola!\n\nAquí tienes el resumen de tu itinerario personalizado para la Ruta Turística Sostenible (Cartagena - Barranquilla).\n\n`;
        bodyText += `DETALLES DE TU VIAJE:\n`;
        bodyText += `- Origen: ${this.startCity}\n`;
        bodyText += `- Acompañantes: ${this.selectedCompanion}\n`;
        bodyText += `- Presupuesto: ${this.selectedBudget}\n`;
        bodyText += `- Ritmo de viaje: ${this.selectedPace}\n`;
        bodyText += `- Duración: ${numDays} día(s)\n\n`;
        bodyText += `--------------------------------------------------\n\n`;

        for (let i = 1; i <= numDays; i++) {
            const date = new Date(this.startDate);
            date.setDate(date.getDate() + (i - 1));
            const dayLabel = date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
            bodyText += `DÍA ${i} (${dayLabel.toUpperCase()}):\n`;

            const stops = this.fullItinerary[i] || [];
            if (stops.length === 0) {
                bodyText += `  No hay paradas programadas.\n`;
            } else {
                stops.forEach((item, idx) => {
                    bodyText += `  Parada ${idx + 1}: ${item.title} (${item.location.split(',')[0]})\n`;
                });
            }
            bodyText += `--------------------------------------------------\n\n`;
        }

        bodyText += `Para ver mapas interactivos, horarios, precios y descripciones completas de cada lugar, visita nuestro planificador en la web.\n\n`;
        bodyText += `¡Buen viaje!\nEquipo de Ruta Turística Sostenible.\nContacto: rutaturisticasostenible@gmail.com`;

        const subject = encodeURIComponent(`Guía de viaje - Ruta Turística Sostenible`);
        const emailBody = encodeURIComponent(bodyText);
        const mailtoUrl = `mailto:${this.userEmail}?subject=${subject}&body=${emailBody}`;

        // Direct redirection for mailto is more compatible across modern browsers than hidden iframe
        window.location.href = mailtoUrl;
    }
};

window.ItineraryPlanner = ItineraryPlanner;
document.addEventListener('DOMContentLoaded', () => ItineraryPlanner.init());
