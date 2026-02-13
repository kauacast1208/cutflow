'use client'

import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AgendamentosPage() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchAppointments() {
    const { data, error } = await supabase
      .from("appointments")
      .select("*, services(name, price)")
      .order("appointment_date", { ascending: true })
      .order("appointment_time", { ascending: true })

    if (!error) setAppointments(data || [])
    setLoading(false)
  }

  async function updateStatus(id: string, newStatus: string) {
    const { error } = await supabase
      .from("appointments")
      .update({ status: newStatus })
      .eq("id", id)

    if (!error) fetchAppointments()
  }

  useEffect(() => { fetchAppointments() }, [])

  return (
    <div className="p-8 max-w-6xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-8">Agenda do Dia</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-zinc-500">Carregando...</p>
        ) : appointments.length === 0 ? (
          <p className="text-zinc-500 col-span-full text-center py-10">Nenhum agendamento.</p>
        ) : (
          appointments.map((app) => (
            <div key={app.id} className={`bg-zinc-900 border ${app.status === 'concluído' ? 'border-green-900/50' : 'border-zinc-800'} p-5 rounded-xl transition-all`}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold">{app.client_name}</h3>
                  <span className="text-xs text-zinc-500 uppercase font-mono">{app.status}</span>
                </div>
                <span className="text-xs bg-blue-950 text-blue-300 px-2 py-1 rounded-full">
                  {new Date(app.appointment_date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}
                </span>
              </div>
              
              <div className="space-y-1 mb-4">
                <p className="text-sm text-zinc-300">📅 {app.appointment_time.substring(0, 5)}</p>
                <p className="text-sm text-zinc-300">✂️ {app.services?.name}</p>
                <p className="text-sm font-bold text-green-400">R$ {app.services?.price}</p>
              </div>

              <div className="flex flex-col gap-2 border-t border-zinc-800 pt-3 mt-3">
                {/* BOTÃO WHATSAPP COM MENSAGEM */}
                {app.client_phone && (
                  <a 
                    href={`https://wa.me/55${app.client_phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                      `Olá ${app.client_name}, tudo bem? Aqui é do CutFlow! Passando para confirmar seu horário de ${app.services?.name} hoje às ${app.appointment_time.substring(0, 5)}. Podemos confirmar?`
                    )}`} 
                    target="_blank"
                    className="bg-green-600/10 hover:bg-green-600 text-green-500 hover:text-white text-xs font-bold py-2 px-3 rounded transition-all text-center"
                  >
                    💬 Confirmar por Whats
                  </a>
                )}
                
                {app.status === 'pendente' && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => updateStatus(app.id, 'concluído')}
                      className="flex-1 bg-zinc-800 hover:bg-green-700 text-white text-xs font-bold py-2 rounded transition-all"
                    >
                      CONCLUIR
                    </button>
                    <button 
                      onClick={() => updateStatus(app.id, 'cancelado')}
                      className="flex-1 bg-zinc-800 hover:bg-red-700 text-white text-xs font-bold py-2 rounded transition-all"
                    >
                      CANCELAR
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}