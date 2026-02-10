import { Route, Switch } from "wouter";
import { Toaster } from "sonner";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminNovaOS from "./pages/admin/AdminNovaOS";
import AdminOSDetalhes from "./pages/admin/AdminOSDetalhes";
import AdminPatioDetalhes from "./pages/admin/AdminPatioDetalhes";
import AdminAgendamentos from "./pages/admin/AdminAgendamentos";
import AdminConfiguracoes from "./pages/admin/AdminConfiguracoes";
import AdminDocumentacao from "./pages/admin/AdminDocumentacao";
import AdminMechanicAnalytics from "./pages/admin/AdminMechanicAnalytics";
import AdminMechanicFeedback from "./pages/admin/AdminMechanicFeedback";
import OrdensServico from "./pages/admin/OrdensServico";
import GestaoDashboards from "./pages/gestao/GestaoDashboards";
import GestaoRH from "./pages/gestao/GestaoRH";
import GestaoOperacoes from "./pages/gestao/GestaoOperacoes";
import GestaoFinanceiro from "./pages/gestao/GestaoFinanceiro";
import GestaoTecnologia from "./pages/gestao/GestaoTecnologia";
import GestaoComercial from "./pages/gestao/GestaoComercial";
import GestaoMelhorias from "./pages/gestao/GestaoMelhorias";

export default function App() {
  return (
    <>
      <Switch>
        {/* Admin Routes */}
        <Route path="/" component={AdminDashboard} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/nova-os" component={AdminNovaOS} />
        <Route path="/admin/os/:id" component={AdminOSDetalhes} />
        <Route path="/admin/patio" component={AdminPatioDetalhes} />
        <Route path="/admin/patio/:id" component={AdminPatioDetalhes} />
        <Route path="/admin/agendamentos" component={AdminAgendamentos} />
        <Route path="/admin/configuracoes" component={AdminConfiguracoes} />
        <Route path="/admin/documentacao" component={AdminDocumentacao} />
        <Route path="/admin/mecanicos/analytics" component={AdminMechanicAnalytics} />
        <Route path="/admin/mecanicos/feedback" component={AdminMechanicFeedback} />
        <Route path="/admin/ordens-servico" component={OrdensServico} />

        {/* Gestão Routes */}
        <Route path="/gestao" component={GestaoDashboards} />
        <Route path="/gestao/rh" component={GestaoRH} />
        <Route path="/gestao/operacoes" component={GestaoOperacoes} />
        <Route path="/gestao/financeiro" component={GestaoFinanceiro} />
        <Route path="/gestao/tecnologia" component={GestaoTecnologia} />
        <Route path="/gestao/comercial" component={GestaoComercial} />
        <Route path="/gestao/melhorias" component={GestaoMelhorias} />

        {/* Fallback */}
        <Route>
          <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-2">404</h1>
              <p className="text-slate-400">Página não encontrada</p>
            </div>
          </div>
        </Route>
      </Switch>
      <Toaster richColors position="top-right" />
    </>
  );
}
