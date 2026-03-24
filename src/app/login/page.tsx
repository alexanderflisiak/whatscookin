import { login, signup } from './actions'
import { ChefHat, AlertTriangle } from 'lucide-react'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  return (
    <div className="min-h-dvh bg-background flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <ChefHat className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-center text-3xl font-black text-text-hi tracking-tight">
          WhatsCookin
        </h2>
        <p className="mt-2 text-center text-sm text-text-lo font-medium">
          Sign in to your shared kitchen dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface py-8 px-4 shadow-xl shadow-stone-200/50 sm:rounded-2xl sm:px-10 border border-border">
          
          {searchParams.error && (
            <div className="mb-6 bg-red-50 text-danger p-4 rounded-xl text-sm font-medium flex items-center gap-2 border border-red-100">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              {searchParams.error}
            </div>
          )}

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-text-hi mb-2">Display Name (Sign up only)</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Chef Gordon"
                className="w-full p-4 border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary/50 outline-none font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-text-hi mb-2">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="chef@example.com"
                className="w-full p-4 border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary/50 outline-none font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-text-hi mb-2">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full p-4 border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary/50 outline-none font-medium"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                formAction={login}
                className="w-full flex-1 bg-stone-200 text-text-hi font-bold py-4 rounded-xl hover:bg-stone-300 transition-all"
              >
                Log In
              </button>
              <button
                formAction={signup}
                className="w-full flex-1 bg-primary text-white font-bold py-4 rounded-xl shadow-[0_4px_0_0_rgb(194,65,12)] hover:bg-orange-500 hover:translate-y-[2px] border-b-4 border-transparent hover:shadow-[0_2px_0_0_rgb(194,65,12)] transition-all"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
        
        <p className="mt-8 text-center text-xs text-text-lo">
          By signing up, you agree to cook delicious meals.
        </p>
      </div>
    </div>
  )
}
