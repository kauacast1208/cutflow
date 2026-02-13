import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#060606] text-white selection:bg-white selection:text-black">
      {/* Header */}
      <nav className="flex items-center justify-between p-6 lg:px-20 border-b border-white/10">
        <div className="flex flex-col">
          <span className="text-2xl font-bold tracking-tighter italic">CutFlow</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 -mt-1">Gestão Premium</span>
        </div>
        <Link 
          href="/login" 
          className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-gray-200 transition-all text-sm"
        >
          Acessar Painel
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center text-center px-6 pt-24 pb-20">
        <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tighter mb-6 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
          Domine a agenda da <br /> sua barbearia.
        </h1>
        <p className="max-w-2xl text-gray-400 text-lg lg:text-xl mb-10 leading-relaxed">
          O CutFlow é o sistema definitivo para barbeiros que buscam organização, 
          controle financeiro e agilidade no atendimento. Tudo em um só lugar.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/login" 
            className="bg-white text-black px-10 py-4 rounded-xl font-bold hover:scale-105 transition-all text-lg shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            Começar Agora
          </Link>
        </div>

        {/* Mockup Simples */}
        <div className="mt-20 w-full max-w-5xl rounded-2xl border border-white/10 bg-white/5 p-4 shadow-2xl overflow-hidden">
           <div className="aspect-video rounded-lg bg-[#0c0c0c] flex items-center justify-center border border-white/5">
              <p className="text-gray-500 italic">Visualizando Dashboard do Sistema...</p>
           </div>
        </div>
      </main>

      {/* Rodapé */}
      <footer className="py-10 text-center text-gray-600 text-sm border-t border-white/5">
        © 2026 CutFlow - Todos os direitos reservados.
      </footer>
    </div>
  )
}