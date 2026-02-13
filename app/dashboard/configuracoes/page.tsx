'use client'

import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

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

  async function fetchServices() {
    const { data, error } = await supabase.from("services").select("*").order('created_at', { ascending: false })
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
    <div className="p-8 max-w-4xl mx-auto text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Configurações</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition"
        >
          + Novo Serviço
        </button>
      </div>

      {/* Modal de Cadastro */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Adicionar Serviço</h2>
            <form onSubmit={addService} className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Nome do Serviço</label>
                <input 
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-white outline-none focus:border-blue-500"
                  placeholder="Ex: Corte Degradê"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Preço (R$)</label>
                <input 
                  type="number" 
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-white outline-none focus:border-blue-500"
                  placeholder="35.00"
                  step="0.01"
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 p-2 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-500 p-2 rounded-lg font-bold transition"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabela de Serviços */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-zinc-800/50 text-zinc-400 text-sm">
            <tr>
              <th className="p-4 font-medium">Nome do Serviço</th>
              <th className="p-4 font-medium text-right">Preço</th>
              <th className="p-4 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {loading ? (
              <tr><td colSpan={3} className="p-8 text-center text-zinc-500">Carregando...</td></tr>
            ) : services.length === 0 ? (
              <tr><td colSpan={3} className="p-8 text-center text-zinc-500">Nenhum serviço cadastrado.</td></tr>
            ) : services.map((service) => (
              <tr key={service.id} className="hover:bg-zinc-800/30 transition">
                <td className="p-4 font-medium">{service.name}</td>
                <td className="p-4 text-right text-green-400 font-semibold">R$ {service.price}</td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => deleteService(service.id)}
                    className="text-red-400 hover:text-red-300 text-sm font-medium px-3 py-1 rounded-md hover:bg-red-400/10 transition"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}