-- =====================================================================
-- POUSADA PMS — Sistema Integrado de Gestão de Pousadas
-- BANCO DE DADOS RELACIONAL: MySQL 8.x / MariaDB
-- MOTOR DE ARMAZENAMENTO: InnoDB
-- PADRÃO DE DADOS: UTF-8 MB4, Integridade Referencial, UUIDs, Auditoria
-- =====================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. POUSADAS & CONFIGURAÇÕES GERAIS
CREATE TABLE IF NOT EXISTS `pousadas` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `uuid` VARCHAR(36) NOT NULL UNIQUE,
  `nome_fantasia` VARCHAR(150) NOT NULL,
  `razao_social` VARCHAR(150) NOT NULL,
  `cnpj_nif` VARCHAR(30) NOT NULL,
  `inscricao_estadual` VARCHAR(30) NULL,
  `email` VARCHAR(100) NOT NULL,
  `telefone` VARCHAR(30) NOT NULL,
  `whatsapp` VARCHAR(30) NULL,
  `website` VARCHAR(150) NULL,
  `logotipo_url` TEXT NULL,
  `endereco` VARCHAR(200) NOT NULL,
  `numero` VARCHAR(20) NOT NULL,
  `complemento` VARCHAR(50) NULL,
  `bairro` VARCHAR(80) NOT NULL,
  `cidade` VARCHAR(80) NOT NULL,
  `estado` VARCHAR(50) NOT NULL,
  `cep` VARCHAR(20) NOT NULL,
  `pais` VARCHAR(50) DEFAULT 'Brasil',
  `moeda` VARCHAR(5) DEFAULT 'BRL',
  `simbolo_moeda` VARCHAR(5) DEFAULT 'R$',
  `idioma` VARCHAR(10) DEFAULT 'pt-BR',
  `fuso_horario` VARCHAR(50) DEFAULT 'America/Sao_Paulo',
  `checkin_padrao` TIME DEFAULT '14:00:00',
  `checkout_padrao` TIME DEFAULT '12:00:00',
  `imposto_percentual` DECIMAL(5,2) DEFAULT 0.00,
  `taxa_servico_percentual` DECIMAL(5,2) DEFAULT 0.00,
  `num_recibo_atual` INT UNSIGNED DEFAULT 1000,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME NULL,
  `sync_status` ENUM('SYNCED', 'PENDING', 'ERROR', 'CONFLICT') DEFAULT 'SYNCED',
  `sync_version` INT UNSIGNED DEFAULT 1,
  `device_id` VARCHAR(50) DEFAULT 'SERVER'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. PERFIS E PERMISSÕES DE ACESSO
