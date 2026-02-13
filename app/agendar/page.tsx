'use client'

import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { CalendarDays, Clock3, User, Scissors } from 'lucide-react'

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
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  // Buscar serviços disponíveis para o cliente escolher
  useEffect(() => {
    async function fetchServices() {
      const { data } = await supabase.from("services").select("*")
      if (data) setServices(data)
    }
    fetchServices()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')

    const { error } = await supabase
      .from("appointments") // Tabela onde salvamos os agendamentos
      .insert([{ 
        client_name: name,
        date: `${date}T${time}:00`,
        service_id: selectedService,
        status: 'pending'
      }])

    if (error) {
      console.error(error)
      setStatus('error')
    } else {
      setStatus('success')
      setName('')
      setDate('')
      setTime('')
      setSelectedService('')
    }
  }

  return (
    <div className="min-h-screen bg-[#060606] text-white p-6 flex items-center justify-center">
      <div className="bg-[#111] border border-white/5 p-8 rounded-2xl w-full max-w-lg shadow-2xl">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Agendar seu Corte</h1>
        <p className="text-gray-500 mb-8">Preencha os dados abaixo para garantir seu horário.</p>

        {status === 'success' && (
          <div className="bg-green-500/10 border border-green-500 text-green-300 p-4 rounded-xl mb-6 text-center font-medium">
            Agendamento solicitado com sucesso! Aguarde a confirmação.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome */}
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

          {/* Serviço */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Scissors size={16} /> Serviço
            </label>
            <select 
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-xl p-3 text-white outline-none focus:border-white/40 appearance-none"
              required
            >
              <option value="" className="bg-black">Selecione o serviço...</option>
              {services.map(service => (
                <option key={service.id} value={service.id} className="bg-black">
                  {service.name} - R$ {service.price.toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          {/* Data e Hora */}
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
            disabled={status === 'loading'}
            className="w-full bg-white text-black hover:bg-gray-200 p-4 rounded-xl font-bold transition-all shadow-lg disabled:opacity-50"
          >
            {status === 'loading' ? 'Agendando...' : 'Confirmar Agendamento'}
          </button>
        </form>
      </div>
    </div>
  )
}