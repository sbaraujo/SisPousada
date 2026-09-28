// =====================================================================
// POUSADA PMS — Modal de Cadastro e Histórico de Hóspede
// =====================================================================

import React, { useState, useEffect } from 'react';
import { X, User, Phone, MapPin, History, FileText } from 'lucide-react';
import { usePMS } from '../../context/PMSContext';
import { Hospede, TipoDocumento } from '../../types';

interface HospedeModalProps {
  isOpen: boolean;
  onClose: () => void;
  hospedeParaEditar?: Hospede | null;
}

export const HospedeModal: React.FC<HospedeModalProps> = ({
  isOpen,
  onClose,
  hospedeParaEditar,
}) => {
  const { salvarHospede, reservas, quartos, formatarMoeda } = usePMS();

  const [nome, setNome] = useState('');
  const [tipoDoc, setTipoDoc] = useState<TipoDocumento>('CPF');
  const [documento, setDocumento] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [nacionalidade, setNacionalidade] = useState('Brasileira');
  const [telefone, setTelefone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('SP');
  const [pais, setPais] = useState('Brasil');
  const [cep, setCep] = useState('');
  const [preferencias, setPreferencias] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [abaAtiva, setAbaAtiva] = useState<'dados' | 'historico'>('dados');
  const [erroMsg, setErroMsg] = useState('');

  useEffect(() => {
    if (hospedeParaEditar) {
      setNome(hospedeParaEditar.nome_completo);
      setTipoDoc(hospedeParaEditar.tipo_documento);
      setDocumento(hospedeParaEditar.documento);
      setNascimento(hospedeParaEditar.data_nascimento || '');
      setNacionalidade(hospedeParaEditar.nacionalidade || 'Brasileira');
      setTelefone(hospedeParaEditar.telefone);
      setWhatsapp(hospedeParaEditar.whatsapp || hospedeParaEditar.telefone);
      setEmail(hospedeParaEditar.email || '');
      setEndereco(hospedeParaEditar.endereco || '');
      setCidade(hospedeParaEditar.cidade || '');
      setEstado(hospedeParaEditar.estado || 'SP');
      setPais(hospedeParaEditar.pais || 'Brasil');
      setCep(hospedeParaEditar.cep || '');
      setPreferencias(hospedeParaEditar.preferencias || '');
      setObservacoes(hospedeParaEditar.observacoes || '');
    } else {
      setNome('');
      setTipoDoc('CPF');
      setDocumento('');
      setNascimento('');
      setNacionalidade('Brasileira');
      setTelefone('');
      setWhatsapp('');
      setEmail('');
      setEndereco('');
      setCidade('');
      setEstado('SP');
      setPais('Brasil');
      setCep('');
      setPreferencias('');
      setObservacoes('');
    }
    setAbaAtiva('dados');
    setErroMsg('');
  }, [hospedeParaEditar, isOpen]);

  if (!isOpen) return null;

  // Histórico de estadias deste hóspede
  const estadiasPassadas = hospedeParaEditar
    ? reservas.filter((r) => r.hospede_id === hospedeParaEditar.id)
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErroMsg('');

    const resp = await salvarHospede({
      id: hospedeParaEditar?.id,
      uuid: hospedeParaEditar?.uuid,
      nome_completo: nome,
      tipo_documento: tipoDoc,
      documento,
      data_nascimento: nascimento,
      nacionalidade,
      telefone,
      whatsapp,
      email,
      endereco,
      cidade,
      estado,
      pais,
      cep,
      preferencias,
      observacoes,
      total_hospedagens: hospedeParaEditar?.total_hospedagens || 0,
    });

    if (!resp.success) {
      setErroMsg(resp.message || 'Erro ao salvar hóspede.');
      return;
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Cabeçalho */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold">
              {hospedeParaEditar ? `Ficha Cadastral — ${hospedeParaEditar.nome_completo}` : 'Cadastrar Novo Hóspede'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Abas */}
        {hospedeParaEditar && (
          <div className="flex items-center border-b border-slate-200 px-6 bg-slate-50 text-xs font-semibold">
            <button
              onClick={() => setAbaAtiva('dados')}
              className={`py-2.5 px-3 border-b-2 transition ${
                abaAtiva === 'dados' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500'
              }`}
            >
              Dados Pessoais & Contato
            </button>
            <button
              onClick={() => setAbaAtiva('historico')}
              className={`py-2.5 px-3 border-b-2 transition flex items-center gap-1.5 ${
                abaAtiva === 'historico' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              Histórico de Estadias ({estadiasPassadas.length})
            </button>
          </div>
        )}

        {erroMsg && (
          <div className="px-6 py-2.5 bg-rose-50 border-b border-rose-200 text-rose-800 text-xs font-semibold">
            {erroMsg}
          </div>
        )}

        {/* Conteúdo */}
        {abaAtiva === 'dados' ? (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Nome Completo *</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Nome do hóspede"
                  className="w-full p-2 bg-white rounded-lg border border-slate-300 font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nacionalidade</label>
                <input
                  type="text"
                  value={nacionalidade}
                  onChange={(e) => setNacionalidade(e.target.value)}
                  className="w-full p-2 bg-white rounded-lg border border-slate-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Tipo de Documento</label>
                <select
                  value={tipoDoc}
                  onChange={(e) => setTipoDoc(e.target.value as TipoDocumento)}
                  className="w-full p-2 bg-white rounded-lg border border-slate-300"
                >
                  <option value="CPF">CPF (Brasil)</option>
                  <option value="RG">RG</option>
                  <option value="PASSAPORTE">Passaporte</option>
                  <option value="NIF">NIF (Portugal / Europa)</option>
                  <option value="OUTRO">Outro</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Número do Documento *</label>
                <input
                  type="text"
                  value={documento}
                  onChange={(e) => setDocumento(e.target.value)}
                  placeholder="000.000.000-00"
                  className="w-full p-2 bg-white rounded-lg border border-slate-300 font-mono"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Data de Nascimento</label>
                <input
                  type="date"
                  value={nascimento}
                  onChange={(e) => setNascimento(e.target.value)}
                  className="w-full p-2 bg-white rounded-lg border border-slate-300 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Telefone Principal *</label>
                <input
                  type="text"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="(00) 00000-0000"
                  className="w-full p-2 bg-white rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">WhatsApp</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="(00) 00000-0000"
                  className="w-full p-2 bg-white rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hospede@email.com"
                  className="w-full p-2 bg-white rounded-lg border border-slate-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Endereço Residencial</label>
                <input
                  type="text"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  placeholder="Rua, número, complemento"
                  className="w-full p-2 bg-white rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Cidade</label>
                <input
                  type="text"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  className="w-full p-2 bg-white rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Estado</label>
                <input
                  type="text"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  className="w-full p-2 bg-white rounded-lg border border-slate-300 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Preferências de Estadia</label>
                <textarea
                  rows={2}
                  value={preferencias}
                  onChange={(e) => setPreferencias(e.target.value)}
                  placeholder="Ex: Travesseiro de plumas, quarto no piso superior..."
                  className="w-full p-2 bg-white rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Observações Internas (Restrito)</label>
                <textarea
                  rows={2}
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Ex: Hóspede VIP, restrições alimentares..."
                  className="w-full p-2 bg-white rounded-lg border border-slate-300"
                />
              </div>
            </div>

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
                className="px-5 py-2 font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition"
              >
                Salvar Hóspede
              </button>
            </div>
          </form>
        ) : (
          /* Aba Histórico de Estadias */
          <div className="flex-1 overflow-y-auto p-6 space-y-3 text-xs">
            {estadiasPassadas.length === 0 ? (
              <p className="text-center text-slate-400 py-8">
                Este hóspede ainda não possui histórico de reservas registrado.
              </p>
            ) : (
              estadiasPassadas.map((res) => {
                const room = quartos.find((q) => q.id === res.quarto_id);
                return (
                  <div
                    key={res.id}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold font-mono text-slate-900">{res.codigo_reserva}</span>
                        <span className="px-1.5 py-0.5 rounded font-mono font-bold text-[10px] bg-white border border-slate-200">
                          Quarto {room?.numero}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                          {res.status}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-1">
                        Período: {res.data_checkin} a {res.data_checkout} ({res.adultos} adultos)
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-slate-900">
                        {formatarMoeda(res.valor_total)}
                      </span>
                      <span className="text-[10px] text-slate-500 block">Canal: {res.origem}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};
