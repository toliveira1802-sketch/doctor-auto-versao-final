import { useLocation } from "wouter";
import { ArrowLeft, User } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";

// Mock data
const mecanicosMock = [
  { id: 1, nome: 'Carlos Silva', especialidade: 'Motor', osAtivas: 2, produtividade: 92 },
  { id: 2, nome: 'Tadeu Santos', especialidade: 'Suspensão', osAtivas: 1, produtividade: 88 },
  { id: 3, nome: 'Alessandro Lima', especialidade: 'Elétrica', osAtivas: 1, produtividade: 95 },
  { id: 4, nome: 'Samuel Costa', especialidade: 'Diagnóstico', osAtivas: 0, produtividade: 90 },
  { id: 5, nome: 'Pedro Oliveira', especialidade: 'Geral', osAtivas: 0, produtividade: 85 },
];

const ordensServicoMock = [
  { id: 1, placa: 'ABC-1234', descricao: 'Revisão completa', mecanico: 'Carlos Silva', status: 'diagnostico' },
  { id: 2, placa: 'DEF-5678', descricao: 'Troca de pastilhas', mecanico: 'Carlos Silva', status: 'em_execucao' },
  { id: 3, placa: 'GHI-9012', descricao: 'Suspensão dianteira', mecanico: 'Tadeu Santos', status: 'aguardando_aprovacao' },
  { id: 4, placa: 'JKL-3456', descricao: 'Motor falhando', mecanico: 'Alessandro Lima', status: 'em_execucao' },
];

export default function AdminAgendaMecanicos() {
  const [, setLocation] = useLocation();

  return (
    <AdminLayout>
      <div className="flex-1 flex flex-col bg-slate-950">
        {/* Header */}
        <header className="h-12 bg-slate-900 border-b border-slate-800 flex items-center px-4">
          <button onClick={() => setLocation('/admin')} className="text-slate-400 hover:text-white mr-3">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-white font-semibold text-sm">Agenda Mecânicos</h1>
        </header>

        {/* Content */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="grid grid-cols-5 gap-3">
            {mecanicosMock.map(m => {
              const oss = ordensServicoMock.filter(
                os => os.mecanico === m.nome && !['concluido', 'entregue'].includes(os.status)
              );
              return (
                <div key={m.id} className="bg-slate-900 border border-slate-800 rounded-xl p-3">
                  {/* Mecânico Header */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                      <User className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-xs">{m.nome}</p>
                      <p className="text-slate-500 text-xs">{m.especialidade}</p>
                    </div>
                  </div>
                  {/* OS Atribuídas */}
                  <div className="space-y-1">
                    {oss.length > 0 ? (
                      oss.map(os => (
                        <div 
                          key={os.id} 
                          onClick={() => setLocation(`/admin/os/${os.id}`)}
                          className="p-1.5 bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors"
                        >
                          <p className="text-white font-mono text-xs">{os.placa}</p>
                          <p className="text-slate-400 text-xs truncate">{os.descricao}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500 text-xs text-center py-2">Disponível</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
