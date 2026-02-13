'use client'

import { createClient } from '@supabase/supabase-js'
import { useState } from 'react'

// Cliente direto para evitar problemas de cache
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    console.log("Tentando logar com:", email)

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        console.error("Erro do Supabase:", authError.message)
        setError(authError.message === 'Invalid login credentials' ? 'E-mail ou senha incorretos' : authError.message)
        setLoading(false)
        return
      }

      if (data.session) {
        console.log("Login realizado com sucesso! Redirecionando...")
        // Força a gravação da sessão antes de mudar de página
        await supabase.auth.setSession(data.session)
        window.location.href = '/dashboard/agendamentos'
      }
    } catch (err) {
      console.error("Erro inesperado:", err)
      setError("Erro de conexão. Tente novamente.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 text-white">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 p-8 rounded-2xl">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black italic">CutFlow</h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em]">Gestão Premium</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <input 
            required type="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl outline-none"
            placeholder="E-mail"
          />
          <input 
            required type="password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl outline-none"
            placeholder="Senha"
          />
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 py-2 rounded text-red-400 text-xs text-center font-bold">
              {error}
            </div>
          )}

          <button 
            disabled={loading}
            className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-zinc-200 uppercase text-sm"
          >
            {loading ? 'Processando...' : 'Entrar no Painel'}
          </button>
        </form>
      </div>
    </div>
  )
}