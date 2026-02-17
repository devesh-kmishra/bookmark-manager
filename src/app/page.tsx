'use client'

import { createClient } from "@/lib/supabase-client"
import { FaGoogle } from "react-icons/fa"

export default function Home() {
  const supabase = createClient()

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <button onClick={handleLogin} className="p-2 border-2 border-black rounded-lg hover:bg-blue-500 hover:text-white hover:border-blue-400">
        <FaGoogle className="inline-block mr-2" size={24} />
        Sign in with Google
      </button>
    </div>
  )
}
