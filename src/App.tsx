// =====================================================================
// POUSADA PMS — Sistema Integrado de Gestão de Pousadas
// =====================================================================

import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { PMSProvider, usePMS } from './context/PMSContext';
import { Sidebar, ModuloId } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { GlobalSearchModal } from './components/layout/GlobalSearchModal';

// Módulos
import { DashboardView } from './modules/dashboard/DashboardView';
import { CalendarView } from './modules/calendario/CalendarView';
import { ReservasView } from './modules/reservas/ReservasView';
import { QuartosView } from './modules/quartos/QuartosView';
import { HospedesView } from './modules/hospedes/HospedesView';
import { ConsumosView } from './modules/consumos/ConsumosView';
import { CaixaView } from './modules/caixa/CaixaView';
import { FinanceiroView } from './modules/financeiro/FinanceiroView';
import { GovernancaView } from './modules/governanca/GovernancaView';
import { ManutencaoView } from './modules/manutencao/ManutencaoView';
import { RelatoriosView } from './modules/relatorios/RelatoriosView';
import { AuditoriaView } from './modules/auditoria/AuditoriaView';
import { BackupView } from './modules/backup/BackupView';
import { ConfiguracoesView } from './modules/configuracoes/ConfiguracoesView';

// Modais Globais
import { ReservaModal } from './modules/reservas/ReservaModal';
import { CheckinModal } from './modules/checkin/CheckinModal';
import { CheckoutModal } from './modules/checkout/CheckoutModal';
import { ReciboViewerModal } from './modules/recibos/ReciboViewerModal';
import { QuartoModal } from './modules/quartos/QuartoModal';
import { HospedeModal } from './modules/hospedes/HospedeModal';
import { NovoConsumoModal } from './modules/consumos/NovoConsumoModal';

import { Reserva, Quarto, Hospede, Recibo } from './types';

