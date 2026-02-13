'use client'

import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { DollarSign, Users, Calendar, TrendingUp } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function DashboardPrincipal() {
  const [stats, setStats] = useState({ revenue: 0, clients: 0, appointments: 0 })
  const [nextClient, setNextClient] = useState<any>(null)

  useEffect(() => {
    async function getStats() {
      // Puxa agendamentos confirmados para calcular faturamento
      const { data: appts } = await supabase
        .from('appointments')
        .select('*, services(price)')
        .eq('status', 'confirmed')

      const totalRevenue = appts?.reduce((acc, curr) => acc + (curr.services?.price || 0), 0) || 0
      
      setStats({
        revenue: totalRevenue,
        clients: appts?.length || 0,
        appointments: appts?.length || 0
      })

      // Puxa o próximo cliente do dia
      const { data: next } = await supabase
        .from('appointments')
        .select('*, services(name)')
        .eq('status', 'confirmed')
        .order('date', { ascending: true })
        .limit(1)
        .single()

      if (next) setNextClient(next)
    }

    getStats()
  }, [])

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter">Resumo Geral</h1>
        <p className="text-zinc-500">O que está acontecendo na CutFlow hoje.</p>
      </div>

      {/* CARDS DE STATUS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-[2rem]">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white text-black rounded-2xl"><DollarSign size={20}/></div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Faturamento <br/> Confirmado</span>
          </div>
          <p className="text-4xl font-black">R$ {stats.revenue.toFixed(2)}</p>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-[2rem]">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-zinc-800 text-white rounded-2xl"><Users size={20}/></div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Clientes <br/> Atendidos</span>
          </div>
          <p className="text-4xl font-black">{stats.clients}</p>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-[2rem]">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-zinc-800 text-white rounded-2xl"><Calendar size={20}/></div>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Agendamentos <br/> Totais</span>
          </div>
          <p className="text-4xl font-black">{stats.appointments}</p>
        </div>
      </div>

      {/* PRÓXIMO CLIENTE DESTAQUE */}
      {nextClient && (
        <div className="bg-white text-black p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-white/5">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center text-3xl font-black italic border-4 border-zinc-200">
              {nextClient.client_name[0]}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-1">Próximo da Fila</p>
              <h2 className="text-3xl font-black italic uppercase leading-none">{nextClient.client_name}</h2>
              <p className="font-bold opacity-60 mt-1">{nextClient.services?.name} • {new Date(nextClient.date).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</p>
            </div>
          </div>
          <div className="px-6 py-3 border-2 border-black rounded-full font-black uppercase tracking-widest text-sm">
            Prepare a Tesoura ✂️
          </div>
        </div>
      )}
    </div>
  )
}