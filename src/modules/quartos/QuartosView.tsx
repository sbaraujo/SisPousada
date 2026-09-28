// =====================================================================
// POUSADA PMS — Módulo de Quartos (20 Unidades Habitacionais)
// =====================================================================

import React, { useState } from 'react';
import {
  BedDouble,
  Search,
  Plus,
  LayoutGrid,
  List,
  Edit,
  Sparkles,
  Wrench,
  Check,
  User,
} from 'lucide-react';
import { usePMS } from '../../context/PMSContext';
import { Quarto, StatusQuarto } from '../../types';

interface QuartosViewProps {
  onOpenNovoQuarto: () => void;
  onEditarQuarto: (quarto: Quarto) => void;
  onOpenNovaReservaComQuarto: (quartoId: number) => void;
}

export const QuartosView: React.FC<QuartosViewProps> = ({
  onOpenNovoQuarto,
  onEditarQuarto,
  onOpenNovaReservaComQuarto,
}) => {
  const { quartos, categorias, reservas, hospedes, formatarMoeda, alterarStatusQuarto } = usePMS();

  const [busca, setBusca] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState<number | 'TODAS'>('TODAS');
  const [statusFiltro, setStatusFiltro] = useState<StatusQuarto | 'TODOS'>('TODOS');
  const [modoVisualizacao, setModoVisualizacao] = useState<'grid' | 'tabela'>('grid');

  const q = busca.toLowerCase().trim();

  const quartosFiltrados = quartos.filter((room) => {
    if (statusFiltro !== 'TODOS' && room.status !== statusFiltro) return false;
    if (categoriaFiltro !== 'TODAS' && room.categoria_id !== categoriaFiltro) return false;
    if (!q) return true;
    return (
      room.numero.toLowerCase().includes(q) ||
      room.nome.toLowerCase().includes(q) ||
      room.andar.toLowerCase().includes(q)
    );
  });

  const getStatusCor = (status: StatusQuarto) => {
    switch (status) {
      case 'LIVRE':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'OCUPADO':
        return 'bg-blue-50 text-blue-800 border-blue-300';
      case 'RESERVADO':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'LIMPEZA':
        return 'bg-orange-50 text-orange-800 border-orange-300';
      case 'MANUTENÇÃO':
        return 'bg-rose-50 text-rose-800 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="space-y-4">
      {/* Barra de Controles e Filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Busca */}
          <div className="relative min-w-[200px] flex-1 max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar quarto (ex: Q01, Ipê)..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white"
            />
          </div>

          {/* Filtro Categoria */}
          <select
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value === 'TODAS' ? 'TODAS' : Number(e.target.value))}
            className="p-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
          >
            <option value="TODAS">Todas as Categorias</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>

          {/* Filtro Status */}
          <select
            value={statusFiltro}
            onChange={(e) => setStatusFiltro(e.target.value as StatusQuarto | 'TODOS')}
            className="p-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700"
          >
            <option value="TODOS">Todos os Status</option>
            <option value="LIVRE">Livre</option>
            <option value="OCUPADO">Ocupado</option>
            <option value="RESERVADO">Reservado</option>
            <option value="LIMPEZA">Limpeza</option>
            <option value="MANUTENÇÃO">Manutenção</option>
            <option value="BLOQUEADO">Bloqueado</option>
          </select>
        </div>

        {/* Alternador Grid/Tabela e Novo Quarto */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setModoVisualizacao('grid')}
              className={`p-1.5 rounded-md transition ${
                modoVisualizacao === 'grid' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
              title="Visualização em Grade de Cartões"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setModoVisualizacao('tabela')}
              className={`p-1.5 rounded-md transition ${
                modoVisualizacao === 'tabela' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
              title="Visualização em Tabela"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onOpenNovoQuarto}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nova UH</span>
          </button>
        </div>
      </div>

      {/* Visualização em Cartões (Grid de UH) */}
      {modoVisualizacao === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {quartosFiltrados.map((room) => {
            const cat = categorias.find((c) => c.id === room.categoria_id);
            const statusClass = getStatusCor(room.status);

            // Procura reserva ativa para o quarto
            const reservaAtiva = reservas.find(
              (r) => r.quarto_id === room.id && (r.status === 'HOSPEDADO' || r.status === 'CONFIRMADA')
            );
            const hospedeAtivo = reservaAtiva ? hospedes.find((h) => h.id === reservaAtiva.hospede_id) : null;

            return (
              <div
                key={room.id}
                className="bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-sm transition flex flex-col justify-between overflow-hidden"
              >
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-base text-slate-950">
                          {room.numero}
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold">
                          {room.andar}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-xs mt-0.5 truncate">
                        {room.nome}
                      </h3>
                      <p className="text-[11px] text-slate-500">{cat?.nome}</p>
                    </div>

                    {/* Badge de Status com Seletor Rápido */}
                    <select
                      value={room.status}
                      onChange={(e) => alterarStatusQuarto(room.id, e.target.value as StatusQuarto)}
                      className={`text-[10px] font-bold px-2 py-1 rounded-lg border uppercase cursor-pointer outline-none ${statusClass}`}
                    >
                      <option value="LIVRE">Livre</option>
                      <option value="OCUPADO">Ocupado</option>
                      <option value="RESERVADO">Reservado</option>
                      <option value="LIMPEZA">Limpeza</option>
                      <option value="MANUTENÇÃO">Manutenção</option>
                      <option value="BLOQUEADO">Bloqueado</option>
                    </select>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                    <p className="flex items-center justify-between">
                      <span className="text-slate-400">Capacidade:</span>
                      <span className="font-medium text-slate-800">
                        {room.capacidade_adultos} adultos, {room.capacidade_criancas} crianças
                      </span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="text-slate-400">Camas:</span>
                      <span className="font-medium text-slate-800 truncate max-w-[150px]">{room.tipo_cama}</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="text-slate-400">Tarifa Base:</span>
                      <span className="font-mono font-bold text-slate-900">
                        {formatarMoeda(cat?.tarifa_base || 280)}
                      </span>
                    </p>
                  </div>

                  {/* Informação do Hóspede Atual se ocupado ou reservado */}
                  {reservaAtiva && hospedeAtivo && (
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                      <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" />
                        {reservaAtiva.status === 'HOSPEDADO' ? 'Hóspede Atual' : 'Próxima Chegada'}
                      </p>
                      <p className="font-bold text-slate-900 truncate mt-0.5">
                        {hospedeAtivo.nome_completo}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {reservaAtiva.data_checkin} a {reservaAtiva.data_checkout}
                      </p>
                    </div>
                  )}
                </div>

                {/* Ações do Card */}
                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => onEditarQuarto(room)}
                    className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded transition"
                    title="Editar Informações da UH"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1.5">
                    {room.status === 'LIVRE' && (
                      <button
                        onClick={() => onOpenNovaReservaComQuarto(room.id)}
                        className="px-2.5 py-1 text-[11px] font-bold text-white bg-slate-900 hover:bg-slate-800 rounded transition"
                      >
                        Reservar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Visualização em Tabela Detalhada */
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                  <th className="p-3">UH</th>
                  <th className="p-3">Nome da Unidade</th>
                  <th className="p-3">Categoria</th>
                  <th className="p-3">Andar</th>
                  <th className="p-3">Capacidade</th>
                  <th className="p-3">Camas</th>
                  <th className="p-3">Tarifa Base</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quartosFiltrados.map((room) => {
                  const cat = categorias.find((c) => c.id === room.categoria_id);
                  return (
                    <tr key={room.id} className="hover:bg-slate-50/60 transition">
                      <td className="p-3 font-mono font-bold text-slate-900">{room.numero}</td>
                      <td className="p-3 font-semibold text-slate-900">{room.nome}</td>
                      <td className="p-3 text-slate-600">{cat?.nome}</td>
                      <td className="p-3 text-slate-600">{room.andar}</td>
                      <td className="p-3 text-slate-600">
                        {room.capacidade_adultos} adultos, {room.capacidade_criancas} crianças
                      </td>
                      <td className="p-3 text-slate-600">{room.tipo_cama}</td>
                      <td className="p-3 font-mono font-semibold text-slate-900">
                        {formatarMoeda(cat?.tarifa_base || 280)}
                      </td>
                      <td className="p-3">
                        <select
                          value={room.status}
                          onChange={(e) => alterarStatusQuarto(room.id, e.target.value as StatusQuarto)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase cursor-pointer ${getStatusCor(room.status)}`}
                        >
                          <option value="LIVRE">Livre</option>
                          <option value="OCUPADO">Ocupado</option>
                          <option value="RESERVADO">Reservado</option>
                          <option value="LIMPEZA">Limpeza</option>
                          <option value="MANUTENÇÃO">Manutenção</option>
                          <option value="BLOQUEADO">Bloqueado</option>
                        </select>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => onEditarQuarto(room)}
                          className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
