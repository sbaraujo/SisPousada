// =====================================================================
// POUSADA PMS — Modal de Criação e Edição de Reserva
// =====================================================================

import React, { useState, useEffect } from 'react';
import { X, Calendar, User, BedDouble, AlertTriangle } from 'lucide-react';
import { usePMS } from '../../context/PMSContext';
import { Reserva, OrigemReserva, StatusReserva } from '../../types';

interface ReservaModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservaParaEditar?: Reserva | null;
  quartoIdInicial?: number;
  dataInicial?: string;
}

export const ReservaModal: React.FC<ReservaModalProps> = ({
  isOpen,
  onClose,
  reservaParaEditar,
  quartoIdInicial,
  dataInicial,
}) => {
  const { quartos, categorias, hospedes, salvarReserva, salvarHospede, formatarMoeda } = usePMS();

  const [hospedeId, setHospedeId] = useState<number | ''>('');
  const [novoHospedeNome, setNovoHospedeNome] = useState('');
  const [novoHospedeDoc, setNovoHospedeDoc] = useState('');
  const [novoHospedeTel, setNovoHospedeTel] = useState('');
  const [cadastrarNovoHospede, setCadastrarNovoHospede] = useState(false);

  const [quartoId, setQuartoId] = useState<number | ''>('');
  const [dataCheckin, setDataCheckin] = useState('');
  const [dataCheckout, setDataCheckout] = useState('');
  const [adultos, setAdultos] = useState(2);
  const [criancas, setCriancas] = useState(0);
  const [valorDiaria, setValorDiaria] = useState(0);
  const [valorDesconto, setValorDesconto] = useState(0);
  const [valorSinal, setValorSinal] = useState(0);
  const [origem, setOrigem] = useState<OrigemReserva>('DIRETA');
  const [status, setStatus] = useState<StatusReserva>('CONFIRMADA');
  const [observacoes, setObservacoes] = useState('');

  const [erroMsg, setErroMsg] = useState('');
  const [salvando, setSalvando] = useState(false);

  // Inicializa formulário
  useEffect(() => {
    if (reservaParaEditar) {
      setHospedeId(reservaParaEditar.hospede_id);
      setQuartoId(reservaParaEditar.quarto_id);
      setDataCheckin(reservaParaEditar.data_checkin);
      setDataCheckout(reservaParaEditar.data_checkout);
      setAdultos(reservaParaEditar.adultos);
      setCriancas(reservaParaEditar.criancas);
      setValorDiaria(reservaParaEditar.valor_diaria);
      setValorDesconto(reservaParaEditar.valor_desconto);
      setValorSinal(reservaParaEditar.valor_sinal_pago);
      setOrigem(reservaParaEditar.origem);
      setStatus(reservaParaEditar.status);
      setObservacoes(reservaParaEditar.observacoes || '');
      setCadastrarNovoHospede(false);
    } else {
      const hoje = dataInicial || new Date().toISOString().substring(0, 10);
      const amanha = new Date();
      amanha.setDate(amanha.getDate() + 2);
      const amanhaIso = amanha.toISOString().substring(0, 10);

      setDataCheckin(hoje);
      setDataCheckout(amanhaIso);
      setQuartoId(quartoIdInicial || (quartos[0]?.id ?? ''));
      setHospedeId(hospedes[0]?.id ?? '');
      setAdultos(2);
      setCriancas(0);
      setValorDesconto(0);
      setValorSinal(0);
      setOrigem('DIRETA');
      setStatus('CONFIRMADA');
      setObservacoes('');
      setCadastrarNovoHospede(false);
    }
    setErroMsg('');
  }, [reservaParaEditar, quartoIdInicial, dataInicial, isOpen, quartos, hospedes]);

  // Atualiza diária base ao selecionar o quarto
  useEffect(() => {
    if (quartoId && !reservaParaEditar) {
      const q = quartos.find((room) => room.id === Number(quartoId));
      if (q) {
        const cat = categorias.find((c) => c.id === q.categoria_id);
        if (cat) {
          setValorDiaria(cat.tarifa_base);
        }
      }
    }
  }, [quartoId, reservaParaEditar, quartos, categorias]);

  if (!isOpen) return null;

  // Cálculo de Noites e Totais
  const calcNoites = () => {
    if (!dataCheckin || !dataCheckout) return 0;
    const diff = new Date(dataCheckout).getTime() - new Date(dataCheckin).getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const noites = calcNoites();
  const totalDiarias = noites * valorDiaria;
  const taxaServico = totalDiarias * 0.05; // 5% taxa
  const valorTotal = Math.max(0, totalDiarias - valorDesconto + taxaServico);
  const saldoRestante = Math.max(0, valorTotal - valorSinal);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErroMsg('');
    setSalvando(true);

    try {
      let finalHospedeId = hospedeId;

      // Se optou por cadastrar novo hóspede rápido no modal
      if (cadastrarNovoHospede) {
        if (!novoHospedeNome.trim() || !novoHospedeDoc.trim()) {
          setErroMsg('Preencha o nome e documento do novo hóspede.');
          setSalvando(false);
          return;
        }
        const respHospede = await salvarHospede({
          nome_completo: novoHospedeNome,
          documento: novoHospedeDoc,
          tipo_documento: 'CPF',
          telefone: novoHospedeTel,
          pais: 'Brasil',
        });
        if (!respHospede.success || !respHospede.hospede) {
          setErroMsg(respHospede.message || 'Erro ao cadastrar novo hóspede.');
          setSalvando(false);
          return;
        }
        finalHospedeId = respHospede.hospede.id;
      }

      if (!finalHospedeId) {
        setErroMsg('Selecione ou cadastre um hóspede titular para a reserva.');
        setSalvando(false);
        return;
      }

      const resResult = await salvarReserva({
        id: reservaParaEditar?.id,
        uuid: reservaParaEditar?.uuid,
        codigo_reserva: reservaParaEditar?.codigo_reserva,
        hospede_id: Number(finalHospedeId),
        quarto_id: Number(quartoId),
        data_checkin: dataCheckin,
        data_checkout: dataCheckout,
        adultos,
        criancas,
        valor_diaria: valorDiaria,
        total_diarias: totalDiarias,
        valor_desconto: valorDesconto,
        valor_taxas: taxaServico,
        valor_total: valorTotal,
        valor_sinal_pago: valorSinal,
        saldo_restante: saldoRestante,
        origem,
        status,
        observacoes,
      });

      if (!resResult.success) {
        setErroMsg(resResult.message || 'Não foi possível salvar a reserva.');
        setSalvando(false);
        return;
      }

      onClose();
    } catch {
      setErroMsg('Erro inesperado ao processar a reserva.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Cabeçalho */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-base font-bold">
              {reservaParaEditar ? `Editar Reserva ${reservaParaEditar.codigo_reserva}` : 'Nova Reserva de Hospedagem'}
            </h2>
            <p className="text-xs text-slate-300">
              Prevenção de conflito de datas e cálculo automático de diárias
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mensagem de Erro / Conflito */}
        {erroMsg && (
          <div className="px-6 py-3 bg-rose-50 border-b border-rose-200 flex items-center gap-2 text-rose-800 text-xs font-semibold">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{erroMsg}</span>
          </div>
        )}

        {/* Formulário com Scroll */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* Hóspede */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900 flex items-center gap-1.5">
                <User className="w-4 h-4 text-slate-500" /> Hóspede Titular *
              </label>
              <button
                type="button"
                onClick={() => setCadastrarNovoHospede(!cadastrarNovoHospede)}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                {cadastrarNovoHospede ? 'Selecionar Cadastrado' : '+ Novo Hóspede'}
              </button>
            </div>

            {!cadastrarNovoHospede ? (
              <select
                value={hospedeId}
                onChange={(e) => setHospedeId(Number(e.target.value))}
                className="w-full p-2 bg-white rounded-lg border border-slate-300 font-medium text-slate-900"
                required
              >
                <option value="">Selecione o hóspede...</option>
                {hospedes.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.nome_completo} ({h.tipo_documento}: {h.documento})
                  </option>
                ))}
              </select>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Nome Completo *"
                  value={novoHospedeNome}
                  onChange={(e) => setNovoHospedeNome(e.target.value)}
                  className="p-2 bg-white rounded-lg border border-slate-300"
                  required
                />
                <input
                  type="text"
                  placeholder="CPF / Documento *"
                  value={novoHospedeDoc}
                  onChange={(e) => setNovoHospedeDoc(e.target.value)}
                  className="p-2 bg-white rounded-lg border border-slate-300"
                  required
                />
                <input
                  type="text"
                  placeholder="Telefone / WhatsApp"
                  value={novoHospedeTel}
                  onChange={(e) => setNovoHospedeTel(e.target.value)}
                  className="p-2 bg-white rounded-lg border border-slate-300"
                />
              </div>
            )}
          </div>

          {/* Quarto & Datas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Quarto (UH) *</label>
              <select
                value={quartoId}
                onChange={(e) => setQuartoId(Number(e.target.value))}
                className="w-full p-2 bg-white rounded-lg border border-slate-300 font-medium text-slate-900"
                required
              >
                {quartos.map((room) => {
                  const cat = categorias.find((c) => c.id === room.categoria_id);
                  return (
                    <option key={room.id} value={room.id}>
                      {room.numero} - {room.nome} ({cat?.nome} · {room.status})
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Data Check-in *</label>
              <input
                type="date"
                value={dataCheckin}
                onChange={(e) => setDataCheckin(e.target.value)}
                className="w-full p-2 bg-white rounded-lg border border-slate-300 font-mono"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Data Check-out *</label>
              <input
                type="date"
                value={dataCheckout}
                onChange={(e) => setDataCheckout(e.target.value)}
                className="w-full p-2 bg-white rounded-lg border border-slate-300 font-mono"
                required
              />
            </div>
          </div>

          {/* Adultos, Crianças, Origem e Status */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Adultos</label>
              <input
                type="number"
                min="1"
                max="6"
                value={adultos}
                onChange={(e) => setAdultos(Number(e.target.value))}
                className="w-full p-2 bg-white rounded-lg border border-slate-300 font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Crianças</label>
              <input
                type="number"
                min="0"
                max="4"
                value={criancas}
                onChange={(e) => setCriancas(Number(e.target.value))}
                className="w-full p-2 bg-white rounded-lg border border-slate-300 font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Canal de Origem</label>
              <select
                value={origem}
                onChange={(e) => setOrigem(e.target.value as OrigemReserva)}
                className="w-full p-2 bg-white rounded-lg border border-slate-300"
              >
                <option value="DIRETA">Direta / Balcão</option>
                <option value="TELEFONE">Telefone</option>
                <option value="WHATSAPP">WhatsApp</option>
                <option value="WEBSITE">Site da Pousada</option>
                <option value="BOOKING">Booking.com</option>
                <option value="AIRBNB">Airbnb</option>
                <option value="EXPEDIA">Expedia</option>
                <option value="OUTRO">Outro Canal</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StatusReserva)}
                className="w-full p-2 bg-white rounded-lg border border-slate-300 font-bold"
              >
                <option value="CONFIRMADA">Confirmada</option>
                <option value="PRÉ_RESERVA">Pré-Reserva</option>
                <option value="ORÇAMENTO">Orçamento</option>
                {reservaParaEditar && <option value="HOSPEDADO">Hospedado</option>}
                {reservaParaEditar && <option value="CHECK_OUT">Check-out</option>}
                {reservaParaEditar && <option value="CANCELADA">Cancelada</option>}
              </select>
            </div>
          </div>

          {/* Valores Financeiros */}
          <div className="p-4 bg-slate-100 rounded-xl space-y-3">
            <h4 className="font-bold text-slate-900">Composição Financeira</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-slate-600 block mb-1">Valor Diária (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={valorDiaria}
                  onChange={(e) => setValorDiaria(Number(e.target.value))}
                  className="w-full p-2 bg-white rounded-lg border border-slate-300 font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1">Desconto (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={valorDesconto}
                  onChange={(e) => setValorDesconto(Number(e.target.value))}
                  className="w-full p-2 bg-white rounded-lg border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1">Sinal Pago (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={valorSinal}
                  onChange={(e) => setValorSinal(Number(e.target.value))}
                  className="w-full p-2 bg-white rounded-lg border border-slate-300 font-mono text-emerald-700 font-bold"
                />
              </div>

              <div className="p-2 bg-white rounded-lg border border-slate-300 flex flex-col justify-center">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Total Geral</span>
                <span className="font-bold font-mono text-sm text-slate-900">
                  {formatarMoeda(valorTotal)}
                </span>
                <span className="text-[10px] text-slate-500">
                  {noites} noites · Saldo: {formatarMoeda(saldoRestante)}
                </span>
              </div>
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Observações da Hospedagem</label>
            <textarea
              rows={2}
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Ex: Hóspede solicitou travesseiro extra, comemoração de aniversário..."
              className="w-full p-2 bg-white rounded-lg border border-slate-300"
            />
          </div>

          {/* Rodapé do Modal */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
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
              className="px-5 py-2 font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition disabled:opacity-50"
            >
              {salvando ? 'Salvando...' : reservaParaEditar ? 'Salvar Alterações' : 'Confirmar Reserva'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
