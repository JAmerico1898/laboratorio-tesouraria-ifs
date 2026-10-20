"""Endpoint único do Módulo 5 — Mercado Hoje.

Padrão de handler idêntico ao de `laboratorio-mercado-financeiro`:
BaseHTTPRequestHandler, sem FastAPI.

    GET /api/mercado?date=YYYY-MM-DD&bloco=taxas|precos|termo|implicita|all

Este arquivo é também a fonte única do snapshot: `scripts/gerar-snapshot.py`
importa `construir_snapshot` daqui, para que o JSON de contingência e a
resposta ao vivo nunca divirjam de formato.
"""

from __future__ import annotations

import datetime as dt
import functools
import json
import math
import os
import sys
import urllib.request
from http.server import BaseHTTPRequestHandler
from typing import Any
from urllib.parse import parse_qs, quote, urlparse

import pyield as yd

# Garante o import do módulo irmão qualquer que seja o diretório de trabalho.
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from copom_calendario import CALENDARIO, DECISOES  # noqa: E402

MAX_TENTATIVAS_DATA = 10
MAX_RECUO_VNA = 45
MAX_REUNIOES = 18

OLINDA = "https://olinda.bcb.gov.br/olinda/servico/Expectativas/versao/v1/odata/"
# A Olinda responde em ~0,2 s. O teto é curto de propósito: o cliente desiste
# da API em 40 s, e um Focus lento não pode custar o painel inteiro.
TIMEOUT_FOCUS_S = 4

# O painel ao vivo só exibe curvas. Indicadores e âncoras dependem de fontes
# lentas e instáveis (planilha de VNAs do Tesouro: 15-25 s por instância fria;
# PTAX do BCB: até 12 s) que estouravam o limite do cliente e jogavam o painel
# na contingência. Só `scripts/gerar-snapshot.py` desliga este atalho, porque
# as pautas leem indicadores e âncoras do snapshot commitado.
SO_CURVAS = True

# Os blocos pedem as mesmas séries várias vezes (NTN-B 4×, DI1 3×, PRE 2×).
# O cache vale só durante um `construir_snapshot`, que o limpa ao começar:
# um dia ainda não publicado não pode ficar preso vazio na instância.
_ntnb_dados = functools.lru_cache(maxsize=None)(yd.ntnb.dados)
_curva_pre = functools.lru_cache(maxsize=None)(yd.tpf.curva_pre)
_futuro = functools.lru_cache(maxsize=None)(yd.futuro.historico)


# ── utilitários ────────────────────────────────────────────────────────────


def _num(v: Any) -> float | None:
    """Converte para float JSON-serializável; NaN/None/inf viram None."""
    if v is None:
        return None
    try:
        f = float(v)
    except (TypeError, ValueError):
        return None
    if math.isnan(f) or math.isinf(f):
        return None
    return f


def _iso(v: Any) -> str | None:
    if v is None:
        return None
    if isinstance(v, (dt.date, dt.datetime)):
        return v.strftime("%Y-%m-%d")
    return str(v)


def _br(d: dt.date) -> str:
    """pyield aceita a data no formato DD-MM-AAAA."""
    return d.strftime("%d-%m-%Y")


def _vertice(
    rotulo: str,
    vencimento: Any,
    dias_uteis: Any,
    taxa: Any,
    pu: Any = None,
    duration: Any = None,
    dv01: Any = None,
    nota: str | None = None,
) -> dict[str, Any]:
    v: dict[str, Any] = {
        "rotulo": rotulo,
        "vencimento": _iso(vencimento),
        "diasUteis": int(dias_uteis) if dias_uteis is not None else 0,
        "taxa": _num(taxa),
    }
    if pu is not None:
        v["pu"] = _num(pu)
    if duration is not None:
        v["duration"] = _num(duration)
    if dv01 is not None:
        v["dv01"] = _num(dv01)
    if nota:
        v["nota"] = nota
    return v


def _curva(
    id_: str,
    familia: str,
    nome: str,
    fonte: str,
    unidade: str,
    convencao: str,
    vertices: list[dict[str, Any]],
) -> dict[str, Any]:
    vertices = [v for v in vertices if v["diasUteis"] > 0]
    vertices.sort(key=lambda v: v["diasUteis"])
    return {
        "id": id_,
        "familia": familia,
        "nome": nome,
        "fonte": fonte,
        "unidade": unidade,
        "convencao": convencao,
        "vertices": vertices,
    }


MESES_PT = ("jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez")


