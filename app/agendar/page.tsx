'use client'

import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { CalendarDays, Clock3, User, Scissors } from 'lucide-react'
import { toast, Toaster } from 'sonner'
import "../globals.css";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AgendarClientePage() {
  const [services, setServices] = useState<any[]>([])
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [selectedService, setSelectedService] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchServices() {
      const { data } = await supabase.from("services").select("*")
      if (data) setServices(data)
    }
    fetchServices()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedService) return toast.error("Selecione um serviço")
    
    setLoading(true)
    const { error } = await supabase
      .from("appointments")
      .insert([{ 
        client_name: name,
        date: `${date}T${time}:00`,
        service_id: selectedService,
        status: 'pending'
      }])

    if (error) {
      toast.error("Erro ao realizar agendamento")
    } else {
      toast.success("Agendamento realizado!")
      setName(''); setDate(''); setTime(''); setSelectedService('')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#060606] text-white p-4 flex items-center justify-center font-sans">
      <Toaster theme="dark" position="top-center" />
      
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black italic tracking-tighter uppercase">CutFlow</h1>
          <p className="text-zinc-500 text-sm">Agende seu horário com os melhores</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-950 border border-zinc-900 p-8 rounded-[2rem] shadow-2xl">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-zinc-500 flex items-center gap-2">
              <User size={14} /> Seu Nome
            </label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-white/20"
              placeholder="Ex: João Silva"
              required
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold uppercase text-zinc-500 flex items-center gap-2">
              <Scissors size={14} /> Serviço
            </label>
            <div className="grid grid-cols-1 gap-2">
              {services.map(service => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => setSelectedService(service.id)}
                  className={`p-4 rounded-xl border transition-all text-left flex justify-between items-center ${
                    selectedService === service.id 
                    ? "border-white bg-white text-black" 
                    : "border-zinc-800 bg-zinc-900 text-white hover:border-zinc-700"
                  }`}
                >
                  <span className="font-bold">{service.name}</span>
                  <span className="font-black">R$ {service.price.toFixed(2)}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-zinc-500 flex items-center gap-2">
                <CalendarDays size={14} /> Data
              </label>
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-white/20"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-zinc-500 flex items-center gap-2">
                <Clock3 size={14} /> Hora
              </label>
              <input 
                type="time" 
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white outline-none focus:border-white/20"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black hover:bg-zinc-200 p-4 rounded-xl font-black uppercase tracking-widest transition-all disabled:opacity-50"
          >
            {loading ? 'Agendando...' : 'Confirmar'}
          </button>
        </form>
      </div>
    </div>
  )
}