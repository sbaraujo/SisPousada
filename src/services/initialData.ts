import {
  PousadaConfig,
  CategoriaQuarto,
  Quarto,
  Hospede,
  Reserva,
  Produto,
  FormaPagamento,
  Consumo,
  Caixa,
  MovimentoCaixa,
  ContaFinanceira,
  LimpezaQuarto,
  Manutencao,
  AuditoriaLog,
  Usuario
} from '../types';

export const INITIAL_POUSADA_CONFIG: PousadaConfig = {
  uuid: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
  nome_fantasia: 'Pousada Bella Vista & Spa',
  razao_social: 'Bella Vista Empreendimentos Hoteleiros Ltda',
  cnpj_nif: '12.345.678/0001-90',
  inscricao_estadual: '450.123.456.789',
  email: 'contato@pousadabellavista.com.br',
  telefone: '+55 (12) 3896-1234',
  whatsapp: '+55 (12) 99876-5432',
  website: 'https://pousadabellavista.com.br',
  endereco: 'Av. Beira Mar',
  numero: '1500',
  bairro: 'Praia do Curral',
  cidade: 'Ilhabela',
  estado: 'SP',
  cep: '11630-000',
  pais: 'Brasil',
  moeda: 'BRL',
  simbolo_moeda: 'R$',
  idioma: 'pt-BR',
  fuso_horario: 'America/Sao_Paulo',
  checkin_padrao: '14:00',
  checkout_padrao: '12:00',
  imposto_percentual: 5.0,
  taxa_servico_percentual: 10.0,
  num_recibo_atual: 1042,
};

export const INITIAL_USUARIOS: Usuario[] = [
  { id: 1, uuid: 'user-01', nome: 'Mariana Rocha', email: 'admin@pousadabellavista.com', cargo: 'Administradora Geral', perfil_id: 1, perfil_codigo: 'ADMIN', ativo: true },
  { id: 2, uuid: 'user-02', nome: 'Carlos Eduardo Mendes', email: 'carlos.mendes@pousadabellavista.com', cargo: 'Gerente Operacional', perfil_id: 2, perfil_codigo: 'GERENTE', ativo: true },
  { id: 3, uuid: 'user-03', nome: 'Fernanda Lima', email: 'fernanda.recepcao@pousadabellavista.com', cargo: 'Recepcionista Sênior', perfil_id: 3, perfil_codigo: 'RECEPCAO', ativo: true },
  { id: 4, uuid: 'user-04', nome: 'Maria das Graças', email: 'graca.limpeza@pousadabellavista.com', cargo: 'Camareira Líder', perfil_id: 5, perfil_codigo: 'LIMPEZA', ativo: true },
  { id: 5, uuid: 'user-05', nome: 'Roberto Silva', email: 'roberto.manut@pousadabellavista.com', cargo: 'Técnico de Manutenção', perfil_id: 6, perfil_codigo: 'MANUTENCAO', ativo: true },
];

export const INITIAL_CATEGORIAS: CategoriaQuarto[] = [
  { id: 1, uuid: 'cat-01', nome: 'Standard Jardim', descricao: 'Aconchegante no piso térreo com vista ao jardim interno e ar split.', capacidade_padrao: 2, capacidade_maxima: 2, tarifa_base: 280, cor_hex: '#0284c7', ativo: true },
  { id: 2, uuid: 'cat-02', nome: 'Superior Varanda', descricao: 'No 1º andar com ampla varanda privativa, rede de descanso e vista panorâmica.', capacidade_padrao: 2, capacidade_maxima: 3, tarifa_base: 380, cor_hex: '#059669', ativo: true },
  { id: 3, uuid: 'cat-03', nome: 'Suíte Luxo com Hidro', descricao: 'No 2º andar com hidromassagem dupla com vista, cama super king e máquina de café.', capacidade_padrao: 2, capacidade_maxima: 2, tarifa_base: 520, cor_hex: '#7c3aed', ativo: true },
  { id: 4, uuid: 'cat-04', nome: 'Chalé Família', descricao: 'Chalé isolado em 2 ambientes, sala de estar e mini copa para casais com filhos.', capacidade_padrao: 4, capacidade_maxima: 5, tarifa_base: 650, cor_hex: '#d97706', ativo: true },
];