function AppContent() {
  const { loading } = usePMS();

  const [moduloAtivo, setModuloAtivo] = useState<ModuloId>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Estados dos Modais
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);

  // Modal Reserva
  const [reservaModalOpen, setReservaModalOpen] = useState(false);
  const [reservaParaEditar, setReservaParaEditar] = useState<Reserva | null>(null);
  const [quartoIdInicialReserva, setQuartoIdInicialReserva] = useState<number | undefined>();
  const [dataInicialReserva, setDataInicialReserva] = useState<string | undefined>();

  // Modal Check-in & Check-out
  const [checkinModalOpen, setCheckinModalOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [reservaIdOperacao, setReservaIdOperacao] = useState<number | null>(null);

  // Modal Recibo
  const [reciboModalOpen, setReciboModalOpen] = useState(false);
  const [reciboAtivo, setReciboAtivo] = useState<Recibo | null>(null);

  // Modal Quarto
  const [quartoModalOpen, setQuartoModalOpen] = useState(false);
  const [quartoParaEditar, setQuartoParaEditar] = useState<Quarto | null>(null);

  // Modal Hóspede
  const [hospedeModalOpen, setHospedeModalOpen] = useState(false);
  const [hospedeParaEditar, setHospedeParaEditar] = useState<Hospede | null>(null);

  // Modal Consumo
  const [consumoModalOpen, setConsumoModalOpen] = useState(false);

  // Atalhos Globais de Teclado (Ctrl + K, Ctrl + N)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setGlobalSearchOpen((prev) => !prev);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setReservaParaEditar(null);
        setQuartoIdInicialReserva(undefined);
        setDataInicialReserva(undefined);
        setReservaModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const abrirNovaReserva = () => {
    setReservaParaEditar(null);
    setQuartoIdInicialReserva(undefined);
    setDataInicialReserva(undefined);
    setReservaModalOpen(true);
  };

  const abrirNovaReservaComQuartoEData = (quartoId: number, data: string) => {
    setReservaParaEditar(null);
    setQuartoIdInicialReserva(quartoId);
    setDataInicialReserva(data);
    setReservaModalOpen(true);
  };

  const abrirCheckin = (reservaId: number) => {
    setReservaIdOperacao(reservaId);
    setCheckinModalOpen(true);
  };

  const abrirCheckout = (reservaId: number) => {
    setReservaIdOperacao(reservaId);
    setCheckoutModalOpen(true);
  };

  const handleReciboGerado = (recibo: Recibo) => {
    setReciboAtivo(recibo);
    setReciboModalOpen(true);
  };

  const getTituloModulo = (mod: ModuloId) => {
    switch (mod) {
      case 'dashboard':
        return 'Dashboard Geral';
      case 'calendario':
        return 'Mapa de Ocupação & Calendário';
      case 'reservas':
        return 'Gestão de Reservas';
      case 'quartos':
        return 'Unidades Habitacionais (20 UH)';
      case 'hospedes':
        return 'Cadastro de Hóspedes';
      case 'consumos':
        return 'Consumos & Frigobar';
      case 'caixa':
        return 'Frente de Caixa & Movimentações';
      case 'financeiro':
        return 'Contas a Pagar e a Receber';
      case 'governanca':
        return 'Governança & Limpeza';
      case 'manutencao':
        return 'Ordens de Serviço & Manutenção';
      case 'relatorios':
        return 'Central de Relatórios & KPIs';
      case 'auditoria':
        return 'Trilha de Auditoria (Logs Imutáveis)';
      case 'backup':
        return 'Backup, Restauração & Pen Drive';
      case 'configuracoes':
        return 'Configurações da Pousada';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-semibold tracking-wider text-slate-300 uppercase">
          Inicializando POUSADA PMS (IndexedDB)...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      {/* Menu Lateral */}
      <Sidebar
        moduloAtivo={moduloAtivo}
        onSelecionarModulo={setModuloAtivo}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        <Topbar
          tituloModulo={getTituloModulo(moduloAtivo)}
          onOpenNovaReserva={abrirNovaReserva}
          onOpenGlobalSearch={() => setGlobalSearchOpen(true)}
          onToggleSidebarMobile={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {moduloAtivo === 'dashboard' && (
            <DashboardView
              onOpenNovaReserva={abrirNovaReserva}
              onOpenCheckin={abrirCheckin}
              onOpenCheckout={abrirCheckout}
              onNavigateModulo={setModuloAtivo}
            />
          )}

          {moduloAtivo === 'calendario' && (
            <CalendarView
              onOpenNovaReservaComQuartoEData={abrirNovaReservaComQuartoEData}
              onOpenDetalhesReserva={(id) => {
                const res = { id } as Reserva;
                setReservaParaEditar(res);
                setReservaModalOpen(true);
              }}
              onOpenCheckin={abrirCheckin}
              onOpenCheckout={abrirCheckout}
            />
          )}

          {moduloAtivo === 'reservas' && (
            <ReservasView
              onOpenNovaReserva={abrirNovaReserva}
              onEditarReserva={(r) => {
                setReservaParaEditar(r);
                setReservaModalOpen(true);
              }}
              onOpenCheckin={abrirCheckin}
              onOpenCheckout={abrirCheckout}
            />
          )}

          {moduloAtivo === 'quartos' && (
            <QuartosView
              onOpenNovoQuarto={() => {
                setQuartoParaEditar(null);
                setQuartoModalOpen(true);
              }}
              onEditarQuarto={(q) => {
                setQuartoParaEditar(q);
                setQuartoModalOpen(true);
              }}
              onOpenNovaReservaComQuarto={(qId) => {
                setQuartoIdInicialReserva(qId);
                setReservaParaEditar(null);
                setReservaModalOpen(true);
              }}
            />
          )}

          {moduloAtivo === 'hospedes' && (
            <HospedesView
              onOpenNovoHospede={() => {
                setHospedeParaEditar(null);
                setHospedeModalOpen(true);
              }}
              onEditarHospede={(h) => {
                setHospedeParaEditar(h);
                setHospedeModalOpen(true);
              }}
              onNovaReservaParaHospede={(hId) => {
                setReservaParaEditar(null);
                setQuartoIdInicialReserva(undefined);
                setReservaModalOpen(true);
              }}
            />
          )}

          {moduloAtivo === 'consumos' && (
            <ConsumosView onOpenNovoConsumo={() => setConsumoModalOpen(true)} />
          )}

          {moduloAtivo === 'caixa' && <CaixaView />}

          {moduloAtivo === 'financeiro' && <FinanceiroView />}

          {moduloAtivo === 'governanca' && <GovernancaView />}

          {moduloAtivo === 'manutencao' && <ManutencaoView />}

          {moduloAtivo === 'relatorios' && <RelatoriosView />}

          {moduloAtivo === 'auditoria' && <AuditoriaView />}

          {moduloAtivo === 'backup' && <BackupView />}

          {moduloAtivo === 'configuracoes' && <ConfiguracoesView />}
        </main>
      </div>

      {/* MODAIS GLOBAIS */}
      <GlobalSearchModal
        isOpen={globalSearchOpen}
        onClose={() => setGlobalSearchOpen(false)}
        onNavigate={setModuloAtivo}
      />

      <ReservaModal
        isOpen={reservaModalOpen}
        onClose={() => {
          setReservaModalOpen(false);
          setReservaParaEditar(null);
        }}
        reservaParaEditar={reservaParaEditar}
        quartoIdInicial={quartoIdInicialReserva}
        dataInicial={dataInicialReserva}
      />

      <CheckinModal
        isOpen={checkinModalOpen}
        onClose={() => {
          setCheckinModalOpen(false);
          setReservaIdOperacao(null);
        }}
        reservaId={reservaIdOperacao}
      />

      <CheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => {
          setCheckoutModalOpen(false);
          setReservaIdOperacao(null);
        }}
        reservaId={reservaIdOperacao}
        onReciboGerado={handleReciboGerado}
      />

      <ReciboViewerModal
        isOpen={reciboModalOpen}
        onClose={() => {
          setReciboModalOpen(false);
          setReciboAtivo(null);
        }}
        recibo={reciboAtivo}
      />

      <QuartoModal
        isOpen={quartoModalOpen}
        onClose={() => {
          setQuartoModalOpen(false);
          setQuartoParaEditar(null);
        }}
        quartoParaEditar={quartoParaEditar}
      />

      <HospedeModal
        isOpen={hospedeModalOpen}
        onClose={() => {
          setHospedeModalOpen(false);
          setHospedeParaEditar(null);
        }}
        hospedeParaEditar={hospedeParaEditar}
      />

      <NovoConsumoModal
        isOpen={consumoModalOpen}
        onClose={() => setConsumoModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PMSProvider>
        <AppContent />
      </PMSProvider>
    </AuthProvider>
  );
}
