/**
 * ============================================================================
 * ARCHIVO PRINCIPAL DE DATOS - RUTA TURÍSTICA SOSTENIBLE
 * ============================================================================
 * Este archivo contiene toda la información de los puntos turísticos y las 
 * categorías que se muestran en el mapa interactivo y en el planificador de rutas.
 * 
 * ¿CÓMO AGREGAR UN NUEVO PUNTO?
 * 1. Ve al final del arreglo `mockData`.
 * 2. Copia la estructura de un punto existente y pégala al final (separada por coma).
 * 3. Asegúrate de que el 'id' sea único y el 'category' coincida con uno de 'categories'.
 * 4. Las coordenadas (lat, lng) se sacan de Google Maps.
 */

// 1. CONFIGURACIÓN DE CATEGORÍAS (Filtros del panel izquierdo)
// Si agregas una nueva categoría aquí, aparecerá automáticamente en el menú y en "Rutas".
const categories = [
  { id: "todas", label: "Ver todos", icon: "📍", color: "bg-slate-800" },
  { 
    id: "naturaleza", 
    label: "Turismo de naturaleza", 
    icon: "🌿", 
    color: "bg-emerald-600",
    subcategories: [
      { id: "playas", label: "Playas y costas", icon: "🏖️", color: "bg-cyan-500" },
      { id: "ecoturismo", label: "Parques y reservas", icon: "🏞️", color: "bg-green-600" },
      { id: "nauticos", label: "Deportes náuticos", icon: "🌊", color: "bg-sky-500" },
    ]
  },
  { id: "eventos", label: "Festividades y eventos", icon: "🎉", color: "bg-fuchsia-500" },
  { id: "cultura", label: "Cultura, artes y patrimonio", icon: "🏛️", color: "bg-purple-500" },
  { id: "gastronomia", label: "Placeres gastronómicos", icon: "🥘", color: "bg-orange-500" },
  { id: "infraestructura", label: "Infraestructura del corredor vial", icon: "🛣️", color: "bg-blue-600" },
  { id: "otros", label: "Aeropuertos", icon: "✈️", color: "bg-indigo-400" }
];

