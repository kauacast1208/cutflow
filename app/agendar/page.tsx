'use client'

import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { CalendarDays, Clock3, User, Scissors } from 'lucide-react'
import { toast, Toaster } from 'sonner'
import "../globals.css"; // Caminho corrigido para a sua estrutura

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
    <div className="min-h-screen bg-[#060606] text-white p-6 flex items-center justify-center font-sans">
      <Toaster theme="dark" position="top-center" />
      
      <div className="bg-[#111] border border-white/5 p-8 rounded-2xl w-full max-w-lg shadow-2xl">
        <h1 className="text-3xl font-bold tracking-tight mb-2 italic text-white">CutFlow</h1>
        <p className="text-gray-500 mb-8">Preencha os dados abaixo para garantir seu horário.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <User size={16} /> Seu Nome
            </label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-xl p-3 text-white outline-none focus:border-white/40"
              placeholder="Ex: João Silva"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Scissors size={16} /> Serviço
            </label>
            <div className="grid grid-cols-1 gap-2">
              {services.map(service => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => setSelectedService(service.id)}
                  className={`p-3 rounded-xl border transition-all text-left flex justify-between ${
                    selectedService === service.id 
                    ? "border-white bg-white text-black" 
                    : "border-white/10 bg-black text-white hover:border-white/30"
                  }`}
                >
                  <span>{service.name}</span>
                  <span className="opacity-60 text-sm">R$ {service.price.toFixed(2)}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <CalendarDays size={16} /> Data
              </label>
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl p-3 text-white outline-none focus:border-white/40"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <Clock3 size={16} /> Hora
              </label>
              <input 
                type="time" 
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl p-3 text-white outline-none focus:border-white/40"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black hover:bg-gray-200 p-4 rounded-xl font-bold transition-all shadow-lg disabled:opacity-50"
          >
            {loading ? 'Agendando...' : 'Confirmar Agendamento'}
          </button>
        </form>
      </div>
    </div>
  )
}