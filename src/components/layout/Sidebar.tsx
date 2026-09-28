// =====================================================================
// POUSADA PMS — Menu Lateral de Navegação (Sidebar)
// =====================================================================

import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  CalendarCheck2,
  BedDouble,
  Users,
  UtensilsCrossed,
  Wallet,
  CircleDollarSign,
  Sparkles,
  Wrench,
  BarChart3,
  ShieldCheck,
  HardDriveDownload,
  Settings,
  X,
} from 'lucide-react';
import { usePMS } from '../../context/PMSContext';
import { useAuth } from '../../context/AuthContext';
import { PerfilCodigo } from '../../types';

export type ModuloId =
  | 'dashboard'
  | 'calendario'
  | 'reservas'
  | 'quartos'
  | 'hospedes'
  | 'consumos'
  | 'caixa'
  | 'financeiro'
  | 'governanca'
  | 'manutencao'
  | 'relatorios'
  | 'auditoria'
  | 'backup'
  | 'configuracoes';

interface NavItem {
  id: ModuloId;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
  badgeColor?: string;
  requiredRoles?: PerfilCodigo[];
}

interface SidebarProps {
  moduloAtivo: ModuloId;
  onSelecionarModulo: (modulo: ModuloId) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  moduloAtivo,
  onSelecionarModulo,
  mobileOpen,
  onCloseMobile,
}) => {
  const { quartos, limpezas, manutencoes, reservas } = usePMS();
  const { canAccess } = useAuth();

  const hoje = new Date().toISOString().substring(0, 10);
  const checkinsHoje = reservas.filter((r) => r.data_checkin === hoje && r.status === 'CONFIRMADA').length;
  const quartosSujos = limpezas.filter((l) => l.status === 'SUJO' || l.status === 'EM_LIMPEZA').length;
  const manutencoesAbertas = manutencoes.filter((m) => m.status === 'ABERTO' || m.status === 'EM_ANDAMENTO').length;

  const gruposNavegacao: Array<{ titulo: string; items: NavItem[] }> = [
    {
      titulo: 'Operacional',
      items: [
        { id: 'dashboard', label: 'Dashboard Geral', icon: LayoutDashboard },
        { id: 'calendario', label: 'Mapa de Ocupação', icon: CalendarDays },
        {
          id: 'reservas',
          label: 'Reservas',
          icon: CalendarCheck2,
          badge: checkinsHoje > 0 ? `${checkinsHoje} hoje` : undefined,
          badgeColor: 'bg-emerald-100 text-emerald-800',
        },
        {
          id: 'quartos',
          label: 'Quartos (20 UH)',
          icon: BedDouble,
          badge: quartos.length,
          badgeColor: 'bg-slate-100 text-slate-700',
        },
        { id: 'hospedes', label: 'Hóspedes', icon: Users },
        { id: 'consumos', label: 'Consumos & Frigobar', icon: UtensilsCrossed },
      ],
    },
    {
      titulo: 'Financeiro',
      items: [
        { id: 'caixa', label: 'Frente de Caixa', icon: CircleDollarSign },
        { id: 'financeiro', label: 'Contas & Fluxo', icon: Wallet, requiredRoles: ['ADMIN', 'GERENTE', 'CAIXA'] },
      ],
    },
    {
      titulo: 'Serviços & Manutenção',
      items: [
        {
          id: 'governanca',
          label: 'Governança & Limpeza',
          icon: Sparkles,
          badge: quartosSujos > 0 ? quartosSujos : undefined,
          badgeColor: 'bg-amber-100 text-amber-800',
        },
        {
          id: 'manutencao',
          label: 'Manutenção',
          icon: Wrench,
          badge: manutencoesAbertas > 0 ? manutencoesAbertas : undefined,
          badgeColor: 'bg-rose-100 text-rose-800',
        },
      ],
    },
    {
      titulo: 'Administração',
      items: [
        { id: 'relatorios', label: 'Relatórios & KPIs', icon: BarChart3, requiredRoles: ['ADMIN', 'GERENTE'] },
        { id: 'auditoria', label: 'Trilha de Auditoria', icon: ShieldCheck, requiredRoles: ['ADMIN'] },
        { id: 'backup', label: 'Backup & Pen Drive', icon: HardDriveDownload, requiredRoles: ['ADMIN', 'GERENTE'] },
        { id: 'configuracoes', label: 'Configurações', icon: Settings, requiredRoles: ['ADMIN'] },
      ],
    },
  ];

  return (
    <>
      {/* Backdrop para Mobile */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Container Principal da Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-slate-950 text-slate-300 z-50 flex flex-col transition-transform duration-200 ease-in-out border-r border-slate-800/80 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header do Menu */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm">
              PMS
            </div>
            <div>
              <span className="text-sm font-bold text-white tracking-tight leading-none block">
                POUSADA PMS
              </span>
              <span className="text-[10px] text-amber-400/90 font-medium tracking-wider uppercase block mt-0.5">
                Gestão Integrada
              </span>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links de Navegação com Scroll */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {gruposNavegacao.map((grupo) => {
            const itemsVisiveis = grupo.items.filter((item) =>
              item.requiredRoles ? canAccess(item.requiredRoles) : true
            );

            if (itemsVisiveis.length === 0) return null;

            return (
              <div key={grupo.titulo} className="space-y-1">
                <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {grupo.titulo}
                </p>
                {itemsVisiveis.map((item) => {
                  const Icon = item.icon;
                  const isActive = moduloAtivo === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelecionarModulo(item.id);
                        onCloseMobile();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition group ${
                        isActive
                          ? 'bg-amber-500 text-slate-950 font-semibold shadow-xs'
                          : 'text-slate-300 hover:text-white hover:bg-slate-900/90'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={`w-4 h-4 shrink-0 transition ${
                            isActive
                              ? 'text-slate-950'
                              : 'text-slate-400 group-hover:text-slate-200'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span
                          className={`px-1.5 py-0.5 text-[10px] font-bold rounded tabular-nums ${
                            isActive
                              ? 'bg-slate-950 text-amber-400'
                              : item.badgeColor || 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Rodapé da Sidebar: Info de Versão e Offline */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 shrink-0">
          <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/60 text-slate-400 text-[11px]">
            <div className="flex items-center justify-between font-mono">
              <span>v1.0.0 · PWA</span>
              <span className="text-emerald-400 font-semibold">IndexedDB</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Até 20 UH · Pronto para 100+
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
