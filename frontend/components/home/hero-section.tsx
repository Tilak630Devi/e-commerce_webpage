"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { GradientButton } from "@/components/ui/gradient-button"
import { useAuth } from "@/contexts/auth-context"

export function HeroSection() {
  const { isAuthenticated } = useAuth()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 brightness-30 contrast-110"
      >
        <source src="/video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay to soften video */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-purple-900/20 to-pink-900/30 z-0" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Floating Cosmetic Bottles */}

        {/* Parallax Elements */}
        <div
          className="absolute w-32 h-32 bg-gradient-to-br from-pink-400/20 to-purple-400/20 rounded-full blur-2xl"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
          }}
        />
        <div
          className="absolute w-48 h-48 bg-gradient-to-br from-purple-400/15 to-indigo-400/15 rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`,
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Animated Title */}<br /><br />
        <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">
          <span className="block gradient-text mt-2">AAVRA GENERAL</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
          Premium beauty products and cosmetics designed for the modern woman who values elegance and quality
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link href="/products">
            <GradientButton size="lg" className="px-8 py-4 text-lg neon-pink">
              Shop Collection
            </GradientButton>
          </Link>
          {!isAuthenticated && (
            <Link href="/auth/signup">
              <GradientButton variant="secondary" size="lg" className="px-8 py-4 text-lg">
                Join Now
              </GradientButton>
            </Link>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="glass rounded-2xl p-6 hover-lift">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-100 mb-2">Premium Quality</h3>
            <p className="text-gray-300">Carefully curated products from top beauty brands worldwide</p>
          </div>

          <div className="glass rounded-2xl p-6 hover-lift">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-100 mb-2">Fast Delivery</h3>
            <p className="text-gray-300">Quick and secure delivery right to your doorstep</p>
          </div>

          <div className="glass rounded-2xl p-6 hover-lift">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-100 mb-2">Expert Care</h3>
            <p className="text-gray-300">Personalized beauty advice and customer support</p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
        <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-300 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>

  )
}