export const INITIAL_QUARTOS: Quarto[] = [
  { id: 1, uuid: 'qto-01', numero: 'Q01', nome: 'Ipê Amarelo', categoria_id: 1, andar: 'Térreo', capacidade_adultos: 2, capacidade_criancas: 0, tipo_cama: '1 Cama Casal Queen', area_m2: 20, equipamentos: 'Ar Split, Smart TV 43, Frigobar, Wi-Fi 500Mbps', status: 'OCUPADO', ativo: true, observacoes: 'Próximo à piscina' },
  { id: 2, uuid: 'qto-02', numero: 'Q02', nome: 'Jacarandá', categoria_id: 1, andar: 'Térreo', capacidade_adultos: 2, capacidade_criancas: 1, tipo_cama: '1 Casal Queen + 1 Solteiro', area_m2: 22, equipamentos: 'Ar Split, Smart TV 43, Frigobar, Wi-Fi', status: 'LIVRE', ativo: true, observacoes: 'Vista jardim lateral' },
  { id: 3, uuid: 'qto-03', numero: 'Q03', nome: 'Bromélia', categoria_id: 1, andar: 'Térreo', capacidade_adultos: 2, capacidade_criancas: 0, tipo_cama: '1 Cama Casal Queen', area_m2: 20, equipamentos: 'Ar Split, Smart TV 43, Frigobar, Cofre', status: 'LIMPEZA', ativo: true, observacoes: 'Check-out recente' },
  { id: 4, uuid: 'qto-04', numero: 'Q04', nome: 'Orquídea', categoria_id: 1, andar: 'Térreo', capacidade_adultos: 2, capacidade_criancas: 0, tipo_cama: '2 Camas Solteiro', area_m2: 20, equipamentos: 'Ar Split, Smart TV 43, Frigobar', status: 'LIVRE', ativo: true, observacoes: 'Configuração solteiro' },
  { id: 5, uuid: 'qto-05', numero: 'Q05', nome: 'Hibisco', categoria_id: 1, andar: 'Térreo', capacidade_adultos: 2, capacidade_criancas: 0, tipo_cama: '1 Cama Casal Queen', area_m2: 21, equipamentos: 'Ar Split, Smart TV 43, Frigobar', status: 'RESERVADO', ativo: true, observacoes: 'Chegada hoje às 15h' },
  { id: 6, uuid: 'qto-06', numero: 'Q06', nome: 'Varanda Beija-Flor', categoria_id: 2, andar: '1º Andar', capacidade_adultos: 2, capacidade_criancas: 1, tipo_cama: '1 Casal King + Sofá', area_m2: 26, equipamentos: 'Ar Split Inverter, Smart TV 50, Varanda com Rede, Frigobar', status: 'OCUPADO', ativo: true, observacoes: 'Hóspedes em lua de mel' },
  { id: 7, uuid: 'qto-07', numero: 'Q07', nome: 'Varanda Tucano', categoria_id: 2, andar: '1º Andar', capacidade_adultos: 2, capacidade_criancas: 1, tipo_cama: '1 Casal King', area_m2: 25, equipamentos: 'Ar Split Inverter, TV 50, Varanda Privativa', status: 'LIVRE', ativo: true, observacoes: 'Pôr do sol panorâmico' },
  { id: 8, uuid: 'qto-08', numero: 'Q08', nome: 'Varanda Sabiá', categoria_id: 2, andar: '1º Andar', capacidade_adultos: 2, capacidade_criancas: 1, tipo_cama: '1 Casal King', area_m2: 25, equipamentos: 'Ar Split, TV 50, Varanda', status: 'OCUPADO', ativo: true, observacoes: 'Check-out hoje às 12h' },
  { id: 9, uuid: 'qto-09', numero: 'Q09', nome: 'Varanda Maritaca', categoria_id: 2, andar: '1º Andar', capacidade_adultos: 2, capacidade_criancas: 1, tipo_cama: '1 Casal Queen + 1 Solteiro', area_m2: 26, equipamentos: 'Ar Split, TV 50, Varanda', status: 'LIVRE', ativo: true, observacoes: 'Inspecionado pela governança' },
  { id: 10, uuid: 'qto-10', numero: 'Q10', nome: 'Varanda Canário', categoria_id: 2, andar: '1º Andar', capacidade_adultos: 2, capacidade_criancas: 0, tipo_cama: '1 Casal Queen', area_m2: 24, equipamentos: 'Ar Split, Smart TV 43, Varanda', status: 'MANUTENÇÃO', ativo: true, observacoes: 'Troca de registro hidráulico' },
  { id: 11, uuid: 'qto-11', numero: 'Q11', nome: 'Suíte Imperial', categoria_id: 3, andar: '2º Andar', capacidade_adultos: 2, capacidade_criancas: 0, tipo_cama: '1 Casal Super King', area_m2: 34, equipamentos: 'Hidro Dupla, Super King, Nespresso, TV 55, Varanda Panorâmica', status: 'OCUPADO', ativo: true, observacoes: 'Pacote romântico com espumante' },
  { id: 12, uuid: 'qto-12', numero: 'Q12', nome: 'Suíte Real das Águas', categoria_id: 3, andar: '2º Andar', capacidade_adultos: 2, capacidade_criancas: 0, tipo_cama: '1 Casal Super King', area_m2: 35, equipamentos: 'Hidro Dupla Cromoterapia, Roupões, Adega', status: 'LIVRE', ativo: true, observacoes: 'Pronto para entrada' },
  { id: 13, uuid: 'qto-13', numero: 'Q13', nome: 'Suíte Pérola do Mar', categoria_id: 3, andar: '2º Andar', capacidade_adultos: 2, capacidade_criancas: 0, tipo_cama: '1 Casal King', area_m2: 32, equipamentos: 'Hidro, Smart TV 55, Som Bluetooth, Varanda', status: 'RESERVADO', ativo: true, observacoes: 'Entrada amanhã' },
  { id: 14, uuid: 'qto-14', numero: 'Q14', nome: 'Suíte Safira', categoria_id: 3, andar: '2º Andar', capacidade_adultos: 2, capacidade_criancas: 0, tipo_cama: '1 Casal King', area_m2: 32, equipamentos: 'Hidro, Ar Split, Frigobar Retrô', status: 'LIVRE', ativo: true, observacoes: 'Excelente acústica' },
  { id: 15, uuid: 'qto-15', numero: 'Q15', nome: 'Chalé das Palmeiras', categoria_id: 4, andar: 'Área Externa', capacidade_adultos: 4, capacidade_criancas: 1, tipo_cama: '1 Casal Queen + 2 Solteiros', area_m2: 42, equipamentos: 'Churrasqueira portátil, Mini copa, 2 Ar Split, TV 50', status: 'OCUPADO', ativo: true, observacoes: 'Família Silveira (2 adultos, 2 crianças)' },
  { id: 16, uuid: 'qto-16', numero: 'Q16', nome: 'Chalé dos Coqueiros', categoria_id: 4, andar: 'Área Externa', capacidade_adultos: 4, capacidade_criancas: 1, tipo_cama: '1 Casal Queen + 2 Solteiros', area_m2: 42, equipamentos: 'Mini copa, 2 Ambientes, Ar Split', status: 'LIVRE', ativo: true, observacoes: 'Pet-friendly' },
  { id: 17, uuid: 'qto-17', numero: 'Q17', nome: 'Chalé Recanto das Aves', categoria_id: 4, andar: 'Área Externa', capacidade_adultos: 4, capacidade_criancas: 2, tipo_cama: '1 Casal King + 1 Beliche', area_m2: 45, equipamentos: 'Sala integrada, Varanda ampla com 2 redes, Ar Split', status: 'LIVRE', ativo: true, observacoes: 'Gramado privativo' },
  { id: 18, uuid: 'qto-18', numero: 'Q18', nome: 'Chalé Vista Verde', categoria_id: 4, andar: 'Área Externa', capacidade_adultos: 4, capacidade_criancas: 1, tipo_cama: '1 Casal Queen + 2 Solteiros', area_m2: 40, equipamentos: 'Vista bosque nativo, Silencioso, Ar Split', status: 'LIMPEZA', ativo: true, observacoes: 'Higienização geral' },
  { id: 19, uuid: 'qto-19', numero: 'Q19', nome: 'Térreo Acessível PCD', categoria_id: 1, andar: 'Térreo', capacidade_adultos: 2, capacidade_criancas: 0, tipo_cama: '2 Solteiro ou 1 Casal', area_m2: 24, equipamentos: 'Banheiro 100% Adaptado PCD, Barras de apoio, Rampa', status: 'LIVRE', ativo: true, observacoes: 'Norma ABNT 9050' },
  { id: 20, uuid: 'qto-20', numero: 'Q20', nome: 'Mirante Solarium', categoria_id: 2, andar: '2º Andar', capacidade_adultos: 2, capacidade_criancas: 0, tipo_cama: '1 Casal Queen', area_m2: 22, equipamentos: 'Solarium na cobertura com espreguiçadeiras', status: 'BLOQUEADO', ativo: true, observacoes: 'Bloqueado para pintura' },
];

