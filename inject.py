import json

with open('pts_processed.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

new_objects = []
for item in data:
    tags_str = ", ".join([f'"{t}"' for t in item['tags']])
    obj = f'''  {{
    id: {item['id']}, category: "{item['category']}", title: "{item['title']}", 
    description: "{item['description']}", 
    lat: "{item['lat']}", lng: "{item['lng']}", image: "{item['image']}", 
    location: "{item['location']}", hours: "{item['hours']}", price: "{item['price']}", 
    tags: [{tags_str}]
  }}'''
    new_objects.append(obj)

new_items_str = ",\n" + ",\n".join(new_objects)

with open('assets/js/data.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the closing "];"
updated_content = content.replace('\n];', new_items_str + '\n];')

with open('assets/js/data.js', 'w', encoding='utf-8') as f:
    f.write(updated_content)

print("Injected into data.js")
