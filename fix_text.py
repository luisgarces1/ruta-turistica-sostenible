with open('assets/js/data.js', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('..', '.')
text = text.replace('.,', ',')

with open('assets/js/data.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Fixed periods in data.js")
