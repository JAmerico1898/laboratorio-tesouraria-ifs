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
