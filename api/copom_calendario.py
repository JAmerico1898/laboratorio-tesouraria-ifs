"""Calendário e decisões do Copom — edite após cada reunião.

`data` é o 2º dia da reunião (dia do anúncio). A nova Selic vale a partir do
dia útil seguinte. `estimada=True` marca datas ainda não oficiais.

Como atualizar, depois de cada reunião:
  1. Acrescente a reunião ao fim de DECISOES: id, número, data, Selic após a
     decisão (em decimal), variação em bps, unanimidade, uma frase-chave da ata
     e o link dela.
  2. Quando o BCB publicar o calendário de um ano marcado como estimado,
     corrija as datas em CALENDARIO e troque `estimada` para False.
  3. Rode `npm run snapshot`: ele confere a Selic digitada contra o BCB.
"""

# Reuniões já realizadas (ordem cronológica). selic em decimal, após a decisão.
DECISOES = [
    {"id": "R1/2026", "numero": 276, "data": "2026-01-28", "selic": 0.1500, "variacaoBps": 0,   "unanime": None, "fraseChave": None, "fonteUrl": None},
    {"id": "R2/2026", "numero": 277, "data": "2026-03-18", "selic": 0.1475, "variacaoBps": -25, "unanime": None, "fraseChave": None, "fonteUrl": None},
    {"id": "R3/2026", "numero": 278, "data": "2026-04-29", "selic": 0.1450, "variacaoBps": -25, "unanime": None, "fraseChave": None, "fonteUrl": None},
    {"id": "R4/2026", "numero": 279, "data": "2026-06-17", "selic": 0.1425, "variacaoBps": -25, "unanime": None, "fraseChave": None, "fonteUrl": None},
    {"id": "R5/2026", "numero": 280, "data": "2026-08-05", "selic": 0.1400, "variacaoBps": -25, "unanime": None, "fraseChave": None, "fonteUrl": None},
    {"id": "R6/2026", "numero": 281, "data": "2026-09-16", "selic": 0.1375, "variacaoBps": -25, "unanime": True,
     "fraseChave": "a magnitude do ciclo de calibração será ajustada à luz da evolução do cenário",
     "fonteUrl": "https://www.bcb.gov.br/content/copom/atascopom/Copom281-not20260916281.pdf"},
]

# Reuniões futuras e passadas (o código filtra pela data de referência).
CALENDARIO = [
    {"id": "R1/2026", "data": "2026-01-28", "estimada": False},
    {"id": "R2/2026", "data": "2026-03-18", "estimada": False},
    {"id": "R3/2026", "data": "2026-04-29", "estimada": False},
    {"id": "R4/2026", "data": "2026-06-17", "estimada": False},
    {"id": "R5/2026", "data": "2026-08-05", "estimada": False},
    {"id": "R6/2026", "data": "2026-09-16", "estimada": False},
    {"id": "R7/2026", "data": "2026-11-04", "estimada": False},
    {"id": "R8/2026", "data": "2026-12-09", "estimada": False},
    {"id": "R1/2027", "data": "2027-01-27", "estimada": False},
    {"id": "R2/2027", "data": "2027-03-17", "estimada": False},
    {"id": "R3/2027", "data": "2027-04-28", "estimada": False},
    {"id": "R4/2027", "data": "2027-06-16", "estimada": False},
    {"id": "R5/2027", "data": "2027-08-04", "estimada": False},
    {"id": "R6/2027", "data": "2027-09-22", "estimada": False},
    {"id": "R7/2027", "data": "2027-10-27", "estimada": False},
    {"id": "R8/2027", "data": "2027-12-08", "estimada": False},
    # 2028: calendário ainda não publicado — padrão de 2027
    {"id": "R1/2028", "data": "2028-01-26", "estimada": True},
    {"id": "R2/2028", "data": "2028-03-15", "estimada": True},
    {"id": "R3/2028", "data": "2028-05-03", "estimada": True},
    {"id": "R4/2028", "data": "2028-06-14", "estimada": True},
    {"id": "R5/2028", "data": "2028-08-02", "estimada": True},
    {"id": "R6/2028", "data": "2028-09-20", "estimada": True},
    {"id": "R7/2028", "data": "2028-10-25", "estimada": True},
    {"id": "R8/2028", "data": "2028-12-06", "estimada": True},
]