def _rotulo_venc(v: Any) -> str:
    """"mai/27" — mês abreviado em português, independente do locale do runner."""
    if isinstance(v, (dt.date, dt.datetime)):
        return f"{MESES_PT[v.month - 1]}/{v.year % 100:02d}"
    return str(v)


def _rotulo_tpf(titulo: Any, venc: Any) -> str:
    """"NTN-B 2035" para papel longo, "LTN out/26" para curto."""
    if not isinstance(venc, (dt.date, dt.datetime)):
        return str(titulo)
    return f"{titulo} {venc.year}" if str(titulo).startswith("NTN-B") else f"{titulo} {_rotulo_venc(venc)}"


# ── blocos ─────────────────────────────────────────────────────────────────


def _bloco_taxas(data: dt.date) -> list[dict[str, Any]]:
    d = _br(data)
    curvas: list[dict[str, Any]] = []

    pre = _curva_pre(d).to_dicts()
    curvas.append(
        _curva(
            "pre-zero",
            "taxas",
            "PRE zero-cupom (ANBIMA)",
            "ANBIMA",
            "taxa",
            "du252",
            [
                _vertice(_rotulo_venc(r["data_vencimento"]), r["data_vencimento"], r["dias_uteis"], r["taxa_zero"])
                for r in pre
            ],
        )
    )

    di1 = _futuro(d, "DI1").to_dicts()
    curvas.append(
        _curva(
            "di1",
            "taxas",
            "DI Futuro (B3)",
            "B3",
            "taxa",
            "du252",
            [
                _vertice(
                    r["codigo_negociacao"], r["data_vencimento"], r["dias_uteis"], r["taxa_ajuste"], dv01=r.get("dv01")
                )
                for r in di1
            ],
        )
    )

    ntnb = _ntnb_dados(d).to_dicts()
    curvas.append(
        _curva(
            "ntnb-zero",
            "taxas",
            "Juro real zero (NTN-B)",
            "ANBIMA",
            "taxa",
            "du252",
            [
                _vertice(
                    _rotulo_tpf(r["titulo"], r["data_vencimento"]), r["data_vencimento"], r["dias_uteis"], r["taxa_zero"],
                    pu=r.get("pu"), duration=r.get("duration"), dv01=r.get("dv01"),
                )
                for r in ntnb
            ],
        )
    )
    curvas.append(
        _curva(
            "ntnb-tir",
            "taxas",
            "TIR real (NTN-B)",
            "ANBIMA",
            "taxa",
            "du252",
            [
                _vertice(
                    _rotulo_tpf(r["titulo"], r["data_vencimento"]), r["data_vencimento"], r["dias_uteis"], r["taxa_indicativa"],
                    pu=r.get("pu"), duration=r.get("duration"), dv01=r.get("dv01"),
                )
                for r in ntnb
            ],
        )
    )

    dap = yd.futuro.historico(d, "DAP").to_dicts()
    dap_v = [
        _vertice(r["codigo_negociacao"], r["data_vencimento"], r["dias_uteis"], r["taxa_ajuste"])
        for r in dap
    ]
    dap_v.sort(key=lambda v: v["diasUteis"])
    if dap_v:
        dap_v[0]["nota"] = "1º vencimento distorcido pela defasagem de indexação"
    curvas.append(
        _curva("dap", "taxas", "Cupom de IPCA (DAP)", "B3", "taxa", "du252", dap_v)
    )

    # DDI e FRC: base linear 360 dias corridos. O 1º vencimento do DDI é
    # distorcido pelo casado — marcado, nunca removido.
    ddi = yd.futuro.historico(d, "DDI").to_dicts()
    ddi_v = [
        _vertice(r["codigo_negociacao"], r["data_vencimento"], r["dias_uteis"], r["taxa_ajuste"])
        for r in ddi
    ]
    ddi_v.sort(key=lambda v: v["diasUteis"])
    if ddi_v:
        ddi_v[0]["nota"] = "1º vencimento distorcido pelo casado"
    curvas.append(
        _curva("ddi", "taxas", "Cupom cambial sujo (DDI)", "B3", "taxa", "linear360", ddi_v)
    )

    frc = yd.futuro.historico(d, "FRC").to_dicts()
    curvas.append(
        _curva(
            "frc",
            "taxas",
            "FRA de cupom cambial (FRC)",
            "B3",
            "taxa",
            "linear360",
            [
                _vertice(r["codigo_negociacao"], r["data_vencimento"], r["dias_uteis"], r["taxa_ajuste"])
                for r in frc
            ],
        )
    )
    return curvas


