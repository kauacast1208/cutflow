'use client'

import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { CalendarDays, Clock3, User, Check, Scissors } from 'lucide-react'
import { toast, Toaster } from 'sonner' // Adicionamos o Toaster aqui também para garantir

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AgendarClientePage() {
  const [services, setServices] = useState<any[]>([])
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchServices() {
      const { data } = await supabase.from("services").select("*")
      if (data) setServices(data)
    }
    fetchServices()
  }, [])

  const toggleService = (id: string) => {
    setSelectedServices(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (selectedServices.length === 0) return toast.error("Selecione um serviço!")
    setLoading(true)

    const serviceNames = services
      .filter(s => selectedServices.includes(s.id))
      .map(s => s.name).join(", ")

    const { error } = await supabase.from("appointments").insert([{ 
      client_name: name,
      date: `${date}T${time}:00`,
      notes: `Serviços: ${serviceNames}`,
      status: 'pending'
    }])

    if (error) toast.error("Erro ao agendar")
    else {
      toast.success("Agendado com sucesso!")
      setName(''); setDate(''); setTime(''); setSelectedServices([])
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 flex items-center justify-center font-sans">
      <Toaster theme="dark" position="top-center" />
      
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl w-full max-w-lg shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold italic tracking-tighter">CutFlow</h1>
          <p className="text-zinc-500 text-sm mt-1">Reserve seu horário em segundos</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <User size={14} /> Seu Nome completo
            </label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-white outline-none focus:border-white/20 transition-all" placeholder="Como quer ser chamado?" required />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <Scissors size={14} /> Selecione os Serviços
            </label>
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {services.map(service => (
                <div key={service.id} onClick={() => toggleService(service.id)} className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${selectedServices.includes(service.id) ? "bg-white text-black border-white" : "bg-zinc-950 border-zinc-800 hover:border-zinc-600"}`}>
                  <span className="font-bold text-sm">{service.name}</span>
                  <span className={`text-xs ${selectedServices.includes(service.id) ? "text-black/60" : "text-green-400"}`}>R$ {service.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2"><CalendarDays size={14} /> Data</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-white outline-none focus:border-white/20" required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2"><Clock3 size={14} /> Hora</label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-white outline-none focus:border-white/20" required />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-white text-black p-5 rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 shadow-xl shadow-white/5">
            {loading ? 'Reservando...' : 'Finalizar Agendamento'}
          </button>
        </form>
      </div>
    </div>
  )
}