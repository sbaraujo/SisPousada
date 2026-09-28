// =====================================================================
// POUSADA PMS — Repositório IndexedDB Local (Offline-First)
// =====================================================================

import {
  INITIAL_POUSADA_CONFIG,
  INITIAL_CATEGORIAS,
  INITIAL_QUARTOS,
  INITIAL_HOSPEDES,
  INITIAL_FORMAS_PAGAMENTO,
  INITIAL_PRODUTOS,
  INITIAL_RESERVAS,
  INITIAL_CONSUMOS,
  INITIAL_CAIXA,
  INITIAL_MOVIMENTOS_CAIXA,
  INITIAL_CONTAS_FINANCEIRAS,
  INITIAL_LIMPEZAS,
  INITIAL_MANUTENCOES,
  INITIAL_AUDITORIA,
} from './initialData';
import { SyncQueueItem, AuditoriaLog } from '../types';

const DB_NAME = 'PousadaPMS_DB';
const DB_VERSION = 2;

export const STORES = {
  POUSADA: 'pousada',
  QUARTOS: 'quartos',
  CATEGORIAS: 'categorias',
  HOSPEDES: 'hospedes',
  RESERVAS: 'reservas',
  PRODUTOS: 'produtos',
  CONSUMOS: 'consumos',
  FORMAS_PAGAMENTO: 'formas_pagamento',
  PAGAMENTOS: 'pagamentos',
  CAIXAS: 'caixas',
  MOVIMENTOS_CAIXA: 'movimentos_caixa',
  CONTAS_FINANCEIRAS: 'contas_financeiras',
  LIMPEZAS: 'limpezas',
  MANUTENCOES: 'manutencoes',
  RECIBOS: 'recibos',
  AUDITORIA: 'auditoria',
  SYNC_FILA: 'sync_fila',
} as const;

export type StoreName = (typeof STORES)[keyof typeof STORES];

let dbInstance: IDBDatabase | null = null;

export function openDatabase(): Promise<IDBDatabase> {
  if (dbInstance) {
    return Promise.resolve(dbInstance);
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Falha ao abrir IndexedDB:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Criação dos object stores com keyPath e índices
      const storeConfigs: Array<{ name: StoreName; keyPath: string; autoIncrement?: boolean; indexes?: Array<{ name: string; key: string; unique?: boolean }> }> = [
        { name: STORES.POUSADA, keyPath: 'uuid' },
        { name: STORES.CATEGORIAS, keyPath: 'id', autoIncrement: true, indexes: [{ name: 'uuid', key: 'uuid', unique: true }] },
        { name: STORES.QUARTOS, keyPath: 'id', autoIncrement: true, indexes: [{ name: 'uuid', key: 'uuid', unique: true }, { name: 'numero', key: 'numero', unique: true }, { name: 'status', key: 'status' }] },
        { name: STORES.HOSPEDES, keyPath: 'id', autoIncrement: true, indexes: [{ name: 'uuid', key: 'uuid', unique: true }, { name: 'documento', key: 'documento' }, { name: 'nome_completo', key: 'nome_completo' }] },
        { name: STORES.RESERVAS, keyPath: 'id', autoIncrement: true, indexes: [{ name: 'uuid', key: 'uuid', unique: true }, { name: 'codigo_reserva', key: 'codigo_reserva', unique: true }, { name: 'status', key: 'status' }, { name: 'quarto_id', key: 'quarto_id' }] },
        { name: STORES.PRODUTOS, keyPath: 'id', autoIncrement: true, indexes: [{ name: 'uuid', key: 'uuid', unique: true }] },
        { name: STORES.CONSUMOS, keyPath: 'id', autoIncrement: true, indexes: [{ name: 'uuid', key: 'uuid', unique: true }, { name: 'reserva_id', key: 'reserva_id' }] },
        { name: STORES.FORMAS_PAGAMENTO, keyPath: 'id', autoIncrement: true, indexes: [{ name: 'uuid', key: 'uuid', unique: true }] },
        { name: STORES.PAGAMENTOS, keyPath: 'id', autoIncrement: true, indexes: [{ name: 'uuid', key: 'uuid', unique: true }] },
        { name: STORES.CAIXAS, keyPath: 'id', autoIncrement: true, indexes: [{ name: 'uuid', key: 'uuid', unique: true }, { name: 'status', key: 'status' }] },
        { name: STORES.MOVIMENTOS_CAIXA, keyPath: 'id', autoIncrement: true, indexes: [{ name: 'uuid', key: 'uuid', unique: true }, { name: 'caixa_id', key: 'caixa_id' }] },
        { name: STORES.CONTAS_FINANCEIRAS, keyPath: 'id', autoIncrement: true, indexes: [{ name: 'uuid', key: 'uuid', unique: true }] },
        { name: STORES.LIMPEZAS, keyPath: 'id', autoIncrement: true, indexes: [{ name: 'uuid', key: 'uuid', unique: true }, { name: 'quarto_id', key: 'quarto_id' }] },
        { name: STORES.MANUTENCOES, keyPath: 'id', autoIncrement: true, indexes: [{ name: 'uuid', key: 'uuid', unique: true }] },
        { name: STORES.RECIBOS, keyPath: 'id', autoIncrement: true, indexes: [{ name: 'uuid', key: 'uuid', unique: true }, { name: 'numero_recibo', key: 'numero_recibo', unique: true }] },
        { name: STORES.AUDITORIA, keyPath: 'id', autoIncrement: true, indexes: [{ name: 'uuid', key: 'uuid', unique: true }] },
        { name: STORES.SYNC_FILA, keyPath: 'id', autoIncrement: true, indexes: [{ name: 'status', key: 'status' }] },
      ];

      for (const config of storeConfigs) {
        if (!db.objectStoreNames.contains(config.name)) {
          const store = db.createObjectStore(config.name, {
            keyPath: config.keyPath,
            autoIncrement: config.autoIncrement ?? false,
          });
          if (config.indexes) {
            for (const idx of config.indexes) {
              store.createIndex(idx.name, idx.key, { unique: idx.unique ?? false });
            }
          }
        }
      }
    };
  });
}

