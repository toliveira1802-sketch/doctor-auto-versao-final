// Mock data centralizado para uso em componentes de gestão e admin

export const clientesMock = [
  { id: 1, nomeCompleto: "João Silva", cpf: "123.456.789-00", email: "joao@email.com", telefone: "(11) 99999-1234", cidade: "São Paulo", estado: "SP", totalGasto: 4500 },
  { id: 2, nomeCompleto: "Maria Santos", cpf: "987.654.321-00", email: "maria@email.com", telefone: "(11) 98888-5678", cidade: "São Paulo", estado: "SP", totalGasto: 2800 },
  { id: 3, nomeCompleto: "Pedro Lima", cpf: "456.789.123-00", email: "pedro@email.com", telefone: "(11) 97777-9012", cidade: "Guarulhos", estado: "SP", totalGasto: 12500 },
  { id: 4, nomeCompleto: "Ana Costa", cpf: "321.654.987-00", email: "ana@email.com", telefone: "(11) 96666-3456", cidade: "Osasco", estado: "SP", totalGasto: 950 },
  { id: 5, nomeCompleto: "Carlos Souza", cpf: "789.123.456-00", email: "carlos@email.com", telefone: "(11) 95555-7890", cidade: "São Paulo", estado: "SP", totalGasto: 18900 },
];

export const mecanicosMock = [
  { id: 1, nome: "José Ferreira", especialidade: "Motor", status: "ativo", osAtribuidas: 3, avaliacao: 4.5 },
  { id: 2, nome: "Ricardo Oliveira", especialidade: "Elétrica", status: "ativo", osAtribuidas: 2, avaliacao: 4.8 },
  { id: 3, nome: "Marcos Almeida", especialidade: "Suspensão", status: "ativo", osAtribuidas: 4, avaliacao: 4.2 },
  { id: 4, nome: "Paulo Santos", especialidade: "Freios", status: "ativo", osAtribuidas: 1, avaliacao: 4.6 },
];

export const colaboradoresMock = [
  { id: 1, nome: "José Ferreira", cargo: "Mecânico Senior", departamento: "Oficina", salario: 4500, dataAdmissao: "2021-03-15", status: "ativo" },
  { id: 2, nome: "Ricardo Oliveira", cargo: "Eletricista Automotivo", departamento: "Oficina", salario: 4200, dataAdmissao: "2022-01-10", status: "ativo" },
  { id: 3, nome: "Marcos Almeida", cargo: "Mecânico Pleno", departamento: "Oficina", salario: 3800, dataAdmissao: "2022-06-20", status: "ativo" },
  { id: 4, nome: "Amanda Lima", cargo: "Atendente", departamento: "Recepção", salario: 2500, dataAdmissao: "2023-02-01", status: "ativo" },
  { id: 5, nome: "Fernanda Costa", cargo: "Gerente", departamento: "Administração", salario: 6000, dataAdmissao: "2020-08-15", status: "ativo" },
];

export const ordensServicoMock = [
  { id: 1, numeroOs: "OS-001", status: "diagnostico", clienteId: 1, veiculoId: 1, mecanicoId: 1, valorAprovado: 0, totalOrcamento: 0, dataEntrada: "2024-02-01", placa: "ABC-1234" },
  { id: 2, numeroOs: "OS-002", status: "orcamento", clienteId: 2, veiculoId: 3, mecanicoId: 2, valorAprovado: 0, totalOrcamento: 1500, dataEntrada: "2024-02-01", placa: "DEF-5678" },
  { id: 3, numeroOs: "OS-003", status: "aguardando_aprovacao", clienteId: 3, veiculoId: 4, mecanicoId: 3, valorAprovado: 0, totalOrcamento: 3200, dataEntrada: "2024-01-30", placa: "GHI-9012" },
  { id: 4, numeroOs: "OS-004", status: "em_execucao", clienteId: 4, veiculoId: 5, mecanicoId: 1, valorAprovado: 2800, totalOrcamento: 2800, dataEntrada: "2024-01-28", placa: "JKL-3456" },
  { id: 5, numeroOs: "OS-005", status: "concluido", clienteId: 5, veiculoId: 6, mecanicoId: 4, valorAprovado: 650, totalOrcamento: 650, dataEntrada: "2024-01-25", placa: "MNO-7890" },
  { id: 6, numeroOs: "OS-006", status: "entregue", clienteId: 1, veiculoId: 2, mecanicoId: 2, valorAprovado: 1200, totalOrcamento: 1200, dataEntrada: "2024-01-20", placa: "XYZ-9876" },
];

export const statusList = [
  { id: 1, nome: "diagnostico", label: "Diagnóstico", cor: "#F97316" },
  { id: 2, nome: "orcamento", label: "Orçamento", cor: "#3B82F6" },
  { id: 3, nome: "aguardando_aprovacao", label: "Aguardando Aprovação", cor: "#F59E0B" },
  { id: 4, nome: "em_execucao", label: "Em Execução", cor: "#8B5CF6" },
  { id: 5, nome: "concluido", label: "Concluído", cor: "#22C55E" },
  { id: 6, nome: "entregue", label: "Entregue", cor: "#6B7280" },
];