export const INITIAL_HOSPEDES: Hospede[] = [
  { id: 1, uuid: 'hosp-01', nome_completo: 'Guilherme Siqueira Castro', tipo_documento: 'CPF', documento: '289.412.988-15', data_nascimento: '1985-04-12', nacionalidade: 'Brasileira', telefone: '(11) 98452-1100', whatsapp: '(11) 98452-1100', email: 'guilherme.castro@techcorp.com.br', endereco: 'Rua Bela Cintra, 450', cidade: 'São Paulo', estado: 'SP', pais: 'Brasil', cep: '01415-000', preferencias: 'Travesseiro extra macio e quarto silencioso', total_hospedagens: 3 },
  { id: 2, uuid: 'hosp-02', nome_completo: 'Beatriz Nogueira Duarte', tipo_documento: 'CPF', documento: '341.879.620-44', data_nascimento: '1991-08-25', nacionalidade: 'Brasileira', telefone: '(21) 99123-4567', whatsapp: '(21) 99123-4567', email: 'beatriz.duarte@designstudio.art', endereco: 'Rua Visconde de Pirajá, 280', cidade: 'Rio de Janeiro', estado: 'RJ', pais: 'Brasil', cep: '22410-000', preferencias: 'Cama King, sem cheiro forte de aromatizador', total_hospedagens: 1 },
  { id: 3, uuid: 'hosp-03', nome_completo: 'Rodrigo Fagundes Alencar', tipo_documento: 'CPF', documento: '154.982.340-92', data_nascimento: '1979-11-03', nacionalidade: 'Brasileira', telefone: '(31) 98765-4321', whatsapp: '(31) 98765-4321', email: 'rodrigo.fagundes@alencaradv.com', endereco: 'Av. Afonso Pena, 1200', cidade: 'Belo Horizonte', estado: 'MG', pais: 'Brasil', cep: '30130-003', preferencias: 'Café sem glúten, faturamento empresarial', total_hospedagens: 4 },
  { id: 4, uuid: 'hosp-04', nome_completo: 'Camila Antunes Silveira', tipo_documento: 'CPF', documento: '412.339.810-77', data_nascimento: '1988-02-14', nacionalidade: 'Brasileira', telefone: '(19) 99344-8822', whatsapp: '(19) 99344-8822', email: 'camila.silveira@agro.com.br', endereco: 'Rua Maria Monteiro, 820', cidade: 'Campinas', estado: 'SP', pais: 'Brasil', cep: '13025-151', preferencias: 'Viajando com 2 crianças, berço portátil', total_hospedagens: 2 },
  { id: 5, uuid: 'hosp-05', nome_completo: 'Juliana Ramos de Toledo', tipo_documento: 'CPF', documento: '118.490.228-30', data_nascimento: '1994-06-30', nacionalidade: 'Brasileira', telefone: '(41) 98822-1920', whatsapp: '(41) 98822-1920', email: 'juliana.toledo@biomed.ufpr.br', endereco: 'Rua Comendador Araújo, 510', cidade: 'Curitiba', estado: 'PR', pais: 'Brasil', cep: '80420-000', preferencias: 'Check-out tardio se houver disponibilidade', total_hospedagens: 1 },
];

