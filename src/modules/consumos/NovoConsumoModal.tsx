// =====================================================================
// POUSADA PMS — Modal de Lançamento de Consumo na Hospedagem
// =====================================================================

import React, { useState, useEffect } from 'react';
import { X, UtensilsCrossed, BedDouble, AlertCircle } from 'lucide-react';
import { usePMS } from '../../context/PMSContext';

interface NovoConsumoModalProps {
  isOpen: boolean;
  onClose: () => void;
  quartoIdInicial?: number;
}

export const NovoConsumoModal: React.FC<NovoConsumoModalProps> = ({
  isOpen,
  onClose,
  quartoIdInicial,
}) => {
  const { quartos, reservas, hospedes, produtos, formatarMoeda, lancarConsumo } = usePMS();

  const [quartoId, setQuartoId] = useState<number | ''>('');
  const [produtoId, setProdutoId] = useState<number | ''>('');
  const [quantidade, setQuantidade] = useState<number>(1);
  const [observacoes, setObservacoes] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [erroMsg, setErroMsg] = useState('');

  // Quartos ocupados com reservas ativas
  const reservasAtivas = reservas.filter((r) => r.status === 'HOSPEDADO');

  useEffect(() => {
    if (quartoIdInicial) {
      setQuartoId(quartoIdInicial);
    } else if (reservasAtivas[0]) {
      setQuartoId(reservasAtivas[0].quarto_id);
    }
    if (produtos[0]) {
      setProdutoId(produtos[0].id);
    }
    setQuantidade(1);
    setObservacoes('');
    setErroMsg('');
  }, [isOpen, quartoIdInicial, produtos, reservasAtivas]);

  if (!isOpen) return null;

  const prodSelecionado = produtos.find((p) => p.id === Number(produtoId));
  const resAtiva = reservasAtivas.find((r) => r.quarto_id === Number(quartoId));
  const hospAtivo = resAtiva ? hospedes.find((h) => h.id === resAtiva.hospede_id) : null;
  const room = quartos.find((q) => q.id === Number(quartoId));

  const totalCalculado = prodSelecionado ? prodSelecionado.preco_venda * quantidade : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quartoId || !resAtiva) {
      setErroMsg('Selecione um quarto com hospedagem ativa.');
      return;
    }
    if (!produtoId || !prodSelecionado) {
      setErroMsg('Selecione um item do catálogo.');
      return;
    }
    if (quantidade <= 0) {
      setErroMsg('A quantidade deve ser maior que zero.');
      return;
    }

    setSalvando(true);
    setErroMsg('');

    try {
      await lancarConsumo({
        reserva_id: resAtiva.id,
        quarto_id: Number(quartoId),
        produto_id: Number(produtoId),
        nome_produto: prodSelecionado.nome,
        quantidade,
        valor_unitario: prodSelecionado.preco_venda,
        valor_total: totalCalculado,
        status_faturamento: 'PENDENTE',
        observacoes,
      });

      onClose();
    } catch {
      setErroMsg('Erro ao lançar consumo.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Cabeçalho */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold">Lançar Consumo na Hospedagem</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {erroMsg && (
          <div className="px-6 py-2.5 bg-rose-50 border-b border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{erroMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Quarto Ocupado */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Quarto Ocupado (Hospedagem Ativa) *
            </label>
            {reservasAtivas.length === 0 ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 font-medium">
                Nenhum quarto está com hóspede no momento. Faça um check-in antes de lançar consumos.
              </div>
            ) : (
              <select
                value={quartoId}
                onChange={(e) => setQuartoId(Number(e.target.value))}
                className="w-full p-2.5 bg-white rounded-lg border border-slate-300 font-bold text-slate-900"
                required
              >
                {reservasAtivas.map((r) => {
                  const qto = quartos.find((q) => q.id === r.quarto_id);
                  const h = hospedes.find((hosp) => hosp.id === r.hospede_id);
                  return (
                    <option key={r.id} value={r.quarto_id}>
                      Quarto {qto?.numero} — {h?.nome_completo} ({r.codigo_reserva})
                    </option>
                  );
                })}
              </select>
            )}

            {hospAtivo && (
              <p className="mt-1 text-[11px] text-slate-500">
                Titular: <strong>{hospAtivo.nome_completo}</strong> · Estadia: {resAtiva?.data_checkin} a {resAtiva?.data_checkout}
              </p>
            )}
          </div>

          {/* Produto ou Serviço */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Item do Catálogo (Frigobar / Bar / Serviços) *</label>
            <select
              value={produtoId}
              onChange={(e) => setProdutoId(Number(e.target.value))}
              className="w-full p-2.5 bg-white rounded-lg border border-slate-300 font-medium text-slate-900"
              required
            >
              {produtos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome} — {formatarMoeda(p.preco_venda)} {p.tipo === 'PRODUTO' ? `(Estoque: ${p.estoque_atual})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Quantidade</label>
              <input
                type="number"
                min="1"
                max="99"
                value={quantidade}
                onChange={(e) => setQuantidade(Number(e.target.value))}
                className="w-full p-2 bg-white rounded-lg border border-slate-300 font-mono font-bold text-sm"
                required
              />
            </div>

            <div className="p-2.5 bg-slate-100 rounded-lg border border-slate-200 flex flex-col justify-center">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Total do Lançamento</span>
              <span className="text-base font-bold font-mono text-slate-900">
                {formatarMoeda(totalCalculado)}
              </span>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Observações (Opcional)</label>
            <input
              type="text"
              placeholder="Ex: Entregue no quarto a pedido do hóspede"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="w-full p-2 bg-white rounded-lg border border-slate-300"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando || reservasAtivas.length === 0}
              className="px-5 py-2 font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition disabled:opacity-50"
            >
              {salvando ? 'Lançando...' : 'Lançar na Conta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
