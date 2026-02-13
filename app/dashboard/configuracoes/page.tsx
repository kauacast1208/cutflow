'use client'

import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { Plus, Trash2, Scissors, DollarSign } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ConfiguracoesPage() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const [newName, setNewName] = useState('')
  const [newPrice, setNewPrice] = useState('')

  async function fetchServices() {
    setLoading(true)
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order('created_at', { ascending: false })
    
    if (!error) setServices(data || [])
    setLoading(false)
  }

  async function addService(e: React.FormEvent) {
    e.preventDefault()
    if (!newName || !newPrice) return

    const { error } = await supabase
      .from("services")
      .insert([{ name: newName, price: parseFloat(newPrice) }])

    if (error) {
      alert("Erro ao salvar: " + error.message)
    } else {
      setNewName('')
      setNewPrice('')
      setIsModalOpen(false)
      fetchServices()
    }
  }

  async function deleteService(id: string) {
    if (confirm("Deseja excluir este serviço?")) {
      const { error } = await supabase.from("services").delete().eq("id", id)
      if (!error) fetchServices()
    }
  }

  useEffect(() => { fetchServices() }, [])

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto text-white animate-in fade-in duration-500">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-gray-500">Gerencie o catálogo de serviços e preços da sua barbearia.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-white text-black hover:bg-gray-200 px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg"
        >
          <Plus size={20} />
          Novo Serviço
        </button>
      </div>

      {/* Tabela / Lista de Serviços */}
      <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.02] border-b border-white/5">
              <th className="p-5 text-sm font-medium text-gray-400">Serviço</th>
              <th className="p-5 text-sm font-medium text-gray-400 text-right">Preço</th>
              <th className="p-5 text-sm font-medium text-gray-400 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={3} className="p-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
                  <p className="text-gray-500 mt-2">Carregando serviços...</p>
                </td>
              </tr>
            ) : services.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-12 text-center text-gray-500">
                  <Scissors size={40} className="mx-auto mb-4 opacity-20" />
                  Nenhum serviço cadastrado ainda.
                </td>
              </tr>
            ) : (
              services.map((service) => (
                <tr key={service.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-5 font-medium text-gray-200">{service.name}</td>
                  <td className="p-5 text-right font-bold text-white">
                    R$ {service.price.toFixed(2)}
                  </td>
                  <td className="p-5 text-right">
                    <button 
                      onClick={() => deleteService(service.id)}
                      className="text-gray-500 hover:text-red-500 p-2 rounded-lg hover:bg-red-500/10 transition-all"
                      title="Excluir serviço"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Cadastro */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0f0f0f] border border-white/10 p-8 rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Scissors className="text-gray-400" /> Adicionar Serviço
            </h2>
            
            <form onSubmit={addService} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Nome do Serviço</label>
                <input 
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl p-3 text-white outline-none focus:border-white/40 transition-all"
                  placeholder="Ex: Corte + Barba"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Preço Sugerido</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input 
                    type="number" 
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl p-3 pl-10 text-white outline-none focus:border-white/40 transition-all"
                    placeholder="0.00"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-transparent border border-white/10 hover:bg-white/5 p-3 rounded-xl transition font-medium"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-white text-black hover:bg-gray-200 p-3 rounded-xl font-bold transition shadow-lg"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}