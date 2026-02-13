'use client'

import { createClient } from '@supabase/supabase-js'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Mail } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError('E-mail ou senha incorretos')
      setLoading(false)
    } else {
      router.push('/dashboard/agendamentos')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-[#060606] text-white flex flex-col justify-center items-center p-4">
      {/* Fundo decorativo */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-white rounded-full filter blur-[128px]"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gray-500 rounded-full filter blur-[128px]"></div>
      </div>

      <div className="z-10 w-full max-w-md space-y-8 bg-[#111] p-10 rounded-2xl border border-white/5 shadow-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tighter italic text-white">CutFlow</h1>
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500 mt-1">Gestão Premium</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Mail size={16} /> E-mail
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-xl p-3 text-white outline-none focus:border-white/40 transition-all"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
              <Lock size={16} /> Senha
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-xl p-3 text-white outline-none focus:border-white/40 transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black hover:bg-gray-200 p-4 rounded-xl font-bold transition-all shadow-lg hover:scale-[1.02] disabled:opacity-50"
          >
            {loading ? 'Acessando...' : 'Entrar no Sistema'}
          </button>
        </form>
      </div>
    </div>
  )
}