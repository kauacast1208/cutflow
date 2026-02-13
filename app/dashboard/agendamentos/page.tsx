'use client'

import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { Check, X, Clock, User, Scissors, Calendar as CalendarIcon } from 'lucide-react'
import { toast, Toaster } from 'sonner'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AgendamentosAdminPage() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Busca os agendamentos no banco
  async function fetchAppointments() {
    setLoading(true)
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        services (
          name,
          price
        )
      `)
      .order('date', { ascending: true })

    if (error) {
      toast.error("Erro ao carregar agendamentos")
    } else {
      setAppointments(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

  // Função para mudar o status (Confirmar/Cancelar)
  async function updateStatus(id: string, newStatus: string) {
    const { error } = await supabase
      .from('appointments')
      .update({ status: newStatus })
      .eq('id', id)

    if (error) {
      toast.error("Erro ao atualizar")
    } else {
      toast.success(`Agendamento ${newStatus === 'confirmed' ? 'confirmado' : 'cancelado'}!`)
      fetchAppointments() // Atualiza a lista
    }
  }

  return (
    <div className="space-y-8">
      <Toaster theme="dark" />
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agendamentos</h1>
          <p className="text-zinc-500">Gerencie a agenda da sua barbearia em tempo real.</p>
        </div>
        <button 
          onClick={fetchAppointments}
          className="bg-zinc-800 hover:bg-zinc-700 p-2 rounded-lg transition-all"
        >
          <Clock size={20} />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {appointments.length === 0 && (
            <p className="text-center py-10 text-zinc-600">Nenhum agendamento encontrado.</p>
          )}

          {appointments.map((appt) => (
            <div 
              key={appt.id} 
              className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center font-bold text-lg border border-zinc-700">
                  {appt.client_name[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    {appt.client_name}
                    {appt.status === 'confirmed' && <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full border border-green-500/20 uppercase">Confirmado</span>}
                    {appt.status === 'pending' && <span className="text-[10px] bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded-full border border-yellow-500/20 uppercase">Pendente</span>}
                  </h3>
                  <div className="flex flex-wrap gap-4 mt-1 text-sm text-zinc-500">
                    <span className="flex items-center gap-1"><Scissors size={14} /> {appt.services?.name}</span>
                    <span className="flex items-center gap-1"><CalendarIcon size={14} /> {new Date(appt.date).toLocaleDateString('pt-BR')}</span>
                    <span className="flex items-center gap-1"><Clock size={14} /> {new Date(appt.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {appt.status !== 'confirmed' && (
                  <button 
                    onClick={() => updateStatus(appt.id, 'confirmed')}
                    className="flex-1 md:flex-none bg-white text-black hover:bg-zinc-200 px-4 py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
                  >
                    <Check size={16} /> Confirmar
                  </button>
                )}
                <button 
                  onClick={() => updateStatus(appt.id, 'canceled')}
                  className="flex-1 md:flex-none bg-zinc-800 hover:bg-red-500/20 hover:text-red-500 px-4 py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all text-zinc-400"
                >
                  <X size={16} /> Cancelar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}