def _bloco_precos(data: dt.date) -> list[dict[str, Any]]:
    d = _br(data)
    curvas: list[dict[str, Any]] = []
    for id_, nome, fn in (
        ("ltn-pu", "PU LTN", yd.ltn.dados),
        ("ntnf-pu", "PU NTN-F", yd.ntnf.dados),
        ("ntnb-pu", "PU NTN-B", _ntnb_dados),
        ("lft-pu", "PU LFT", yd.lft.dados),
    ):
        rows = fn(d).to_dicts()
        curvas.append(
            _curva(
                id_,
                "precos",
                nome,
                "ANBIMA",
                "taxa",
                "du252",
                [
                    _vertice(
                        _rotulo_tpf(r["titulo"], r["data_vencimento"]), r["data_vencimento"], r["dias_uteis"], r.get("taxa_indicativa"),
                        pu=r.get("pu"), duration=r.get("duration"), dv01=r.get("dv01"),
                    )
                    for r in rows
                ],
            )
        )
    return curvas


def _bloco_termo(data: dt.date) -> list[dict[str, Any]]:
    d = _br(data)
    curvas: list[dict[str, Any]] = []

    fwd_ltn = yd.ltn.taxas_forward(d).to_dicts()
    curvas.append(
        _curva(
            "fwd-pre",
            "termo",
            "Forward do PRE",
            "ANBIMA",
            "taxa",
            "du252",
            [
                _vertice(_rotulo_venc(r["data_vencimento"]), r["data_vencimento"], r["dias_uteis"], r["taxa_forward"])
                for r in fwd_ltn
            ],
        )
    )

    di1 = _futuro(d, "DI1").to_dicts()
    curvas.append(
        _curva(
            "fwd-di",
            "termo",
            "Forward do DI",
            "B3",
            "taxa",
            "du252",
            [
                _vertice(r["codigo_negociacao"], r["data_vencimento"], r["dias_uteis"], r.get("taxa_forward"))
                for r in di1
            ],
        )
    )

    ntnb = _ntnb_dados(d).to_dicts()
    curvas.append(
        _curva(
            "fwd-real",
            "termo",
            "Forward do juro real",
            "ANBIMA",
            "taxa",
            "du252",
            [
                _vertice(_rotulo_tpf(r["titulo"], r["data_vencimento"]), r["data_vencimento"], r["dias_uteis"], r.get("taxa_forward"))
                for r in ntnb
            ],
        )
    )

    # Forward da inflação implícita: yd.forwards sobre a coluna do próprio ntnb.
    du = [r["dias_uteis"] for r in ntnb]
    imp = [r.get("inflacao_implicita") for r in ntnb]
    fwd_imp: list[Any] = [None] * len(ntnb)
    if any(x is not None and not (isinstance(x, float) and math.isnan(x)) for x in imp):
        try:
            fwd_imp = list(yd.forwards(du, imp))
        except Exception:
            fwd_imp = [None] * len(ntnb)
    curvas.append(
        _curva(
            "fwd-implicita",
            "termo",
            "Forward da inflação implícita",
            "ANBIMA",
            "taxa",
            "du252",
            [
                _vertice(_rotulo_tpf(r["titulo"], r["data_vencimento"]), r["data_vencimento"], r["dias_uteis"], f)
                for r, f in zip(ntnb, fwd_imp)
            ],
        )
    )
    return curvas


