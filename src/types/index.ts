// =====================================================================
// POUSADA PMS — Modelos TypeScript e Tipos do Sistema
// =====================================================================

export type SyncStatus = 'SYNCED' | 'PENDING' | 'ERROR' | 'CONFLICT';

export type StatusQuarto = 
  | 'LIVRE' 
  | 'RESERVADO' 
  | 'OCUPADO' 
  | 'LIMPEZA' 
  | 'MANUTENÇÃO' 
  | 'BLOQUEADO' 
  | 'FORA_DE_SERVICO';

export type StatusReserva = 
  | 'ORÇAMENTO' 
  | 'PRÉ_RESERVA' 
  | 'CONFIRMADA' 
  | 'CHECK_IN' 
  | 'HOSPEDADO' 
  | 'CHECK_OUT' 
  | 'CANCELADA' 
  | 'NO_SHOW';

export type OrigemReserva = 
  | 'DIRETA' 
  | 'TELEFONE' 
  | 'WHATSAPP' 
  | 'WEBSITE' 
  | 'BOOKING' 
  | 'AIRBNB' 
  | 'EXPEDIA' 
  | 'OUTRO';

export type TipoDocumento = 'CPF' | 'RG' | 'PASSAPORTE' | 'NIF' | 'OUTRO';

export type PerfilCodigo = 'ADMIN' | 'GERENTE' | 'RECEPCAO' | 'CAIXA' | 'LIMPEZA' | 'MANUTENCAO' | 'CONSULTA';

export interface PousadaConfig {
  id?: number;
  uuid: string;
  nome_fantasia: string;
  razao_social: string;
  cnpj_nif: string;
  inscricao_estadual?: string;
  email: string;
  telefone: string;
  whatsapp?: string;
  website?: string;
  logotipo_url?: string;
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  pais: string;
  moeda: 'BRL' | 'EUR' | 'USD';
  simbolo_moeda: string;
  idioma: 'pt-BR' | 'en' | 'es';
  fuso_horario: string;
  checkin_padrao: string; // '14:00'
  checkout_padrao: string; // '12:00'
  imposto_percentual: number;
  taxa_servico_percentual: number;
  num_recibo_atual: number;
  updated_at?: string;
}

export interface Usuario {
  id: number;
  uuid: string;
  nome: string;
  email: string;
  cargo: string;
  perfil_id: number;
  perfil_codigo: PerfilCodigo;
  ativo: boolean;
  ultimo_acesso?: string;
}

export interface CategoriaQuarto {
  id: number;
  uuid: string;
  nome: string;
  descricao?: string;
  capacidade_padrao: number;
  capacidade_maxima: number;
  tarifa_base: number;
  cor_hex: string;
  ativo: boolean;
}

export interface Quarto {
  id: number;
  uuid: string;
  numero: string; // ex: 'Q01'
  nome: string;
  categoria_id: number;
  andar: string;
  capacidade_adultos: number;
  capacidade_criancas: number;
  tipo_cama: string;
  area_m2: number;
  equipamentos?: string;
  status: StatusQuarto;
  ativo: boolean;
  observacoes?: string;
  sync_status?: SyncStatus;
  updated_at?: string;
}

export interface Hospede {
  id: number;
  uuid: string;
  nome_completo: string;
  tipo_documento: TipoDocumento;
  documento: string;
  data_nascimento?: string;
  nacionalidade: string;
  telefone: string;
  whatsapp?: string;
  email?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  pais: string;
  cep?: string;
  preferencias?: string;
  observacoes?: string;
  total_hospedagens: number;
  created_at?: string;
  sync_status?: SyncStatus;
}

export interface Reserva {
  id: number;
  uuid: string;
  codigo_reserva: string; // ex: 'RES-2026-001'
  hospede_id: number;
  quarto_id: number;
  data_checkin: string; // YYYY-MM-DD
  data_checkout: string; // YYYY-MM-DD
  hora_checkin_prevista?: string;
  hora_checkout_prevista?: string;
  adultos: number;
  criancas: number;
  valor_diaria: number;
  total_diarias: number;
  valor_desconto: number;
  valor_taxas: number;
  valor_total: number;
  valor_sinal_pago: number;
  saldo_restante: number;
  origem: OrigemReserva;
  status: StatusReserva;
  observacoes?: string;
  motivo_cancelamento?: string;
  data_cancelamento?: string;
  created_at?: string;
  updated_at?: string;
  sync_status?: SyncStatus;
}

export interface Produto {
  id: number;
  uuid: string;
  categoria_id: number;
  codigo?: string;
  nome: string;
  descricao?: string;
  tipo: 'PRODUTO' | 'SERVICO';
  preco_venda: number;
  preco_custo: number;
  estoque_atual: number;
  estoque_minimo: number;
  ativo: boolean;
}

export interface Consumo {
  id: number;
  uuid: string;
  reserva_id: number;
  quarto_id: number;
  produto_id: number;
  nome_produto?: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  data_lancamento: string;
  usuario_id: number;
  usuario_nome?: string;
  status_faturamento: 'PENDENTE' | 'FATURADO' | 'CANCELADO';
  observacoes?: string;
  sync_status?: SyncStatus;
}

export interface FormaPagamento {
  id: number;
  uuid: string;
  codigo: string;
  nome: string;
  taxa_operadora_percentual: number;
  ativo: boolean;
}

