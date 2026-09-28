// =====================================================================
// POUSADA PMS — Modal de Cadastro e Edição de Quarto
// =====================================================================

import React, { useState, useEffect } from 'react';
import { X, BedDouble } from 'lucide-react';
import { usePMS } from '../../context/PMSContext';
import { Quarto, StatusQuarto } from '../../types';

interface QuartoModalProps {
  isOpen: boolean;
  onClose: () => void;
  quartoParaEditar?: Quarto | null;
}

export const QuartoModal: React.FC<QuartoModalProps> = ({
  isOpen,
  onClose,
  quartoParaEditar,
}) => {
  const { categorias, salvarQuarto } = usePMS();

  const [numero, setNumero] = useState('');
  const [nome, setNome] = useState('');
  const [categoriaId, setCategoriaId] = useState<number>(1);
  const [andar, setAndar] = useState('Térreo');
  const [capacidadeAdultos, setCapacidadeAdultos] = useState(2);
  const [capacidadeCriancas, setCapacidadeCriancas] = useState(0);
  const [tipoCama, setTipoCama] = useState('1 Cama Casal Queen');
  const [areaM2, setAreaM2] = useState(20);
  const [equipamentos, setEquipamentos] = useState('Ar Split, Smart TV 43, Frigobar, Wi-Fi');
  const [status, setStatus] = useState<StatusQuarto>('LIVRE');
  const [observacoes, setObservacoes] = useState('');
  const [ativo, setAtivo] = useState(true);

  useEffect(() => {
    if (quartoParaEditar) {
      setNumero(quartoParaEditar.numero);
      setNome(quartoParaEditar.nome);
      setCategoriaId(quartoParaEditar.categoria_id);
      setAndar(quartoParaEditar.andar);
      setCapacidadeAdultos(quartoParaEditar.capacidade_adultos);
      setCapacidadeCriancas(quartoParaEditar.capacidade_criancas);
      setTipoCama(quartoParaEditar.tipo_cama);
      setAreaM2(quartoParaEditar.area_m2);
      setEquipamentos(quartoParaEditar.equipamentos || '');
      setStatus(quartoParaEditar.status);
      setObservacoes(quartoParaEditar.observacoes || '');
      setAtivo(quartoParaEditar.ativo);
    } else {
      setNumero('');
      setNome('');
      setCategoriaId(categorias[0]?.id || 1);
      setAndar('Térreo');
      setCapacidadeAdultos(2);
      setCapacidadeCriancas(0);
      setTipoCama('1 Cama Casal Queen');
      setAreaM2(20);
      setEquipamentos('Ar Split, Smart TV 43, Frigobar, Wi-Fi');
      setStatus('LIVRE');
      setObservacoes('');
      setAtivo(true);
    }
  }, [quartoParaEditar, isOpen, categorias]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!numero.trim() || !nome.trim()) return;

    await salvarQuarto({
      id: quartoParaEditar?.id,
      uuid: quartoParaEditar?.uuid,
      numero: numero.trim().toUpperCase(),
      nome: nome.trim(),
      categoria_id: categoriaId,
      andar,
      capacidade_adultos: capacidadeAdultos,
      capacidade_criancas: capacidadeCriancas,
      tipo_cama: tipoCama,
      area_m2: areaM2,
      equipamentos,
      status,
      observacoes,
      ativo,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BedDouble className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold">
              {quartoParaEditar ? `Editar Quarto ${quartoParaEditar.numero}` : 'Cadastrar Nova Unidade Habitacional'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Número / Código (ex: Q21) *</label>
              <input
                type="text"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                placeholder="Q01"
                className="w-full p-2 bg-white rounded-lg border border-slate-300 font-mono font-bold"
                required
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Nome do Quarto *</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Suíte Beija-Flor"
                className="w-full p-2 bg-white rounded-lg border border-slate-300 font-medium"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Categoria de Quarto</label>
              <select
                value={categoriaId}
                onChange={(e) => setCategoriaId(Number(e.target.value))}
                className="w-full p-2 bg-white rounded-lg border border-slate-300 font-medium"
              >
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome} (Tarifa Base: R$ {c.tarifa_base})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Andar / Localização</label>
              <select
                value={andar}
                onChange={(e) => setAndar(e.target.value)}
                className="w-full p-2 bg-white rounded-lg border border-slate-300"
              >
                <option value="Térreo">Térreo</option>
                <option value="1º Andar">1º Andar</option>
                <option value="2º Andar">2º Andar</option>
                <option value="Área Externa">Área Externa (Chalés)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Adultos</label>
              <input
                type="number"
                min="1"
                max="8"
                value={capacidadeAdultos}
                onChange={(e) => setCapacidadeAdultos(Number(e.target.value))}
                className="w-full p-2 bg-white rounded-lg border border-slate-300 font-mono"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Crianças</label>
              <input
                type="number"
                min="0"
                max="4"
                value={capacidadeCriancas}
                onChange={(e) => setCapacidadeCriancas(Number(e.target.value))}
                className="w-full p-2 bg-white rounded-lg border border-slate-300 font-mono"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Área (m²)</label>
              <input
                type="number"
                step="0.5"
                value={areaM2}
                onChange={(e) => setAreaM2(Number(e.target.value))}
                className="w-full p-2 bg-white rounded-lg border border-slate-300 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Configuração de Camas</label>
              <input
                type="text"
                value={tipoCama}
                onChange={(e) => setTipoCama(e.target.value)}
                placeholder="1 Casal Queen + 1 Solteiro"
                className="w-full p-2 bg-white rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Status Operacional</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StatusQuarto)}
                className="w-full p-2 bg-white rounded-lg border border-slate-300 font-bold"
              >
                <option value="LIVRE">Livre</option>
                <option value="OCUPADO">Ocupado</option>
                <option value="RESERVADO">Reservado</option>
                <option value="LIMPEZA">Limpeza</option>
                <option value="MANUTENÇÃO">Manutenção</option>
                <option value="BLOQUEADO">Bloqueado</option>
                <option value="FORA_DE_SERVICO">Fora de Serviço</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Equipamentos & Características</label>
            <input
              type="text"
              value={equipamentos}
              onChange={(e) => setEquipamentos(e.target.value)}
              placeholder="Ar Condicionado Split, Smart TV 50, Varanda com Rede..."
              className="w-full p-2 bg-white rounded-lg border border-slate-300"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Observações Internas</label>
            <textarea
              rows={2}
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Ex: Próximo à recepção, silencioso..."
              className="w-full p-2 bg-white rounded-lg border border-slate-300"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="quartoAtivo"
              checked={ativo}
              onChange={(e) => setAtivo(e.target.checked)}
              className="w-4 h-4 text-slate-900 rounded"
            />
            <label htmlFor="quartoAtivo" className="text-slate-800 font-medium">
              Quarto ativo para locação e visível no mapa de ocupação
            </label>
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
              Salvar Quarto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
