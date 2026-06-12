export type Level = "int" | "adv";

export type Tone = "pos" | "neg" | "neu";

export interface Option {
  id: string; // "a" | "b" | "c" | "d"
  text: string;
  correct?: boolean; // true na alternativa certa da etapa/reflexão
}

export interface Etapa {
  id: string; // "etapa-1"
  titulo: string; // "Etapa 1 — Custo overnight"
  enunciado: string; // pode conter <b>, <code>, <i>
  opcoes: Option[];
  feedback: string; // explicação exibida após acerto/erro
  pontos: number; // 20 por etapa
}

export interface Delta {
  k: string;
  v: string;
  tone: Tone;
}

export interface Branch {
  id: string; // "A" | "B" | "C"
  rotulo: string; // "ALONGAR DÍVIDA"
  titulo: string;
  resumo: string;
  resultado: {
    titulo: string;
    deltas: Delta[];
    analise: string;
    risco?: boolean; // caixa em vermelho se a análise destaca risco
  };
}

export interface Reflexao {
  enunciado: string;
  opcoes: Option[];
  feedback: string;
  pontos: number; // 25
}

export interface Chip {
  k: string;
  v: string;
}

export interface Scenario {
  id: string; // "s1-1"
  codigo: string; // "S1.1"
  empresa: string; // subtítulo do breadcrumb, ex.: "Banco médio"
  titulo: string;
  nivel: Level;
  duracaoMin: number;
  contexto: string; // HTML rico (b/num/i)
  chips: Chip[];
  dadosMercado?: { titulo: string; corpo: string }; // caixa colapsável
  etapas: Etapa[]; // SEMPRE 3
  encruzilhada: { titulo: string; subtitulo: string; ramos: Branch[] };
  reflexao: Reflexao;
  pontuacaoMax: number; // 85
}

export interface ModuleMeta {
  id: string; // "modulo-1"
  numero: number; // 1
  slug: string; // "modulo-1"
  nav: string; // rótulo curto no menu, ex.: "Operações de Tesouraria"
  titulo: string; // título da landing do módulo
  descricao: string;
  icon: string; // nome do Material Symbol
  objetivos: string[];
  totalSimulacoes: number; // 4
  disponivel: boolean;
}

export interface Exhibit {
  id: string;
  titulo: string;
  colunas: string[];
  linhas: (string | number)[][];
  totalRow?: (string | number)[];
  nota?: string;
}

export interface Pergunta {
  id: string;
  enunciado: string;
  resolucao: string;
}

export interface RubricaItem {
  criterio: string;
  pontos: number;
  descricao: string;
}

export interface CaseStudy {
  id: string;
  codigo: string;
  modulo: string;
  titulo: string;
  situacao: string;
  chips: string[];
  exhibits: Exhibit[];
  perguntas: Pergunta[];
  entregavel: string;
  debrief: string;
  rubrica: RubricaItem[];
}

// ── Caso SVB (timeline + embedded checkpoints) ──────────────────────────────

export type SvbMarcoTipo = "normal" | "critico";

export interface SvbTimelineMarco {
  id: string;
  data: string;
  evento: string; // HTML
  numero?: string;
  modulos: string[];
  leitura: string;
  tipo: SvbMarcoTipo;
  cpId?: string; // referência ao checkpoint embutido neste marco
}

export interface SvbOpcao {
  id: string;
  texto: string; // HTML
  leituraCurso: boolean; // destaca como "leitura do curso"; não é certo/errado
  feedback: string; // HTML
}

export interface SvbCheckpoint {
  id: string;
  titulo: string;
  modulos: string[];
  contexto: string; // HTML
  pergunta: string;
  opcoes: SvbOpcao[];
  svbFez: string; // HTML — bloco vermelho
  ponte: string; // HTML — "↳ Ponte para o curso"
}

export interface SvbEspelhoLinha {
  dimensao: string;
  svbFez: string;
  cursoEnsina: string;
  modulos: string[];
}

export interface SvbReflexao {
  pergunta: string;
  modulos: string[];
  leituraCurso: string; // bloco colapsável
}

export interface CaseSvb {
  id: "svb";
  titulo: string;
  subtitulo: string;
  aviso: string;
  timeline: SvbTimelineMarco[];
  checkpoints: SvbCheckpoint[];
  espelho: SvbEspelhoLinha[];
  reflexao: SvbReflexao[];
}

// ── Caso Narrativo (checkpoint-based interactive case) ──────────────────────

export type CheckpointRotulo = "forte" | "parcial" | "armadilha" | "fraca";

export interface CpOpcao {
  id: string;
  texto: string;
  rotulo: CheckpointRotulo;
  esperada: boolean;
  feedback: string;
  continua?: string;
}

export interface CpCalculoGuiado {
  label: string;
  corpo: string; // HTML
}

export interface CpSegundaPergunta {
  pergunta: string;
  opcoes: CpOpcao[];
}

export interface Checkpoint {
  id: string;
  titulo: string;
  modulos: string[];
  cena: string; // HTML narrative
  calculo_guiado?: CpCalculoGuiado;
  pergunta: string;
  opcoes: CpOpcao[];
  segunda_pergunta?: CpSegundaPergunta;
}

export interface CaseNarrativo {
  id: string;
  titulo: string;
  subtitulo: string;
  chips: string[];
  dados: {
    curva: Record<string, number>;
    forwards: Record<string, number>;
    balanco: { dv01_juros: number; dv01_spread_liq: number; gap12m: number };
  };
  checkpoints: Checkpoint[];
}

// === CaseMtmLft ===
export interface MtmTimelineMarco {
  id: string;
  data: string;
  evento: string;
  modulos: string[];
  tipo: "normal" | "critico";
  cpId?: string;
  numero?: string;
  leitura?: string;
}

export interface MtmOpcao {
  id: string;
  texto: string;
  leituraCurso: boolean;
  feedback: string;
}

export interface MtmCheckpoint {
  id: string;
  titulo: string;
  modulos: string[];
  contexto: string;
  usaSimulador: boolean;
  simuladorDica?: string;
  pergunta: string;
  opcoes: MtmOpcao[];
  oQueAconteceu: string;
  ponte: string;
}

export interface MtmEspelhoLinha {
  dimensao: string;
  br2002: string;
  svb: string;
  cursoEnsina: string;
  modulos: string[];
}

export interface MtmReflexao {
  pergunta: string;
  modulos: string[];
  usaSimulador?: boolean;
}

export interface CaseMtmLft {
  id: "mtm-lft";
  titulo: string;
  subtitulo: string;
  aviso: string;
  timeline: MtmTimelineMarco[];
  checkpoints: MtmCheckpoint[];
  espelho: MtmEspelhoLinha[];
  reflexao: MtmReflexao[];
}
