// =====================================================================
// POUSADA PMS — Contexto Principal de Gestão e Regras de Negócio
// =====================================================================

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  PousadaConfig,
  Quarto,
  CategoriaQuarto,
  Hospede,
  Reserva,
  Produto,
  Consumo,
  FormaPagamento,
  Caixa,
  MovimentoCaixa,
  ContaFinanceira,
  LimpezaQuarto,
  Manutencao,
  Recibo,
  AuditoriaLog,
  StatusQuarto,
  StatusReserva,
  StatusLimpeza,
} from '../types';
import {
  STORES,
  openDatabase,
  seedInitialDataIfEmpty,
  getAllFromStore,
  putInStore,
  deleteFromStore,
  registrarAuditoria,
  enfileirarSincronizacao,
} from '../services/db';
import { INITIAL_POUSADA_CONFIG } from '../services/initialData';
import { useAuth } from './AuthContext';

interface PMSContextType {
  loading: boolean;
  pousada: PousadaConfig;
  quartos: Quarto[];
  categorias: CategoriaQuarto[];
  hospedes: Hospede[];
  reservas: Reserva[];
  produtos: Produto[];
  consumos: Consumo[];
  formasPagamento: FormaPagamento[];
  caixaAtivo: Caixa | null;
  movimentosCaixa: MovimentoCaixa[];
  contasFinanceiras: ContaFinanceira[];
  limpezas: LimpezaQuarto[];
  manutencoes: Manutencao[];
  recibos: Recibo[];
  auditoria: AuditoriaLog[];
  
  // Ações de Negócio
  salvarReserva: (reserva: Partial<Reserva>) => Promise<{ success: boolean; message?: string; reserva?: Reserva }>;
  cancelarReserva: (reservaId: number, motivo: string) => Promise<boolean>;
  fazerCheckin: (reservaId: number, caucao?: number, obs?: string) => Promise<{ success: boolean; message?: string }>;
  fazerCheckout: (
    reservaId: number,
    pagamentos: Array<{ formaPagamentoId: number; formaNome: string; valor: number }>,
    desconto?: number,
    taxas?: number,
    obs?: string
  ) => Promise<{ success: boolean; recibo?: Recibo; message?: string }>;
  lancarConsumo: (consumo: Omit<Consumo, 'id' | 'uuid' | 'data_lancamento' | 'usuario_id'>) => Promise<boolean>;
  alterarStatusQuarto: (quartoId: number, novoStatus: StatusQuarto, obs?: string) => Promise<boolean>;
  salvarQuarto: (quarto: Partial<Quarto>) => Promise<boolean>;
  salvarHospede: (hospede: Partial<Hospede>) => Promise<{ success: boolean; hospede?: Hospede; message?: string }>;
  salvarProduto: (produto: Partial<Produto>) => Promise<boolean>;
  abrirCaixa: (saldoInicial: number) => Promise<boolean>;
  lancarMovimentoCaixa: (
    tipo: 'ENTRADA' | 'SAIDA' | 'SANGRIA' | 'SUPRIMENTO',
    categoria: string,
    descricao: string,
    valor: number,
    formaPagamentoId?: number
  ) => Promise<boolean>;
  fecharCaixa: (saldoInformado: number, obs?: string) => Promise<boolean>;
  atualizarLimpeza: (limpezaId: number, novoStatus: StatusLimpeza, responsavelNome?: string) => Promise<boolean>;
  salvarManutencao: (manut: Partial<Manutencao>) => Promise<boolean>;
  salvarConfiguracoes: (config: PousadaConfig) => Promise<boolean>;
  recarregarDados: () => Promise<void>;
  formatarMoeda: (valor: number) => string;
}

const PMSContext = createContext<PMSContextType | undefined>(undefined);

