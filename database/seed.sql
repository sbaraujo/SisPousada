-- =====================================================================
-- POUSADA PMS — DADOS INICIAIS DE DEMONSTRAÇÃO (SEED)
-- CONTÉM 20 QUARTOS, CATEGORIAS, USUÁRIOS, PRODUTOS, HÓSPEDES, RESERVAS
-- =====================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. POUSADA DEMONSTRATIVA
INSERT INTO `pousadas` (
  `id`, `uuid`, `nome_fantasia`, `razao_social`, `cnpj_nif`, `email`, `telefone`, `whatsapp`,
  `endereco`, `numero`, `bairro`, `cidade`, `estado`, `cep`, `pais`, `moeda`, `simbolo_moeda`,
  `checkin_padrao`, `checkout_padrao`, `imposto_percentual`, `taxa_servico_percentual`, `num_recibo_atual`
) VALUES (
  1, 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  'Pousada Bella Vista & Spa', 'Bella Vista Empreendimentos Hoteleiros Ltda', '12.345.678/0001-90',
  'contato@pousadabellavista.com.br', '+55 (12) 3896-1234', '+55 (12) 99876-5432',
  'Av. Beira Mar', '1500', 'Praia do Curral', 'Ilhabela', 'SP', '11630-000', 'Brasil',
  'BRL', 'R$', '14:00:00', '12:00:00', 5.00, 10.00, 1042
) ON DUPLICATE KEY UPDATE `nome_fantasia` = VALUES(`nome_fantasia`);

-- 2. PERFIS
INSERT INTO `perfis` (`id`, `uuid`, `codigo`, `nome`, `descricao`) VALUES
(1, 'uuid-perfil-admin', 'ADMIN', 'Administrador', 'Acesso irrestrito a todos os módulos e configurações'),
(2, 'uuid-perfil-gerente', 'GERENTE', 'Gerente Geral', 'Acesso gerencial, relatórios, financeiro e operações'),
(3, 'uuid-perfil-recepcao', 'RECEPCAO', 'Recepção', 'Reservas, check-in, check-out, hóspedes, consumo e pagamentos'),
(4, 'uuid-perfil-caixa', 'CAIXA', 'Operador de Caixa', 'Abertura, fechamento e lançamentos financeiros de caixa'),
(5, 'uuid-perfil-limpeza', 'LIMPEZA', 'Governança & Limpeza', 'Controle do status de limpeza dos quartos e insumos'),
(6, 'uuid-perfil-manutencao', 'MANUTENCAO', 'Manutenção', 'Abertura e baixa de ordens de serviço de manutenção'),
(7, 'uuid-perfil-consulta', 'CONSULTA', 'Somente Consulta', 'Visualização de calendário e disponibilidade')
ON DUPLICATE KEY UPDATE `nome` = VALUES(`nome`);

-- 3. USUÁRIOS (Senha padrão hash bcrypt para '123456')
INSERT INTO `usuarios` (`id`, `uuid`, `nome`, `email`, `senha_hash`, `cargo`, `perfil_id`, `ativo`) VALUES
(1, 'uuid-user-admin', 'Mariana Rocha (Administradora)', 'admin@pousadabellavista.com', '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890', 'Administradora Geral', 1, 1),
(2, 'uuid-user-gerente', 'Carlos Eduardo Mendes', 'carlos.mendes@pousadabellavista.com', '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890', 'Gerente Operacional', 2, 1),
(3, 'uuid-user-recepcao', 'Fernanda Lima', 'fernanda.recepcao@pousadabellavista.com', '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890', 'Recepcionista Sênior', 3, 1),
(4, 'uuid-user-limpeza', 'Maria das Graças', 'graca.limpeza@pousadabellavista.com', '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890', 'Camareira Líder', 5, 1),
(5, 'uuid-user-manut', 'Roberto Silva', 'roberto.manut@pousadabellavista.com', '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890', 'Técnico de Manutenção', 6, 1)
ON DUPLICATE KEY UPDATE `nome` = VALUES(`nome`);

