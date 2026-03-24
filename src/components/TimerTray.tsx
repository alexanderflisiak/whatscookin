'use client'

import { useTimers } from '@/lib/TimerContext'
import { useEffect, useState } from 'react'
import { X, Clock } from 'lucide-react'

export function TimerTray() {
  const { timers, removeTimer } = useTimers()
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    if (timers.length === 0) return
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [timers])

  if (timers.length === 0) return null

  return (
    <div className="fixed bottom-20 right-4 flex flex-col gap-2 z-50 max-w-[calc(100vw-2rem)] w-72 pointer-events-none">
      {timers.map(timer => {
        const remainingMs = Math.max(0, timer.endTimeMs - now)
        const totalSeconds = Math.ceil(remainingMs / 1000)
        let m = Math.floor(totalSeconds / 60)
        const h = Math.floor(m / 60)
        m = m % 60
        const s = totalSeconds % 60

        const timeString = [
          h > 0 ? h.toString() : null,
          h > 0 ? m.toString().padStart(2, '0') : m.toString(),
          s.toString().padStart(2, '0')
        ].filter(Boolean).join(':')

        const progressPercent = Math.min(100, Math.max(0, 100 - (remainingMs / timer.totalDurationMs) * 100))

        return (
          <div key={timer.id} className="bg-surface border border-border rounded-lg shadow-lg pointer-events-auto overflow-hidden animate-in slide-in-from-right-8 fade-in">
            <div className="p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-hidden">
                <Clock className="w-5 h-5 text-text-lo shrink-0" />
                <div className="truncate">
                  <div className="text-xl font-bold text-text-hi font-mono leading-none tracking-tight">{timeString}</div>
                  <div className="text-xs font-medium text-text-lo truncate">{timer.label}</div>
                </div>
              </div>
              <button 
                onClick={() => removeTimer(timer.id)}
                className="w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center text-text-lo shrink-0 transition-colors"
                aria-label="Cancel timer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* Progress Bar Track */}
            <div className="w-full h-1 bg-stone-100">
              {/* Progress Bar Fill */}
              <div 
                className="h-full bg-primary transition-all duration-1000 ease-linear"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
