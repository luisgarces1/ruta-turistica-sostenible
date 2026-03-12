import os
import json
import re
import pandas as pd

app_categories = [
    { "id": 'todas', "label": 'Ver Todos', "icon": '📍', "color": 'bg-slate-800' },
    { "id": 'naturaleza', "label": 'Naturaleza y Rural', "icon": '🌿', "color": 'bg-emerald-500' },
    { "id": 'parques', "label": 'Parques', "icon": '⛰️', "color": 'bg-teal-600' },
    { "id": 'eventos', "label": 'Fiestas y Eventos', "icon": '🎉', "color": 'bg-fuchsia-500' },
    { "id": 'personajes', "label": 'Personajes de Interés', "icon": '👤', "color": 'bg-amber-600' },
    { "id": 'cultura', "label": 'Cultura e Historia', "icon": '🏛️', "color": 'bg-purple-500' },
    { "id": 'gastronomia', "label": 'Gastronomía', "icon": '🍽️', "color": 'bg-orange-500' },
    { "id": 'playas', "label": 'Playas', "icon": '🏖️', "color": 'bg-sky-400' },
    { "id": 'otros', "label": 'Otros Servicios', "icon": '🛍️', "color": 'bg-indigo-400' }
]

def clean_text(text):
    if pd.isna(text): return ""
    v = str(text).strip()
    return "No especificado" if not v else v

fallback_coords = {
    'puerto colombia': [11.000, -74.950],
    'santa catalina': [10.605, -75.289],
    'cartagena': [10.399, -75.514],
    'piojó': [10.748, -75.109],
    'luruaco': [10.612, -75.143],
    'juan de acosta': [10.828, -75.034],
    'tubará': [10.875, -74.980],
    'barranquilla': [11.005, -74.801],
    'galapa': [10.893, -74.877],
    'malambo': [10.858, -74.773],
    'soledad': [10.916, -74.780]
}

def get_fallback_coord(municipio, index):
    if pd.isna(municipio): return [10.9 + (index * 0.005), -74.9 + (index * 0.005)]
    m_lower = str(municipio).lower()
    for k, v in fallback_coords.items():
        if k in m_lower: return [v[0] + (index * 0.001), v[1] + (index * 0.001)]
    return [10.9 + (index * 0.005), -74.9 + (index * 0.005)]

def parse_coordinate(coord_str):
    if pd.isna(coord_str) or not isinstance(coord_str, str): return None
    coord_str = coord_str.lower().strip().replace('..', '.')
    if '°' not in coord_str and ',' in coord_str and 'n' not in coord_str:
        try:
            parts = [float(p.strip()) for p in coord_str.split(',')]
            if len(parts) == 2: return parts
        except: pass
    pattern = r'(\d+)[°\s]*(\d+)?[′\']*\s*(\d+(?:\.\d+)?)?[″"]*\s*([nsewo])?'
    matches = re.findall(pattern, coord_str)
    dec_coords = []
    for match in matches:
        if not match[0]: continue
        d = float(match[0])
        m = float(match[1]) if match[1] else 0
        s = float(match[2]) if match[2] else 0
        direction = match[3]
        dec = d + (m / 60.0) + (s / 3600.0)
        if direction in ['s', 'w', 'o']: dec = -dec
        dec_coords.append(dec)
    if len(dec_coords) >= 2: return dec_coords[:2]
    return None

def fix_coord(lat, lng, municipio, idx):
    if lat is None or lng is None: return get_fallback_coord(municipio, idx)
    if lat < -90 or lat > 90: lat, lng = lng, lat
    if lng > 0: lng = -lng
    if 0 < lat < 2.0: lat += 10.0
    if not (9.0 <= lat <= 12.0) or not (-76.5 <= lng <= -73.0): return get_fallback_coord(municipio, idx)
    return [lat, lng]

def normalize_string(s):
    if pd.isna(s): return ""
    # remove spaces, dots, commas, etc and lowercase
    return re.sub(r'[\s\.\,\(\)_-]+', '', str(s).lower())

xl_path = '090326 Consolidado información herramienta nuevos puntos.xlsx'
output_data = []
img_dir = 'mapa-interactivo/assets/images/puntos'