CREATE TABLE IF NOT EXISTS `perfis` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `uuid` VARCHAR(36) NOT NULL UNIQUE,
  `codigo` VARCHAR(30) NOT NULL UNIQUE,
  `nome` VARCHAR(50) NOT NULL,
  `descricao` VARCHAR(255) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `permissoes` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `codigo` VARCHAR(50) NOT NULL UNIQUE,
  `modulo` VARCHAR(50) NOT NULL,
  `descricao` VARCHAR(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `perfil_permissoes` (
  `perfil_id` INT UNSIGNED NOT NULL,
  `permissao_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`perfil_id`, `permissao_id`),
  FOREIGN KEY (`perfil_id`) REFERENCES `perfis`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`permissao_id`) REFERENCES `permissoes`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. USUÁRIOS DO SISTEMA
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `uuid` VARCHAR(36) NOT NULL UNIQUE,
  `nome` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `senha_hash` VARCHAR(255) NOT NULL,
  `cargo` VARCHAR(50) NOT NULL,
  `perfil_id` INT UNSIGNED NOT NULL,
  `ativo` TINYINT(1) DEFAULT 1,
  `ultimo_acesso` DATETIME NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME NULL,
  FOREIGN KEY (`perfil_id`) REFERENCES `perfis`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. CATEGORIAS DE QUARTOS
CREATE TABLE IF NOT EXISTS `categorias_quarto` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `uuid` VARCHAR(36) NOT NULL UNIQUE,
  `nome` VARCHAR(80) NOT NULL,
  `descricao` TEXT NULL,
  `capacidade_padrao` SMALLINT UNSIGNED NOT NULL DEFAULT 2,
  `capacidade_maxima` SMALLINT UNSIGNED NOT NULL DEFAULT 3,
  `tarifa_base` DECIMAL(10,2) NOT NULL,
  `cor_hex` VARCHAR(7) DEFAULT '#3b82f6',
  `ativo` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME NULL,
  `sync_status` ENUM('SYNCED', 'PENDING', 'ERROR', 'CONFLICT') DEFAULT 'SYNCED',
  `sync_version` INT UNSIGNED DEFAULT 1,
  `device_id` VARCHAR(50) DEFAULT 'SERVER'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. QUARTOS (UNIDADES HABITACIONAIS)
CREATE TABLE IF NOT EXISTS `quartos` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `uuid` VARCHAR(36) NOT NULL UNIQUE,
  `numero` VARCHAR(10) NOT NULL UNIQUE,
  `nome` VARCHAR(80) NOT NULL,
  `categoria_id` INT UNSIGNED NOT NULL,
  `andar` VARCHAR(10) DEFAULT 'Térreo',
  `capacidade_adultos` SMALLINT UNSIGNED DEFAULT 2,
  `capacidade_criancas` SMALLINT UNSIGNED DEFAULT 1,
  `tipo_cama` VARCHAR(50) DEFAULT '1 Cama Casal Queen',
  `area_m2` DECIMAL(5,2) DEFAULT 22.00,
  `equipamentos` TEXT NULL,
  `status` ENUM('LIVRE', 'RESERVADO', 'OCUPADO', 'LIMPEZA', 'MANUTENÇÃO', 'BLOQUEADO', 'FORA_DE_SERVICO') DEFAULT 'LIVRE',
  `ativo` TINYINT(1) DEFAULT 1,
  `observacoes` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME NULL,
  `sync_status` ENUM('SYNCED', 'PENDING', 'ERROR', 'CONFLICT') DEFAULT 'SYNCED',
  `sync_version` INT UNSIGNED DEFAULT 1,
  `device_id` VARCHAR(50) DEFAULT 'SERVER',
  FOREIGN KEY (`categoria_id`) REFERENCES `categorias_quarto`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. HÓSPEDES
CREATE TABLE IF NOT EXISTS `hospedes` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `uuid` VARCHAR(36) NOT NULL UNIQUE,
  `nome_completo` VARCHAR(150) NOT NULL,
  `tipo_documento` ENUM('CPF', 'RG', 'PASSAPORTE', 'NIF', 'OUTRO') DEFAULT 'CPF',
  `documento` VARCHAR(30) NOT NULL,
  `data_nascimento` DATE NULL,
  `nacionalidade` VARCHAR(50) DEFAULT 'Brasileira',
  `telefone` VARCHAR(30) NOT NULL,
  `whatsapp` VARCHAR(30) NULL,
  `email` VARCHAR(100) NULL,
  `endereco` VARCHAR(150) NULL,
  `cidade` VARCHAR(80) NULL,
  `estado` VARCHAR(50) NULL,
  `pais` VARCHAR(50) DEFAULT 'Brasil',
  `cep` VARCHAR(20) NULL,
  `preferencias` TEXT NULL,
  `observacoes` TEXT NULL,
  `total_hospedagens` INT UNSIGNED DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME NULL,
  `sync_status` ENUM('SYNCED', 'PENDING', 'ERROR', 'CONFLICT') DEFAULT 'SYNCED',
  `sync_version` INT UNSIGNED DEFAULT 1,
  `device_id` VARCHAR(50) DEFAULT 'SERVER',
  INDEX `idx_hospede_doc` (`documento`),
  INDEX `idx_hospede_nome` (`nome_completo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. RESERVAS
CREATE TABLE IF NOT EXISTS `reservas` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `uuid` VARCHAR(36) NOT NULL UNIQUE,
  `codigo_reserva` VARCHAR(20) NOT NULL UNIQUE,
  `hospede_id` INT UNSIGNED NOT NULL,
  `quarto_id` INT UNSIGNED NOT NULL,
  `data_checkin` DATE NOT NULL,
  `data_checkout` DATE NOT NULL,
  `hora_checkin_prevista` TIME DEFAULT '14:00:00',
  `hora_checkout_prevista` TIME DEFAULT '12:00:00',
  `adultos` SMALLINT UNSIGNED DEFAULT 2,
  `criancas` SMALLINT UNSIGNED DEFAULT 0,
  `valor_diaria` DECIMAL(10,2) NOT NULL,
  `total_diarias` DECIMAL(10,2) NOT NULL,
  `valor_desconto` DECIMAL(10,2) DEFAULT 0.00,
  `valor_taxas` DECIMAL(10,2) DEFAULT 0.00,
  `valor_total` DECIMAL(10,2) NOT NULL,
  `valor_sinal_pago` DECIMAL(10,2) DEFAULT 0.00,
  `saldo_restante` DECIMAL(10,2) NOT NULL,
  `origem` ENUM('DIRETA', 'TELEFONE', 'WHATSAPP', 'WEBSITE', 'BOOKING', 'AIRBNB', 'EXPEDIA', 'OUTRO') DEFAULT 'DIRETA',
  `status` ENUM('ORÇAMENTO', 'PRÉ_RESERVA', 'CONFIRMADA', 'CHECK_IN', 'HOSPEDADO', 'CHECK_OUT', 'CANCELADA', 'NO_SHOW') DEFAULT 'CONFIRMADA',
  `observacoes` TEXT NULL,
  `motivo_cancelamento` VARCHAR(255) NULL,
  `data_cancelamento` DATETIME NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME NULL,
  `sync_status` ENUM('SYNCED', 'PENDING', 'ERROR', 'CONFLICT') DEFAULT 'SYNCED',
  `sync_version` INT UNSIGNED DEFAULT 1,
  `device_id` VARCHAR(50) DEFAULT 'SERVER',
  FOREIGN KEY (`hospede_id`) REFERENCES `hospedes`(`id`),
  FOREIGN KEY (`quarto_id`) REFERENCES `quartos`(`id`),
  INDEX `idx_datas_reserva` (`data_checkin`, `data_checkout`),
  INDEX `idx_status_reserva` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. CHECK-INS E CHECK-OUTS DETALHADOS
CREATE TABLE IF NOT EXISTS `checkins` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `uuid` VARCHAR(36) NOT NULL UNIQUE,
  `reserva_id` INT UNSIGNED NOT NULL UNIQUE,
  `quarto_id` INT UNSIGNED NOT NULL,
  `data_hora_checkin` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `usuario_responsavel_id` INT UNSIGNED NOT NULL,
  `documento_verificado` TINYINT(1) DEFAULT 1,
  `valor_caucao` DECIMAL(10,2) DEFAULT 0.00,
  `observacoes` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`reserva_id`) REFERENCES `reservas`(`id`),
  FOREIGN KEY (`quarto_id`) REFERENCES `quartos`(`id`),
  FOREIGN KEY (`usuario_responsavel_id`) REFERENCES `usuarios`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `checkouts` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `uuid` VARCHAR(36) NOT NULL UNIQUE,
  `reserva_id` INT UNSIGNED NOT NULL UNIQUE,
  `quarto_id` INT UNSIGNED NOT NULL,
  `data_hora_checkout` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `usuario_responsavel_id` INT UNSIGNED NOT NULL,
  `total_hospedagem` DECIMAL(10,2) NOT NULL,
  `total_consumos` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `total_servicos` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `total_taxas` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `total_descontos` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `total_geral` DECIMAL(10,2) NOT NULL,
  `total_pago` DECIMAL(10,2) NOT NULL,
  `saldo_final` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `recibo_numero` VARCHAR(30) NULL,
  `observacoes` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`reserva_id`) REFERENCES `reservas`(`id`),
  FOREIGN KEY (`quarto_id`) REFERENCES `quartos`(`id`),
  FOREIGN KEY (`usuario_responsavel_id`) REFERENCES `usuarios`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. PRODUTOS E SERVIÇOS (CATÁLOGO)