export const INITIAL_FORMAS_PAGAMENTO: FormaPagamento[] = [
  { id: 1, uuid: 'fp-01', codigo: 'PIX', nome: 'PIX Instantâneo', taxa_operadora_percentual: 0.0, ativo: true },
  { id: 2, uuid: 'fp-02', codigo: 'CARTAO_CREDITO', nome: 'Cartão de Crédito', taxa_operadora_percentual: 2.8, ativo: true },
  { id: 3, uuid: 'fp-03', codigo: 'CARTAO_DEBITO', nome: 'Cartão de Débito', taxa_operadora_percentual: 1.2, ativo: true },
  { id: 4, uuid: 'fp-04', codigo: 'DINHEIRO', nome: 'Dinheiro em Espécie', taxa_operadora_percentual: 0.0, ativo: true },
  { id: 5, uuid: 'fp-05', codigo: 'TRANSFERENCIA', nome: 'Transferência / TED', taxa_operadora_percentual: 0.0, ativo: true },
];

export const INITIAL_PRODUTOS: Produto[] = [
  { id: 1, uuid: 'prod-01', categoria_id: 1, codigo: 'BEB01', nome: 'Água Mineral sem Gás 500ml', descricao: 'Garrafa pet', tipo: 'PRODUTO', preco_venda: 7.0, preco_custo: 1.8, estoque_atual: 120, estoque_minimo: 30, ativo: true },
  { id: 2, uuid: 'prod-02', categoria_id: 1, codigo: 'BEB02', nome: 'Água Mineral com Gás 500ml', descricao: 'Garrafa pet gaseificada', tipo: 'PRODUTO', preco_venda: 7.5, preco_custo: 2.0, estoque_atual: 80, estoque_minimo: 20, ativo: true },
  { id: 3, uuid: 'prod-03', categoria_id: 1, codigo: 'BEB03', nome: 'Refrigerante Lata 350ml', descricao: 'Coca-Cola tradicional ou zero', tipo: 'PRODUTO', preco_venda: 9.0, preco_custo: 3.2, estoque_atual: 95, estoque_minimo: 25, ativo: true },
  { id: 4, uuid: 'prod-04', categoria_id: 1, codigo: 'BEB04', nome: 'Cerveja Artesanal IPA 500ml', descricao: 'Rótulo local de Ilhabela', tipo: 'PRODUTO', preco_venda: 26.0, preco_custo: 12.0, estoque_atual: 48, estoque_minimo: 12, ativo: true },
  { id: 5, uuid: 'prod-05', categoria_id: 1, codigo: 'BEB05', nome: 'Água de Coco Integral 330ml', descricao: 'Natural pasteurizada gelada', tipo: 'PRODUTO', preco_venda: 12.0, preco_custo: 4.5, estoque_atual: 40, estoque_minimo: 15, ativo: true },
  { id: 6, uuid: 'prod-06', categoria_id: 2, codigo: 'LAN01', nome: 'Porção de Pão de Queijo Mineiro (6 un)', descricao: 'Queijo Canastra artesanal', tipo: 'PRODUTO', preco_venda: 22.0, preco_custo: 6.0, estoque_atual: 50, estoque_minimo: 10, ativo: true },
  { id: 7, uuid: 'prod-07', categoria_id: 2, codigo: 'SRV01', nome: 'Café da Manhã no Quarto', descricao: 'Cesta servida na varanda', tipo: 'SERVICO', preco_venda: 65.0, preco_custo: 25.0, estoque_atual: 999, estoque_minimo: 0, ativo: true },
  { id: 8, uuid: 'prod-08', categoria_id: 3, codigo: 'VIN01', nome: 'Espumante Brut Casa Valduga 750ml', descricao: 'Método Champenoise', tipo: 'PRODUTO', preco_venda: 145.0, preco_custo: 65.0, estoque_atual: 18, estoque_minimo: 6, ativo: true },
  { id: 9, uuid: 'prod-09', categoria_id: 4, codigo: 'LAV01', nome: 'Lavanderia Expressa por Peça', descricao: 'Lavada e passada', tipo: 'SERVICO', preco_venda: 18.0, preco_custo: 4.0, estoque_atual: 999, estoque_minimo: 0, ativo: true },
  { id: 10, uuid: 'prod-10', categoria_id: 5, codigo: 'EXP01', nome: 'Passeio de Escuna Praia do Bonete', descricao: 'Passeio náutico com paradas', tipo: 'SERVICO', preco_venda: 190.0, preco_custo: 130.0, estoque_atual: 999, estoque_minimo: 0, ativo: true },
];

