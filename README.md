# Ruta Turística Sostenible — Mapa Interactivo y Planificador Vial

Plataforma web interactiva diseñada para visibilizar y promover los atractivos turísticos, culturales, naturales, gastronómicos, comunitarios y de infraestructura a lo largo del corredor vial **Cartagena – Barranquilla (Ruta Costera | ISA Vías)**.

---

## 🚀 Características Principales

- **Mapa Interactivo de Alta Disponibilidad:** Basado en [Leaflet.js](https://leafletjs.com/) y cartografía *Esri WorldStreetMap*, con trazado georreferenciado de los corredores viales (Vía al Mar y Circunvalar de la Prosperidad).
- **Sistema de Filtrado Multi-Categoría (9 Categorías + 2 Subcategorías):**
  - *Playas y deportes náuticos*
  - *Turismo de naturaleza* (*Parques y reservas* y *Avistamiento de aves*)
  - *Cultura, artes y patrimonio*
  - *Placeres gastronómicos*
  - *Festividades y eventos*
  - *Turismo comunitario*
  - *Paradores turísticos*
  - *Aeropuertos*
  - *Infraestructura del corredor vial*
  - Un mismo punto de interés puede pertenecer a múltiples categorías simultáneamente, adaptando dinámicamente su marcador en el mapa.
- **Planificador Inteligente de Itinerarios y Exportación a PDF:** Asistente paso a paso según ciudad de origen, intereses, acompañantes, presupuesto, ritmo de viaje y calendario de eventos, con generación instantánea de guía descargable en PDF (`jsPDF`).
- **Audioguía Integrada (Accesibilidad TTS):** Síntesis de voz adaptable al idioma seleccionado (`ES`, `EN`, `PT`, `FR`) en la ficha técnica de cada sitio.
- **Modo Carretera (Soporte para Baja o Nula Señal):** Service Worker (`sw.js`) con estrategia híbrida que almacena en caché los recursos críticos y las cuadrículas del mapa para funcionar en zonas con poca cobertura móvil (compatible con iOS/iPhone y Android).

---

## 📂 Estructura del Proyecto

```text
├── assets/
│   ├── css/
│   │   ├── input.css         # Estilos base, directivas de Tailwind y componentes UI
│   │   └── tailwind.min.css  # Hoja de estilos compilada y minificada para producción
│   ├── images/
│   │   ├── municipios-hero.webp
│   │   └── puntos/           # Fotografías optimizadas en formato .webp de los sitios
│   └── js/
│       ├── data.js           # Fuente única de datos: categorías, 154 puntos y rutas sugeridas
│       ├── app.js            # Controlador del mapa, filtros, buscador predictivo y vistas
│       └── itinerary.js      # Motor de planificación de itinerarios y exportación PDF
├── index.html                # Estructura principal de la aplicación
├── sw.js                     # Service Worker para soporte offline y baja señal
├── tailwind.config.js        # Configuración de diseño y paleta institucional
└── package.json              # Scripts de compilación de estilos
```

---

## 🛠️ Guía de Mantenimiento

### 1. Cómo agregar o editar un punto turístico
Toda la información de los sitios se encuentra centralizada en `assets/js/data.js` dentro del arreglo `mockData`:

```javascript
{
  id: 155,
  category: "playas",                  // Categoría principal (define el ícono por defecto)
  categories: ["playas", "gastronomía"], // Todas las categorías donde debe aparecer al filtrar
  title: "Nombre del Sitio",
  description: "Descripción detallada del lugar...",
  lat: 10.9883,
  lng: -74.9594,
  image: "assets/images/puntos/nombre-imagen.webp",
  location: "Puerto Colombia, Atlántico.",
  hours: "8:00 a.m. - 5:00 p.m.",
  price: "Gratuito.",
  tags: ["Relax en la playa", "Comida autóctona"]
}
```

### 2. Cómo compilar los estilos CSS (Tailwind)
Si agregas nuevas clases de Tailwind CSS en `index.html` o en los archivos `.js`, ejecuta:

```bash
npm run build:css
```

Esto actualizará automáticamente el archivo `assets/css/tailwind.min.css`.

---

**Desarrollado para:** Proyecto Ruta Turística Sostenible — Corredor Vial Cartagena - Barranquilla.
