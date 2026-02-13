'use client'

import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { DollarSign, Users, Clock, AlertCircle, TrendingUp } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function DashboardPrincipal() {
  const [stats, setStats] = useState({ daily: 0, pending: 0, totalClients: 0 })
  const [pendingList, setPendingList] = useState<any[]>([])

  useEffect(() => {
    async function getStats() {
      const today = new Date().toISOString().split('T')[0]

      // 1. Puxa TUDO para calcular
      const { data: allAppts } = await supabase
        .from('appointments')
        .select('*, services(price)')

      if (allAppts) {
        // Faturamento Diário (Confirmados hoje)
        const dailyRevenue = allAppts
          .filter(a => a.status === 'confirmed' && a.date.startsWith(today))
          .reduce((acc, curr) => acc + (curr.services?.price || 0), 0)

        // Pagamentos Pendentes (Status 'pending')
        const pendingRevenue = allAppts
          .filter(a => a.status === 'pending')
          .reduce((acc, curr) => acc + (curr.services?.price || 0), 0)

        // Total de Clientes Únicos
        const uniqueClients = new Set(allAppts.map(a => a.client_name)).size

        setStats({
          daily: dailyRevenue,
          pending: pendingRevenue,
          totalClients: uniqueClients
        })

        // Lista os top 3 pendentes
        setPendingList(allAppts.filter(a => a.status === 'pending').slice(0, 3))
      }
    }

    getStats()
  }, [])

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter">Financeiro & Fluxo</h1>
        <p className="text-zinc-500">Controle de caixa e atendimentos pendentes.</p>
      </div>

      {/* CARDS DE STATUS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* FATURAMENTO DIÁRIO */}
        <div className="bg-white text-black p-6 rounded-[2rem] shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-black text-white rounded-xl"><TrendingUp size={18}/></div>
            <span className="text-[10px] font-black uppercase tracking-widest italic">Hoje</span>
          </div>
          <p className="text-xs font-bold opacity-60 uppercase">Faturamento Diário</p>
          <p className="text-4xl font-black italic leading-none mt-1">R$ {stats.daily.toFixed(2)}</p>
        </div>

        {/* PENDENTES */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem]">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-500 text-black rounded-xl"><AlertCircle size={18}/></div>
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic">A Receber</span>
          </div>
          <p className="text-xs font-bold text-zinc-500 uppercase">Pagamentos Pendentes</p>
          <p className="text-4xl font-black text-yellow-500 leading-none mt-1">R$ {stats.pending.toFixed(2)}</p>
        </div>

        {/* CLIENTES */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem]">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-zinc-800 text-white rounded-xl"><Users size={18}/></div>
          </div>
          <p className="text-xs font-bold text-zinc-500 uppercase">Base de Clientes</p>
          <p className="text-4xl font-black leading-none mt-1">{stats.totalClients}</p>
        </div>
      </div>

      {/* SEÇÃO DE PENDENTES RÁPIDA */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-[2.5rem] p-8">
        <h2 className="text-xl font-black italic uppercase mb-6 flex items-center gap-2">
          <Clock className="text-zinc-500" size={20} /> Próximos Pendentes
        </h2>
        
        <div className="space-y-4">
          {pendingList.length === 0 ? (
            <p className="text-zinc-600 text-sm italic">Nenhum pagamento pendente no momento.</p>
          ) : (
            pendingList.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                <div>
                  <p className="font-bold text-white uppercase text-sm italic">{item.client_name}</p>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase">{item.services?.name || 'Serviço'}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-white italic">R$ {item.services?.price.toFixed(2)}</p>
                  <p className="text-[10px] text-yellow-500 font-black uppercase">Aguardando</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}