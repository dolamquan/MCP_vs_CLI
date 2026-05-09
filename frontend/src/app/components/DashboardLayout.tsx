import { Link, useLocation } from "react-router";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  Terminal,
  BarChart3,
  History,
  Settings,
  Home,
  Activity,
  ChevronRight,
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Minimal Sidebar */}
      <aside className="w-64 bg-black border-r border-white/5 flex flex-col py-8">
        {/* Logo */}
        <div className="px-8 mb-16">
          <Link to="/" className="flex items-center gap-2">
            <Terminal className="w-6 h-6 text-green-400" />
            <span className="text-xl">CLI vs MCP</span>
          </Link>
        </div>

        {/* Navigation - Minimal */}
        <nav className="flex-1 px-4 space-y-1">
          <Link
            to="/dashboard"
            className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 ${
              isActive("/dashboard")
                ? "bg-white/5 text-white"
                : "text-gray-500 hover:text-white hover:bg-white/5"
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/dashboard/analyze"
            className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 ${
              isActive("/dashboard/analyze")
                ? "bg-white/5 text-white"
                : "text-gray-500 hover:text-white hover:bg-white/5"
            }`}
          >
            <Activity className="w-5 h-5" />
            <span>Analyze</span>
          </Link>
          <Link
            to="/dashboard/compare"
            className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 ${
              isActive("/dashboard/compare")
                ? "bg-white/5 text-white"
                : "text-gray-500 hover:text-white hover:bg-white/5"
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>Compare</span>
          </Link>
          <Link
            to="/dashboard/history"
            className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 ${
              isActive("/dashboard/history")
                ? "bg-white/5 text-white"
                : "text-gray-500 hover:text-white hover:bg-white/5"
            }`}
          >
            <History className="w-5 h-5" />
            <span>History</span>
          </Link>
          <Link
            to="/dashboard/settings"
            className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 ${
              isActive("/dashboard/settings")
                ? "bg-white/5 text-white"
                : "text-gray-500 hover:text-white hover:bg-white/5"
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
        </nav>

        {/* User Profile - Minimal */}
        <div className="px-4 mt-8">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all duration-300 cursor-pointer group">
            <Avatar className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500">
              <AvatarFallback className="bg-transparent text-white text-sm">AI</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="text-sm">AI User</div>
              <div className="text-xs text-gray-500">Premium Account</div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
          </div>
        </div>
      </aside>

      {/* Main Content - Minimal & Spacious */}
      <main className="flex-1 overflow-auto bg-black">
        {children}
      </main>
    </div>
  );
}
