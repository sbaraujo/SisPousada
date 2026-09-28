// =====================================================================
// POUSADA PMS — Motor de Sincronização Local (IndexedDB) <-> API / MySQL
// =====================================================================

import { getAllFromStore, putInStore, STORES, registrarAuditoria } from './db';
import { SyncQueueItem } from '../types';

export type SyncState = 'ONLINE' | 'OFFLINE';
export type SyncProgress = 'IDLE' | 'SYNCING' | 'SYNCED' | 'PENDING' | 'ERROR';

type SyncListener = (status: {
  online: boolean;
  progress: SyncProgress;
  pendingCount: number;
  lastSyncedAt?: string;
  errorMessage?: string;
}) => void;

class SyncService {
  private listeners: Set<SyncListener> = new Set();
  private isOnline: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;
  private currentProgress: SyncProgress = 'SYNCED';
  private lastSyncedAt?: string;
  private errorMessage?: string;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.notify();
        this.processQueue();
      });

      window.addEventListener('offline', () => {
        this.isOnline = false;
        this.notify();
      });

      // Checa fila periodicamente a cada 30 segundos se online
      setInterval(() => {
        if (this.isOnline) {
          this.processQueue();
        }
      }, 30000);
    }
  }

  public subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener);
    this.notify();
    return () => this.listeners.delete(listener);
  }

  public async getPendingCount(): Promise<number> {
    try {
      const items = await getAllFromStore<SyncQueueItem>(STORES.SYNC_FILA);
      return items.filter((item) => item.status === 'PENDING').length;
    } catch {
      return 0;
    }
  }

  public async notify(): Promise<void> {
    const pendingCount = await this.getPendingCount();
    const status = {
      online: this.isOnline,
      progress: pendingCount > 0 && this.currentProgress !== 'SYNCING' ? ('PENDING' as SyncProgress) : this.currentProgress,
      pendingCount,
      lastSyncedAt: this.lastSyncedAt,
      errorMessage: this.errorMessage,
    };
    for (const listener of this.listeners) {
      listener(status);
    }
  }

  public async processQueue(): Promise<void> {
    if (!this.isOnline) {
      await this.notify();
      return;
    }

    const items = await getAllFromStore<SyncQueueItem>(STORES.SYNC_FILA);
    const pending = items.filter((item) => item.status === 'PENDING');

    if (pending.length === 0) {
      this.currentProgress = 'SYNCED';
      await this.notify();
      return;
    }

    this.currentProgress = 'SYNCING';
    await this.notify();

    try {
      // Envia lote para a API REST (/api/sync)
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: pending }),
      });

      if (response.ok) {
        // Marca itens como sincronizados
        for (const item of pending) {
          item.status = 'SYNCED';
          await putInStore(STORES.SYNC_FILA, item);
        }
        this.currentProgress = 'SYNCED';
        this.lastSyncedAt = new Date().toLocaleTimeString('pt-BR');
        this.errorMessage = undefined;
      } else {
        // Simulação elegante offline se o backend ainda não estiver ligado
        console.info('API /api/sync indisponível no momento. Mantendo dados seguros no IndexedDB local.');
        this.currentProgress = 'PENDING';
      }
    } catch {
      // Modo offline transparente: não quebra a experiência do usuário
      this.currentProgress = 'PENDING';
    }

    await this.notify();
  }

  public async forcarSincronizacao(usuarioNome: string): Promise<boolean> {
    await registrarAuditoria(usuarioNome, 'SINCRONIZACAO', 'MANUAL_DISPARADA', 'sync_fila', 'ALL');
    await this.processQueue();
    return this.currentProgress === 'SYNCED';
  }
}

export const syncService = new SyncService();
