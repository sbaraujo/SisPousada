// =====================================================================
// POUSADA PMS — Módulo de Auditoria e Logs Imutáveis
// =====================================================================

import React, { useState } from 'react';
import { ShieldCheck, Search, Download, Clock, User, HardDrive } from 'lucide-react';
import { usePMS } from '../../context/PMSContext';

export const AuditoriaView: React.FC = () => {
  const { auditoria } = usePMS();
  const [busca, setBusca] = useState('');
  const [moduloFiltro, setModuloFiltro] = useState<string>('TODOS');

  const q = busca.toLowerCase().trim();

  const logsFiltrados = auditoria.filter((log) => {
    if (moduloFiltro !== 'TODOS' && log.modulo !== moduloFiltro) return false;
    if (!q) return true;
    return (
      log.usuario_nome.toLowerCase().includes(q) ||
      log.acao.toLowerCase().includes(q) ||
      log.modulo.toLowerCase().includes(q) ||
      log.registro_id.toLowerCase().includes(q)
    );
  });

  const exportarCSV = () => {
    const cabecalho = 'DataHora,Usuario,Modulo,Acao,Tabela,RegistroId,Dispositivo,ValorNovo\n';
    const linhas = logsFiltrados.map((l) =>
      `"${l.data_hora}","${l.usuario_nome}","${l.modulo}","${l.acao}","${l.tabela_afetada}","${l.registro_id}","${l.device_id}","${(l.valor_novo || '').replace(/"/g, '""')}"`
    ).join('\n');

    const blob = new Blob([cabecalho + linhas], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auditoria_${new Date().toISOString().substring(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Topo informativo */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Trilha de Auditoria e Governança de Dados
          </h2>
          <p className="text-xs text-slate-500">
            Registros protegidos contra exclusão ou alteração manual · {auditoria.length} eventos auditados
          </p>
        </div>

        <button
          onClick={exportarCSV}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Exportar Log Completo</span>
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative min-w-[200px] flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por usuário, ação, registro..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white"
          />
        </div>

        <select
          value={moduloFiltro}
          onChange={(e) => setModuloFiltro(e.target.value)}
          className="p-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
        >
          <option value="TODOS">Todos os Módulos</option>
          <option value="RESERVAS">Reservas</option>
          <option value="CHECKIN">Check-in</option>
          <option value="CHECKOUT">Check-out</option>
          <option value="QUARTOS">Quartos</option>
          <option value="HOSPEDES">Hóspedes</option>
          <option value="CONSUMO">Consumos</option>
          <option value="CAIXA">Caixa</option>
          <option value="GOVERNANCA">Governança</option>
          <option value="MANUTENCAO">Manutenção</option>
          <option value="BACKUP">Backup & Restauração</option>
        </select>
      </div>

      {/* Tabela de Logs */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <th className="p-3">Data / Hora</th>
                <th className="p-3">Usuário</th>
                <th className="p-3">Módulo</th>
                <th className="p-3">Ação</th>
                <th className="p-3">Registro / ID</th>
                <th className="p-3">Detalhes Alterados</th>
                <th className="p-3">Terminal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {logsFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 font-sans">
                    Nenhum registro de auditoria corresponde aos filtros.
                  </td>
                </tr>
              ) : (
                logsFiltrados.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition">
                    <td className="p-3 text-slate-600 whitespace-nowrap">{log.data_hora}</td>
                    <td className="p-3 font-sans font-bold text-slate-900 whitespace-nowrap">
                      {log.usuario_nome}
                    </td>
                    <td className="p-3">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {log.modulo}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-slate-800">{log.acao}</td>
                    <td className="p-3 text-slate-600">{log.registro_id}</td>
                    <td className="p-3 text-slate-500 max-w-xs truncate" title={log.valor_novo || log.valor_anterior || ''}>
                      {log.valor_novo || log.valor_anterior || '-'}
                    </td>
                    <td className="p-3 text-[10px] text-slate-400">{log.device_id}</td>
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
