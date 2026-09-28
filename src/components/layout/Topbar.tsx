// =====================================================================
// POUSADA PMS — Barra Superior (Topbar)
// =====================================================================

import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Wifi,
  WifiOff,
  RefreshCw,
  UserCheck,
  ChevronDown,
  CircleDollarSign,
  Menu,
} from 'lucide-react';
import { usePMS } from '../../context/PMSContext';
import { useAuth } from '../../context/AuthContext';
import { syncService, SyncProgress } from '../../services/syncService';
import { PWAInstallButton } from './PWAInstallButton';

interface TopbarProps {
  onOpenNovaReserva: () => void;
  onOpenGlobalSearch: () => void;
  onToggleSidebarMobile: () => void;
  tituloModulo: string;
}

export const Topbar: React.FC<TopbarProps> = ({
  onOpenNovaReserva,
  onOpenGlobalSearch,
  onToggleSidebarMobile,
  tituloModulo,
}) => {
  const { pousada, caixaAtivo, formatarMoeda } = usePMS();
  const { currentUser, usuarios, switchUser } = useAuth();

  const [isOnline, setIsOnline] = useState(true);
  const [syncProgress, setSyncProgress] = useState<SyncProgress>('SYNCED');
  const [pendingCount, setPendingCount] = useState(0);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = syncService.subscribe((status) => {
      setIsOnline(status.online);
      setSyncProgress(status.progress);
      setPendingCount(status.pendingCount);
    });
    return unsubscribe;
  }, []);

  const handleForcarSync = async () => {
    await syncService.forcarSincronizacao(currentUser.nome);
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between z-20 shrink-0">
      {/* Zona 1: Menu Mobile & Título do Módulo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebarMobile}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
          aria-label="Abrir menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
            {tituloModulo}
          </h1>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
            <span>{pousada.nome_fantasia}</span>
            <span aria-hidden="true">·</span>
            <span>20 Quartos</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{pousada.moeda}</span>
          </div>
        </div>
      </div>

      {/* Zona 2: Busca Global Rápida (Ctrl + K) */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <button
          onClick={onOpenGlobalSearch}
          className="w-full flex items-center justify-between px-3.5 py-2 text-xs text-slate-400 bg-slate-100 hover:bg-slate-200/80 rounded-lg border border-slate-200/80 transition"
        >
          <span className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400" />
            <span>Buscar hóspede, quarto, reserva ou recibo...</span>
          </span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 bg-white rounded border border-slate-300 shadow-2xs">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Zona 3: Indicadores Operacionais e Ações */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Busca mobile icon */}
        <button
          onClick={onOpenGlobalSearch}
          className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          title="Buscar (Ctrl+K)"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Indicador de Conexão e Sincronização */}
        <button
          onClick={handleForcarSync}
          title={
            isOnline
              ? syncProgress === 'SYNCING'
                ? 'Sincronizando dados com o servidor central...'
                : pendingCount > 0
                ? `${pendingCount} alterações pendentes para sincronizar (Clique para forçar)`
                : 'Tudo sincronizado com o banco de dados'
              : 'Modo Offline Ativo — Operando 100% no IndexedDB Local'
          }
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition ${
            !isOnline
              ? 'bg-amber-50 text-amber-800 border-amber-200'
              : pendingCount > 0
              ? 'bg-sky-50 text-sky-800 border-sky-200'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}
        >
          {isOnline ? (
            <Wifi className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <WifiOff className="w-3.5 h-3.5 text-amber-600" />
          )}

          <span className="hidden sm:inline">
            {!isOnline ? 'Offline' : syncProgress === 'SYNCING' ? 'Sincronizando' : pendingCount > 0 ? `${pendingCount} Pend.` : 'Sincronizado'}
          </span>

          <RefreshCw
            className={`w-3 h-3 ${syncProgress === 'SYNCING' ? 'animate-spin' : ''}`}
          />
        </button>

        {/* Status do Caixa */}
        <div
          className={`hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border ${
            caixaAtivo
              ? 'bg-slate-50 text-slate-700 border-slate-200'
              : 'bg-rose-50 text-rose-700 border-rose-200'
          }`}
          title={caixaAtivo ? `Caixa aberto: ${formatarMoeda(caixaAtivo.saldo_esperado)}` : 'Caixa fechado'}
        >
          <CircleDollarSign className="w-3.5 h-3.5 text-slate-500" />
          <span>
            {caixaAtivo ? `Caixa: ${formatarMoeda(caixaAtivo.saldo_esperado)}` : 'Caixa Fechado'}
          </span>
        </div>

        {/* Botão de Instalação PWA */}
        <PWAInstallButton />

        {/* Botão Nova Reserva */}
        <button
          onClick={onOpenNovaReserva}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Nova Reserva</span>
        </button>

        {/* Dropdown de Usuário / Alternador de Perfil */}
        <div className="relative">
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition text-left"
          >
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs uppercase shadow-2xs">
              {currentUser.nome.substring(0, 2)}
            </div>
            <div className="hidden lg:block">
              <p className="text-xs font-semibold text-slate-900 leading-none truncate max-w-[120px]">
                {currentUser.nome}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-none">
                {currentUser.cargo}
              </p>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 hidden lg:block" />
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{currentUser.nome}</p>
                <p className="text-[11px] text-slate-500">{currentUser.email}</p>
                <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded w-max">
                  <UserCheck className="w-3 h-3" />
                  Perfil: {currentUser.perfil_codigo}
                </div>
              </div>

              <div className="py-1">
                <p className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Trocar Usuário (Teste de Permissões)
                </p>
                {usuarios.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchUser(u.id);
                      setUserDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 transition ${
                      u.id === currentUser.id ? 'font-bold text-slate-900 bg-slate-50' : 'text-slate-600'
                    }`}
                  >
                    <span>{u.nome}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">{u.perfil_codigo}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