CREATE TABLE IF NOT EXISTS `categorias_produto` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `uuid` VARCHAR(36) NOT NULL UNIQUE,
  `nome` VARCHAR(50) NOT NULL,
  `tipo` ENUM('PRODUTO', 'SERVICO') DEFAULT 'PRODUTO',
  `ativo` TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `produtos` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `uuid` VARCHAR(36) NOT NULL UNIQUE,
  `categoria_id` INT UNSIGNED NOT NULL,
  `codigo` VARCHAR(30) NULL,
  `nome` VARCHAR(100) NOT NULL,
  `descricao` VARCHAR(255) NULL,
  `tipo` ENUM('PRODUTO', 'SERVICO') DEFAULT 'PRODUTO',
  `preco_venda` DECIMAL(10,2) NOT NULL,
  `preco_custo` DECIMAL(10,2) DEFAULT 0.00,
  `estoque_atual` INT DEFAULT 0,
  `estoque_minimo` INT DEFAULT 5,
  `ativo` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`categoria_id`) REFERENCES `categorias_produto`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. CONSUMOS E ITENS DE CONSUMO NA HOSPEDAGEM
CREATE TABLE IF NOT EXISTS `consumos` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `uuid` VARCHAR(36) NOT NULL UNIQUE,
  `reserva_id` INT UNSIGNED NOT NULL,
  `quarto_id` INT UNSIGNED NOT NULL,
  `produto_id` INT UNSIGNED NOT NULL,
  `quantidade` SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  `valor_unitario` DECIMAL(10,2) NOT NULL,
  `valor_total` DECIMAL(10,2) NOT NULL,
  `data_lancamento` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `usuario_id` INT UNSIGNED NOT NULL,
  `status_faturamento` ENUM('PENDENTE', 'FATURADO', 'CANCELADO') DEFAULT 'PENDENTE',
  `observacoes` VARCHAR(255) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `sync_status` ENUM('SYNCED', 'PENDING', 'ERROR', 'CONFLICT') DEFAULT 'SYNCED',
  FOREIGN KEY (`reserva_id`) REFERENCES `reservas`(`id`),
  FOREIGN KEY (`quarto_id`) REFERENCES `quartos`(`id`),
  FOREIGN KEY (`produto_id`) REFERENCES `produtos`(`id`),
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. FORMAS DE PAGAMENTO E PAGAMENTOS
CREATE TABLE IF NOT EXISTS `formas_pagamento` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `uuid` VARCHAR(36) NOT NULL UNIQUE,
  `codigo` VARCHAR(30) NOT NULL UNIQUE,
  `nome` VARCHAR(50) NOT NULL,
  `taxa_operadora_percentual` DECIMAL(5,2) DEFAULT 0.00,
  `dias_recebimento` SMALLINT DEFAULT 0,
  `ativo` TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `pagamentos` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `uuid` VARCHAR(36) NOT NULL UNIQUE,
  `reserva_id` INT UNSIGNED NULL,
  `forma_pagamento_id` INT UNSIGNED NOT NULL,
  `tipo` ENUM('SINAL', 'DIARIA', 'CONSUMO', 'CHECKOUT', 'OUTRO') DEFAULT 'CHECKOUT',
  `valor` DECIMAL(10,2) NOT NULL,
  `data_pagamento` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `comprovante_codigo` VARCHAR(80) NULL,
  `usuario_id` INT UNSIGNED NOT NULL,
  `caixa_id` INT UNSIGNED NULL,
  `observacoes` VARCHAR(255) NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `sync_status` ENUM('SYNCED', 'PENDING', 'ERROR', 'CONFLICT') DEFAULT 'SYNCED',
  FOREIGN KEY (`reserva_id`) REFERENCES `reservas`(`id`),
  FOREIGN KEY (`forma_pagamento_id`) REFERENCES `formas_pagamento`(`id`),
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. CAIXA E MOVIMENTAÇÃO DE CAIXA
CREATE TABLE IF NOT EXISTS `caixas` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `uuid` VARCHAR(36) NOT NULL UNIQUE,
  `codigo` VARCHAR(20) NOT NULL UNIQUE,
  `usuario_abertura_id` INT UNSIGNED NOT NULL,
  `usuario_fechamento_id` INT UNSIGNED NULL,
  `data_hora_abertura` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `data_hora_fechamento` DATETIME NULL,
  `saldo_inicial` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `total_entradas` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `total_saidas` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `saldo_esperado` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `saldo_informado` DECIMAL(10,2) NULL,
  `diferenca` DECIMAL(10,2) NULL,
  `resultado_fechamento` ENUM('SOBRA', 'FALTA', 'ZERO', 'ABERTO') DEFAULT 'ABERTO',
  `status` ENUM('ABERTO', 'FECHADO') DEFAULT 'ABERTO',
  `observacoes` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`usuario_abertura_id`) REFERENCES `usuarios`(`id`),
  FOREIGN KEY (`usuario_fechamento_id`) REFERENCES `usuarios`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `movimentos_caixa` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `uuid` VARCHAR(36) NOT NULL UNIQUE,
  `caixa_id` INT UNSIGNED NOT NULL,
  `tipo` ENUM('ENTRADA', 'SAIDA', 'SANGRIA', 'SUPRIMENTO') NOT NULL,
  `categoria` VARCHAR(50) NOT NULL,
  `descricao` VARCHAR(255) NOT NULL,
  `valor` DECIMAL(10,2) NOT NULL,
  `forma_pagamento_id` INT UNSIGNED NULL,
  `pagamento_id` INT UNSIGNED NULL,
  `data_hora` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `usuario_id` INT UNSIGNED NOT NULL,
  FOREIGN KEY (`caixa_id`) REFERENCES `caixas`(`id`),
  FOREIGN KEY (`forma_pagamento_id`) REFERENCES `formas_pagamento`(`id`),
  FOREIGN KEY (`pagamento_id`) REFERENCES `pagamentos`(`id`),
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. CONTAS A RECEBER E CONTAS A PAGAR (FINANCEIRO)
CREATE TABLE IF NOT EXISTS `contas_receber` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `uuid` VARCHAR(36) NOT NULL UNIQUE,
  `reserva_id` INT UNSIGNED NULL,
  `hospede_id` INT UNSIGNED NULL,
  `descricao` VARCHAR(200) NOT NULL,
  `valor_original` DECIMAL(10,2) NOT NULL,
  `valor_recebido` DECIMAL(10,2) DEFAULT 0.00,
  `data_emissao` DATE NOT NULL,
  `data_vencimento` DATE NOT NULL,
  `data_recebimento` DATE NULL,
  `status` ENUM('PENDENTE', 'RECEBIDO', 'CANCELADO', 'ATRASADO') DEFAULT 'PENDENTE',
  `observacoes` TEXT NULL,
  FOREIGN KEY (`reserva_id`) REFERENCES `reservas`(`id`),
  FOREIGN KEY (`hospede_id`) REFERENCES `hospedes`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `contas_pagar` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `uuid` VARCHAR(36) NOT NULL UNIQUE,
  `categoria` VARCHAR(60) NOT NULL,
  `descricao` VARCHAR(200) NOT NULL,
  `fornecedor` VARCHAR(150) NULL,
  `valor_original` DECIMAL(10,2) NOT NULL,
  `valor_pago` DECIMAL(10,2) DEFAULT 0.00,
  `data_emissao` DATE NOT NULL,
  `data_vencimento` DATE NOT NULL,
  `data_pagamento` DATE NULL,
  `status` ENUM('PENDENTE', 'PAGO', 'CANCELADO', 'ATRASADO') DEFAULT 'PENDENTE',
  `observacoes` TEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. RECIBOS EMITIDOS
