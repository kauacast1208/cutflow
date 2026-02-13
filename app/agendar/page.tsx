'use client'

import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { CalendarDays, Clock3, User, Scissors, CheckCircle2 } from 'lucide-react'
import { toast, Toaster } from 'sonner'
import "../globals.css";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Lista de horários disponíveis
const availableTimes = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", 
  "17:00", "17:30", "18:00", "18:30", "19:00"
]

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
    if (!time) return toast.error("Selecione um horário")
    
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
      toast.success("Agendamento solicitado!")
      setName(''); setDate(''); setTime(''); setSelectedService('')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#060606] text-white p-4 md:p-8 flex items-center justify-center font-sans">
      <Toaster theme="dark" position="top-center" />
      
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">CutFlow</h1>
          <p className="text-zinc-500 text-sm mt-2">Agendamento rápido e exclusivo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-zinc-950 border border-zinc-900 p-6 md:p-10 rounded-[2.5rem] shadow-2xl">
          
          {/* NOME */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <User size={14} /> Seu Nome
            </label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white outline-none focus:border-white/20 transition-all"
              placeholder="Como quer ser chamado?"
              required
            />
          </div>

          {/* SERVIÇOS */}
          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <Scissors size={14} /> O que vamos fazer hoje?
            </label>
            <div className="grid grid-cols-1 gap-2">
              {services.map(service => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => setSelectedService(service.id)}
                  className={`p-4 rounded-2xl border transition-all text-left flex justify-between items-center ${
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

          {/* DATA */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <CalendarDays size={14} /> Escolha o Dia
            </label>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-white outline-none focus:border-white/20 transition-all appearance-none"
              required
            />
          </div>

          {/* HORÁRIOS EM BOTÕES */}
          {date && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                <Clock3 size={14} /> Horários Disponíveis
              </label>
              <div className="grid grid-cols-4 gap-2">
                {availableTimes.map(slot => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTime(slot)}
                    className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                      time === slot 
                      ? "border-white bg-white text-black" 
                      : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-600"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black hover:scale-[1.02] active:scale-[0.98] p-5 rounded-2xl font-black uppercase tracking-widest transition-all disabled:opacity-50 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
          >
            {loading ? 'Confirmando...' : 'Finalizar Agendamento'}
          </button>
        </form>
      </div>
    </div>
  )
}