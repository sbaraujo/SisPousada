// =====================================================================
// POUSADA PMS — Módulo de Caixa (Abertura, Movimentações e Fechamento)
// =====================================================================

import React, { useState } from 'react';
import {
  CircleDollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  Lock,
  Unlock,
  Plus,
  Minus,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  FileSpreadsheet,
  X,
} from 'lucide-react';
import { usePMS } from '../../context/PMSContext';

export const CaixaView: React.FC = () => {
  const {
    caixaAtivo,
    movimentosCaixa,
    formasPagamento,
    abrirCaixa,
    lancarMovimentoCaixa,
    fecharCaixa,
    formatarMoeda,
  } = usePMS();

  // Estados de Modais
  const [modalAberturaOpen, setModalAberturaOpen] = useState(false);
  const [modalMovimentoOpen, setModalMovimentoOpen] = useState(false);
  const [modalFechamentoOpen, setModalFechamentoOpen] = useState(false);

  // Campos Abertura
  const [saldoInicialInput, setSaldoInicialInput] = useState(300);

  // Campos Movimento
  const [tipoMov, setTipoMov] = useState<'ENTRADA' | 'SAIDA' | 'SANGRIA' | 'SUPRIMENTO'>('ENTRADA');
  const [categoriaMov, setCategoriaMov] = useState('PAGAMENTO_AVULSO');
  const [descricaoMov, setDescricaoMov] = useState('');
  const [valorMov, setValorMov] = useState(50);
  const [formaPagIdMov, setFormaPagIdMov] = useState<number>(4); // Dinheiro

  // Campos Fechamento
  const [saldoContado, setSaldoContado] = useState(0);
  const [obsFechamento, setObsFechamento] = useState('');

  const handleAbrir = async (e: React.FormEvent) => {
    e.preventDefault();
    await abrirCaixa(Number(saldoInicialInput));
    setModalAberturaOpen(false);
  };

  const handleMovimento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricaoMov.trim() || valorMov <= 0) return;

    await lancarMovimentoCaixa(
      tipoMov,
      categoriaMov,
      descricaoMov.trim(),
      Number(valorMov),
      formaPagIdMov
    );

    setModalMovimentoOpen(false);
    setDescricaoMov('');
    setValorMov(50);
  };

  const handleFechar = async (e: React.FormEvent) => {
    e.preventDefault();
    await fecharCaixa(Number(saldoContado), obsFechamento);
    setModalFechamentoOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Banner de Status do Caixa */}
      <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`p-1.5 rounded-lg ${
                caixaAtivo ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}
            >
              {caixaAtivo ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {caixaAtivo ? `Caixa Aberto — ${caixaAtivo.codigo}` : 'Caixa Fechado'}
              </h2>
              <p className="text-xs text-slate-500">
                {caixaAtivo
                  ? `Aberto por ${caixaAtivo.usuario_abertura_nome} em ${caixaAtivo.data_hora_abertura}`
                  : 'Nenhum terminal de caixa está aberto no momento.'}
              </p>
            </div>
          </div>
        </div>

        {/* Botões de Abertura / Fechamento / Movimento */}
        <div className="flex flex-wrap items-center gap-2">
          {!caixaAtivo ? (
            <button
              onClick={() => {
                setSaldoInicialInput(300);
                setModalAberturaOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>Abrir Caixa do Dia</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => setModalMovimentoOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nova Movimentação</span>
              </button>

              <button
                onClick={() => {
                  setSaldoContado(caixaAtivo.saldo_esperado);
                  setModalFechamentoOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Encerrar e Fechar Caixa</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Cartões de Balanço Operacional do Caixa Ativo */}
      {caixaAtivo && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-medium text-slate-500">Fundo de Abertura</span>
            <div className="mt-1 text-xl font-bold font-mono text-slate-900">
              {formatarMoeda(caixaAtivo.saldo_inicial)}
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-medium text-emerald-700 flex items-center gap-1">
              <ArrowDownLeft className="w-3.5 h-3.5" /> Total Entradas
            </span>
            <div className="mt-1 text-xl font-bold font-mono text-emerald-700">
              + {formatarMoeda(caixaAtivo.total_entradas)}
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-medium text-rose-700 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> Total Saídas / Sangrias
            </span>
            <div className="mt-1 text-xl font-bold font-mono text-rose-700">
              - {formatarMoeda(caixaAtivo.total_saidas)}
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 shadow-2xs">
            <span className="text-xs font-bold text-blue-900 uppercase">Saldo Esperado em Caixa</span>
            <div className="mt-1 text-2xl font-bold font-mono text-blue-950">
              {formatarMoeda(caixaAtivo.saldo_esperado)}
            </div>
          </div>
        </div>
      )}

      {/* Tabela de Movimentações */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
            Lançamentos e Movimentações do Terminal
          </h3>
          <span className="text-xs text-slate-500">{movimentosCaixa.length} registros</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <th className="p-3">Data / Hora</th>
                <th className="p-3">Tipo</th>
                <th className="p-3">Categoria</th>
                <th className="p-3">Descrição</th>
                <th className="p-3">Forma de Pagamento</th>
                <th className="p-3 text-right">Valor</th>
                <th className="p-3">Operador</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {movimentosCaixa.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Nenhuma movimentação registrada no caixa atual.
                  </td>
                </tr>
              ) : (
                movimentosCaixa.map((m) => {
                  const isEntrada = m.tipo === 'ENTRADA' || m.tipo === 'SUPRIMENTO';
                  return (
                    <tr key={m.id} className="hover:bg-slate-50/60 transition">
                      <td className="p-3 font-mono text-slate-600">{m.data_hora}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            isEntrada
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-rose-50 text-rose-800 border-rose-200'
                          }`}
                        >
                          {m.tipo}
                        </span>
                      </td>
                      <td className="p-3 font-medium text-slate-700">{m.categoria}</td>
                      <td className="p-3 text-slate-900 font-semibold">{m.descricao}</td>
                      <td className="p-3 text-slate-600">{m.forma_pagamento_nome || 'Dinheiro'}</td>
                      <td
                        className={`p-3 text-right font-mono font-bold ${
                          isEntrada ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                      >
                        {isEntrada ? '+' : '-'} {formatarMoeda(m.valor)}
                      </td>
                      <td className="p-3 text-slate-500 text-[11px]">{m.usuario_nome || 'Operador'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Abertura de Caixa */}
      {modalAberturaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-emerald-700 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Abertura de Caixa</h3>
              <button onClick={() => setModalAberturaOpen(false)}>
                <X className="w-4 h-4 text-emerald-200 hover:text-white" />
              </button>
            </div>
            <form onSubmit={handleAbrir} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Fundo de Troco Inicial (R$) *
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  value={saldoInicialInput}
                  onChange={(e) => setSaldoInicialInput(Number(e.target.value))}
                  className="w-full p-2.5 bg-white rounded-lg border border-slate-300 font-mono font-bold text-sm"
                  required
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Valor em cédulas e moedas físicas disponíveis na gaveta.
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalAberturaOpen(false)}
                  className="px-3 py-1.5 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg"
                >
                  Confirmar Abertura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Movimentação Avulsa (Sangria / Suprimento / Saída) */}
      {modalMovimentoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Lançar Movimento de Caixa</h3>
              <button onClick={() => setModalMovimentoOpen(false)}>
                <X className="w-4 h-4 text-slate-400 hover:text-white" />
              </button>
            </div>
            <form onSubmit={handleMovimento} className="p-6 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tipo de Movimento</label>
                  <select
                    value={tipoMov}
                    onChange={(e) => setTipoMov(e.target.value as any)}
                    className="w-full p-2 bg-white rounded-lg border border-slate-300 font-semibold"
                  >
                    <option value="ENTRADA">Entrada / Recebimento</option>
                    <option value="SAIDA">Saída / Pagamento</option>
                    <option value="SANGRIA">Sangria (Retirada p/ Cofre)</option>
                    <option value="SUPRIMENTO">Suprimento (Aporte Troco)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Valor (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={valorMov}
                    onChange={(e) => setValorMov(Number(e.target.value))}
                    className="w-full p-2 bg-white rounded-lg border border-slate-300 font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Descrição Detalhada *</label>
                <input
                  type="text"
                  placeholder="Ex: Compra de saco de gelo no comércio vizinho"
                  value={descricaoMov}
                  onChange={(e) => setDescricaoMov(e.target.value)}
                  className="w-full p-2 bg-white rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Forma de Pagamento</label>
                <select
                  value={formaPagIdMov}
                  onChange={(e) => setFormaPagIdMov(Number(e.target.value))}
                  className="w-full p-2 bg-white rounded-lg border border-slate-300"
                >
                  {formasPagamento.map((fp) => (
                    <option key={fp.id} value={fp.id}>
                      {fp.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalMovimentoOpen(false)}
                  className="px-3 py-1.5 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
                >
                  Gravar Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Fechamento de Caixa com Conferência */}
      {modalFechamentoOpen && caixaAtivo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-rose-700 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Fechamento do Caixa — {caixaAtivo.codigo}</h3>
              <button onClick={() => setModalFechamentoOpen(false)}>
                <X className="w-4 h-4 text-rose-200 hover:text-white" />
              </button>
            </div>
            <form onSubmit={handleFechar} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Fundo Inicial:</span>
                  <span className="font-mono">{formatarMoeda(caixaAtivo.saldo_inicial)}</span>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>Total Entradas:</span>
                  <span className="font-mono">+ {formatarMoeda(caixaAtivo.total_entradas)}</span>
                </div>
                <div className="flex justify-between text-rose-700">
                  <span>Total Saídas:</span>
                  <span className="font-mono">- {formatarMoeda(caixaAtivo.total_saidas)}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-200 text-sm">
                  <span>Saldo Esperado:</span>
                  <span className="font-mono">{formatarMoeda(caixaAtivo.saldo_esperado)}</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Saldo Físico Contado na Gaveta (R$) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={saldoContado}
                  onChange={(e) => setSaldoContado(Number(e.target.value))}
                  className="w-full p-2.5 bg-white rounded-lg border border-slate-300 font-mono font-bold text-base"
                  required
                />
              </div>

              {/* Cálculo da Diferença */}
              {(() => {
                const diff = saldoContado - caixaAtivo.saldo_esperado;
                return (
                  <div
                    className={`p-3 rounded-lg border text-xs font-bold flex items-center justify-between ${
                      Math.abs(diff) < 0.01
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : diff > 0
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}
                  >
                    <span>Resultado da Conferência:</span>
                    <span className="font-mono">
                      {Math.abs(diff) < 0.01
                        ? 'ZERO (Exato)'
                        : diff > 0
                        ? `SOBRA: +${formatarMoeda(diff)}`
                        : `FALTA: ${formatarMoeda(diff)}`}
                    </span>
                  </div>
                );
              })()}

              <div>
                <label className="font-bold text-slate-700 block mb-1">Observações do Encerramento</label>
                <input
                  type="text"
                  placeholder="Ex: Tudo conferido e envelopes entregues à gerência"
                  value={obsFechamento}
                  onChange={(e) => setObsFechamento(e.target.value)}
                  className="w-full p-2 bg-white rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalFechamentoOpen(false)}
                  className="px-3 py-1.5 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
                >
                  Confirmar Fechamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