const mockData = [
  {
    id: 1, category: "ecoturismo", title: "Volcán del Totumo", 
    description: "Un cono volcánico de 15 metros que emerge entre la ciénaga y el mar. Su lodo medicinal nace de procesos geológicos únicos en el Caribe: gases que burbujean desde las profundidades y minerales que relajan el cuerpo mientras flotas en su densa superficie tibia. Un fenómeno natural vivo..", 
    lat: 10.744444, lng: -75.241389, image: "assets/images/puntos/fotografia-para-la-pagina-vt.webp", 
    location: "Santa Catalina, Bolívar.", hours: "6:00 a.m. - 6:00 p.m.", price: "Adultos: $20.000 mil cop.", 
    tags: ["Relax en la playa", "Experiencias sensoriales", "Comida autóctona"]
  },
  {
    id: 2, category: "playas", title: "Playas de Loma Arena", 
    description: "Arena dorada que avanza sin interrupciones hasta donde el ojo alcanza. En Loma Arena el Caribe llega tranquilo y el paisaje permanece sin intervención: sin estructuras, sin bullicio. Solo el oleaje, el cielo abierto y la línea de palmeras que marca el límite entre la tierra y el mar.", 
    lat: 10.731697, lng: -75.272444, image: "assets/images/puntos/foto-principal-l.a.webp", 
    location: "Santa Catalina, Bolívar.", hours: "Abierto todo el tiempo.", price: "Gratuito.", 
    tags: ["Relax en la playa", "Deportes náuticos", "Vistas panorámicas"]
  },
  {
    id: 3, category: "playas", title: "Playas de Punta Astilleros", 
    description: "Donde la costa del Atlántico se conserva en su estado más puro. Playas vírgenes rodeadas de vegetación nativa, con brisa constante y acceso a senderos ecológicos que siguen la orilla. Un entorno costero que no ha cedido a la infraestructura y por eso sigue siendo refugio de aves y paisaje auténtico.", 
    lat: 10.795, lng: -75.224444, image: "assets/images/puntos/foto-principal-pa.webp", 
    location: "Piojó, Atlántico.", hours: "9:00 a.m. - Final del día.", price: "Gratuito.", 
    tags: ["Relax en la playa", "Vistas panorámicas", "Artesanías"]
  },
  {
    id: 4, category: "ecoturismo", title: "Cerro la Vieja", 
    description: "La cima del Atlántico guarda bosque seco tropical, fauna sorprendente y una panorámica que abarca la línea costera y el relieve ondulado del departamento. Cada paso hacia la cumbre atraviesa microhábitats distintos. Subir es una inmersión en la biodiversidad del Caribe, no solo un esfuerzo físico.", 
    lat: 10.733333, lng: -75.104722, image: "assets/images/puntos/foto-principal-l.v.webp", 
    location: "Piojó, Atlántico.", hours: "7:00 a.m. - 6:00 p.m.", price: "Adultos: $8.000 mil cop.", 
    tags: ["Avistamiento de aves", "Vistas panorámicas", "Experiencias sensoriales"]
  },
  {
    id: 5, category: "ecoturismo", title: "Caribe Aventura", 
    description: "Un parque que usa la naturaleza del Caribe como escenario principal. Toboganes, piscinas y atracciones acuáticas están integrados en un entorno donde el agua, la vegetación y el paisaje regional son los protagonistas. Una experiencia que conecta la diversión familiar con la identidad natural del territorio.", 
    lat: 10.765278, lng: -75.200278, image: "assets/images/puntos/foto-principal-c.a.webp", 
    location: "Piojó, Atlántico.", hours: "9:00 a.m. - 4:30 p.m.", price: "Variable.", 
    tags: ["Experiencias sensoriales", "Deportes náuticos"]
  },
  {
    id: 6, category: "cultura", title: "Muelle de Puerto Colombia", 
    description: "El muelle más largo de Colombia  en su época hoy camina sobre el mar como testigo de una era que transformó al país. Sus pilotes de concreto sostienen una historia de vapores, mercancías y viajeros que llegaron al Caribe. Caminar sobre él es recorrer la memoria del comercio y la apertura de una nación.", 
    lat: 10.988333, lng: -74.959444, image: "assets/images/puntos/foto-principal-para-la-pagina-m.p.webp", 
    location: "Puerto Colombia, Atlántico.", hours: "Abierto todo el tiempo.", price: "Gratuito.", 
    tags: ["Vistas panorámicas", "Artesanías", "Comida autóctona"]
  },
  {
    id: 7, category: "gastronomia", title: "Centro gastronómico Muelle 1888", 
    description: "Una arquitectura que rinde tributo a las olas inmigrantes que llegaron por este puerto. Los sabores locales e internacionales conviven aquí con la historia del lugar, invitando a comer despacio, a mirar el mar y a entender cómo la mesa caribeña es también un archivo de memorias y encuentros.", 
    lat: 10.989444, lng: -74.958611, image: "assets/images/puntos/foto-principal-m.1888.webp", 
    location: "Puerto Colombia.", hours: "Variable.", price: "Gratuito.", 
    tags: ["Comida autóctona", "Relax en la playa", "Vistas panorámicas"]
  },
  {
    id: 8, category: "cultura", title: "Ventana de Sueños", 
    description: "Estructura de cristal que al caer la noche transforma la costa de Puerto Colombia en un faro de colores. Es un monumento a los inmigrantes que llegaron sin certezas y construyeron identidad. Su reflejo sobre el mar convierte cada visita en un encuentro entre la historia humana y el presente festivo del Atlántico.", 
    lat: 11.001667, lng: -74.952778, image: "assets/images/puntos/foto-principal-para-la-pagina-v.s.webp", 
    location: "Puerto Colombia.", hours: "Abierto.", price: "Gratuito.", 
    tags: ["Vistas panorámicas", "Experiencias sensoriales"]
  },
  {
    id: 9, category: "cultura", title: "Antigua estación del Ferrocarril", 
    description: "Inaugurada en 1871, sus muros de ladrillo guardan el eco de los trenes que conectaron el interior del país con el mar. Hoy convertida en centro cultural, la estación invita a recorrer la era ferroviaria que cambió la economía colombiana y dejó en Puerto Colombia una huella arquitectónica todavía vigente.", 
    lat: 10.988611, lng: -74.959444, image: "assets/images/puntos/foto-principal-para-la-pagina-ef.webp", 
    location: "Puerto Colombia.", hours: "Abierto.", price: "Gratuito.", 
    tags: ["Artesanías", "Experiencias sensoriales"]
  },
  {
    id: 10, category: "playas", title: "Playas de Puerto Colombia", 
    description: "El mar llega aquí con fuerza moderada y temperatura cálida todo el año. La proximidad del muelle histórico crea un paisaje donde el agua y la arquitectura se entrelazan sin competir. Playas abiertas, brisa del Caribe y una costa que combina el descanso natural con la escala humana del balneario clásico.", 
    lat: 11.001111, lng: -74.952778, image: "assets/images/puntos/foto-principal-para-la-pagina-p.p.webp", 
    location: "Puerto Colombia.", hours: "7:00 a.m. - 4:00 p.m.", price: "Gratuito.", 
    tags: ["Relax en la playa", "Vistas panorámicas"]
  },
  {
    id: 11, category: "playas", title: "Playa de Santa Verónica", 
    description: "El viento constante de Juan de Acosta convierte a Santa Verónica en un punto privilegiado del litoral atlántico. Sus corrientes suaves y el agua clara la hacen ideal para iniciarse en deportes de viento. Frente al océano, los restaurantes de pescado frito completan un entorno donde el mar dicta el ritmo.", 
    lat: 10.88038, lng: -75.08297, image: "assets/images/puntos/fotografia-para-la-pagina-p.s.webp", 
    location: "Juan de Acosta.", hours: "7:00 a.m. - 9:00 p.m.", price: "Gratuito.", 
    tags: ["Relax en la playa", "Comida autóctona", "Vistas panorámicas"]
  },
  {
    id: 12, category: "nauticos", title: "Salinas del Rey", 
    description: "Las condiciones de viento y oleaje de Juan de Acosta generan aquí uno de los escenarios de kitesurf más exigentes del mundo. Pero antes de la adrenalina está el paisaje: agua que cambia de tono según la hora y la sal que brilla bajo el sol caribeño. Un accidente geográfico convertido en destino de alto rendimiento.", 
    lat: 10.871944, lng: -75.095556, image: "assets/images/puntos/fotografia-para-la-pagina-d.n.webp", 
    location: "Juan de Acosta.", hours: "9:00 a.m. - 6:00 p.m.", price: "Gratuito.", 
    tags: ["Deportes náuticos", "Vistas panorámicas", "Experiencias sensoriales"]
  },
  {
    id: 13, eventMonth: 0, startDay: 30, endDay: 31, category: "cultura", title: "Festival del Millo", 
    description: "La flauta de millo sale a las calles de Juan de Acosta cada año para recordar el origen agrícola de este municipio. El baile, la música y los platos derivados del grano tejen una celebración donde la herencia campesina del Caribe no es pasado sino identidad activa que se renueva con cada edición.", 
    lat: 10.830311, lng: -75.031867, image: "assets/images/puntos/fotografia-para-la-pagina-f.m.webp", 
    location: "Juan de Acosta.", hours: "Anual.", price: "Gratuito.", 
    tags: ["Comida autóctona", "Artesanías", "Experiencias sensoriales"]
  },
  {
    id: 14, category: "gastronomia", title: "Parador El Sombrero Vueltiao", 
    description: "Una parada en la vía que es mucho más que descanso. El sombrero vueltiao gigante marca un punto donde artesanos y productores locales exhiben y venden su trabajo. Aquí la carretera se convierte en mercado vivo: comida típica, artesanías auténticas y el orgullo de quienes hacen de su oficio una identidad.", 
    lat: 10.8805, lng: -75.0711, image: "assets/images/puntos/foto-principal-s.v.webp", 
    location: "Juan de Acosta.", hours: "Variable.", price: "Gratuito.", 
    tags: ["Artesanías", "Comida autóctona", "Vistas panorámicas"]
  },
  {
    id: 15, category: "playas", title: "Playa de Puerto Velero", 
    description: "La ensenada natural de Puerto Velero protege sus aguas del oleaje abierto, creando una calma que pocas playas del Caribe colombiano ofrecen. El entorno de manglares y la profundidad gradual la hacen refugio ideal para la vela y los deportes náuticos suaves en un ecosistema costero todavía bien conservado.", 
    lat: 10.947222, lng: -75.036944, image: "assets/images/puntos/foto-principal-para-la-pagina-p.v.webp", 
    location: "Tubará.", hours: "8:00 a.m. - 6:00 p.m.", price: "Gratuito.", 
    tags: ["Relax en la playa", "Deportes náuticos", "Comida autóctona"]
  },
  {
    id: 16, category: "cultura", title: "Museo Arqueológico de Galapa", 
    description: "Las cerámicas y piezas que custodian estas salas no son solo objetos: son los vestigios de los Mokaná y las culturas que habitaron este territorio antes de la conquista. Recorrer el museo es reconocer en cada pieza la continuidad de un pueblo cuya historia no empezó en 1492 sino siglos antes.", 
    lat: 10.899722, lng: -74.886111, image: "assets/images/puntos/foto-principal-m.g.webp", 
    location: "Galapa.", hours: "Variable.", price: "Gratuito.", 
    tags: ["Artesanías", "Experiencias sensoriales"]
  },
  {
    id: 17, category: "ecoturismo", title: "Mariposario Butterfly Caribe", 
    description: "Cientos de especies de mariposas viven y se reproducen en este jardín controlado en Galapa. Más que un atractivo visual, el mariposario educa sobre el papel crítico de los polinizadores en los ecosistemas tropicales. Una experiencia que pone al visitante en contacto directo con la fragilidad y la belleza de la vida natural.", 
    lat: 10.875833, lng: -74.930833, image: "assets/images/puntos/foto-principal-m.a.webp", 
    location: "Galapa.", hours: "9:30 a.m. - 2:30 p.m.", price: "Adultos: $25.000.", 
    tags: ["Avistamiento de aves", "Experiencias sensoriales"]
  },
  {
    id: 18, category: "ecoturismo", title: "Parque Biotemático Megua", 
    description: "32 hectáreas de senderos, granjas interactivas y zonas de conservación en las afueras de Galapa. Megua es un aula viva donde se aprende sobre suelos, plantas nativas y ciclos naturales mientras se camina entre animales de la región. El contacto directo con los procesos del campo es el centro de la experiencia.", 
    lat: 10.848611, lng: -74.896667, image: "assets/images/puntos/foto-principal-b.m.webp", 
    location: "Galapa.", hours: "9:00 a.m. - 5:00 p.m.", price: "Adultos: $22.000.", 
    tags: ["Avistamiento de aves", "Experiencias sensoriales", "Vistas panorámicas"]
  },
  {
    id: 19, category: "cultura", title: "Museo Carlos Arturo Valdez", 
    description: "Una colección privada donada a la comunidad de Malambo que preserva objetos de la vida cotidiana de la etnia Mokaná y vestigios del desarrollo histórico de este municipio a orillas del río. Cada pieza habla de una época y de una gente que construyó identidad en el cruce entre el agua y la tierra.", 
    lat: 10.861667, lng: -74.773611, image: "assets/images/puntos/foto-principal-para-la-pagina-m.a.webp", 
    location: "Malambo.", hours: "8:00 a.m. - 12:00 p.m.", price: "Gratuito.", 
    tags: ["Artesanías", "Experiencias sensoriales"]
  },
  {
    id: 20, category: "cultura", title: "Ventana al Mundo", 
    description: "Placas de vidrio multicolor que se elevan en Barranquilla como símbolo de una ciudad que mira hacia afuera sin perder su raíz caribeña. El monumento más fotografiado del Atlántico es también una declaración de identidad: una ciudad que celebra su apertura al mundo desde la orilla del río que la define.", 
    lat: 11.0325, lng: -74.831389, image: "assets/images/puntos/foto-principal-para-la-pagina-v.m.webp", 
    location: "Barranquilla.", hours: "Abierto.", price: "Gratuito.", 
    tags: ["Vistas panorámicas", "Experiencias sensoriales"]
  },
  {
    id: 21, category: "cultura", title: "Ventana de Campeones", 
    description: "La Aleta de Tiburón no es solo homenaje al Junior de Barranquilla: es la materialización del vínculo entre una ciudad y su equipo. Cristal y acero que brillan con los colores de una pasión colectiva que trasciende el estadio y se instala en la rotonda de la Vía 40 como monumento a la identidad festiva barranquillera.", 
    lat: 10.998319, lng: -74.772767, image: "assets/images/puntos/aleta-de-tiburon.webp", 
    location: "Barranquilla.", hours: "Abierto.", price: "Gratuito.", 
    tags: ["Vistas panorámicas", "Experiencias sensoriales"]
  },
  {
    id: 22, category: "cultura", title: "Gran Malecón del Río", 
    description: "Barranquilla le devolvió kilómetros de orilla al Magdalena y creó el espacio público más visitado del país. El Malecón no es solo un paseo: es la prueba de que una ciudad puede reconectarse con el río que la fundó. Cada sendero recuperado, cada zona verde, es territorio que dejó de darle la espalda al agua.", 
    lat: 11.020017, lng: -74.793225, image: "assets/images/puntos/foto-principal-para-la-pagina-g.m.webp", 
    location: "Barranquilla.", hours: "5:00 a.m - 11:00 p.m.", price: "Gratuito.", 
    tags: ["Vistas panorámicas", "Comida autóctona", "Relax en la playa"]
  },
  {
    id: 23, category: "nauticos", title: "Playas de Puerto Mocho", 
    description: "Donde el Magdalena y el mar Caribe se encuentran en Bocas de Cenizas, Puerto Mocho ofrece un fenómeno natural único: dos cuerpos de agua con colores y temperaturas distintas que se mezclan ante tus ojos. El tren turístico y los servicios renovados hacen accesible este ecosistema de desembocadura sin alterarlo.", 
    lat: 11.045556, lng: -74.828889, image: "assets/images/puntos/mocho.webp", 
    location: "Barranquilla.", hours: "Variable.", price: "Gratuito.", 
    tags: ["Relax en la playa", "Vistas panorámicas", "Deportes náuticos"]
  },
  {
    id: 24, category: "ecoturismo", title: "Ecoparque Ciénaga de Mallorquín", 
    description: "Pasarelas de madera sobre el agua que llevan al corazón del manglar sin dejar huella. La Ciénaga de Mallorquín es el pulmón verde de Barranquilla: un humedal costero en proceso de recuperación ecológica donde el avistamiento de aves y el silencio del ecosistema son la experiencia en sí misma.", 
    lat: 11.028, lng: -74.778, image: "assets/images/puntos/ecoparque-mallorquin.webp", 
    location: "Barranquilla.", hours: "6:00 a.m - 6:00 p.m.", price: "Gratuito.", 
    tags: ["Avistamiento de aves", "Experiencias sensoriales", "Vistas panorámicas"]
  },
  {
    id: 25, category: "ecoturismo", title: "Salinas de Galerazamba", 
    description: "El color rosa del agua en Galerazamba no es un filtro: es el resultado de una microalga que prospera en la alta concentración de sal. Un fenómeno geológico y biológico que convierte este paisaje en algo casi irreal. Las salinas son también historia minera viva y sustento económico de la comunidad de Santa Catalina.", 
    lat: 10.794167, lng: -75.253333, image: "assets/images/puntos/foto-principal-s.g.webp", 
    location: "Santa Catalina.", hours: "Variable.", price: "Gratuito.", 
    tags: ["Vistas panorámicas", "Experiencias sensoriales"]
  },
  {
    id: 26, category: "playas", title: "Playas del Country", 
    description: "Oleaje moderado, servicios de calidad y una ubicación cercana a las zonas residenciales de Puerto Colombia. Las playas del Country ofrecen condiciones naturales propicias para los deportes náuticos suaves en un litoral bien conservado donde el mar caribeño llega con temperatura cálida y color intenso.", 
    lat: 11.001111, lng: -74.952778, image: "assets/images/puntos/foto-principal-para-la-pagina-p.s.webp", 
    location: "Puerto Colombia.", hours: "7:00 a.m. - 4:00 p.m.", price: "Gratuito.", 
    tags: ["Relax en la playa", "Vistas panorámicas"]
  },
  {
    id: 27, category: "playas", title: "Playa de Caño Dulce", 
    description: "Poca profundidad, olas suaves y un entorno costero que conserva su naturalidad. Caño Dulce, en Tubará, es la playa que el Caribe ofrece a las familias que buscan baño tranquilo, comida de mar fresca y un litoral sin aglomeración. El entorno natural conservado es su mayor atractivo y su rasgo más frágil.", 
    lat: 10.939722, lng: -75.027778, image: "assets/images/puntos/foto-principal-para-la-pagina-c.d.webp", 
    location: "Tubará.", hours: "8:00 a.m. - 6:00 p.m.", price: "Gratuito.", 
    tags: ["Relax en la playa", "Comida autóctona"]
  },
  {
    id: 28, category: "ecoturismo", title: "Parque Mirador Tubará", 
    description: "Desde lo más alto de Tubará, una vista de 360 grados revela la geografía completa del Atlántico: el Mar Caribe, las montañas del departamento y el relieve ondulado del territorio Mokaná. El viento que siempre sopla aquí es el mismo que ha moldeado este paisaje durante siglos. Un mirador que muestra el territorio tal como es.", 
    lat: 10.871111, lng: -74.974444, image: "assets/images/puntos/foto-principal-para-la-pagina-m.t.webp", 
    location: "Tubará.", hours: "Abierto todo el tiempo.", price: "Gratuito.", 
    tags: ["Vistas panorámicas", "Experiencias sensoriales", "Avistamiento de aves"]
  },
  {
    id: 29, category: "otros", title: "Aeropuerto Ernesto Cortissoz", 
    description: "El principal enlace aéreo del Atlántico que conecta a Barranquilla y su área metropolitana con el mundo. Con instalaciones modernizadas, ofrece una experiencia de llegada ágil y cómoda al corazón de la región. Su nombre honra a un pionero de la aviación comercial en América, reflejando el espíritu emprendedor y la conectividad que siempre han definido a esta zona del país.", 
    lat: 10.886536, lng: -74.776478, image: "assets/images/puntos/aeropuerto-barranquilla.webp", 
    location: "Barranquilla.", hours: "24h.", price: "N/A.", 
    tags: ["Comida autóctona"]
  },
  {
    id: 30, eventMonth: 10, startDay: 9, endDay: 16, category: "eventos", title: "Fiestas novembrinas de Cartagena", 
    description: "Una semana en noviembre en que Cartagena conmemora su independencia con desfiles, comparsas y música folclórica que llena cada plaza y callejón. Las Fiestas novembrinas son la celebración de la identidad africana y caribeña de la ciudad amurallada, un patrimonio vivo que la historia no ha podido contener.", 
    lat: 10.421903, lng: -75.550075, image: "assets/images/puntos/fiestas-novembrinas-de-cartagena.webp", 
    location: "Cartagena.", hours: "Noviembre.", price: "Gratuito.", 
    tags: ["Experiencias sensoriales", "Artesanías", "Comida autóctona"]
  },
  {
    id: 31, category: "cultura", title: "Museo del Carnaval", 
    description: "El Carnaval de Barranquilla vive aquí los 365 días del año. Vestidos reales de reinas, secretos de las danzas tradicionales y la historia de un patrimonio oral e inmaterial de la humanidad. Recorrer el museo es entender por qué el Carnaval no es solo cuatro días de fiesta sino el ADN festivo de toda una ciudad.", 
    lat: 10.992789, lng: -74.787797, image: "assets/images/puntos/museo-del-carnaval-de-barranquilla.webp", 
    location: "Barranquilla.", hours: "Variable.", price: "Gratuito.", 
    tags: ["Artesanías", "Experiencias sensoriales"]
  },
  {
    id: 32, category: "otros", title: "Aeropuerto Internacional Rafael Núñez", 
    description: "Ubicado en el corazón de Cartagena, el Aeropuerto Internacional Rafael Núñez es mucho más que una terminal aérea; es el punto donde comienza la magia para millones de viajeros cada año. Se destaca por su ubicación privilegiada, a solo minutos del Centro Histórico y la zona turística, facilitando una transición inmediata hacia la historia y el mar. Su diseño eficiente y su conectividad internacional lo consolidan como un motor fundamental del turismo sostenible en la región.", 
    lat: 10.446314, lng: -75.516453, image: "assets/images/puntos/aeropuerto-internacional-rafael-nunez.webp", 
    location: "Cartagena, Bolívar.", hours: "Abierto todo el tiempo.", price: "N/A.", 
    tags: ["Artesanías"]
  },
  {
    id: 33, category: "ecoturismo", title: "La Casa Voltiá", 
    description: "Una construcción que desafía la lógica en Juan de Acosta: todo está de cabeza, la gravedad parece invertida y la fotografía creativa se convierte en juego colectivo. La Casa Voltiá es una iniciativa local que hace de la curiosidad un motor económico para la comunidad y convierte la carretera en destino.", 
    lat: 10.834994, lng: -75.141247, image: "assets/images/puntos/la-casa-voltia.webp", 
    location: "Juan de Acosta.", hours: "9:00 am - 6:00 pm", price: "Gratuito.", 
    tags: ["Experiencias sensoriales", "Vistas panorámicas"]
  },
  {
    id: 34, category: "playas", title: "Manzanillo del Mar", 
    description: "Una comunidad de pescadores que conserva el ritmo de la vida costera sin ceder al turismo masivo. En Manzanillo del Mar, el visitante llega a un entorno donde la gente vive del mar y lo conoce profundo. La comida fresca, las caminatas por la costa y la escala íntima del lugar son consecuencia de esa vida, no un decorado.", 
    lat: 10.515992, lng: -75.499278, image: "assets/images/puntos/manzanillo-del-mar.webp", 
    location: "Cartagena.", hours: "Variable.", price: "Gratuito.", 
    tags: ["Relax en la playa", "Deportes náuticos", "Vistas panorámicas"]
  },
  {
    id: 35, category: "infraestructura", title: "Viaducto Gran Manglar", 
    description: "Un viaducto premiado internacionalmente por permitir que el ecosistema de manglar respire por debajo de la carretera. El agua fluye, las raíces crecen y las aves anidan mientras el tráfico pasa por encima. Conducir sobre él es ver que la infraestructura puede coexistir con la naturaleza sin dominarla.", 
    lat: 10.476022, lng: -75.488756, image: "assets/images/puntos/puente-del-viaducto-el-gran-manglar.webp", 
    location: "Cartagena.", hours: "Abierto.", price: "Gratuito.", 
    tags: ["Vistas panorámicas", "Experiencias sensoriales"]
  },
  {
    id: 36, category: "ecoturismo", title: "Ciénaga de la Virgen", 
    description: "Humedal estratégico al norte de Cartagena, hogar de manglares, aves migratorias y peces que alimentan a las comunidades de sus orillas. Los recorridos en barca guiados por pescadores locales permiten entrar al ecosistema con respeto, aprendiendo de quienes conocen cada canal y cada especie por nombre.", 
    lat: 10.460533, lng: -75.494847, image: "assets/images/puntos/cienaga-de-la-virgen.webp", 
    location: "Cartagena.", hours: "Abierto.", price: "Gratuito.", 
    tags: ["Avistamiento de aves", "Experiencias sensoriales"]
  },
  {
    id: 37, category: "playas", title: "Playa de la Boquilla", 
    description: "El manglar y el mar se abrazan en La Boquilla mientras los tambores marcan el compás de una comunidad afrodescendiente que vive de los dos. Los recorridos en canoa por los túneles de manglar son guiados por locales que conocen este ecosistema desde niños. Naturaleza y cultura que no se pueden entender por separado.", 
    lat: 10.4621, lng: -75.504458, image: "assets/images/puntos/playa-de-la-boquilla.webp", 
    location: "Cartagena.", hours: "Abierto.", price: "Gratuito.", 
    tags: ["Relax en la playa", "Comida autóctona", "Deportes náuticos"]
  },
  {
    id: 38, eventMonth: 5, startDay: 1, endDay: 3, category: "eventos", title: "Festival Enyúcate", 
    description: "La yuca toma el centro de Malambo para celebrar la seguridad alimentaria y la cultura campesina del Atlántico. Cocineros tradicionales, productores locales y música de gaita comparten espacio en una feria donde probar un enyucado es conectarse con la tierra y con el conocimiento agrícola que sostiene a la región.", 
    lat: 10.830311, lng: -75.031867, image: "assets/images/puntos/enyucate.webp", 
    location: "Malambo.", hours: "Variable.", price: "Gratuito.", 
    tags: ["Comida autóctona", "Artesanías"]
  },
  {
    id: 39, category: "ecoturismo", title: "Ciénaga del Totumo", 
    description: "Humedal de agua dulce que coexiste con el Volcán del Totumo en Santa Catalina. Sus aguas tranquilas reflejan manglares y cielo abierto, y sus orillas son hábitat de aves y peces que los pescadores artesanales conocen bien. Los paseos en lancha muestran la escala real de un ecosistema hídrico todavía en equilibrio.", 
    lat: 10.738397, lng: -75.260689, image: "assets/images/puntos/cienaga-totumo.webp", 
    location: "Santa Catalina.", hours: "Abierto.", price: "Gratuito.", 
    tags: ["Avistamiento de aves", "Vistas panorámicas"]
  },
  {
    id: 40, eventMonth: 1, startDay: 16, endDay: 16, category: "eventos", title: "Festival de la Palma Amarga", 
    description: "En Piojó, la fibra de la palma amarga se convierte en artesanía, en techo y en identidad. El festival celebra el conocimiento ancestral de tejedores y artesanos que transforman este recurso natural en objetos que cuentan la historia del territorio. Música de viento y muestras artesanales que vinculan cultura y tierra.", 
    lat: 10.75, lng: -75.108, image: "assets/images/puntos/Festival de la Palma Amarga.webp", 
    location: "Piojó, Atlántico.", hours: "El evento dura entre 1 y 3 días.", price: "Gratuito.", 
    tags: ["Turismo cultural","desfiles y comparsas","música y danza","concursos tradicionales","gastronomía","comercio local."]
  },
  {
    id: 41, category: "ecoturismo", title: "Calvaduria Ecoturismo y Camping - Asociación agroecológica Nueva Generación de Piojó", 
    description: "Pozos naturales, senderos entre montañas suaves y una asociación agroecológica que gestiona el territorio con criterio. En Calvaduria el camping, el agroturismo y la naturaleza no son productos empaquetados: son la vida cotidiana de una comunidad de Piojó que aprendió a cuidar el entorno como condición de su propio futuro.", 
    lat: 10.751, lng: -75.109, image: "assets/images/puntos/Calvaduria Ecoturismo y Camping.webp", 
    location: "Piojó, Atlántico.", hours: "Abierto todo el tiempo.", price: "Pasa día: adultos:$15.000 mil cop. Niños: $7.000 mil cop.", 
    tags: ["Agroturismo","camping","pozos naturales","senderismo","rutas ecológicas","hospedaje."]
  },
  {
    id: 42, category: "cultura", title: "Santuario Mariano Nuestra Señora del Carmen", 
    description: "El único santuario mariano del Atlántico abre sus puertas los 365 días del año en Puerto Colombia. Su arquitectura tradicional conserva el estilo de una devoción que ha acompañado a la comunidad porteña por generaciones. Un espacio de fe que es también patrimonio cultural y punto de encuentro entre historia y espiritualidad caribeña.", 
    lat: 10.988, lng: -74.959, image: "assets/images/puntos/Santuario Mariano Nuestra Señora del Carmen.webp", 
    location: "Puerto Colombia, Atlántico.", hours: "Abierto todo el tiempo.", price: "Gratuito.", 
    tags: ["Religiosos","comunitarios y culturales."]
  },
  {
    id: 43, eventMonth: 0, startDay: 29, endDay: 31, category: "eventos", title: "Sirenato de la cumbia", 
    description: "Desde 1996, Puerto Colombia se convierte cada año en el escenario donde la cumbia se celebra a sí misma. Tambores, flautas y pasos ancestrales renuevan el pacto de cada generación con el ritmo que define al Caribe colombiano. No es un festival de entretenimiento: es la ceremonia viva de una memoria musical.", 
    lat: 10.989, lng: -74.955, image: "assets/images/puntos/Sirenato de la cumbia.webp", 
    location: "Puerto Colombia, Atlántico.", hours: "El evento dura entre 1 y 3 días.", price: "Gratuito.", 
    tags: ["Concurso de reinas en distintas categorías","presentaciones de música y danza de cumbia","desfiles culturales","comparsas y actividades turísticas que promueven el patrimonio del Caribe Colombiano."]
  },
  {
    id: 44, eventMonth: 5, startDay: 1, endDay: 3, category: "eventos", title: "Festival del Mar y del Turismo", 
    description: "Desde 2018, Puerto Colombia reúne a los municipios del Atlántico para celebrar la vocación costera del departamento. Desfiles, muestras culturales y la elección de la capitanía de los mares construyen cada año un himno colectivo al mar, al liderazgo y al orgullo de una región que vive de cara al Caribe.", 
    lat: 10.987, lng: -74.958, image: "assets/images/puntos/Festival del Mar y del Turismo.webp", 
    location: "Puerto Colombia, Atlántico.", hours: "El evento dura entre 1 y 3 días.", price: "Gratuito.", 
    tags: ["Desfiles","presentaciones culturales","feria gastronómica y actividades recreativas."]
  },
  {
    id: 45, category: "cultura", title: "Parroquia San José de Tubará", 
    description: "Construida en 1833 sobre un antiguo asentamiento Mokaná, esta parroquia fue declarada patrimonio arquitectónico del Atlántico en 1996. Sus muros coloniales guardan la memoria de una comunidad indígena que no desapareció sino que adaptó su fe y su identidad a la historia que llegó desde afuera.", 
    lat: 10.871, lng: -74.974, image: "assets/images/puntos/Parroquia San José de Tubará.webp", 
    location: "Tubará, Atlántico.", hours: "Horario de eucaristías: fines de semana y festivos en la mañana y en la tarde.", price: "Gratuito.", 
    tags: ["Celebraciones religiosas (misas","bautizos","matrimonios","confirmaciones)","atención espiritual y confesiones","actividades comunitarias y pastorales."]
  },
  {
    id: 46, eventMonth: 1, startDay: 14, endDay: 15, category: "eventos", title: "Festival de la Yuca y el Totumo", 
    description: "Más de 20 años de existencia y un origen Mokaná en el mirador de Tubará. Este festival celebra cada domingo de carnaval los cultivos y las artesanías que los pueblos originarios del Atlántico han producido por siglos. La yuca y el totumo no son solo productos: son el vínculo vivo entre la tierra y la identidad del territorio.", 
    lat: 10.872, lng: -74.973, image: "assets/images/puntos/Festival de la Yuca y el Totumo.webp", 
    location: "Tubará, Atlántico.", hours: "", price: "", 
    tags: []
  },
  {
    id: 47, eventMonth: 10, startDay: 21, endDay: 23, category: "eventos", title: "Festival de la Máscara y el Bejuco", 
    description: "La plaza de Galapa se convierte en escenario de creadores que trabajan el bejuco, la madera y el papel maché con técnicas de generación en generación. El festival no es solo exhibición: es el espacio donde los oficios artesanales de Galapa se afirman como patrimonio vivo frente a la homogeneización cultural.", 
    lat: 10.899, lng: -74.886, image: "assets/images/puntos/Festival de la Máscara y el Bejuco.webp", 
    location: "Galapa, Atlántico.", hours: "El evento dura entre 1 y 3 días.", price: "Gratuito.", 
    tags: ["Exhibición artesanal (bejuco","talla en madera y papel maché)","venta de artesanías","talleres demostrativos","interacción con artesanos","presentaciones culturales."]
  },
  {
    id: 48, eventMonth: 1, startDay: 14, endDay: 22, category: "eventos", title: "Carnaval de Galapa", 
    description: "Ocho a diez días en que Galapa celebra su identidad con tambores, comparsas y danzas que llevan décadas narrando la historia del municipio. Cada disfraz es una memoria, cada desfile una afirmación de raíces. El Carnaval de Galapa resiste en el tiempo porque la comunidad lo construye desde adentro, no para afuera.", 
    lat: 10.898, lng: -74.885, image: "assets/images/puntos/Carnaval de Galapa.webp", 
    location: "Galapa, Atlántico.", hours: "El evento dura entre 8 y 10 días.", price: "Gratuito.", 
    tags: ["Desfiles de comparsas y danzas tradicionales","presentaciones folclóricas y musicales","exhibición de disfraces típicos y personajes","venta de artesanías y productos locales","gastronomía típica en puestos y ferias","actividades recreativas y familiares."]
  },
  {
    id: 49, eventMonth: 6, startDay: 17, endDay: 19, category: "eventos", title: "Festival de Decimeros y Bailadores de Cumbia de la Región Caribe", 
    description: "Un espacio de transmisión oral donde decimeros y bailadores de Magdalena, Córdoba, Sucre y el Atlántico se encuentran en Malambo para preservar la poesía y el movimiento del Caribe. Más que competencia, el festival es un acto de salvaguardia patrimonial que pone en diálogo tradiciones que el tiempo podría silenciar.", 
    lat: 10.862, lng: -74.774, image: "assets/images/puntos/Festival de Decimeros y Bailadores de Cumbia.webp", 
    location: "Malambo, Atlántico.", hours: "El evento dura entre 1 y 3 días.", price: "Gratuito.", 
    tags: []
  },
  {
    id: 50, eventMonth: 6, startDay: 17, endDay: 19, category: "eventos", title: "Festival regional de Bandas Tradicionales", 
    description: "Porros, cumbias y fandangos interpretados por agrupaciones de viento y percusión que se reúnen en Malambo para demostrar que la música tradicional del Caribe no es pasado. El festival es encuentro y fortalecimiento: el talento local se mide y se celebra en un espacio que le da valor al patrimonio musical de la región.", 
    lat: 10.861, lng: -74.773, image: "assets/images/puntos/Festival regional de Bandas Tradicionales.webp", 
    location: "Malambo, Atlántico.", hours: "El evento dura entre 1 y 3 días.", price: "Gratuito.", 
    tags: []
  },
  {
    id: 51, eventMonth: 6, startDay: 19, endDay: 22, category: "eventos", title: "Fiestas de Santa María Magdalena", 
    description: "Cuatro días de procesiones, muestras folclóricas y celebraciones deportivas que reúnen a Malambo en torno a su patrona. Las fiestas de Santa María Magdalena no son solo devoción: son el momento del año en que la comunidad se reconoce a sí misma, celebra su herencia y renueva los lazos que la definen como pueblo.", 
    lat: 10.86, lng: -74.772, image: "assets/images/puntos/Fiestas de Santa María Magdalena.webp", 
    location: "Malambo, Atlántico.", hours: "El evento dura entre 1 y 3 días.", price: "Gratuito.", 
    tags: ["Ofrece servicios de actividades culturales","eventos religiosos","presentaciones artísticas","ferias gastronómicas","competencias deportivas y espacios de recreación familiar."]
  },
  {
    id: 52, category: "cultura", title: "Parque de La Cultura - Asociación Cultural y Artesanal Raíces de Malambo", 
    description: "Un parque que rinde homenaje a la tradición alfarera que durante siglos ha sido el sustento y la identidad de Malambo. La Asociación Raíces gestiona este espacio como punto de encuentro entre el pasado indígena y el presente comunitario, donde el barro y las manos de los artesanos cuentan la historia que los libros no alcanzaron.", 
    lat: 10.863, lng: -74.775, image: "assets/images/puntos/Parque de La Cultura.webp", 
    location: "Malambo, Atlántico.", hours: "Abierto todo el tiempo.", price: "Gratuito.", 
    tags: ["Zonas verdes","áreas de esparcimiento","juegos para niños."]
  },
  {
    id: 53, category: "ecoturismo", title: "Parque Lineal de Crespo", 
    description: "Diseñado para frenar la erosión costera que el Caribe avanzaba sin pausa, el Parque Lineal de Crespo es hoy un corredor verde que reconcilia a Cartagena con su mar. Cada árbol plantado, cada sendero recuperado, es una respuesta activa al cambio climático desde la escala urbana. El futuro sostenible construido metro a metro.", 
    lat: 10.439, lng: -75.522, image: "assets/images/puntos/Parque Lineal de Crespo.webp", 
    location: "Cartagena, Bolívar.", hours: "", price: "", 
    tags: []
  },
  {
    id: 54, category: "playas", title: "Playa Marbella", 
    description: "Espolones que desafían las corrientes del Caribe protegen esta franja de arena en el borde urbano de Cartagena. Marbella es la playa de la ciudad que no cede a las corrientes erosivas y ofrece aguas accesibles lejos del bullicio de los balnearios tradicionales. Un litoral urbano que conserva su carácter natural.", 
    lat: 10.434, lng: -75.529, image: "assets/images/puntos/Playa Marbella.webp", 
    location: "Cartagena, Bolívar.", hours: "", price: "", 
    tags: []
  },
  {
    id: 55, eventMonth: 10, startDay: 20, endDay: 25, category: "eventos", title: "Fiestas patronales Santa Catalina de Alejandría", 
    description: "Fe y folclor que se fusionan durante varios días en el municipio que lleva el nombre de la patrona. Procesiones, corridas de toros y la elección de la diosa llenan las calles de una celebración donde la identidad africana y caribeña de la Costa Caribe se expresa sin filtros, con devoción y alegría a la vez.", 
    lat: 10.605, lng: -75.253, image: "assets/images/puntos/Fiestas patronales Santa Catalina de Alejandría.webp", 
    location: "Santa Catalina, Bolívar.", hours: "El evento dura entre 4 y 7 días.", price: "Gratuito.", 
    tags: ["Turismo cultural","gastronomía","música y danzas tradicionales","eventos religiosos","comercio local."]
  },
  {
    id: 56, category: "cultura", title: "Museo Etnoindustrial", 
    description: "En Galerazamba, la sal no es solo un mineral: es la historia económica y social de generaciones. El museo preserva herramientas, fotografías y testimonios que explican cómo la producción salinera marcó la vida entera de esta comunidad. Un recorrido que convierte el trabajo humano sobre el territorio en patrimonio cultural.", 
    lat: 10.794, lng: -75.253, image: "assets/images/puntos/Museo Etnoindustrial.webp", 
    location: "Santa Catalina, Bolívar.", hours: "10:00 a.m. - 4:00 p.m.", price: "Adultos: $7.000 mil cop. Niños (desde 5 años): $5.000 mil cop.", 
    tags: ["Servicios culturales","recorridos guiados","exhibiciones permanentes","actividades pedagógicas y turismo histórico-patrimonial."]
  },
  {
    id: 57, eventMonth: 5, startDay: 10, endDay: 16, category: "eventos", title: "Fiestas patronales de San Antonio de Padua", 
    description: "Piojó se convierte en epicentro del folclor caribeño cuando las bandas papayeras, las corralejas y la vara de premio toman sus calles. Las fiestas de San Antonio no son espectáculo para visitantes: son una celebración comunitaria que honra la tradición y reafirma la identidad de un pueblo que vive su patrimonio con intensidad.", 
    lat: 10.749, lng: -75.107, image: "assets/images/puntos/Fiestas patronales de San Antonio de Padua.webp", 
    location: "Piojó, Atlántico.", hours: "El evento dura entre 1 y 3 días.", price: "Gratuito.", 
    tags: ["Turismo cultural","eventos religiosos","deportes","música y danzas tradicionales","espectáculos taurinos","juegos populares","gastronomía","comercio local."]
  },
  {
    id: 58, category: "playas", title: "Tambo Marina Ecohostal", 
    description: "Frente al mar en Punta Astillero, este ecohostal propone quedarse quieto. El sonido de las olas, el acceso directo a la playa virgen y las actividades de senderismo y pesca son la agenda. Un modelo de alojamiento que cuida el entorno costero como condición de la experiencia misma: sin naturaleza sana, no hay Tambo Marina.", 
    lat: 10.795, lng: -75.224, image: "assets/images/puntos/Tambo Marina Ecohostal.webp", 
    location: "Piojó, Atlántico.", hours: "8:00 a.m. - 9:00 p.m.", price: "", 
    tags: ["Hospedaje ecológico","restaurante","acceso directo a la playa","senderismo","entretenimiento nocturno y turismo sostenible."]
  },
  {
    id: 59, eventMonth: 9, startDay: 15, endDay: 17, category: "eventos", title: "Festival Internacional de las Tunas Corazonistas", 
    description: "Guitarras, capas y serenatas bohemias transforman Puerto Colombia en escenario internacional. Las Tunas Corazonistas hacen de la música estudiantil un puente entre culturas: cada agrupación llega con su región grabada en el repertorio y se va llevando el Caribe colombiano en la memoria. Un festival que construye identidad con cada acorde.", 
    lat: 10.986, lng: -74.957, image: "assets/images/puntos/Festival Internacional de las Tunas Corazonistas.webp", 
    location: "Puerto Colombia, Atlántico.", hours: "El evento dura entre 1 y 3 días.", price: "Gratuito.", 
    tags: ["Presentaciones musicales en vivo","actividades culturales","intercambio artístico internacional","promoción de agrupaciones regionales y entretenimiento para el público."]
  },
  {
    id: 60, category: "cultura", title: "Piedra Pintada. Colectivo Caminantes por El Morro", 
    description: "En los petroglifos de Tubará hablan los ancestros Mokaná que habitaron estas montañas siglos antes de la conquista. El Colectivo Caminantes guía los senderos que llevan a la piedra con el conocimiento de quienes viven el territorio. Visitar Piedra Pintada es entrar a la memoria viva de un pueblo que grabó su historia en la roca.", 
    lat: 10.87, lng: -74.97, image: "assets/images/puntos/Piedra Pintada.webp", 
    location: "Tubará, Atlántico.", hours: "Abierto todo el tiempo.", price: "Gratuito.", 
    tags: ["Caminatas ecológicas","observación de petroglifos","actividades culturales y espirituales","zonas naturales para descanso."]
  },
  {
    id: 61, eventMonth: 1, startDay: 14, endDay: 22, category: "eventos", title: "Carnaval de Tubará", 
    description: "Cada año las calles de Tubará se convierten en río de colores, danzas y cumbia que fluyen desde las raíces más profundas del Caribe colombiano. El Carnaval de Tubará es la celebración que renueva el vínculo entre la comunidad Mokaná y la música que la define, pasando la tradición de generación en generación con orgullo.", 
    lat: 10.873, lng: -74.975, image: "assets/images/puntos/Carnaval de Tubará.webp", 
    location: "Tubará, Atlántico.", hours: "", price: "", 
    tags: []
  },
  {
    id: 62, eventMonth: 1, startDay: 14, endDay: 22, category: "eventos", title: "Festival intermunicipal del folclore", 
    description: "Un encuentro que reúne expresiones folclóricas de varios municipios del Atlántico para celebrar la riqueza y diversidad cultural de la región. Danzas, músicas y manifestaciones tradicionales comparten escenario en un festival que entiende el folclore no como reliquia sino como práctica viva que necesita espacio para existir.", 
    lat: 10.897, lng: -74.884, image: "assets/images/puntos/Festival intermunicipal del folclore.webp", 
    location: "Galapa, Atlántico.", hours: "El evento dura 1 día.", price: "Gratuito.", 
    tags: ["Desfile de comparsas y danzas folclóricas","presentaciones musicales en vivo","exhibición de ritmos tradicionales como cumbia y mapalé","participación de comparsas invitadas","venta de comidas y bebidas típicas","venta de artesanías locales."]
  },
  {
    id: 64,
    category: "infraestructura",
    title: "Túnel de Crespo",
    description: "Barrio Crespo - inicio del proyecto vial El Túnel de Crespo, es una moderna infraestructura vial de 1 kilómetro de longitud (con una longitud sumergida/túnel de unos 600 metros) que forma parte del Anillo Vial de Cartagena de Indias. Este túnel de cuatro carriles (dos por sentido) conecta la zona hotelera del norte con el centro histórico",
    lat: 10.445444,
    lng: -75.52369,
    image: "assets/images/puntos/Parque lineal  de Crespo.webp",
    location: "Cartagena, Atlántico.",
    hours: "24/7",
    price: "Gratuito.",
    tags: ["Infraestructura", "Corredor Vial", "Ruta 90A01", "PR 0+000"]
  },
  {
    id: 65,
    category: "infraestructura",
    title: "Paso de fauna",
    description: "Tierra Baja Los pasos de fauna son estructuras diseñadas para permitir el cruce seguro de animales a través de las vías, ubicadas en zonas de tránsito natural de especies. Su implementación favorece la conservación de la biodiversidad al mantener la conectividad de los ecosistemas, reducir los atropellamientos de fauna y disminuir riesgos para los usuarios de la vía, contribuyendo a un equilibrio entre el desarrollo vial y la protección ambiental.",
    lat: 10.499121,
    lng: -75.477055,
    image: "assets/images/puntos/Paso de fauna.webp",
    location: "Cartagena, Atlántico.",
    hours: "24/7",
    price: "Gratuito.",
    tags: ["Infraestructura", "Corredor Vial", "Ruta 90A01", "PR PR 7+020"]
  },
  {
    id: 66,
    category: "infraestructura",
    title: "Viaducto de La Virgen",
    description: "Boquilla - Cienga de La Virgen El Viaducto El Gran Manglar es una de las obras más emblemáticas de la concesión Ruta Costera 4G, diseñado como una estructura elevada que atraviesa zonas de manglar cercanas a la Ciénaga de la Virgen. Su construcción permite garantizar la conectividad del corredor vial sin afectar de manera directa este ecosistema sensible, al evitar rellenos y minimizar la intervención sobre el terreno natural. Esta infraestructura se destaca por su enfoque en la sostenibilidad ambiental, ya que protege la dinámica hídrica y la biodiversidad del manglar, permitiendo la circulación de agua y el paso de especies. Además, mejora la movilidad al ofrecer un tránsito continuo, seguro y eficiente, reduciendo tiempos de viaje y riesgos para los usuarios. En este sentido, el viaducto no solo cumple una función vial estratégica, sino que también representa una solución de ingeniería que equilibra el desarrollo de infraestructura con la conservación ambiental.",
    lat: 10.460734,
    lng: -75.504856,
    image: "assets/images/puntos/viaducto de la virgen.webp",
    location: "Cartagena, Atlántico.",
    hours: "24/7",
    price: "Gratuito.",
    tags: ["Infraestructura", "Corredor Vial", "UF2", "Ruta 90A01", "PR 1+905"]
  },
  {
    id: 67,
    category: "infraestructura",
    title: "Peaje Marahuaco",
    description: "Arroyo de Piedra - Via al mar - Ruta 90A-01 Las estaciones de peaje son infraestructuras destinadas al recaudo de tarifas por el uso de la vía, las cuales garantizan la sostenibilidad financiera del proyecto bajo el modelo de concesión 4G. Estas instalaciones están ubicadas en puntos estratégicos del corredor y cuentan con carriles operativos, cabinas de cobro y sistemas tecnológicos de control. Su principal beneficio radica en que aseguran los recursos necesarios para la construcción, operación y mantenimiento de la infraestructura, contribuyen a mantener altos niveles de servicio, facilitan la atención de emergencias y promueven una movilidad más eficiente y segura para los usuarios.",
    lat: 10.574485,
    lng: -75.450524,
    image: "assets/images/puntos/Peaje Marahuaco.webp",
    location: "Cartagena, Atlántico.",
    hours: "24/7",
    price: "Gratuito.",
    tags: ["Infraestructura", "Corredor Vial", "UF3", "Ruta 90A01", "PR PR15+1100"]
  },
  {
    id: 68,
    category: "infraestructura",
    title: "Pesaje Marahuaco",
    description: "Arroyo de Piedra - Via al mar - Ruta 90A-02 Las estaciones de pesaje son infraestructuras técnicas diseñadas para controlar y verificar el peso de los vehículos de carga mediante básculas y zonas de inspección especializadas, asegurando el cumplimiento de la normatividad vigente. Estas estaciones generan beneficios clave como la protección de la vía al prevenir el deterioro prematuro por sobrecarga, la reducción de costos de mantenimiento a largo plazo, el fortalecimiento de la seguridad vial al disminuir riesgos asociados a cargas excesivas y la promoción de prácticas responsables en el transporte de mercancías.",
    lat: 10.574485,
    lng: -75.450524,
    image: "assets/images/puntos/pesaje marahuaco.webp",
    location: "Cartagena, Atlántico.",
    hours: "24/7",
    price: "Gratuito.",
    tags: ["Infraestructura", "Corredor Vial", "Ruta 90A01", "PR PR15+1100"]
  },
  {
    id: 69,
    category: "infraestructura",
    title: "Peaje Puerto Colombia",
    description: "Tubara - Via al Mar - Ruta 90A-01 Las estaciones de peaje son infraestructuras destinadas al recaudo de tarifas por el uso de la vía, las cuales garantizan la sostenibilidad financiera del proyecto bajo el modelo de concesión 4G. Estas instalaciones están ubicadas en puntos estratégicos del corredor y cuentan con carriles operativos, cabinas de cobro y sistemas tecnológicos de control. Su principal beneficio radica en que aseguran los recursos necesarios para la construcción, operación y mantenimiento de la infraestructura, contribuyen a mantener altos niveles de servicio, facilitan la atención de emergencias y promueven una movilidad más eficiente y segura para los usuarios.",
    lat: 10.967489,
    lng: -74.956649,
    image: "assets/images/puntos/Peaje Puerto Colombia.webp",
    location: "Cartagena, Atlántico.",
    hours: "24/7",
    price: "Gratuito.",
    tags: ["Infraestructura", "Corredor Vial", "Ruta 90A01", "PR PR93+600"]
  },
  {
    id: 70,
    category: "infraestructura",
    title: "Blas el Teso",
    description: "Sector Cielo Mar - Via al Mar - Ruta 90A-01 Los puentes peatonalesde Ruta Costera son estructuras elevadas diseñadas para permitir el cruce seguro de personas sobre vías de alto tráfico, separando el tránsito peatonal del vehicular. Ubicados estratégicamente en zonas de alta afluencia como universidades, colegios y áreas residenciales, reducen significativamente el riesgo de accidentes, organizan la movilidad y facilitan el acceso seguro a servicios e instituciones, convirtiéndose en elementos clave para la seguridad vial y la protección de la comunidad.",
    lat: 10.458019,
    lng: -75.507907,
    image: "assets/images/puntos/blas el teso.webp",
    location: "Cartagena, Atlántico.",
    hours: "24/7",
    price: "Gratuito.",
    tags: ["Infraestructura", "Corredor Vial", "Ruta 90A01", "PR K1+360"]
  },
  {
    id: 71,
    category: "infraestructura",
    title: "Peaje Papiros",
    description: "Puerto Colombia - Via al Mar - Ruta 90A-01 Las estaciones de peaje son infraestructuras destinadas al recaudo de tarifas por el uso de la vía, las cuales garantizan la sostenibilidad financiera del proyecto bajo el modelo de concesión 4G. Estas instalaciones están ubicadas en puntos estratégicos del corredor y cuentan con carriles operativos, cabinas de cobro y sistemas tecnológicos de control. Su principal beneficio radica en que aseguran los recursos necesarios para la construcción, operación y mantenimiento de la infraestructura, contribuyen a mantener altos niveles de servicio, facilitan la atención de emergencias y promueven una movilidad más eficiente y segura para los usuarios.",
    lat: 11.01267,
    lng: -74.889548,
    image: "assets/images/puntos/Peaje Papiros.webp",
    location: "Puerto Colombia, Atlántico.",
    hours: "24/7",
    price: "Gratuito.",
    tags: ["Infraestructura", "Corredor Vial", "UF4", "Ruta 90A01", "PR PR103+600"]
  },
  {
    id: 72,
    category: "infraestructura",
    title: "Pte. U. Autónoma",
    description: "Via al Mar - Ruta 90A-01 Los puentes peatonalesde Ruta Costera son estructuras elevadas diseñadas para permitir el cruce seguro de personas sobre vías de alto tráfico, separando el tránsito peatonal del vehicular. Ubicados estratégicamente en zonas de alta afluencia como universidades, colegios y áreas residenciales, reducen significativamente el riesgo de accidentes, organizan la movilidad y facilitan el acceso seguro a servicios e instituciones, convirtiéndose en elementos clave para la seguridad vial y la protección de la comunidad.",
    lat: 11.004156,
    lng: -74.921221,
    image: "assets/images/puntos/Pte U Autónoma.webp",
    location: "Puerto Colombia, Atlántico.",
    hours: "24/7",
    price: "Gratuito.",
    tags: ["Infraestructura", "Corredor Vial", "Ruta 90A01", "PR 100070"]
  },
  {
    id: 73,
    category: "infraestructura",
    title: "Pte. Alkarawi",
    description: "Via al Mar - Ruta 90A-01",
    lat: 11.011726,
    lng: -74.896992,
    image: "assets/images/puntos/Pte Alkarawi.webp",
    location: "Puerto Colombia, Atlántico.",
    hours: "24/7",
    price: "Gratuito.",
    tags: ["Infraestructura", "Corredor Vial", "Ruta 90A01", "PR 102900"]
  },
  {
    id: 74,
    category: "infraestructura",
    title: "Pte. U. Atlántico",
    description: "Via al Mar - Ruta 90A-01",
    lat: 11.014807,
    lng: -74.871958,
    image: "assets/images/puntos/Pte U Atlantico.webp",
    location: "Puerto Colombia, Atlántico.",
    hours: "24/7",
    price: "Gratuito.",
    tags: ["Infraestructura", "Corredor Vial", "Ruta 90A01", "PR 105760"]
  },
  {
    id: 75,
    category: "infraestructura",
    title: "Pte. Colegio Alemán",
    description: "Via al Mar - Ruta 90A-01",
    lat: 11.01618,
    lng: -74.861149,
    image: "assets/images/puntos/Pte Colegio Alemán.webp",
    location: "Barranquilla, Atlántico.",
    hours: "24/7",
    price: "Gratuito.",
    tags: ["Infraestructura", "Corredor Vial", "Ruta 90A01", "PR 106900"]
  },
  {
    id: 76,
    category: "infraestructura",
    title: "Pte. U. del Norte",
    description: "Via al Mar - Ruta 90A-01",
    lat: 11.016924,
    lng: -74.851545,
    image: "assets/images/puntos/Pte U del Norte.webp",
    location: "Puerto Colombia, Atlántico.",
    hours: "24/7",
    price: "Gratuito.",
    tags: ["Infraestructura", "Corredor Vial", "Ruta 90A01", "PR 108050"]
  },
  {
    id: 77,
    category: "infraestructura",
    title: "Pesaje Papiros",
    description: "Via al Mar - Ruta 90A-01 Las estaciones de pesaje son infraestructuras técnicas diseñadas para controlar y verificar el peso de los vehículos de carga mediante básculas y zonas de inspección especializadas, asegurando el cumplimiento de la normatividad vigente. Estas estaciones generan beneficios clave como la protección de la vía al prevenir el deterioro prematuro por sobrecarga, la reducción de costos de mantenimiento a largo plazo, el fortalecimiento de la seguridad vial al disminuir riesgos asociados a cargas excesivas y la promoción de prácticas responsables en el transporte de mercancías.",
    lat: 11.01267,
    lng: -74.889548,
    image: "assets/images/puntos/Pesaje Papiros.webp",
    location: "Puerto Colombia, Atlántico.",
    hours: "24/7",
    price: "Gratuito.",
    tags: ["Infraestructura", "Corredor Vial", "Ruta 90A01", "PR PR103+600"]
  },
  {
    id: 78,
    category: "infraestructura",
    title: "Iluminación con paneles solares",
    description: "Via al Mar - Ruta 90A-01 Sistema de iluminación solar en la Vía al Mar entre Puerto Colombia y Barranquilla a lo largo de 9 kilómetros, compuesto por 127 paneles solares y 254 luminarias LED alimentadas con energía fotovoltaica. Este sistema, que cuenta con certificación Retilap y un diseño innovador único en el país, garantiza niveles adecuados de iluminación para una vía tipo M2, mejorando significativamente la visibilidad y seguridad de los usuarios. Además, la iluminación se consolida como una acción de valor sostenible, ya que reduce la emisión de gases de efecto invernadero al utilizar energía limpia, contribuyendo a la transición energética y descarbonización, al tiempo que asegura una iluminación uniforme y eficiente en el corredor vial.",
    lat: 10.991387,
    lng: -74.944406,
    image: "assets/images/puntos/Iluminación con paneles solares.webp",
    location: "Puerto Colombia, Atlántico.",
    hours: "24/7",
    price: "Gratuito.",
    tags: ["Infraestructura", "Corredor Vial", "Ruta 90A01", "PR PR 97+000 -PR 106+000"]
  },
  {
    id: 79,
    category: "infraestructura",
    title: "Peaje Galapa",
    description: "Galapa - Circunvalar de la Prosperidad - Ruta AT04 Las estaciones de peaje son infraestructuras destinadas al recaudo de tarifas por el uso de la vía, las cuales garantizan la sostenibilidad financiera del proyecto bajo el modelo de concesión 4G. Estas instalaciones están ubicadas en puntos estratégicos del corredor y cuentan con carriles operativos, cabinas de cobro y sistemas tecnológicos de control. Su principal beneficio radica en que aseguran los recursos necesarios para la construcción, operación y mantenimiento de la infraestructura, contribuyen a mantener altos niveles de servicio, facilitan la atención de emergencias y promueven una movilidad más eficiente y segura para los usuarios.",
    lat: 10.886275,
    lng: -74.844509,
    image: "assets/images/puntos/Peaje Galapa.webp",
    location: "Galapa, Atlántico.",
    hours: "24/7",
    price: "Gratuito.",
    tags: ["Infraestructura", "Corredor Vial", "UF5", "Ruta 25AT04", "PR K11+700"]
  },
  {
    id: 80,
    category: "infraestructura",
    title: "Pesaje",
    description: "Malambo - Circunvalar de la Prosperidad - Ruta AT04 Las estaciones de pesaje son infraestructuras técnicas diseñadas para controlar y verificar el peso de los vehículos de carga mediante básculas y zonas de inspección especializadas, asegurando el cumplimiento de la normatividad vigente. Estas estaciones generan beneficios clave como la protección de la vía al prevenir el deterioro prematuro por sobrecarga, la reducción de costos de mantenimiento a largo plazo, el fortalecimiento de la seguridad vial al disminuir riesgos asociados a cargas excesivas y la promoción de prácticas responsables en el transporte de mercancías.",
    lat: 10.834097,
    lng: -74.8063,
    image: "assets/images/puntos/Estación Pesaje 2.webp",
    location: "Malambo, Atlántico.",
    hours: "24/7",
    price: "Gratuito.",
    tags: ["Infraestructura", "Corredor Vial", "Ruta 25AT04", "PR K3+900"]
  },
  {
    id: 81,
    category: "infraestructura",
    title: "Pesaje",
    description: "",
    lat: 10.83204,
    lng: -74.801544,
    image: "assets/images/puntos/Estación Pesaje 3.webp",
    location: "Malambo, Atlántico.",
    hours: "24/7",
    price: "Gratuito.",
    tags: ["Infraestructura", "Corredor Vial", "Ruta 25AT04", "PR K3+300"]
  },
  {
    id: 82,
    category: "infraestructura",
    title: "Galapa",
    description: "Galapa - Circunvalar de la Prosperidad - Ruta AT04 Los puentes peatonales de Ruta Costera son estructuras elevadas diseñadas para permitir el cruce seguro de personas sobre vías de alto tráfico, separando el tránsito peatonal del vehicular. Ubicados estratégicamente en zonas de alta afluencia como universidades, colegios y áreas residenciales, reducen significativamente el riesgo de accidentes, organizan la movilidad y facilitan el acceso seguro a servicios e instituciones, convirtiéndose en elementos clave para la seguridad vial y la protección de la comunidad.",
    lat: 10.912588,
    lng: -74.871901,
    image: "assets/images/puntos/galapa.webp",
    location: "Galapa, Atlántico.",
    hours: "24/7",
    price: "Gratuito.",
    tags: ["Infraestructura", "Corredor Vial", "Ruta 25AT04", "PR K16+000"]
  },
  {
    id: 83,
    category: "infraestructura",
    title: "Centro de Control de Operaciones-CCO",
    description: "Galapa - Circunvalar de la Prosperidad - Ruta AT04 El Centro de Control de Operaciones (CCO) es una instalación estratégica encargada de monitorear, coordinar y gestionar en tiempo real el funcionamiento integral del corredor vial. Desde este centro se supervisa el tráfico mediante sistemas tecnológicos como cámaras, sensores y comunicaciones, permitiendo detectar incidentes, coordinar la atención de emergencias y brindar información oportuna a los usuarios. Su principal función es garantizar una operación segura y eficiente de la vía, optimizando la movilidad y reduciendo tiempos de respuesta ante eventualidades. Entre sus beneficios se destacan el fortalecimiento de la seguridad vial, la atención rápida de accidentes o contingencias, la gestión eficiente del flujo vehicular y la mejora continua en la calidad del servicio ofrecido a los usuarios.",
    lat: 10.888349,
    lng: -74.848911,
    image: "assets/images/puntos/Centro de Control de Operaciones.webp",
    location: "Galapa, Atlántico.",
    hours: "24/7",
    price: "Gratuito.",
    tags: ["Infraestructura", "Corredor Vial", "Ruta 25AT04", "PR K12+200"]
  },
  {
    id: 84,
    category: "infraestructura",
    title: "Paso de fauna",
    description: "Malambo y Galapa - Circunvalar de la Prosperidad - Ruta AT04 Los pasos de fauna son estructuras diseñadas para permitir el cruce seguro de animales a través de las vías, ubicadas en zonas de tránsito natural de especies. Su implementación favorece la conservación de la biodiversidad al mantener la conectividad de los ecosistemas, reducir los atropellamientos de fauna y disminuir riesgos para los usuarios de la vía, contribuyendo a un equilibrio entre el desarrollo vial y la protección ambiental.",
    lat: 10.839909,
    lng: -74.815649,
    image: "assets/images/puntos/Paso de fauna.webp",
    location: "Galapa, Atlántico.",
    hours: "24/7",
    price: "Gratuito.",
    tags: ["Infraestructura", "Corredor Vial", "Ruta 25AT04", "PR PR 6+000 / PR 16+000"]
  },
  {
    id: 85,
    category: "infraestructura",
    title: "Peaje Juan Mina",
    description: "Juan Mina - Circunvalar de la Prosperidad - Ruta AT04 Las estaciones de peaje son infraestructuras destinadas al recaudo de tarifas por el uso de la vía, las cuales garantizan la sostenibilidad financiera del proyecto bajo el modelo de concesión 4G. Estas instalaciones están ubicadas en puntos estratégicos del corredor y cuentan con carriles operativos, cabinas de cobro y sistemas tecnológicos de control. Su principal beneficio radica en que aseguran los recursos necesarios para la construcción, operación y mantenimiento de la infraestructura, contribuyen a mantener altos niveles de servicio, facilitan la atención de emergencias y promueven una movilidad más eficiente y segura para los usuarios.",
    lat: 10.929208,
    lng: -74.894498,
    image: "assets/images/puntos/Peaje Juan Mina.webp",
    location: "Barranquilla, Atlántico.",
    hours: "24/7",
    price: "Gratuito.",
    tags: ["Infraestructura", "Corredor Vial", "UF6", "Ruta 25AT04", "PR K19+300"]
  },
  {
    id: 86,
    category: "infraestructura",
    title: "Pesaje",
    description: "Juan Mina - Circunvalar de la Prosperidad - Ruta AT04 Las estaciones de pesaje son infraestructuras técnicas diseñadas para controlar y verificar el peso de los vehículos de carga mediante básculas y zonas de inspección especializadas, asegurando el cumplimiento de la normatividad vigente. Estas estaciones generan beneficios clave como la protección de la vía al prevenir el deterioro prematuro por sobrecarga, la reducción de costos de mantenimiento a largo plazo, el fortalecimiento de la seguridad vial al disminuir riesgos asociados a cargas excesivas y la promoción de prácticas responsables en el transporte de mercancías.",
    lat: 10.984274,
    lng: -74.890172,
    image: "assets/images/puntos/Estación Pesaje 4.webp",
    location: "Barranquilla, Atlántico.",
    hours: "24/7",
    price: "Gratuito.",
    tags: ["Infraestructura", "Corredor Vial", "Ruta 25AT04", "PR K26+130"]
  },
  {
    id: 87,
    category: "infraestructura",
    title: "Pesaje",
    description: "Galapa - Circunvalar de la Prosperidad - Ruta AT04",
    lat: 10.980829,
    lng: -74.890956,
    image: "assets/images/puntos/Estación Pesaje.webp",
    location: "Barranquilla, Atlántico.",
    hours: "24/7",
    price: "Gratuito.",
    tags: ["Infraestructura", "Corredor Vial", "Ruta 25AT04", "PR K25+850"]
  },
  {
    id: 88,
    category: "infraestructura",
    title: "Área de Servicio",
    description: "Juan Mina - Circunvalar de la Prosperidad - Ruta AT04 Las áreas de servicio son espacios complementarios dentro del corredor vial diseñados para brindar atención integral a los usuarios, ofreciendo servicios como zonas de descanso, baterías sanitarias, estaciones de combustible, puntos de alimentación y, en algunos casos, asistencia mecánica básica. Estas áreas están ubicadas estratégicamente a lo largo de la vía para facilitar paradas seguras durante los recorridos, especialmente en trayectos largos. Su implementación contribuye significativamente a la seguridad vial, ya que ayudan a reducir la fatiga del conductor, promueven pausas activas y disminuyen el riesgo de accidentes. Además, mejoran la experiencia del usuario al proporcionar comodidad, bienestar y acceso a servicios, fortaleciendo la calidad del corredor vial y su enfoque en el servicio al ciudadano.",
    lat: 10.969251,
    lng: -74.898691,
    image: "assets/images/puntos/Área de Servicio.webp",
    location: "Barranquilla, Atlántico.",
    hours: "24/7",
    price: "Gratuito.",
    tags: ["Infraestructura", "Corredor Vial", "Ruta 25AT04", "PR K24+138"]
  },
  {
    id: 89,
    category: "infraestructura",
    title: "Pte. U. del Atlántico",
    description: "Barranquilla - Circunvalar de la Prosperidad - Ruta AT04 Los puentes peatonales de Ruta Costera son estructuras elevadas diseñadas para permitir el cruce seguro de personas sobre vías de alto tráfico, separando el tránsito peatonal del vehicular. Ubicados estratégicamente en zonas de alta afluencia como universidades, colegios y áreas residenciales, reducen significativamente el riesgo de accidentes, organizan la movilidad y facilitan el acceso seguro a servicios e instituciones, convirtiéndose en elementos clave para la seguridad vial y la protección de la comunidad.",
    lat: 11.008753,
    lng: -74.877264,
    image: "assets/images/puntos/Pte U Atlantico2.webp",
    location: "Barranquilla, Atlántico.",
    hours: "24/7",
    price: "Gratuito.",
    tags: ["Infraestructura", "Corredor Vial", "Ruta 25AT04", "PR K29+300"]
  },
  {
    id: 90,
    category: "infraestructura",
    title: "San Vicente de Paul",
    description: "Barranquilla - Circunvalar de la Prosperidad - Ruta AT05",
    lat: 11.030949,
    lng: -74.858066,
    image: "assets/images/puntos/San Vicente de Paul.webp",
    location: "Barranquilla, Atlántico.",
    hours: "24/7",
    price: "Gratuito.",
    tags: ["Infraestructura", "Corredor Vial", "Ruta 25AT04", "PR K33+100"]
  },
  {
    id: 91,
    category: "infraestructura",
    title: "Pasos de fauna",
    description: "Barranquilla - Circunvalar de la Prosperidad - Ruta AT04 Los pasos de fauna son estructuras diseñadas para permitir el cruce seguro de animales a través de las vías, ubicadas en zonas de tránsito natural de especies. Su implementación favorece la conservación de la biodiversidad al mantener la conectividad de los ecosistemas, reducir los atropellamientos de fauna y disminuir riesgos para los usuarios de la vía, contribuyendo a un equilibrio entre el desarrollo vial y la protección ambiental.",
    lat: 11.030688,
    lng: -74.846314,
    image: "assets/images/puntos/Pasos de fauna3.webp",
    location: "Barranquilla, Atlántico.",
    hours: "24/7",
    price: "Gratuito.",
    tags: ["Infraestructura", "Corredor Vial", "Ruta 25AT04", "PR PR 35+400 / PR 35+600 / PR 36+040 / PR 26+000 / PR 31+000"]
  },
  {
    id: 126,
    category: "infraestructura",
    title: "Pasos de fauna",
    description: "Barranquilla - Circunvalar de la Prosperidad - Ruta AT04 Los pasos de fauna son estructuras diseñadas para permitir el cruce seguro de animales a través de las vías, ubicadas en zonas de tránsito natural de especies. Su implementación favorece la conservación de la biodiversidad al mantener la conectividad de los ecosistemas, reducir los atropellamientos de fauna y disminuir riesgos para los usuarios de la vía, contribuyendo a un equilibrio entre el desarrollo vial y la protección ambiental.",
    lat: 11.031165,
    lng: -74.844496,
    image: "assets/images/puntos/Pasos de fauna3.webp",
    location: "Barranquilla, Atlántico.",
    hours: "24/7",
    price: "Gratuito.",
    tags: ["Infraestructura", "Corredor Vial", "Ruta 25AT04", "PR PR 35+400 / PR 35+600 / PR 36+040 / PR 26+000 / PR 31+000"]
  },
  {
    id: 127,
    category: "infraestructura",
    title: "Pasos de fauna",
    description: "Barranquilla - Circunvalar de la Prosperidad - Ruta AT04 Los pasos de fauna son estructuras diseñadas para permitir el cruce seguro de animales a través de las vías, ubicadas en zonas de tránsito natural de especies. Su implementación favorece la conservación de la biodiversidad al mantener la conectividad de los ecosistemas, reducir los atropellamientos de fauna y disminuir riesgos para los usuarios de la vía, contribuyendo a un equilibrio entre el desarrollo vial y la protección ambiental.",
    lat: 11.032186,
    lng: -74.840660,
    image: "assets/images/puntos/Pasos de fauna3.webp",
    location: "Barranquilla, Atlántico.",
    hours: "24/7",
    price: "Gratuito.",
    tags: ["Infraestructura", "Corredor Vial", "Ruta 25AT04", "PR PR 35+400 / PR 35+600 / PR 36+040 / PR 26+000 / PR 31+000"]
  },
  {
    id: 128,
    category: "infraestructura",
    title: "Pasos de fauna",
    description: "Barranquilla - Circunvalar de la Prosperidad - Ruta AT04 Los pasos de fauna son estructuras diseñadas para permitir el cruce seguro de animales a través de las vías, ubicadas en zonas de tránsito natural de especies. Su implementación favorece la conservación de la biodiversidad al mantener la conectividad de los ecosistemas, reducir los atropellamientos de fauna y disminuir riesgos para los usuarios de la vía, contribuyendo a un equilibrio entre el desarrollo vial y la protección ambiental.",
    lat: 10.973733,
    lng: -74.892834,
    image: "assets/images/puntos/Pasos de fauna3.webp",
    location: "Barranquilla, Atlántico.",
    hours: "24/7",
    price: "Gratuito.",
    tags: ["Infraestructura", "Corredor Vial", "Ruta 25AT04", "PR PR 35+400 / PR 35+600 / PR 36+040 / PR 26+000 / PR 31+000"]
  },
  {
    id: 129,
    category: "infraestructura",
    title: "Pasos de fauna",
    description: "Barranquilla - Circunvalar de la Prosperidad - Ruta AT04 Los pasos de fauna son estructuras diseñadas para permitir el cruce seguro de animales a través de las vías, ubicadas en zonas de tránsito natural de especies. Su implementación favorece la conservación de la biodiversidad al mantener la conectividad de los ecosistemas, reducir los atropellamientos de fauna y disminuir riesgos para los usuarios de la vía, contribuyendo a un equilibrio entre el desarrollo vial y la protección ambiental.",
    lat: 11.014546,
    lng: -74.876357,
    image: "assets/images/puntos/Pasos de fauna3.webp",
    location: "Barranquilla, Atlántico.",
    hours: "24/7",
    price: "Gratuito.",
    tags: ["Infraestructura", "Corredor Vial", "Ruta 25AT04", "PR PR 35+400 / PR 35+600 / PR 36+040 / PR 26+000 / PR 31+000"]
  },
  {
    id: 92,
    eventMonth: 1,
    startDay: 14,
    endDay: 17,
    category: "eventos",
    title: "Carnaval de Barranquilla",
    description: "Cuatro días que concentran siglos de mezcla cultural africana, indígena y europea en las calles de Barranquilla. Patrimonio Oral e Inmaterial de la Humanidad declarado por la UNESCO, el Carnaval no se visita: se vive. Cada danza, cada disfraz y cada tambor es la expresión colectiva de una identidad que el río y el mar construyeron juntos.",
    lat: 10.9967,
    lng: -74.8181,
    image: "assets/images/puntos/carnaval de barranquilla.webp",
    location: "Barranquilla, Atlántico.",
    hours: "4 días oficiales previos al Miércoles de Ceniza (2026: 14 al 17 de febrero)",
    price: "Gratuito.",
    tags: ["Festividad cultural", "Patrimonio Unesco", "Evento masivo", "Música y danza", "Desfiles y comparsas"]
  },
  {
    id: 93,
    category: "cultura",
    title: "Catedral de Cartagena",
    description: "La catedral más antigua de Colombia en tierra firme concentra en sus muros la historia religiosa y arquitectónica de Cartagena desde el siglo XVI. Cada reforma que resistió y cada daño que acumuló es parte del relato de una ciudad que construyó fe e identidad al mismo tiempo que construía sus murallas.",
    lat: 10.4238769,
    lng: -75.5505382,
    image: "assets/images/puntos/catedral_de_cartagena.webp",
    location: "Cartagena, Bolívar.",
    hours: "7:00 a.m. – 12:00 m. / 3:00 p.m. – 6:00 p.m.",
    price: "Patrimonio religioso / visita cultural",
    tags: []
  },
  {
    id: 94,
    category: "cultura",
    title: "Palacio de la Gobernación",
    description: "Sede del poder departamental de Bolívar y testigo arquitectónico de la vida política de Cartagena. El Palacio de la Gobernación conserva en su fachada y sus patios interiores el estilo colonial que define el centro histórico, siendo parte inseparable del patrimonio urbano que convierte a Cartagena en ciudad de memoria.",
    lat: 10.4238769,
    lng: -75.5505382,
    image: "assets/images/puntos/palacio_de_la_gobernación.webp",
    location: "Cartagena, Bolívar.",
    hours: "8:00 a.m. – 12:00 m. / 2:00 p.m. – 5:00 p.m.",
    price: "Patrimonio arquitectónico / visita institucional",
    tags: []
  },
  {
    id: 95,
    category: "cultura",
    title: "Plaza Bolívar",
    description: "El corazón del centro histórico de Cartagena donde la arquitectura colonial converge con la vida cotidiana de la ciudad. La Plaza Bolívar no es solo un espacio turístico: es el lugar donde la historia pública de Cartagena se escribe desde siempre, con la catedral, el palacio y la estatua del Libertador como testigos permanentes.",
    lat: 10.42325,
    lng: -75.55122222222222,
    image: "",
    location: "Cartagena, Bolívar.",
    hours: "24 horas (espacio abierto)",
    price: "Espacio público / patrimonio histórico",
    tags: []
  },
  {
    id: 96,
    category: "cultura",
    title: "Las Bóvedas",
    description: "Construidas en el siglo XVIII como almacenes militares y luego usadas como calabozos, Las Bóvedas guardan capas de historia colonial entre sus paredes de piedra. Hoy artesanos locales ocupan estos espacios convirtiéndolos en un mercado vivo donde el patrimonio arquitectónico y la economía comunitaria comparten el mismo techo.",
    lat: 10.4286,
    lng: -75.5515,
    image: "assets/images/puntos/las_bóvedas.webp",
    location: "Cartagena, Bolívar.",
    hours: "9:00 a.m. – 6:00 p.m.",
    price: "Patrimonio histórico / artesanías / comercio",
    tags: []
  },
  {
    id: 97,
    category: "cultura",
    title: "Museo del Oro",
    description: "La colección zenú del Museo del Oro de Cartagena revela el dominio técnico y simbólico de los orfebres precolombinos que habitaron la Costa Caribe. Cada pieza de filigrana de oro es evidencia de una civilización que dominó el metal mucho antes de que los europeos llegaran a estas costas con sus propios criterios de valor.",
    lat: 10.4231612,
    lng: -75.5508695,
    image: "assets/images/puntos/museo_del_oro.webp",
    location: "Cartagena, Bolívar.",
    hours: "10:00 a.m. – 5:00 p.m. / Domingo 10:00 a.m. – 1:00 p.m.",
    price: "Museo / cultura / arqueología",
    tags: []
  },
  {
    id: 98,
    category: "cultura",
    title: "Casa del Marqués de Premio Real",
    description: "Una de las casas coloniales mejor conservadas de Cartagena, con balcones de madera y patios interiores que reproducen el modelo arquitectónico que la élite criolla construyó durante el Virreinato. Recorrerla es entender cómo se vivía el poder y la distinción social en la ciudad portuaria más importante del Caribe colonial.",
    lat: 10.4222922,
    lng: -75.5507459,
    image: "assets/images/puntos/casa_del_marqués_de_premio_real.webp",
    location: "Cartagena, Bolívar.",
    hours: "8:00 a.m. – 5:00 p.m.",
    price: "Patrimonio arquitectónico colonial / visita cultural",
    tags: []
  },
  {
    id: 99,
    category: "playas",
    title: "El Laguito",
    description: "Una extensión de mar protegida por la formación natural de Bocagrande que ofrece aguas tranquilas y temperatura constante en Cartagena. El Laguito combina el paisaje del Caribe con la escala íntima de una ensenada urbana donde el baño, el paseo y la contemplación del horizonte coexisten con el perfil de la ciudad.",
    lat: 10.3975509,
    lng: -75.5626241,
    image: "assets/images/puntos/el_laguito.webp",
    location: "Cartagena, Bolívar.",
    hours: "Espacio abierto",
    price: "Playa / sector turístico / recreación",
    tags: []
  },
  {
    id: 100,
    category: "playas",
    title: "Playa Castillo Grande",
    description: "Arena blanca y aguas del Caribe con la silueta de Cartagena de fondo. Castillo Grande ofrece el litoral más accesible de la ciudad histórica, donde el mar llega con temperatura cálida y color turquesa. Un espacio costero donde el entorno natural del Caribe colombiano se vive a pocos metros del centro histórico.",
    lat: 10.3955111,
    lng: -75.5549756,
    image: "assets/images/puntos/playa_castillo_grande.webp",
    location: "Cartagena, Bolívar.",
    hours: "Espacio abierto",
    price: "Playa / recreación / natación",
    tags: []
  },
  {
    id: 101,
    category: "cultura",
    title: "Museo de las Fortificaciones",
    description: "Las murallas y castillos que defendieron a Cartagena de piratas e imperios son hoy el mayor sistema de ingeniería militar colonial del continente. El museo explica cómo se construyó esta defensa y qué significó para la ciudad. Cada piedra coralina es el resultado de una estrategia que mantuvo a Cartagena en pie durante siglos.",
    lat: 10.4307269,
    lng: -75.5458671,
    image: "assets/images/puntos/museo_de_las_fortificaciones.webp",
    location: "Cartagena, Bolívar.",
    hours: "8:00 a.m. – 6:00 p.m.",
    price: "Museo de sitio / patrimonio militar colonial",
    tags: []
  },
  {
    id: 102,
    category: "cultura",
    title: "Museo Romántico",
    description: "Objetos cotidianos, vestidos, cartas y fotografías del siglo XIX y principios del XX que reconstruyen la vida íntima de la élite barranquillera en sus años de mayor esplendor. El Museo Romántico preserva la memoria doméstica de una época en que el comercio del río convirtió a Barranquilla en ciudad cosmopolita.",
    lat: 10.9949113,
    lng: -74.7945569,
    image: "",
    location: "Barranquilla, Atlántico.",
    hours: "9:00 a.m. – 12:00 m. / 2:00 p.m. – 5:30 p.m.",
    price: "Museo histórico / patrimonio cultural urbano",
    tags: []
  },
  {
    id: 103,
    category: "cultura",
    title: "Teatro Amira de la Rosa",
    description: "El teatro más emblemático de Barranquilla lleva el nombre de una escritora caribeña y es el escenario donde la ciudad ha celebrado su vida cultural por décadas. Su arquitectura y su historia lo convierten en patrimonio urbano activo: no es solo un edificio histórico sino un espacio donde la cultura viva sigue encontrando su lugar.",
    lat: 10.9932289,
    lng: -74.7897284,
    image: "assets/images/puntos/teatro_amira_de_la_rosa.webp",
    location: "Barranquilla, Atlántico.",
    hours: "Variable según cartelera",
    price: "Teatro / centro cultural / espectáculos",
    tags: []
  },
  {
    id: 104,
    category: "cultura",
    title: "Catedral Metropolitana María Reina",
    description: "La catedral principal de Barranquilla concentra en su interior la historia religiosa y la identidad espiritual de una ciudad que construyó su fe al mismo ritmo que construyó su vocación comercial. Su arquitectura moderna contrasta con la tradición que alberga, siendo parte inseparable del paisaje urbano del centro barranquillero.",
    lat: 10.9882416,
    lng: -74.7926504,
    image: "",
    location: "Barranquilla, Atlántico.",
    hours: "",
    price: "Patrimonio religioso / visita cultural",
    tags: []
  },
  {
    id: 105,
    category: "cultura",
    title: "Estadio Metropolitano",
    description: "El Estadio Metropolitano Roberto Meléndez no es solo un recinto deportivo: es el corazón de la identidad futbolera de Barranquilla. Con capacidad para más de 50.000 personas, es escenario de la Selección Colombia y del Atlético Junior, siendo parte del imaginario colectivo de una ciudad que vive el fútbol como expresión cultural.",
    lat: 10.9272935,
    lng: -74.8032621,
    image: "assets/images/puntos/estadio_metropolitano.webp",
    location: "Barranquilla, Atlántico.",
    hours: "Variable según evento",
    price: "Estadio / deporte / eventos masivos",
    tags: []
  },
  {
    id: 106,
    category: "cultura",
    title: "Barrio El Prado",
    description: "El primer barrio planificado de Colombia conserva sus calles arboladas, sus casonas de estilo republicano y el ambiente tranquilo de una época en que Barranquilla proyectaba su prosperidad en la arquitectura. Recorrer El Prado es leer la historia de una ciudad que se pensó a sí misma con ambición y elegancia en los años veinte.",
    lat: 10.9982874,
    lng: -74.8008951,
    image: "",
    location: "Barranquilla, Atlántico.",
    hours: "Espacio abierto (recorrido exterior)",
    price: "Patrimonio urbano / arquitectura republicana / turismo cultural",
    tags: []
  },
  {
    id: 107,
    category: "cultura",
    title: "Museo Antropológico y Etnológico",
    description: "Colecciones que abarcan las culturas prehispánicas y las tradiciones étnicas del Caribe colombiano. El museo ofrece una lectura profunda de la diversidad humana que habitó y habita este territorio, con piezas que permiten entender los sistemas simbólicos, los rituales y las formas de vida que precedieron y acompañan la historia oficial.",
    lat: 10.9967659,
    lng: -74.7981077,
    image: "",
    location: "Barranquilla, Atlántico.",
    hours: "8:00 a.m. – 12:00 m. / 2:00 p.m. – 5:00 p.m.",
    price: "Museo universitario / arqueología / etnología",
    tags: []
  },
  {
    id: 108,
    category: "cultura",
    title: "Zoológico de Barranquilla",
    description: "El zoológico más antiguo de Colombia alberga especies de fauna nativa e internacional en un entorno verde dentro de la ciudad. Más que un paseo, es un espacio de educación ambiental donde el contacto con animales silvestres genera conciencia sobre la biodiversidad y la conservación de especies que el desarrollo urbano amenaza.",
    lat: 11.0109951,
    lng: -74.800609,
    image: "",
    location: "Barranquilla, Atlántico.",
    hours: "9:00 a.m. – 5:00 p.m.",
    price: "Zoológico / conservación / educación ambiental",
    tags: []
  },
  {
    id: 109,
    category: "cultura",
    title: "Castillo de Salgar",
    description: "Construido en el siglo XIX sobre la costa atlántica, el Castillo de Salgar es uno de los patrimonios históricos más singulares del departamento. Su arquitectura defensiva frente al mar cuenta la historia de una época en que el litoral del Atlántico era frontera entre el comercio y la inseguridad, entre el orden y lo desconocido.",
    lat: 11.0182381,
    lng: -74.9441948,
    image: "assets/images/puntos/castillo_de_salgar.webp",
    location: "Puerto Colombia, Atlántico.",
    hours: "9:00 a.m. – 6:00 p.m.",
    price: "Centro de eventos / patrimonio histórico / recreación",
    tags: []
  },
  {
    id: 110,
    category: "cultura",
    title: "Biblioteca Piloto del Caribe",
    description: "Centro de la memoria escrita del Caribe colombiano, la Biblioteca Piloto preserva colecciones documentales, archivos históricos y fondos especiales que hacen de este espacio un referente cultural ineludible. Más que repositorio, es un lugar vivo donde la investigación, la lectura y el acceso al conocimiento regional tienen casa propia.",
    lat: 10.9884559,
    lng: -74.7788765,
    image: "",
    location: "Barranquilla, Atlántico.",
    hours: "8:00 a.m. – 8:00 p.m. / Sábados 8:00 a.m. – 4:00 p.m.",
    price: "Biblioteca pública / centro cultural / archivo regional",
    tags: []
  },
  {
    id: 111,
    category: "ecoturismo",
    title: "Parque Isla Salamanca",
    description: "Una franja de tierra entre el mar Caribe y la Ciénaga Grande de Santa Marta que alberga uno de los ecosistemas de manglar más extensos y biodiversos de Colombia. El Parque Isla Salamanca es corredor biológico, refugio de aves migratorias y zona de reproducción de especies que dependen del equilibrio entre el agua salada y la dulce.",
    lat: 11.0487593,
    lng: -74.8151028,
    image: "assets/images/puntos/parque_isla_salamanca.webp",
    location: "Barranquilla, Atlántico.",
    hours: "8:00 a.m. – 4:00 p.m.",
    price: "Parque natural / ecoturismo / avistamiento de fauna",
    tags: []
  },
  {
    id: 112,
    category: "ecoturismo",
    title: "Jardín Botánico",
    description: "Una colección de flora nativa e introducida que convierte un espacio de Barranquilla en laboratorio vivo de la biodiversidad vegetal del Caribe. Los senderos del Jardín Botánico permiten identificar especies, entender sus relaciones ecológicas y apreciar la riqueza de un territorio donde la vegetación tropical es también historia y cultura.",
    lat: 10.9512537,
    lng: -74.7993843,
    image: "assets/images/puntos/jardín_botánico.webp",
    location: "Barranquilla, Atlántico.",
    hours: "9:00 a.m. – 5:00 p.m.",
    price: "Reserva urbana / ecoturismo / educación ambiental",
    tags: []
  },
  {
    id: 113,
    category: "cultura",
    title: "Iglesia San Roque",
    description: "Una de las iglesias más antiguas de Barranquilla, levantada en el barrio de San Roque donde la devoción popular y la arquitectura colonial conviven con la vida del mercado público. La iglesia es testigo de la historia social del centro barranquillero y punto de referencia de la religiosidad popular que define al Caribe urbano.",
    lat: 10.9753664,
    lng: -74.7806259,
    image: "assets/images/puntos/iglesia_san_roque.webp",
    location: "Barranquilla, Atlántico.",
    hours: "",
    price: "Patrimonio religioso / visita cultural",
    tags: []
  },
  {
    id: 114,
    category: "cultura",
    title: "Plaza de la Intendencia Fluvial",
    description: "Un espacio histórico junto al río Magdalena que evoca la época en que Barranquilla era el principal puerto fluvial del país. La Plaza de la Intendencia Fluvial recuerda el tiempo en que el río era la arteria principal del comercio nacional y esta ciudad era la puerta de entrada de la modernidad al interior de Colombia.",
    lat: 10.9861341,
    lng: -74.7780901,
    image: "",
    location: "Barranquilla, Atlántico.",
    hours: "Espacio abierto",
    price: "Patrimonio histórico / espacio público",
    tags: []
  },
  {
    id: 115,
    category: "cultura",
    title: "Museo de Arte Moderno",
    description: "El MAMB es el espacio donde el arte contemporáneo del Caribe colombiano y de América Latina dialoga con el mundo. Su colección permanente y sus exposiciones temporales presentan obras que cuestionan, celebran y reinterpretan la identidad cultural de una región que ha producido artistas de alcance internacional desde sus propias raíces.",
    lat: 11.0036548,
    lng: -74.80776,
    image: "assets/images/puntos/museo_de_arte_moderno.webp",
    location: "Barranquilla, Atlántico.",
    hours: "9:00 a.m. – 1:00 p.m. / 3:00 p.m. – 7:00 p.m.",
    price: "Museo de arte / exposiciones / cultura contemporánea",
    tags: []
  },
  {
    id: 116,
    category: "cultura",
    title: "Estatua del Joe Arroyo",
    description: "Joe Arroyo inmortalizado en bronce en el corazón de Barranquilla. La estatua es el reconocimiento de una ciudad a quien llevó su ritmo al mundo: la salsa, el porro y la fusión caribeña en una voz que se convirtió en patrimonio sonoro. Visitarla es recordar que la cultura popular es también la historia más honesta de un pueblo.",
    lat: 10.9947728,
    lng: -74.8061694,
    image: "assets/images/puntos/estatua_del_joe_arroyo.webp",
    location: "Barranquilla, Atlántico.",
    hours: "Espacio abierto",
    price: "Monumento / patrimonio cultural / espacio público",
    tags: []
  },
  {
    id: 117,
    category: "cultura",
    title: "Museo Mapuka",
    description: "Colecciones arqueológicas, etnográficas y de historia natural que hacen del Museo Mapuka el espacio donde Barranquilla cuenta sus capas más profundas. Desde los vestigios precolombinos hasta las expresiones culturales contemporáneas, el museo traza un recorrido que muestra la complejidad de una ciudad construida sobre múltiples historias.",
    lat: 11.02022,
    lng: -74.8511682,
    image: "assets/images/puntos/museo_mapuka.webp",
    location: "Barranquilla, Atlántico.",
    hours: "8:00 a.m. – 5:00 p.m.",
    price: "Museo arqueológico / pueblos Karib / educación cultural",
    tags: []
  },
  {
    id: 118,
    category: "cultura",
    title: "Plaza Principal de Puerto Colombia",
    description: "El centro de la vida social de Puerto Colombia desde siempre. La plaza principal concentra la arquitectura histórica del municipio, la iglesia, los kioscos y el ritmo cotidiano de un pueblo costero que conserva su escala humana. Un espacio donde la historia del puerto más importante del Atlántico se vive en la conversación diaria.",
    lat: 10.988422,
    lng: -74.9595477,
    image: "",
    location: "Puerto Colombia, Atlántico.",
    hours: "Espacio abierto",
    price: "Espacio público / patrimonio urbano / turismo",
    tags: []
  },
  {
    id: 119,
    category: "cultura",
    title: "Taller del Rey Momo",
    description: "Aquí se fabrican los disfraces, las caretas y los muñecos que dan vida al Carnaval de Barranquilla. El taller del Rey Momo es el espacio donde artesanos populares transforman cartón, tela y pintura en personajes que durante cuatro días son el alma de la fiesta. Un oficio comunitario que el turismo puede visitar, no solo presenciar.",
    lat: 10.8989,
    lng: -74.8838,
    image: "",
    location: "Galapa, Atlántico.",
    hours: "9:00 a.m. – 5:00 p.m. (previa cita)",
    price: "Taller artesanal / turismo cultural / patrimonio del Carnaval",
    tags: []
  },
  {
    id: 120,
    category: "playas",
    title: "Bocas de Cenizas",
    description: "Donde el Magdalena entrega al Caribe el agua que recorrió todo el país. En Bocas de Cenizas el río y el mar se encuentran visiblemente: dos colores, dos temperaturas, dos mundos que se mezclan en un fenómeno geológico e hidrológico único. Un punto de la geografía colombiana donde la escala del territorio se vuelve tangible.",
    lat: 11.1063345,
    lng: -74.8572919,
    image: "",
    location: "Barranquilla, Atlántico.",
    hours: "Espacio natural abierto",
    price: "Atractivo natural / turismo fluvial / observación paisajística",
    tags: []
  },
  {
    id: 121,
    category: "cultura",
    title: "Estatua de Shakira",
    description: "Un homenaje de Barranquilla a su hija más universal. La estatua de Shakira frente al estadio celebra a una artista que llevó el Caribe colombiano al mundo sin dejar de nombrarlo. Para la ciudad, el monumento es también un acto de reconocimiento: la cultura popular barranquillera tiene dimensión global y la ciudad lo sabe.",
    lat: 11.0099574,
    lng: -74.7820282,
    image: "assets/images/puntos/estatua_shakira.png",
    location: "Barranquilla, Atlántico.",
    hours: "Espacio abierto",
    price: "Monumento / patrimonio cultural / espacio público",
    tags: []
  },
  {
    id: 122,
    category: "cultura",
    title: "Castillo de San Felipe",
    description: "La fortaleza militar más grande construida por España en América. El Castillo de San Felipe de Barajas en Cartagena es una obra de ingeniería del siglo XVII diseñada para resistir cualquier ataque. Sus túneles, rampas y bastiones cuentan la historia de un imperio que protegió su joya del Caribe con todo lo que tenía.",
    lat: 10.4220285,
    lng: -75.5421521,
    image: "assets/images/puntos/castillo_de_san_felipe.png",
    location: "Cartagena, Bolívar.",
    hours: "8:00 a.m. – 6:00 p.m.",
    price: "Fortaleza colonial / museo / patrimonio Unesco",
    tags: []
  },
  {
    id: 123,
    category: "cultura",
    title: "Monumento Torre del Reloj",
    description: "La puerta de entrada al centro histórico de Cartagena desde el siglo XVII. La Torre del Reloj marcó durante siglos el límite entre la ciudad amurallada y el mundo exterior. Hoy es el umbral simbólico por donde millones de visitantes ingresan a un patrimonio de la humanidad que comenzó a construirse hace más de cuatro siglos.",
    lat: 10.4228085,
    lng: -75.5495241,
    image: "assets/images/puntos/monumento_torre_del_reloj.png",
    location: "Cartagena, Bolívar.",
    hours: "Espacio abierto (exterior 24h)",
    price: "Monumento histórico / patrimonio / espacio público",
    tags: []
  },
  {
    id: 124,
    category: "cultura",
    title: "Santuario de San Pedro Claver",
    description: "El jesuita que dedicó su vida a los africanos esclavizados que llegaban por el puerto de Cartagena tiene aquí su santuario. San Pedro Claver no es solo un santo colonial: es la memoria de una resistencia moral en medio de una de las épocas más oscuras de la historia americana, preservada en piedra en el corazón de la ciudad.",
    lat: 10.4217512,
    lng: -75.553694,
    image: "assets/images/puntos/santuario_san_pedro_claver.png",
    location: "Cartagena, Bolívar.",
    hours: "",
    price: "Patrimonio religioso / museo / visita cultural",
    tags: []
  },
  {
    id: 125,
    category: "cultura",
    title: "Iglesia de Santo Domingo",
    description: "La iglesia más antigua de Cartagena guarda en sus bóvedas y columnas las marcas del tiempo y de los terremotos que intentaron derribarla. Construida por los dominicos en el siglo XVI, Santo Domingo sobrevivió a todo y hoy preside la plaza más concurrida del centro histórico como testigo inmóvil de cinco siglos de historia caribeña.",
    lat: 10.4243142,
    lng: -75.5529982,
    image: "assets/images/puntos/iglesia_santo_domingo.png",
    location: "Cartagena, Bolívar.",
    hours: "",
    price: "Patrimonio religioso / visita cultural / siglo XVI",
    tags: []
  },
];