-- 4. CATEGORIAS DE QUARTOS
INSERT INTO `categorias_quarto` (`id`, `uuid`, `nome`, `descricao`, `capacidade_padrao`, `capacidade_maxima`, `tarifa_base`, `cor_hex`) VALUES
(1, 'cat-std-01', 'Standard Jardim', 'Quarto aconchegante com vista para o jardim interno, ar condicionado split e frigobar.', 2, 2, 280.00, '#0284c7'),
(2, 'cat-sup-02', 'Superior Varanda', 'Quarto espaçoso no andar superior com rede na varanda e vista panorâmica.', 2, 3, 380.00, '#059669'),
(3, 'cat-lux-03', 'Suíte Luxo com Banheira', 'Suíte master com banheira de hidromassagem, cama king size e cafeteira Nespresso.', 2, 2, 520.00, '#7c3aed'),
(4, 'cat-cha-04', 'Chalé Família', 'Chalé independente de 2 ambientes para casais com crianças, mini copa integrada.', 4, 5, 650.00, '#d97706')
ON DUPLICATE KEY UPDATE `nome` = VALUES(`nome`);

-- 5. QUARTOS (20 QUARTOS INICIAIS: Q01 A Q20)
INSERT INTO `quartos` (`id`, `uuid`, `numero`, `nome`, `categoria_id`, `andar`, `capacidade_adultos`, `capacidade_criancas`, `tipo_cama`, `area_m2`, `equipamentos`, `status`, `ativo`, `observacoes`) VALUES
(1, 'qto-01', 'Q01', 'Quarto Ipê Amarelo', 1, 'Térreo', 2, 0, '1 Casal Queen', 20.0, 'Ar Condicionado, Smart TV 43, Frigobar, Ducha a gás, Wi-Fi 500Mbps', 'OCUPADO', 1, 'Próximo à piscina'),
(2, 'qto-02', 'Q02', 'Quarto Jacarandá', 1, 'Térreo', 2, 1, '1 Casal Queen + 1 Solteiro', 22.0, 'Ar Condicionado, Smart TV 43, Frigobar, Wi-Fi', 'LIVRE', 1, 'Vista jardim lateral'),
(3, 'qto-03', 'Q03', 'Quarto Bromélia', 1, 'Térreo', 2, 0, '1 Casal Queen', 20.0, 'Ar Condicionado, Smart TV 43, Frigobar, Cofre', 'LIMPEZA', 1, 'Aguardando higienização do check-out'),
(4, 'qto-04', 'Q04', 'Quarto Orquídea', 1, 'Térreo', 2, 0, '2 Camas Solteiro', 20.0, 'Ar Condicionado, Smart TV 43, Frigobar, Wi-Fi', 'LIVRE', 1, 'Configurado solteiro reversível'),
(5, 'qto-05', 'Q05', 'Quarto Hibisco', 1, 'Térreo', 2, 0, '1 Casal Queen', 21.0, 'Ar Condicionado, Smart TV 43, Frigobar', 'RESERVADO', 1, 'Check-in previsto para hoje às 15h'),
(6, 'qto-06', 'Q06', 'Varanda Beija-Flor', 2, '1º Andar', 2, 1, '1 Casal King + Sofá-Cama', 26.0, 'Ar Split Inverter, Smart TV 50, Varanda com Rede, Frigobar', 'OCUPADO', 1, 'Hóspedes em lua de mel'),
(7, 'qto-07', 'Q07', 'Varanda Tucano', 2, '1º Andar', 2, 1, '1 Casal King', 25.0, 'Ar Split Inverter, Smart TV 50, Varanda Privativa, Frigobar', 'LIVRE', 1, 'Excelente vista do pôr do sol'),
(8, 'qto-08', 'Q08', 'Varanda Sabiá', 2, '1º Andar', 2, 1, '1 Casal King', 25.0, 'Ar Split Inverter, Smart TV 50, Varanda Privativa', 'OCUPADO', 1, 'Estadia de 4 noites'),
(9, 'qto-09', 'Q09', 'Varanda Maritaca', 2, '1º Andar', 2, 1, '1 Casal Queen + 1 Solteiro', 26.0, 'Ar Split Inverter, TV 50, Varanda', 'LIVRE', 1, 'Liberado pela governança'),
(10, 'qto-10', 'Q10', 'Varanda Canário', 2, '1º Andar', 2, 0, '1 Casal Queen', 24.0, 'Ar Split Inverter, Smart TV 43, Varanda', 'MANUTENÇÃO', 1, 'Troca do registro do chuveiro em andamento'),
(11, 'qto-11', 'Q11', 'Suíte Imperial', 3, '2º Andar', 2, 0, '1 Casal Super King', 34.0, 'Hidromassagem Dupla, Cama King, Nespresso, Smart TV 55, Varanda Panorâmica', 'OCUPADO', 1, 'Pacote Romântico com espumante'),
(12, 'qto-12', 'Q12', 'Suíte Real das Águas', 3, '2º Andar', 2, 0, '1 Casal Super King', 35.0, 'Hidromassagem Dupla com Cromoterapia, Roupões, Ar Dual Inverter, Adega', 'LIVRE', 1, 'Quarto modelo fotográfico'),
(13, 'qto-13', 'Q13', 'Suíte Pérola do Mar', 3, '2º Andar', 2, 0, '1 Casal King', 32.0, 'Hidromassagem, Smart TV 55, Som Bluetooth, Varanda', 'RESERVADO', 1, 'Entrada amanhã'),
(14, 'qto-14', 'Q14', 'Suíte Safira', 3, '2º Andar', 2, 0, '1 Casal King', 32.0, 'Hidromassagem, Ar Split, Frigobar Retrô', 'LIVRE', 1, 'Pronto para venda imediata'),
(15, 'qto-15', 'Q15', 'Chalé das Palmeiras', 4, 'Área Externa', 4, 1, '1 Casal Queen + 2 Solteiros', 42.0, 'Churrasqueira portátil privativa, Cozinha compacta, 2 Ar condicionados, TV 50', 'OCUPADO', 1, 'Família Silveira (2 adultos, 2 crianças)'),
(16, 'qto-16', 'Q16', 'Chalé dos Coqueiros', 4, 'Área Externa', 4, 1, '1 Casal Queen + 2 Solteiros', 42.0, 'Mini copa, 2 Ambientes, Ar Split, Estacionamento em frente', 'LIVRE', 1, 'Ideal para pet-friendly'),
(17, 'qto-17', 'Q17', 'Chalé Recanto das Aves', 4, 'Área Externa', 4, 2, '1 Casal King + 1 Beliche', 45.0, 'Sala de estar integrada, Varanda ampla com 2 redes, Ar Split', 'LIVRE', 1, 'Gramado privativo'),
(18, 'qto-18', 'Q18', 'Chalé Vista Verde', 4, 'Área Externa', 4, 1, '1 Casal Queen + 2 Solteiros', 40.0, 'Vista bosque nativo, Silencioso, Ar Split', 'LIMPEZA', 1, 'Troca completa de enxoval'),
(19, 'qto-19', 'Q19', 'Quarto Térreo Acessível', 1, 'Térreo', 2, 0, '2 Camas Solteiro ou 1 Casal', 24.0, 'Banheiro 100% Adaptado PCD, Barras de apoio, Rampa de acesso', 'LIVRE', 1, 'Norma ABNT NBR 9050'),
(20, 'qto-20', 'Q20', 'Quarto Mirante', 2, '2º Andar', 2, 0, '1 Casal Queen', 22.0, 'Solarium exclusivo na cobertura com espreguiçadeiras', 'BLOQUEADO', 1, 'Bloqueado para renovação da pintura externa')
ON DUPLICATE KEY UPDATE `numero` = VALUES(`numero`);

