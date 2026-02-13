"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Calendar, DollarSign, Settings, Bell } from "lucide-react"
import { Toaster } from 'sonner' // 1. Importação necessária

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
      {/* 2. O Toaster precisa estar aqui para os balõezinhos aparecerem */}
      <Toaster position="top-right" theme="dark" richColors />

      {/* SIDEBAR */}
      <aside className="w-64 border-r border-zinc-800 p-6 flex flex-col">
        <div className="flex flex-col mb-10">
          <span className="text-xl font-bold italic tracking-tighter text-white">CutFlow</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 -mt-1">Gestão Premium</span>
        </div>

        <nav className="flex flex-col gap-1 text-sm">
          {/* Dashboard */}
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all relative ${
              pathname === "/dashboard"
                ? "text-white bg-white/5"
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
                ? "text-white bg-white/5"
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
                ? "text-white bg-white/5"
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
                ? "text-white bg-white/5"
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
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-8 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-10">
          <h2 className="text-lg font-semibold tracking-tight">
            {getPageTitle()}
          </h2>

          <div className="flex items-center gap-4">
            <button className="w-9 h-9 rounded-full bg-zinc-900 border border-white/5 hover:bg-zinc-800 transition flex items-center justify-center text-zinc-400 hover:text-white">
              <Bell size={18} />
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-white/5">
              <div className="flex flex-col items-end mr-1">
                <span className="text-xs font-bold text-white">Kauã Castro</span>
                <span className="text-[10px] text-zinc-500 uppercase">Barbeiro</span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center font-bold shadow-lg">
                K
              </div>
            </div>
          </div>
        </header>

        {/* MAIN */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto bg-[#080808]">
          {children}
        </main>
      </div>
    </div>
  )
}