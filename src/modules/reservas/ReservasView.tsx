// =====================================================================
// POUSADA PMS — Módulo de Gestão de Reservas
// =====================================================================

import React, { useState } from 'react';
import {
  CalendarCheck2,
  Search,
  Plus,
  Filter,
  Download,
  LogIn,
  LogOut,
  Edit,
  XCircle,
  FileText,
} from 'lucide-react';
import { usePMS } from '../../context/PMSContext';
import { Reserva, StatusReserva } from '../../types';

interface ReservasViewProps {
  onOpenNovaReserva: () => void;
  onEditarReserva: (reserva: Reserva) => void;
  onOpenCheckin: (reservaId: number) => void;
  onOpenCheckout: (reservaId: number) => void;
}

export const ReservasView: React.FC<ReservasViewProps> = ({
  onOpenNovaReserva,
  onEditarReserva,
  onOpenCheckin,
  onOpenCheckout,
}) => {
  const { reservas, quartos, hospedes, formatarMoeda, cancelarReserva } = usePMS();

  const [busca, setBusca] = useState('');
  const [statusFiltro, setStatusFiltro] = useState<StatusReserva | 'TODAS'>('TODAS');

  const q = busca.toLowerCase().trim();

  const reservasFiltradas = reservas.filter((res) => {
    // Filtro por status
    if (statusFiltro !== 'TODAS' && res.status !== statusFiltro) return false;

    // Filtro por texto
    if (!q) return true;

    const h = hospedes.find((hosp) => hosp.id === res.hospede_id);
    const room = quartos.find((quarto) => quarto.id === res.quarto_id);

    return (
      res.codigo_reserva.toLowerCase().includes(q) ||
      h?.nome_completo.toLowerCase().includes(q) ||
      h?.documento.includes(q) ||
      room?.numero.toLowerCase().includes(q)
    );
  });

  const exportarCSV = () => {
    const cabecalho = 'Codigo,Hospede,Documento,Quarto,Checkin,Checkout,ValorTotal,SinalPago,SaldoRestante,Status,Origem\n';
    const linhas = reservasFiltradas.map((r) => {
      const h = hospedes.find((hosp) => hosp.id === r.hospede_id);
      const room = quartos.find((quarto) => quarto.id === r.quarto_id);
      return `"${r.codigo_reserva}","${h?.nome_completo || ''}","${h?.documento || ''}","${room?.numero || ''}","${r.data_checkin}","${r.data_checkout}",${r.valor_total},${r.valor_sinal_pago},${r.saldo_restante},"${r.status}","${r.origem}"`;
    }).join('\n');

    const blob = new Blob([cabecalho + linhas], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reservas_${new Date().toISOString().substring(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCancelar = async (res: Reserva) => {
    const motivo = prompt(`Informe o motivo do cancelamento da reserva ${res.codigo_reserva}:`, 'Desistência do cliente');
    if (motivo !== null) {
      await cancelarReserva(res.id, motivo);
    }
  };

  const getBadgeStatus = (status: StatusReserva) => {
    switch (status) {
      case 'CONFIRMADA':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'HOSPEDADO':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'CHECK_OUT':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'PRÉ_RESERVA':
      case 'ORÇAMENTO':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'CANCELADA':
      case 'NO_SHOW':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Barra de Filtros e Ações */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
        {/* Campo de Busca */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por código, hóspede, documento ou quarto..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-slate-400 transition"
          />
        </div>

        {/* Botões de Ação */}
        <div className="flex items-center gap-2">
          <button
            onClick={exportarCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            title="Exportar para CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar</span>
          </button>
          <button
            onClick={onOpenNovaReserva}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nova Reserva</span>
          </button>
        </div>
      </div>

      {/* Tabs de Filtro por Status (Controles Segmentados Interativos) */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 overflow-x-auto text-xs font-medium">
        {(['TODAS', 'CONFIRMADA', 'HOSPEDADO', 'CHECK_OUT', 'PRÉ_RESERVA', 'CANCELADA'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setStatusFiltro(st)}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              statusFiltro === st
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {st === 'TODAS' ? 'Todas as Reservas' : st}
          </button>
        ))}
      </div>

      {/* Tabela de Reservas */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="p-3">Código</th>
                <th className="p-3">Hóspede Titular</th>
                <th className="p-3">Quarto</th>
                <th className="p-3">Check-in</th>
                <th className="p-3">Check-out</th>
                <th className="p-3 text-right">Total</th>
                <th className="p-3 text-right">Saldo</th>
                <th className="p-3">Canal</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Ações Operacionais</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reservasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-400">
                    Nenhuma reserva encontrada para os filtros selecionados.
                  </td>
                </tr>
              ) : (
                reservasFiltradas.map((r) => {
                  const h = hospedes.find((hosp) => hosp.id === r.hospede_id);
                  const room = quartos.find((quarto) => quarto.id === r.quarto_id);
                  return (
                    <tr key={r.id} className="hover:bg-slate-50/60 transition">
                      <td className="p-3 font-mono font-bold text-slate-900">
                        {r.codigo_reserva}
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-slate-900">{h?.nome_completo || 'Hóspede'}</div>
                        <div className="text-[10px] text-slate-500">{h?.tipo_documento}: {h?.documento}</div>
                      </td>
                      <td className="p-3">
                        <span className="font-mono font-bold text-slate-800">{room?.numero}</span>
                        <span className="text-[10px] text-slate-500 block">{room?.nome}</span>
                      </td>
                      <td className="p-3 font-mono">{r.data_checkin}</td>
                      <td className="p-3 font-mono">{r.data_checkout}</td>
                      <td className="p-3 text-right font-mono font-semibold text-slate-900">
                        {formatarMoeda(r.valor_total)}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">
                        {formatarMoeda(r.saldo_restante)}
                      </td>
                      <td className="p-3 text-[10px] font-semibold text-slate-600 uppercase">
                        {r.origem}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getBadgeStatus(r.status)}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Ação de Check-in se confirmada */}
                          {r.status === 'CONFIRMADA' && (
                            <button
                              onClick={() => onOpenCheckin(r.id)}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[11px] flex items-center gap-1 transition shadow-2xs"
                              title="Realizar Check-in"
                            >
                              <LogIn className="w-3 h-3" /> Check-in
                            </button>
                          )}

                          {/* Ação de Check-out se hospedado */}
                          {r.status === 'HOSPEDADO' && (
                            <button
                              onClick={() => onOpenCheckout(r.id)}
                              className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold text-[11px] flex items-center gap-1 transition shadow-2xs"
                              title="Realizar Check-out"
                            >
                              <LogOut className="w-3 h-3" /> Check-out
                            </button>
                          )}

                          {/* Editar */}
                          <button
                            onClick={() => onEditarReserva(r)}
                            className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition"
                            title="Editar Dados da Reserva"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {/* Cancelar se não for concluída ou cancelada */}
                          {r.status !== 'CHECK_OUT' && r.status !== 'CANCELADA' && (
                            <button
                              onClick={() => handleCancelar(r)}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                              title="Cancelar Reserva"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