-- 6. HÓSPEDES DE DEMONSTRAÇÃO
INSERT INTO `hospedes` (`id`, `uuid`, `nome_completo`, `tipo_documento`, `documento`, `data_nascimento`, `nacionalidade`, `telefone`, `whatsapp`, `email`, `cidade`, `estado`, `preferencias`, `total_hospedagens`) VALUES
(1, 'hosp-001', 'Guilherme Siqueira Castro', 'CPF', '289.412.988-15', '1985-04-12', 'Brasileira', '(11) 98452-1100', '(11) 98452-1100', 'guilherme.castro@techcorp.com.br', 'São Paulo', 'SP', 'Travesseiro de pluma extra, andar alto e silencioso', 3),
(2, 'hosp-002', 'Beatriz Nogueira Duarte', 'CPF', '341.879.620-44', '1991-08-25', 'Brasileira', '(21) 99123-4567', '(21) 99123-4567', 'beatriz.duarte@designstudio.art', 'Rio de Janeiro', 'RJ', 'Cama King, sem cheiro forte de aromatizador', 1),
(3, 'hosp-003', 'Rodrigo Fagundes Alencar', 'CPF', '154.982.340-92', '1979-11-03', 'Brasileira', '(31) 98765-4321', '(31) 98765-4321', 'rodrigo.fagundes@alencaradv.com', 'Belo Horizonte', 'MG', 'Café da manhã sem glúten, prefere check-in rápido', 4),
(4, 'hosp-004', 'Camila Antunes Silveira', 'CPF', '412.339.810-77', '1988-02-14', 'Brasileira', '(19) 99344-8822', '(19) 99344-8822', 'camila.silveira@agro.com.br', 'Campinas', 'SP', 'Berço portátil para bebê de 1 ano', 2),
(5, 'hosp-005', 'Juliana Ramos de Toledo', 'CPF', '118.490.228-30', '1994-06-30', 'Brasileira', '(41) 98822-1920', '(41) 98822-1920', 'juliana.toledo@biomed.ufpr.br', 'Curitiba', 'PR', 'Check-out tardio se houver disponibilidade', 1)
ON DUPLICATE KEY UPDATE `nome_completo` = VALUES(`nome_completo`);

