import { useState } from "react";
import { useLocation } from "wouter";
import { 
  ArrowLeft, Search, Car, CheckCircle, Heart, ChevronRight, X
} from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";

// Mock data
let clientesMock = [
  { id: 1, nomeCompleto: 'João Silva', cpf: '123.456.789-00', email: 'joao@email.com', telefone: '(11) 99999-1234', cidade: 'São Paulo', estado: 'SP', totalGasto: 4500 },
  { id: 2, nomeCompleto: 'Maria Santos', cpf: '987.654.321-00', email: 'maria@email.com', telefone: '(11) 98888-5678', cidade: 'São Paulo', estado: 'SP', totalGasto: 2800 },
  { id: 3, nomeCompleto: 'Pedro Lima', cpf: '456.789.123-00', email: 'pedro@email.com', telefone: '(11) 97777-9012', cidade: 'Guarulhos', estado: 'SP', totalGasto: 12500 },
  { id: 4, nomeCompleto: 'Ana Costa', cpf: '321.654.987-00', email: 'ana@email.com', telefone: '(11) 96666-3456', cidade: 'Osasco', estado: 'SP', totalGasto: 950 },
  { id: 5, nomeCompleto: 'Carlos Souza', cpf: '789.123.456-00', email: 'carlos@email.com', telefone: '(11) 95555-7890', cidade: 'São Paulo', estado: 'SP', totalGasto: 18900 },
];

let veiculosMock = [
  { id: 1, clienteId: 1, placa: 'ABC-1234', marca: 'Honda', modelo: 'Civic', ano: 2020, cor: 'Prata', combustivel: 'Flex', kmAtual: 45000 },
  { id: 2, clienteId: 1, placa: 'XYZ-9876', marca: 'Toyota', modelo: 'Corolla', ano: 2018, cor: 'Branco', combustivel: 'Flex', kmAtual: 72000 },
  { id: 3, clienteId: 2, placa: 'DEF-5678', marca: 'Hyundai', modelo: 'HB20', ano: 2021, cor: 'Vermelho', combustivel: 'Flex', kmAtual: 28000 },
  { id: 4, clienteId: 3, placa: 'GHI-9012', marca: 'VW', modelo: 'Polo', ano: 2022, cor: 'Preto', combustivel: 'Flex', kmAtual: 15000 },
  { id: 5, clienteId: 4, placa: 'JKL-3456', marca: 'Chevrolet', modelo: 'Onix', ano: 2019, cor: 'Cinza', combustivel: 'Flex', kmAtual: 58000 },
  { id: 6, clienteId: 5, placa: 'MNO-7890', marca: 'Jeep', modelo: 'Compass', ano: 2023, cor: 'Verde', combustivel: 'Flex', kmAtual: 12000 },
];

interface ClienteNovoModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { cliente: typeof clientesMock[0]; veiculo: typeof veiculosMock[0] }) => void;
}

