// =====================================================================
// POUSADA PMS — Calendário Visual e Mapa de Ocupação
// =====================================================================

import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  LogIn,
  LogOut,
  Info,
} from 'lucide-react';
import { usePMS } from '../../context/PMSContext';
import { Reserva, Quarto } from '../../types';

interface CalendarViewProps {
  onOpenNovaReservaComQuartoEData: (quartoId: number, data: string) => void;
  onOpenDetalhesReserva: (reservaId: number) => void;
  onOpenCheckin: (reservaId: number) => void;
  onOpenCheckout: (reservaId: number) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  onOpenNovaReservaComQuartoEData,
  onOpenDetalhesReserva,
  onOpenCheckin,
  onOpenCheckout,
}) => {
  const { quartos, categorias, reservas, hospedes, formatarMoeda } = usePMS();

  // Quantidade de dias a exibir: 7, 14 ou 21
  const [diasExibicao, setDiasExibicao] = useState<7 | 14 | 21>(14);
  const [dataBase, setDataBase] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  // Gera array com os dias a partir da dataBase
  const dias = Array.from({ length: diasExibicao }, (_, i) => {
    const d = new Date(dataBase);
    d.setDate(d.getDate() + i);
    return d;
  });

  const hojeIso = new Date().toISOString().substring(0, 10);

  const formatIso = (d: Date) => d.toISOString().substring(0, 10);

  const avancarPeriodo = (diasQtd: number) => {
    const novo = new Date(dataBase);
    novo.setDate(novo.getDate() + diasQtd);
    setDataBase(novo);
  };

  const irParaHoje = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    setDataBase(d);
  };

  const getCorStatusReserva = (status: Reserva['status']) => {
    switch (status) {
      case 'HOSPEDADO':
        return 'bg-blue-600 text-white border-blue-700 hover:bg-blue-700';
      case 'CONFIRMADA':
        return 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700';
      case 'PRÉ_RESERVA':
      case 'ORÇAMENTO':
        return 'bg-amber-500 text-slate-950 border-amber-600 hover:bg-amber-600';
      case 'CHECK_OUT':
        return 'bg-slate-400 text-white border-slate-500 hover:bg-slate-500';
      default:
        return 'bg-slate-600 text-white border-slate-700';
    }
  };

  return (
    <div className="space-y-4">
      {/* Controles de Navegação do Calendário */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => avancarPeriodo(-diasExibicao)}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
            title="Período anterior"
          >
            <ChevronLeft className="w-4 h-4 text-slate-600" />
          </button>
          <button
            onClick={irParaHoje}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
          >
            Hoje
          </button>
          <button
            onClick={() => avancarPeriodo(diasExibicao)}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
            title="Próximo período"
          >
            <ChevronRight className="w-4 h-4 text-slate-600" />
          </button>

          <span className="text-xs font-bold text-slate-900 ml-2">
            {dias[0].toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })} –{' '}
            {dias[dias.length - 1].toLocaleDateString('pt-BR', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Seletor de Escala de Dias */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setDiasExibicao(7)}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                diasExibicao === 7 ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              7 dias
            </button>
            <button
              onClick={() => setDiasExibicao(14)}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                diasExibicao === 14 ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              14 dias
            </button>
            <button
              onClick={() => setDiasExibicao(21)}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                diasExibicao === 21 ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              21 dias
            </button>
          </div>

          {/* Legenda de Cores */}
          <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-600">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-blue-600" /> Hospedado
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-emerald-600" /> Confirmada
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-amber-500" /> Pré-Reserva
            </span>
          </div>
        </div>
      </div>

      {/* Grade Interativa do Calendário */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            {/* Cabeçalho de Datas */}
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs">
                {/* Coluna Fixa do Quarto */}
                <th className="sticky left-0 bg-slate-50 z-20 w-44 p-2.5 font-bold border-r border-slate-200 shadow-2xs">
                  Quartos ({quartos.length})
                </th>

                {dias.map((d) => {
                  const dIso = formatIso(d);
                  const isHoje = dIso === hojeIso;
                  const isFimDeSemana = d.getDay() === 0 || d.getDay() === 6;

                  return (
                    <th
                      key={dIso}
                      className={`p-2 text-center border-r border-slate-200 min-w-[70px] ${
                        isHoje
                          ? 'bg-amber-100/70 font-bold text-amber-900'
                          : isFimDeSemana
                          ? 'bg-slate-100/60 font-semibold'
                          : ''
                      }`}
                    >
                      <div className="text-[10px] uppercase tracking-wider text-slate-600">
                        {d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}
                      </div>
                      <div className="text-sm font-mono font-bold mt-0.5">
                        {d.getDate()}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* Linhas de Quartos (Q01 a Q20) */}
            <tbody className="divide-y divide-slate-100 text-xs">
              {quartos.map((room) => {
                const cat = categorias.find((c) => c.id === room.categoria_id);
                const reservasDoQuarto = reservas.filter(
                  (r) => r.quarto_id === room.id && r.status !== 'CANCELADA'
                );

                return (
                  <tr key={room.id} className="hover:bg-slate-50/50 transition">
                    {/* Coluna Fixa com Detalhe do Quarto */}
                    <td className="sticky left-0 bg-white z-10 p-2.5 border-r border-slate-200 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 font-mono">{room.numero}</span>
                        <span
                          className={`text-[9px] px-1 py-0.5 rounded font-bold uppercase ${
                            room.status === 'LIVRE'
                              ? 'bg-emerald-100 text-emerald-800'
                              : room.status === 'OCUPADO'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {room.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 truncate mt-0.5">{room.nome}</p>
                      <p className="text-[10px] text-slate-400 truncate">{cat?.nome}</p>
                    </td>

                    {/* Células de Dias para o Quarto */}
                    {dias.map((d) => {
                      const dIso = formatIso(d);
                      const isHoje = dIso === hojeIso;

                      // Checa se existe reserva neste dia
                      // Uma diária do dia 'd' ocorre se: data_checkin <= d E d < data_checkout
                      const reserva = reservasDoQuarto.find(
                        (r) => r.data_checkin <= dIso && dIso < r.data_checkout
                      );

                      if (reserva) {
                        const h = hospedes.find((hosp) => hosp.id === reserva.hospede_id);
                        const isInicio = reserva.data_checkin === dIso;
                        const cor = getCorStatusReserva(reserva.status);

                        return (
                          <td
                            key={dIso}
                            onClick={() => onOpenDetalhesReserva(reserva.id)}
                            className="p-1 border-r border-slate-200 text-center cursor-pointer transition"
                            title={`Reserva ${reserva.codigo_reserva}: ${h?.nome_completo || 'Hóspede'} (${reserva.data_checkin} a ${reserva.data_checkout}) - Clique para ver`}
                          >
                            <div
                              className={`h-10 rounded px-1.5 py-1 text-[10px] font-medium border flex flex-col justify-center overflow-hidden transition shadow-2xs ${cor}`}
                            >
                              {isInicio ? (
                                <>
                                  <span className="font-bold truncate leading-tight">
                                    {h?.nome_completo.split(' ')[0] || 'Hóspede'}
                                  </span>
                                  <span className="text-[9px] opacity-90 truncate leading-tight">
                                    {reserva.codigo_reserva}
                                  </span>
                                </>
                              ) : (
                                <span className="text-center font-bold tracking-widest opacity-60">···</span>
                              )}
                            </div>
                          </td>
                        );
                      }

                      // Célula Vazia: Permite clicar para criar reserva com quarto e data pré-selecionados
                      return (
                        <td
                          key={dIso}
                          onClick={() => onOpenNovaReservaComQuartoEData(room.id, dIso)}
                          className={`p-1 border-r border-slate-100 text-center cursor-pointer hover:bg-blue-50/60 transition group ${
                            isHoje ? 'bg-amber-50/40' : ''
                          }`}
                          title={`Clique para reservar o Quarto ${room.numero} a partir de ${dIso}`}
                        >
                          <div className="h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 text-blue-600 transition">
                            <Plus className="w-3.5 h-3.5" />
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2 text-xs text-slate-500">
        <Info className="w-4 h-4 text-slate-400 shrink-0" />
        <span>
          <strong>Dica Operacional:</strong> Clique em qualquer célula vazia para iniciar uma reserva rápida para aquele quarto e data. Clique em uma barra de reserva para abrir os detalhes, consumo ou realizar check-in/check-out.
        </span>
      </div>
    </div>
  );
};