-- 7. CATEGORIAS DE PRODUTOS E PRODUTOS DO CATÁLOGO
INSERT INTO `categorias_produto` (`id`, `uuid`, `nome`, `tipo`, `ativo`) VALUES
(1, 'catp-01', 'Frigobar & Bebidas', 'PRODUTO', 1),
(2, 'catp-02', 'Cafeteria & Lanches', 'PRODUTO', 1),
(3, 'catp-03', 'Adega & Vinhos', 'PRODUTO', 1),
(4, 'catp-04', 'Lavanderia & Têxtil', 'SERVICO', 1),
(5, 'catp-05', 'Lazer & Experiências', 'SERVICO', 1)
ON DUPLICATE KEY UPDATE `nome` = VALUES(`nome`);

INSERT INTO `produtos` (`id`, `uuid`, `categoria_id`, `codigo`, `nome`, `descricao`, `tipo`, `preco_venda`, `preco_custo`, `estoque_atual`, `estoque_minimo`) VALUES
(1, 'prod-01', 1, 'BEB001', 'Água Mineral sem Gás 500ml', 'Água mineral da fonte natural garrafa pet', 'PRODUTO', 7.00, 1.80, 120, 30),
(2, 'prod-02', 1, 'BEB002', 'Água Mineral com Gás 500ml', 'Água mineral gaseificada', 'PRODUTO', 7.50, 2.00, 80, 20),
(3, 'prod-03', 1, 'BEB003', 'Refrigerante Lata 350ml', 'Coca-Cola tradicional ou Zero', 'PRODUTO', 9.00, 3.20, 95, 25),
(4, 'prod-04', 1, 'BEB004', 'Cerveja Artesanal IPA 500ml', 'Cerveja artesanal local premiada de Ilhabela', 'PRODUTO', 26.00, 12.00, 48, 12),
(5, 'prod-05', 1, 'BEB005', 'Água de Coco Integral 330ml', 'Água de coco natural gelada', 'PRODUTO', 12.00, 4.50, 40, 15),
(6, 'prod-06', 2, 'CAF001', 'Porção de Pão de Queijo Mineiro (6 un)', 'Pão de queijo quentinho com queijo Canastra', 'PRODUTO', 22.00, 6.00, 50, 10),
(7, 'prod-07', 2, 'CAF002', 'Cesta de Café da Manhã no Quarto', 'Serviço especial de café servido na varanda do quarto', 'SERVICO', 65.00, 25.00, 999, 0),
(8, 'prod-08', 3, 'VIN001', 'Espumante Brut Casa Valduga 750ml', 'Espumante nacional método champenoise', 'PRODUTO', 145.00, 65.00, 18, 6),
(9, 'prod-09', 4, 'LAV001', 'Lavagem e Passadoria de Peça', 'Serviço de lavanderia expressa para hóspedes', 'SERVICO', 18.00, 4.00, 999, 0),
(10, 'prod-10', 5, 'EXP001', 'Passeio de Escuna para Praia do Bonete', 'Passeio náutico guiado com parada para banho', 'SERVICO', 190.00, 130.00, 999, 0)
ON DUPLICATE KEY UPDATE `nome` = VALUES(`nome`);