export const INITIAL_RESERVAS: Reserva[] = [
  {
    id: 1,
    uuid: 'res-01',
    codigo_reserva: 'RES-2026-001',
    hospede_id: 1,
    quarto_id: 1,
    data_checkin: '2026-09-27',
    data_checkout: '2026-09-30',
    hora_checkin_prevista: '14:00',
    hora_checkout_prevista: '12:00',
    adultos: 2,
    criancas: 0,
    valor_diaria: 280,
    total_diarias: 840,
    valor_desconto: 0,
    valor_taxas: 42,
    valor_total: 882,
    valor_sinal_pago: 441,
    saldo_restante: 441,
    origem: 'DIRETA',
    status: 'HOSPEDADO',
    observacoes: 'Hóspede frequente. Já consumiu do frigobar.',
    created_at: '2026-09-20 10:00:00'
  },
  {
    id: 2,
    uuid: 'res-02',
    codigo_reserva: 'RES-2026-002',
    hospede_id: 2,
    quarto_id: 6,
    data_checkin: '2026-09-26',
    data_checkout: '2026-09-29',
    hora_checkin_prevista: '14:00',
    hora_checkout_prevista: '12:00',
    adultos: 2,
    criancas: 0,
    valor_diaria: 380,
    total_diarias: 1140,
    valor_desconto: 50,
    valor_taxas: 57,
    valor_total: 1147,
    valor_sinal_pago: 1147,
    saldo_restante: 0,
    origem: 'BOOKING',
    status: 'HOSPEDADO',
    observacoes: 'Lua de mel. Quarto todo pago antecipadamente.',
    created_at: '2026-09-18 14:30:00'
  },
  {
    id: 3,
    uuid: 'res-03',
    codigo_reserva: 'RES-2026-003',
    hospede_id: 3,
    quarto_id: 11,
    data_checkin: '2026-09-27',
    data_checkout: '2026-10-01',
    hora_checkin_prevista: '14:00',
    hora_checkout_prevista: '12:00',
    adultos: 2,
    criancas: 0,
    valor_diaria: 520,
    total_diarias: 2080,
    valor_desconto: 100,
    valor_taxas: 104,
    valor_total: 2084,
    valor_sinal_pago: 1000,
    saldo_restante: 1084,
    origem: 'WHATSAPP',
    status: 'HOSPEDADO',
    observacoes: 'Suíte Imperial solicitada para descanso.',
    created_at: '2026-09-22 09:15:00'
  },
  {
    id: 4,
    uuid: 'res-04',
    codigo_reserva: 'RES-2026-004',
    hospede_id: 4,
    quarto_id: 15,
    data_checkin: '2026-09-28',
    data_checkout: '2026-10-02',
    hora_checkin_prevista: '15:00',
    hora_checkout_prevista: '12:00',
    adultos: 2,
    criancas: 2,
    valor_diaria: 650,
    total_diarias: 2600,
    valor_desconto: 0,
    valor_taxas: 130,
    valor_total: 2730,
    valor_sinal_pago: 800,
    saldo_restante: 1930,
    origem: 'DIRETA',
    status: 'CONFIRMADA',
    observacoes: 'Chegada hoje à tarde. Chalé higienizado.',
    created_at: '2026-09-24 16:40:00'
  },
  {
    id: 5,
    uuid: 'res-05',
    codigo_reserva: 'RES-2026-005',
    hospede_id: 5,
    quarto_id: 8,
    data_checkin: '2026-09-25',
    data_checkout: '2026-09-28',
    hora_checkin_prevista: '14:00',
    hora_checkout_prevista: '12:00',
    adultos: 1,
    criancas: 0,
    valor_diaria: 380,
    total_diarias: 1140,
    valor_desconto: 0,
    valor_taxas: 57,
    valor_total: 1197,
    valor_sinal_pago: 500,
    saldo_restante: 697,
    origem: 'AIRBNB',
    status: 'HOSPEDADO',
    observacoes: 'Check-out programado para hoje até as 12h.',
    created_at: '2026-09-15 11:20:00'
  },
];

