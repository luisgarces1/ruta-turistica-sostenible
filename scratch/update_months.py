
import os

file_path = r'l:\PORYECTOS DE PAGINAS\juan3\ruta-turistica-sostenible\mapa-interactivo\assets\js\data.js'

replacements = {
    'id: 13,': 'id: 13, eventMonth: 1,', # Feb
    'id: 30,': 'id: 30, eventMonth: 10,', # Nov
    'id: 38,': 'id: 38, eventMonth: 9,', # Oct
    'id: 40,': 'id: 40, eventMonth: 5,', # Jun
    'id: 43,': 'id: 43, eventMonth: 1,', # Feb
    'id: 44,': 'id: 44, eventMonth: 5,', # Jun
    'id: 46,': 'id: 46, eventMonth: 1,', # Feb
    'id: 47,': 'id: 47, eventMonth: 1,', # Feb
    'id: 48,': 'id: 48, eventMonth: 1,', # Feb
    'id: 49,': 'id: 49, eventMonth: 7,', # Aug
    'id: 50,': 'id: 50, eventMonth: 6,', # Jul
    'id: 51,': 'id: 51, eventMonth: 6,', # Jul
    'id: 55,': 'id: 55, eventMonth: 10,', # Nov
    'id: 57,': 'id: 57, eventMonth: 5,', # Jun
    'id: 59,': 'id: 59, eventMonth: 10,', # Nov
    'id: 61,': 'id: 61, eventMonth: 1,', # Feb
    'id: 62,': 'id: 62, eventMonth: 1,', # Feb
}

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

for old, new in replacements.items():
    content = content.replace(old, new)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Replacement complete.")