CREATE TABLE IF NOT EXISTS `recibos` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `uuid` VARCHAR(36) NOT NULL UNIQUE,
  `numero_recibo` VARCHAR(30) NOT NULL UNIQUE,
  `reserva_id` INT UNSIGNED NOT NULL,
  `hospede_id` INT UNSIGNED NOT NULL,
  `quarto_id` INT UNSIGNED NOT NULL,
  `valor_subtotal` DECIMAL(10,2) NOT NULL,
  `valor_desconto` DECIMAL(10,2) DEFAULT 0.00,
  `valor_taxas` DECIMAL(10,2) DEFAULT 0.00,
  `valor_total` DECIMAL(10,2) NOT NULL,
  `codigo_validacao` VARCHAR(32) NOT NULL,
  `data_emissao` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `usuario_emissor_id` INT UNSIGNED NOT NULL,
  `corpo_json` JSON NOT NULL,
  FOREIGN KEY (`reserva_id`) REFERENCES `reservas`(`id`),
  FOREIGN KEY (`hospede_id`) REFERENCES `hospedes`(`id`),
  FOREIGN KEY (`quarto_id`) REFERENCES `quartos`(`id`),
  FOREIGN KEY (`usuario_emissor_id`) REFERENCES `usuarios`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. LIMPEZA E GOVERNANÇA