def _bloco_implicita(data: dt.date) -> list[dict[str, Any]]:
    d = _br(data)
    curvas: list[dict[str, Any]] = []

    ntnb = _ntnb_dados(d).to_dicts()
    venc_b = [r["data_vencimento"] for r in ntnb]
    tir_b = [r["taxa_indicativa"] for r in ntnb]

    pre = _curva_pre(d).to_dicts()
    di1 = _futuro(d, "DI1").to_dicts()

    for id_, nome, venc_n, taxa_n in (
        ("be-ntnb-pre", "Break-even NTN-B × PRE",
         [r["data_vencimento"] for r in pre], [r["taxa_zero"] for r in pre]),
        ("be-ntnb-di", "Break-even NTN-B × DI",
         [r["data_vencimento"] for r in di1], [r["taxa_ajuste"] for r in di1]),
    ):
        rows = yd.ntnb.implicitas(d, venc_b, tir_b, venc_n, taxa_n).to_dicts()
        curvas.append(
            _curva(
                id_,
                "implicita",
                nome,
                "ANBIMA",
                "taxa",
                "du252",
                [
                    _vertice(
                        _rotulo_venc(r["data_vencimento"]), r["data_vencimento"], r["dias_uteis"],
                        r.get("inflacao_implicita"),
                        nota=None if _num(r.get("inflacao_implicita")) is not None
                        else "fora do alcance da curva nominal",
                    )
                    for r in rows
                ],
            )
        )

    # Spread PRE − DI, em pontos-base, por papel. `premios_pre` não traz
    # dias_uteis — junta-se por data de vencimento contra LTN e NTN-F.
    prazos: dict[Any, int] = {}
    for fn in (yd.ltn.dados, yd.ntnf.dados):
        for r in fn(d).to_dicts():
            prazos[r["data_vencimento"]] = int(r["dias_uteis"])
    premios = yd.tpf.premios_pre(d, pontos_base=True).to_dicts()
    curvas.append(
        _curva(
            "spread-pre-di",
            "implicita",
            "Spread PRE − DI",
            "ANBIMA",
            "bps",
            "du252",
            [
                _vertice(_rotulo_tpf(r["titulo"], r["data_vencimento"]), r["data_vencimento"], prazos.get(r["data_vencimento"], 0), r["premio"])
                for r in premios
            ],
        )
    )

    # Break-even forward entre vértices da implícita contra PRE.
    base = next(c for c in curvas if c["id"] == "be-ntnb-pre")
    validos = [v for v in base["vertices"] if v["taxa"] is not None]
    fwd: list[Any] = []
    if len(validos) >= 2:
        try:
            fwd = list(yd.forwards([v["diasUteis"] for v in validos], [v["taxa"] for v in validos]))
        except Exception:
            fwd = []
    curvas.append(
        _curva(
            "be-forward",
            "implicita",
            "Break-even forward",
            "ANBIMA",
            "taxa",
            "du252",
            [
                _vertice(v["rotulo"], v["vencimento"], v["diasUteis"], f)
                for v, f in zip(validos, fwd)
            ],
        )
    )
    return curvas


def _indicadores(data: dt.date) -> dict[str, Any]:
    d = _br(data)

    # yd.ntnb.vna devolve NaN para datas posteriores ao último número-índice
    # do IPCA publicado. Recua até achar o último publicado e projeta a partir
    # dele — obrigatório, não opcional (§12 da spec).
    vna_base: float | None = None
    vna_base_data: str | None = None
    for i in range(MAX_RECUO_VNA):
        alvo = data - dt.timedelta(days=i)
        try:
            v = _num(yd.ntnb.vna(_br(alvo)))
        except Exception:
            v = None
        if v is not None:
            vna_base, vna_base_data = v, alvo.strftime("%Y-%m-%d")
            break

    try:
        ipca_proj = _num(yd.ipca.taxa_projetada().valor_projetado)
    except Exception:
        ipca_proj = None

    # Atenção às unidades: `taxa_projetada().valor_projetado` vem em decimal
    # (-0,002 = -0,2% no mês), enquanto `vna_projetado` espera a inflação em
    # percentual (0,45 = 0,45%). Daí o × 100.
    vna_proj: float | None = None
    if vna_base is not None and ipca_proj is not None:
        try:
            vna_proj = _num(yd.ntnb.vna_projetado(d, vna_base, ipca_proj * 100))
        except Exception:
            vna_proj = None

    def _safe(fn):
        try:
            return _num(fn(d))
        except Exception:
            return None

    return {
        "selicMeta": _safe(yd.selic.meta),
        "diOver": _safe(yd.di_over),
        "ptax": _safe(yd.ptax),
        "vnaNtnb": vna_base,
        "vnaNtnbData": vna_base_data,
        "vnaNtnbProjetado": vna_proj,
        "vnaLft": _safe(yd.lft.vna),
        "ipcaProjetado": ipca_proj,
    }


def _olinda(recurso: str, filtro: str, extra: str = "") -> list[dict[str, Any]]:
    url = f"{OLINDA}{recurso}?$format=json&$filter={quote(filtro)}{extra}"
    with urllib.request.urlopen(url, timeout=TIMEOUT_FOCUS_S) as r:
        return json.load(r)["value"]


