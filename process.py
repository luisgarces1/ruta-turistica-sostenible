import json
import os
import shutil
import unicodedata

def normalize(s):
    return unicodedata.normalize('NFD', s).encode('ascii', 'ignore').decode('utf-8').lower()

# Image files in 'segunda entrega'
src_dir = 'segunda entrega'
dest_dir = 'assets/images/puntos'
images = os.listdir(src_dir)

# Load pts.json
with open('pts.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Map categories
cat_map = {
    "festivales y eventos.": "eventos",
    "turismo de naturaleza y actividades al aire libre.": "naturaleza",
    "cultura, artes y patrimonio.": "cultura",
    "infraestructura": "infraestructura"
}

for item in data:
    # 1. Map category
    cat_lower = item['category'].lower().strip()
    item['category'] = cat_map.get(cat_lower, 'otros')

    # 2. Tags array
    tags_str = item.get('tags', '')
    if isinstance(tags_str, str) and tags_str.strip():
        item['tags'] = [t.strip() for t in tags_str.split(',') if t.strip()]
    else:
        item['tags'] = []

    # 3. Match image
    title_norm = normalize(item['title'])
    best_match = ""
    for img in images:
        img_norm = normalize(img).replace('.webp', '')
        if img_norm in title_norm or title_norm in img_norm:
            best_match = img
            break
            
    # As fallback, let's try just the first few words
    if not best_match:
        words = title_norm.split()[:3]
        for img in images:
            img_norm = normalize(img)
            if all(w in img_norm for w in words if len(w)>3):
                best_match = img
                break

    if best_match:
        # copy image to assets/images/puntos/
        shutil.copy(os.path.join(src_dir, best_match), os.path.join(dest_dir, best_match))
        item['image'] = f"assets/images/puntos/{best_match}"
    else:
        print(f"Warning: No image found for title: {item['title']}")
        # Fallback empty or missing image
        item['image'] = "assets/images/puntos/default.webp"

with open('pts_processed.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Processing complete.")
