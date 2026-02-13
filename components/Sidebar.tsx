export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-zinc-900 text-white p-6 flex flex-col justify-between">
      
      <div>
        <h1 className="text-2xl font-bold mb-10">BarberPro</h1>

        <nav className="flex flex-col gap-4 text-zinc-300">
          <a href="/dashboard" className="hover:text-white transition">
            Dashboard
          </a>

          <a href="/dashboard/agendamentos" className="hover:text-white transition">
            Agendamentos
          </a>

          <a href="/dashboard/financeiro" className="hover:text-white transition">
            Financeiro
          </a>

          <a href="/dashboard/configuracoes" className="hover:text-white transition">
            Configurações
          </a>
        </nav>
      </div>

      <div className="text-sm text-zinc-500">
        © 2026 BarberPro
      </div>
    </aside>
  );
}