def _focus(data: dt.date) -> tuple[dict[str, Any], dict[str, float]]:
    """Pesquisa Focus mais recente já publicada em `data` (sem look-ahead).

    O boletim sai no primeiro dia útil da semana, com dados até a sexta
    anterior. A Olinda guarda medianas diárias, então exige-se data-base
    anterior à segunda-feira da última semana cujo boletim já saiu em `data`.

    Devolve o bloco `focus` e o dicionário reunião → mediana da Selic. Lança na
    primeira consulta que falhar: as seguintes dependem da data-base.
    """
    iso = data.strftime("%Y-%m-%d")
    segunda = data - dt.timedelta(days=data.weekday())
    if str(yd.du.deslocar(segunda.strftime("%Y-%m-%d"), 0))[:10] > iso:
        segunda -= dt.timedelta(days=7)
    corte = segunda.strftime("%Y-%m-%d")
    base = _olinda(
        "ExpectativasMercadoAnuais",
        f"Indicador eq 'Selic' and baseCalculo eq 0 and Data lt '{corte}'",
        "&$top=1&$orderby=Data%20desc&$select=Data",
    )[0]["Data"]

    anos = {str(a) for a in range(data.year, data.year + 5)}
    anuais: dict[str, dict[str, float]] = {"Selic": {}, "IPCA": {}}
    for r in _olinda(
        "ExpectativasMercadoAnuais",
        f"(Indicador eq 'Selic' or Indicador eq 'IPCA') and baseCalculo eq 0 and Data eq '{base}'",
        "&$top=40&$select=Indicador,DataReferencia,Mediana",
    ):
        if r["DataReferencia"] in anos and r["Mediana"] is not None:
            anuais[r["Indicador"]][r["DataReferencia"]] = round(r["Mediana"] / 100, 6)

    # A OData ordena `Reuniao` como texto; a ordem da resposta não é usada.
    por_reuniao = {
        r["Reuniao"]: round(r["Mediana"] / 100, 6)
        for r in _olinda(
            "ExpectativasMercadoSelic",
            f"baseCalculo eq 0 and Data eq '{base}'",
            "&$top=60&$select=Reuniao,Mediana",
        )
        if r["Mediana"] is not None
    }

    ipca12 = _olinda(
        "ExpectativasMercadoInflacao12Meses",
        f"Indicador eq 'IPCA' and baseCalculo eq 0 and Suavizada eq 'S' and Data le '{base}'",
        "&$top=1&$orderby=Data%20desc&$select=Data,Mediana",
    )
    focus = {
        "dataBase": base,
        "selicAnual": dict(sorted(anuais["Selic"].items())),
        "ipcaAnual": dict(sorted(anuais["IPCA"].items())),
        "ipca12m": round(ipca12[0]["Mediana"] / 100, 6) if ipca12 else None,
    }
    return focus, por_reuniao


def _ancoras(data: dt.date, pedida: dt.date | None = None) -> dict[str, Any]:
    """Âncoras do card: Focus, reuniões futuras do Copom e última decisão.

    O Focus é o disponível em `pedida` (o dia em que a mesa lê a curva), que
    pode ser posterior à data do dado. Nunca lança: falha parcial vira `None`/lista vazia mais uma linha em `avisos`.
    """
    iso = data.strftime("%Y-%m-%d")
    avisos: list[str] = []

    focus: dict[str, Any] | None = None
    por_reuniao: dict[str, float] = {}
    try:
        focus, por_reuniao = _focus(pedida or data)
    except Exception:  # noqa: BLE001 — o Focus nunca derruba o snapshot
        avisos.append("Focus indisponível no momento")

    reunioes: list[dict[str, Any]] = []
    try:
        for r in [c for c in CALENDARIO if c["data"] > iso][:MAX_REUNIOES]:
            efetiva = yd.du.deslocar(r["data"], 1)
            reunioes.append(
                {
                    "id": r["id"],
                    "dataDecisao": r["data"],
                    "duEfetiva": int(yd.du.contar(data, efetiva)),
                    "estimada": r["estimada"],
                    "focusSelic": por_reuniao.get(r["id"]),
                }
            )
    except Exception:  # noqa: BLE001
        reunioes = []
        avisos.append("Calendário do Copom indisponível no momento")

    passadas = [d for d in DECISOES if d["data"] <= iso]
    ultimo = None
    if passadas:
        ultimo = {k: v for k, v in passadas[-1].items() if k != "data"}
        ultimo["dataDecisao"] = passadas[-1]["data"]

    return {"focus": focus, "reunioes": reunioes, "ultimoCopom": ultimo, "avisos": avisos}


