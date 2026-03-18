#!/usr/bin/env python3
"""
Execute: python gerar-fotos.py
Escaneia /imagens2 e gera fotos.json com a lista real de arquivos de cada pasta.
Rode sempre que adicionar, remover ou renomear fotos.
"""
import os, json

BASE      = "imagens2"
SAIDA     = "fotos.json"
EXTENSOES = {'.avif', '.jpg', '.jpeg', '.png', '.webp'}

# id da página HTML → nome exato da pasta em /imagens2/
MAPA = {
    "area-72000":            "Área com 72.000m²",
    "jardim-novo-mundo":     "Área 393",
    "jardim-presidente-q39": "Cabeça da Quadra 39",
    "santa-genoveva-q150":   "Cabeça da Quadra 150",
    "mendanha":              "O Topo da Cidade",
    "santa-genoveva-q87":    "Quadra 87",
    "santa-genoveva-q169":   "Quadras 169164",
}

resultado = {}
total = 0

for imovel_id, pasta_nome in MAPA.items():
    pasta_path = os.path.join(BASE, pasta_nome)
    fotos = []
    if os.path.isdir(pasta_path):
        fotos = sorted([
            f for f in os.listdir(pasta_path)
            if os.path.splitext(f)[1].lower() in EXTENSOES
        ])
    resultado[imovel_id] = {"pasta": pasta_nome, "fotos": fotos}
    total += len(fotos)
    status = f"{len(fotos):2d} fotos"
    aviso  = " ⚠️  pasta não encontrada" if not os.path.isdir(pasta_path) else ""
    print(f"  {status}  {pasta_nome}{aviso}")

with open(SAIDA, "w", encoding="utf-8") as f:
    json.dump(resultado, f, ensure_ascii=False, indent=2)

print(f"\n✅ {SAIDA} gerado — {total} fotos em {len(resultado)} imóveis")
