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
  { id: "todas", label: "Ver Todos", icon: "📍", color: "bg-slate-800" },
    { id: "playas", label: "Playas y Costas", icon: "🏖️", color: "bg-cyan-500" },
  { id: "ecoturismo", label: "Parques y Reservas", icon: "🏞️", color: "bg-green-600" },
  { id: "eventos", label: "Festivales y Eventos", icon: "🎉", color: "bg-fuchsia-500" },
  { id: "cultura", label: "Cultura, artes y patrimonio", icon: "🏛️", color: "bg-purple-500" },
  { id: "nauticos", label: "Deportes Náuticos", icon: "🌊", color: "bg-sky-500" },
  { id: "gastronomia", label: "Placeres Gastronómicos", icon: "🥘", color: "bg-orange-500" },
  { id: "infraestructura", label: "Infraestructura del Corredor Vial", icon: "🛣️", color: "bg-blue-600" },
  { id: "otros", label: "Aeropuertos", icon: "✈️", color: "bg-indigo-400" }
];

const mockData = [
  {
    id: 1, category: "ecoturismo", title: "Volcán del Totumo.", 
    description: "El Volcán del Totumo no es solo un destino; es un ritual de bienestar y una maravilla geológica única en el Caribe. Famoso por sus baños de lodo medicinal, este cono volcánico de aproximadamente 15 metros invita a los visitantes a flotar en una densidad natural que relaja el cuerpo y rejuvenece la piel. Es una experiencia sensorial inigualable, rodeada de la serenidad de la ciénaga y la calidez de la comunidad local.", 
    lat: 10.744444, lng: -75.241389, image: "assets/images/puntos/fotografia-para-la-pagina-vt.webp", 
    location: "Santa Catalina., Bolivar.", hours: "6:00 a.m. - 6:00 p.m.", price: "Adultos: $20.000 mil cop.", 
    tags: ["Relax en la playa", "Experiencias sensoriales", "Comida autóctona"]
  },
  {
    id: 2, category: "playas", title: "Playas de Loma Arena.", 
    description: "Estas playas son un secreto guardado para quienes buscan desconexión total. Con sus extensas franjas de arena dorada y un oleaje que invita a la contemplación, Loma Arena es el lugar ideal para disfrutar de puestas de sol cinematográficas. Su ambiente tranquilo lo convierte en un punto estratégico para el turismo de descanso, lejos del bullicio urbano, donde el sonido del mar es el único protagonista.", 
    lat: 10.731697, lng: -75.272444, image: "assets/images/puntos/foto-principal-l.a.webp", 
    location: "Santa Catalina., Bolivar.", hours: "Abierto todo el tiempo.", price: "Gratuito.", 
    tags: ["Relax en la playa", "Deportes náuticos", "Vistas panorámicas"]
  },
  {
    id: 3, category: "playas", title: "Playas de Punta Astilleros.", 
    description: "Punta Astilleros es el refugio de carácter rural donde el campo se encuentra con el océano. Sus playas vírgenes y su entorno natural preservado ofrecen una experiencia auténtica de paz. Es el destino predilecto para caminatas ecológicas por la orilla y para aquellos que desean conocer la vida costera en su estado más puro y sencillo, bajo la sombra de palmeras y la brisa constante del Atlántico.", 
    lat: 10.795, lng: -75.224444, image: "assets/images/puntos/foto-principal-pa.webp", 
    location: "Piojó., Atlántico.", hours: "9:00 a.m. - Final del día.", price: "Gratuito.", 
    tags: ["Relax en la playa", "Vistas panorámicas", "Artesanías"]
  },
  {
    id: 4, category: "ecoturismo", title: "Cerro la Vieja.", 
    description: "El Cerro La Vieja es la cima del Atlántico, un mirador natural que ofrece una de las panorámicas más espectaculares de la región. Subir a su cumbre es un reto gratificante para los amantes del senderismo y la fotografía, permitiendo observar la línea costera y el relieve ondulado del departamento. Es un lugar cargado de leyendas locales y una biodiversidad que sorprende a cada paso en medio del bosque seco tropical.", 
    lat: 10.733333, lng: -75.104722, image: "assets/images/puntos/foto-principal-l.v.webp", 
    location: "Piojó., Atlántico.", hours: "7:00 a.m. - 6:00 p.m.", price: "Adultos: $8.000 mil cop.", 
    tags: ["Avistamiento de aves", "Vistas panorámicas", "Experiencias sensoriales"]
  },
  {
    id: 5, category: "ecoturismo", title: "Caribe Aventura.", 
    description: "Prepárate para vivir la emoción en el parque temático más grande de la región, donde la cultura del Caribe se mezcla con la diversión acuática. Caribe Aventura ofrece réplicas de sitios icónicos y atracciones diseñadas para todas las edades. Es el destino perfecto para familias que buscan adrenalina en los toboganes y piscinas, mientras aprenden sobre la identidad costeña en un entorno seguro y vibrante.", 
    lat: 10.765278, lng: -75.200278, image: "assets/images/puntos/foto-principal-c.a.webp", 
    location: "Piojó., Atlántico.", hours: "9:00 a.m. - 4:30 p.m.", price: "Variable.", 
    tags: ["Experiencias sensoriales", "Deportes náuticos"]
  },
  {
    id: 6, category: "cultura", title: "Muelle de Puerto Colombia.", 
    description: "El Muelle de Puerto Colombia es el guardián de la memoria y la puerta histórica por donde entró el progreso al país. Recientemente restaurado, este gigante de concreto invita a caminar sobre el mar y revivir la época en que fue uno de los muelles más largos del mundo. Es un símbolo de resiliencia y un lugar mágico para ver el atardecer, conectando el misticismo del pasado con el futuro turístico del Atlántico.", 
    lat: 10.988333, lng: -74.959444, image: "assets/images/puntos/foto-principal-para-la-pagina-m.p.webp", 
    location: "Puerto Colombia., Atlántico.", hours: "Abierto todo el tiempo.", price: "Gratuito.", 
    tags: ["Vistas panorámicas", "Artesanías", "Comida autóctona"]
  },
  {
    id: 7, category: "gastronomia", title: "Centro gastronómico Muelle 1888.", 
    description: "El Muelle 1888 en Puerto Colombia es un espacio ideal que combina la mejor oferta culinaria con una arquitectura que rinde homenaje a la herencia inmigrante. Aquí, los sabores locales e internacionales se encuentran en un ambiente sofisticado y acogedor frente al mar. Es la parada obligatoria para los amantes del buen comer que buscan una experiencia cosmopolita con sabor a Caribe.", 
    lat: 10.989444, lng: -74.958611, image: "assets/images/puntos/foto-principal-m.1888.webp", 
    location: "Puerto Colombia.", hours: "Variable.", price: "Gratuito.", 
    tags: ["Comida autóctona", "Relax en la playa", "Vistas panorámicas"]
  },
  {
    id: 8, category: "cultura", title: "Ventana de Sueños.", 
    description: "La Ventana de Sueños, ícono contemporáneo de Puerto Colombia, es un faro de arte y luz que rinde tributo a los inmigrantes. Con su imponente estructura de cristal, se ha convertido en un hito fotográfico que simboliza la esperanza y el dinamismo de la región. Sus colores reflejan el cielo y el mar, creando un espectáculo visual que fascina a residentes y turistas por igual al caer la noche.", 
    lat: 11.001667, lng: -74.952778, image: "assets/images/puntos/foto-principal-para-la-pagina-v.s.webp", 
    location: "Puerto Colombia.", hours: "Abierto.", price: "Gratuito.", 
    tags: ["Vistas panorámicas", "Experiencias sensoriales"]
  },
  {
    id: 9, category: "cultura", title: "Antigua estación del Ferrocarril.", 
    description: "Inaugurada originalmente en 1871, esta joya arquitectónica es el testimonio vivo de la era ferroviaria en Colombia. Sus muros conservan las historias de viajeros y mercancías que transformaron la economía nacional. Hoy, restaurada y convertida en centro cultural, permite a los visitantes viajar en el tiempo y apreciar el legado del transporte que unió al Caribe con el interior del país.", 
    lat: 10.988611, lng: -74.959444, image: "assets/images/puntos/foto-principal-para-la-pagina-ef.webp", 
    location: "Puerto Colombia.", hours: "Abierto.", price: "Gratuito.", 
    tags: ["Artesanías", "Experiencias sensoriales"]
  },
  {
    id: 10, category: "playas", title: "Playas de Puerto Colombia.", 
    description: "Destacan por el azul del océano y su proximidad a monumentos históricos. Son playas vibrantes, llenas de vida y cultura, donde se puede disfrutar de la gastronomía típica en los quioscos locales mientras se contempla el muelle. Ideales para un día de sol relajado con el toque histórico que solo Puerto Colombia puede ofrecer.", 
    lat: 11.001111, lng: -74.952778, image: "assets/images/puntos/foto-principal-para-la-pagina-p.p.webp", 
    location: "Puerto Colombia.", hours: "7:00 a.m. - 4:00 p.m.", price: "Gratuito.", 
    tags: ["Relax en la playa", "Vistas panorámicas"]
  },
  {
    id: 11, category: "playas", title: "Playa de Santa Verónica.", 
    description: "Un oasis que combina la tranquilidad del mar con la calidez local. Famosa por sus restaurantes frente al océano que ofrecen el mejor pescado frito de la zona, Santa Verónica es perfecta para quienes buscan un ambiente familiar y relajado. Sus vientos constantes también la hacen atractiva para quienes desean iniciarse en los deportes de viento en un entorno amigable.", 
    lat: 10.88038, lng: -75.08297, image: "assets/images/puntos/fotografia-para-la-pagina-p.s.webp", 
    location: "Juan de Acosta.", hours: "7:00 a.m. - 9:00 p.m.", price: "Gratuito.", 
    tags: ["Relax en la playa", "Comida autóctona", "Vistas panorámicas"]
  },
  {
    id: 12, category: "nauticos", title: "Salinas del Rey.", 
    description: "El referente mundial del Atlántico para el kitesurf. Salinas del Rey es un escenario natural privilegiado donde el viento y las olas dictan el ritmo. Atrae a deportistas de todo el mundo gracias a sus condiciones excepcionales, ofreciendo un espectáculo de velas de colores sobre el mar rosado. Es un punto de encuentro internacional que posiciona al departamento en el mapa del turismo deportivo de élite.", 
    lat: 10.871944, lng: -75.095556, image: "assets/images/puntos/fotografia-para-la-pagina-d.n.webp", 
    location: "Juan de Acosta.", hours: "9:00 a.m. - 6:00 p.m.", price: "Gratuito.", 
    tags: ["Deportes náuticos", "Vistas panorámicas", "Experiencias sensoriales"]
  },
  {
    id: 13, category: "cultura", title: "Festival del Millo.", 
    description: "Una de las fiestas más emblemáticas del Atlántico que celebra la herencia agrícola del municipio de Juan de Acosta. La música de flauta de millo y los bailes tradicionales se toman las calles, creando un ambiente de alegría contagiosa. Es la oportunidad perfecta para saborear productos derivados de este grano y sumergirse en la esencia del folclor costeño en su estado más genuino.", 
    lat: 10.830311, lng: -75.031867, image: "assets/images/puntos/fotografia-para-la-pagina-f.m.webp", 
    location: "Juan de Acosta.", hours: "Anual.", price: "Gratuito.", 
    tags: ["Comida autóctona", "Artesanías", "Experiencias sensoriales"]
  },
  {
    id: 14, category: "gastronomia", title: "Parador El Sombrero Vueltiao.", 
    description: "Inspirado en el emblemático símbolo nacional, este parador es una obra de arte arquitectónica ubicada estratégicamente en la carretera. Más que una parada, es un homenaje a las artesanías de la región donde se puede degustar comida típica y comprar recuerdos auténticos. Su diseño gigante en forma de sombrero es el fondo perfecto para la foto que certifica tu paso por el corazón del Caribe.", 
    lat: 10.8805, lng: -75.0711, image: "assets/images/puntos/foto-principal-s.v.webp", 
    location: "Juan de Acosta.", hours: "Variable.", price: "Gratuito.", 
    tags: ["Artesanías", "Comida autóctona", "Vistas panorámicas"]
  },
  {
    id: 15, category: "playas", title: "Playa de Puerto Velero.", 
    description: "Un destino de paz absoluta y aguas tranquilas gracias a su formación natural de ensenada. Es el lugar predilecto para el aprendizaje de la vela y otros deportes náuticos. Con sus cabañas sobre el agua y restaurantes especializados, ofrece una experiencia de confort y naturaleza ideal para parejas y buscadores de exclusividad en un entorno marítimo protegido.", 
    lat: 10.947222, lng: -75.036944, image: "assets/images/puntos/foto-principal-para-la-pagina-p.v.webp", 
    location: "Tubará.", hours: "8:00 a.m. - 6:00 p.m.", price: "Gratuito.", 
    tags: ["Relax en la playa", "Deportes náuticos", "Comida autóctona"]
  },
  {
    id: 16, category: "cultura", title: "Museo Arqueológico de Galapa.", 
    description: "Custodia la memoria ancestral de las culturas que habitaron el territorio antes de la llegada de los españoles. A través de cerámicas y piezas únicas, el museo narra la historia de los Mokaná y otras tribus de la región. Es un espacio de aprendizaje esencial para entender las raíces culturales del Atlántico y valorar el arte precolombino en su máxima expresión.", 
    lat: 10.899722, lng: -74.886111, image: "assets/images/puntos/foto-principal-m.g.webp", 
    location: "Galapa.", hours: "Variable.", price: "Gratuito.", 
    tags: ["Artesanías", "Experiencias sensoriales"]
  },
  {
    id: 17, category: "ecoturismo", title: "Mariposario Butterfly Caribe.", 
    description: "Celebra la diversidad y la metamorfosis en este santuario dedicado a las mariposas. Ubicado en medio de la exuberante vegetación de Galapa, permite a los visitantes interactuar con cientos de especies en un jardín controlado que educa sobre la importancia de los polinizadores. Una experiencia mágica y educativa que conecta a niños y adultos con la delicada belleza de la naturaleza tropical.", 
    lat: 10.875833, lng: -74.930833, image: "assets/images/puntos/foto-principal-m.a.webp", 
    location: "Galapa.", hours: "9:30 a.m. - 2:30 p.m.", price: "Adultos: $25.000.", 
    tags: ["Avistamiento de aves", "Experiencias sensoriales"]
  },
  {
    id: 18, category: "ecoturismo", title: "Parque Biotemático Megua.", 
    description: "Una aula viva de 32 hectáreas dedicada a la educación ambiental y la conservación. Con senderos ecológicos, granjas interactivas y zonas de preservación, Megua es el pulmón alternativo donde se aprende sobre el cuidado de la tierra mientras se disfruta del aire puro. Ideal para grupos escolares y familias que desean una jornada de inmersión en el campo y contacto directo con animales y plantas nativas.", 
    lat: 10.848611, lng: -74.896667, image: "assets/images/puntos/foto-principal-b.m.webp", 
    location: "Galapa.", hours: "9:00 a.m. - 5:00 p.m.", price: "Adultos: $22.000.", 
    tags: ["Avistamiento de aves", "Experiencias sensoriales", "Vistas panorámicas"]
  },
  {
    id: 19, category: "cultura", title: "Museo Carlos Arturo Valdez.", 
    description: "Ubicado en Malambo, preserva el legado de la etnia Mokaná y la historia municipal a través de una colección privada donada a la comunidad. Es un rincón de tesoros históricos donde se pueden apreciar objetos de la vida cotidiana de antaño y vestigios que dan cuenta del desarrollo de esta población a orillas del río, siendo un punto clave para la identidad local.", 
    lat: 10.861667, lng: -74.773611, image: "assets/images/puntos/foto-principal-para-la-pagina-m.a.webp", 
    location: "Malambo.", hours: "8:00 a.m. - 12:00 p.m.", price: "Gratuito.", 
    tags: ["Artesanías", "Experiencias sensoriales"]
  },
  {
    id: 20, category: "cultura", title: "Ventana al Mundo.", 
    description: "El ícono moderno de Barranquilla que simboliza la apertura de la ciudad hacia el futuro. Con sus imponentes placas de vidrio multicolor y su diseño audaz, este monumento se ha convertido en el sitio más fotografiado del departamento. Rodeado de zonas verdes y senderos peatonales, es el lugar de encuentro por excelencia para apreciar el urbanismo contemporáneo y el orgullo barranquillero.", 
    lat: 11.0325, lng: -74.831389, image: "assets/images/puntos/foto-principal-para-la-pagina-v.m.webp", 
    location: "Barranquilla.", hours: "Abierto.", price: "Gratuito.", 
    tags: ["Vistas panorámicas", "Experiencias sensoriales"]
  },
  {
    id: 21, category: "cultura", title: "Ventana de Campeones.", 
    description: "El monumento 'Aleta de Tiburón' rinde un vibrante homenaje al Junior de Barranquilla y a la pasión deportiva de la ciudad. Ubicado en la rotonda de la Vía 40, su estructura de cristal y acero brilla con los colores del equipo, convirtiéndose en un altar para los hinchas y un símbolo de la identidad festiva y futbolera que caracteriza a la Puerta de Oro de Colombia.", 
    lat: 10.998319, lng: -74.772767, image: "assets/images/puntos/aleta-de-tiburon.webp", 
    location: "Barranquilla.", hours: "Abierto.", price: "Gratuito.", 
    tags: ["Vistas panorámicas", "Experiencias sensoriales"]
  },
  {
    id: 22, category: "cultura", title: "Gran Malecón del Río.", 
    description: "El referente de turismo sostenible que devolvió la ciudad al Río Magdalena. Con kilómetros de senderos peatonales, zonas de picnic, gastronomía de alto nivel y espacios culturales, el Malecón es el corazón social de Barranquilla. Aquí se vive la integración familiar y el disfrute del paisaje fluvial, consolidándose como el espacio público más importante y visitado de todo el país en los últimos años.", 
    lat: 11.020017, lng: -74.793225, image: "assets/images/puntos/foto-principal-para-la-pagina-g.m.webp", 
    location: "Barranquilla.", hours: "5:00 a.m - 11:00 p.m.", price: "Gratuito.", 
    tags: ["Vistas panorámicas", "Comida autóctona", "Relax en la playa"]
  },
  {
    id: 23, category: "nauticos", title: "Playas de Puerto Mocho.", 
    description: "El destino de playa de Barranquilla que se está transformando en un paraíso de turismo sostenible. Ubicado cerca de la desembocadura de Bocas de Ceniza, Puerto Mocho ofrece el encuentro único entre el río y el mar. Con su nuevo sistema de transporte en tren turístico y zonas de servicios renovadas, promete ser el balneario urbano por excelencia para disfrutar de la brisa marina sin salir de la ciudad.", 
    lat: 11.045556, lng: -74.828889, image: "assets/images/puntos/mocho.webp", 
    location: "Barranquilla.", hours: "Variable.", price: "Gratuito.", 
    tags: ["Relax en la playa", "Vistas panorámicas", "Deportes náuticos"]
  },
  {
    id: 24, category: "ecoturismo", title: "Ecoparque Ciénaga de Mallorquín.", 
    description: "Un imponente pulmón verde dedicado a la recuperación ecológica y el avistamiento de aves. Sus pasarelas de madera sobre el agua permiten adentrarse en el ecosistema de manglar sin perturbar la vida silvestre. Es un santuario de biodiversidad que invita a la desconexión urbana y al aprendizaje sobre la importancia de los humedales costeros en la protección ambiental de Barranquilla.", 
    lat: 11.028, lng: -74.778, image: "assets/images/puntos/ecoparque-mallorquin.webp", 
    location: "Barranquilla.", hours: "6:00 a.m - 6:00 p.m.", price: "Gratuito.", 
    tags: ["Avistamiento de aves", "Experiencias sensoriales", "Vistas panorámicas"]
  },
  {
    id: 25, category: "ecoturismo", title: "Salinas de Galerazamba.", 
    description: "El famoso 'Mar rosado' de Colombia es un espectáculo visual que ocurre gracias a la alta concentración de sal y una microalga específica. Visitar las salinas es adentrarse en un paisaje surrealista donde el agua adquiere tonalidades intensas de rosa y rojo. Además de su valor fotográfico, es un sitio cargado de historia minera y un motor económico vital para la comunidad de Galerazamba en Santa Catalina.", 
    lat: 10.794167, lng: -75.253333, image: "assets/images/puntos/foto-principal-s.g.webp", 
    location: "Santa Catalina.", hours: "Variable.", price: "Gratuito.", 
    tags: ["Vistas panorámicas", "Experiencias sensoriales"]
  },
  {
    id: 26, category: "playas", title: "Playas del Country.", 
    description: "Ofrecen un ambiente relajado y exclusivo muy cerca de las zonas residenciales de Puerto Colombia. Son ideales por sus servicios de alta calidad y su oleaje moderado para practicar deportes náuticos suaves. Es la playa elegida por quienes buscan comodidad, buenos restaurantes y un ambiente social vibrante, perfecta para disfrutar de un día de sol con todas las facilidades a la mano.", 
    lat: 11.001111, lng: -74.952778, image: "assets/images/puntos/foto-principal-para-la-pagina-p.s.webp", 
    location: "Puerto Colombia.", hours: "7:00 a.m. - 4:00 p.m.", price: "Gratuito.", 
    tags: ["Relax en la playa", "Vistas panorámicas"]
  },
  {
    id: 27, category: "playas", title: "Playa de Caño Dulce.", 
    description: "Caracterizada por su ambiente sereno e ideal para familias con niños debido a su poca profundidad y olas suaves. Caño Dulce es un refugio de descanso total donde se puede disfrutar de un baño de mar prolongado y saborear la tradicional comida de mar en los restaurantes que bordean la costa. Su entorno natural conservado la hacen una joya escondida para el descanso absoluto.", 
    lat: 10.939722, lng: -75.027778, image: "assets/images/puntos/foto-principal-para-la-pagina-c.d.webp", 
    location: "Tubará.", hours: "8:00 a.m. - 6:00 p.m.", price: "Gratuito.", 
    tags: ["Relax en la playa", "Comida autóctona"]
  },
  {
    id: 28, category: "ecoturismo", title: "Parque Mirador Tubará.", 
    description: "Donde la tierra y el cielo se abrazan. Este mirador ubicado en lo más alto de Tubará ofrece una vista de 360 grados que permite ver el Mar Caribe y las montañas circundantes. Sus coloridas esculturas y escalinatas invitan a capturar la esencia de un pueblo de raíces Mokaná. Es el punto ideal para sentir la fuerza del viento y apreciar la majestuosidad geográfica del departamento del Atlántico.", 
    lat: 10.871111, lng: -74.974444, image: "assets/images/puntos/foto-principal-para-la-pagina-m.t..webp", 
    location: "Tubará.", hours: "Abierto todo el tiempo.", price: "Gratuito.", 
    tags: ["Vistas panorámicas", "Experiencias sensoriales", "Avistamiento de aves"]
  },
  {
    id: 29, category: "otros", title: "Aeropuerto Ernesto Cortissoz.", 
    description: "El principal enlace aéreo del Atlántico que conecta a Barranquilla y su área metropolitana con el mundo. Con instalaciones modernizadas, ofrece una experiencia de llegada ágil y cómoda al corazón de la región. Su nombre honra a un pionero de la aviación comercial en América, reflejando el espíritu emprendedor y la conectividad que siempre han definido a esta zona del país.", 
    lat: 10.886536, lng: -74.776478, image: "assets/images/puntos/aeropuerto-barranquilla.webp", 
    location: "Barranquilla.", hours: "24h.", price: "N/A.", 
    tags: ["Comida autóctona"]
  },
  {
    id: 30, category: "eventos", title: "Fiestas novembrinas de Cartagena.", 
    description: "La celebración cultural más importante de la ciudad amurallada que conmemora su independencia. Durante una semana, Cartagena se llena de desfiles, comparsas, música folclórica y un ambiente festivo inigualable en cada plaza y callejón. Es el momento donde la identidad africana y caribeña brilla con más fuerza, invitando a propios y turistas a ser parte de una fiesta histórica cargada de color y alegría.", 
    lat: 10.421903, lng: -75.550075, image: "assets/images/puntos/fiestas-novembrinas-de-cartagena.webp", 
    location: "Cartagena.", hours: "Noviembre.", price: "Gratuito.", 
    tags: ["Experiencias sensoriales", "Artesanías", "Comida autóctona"]
  },
  {
    id: 31, category: "cultura", title: "Museo del Carnaval.", 
    description: "Una de las infraestructuras culturales más vibrantes de Barranquilla dedicada a preservar el patrimonio oral e inmaterial de la humanidad. El museo ofrece un viaje por la historia, los personajes y el color del Carnaval, exhibiendo los vestidos reales de las reinas y los secretos de las danzas tradicionales. Un espacio donde se vive el carnaval todo el año y se entiende por qué Barranquilla es la capital de la festividad en Colombia.", 
    lat: 10.992789, lng: -74.787797, image: "assets/images/puntos/museo-del-carnaval-de-barranquilla.webp", 
    location: "Barranquilla.", hours: "Variable.", price: "Gratuito.", 
    tags: ["Artesanías", "Experiencias sensoriales"]
  },
  {
    id: 32, category: "otros", title: "Aeropuerto Internacional Rafael Núñez.", 
    description: "Ubicado en el corazón de Cartagena, el Aeropuerto Internacional Rafael Núñez es mucho más que una terminal aérea; es el punto donde comienza la magia para millones de viajeros cada año. Se destaca por su ubicación privilegiada, a solo minutos del Centro Histórico y la zona turística, facilitando una transición inmediata hacia la historia y el mar. Su diseño eficiente y su conectividad internacional lo consolidan como un motor fundamental del turismo sostenible en la región.", 
    lat: 10.446314, lng: -75.516453, image: "assets/images/puntos/aeropuerto-internacional-rafael-nunez.webp", 
    location: "Cartagena., Bolívar.", hours: "Abierto todo el tiempo.", price: "N/A.", 
    tags: ["Artesanías"]
  },
  {
    id: 33, category: "ecoturismo", title: "La Casa Voltiá.", 
    description: "Una experiencia surrealista y divertida donde todo está de cabeza. Ubicada en el municipio de Juan de Acosta, esta construcción desafía la lógica y la gravedad, ofreciendo un entorno perfecto para la fotografía creativa. Es una parada obligatoria para quienes buscan contenido original y momentos de asombro mientras viajan por la carretera, convirtiéndose en un hito de curiosidad y entretenimiento para todas las edades.", 
    lat: 10.834994, lng: -75.141247, image: "assets/images/puntos/la-casa-voltia.webp", 
    location: "Juan de Acosta.", hours: "9:00 am - 6:00 pm", price: "Gratuito.", 
    tags: ["Experiencias sensoriales", "Vistas panorámicas"]
  },
  {
    id: 34, category: "playas", title: "Manzanillo del Mar.", 
    description: "Playa serena y auténtica que conserva el encanto de una comunidad de pescadores. Ubicada en la zona norte de Cartagena, ofrece un ambiente más privado y tranquilo que los balnearios tradicionales. Es el lugar perfecto para disfrutar de la comida típica frente al mar, realizar largas caminatas por la costa o simplemente contemplar el horizonte en un entorno de paz absoluta, siendo un modelo de equilibrio entre turismo y vida local.", 
    lat: 10.515992, lng: -75.499278, image: "assets/images/puntos/manzanillo-del-mar.webp", 
    location: "Cartagena.", hours: "Variable.", price: "Gratuito.", 
    tags: ["Relax en la playa", "Deportes náuticos", "Vistas panorámicas"]
  },
  {
    id: 35, category: "infraestructura", title: "Viaducto Gran Manglar.", 
    description: "Una obra maestra de ingeniería civil que coexiste en perfecta armonía con el ecosistema de manglar. Este viaducto sobre la Ciénaga de la Virgen ha sido premiado internacionalmente por su respetuoso diseño ambiental, permitiendo el flujo del agua y la vida silvestre por debajo de la carretera. Conducir sobre él es una experiencia única que ofrece vistas panorámicas impresionantes de la ciénaga y el mar, simbolizando el futuro de la infraestructura sostenible.", 
    lat: 10.476022, lng: -75.488756, image: "assets/images/puntos/puente-del-viaducto-el-gran-manglar.webp", 
    location: "Cartagena.", hours: "Abierto.", price: "Gratuito.", 
    tags: ["Vistas panorámicas", "Experiencias sensoriales"]
  },
  {
    id: 36, category: "ecoturismo", title: "Ciénaga de la Virgen.", 
    description: "Uno de los tesoros hídricos de Cartagena y un ecosistema estratégico para la biodiversidad local. Hogar de manglares y numerosas especies de aves migratorias, la ciénaga es un destino ideal para el ecoturismo y la observación de aves. Paseos en barca guiados por pescadores locales permiten conocer la importancia de la conservación mientras se disfruta de un paisaje natural que abraza la zona norte de la ciudad.", 
    lat: 10.460533, lng: -75.494847, image: "assets/images/puntos/cienaga-de-la-virgen.webp", 
    location: "Cartagena.", hours: "Abierto.", price: "Gratuito.", 
    tags: ["Avistamiento de aves", "Experiencias sensoriales"]
  },
  {
    id: 37, category: "playas", title: "Playa de la Boquilla.", 
    description: "El corazón afrodescendiente de la costa cartagenera donde el mar se disfruta entre manglares y tambores. La Boquilla es famosa por sus recorridos en canoa por los túneles de manglar y su excepcional oferta gastronómica. Es un destino que combina la playa con la cultura viva, invitando a los turistas a participar en talleres de danza o pesca, viviendo una experiencia humana y natural profundamente auténtica.", 
    lat: 10.4621, lng: -75.504458, image: "assets/images/puntos/playa-de-la-boquilla.webp", 
    location: "Cartagena.", hours: "Abierto.", price: "Gratuito.", 
    tags: ["Relax en la playa", "Comida autóctona", "Deportes náuticos"]
  },
  {
    id: 38, category: "eventos", title: "Festival Enyúcate.", 
    description: "Banquete de tradición que celebra la yuca en todas sus formas en el municipio de Malambo. Este festival reúne a cocineros tradicionales y productores locales en una feria llena de sabores, música de gaita y alegría comunitaria. Es una celebración de la seguridad alimentaria y la cultura campesina, donde probar un tradicional enyucado es conectarse directamente con la tierra y el corazón dulce del Atlántico.", 
    lat: 10.830311, lng: -75.031867, image: "assets/images/puntos/enyucate.webp", 
    location: "Malambo.", hours: "Variable.", price: "Gratuito.", 
    tags: ["Comida autóctona", "Artesanías"]
  },
  {
    id: 39, category: "ecoturismo", title: "Ciénaga del Totumo.", 
    description: "Humedal estratégico famoso por colindar con el Volcán del Totumo, ofreciendo un ecosistema de agua dulce ideal para la observación de fauna y flora. Sus aguas reflejan el cielo y los manglares, creando un entorno de paz inmensa. Es el complemento perfecto para el baño de lodo, permitiendo paseos en lancha para apreciar la inmensidad del paisaje hídrico y la vida de los pescadores artesanales que cuidan de este santuario natural.", 
    lat: 10.738397, lng: -75.260689, image: "assets/images/puntos/cienaga-totumo.webp", 
    location: "Santa Catalina.", hours: "Abierto.", price: "Gratuito.", 
    tags: ["Avistamiento de aves", "Vistas panorámicas"]
  },
  {
    id: 40, category: "eventos", title: "Festival de la Palma Amarga. ", 
    description: "El Festival de la Palma Amarga es un tributo vivo al ingenio de las comunidades de Piojó y su armonía con el entorno natural. Celebra el legado de los artesanos y tejedores que transforman la fibra de la palma en piezas únicas y techos que cuentan historias de la cultura. Es una ventana a los saberes ancestrales que han definido la identidad del Caribe. La música de viento y las muestras artesanales, invitan a valorar la importancia de preservar nuestras materias primas y los oficios que dan vida al territorio.", 
    lat: 10.75, lng: -75.108, image: "assets/images/puntos/Festival de la Palma Amarga.webp", 
    location: "Piojó, Atlántico.", hours: "El evento dura entre 1 y 3 días.", price: "Gratuito.", 
    tags: ["Turismo cultural","desfiles y comparsas","música y danza","concursos tradicionales","gastronomía","comercio local."]
  },
  {
    id: 41, category: "ecoturismo", title: "Calvaduria Ecoturismo y Camping - Asociación agroecológica Nueva Generación de Piojó.", 
    description: "Calvaduría Ecoturismo y Camping invita a descubrir el Atlántico más natural y fresco. En este espacio donde el agroturismo, el camping y los pozos naturales se entrelazan, cada experiencia se convierte en una oportunidad para reconectarse con la tierra y con uno mismo. Entre montañas suaves, aire puro y la hospitalidad rural, este lugar celebra la armonía entre naturaleza y comunidad, recordando que cada visita deja una huella positiva en el entorno.", 
    lat: 10.751, lng: -75.109, image: "assets/images/puntos/Calvaduria Ecoturismo y Camping.webp", 
    location: "Piojó, Atlántico.", hours: "Abierto todo el tiempo.", price: "Pasa día: adultos:$15.000 mil cop. Niños: $7.000 mil cop.", 
    tags: ["Agroturismo","camping","pozos naturales","senderismo","rutas ecológicas","hospedaje."]
  },
  {
    id: 42, category: "cultura", title: "Santuario Mariano Nuestra Señora del Carmen.", 
    description: "El Santuario Mariano Nuestra Señora del Carmen es uno de los lugares más representativos de Puerto Colombia y un importante centro de fe en el Atlántico. Reconocido como el único santuario mariano del departamento, abre sus puertas los 365 días del año, ofreciendo a los feligreses un espacio para vivir la sagrada eucaristía y fortalecer su espiritualidad. Su arquitectura conserva un estilo tradicional que refleja la historia y la devoción de la comunidad porteña, invita a vivir una experiencia de recogimiento y conexión con la esencia cultural y espiritual del caribe.", 
    lat: 10.988, lng: -74.959, image: "assets/images/puntos/Santuario Mariano Nuestra Señora del Carmen.webp", 
    location: "Puerto Colombia, Atlántico.", hours: "Abierto todo el tiempo.", price: "Gratuito.", 
    tags: ["Religiosos","comunitarios y culturales."]
  },
  {
    id: 43, category: "cultura", title: "Sirenato de la cumbia. ", 
    description: "Desde 1996, Puerto Colombia vibra al compás del Sirenato de la Cumbia. Tambores, flautas y pasos ancestrales elevan este ritmo que define al caribe colombiano. Más que un festival, es la ceremonia viva donde cada generación renueva su pacto con la cumbia, ritmo del alma y memoria de un pueblo.", 
    lat: 10.989, lng: -74.955, image: "assets/images/puntos/Sirenato de la cumbia.webp", 
    location: "Puerto Colombia, Atlántico.", hours: "El evento dura entre 1 y 3 días.", price: "Gratuito.", 
    tags: ["Concurso de reinas en distintas categorías","presentaciones de música y danza de cumbia","desfiles culturales","comparsas y actividades turísticas que promueven el patrimonio del Caribe Colombiano."]
  },
  {
    id: 44, category: "eventos", title: "Festival del Mar y del Turismo. ", 
    description: "Desde 2018, Puerto Colombia celebra su vocación costera con este festival que reúne a los municipios del Atlántico. Desfiles, muestras culturales y la elección de la capitanía de los mares hacen de esta fiesta un himno al mar, al liderazgo femenino y al orgullo del corazón azul del departamento.", 
    lat: 10.987, lng: -74.958, image: "assets/images/puntos/Festival del Mar y del Turismo.webp", 
    location: "Puerto Colombia, Atlántico.", hours: "El evento dura entre 1 y 3 días.", price: "Gratuito.", 
    tags: ["Desfiles","presentaciones culturales","feria gastronómica y actividades recreativas."]
  },
  {
    id: 45, category: "cultura", title: "Parroquia San José de Tubará.", 
    description: "La parroquia San José de Tubará es una joya histórica construida en 1833 sobre un antiguo asentamiento indígena Mokaná de la tribu caribe. Su arquitectura colonial y su gran valor cultural la convierten en uno de los principales atractivos del municipio. En 1996 fue declarada patrimonio arquitectónico del Atlántico, destacándose como un símbolo de fe, historia y tradición en la región, donde cada piedra y cada oración conectan pasado y presente en una experiencia que invita a reconocer la herencia viva del territorio.", 
    lat: 10.871, lng: -74.974, image: "assets/images/puntos/Parroquia San José de Tubará.webp", 
    location: "Tubará, Atlántico.", hours: "Horario de eucaristías: fines de semana y festivos en la mañana y en la tarde.", price: "Gratuito.", 
    tags: ["Celebraciones religiosas (misas","bautizos","matrimonios","confirmaciones)","atención espiritual y confesiones","actividades comunitarias y pastorales."]
  },
  {
    id: 46, category: "eventos", title: "Festival de la Yuca y el Totumo. ", 
    description: "El festival de la yuca y el totumo se realiza el domingo de carnaval, con más de 20 años de existencia, inició con los Mokaná en el mirador de Tubará, con la finalidad de mostar los productos que se cultivan y todas las artesanías que se hace con el totumo.", 
    lat: 10.872, lng: -74.973, image: "assets/images/puntos/Festival de la Yuca y el Totumo.webp", 
    location: "Tubará, Atlántico.", hours: "", price: "", 
    tags: []
  },
  {
    id: 47, category: "eventos", title: "Festival de la Máscara y el Bejuco. ", 
    description: "Eeste festival es la principal cita artesanal de Galapa. Reúne a creadores en bejuco, talla en madera y papel maché, convirtiendo la plaza en un escenario de tradición y creatividad. Es un espacio de exhibición y comercialización que preserva la identidad y las raíces culturales del municipio.", 
    lat: 10.899, lng: -74.886, image: "assets/images/puntos/Festival de la Máscara y el Bejuco.webp", 
    location: "Galapa, Atlántico.", hours: "El evento dura entre 1 y 3 dias.", price: "Gratuito.", 
    tags: ["Exhibición artesanal (bejuco","talla en madera y papel maché)","venta de artesanías","talleres demostrativos","interacción con artesanos","presentaciones culturales."]
  },
  {
    id: 48, category: "eventos", title: "Carnaval de Galapa. ", 
    description: "El Carnaval de Galapa es una explosión de color, ritmo y memoria ancestral. Entre tambores, comparsas y danzas, el pueblo celebra su identidad con disfraces que narran historias y preservan sus raíces. Cada desfile refleja una tradición viva que resiste en el tiempo e invita a disfrutar la alegría del caribe colombiano.", 
    lat: 10.898, lng: -74.885, image: "assets/images/puntos/Carnaval de Galapa.webp", 
    location: "Galapa, Atlántico.", hours: "El evento dura entre 8 y 10 dias.", price: "Gratuito.", 
    tags: ["Desfiles de comparsas y danzas tradicionales","presentaciones folclóricas y musicales","exhibición de disfraces típicos y personajes","venta de artesanías y productos locales","gastronomía típica en puestos y ferias","actividades recreativas y familiares."]
  },
  {
    id: 49, category: "eventos", title: "Festival de Decimeros y Bailadores de Cumbia de la Región Caribe. ", 
    description: "El Festival de Decimeros y Bailadores de Cumbia del caribe celebra la oralidad y el folclore regional. Es un espacio de transmisión de saberes y salvaguardia patrimonial que reúne a artistas de Magdalena, Córdoba, Sucre y otros departamentos, fortaleciendo la identidad y preservando las raíces culturales del territorio.", 
    lat: 10.862, lng: -74.774, image: "assets/images/puntos/Festival de Decimeros y Bailadores de Cumbia.webp", 
    location: "Malambo, Atlántico.", hours: "El evento dura ente 1 y 3 dias.", price: "Gratuito.", 
    tags: []
  },
  {
    id: 50, category: "eventos", title: "Festival regional de Bandas Tradicionales. ", 
    description: "El Festival de Bandas tradicionales del caribe, en Malambo, celebra la riqueza musical de la región. Reúne agrupaciones de viento y percusión que interpretan porros, cumbias y fandangos. Más que una competencia, es un espacio de encuentro que fortalece la identidad, el talento local y la preservación del patrimonio musical caribeño.", 
    lat: 10.861, lng: -74.773, image: "assets/images/puntos/Festival regional de Bandas Tradicionales.webp", 
    location: "Malambo, Atlántico.", hours: "El evento dura ente 1 y 3 dias.", price: "Gratuito.", 
    tags: []
  },
  {
    id: 51, category: "eventos", title: "Fiestas de Santa María Magdalena.", 
    description: "Las fiestas patronales de Santa María Magdalena son una de las celebraciones más representativas de Malambo. Durante cuatro días reúnen a la comunidad en torno a la fe y la tradición, con actividades culturales, deportivas y religiosas. Incluyen procesiones, muestras folclóricas y presentaciones artísticas que exaltan la herencia cultural y espiritual del municipio.", 
    lat: 10.86, lng: -74.772, image: "assets/images/puntos/Fiestas de Santa María Magdalena.webp", 
    location: "Malambo, Atlántico.", hours: "El evento dura ente 1 y 3 dias.", price: "Gratuito.", 
    tags: ["Ofrece servicios de actividades culturales","eventos religiosos","presentaciones artísticas","ferias gastronómicas","competencias deportivas y espacios de recreación familiar."]
  },
  {
    id: 52, category: "cultura", title: "Parque de La Cultura - Asociación Cultural y Artesanal Raíces de Malambo.", 
    description: "El parque de la cultura “Fabio Miranda” es un espacio emblemático de Malambo que promueve el desarrollo humano y el fortalecimiento económico del territorio. Este parque rinde homenaje a la tradición alfarera, una práctica ancestral que durante siglos ha sido la base de los intercambios comerciales y el reflejo del legado cultural de los pueblos originarios de la región.", 
    lat: 10.863, lng: -74.775, image: "assets/images/puntos/Parque de La Cultura.webp", 
    location: "Malambo, Atlántico.", hours: "Abierto todo el tiempo.", price: "Gratuito.", 
    tags: ["Zonas verdes","áreas de esparcimiento","juegos para niños."]
  },
  {
    id: 53, category: "ecoturismo", title: "Parque Lineal de Crespo.", 
    description: "El Parque Lineal de Crespo es la respuesta de Cartagena al avance del Caribe. Diseñado para frenar la erosión costera y adaptarse al cambio climático, es hoy un corredor verde que reconcilia la ciudad con el mar. Un espacio donde el futuro sostenible camina de la mano de la naturaleza.", 
    lat: 10.439, lng: -75.522, image: "assets/images/puntos/Parque Lineal de Crespo.webp", 
    location: "Cartagena, Bolivar.", hours: "", price: "", 
    tags: []
  },
  {
    id: 54, category: "playas", title: "Playa Marbella.", 
    description: "Marbella es el secreto urbano de Cartagena: una franja de arena protegida por espolones que desafían las corrientes del caribe. Sus aguas son refugio para quienes buscan una experiencia auténtica lejos del bullicio. Un rincón donde la ciudad y el mar se encuentran en perfecta armonía.", 
    lat: 10.434, lng: -75.529, image: "assets/images/puntos/Playa Marbella.webp", 
    location: "Cartagena, Bolivar.", hours: "", price: "", 
    tags: []
  },
  {
    id: 55, category: "eventos", title: "Fiestas patronales Santa Catalina de Alejandría.", 
    description: "Las fiestas de Santa Catalina de Alejandría fusionan fe y folclor en una celebración que convoca a toda la comunidad. Procesiones, bailes, corridas de toros y la elección de la diosa llenan de color las calles. Una vivencia que celebra la identidad y el espíritu festivo del caribe con devoción y alegría.", 
    lat: 10.605, lng: -75.253, image: "assets/images/puntos/Fiestas patronales Santa Catalina de Alejandría.webp", 
    location: "Santa Catalina, Bolivar.", hours: "El evento dura entre 4 y 7 días.", price: "Gratuito.", 
    tags: ["Turismo cultural","gastronomía","música y danzas tradicionales","eventos religiosos","comercio local."]
  },
  {
    id: 56, category: "cultura", title: "Museo Etnoindustrial.", 
    description: "El Museo Etnoindustrial de Galerazamba es un espacio que permite comprender la historia de la producción de sal en la región. A través de herramientas antiguas, fotografías y exhibiciones, los visitantes descubren cómo esta actividad marcó la vida social, económica y cultural de la comunidad. Más que un recorrido histórico, es un encuentro auténtico con la memoria y el trabajo de generaciones que han hecho de la sal su identidad, reflejando el valor de las tradiciones locales y la conexión viva entre la gente y su territorio.", 
    lat: 10.794, lng: -75.253, image: "assets/images/puntos/Museo Etnoindustrial.webp", 
    location: "Santa Catalina, Bolivar.", hours: "10:00 a.m. - 4:00 p.m.", price: "Adultos: $7.000 mil cop. Niños (desde 5 años): $5.000 mil cop.", 
    tags: ["Servicios culturales","recorridos guiados","exhibiciones permanentes","actividades pedagógicas y turismo histórico-patrimonial."]
  },
  {
    id: 57, category: "eventos", title: "Fiestas patronales de San Antonio de Padua.", 
    description: "Las fiestas de San Antonio de Padua convierten a Piojó en epicentro del folclor caribeño. Bandas papayeras, corralejas, peleas de gallos y la vara de premio llenan de música y emoción sus calles. Una celebración que honra la tradición y reúne a visitantes y locales en torno al patrimonio vivo de la región.", 
    lat: 10.749, lng: -75.107, image: "assets/images/puntos/Fiestas patronales de San Antonio de Padua.webp", 
    location: "Piojó, Atlántico.", hours: "El evento dura entre 1 y 3 días.", price: "Gratuito.", 
    tags: ["Turismo cultural","eventos religiosos","deportes","música y danzas tradicionales","espectáculos taurinos","juegos populares","gastronomía","comercio local."]
  },
  {
    id: 58, category: "infraestructura", title: "Tambo Marina Ecohostal.", 
    description: "Tambo Marina Ecohostal es un alojamiento ecológico frente al mar, en playa Punta Astillero, Piojó (Atlántico). Entre el sonido de las olas y la brisa cálida, ofrece una experiencia de descanso en contacto con la naturaleza. Tiene hospedaje, restaurante, acceso directo a la playa y actividades como senderismo, pesca y entretenimiento nocturno, este lugar invita a disfrutar del turismo sostenible en un entorno sereno donde la tranquilidad y el mar se encuentran.", 
    lat: 10.795, lng: -75.224, image: "assets/images/puntos/Tambo Marina Ecohostal.webp", 
    location: "Piojó, Atlántico.", hours: "8:00 a.m. - 9:00 p.m.", price: "", 
    tags: ["Hospedaje ecológico","restaurante","acceso directo a la playa","senderismo","entretenimiento nocturno y turismo sostenible."]
  },
  {
    id: 59, category: "eventos", title: "Festival Internacional de las Tunas Corazonistas.", 
    description: "Las Tunas Corazonistas transforman Puerto Colombia en escenario de guitarras, capas y serenatas bohemias. Países y regiones se encuentran en este festival donde la música estudiantil se convierte en amistad y memoria. Cada nota es un puente entre culturas; cada edición, una celebración que late en el corazón del caribe.", 
    lat: 10.986, lng: -74.957, image: "assets/images/puntos/Festival Internacional de las Tunas Corazonistas.webp", 
    location: "Puerto Colombia, Atlántico.", hours: "El evento dura entre 1 y 3 días.", price: "Gratuito.", 
    tags: ["Presentaciones musicales en vivo","actividades culturales","intercambio artístico internacional","promoción de agrupaciones regionales y entretenimiento para el público."]
  },
  {
    id: 60, category: "cultura", title: "Piedra Pintada. Colectivo Caminantes por El Morro.", 
    description: "Piedra Pintada es la memoria viva del pueblo Mokaná. En sus petroglifos hablan los ancestros que habitaron estas montañas de Tubará, resistieron la colonización y dejaron grabado su vínculo sagrado con la tierra. Rodeada de senderos y vegetación exuberante, es un destino para quienes buscan historia, espiritualidad y naturaleza.", 
    lat: 10.87, lng: -74.97, image: "assets/images/puntos/Piedra Pintada.webp", 
    location: "Tubará, Atlántico.", hours: "Abierto todo el tiempo.", price: "Gratuito.", 
    tags: ["Caminatas ecológicas","observación de petroglifos","actividades culturales y espirituales","zonas naturales para descanso."]
  },
  {
    id: 61, category: "eventos", title: "Carnaval de Tubará.", 
    description: "El Carnaval de Tubará es un abrazo al son de la cumbia. Esta celebración anual convierte las calles del municipio en un río de colores, danzas y tradición que fluye desde las raíces más profundas del Caribe colombiano. Una fiesta que renueva el vínculo entre la comunidad, su historia y la música que la define.", 
    lat: 10.873, lng: -74.975, image: "assets/images/puntos/Carnaval de Tubará.webp", 
    location: "Tubará, Atlántico.", hours: "", price: "", 
    tags: []
  },
  {
    id: 62, category: "eventos", title: "Festival intermunicipal del folclore.", 
    description: "Galapa se convierte en la capital del folclor caribeño con su Gran parada departamental. Tambores, llamadores y flautas de millo acompañan a comparsas que tiñen las calles de color y movimiento. Un encuentro que celebra la riqueza cultural del Atlántico y eleva la tradición como motor del orgullo regional.", 
    lat: 10.897, lng: -74.884, image: "assets/images/puntos/Festival intermunicipal del folclore.webp", 
    location: "Galapa, Atlántico.", hours: "El evento dura 1 día.", price: "Gratuito.", 
    tags: ["Desfile de comparsas y danzas folclóricas","presentaciones musicales en vivo","exhibición de ritmos tradicionales como cumbia y mapalé","participación de comparsas invitadas","venta de comidas y bebidas típicas","venta de artesanías locales."]
  }
];
