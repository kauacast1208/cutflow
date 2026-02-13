'use client'

import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { CalendarClock, CheckCircle, XCircle, Clock3, User } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AgendamentosPage() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAppointments() {
      setLoading(true)
      // Buscamos o agendamento e o nome do serviço relacionado
      const { data, error } = await supabase
        .from("appointments")
        .select("*, services(name, price)")
        .order('date', { ascending: true })
      
      if (!error) setAppointments(data || [])
      setLoading(false)
    }
    fetchAppointments()
  }, [])

  async function updateStatus(id: string, newStatus: string) {
    const { error } = await supabase
      .from("appointments")
      .update({ status: newStatus })
      .eq("id", id)
    
    if (!error) {
      // Atualiza a lista localmente para não precisar recarregar
      setAppointments(prev => 
        prev.map(app => app.id === id ? {...app, status: newStatus} : app)
      )
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto text-white animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agenda</h1>
          <p className="text-gray-500">Gerencie todos os cortes agendados.</p>
        </div>
      </div>

      <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/[0.02] border-b border-white/5">
              <th className="p-5 text-sm font-medium text-gray-400">Cliente</th>
              <th className="p-5 text-sm font-medium text-gray-400">Serviço</th>
              <th className="p-5 text-sm font-medium text-gray-400">Data/Hora</th>
              <th className="p-5 text-sm font-medium text-gray-400 text-center">Status</th>
              <th className="p-5 text-sm font-medium text-gray-400 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={5} className="p-12 text-center text-gray-500">Carregando agenda...</td></tr>
            ) : appointments.length === 0 ? (
              <tr><td colSpan={5} className="p-12 text-center text-gray-500">Nenhum agendamento encontrado.</td></tr>
            ) : appointments.map((app) => (
              <tr key={app.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="p-5 flex items-center gap-3">
                  <div className="bg-white/5 p-2 rounded-full"><User size={18} className="text-gray-400"/></div>
                  <span className="font-medium text-white">{app.client_name}</span>
                </td>
                <td className="p-5 text-gray-300">
                  {app.services?.name || 'Serviço'}
                  <p className="text-xs text-gray-500">R$ {app.services?.price.toFixed(2)}</p>
                </td>
                <td className="p-5 text-gray-300">
                  {new Date(app.date).toLocaleDateString('pt-BR')}
                  <p className="text-xs text-gray-500">{new Date(app.date).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</p>
                </td>
                <td className="p-5 text-center">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                    app.status === 'confirmed' ? 'bg-green-500/10 text-green-400' :
                    app.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                    'bg-red-500/10 text-red-400'
                  }`}>
                    {app.status === 'confirmed' ? <CheckCircle size={14} /> :
                     app.status === 'pending' ? <Clock3 size={14} /> :
                     <XCircle size={14} />}
                    {app.status === 'confirmed' ? 'Confirmado' : app.status === 'pending' ? 'Pendente' : 'Cancelado'}
                  </span>
                </td>
                <td className="p-5 text-right space-x-2">
                  {app.status === 'pending' && (
                    <button 
                      onClick={() => updateStatus(app.id, 'confirmed')}
                      className="text-green-400 hover:text-green-300 text-sm font-medium p-2 rounded-lg hover:bg-green-500/10 transition"
                    >
                      Confirmar
                    </button>
                  )}
                  <button 
                    onClick={() => updateStatus(app.id, 'cancelled')}
                    className="text-gray-500 hover:text-red-400 text-sm font-medium p-2 rounded-lg hover:bg-red-500/10 transition"
                  >
                    Cancelar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}