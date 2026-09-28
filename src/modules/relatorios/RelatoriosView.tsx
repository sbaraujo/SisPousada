// =====================================================================
// POUSADA PMS — Central de Relatórios Gerenciais, KPIs e Exportação
// =====================================================================

import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  DollarSign,
  BedDouble,
  TrendingUp,
  Percent,
} from 'lucide-react';
import { usePMS } from '../../context/PMSContext';

export const RelatoriosView: React.FC = () => {
  const { quartos, categorias, reservas, consumos, formatarMoeda, pousada } = usePMS();

  const [tipoRelatorio, setTipoRelatorio] = useState<'ocupacao' | 'faturamento' | 'consumos' | 'origem'>('ocupacao');

  // Cálculos Gerais
  const totalUH = quartos.length || 20;
  const reservasValidas = reservas.filter((r) => r.status !== 'CANCELADA');
  const totalDiariasFaturadas = reservasValidas.reduce((s, r) => s + r.total_diarias, 0);
  const totalConsumosFaturados = consumos.reduce((s, c) => s + c.valor_total, 0);
  const totalFaturamento = totalDiariasFaturadas + totalConsumosFaturados;

  const adr = reservasValidas.length > 0 ? Math.round(totalDiariasFaturadas / reservasValidas.length) : 380;
  const taxaOcupacao = Math.round((quartos.filter((q) => q.status === 'OCUPADO').length / totalUH) * 100);
  const revpar = Math.round((taxaOcupacao / 100) * adr);

  const handleImprimir = () => {
    window.print();
  };

  const exportarCSV = () => {
    let csv = '';
    if (tipoRelatorio === 'ocupacao') {
      csv = 'Quarto,Categoria,Status,Capacidade,TarifaPadrao\n' +
        quartos.map((q) => {
          const cat = categorias.find((c) => c.id === q.categoria_id);
          return `"${q.numero}","${cat?.nome || ''}","${q.status}",${q.capacidade_adultos},${cat?.tarifa_base || 0}`;
        }).join('\n');
    } else {
      csv = 'CodigoReserva,Checkin,Checkout,Diarias,Taxas,Total,Status,Canal\n' +
        reservasValidas.map((r) => `"${r.codigo_reserva}","${r.data_checkin}","${r.data_checkout}",${r.total_diarias},${r.valor_taxas},${r.valor_total},"${r.status}","${r.origem}"`).join('\n');
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_${tipoRelatorio}_${new Date().toISOString().substring(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Topo com Seleção de Relatório e Exportação */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setTipoRelatorio('ocupacao')}
              className={`px-3 py-1.5 rounded-lg transition ${
                tipoRelatorio === 'ocupacao' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
              }`}
            >
              Ocupação & Unidades
            </button>
            <button
              onClick={() => setTipoRelatorio('faturamento')}
              className={`px-3 py-1.5 rounded-lg transition ${
                tipoRelatorio === 'faturamento' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
              }`}
            >
              Faturamento Consolidado
            </button>
            <button
              onClick={() => setTipoRelatorio('consumos')}
              className={`px-3 py-1.5 rounded-lg transition ${
                tipoRelatorio === 'consumos' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
              }`}
            >
              Consumos & Frigobar
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportarCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </button>
          <button
            onClick={handleImprimir}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir Relatório</span>
          </button>
        </div>
      </div>

      {/* Relatório Imprimível */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-6">
        {/* Cabeçalho do Relatório */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-950">
              {pousada.nome_fantasia} — Relatório Gerencial
            </h2>
            <p className="text-xs text-slate-500">
              Tipo: <strong className="uppercase">{tipoRelatorio}</strong> · Gerado em:{' '}
              {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}
            </p>
          </div>
          <div className="text-right text-xs font-mono text-slate-500">
            <span>20 UH Totais</span> · <span>Moeda: {pousada.moeda}</span>
          </div>
        </div>

        {/* KPIs no Topo do Relatório */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold">Taxa Ocupação</span>
            <div className="text-xl font-bold font-mono text-slate-900">{taxaOcupacao}%</div>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold">Diária Média (ADR)</span>
            <div className="text-xl font-bold font-mono text-slate-900">{formatarMoeda(adr)}</div>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold">RevPAR</span>
            <div className="text-xl font-bold font-mono text-slate-900">{formatarMoeda(revpar)}</div>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold">Faturamento Total</span>
            <div className="text-xl font-bold font-mono text-emerald-700">{formatarMoeda(totalFaturamento)}</div>
          </div>
        </div>

        {/* Tabelas de Conteúdo conforme o tipo */}
        {tipoRelatorio === 'ocupacao' && (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                <th className="p-2.5">UH</th>
                <th className="p-2.5">Nome do Quarto</th>
                <th className="p-2.5">Categoria</th>
                <th className="p-2.5">Andar</th>
                <th className="p-2.5 text-center">Capacidade</th>
                <th className="p-2.5 text-right">Tarifa Padrão</th>
                <th className="p-2.5">Status Atual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {quartos.map((room) => {
                const cat = categorias.find((c) => c.id === room.categoria_id);
                return (
                  <tr key={room.id}>
                    <td className="p-2.5 font-mono font-bold text-slate-900">{room.numero}</td>
                    <td className="p-2.5 font-semibold text-slate-800">{room.nome}</td>
                    <td className="p-2.5 text-slate-600">{cat?.nome}</td>
                    <td className="p-2.5 text-slate-500">{room.andar}</td>
                    <td className="p-2.5 text-center font-mono">{room.capacidade_adultos} adultos</td>
                    <td className="p-2.5 text-right font-mono font-bold">{formatarMoeda(cat?.tarifa_base || 0)}</td>
                    <td className="p-2.5">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 border">
                        {room.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {tipoRelatorio === 'faturamento' && (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                <th className="p-2.5">Reserva</th>
                <th className="p-2.5">Período</th>
                <th className="p-2.5">Canal</th>
                <th className="p-2.5 text-right">Diárias</th>
                <th className="p-2.5 text-right">Taxas</th>
                <th className="p-2.5 text-right">Descontos</th>
                <th className="p-2.5 text-right">Total Geral</th>
                <th className="p-2.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reservasValidas.map((r) => (
                <tr key={r.id}>
                  <td className="p-2.5 font-mono font-bold text-slate-900">{r.codigo_reserva}</td>
                  <td className="p-2.5 text-slate-600 font-mono">{r.data_checkin} a {r.data_checkout}</td>
                  <td className="p-2.5 text-slate-600 uppercase text-[10px]">{r.origem}</td>
                  <td className="p-2.5 text-right font-mono">{formatarMoeda(r.total_diarias)}</td>
                  <td className="p-2.5 text-right font-mono text-slate-500">{formatarMoeda(r.valor_taxas)}</td>
                  <td className="p-2.5 text-right font-mono text-emerald-700">-{formatarMoeda(r.valor_desconto)}</td>
                  <td className="p-2.5 text-right font-mono font-bold text-slate-900">{formatarMoeda(r.valor_total)}</td>
                  <td className="p-2.5 text-center">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 border">
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tipoRelatorio === 'consumos' && (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                <th className="p-2.5">Data Lançamento</th>
                <th className="p-2.5">Item Consumido</th>
                <th className="p-2.5 text-center">Qtd</th>
                <th className="p-2.5 text-right">Unitário</th>
                <th className="p-2.5 text-right">Total</th>
                <th className="p-2.5">Status Faturamento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {consumos.map((c) => (
                <tr key={c.id}>
                  <td className="p-2.5 font-mono text-slate-600">{c.data_lancamento}</td>
                  <td className="p-2.5 font-semibold text-slate-900">{c.nome_produto}</td>
                  <td className="p-2.5 text-center font-mono">{c.quantidade}</td>
                  <td className="p-2.5 text-right font-mono text-slate-600">{formatarMoeda(c.valor_unitario)}</td>
                  <td className="p-2.5 text-right font-mono font-bold text-slate-900">{formatarMoeda(c.valor_total)}</td>
                  <td className="p-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 border">
                      {c.status_faturamento}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
