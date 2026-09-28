# POUSADA PMS — Sistema Integrado de Gestão de Pousadas

**Property Management System (PMS)** profissional, modular, seguro e com operação **Offline-First**, projetado inicialmente para pousadas de até 20 quartos (escalável para 50, 100+ unidades sem refatoração estrutural).

---

## 1. Arquitetura Técnica do Sistema

```
                  NAVEGADOR / CLIENTE (PWA)
  ┌─────────────────────────────────────────────────────────┐
  │  React 19 + TypeScript + Tailwind CSS                   │
  │  • Calendário Interativo & Mapa de Ocupação             │
  │  • Gestão de Reservas, Check-in / Check-out             │
  │  • Frente de Caixa & Contas a Pagar/Receber             │
  │  • Governança & Manutenção                              │
  │  • Emissão de Recibos & Auditoria Imutável              │
  └───────────────────────────┬─────────────────────────────┘
                              │
                    PERSISTÊNCIA LOCAL
                              ▼
  ┌─────────────────────────────────────────────────────────┐
  │  IndexedDB (PousadaPMS_DB v2)                           │
  │  • Operação 100% Offline sem depender de internet       │
  │  • 17 Object Stores com índices e integridade           │
  │  • Fila de Sincronização Local (sync_fila)              │
  └───────────────────────────┬─────────────────────────────┘
                              │
        TRANSMISSÃO BIDIRECIONAL OU TRANSFERÊNCIA USB
                              │
       ┌──────────────────────┴──────────────────────┐
       ▼                                             ▼
┌─────────────────────────────┐        ┌─────────────────────────────┐
│ API REST (Express / Node.js)│        │ Transferência por Pen Drive │
│ • POST /api/sync            │        │ • Pacote JSON Estruturado   │
│ • GET /api/health           │        │ • Assinatura SHA-256        │
│ • GET /api/backup/export    │        │ • Validação de Integridade  │
└──────────────┬──────────────┘        └─────────────────────────────┘
               ▼
┌─────────────────────────────┐
│ Banco MySQL 8.x / InnoDB    │
│ • database/schema.sql       │
│ • database/seed.sql (20 UH) │
│ • Foreign Keys, Triggers    │
└─────────────────────────────┘
```

---

## 2. Principais Módulos Implementados

1. **Dashboard Operacional & KPIs**:
   - Taxa de ocupação em tempo real, diária média (ADR), RevPAR, faturamento estimado.
   - Painel das 20 unidades habitacionais com status coloridos.
   - Entradas (check-ins) e saídas (check-outs) do dia com ações de 1 clique.

2. **Mapa de Ocupação & Calendário**:
   - Visualização por linhas (Quartos Q01 a Q20) e colunas (Datas).
   - Bloqueio de reservas por status com verificação automática de conflito.
   - Clique em dia livre para iniciar reserva pré-preenchida.
   - Escalas de 7, 14 ou 21 dias.

3. **Módulo de Reservas**:
   - Cálculo automático de noites, valor total, desconto, taxa de serviço e sinal.
   - Filtros por status: *Confirmada, Hospedado, Check-out, Pré-Reserva, Cancelada*.
   - Prevenção rigorosa de conflitos de ocupação no mesmo quarto.

4. **Check-in Rápido**:
   - Conferência de documento do hóspede, caução opcional, entrega de chave e atribuição do quarto como `OCUPADO`.

5. **Check-out & Fechamento de Folio**:
   - Apuração automática: Diárias + Consumos + Serviços - Descontos - Pagamentos anteriores = Saldo devedor.
   - Múltiplas formas de pagamento: Dinheiro, PIX, Cartão de Crédito/Débito, Transferência.
   - Quarto transferido imediatamente para `LIMPEZA`.
   - Emissão instantânea de recibo oficial com código de autenticação único.

6. **Consumos & Frigobar**:
   - Catálogo de produtos e serviços cadastrados.
   - Lançamento diretamente na conta do quarto com baixa em estoque e registro do atendente.

7. **Frente de Caixa**:
   - Abertura de caixa com fundo de troco.
   - Registro de entradas, saídas, sangrias e suprimentos.
   - Fechamento com conferência de saldo contado (Sobra, Falta ou Zero).

8. **Governança & Limpeza**:
   - Fluxo Kanban: *Sujo ➔ Em Limpeza ➔ Inspeção ➔ Liberado*.
   - Liberação da limpeza atualiza o status do quarto para `LIVRE` automaticamente.

9. **Manutenção**:
   - Chamados com prioridade (*Baixa, Média, Alta, Urgente*), técnico responsável e custos.
   - Finalização do reparo libera o quarto para uso.

10. **Central de Relatórios**:
    - Ocupação, faturamento consolidado, consumos e formas de pagamento.
    - Exportação em formato CSV e impressão otimizada.

11. **Trilha de Auditoria (Logs Imutáveis)**:
    - Registro detalhado de usuário, ação, módulo, data/hora, valores alterados e terminal.

12. **Transferência por Pen Drive & Backup**:
    - Exportação em arquivo JSON completo com hash SHA-256.
    - Pré-visualização com contagem de registros antes da importação.
    - Backup automático preventivo antes de qualquer restauração.

---

## 3. Modelo de Banco de Dados Relacional (MySQL / InnoDB)

Os scripts DDL e DML estão localizados em:
- `database/schema.sql`: Definição de todas as tabelas, chaves primárias, estrangeiras e constraints.
- `database/seed.sql`: Carga inicial de demonstração contendo os 20 quartos (Q01 a Q20), categorias, usuários, produtos, hóspedes e reservas.

### Principais Entidades e Relacionamentos:
- `pousadas` ➔ 1:N ➔ `configuracoes`
- `perfis` ➔ 1:N ➔ `usuarios`
- `categorias_quarto` ➔ 1:N ➔ `quartos`
- `hospedes` ➔ 1:N ➔ `reservas`
- `quartos` ➔ 1:N ➔ `reservas`
- `reservas` ➔ 1:1 ➔ `checkins`
- `reservas` ➔ 1:1 ➔ `checkouts`
- `reservas` ➔ 1:N ➔ `consumos` ➔ N:1 ➔ `produtos`
- `reservas` ➔ 1:N ➔ `pagamentos` ➔ N:1 ➔ `formas_pagamento`
- `caixas` ➔ 1:N ➔ `movimentos_caixa`
- `quartos` ➔ 1:N ➔ `limpeza_quartos`
- `quartos` ➔ 1:N ➔ `manutencoes`
- `auditoria` (registros append-only imutáveis)
- `sync_fila` (fila de sincronização com status `PENDING`, `SYNCED`, `CONFLICT`)

---

## 4. Atalhos de Teclado Operacionais

- `Ctrl + K` (ou `Cmd + K`): Pesquisa Global Instantânea em todo o sistema.
- `Ctrl + N`: Abertura rápida do modal de Nova Reserva.
- `ESC`: Fechar qualquer modal ativo.
