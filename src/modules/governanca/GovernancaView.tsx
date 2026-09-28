// =====================================================================
// POUSADA PMS — Módulo de Governança, Limpeza e Higienização de Quartos
// =====================================================================

import React, { useState } from 'react';
import {
  Sparkles,
  BedDouble,
  CheckCircle2,
  Clock,
  User,
  Plus,
  Play,
  Check,
  AlertCircle,
} from 'lucide-react';
import { usePMS } from '../../context/PMSContext';
import { StatusLimpeza } from '../../types';

export const GovernancaView: React.FC = () => {
  const { limpezas, quartos, atualizarLimpeza, alterarStatusQuarto } = usePMS();

  const [filtroStatus, setFiltroStatus] = useState<StatusLimpeza | 'TODOS'>('TODOS');
  const [modalNovaLimpezaOpen, setModalNovaLimpezaOpen] = useState(false);
  const [quartoSelecionado, setQuartoSelecionado] = useState<number>(3);
  const [tipoLimpeza, setTipoLimpeza] = useState<'CHECKOUT' | 'DIARIA' | 'GERAL' | 'RETROQUE'>('CHECKOUT');
  const [responsavelNome, setResponsavelNome] = useState('Maria das Graças');
  const [obs, setObs] = useState('');

  const sujos = limpezas.filter((l) => l.status === 'SUJO').length;
  const emLimpeza = limpezas.filter((l) => l.status === 'EM_LIMPEZA').length;
  const inspecao = limpezas.filter((l) => l.status === 'INSPEÇÃO').length;
  const liberados = limpezas.filter((l) => l.status === 'LIBERADO').length;

  const limpezasFiltradas = limpezas.filter((l) => {
    if (filtroStatus === 'TODOS') return true;
    return l.status === filtroStatus;
  });

  const getCorColuna = (st: StatusLimpeza) => {
    switch (st) {
      case 'SUJO':
        return 'border-rose-300 bg-rose-50/50 text-rose-800';
      case 'EM_LIMPEZA':
        return 'border-amber-300 bg-amber-50/50 text-amber-800';
      case 'INSPEÇÃO':
        return 'border-blue-300 bg-blue-50/50 text-blue-800';
      case 'LIBERADO':
        return 'border-emerald-300 bg-emerald-50/50 text-emerald-800';
    }
  };

  return (
    <div className="space-y-4">
      {/* Resumo em Cards de Indicadores */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl">
          <span className="text-xs font-semibold text-rose-700">Quartos Sujos</span>
          <div className="mt-1 text-2xl font-bold font-mono text-rose-900">{sujos}</div>
          <p className="text-[10px] text-rose-600 mt-1">Aguardando início de higienização</p>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <span className="text-xs font-semibold text-amber-700">Em Higienização</span>
          <div className="mt-1 text-2xl font-bold font-mono text-amber-900">{emLimpeza}</div>
          <p className="text-[10px] text-amber-600 mt-1">Camareira em atendimento</p>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <span className="text-xs font-semibold text-blue-700">Em Inspeção</span>
          <div className="mt-1 text-2xl font-bold font-mono text-blue-900">{inspecao}</div>
          <p className="text-[10px] text-blue-600 mt-1">Conferência de governança</p>
        </div>

        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
          <span className="text-xs font-semibold text-emerald-700">Quartos Liberados</span>
          <div className="mt-1 text-2xl font-bold font-mono text-emerald-900">{liberados}</div>
          <p className="text-[10px] text-emerald-600 mt-1">Prontos para novo check-in</p>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          {(['TODOS', 'SUJO', 'EM_LIMPEZA', 'INSPEÇÃO', 'LIBERADO'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFiltroStatus(st)}
              className={`px-3 py-1.5 rounded-lg transition ${
                filtroStatus === st ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Lista Kanban de Tarefas de Governança */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {limpezasFiltradas.map((item) => {
          const room = quartos.find((q) => q.id === item.quarto_id);

          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition shadow-2xs bg-white space-y-3 ${getCorColuna(
                item.status
              )}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono font-bold text-base text-slate-900">
                    Quarto {item.quarto_numero}
                  </span>
                  <p className="text-xs font-semibold text-slate-700">{room?.nome}</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase border">
                  {item.status}
                </span>
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <p>
                  Tipo: <strong className="text-slate-900">{item.tipo_limpeza}</strong>
                </p>
                <p className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.responsavel_nome || 'A definir'}</span>
                </p>
                <p className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Solicitado: {item.data_hora_solicitacao}</span>
                </p>
              </div>

              {item.observacoes && (
                <p className="p-2 bg-slate-50 rounded text-[11px] text-slate-500 italic">
                  "{item.observacoes}"
                </p>
              )}

              {/* Botões de Ação para o Ciclo da Limpeza */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-1.5">
                {item.status === 'SUJO' && (
                  <button
                    onClick={() => atualizarLimpeza(item.id, 'EM_LIMPEZA')}
                    className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg transition shadow-2xs"
                  >
                    <Play className="w-3.5 h-3.5" /> Iniciar Limpeza
                  </button>
                )}

                {item.status === 'EM_LIMPEZA' && (
                  <button
                    onClick={() => atualizarLimpeza(item.id, 'INSPEÇÃO')}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition shadow-2xs"
                  >
                    <Check className="w-3.5 h-3.5" /> Enviar p/ Inspeção
                  </button>
                )}

                {item.status === 'INSPEÇÃO' && (
                  <button
                    onClick={() => atualizarLimpeza(item.id, 'LIBERADO')}
                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition shadow-2xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Inspecionar e Liberar
                  </button>
                )}

                {item.status === 'LIBERADO' && (
                  <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Quarto 100% Pronto
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