export const PMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [pousada, setPousada] = useState<PousadaConfig>(INITIAL_POUSADA_CONFIG);
  const [quartos, setQuartos] = useState<Quarto[]>([]);
  const [categorias, setCategorias] = useState<CategoriaQuarto[]>([]);
  const [hospedes, setHospedes] = useState<Hospede[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [consumos, setConsumos] = useState<Consumo[]>([]);
  const [formasPagamento, setFormasPagamento] = useState<FormaPagamento[]>([]);
  const [caixaAtivo, setCaixaAtivo] = useState<Caixa | null>(null);
  const [movimentosCaixa, setMovimentosCaixa] = useState<MovimentoCaixa[]>([]);
  const [contasFinanceiras, setContasFinanceiras] = useState<ContaFinanceira[]>([]);
  const [limpezas, setLimpezas] = useState<LimpezaQuarto[]>([]);
  const [manutencoes, setManutencoes] = useState<Manutencao[]>([]);
  const [recibos, setRecibos] = useState<Recibo[]>([]);
  const [auditoria, setAuditoria] = useState<AuditoriaLog[]>([]);

  const carregarDadosDoBanco = useCallback(async () => {
    try {
      await openDatabase();
      await seedInitialDataIfEmpty();

      const [
        pousadaList,
        quartosList,
        categoriasList,
        hospedesList,
        reservasList,
        produtosList,
        consumosList,
        formasPagamentoList,
        caixasList,
        movimentosList,
        contasList,
        limpezasList,
        manutencoesList,
        recibosList,
        auditoriaList,
      ] = await Promise.all([
        getAllFromStore<PousadaConfig>(STORES.POUSADA),
        getAllFromStore<Quarto>(STORES.QUARTOS),
        getAllFromStore<CategoriaQuarto>(STORES.CATEGORIAS),
        getAllFromStore<Hospede>(STORES.HOSPEDES),
        getAllFromStore<Reserva>(STORES.RESERVAS),
        getAllFromStore<Produto>(STORES.PRODUTOS),
        getAllFromStore<Consumo>(STORES.CONSUMOS),
        getAllFromStore<FormaPagamento>(STORES.FORMAS_PAGAMENTO),
        getAllFromStore<Caixa>(STORES.CAIXAS),
        getAllFromStore<MovimentoCaixa>(STORES.MOVIMENTOS_CAIXA),
        getAllFromStore<ContaFinanceira>(STORES.CONTAS_FINANCEIRAS),
        getAllFromStore<LimpezaQuarto>(STORES.LIMPEZAS),
        getAllFromStore<Manutencao>(STORES.MANUTENCOES),
        getAllFromStore<Recibo>(STORES.RECIBOS),
        getAllFromStore<AuditoriaLog>(STORES.AUDITORIA),
      ]);

      if (pousadaList.length > 0) setPousada(pousadaList[0]);
      setQuartos(quartosList.sort((a, b) => a.id - b.id));
      setCategorias(categoriasList);
      setHospedes(hospedesList.sort((a, b) => b.id - a.id));
      setReservas(reservasList.sort((a, b) => b.id - a.id));
      setProdutos(produtosList);
      setConsumos(consumosList.sort((a, b) => b.id - a.id));
      setFormasPagamento(formasPagamentoList);
      
      const aberto = caixasList.find((c) => c.status === 'ABERTO');
      setCaixaAtivo(aberto || null);

      setMovimentosCaixa(movimentosList.sort((a, b) => b.id - a.id));
      setContasFinanceiras(contasList.sort((a, b) => b.id - a.id));
      setLimpezas(limpezasList.sort((a, b) => b.id - a.id));
      setManutencoes(manutencoesList.sort((a, b) => b.id - a.id));
      setRecibos(recibosList.sort((a, b) => b.id - a.id));
      setAuditoria(auditoriaList.sort((a, b) => b.id - a.id));
    } catch (e) {
      console.error('Erro ao ler dados do IndexedDB:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarDadosDoBanco();
  }, [carregarDadosDoBanco]);

  // Formatação de moeda conforme configuração da pousada
  const formatarMoeda = (valor: number): string => {
    const num = isNaN(valor) ? 0 : valor;
    if (pousada.moeda === 'EUR') {
      return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(num);
    } else if (pousada.moeda === 'USD') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
    }
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
  };

  // 1. SALVAR RESERVA (Com Prevenção de Conflito de Quarto/Datas)
  const salvarReserva = async (reservaData: Partial<Reserva>): Promise<{ success: boolean; message?: string; reserva?: Reserva }> => {
    if (!reservaData.quarto_id || !reservaData.data_checkin || !reservaData.data_checkout) {
      return { success: false, message: 'Selecione o quarto e o período de hospedagem.' };
    }

    if (reservaData.data_checkout <= reservaData.data_checkin) {
      return { success: false, message: 'A data de check-out deve ser posterior à data de check-in.' };
    }

    // Validação de Conflito de Ocupação no Quarto
    const conflito = reservas.find((r) => {
      if (reservaData.id && r.id === reservaData.id) return false;
      if (r.status === 'CANCELADA' || r.status === 'CHECK_OUT' || r.status === 'NO_SHOW') return false;
      if (r.quarto_id !== reservaData.quarto_id) return false;

      // Há sobreposição se: inicio1 < fim2 E inicio2 < fim1
      return reservaData.data_checkin! < r.data_checkout && r.data_checkin < reservaData.data_checkout!;
    });

    if (conflito) {
      const q = quartos.find((q) => q.id === reservaData.quarto_id);
      return {
        success: false,
        message: `Conflito de reserva no ${q?.numero || 'quarto'}: já existe a reserva ${conflito.codigo_reserva} entre ${conflito.data_checkin} e ${conflito.data_checkout}.`,
      };
    }

    const isEdit = !!reservaData.id;
    const existing = isEdit ? reservas.find((r) => r.id === reservaData.id) : null;

    const novaReserva: Reserva = {
      id: reservaData.id || Date.now(),
      uuid: reservaData.uuid || (crypto.randomUUID ? crypto.randomUUID() : 'res-' + Math.random().toString(36).substring(2, 9)),
      codigo_reserva: reservaData.codigo_reserva || `RES-${new Date().getFullYear()}-${String(reservas.length + 1).padStart(3, '0')}`,
      hospede_id: Number(reservaData.hospede_id),
      quarto_id: Number(reservaData.quarto_id),
      data_checkin: reservaData.data_checkin!,
      data_checkout: reservaData.data_checkout!,
      hora_checkin_prevista: reservaData.hora_checkin_prevista || '14:00',
      hora_checkout_prevista: reservaData.hora_checkout_prevista || '12:00',
      adultos: Number(reservaData.adultos) || 2,
      criancas: Number(reservaData.criancas) || 0,
      valor_diaria: Number(reservaData.valor_diaria) || 0,
      total_diarias: Number(reservaData.total_diarias) || 0,
      valor_desconto: Number(reservaData.valor_desconto) || 0,
      valor_taxas: Number(reservaData.valor_taxas) || 0,
      valor_total: Number(reservaData.valor_total) || 0,
      valor_sinal_pago: Number(reservaData.valor_sinal_pago) || 0,
      saldo_restante: Number(reservaData.saldo_restante) || 0,
      origem: reservaData.origem || 'DIRETA',
      status: reservaData.status || 'CONFIRMADA',
      observacoes: reservaData.observacoes || '',
      created_at: existing?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      sync_status: 'PENDING',
    };

    await putInStore(STORES.RESERVAS, novaReserva);
    await enfileirarSincronizacao('reservas', isEdit ? 'UPDATE' : 'INSERT', novaReserva);

    await registrarAuditoria(
      currentUser.nome,
      'RESERVAS',
      isEdit ? 'ATUALIZACAO_RESERVA' : 'CRIACAO_RESERVA',
      'reservas',
      novaReserva.codigo_reserva,
      novaReserva,
      existing
    );

    // Se a reserva for para a data de hoje e estiver confirmada, atualiza status visual do quarto
    const hoje = new Date().toISOString().substring(0, 10);
    if (novaReserva.data_checkin === hoje && novaReserva.status === 'CONFIRMADA') {
      const q = quartos.find((q) => q.id === novaReserva.quarto_id);
      if (q && q.status === 'LIVRE') {
        await alterarStatusQuarto(q.id, 'RESERVADO', `Reserva ${novaReserva.codigo_reserva} para hoje`);
      }
    }

    await carregarDadosDoBanco();
    return { success: true, reserva: novaReserva };
  };

  // 2. CANCELAR RESERVA
  const cancelarReserva = async (reservaId: number, motivo: string): Promise<boolean> => {
    const r = reservas.find((res) => res.id === reservaId);
    if (!r) return false;

    const rAtualizada: Reserva = {
      ...r,
      status: 'CANCELADA',
      motivo_cancelamento: motivo,
      data_cancelamento: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      sync_status: 'PENDING',
    };

    await putInStore(STORES.RESERVAS, rAtualizada);
    await enfileirarSincronizacao('reservas', 'UPDATE', rAtualizada);

    // Se o quarto estava reservado para ela, libera
    const q = quartos.find((quarto) => quarto.id === r.quarto_id);
    if (q && q.status === 'RESERVADO') {
      await alterarStatusQuarto(q.id, 'LIVRE', `Cancelamento da reserva ${r.codigo_reserva}`);
    }

    await registrarAuditoria(
      currentUser.nome,
      'RESERVAS',
      'CANCELAMENTO_RESERVA',
      'reservas',
      r.codigo_reserva,
      { motivo }
    );

    await carregarDadosDoBanco();
    return true;
  };

  // 3. FLUXO DE CHECK-IN
  const fazerCheckin = async (reservaId: number, caucao: number = 0, obs?: string): Promise<{ success: boolean; message?: string }> => {
    const r = reservas.find((res) => res.id === reservaId);
    if (!r) return { success: false, message: 'Reserva não encontrada.' };
    if (r.status === 'HOSPEDADO') return { success: false, message: 'Esta reserva já realizou o check-in.' };
    if (r.status === 'CANCELADA') return { success: false, message: 'Não é possível fazer check-in de reserva cancelada.' };

    const q = quartos.find((quarto) => quarto.id === r.quarto_id);
    if (q && q.status === 'OCUPADO') {
      return { success: false, message: `O quarto ${q.numero} já está ocupado por outro hóspede no momento.` };
    }

    // Atualiza reserva para HOSPEDADO
    const rAtualizada: Reserva = {
      ...r,
      status: 'HOSPEDADO',
      observacoes: (r.observacoes ? r.observacoes + ' | ' : '') + `Check-in realizado por ${currentUser.nome}. ${obs || ''}`.trim(),
      updated_at: new Date().toISOString(),
      sync_status: 'PENDING',
    };
    await putInStore(STORES.RESERVAS, rAtualizada);

    // Atualiza quarto para OCUPADO
    if (q) {
      await alterarStatusQuarto(q.id, 'OCUPADO', `Check-in da reserva ${r.codigo_reserva}`);
    }

    // Incrementa contagem de hospedagens do hóspede
    const hosp = hospedes.find((h) => h.id === r.hospede_id);
    if (hosp) {
      await putInStore(STORES.HOSPEDES, {
        ...hosp,
        total_hospedagens: (hosp.total_hospedagens || 0) + 1,
        sync_status: 'PENDING',
      });
    }

    await registrarAuditoria(
      currentUser.nome,
      'CHECKIN',
      'REALIZAR_CHECKIN',
      'reservas',
      r.codigo_reserva,
      { caucao, obs, quarto: q?.numero }
    );

    await carregarDadosDoBanco();
    return { success: true };
  };

  // 4. FLUXO DE CHECK-OUT COMPLETO (Com geração de Recibo e Quarto -> LIMPEZA)
  const fazerCheckout = async (
    reservaId: number,
    pagamentosRecebidos: Array<{ formaPagamentoId: number; formaNome: string; valor: number }>,
    desconto: number = 0,
    taxas: number = 0,
    obs?: string
  ): Promise<{ success: boolean; recibo?: Recibo; message?: string }> => {
    const r = reservas.find((res) => res.id === reservaId);
    if (!r) return { success: false, message: 'Reserva não encontrada.' };
    const q = quartos.find((quarto) => quarto.id === r.quarto_id);
    const h = hospedes.find((hosp) => hosp.id === r.hospede_id);

    // Pega consumos pendentes desta reserva
    const consumosReserva = consumos.filter((c) => c.reserva_id === reservaId && c.status_faturamento !== 'CANCELADO');
    const totalConsumos = consumosReserva.reduce((sum, c) => sum + c.valor_total, 0);

    // Cálculo da Conta da Hospedagem
    const subtotal = r.total_diarias + totalConsumos;
    const totalFinal = subtotal - desconto + taxas;
    const jaPago = r.valor_sinal_pago;
    const saldoDevedor = Math.max(0, totalFinal - jaPago);

    const totalPagamentosAgora = pagamentosRecebidos.reduce((sum, p) => sum + p.valor, 0);
    const saldoResidual = Math.max(0, saldoDevedor - totalPagamentosAgora);

    // 1. Grava pagamentos efetuados no checkout
    for (const pag of pagamentosRecebidos) {
      if (pag.valor > 0) {
        const novoPagamento = {
          id: Date.now() + Math.floor(Math.random() * 1000),
          uuid: crypto.randomUUID ? crypto.randomUUID() : 'pag-' + Math.random().toString(36).substring(2, 9),
          reserva_id: r.id,
          forma_pagamento_id: pag.formaPagamentoId,
          forma_pagamento_nome: pag.formaNome,
          tipo: 'CHECKOUT' as const,
          valor: pag.valor,
          data_pagamento: new Date().toISOString(),
          usuario_id: currentUser.id,
          caixa_id: caixaAtivo?.id,
          observacoes: `Check-out reserva ${r.codigo_reserva}`,
          sync_status: 'PENDING' as const,
        };
        await putInStore(STORES.PAGAMENTOS, novoPagamento);

        // Se houver caixa aberto, lança no movimento de caixa
        if (caixaAtivo) {
          await lancarMovimentoCaixa(
            'ENTRADA',
            'CHECKOUT',
            `Recebimento Check-out Reserva ${r.codigo_reserva} (${pag.formaNome})`,
            pag.valor,
            pag.formaPagamentoId
          );
        }
      }
    }

    // 2. Fatura todos os consumos
    for (const c of consumosReserva) {
      await putInStore(STORES.CONSUMOS, { ...c, status_faturamento: 'FATURADO', sync_status: 'PENDING' });
    }

    // 3. Atualiza Reserva para CHECK_OUT
    const rAtualizada: Reserva = {
      ...r,
      status: 'CHECK_OUT',
      valor_total: totalFinal,
      valor_desconto: desconto,
      valor_taxas: taxas,
      valor_sinal_pago: jaPago + totalPagamentosAgora,
      saldo_restante: saldoResidual,
      updated_at: new Date().toISOString(),
      sync_status: 'PENDING',
    };
    await putInStore(STORES.RESERVAS, rAtualizada);

    // 4. Quarto passa imediatamente para LIMPEZA
    if (q) {
      await alterarStatusQuarto(q.id, 'LIMPEZA', `Check-out concluído da reserva ${r.codigo_reserva}`);
      // Cria tarefa de governança
      const novaLimpeza: LimpezaQuarto = {
        id: Date.now(),
        uuid: crypto.randomUUID ? crypto.randomUUID() : 'limp-' + Math.random().toString(36).substring(2, 9),
        quarto_id: q.id,
        quarto_numero: q.numero,
        tipo_limpeza: 'CHECKOUT',
        status: 'SUJO',
        data_hora_solicitacao: new Date().toISOString().replace('T', ' ').substring(0, 16),
        observacoes: 'Quarto vago após check-out. Realizar higienização e troca de enxoval.',
      };
      await putInStore(STORES.LIMPEZAS, novaLimpeza);
    }

    // 5. Geração de Recibo Oficial
    const numRecibo = `REC-${new Date().getFullYear()}-${String(pousada.num_recibo_atual + 1).padStart(4, '0')}`;
    const codigoValidacao = (crypto.randomUUID ? crypto.randomUUID().replace(/-/g, '').substring(0, 16) : Math.random().toString(36).substring(2, 18)).toUpperCase();

    const itensRecibo = [
      {
        descricao: `Diárias de Hospedagem (${r.data_checkin} a ${r.data_checkout}) - ${q?.nome || 'Quarto'}`,
        quantidade: 1,
        valor_unitario: r.total_diarias,
        valor_total: r.total_diarias,
      },
      ...consumosReserva.map((c) => ({
        descricao: c.nome_produto || 'Item de Consumo',
        quantidade: c.quantidade,
        valor_unitario: c.valor_unitario,
        valor_total: c.valor_total,
      })),
    ];

    const novoRecibo: Recibo = {
      id: Date.now(),
      uuid: crypto.randomUUID ? crypto.randomUUID() : 'rcb-' + Math.random().toString(36).substring(2, 9),
      numero_recibo: numRecibo,
      reserva_id: r.id,
      hospede_id: r.hospede_id,
      hospede_nome: h?.nome_completo || 'Hóspede',
      hospede_documento: h?.documento || '',
      quarto_id: r.quarto_id,
      quarto_numero: q?.numero || '',
      periodo: `${r.data_checkin} a ${r.data_checkout}`,
      itens: itensRecibo,
      subtotal,
      desconto,
      taxas,
      total: totalFinal,
      pagamentos: pagamentosRecebidos.map((p) => ({
        forma: p.formaNome,
        valor: p.valor,
        data: new Date().toLocaleDateString('pt-BR'),
      })),
      saldo: saldoResidual,
      codigo_validacao: codigoValidacao,
      data_emissao: new Date().toISOString(),
      usuario_emissor_nome: currentUser.nome,
    };
    await putInStore(STORES.RECIBOS, novoRecibo);

    // Incrementa número do recibo na configuração
    const pousadaAtualizada = { ...pousada, num_recibo_atual: pousada.num_recibo_atual + 1 };
    await putInStore(STORES.POUSADA, pousadaAtualizada);
    setPousada(pousadaAtualizada);

    await registrarAuditoria(
      currentUser.nome,
      'CHECKOUT',
      'REALIZAR_CHECKOUT',
      'reservas',
      r.codigo_reserva,
      { totalFinal, saldoResidual, recibo: numRecibo, quarto: q?.numero }
    );

    await carregarDadosDoBanco();
    return { success: true, recibo: novoRecibo };
  };

  // 5. LANÇAR CONSUMO
  const lancarConsumo = async (
    consumoData: Omit<Consumo, 'id' | 'uuid' | 'data_lancamento' | 'usuario_id'>
  ): Promise<boolean> => {
    const novoConsumo: Consumo = {
      ...consumoData,
      id: Date.now(),
      uuid: crypto.randomUUID ? crypto.randomUUID() : 'con-' + Math.random().toString(36).substring(2, 9),
      data_lancamento: new Date().toISOString().replace('T', ' ').substring(0, 16),
      usuario_id: currentUser.id,
      usuario_nome: currentUser.nome,
      status_faturamento: 'PENDENTE',
      sync_status: 'PENDING',
    };

    await putInStore(STORES.CONSUMOS, novoConsumo);
    await enfileirarSincronizacao('consumos', 'INSERT', novoConsumo);

    // Baixa de estoque do produto se for produto físico
    const prod = produtos.find((p) => p.id === consumoData.produto_id);
    if (prod && prod.tipo === 'PRODUTO') {
      const prodAtualizado = {
        ...prod,
        estoque_atual: Math.max(0, prod.estoque_atual - consumoData.quantidade),
      };
      await putInStore(STORES.PRODUTOS, prodAtualizado);
    }

    await registrarAuditoria(
      currentUser.nome,
      'CONSUMO',
      'LANCAR_CONSUMO',
      'consumos',
      String(novoConsumo.id),
      { produto: prod?.nome, valorTotal: novoConsumo.valor_total, quartoId: novoConsumo.quarto_id }
    );

    await carregarDadosDoBanco();
    return true;
  };

  // 6. ALTERAR STATUS DO QUARTO
  const alterarStatusQuarto = async (quartoId: number, novoStatus: StatusQuarto, obs?: string): Promise<boolean> => {
    const q = quartos.find((quarto) => quarto.id === quartoId);
    if (!q) return false;

    const qAtualizado: Quarto = {
      ...q,
      status: novoStatus,
      observacoes: obs !== undefined ? obs : q.observacoes,
      updated_at: new Date().toISOString(),
      sync_status: 'PENDING',
    };

    await putInStore(STORES.QUARTOS, qAtualizado);
    await enfileirarSincronizacao('quartos', 'UPDATE', qAtualizado);

    await registrarAuditoria(
      currentUser.nome,
      'QUARTOS',
      'ALTERAR_STATUS',
      'quartos',
      q.numero,
      { antes: q.status, novo: novoStatus, obs }
    );

    setQuartos((prev) => prev.map((item) => (item.id === quartoId ? qAtualizado : item)));
    return true;
  };

  // 7. SALVAR CADASTRO DE QUARTO
  const salvarQuarto = async (quartoData: Partial<Quarto>): Promise<boolean> => {
    const isEdit = !!quartoData.id;
    const existing = isEdit ? quartos.find((q) => q.id === quartoData.id) : null;

    const q: Quarto = {
      id: quartoData.id || Date.now(),
      uuid: quartoData.uuid || (crypto.randomUUID ? crypto.randomUUID() : 'qto-' + Math.random().toString(36).substring(2, 9)),
      numero: quartoData.numero || 'Q00',
      nome: quartoData.nome || 'Quarto Sem Nome',
      categoria_id: Number(quartoData.categoria_id) || 1,
      andar: quartoData.andar || 'Térreo',
      capacidade_adultos: Number(quartoData.capacidade_adultos) || 2,
      capacidade_criancas: Number(quartoData.capacidade_criancas) || 0,
      tipo_cama: quartoData.tipo_cama || '1 Casal Queen',
      area_m2: Number(quartoData.area_m2) || 20,
      equipamentos: quartoData.equipamentos || '',
      status: quartoData.status || 'LIVRE',
      ativo: quartoData.ativo !== undefined ? quartoData.ativo : true,
      observacoes: quartoData.observacoes || '',
      updated_at: new Date().toISOString(),
      sync_status: 'PENDING',
    };

    await putInStore(STORES.QUARTOS, q);
    await enfileirarSincronizacao('quartos', isEdit ? 'UPDATE' : 'INSERT', q);

    await registrarAuditoria(
      currentUser.nome,
      'QUARTOS',
      isEdit ? 'EDICAO_QUARTO' : 'CRIACAO_QUARTO',
      'quartos',
      q.numero,
      q,
      existing
    );

    await carregarDadosDoBanco();
    return true;
  };

  // 8. SALVAR CADASTRO DE HÓSPEDE
  const salvarHospede = async (hospedeData: Partial<Hospede>): Promise<{ success: boolean; hospede?: Hospede; message?: string }> => {
    if (!hospedeData.nome_completo?.trim()) {
      return { success: false, message: 'O nome completo do hóspede é obrigatório.' };
    }
    if (!hospedeData.documento?.trim()) {
      return { success: false, message: 'O documento (CPF, NIF ou Passaporte) é obrigatório.' };
    }

    const isEdit = !!hospedeData.id;
    // Checar duplicidade de documento se for novo cadastro
    if (!isEdit) {
      const duplicado = hospedes.find((h) => h.documento === hospedeData.documento?.trim());
      if (duplicado) {
        return { success: false, message: `Já existe um hóspede cadastrado com o documento ${hospedeData.documento}. (${duplicado.nome_completo})` };
      }
    }

    const h: Hospede = {
      id: hospedeData.id || Date.now(),
      uuid: hospedeData.uuid || (crypto.randomUUID ? crypto.randomUUID() : 'hosp-' + Math.random().toString(36).substring(2, 9)),
      nome_completo: hospedeData.nome_completo.trim(),
      tipo_documento: hospedeData.tipo_documento || 'CPF',
      documento: hospedeData.documento.trim(),
      data_nascimento: hospedeData.data_nascimento || '',
      nacionalidade: hospedeData.nacionalidade || 'Brasileira',
      telefone: hospedeData.telefone || '',
      whatsapp: hospedeData.whatsapp || '',
      email: hospedeData.email || '',
      endereco: hospedeData.endereco || '',
      cidade: hospedeData.cidade || '',
      estado: hospedeData.estado || '',
      pais: hospedeData.pais || 'Brasil',
      cep: hospedeData.cep || '',
      preferencias: hospedeData.preferencias || '',
      observacoes: hospedeData.observacoes || '',
      total_hospedagens: hospedeData.total_hospedagens || 0,
      created_at: hospedeData.created_at || new Date().toISOString(),
      sync_status: 'PENDING',
    };

    await putInStore(STORES.HOSPEDES, h);
    await enfileirarSincronizacao('hospedes', isEdit ? 'UPDATE' : 'INSERT', h);

    await registrarAuditoria(
      currentUser.nome,
      'HOSPEDES',
      isEdit ? 'EDICAO_HOSPEDE' : 'CRIACAO_HOSPEDE',
      'hospedes',
      h.documento,
      h
    );

    await carregarDadosDoBanco();
    return { success: true, hospede: h };
  };

  // 9. SALVAR PRODUTO / SERVIÇO
  const salvarProduto = async (prodData: Partial<Produto>): Promise<boolean> => {
    const isEdit = !!prodData.id;
    const p: Produto = {
      id: prodData.id || Date.now(),
      uuid: prodData.uuid || (crypto.randomUUID ? crypto.randomUUID() : 'prd-' + Math.random().toString(36).substring(2, 9)),
      categoria_id: Number(prodData.categoria_id) || 1,
      codigo: prodData.codigo || '',
      nome: prodData.nome || 'Produto Sem Nome',
      descricao: prodData.descricao || '',
      tipo: prodData.tipo || 'PRODUTO',
      preco_venda: Number(prodData.preco_venda) || 0,
      preco_custo: Number(prodData.preco_custo) || 0,
      estoque_atual: Number(prodData.estoque_atual) || 0,
      estoque_minimo: Number(prodData.estoque_minimo) || 5,
      ativo: prodData.ativo !== undefined ? prodData.ativo : true,
    };

    await putInStore(STORES.PRODUTOS, p);
    await registrarAuditoria(currentUser.nome, 'PRODUTOS', isEdit ? 'EDICAO' : 'CRIACAO', 'produtos', p.nome, p);
    await carregarDadosDoBanco();
    return true;
  };

  // 10. ABERTURA DE CAIXA
  const abrirCaixa = async (saldoInicial: number): Promise<boolean> => {
    if (caixaAtivo) {
      alert('Já existe um caixa aberto neste terminal.');
      return false;
    }

    const agora = new Date();
    const dataCodigo = agora.toISOString().substring(0, 10).replace(/-/g, '');
    const codigoCaixa = `CX-${dataCodigo}-01`;

    const novoCaixa: Caixa = {
      id: Date.now(),
      uuid: crypto.randomUUID ? crypto.randomUUID() : 'cx-' + Math.random().toString(36).substring(2, 9),
      codigo: codigoCaixa,
      usuario_abertura_id: currentUser.id,
      usuario_abertura_nome: currentUser.nome,
      data_hora_abertura: agora.toISOString().replace('T', ' ').substring(0, 16),
      saldo_inicial: saldoInicial,
      total_entradas: 0,
      total_saidas: 0,
      saldo_esperado: saldoInicial,
      resultado_fechamento: 'ABERTO',
      status: 'ABERTO',
    };

    await putInStore(STORES.CAIXAS, novoCaixa);
    setCaixaAtivo(novoCaixa);

    await registrarAuditoria(
      currentUser.nome,
      'CAIXA',
      'ABERTURA_CAIXA',
      'caixas',
      codigoCaixa,
      { saldoInicial }
    );

    await carregarDadosDoBanco();
    return true;
  };

  // 11. MOVIMENTAÇÃO DE CAIXA (Entrada, Saída, Sangria, Suprimento)
  const lancarMovimentoCaixa = async (
    tipo: 'ENTRADA' | 'SAIDA' | 'SANGRIA' | 'SUPRIMENTO',
    categoria: string,
    descricao: string,
    valor: number,
    formaPagamentoId?: number
  ): Promise<boolean> => {
    if (!caixaAtivo) return false;

    const fp = formasPagamento.find((f) => f.id === formaPagamentoId);

    const mov: MovimentoCaixa = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      uuid: crypto.randomUUID ? crypto.randomUUID() : 'mov-' + Math.random().toString(36).substring(2, 9),
      caixa_id: caixaAtivo.id,
      tipo,
      categoria,
      descricao,
      valor,
      forma_pagamento_id: formaPagamentoId,
      forma_pagamento_nome: fp?.nome,
      data_hora: new Date().toISOString().replace('T', ' ').substring(0, 16),
      usuario_id: currentUser.id,
      usuario_nome: currentUser.nome,
    };

    await putInStore(STORES.MOVIMENTOS_CAIXA, mov);

    // Atualiza saldo esperado do caixa
    const isEntrada = tipo === 'ENTRADA' || tipo === 'SUPRIMENTO';
    const novasEntradas = isEntrada ? caixaAtivo.total_entradas + valor : caixaAtivo.total_entradas;
    const novasSaidas = !isEntrada ? caixaAtivo.total_saidas + valor : caixaAtivo.total_saidas;
    const novoSaldoEsperado = caixaAtivo.saldo_inicial + novasEntradas - novasSaidas;

    const caixaAtualizado: Caixa = {
      ...caixaAtivo,
      total_entradas: novasEntradas,
      total_saidas: novasSaidas,
      saldo_esperado: novoSaldoEsperado,
    };

    await putInStore(STORES.CAIXAS, caixaAtualizado);
    setCaixaAtivo(caixaAtualizado);

    await registrarAuditoria(
      currentUser.nome,
      'CAIXA',
      `MOVIMENTO_${tipo}`,
      'movimentos_caixa',
      String(mov.id),
      { tipo, valor, descricao }
    );

    await carregarDadosDoBanco();
    return true;
  };

  // 12. FECHAMENTO DE CAIXA
  const fecharCaixa = async (saldoInformado: number, obs?: string): Promise<boolean> => {
    if (!caixaAtivo) return false;

    const diferenca = saldoInformado - caixaAtivo.saldo_esperado;
    let resultado: 'SOBRA' | 'FALTA' | 'ZERO' = 'ZERO';
    if (Math.abs(diferenca) < 0.01) {
      resultado = 'ZERO';
    } else if (diferenca > 0) {
      resultado = 'SOBRA';
    } else {
      resultado = 'FALTA';
    }

    const caixaFechado: Caixa = {
      ...caixaAtivo,
      usuario_fechamento_id: currentUser.id,
      usuario_fechamento_nome: currentUser.nome,
      data_hora_fechamento: new Date().toISOString().replace('T', ' ').substring(0, 16),
      saldo_informado: saldoInformado,
      diferenca,
      resultado_fechamento: resultado,
      status: 'FECHADO',
      observacoes: obs,
    };

    await putInStore(STORES.CAIXAS, caixaFechado);
    setCaixaAtivo(null);

    await registrarAuditoria(
      currentUser.nome,
      'CAIXA',
      'FECHAMENTO_CAIXA',
      'caixas',
      caixaFechado.codigo,
      { saldoEsperado: caixaFechado.saldo_esperado, saldoInformado, diferenca, resultado }
    );

    await carregarDadosDoBanco();
    return true;
  };

  // 13. ATUALIZAR STATUS DE LIMPEZA
  const atualizarLimpeza = async (limpezaId: number, novoStatus: StatusLimpeza, responsavelNome?: string): Promise<boolean> => {
    const limp = limpezas.find((l) => l.id === limpezaId);
    if (!limp) return false;

    const agora = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const limpAtualizada: LimpezaQuarto = {
      ...limp,
      status: novoStatus,
      responsavel_nome: responsavelNome || limp.responsavel_nome || currentUser.nome,
      data_hora_inicio: novoStatus === 'EM_LIMPEZA' && !limp.data_hora_inicio ? agora : limp.data_hora_inicio,
      data_hora_conclusao: novoStatus === 'LIBERADO' ? agora : limp.data_hora_conclusao,
    };

    await putInStore(STORES.LIMPEZAS, limpAtualizada);

    // Se o quarto foi liberado pela governança, atualiza o status do quarto para LIVRE se estiver em LIMPEZA
    if (novoStatus === 'LIBERADO') {
      const q = quartos.find((quarto) => quarto.id === limp.quarto_id);
      if (q && q.status === 'LIMPEZA') {
        await alterarStatusQuarto(q.id, 'LIVRE', 'Higienização concluída e quarto liberado pela governança.');
      }
    }

    await registrarAuditoria(
      currentUser.nome,
      'GOVERNANCA',
      'ALTERAR_STATUS_LIMPEZA',
      'limpezas',
      limp.quarto_numero,
      { novoStatus, responsavel: limpAtualizada.responsavel_nome }
    );

    await carregarDadosDoBanco();
    return true;
  };

  // 14. SALVAR MANUTENÇÃO
  const salvarManutencao = async (manutData: Partial<Manutencao>): Promise<boolean> => {
    const isEdit = !!manutData.id;
    const m: Manutencao = {
      id: manutData.id || Date.now(),
      uuid: manutData.uuid || (crypto.randomUUID ? crypto.randomUUID() : 'mnt-' + Math.random().toString(36).substring(2, 9)),
      codigo_chamado: manutData.codigo_chamado || `MNT-${new Date().getFullYear()}-${String(manutencoes.length + 1).padStart(2, '0')}`,
      quarto_id: manutData.quarto_id ? Number(manutData.quarto_id) : undefined,
      quarto_numero: manutData.quarto_numero,
      equipamento: manutData.equipamento || 'Equipamento',
      descricao_problema: manutData.descricao_problema || '',
      prioridade: manutData.prioridade || 'MEDIA',
      status: manutData.status || 'ABERTO',
      responsavel_nome: manutData.responsavel_nome || currentUser.nome,
      data_abertura: manutData.data_abertura || new Date().toISOString().replace('T', ' ').substring(0, 16),
      data_conclusao: manutData.status === 'RESOLVIDO' ? new Date().toISOString().replace('T', ' ').substring(0, 16) : undefined,
      solucao: manutData.solucao,
      custo_reparo: Number(manutData.custo_reparo) || 0,
    };

    await putInStore(STORES.MANUTENCOES, m);

    // Se a manutenção for aberta e vinculada ao quarto, muda quarto para MANUTENÇÃO
    if (m.quarto_id && (m.status === 'ABERTO' || m.status === 'EM_ANDAMENTO')) {
      const q = quartos.find((quarto) => quarto.id === m.quarto_id);
      if (q && q.status !== 'OCUPADO') {
        await alterarStatusQuarto(q.id, 'MANUTENÇÃO', `Ordem de Serviço ${m.codigo_chamado} aberta`);
      }
    } else if (m.quarto_id && (m.status === 'RESOLVIDO' || m.status === 'CANCELADO')) {
      const q = quartos.find((quarto) => quarto.id === m.quarto_id);
      if (q && q.status === 'MANUTENÇÃO') {
        await alterarStatusQuarto(q.id, 'LIVRE', `Manutenção ${m.codigo_chamado} finalizada`);
      }
    }

    await registrarAuditoria(
      currentUser.nome,
      'MANUTENCAO',
      isEdit ? 'EDICAO_CHAMADO' : 'CRIACAO_CHAMADO',
      'manutencoes',
      m.codigo_chamado,
      m
    );

    await carregarDadosDoBanco();
    return true;
  };

  // 15. SALVAR CONFIGURAÇÕES DA POUSADA
  const salvarConfiguracoes = async (config: PousadaConfig): Promise<boolean> => {
    const atualizada = { ...config, updated_at: new Date().toISOString() };
    await putInStore(STORES.POUSADA, atualizada);
    setPousada(atualizada);
    await registrarAuditoria(
      currentUser.nome,
      'CONFIGURACOES',
      'ATUALIZAR_CONFIG',
      'pousadas',
      '1',
      atualizada
    );
    return true;
  };

  const recarregarDados = async () => {
    await carregarDadosDoBanco();
  };

  return (
    <PMSContext.Provider
      value={{
        loading,
        pousada,
        quartos,
        categorias,
        hospedes,
        reservas,
        produtos,
        consumos,
        formasPagamento,
        caixaAtivo,
        movimentosCaixa,
        contasFinanceiras,
        limpezas,
        manutencoes,
        recibos,
        auditoria,
        salvarReserva,
        cancelarReserva,
        fazerCheckin,
        fazerCheckout,
        lancarConsumo,
        alterarStatusQuarto,
        salvarQuarto,
        salvarHospede,
        salvarProduto,
        abrirCaixa,
        lancarMovimentoCaixa,
        fecharCaixa,
        atualizarLimpeza,
        salvarManutencao,
        salvarConfiguracoes,
        recarregarDados,
        formatarMoeda,
      }}
    >
      {children}
    </PMSContext.Provider>
  );
};

export function usePMS() {
  const context = useContext(PMSContext);
  if (!context) {
    throw new Error('usePMS deve ser utilizado dentro de PMSProvider');
  }
  return context;
}
