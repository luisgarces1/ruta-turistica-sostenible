import json
import re

updates = {
    40: (10.750, -75.108), # Palma Amarga, Piojó
    41: (10.751, -75.109), # Calvaduria, Piojó
    42: (10.988, -74.959), # Santuario Mariano, Puerto Colombia
    43: (10.989, -74.955), # Sirenato Cumbia, Puerto Colombia
    44: (10.987, -74.958), # Fest Mar, Pto Colombia
    45: (10.871, -74.974), # Parroquia Tubará
    46: (10.872, -74.973), # Yuca y Totumo, Tubará
    47: (10.899, -74.886), # Mascara y Bejuco, Galapa
    48: (10.898, -74.885), # Carnaval Galapa
    49: (10.862, -74.774), # Decimeros, Malambo
    50: (10.861, -74.773), # Bandas Tradicionales, Malambo
    51: (10.860, -74.772), # Santa Maria Magdalena, Malambo
    52: (10.863, -74.775), # Parque de la Cultura, Malambo
    53: (10.439, -75.522), # Parque Lineal Crespo, Cartagena
    54: (10.434, -75.529), # Playa Marbella, Cartagena
    55: (10.605, -75.253), # Santa Catalina
    56: (10.794, -75.253), # Museo Etnoindustrial, Galerazamba
    57: (10.749, -75.107), # San Antonio de Padua, Piojó
    58: (10.795, -75.224), # Tambo Marina, Punta Astilleros
    59: (10.986, -74.957), # Tunas Corazonistas, Puerto Colombia
    60: (10.870, -74.970), # Piedra Pintada, Tubará
    61: (10.873, -74.975), # Carnaval Tubará
    62: (10.897, -74.884), # Fest folclore, Galapa
}

with open('assets/js/data.js', 'r', encoding='utf-8') as f:
    text = f.read()

for item_id, (lat, lng) in updates.items():
    # Find the block inside data.js for each ID and replace the lat / lng
    # The string normally looks like: id: 40, category: "eventos", title: "Festival de la Palma Amarga. ", \n    description: "...", \n    lat: "", lng: "", image: ...
    # We will use regex to find id: XX, ... lat: "", lng: "" and replace it.
    
    pattern = rf'(id:\s*{item_id},\s*category:\s*".*?",\s*title:\s*".*?",\s*description:\s*".*?",\s*)lat:\s*"",\s*lng:\s*""'
    replacement = rf'\g<1>lat: {lat}, lng: {lng}'
    text = re.sub(pattern, replacement, text, flags=re.DOTALL)

with open('assets/js/data.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Coordinates successfully added.")
