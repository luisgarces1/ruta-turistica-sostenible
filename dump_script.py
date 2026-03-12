import pandas as pd
import json

xl_path = '090326 Consolidado información herramienta nuevos puntos.xlsx'
xl = pd.ExcelFile(xl_path)

data = {}
for sheet in xl.sheet_names:
    if 'Listas' in sheet: continue
    df = pd.read_excel(xl_path, sheet_name=sheet)
    # Get columns and the first 2 rows
    data[sheet] = {
        'columns': list(df.columns),
        'sample': df.head(2).fillna('').to_dict('records')
    }

with open('dump_cols.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