# Map local files
local_files = os.listdir(img_dir) if os.path.exists(img_dir) else []
img_map = {}
for f in local_files:
    base = os.path.splitext(f)[0]
    norm = normalize_string(base)
    # Prefer images over videos if both exist with same name
    if norm not in img_map or f.lower().endswith(('.jpg','.jpeg','.png','.heic')):
        img_map[norm] = f

df = pd.read_excel(xl_path, sheet_name='Consolidado informacion RTS')
for idx, row in df.iterrows():
    title = clean_text(row.get('Nombre o denominación', ''))
    if title == 'No especificado': title = f'Punto de Interés {idx+1}'
    
    cat_raw = str(row.get('Categoría', '')).lower()
    cat_id = 'otros'
    if 'naturaleza' in cat_raw or 'ecológic' in cat_raw: cat_id = 'naturaleza'
    elif 'evento' in cat_raw or 'festival' in cat_raw: cat_id = 'eventos'
    elif 'playa' in cat_raw: cat_id = 'playas'
    elif 'gastronom' in cat_raw: cat_id = 'gastronomia'
    elif 'cultura' in cat_raw or 'museo' in cat_raw: cat_id = 'cultura'
    elif 'parque' in cat_raw: cat_id = 'parques'

    municipio = clean_text(row.get('Municipio', ''))
    depto = clean_text(row.get('Departamento', ''))
    
    desc_keys = ['Descripción específica para incluir en la ruta, integrada con la narrativa sostenible definida por isa ruta costera', 'Descripción especifica para incluir en la ruta']
    desc = ''
    for k in desc_keys:
        if k in row and not pd.isna(row[k]) and str(row[k]).strip() != '':
            desc = str(row[k]).strip()
            break
    if not desc: desc = "Información detallada no disponible."

    lat_lng_raw = row.get('Coordenadas o ubicación', '')
    if 'Sombrero Voltiao' in title: lat_lng_raw = "10.8805, -75.0711"
    coords = parse_coordinate(lat_lng_raw)
    clist = fix_coord(coords[0] if coords else None, coords[1] if coords else None, municipio, idx)

    # IMAGE MATCHING
    placeholder = f"https://source.unsplash.com/800x600/?{cat_id},colombia"
    final_img_path = placeholder
    
    desc_foto = str(row.get('Fotografías (descripción o rotulación)', ''))
    norm_desc = normalize_string(desc_foto)
    
    linked_url = str(row.get('Link de fotografías', ''))
    drive_id = ''
    m = re.search(r'/d/([a-zA-Z0-9_-]+)', linked_url)
    if m: drive_id = m.group(1).lower()

    # Try matching by the exact description text first
    if norm_desc and norm_desc in img_map:
        final_img_path = f"assets/images/puntos/{img_map[norm_desc]}"
    # Try matching by title
    elif normalize_string(title) in img_map:
        final_img_path = f"assets/images/puntos/{img_map[normalize_string(title)]}"
    # Fallback to drive id matching
    elif drive_id:
        for f in local_files:
            if drive_id in f.lower():
                final_img_path = f"assets/images/puntos/{f}"
                break
    
    horas = clean_text(row.get('Horario de atención'))
    if horas == 'No especificado': horas = clean_text(row.get('Días de atención'))
    price = clean_text(row.get('Rango de precio'))
    if price == 'No especificado': price = clean_text(row.get('Tarifa / Ingreso', 'Consultar'))

    output_data.append({
        "id": idx + 1,
        "category": cat_id,
        "title": title,
        "description": desc,
        "lat": clist[0],
        "lng": clist[1],
        "image": final_img_path,
        "location": f"{municipio}, {depto}".strip(", "),
        "hours": horas,
        "price": price
    })

used_cats = set(x['category'] for x in output_data)
used_cats.add('todas')
final_cats = [c for c in app_categories if c['id'] in used_cats]

js_content = f"// Data extraída del CSV/Excel\n\nconst categories = {json.dumps(final_cats, indent=2, ensure_ascii=False)};\n\nconst mockData = {json.dumps(output_data, indent=2, ensure_ascii=False)};"

with open('mapa-interactivo/assets/js/data.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print("Parsed successfully with smart local image mapping!")
