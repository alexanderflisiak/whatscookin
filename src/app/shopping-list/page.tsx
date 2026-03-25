'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Check, Undo2, Trash2, ShoppingCart } from 'lucide-react'
import type { ShoppingListItem } from '@/lib/types'

export default function ShoppingListPage() {
  const [items, setItems] = useState<ShoppingListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [newItem, setNewItem] = useState('')
  
  const supabase = createClient()

  useEffect(() => {
    fetchItems()

    const channel = supabase.channel('realtime:public:shopping_list')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'shopping_list' }, () => {
        fetchItems()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function fetchItems() {
    const { data } = await supabase
      .from('shopping_list')
      .select('*')
      .order('created_at', { ascending: true })
    
    if (data) setItems(data as ShoppingListItem[])
    setLoading(false)
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!newItem.trim()) return

    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) {
      alert("Must be logged in to add items.")
      return
    }

    const payload = {
      item_name: newItem.trim(),
      created_by: userData.user.id
    }

    setNewItem('')
    await supabase.from('shopping_list').insert(payload)
    // realtime subscription will fetch the update
  }

  async function toggleBought(id: string, currentlyBought: boolean) {
    await supabase
      .from('shopping_list')
      .update({ 
        is_bought: !currentlyBought, 
        bought_at: !currentlyBought ? new Date().toISOString() : null 
      })
      .eq('id', id)
  }

  async function handleDelete(id: string) {
    await supabase.from('shopping_list').delete().eq('id', id)
  }

  const activeItems = items.filter(i => !i.is_bought)
  const boughtItems = items.filter(i => i.is_bought)

  if (loading) {
    return <div className="p-8 text-center text-text-lo font-medium animate-pulse">Loading list...</div>
  }

  return (
    <div className="max-w-xl mx-auto p-4 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-stone-50 rounded-full flex items-center justify-center text-text-hi">
          <ShoppingCart className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold">Shopping List</h1>
      </div>

      <form onSubmit={handleAdd} className="flex gap-2 mb-8">
        <input 
          type="text" 
          placeholder="Add an item..." 
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
          className="flex-1 p-3 border border-border rounded-md bg-surface focus:ring-2 focus:ring-stone-300 outline-none font-medium shadow-sm"
        />
        <button 
          type="submit" 
          aria-label="Add item"
          title="Add item"
          disabled={!newItem.trim()}
          className="w-12 h-12 shrink-0 bg-primary text-white border border-border hover:bg-stone-800 rounded-md flex items-center justify-center hover:bg-stone-500 disabled:opacity-50 transition-colors shadow-sm"
        >
          <Plus className="w-6 h-6" />
        </button>
      </form>

      <div className="space-y-6">
        {/* Active Items */}
        <div>
          <h2 className="text-sm font-bold text-text-lo uppercase tracking-wider mb-3">To Buy ({activeItems.length})</h2>
          {activeItems.length === 0 ? (
            <div className="py-6 text-center text-text-lo text-sm bg-surface rounded-md border border-dashed border-border opacity-75">
              List is empty. You're all caught up!
            </div>
          ) : (
            <div className="space-y-2">
              {activeItems.map(item => (
                <div key={item.id} className="flex items-center gap-3 bg-surface p-3 pr-4 rounded-md border border-border shadow-sm group">
                  <button 
                    onClick={() => toggleBought(item.id, item.is_bought)}
                    className="w-8 h-8 rounded-full border-2 border-primary/50 flex items-center justify-center hover:bg-stone-50 transition-colors shrink-0"
                  >
                    <span className="sr-only">Mark as bought</span>
                  </button>
                  <div className="flex-1">
                    {item.quantity && <span className="font-semibold mr-2">{item.quantity}</span>}
                    <span className="font-medium">{item.item_name}</span>
                  </div>
                  <button aria-label="Delete item" title="Delete item" onClick={() => handleDelete(item.id)} className="text-stone-300 hover:text-danger p-1 opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bought Items */}
        {boughtItems.length > 0 && (
          <div className="pt-6 border-t border-border">
            <h2 className="text-sm font-bold text-text-lo uppercase tracking-wider mb-3">Recently Bought ({boughtItems.length})</h2>
            <div className="space-y-1">
              {boughtItems.map(item => (
                <div key={item.id} className="flex items-center gap-3 py-2 px-1 group">
                  <button 
                    aria-label="Unmark as bought"
                    title="Unmark as bought"
                    onClick={() => toggleBought(item.id, item.is_bought)}
                    className="w-6 h-6 rounded-full bg-success flex items-center justify-center text-white shrink-0 hover:bg-green-600 transition-colors"
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                  </button>
                  <div className="flex-1 line-through text-text-lo font-medium">
                    {item.quantity && <span className="mr-2">{item.quantity}</span>}
                    {item.item_name}
                  </div>
                  <button 
                    aria-label="Undo marked as bought"
                    title="Undo marked as bought"
                    onClick={() => toggleBought(item.id, item.is_bought)}
                    className="text-text-lo hover:text-text-hi p-1 flex items-center gap-1 text-xs font-bold"
                  >
                    <Undo2 className="w-3 h-3" /> UNDO
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