// Inicializa dados iniciais se banco estiver vazio
export async function seedInitialDataIfEmpty(): Promise<void> {
  const db = await openDatabase();
  const tx = db.transaction([STORES.QUARTOS, STORES.POUSADA], 'readonly');
  const quartosStore = tx.objectStore(STORES.QUARTOS);
  const countReq = quartosStore.count();

  return new Promise((resolve, reject) => {
    countReq.onsuccess = async () => {
      if (countReq.result === 0) {
        console.log('IndexedDB vazio. Populando 20 quartos e dados operacionais de demonstração...');
        try {
          await bulkPut(STORES.POUSADA, [INITIAL_POUSADA_CONFIG]);
          await bulkPut(STORES.CATEGORIAS, INITIAL_CATEGORIAS);
          await bulkPut(STORES.QUARTOS, INITIAL_QUARTOS);
          await bulkPut(STORES.HOSPEDES, INITIAL_HOSPEDES);
          await bulkPut(STORES.FORMAS_PAGAMENTO, INITIAL_FORMAS_PAGAMENTO);
          await bulkPut(STORES.PRODUTOS, INITIAL_PRODUTOS);
          await bulkPut(STORES.RESERVAS, INITIAL_RESERVAS);
          await bulkPut(STORES.CONSUMOS, INITIAL_CONSUMOS);
          await bulkPut(STORES.CAIXAS, [INITIAL_CAIXA]);
          await bulkPut(STORES.MOVIMENTOS_CAIXA, INITIAL_MOVIMENTOS_CAIXA);
          await bulkPut(STORES.CONTAS_FINANCEIRAS, INITIAL_CONTAS_FINANCEIRAS);
          await bulkPut(STORES.LIMPEZAS, INITIAL_LIMPEZAS);
          await bulkPut(STORES.MANUTENCOES, INITIAL_MANUTENCOES);
          await bulkPut(STORES.AUDITORIA, INITIAL_AUDITORIA);
          console.log('IndexedDB semeado com sucesso!');
        } catch (e) {
          console.error('Erro ao semear IndexedDB:', e);
        }
      }
      resolve();
    };
    countReq.onerror = () => reject(countReq.error);
  });
}

// Operações Genéricas no IndexedDB
export async function getAllFromStore<T>(storeName: StoreName): Promise<T[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result as T[]);
    request.onerror = () => reject(request.error);
  });
}

export async function getFromStore<T>(storeName: StoreName, key: IDBValidKey): Promise<T | undefined> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const request = store.get(key);
    request.onsuccess = () => resolve(request.result as T | undefined);
    request.onerror = () => reject(request.error);
  });
}

export async function putInStore<T>(storeName: StoreName, item: T): Promise<IDBValidKey> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.put(item);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteFromStore(storeName: StoreName, key: IDBValidKey): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.delete(key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function clearStore(storeName: StoreName): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.clear();
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function bulkPut<T>(storeName: StoreName, items: T[]): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    for (const item of items) {
      store.put(item);
    }
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// Registro automático de auditoria
export async function registrarAuditoria(
  usuarioNome: string,
  modulo: string,
  acao: string,
  tabela: string,
  registroId: string,
  valorNovo?: unknown,
  valorAnterior?: unknown
): Promise<void> {
  const log: AuditoriaLog = {
    id: Date.now(),
    uuid: crypto.randomUUID ? crypto.randomUUID() : 'aud-' + Math.random().toString(36).substring(2, 9),
    usuario_nome: usuarioNome,
    modulo,
    acao,
    tabela_afetada: tabela,
    registro_id: String(registroId),
    valor_novo: valorNovo ? JSON.stringify(valorNovo) : undefined,
    valor_anterior: valorAnterior ? JSON.stringify(valorAnterior) : undefined,
    device_id: 'BROWSER_' + (navigator.userAgent.includes('Mobile') ? 'MOBILE' : 'DESKTOP'),
    data_hora: new Date().toISOString().replace('T', ' ').substring(0, 19),
  };
  try {
    await putInStore(STORES.AUDITORIA, log);
  } catch (e) {
    console.warn('Erro ao gravar log de auditoria:', e);
  }
}

// Inserção na fila de sincronização
export async function enfileirarSincronizacao(
  entidade: string,
  acao: 'INSERT' | 'UPDATE' | 'DELETE',
  payload: unknown
): Promise<void> {
  const item: SyncQueueItem = {
    uuid: crypto.randomUUID ? crypto.randomUUID() : 'sync-' + Math.random().toString(36).substring(2, 9),
    device_id: 'DEVICE_' + (navigator.userAgent.includes('Mobile') ? 'MOB' : 'DSK'),
    entidade,
    acao,
    dados_payload: JSON.stringify(payload),
    status: 'PENDING',
    tentativas: 0,
    created_at: new Date().toISOString(),
  };
  await putInStore(STORES.SYNC_FILA, item);
}
