'use client'

import { useEffect, useState, useRef, useMemo } from 'react'
import { X, ChevronLeft, ChevronRight, Check } from 'lucide-react'

type CookModeOverlayProps = {
  title: string
  instructions: string
  onClose: () => void
}

export function CookModeOverlay({ title, instructions, onClose }: CookModeOverlayProps) {
  const steps = useMemo(() => {
    const parsed = instructions
      .split(/\n+/)
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .map(s => s.replace(/^(?:\d+\.|\*|\-)\s*/, ''))
    
    return parsed.length ? parsed : [instructions]
  }, [instructions])

  const [currentStep, setCurrentStep] = useState(0)
  const wakeLockRef = useRef<any>(null)

  // Reset steps if instructions change
  useEffect(() => {
    setCurrentStep(0)
  }, [instructions])

  useEffect(() => {
    // Request Wake Lock
    async function requestWakeLock() {
      try {
        if ('wakeLock' in navigator) {
          wakeLockRef.current = await (navigator as any).wakeLock.request('screen')
        }
      } catch (err) {
        console.log('Wake Lock request failed:', err)
      }
    }
    requestWakeLock()

    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(console.error)
      }
    }
  }, [])
  function handleNext() {
    if (currentStep < steps.length - 1) setCurrentStep(c => c + 1)
  }

  function handlePrev() {
    if (currentStep > 0) setCurrentStep(c => c - 1)
  }

  if (steps.length === 0) return null

  const isDone = currentStep === steps.length - 1

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col pt-safe px-4 pb-safe animate-in slide-in-from-bottom flex-1">
      {/* Header */}
      <div className="flex items-center justify-between py-4 border-b border-border/50">
        <h2 className="text-xl font-bold line-clamp-1 flex-1 pr-4">{title}</h2>
        <button 
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-600 rounded-full font-bold hover:bg-stone-200 active:scale-95 transition-all select-none touch-none"
        >
          <X className="w-5 h-5" />
          <span className="text-sm">Exit</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center py-8">
        <div className="mb-4">
          <span className="text-[40px] font-black text-text-hi/20 tracking-tighter">
            {currentStep + 1}
            <span className="text-2xl text-stone-300">/{steps.length}</span>
          </span>
        </div>
        <p className="text-[28px] md:text-[36px] font-medium leading-relaxed max-w-2xl">
          {steps[currentStep]}
        </p>
      </div>

      {/* Navigation */}
      <div className="grid grid-cols-2 gap-4 pb-6 mt-auto">
        <button 
          onClick={handlePrev}
          disabled={currentStep === 0}
          className="h-20 bg-stone-200 rounded-md flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none hover:bg-stone-300 active:scale-95 transition-all text-stone-600 touch-none"
        >
          <ChevronLeft className="w-10 h-10" />
        </button>
        
        {isDone ? (
          <button 
            onClick={onClose}
            className="h-20 bg-success text-white rounded-md flex items-center justify-center hover:bg-green-600 active:scale-95 transition-all font-bold text-2xl shadow-sm border border-border touch-none"
          >
            <Check className="w-8 h-8 mr-2" /> Done
          </button>
        ) : (
          <button 
            onClick={handleNext}
            className="h-20 bg-primary text-white border border-border hover:bg-stone-800 rounded-md flex items-center justify-center hover:bg-stone-500 active:scale-95 transition-all shadow-sm border border-border touch-none"
          >
            <ChevronRight className="w-10 h-10" />
          </button>
        )}
      </div>
    </div>
  )
}
