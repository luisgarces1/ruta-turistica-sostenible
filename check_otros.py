import json
with open('mapa-interactivo/assets/js/data.js', encoding='utf-8') as f:
    text = f.read()
data_str = text.split('const mockData = ')[1].strip()
if data_str.endswith(';'): data_str = data_str[:-1]
data = json.loads(data_str)
for d in data:
    if d['category'] == 'otros':
        print(f"Lat: {d['lat']}, Lng: {d['lng']} | {d['title']}")
