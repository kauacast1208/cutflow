import { Scissors, Calendar, BarChart3, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#060606] text-white">
      {/* Header */}
      <nav className="flex items-center justify-between p-6 lg:px-20 border-b border-white/10">
        <div className="flex flex-col">
          <span className="text-2xl font-bold italic tracking-tighter text-white">CutFlow</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 -mt-1">Gestão Premium</span>
        </div>
        <Link href="/login" className="bg-white text-black px-6 py-2 rounded-full font-medium text-sm hover:bg-gray-200 transition-all">
          Acessar Painel
        </Link>
      </nav>

      <main className="px-6 py-20 text-center">
        <h1 className="text-5xl lg:text-7xl font-extrabold mb-6 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent tracking-tighter">
          Domine sua agenda.
        </h1>
        <p className="max-w-2xl mx-auto text-gray-400 text-lg mb-12">
          O sistema definitivo para barbearias que buscam excelência no atendimento e controle total do negócio.
        </p>
        
        <Link href="/login" className="bg-white text-black px-10 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
          Começar Agora
        </Link>

        {/* Seção de Vantagens */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-24 max-w-6xl mx-auto">
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all text-center">
            <Calendar className="w-8 h-8 mb-4 text-white mx-auto" />
            <h3 className="font-bold mb-2">Agendamento</h3>
            <p className="text-sm text-gray-500">Gestão de horários simplificada.</p>
          </div>
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all text-center">
            <BarChart3 className="w-8 h-8 mb-4 text-white mx-auto" />
            <h3 className="font-bold mb-2">Relatórios</h3>
            <p className="text-sm text-gray-500">Acompanhe seu faturamento real.</p>
          </div>
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all text-center">
            <Scissors className="w-8 h-8 mb-4 text-white mx-auto" />
            <h3 className="font-bold mb-2">Serviços</h3>
            <p className="text-sm text-gray-500">Preços e tempos personalizados.</p>
          </div>
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all text-center">
            <ShieldCheck className="w-8 h-8 mb-4 text-white mx-auto" />
            <h3 className="font-bold mb-2">Cloud</h3>
            <p className="text-sm text-gray-500">Acesse de qualquer lugar.</p>
          </div>
        </div>
      </main>
    </div>
  )
}