// =====================================================================
// POUSADA PMS — Modal de Check-in Rápido e Seguro
// =====================================================================

import React, { useState } from 'react';
import { X, LogIn, CheckCircle2, BedDouble, User, AlertCircle } from 'lucide-react';
import { usePMS } from '../../context/PMSContext';

interface CheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservaId: number | null;
}

export const CheckinModal: React.FC<CheckinModalProps> = ({
  isOpen,
  onClose,
  reservaId,
}) => {
  const { reservas, hospedes, quartos, fazerCheckin, formatarMoeda } = usePMS();

  const [documentoConferido, setDocumentoConferido] = useState(true);
  const [caucao, setCaucao] = useState(0);
  const [observacoes, setObservacoes] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [erroMsg, setErroMsg] = useState('');

  if (!isOpen || !reservaId) return null;

  const res = reservas.find((r) => r.id === reservaId);
  if (!res) return null;

  const hosp = hospedes.find((h) => h.id === res.hospede_id);
  const room = quartos.find((q) => q.id === res.quarto_id);

  const handleConfirmar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentoConferido) {
      setErroMsg('É obrigatório conferir e validar o documento do hóspede.');
      return;
    }

    setSalvando(true);
    setErroMsg('');

    try {
      const resp = await fazerCheckin(res.id, caucao, observacoes);
      if (!resp.success) {
        setErroMsg(resp.message || 'Erro ao realizar o check-in.');
        setSalvando(false);
        return;
      }
      onClose();
    } catch {
      setErroMsg('Erro ao processar o check-in.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Cabeçalho */}
        <div className="px-6 py-4 bg-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LogIn className="w-5 h-5" />
            <div>
              <h2 className="text-base font-bold">Check-in — {res.codigo_reserva}</h2>
              <p className="text-xs text-emerald-100">Confirmação de entrada de hóspede</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-emerald-200 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {erroMsg && (
          <div className="px-6 py-2.5 bg-rose-50 border-b border-rose-200 flex items-center gap-2 text-rose-800 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{erroMsg}</span>
          </div>
        )}

        <form onSubmit={handleConfirmar} className="p-6 space-y-4 text-xs">
          {/* Card Resumo da Hospedagem */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">{hosp?.nome_completo}</span>
              <span className="font-mono text-[10px] text-slate-500">
                {hosp?.tipo_documento}: {hosp?.documento}
              </span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <span className="flex items-center gap-1 font-semibold text-slate-900">
                <BedDouble className="w-3.5 h-3.5 text-blue-600" /> Quarto {room?.numero} ({room?.nome})
              </span>
              <span>·</span>
              <span>{res.data_checkin} até {res.data_checkout}</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-slate-500">
              <span>Hóspedes: {res.adultos} adultos, {res.criancas} crianças</span>
              <span className="font-semibold text-slate-900">Total: {formatarMoeda(res.valor_total)}</span>
            </div>
          </div>

          {/* Checklist de Validação */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={documentoConferido}
                onChange={(e) => setDocumentoConferido(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <span className="font-medium text-slate-800">
                Documento de identificação conferido e válido
              </span>
            </label>
          </div>

          {/* Caução e Observações */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Caução Opcional (R$)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={caucao}
                onChange={(e) => setCaucao(Number(e.target.value))}
                className="w-full p-2 bg-white rounded-lg border border-slate-300 font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Entrega da Chave</label>
              <input
                type="text"
                readOnly
                value={`Chave Física Quarto ${room?.numero}`}
                className="w-full p-2 bg-slate-100 rounded-lg border border-slate-300 text-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Observações do Check-in</label>
            <input
              type="text"
              placeholder="Ex: Hóspede informou chegada de 1 veículo placa ABC-1234"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="w-full p-2 bg-white rounded-lg border border-slate-300"
            />
          </div>

          {/* Ações */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              className="px-5 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition disabled:opacity-50"
            >
              {salvando ? 'Concluindo...' : 'Confirmar e Abrir Quarto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
