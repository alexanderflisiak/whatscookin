import { createClient } from '@/lib/supabase/server'
import { logout } from './actions'
import { User, LogOut, BookOpen, UserCircle2 } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
  const supabase = await createClient()
  
  if (!supabase) {
    return (
      <div className="p-8 text-center text-text-lo bg-stone-50 rounded-md border border-border mt-12 mx-4">
        Supabase keys missing. Profile unavailable.
      </div>
    )
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { count: recipeCount } = await supabase
    .from('recipes')
    .select('*', { count: 'exact', head: true })
    .eq('created_by', user.id)

  return (
    <div className="max-w-2xl mx-auto pb-24">
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md px-4 py-4 border-b border-border flex items-center gap-3">
        <UserCircle2 className="w-6 h-6 text-text-hi" />
        <h1 className="text-xl font-bold text-text-hi">Account & Profile</h1>
      </div>

      <div className="p-4 space-y-6 mt-4">
        {/* Profile Card */}
        <div className="bg-surface border border-border rounded-md p-6 flex items-center gap-6 shadow-sm">
          <div className="w-20 h-20 rounded-full bg-stone-100 border border-border flex items-center justify-center shrink-0">
            <User className="w-10 h-10 text-stone-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-text-hi">{profile?.display_name || 'Anonymous Chef'}</h2>
            <p className="text-text-lo font-medium mt-1">{user.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface border border-border rounded-md p-4 shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-2 text-text-lo font-medium mb-1">
              <BookOpen className="w-4 h-4" /> Recipes Created
            </div>
            <p className="text-3xl font-bold text-text-hi">{recipeCount || 0}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-12 bg-surface border border-border rounded-md shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border bg-stone-50">
            <h3 className="font-bold text-text-hi text-sm uppercase tracking-wide">Settings</h3>
          </div>
          <form action={logout}>
            <button className="w-full p-4 flex items-center justify-between text-danger hover:bg-red-50 transition-colors font-medium">
              <span className="flex items-center gap-3">
                <LogOut className="w-5 h-5" /> Sign Out
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