CREATE TABLE IF NOT EXISTS `limpeza_quartos` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `uuid` VARCHAR(36) NOT NULL UNIQUE,
  `quarto_id` INT UNSIGNED NOT NULL,
  `tipo_limpeza` ENUM('CHECKOUT', 'DIARIA', 'GERAL', 'RETROQUE') DEFAULT 'CHECKOUT',
  `status` ENUM('SUJO', 'EM_LIMPEZA', 'INSPEÇÃO', 'LIBERADO') DEFAULT 'SUJO',
  `responsavel_id` INT UNSIGNED NULL,
  `data_hora_solicitacao` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `data_hora_inicio` DATETIME NULL,
  `data_hora_conclusao` DATETIME NULL,
  `produtos_utilizados` TEXT NULL,
  `observacoes` TEXT NULL,
  FOREIGN KEY (`quarto_id`) REFERENCES `quartos`(`id`),
  FOREIGN KEY (`responsavel_id`) REFERENCES `usuarios`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. MANUTENÇÃO PREVENTIVA E CORRETIVA
CREATE TABLE IF NOT EXISTS `manutencoes` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `uuid` VARCHAR(36) NOT NULL UNIQUE,
  `codigo_chamado` VARCHAR(20) NOT NULL UNIQUE,
  `quarto_id` INT UNSIGNED NULL,
  `equipamento` VARCHAR(100) NOT NULL,
  `descricao_problema` TEXT NOT NULL,
  `prioridade` ENUM('BAIXA', 'MEDIA', 'ALTA', 'URGENTE') DEFAULT 'MEDIA',
  `status` ENUM('ABERTO', 'EM_ANDAMENTO', 'AGUARDANDO', 'RESOLVIDO', 'CANCELADO') DEFAULT 'ABERTO',
  `responsavel_id` INT UNSIGNED NULL,
  `data_abertura` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `data_conclusao` DATETIME NULL,
  `solucao` TEXT NULL,
  `custo_reparo` DECIMAL(10,2) DEFAULT 0.00,
  FOREIGN KEY (`quarto_id`) REFERENCES `quartos`(`id`),
  FOREIGN KEY (`responsavel_id`) REFERENCES `usuarios`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 17. AUDITORIA E LOGS DO SISTEMA (IMUTÁVEIS)
