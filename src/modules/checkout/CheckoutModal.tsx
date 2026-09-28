// =====================================================================
// POUSADA PMS — Modal de Check-out e Fechamento de Folio
// =====================================================================

import React, { useState } from 'react';
import { X, LogOut, Receipt, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { usePMS } from '../../context/PMSContext';
import { Recibo } from '../../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservaId: number | null;
  onReciboGerado: (recibo: Recibo) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  reservaId,
  onReciboGerado,
}) => {
  const {
    reservas,
    hospedes,
    quartos,
    consumos,
    formasPagamento,
    formatarMoeda,
    fazerCheckout,
  } = usePMS();

  const [formaPagamentoId, setFormaPagamentoId] = useState<number>(1);
  const [descontoExtra, setDescontoExtra] = useState(0);
  const [taxaExtra, setTaxaExtra] = useState(0);
  const [observacoes, setObservacoes] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [erroMsg, setErroMsg] = useState('');

  if (!isOpen || !reservaId) return null;

  const res = reservas.find((r) => r.id === reservaId);
  if (!res) return null;

  const hosp = hospedes.find((h) => h.id === res.hospede_id);
  const room = quartos.find((q) => q.id === res.quarto_id);

  // Consumos pendentes desta reserva
  const consumosReserva = consumos.filter(
    (c) => c.reserva_id === res.id && c.status_faturamento !== 'CANCELADO'
  );
  const totalConsumos = consumosReserva.reduce((sum, c) => sum + c.valor_total, 0);

  // Composição da conta
  const totalDiarias = res.total_diarias;
  const subtotal = totalDiarias + totalConsumos;
  const totalFinal = Math.max(0, subtotal - (res.valor_desconto + descontoExtra) + (res.valor_taxas + taxaExtra));
  const valorJaPago = res.valor_sinal_pago;
  const saldoDevedor = Math.max(0, totalFinal - valorJaPago);

  const fpSelecionada = formasPagamento.find((f) => f.id === formaPagamentoId);

  const handleFinalizar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    setErroMsg('');

    try {
      const pagamentos = saldoDevedor > 0
        ? [
            {
              formaPagamentoId,
              formaNome: fpSelecionada?.nome || 'PIX Instantâneo',
              valor: saldoDevedor,
            },
          ]
        : [];

      const resp = await fazerCheckout(
        res.id,
        pagamentos,
        res.valor_desconto + descontoExtra,
        res.valor_taxas + taxaExtra,
        observacoes
      );

      if (!resp.success || !resp.recibo) {
        setErroMsg(resp.message || 'Erro ao realizar o check-out.');
        setSalvando(false);
        return;
      }

      onClose();
      onReciboGerado(resp.recibo);
    } catch {
      setErroMsg('Erro ao concluir o encerramento da hospedagem.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Cabeçalho */}
        <div className="px-6 py-4 bg-blue-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <LogOut className="w-5 h-5" />
            <div>
              <h2 className="text-base font-bold">Check-out e Quitação — {res.codigo_reserva}</h2>
              <p className="text-xs text-blue-100">
                {hosp?.nome_completo} · Quarto {room?.numero}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-blue-200 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {erroMsg && (
          <div className="px-6 py-2.5 bg-rose-50 border-b border-rose-200 flex items-center gap-2 text-rose-800 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{erroMsg}</span>
          </div>
        )}

        <form onSubmit={handleFinalizar} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* Folio / Extrato dos Itens */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center justify-between">
              <span>Extrato da Hospedagem</span>
              <span className="text-[10px] text-slate-500 font-mono">
                {res.data_checkin} até {res.data_checkout}
              </span>
            </h4>

            <div className="space-y-1.5 py-1">
              <div className="flex items-center justify-between text-slate-700">
                <span>Diárias ({res.total_diarias / res.valor_diaria} noites no {room?.numero})</span>
                <span className="font-mono font-semibold">{formatarMoeda(totalDiarias)}</span>
              </div>

              {consumosReserva.length > 0 ? (
                consumosReserva.map((c) => (
                  <div key={c.id} className="flex items-center justify-between text-slate-600 pl-2">
                    <span>
                      · {c.quantidade}x {c.nome_produto}
                    </span>
                    <span className="font-mono">{formatarMoeda(c.valor_total)}</span>
                  </div>
                ))
              ) : (
                <div className="text-[11px] text-slate-400 italic">Sem consumos extras lançados.</div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-200 space-y-1">
              <div className="flex items-center justify-between text-slate-500">
                <span>Subtotal Itens</span>
                <span className="font-mono font-semibold">{formatarMoeda(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-emerald-700 font-medium">
                <span>Total já adiantado / Sinal</span>
                <span className="font-mono font-semibold">- {formatarMoeda(valorJaPago)}</span>
              </div>
            </div>
          </div>

          {/* Ajuste de Desconto e Taxas */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Desconto Adicional (R$)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={descontoExtra}
                onChange={(e) => setDescontoExtra(Number(e.target.value))}
                className="w-full p-2 bg-white rounded-lg border border-slate-300 font-mono"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Taxas Adicionais (R$)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={taxaExtra}
                onChange={(e) => setTaxaExtra(Number(e.target.value))}
                className="w-full p-2 bg-white rounded-lg border border-slate-300 font-mono"
              />
            </div>
          </div>

          {/* Saldo Devedor em Destaque */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider block">
                Saldo a Quitar Agora
              </span>
              <span className="text-xs text-blue-700">Total geral: {formatarMoeda(totalFinal)}</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold font-mono text-blue-900">
                {formatarMoeda(saldoDevedor)}
              </span>
            </div>
          </div>

          {/* Forma de Pagamento para o Saldo */}
          {saldoDevedor > 0 && (
            <div>
              <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-slate-500" /> Forma de Pagamento do Saldo
              </label>
              <select
                value={formaPagamentoId}
                onChange={(e) => setFormaPagamentoId(Number(e.target.value))}
                className="w-full p-2.5 bg-white rounded-lg border border-slate-300 font-bold text-slate-900"
              >
                {formasPagamento.map((fp) => (
                  <option key={fp.id} value={fp.id}>
                    {fp.nome}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="font-bold text-slate-700 block mb-1">Observações de Fechamento</label>
            <input
              type="text"
              placeholder="Ex: Hóspede elogiou o café da manhã. Chave devolvida."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="w-full p-2 bg-white rounded-lg border border-slate-300"
            />
          </div>

          {/* Aviso Operacional */}
          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Ao concluir o check-out, o quarto passará imediatamente para o status de <strong>LIMPEZA</strong> para a governança e o recibo fiscal oficial será emitido.
            </span>
          </div>

          {/* Ações */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              className="px-5 py-2 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition disabled:opacity-50 flex items-center gap-1.5"
            >
              <Receipt className="w-4 h-4" />
              {salvando ? 'Processando...' : 'Quitar, Encerrar e Emitir Recibo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
