'use client'

import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function FinanceiroPage() {
  const [totalFaturado, setTotalFaturado] = useState(0)
  const [totalAtendimentos, setTotalAtendimentos] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFinanceiro() {
      // Busca agendamentos concluídos e junta com serviços para pegar o preço
      const { data, error } = await supabase
        .from("appointments")
        .select("*, services(price)")
        .eq("status", "concluído")
        // Opcional: Filtrar apenas pela data de hoje aqui no futuro
        
      if (!error && data) {
        // Soma o preço de todos os serviços concluídos
        const total = data.reduce((sum, app) => sum + (app.services?.price || 0), 0)
        setTotalFaturado(total)
        setTotalAtendimentos(data.length)
      }
      setLoading(false)
    }

    fetchFinanceiro()
  }, [])

  return (
    <div className="p-8 max-w-6xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-8">Financeiro</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card de Faturamento */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <p className="text-sm text-zinc-400 mb-1">Total Faturado</p>
          <p className="text-4xl font-extrabold text-green-400">
            {loading ? '...' : `R$ ${totalFaturado.toFixed(2)}`}
          </p>
          <p className="text-sm text-zinc-500 mt-2">
            Baseado em atendimentos concluídos
          </p>
        </div>

        {/* Card de Atendimentos */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
          <p className="text-sm text-zinc-400 mb-1">Total Atendimentos</p>
          <p className="text-4xl font-extrabold text-white">
            {loading ? '...' : totalAtendimentos}
          </p>
          <p className="text-sm text-zinc-500 mt-2">
            Serviços finalizados hoje
          </p>
        </div>
      </div>
    </div>
  )
}