CREATE TABLE IF NOT EXISTS `auditoria` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `uuid` VARCHAR(36) NOT NULL UNIQUE,
  `usuario_id` INT UNSIGNED NULL,
  `usuario_nome` VARCHAR(100) NOT NULL,
  `modulo` VARCHAR(50) NOT NULL,
  `acao` VARCHAR(50) NOT NULL,
  `tabela_afetada` VARCHAR(50) NOT NULL,
  `registro_id` VARCHAR(50) NOT NULL,
  `valor_anterior` JSON NULL,
  `valor_novo` JSON NULL,
  `device_id` VARCHAR(50) DEFAULT 'CLIENT_BROWSER',
  `ip_address` VARCHAR(45) NULL,
  `data_hora` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 18. CONTROLE DE SINCRONIZAÇÃO E BACKUP
CREATE TABLE IF NOT EXISTS `sync_fila` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `uuid` VARCHAR(36) NOT NULL UNIQUE,
  `device_id` VARCHAR(50) NOT NULL,
  `entidade` VARCHAR(50) NOT NULL,
  `acao` ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
  `dados_payload` JSON NOT NULL,
  `status` ENUM('PENDING', 'PROCESSING', 'SYNCED', 'CONFLICT', 'ERROR') DEFAULT 'PENDING',
  `tentativas` SMALLINT DEFAULT 0,
  `mensagem_erro` TEXT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `synced_at` DATETIME NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `backups` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `uuid` VARCHAR(36) NOT NULL UNIQUE,
  `nome_arquivo` VARCHAR(150) NOT NULL,
  `tamanho_bytes` BIGINT UNSIGNED NOT NULL,
  `checksum_sha256` VARCHAR(64) NOT NULL,
  `versao_sistema` VARCHAR(20) NOT NULL,
  `total_registros` INT UNSIGNED NOT NULL,
  `tipo` ENUM('MANUAL', 'AUTOMATICO', 'PRE_IMPORTACAO', 'EXPORTACAO') DEFAULT 'MANUAL',
  `status` ENUM('SUCESSO', 'FALHA') DEFAULT 'SUCESSO',
  `usuario_id` INT UNSIGNED NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