-- 8. FORMAS DE PAGAMENTO
INSERT INTO `formas_pagamento` (`id`, `uuid`, `codigo`, `nome`, `taxa_operadora_percentual`, `dias_recebimento`) VALUES
(1, 'fp-pix', 'PIX', 'PIX Instantâneo', 0.00, 0),
(2, 'fp-cc', 'CARTAO_CREDITO', 'Cartão de Crédito (Visa/Master/Elo)', 2.80, 30),
(3, 'fp-cd', 'CARTAO_DEBITO', 'Cartão de Débito', 1.20, 1),
(4, 'fp-din', 'DINHEIRO', 'Dinheiro Espécie', 0.00, 0),
(5, 'fp-ted', 'TRANSFERENCIA', 'Transferência Bancária / TED', 0.00, 0)
ON DUPLICATE KEY UPDATE `nome` = VALUES(`nome`);

-- 9. RESERVAS ATUAIS E HISTÓRICAS
INSERT INTO `reservas` (
  `id`, `uuid`, `codigo_reserva`, `hospede_id`, `quarto_id`, `data_checkin`, `data_checkout`,
  `adultos`, `criancas`, `valor_diaria`, `total_diarias`, `valor_desconto`, `valor_taxas`,
  `valor_total`, `valor_sinal_pago`, `saldo_restante`, `origem`, `status`, `observacoes`
) VALUES
(1, 'res-001', 'RES-2026-001', 1, 1, '2026-09-27', '2026-09-30', 2, 0, 280.00, 840.00, 0.00, 42.00, 882.00, 441.00, 441.00, 'DIRETA', 'HOSPEDADO', 'Hóspede fez check-in ontem. Já consumiu frigobar.'),
(2, 'res-002', 'RES-2026-002', 2, 6, '2026-09-26', '2026-09-29', 2, 0, 380.00, 1140.00, 50.00, 57.00, 1147.00, 1147.00, 'BOOKING', 'HOSPEDADO', 'Reserva 100% paga antecipada. Casal em lua de mel.'),
(3, 'res-003', 'RES-2026-003', 3, 11, '2026-09-27', '2026-10-01', 2, 0, 520.00, 2080.00, 100.00, 104.00, 2084.00, 1000.00, 1084.00, 'WHATSAPP', 'HOSPEDADO', 'Solicitou garrafa de espumante e roupões de banho.'),
(4, 'res-004', 'RES-2026-004', 4, 15, '2026-09-28', '2026-10-02', 2, 2, 650.00, 2600.00, 0.00, 130.00, 2730.00, 800.00, 1930.00, 'DIRETA', 'CONFIRMADA', 'Família chega hoje à tarde após as 15h. Quarto preparado.'),
(5, 'res-005', 'RES-2026-005', 5, 8, '2026-09-25', '2026-09-28', 1, 0, 380.00, 1140.00, 0.00, 57.00, 1197.00, 500.00, 697.00, 'AIRBNB', 'HOSPEDADO', 'Check-out programado para hoje até as 12h.')
ON DUPLICATE KEY UPDATE `codigo_reserva` = VALUES(`codigo_reserva`);