export const INITIAL_CONSUMOS: Consumo[] = [
  { id: 1, uuid: 'con-01', reserva_id: 1, quarto_id: 1, produto_id: 1, nome_produto: 'Água Mineral sem Gás 500ml', quantidade: 2, valor_unitario: 7.0, valor_total: 14.0, data_lancamento: '2026-09-27 16:30', usuario_id: 3, usuario_nome: 'Fernanda Lima', status_faturamento: 'PENDENTE' },
  { id: 2, uuid: 'con-02', reserva_id: 1, quarto_id: 1, produto_id: 4, nome_produto: 'Cerveja Artesanal IPA 500ml', quantidade: 2, valor_unitario: 26.0, valor_total: 52.0, data_lancamento: '2026-09-27 19:10', usuario_id: 3, usuario_nome: 'Fernanda Lima', status_faturamento: 'PENDENTE' },
  { id: 3, uuid: 'con-03', reserva_id: 2, quarto_id: 6, produto_id: 8, nome_produto: 'Espumante Brut Casa Valduga 750ml', quantidade: 1, valor_unitario: 145.0, valor_total: 145.0, data_lancamento: '2026-09-26 20:00', usuario_id: 3, usuario_nome: 'Fernanda Lima', status_faturamento: 'PENDENTE' },
  { id: 4, uuid: 'con-04', reserva_id: 3, quarto_id: 11, produto_id: 8, nome_produto: 'Espumante Brut Casa Valduga 750ml', quantidade: 1, valor_unitario: 145.0, valor_total: 145.0, data_lancamento: '2026-09-27 18:00', usuario_id: 3, usuario_nome: 'Fernanda Lima', status_faturamento: 'PENDENTE' },
  { id: 5, uuid: 'con-05', reserva_id: 3, quarto_id: 11, produto_id: 6, nome_produto: 'Porção de Pão de Queijo Mineiro (6 un)', quantidade: 2, valor_unitario: 22.0, valor_total: 44.0, data_lancamento: '2026-09-28 08:30', usuario_id: 3, usuario_nome: 'Fernanda Lima', status_faturamento: 'PENDENTE' },
];

