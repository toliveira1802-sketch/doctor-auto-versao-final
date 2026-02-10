import { useLocation } from "wouter";
import { 
  Car, Calendar, Users, DollarSign, PlusCircle, Bell
} from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";

// Mock data - será substituído por dados reais do Supabase
const ordensServicoMock = [
  { id: 1, status: 'diagnostico', valorAprovado: 0 },
  { id: 2, status: 'orcamento', valorAprovado: 0 },
  { id: 3, status: 'aguardando_aprovacao', valorAprovado: 0 },
  { id: 4, status: 'em_execucao', valorAprovado: 2800 },
  { id: 5, status: 'concluido', valorAprovado: 650 },
  { id: 6, status: 'entregue', valorAprovado: 1200 },
];

const pendenciasMock = [
  { id: 1, status: 'pendente' },
  { id: 2, status: 'pendente' },
  { id: 3, status: 'feita' },
];

const agendamentosMock = [
  { id: 1 },
  { id: 2 },
];

const clientesMock = [
  { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }
];

const empresasMock = [
  { id: 1, nome: 'DOCTOR AUTO PRIME' },
  { id: 2, nome: 'POMBAL' },
  { id: 3, nome: 'GARAGEM 347' }
];

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
  onClick?: () => void;
}

const StatCard = ({ icon: Icon, label, value, color, onClick }: StatCardProps) => (
  <div 
    onClick={onClick} 
    className={`bg-slate-900 border border-slate-800 rounded-xl p-4 ${onClick ? 'cursor-pointer hover:border-slate-600 transition-colors' : ''}`}
  >
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xl font-bold text-white">{value}</p>
        <p className="text-xs text-slate-400">{label}</p>
      </div>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  
  const osNoPatio = ordensServicoMock.filter(os => os.status !== 'entregue').length;
  const faturado = ordensServicoMock.reduce((a, os) => a + os.valorAprovado, 0);
  const pendentes = pendenciasMock.filter(p => p.status === 'pendente').length;

  const hoje = new Date().toLocaleDateString('pt-BR');

  return (
    <AdminLayout>
      <div className="flex-1 flex flex-col bg-slate-950">
        {/* Header */}
        <header className="h-12 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4">
          <div>
            <h1 className="text-white font-semibold text-sm">Dashboard</h1>
            <p className="text-slate-500 text-xs">{hoje}</p>
          </div>
          <select className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white text-xs">
            {empresasMock.map(e => (
              <option key={e.id}>{e.nome}</option>
            ))}
          </select>
        </header>

        {/* Content */}
        <div className="flex-1 p-4 overflow-auto space-y-4">
          {/* Pendências Destaque */}
          <div 
            onClick={() => setLocation('/admin/pendencias')} 
            className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 cursor-pointer hover:border-red-500/50 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Bell className="w-8 h-8 text-red-400" />
              <div>
                <p className="text-white font-semibold">Pendências</p>
                <p className="text-slate-400 text-xs">Clique para ver</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-white">{pendentes}</span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-3">
            <StatCard 
              icon={Car} 
              label="No Pátio" 
              value={osNoPatio} 
              color="bg-blue-500/20 text-blue-400" 
              onClick={() => setLocation('/admin/patio')} 
            />
            <StatCard 
              icon={Calendar} 
              label="Agendados" 
              value={agendamentosMock.length} 
              color="bg-purple-500/20 text-purple-400" 
              onClick={() => setLocation('/admin/agendamentos')} 
            />
            <StatCard 
              icon={Users} 
              label="Clientes" 
              value={clientesMock.length} 
              color="bg-cyan-500/20 text-cyan-400" 
              onClick={() => setLocation('/admin/clientes')} 
            />
            <StatCard 
              icon={DollarSign} 
              label="Faturado" 
              value={`R$ ${faturado.toLocaleString()}`} 
              color="bg-green-500/20 text-green-400" 
              onClick={() => setLocation('/admin/financeiro')} 
            />
          </div>

          {/* Botão Nova OS */}
          <button 
            onClick={() => setLocation('/admin/nova-os')} 
            className="w-full p-4 bg-gradient-to-r from-red-600 to-red-700 rounded-xl hover:from-red-500 hover:to-red-600 transition-colors flex items-center gap-3"
          >
            <PlusCircle className="w-8 h-8 text-white" />
            <div className="text-left">
              <p className="text-white font-bold">Criar Nova OS</p>
              <p className="text-red-200 text-sm">Cliente novo ou existente</p>
            </div>
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
