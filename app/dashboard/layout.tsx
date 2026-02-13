"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Calendar, DollarSign, Settings } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard"
    if (pathname === "/dashboard/agendamentos") return "Agendamentos"
    if (pathname === "/dashboard/financeiro") return "Financeiro"
    if (pathname === "/dashboard/configuracoes") return "Configurações"
    return "Dashboard"
  }

  return (
    <div className="flex h-screen bg-zinc-950 text-white">

      {/* SIDEBAR */}
      <aside className="w-64 border-r border-zinc-800 p-6 flex flex-col">
        <h1 className="text-xl font-semibold mb-10">CutFlow</h1>

<nav className="flex flex-col gap-1 text-sm">

  {/* Dashboard */}
  <Link
    href="/dashboard"
    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all relative ${
      pathname === "/dashboard"
        ? "text-white"
        : "text-zinc-400 hover:text-white hover:bg-zinc-800"
    }`}
  >
    {pathname === "/dashboard" && (
      <span className="absolute left-0 top-0 h-full w-1 bg-white rounded-r-full" />
    )}
    <LayoutDashboard className="w-4 h-4" />
    Dashboard
  </Link>

  {/* Agendamentos */}
  <Link
    href="/dashboard/agendamentos"
    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all relative ${
      pathname === "/dashboard/agendamentos"
        ? "text-white"
        : "text-zinc-400 hover:text-white hover:bg-zinc-800"
    }`}
  >
    {pathname === "/dashboard/agendamentos" && (
      <span className="absolute left-0 top-0 h-full w-1 bg-white rounded-r-full" />
    )}
    <Calendar className="w-4 h-4" />
    Agendamentos
  </Link>

  {/* Financeiro */}
  <Link
    href="/dashboard/financeiro"
    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all relative ${
      pathname === "/dashboard/financeiro"
        ? "text-white"
        : "text-zinc-400 hover:text-white hover:bg-zinc-800"
    }`}
  >
    {pathname === "/dashboard/financeiro" && (
      <span className="absolute left-0 top-0 h-full w-1 bg-white rounded-r-full" />
    )}
    <DollarSign className="w-4 h-4" />
    Financeiro
  </Link>

  {/* Configurações */}
  <Link
    href="/dashboard/configuracoes"
    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all relative ${
      pathname === "/dashboard/configuracoes"
        ? "text-white"
        : "text-zinc-400 hover:text-white hover:bg-zinc-800"
    }`}
  >
    {pathname === "/dashboard/configuracoes" && (
      <span className="absolute left-0 top-0 h-full w-1 bg-white rounded-r-full" />
    )}
    <Settings className="w-4 h-4" />
    Configurações
  </Link>

</nav>

      </aside>

      {/* CONTEÚDO */}
      <div className="flex-1 flex flex-col">

        {/* HEADER SUPERIOR */}
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-8">
          <h2 className="text-lg font-semibold">
            {getPageTitle()}
          </h2>

          <div className="flex items-center gap-4">
            
            {/* Notificação */}
            <button className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 transition flex items-center justify-center">
              🔔
            </button>

            {/* Avatar */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-semibold">
                K
              </div>
              <span className="text-sm text-zinc-300">
                Kauã
              </span>
            </div>

          </div>
        </header>

        {/* MAIN */}
        <main className="flex-1 p-10 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  )
}