export const INITIAL_CAIXA: Caixa = {
  id: 1,
  uuid: 'cx-01',
  codigo: 'CX-20260928-01',
  usuario_abertura_id: 3,
  usuario_abertura_nome: 'Fernanda Lima',
  data_hora_abertura: '2026-09-28 07:30',
  saldo_inicial: 350.0,
  total_entradas: 1241.0,
  total_saidas: 65.0,
  saldo_esperado: 1526.0,
  resultado_fechamento: 'ABERTO',
  status: 'ABERTO',
};

export const INITIAL_MOVIMENTOS_CAIXA: MovimentoCaixa[] = [
  { id: 1, uuid: 'mov-01', caixa_id: 1, tipo: 'ENTRADA', categoria: 'SINAL_RESERVA', descricao: 'Sinal Reserva RES-2026-004 via PIX', valor: 800.0, forma_pagamento_id: 1, forma_pagamento_nome: 'PIX Instantâneo', data_hora: '2026-09-28 08:15', usuario_id: 3, usuario_nome: 'Fernanda Lima' },
  { id: 2, uuid: 'mov-02', caixa_id: 1, tipo: 'ENTRADA', categoria: 'PAGAMENTO_DIARIA', descricao: 'Recebimento de diária em dinheiro', valor: 441.0, forma_pagamento_id: 4, forma_pagamento_nome: 'Dinheiro em Espécie', data_hora: '2026-09-28 09:20', usuario_id: 3, usuario_nome: 'Fernanda Lima' },
  { id: 3, uuid: 'mov-03', caixa_id: 1, tipo: 'SAIDA', categoria: 'SUPRIMENTO_COZINHA', descricao: 'Reposição de frutas frescas da feira local', valor: 65.0, forma_pagamento_id: 4, forma_pagamento_nome: 'Dinheiro em Espécie', data_hora: '2026-09-28 10:00', usuario_id: 3, usuario_nome: 'Fernanda Lima' },
];

