'use client'

import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { Plus, Trash2, Scissors, Store, User, Settings2 } from 'lucide-react'

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
    if (!error) {
      setNewName(''); setNewPrice(''); setIsModalOpen(false); fetchServices()
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
    <div className="p-4 md:p-8 max-w-6xl mx-auto text-white animate-in fade-in duration-500">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Settings2 className="text-gray-400" /> Configurações
        </h1>
        <p className="text-gray-500">Gerencie os detalhes do seu negócio e catálogo de serviços.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LADO ESQUERDO: Perfil e Empresa */}
        <div className="space-y-6 lg:col-span-1">
          <section className="bg-[#111] border border-white/5 p-6 rounded-2xl shadow-xl">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-6 flex items-center gap-2">
              <User size={16} /> Perfil do Usuário
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-600 block mb-1">E-mail de acesso</label>
                <p className="text-sm font-medium bg-white/5 p-3 rounded-xl border border-white/5 text-gray-400">
                  kauacast08@gmail.com
                </p>
              </div>
            </div>
          </section>

          <section className="bg-[#111] border border-white/5 p-6 rounded-2xl shadow-xl">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-6 flex items-center gap-2">
              <Store size={16} /> Dados da Barbearia
            </h2>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Nome da Barbearia"
                className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm focus:border-white/30 outline-none"
              />
              <button className="w-full bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl text-sm font-bold transition-all border border-white/10">
                Salvar Alterações
              </button>
            </div>
          </section>
        </div>

        {/* LADO DIREITO: Serviços */}
        <div className="lg:col-span-2">
          <section className="bg-[#111] border border-white/5 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
              <h2 className="font-bold flex items-center gap-2">
                <Scissors size={18} className="text-gray-400" /> Catálogo de Serviços
              </h2>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-500 text-xs font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-2"
              >
                <Plus size={14} /> Novo Serviço
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/[0.02] text-xs text-gray-500 uppercase tracking-widest">
                  <tr>
                    <th className="p-5 font-medium">Nome</th>
                    <th className="p-5 font-medium text-right">Preço</th>
                    <th className="p-5 font-medium text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {loading ? (
                    <tr><td colSpan={3} className="p-10 text-center text-gray-500">Carregando...</td></tr>
                  ) : services.map((service) => (
                    <tr key={service.id} className="hover:bg-white/[0.01] transition-colors">
                      <td className="p-5 font-medium">{service.name}</td>
                      <td className="p-5 text-right font-bold text-green-400">R$ {service.price.toFixed(2)}</td>
                      <td className="p-5 text-right">
                        <button onClick={() => deleteService(service.id)} className="text-gray-500 hover:text-red-500 transition-colors p-2">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>

      {/* MODAL ESTILIZADO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0f0f0f] border border-white/10 p-8 rounded-3xl w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold mb-6">Novo Serviço</h2>
            <form onSubmit={addService} className="space-y-4">
              <input 
                type="text" 
                placeholder="Ex: Corte Americano"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl p-3 text-white outline-none focus:border-white/40"
                required
              />
              <input 
                type="number" 
                placeholder="Preço (0.00)"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl p-3 text-white outline-none focus:border-white/40"
                step="0.01"
                required
              />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-white/5 p-3 rounded-xl hover:bg-white/10 transition">Cancelar</button>
                <button type="submit" className="flex-1 bg-white text-black font-bold p-3 rounded-xl hover:bg-gray-200 transition">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}