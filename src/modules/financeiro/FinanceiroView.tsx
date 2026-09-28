// =====================================================================
// POUSADA PMS — Módulo Financeiro (Contas a Pagar e a Receber)
// =====================================================================

import React, { useState } from 'react';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  CreditCard,
  DollarSign,
  Calendar,
  CheckCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { usePMS } from '../../context/PMSContext';
import { ContaFinanceira } from '../../types';

export const FinanceiroView: React.FC = () => {
  const { contasFinanceiras, reservas, hospedes, formasPagamento, formatarMoeda } = usePMS();

  const [abaAtiva, setAbaAtiva] = useState<'receber' | 'pagar' | 'formas'>('receber');

  const contasReceber = contasFinanceiras.filter((c) => c.tipo === 'RECEBER');
  const contasPagar = contasFinanceiras.filter((c) => c.tipo === 'PAGAR');

  const totalReceberPendente = contasReceber
    .filter((c) => c.status === 'PENDENTE')
    .reduce((sum, c) => sum + (c.valor_original - c.valor_liquidado), 0);

  const totalPagarPendente = contasPagar
    .filter((c) => c.status === 'PENDENTE')
    .reduce((sum, c) => sum + (c.valor_original - c.valor_liquidado), 0);

  const saldoProjetado = totalReceberPendente - totalPagarPendente;

  return (
    <div className="space-y-4">
      {/* Cards de Resumo Financeiro */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Contas a Receber (Pendentes)</span>
            <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-700">
            {formatarMoeda(totalReceberPendente)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{contasReceber.length} títulos gerados</p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Contas a Pagar (Pendentes)</span>
            <ArrowUpRight className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-rose-700">
            {formatarMoeda(totalPagarPendente)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{contasPagar.length} despesas cadastradas</p>
        </div>

        <div className="p-4 bg-slate-900 text-white rounded-xl border border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Saldo Projetado</span>
            <Wallet className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-amber-400">
            {formatarMoeda(saldoProjetado)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Previsão a curto prazo</p>
        </div>
      </div>

      {/* Barra de Abas */}
      <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setAbaAtiva('receber')}
            className={`px-3 py-1.5 rounded-lg transition ${
              abaAtiva === 'receber' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
            }`}
          >
            Contas a Receber ({contasReceber.length})
          </button>
          <button
            onClick={() => setAbaAtiva('pagar')}
            className={`px-3 py-1.5 rounded-lg transition ${
              abaAtiva === 'pagar' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
            }`}
          >
            Contas a Pagar ({contasPagar.length})
          </button>
          <button
            onClick={() => setAbaAtiva('formas')}
            className={`px-3 py-1.5 rounded-lg transition ${
              abaAtiva === 'formas' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
            }`}
          >
            Formas de Pagamento ({formasPagamento.length})
          </button>
        </div>
      </div>

      {/* Tabela de Contas a Receber */}
      {abaAtiva === 'receber' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                  <th className="p-3">Descrição / Origem</th>
                  <th className="p-3">Categoria</th>
                  <th className="p-3">Emissão</th>
                  <th className="p-3">Vencimento</th>
                  <th className="p-3 text-right">Valor Original</th>
                  <th className="p-3 text-right">Saldo Pendente</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {contasReceber.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition">
                    <td className="p-3 font-semibold text-slate-900">{c.descricao}</td>
                    <td className="p-3 text-slate-600 font-mono text-[11px]">{c.categoria}</td>
                    <td className="p-3 font-mono text-slate-600">{c.data_emissao}</td>
                    <td className="p-3 font-mono text-slate-900 font-semibold">{c.data_vencimento}</td>
                    <td className="p-3 text-right font-mono text-slate-600">
                      {formatarMoeda(c.valor_original)}
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900">
                      {formatarMoeda(c.valor_original - c.valor_liquidado)}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          c.status === 'RECEBIDO'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tabela de Contas a Pagar */}
      {abaAtiva === 'pagar' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                  <th className="p-3">Fornecedor / Beneficiário</th>
                  <th className="p-3">Descrição da Despesa</th>
                  <th className="p-3">Categoria</th>
                  <th className="p-3">Vencimento</th>
                  <th className="p-3 text-right">Valor</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {contasPagar.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition">
                    <td className="p-3 font-bold text-slate-900">{c.fornecedor || 'Geral'}</td>
                    <td className="p-3 text-slate-700">{c.descricao}</td>
                    <td className="p-3 font-mono text-[11px] text-slate-500">{c.categoria}</td>
                    <td className="p-3 font-mono font-semibold text-slate-800">{c.data_vencimento}</td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900">
                      {formatarMoeda(c.valor_original)}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          c.status === 'PAGO'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Formas de Pagamento */}
      {abaAtiva === 'formas' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {formasPagamento.map((fp) => (
            <div key={fp.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">{fp.nome}</span>
                <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-bold">
                  {fp.codigo}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Taxa de Operadora / Gateway: <strong className="font-mono text-slate-800">{fp.taxa_operadora_percentual}%</strong>
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold pt-1">
                <CheckCircle className="w-3.5 h-3.5" /> Habilitado no PDV / Recepção
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