export const INITIAL_CONTAS_FINANCEIRAS: ContaFinanceira[] = [
  { id: 1, uuid: 'cf-01', tipo: 'RECEBER', reserva_id: 4, hospede_id: 4, categoria: 'HOSPEDAGEM', descricao: 'Saldo residual Reserva RES-2026-004', valor_original: 1930.0, valor_liquidado: 0, data_emissao: '2026-09-24', data_vencimento: '2026-09-28', status: 'PENDENTE' },
  { id: 2, uuid: 'cf-02', tipo: 'RECEBER', reserva_id: 5, hospede_id: 5, categoria: 'CHECKOUT', descricao: 'Saldo a receber no check-out hoje RES-2026-005', valor_original: 697.0, valor_liquidado: 0, data_emissao: '2026-09-25', data_vencimento: '2026-09-28', status: 'PENDENTE' },
  { id: 3, uuid: 'cf-03', tipo: 'PAGAR', fornecedor: 'Lavanderia Sol & Mar', categoria: 'SERVICOS_TERCEIROS', descricao: 'Higienização de lençóis e toalhas quinzenal', valor_original: 680.0, valor_liquidado: 0, data_emissao: '2026-09-20', data_vencimento: '2026-09-30', status: 'PENDENTE' },
  { id: 4, uuid: 'cf-04', tipo: 'PAGAR', fornecedor: 'Companhia Paulista de Força e Luz (CPFL)', categoria: 'ENERGIA_ELETRICA', descricao: 'Conta de luz da pousada ref. mês anterior', valor_original: 1420.50, valor_liquidado: 1420.50, data_emissao: '2026-09-10', data_vencimento: '2026-09-25', data_liquidacao: '2026-09-23', status: 'PAGO' },
];

export const INITIAL_LIMPEZAS: LimpezaQuarto[] = [
  { id: 1, uuid: 'limp-01', quarto_id: 3, quarto_numero: 'Q03', tipo_limpeza: 'CHECKOUT', status: 'SUJO', data_hora_solicitacao: '2026-09-28 09:00', responsavel_nome: 'Maria das Graças', observacoes: 'Troca total de lençóis e reposição do frigobar' },
  { id: 2, uuid: 'limp-02', quarto_id: 18, quarto_numero: 'Q18', tipo_limpeza: 'GERAL', status: 'EM_LIMPEZA', data_hora_solicitacao: '2026-09-28 08:00', data_hora_inicio: '2026-09-28 09:15', responsavel_nome: 'Maria das Graças', observacoes: 'Limpeza profunda de vidros e chalé' },
  { id: 3, uuid: 'limp-03', quarto_id: 9, quarto_numero: 'Q09', tipo_limpeza: 'RETROQUE', status: 'LIBERADO', data_hora_solicitacao: '2026-09-28 07:30', data_hora_conclusao: '2026-09-28 08:30', responsavel_nome: 'Maria das Graças', observacoes: 'Cheirinho de alecrim aplicado e quarto lacrado' },
];

export const INITIAL_MANUTENCOES: Manutencao[] = [
  { id: 1, uuid: 'mnt-01', codigo_chamado: 'MNT-2026-01', quarto_id: 10, quarto_numero: 'Q10', equipamento: 'Chuveiro & Registro Misturador', descricao_problema: 'Gotejamento contínuo e baixa pressão na água quente do banheiro.', prioridade: 'ALTA', status: 'EM_ANDAMENTO', responsavel_nome: 'Roberto Silva', data_abertura: '2026-09-27 14:00', custo_reparo: 85.0 },
  { id: 2, uuid: 'mnt-02', codigo_chamado: 'MNT-2026-02', quarto_id: 20, quarto_numero: 'Q20', equipamento: 'Deck do Solarium', descricao_problema: 'Lixamento e aplicação de verniz náutico nas ripas de madeira expostas.', prioridade: 'MEDIA', status: 'ABERTO', responsavel_nome: 'Roberto Silva', data_abertura: '2026-09-26 10:30', custo_reparo: 220.0 },
];

export const INITIAL_AUDITORIA: AuditoriaLog[] = [
  { id: 1, uuid: 'aud-01', usuario_id: 1, usuario_nome: 'Mariana Rocha (Administradora)', modulo: 'SISTEMA', acao: 'INICIALIZACAO', tabela_afetada: 'pousadas', registro_id: '1', valor_novo: 'Carregamento do ecossistema de 20 quartos e dados operacionais.', device_id: 'BROWSER_CLIENT', data_hora: '2026-09-28 07:00:00' },
  { id: 2, uuid: 'aud-02', usuario_id: 3, usuario_nome: 'Fernanda Lima', modulo: 'CAIXA', acao: 'ABERTURA', tabela_afetada: 'caixas', registro_id: 'CX-20260928-01', valor_novo: 'Caixa aberto com fundo inicial de R$ 350,00.', device_id: 'BROWSER_CLIENT', data_hora: '2026-09-28 07:30:12' },
];
