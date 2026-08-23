"""Gera o snapshot commitado do Módulo 5.

    python scripts/gerar-snapshot.py [YYYY-MM-DD]

Sem argumento, usa a data de ancoragem das pautas. O JSON produzido é o mesmo
que `/api/mercado` devolve — a função `construir_snapshot` é compartilhada,
então formato de contingência e formato ao vivo não podem divergir.
"""

import datetime as dt
import json
import pathlib
import sys

RAIZ = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ / "api"))

from mercado import resolver  # noqa: E402

# Data de ancoragem das 6 pautas. As árvores de decisão afirmam fatos
# qualitativos sobre a curva ("desenha um U", "acima da banda") que só valem
# para este dia; ver §1 do contrato de implementação.
DATA_ANCORA = dt.date(2026, 8, 21)

destino = RAIZ / "public" / "data" / "mercado-fallback.json"


def main() -> int:
    data = dt.date.fromisoformat(sys.argv[1]) if len(sys.argv) > 1 else DATA_ANCORA
    print(f"Gerando snapshot para {data:%d/%m/%Y}...")
    snap = resolver(data)
    if not snap["curvas"]:
        print("FALHA:", snap.get("error"), file=sys.stderr)
        return 1
    destino.parent.mkdir(parents=True, exist_ok=True)
    destino.write_text(json.dumps(snap, ensure_ascii=False, indent=1), encoding="utf-8")
    n_v = sum(len(c["vertices"]) for c in snap["curvas"])
    print(f"OK  {destino.relative_to(RAIZ)}")
    print(f"    data efetiva: {snap['dataEfetiva']}  |  {len(snap['curvas'])} curvas  |  {n_v} vertices")
    print(f"    {destino.stat().st_size / 1024:.0f} kB")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