const rutasExistentes = [
  {
    id: "RE-002",
    categoria: "Cultural",
    nombre: "Ruta de la Cumbia y las Músicas del Caribe",
    departamentos: "Magdalena, Bolívar, Sucre, Atlántico",
    ubicacion: "El Banco, San Jacinto, Ovejas, Soledad, Barranquilla (entre otros)",
    puntosDestacados: "Festivales musicales, danzas tradicionales, encuentros culturales, cuna de la cumbia y el vallenato",
    tipoTurismo: "Cultural, Patrimonio Inmaterial",
    webRedes: "https://colombiavisible.com/ruta-de-la-cumbia-y-otras-musicas-del-caribe/",
    observaciones: "Ruta temática musical. Identificar fechas de festivales clave y mapear la secuencia lógica del recorrido por temporada.",
    descripcion: "Los tambores marcan el camino. Esta ruta sigue el rastro sonoro de la cumbia desde las orillas del río Magdalena hasta los patios donde nació el porro y la gaita. Festivales que transforman pueblos enteros, danzas que llevan siglos contando lo que las palabras no alcanzan, y comunidades que guardan en su memoria el ritmo fundacional del Caribe.",
    imagen: "assets/images/puntos/Ruta_de_la_Cumbia.webp",
    pointsIds: [13, 31, 43, 49, 50, 62]
  },
  {
    id: "RE-003",
    categoria: "Artesanal",
    nombre: "Ruta Artesanal del Atlántico",
    departamentos: "Atlántico",
    ubicacion: "Galapa, Usiacurú",
    puntosDestacados: "Talleres artesanales, máscaras de carnaval, artesanías en palma de iraca, tradición oral",
    tipoTurismo: "Cultural, Artesanal, Comunitario",
    webRedes: "https://www.visitatlantico.com/ruta23",
    observaciones: "Dos municipios con vocación artesanal consolidada. Verificar si hay operador turístico que integre ambos destinos o si funcionan por separado.",
    descripcion: "Dos pueblos, dos oficios, una misma raíz creadora. En Galapa las manos dan forma a las máscaras que cada año protagonizan el carnaval: animales fantásticos, diablos y figuras que nacen del ingenio colectivo. En Usiacurú la palma de iraca se transforma en hamacas, sombreros y cestería fina, herencia de un saber que pasa de generación en generación entre patios y talleres abiertos al visitante.",
    imagen: "assets/images/puntos/ruta_artesanal_atlantico.webp",
    pointsIds: [14, 16, 40, 46, 47, 52]
  },
  {
    id: "RE-005",
    categoria: "Cultural",
    nombre: "Ruta Cultural del Atlántico",
    departamentos: "Atlántico",
    ubicacion: "Barranquilla y alrededores",
    puntosDestacados: "Carnaval de Barranquilla, museos, patrimonio cultural urbano, gastronomía local",
    tipoTurismo: "Cultural, Patrimonio, Gastronómico",
    webRedes: "https://colombiaartesanal.com.co/rutas/atlantico/",
    observaciones: "Ruta centrada en Barranquilla. Incluye patrimonio UNESCO (Carnaval). Mapear museos, recorridos urbanos y experiencias gastronómicas disponibles.",
    descripcion: "Barranquilla no se entiende sin su carnaval, pero su riqueza cultural va mucho más allá de los cuatro días de fiesta. Museos que guardan la memoria industrial y artística de la ciudad, barrios con arquitectura republicana que resiste el tiempo, y una escena gastronómica donde la butifarra, el arroz de lisa y el bollo limpio cuentan tanto de la identidad local como cualquier monumento. Una ciudad que se vive caminando.",
    imagen: "assets/images/puntos/ruta_cultural_atlantico.webp",
    pointsIds: [6, 9, 19, 20, 21, 22, 31, 42, 45]
  }
];

