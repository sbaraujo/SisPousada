// =====================================================================
// POUSADA PMS — Gestão de Consumos, Frigobar e Catálogo de Produtos
// =====================================================================

import React, { useState } from 'react';
import {
  UtensilsCrossed,
  Plus,
  Package,
  Search,
  BedDouble,
  DollarSign,
  Tag,
  CheckCircle2,
  Clock,
  X,
} from 'lucide-react';
import { usePMS } from '../../context/PMSContext';

interface ConsumosViewProps {
  onOpenNovoConsumo: () => void;
}

export const ConsumosView: React.FC<ConsumosViewProps> = ({ onOpenNovoConsumo }) => {
  const { consumos, produtos, quartos, reservas, hospedes, formatarMoeda, salvarProduto } = usePMS();

  const [abaAtiva, setAbaAtiva] = useState<'lancamentos' | 'catalogo'>('lancamentos');
  const [busca, setBusca] = useState('');

  // Formulário rápido para adicionar novo item ao catálogo
  const [modalNovoProdOpen, setModalNovoProdOpen] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [novoPreco, setNovoPreco] = useState(10);
  const [novoCusto, setNovoCusto] = useState(4);
  const [novoEstoque, setNovoEstoque] = useState(50);
  const [novoTipo, setNovoTipo] = useState<'PRODUTO' | 'SERVICO'>('PRODUTO');

  const q = busca.toLowerCase().trim();

  const consumosFiltrados = consumos.filter((c) => {
    if (!q) return true;
    const room = quartos.find((roomItem) => roomItem.id === c.quarto_id);
    return (
      c.nome_produto?.toLowerCase().includes(q) ||
      room?.numero.toLowerCase().includes(q) ||
      c.data_lancamento.includes(q)
    );
  });

  const produtosFiltrados = produtos.filter((p) => {
    if (!q) return true;
    return p.nome.toLowerCase().includes(q) || (p.codigo && p.codigo.toLowerCase().includes(q));
  });

  const handleSalvarNovoProduto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoNome.trim()) return;

    await salvarProduto({
      nome: novoNome.trim(),
      tipo: novoTipo,
      preco_venda: Number(novoPreco),
      preco_custo: Number(novoCusto),
      estoque_atual: novoTipo === 'PRODUTO' ? Number(novoEstoque) : 999,
      estoque_minimo: 5,
      categoria_id: 1,
      ativo: true,
    });

    setModalNovoProdOpen(false);
    setNovoNome('');
  };

  const totalConsumosPendentes = consumos
    .filter((c) => c.status_faturamento === 'PENDENTE')
    .reduce((sum, c) => sum + c.valor_total, 0);

  return (
    <div className="space-y-4">
      {/* Barra de Ações & Abas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          {/* Abas */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setAbaAtiva('lancamentos')}
              className={`px-3 py-1.5 rounded-lg transition ${
                abaAtiva === 'lancamentos' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Lançamentos nos Quartos
            </button>
            <button
              onClick={() => setAbaAtiva('catalogo')}
              className={`px-3 py-1.5 rounded-lg transition ${
                abaAtiva === 'catalogo' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Catálogo de Produtos & Serviços ({produtos.length})
            </button>
          </div>

          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2" />
            <input
              type="text"
              placeholder="Buscar..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-9 pr-3 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {abaAtiva === 'catalogo' ? (
            <button
              onClick={() => setModalNovoProdOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Produto</span>
            </button>
          ) : (
            <button
              onClick={onOpenNovoConsumo}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg shadow-xs transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Lançar Consumo</span>
            </button>
          )}
        </div>
      </div>

      {/* Conteúdo Aba Lançamentos */}
      {abaAtiva === 'lancamentos' ? (
        <div className="space-y-4">
          {/* Card Resumo */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900">
            <div>
              <span className="font-bold">Total Pendente a Faturar nos Check-outs:</span>{' '}
              <span className="font-mono font-bold text-sm text-amber-950">
                {formatarMoeda(totalConsumosPendentes)}
              </span>
            </div>
            <span className="text-[11px] text-amber-700">
              {consumos.filter((c) => c.status_faturamento === 'PENDENTE').length} itens aguardando liquidação
            </span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                    <th className="p-3">Data / Hora</th>
                    <th className="p-3">Quarto / Hóspede</th>
                    <th className="p-3">Item Consumido</th>
                    <th className="p-3 text-center">Qtd</th>
                    <th className="p-3 text-right">Unitário</th>
                    <th className="p-3 text-right">Total</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Atendente</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {consumosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400">
                        Nenhum consumo localizado.
                      </td>
                    </tr>
                  ) : (
                    consumosFiltrados.map((c) => {
                      const room = quartos.find((qto) => qto.id === c.quarto_id);
                      const res = reservas.find((r) => r.id === c.reserva_id);
                      const hosp = res ? hospedes.find((h) => h.id === res.hospede_id) : null;

                      return (
                        <tr key={c.id} className="hover:bg-slate-50/60 transition">
                          <td className="p-3 font-mono text-slate-600">{c.data_lancamento}</td>
                          <td className="p-3">
                            <span className="font-bold font-mono text-slate-900">Quarto {room?.numero}</span>
                            <span className="text-[10px] text-slate-500 block truncate max-w-[140px]">
                              {hosp?.nome_completo || 'Hóspede'}
                            </span>
                          </td>
                          <td className="p-3 font-semibold text-slate-900">{c.nome_produto}</td>
                          <td className="p-3 text-center font-mono font-bold">{c.quantidade}</td>
                          <td className="p-3 text-right font-mono text-slate-600">
                            {formatarMoeda(c.valor_unitario)}
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-slate-900">
                            {formatarMoeda(c.valor_total)}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                c.status_faturamento === 'FATURADO'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : 'bg-amber-50 text-amber-800 border-amber-200'
                              }`}
                            >
                              {c.status_faturamento}
                            </span>
                          </td>
                          <td className="p-3 text-slate-500 text-[11px]">{c.usuario_nome || 'Recepção'}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Conteúdo Aba Catálogo */
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                  <th className="p-3">Código</th>
                  <th className="p-3">Nome do Item</th>
                  <th className="p-3">Tipo</th>
                  <th className="p-3 text-right">Preço Venda</th>
                  <th className="p-3 text-right">Preço Custo</th>
                  <th className="p-3 text-center">Estoque Atual</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {produtosFiltrados.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition">
                    <td className="p-3 font-mono text-slate-500">{p.codigo || '-'}</td>
                    <td className="p-3">
                      <span className="font-bold text-slate-900">{p.nome}</span>
                      {p.descricao && <p className="text-[10px] text-slate-400">{p.descricao}</p>}
                    </td>
                    <td className="p-3">
                      <span className="px-1.5 py-0.5 rounded font-mono text-[10px] bg-slate-100 text-slate-700">
                        {p.tipo}
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900">
                      {formatarMoeda(p.preco_venda)}
                    </td>
                    <td className="p-3 text-right font-mono text-slate-500">
                      {formatarMoeda(p.preco_custo)}
                    </td>
                    <td className="p-3 text-center font-mono">
                      {p.tipo === 'PRODUTO' ? (
                        <span
                          className={`font-bold ${
                            p.estoque_atual <= p.estoque_minimo ? 'text-rose-600' : 'text-slate-800'
                          }`}
                        >
                          {p.estoque_atual} un
                        </span>
                      ) : (
                        <span className="text-slate-400">Serviço</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800">
                        Ativo
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Cadastro de Produto */}
      {modalNovoProdOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Adicionar Item ao Catálogo</h3>
              <button onClick={() => setModalNovoProdOpen(false)}>
                <X className="w-4 h-4 text-slate-400 hover:text-white" />
              </button>
            </div>
            <form onSubmit={handleSalvarNovoProduto} className="p-6 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nome do Item *</label>
                <input
                  type="text"
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  placeholder="Ex: Vinho Tinto Cabernet 750ml"
                  className="w-full p-2 bg-white rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tipo</label>
                  <select
                    value={novoTipo}
                    onChange={(e) => setNovoTipo(e.target.value as 'PRODUTO' | 'SERVICO')}
                    className="w-full p-2 bg-white rounded-lg border border-slate-300"
                  >
                    <option value="PRODUTO">Produto (Controla Estoque)</option>
                    <option value="SERVICO">Serviço / Experiência</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Preço Venda (R$)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={novoPreco}
                    onChange={(e) => setNovoPreco(Number(e.target.value))}
                    className="w-full p-2 bg-white rounded-lg border border-slate-300 font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Preço Custo (R$)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={novoCusto}
                    onChange={(e) => setNovoCusto(Number(e.target.value))}
                    className="w-full p-2 bg-white rounded-lg border border-slate-300 font-mono"
                  />
                </div>
                {novoTipo === 'PRODUTO' && (
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Estoque Inicial</label>
                    <input
                      type="number"
                      value={novoEstoque}
                      onChange={(e) => setNovoEstoque(Number(e.target.value))}
                      className="w-full p-2 bg-white rounded-lg border border-slate-300 font-mono"
                    />
                  </div>
                )}
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalNovoProdOpen(false)}
                  className="px-3 py-1.5 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
                >
                  Salvar Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
