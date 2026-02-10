import { useLocation } from "wouter";
import {
  Car,
  LayoutDashboard,
  ClipboardList,
  Calendar,
  Settings,
  BarChart3,
  FileText,
  Wrench,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: ClipboardList, label: "OS", path: "/admin/ordens-servico" },
  { icon: Car, label: "Pátio", path: "/admin/patio" },
  { icon: Calendar, label: "Agenda", path: "/admin/agendamentos" },
  { icon: Wrench, label: "Mecânicos", path: "/admin/mecanicos/analytics" },
  { icon: BarChart3, label: "Gestão", path: "/gestao" },
  { icon: FileText, label: "Docs", path: "/admin/documentacao" },
  { icon: Settings, label: "Config", path: "/admin/configuracoes" },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Sidebar */}
      <aside className="w-16 bg-slate-900 border-r border-slate-800 flex flex-col items-center py-4 gap-1">
        {/* Logo */}
        <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center mb-4">
          <Car className="w-6 h-6 text-white" />
        </div>

        {/* Nav Items */}
        {navItems.map((item) => {
          const isActive =
            location === item.path ||
            (item.path !== "/admin" && location.startsWith(item.path));
          return (
            <button
              key={item.path}
              onClick={() => setLocation(item.path)}
              className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center gap-0.5 transition-colors ${
                isActive
                  ? "bg-red-600/20 text-red-400"
                  : "text-slate-500 hover:text-slate-300 hover:bg-slate-800"
              }`}
              title={item.label}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[9px]">{item.label}</span>
            </button>
          );
        })}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
