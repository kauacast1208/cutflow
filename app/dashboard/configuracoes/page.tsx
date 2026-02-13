'use client'

import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { DollarSign, Scissors, PlusCircle, Trash2 } from 'lucide-react'
import { toast, Toaster } from 'sonner'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ConfiguracoesPage() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServices()
  }, [])

  async function fetchServices() {
    setLoading(true)
    const { data } = await supabase.from('services').select('*').order('name')
    if (data) setServices(data)
    setLoading(false)
  }

  // Atualizar preço
  async function updatePrice(id: string, newPrice: string) {
    const { error } = await supabase
      .from('services')
      .update({ price: parseFloat(newPrice) })
      .eq('id', id)

    if (error) {
      toast.error("Erro ao atualizar preço")
    } else {
      toast.success("Preço atualizado!")
      fetchServices()
    }
  }

  return (
    <div className="space-y-8">
      <Toaster theme="dark" />
      
      <div>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter">Configurações</h1>
        <p className="text-zinc-500">Gerencie seus serviços e preços.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8">
          <h2 className="text-xl font-black italic uppercase mb-6 flex items-center gap-2">
            <Scissors className="text-zinc-500" size={20} /> Lista de Serviços
          </h2>

          <div className="space-y-4">
            {services.map(service => (
              <div key={service.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-zinc-950 border border-zinc-800 rounded-2xl">
                <div>
                  <p className="font-bold text-white text-lg">{service.name}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                    <input 
                      type="number"
                      defaultValue={service.price}
                      onBlur={(e) => updatePrice(service.id, e.target.value)}
                      className="bg-zinc-900 border border-zinc-700 rounded-xl pl-10 pr-4 py-2 text-white font-bold w-32 outline-none focus:border-white"
                    />
                  </div>
                  <button className="p-2 text-zinc-600 hover:text-red-500 rounded-xl hover:bg-red-500/10">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}