// =====================================================================
// POUSADA PMS — Módulo de Cadastro e Consulta de Hóspedes
// =====================================================================

import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Download,
  Edit,
  Phone,
  Mail,
  CalendarPlus,
  MapPin,
} from 'lucide-react';
import { usePMS } from '../../context/PMSContext';
import { Hospede } from '../../types';

interface HospedesViewProps {
  onOpenNovoHospede: () => void;
  onEditarHospede: (hospede: Hospede) => void;
  onNovaReservaParaHospede: (hospedeId: number) => void;
}

export const HospedesView: React.FC<HospedesViewProps> = ({
  onOpenNovoHospede,
  onEditarHospede,
  onNovaReservaParaHospede,
}) => {
  const { hospedes } = usePMS();
  const [busca, setBusca] = useState('');

  const q = busca.toLowerCase().trim();

  const hospedesFiltrados = hospedes.filter((h) => {
    if (!q) return true;
    return (
      h.nome_completo.toLowerCase().includes(q) ||
      h.documento.includes(q) ||
      h.telefone.includes(q) ||
      (h.cidade && h.cidade.toLowerCase().includes(q)) ||
      (h.email && h.email.toLowerCase().includes(q))
    );
  });

  const exportarCSV = () => {
    const cabecalho = 'Nome,TipoDocumento,Documento,Telefone,WhatsApp,Email,Cidade,Estado,TotalHospedagens\n';
    const linhas = hospedesFiltrados.map((h) =>
      `"${h.nome_completo}","${h.tipo_documento}","${h.documento}","${h.telefone}","${h.whatsapp || ''}","${h.email || ''}","${h.cidade || ''}","${h.estado || ''}",${h.total_hospedagens}`
    ).join('\n');

    const blob = new Blob([cabecalho + linhas], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hospedes_${new Date().toISOString().substring(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Barra de Filtros e Ações */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar hóspede por nome, CPF/documento, cidade..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-slate-400 transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportarCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            title="Exportar base de hóspedes para CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar</span>
          </button>
          <button
            onClick={onOpenNovoHospede}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo Hóspede</span>
          </button>
        </div>
      </div>

      {/* Tabela de Hóspedes */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <th className="p-3">Hóspede</th>
                <th className="p-3">Documento</th>
                <th className="p-3">Contatos</th>
                <th className="p-3">Localidade</th>
                <th className="p-3 text-center">Estadias</th>
                <th className="p-3">Preferências / Notas</th>
                <th className="p-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {hospedesFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    Nenhum hóspede localizado com os critérios informados.
                  </td>
                </tr>
              ) : (
                hospedesFiltrados.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50/60 transition">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                          {h.nome_completo.substring(0, 2)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{h.nome_completo}</div>
                          <div className="text-[10px] text-slate-400">{h.nacionalidade}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-mono">
                      <span className="font-semibold text-slate-800">{h.documento}</span>
                      <span className="text-[10px] text-slate-400 block uppercase">{h.tipo_documento}</span>
                    </td>
                    <td className="p-3">
                      <div className="text-slate-700 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" /> {h.telefone}
                      </div>
                      {h.email && (
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 text-slate-400" /> {h.email}
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-slate-600">
                      {h.cidade ? `${h.cidade} / ${h.estado}` : '-'}
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-slate-800">
                      {h.total_hospedagens}
                    </td>
                    <td className="p-3 text-slate-500 max-w-[200px] truncate">
                      {h.preferencias || h.observacoes || <span className="text-slate-300 italic">Sem observações</span>}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onNovaReservaParaHospede(h.id)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold text-[11px] flex items-center gap-1 transition"
                          title="Criar Reserva para este hóspede"
                        >
                          <CalendarPlus className="w-3 h-3" /> Reservar
                        </button>
                        <button
                          onClick={() => onEditarHospede(h)}
                          className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded"
                          title="Ver Ficha / Editar"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
