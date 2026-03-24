'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

export type Timer = {
  id: string
  label: string
  endTimeMs: number
  totalDurationMs: number
}

type TimerContextType = {
  timers: Timer[]
  addTimer: (seconds: number, label: string) => void
  removeTimer: (id: string) => void
}

const TimerContext = createContext<TimerContextType>({
  timers: [],
  addTimer: () => {},
  removeTimer: () => {},
})

export function TimerProvider({ children }: { children: ReactNode }) {
  const [timers, setTimers] = useState<Timer[]>([])

  const playBeep = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioCtx.createOscillator()
      const gainNode = audioCtx.createGain()
      
      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime) // A5
      oscillator.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.5) // A4
      
      gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5)
      
      oscillator.connect(gainNode)
      gainNode.connect(audioCtx.destination)
      
      oscillator.start()
      oscillator.stop(audioCtx.currentTime + 0.5)
    } catch (err) {
      console.error("Audio API not supported", err)
    }
  }, [])

  const notifyUser = useCallback((label: string) => {
    if (Notification.permission === 'granted') {
      new Notification('Timer Finished!', { body: `Your timer for "${label}" is up!` })
    }
    playBeep()
  }, [playBeep])

  // Global Check Loop
  useEffect(() => {
    if (timers.length === 0) return

    const interval = setInterval(() => {
      const now = Date.now()
      let updated = false

      const nextTimers = timers.filter(t => {
        if (now >= t.endTimeMs) {
          notifyUser(t.label)
          updated = true
          return false // remove completed
        }
        return true
      })

      if (updated) setTimers(nextTimers)
    }, 1000)

    return () => clearInterval(interval)
  }, [timers, notifyUser])

  const addTimer = useCallback((seconds: number, label: string) => {
    if (Notification.permission === 'default') {
      Notification.requestPermission()
    }

    setTimers(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        label,
        totalDurationMs: seconds * 1000,
        endTimeMs: Date.now() + seconds * 1000
      }
    ])
  }, [])

  const removeTimer = useCallback((id: string) => {
    setTimers(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <TimerContext.Provider value={{ timers, addTimer, removeTimer }}>
      {children}
    </TimerContext.Provider>
  )
}

export function useTimers() {
  return useContext(TimerContext)
}