# Rótulo do eixo Y de cada curva. Fica aqui, e não no componente, porque é
# aqui que se sabe qual campo do pyield alimentou a série.
ROTULO_Y = {
    "pre-zero": "Taxa zero-cupom (% a.a.)",
    "di1": "Taxa de ajuste (% a.a.)",
    "ntnb-zero": "Taxa zero real (% a.a.)",
    "ntnb-tir": "TIR real (% a.a.)",
    "dap": "Cupom de IPCA (% a.a.)",
    "ddi": "Cupom cambial sujo (% a.a., linear 360)",
    "frc": "Cupom cambial limpo (% a.a., linear 360)",
    "ltn-pu": "Taxa indicativa (% a.a.)",
    "ntnf-pu": "Taxa indicativa (% a.a.)",
    "ntnb-pu": "TIR real (% a.a.)",
    "lft-pu": "Ágio/deságio sobre a Selic (% a.a.)",
    "fwd-pre": "Taxa a termo entre vértices (% a.a.)",
    "fwd-di": "Taxa a termo entre vértices (% a.a.)",
    "fwd-real": "Taxa real a termo entre vértices (% a.a.)",
    "fwd-implicita": "Inflação implícita a termo (% a.a.)",
    "be-ntnb-pre": "Inflação implícita (% a.a.)",
    "be-ntnb-di": "Inflação implícita (% a.a.)",
    "spread-pre-di": "Prêmio sobre o DI (bps)",
    "be-forward": "Inflação implícita a termo (% a.a.)",
}


BLOCOS = {
    "taxas": _bloco_taxas,
    "precos": _bloco_precos,
    "termo": _bloco_termo,
    "implicita": _bloco_implicita,
}


def construir_snapshot(
    data: dt.date, bloco: str = "all", pedida: dt.date | None = None
) -> dict[str, Any]:
    """Monta o payload de uma data que sabidamente tem dado."""
    for cache in (_ntnb_dados, _curva_pre, _futuro):
        cache.cache_clear()
    escolhidos = BLOCOS.keys() if bloco == "all" else [bloco]
    curvas: list[dict[str, Any]] = []
    for nome in escolhidos:
        curvas.extend(BLOCOS[nome](data))
    for c in curvas:
        c["rotuloY"] = ROTULO_Y.get(c["id"], "Taxa (% a.a.)")
    return {
        "dataSolicitada": data.strftime("%Y-%m-%d"),
        "dataEfetiva": data.strftime("%Y-%m-%d"),
        "contingencia": False,
        "indicadores": {} if SO_CURVAS else _indicadores(data),
        "curvas": curvas,
        "ancoras": None if SO_CURVAS else _ancoras(data, pedida),
    }


def resolver(data_pedida: dt.date, bloco: str = "all") -> dict[str, Any]:
    """Recua até 10 dias corridos até achar uma data com dado publicado."""
    ultimo_erro = ""
    for i in range(MAX_TENTATIVAS_DATA):
        alvo = data_pedida - dt.timedelta(days=i)
        try:
            snap = construir_snapshot(alvo, bloco, data_pedida)
            if any(c["vertices"] for c in snap["curvas"]):
                snap["dataSolicitada"] = data_pedida.strftime("%Y-%m-%d")
                return snap
        except Exception as e:  # noqa: BLE001 — nunca vazar stack trace ao aluno
            ultimo_erro = f"{type(e).__name__}: {e}"
    return {
        "dataSolicitada": data_pedida.strftime("%Y-%m-%d"),
        "dataEfetiva": None,
        "contingencia": True,
        "error": (
            "Não há dado publicado nos 10 dias anteriores à data pedida, ou a "
            "fonte (ANBIMA/B3) está indisponível no momento."
        ),
        "detalhe": ultimo_erro,
        "indicadores": {},
        "curvas": [],
    }


class handler(BaseHTTPRequestHandler):  # noqa: N801 — contrato da Vercel
    def do_GET(self):  # noqa: N802 — contrato do BaseHTTPRequestHandler
        q = parse_qs(urlparse(self.path).query)
        bruta = (q.get("date") or [""])[0]
        bloco = (q.get("bloco") or ["all"])[0]

        if bloco not in BLOCOS and bloco != "all":
            return self._json({"error": f"bloco inválido: {bloco}"}, 400)

        if not bruta:
            return self._json({"error": "parâmetro 'date' é obrigatório (YYYY-MM-DD)"}, 400)
        try:
            data = dt.date.fromisoformat(bruta)
        except ValueError:
            return self._json({"error": "formato de data inválido; use YYYY-MM-DD"}, 400)

        snap = resolver(data, bloco)
        self._json(snap, 200 if snap["curvas"] else 503)

    def _json(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)
