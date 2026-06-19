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
    description: "El Volcán del Totumo no es solo un destino; es un ritual de bienestar y una maravilla geológica única en el Caribe. Famoso por sus baños de lodo medicinal, este cono volcánico de aproximadamente 15 metros invita a los visitantes a flotar en una densidad natural que relaja el cuerpo y rejuvenece la piel. Es una experiencia sensorial inigualable, rodeada de la serenidad de la ciénaga y la calidez de la comunidad local.", 
    lat: 10.744444, lng: -75.241389, image: "assets/images/puntos/fotografia-para-la-pagina-vt.webp", 
    location: "Santa Catalina, Bolívar.", hours: "6:00 a.m. - 6:00 p.m.", price: "Adultos: $20.000 mil cop.", 
    tags: ["Relax en la playa", "Experiencias sensoriales", "Comida autóctona"]
  },
  {
    id: 2, category: "playas", title: "Playas de Loma Arena", 
    description: "Estas playas son un secreto guardado para quienes buscan desconexión total. Con sus extensas franjas de arena dorada y un oleaje que invita a la contemplación, Loma Arena es el lugar ideal para disfrutar de puestas de sol cinematográficas. Su ambiente tranquilo lo convierte en un punto estratégico para el turismo de descanso, lejos del bullicio urbano, donde el sonido del mar es el único protagonista.", 
    lat: 10.731697, lng: -75.272444, image: "assets/images/puntos/foto-principal-l.a.webp", 
    location: "Santa Catalina, Bolívar.", hours: "Abierto todo el tiempo.", price: "Gratuito.", 
    tags: ["Relax en la playa", "Deportes náuticos", "Vistas panorámicas"]
  },
  {
    id: 3, category: "playas", title: "Playas de Punta Astilleros", 
    description: "Punta Astilleros es el refugio de carácter rural donde el campo se encuentra con el océano. Sus playas vírgenes y su entorno natural preservado ofrecen una experiencia auténtica de paz. Es el destino predilecto para caminatas ecológicas por la orilla y para aquellos que desean conocer la vida costera en su estado más puro y sencillo, bajo la sombra de palmeras y la brisa constante del Atlántico.", 
    lat: 10.795, lng: -75.224444, image: "assets/images/puntos/foto-principal-pa.webp", 
    location: "Piojó, Atlántico.", hours: "9:00 a.m. - Final del día.", price: "Gratuito.", 
    tags: ["Relax en la playa", "Vistas panorámicas", "Artesanías"]
  },
  {
    id: 4, category: "ecoturismo", title: "Cerro la Vieja", 
    description: "El Cerro La Vieja es la cima del Atlántico, un mirador natural que ofrece una de las panorámicas más espectaculares de la región. Subir a su cumbre es un reto gratificante para los amantes del senderismo y la fotografía, permitiendo observar la línea costera y el relieve ondulado del departamento. Es un lugar cargado de leyendas locales y una biodiversidad que sorprende a cada paso en medio del bosque seco tropical.", 
    lat: 10.733333, lng: -75.104722, image: "assets/images/puntos/foto-principal-l.v.webp", 
    location: "Piojó, Atlántico.", hours: "7:00 a.m. - 6:00 p.m.", price: "Adultos: $8.000 mil cop.", 
    tags: ["Avistamiento de aves", "Vistas panorámicas", "Experiencias sensoriales"]
  },
  {
    id: 5, category: "ecoturismo", title: "Caribe Aventura", 
    description: "Prepárate para vivir la emoción en el parque temático más grande de la región, donde la cultura del Caribe se mezcla con la diversión acuática. Caribe Aventura ofrece réplicas de sitios icónicos y atracciones diseñadas para todas las edades. Es el destino perfecto para familias que buscan adrenalina en los toboganes y piscinas, mientras aprenden sobre la identidad costeña en un entorno seguro y vibrante.", 
    lat: 10.765278, lng: -75.200278, image: "assets/images/puntos/foto-principal-c.a.webp", 
    location: "Piojó, Atlántico.", hours: "9:00 a.m. - 4:30 p.m.", price: "Variable.", 
    tags: ["Experiencias sensoriales", "Deportes náuticos"]
  },
  {
    id: 6, category: "cultura", title: "Muelle de Puerto Colombia", 
    description: "El Muelle de Puerto Colombia es el guardián de la memoria y la puerta histórica por donde entró el progreso al país. Recientemente restaurado, este gigante de concreto invita a caminar sobre el mar y revivir la época en que fue uno de los muelles más largos del mundo. Es un símbolo de resiliencia y un lugar mágico para ver el atardecer, conectando el misticismo del pasado con el futuro turístico del Atlántico.", 
    lat: 10.988333, lng: -74.959444, image: "assets/images/puntos/foto-principal-para-la-pagina-m.p.webp", 
    location: "Puerto Colombia, Atlántico.", hours: "Abierto todo el tiempo.", price: "Gratuito.", 
    tags: ["Vistas panorámicas", "Artesanías", "Comida autóctona"]
  },
  {
    id: 7, category: "gastronomia", title: "Centro gastronómico Muelle 1888", 
    description: "El Muelle 1888 en Puerto Colombia es un espacio ideal que combina la mejor oferta culinaria con una arquitectura que rinde homenaje a la herencia inmigrante. Aquí, los sabores locales e internacionales se encuentran en un ambiente sofisticado y acogedor frente al mar. Es la parada obligatoria para los amantes del buen comer que buscan una experiencia cosmopolita con sabor a Caribe.", 
    lat: 10.989444, lng: -74.958611, image: "assets/images/puntos/foto-principal-m.1888.webp", 
    location: "Puerto Colombia.", hours: "Variable.", price: "Gratuito.", 
    tags: ["Comida autóctona", "Relax en la playa", "Vistas panorámicas"]
  },
  {
    id: 8, category: "cultura", title: "Ventana de Sueños", 
    description: "La Ventana de Sueños, ícono contemporáneo de Puerto Colombia, es un faro de arte y luz que rinde tributo a los inmigrantes. Con su imponente estructura de cristal, se ha convertido en un hito fotográfico que simboliza la esperanza y el dinamismo de la región. Sus colores reflejan el cielo y el mar, creando un espectáculo visual que fascina a residentes y turistas por igual al caer la noche.", 
    lat: 11.001667, lng: -74.952778, image: "assets/images/puntos/foto-principal-para-la-pagina-v.s.webp", 
    location: "Puerto Colombia.", hours: "Abierto.", price: "Gratuito.", 
    tags: ["Vistas panorámicas", "Experiencias sensoriales"]
  },
  {
    id: 9, category: "cultura", title: "Antigua estación del Ferrocarril", 
    description: "Inaugurada originalmente en 1871, esta joya arquitectónica es el testimonio vivo de la era ferroviaria en Colombia. Sus muros conservan las historias de viajeros y mercancías que transformaron la economía nacional. Hoy, restaurada y convertida en centro cultural, permite a los visitantes viajar en el tiempo y apreciar el legado del transporte que unió al Caribe con el interior del país.", 
    lat: 10.988611, lng: -74.959444, image: "assets/images/puntos/foto-principal-para-la-pagina-ef.webp", 
    location: "Puerto Colombia.", hours: "Abierto.", price: "Gratuito.", 
    tags: ["Artesanías", "Experiencias sensoriales"]
  },
  {
    id: 10, category: "playas", title: "Playas de Puerto Colombia", 
    description: "Destacan por el azul del océano y su proximidad a monumentos históricos. Son playas vibrantes, llenas de vida y cultura, donde se puede disfrutar de la gastronomía típica en los quioscos locales mientras se contempla el muelle. Ideales para un día de sol relajado con el toque histórico que solo Puerto Colombia puede ofrecer.", 
    lat: 11.001111, lng: -74.952778, image: "assets/images/puntos/foto-principal-para-la-pagina-p.p.webp", 
    location: "Puerto Colombia.", hours: "7:00 a.m. - 4:00 p.m.", price: "Gratuito.", 
    tags: ["Relax en la playa", "Vistas panorámicas"]
  },
  {
    id: 11, category: "playas", title: "Playa de Santa Verónica", 
    description: "Un oasis que combina la tranquilidad del mar con la calidez local. Famosa por sus restaurantes frente al océano que ofrecen el mejor pescado frito de la zona, Santa Verónica es perfecta para quienes buscan un ambiente familiar y relajado. Sus vientos constantes también la hacen atractiva para quienes desean iniciarse en los deportes de viento en un entorno amigable.", 
    lat: 10.88038, lng: -75.08297, image: "assets/images/puntos/fotografia-para-la-pagina-p.s.webp", 
    location: "Juan de Acosta.", hours: "7:00 a.m. - 9:00 p.m.", price: "Gratuito.", 
    tags: ["Relax en la playa", "Comida autóctona", "Vistas panorámicas"]
  },
  {
    id: 12, category: "nauticos", title: "Salinas del Rey", 
    description: "El referente mundial del Atlántico para el kitesurf. Salinas del Rey es un escenario natural privilegiado donde el viento y las olas dictan el ritmo. Atrae a deportistas de todo el mundo gracias a sus condiciones excepcionales, ofreciendo un espectáculo de velas de colores sobre el mar rosado. Es un punto de encuentro internacional que posiciona al departamento en el mapa del turismo deportivo de élite.", 
    lat: 10.871944, lng: -75.095556, image: "assets/images/puntos/fotografia-para-la-pagina-d.n.webp", 
    location: "Juan de Acosta.", hours: "9:00 a.m. - 6:00 p.m.", price: "Gratuito.", 
    tags: ["Deportes náuticos", "Vistas panorámicas", "Experiencias sensoriales"]
  },
  {
    id: 13, eventMonth: 0, startDay: 30, endDay: 31, category: "cultura", title: "Festival del Millo", 
    description: "Una de las fiestas más emblemáticas del Atlántico que celebra la herencia agrícola del municipio de Juan de Acosta. La música de flauta de millo y los bailes tradicionales se toman las calles, creando un ambiente de alegría contagiosa. Es la oportunidad perfecta para saborear productos derivados de este grano y sumergirse en la esencia del folclor costeño en su estado más genuino.", 
    lat: 10.830311, lng: -75.031867, image: "assets/images/puntos/fotografia-para-la-pagina-f.m.webp", 
    location: "Juan de Acosta.", hours: "Anual.", price: "Gratuito.", 
    tags: ["Comida autóctona", "Artesanías", "Experiencias sensoriales"]
  },
  {
    id: 14, category: "gastronomia", title: "Parador El Sombrero Vueltiao", 
    description: "Inspirado en el emblemático símbolo nacional, este parador es una obra de arte arquitectónica ubicada estratégicamente en la carretera. Más que una parada, es un homenaje a las artesanías de la región donde se puede degustar comida típica y comprar recuerdos auténticos. Su design de sombrero gigante es el fondo perfecto para la foto que certifica tu paso por el corazón del Caribe.", 
    lat: 10.8805, lng: -75.0711, image: "assets/images/puntos/foto-principal-s.v.webp", 
    location: "Juan de Acosta.", hours: "Variable.", price: "Gratuito.", 
    tags: ["Artesanías", "Comida autóctona", "Vistas panorámicas"]
  },
  {
    id: 15, category: "playas", title: "Playa de Puerto Velero", 
    description: "Un destino de paz absoluta y aguas tranquilas gracias a su formación natural de ensenada. Es el lugar predilecto para el aprendizaje de la vela y otros deportes náuticos. Con sus cabañas sobre el agua y restaurantes especializados, ofrece una experiencia de confort y naturaleza ideal para parejas y buscadores de exclusividad en un entorno marítimo protegido.", 
    lat: 10.947222, lng: -75.036944, image: "assets/images/puntos/foto-principal-para-la-pagina-p.v.webp", 
    location: "Tubará.", hours: "8:00 a.m. - 6:00 p.m.", price: "Gratuito.", 
    tags: ["Relax en la playa", "Deportes náuticos", "Comida autóctona"]
  },
  {
    id: 16, category: "cultura", title: "Museo Arqueológico de Galapa", 
    description: "Custodia la memoria ancestral de las culturas que habitaron el territorio antes de la llegada de los españoles. A través de cerámicas y piezas únicas, el museo narra la historia de los Mokaná y otras tribus de la región. Es un espacio de aprendizaje esencial para entender las raíces culturales del Atlántico y valorar el arte precolombino en su máxima expresión.", 
    lat: 10.899722, lng: -74.886111, image: "assets/images/puntos/foto-principal-m.g.webp", 
    location: "Galapa.", hours: "Variable.", price: "Gratuito.", 
    tags: ["Artesanías", "Experiencias sensoriales"]
  },
  {
    id: 17, category: "ecoturismo", title: "Mariposario Butterfly Caribe", 
    description: "Celebra la diversidad y la metamorfosis en este santuario dedicado a las mariposas. Ubicado en medio de la exuberante vegetación de Galapa, permite a los visitantes interactuar con cientos de especies en un jardín controlado que educa sobre la importancia de los polinizadores. Una experiencia mágica y educativa que conecta a niños y adultos con la delicada belleza de la naturaleza tropical.", 
    lat: 10.875833, lng: -74.930833, image: "assets/images/puntos/foto-principal-m.a.webp", 
    location: "Galapa.", hours: "9:30 a.m. - 2:30 p.m.", price: "Adultos: $25.000.", 
    tags: ["Avistamiento de aves", "Experiencias sensoriales"]
  },
  {
    id: 18, category: "ecoturismo", title: "Parque Biotemático Megua", 
    description: "Un aula viva de 32 hectáreas dedicada a la educación ambiental y la conservación. Con senderos ecológicos, granjas interactivas y zonas de preservación, Megua es el pulmón alternativo donde se aprende sobre el cuidado de la tierra mientras se disfruta del aire puro. Ideal para grupos escolares y familias que desean una jornada de inmersión en el campo y contacto directo con animales y plantas nativas.", 
    lat: 10.848611, lng: -74.896667, image: "assets/images/puntos/foto-principal-b.m.webp", 
    location: "Galapa.", hours: "9:00 a.m. - 5:00 p.m.", price: "Adultos: $22.000.", 
    tags: ["Avistamiento de aves", "Experiencias sensoriales", "Vistas panorámicas"]
  },
  {
    id: 19, category: "cultura", title: "Museo Carlos Arturo Valdez", 
    description: "Ubicado en Malambo, preserva el legado de la etnia Mokaná y la historia municipal a través de una colección privada donada a la comunidad. Es un rincón de tesoros históricos donde se pueden apreciar objetos de la vida cotidiana de antaño y vestigios que dan cuenta del desarrollo de esta población a orillas del río, siendo un punto clave para la identidad local.", 
    lat: 10.861667, lng: -74.773611, image: "assets/images/puntos/foto-principal-para-la-pagina-m.a.webp", 
    location: "Malambo.", hours: "8:00 a.m. - 12:00 p.m.", price: "Gratuito.", 
    tags: ["Artesanías", "Experiencias sensoriales"]
  },
  {
    id: 20, category: "cultura", title: "Ventana al Mundo", 
    description: "El ícono moderno de Barranquilla que simboliza la apertura de la ciudad hacia el futuro. Con sus imponentes placas de vidrio multicolor y su diseño audaz, este monumento se ha convertido en el sitio más fotografiado del departamento. Rodeado de zonas verdes y senderos peatonales, es el lugar de encuentro por excelencia para apreciar el urbanismo contemporáneo y el orgullo barranquillero.", 
    lat: 11.0325, lng: -74.831389, image: "assets/images/puntos/foto-principal-para-la-pagina-v.m.webp", 
    location: "Barranquilla.", hours: "Abierto.", price: "Gratuito.", 
    tags: ["Vistas panorámicas", "Experiencias sensoriales"]
  },
  {
    id: 21, category: "cultura", title: "Ventana de Campeones", 
    description: "El monumento 'Aleta de Tiburón' rinde un vibrante homenaje al Junior de Barranquilla y a la pasión deportiva de la ciudad. Ubicado en la rotonda de la Vía 40, su estructura de cristal y acero brilla con los colores del equipo, convirtiéndose en un altar para los hinchas y un símbolo de la identidad festiva y futbolera que caracteriza a la Puerta de Oro de Colombia.", 
    lat: 10.998319, lng: -74.772767, image: "assets/images/puntos/aleta-de-tiburon.webp", 
    location: "Barranquilla.", hours: "Abierto.", price: "Gratuito.", 
    tags: ["Vistas panorámicas", "Experiencias sensoriales"]
  },
  {
    id: 22, category: "cultura", title: "Gran Malecón del Río", 
    description: "El referente de turismo sostenible que devolvió la ciudad al Río Magdalena. Con kilómetros de senderos peatonales, zonas de picnic, gastronomía de alto nivel y espacios culturales, el Malecón es el corazón social de Barranquilla. Aquí se vive la integración familiar y el disfrute del paisaje fluvial, consolidándose como el espacio público más importante y visitado de todo el país en los últimos años.", 
    lat: 11.020017, lng: -74.793225, image: "assets/images/puntos/foto-principal-para-la-pagina-g.m.webp", 
    location: "Barranquilla.", hours: "5:00 a.m - 11:00 p.m.", price: "Gratuito.", 
    tags: ["Vistas panorámicas", "Comida autóctona", "Relax en la playa"]
  },
  {
    id: 23, category: "nauticos", title: "Playas de Puerto Mocho", 
    description: "El destino de playa de Barranquilla que se está transformando en un paraíso de turismo sostenible. Ubicado cerca de la desembocadura de Bocas de Ceniza, Puerto Mocho ofrece el encuentro único entre el río y el mar. Con su nuevo sistema de transporte en tren turístico y zonas de servicios renovadas, promete ser el balneario urbano por excelencia para disfrutar de la brisa marina sin salir de la ciudad.", 
    lat: 11.045556, lng: -74.828889, image: "assets/images/puntos/mocho.webp", 
    location: "Barranquilla.", hours: "Variable.", price: "Gratuito.", 
    tags: ["Relax en la playa", "Vistas panorámicas", "Deportes náuticos"]
  },
  {
    id: 24, category: "ecoturismo", title: "Ecoparque Ciénaga de Mallorquín", 
    description: "Un imponente pulmón verde dedicado a la recuperación ecológica y el avistamiento de aves. Sus pasarelas de madera sobre el agua permiten adentrarse en el ecosistema de manglar sin perturbar la vida silvestre. Es un santuario de biodiversidad que invita a la desconexión urbana y al aprendizaje sobre la importancia de los humedales costeros en la protección ambiental de Barranquilla.", 
    lat: 11.028, lng: -74.778, image: "assets/images/puntos/ecoparque-mallorquin.webp", 
    location: "Barranquilla.", hours: "6:00 a.m - 6:00 p.m.", price: "Gratuito.", 
    tags: ["Avistamiento de aves", "Experiencias sensoriales", "Vistas panorámicas"]
  },
  {
    id: 25, category: "ecoturismo", title: "Salinas de Galerazamba", 
    description: "El famoso 'Mar rosado' de Colombia es un espectáculo visual que ocurre gracias a la alta concentración de sal y una microalga específica. Visitar las salinas es adentrarse en un paisaje surrealista donde el agua adquiere tonalidades intensas de rosa y rojo. Además de su valor fotográfico, es un sitio cargado de historia minera y un motor económico vital para la comunidad de Galerazamba en Santa Catalina.", 
    lat: 10.794167, lng: -75.253333, image: "assets/images/puntos/foto-principal-s.g.webp", 
    location: "Santa Catalina.", hours: "Variable.", price: "Gratuito.", 
    tags: ["Vistas panorámicas", "Experiencias sensoriales"]
  },
  {
    id: 26, category: "playas", title: "Playas del Country", 
    description: "Ofrecen un ambiente relajado y exclusivo muy cerca de las zonas residenciales de Puerto Colombia. Son ideales por sus servicios de alta calidad y su oleaje moderado para practicar deportes náuticos suaves. Es la playa elegida por quienes buscan comodidad, buenos restaurantes y un ambiente social vibrante, perfecta para disfrutar de un día de sol con todas las facilidades a la mano.", 
    lat: 11.001111, lng: -74.952778, image: "assets/images/puntos/foto-principal-para-la-pagina-p.s.webp", 
    location: "Puerto Colombia.", hours: "7:00 a.m. - 4:00 p.m.", price: "Gratuito.", 
    tags: ["Relax en la playa", "Vistas panorámicas"]
  },
  {
    id: 27, category: "playas", title: "Playa de Caño Dulce", 
    description: "Caracterizada por su ambiente sereno e ideal para familias con niños debido a su poca profundidad y olas suaves. Caño Dulce es un refugio de descanso total donde se puede disfrutar de un baño de mar prolongado y saborear la tradicional comida de mar en los restaurantes que bordean la costa. Su entorno natural conservado la hacen una joya escondida para el descanso absoluto.", 
    lat: 10.939722, lng: -75.027778, image: "assets/images/puntos/foto-principal-para-la-pagina-c.d.webp", 
    location: "Tubará.", hours: "8:00 a.m. - 6:00 p.m.", price: "Gratuito.", 
    tags: ["Relax en la playa", "Comida autóctona"]
  },
  {
    id: 28, category: "ecoturismo", title: "Parque Mirador Tubará", 
    description: "Donde la tierra y el cielo se abrazan. Este mirador ubicado en lo más alto de Tubará ofrece una vista de 360 grados que permite ver el Mar Caribe y las montañas circundantes. Sus coloridas esculturas y escalinatas invitan a capturar la esencia de un pueblo de raíces Mokaná. Es el punto ideal para sentir la fuerza del viento y apreciar la majestuosidad geográfica del departamento del Atlántico.", 
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
    description: "La celebración cultural más importante de la ciudad amurallada que conmemora su independencia. Durante una semana, Cartagena se llena de desfiles, comparsas, música folclórica y un ambiente festivo inigualable en cada plaza y callejón. Es el momento donde la identidad africana y caribeña brilla con más fuerza, invitando a propios y turistas a ser parte de una fiesta histórica cargada de color y alegría.", 
    lat: 10.421903, lng: -75.550075, image: "assets/images/puntos/fiestas-novembrinas-de-cartagena.webp", 
    location: "Cartagena.", hours: "Noviembre.", price: "Gratuito.", 
    tags: ["Experiencias sensoriales", "Artesanías", "Comida autóctona"]
  },
  {
    id: 31, category: "cultura", title: "Museo del Carnaval", 
    description: "Una de las infraestructuras culturales más vibrantes de Barranquilla dedicada a preservar el patrimonio oral e inmaterial de la humanidad. El museo ofrece un viaje por la historia, los personajes y el color del Carnaval, exhibiendo los vestidos reales de las reinas y los secretos de las danzas tradicionales. Un espacio donde se vive el carnaval todo el año y se entiende por qué Barranquilla es la capital de la festividad en Colombia.", 
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
    description: "Una experiencia surrealista y divertida donde todo está de cabeza. Ubicada en el municipio de Juan de Acosta, esta construcción desafía la lógica y la gravedad, ofreciendo un entorno perfecto para la fotografía creativa. Es una parada obligatoria para quienes buscan contenido original y momentos de asombro mientras viajan por la carretera, convirtiéndose en un hito de curiosidad y entretenimiento para todas las edades.", 
    lat: 10.834994, lng: -75.141247, image: "assets/images/puntos/la-casa-voltia.webp", 
    location: "Juan de Acosta.", hours: "9:00 am - 6:00 pm", price: "Gratuito.", 
    tags: ["Experiencias sensoriales", "Vistas panorámicas"]
  },
  {
    id: 34, category: "playas", title: "Manzanillo del Mar", 
    description: "Playa serena y auténtica que conserva el encanto de una comunidad de pescadores. Ubicada en la zona norte de Cartagena, ofrece un ambiente más privado y tranquilo que los balnearios tradicionales. Es el lugar perfecto para disfrutar de la comida típica frente al mar, realizar largas caminatas por la costa o simplemente contemplar el horizonte en un entorno de paz absoluta, siendo un modelo de equilibrio entre turismo y vida local.", 
    lat: 10.515992, lng: -75.499278, image: "assets/images/puntos/manzanillo-del-mar.webp", 
    location: "Cartagena.", hours: "Variable.", price: "Gratuito.", 
    tags: ["Relax en la playa", "Deportes náuticos", "Vistas panorámicas"]
  },
  {
    id: 35, category: "infraestructura", title: "Viaducto Gran Manglar", 
    description: "Una obra maestra de ingeniería civil que coexiste en perfecta armonía con el ecosistema de manglar. Este viaducto sobre la Ciénaga de la Virgen ha sido premiado internacionalmente por su respetuoso diseño ambiental, permitiendo el flujo del agua y la vida silvestre por debajo de la carretera. Conducir sobre él es una experiencia única que ofrece vistas panorámicas impresionantes de la ciénaga y el mar, simbolizando el futuro de la infraestructura sostenible.", 
    lat: 10.476022, lng: -75.488756, image: "assets/images/puntos/puente-del-viaducto-el-gran-manglar.webp", 
    location: "Cartagena.", hours: "Abierto.", price: "Gratuito.", 
    tags: ["Vistas panorámicas", "Experiencias sensoriales"]
  },
  {
    id: 36, category: "ecoturismo", title: "Ciénaga de la Virgen", 
    description: "Uno de los tesoros hídricos de Cartagena y un ecosistema estratégico para la biodiversidad local. Hogar de manglares and numerosas especies de aves migratorias, la ciénaga es un destino ideal para el ecoturismo y la observación de aves. Paseos en barca guiados por pescadores locales permiten conocer la importancia de la conservación mientras se disfruta de un paisaje natural que abraza la zona norte de la ciudad.", 
    lat: 10.460533, lng: -75.494847, image: "assets/images/puntos/cienaga-de-la-virgen.webp", 
    location: "Cartagena.", hours: "Abierto.", price: "Gratuito.", 
    tags: ["Avistamiento de aves", "Experiencias sensoriales"]
  },
  {
    id: 37, category: "playas", title: "Playa de la Boquilla", 
    description: "El corazón afrodescendiente de la costa cartagenera donde el mar se disfruta entre manglares y tambores. La Boquilla es famosa por sus recorridos en canoa por los túneles de manglar y su excepcional oferta gastronómica. Es un destino que combina la playa con la cultura viva, invitando a los turistas a participar en talleres de danza o pesca, viviendo una experiencia humana y natural profundamente auténtica.", 
    lat: 10.4621, lng: -75.504458, image: "assets/images/puntos/playa-de-la-boquilla.webp", 
    location: "Cartagena.", hours: "Abierto.", price: "Gratuito.", 
    tags: ["Relax en la playa", "Comida autóctona", "Deportes náuticos"]
  },
  {
    id: 38, eventMonth: 5, startDay: 1, endDay: 3, category: "eventos", title: "Festival Enyúcate", 
    description: "Banquete de tradición que celebra la yuca en todas sus formas en el municipio de Malambo. Este festival reúne a cocineros tradicionales y productores locales en una feria llena de sabores, música de gaita y alegría comunitaria. Es una celebración de la seguridad alimentaria y la cultura campesina, donde probar un tradicional enyucado es conectarse directamente con la tierra y el corazón dulce del Atlántico.", 
    lat: 10.830311, lng: -75.031867, image: "assets/images/puntos/enyucate.webp", 
    location: "Malambo.", hours: "Variable.", price: "Gratuito.", 
    tags: ["Comida autóctona", "Artesanías"]
  },
  {
    id: 39, category: "ecoturismo", title: "Ciénaga del Totumo", 
    description: "Humedal estratégico famoso por colindar con el Volcán del Totumo, ofreciendo un ecosistema de agua dulce ideal para la observación de fauna y flora. Sus aguas reflejan el cielo y los manglares, creando un entorno de paz inmensa. Es el complemento perfecto para el baño de lodo, permitiendo paseos en lancha para apreciar la inmensidad del paisaje hídrico y la vida de los pescadores artesanales que cuidan de este santuario natural.", 
    lat: 10.738397, lng: -75.260689, image: "assets/images/puntos/cienaga-totumo.webp", 
    location: "Santa Catalina.", hours: "Abierto.", price: "Gratuito.", 
    tags: ["Avistamiento de aves", "Vistas panorámicas"]
  },
  {
    id: 40, eventMonth: 1, startDay: 16, endDay: 16, category: "eventos", title: "Festival de la Palma Amarga", 
    description: "El Festival de la Palma Amarga es un tributo vivo al ingenio de las comunidades de Piojó y su armonía con el entorno natural. Celebra el legado de los artesanos y tejedores que transforman la fibra de la palma en piezas únicas y techos que cuentan historias de la cultura. Es una ventana a los saberes ancestrales que han definido la identidad del Caribe. La música de viento y las muestras artesanales invitan a valorar la importancia de preservar nuestras materias primas y los oficios que dan vida al territorio.", 
    lat: 10.75, lng: -75.108, image: "assets/images/puntos/Festival de la Palma Amarga.webp", 
    location: "Piojó, Atlántico.", hours: "El evento dura entre 1 y 3 días.", price: "Gratuito.", 
    tags: ["Turismo cultural","desfiles y comparsas","música y danza","concursos tradicionales","gastronomía","comercio local."]
  },
  {
    id: 41, category: "ecoturismo", title: "Calvaduria Ecoturismo y Camping - Asociación agroecológica Nueva Generación de Piojó", 
    description: "Calvaduría Ecoturismo y Camping invita a descubrir el Atlántico más natural y fresco. En este espacio donde el agroturismo, el camping y los pozos naturales se entrelazan, cada experiencia se convierte en una oportunidad para reconectarse con la tierra y con uno mismo. Entre montañas suaves, aire puro y la hospitalidad rural, este lugar celebra la armonía entre naturaleza y comunidad, recordando que cada visita deja una huella positiva en el entorno.", 
    lat: 10.751, lng: -75.109, image: "assets/images/puntos/Calvaduria Ecoturismo y Camping.webp", 
    location: "Piojó, Atlántico.", hours: "Abierto todo el tiempo.", price: "Pasa día: adultos:$15.000 mil cop. Niños: $7.000 mil cop.", 
    tags: ["Agroturismo","camping","pozos naturales","senderismo","rutas ecológicas","hospedaje."]
  },
  {
    id: 42, category: "cultura", title: "Santuario Mariano Nuestra Señora del Carmen", 
    description: "El Santuario Mariano Nuestra Señora del Carmen es uno de los lugares más representativos de Puerto Colombia y un importante centro de fe en el Atlántico. Reconocido como el único santuario mariano del departamento, abre sus puertas los 365 días del año, ofreciendo a los feligreses un espacio para vivir la sagrada eucaristía y fortalecer su espiritualidad. Su arquitectura conserva un estilo tradicional que refleja la historia y la devoción de la comunidad porteña invita a vivir una experiencia de recogimiento y conexión con la esencia cultural y espiritual del caribe.", 
    lat: 10.988, lng: -74.959, image: "assets/images/puntos/Santuario Mariano Nuestra Señora del Carmen.webp", 
    location: "Puerto Colombia, Atlántico.", hours: "Abierto todo el tiempo.", price: "Gratuito.", 
    tags: ["Religiosos","comunitarios y culturales."]
  },
  {
    id: 43, eventMonth: 0, startDay: 29, endDay: 31, category: "eventos", title: "Sirenato de la cumbia", 
    description: "Desde 1996, Puerto Colombia vibra al compás del Sirenato de la Cumbia. Tambores, flautas y pasos ancestrales elevan este ritmo que define al caribe colombiano. Más que un festival, es la ceremonia viva donde cada generación renueva su pacto con la cumbia, ritmo del alma y memoria de un pueblo.", 
    lat: 10.989, lng: -74.955, image: "assets/images/puntos/Sirenato de la cumbia.webp", 
    location: "Puerto Colombia, Atlántico.", hours: "El evento dura entre 1 y 3 días.", price: "Gratuito.", 
    tags: ["Concurso de reinas en distintas categorías","presentaciones de música y danza de cumbia","desfiles culturales","comparsas y actividades turísticas que promueven el patrimonio del Caribe Colombiano."]
  },
  {
    id: 44, eventMonth: 5, startDay: 1, endDay: 3, category: "eventos", title: "Festival del Mar y del Turismo", 
    description: "Desde 2018, Puerto Colombia celebra su vocación costera con este festival que reúne a los municipios del Atlántico. Desfiles, muestras culturales y la elección de la capitanía de los mares hacen de esta fiesta un himno al mar, al liderazgo femenino y al orgullo del corazón azul del departamento.", 
    lat: 10.987, lng: -74.958, image: "assets/images/puntos/Festival del Mar y del Turismo.webp", 
    location: "Puerto Colombia, Atlántico.", hours: "El evento dura entre 1 y 3 días.", price: "Gratuito.", 
    tags: ["Desfiles","presentaciones culturales","feria gastronómica y actividades recreativas."]
  },
  {
    id: 45, category: "cultura", title: "Parroquia San José de Tubará", 
    description: "La parroquia San José de Tubará es una joya histórica construida en 1833 sobre un antiguo asentamiento indígena Mokaná de la tribu caribe. Su arquitectura colonial y su gran valor cultural la convierten en uno de los principales atractivos del municipio. En 1996 fue declarada patrimonio arquitectónico del Atlántico, destacándose como un símbolo de fe, historia y tradición en la región, donde cada piedra y cada oración conectan pasado y presente en una experiencia que invita a reconocer la herencia viva del territorio.", 
    lat: 10.871, lng: -74.974, image: "assets/images/puntos/Parroquia San José de Tubará.webp", 
    location: "Tubará, Atlántico.", hours: "Horario de eucaristías: fines de semana y festivos en la mañana y en la tarde.", price: "Gratuito.", 
    tags: ["Celebraciones religiosas (misas","bautizos","matrimonios","confirmaciones)","atención espiritual y confesiones","actividades comunitarias y pastorales."]
  },
  {
    id: 46, eventMonth: 1, startDay: 14, endDay: 15, category: "eventos", title: "Festival de la Yuca y el Totumo", 
    description: "El Festival de la Yuca y el Totumo se realiza el domingo de carnaval, con más de 20 años de existencia, inició con los Mokaná en el mirador de Tubará, con la finalidad de mostrar los productos que se cultivan y todas las artesanías que se hacen con el totumo.", 
    lat: 10.872, lng: -74.973, image: "assets/images/puntos/Festival de la Yuca y el Totumo.webp", 
    location: "Tubará, Atlántico.", hours: "", price: "", 
    tags: []
  },
  {
    id: 47, eventMonth: 10, startDay: 21, endDay: 23, category: "eventos", title: "Festival de la Máscara y el Bejuco", 
    description: "Este festival es the principal cita artesanal de Galapa. Reúne a creadores en bejuco, talla en madera y papel maché, convirtiendo la plaza en un escenario de tradición y creatividad. Es un espacio de exhibición y comercialización que preserva la identidad y las raíces culturales del municipio.", 
    lat: 10.899, lng: -74.886, image: "assets/images/puntos/Festival de la Máscara y el Bejuco.webp", 
    location: "Galapa, Atlántico.", hours: "El evento dura entre 1 y 3 días.", price: "Gratuito.", 
    tags: ["Exhibición artesanal (bejuco","talla en madera y papel maché)","venta de artesanías","talleres demostrativos","interacción con artesanos","presentaciones culturales."]
  },
  {
    id: 48, eventMonth: 1, startDay: 14, endDay: 22, category: "eventos", title: "Carnaval de Galapa", 
    description: "El Carnaval de Galapa es una explosión de color, ritmo y memoria ancestral. Entre tambores, comparsas y danzas, el pueblo celebra su identidad con disfraces que narran historias y preservan sus raíces. Cada desfile refleja una tradición viva que resiste en el tiempo e invita a disfrutar la alegría del caribe colombiano.", 
    lat: 10.898, lng: -74.885, image: "assets/images/puntos/Carnaval de Galapa.webp", 
    location: "Galapa, Atlántico.", hours: "El evento dura entre 8 y 10 días.", price: "Gratuito.", 
    tags: ["Desfiles de comparsas y danzas tradicionales","presentaciones folclóricas y musicales","exhibición de disfraces típicos y personajes","venta de artesanías y productos locales","gastronomía típica en puestos y ferias","actividades recreativas y familiares."]
  },
  {
    id: 49, eventMonth: 6, startDay: 17, endDay: 19, category: "eventos", title: "Festival de Decimeros y Bailadores de Cumbia de la Región Caribe", 
    description: "El Festival de Decimeros y Bailadores de Cumbia del Caribe celebra la oralidad y el folclore regional. Es un espacio de transmisión de saberes y salvaguardia patrimonial que reúne a artistas de Magdalena, Córdoba, Sucre y otros departamentos, fortaleciendo la identidad y preservando las raíces culturales del territorio.", 
    lat: 10.862, lng: -74.774, image: "assets/images/puntos/Festival de Decimeros y Bailadores de Cumbia.webp", 
    location: "Malambo, Atlántico.", hours: "El evento dura entre 1 y 3 días.", price: "Gratuito.", 
    tags: []
  },
  {
    id: 50, eventMonth: 6, startDay: 17, endDay: 19, category: "eventos", title: "Festival regional de Bandas Tradicionales", 
    description: "El Festival de Bandas Tradicionales del Caribe, en Malambo, celebra la riqueza musical de la región. Reúne agrupaciones de viento y percusión que interpretan porros, cumbias y fandangos. Más que una competencia, es un espacio de encuentro que fortalece la identidad, el talento local y la preservación del patrimonio musical caribeño.", 
    lat: 10.861, lng: -74.773, image: "assets/images/puntos/Festival regional de Bandas Tradicionales.webp", 
    location: "Malambo, Atlántico.", hours: "El evento dura entre 1 y 3 días.", price: "Gratuito.", 
    tags: []
  },
  {
    id: 51, eventMonth: 6, startDay: 19, endDay: 22, category: "eventos", title: "Fiestas de Santa María Magdalena", 
    description: "Las fiestas patronales de Santa María Magdalena son una de las celebraciones más representativas de Malambo. Durante cuatro días reúnen a la comunidad en torno a la fe y la tradición, con actividades culturales, deportivas y religiosas. Incluyen procesiones, muestras folclóricas y presentaciones artísticas que exaltan la herencia cultural y espiritual del municipio.", 
    lat: 10.86, lng: -74.772, image: "assets/images/puntos/Fiestas de Santa María Magdalena.webp", 
    location: "Malambo, Atlántico.", hours: "El evento dura entre 1 y 3 días.", price: "Gratuito.", 
    tags: ["Ofrece servicios de actividades culturales","eventos religiosos","presentaciones artísticas","ferias gastronómicas","competencias deportivas y espacios de recreación familiar."]
  },
  {
    id: 52, category: "cultura", title: "Parque de La Cultura - Asociación Cultural y Artesanal Raíces de Malambo", 
    description: "El Parque de la Cultura “Fabio Miranda” es un espacio emblemático de Malambo que promueve el desarrollo humano y el fortalecimiento económico del territorio. Este parque rinde homenaje a la tradición alfarera, una práctica ancestral que durante siglos ha sido la base de los intercambios comerciales y el reflejo del legado cultural de los pueblos originarios de la región.", 
    lat: 10.863, lng: -74.775, image: "assets/images/puntos/Parque de La Cultura.webp", 
    location: "Malambo, Atlántico.", hours: "Abierto todo el tiempo.", price: "Gratuito.", 
    tags: ["Zonas verdes","áreas de esparcimiento","juegos para niños."]
  },
  {
    id: 53, category: "ecoturismo", title: "Parque Lineal de Crespo", 
    description: "El Parque Lineal de Crespo es la respuesta de Cartagena al avance del Caribe. Diseñado para frenar la erosión costera y adaptarse al cambio climático, es hoy un corredor verde que reconcilia la ciudad con el mar. Un espacio donde el futuro sostenible camina de la mano de la naturaleza.", 
    lat: 10.439, lng: -75.522, image: "assets/images/puntos/Parque Lineal de Crespo.webp", 
    location: "Cartagena, Bolívar.", hours: "", price: "", 
    tags: []
  },
  {
    id: 54, category: "playas", title: "Playa Marbella", 
    description: "Marbella es el secreto urbano de Cartagena: una franja de arena protegida por espolones que desafían las corrientes del caribe. Sus aguas son refugio para quienes buscan una experiencia auténtica lejos del bullicio. Un rincón donde la ciudad y el mar se encuentran en perfecta armonía.", 
    lat: 10.434, lng: -75.529, image: "assets/images/puntos/Playa Marbella.webp", 
    location: "Cartagena, Bolívar.", hours: "", price: "", 
    tags: []
  },
  {
    id: 55, eventMonth: 10, startDay: 20, endDay: 25, category: "eventos", title: "Fiestas patronales Santa Catalina de Alejandría", 
    description: "Las fiestas de Santa Catalina de Alejandría fusionan fe y folclor en una celebración que convoca a toda la comunidad. Procesiones, bailes, corridas de toros y la elección de la diosa llenan de color las calles. Una vivencia que celebra la identidad y el espíritu festivo del caribe con devoción y alegría.", 
    lat: 10.605, lng: -75.253, image: "assets/images/puntos/Fiestas patronales Santa Catalina de Alejandría.webp", 
    location: "Santa Catalina, Bolívar.", hours: "El evento dura entre 4 y 7 días.", price: "Gratuito.", 
    tags: ["Turismo cultural","gastronomía","música y danzas tradicionales","eventos religiosos","comercio local."]
  },
  {
    id: 56, category: "cultura", title: "Museo Etnoindustrial", 
    description: "El Museo Etnoindustrial de Galerazamba es un espacio que permite comprender la historia de la producción de sal en la región. A través de herramientas antiguas, fotografías y exhibiciones, los visitantes descubren cómo esta actividad marcó la vida social, económica y cultural de la comunidad. Más que un recorrido histórico, es un encuentro auténtico con la memoria y el trabajo de generaciones que han hecho de la sal su identidad, reflejando el valor de las tradiciones locales y la conexión viva entre la gente y su territorio.", 
    lat: 10.794, lng: -75.253, image: "assets/images/puntos/Museo Etnoindustrial.webp", 
    location: "Santa Catalina, Bolívar.", hours: "10:00 a.m. - 4:00 p.m.", price: "Adultos: $7.000 mil cop. Niños (desde 5 años): $5.000 mil cop.", 
    tags: ["Servicios culturales","recorridos guiados","exhibiciones permanentes","actividades pedagógicas y turismo histórico-patrimonial."]
  },
  {
    id: 57, eventMonth: 5, startDay: 10, endDay: 16, category: "eventos", title: "Fiestas patronales de San Antonio de Padua", 
    description: "Las fiestas de San Antonio de Padua convierten a Piojó en epicentro del folclor caribeño. Bandas papayeras, corralejas, peleas de gallos y la vara de premio llenan de música y emoción sus calles. Una celebración que honra la tradición y reúne a visitantes y locales en torno al patrimonio vivo de la región.", 
    lat: 10.749, lng: -75.107, image: "assets/images/puntos/Fiestas patronales de San Antonio de Padua.webp", 
    location: "Piojó, Atlántico.", hours: "El evento dura entre 1 y 3 días.", price: "Gratuito.", 
    tags: ["Turismo cultural","eventos religiosos","deportes","música y danzas tradicionales","espectáculos taurinos","juegos populares","gastronomía","comercio local."]
  },
  {
    id: 58, category: "playas", title: "Tambo Marina Ecohostal", 
    description: "Tambo Marina Ecohostal es un alojamiento ecológico frente al mar, en playa Punta Astillero, Piojó (Atlántico). Entre el sonido de las olas y la brisa cálida, ofrece una experiencia de descanso en contacto con la naturaleza. Tiene hospedaje, restaurante, acceso directo a la playa y actividades como senderismo, pesca y entretenimiento nocturno, este lugar invita a disfrutar del turismo sostenible en un entorno sereno donde la tranquilidad y el mar se encuentran.", 
    lat: 10.795, lng: -75.224, image: "assets/images/puntos/Tambo Marina Ecohostal.webp", 
    location: "Piojó, Atlántico.", hours: "8:00 a.m. - 9:00 p.m.", price: "", 
    tags: ["Hospedaje ecológico","restaurante","acceso directo a la playa","senderismo","entretenimiento nocturno y turismo sostenible."]
  },
  {
    id: 59, eventMonth: 9, startDay: 15, endDay: 17, category: "eventos", title: "Festival Internacional de las Tunas Corazonistas", 
    description: "Las Tunas Corazonistas transforman Puerto Colombia en escenario de guitarras, capas y serenatas bohemias. Países y regiones se encuentran en este festival donde la música estudiantil se convierte en amistad y memoria. Cada nota es un puente entre culturas; cada edición, una celebración que late en el corazón del caribe.", 
    lat: 10.986, lng: -74.957, image: "assets/images/puntos/Festival Internacional de las Tunas Corazonistas.webp", 
    location: "Puerto Colombia, Atlántico.", hours: "El evento dura entre 1 y 3 días.", price: "Gratuito.", 
    tags: ["Presentaciones musicales en vivo","actividades culturales","intercambio artístico internacional","promoción de agrupaciones regionales y entretenimiento para el público."]
  },
  {
    id: 60, category: "cultura", title: "Piedra Pintada. Colectivo Caminantes por El Morro", 
    description: "Piedra Pintada es la memoria viva del pueblo Mokaná. En sus petroglifos hablan los ancestros que habitaron estas montañas de Tubará, resistieron la colonización y dejaron grabado su vínculo sagrado con la tierra. Rodeada de senderos y vegetación exuberante, es un destino para quienes buscan historia, espiritualidad y naturaleza.", 
    lat: 10.87, lng: -74.97, image: "assets/images/puntos/Piedra Pintada.webp", 
    location: "Tubará, Atlántico.", hours: "Abierto todo el tiempo.", price: "Gratuito.", 
    tags: ["Caminatas ecológicas","observación de petroglifos","actividades culturales y espirituales","zonas naturales para descanso."]
  },
  {
    id: 61, eventMonth: 1, startDay: 14, endDay: 22, category: "eventos", title: "Carnaval de Tubará", 
    description: "El Carnaval de Tubará es un abrazo al son de la cumbia. Esta celebración anual convierte las calles del municipio en un río de colores, danzas y tradición que fluye desde las raíces más profundas del Caribe colombiano. Una fiesta que renueva el vínculo entre la comunidad, su historia y la música que la define.", 
    lat: 10.873, lng: -74.975, image: "assets/images/puntos/Carnaval de Tubará.webp", 
    location: "Tubará, Atlántico.", hours: "", price: "", 
    tags: []
  },
  {
    id: 62, eventMonth: 1, startDay: 14, endDay: 22, category: "eventos", title: "Festival intermunicipal del folclore", 
    description: "Galapa se convierte en la capital del folclor caribeño con su Gran parada departamental. Tambores, llamadores y flautas de millo acompañan a comparsas que tiñen las calles de color y movement. Un encuentro que celebra la riqueza cultural del Atlántico y eleva la tradición como motor del orgullo regional.", 
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
    lat: 11.030949,
    lng: -74.877209,
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
    lng: -74.858057,
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
    id: 92,
    eventMonth: 1,
    startDay: 14,
    endDay: 17,
    category: "eventos",
    title: "Carnaval de Barranquilla",
    description: "Declarado Patrimonio Oral e Inmaterial de la Humanidad por la Unesco, el Carnaval de Barranquilla es la fiesta más grande del Caribe colombiano. Cuatro días de desfiles, comparsas, música y color que celebran las raíces africanas, indígenas y europeas de esta costa. Una experiencia que desborda las calles cada febrero.",
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
    description: "Desde el corazón de la ciudad amurallada, la Catedral de Cartagena eleva su fachada colonial hacia el cielo caribeño. Piedras que acumulan siglos de historia, fe y mestizaje. Un lugar donde el tiempo se detiene y la arquitectura habla de todo lo que este territorio ha vivido y resistido.",
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
    description: "En el corazón histórico de Cartagena, el Palacio de la Gobernación es testigo mudo de siglos de poder, transformación y vida pública. Su arquitectura colonial guarda la memoria del Caribe y del Departamento de Bolívar. Una pieza esencial para entender la historia política y urbana de esta costa.",
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
    description: "El corazón abierto del centro histórico de Cartagena. Desde aquí se irradian las calles coloniales, los balcones floridos y las cúpulas que definen la ciudad amurallada. La Plaza Bolívar es el punto de encuentro donde la historia, la vida cotidiana y el turismo convergen bajo el sol caribeño.",
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
    description: "Construidas como fortaleza militar, las 23 bóvedas coloniales de Cartagena guardan hoy el espíritu artesanal del Caribe. Arcos de piedra que alguna vez resguardaron pólvora y soldados, ahora albergan colores, tejidos y memorias. Un paseo entre la historia y el presente vibrante de la ciudad amurallada.",
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
    description: "Frente al Parque Bolívar, el Museo del Oro custodia el brillo de civilizaciones que habitaron estas tierras mucho antes de la Colonia. Piezas en oro de culturas nativas que revelan la complejidad y riqueza del mundo precolombino. Un diálogo silencioso entre el pasado profundo y el presente caribeño.",
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
    description: "En la Plaza de la Aduana, esta casona colonial es una de las construcciones mejor conservadas de Cartagena. Sus paredes gruesas y patios frescos cuentan historias del poder y el comercio en el Nuevo Mundo. Recorrerla es adentrarse en la arquitectura y las tensiones de la época colonial en el Caribe.",
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
    description: "Donde los edificios modernos se miran en el agua, El Laguito es el perfil contemporáneo de Cartagena. Un sector que contrasta con la ciudad amurallada y muestra su vocación cosmopolita. Frente a la bahía, entre brisa marina y horizonte abierto, es el espacio donde la ciudad mira hacia el futuro.",
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
    description: "Aguas quietas que bañan la bahía de Cartagena con una calma que invita al nado y al reposo. Playa Castillo Grande es el lugar donde el ritmo se ralentiza y el Caribe muestra su cara más serena. Ideal para quienes buscan la experiencia auténtica del mar sin las corrientes abiertas del océano.",
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
    description: "Dentro de las mismas murallas que alguna vez defendieron a Cartagena de piratas e imperios, este museo de sitio reconstruye la epopeya de una obra colosal. Siglos de ingeniería militar, sudor y estrategia en piedra coralina. El relato vivo de cómo una ciudad aprendió a sobrevivir frente al mar y la historia.",
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
    description: "En un edificio republicano del siglo XIX, el Museo Romántico preserva el alma íntima de Barranquilla. Cartas de amor, muebles, fotografías y objetos de una época en que la ciudad costera soñaba con ser metrópoli. Un lugar para entender la sensibilidad y la memoria de quienes construyeron este Caribe urbano.",
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
    description: "El escenario más vivo de Barranquilla. El Teatro Amira de la Rosa ha albergado teatro, música, danza y pensamiento durante décadas. Sus butacas han visto nacer y crecer la cultura caribeña contemporánea. Asistir a una función aquí es participar de la conversación más larga y rica que esta ciudad tiene consigo misma.",
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
    description: "Modernismo y fe caribeña se fusionan en este templo de líneas depuradas que se alza en el corazón de Barranquilla. La imagen del Cristo Libertador Latinoamericano convoca la espiritualidad de un continente. Un espacio de encuentro donde la arquitectura del siglo XX dialoga con siglos de devoción popular.",
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
    description: "Sesenta mil voces que vibran como un solo ser. El Estadio Metropolitano Roberto Meléndez es mucho más que un escenario deportivo: es el latido colectivo de Barranquilla, el espacio donde Junior y la Selección Colombia despiertan la pasión de todo el Caribe. Sentirlo desde adentro es sentir la ciudad entera.",
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
    description: "Barranquilla guardó sus sueños de modernidad en El Prado. Mansiones de los años veinte, buganviles desbordadas, el Hotel Del Prado como centinela de otra época. Un barrio que es archivo vivo de la prosperidad caribeña y del cosmopolitismo que moldeó la ciudad portuaria más dinámica del norte de Colombia.",
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
    description: "Las culturas precolombinas del norte de Colombia encontraron su casa en este imponente edificio de Barranquilla. Piezas Quimbaya, San Agustín, Tierradentro y Tubará en un mismo recinto. Un viaje a las raíces profundas del Caribe colombiano, donde la cerámica y el oro narran lo que los documentos no pudieron guardar.",
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
    description: "Un encuentro con la fauna del mundo en el corazón del Caribe colombiano. El Zoológico de Barranquilla es también guardián de especies de la biodiversidad nacional, un espacio donde la ciudad y la naturaleza viva se miran de frente. Ideal para conectar con la riqueza natural que rodea este corredor costero.",
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
    description: "Sobre la costa atlántica, el Castillo de Salgar combina historia y naturaleza en un entorno privilegiado. Vestigio colonial convertido en espacio de cultura y recreación familiar, guarda el espíritu de Puerto Colombia como pueblo que se reinventa sin perder su memoria. El mar, siempre presente, completa el paisaje.",
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
    description: "En el Complejo Cultural de la Antigua Aduana, la Biblioteca Piloto del Caribe custodia la memoria escrita de una región. Libros, archivos y colecciones que cuentan el Caribe colombiano desde adentro. Un espacio donde el conocimiento se abre al público y la cultura encuentra su lugar en medio del bullicio urbano de Barranquilla.",
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
    description: "Donde el río Magdalena entrega sus aguas al Mar Caribe nace uno de los ecosistemas más ricos de Colombia. El Parque Isla Salamanca es el encuentro de lo dulce y lo salado, de manglares, aves migratorias y biodiversidad desbordante. Un umbral natural que recuerda que este corredor costero está vivo mucho más allá del asfalto.",
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
    description: "En medio de Barranquilla, esta reserva urbana es travesada por manantiales que desafían la ciudad de cemento. El Jardín Botánico es un pulmón verde donde la naturaleza costera resiste y prospera. Un espacio para reconectar con la biodiversidad caribeña a pocos minutos del centro, sin salir de la ciudad.",
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
    description: "El estilo neogótico de la Iglesia San Roque contrasta con el trópico que la rodea y la hace aún más singular. Patrono popular de Barranquilla, San Roque convoca devoción y comunidad en este templo que es también patrimonio arquitectónico. Una parada para entender la fe cotidiana que atraviesa la cultura caribeña.",
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
    description: "Aquí llegaban y partían los vapores que conectaban el interior del país con el Caribe. La Plaza de la Intendencia Fluvial fue el nervio del comercio fluvial por el Magdalena, eje de una ciudad que creció mirando al río. Su historia es la historia de Barranquilla como puerta entre dos mundos.",
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
    description: "El Museo de Arte Moderno de Barranquilla es el espacio donde el Caribe colombiano dialoga con las corrientes del arte contemporáneo nacional e internacional. Exposiciones, biblioteca y auditorio configuran un centro cultural vivo. Un lugar donde la ciudad se piensa a sí misma a través de las obras de sus artistas.",
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
    description: "En el parque de los Músicos, la figura del Joe Arroyo detiene el tiempo en Barranquilla. El más universal de los salseros caribeños, cuya voz contó la historia de Africa, Colombia y el mar en el mismo ritmo. Su estatua es punto de peregrinaje para quienes saben que la música de esta ciudad cambia el mundo.",
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
    description: "MAPUKA, el Museo Arqueológico de los Pueblos Karib, recupera y celebra las identidades del Caribe colombiano. Colecciones que reconstruyen el universo espiritual y material de los pueblos que habitaron esta costa antes y después de la conquista. Un espacio de memoria viva, necesario para entender de dónde venimos.",
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
    description: "La plaza de Puerto Colombia es el lugar donde el pueblo se encuentra con su propia historia. Frente al mar que alguna vez hizo de este municipio el puerto más importante de Colombia, la plaza guarda la calma y el orgullo de un territorio que sabe lo que fue y lo que todavía puede ser.",
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
    description: "En Galapa, las manos de José Llanos tallan en madera la esencia del Carnaval. El Taller del Rey Momo es el lugar donde nacen las máscaras que representan la festividad y el humor caribeño en su expresión más auténtica. Una visita aquí es acercarse al origen artesanal de la fiesta más grande de Colombia.",
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
    description: "El río más largo de Colombia entrega sus aguas al Caribe en Bocas de Cenizas. Ese encuentro entre el Magdalena y el mar es uno de los fenómenos naturales más imponentes del litoral norte. Un territorio de transición, de mezcla de corrientes y de biodiversidad, donde el agua dulce y salada escriben juntas el paisaje.",
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
    description: "Barranquilla le rinde homenaje a su hija más universal en el Paseo Bolívar. La estatua de Shakira celebra a la artista que llevó el nombre de esta ciudad y del Caribe colombiano a todos los escenarios del mundo. Un símbolo de identidad y orgullo que convoca a locales y visitantes en el corazón de la ciudad.",
    lat: 11.0099574,
    lng: -74.7820282,
    image: "",
    location: "Barranquilla, Atlántico.",
    hours: "Espacio abierto",
    price: "Monumento / patrimonio cultural / espacio público",
    tags: []
  },
  {
    id: 122,
    category: "cultura",
    title: "Castillo de San Felipe",
    description: "El Castillo San Felipe de Barajas es la cima de la ingeniería militar española en América. Construido sobre el cerro de San Lázaro, sus túneles y bastiones protegieron a Cartagena de Indias durante siglos. Recorrerlo es entender la obsesión de un imperio por defender la ciudad más codiciada del Nuevo Mundo.",
    lat: 10.4220285,
    lng: -75.5421521,
    image: "",
    location: "Cartagena, Bolívar.",
    hours: "8:00 a.m. – 6:00 p.m.",
    price: "Fortaleza colonial / museo / patrimonio Unesco",
    tags: []
  },
  {
    id: 123,
    category: "cultura",
    title: "Monumento Torre del Reloj",
    description: "La Torre del Reloj es la puerta de entrada al alma de Cartagena. Por aquí cruzaron conquistadores, esclavos, comerciantes y viajeros que definieron el destino de esta ciudad amurallada. Hoy, su arco colonial da la bienvenida a quienes llegan a descubrir el Caribe más histórico y vivo de Colombia.",
    lat: 10.4228085,
    lng: -75.5495241,
    image: "",
    location: "Cartagena, Bolívar.",
    hours: "Espacio abierto (exterior 24h)",
    price: "Monumento histórico / patrimonio / espacio público",
    tags: []
  },
  {
    id: 124,
    category: "cultura",
    title: "Santuario de San Pedro Claver",
    description: "El Santuario de San Pedro Claver honra al jesuita que dedicó su vida a los africanos esclavizados en Cartagena de Indias. Su claustro colonial y su iglesia guardan la memoria de una de las historias más profundas del Caribe: la de quienes resistieron y sobrevivieron en esta costa para siempre dar forma a su cultura.",
    lat: 10.4217512,
    lng: -75.553694,
    image: "",
    location: "Cartagena, Bolívar.",
    hours: "",
    price: "Patrimonio religioso / museo / visita cultural",
    tags: []
  },
  {
    id: 125,
    category: "cultura",
    title: "Iglesia de Santo Domingo",
    description: "Desde el siglo XVI, la Iglesia de Santo Domingo es testigo del paso del tiempo en Cartagena. Una de las más antiguas del país, su plaza alberga hoy la vida cotidiana de la ciudad: vendedores, turistas y cartageneros conviviendo a la sombra de piedras que acumulan cinco siglos de historia caribeña.",
    lat: 10.4243142,
    lng: -75.5529982,
    image: "",
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

