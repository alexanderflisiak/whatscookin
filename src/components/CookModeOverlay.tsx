'use client'

import { useEffect, useState, useRef, useMemo, useLayoutEffect } from 'react'
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
  const [fontSize, setFontSize] = useState(36)
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)
  const wakeLockRef = useRef<any>(null) // We keep any for wakeLock for now due to experimental API types

  // Reset steps & font if instructions change, or just font if step changes
  useEffect(() => {
    setCurrentStep(0)
    setFontSize(36)
  }, [instructions])

  useEffect(() => {
    setFontSize(36)
  }, [currentStep])

  // Sync measurement to fitting the text
  useLayoutEffect(() => {
    const container = containerRef.current
    const text = textRef.current
    if (!container || !text) return

    if (text.scrollHeight > container.clientHeight && fontSize > 16) {
      setFontSize(f => f - 2)
    }
  }, [fontSize, currentStep, steps])

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
    <div className="fixed inset-0 z-100 bg-background flex flex-col pt-safe px-4 pb-safe animate-in slide-in-from-bottom flex-1 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between py-4 border-b border-border/50 shrink-0">
        <h2 className="text-xl font-bold line-clamp-1 flex-1 pr-4">{title}</h2>
        <button 
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-600 rounded-full font-bold hover:bg-stone-200 active:scale-95 transition-all select-none touch-none"
        >
          <X className="w-5 h-5" />
          <span className="text-sm">Exit</span>
        </button>
      </div>

      {/* Main Content Area (Limited) */}
      <div ref={containerRef} className="flex-1 flex flex-col justify-center py-4 overflow-hidden relative">
        <div className="mb-2 shrink-0">
          <span className="text-[40px] font-black text-text-hi/20 tracking-tighter">
            {currentStep + 1}
            <span className="text-2xl text-stone-300">/{steps.length}</span>
          </span>
        </div>
        <div className="flex-1 flex items-center overflow-hidden">
          <p 
            ref={textRef}
            className="font-medium leading-tight max-w-2xl w-full"
            style={{ fontSize: `${fontSize}px` }}
          >
            {steps[currentStep]}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="grid grid-cols-2 gap-4 pb-6 mt-auto shrink-0">
        <button 
          onClick={handlePrev}
          disabled={currentStep === 0}
          aria-label="Previous step"
          className="h-20 bg-stone-200 rounded-md flex items-center justify-center disabled:opacity-30 disabled:pointer-events-none hover:bg-stone-300 active:scale-95 transition-all text-stone-600 touch-none"
        >
          <ChevronLeft className="w-10 h-10" />
        </button>
        
        {isDone ? (
          <button 
            onClick={onClose}
            aria-label="Done"
            className="h-20 bg-success text-white rounded-md flex items-center justify-center hover:bg-green-600 active:scale-95 transition-all font-bold text-2xl shadow-sm border border-border touch-none"
          >
            <Check className="w-8 h-8 mr-2" /> Done
          </button>
        ) : (
          <button 
            onClick={handleNext}
            aria-label="Next step"
            className="h-20 bg-primary text-white border border-border hover:bg-stone-800 rounded-md flex items-center justify-center active:scale-95 transition-all shadow-sm touch-none"
          >
            <ChevronRight className="w-10 h-10" />
          </button>
        )}
      </div>
    </div>
  )
}