-- 10. CONSUMOS LANÇADOS NAS HOSPEDAGENS ATIVAS
INSERT INTO `consumos` (`id`, `uuid`, `reserva_id`, `quarto_id`, `produto_id`, `quantidade`, `valor_unitario`, `valor_total`, `usuario_id`, `status_faturamento`) VALUES
(1, 'con-01', 1, 1, 1, 2, 7.00, 14.00, 3, 'PENDENTE'),
(2, 'con-02', 1, 1, 4, 2, 26.00, 52.00, 3, 'PENDENTE'),
(3, 'con-03', 2, 6, 8, 1, 145.00, 145.00, 3, 'PENDENTE'),
(4, 'con-04', 3, 11, 8, 1, 145.00, 145.00, 3, 'PENDENTE'),
(5, 'con-05', 3, 11, 6, 2, 22.00, 44.00, 3, 'PENDENTE')
ON DUPLICATE KEY UPDATE `valor_total` = VALUES(`valor_total`);

-- 11. CAIXA DO DIA E MOVIMENTOS
INSERT INTO `caixas` (
  `id`, `uuid`, `codigo`, `usuario_abertura_id`, `data_hora_abertura`, `saldo_inicial`,
  `total_entradas`, `total_saidas`, `saldo_esperado`, `status`
) VALUES (
  1, 'cx-2026-09-28', 'CX-20260928-01', 3, '2026-09-28 07:30:00', 350.00, 1241.00, 65.00, 1526.00, 'ABERTO'
) ON DUPLICATE KEY UPDATE `codigo` = VALUES(`codigo`);

INSERT INTO `movimentos_caixa` (`id`, `uuid`, `caixa_id`, `tipo`, `categoria`, `descricao`, `valor`, `forma_pagamento_id`, `usuario_id`) VALUES
(1, 'mov-01', 1, 'ENTRADA', 'PAGAMENTO_SINAL', 'Recebimento de sinal Reserva RES-2026-004 via PIX', 800.00, 1, 3),
(2, 'mov-02', 1, 'ENTRADA', 'PAGAMENTO_DIARIA', 'Recebimento de diária em dinheiro', 441.00, 4, 3),
(3, 'mov-03', 1, 'SAIDA', 'DESPESA_OPERACIONAL', 'Compra de frutas frescas para reposição café da manhã', 65.00, 4, 3)
ON DUPLICATE KEY UPDATE `descricao` = VALUES(`descricao`);

-- 12. CHAMADOS DE MANUTENÇÃO
INSERT INTO `manutencoes` (`id`, `uuid`, `codigo_chamado`, `quarto_id`, `equipamento`, `descricao_problema`, `prioridade`, `status`, `responsavel_id`, `custo_reparo`) VALUES
(1, 'man-01', 'MNT-2026-01', 10, 'Chuveiro Elétrico', 'Pressão baixa na água quente e gotejamento no registro misturador.', 'ALTA', 'EM_ANDAMENTO', 5, 85.00),
(2, 'man-02', 'MNT-2026-02', 20, 'Varanda e Guarda-Corpo', 'Tratamento do verniz náutico nas madeiras do solarium.', 'MEDIA', 'ABERTO', 5, 220.00)
ON DUPLICATE KEY UPDATE `codigo_chamado` = VALUES(`codigo_chamado`);

-- 13. AUDITORIA INICIAL
INSERT INTO `auditoria` (`id`, `uuid`, `usuario_id`, `usuario_nome`, `modulo`, `acao`, `tabela_afetada`, `registro_id`, `valor_anterior`, `valor_novo`, `device_id`) VALUES
(1, 'aud-01', 1, 'Mariana Rocha (Administradora)', 'SISTEMA', 'INICIALIZACAO', 'pousadas', '1', NULL, '{"status": "Configuração inicial de 20 quartos carregada com sucesso"}', 'SERVER_SEED');

SET FOREIGN_KEY_CHECKS = 1;
