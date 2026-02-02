import { useLocation } from "wouter";
import { ArrowLeft, Phone } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";

// Mock data
const agendamentosMock = [
  { id: 1, cliente: 'Roberto Alves', telefone: '(11) 94444-1234', veiculo: 'Nissan Kicks', placa: 'STU-5678', data: '03/02', hora: '08:00', servico: 'Revisão', status: 'confirmado' },
  { id: 2, cliente: 'Fernanda Lima', telefone: '(11) 93333-5678', veiculo: 'Fiat Argo', placa: 'VWX-9012', data: '03/02', hora: '09:30', servico: 'Freios', status: 'pendente' },
  { id: 3, cliente: 'Marcos Silva', telefone: '(11) 92222-9012', veiculo: 'Honda Fit', placa: 'YZA-3456', data: '04/02', hora: '10:00', servico: 'Alinhamento', status: 'confirmado' },
  { id: 4, cliente: 'Juliana Costa', telefone: '(11) 91111-3456', veiculo: 'VW Golf', placa: 'BCD-7890', data: '04/02', hora: '14:00', servico: 'Diagnóstico', status: 'pendente' },
];

export default function AdminAgendamentos() {
  const [, setLocation] = useLocation();

  return (
    <AdminLayout>
      <div className="flex-1 flex flex-col bg-slate-950">
        {/* Header */}
        <header className="h-12 bg-slate-900 border-b border-slate-800 flex items-center px-4">
          <button onClick={() => setLocation('/admin')} className="text-slate-400 hover:text-white mr-3">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-white font-semibold text-sm">Agendamentos</h1>
        </header>

        {/* Content */}
        <div className="flex-1 p-4 overflow-auto space-y-3">
          {agendamentosMock.map(a => (
            <div 
              key={a.id} 
              className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                {/* Data/Hora */}
                <div className="text-center p-2 bg-slate-800 rounded-lg min-w-[60px]">
                  <p className="text-white font-bold text-sm">{a.data.split('/')[0]}</p>
                  <p className="text-slate-400 text-xs">{a.hora}</p>
                </div>
                {/* Info */}
                <div>
                  <p className="text-white font-medium text-sm">{a.cliente}</p>
                  <p className="text-slate-400 text-xs">{a.veiculo} - {a.placa}</p>
                  <p className="text-slate-500 text-xs">{a.servico}</p>
                </div>
              </div>
              {/* Status + Ações */}
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  a.status === 'confirmado' 
                    ? 'bg-green-500/10 text-green-400' 
                    : 'bg-yellow-500/10 text-yellow-400'
                }`}>
                  {a.status}
                </span>
                <a 
                  href={`tel:${a.telefone.replace(/\D/g, '')}`}
                  className="p-1.5 bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
          {agendamentosMock.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              Nenhum agendamento
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
