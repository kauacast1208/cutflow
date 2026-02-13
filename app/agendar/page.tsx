'use client'

import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AgendarPage() {
  const [services, setServices] = useState<any[]>([])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [selectedService, setSelectedService] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    async function getServices() {
      const { data } = await supabase.from('services').select('*')
      if (data) setServices(data)
    }
    getServices()
  }, [])

  async function handleBooking(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.from('appointments').insert([
      {
        client_name: name,
        client_phone: phone,
        service_id: selectedService,
        appointment_date: date,
        appointment_time: time,
      }
    ])

    if (!error) {
      setSent(true)
    } else {
      alert('Erro ao agendar. Tente novamente.')
    }
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-4xl font-bold text-green-500 mb-4">✔ Sucesso!</h1>
        <p className="text-zinc-400">Seu horário foi reservado. Nos vemos em breve!</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-md mx-auto pt-10">
        <h1 className="text-3xl font-bold mb-2">CutFlow</h1>
        <p className="text-zinc-400 mb-8">Reserve seu horário em poucos segundos.</p>

        <form onSubmit={handleBooking} className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Seu Nome</label>
            <input required type="text" value={name} onChange={e => setName(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-lg focus:outline-none focus:border-blue-500" />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">WhatsApp</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-lg focus:outline-none focus:border-blue-500" />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">Escolha o Serviço</label>
            <select required value={selectedService} onChange={e => setSelectedService(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-lg focus:outline-none">
              <option value="">Selecione...</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.name} - R$ {s.price}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Data</label>
              <input required type="date" value={date} onChange={e => setDate(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Horário</label>
              <input required type="time" value={time} onChange={e => setTime(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-lg" />
            </div>
          </div>

          <button disabled={loading} type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all">
            {loading ? 'Agendando...' : 'Confirmar Agendamento'}
          </button>
        </form>
      </div>
    </div>
  )
}