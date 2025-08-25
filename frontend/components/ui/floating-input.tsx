"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface FloatingInputProps {
  id: string
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
  className?: string
}

export function FloatingInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  required,
  className,
}: FloatingInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const hasValue = value.length > 0

  return (
    <div className={cn("relative", className)}>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        required={required}
        className={cn(
          "peer w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl",
          "text-gray-800 placeholder-transparent",
          "focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:border-pink-400/50",
          "transition-all duration-300",
          error && "border-red-400/50 focus:ring-red-400/50 focus:border-red-400/50",
        )}
        placeholder={label}
      />
      <label
        htmlFor={id}
        className={cn(
          "absolute left-4 transition-all duration-300 pointer-events-none",
          "text-gray-600 font-medium",
          isFocused || hasValue ? "-top-2 text-xs bg-white/80 px-2 rounded-full text-pink-600" : "top-3 text-base",
        )}
      >
        {label}
        {required && <span className="text-pink-500 ml-1">*</span>}
      </label>
      {error && <p className="mt-1 text-sm text-red-500 animate-in slide-in-from-left-2">{error}</p>}
    </div>
  )
}
