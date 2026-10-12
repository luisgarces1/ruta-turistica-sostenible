# Ruta Turística Sostenible - Mapa Interactivo

Este proyecto es una aplicación web interactiva diseñada para promover el turismo sostenible en el corredor vial entre Cartagena y Barranquilla (Colombia). Ofrece una experiencia inmersiva para descubrir puntos de interés, planificar rutas y conocer los municipios de la región.

## 🚀 Características Principales

- **Mapa Interactivo:** Visualización de todos los puntos turísticos usando [Leaflet.js](https://leafletjs.com/).
- **Filtrado Dinámico:** Clasificación de sitios por categorías como Gastronomía, Cultura, Deportes Náuticos, Naturaleza, entre otros.
- **Exploración por Municipios:** Vistas detalladas de los 7 municipios principales (Barranquilla, Puerto Colombia, Tubará, Juan de Acosta, Piojó, Santa Catalina y Cartagena).
- **Rutas Sugeridas:** Recomendaciones sobre cómo llegar a cada destino desde las ciudades principales.
- **Audioguías Integradas:** Lectura de descripciones mediante síntesis de voz (TTS) para cada punto de interés.
- **Diseño Responsivo:** Optimizado para dispositivos móviles y escritorio utilizando [Tailwind CSS](https://tailwindcss.com/).

## 🛠️ Tecnologías Utilizadas

- **Frontend:** HTML5, JavaScript (ES6+), CSS3.
- **Estilos:** Tailwind CSS para un diseño moderno y responsivo.
- **Mapas:** Leaflet.js con capas de CartoDB.
- **Componentes:**
  - **Swiper.js:** Para carruseles de imágenes.
  - **Flatpickr:** Selector de fechas avanzado.
  - **FontAwesome:** Iconografía rica y moderna.
- **Imágenes:** Optimizadas para web.

## 📂 Estructura del Proyecto

```text
├── assets/
│   ├── css/       # Estilos personalizados adicionales
│   ├── images/    # Fotografías de puntos de interés y recursos visuales
│   └── js/
│       ├── app.js     # Lógica principal de la aplicación y el mapa
│       ├── data.js    # Dataset de puntos de interés (JSON-like)
│       └── itinerary.js # Lógica de planificación de rutas
├── index.html     # Estructura principal de la aplicación
└── package.json   # Dependencias del proyecto
```

## 📋 Requisitos e Instalación

No se requiere un servidor complejo. Puedes ejecutar este proyecto simplemente abriendo el archivo `index.html` en tu navegador o usando un servidor local como **Live Server** de VS Code.

Si deseas realizar modificaciones y procesar imágenes:
1. Clonar el repositorio.
2. Ejecutar `npm install` para instalar dependencias auxiliares como `sharp`.

## ✍️ Contribuciones y Desarrollo

Este proyecto utiliza una arquitectura modular de JavaScript:
- `data.js` es la fuente de verdad para los puntos turísticos.
- `app.js` maneja el estado global, filtros y eventos del mapa.

---
**Desarrollado para:** Proyecto de Turismo Corredor Vial Cartagena - Barranquilla.
**Versión:** 2.0.0
