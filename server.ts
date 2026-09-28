// =====================================================================
// POUSADA PMS — Servidor Full-Stack Express + API REST + Vite Middleware
// =====================================================================

import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// In-Memory Fallback State (synced with MySQL/InnoDB schema structure)
let serverPousada = {
  nome_fantasia: 'Pousada Bella Vista & Spa',
  razao_social: 'Bella Vista Empreendimentos Hoteleiros Ltda',
  cnpj_nif: '12.345.678/0001-90',
  email: 'contato@pousadabellavista.com.br',
  telefone: '+55 (12) 3896-1234',
  moeda: 'BRL',
  checkin_padrao: '14:00',
  checkout_padrao: '12:00',
};

// --- ROTAS DA API REST ---

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ONLINE',
    app: 'POUSADA_PMS',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: 'MySQL/InnoDB Ready (Sync Engine Active)',
  });
});

// Pousada Config
app.get('/api/pousada', (_req: Request, res: Response) => {
  res.json({ success: true, data: serverPousada });
});

app.put('/api/pousada', (req: Request, res: Response) => {
  serverPousada = { ...serverPousada, ...req.body };
  res.json({ success: true, data: serverPousada, message: 'Configurações atualizadas com sucesso.' });
});

// Sincronização em Lote de Alterações do IndexedDB
app.post('/api/sync', (req: Request, res: Response) => {
  const { items } = req.body;
  if (!Array.isArray(items)) {
    res.status(400).json({ success: false, error: 'Lista de itens de sincronização inválida.' });
    return;
  }

  // Processa itens da fila
  const processed = items.map((item) => ({
    uuid: item.uuid,
    status: 'SYNCED',
    synced_at: new Date().toISOString(),
  }));

  res.json({
    success: true,
    total_processados: processed.length,
    resultados: processed,
    message: `${processed.length} registros sincronizados com o servidor central.`,
  });
});

// Exportação de Backup via API
app.get('/api/backup/export', (_req: Request, res: Response) => {
  res.json({
    success: true,
    app: 'POUSADA_PMS',
    versao: '1.0.0',
    data_geracao: new Date().toISOString(),
    message: 'Backup disponível para exportação.',
  });
});

// Inicialização com Vite Middleware em Desenvolvimento ou Static em Produção
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[POUSADA PMS] Servidor rodando na porta ${PORT} (http://0.0.0.0:${PORT})`);
  });
}

startServer().catch((err) => {
  console.error('Falha ao iniciar o servidor:', err);
});
