// =====================================================================
// POUSADA PMS — Módulo de Manutenção Preventiva e Corretiva
// =====================================================================

import React, { useState } from 'react';
import {
  Wrench,
  Plus,
  CheckCircle,
  Clock,
  AlertTriangle,
  User,
  X,
  BedDouble,
} from 'lucide-react';
import { usePMS } from '../../context/PMSContext';
import { Manutencao } from '../../types';

export const ManutencaoView: React.FC = () => {
  const { manutencoes, quartos, formatarMoeda, salvarManutencao } = usePMS();

  const [modalNovoOpen, setModalNovoOpen] = useState(false);
  const [quartoId, setQuartoId] = useState<number | ''>(10);
  const [equipamento, setEquipamento] = useState('');
  const [problema, setProblema] = useState('');
  const [prioridade, setPrioridade] = useState<'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE'>('MEDIA');
  const [responsavel, setResponsavel] = useState('Roberto Silva');
  const [custo, setCusto] = useState(0);

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!equipamento.trim() || !problema.trim()) return;

    const q = quartos.find((room) => room.id === Number(quartoId));

    await salvarManutencao({
      quarto_id: quartoId ? Number(quartoId) : undefined,
      quarto_numero: q?.numero,
      equipamento: equipamento.trim(),
      descricao_problema: problema.trim(),
      prioridade,
      status: 'ABERTO',
      responsavel_nome: responsavel.trim(),
      custo_reparo: Number(custo),
    });

    setModalNovoOpen(false);
    setEquipamento('');
    setProblema('');
    setCusto(0);
  };

  const handleResolver = async (m: Manutencao) => {
    const solucao = prompt(`Descreva a solução aplicada na ordem ${m.codigo_chamado}:`, 'Reparo finalizado e testado com sucesso.');
    if (solucao !== null) {
      await salvarManutencao({
        ...m,
        status: 'RESOLVIDO',
        solucao,
        data_conclusao: new Date().toISOString().replace('T', ' ').substring(0, 16),
      });
    }
  };

  const abertos = manutencoes.filter((m) => m.status === 'ABERTO' || m.status === 'EM_ANDAMENTO').length;

  return (
    <div className="space-y-4">
      {/* Barra de Topo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-slate-700" />
            Ordens de Serviço e Manutenção
          </h2>
          <p className="text-xs text-slate-500">
            {abertos} chamados em andamento · Prevenção de quartos indisponíveis
          </p>
        </div>

        <button
          onClick={() => setModalNovoOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Abrir Chamado</span>
        </button>
      </div>

      {/* Grid de Chamados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {manutencoes.map((m) => {
          const isResolvido = m.status === 'RESOLVIDO';

          return (
            <div
              key={m.id}
              className={`p-4 rounded-xl border transition shadow-2xs bg-white space-y-3 ${
                isResolvido ? 'border-slate-200 opacity-80' : 'border-rose-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono font-bold text-sm text-slate-900">
                    {m.codigo_chamado}
                  </span>
                  {m.quarto_numero && (
                    <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 font-mono">
                      Quarto {m.quarto_numero}
                    </span>
                  )}
                  <h3 className="font-bold text-xs text-slate-800 mt-1">{m.equipamento}</h3>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    m.prioridade === 'URGENTE' || m.prioridade === 'ALTA'
                      ? 'bg-rose-50 text-rose-800 border-rose-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  {m.prioridade}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
                {m.descricao_problema}
              </p>

              <div className="text-[11px] text-slate-500 space-y-1">
                <p className="flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-400" />
                  <span>Técnico: {m.responsavel_nome || 'Equipe Interna'}</span>
                </p>
                <p className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>Abertura: {m.data_abertura}</span>
                </p>
                {m.custo_reparo > 0 && (
                  <p className="font-mono font-semibold text-slate-900">
                    Custo Peças/Serviço: {formatarMoeda(m.custo_reparo)}
                  </p>
                )}
                {m.solucao && (
                  <p className="text-emerald-700 font-medium">Solução: {m.solucao}</p>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    isResolvido
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {m.status}
                </span>

                {!isResolvido && (
                  <button
                    onClick={() => handleResolver(m)}
                    className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-xs transition shadow-2xs"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Concluir e Liberar Quarto</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Novo Chamado */}
      {modalNovoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Abrir Ordem de Serviço</h3>
              <button onClick={() => setModalNovoOpen(false)}>
                <X className="w-4 h-4 text-slate-400 hover:text-white" />
              </button>
            </div>
            <form onSubmit={handleSalvar} className="p-6 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Quarto Vinculado</label>
                  <select
                    value={quartoId}
                    onChange={(e) => setQuartoId(e.target.value ? Number(e.target.value) : '')}
                    className="w-full p-2 bg-white rounded-lg border border-slate-300 font-semibold"
                  >
                    <option value="">Área Geral / Sem Quarto</option>
                    {quartos.map((room) => (
                      <option key={room.id} value={room.id}>
                        {room.numero} - {room.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Prioridade</label>
                  <select
                    value={prioridade}
                    onChange={(e) => setPrioridade(e.target.value as any)}
                    className="w-full p-2 bg-white rounded-lg border border-slate-300 font-semibold text-rose-700"
                  >
                    <option value="BAIXA">Baixa</option>
                    <option value="MEDIA">Média</option>
                    <option value="ALTA">Alta</option>
                    <option value="URGENTE">Urgente</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Equipamento / Instalação *</label>
                <input
                  type="text"
                  placeholder="Ex: Ar Condicionado Split ou Vaso Sanitário"
                  value={equipamento}
                  onChange={(e) => setEquipamento(e.target.value)}
                  className="w-full p-2 bg-white rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Descrição do Problema *</label>
                <textarea
                  rows={3}
                  placeholder="Ex: Não está resfriando adequadamente e goteja na parede..."
                  value={problema}
                  onChange={(e) => setProblema(e.target.value)}
                  className="w-full p-2 bg-white rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Responsável / Técnico</label>
                  <input
                    type="text"
                    value={responsavel}
                    onChange={(e) => setResponsavel(e.target.value)}
                    className="w-full p-2 bg-white rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Custo Estimado (R$)</label>
                  <input
                    type="number"
                    step="10"
                    value={custo}
                    onChange={(e) => setCusto(Number(e.target.value))}
                    className="w-full p-2 bg-white rounded-lg border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalNovoOpen(false)}
                  className="px-3 py-1.5 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
                >
                  Abrir Chamado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
