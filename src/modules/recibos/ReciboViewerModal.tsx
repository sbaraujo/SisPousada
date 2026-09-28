// =====================================================================
// POUSADA PMS — Visualizador e Emissor de Recibo Oficial
// =====================================================================

import React from 'react';
import { X, Printer, CheckCircle, ShieldCheck, Download } from 'lucide-react';
import { usePMS } from '../../context/PMSContext';
import { Recibo } from '../../types';

interface ReciboViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  recibo: Recibo | null;
}

export const ReciboViewerModal: React.FC<ReciboViewerModalProps> = ({
  isOpen,
  onClose,
  recibo,
}) => {
  const { pousada, formatarMoeda } = usePMS();

  if (!isOpen || !recibo) return null;

  const handleImprimir = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs no-print-backdrop">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[95vh] flex flex-col">
        {/* Barra de Ações (Oculta na impressão) */}
        <div className="px-6 py-3 bg-slate-900 text-white flex items-center justify-between no-print shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold">Comprovante de Quitação & Recibo de Hospedagem</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleImprimir}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Salvar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Corpo do Recibo (Formato A4 Limpo) */}
        <div className="flex-1 overflow-y-auto p-8 text-xs text-slate-800 space-y-6 print:p-0 print:space-y-4">
          {/* Cabeçalho da Pousada */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
            <div>
              <h1 className="text-lg font-bold text-slate-950 tracking-tight">
                {pousada.nome_fantasia}
              </h1>
              <p className="text-[11px] text-slate-600">{pousada.razao_social}</p>
              <p className="text-[11px] text-slate-600">
                CNPJ/NIF: {pousada.cnpj_nif} {pousada.inscricao_estadual ? `· IE: ${pousada.inscricao_estadual}` : ''}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                {pousada.endereco}, {pousada.numero} · {pousada.bairro} · {pousada.cidade} - {pousada.estado}
              </p>
              <p className="text-[11px] text-slate-500">
                Tel: {pousada.telefone} · E-mail: {pousada.email}
              </p>
            </div>

            <div className="text-right">
              <span className="inline-block px-2.5 py-1 bg-slate-100 border border-slate-300 rounded font-mono font-bold text-slate-900 text-xs">
                RECIBO Nº {recibo.numero_recibo}
              </span>
              <p className="text-[11px] text-slate-500 mt-1">
                Data: {new Date(recibo.data_emissao).toLocaleDateString('pt-BR')} às{' '}
                {new Date(recibo.data_emissao).toLocaleTimeString('pt-BR').substring(0, 5)}
              </p>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                Cód. Autenticação: {recibo.codigo_validacao}
              </p>
            </div>
          </div>

          {/* Dados do Hóspede e Acomodação */}
          <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Hóspede / Pagador</p>
              <p className="font-bold text-slate-900 text-sm">{recibo.hospede_nome}</p>
              <p className="text-[11px] text-slate-600">Documento: {recibo.hospede_documento}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Unidade Habitacional / Estadia</p>
              <p className="font-bold text-slate-900 text-sm">Quarto {recibo.quarto_numero}</p>
              <p className="text-[11px] text-slate-600">Período: {recibo.periodo}</p>
            </div>
          </div>

          {/* Tabela de Itens (Diárias e Consumos) */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Discriminação dos Serviços & Consumos
            </h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-300 text-[10px] text-slate-500 uppercase font-semibold">
                  <th className="py-1.5">Descrição</th>
                  <th className="py-1.5 text-center w-16">Qtd</th>
                  <th className="py-1.5 text-right w-24">Unitário</th>
                  <th className="py-1.5 text-right w-24">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recibo.itens.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-2 text-slate-800">{item.descricao}</td>
                    <td className="py-2 text-center font-mono">{item.quantidade}</td>
                    <td className="py-2 text-right font-mono text-slate-600">
                      {formatarMoeda(item.valor_unitario)}
                    </td>
                    <td className="py-2 text-right font-mono font-semibold text-slate-900">
                      {formatarMoeda(item.valor_total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totais e Formas de Pagamento */}
          <div className="pt-3 border-t border-slate-300 flex justify-end">
            <div className="w-64 space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal Itens:</span>
                <span className="font-mono">{formatarMoeda(recibo.subtotal)}</span>
              </div>
              {recibo.desconto > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Descontos:</span>
                  <span className="font-mono">- {formatarMoeda(recibo.desconto)}</span>
                </div>
              )}
              {recibo.taxas > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Taxa de Serviço:</span>
                  <span className="font-mono">+ {formatarMoeda(recibo.taxas)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-slate-950 pt-1 border-t border-slate-900">
                <span>Total Geral:</span>
                <span className="font-mono">{formatarMoeda(recibo.total)}</span>
              </div>

              {/* Pagamentos Efetuados */}
              <div className="pt-2 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700 block mb-0.5">Formas de Pagamento:</span>
                {recibo.pagamentos.map((pag, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{pag.forma} ({pag.data}):</span>
                    <span className="font-mono font-semibold text-slate-800">
                      {formatarMoeda(pag.valor)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between font-bold text-xs pt-1 text-slate-900">
                <span>Saldo Pendente:</span>
                <span className="font-mono">{formatarMoeda(recibo.saldo)}</span>
              </div>
            </div>
          </div>

          {/* Autenticação e Assinatura */}
          <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 items-end">
            <div>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Este recibo confirma o pagamento dos itens acima discriminados para fins de hospedagem.
                Validação de autenticidade no sistema interno PMS pelo código:{' '}
                <strong className="font-mono text-slate-800">{recibo.codigo_validacao}</strong>.
              </p>
              <p className="text-[10px] text-slate-400 mt-2">
                Atendente responsável: {recibo.usuario_emissor_nome}
              </p>
            </div>

            <div className="text-center">
              <div className="border-b border-slate-400 w-48 mx-auto mb-1"></div>
              <p className="text-[10px] font-semibold text-slate-700">{pousada.nome_fantasia}</p>
              <p className="text-[9px] text-slate-400">Assinatura / Carimbo Autorizado</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
