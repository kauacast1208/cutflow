'use client'

import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { CalendarDays, Clock3, User, Scissors, Instagram, MessageCircle, Share2 } from 'lucide-react'
import { toast, Toaster } from 'sonner'
import "../globals.css";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

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
      toast.success("Agendamento solicitado com sucesso!")
      setName(''); setDate(''); setTime(''); setSelectedService('')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#060606] text-white p-4 md:p-12 flex flex-col items-center justify-center font-sans">
      <Toaster theme="dark" position="top-center" />
      
      <div className="w-full max-w-xl">
        {/* LOGO E HEADER PREMIUM */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-zinc-900 border border-white/10 mb-6 shadow-2xl">
            <Scissors className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none mb-2">CutFlow</h1>
          <div className="flex items-center justify-center gap-2">
            <span className="h-[1px] w-8 bg-zinc-800"></span>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">Experiência Exclusive</p>
            <span className="h-[1px] w-8 bg-zinc-800"></span>
          </div>
        </div>

        {/* FORMULÁRIO COM GLASSMORPHISM */}
        <form onSubmit={handleSubmit} className="space-y-8 bg-zinc-950/40 border border-zinc-900/50 backdrop-blur-md p-6 md:p-10 rounded-[3rem] shadow-2xl">
          
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 flex items-center gap-2 ml-1">
              <User size={12} className="text-zinc-400" /> Seu Nome
            </label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-5 text-white outline-none focus:border-white/20 transition-all placeholder:text-zinc-700 font-medium"
              placeholder="Ex: Nome Sobrenome"
              required
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 flex items-center gap-2 ml-1">
              <Scissors size={12} className="text-zinc-400" /> Selecione o Serviço
            </label>
            <div className="grid grid-cols-1 gap-3">
              {services.map(service => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => setSelectedService(service.id)}
                  className={`group p-5 rounded-3xl border transition-all text-left flex items-center justify-between ${
                    selectedService === service.id 
                    ? "border-white bg-white text-black shadow-xl scale-[1.02]" 
                    : "border-zinc-800/50 bg-zinc-900/20 text-white hover:border-zinc-700"
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-lg">{service.name}</span>
                    <span className={`text-[10px] font-bold ${selectedService === service.id ? "text-black/50" : "text-zinc-600"}`}>DURAÇÃO: 45 MIN</span>
                  </div>
                  <span className="font-black text-xl">R$ {service.price.toFixed(2)}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 flex items-center gap-2 ml-1">
              <CalendarDays size={12} className="text-zinc-400" /> Data do Atendimento
            </label>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-5 text-white outline-none focus:border-white/20 transition-all appearance-none"
              required
            />
          </div>

          {date && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 flex items-center gap-2 ml-1">
                <Clock3 size={12} className="text-zinc-400" /> Horários Disponíveis
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {availableTimes.map(slot => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTime(slot)}
                    className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                      time === slot 
                      ? "border-white bg-white text-black scale-110 shadow-lg" 
                      : "border-zinc-800/50 bg-zinc-900/30 text-zinc-500 hover:border-zinc-600 hover:text-white"
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
            className="w-full bg-white text-black hover:bg-zinc-200 active:scale-[0.97] p-6 rounded-3xl font-black uppercase tracking-[0.2em] text-sm transition-all shadow-2xl disabled:opacity-50 mt-4"
          >
            {loading ? 'Finalizando...' : 'Confirmar Agendamento'}
          </button>
        </form>

        {/* RODAPÉ COM REDES SOCIAIS */}
        <div className="mt-12 flex flex-col items-center gap-8">
          <div className="flex items-center gap-4">
            <a href="https://instagram.com" target="_blank" className="p-4 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-white/20 transition-all">
              <Instagram size={20} />
            </a>
            <a href="https://wa.me/seunumeroaqui" target="_blank" className="p-4 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-green-500 hover:border-green-500/20 transition-all">
              <MessageCircle size={20} />
            </a>
            <button onClick={() => toast.info("Link copiado!")} className="p-4 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-blue-500 hover:border-blue-500/20 transition-all">
              <Share2 size={20} />
            </button>
          </div>
          <p className="text-zinc-800 text-[9px] font-black uppercase tracking-[0.5em] text-center">
            © {new Date().getFullYear()} CUTFLOW SYSTEMS <br/> BARBER MANAGEMENT SOLUTION
          </p>
        </div>
      </div>
    </div>
  )
}