export interface Pagamento {
  id: number;
  uuid: string;
  reserva_id?: number;
  forma_pagamento_id: number;
  forma_pagamento_nome?: string;
  tipo: 'SINAL' | 'DIARIA' | 'CONSUMO' | 'CHECKOUT' | 'OUTRO';
  valor: number;
  data_pagamento: string;
  comprovante_codigo?: string;
  usuario_id: number;
  caixa_id?: number;
  observacoes?: string;
  created_at?: string;
  sync_status?: SyncStatus;
}

export interface Caixa {
  id: number;
  uuid: string;
  codigo: string;
  usuario_abertura_id: number;
  usuario_abertura_nome?: string;
  usuario_fechamento_id?: number;
  usuario_fechamento_nome?: string;
  data_hora_abertura: string;
  data_hora_fechamento?: string;
  saldo_inicial: number;
  total_entradas: number;
  total_saidas: number;
  saldo_esperado: number;
  saldo_informado?: number;
  diferenca?: number;
  resultado_fechamento: 'SOBRA' | 'FALTA' | 'ZERO' | 'ABERTO';
  status: 'ABERTO' | 'FECHADO';
  observacoes?: string;
}

export interface MovimentoCaixa {
  id: number;
  uuid: string;
  caixa_id: number;
  tipo: 'ENTRADA' | 'SAIDA' | 'SANGRIA' | 'SUPRIMENTO';
  categoria: string;
  descricao: string;
  valor: number;
  forma_pagamento_id?: number;
  forma_pagamento_nome?: string;
  pagamento_id?: number;
  data_hora: string;
  usuario_id: number;
  usuario_nome?: string;
}

export interface ContaFinanceira {
  id: number;
  uuid: string;
  tipo: 'RECEBER' | 'PAGAR';
  reserva_id?: number;
  hospede_id?: number;
  fornecedor?: string;
  categoria: string;
  descricao: string;
  valor_original: number;
  valor_liquidado: number;
  data_emissao: string;
  data_vencimento: string;
  data_liquidacao?: string;
  status: 'PENDENTE' | 'PAGO' | 'RECEBIDO' | 'CANCELADO' | 'ATRASADO';
  observacoes?: string;
}

export interface ReciboItem {
  descricao: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
}

export interface Recibo {
  id: number;
  uuid: string;
  numero_recibo: string;
  reserva_id: number;
  hospede_id: number;
  hospede_nome: string;
  hospede_documento: string;
  quarto_id: number;
  quarto_numero: string;
  periodo: string;
  itens: ReciboItem[];
  subtotal: number;
  desconto: number;
  taxas: number;
  total: number;
  pagamentos: Array<{ forma: string; valor: number; data: string }>;
  saldo: number;
  codigo_validacao: string;
  data_emissao: string;
  usuario_emissor_nome: string;
}

export type StatusLimpeza = 'SUJO' | 'EM_LIMPEZA' | 'INSPEÇÃO' | 'LIBERADO';

export interface LimpezaQuarto {
  id: number;
  uuid: string;
  quarto_id: number;
  quarto_numero: string;
  tipo_limpeza: 'CHECKOUT' | 'DIARIA' | 'GERAL' | 'RETROQUE';
  status: StatusLimpeza;
  responsavel_id?: number;
  responsavel_nome?: string;
  data_hora_solicitacao: string;
  data_hora_inicio?: string;
  data_hora_conclusao?: string;
  produtos_utilizados?: string;
  observacoes?: string;
}

export interface Manutencao {
  id: number;
  uuid: string;
  codigo_chamado: string;
  quarto_id?: number;
  quarto_numero?: string;
  equipamento: string;
  descricao_problema: string;
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE';
  status: 'ABERTO' | 'EM_ANDAMENTO' | 'AGUARDANDO' | 'RESOLVIDO' | 'CANCELADO';
  responsavel_id?: number;
  responsavel_nome?: string;
  data_abertura: string;
  data_conclusao?: string;
  solucao?: string;
  custo_reparo: number;
}

export interface AuditoriaLog {
  id: number;
  uuid: string;
  usuario_id?: number;
  usuario_nome: string;
  modulo: string;
  acao: string;
  tabela_afetada: string;
  registro_id: string;
  valor_anterior?: string;
  valor_novo?: string;
  device_id: string;
  data_hora: string;
}

export interface SyncQueueItem {
  id?: number;
  uuid: string;
  device_id: string;
  entidade: string;
  acao: 'INSERT' | 'UPDATE' | 'DELETE';
  dados_payload: string; // JSON
  status: 'PENDING' | 'SYNCED' | 'CONFLICT' | 'ERROR';
  tentativas: number;
  mensagem_erro?: string;
  created_at: string;
}

export interface BackupPackage {
  metadata: {
    app: string;
    versao: string;
    data_geracao: string;
    total_registros: number;
    checksum_sha256: string;
    origem: string;
  };
  pousada: PousadaConfig;
  quartos: Quarto[];
  categorias: CategoriaQuarto[];
  hospedes: Hospede[];
  reservas: Reserva[];
  produtos: Produto[];
  consumos: Consumo[];
  pagamentos: Pagamento[];
  caixas: Caixa[];
  movimentos_caixa: MovimentoCaixa[];
  contas_financeiras: ContaFinanceira[];
  limpezas: LimpezaQuarto[];
  manutencoes: Manutencao[];
  recibos: Recibo[];
  auditoria: AuditoriaLog[];
}
