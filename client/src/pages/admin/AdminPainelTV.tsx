import { ordensServicoMock, statusList, recursosMock } from "@/lib/mockData";

export default function AdminPainelTV() {
  const osAtivas = ordensServicoMock.filter(os => os.status !== "Entregue");

  const getStatusColor = (status: string) => {
    const s = statusList.find(st => st.status === status);
    return s?.cor || "#6B7280";
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white">Doctor Auto Prime</h1>
          <p className="text-gray-400 text-xl">Painel de Acompanhamento</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-white">{new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</p>
          <p className="text-gray-400">{new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}</p>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4 mb-8">
        {statusList.slice(0, 5).map((status) => {
          const count = osAtivas.filter(os => os.status === status.status).length;
          return (
            <div key={status.id} className="bg-white/5 rounded-xl p-6 text-center">
              <p className="text-5xl font-bold" style={{ color: status.cor }}>{count}</p>
              <p className="text-gray-400 mt-2">{status.status}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {osAtivas.map((os) => (
          <div key={os.id} className="bg-white/5 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-white">{os.placa}</span>
              <span
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{ backgroundColor: `${getStatusColor(os.status)}20`, color: getStatusColor(os.status) }}
              >
                {os.status}
              </span>
            </div>
            <p className="text-gray-400">{os.veiculo}</p>
            <p className="text-gray-500 text-sm">{os.cliente}</p>
            <div className="mt-4 flex justify-between text-sm">
              <span className="text-gray-400">{os.mecanico}</span>
              <span className="text-gray-400">{os.recurso}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-white mb-4">Recursos</h2>
        <div className="flex flex-wrap gap-3">
          {recursosMock.map((recurso) => (
            <div
              key={recurso.id}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                recurso.ocupado ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"
              }`}
            >
              {recurso.nomeRecurso}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
