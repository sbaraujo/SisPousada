import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Users, BedDouble, CalendarCheck2, FileText, ArrowRight } from 'lucide-react';
import { usePMS } from '../../context/PMSContext';
import { ModuloId } from './Sidebar';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (modulo: ModuloId) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const { hospedes, quartos, reservas, recibos, formatarMoeda } = usePMS();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const hospedesFiltrados = q
    ? hospedes.filter(
        (h) =>
          h.nome_completo.toLowerCase().includes(q) ||
          h.documento.includes(q) ||
          h.telefone.includes(q)
      )
    : [];

  const quartosFiltrados = q
    ? quartos.filter(
        (room) =>
          room.numero.toLowerCase().includes(q) ||
          room.nome.toLowerCase().includes(q)
      )
    : [];

  const reservasFiltradas = q
    ? reservas.filter((r) => {
        const h = hospedes.find((hosp) => hosp.id === r.hospede_id);
        const room = quartos.find((quarto) => quarto.id === r.quarto_id);
        return (
          r.codigo_reserva.toLowerCase().includes(q) ||
          h?.nome_completo.toLowerCase().includes(q) ||
          room?.numero.toLowerCase().includes(q)
        );
      })
    : [];

  const recibosFiltrados = q
    ? recibos.filter(
        (rec) =>
          rec.numero_recibo.toLowerCase().includes(q) ||
          rec.hospede_nome.toLowerCase().includes(q) ||
          rec.codigo_validacao.toLowerCase().includes(q)
      )
    : [];

  const totalResultados =
    hospedesFiltrados.length +
    quartosFiltrados.length +
    reservasFiltradas.length +
    recibosFiltrados.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Barra de Pesquisa */}
        <div className="flex items-center px-4 py-3 border-b border-slate-200 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Digite para buscar hóspede, quarto, reserva ou recibo..."
            className="w-full text-sm outline-none text-slate-900 placeholder-slate-400 bg-transparent"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-100 rounded border border-slate-200">
            ESC
          </kbd>
        </div>

        {/* Resultados da Busca */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {!q && (
            <div className="p-8 text-center text-slate-400 text-xs">
              <p>Digite pelo menos 1 caractere para pesquisar instantaneamente em todo o sistema.</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <span className="px-2 py-1 bg-slate-100 rounded text-slate-600">Ex: Q01</span>
                <span className="px-2 py-1 bg-slate-100 rounded text-slate-600">Ex: RES-2026</span>
                <span className="px-2 py-1 bg-slate-100 rounded text-slate-600">Ex: Silva</span>
                <span className="px-2 py-1 bg-slate-100 rounded text-slate-600">Ex: CPF</span>
              </div>
            </div>
          )}

          {q && totalResultados === 0 && (
            <div className="p-8 text-center text-slate-500 text-xs">
              Nenhum registro encontrado para <strong className="text-slate-900">"{query}"</strong>.
            </div>
          )}

          {/* Hóspedes */}
          {hospedesFiltrados.length > 0 && (
            <div>
              <p className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> Hóspedes ({hospedesFiltrados.length})
              </p>
              <div className="space-y-1">
                {hospedesFiltrados.map((h) => (
                  <div
                    key={h.id}
                    onClick={() => {
                      onNavigate('hospedes');
                      onClose();
                    }}
                    className="p-2.5 rounded-lg hover:bg-slate-50 flex items-center justify-between cursor-pointer border border-transparent hover:border-slate-200 transition"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900">{h.nome_completo}</p>
                      <p className="text-[11px] text-slate-500">
                        {h.tipo_documento}: {h.documento} · Tel: {h.telefone} · {h.cidade}/{h.estado}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reservas */}
          {reservasFiltradas.length > 0 && (
            <div>
              <p className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <CalendarCheck2 className="w-3.5 h-3.5" /> Reservas ({reservasFiltradas.length})
              </p>
              <div className="space-y-1">
                {reservasFiltradas.map((r) => {
                  const h = hospedes.find((hosp) => hosp.id === r.hospede_id);
                  const room = quartos.find((quarto) => quarto.id === r.quarto_id);
                  return (
                    <div
                      key={r.id}
                      onClick={() => {
                        onNavigate('reservas');
                        onClose();
                      }}
                      className="p-2.5 rounded-lg hover:bg-slate-50 flex items-center justify-between cursor-pointer border border-transparent hover:border-slate-200 transition"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{r.codigo_reserva}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-slate-100 text-slate-700">
                            {r.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {h?.nome_completo} · Quarto {room?.numero} · {r.data_checkin} a {r.data_checkout} ({formatarMoeda(r.valor_total)})
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quartos */}
          {quartosFiltrados.length > 0 && (
            <div>
              <p className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <BedDouble className="w-3.5 h-3.5" /> Quartos ({quartosFiltrados.length})
              </p>
              <div className="space-y-1">
                {quartosFiltrados.map((room) => (
                  <div
                    key={room.id}
                    onClick={() => {
                      onNavigate('quartos');
                      onClose();
                    }}
                    className="p-2.5 rounded-lg hover:bg-slate-50 flex items-center justify-between cursor-pointer border border-transparent hover:border-slate-200 transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{room.numero} — {room.nome}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-slate-100 text-slate-700">
                          {room.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">{room.andar} · {room.tipo_cama}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recibos */}
          {recibosFiltrados.length > 0 && (
            <div>
              <p className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Recibos Emitidos ({recibosFiltrados.length})
              </p>
              <div className="space-y-1">
                {recibosFiltrados.map((rec) => (
                  <div
                    key={rec.id}
                    onClick={() => {
                      onNavigate('financeiro');
                      onClose();
                    }}
                    className="p-2.5 rounded-lg hover:bg-slate-50 flex items-center justify-between cursor-pointer border border-transparent hover:border-slate-200 transition"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900">{rec.numero_recibo}</p>
                      <p className="text-[11px] text-slate-500">
                        {rec.hospede_nome} · Quarto {rec.quarto_numero} · Total: {formatarMoeda(rec.total)} · Cód: {rec.codigo_validacao}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
