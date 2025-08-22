'use client'

import { Header } from '@/components/Header'
import { FireAnimatedBackground } from '@/components/AnimatedBackground'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen animated-bg grid-bg relative">
      <FireAnimatedBackground />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4 md:py-8 relative z-30">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
