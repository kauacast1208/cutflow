'use client'

import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { DollarSign, Scissors, Plus, Trash2, X } from 'lucide-react'
import { toast, Toaster } from 'sonner'
import "../../globals.css";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ConfiguracoesPage() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Estados para o novo serviço
  const [newName, setNewName] = useState('')
  const [newPrice, setNewPrice] = useState('')

  useEffect(() => {
    fetchServices()
  }, [])

  async function fetchServices() {
    setLoading(true)
    const { data } = await supabase.from('services').select('*').order('name')
    if (data) setServices(data)
    setLoading(false)
  }

  async function handleAddService(e: React.FormEvent) {
    e.preventDefault()
    if(!newName || !newPrice) return toast.error("Preencha todos os campos")

    const { error } = await supabase
      .from('services')
      .insert([{ name: newName, price: parseFloat(newPrice) }])

    if (error) {
      toast.error("Erro ao adicionar serviço")
    } else {
      toast.success("Serviço adicionado!")
      setNewName(''); setNewPrice(''); setIsModalOpen(false)
      fetchServices()
    }
  }

  async function updatePrice(id: string, newPrice: string) {
    const { error } = await supabase
      .from('services')
      .update({ price: parseFloat(newPrice) })
      .eq('id', id)

    if (!error) {
      toast.success("Preço atualizado!")
      fetchServices()
    }
  }

  async function deleteService(id: string) {
    if (!confirm("Deseja excluir este serviço?")) return
    
    const { error } = await supabase.from('services').delete().eq('id', id)
    if (!error) {
      toast.success("Serviço removido")
      fetchServices()
    }
  }

  return (
    <div className="space-y-8 pb-20">
      <Toaster theme="dark" position="top-center" />
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">Configurações</h1>
          <p className="text-zinc-500 text-sm font-medium">Gerencie o cardápio da sua barbearia</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-white text-black px-6 py-3 rounded-2xl font-black uppercase text-xs flex items-center gap-2 hover:bg-zinc-200 transition-all shadow-lg"
        >
          <Plus size={16} /> Novo Serviço
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div></div>
      ) : (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-8">
          <h2 className="text-xl font-black italic uppercase mb-8 flex items-center gap-2">
            <Scissors className="text-zinc-500" size={20} /> Serviços Ativos
          </h2>

          <div className="space-y-4">
            {services.map(service => (
              <div key={service.id} className="flex items-center justify-between p-6 bg-zinc-950 border border-zinc-800 rounded-3xl hover:border-zinc-700 transition-all group">
                <p className="font-black text-white text-lg uppercase italic tracking-tighter">{service.name}</p>
                
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                    <input 
                      type="number"
                      defaultValue={service.price}
                      onBlur={(e) => updatePrice(service.id, e.target.value)}
                      className="bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-white font-black w-28 outline-none focus:border-white transition-all text-sm"
                    />
                  </div>
                  <button 
                    onClick={() => deleteService(service.id)}
                    className="p-2 text-zinc-800 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL PARA ADICIONAR SERVIÇO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 w-full max-w-md rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter">Novo Serviço</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddService} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] ml-1">Nome do Corte</label>
                <input 
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-2xl text-white outline-none focus:border-white/20 font-bold placeholder:text-zinc-700"
                  placeholder="Ex: Degradê Navalhado"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] ml-1">Preço Sugerido</label>
                <input 
                  required
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-2xl text-white outline-none focus:border-white/20 font-bold placeholder:text-zinc-700"
                  placeholder="0.00"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-white text-black font-black uppercase p-5 rounded-2xl hover:bg-zinc-200 transition-all mt-4 tracking-tighter shadow-lg shadow-white/5"
              >
                Confirmar Cadastro
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}