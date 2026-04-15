import pandas as pd
import json
import logging

df = pd.read_excel('consolidado_con_narrativas.xlsx')
# We need only the last 23 rows. Let's grab them.
# The user says "aca en consolidados estan 23 puntos mas"
data = df.tail(23).fillna('').to_dict(orient='records')

formatted = []
for i, row in enumerate(data):
    formatted.append({
        "id": 40 + i,
        "category": row.get('Categoría', ''),
        "title": row.get('Nombre o denominación', ''),
        "description": row.get('Descripción específica para incluir en la ruta, integrada con la narrativa sostenible definida por isa ruta costera', '') or row.get('Descripción especifica para incluir en la ruta', ''),
        "lat": "",
        "lng": "",
        "image": row.get('Fotografías (descripción o rotulación)', ''),
        "location": f"{row.get('Municipio', '')}., {row.get('Departamento', '')}.",
        "hours": row.get('Horario de atención', ''),
        "price": row.get('Rango de precio', ''),
        "tags": row.get('Tipo de servicio', '')
    })

with open('pts.json', 'w', encoding='utf-8') as f:
    json.dump(formatted, f, ensure_ascii=False, indent=2)
print("Done")
