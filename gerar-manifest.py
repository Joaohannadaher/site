#!/usr/bin/env python3
"""
Execute: python gerar-manifest.py
Escaneia a pasta /imagens2 e regenera manifest.js automaticamente.
Rode sempre que adicionar ou remover fotos.
"""
import os, json

BASE = "imagens2"
SAIDA = "manifest.js"
EXTENSOES = {'.avif', '.jpg', '.jpeg', '.png', '.webp'}

# Mapeamento: nome exato da pasta → id usado nas páginas HTML
MAPA = {
    "Área com 72.000m²":                          "area-72000",
    "Jardim Novo Mundo - Rua Campina Grande e Anápolis": "jardim-novo-mundo",
    "Jardim Presidente - Cabeça da quadra 39":     "jardim-presidente-q39",
    "Mendanha":                                    "mendanha",
    "Santa Genoveva - Quadra 169 e 164":           "santa-genoveva-q169",
    "Santa Genoveva - Quadra 87":                  "santa-genoveva-q87",
    "Santa GenovevaCabeça da quadra 150":          "santa-genoveva-q150",
}

manifest = {"imoveis": {}}

for pasta_nome, imovel_id in MAPA.items():
    pasta_path = os.path.join(BASE, pasta_nome)
    fotos = []
    if os.path.isdir(pasta_path):
        fotos = sorted([
            f for f in os.listdir(pasta_path)
            if os.path.splitext(f)[1].lower() in EXTENSOES
        ])
    manifest["imoveis"][imovel_id] = {
        "pasta": pasta_nome,
        "fotos": fotos
    }

dados_json = json.dumps(manifest, ensure_ascii=False, indent=2)

with open(SAIDA, "w", encoding="utf-8") as f:
    f.write("// GERADO AUTOMATICAMENTE — rode gerar-manifest.py para atualizar\n")
    f.write(f"window.MANIFEST = {dados_json};\n")

total = sum(len(v["fotos"]) for v in manifest["imoveis"].values())
print(f"✅ {SAIDA} gerado — {total} fotos em {len(manifest['imoveis'])} imóveis")
for id_, dados in manifest["imoveis"].items():
    print(f"   {len(dados['fotos']):2d} fotos  {dados['pasta']}")