const ClienteNovoModal = ({ open, onClose, onSave }: ClienteNovoModalProps) => {
  const [step, setStep] = useState(1);
  const [cliente, setCliente] = useState({ nomeCompleto: '', telefone: '', cpf: '', email: '' });
  const [veiculo, setVeiculo] = useState({ placa: '', marca: '', modelo: '', ano: '', kmAtual: '' });

  if (!open) return null;

  const next = () => {
    if (cliente.nomeCompleto && cliente.telefone) {
      setStep(2);
    }
  };

  const save = () => {
    if (!veiculo.placa) return;
    const cid = clientesMock.length + 1;
    const vid = veiculosMock.length + 1;
    const nc = { id: cid, ...cliente, cidade: 'São Paulo', estado: 'SP', totalGasto: 0 };
    const nv = { 
      id: vid, 
      clienteId: cid, 
      ...veiculo, 
      ano: parseInt(veiculo.ano) || new Date().getFullYear(),
      cor: '', 
      combustivel: 'Flex', 
      kmAtual: parseInt(veiculo.kmAtual) || 0 
    };
    clientesMock.push(nc);
    veiculosMock.push(nv);
    onSave({ cliente: nc, veiculo: nv });
    setStep(1);
    setCliente({ nomeCompleto: '', telefone: '', cpf: '', email: '' });
    setVeiculo({ placa: '', marca: '', modelo: '', ano: '', kmAtual: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-white" />
            <span className="text-white font-bold">Cliente Novo</span>
            <span className="text-red-200 text-xs">({step}/2)</span>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {step === 1 ? (
            <div className="space-y-3">
              <div>
                <label className="text-slate-300 text-xs">Nome *</label>
                <input 
                  value={cliente.nomeCompleto} 
                  onChange={e => setCliente({...cliente, nomeCompleto: e.target.value})} 
                  className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-red-500 outline-none" 
                />
              </div>
              <div>
                <label className="text-slate-300 text-xs">Telefone *</label>
                <input 
                  value={cliente.telefone} 
                  onChange={e => setCliente({...cliente, telefone: e.target.value})} 
                  className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-red-500 outline-none" 
                />
              </div>
              <div>
                <label className="text-slate-300 text-xs">CPF</label>
                <input 
                  value={cliente.cpf} 
                  onChange={e => setCliente({...cliente, cpf: e.target.value})} 
                  className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-red-500 outline-none" 
                />
              </div>
              <div>
                <label className="text-slate-300 text-xs">Email</label>
                <input 
                  value={cliente.email} 
                  onChange={e => setCliente({...cliente, email: e.target.value})} 
                  className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-red-500 outline-none" 
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={onClose} className="flex-1 px-3 py-2 border border-slate-700 text-slate-300 rounded-lg text-sm hover:bg-slate-800">
                  Cancelar
                </button>
                <button onClick={next} className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-500">
                  Próximo
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-slate-300 text-xs">Placa *</label>
                <input 
                  value={veiculo.placa} 
                  onChange={e => setVeiculo({...veiculo, placa: e.target.value.toUpperCase()})} 
                  className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm uppercase font-mono focus:border-red-500 outline-none" 
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 text-xs">Marca</label>
                  <input 
                    value={veiculo.marca} 
                    onChange={e => setVeiculo({...veiculo, marca: e.target.value})} 
                    className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-red-500 outline-none" 
                  />
                </div>
                <div>
                  <label className="text-slate-300 text-xs">Modelo</label>
                  <input 
                    value={veiculo.modelo} 
                    onChange={e => setVeiculo({...veiculo, modelo: e.target.value})} 
                    className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-red-500 outline-none" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 text-xs">Ano</label>
                  <input 
                    value={veiculo.ano} 
                    onChange={e => setVeiculo({...veiculo, ano: e.target.value})} 
                    className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-red-500 outline-none" 
                  />
                </div>
                <div>
                  <label className="text-slate-300 text-xs">KM</label>
                  <input 
                    value={veiculo.kmAtual} 
                    onChange={e => setVeiculo({...veiculo, kmAtual: e.target.value})} 
                    className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:border-red-500 outline-none" 
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setStep(1)} className="flex-1 px-3 py-2 border border-slate-700 text-slate-300 rounded-lg text-sm hover:bg-slate-800">
                  Voltar
                </button>
                <button onClick={save} className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-500">
                  Salvar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function AdminNovaOS() {
  const [, setLocation] = useLocation();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    placa: '',
    veiculo: '',
    cliente: '',
    telefone: '',
    kmAtual: '',
    descricao: '',
    clienteId: null as number | null,
    veiculoId: null as number | null
  });
  const [results, setResults] = useState<Array<typeof veiculosMock[0] & { c?: typeof clientesMock[0] }>>([]);

  const search = (p: string) => {
    setForm({...form, placa: p});
    if (p.length >= 3) {
      setResults(
        veiculosMock
          .filter(v => v.placa.toLowerCase().includes(p.toLowerCase()))
          .map(v => ({...v, c: clientesMock.find(c => c.id === v.clienteId)}))
      );
    } else {
      setResults([]);
    }
  };

  const select = (v: typeof results[0]) => {
    setForm({
      placa: v.placa,
      veiculo: `${v.marca} ${v.modelo} ${v.ano}`,
      cliente: v.c?.nomeCompleto || '',
      telefone: v.c?.telefone || '',
      kmAtual: v.kmAtual.toString(),
      descricao: '',
      clienteId: v.clienteId,
      veiculoId: v.id
    });
    setResults([]);
  };

  const onSaveCliente = (d: { cliente: typeof clientesMock[0]; veiculo: typeof veiculosMock[0] }) => {
    setForm({
      placa: d.veiculo.placa,
      veiculo: `${d.veiculo.marca} ${d.veiculo.modelo} ${d.veiculo.ano}`.trim() || d.veiculo.placa,
      cliente: d.cliente.nomeCompleto,
      telefone: d.cliente.telefone,
      kmAtual: d.veiculo.kmAtual.toString(),
      descricao: '',
      clienteId: d.cliente.id,
      veiculoId: d.veiculo.id
    });
  };

  const criar = () => {
    if (!form.placa || !form.descricao) return;
    // Aqui seria a criação real no banco
    // Por ora, apenas navega para a lista de OS
    setLocation('/admin/ordens-servico');
  };

  return (
    <AdminLayout>
      <div className="flex-1 flex flex-col bg-slate-950">
        {/* Header */}
        <header className="h-12 bg-slate-900 border-b border-slate-800 flex items-center px-4">
          <button onClick={() => setLocation('/admin')} className="text-slate-400 hover:text-white mr-3">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-white font-semibold text-sm">Nova OS</h1>
        </header>

        {/* Content */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="max-w-lg mx-auto">
            {/* Botão Cliente Novo */}
            <button 
              onClick={() => setModal(true)} 
              className="w-full p-4 mb-4 bg-gradient-to-r from-red-600 to-red-700 rounded-xl hover:from-red-500 hover:to-red-600 transition-colors flex items-center gap-3"
            >
              <Heart className="w-8 h-8 text-white" />
              <div className="text-left">
                <p className="text-white font-bold">Cliente Novo</p>
                <p className="text-red-200 text-sm">Cadastro completo</p>
              </div>
              <ChevronRight className="w-5 h-5 text-white ml-auto" />
            </button>

            {/* Divisor */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-slate-700"></div>
              <span className="text-slate-500 text-xs">ou busque existente</span>
              <div className="flex-1 h-px bg-slate-700"></div>
            </div>

            {/* Form */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              {/* Busca Placa */}
              <div className="mb-3 relative">
                <label className="text-slate-300 text-xs mb-1 block">Buscar Placa</label>
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input 
                    value={form.placa} 
                    onChange={e => search(e.target.value.toUpperCase())} 
                    className="flex-1 bg-transparent text-white outline-none uppercase font-mono text-sm" 
                    placeholder="ABC-1234" 
                  />
                </div>
                {results.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg z-10 max-h-48 overflow-auto">
                    {results.map(r => (
                      <button 
                        key={r.id} 
                        onClick={() => select(r)} 
                        className="w-full p-2 text-left hover:bg-slate-700 flex items-center gap-2 text-sm"
                      >
                        <Car className="w-4 h-4 text-red-400" />
                        <span className="text-white font-mono">{r.placa}</span>
                        <span className="text-slate-400">- {r.marca} {r.modelo} - {r.c?.nomeCompleto}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Cliente Identificado */}
              {form.cliente && (
                <div className="mb-3 p-2 bg-green-500/10 border border-green-500/30 rounded-lg text-sm">
                  <div className="flex items-center gap-2 text-green-400 mb-1">
                    <CheckCircle className="w-4 h-4" /> Cliente identificado
                  </div>
                  <p className="text-white">{form.cliente} - {form.veiculo}</p>
                </div>
              )}

              {/* Descrição */}
              <div className="mb-3">
                <label className="text-slate-300 text-xs mb-1 block">Descrição do Problema *</label>
                <textarea 
                  value={form.descricao} 
                  onChange={e => setForm({...form, descricao: e.target.value})} 
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm h-20 resize-none focus:border-red-500 outline-none" 
                  placeholder="Descreva o problema..." 
                />
              </div>

              {/* Botões */}
              <div className="flex gap-2">
                <button 
                  onClick={() => setLocation('/admin')} 
                  className="flex-1 px-3 py-2 border border-slate-700 text-slate-300 rounded-lg text-sm hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button 
                  onClick={criar} 
                  disabled={!form.placa || !form.descricao} 
                  className="flex-1 px-3 py-2 bg-red-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg text-sm hover:bg-red-500"
                >
                  Criar OS
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        <ClienteNovoModal open={modal} onClose={() => setModal(false)} onSave={onSaveCliente} />
      </div>
    </AdminLayout>
  );
}
