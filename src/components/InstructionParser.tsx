'use client'

import React from 'react'
import { useTimers } from '@/lib/TimerContext'
import { Clock } from 'lucide-react'

const TIME_REGEX = /(\d+(?:\.\d+)?)\s*(?:-|to)?\s*(\d+(?:\.\d+)?)?\s*(m|min|mins|minutes|h|hr|hrs|hours|s|sec|secs|seconds)\b/gi

export function InstructionParser({ text }: { text: string }) {
  const { addTimer } = useTimers()

  if (!text) return null

  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match
  
  // reset regex state just in case
  TIME_REGEX.lastIndex = 0

  while ((match = TIME_REGEX.exec(text)) !== null) {
    const fullMatch = match[0]
    const num1 = parseFloat(match[1])
    const num2 = match[2] ? parseFloat(match[2]) : null
    const unit = match[3].toLowerCase()

    // Default to the upper bound if a range is provided
    const valueToUse = num2 !== null ? Math.max(num1, num2) : num1

    let multiplier = 1
    if (unit.startsWith('h')) multiplier = 3600
    else if (unit.startsWith('m')) multiplier = 60
    
    const totalSeconds = Math.floor(valueToUse * multiplier)

    // Push preceding text
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index))
    }

    // Push interactive pill
    parts.push(
      <button
        key={`timer-${match.index}`}
        onClick={() => addTimer(totalSeconds, fullMatch)}
        className="inline-flex items-center justify-center gap-1 mx-1 px-2.5 py-0.5 bg-orange-100 text-orange-800 hover:bg-orange-200 active:scale-95 font-bold rounded-md transition-all leading-none border border-orange-200 shadow-sm align-baseline focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:outline-none"
        title={`Start a timer for ${fullMatch}`}
        aria-label={`Start a timer for ${fullMatch}`}
      >
        <Clock className="w-3.5 h-3.5 -mt-0.5" />
        {fullMatch}
      </button>
    )

    lastIndex = TIME_REGEX.lastIndex
  }

  // Push remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex))
  }

  return <>{parts.map((part, i) => <span key={i}>{part}</span>)}</>
}
