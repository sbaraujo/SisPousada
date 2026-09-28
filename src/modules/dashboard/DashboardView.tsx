// =====================================================================
// POUSADA PMS — Dashboard Executivo e Operacional
// =====================================================================

import React from 'react';
import {
  BedDouble,
  CalendarCheck,
  CalendarX,
  TrendingUp,
  DollarSign,
  Sparkles,
  Wrench,
  Percent,
  ArrowRight,
  LogIn,
  LogOut,
  Plus,
} from 'lucide-react';
import { usePMS } from '../../context/PMSContext';
import { StatusQuarto } from '../../types';

interface DashboardViewProps {
  onOpenNovaReserva: () => void;
  onOpenCheckin: (reservaId: number) => void;
  onOpenCheckout: (reservaId: number) => void;
  onNavigateModulo: (modulo: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenNovaReserva,
  onOpenCheckin,
  onOpenCheckout,
  onNavigateModulo,
}) => {
  const { quartos, categorias, reservas, hospedes, formatarMoeda, alterarStatusQuarto } = usePMS();

  const hoje = new Date().toISOString().substring(0, 10);

  // Cálculos de Ocupação
  const totalQuartos = quartos.length || 20;
  const quartosOcupados = quartos.filter((q) => q.status === 'OCUPADO').length;
  const quartosLivres = quartos.filter((q) => q.status === 'LIVRE').length;
  const quartosReservados = quartos.filter((q) => q.status === 'RESERVADO').length;
  const quartosLimpeza = quartos.filter((q) => q.status === 'LIMPEZA').length;
  const quartosManutencao = quartos.filter((q) => q.status === 'MANUTENÇÃO').length;
  const quartosBloqueados = quartos.filter((q) => q.status === 'BLOQUEADO' || q.status === 'FORA_DE_SERVICO').length;

  const taxaOcupacao = Math.round((quartosOcupados / totalQuartos) * 100);

  // Check-ins e Check-outs Hoje
  const checkinsHoje = reservas.filter((r) => r.data_checkin === hoje && r.status === 'CONFIRMADA');
  const checkoutsHoje = reservas.filter((r) => r.data_checkout === hoje && r.status === 'HOSPEDADO');

  // Métricas Financeiras Básicas
  const receitaMes = reservas
    .filter((r) => r.status !== 'CANCELADA')
    .reduce((sum, r) => sum + r.valor_total, 0);

  const adr = reservas.length > 0 ? Math.round(receitaMes / reservas.length) : 380;
  const revpar = Math.round((taxaOcupacao / 100) * adr);

  const getStatusCor = (status: StatusQuarto) => {
    switch (status) {
      case 'LIVRE':
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800';
      case 'OCUPADO':
        return 'bg-blue-500/10 border-blue-500/30 text-blue-800';
      case 'RESERVADO':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-800';
      case 'LIMPEZA':
        return 'bg-orange-500/10 border-orange-500/30 text-orange-800';
      case 'MANUTENÇÃO':
        return 'bg-rose-500/10 border-rose-500/30 text-rose-800';
      case 'BLOQUEADO':
      case 'FORA_DE_SERVICO':
        return 'bg-slate-500/10 border-slate-500/30 text-slate-700';
      default:
        return 'bg-slate-100 border-slate-200 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner / Ação Rápida */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl text-white shadow-sm">
        <div>
          <h2 className="text-xl font-bold tracking-tight">
            Painel de Operações da Pousada
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Data operacional: <strong className="text-amber-400">{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</strong> · {totalQuartos} Unidades Habitacionais ativas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateModulo('calendario')}
            className="px-3 py-2 text-xs font-semibold bg-slate-700 hover:bg-slate-600 rounded-lg transition"
          >
            Ver Calendário
          </button>
          <button
            onClick={onOpenNovaReserva}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg transition shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Nova Reserva
          </button>
        </div>
      </div>

      {/* Grid de KPIs Principais */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Taxa de Ocupação */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Taxa de Ocupação</span>
            <Percent className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {taxaOcupacao}%
            </span>
            <span className="text-xs text-slate-500">
              ({quartosOcupados} de {totalQuartos} UH)
            </span>
          </div>
          <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, taxaOcupacao)}%` }}
            />
          </div>
        </div>

        {/* Diária Média (ADR) */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">ADR (Diária Média)</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {formatarMoeda(adr)}
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">RevPAR estimado: {formatarMoeda(revpar)}</p>
        </div>

        {/* Check-ins Hoje */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Check-ins Hoje</span>
            <CalendarCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {checkinsHoje.length}
            </span>
            <span className="text-xs text-slate-500">previstos</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">{quartosReservados} quartos reservados no total</p>
        </div>

        {/* Check-outs Hoje */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Check-outs Hoje</span>
            <CalendarX className="w-4 h-4 text-orange-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {checkoutsHoje.length}
            </span>
            <span className="text-xs text-slate-500">pendentes</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500">{quartosLimpeza} quartos aguardando limpeza</p>
        </div>
      </div>

      {/* Mapa dos 20 Quartos em Tempo Real */}
      <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BedDouble className="w-4 h-4 text-slate-600" />
              Painel de Ocupação das 20 Unidades Habitacionais
            </h3>
            <p className="text-xs text-slate-500">Clique em qualquer quarto para alterar status operacional</p>
          </div>

          {/* Legenda de Status */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Livre ({quartosLivres})
            </span>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
              <span className="w-2 h-2 rounded-full bg-blue-500" /> Ocupado ({quartosOcupados})
            </span>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Reservado ({quartosReservados})
            </span>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-orange-50 text-orange-800 border border-orange-200">
              <span className="w-2 h-2 rounded-full bg-orange-500" /> Limpeza ({quartosLimpeza})
            </span>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> Manutenção ({quartosManutencao})
            </span>
          </div>
        </div>

        {/* Grid dos 20 Quartos */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {quartos.map((room) => {
            const cat = categorias.find((c) => c.id === room.categoria_id);
            const statusClass = getStatusCor(room.status);

            // Procura reserva ativa para o quarto
            const reservaAtiva = reservas.find(
              (r) => r.quarto_id === room.id && (r.status === 'HOSPEDADO' || r.status === 'CONFIRMADA')
            );
            const hospedeAtivo = reservaAtiva ? hospedes.find((h) => h.id === reservaAtiva.hospede_id) : null;

            return (
              <div
                key={room.id}
                className={`p-3 rounded-xl border transition cursor-pointer relative group ${statusClass}`}
                onClick={() => onNavigateModulo('quartos')}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sm text-slate-900">{room.numero}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                    {room.status}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-800 mt-1 truncate">{room.nome}</p>
                <p className="text-[10px] text-slate-500 truncate">{cat?.nome || 'Standard'}</p>

                {hospedeAtivo && (
                  <p className="mt-1 text-[11px] font-medium text-slate-900 truncate">
                    👤 {hospedeAtivo.nome_completo.split(' ')[0]}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Duas Colunas: Check-ins e Check-outs do Dia */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Entradas Hoje */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <LogIn className="w-4 h-4 text-emerald-600" />
              Check-ins Programados para Hoje ({checkinsHoje.length})
            </h3>
            <button
              onClick={() => onNavigateModulo('reservas')}
              className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-medium"
            >
              Ver todas <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {checkinsHoje.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              Não há check-ins pendentes para a data de hoje.
            </p>
          ) : (
            <div className="space-y-2">
              {checkinsHoje.map((res) => {
                const h = hospedes.find((hosp) => hosp.id === res.hospede_id);
                const q = quartos.find((quarto) => quarto.id === res.quarto_id);
                return (
                  <div
                    key={res.id}
                    className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{res.codigo_reserva}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-amber-100 text-amber-800">
                          Quarto {q?.numero}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{h?.nome_completo || 'Hóspede'}</p>
                      <p className="text-[10px] text-slate-400">
                        {res.adultos} adultos · {res.criancas} crianças · Diária: {formatarMoeda(res.valor_diaria)}
                      </p>
                    </div>
                    <button
                      onClick={() => onOpenCheckin(res.id)}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition"
                    >
                      Fazer Check-in
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Saídas Hoje */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <LogOut className="w-4 h-4 text-orange-600" />
              Check-outs Programados para Hoje ({checkoutsHoje.length})
            </h3>
            <button
              onClick={() => onNavigateModulo('reservas')}
              className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-medium"
            >
              Ver todas <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {checkoutsHoje.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              Nenhum check-out pendente para o dia de hoje.
            </p>
          ) : (
            <div className="space-y-2">
              {checkoutsHoje.map((res) => {
                const h = hospedes.find((hosp) => hosp.id === res.hospede_id);
                const q = quartos.find((quarto) => quarto.id === res.quarto_id);
                return (
                  <div
                    key={res.id}
                    className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{res.codigo_reserva}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-blue-100 text-blue-800">
                          Quarto {q?.numero}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{h?.nome_completo || 'Hóspede'}</p>
                      <p className="text-[10px] text-slate-400">
                        Saldo a acertar: <strong className="text-slate-900">{formatarMoeda(res.saldo_restante)}</strong>
                      </p>
                    </div>
                    <button
                      onClick={() => onOpenCheckout(res.id)}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition"
                    >
                      Fazer Check-out
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
