'use client'

import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { CalendarDays, Clock3, User, Check } from 'lucide-react'
import { toast } from 'sonner'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AgendarClientePage() {
  const [services, setServices] = useState<any[]>([])
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  // Agora guardamos uma lista de IDs selecionados
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchServices() {
      const { data } = await supabase.from("services").select("*")
      if (data) setServices(data)
    }
    fetchServices()
  }, [])

  // Função para marcar/desmarcar serviços
  const toggleService = (id: string) => {
    setSelectedServices(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (selectedServices.length === 0) {
      return toast.error("Selecione pelo menos um serviço!")
    }
    
    setLoading(true)

    // Juntamos os nomes dos serviços para salvar no banco (ou você pode criar uma tabela pivot se preferir)
    const serviceNames = services
      .filter(s => selectedServices.includes(s.id))
      .map(s => s.name)
      .join(", ")

    const { error } = await supabase
      .from("appointments")
      .insert([{ 
        client_name: name,
        date: `${date}T${time}:00`,
        service_id: selectedServices[0], // Mantém o principal para não quebrar o banco antigo
        notes: `Serviços: ${serviceNames}`, // Salva todos os selecionados aqui
        status: 'pending'
      }])

    if (error) {
      toast.error("Erro ao agendar")
    } else {
      toast.success("Agendamento realizado!")
      setName(''); setDate(''); setTime(''); setSelectedServices([])
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#060606] text-white p-6 flex items-center justify-center">
      <div className="bg-[#111] border border-white/5 p-8 rounded-3xl w-full max-w-lg shadow-2xl">
        <h1 className="text-3xl font-bold mb-2 italic">CutFlow</h1>
        <p className="text-gray-500 mb-8 font-medium">Escolha quantos serviços desejar.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 flex items-center gap-2"><User size={16} /> Nome</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-4 text-white outline-none focus:border-white/40" placeholder="Seu nome" required />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-400">Serviços (Selecione um ou mais)</label>
            <div className="grid grid-cols-1 gap-2">
              {services.map(service => (
                <div 
                  key={service.id}
                  onClick={() => toggleService(service.id)}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedServices.includes(service.id) 
                    ? "bg-white/10 border-white/40" 
                    : "bg-black border-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-sm">{service.name}</span>
                    <span className="text-xs text-green-400">R$ {service.price.toFixed(2)}</span>
                  </div>
                  {selectedServices.includes(service.id) && <Check size={18} className="text-white" />}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 flex items-center gap-2"><CalendarDays size={16} /> Data</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-4 text-white outline-none focus:border-white/40" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 flex items-center gap-2"><Clock3 size={16} /> Hora</label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-4 text-white outline-none focus:border-white/40" required />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-white text-black p-4 rounded-xl font-black uppercase tracking-widest hover:bg-gray-200 transition-all disabled:opacity-50">
            {loading ? 'Processando...' : 'Confirmar Agendamento'}
          </button>
        </form>
      </div>
    </div>
  )
}