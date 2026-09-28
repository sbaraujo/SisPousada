// =====================================================================
// POUSADA PMS — Módulo de Configurações Gerais da Pousada
// =====================================================================

import React, { useState } from 'react';
import { Settings, Save, CheckCircle2, Building, DollarSign, Clock, Shield } from 'lucide-react';
import { usePMS } from '../../context/PMSContext';
import { PousadaConfig } from '../../types';

export const ConfiguracoesView: React.FC = () => {
  const { pousada, salvarConfiguracoes } = usePMS();

  const [formData, setFormData] = useState<PousadaConfig>({ ...pousada });
  const [salvo, setSalvo] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await salvarConfiguracoes(formData);
    setSalvo(true);
    setTimeout(() => setSalvo(false), 3000);
  };

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-700" />
            Configurações da Propriedade & Parâmetros do Sistema
          </h2>
          <p className="text-xs text-slate-500">
            Dados cadastrais, moeda, idioma, regras de check-in/out e dados fiscais
          </p>
        </div>

        {salvo && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Configurações Salvas!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Dados da Empresa */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-1.5">
            <Building className="w-4 h-4 text-slate-500" />
            Dados Cadastrais da Pousada
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Nome Fantasia *</label>
              <input
                type="text"
                value={formData.nome_fantasia}
                onChange={(e) => setFormData({ ...formData, nome_fantasia: e.target.value })}
                className="w-full p-2 bg-white rounded-lg border border-slate-300 font-bold"
                required
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Razão Social *</label>
              <input
                type="text"
                value={formData.razao_social}
                onChange={(e) => setFormData({ ...formData, razao_social: e.target.value })}
                className="w-full p-2 bg-white rounded-lg border border-slate-300"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">CNPJ / NIF Fiscal *</label>
              <input
                type="text"
                value={formData.cnpj_nif}
                onChange={(e) => setFormData({ ...formData, cnpj_nif: e.target.value })}
                className="w-full p-2 bg-white rounded-lg border border-slate-300 font-mono"
                required
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Inscrição Estadual</label>
              <input
                type="text"
                value={formData.inscricao_estadual || ''}
                onChange={(e) => setFormData({ ...formData, inscricao_estadual: e.target.value })}
                className="w-full p-2 bg-white rounded-lg border border-slate-300 font-mono"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Website</label>
              <input
                type="text"
                value={formData.website || ''}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full p-2 bg-white rounded-lg border border-slate-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Telefone Principal</label>
              <input
                type="text"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                className="w-full p-2 bg-white rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">WhatsApp</label>
              <input
                type="text"
                value={formData.whatsapp || ''}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full p-2 bg-white rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">E-mail Operacional</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 bg-white rounded-lg border border-slate-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Endereço</label>
              <input
                type="text"
                value={formData.endereco}
                onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                className="w-full p-2 bg-white rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Número</label>
              <input
                type="text"
                value={formData.numero}
                onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                className="w-full p-2 bg-white rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Bairro</label>
              <input
                type="text"
                value={formData.bairro}
                onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                className="w-full p-2 bg-white rounded-lg border border-slate-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Cidade</label>
              <input
                type="text"
                value={formData.cidade}
                onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                className="w-full p-2 bg-white rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Estado</label>
              <input
                type="text"
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                className="w-full p-2 bg-white rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">CEP</label>
              <input
                type="text"
                value={formData.cep}
                onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                className="w-full p-2 bg-white rounded-lg border border-slate-300 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Políticas de Hospedagem & Moeda */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-slate-500" />
            Moeda, Horários e Políticas Operacionais
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Moeda do Sistema</label>
              <select
                value={formData.moeda}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    moeda: e.target.value as any,
                    simbolo_moeda: e.target.value === 'EUR' ? '€' : e.target.value === 'USD' ? '$' : 'R$',
                  })
                }
                className="w-full p-2 bg-white rounded-lg border border-slate-300 font-bold"
              >
                <option value="BRL">Real Brasileiro (BRL - R$)</option>
                <option value="EUR">Euro (EUR - €)</option>
                <option value="USD">Dólar Americano (USD - $)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Horário Padrão Check-in</label>
              <input
                type="time"
                value={formData.checkin_padrao}
                onChange={(e) => setFormData({ ...formData, checkin_padrao: e.target.value })}
                className="w-full p-2 bg-white rounded-lg border border-slate-300 font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Horário Padrão Check-out</label>
              <input
                type="time"
                value={formData.checkout_padrao}
                onChange={(e) => setFormData({ ...formData, checkout_padrao: e.target.value })}
                className="w-full p-2 bg-white rounded-lg border border-slate-300 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Taxa de Serviço (%)</label>
              <input
                type="number"
                step="0.5"
                value={formData.taxa_servico_percentual}
                onChange={(e) => setFormData({ ...formData, taxa_servico_percentual: Number(e.target.value) })}
                className="w-full p-2 bg-white rounded-lg border border-slate-300 font-mono"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Imposto Municipal / ISS (%)</label>
              <input
                type="number"
                step="0.5"
                value={formData.imposto_percentual}
                onChange={(e) => setFormData({ ...formData, imposto_percentual: Number(e.target.value) })}
                className="w-full p-2 bg-white rounded-lg border border-slate-300 font-mono"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Numeração Sequencial Recibo</label>
              <input
                type="number"
                value={formData.num_recibo_atual}
                onChange={(e) => setFormData({ ...formData, num_recibo_atual: Number(e.target.value) })}
                className="w-full p-2 bg-white rounded-lg border border-slate-300 font-mono font-bold"
              />
            </div>
          </div>
        </div>

        {/* Botão de Salvar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-1.5 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Alterações</span>
          </button>
        </div>
      </form>
    </div>
  );
};
