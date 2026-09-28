// =====================================================================
// POUSADA PMS — Módulo de Backup, Restauração e Pen Drive
// =====================================================================

import React, { useState, useRef } from 'react';
import {
  HardDriveDownload,
  Upload,
  Download,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  FileCheck,
  RefreshCw,
  HardDrive,
} from 'lucide-react';
import { usePMS } from '../../context/PMSContext';
import { useAuth } from '../../context/AuthContext';
import {
  gerarBackupCompleto,
  downloadBackupFile,
  validarArquivoBackup,
  restaurarBackup,
} from '../../services/backupService';
import { BackupPackage } from '../../types';

export const BackupView: React.FC = () => {
  const { recarregarDados } = usePMS();
  const { currentUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [gerando, setGerando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');

  // Estados de Importação
  const [backupCarregado, setBackupCarregado] = useState<BackupPackage | null>(null);
  const [checksumValido, setChecksumValido] = useState<boolean>(true);
  const [restaurando, setRestaurando] = useState(false);

  // 1. Exportar Backup para Pen Drive / Arquivo
  const handleExportar = async () => {
    setGerando(true);
    setMensagemSucesso('');
    setMensagemErro('');

    try {
      const { jsonString, fileName, totalRegistros, checksum } = await gerarBackupCompleto(currentUser.nome);
      downloadBackupFile(jsonString, fileName);
      setMensagemSucesso(
        `Arquivo ${fileName} gerado com sucesso! Contém ${totalRegistros} registros e assinatura SHA-256: ${checksum.substring(0, 16)}... Salve em seu Pen Drive com segurança.`
      );
    } catch {
      setMensagemErro('Ocorreu um erro ao compilar o arquivo de backup.');
    } finally {
      setGerando(false);
    }
  };

  // 2. Selecionar Arquivo do Pen Drive para Análise
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMensagemSucesso('');
    setMensagemErro('');
    setBackupCarregado(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const conteudo = event.target?.result as string;
      const validacao = await validarArquivoBackup(conteudo);

      if (!validacao.valido && !validacao.dados) {
        setMensagemErro(validacao.mensagem || 'Arquivo corrompido ou formato incompatível.');
        return;
      }

      setBackupCarregado(validacao.dados || null);
      setChecksumValido(validacao.valido);

      if (!validacao.valido) {
        setMensagemErro(validacao.mensagem || 'Alerta: Assinatura de integridade divergente.');
      }
    };
    reader.readAsText(file);
  };

  // 3. Confirmar Restauração Definitiva
  const handleConfirmarRestauracao = async () => {
    if (!backupCarregado) return;

    const confirma = window.confirm(
      `ATENÇÃO: Você está prestes a restaurar os dados do backup gerado em ${backupCarregado.metadata.data_geracao}.\n\nEsta operação substituirá o estado atual do sistema pelo estado do arquivo.\n\nDeseja realmente continuar?`
    );

    if (!confirma) return;

    setRestaurando(true);
    setMensagemErro('');
    setMensagemSucesso('');

    try {
      // 1. Cria backup de segurança pré-restauração
      const { jsonString, fileName } = await gerarBackupCompleto(`${currentUser.nome} (Pré-Restauração)`);
      downloadBackupFile(jsonString, `PRE_RESTORE_${fileName}`);

      // 2. Aplica a restauração
      await restaurarBackup(backupCarregado, currentUser.nome);
      await recarregarDados();

      setBackupCarregado(null);
      setMensagemSucesso('Restauração concluída com sucesso! Todos os dados foram atualizados.');
    } catch {
      setMensagemErro('Erro crítico durante o processo de restauração.');
    } finally {
      setRestaurando(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Topo Informativo */}
      <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
            <HardDriveDownload className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Transferência de Dados por Pen Drive & Backup Local
            </h2>
            <p className="text-xs text-slate-500">
              Exportação com integridade SHA-256 e importação segura para transferência entre computadores
            </p>
          </div>
        </div>
      </div>

      {mensagemSucesso && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>{mensagemSucesso}</span>
        </div>
      )}

      {mensagemErro && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800 font-medium">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{mensagemErro}</span>
        </div>
      )}

      {/* Grid: 1. Exportação / 2. Importação */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Painel 1: Exportar para Pen Drive */}
        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-sm text-slate-900">1. Exportar Dados do Sistema</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Gera um pacote único estruturado em formato JSON com todos os quartos, hóspedes, reservas, lançamentos de consumo, movimentações de caixa e recibos.
            </p>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-500 space-y-1">
              <p className="flex items-center gap-1 font-semibold text-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Proteção Criptográfica SHA-256
              </p>
              <p>O arquivo inclui soma de verificação para garantir que nenhum byte foi corrompido.</p>
            </div>
          </div>

          <button
            onClick={handleExportar}
            disabled={gerando}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition disabled:opacity-50"
          >
            {gerando ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Processando Backup...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Baixar Arquivo para Pen Drive</span>
              </>
            )}
          </button>
        </div>

        {/* Painel 2: Importar do Pen Drive */}
        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-sm text-slate-900">2. Importar Dados de Pen Drive</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Selecione o arquivo de backup gerado em outro computador ou terminal para restaurar a operação localmente.
            </p>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-6 border-2 border-dashed border-slate-300 hover:border-slate-400 bg-slate-50/50 rounded-xl text-center cursor-pointer transition flex flex-col items-center justify-center gap-2"
            >
              <HardDrive className="w-6 h-6 text-slate-400" />
              <span className="text-xs font-bold text-slate-700">
                Clique para selecionar o arquivo (.json)
              </span>
              <span className="text-[10px] text-slate-400">Suporta arquivos gerados pelo POUSADA PMS</span>
            </button>
          </div>
        </div>
      </div>

      {/* Painel de Pré-Visualização e Validação do Backup Selecionado */}
      {backupCarregado && (
        <div className="p-6 bg-white rounded-xl border-2 border-blue-200 shadow-sm space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-sm text-slate-900">
                Arquivo Validado — Resumo do Conteúdo Encontrado
              </h3>
            </div>
            <span
              className={`px-2.5 py-1 rounded text-xs font-bold font-mono border ${
                checksumValido
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              SHA-256: {checksumValido ? 'ÍNTEGRO' : 'DIVERGENTE'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Data de Geração</span>
              <span className="font-bold text-slate-900 font-mono">
                {backupCarregado.metadata.data_geracao.substring(0, 10)}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Pousada de Origem</span>
              <span className="font-bold text-slate-900 truncate block">
                {backupCarregado.pousada?.nome_fantasia || 'Pousada'}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Total de Registros</span>
              <span className="font-bold text-slate-900 font-mono">
                {backupCarregado.metadata.total_registros} itens
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Quartos / UH</span>
              <span className="font-bold text-slate-900 font-mono">
                {backupCarregado.quartos?.length || 0} cadastrados
              </span>
            </div>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Confirmação de Segurança:</strong> Ao confirmar, um backup automático de segurança do estado atual será baixado em seu computador antes de aplicar a restauração.
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => setBackupCarregado(null)}
              className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg text-xs"
            >
              Cancelar Importação
            </button>
            <button
              onClick={handleConfirmarRestauracao}
              disabled={restaurando}
              className="px-5 py-2 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-xs shadow-xs transition disabled:opacity-50"
            >
              {restaurando ? 'Restaurando...' : 'Confirmar e Restaurar Dados'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
