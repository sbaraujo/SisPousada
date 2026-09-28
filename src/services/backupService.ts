// =====================================================================
// POUSADA PMS — Serviço de Backup, Restauração e Transferência por Pen Drive
// =====================================================================

import {
  getAllFromStore,
  bulkPut,
  clearStore,
  STORES,
  registrarAuditoria,
} from './db';
import {
  BackupPackage,
  PousadaConfig,
  Quarto,
  CategoriaQuarto,
  Hospede,
  Reserva,
  Produto,
  Consumo,
  Pagamento,
  Caixa,
  MovimentoCaixa,
  ContaFinanceira,
  LimpezaQuarto,
  Manutencao,
  Recibo,
  AuditoriaLog,
} from '../types';

// Calcula hash SHA-256 no browser
async function computeSha256(text: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Gera o pacote completo de backup
export async function gerarBackupCompleto(usuarioNome: string): Promise<{ jsonString: string; fileName: string; totalRegistros: number; checksum: string }> {
  const [
    pousadas,
    quartos,
    categorias,
    hospedes,
    reservas,
    produtos,
    consumos,
    pagamentos,
    caixas,
    movimentos_caixa,
    contas_financeiras,
    limpezas,
    manutencoes,
    recibos,
    auditoria,
  ] = await Promise.all([
    getAllFromStore<PousadaConfig>(STORES.POUSADA),
    getAllFromStore<Quarto>(STORES.QUARTOS),
    getAllFromStore<CategoriaQuarto>(STORES.CATEGORIAS),
    getAllFromStore<Hospede>(STORES.HOSPEDES),
    getAllFromStore<Reserva>(STORES.RESERVAS),
    getAllFromStore<Produto>(STORES.PRODUTOS),
    getAllFromStore<Consumo>(STORES.CONSUMOS),
    getAllFromStore<Pagamento>(STORES.PAGAMENTOS),
    getAllFromStore<Caixa>(STORES.CAIXAS),
    getAllFromStore<MovimentoCaixa>(STORES.MOVIMENTOS_CAIXA),
    getAllFromStore<ContaFinanceira>(STORES.CONTAS_FINANCEIRAS),
    getAllFromStore<LimpezaQuarto>(STORES.LIMPEZAS),
    getAllFromStore<Manutencao>(STORES.MANUTENCOES),
    getAllFromStore<Recibo>(STORES.RECIBOS),
    getAllFromStore<AuditoriaLog>(STORES.AUDITORIA),
  ]);

  const totalRegistros =
    quartos.length +
    categorias.length +
    hospedes.length +
    reservas.length +
    produtos.length +
    consumos.length +
    pagamentos.length +
    caixas.length +
    movimentos_caixa.length +
    contas_financeiras.length +
    limpezas.length +
    manutencoes.length +
    recibos.length;

  const dataIso = new Date().toISOString();
  const rawDataToHash = JSON.stringify({
    quartos,
    hospedes,
    reservas,
    consumos,
    pagamentos,
    caixas,
  });
  const checksum = await computeSha256(rawDataToHash);

  const backupPkg: BackupPackage = {
    metadata: {
      app: 'POUSADA_PMS',
      versao: '1.0.0',
      data_geracao: dataIso,
      total_registros: totalRegistros,
      checksum_sha256: checksum,
      origem: 'SISTEMA_LOCAL_OFFLINE',
    },
    pousada: pousadas[0] || ({} as PousadaConfig),
    quartos,
    categorias,
    hospedes,
    reservas,
    produtos,
    consumos,
    pagamentos,
    caixas,
    movimentos_caixa,
    contas_financeiras,
    limpezas,
    manutencoes,
    recibos,
    auditoria,
  };

  const jsonString = JSON.stringify(backupPkg, null, 2);
  const dateFormatted = dataIso.substring(0, 10) + '_' + dataIso.substring(11, 19).replace(/:/g, '');
  const fileName = `BACKUP_POUSADA_${dateFormatted}.json`;

  await registrarAuditoria(
    usuarioNome,
    'BACKUP',
    'EXPORTACAO_COMPLETA',
    'backups',
    fileName,
    { totalRegistros, checksum }
  );

  return { jsonString, fileName, totalRegistros, checksum };
}

// Dispara download do arquivo para Pen Drive / Disco Local
export function downloadBackupFile(jsonString: string, fileName: string): void {
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Valida arquivo de backup antes de restaurar
export async function validarArquivoBackup(
  conteudoTexto: string
): Promise<{ valido: boolean; mensagem?: string; dados?: BackupPackage; checksumCalculado?: string }> {
  try {
    const dados = JSON.parse(conteudoTexto) as BackupPackage;
    if (!dados.metadata || dados.metadata.app !== 'POUSADA_PMS') {
      return { valido: false, mensagem: 'Arquivo inválido ou não pertencente ao sistema POUSADA PMS.' };
    }

    const rawDataToHash = JSON.stringify({
      quartos: dados.quartos,
      hospedes: dados.hospedes,
      reservas: dados.reservas,
      consumos: dados.consumos,
      pagamentos: dados.pagamentos,
      caixas: dados.caixas,
    });
    const checksumCalculado = await computeSha256(rawDataToHash);

    if (dados.metadata.checksum_sha256 && dados.metadata.checksum_sha256 !== checksumCalculado) {
      return {
        valido: false,
        mensagem: 'Aviso de Integridade: Checksum SHA-256 não confere com os dados do arquivo.',
        dados,
        checksumCalculado,
      };
    }

    return { valido: true, dados, checksumCalculado };
  } catch {
    return { valido: false, mensagem: 'Erro de formatação JSON no arquivo selecionado.' };
  }
}

// Executa restauração com substituição limpa
export async function restaurarBackup(
  dados: BackupPackage,
  usuarioNome: string
): Promise<void> {
  // Limpar stores principais e regravar dados validados
  if (dados.pousada && dados.pousada.uuid) {
    await clearStore(STORES.POUSADA);
    await bulkPut(STORES.POUSADA, [dados.pousada]);
  }
  if (dados.categorias?.length) {
    await clearStore(STORES.CATEGORIAS);
    await bulkPut(STORES.CATEGORIAS, dados.categorias);
  }
  if (dados.quartos?.length) {
    await clearStore(STORES.QUARTOS);
    await bulkPut(STORES.QUARTOS, dados.quartos);
  }
  if (dados.hospedes?.length) {
    await clearStore(STORES.HOSPEDES);
    await bulkPut(STORES.HOSPEDES, dados.hospedes);
  }
  if (dados.reservas?.length) {
    await clearStore(STORES.RESERVAS);
    await bulkPut(STORES.RESERVAS, dados.reservas);
  }
  if (dados.produtos?.length) {
    await clearStore(STORES.PRODUTOS);
    await bulkPut(STORES.PRODUTOS, dados.produtos);
  }
  if (dados.consumos?.length) {
    await clearStore(STORES.CONSUMOS);
    await bulkPut(STORES.CONSUMOS, dados.consumos);
  }
  if (dados.pagamentos?.length) {
    await clearStore(STORES.PAGAMENTOS);
    await bulkPut(STORES.PAGAMENTOS, dados.pagamentos);
  }
  if (dados.caixas?.length) {
    await clearStore(STORES.CAIXAS);
    await bulkPut(STORES.CAIXAS, dados.caixas);
  }
  if (dados.movimentos_caixa?.length) {
    await clearStore(STORES.MOVIMENTOS_CAIXA);
    await bulkPut(STORES.MOVIMENTOS_CAIXA, dados.movimentos_caixa);
  }
  if (dados.contas_financeiras?.length) {
    await clearStore(STORES.CONTAS_FINANCEIRAS);
    await bulkPut(STORES.CONTAS_FINANCEIRAS, dados.contas_financeiras);
  }
  if (dados.limpezas?.length) {
    await clearStore(STORES.LIMPEZAS);
    await bulkPut(STORES.LIMPEZAS, dados.limpezas);
  }
  if (dados.manutencoes?.length) {
    await clearStore(STORES.MANUTENCOES);
    await bulkPut(STORES.MANUTENCOES, dados.manutencoes);
  }
  if (dados.recibos?.length) {
    await clearStore(STORES.RECIBOS);
    await bulkPut(STORES.RECIBOS, dados.recibos);
  }

  await registrarAuditoria(
    usuarioNome,
    'BACKUP',
    'RESTAURACAO_CONCLUIDA',
    'sistema',
    'RESTORE',
    { dataBackup: dados.metadata.data_geracao, registros: dados.metadata.total_registros }
  );
}
