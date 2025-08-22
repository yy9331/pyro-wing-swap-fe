'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { WalletConnect } from '@/components/WalletConnect'
import { Button } from '@/components/ui/button'
import { Sun, Moon, Settings, ChevronDown, Menu, Globe } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useNetworkInfo } from '@/hooks/useNetworkInfo'
import { useLanguage } from '@/hooks/useLanguage'

export const Header = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const networkInfo = useNetworkInfo()
  const { language, setLanguage, t } = useLanguage()
  
  // 添加ref用于检测点击外部
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark'
    
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle('dark', savedTheme === 'dark')
    } else {
      // 如果没有保存的主题设置，默认使用黑夜主题
      setTheme('dark')
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  const navItems = [
    { href: '/swap', label: t('nav.swap') },
    { href: '/pools', label: t('nav.pools') },
    { href: '/liquidity', label: t('nav.liquidity') }
  ]

  // 点击外部关闭移动端菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      
      if (isMobileMenuOpen && 
          mobileMenuRef.current && 
          !mobileMenuRef.current.contains(target) &&
          mobileMenuButtonRef.current &&
          !mobileMenuButtonRef.current.contains(target)) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMobileMenuOpen])

  return (
    <header className="border-b border-orange-200 dark:border-gray-800 bg-white/80 dark:bg-black/20 backdrop-blur-sm relative z-50">
      <div className="container mx-auto px-4 py-4">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg overflow-hidden animated-card">
              <Image
                src="https://oikbmogyevlxggbzfpnp.supabase.co/storage/v1/object/public/some-imgs/pyro-wings-batch-no-bg.png"
                alt="PyroWingSwap Logo"
                width={60}
                height={60}
                priority
                className="w-8 h-8 object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white gradient-text" data-text="PyroWingSwap">PyroWingSwap</h1>
          </div>

          {/* Navigation - 居中布局 */}
          <nav className="flex items-center space-x-4 lg:space-x-6 xl:space-x-8 mx-8 flex-1 justify-center">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 lg:px-6 py-3 rounded-lg text-sm lg:text-base font-medium transition-all duration-200 animated-tab whitespace-nowrap ${
                  pathname === item.href
                    ? 'bg-orange-500 text-white shadow-lg scale-105'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-gray-700 hover:scale-105'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Settings Menu */}
          <div className="relative z-[200] flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-gray-700 animated-button px-4 py-2 text-base"
            >
              <Settings className="h-4 w-4" />
              <span className="text-sm font-medium">{t('nav.settings')}</span>
              <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
            </Button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-60">
                {/* Network Status */}
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{t('network')}</span>
                    <div className={`bg-gradient-to-r ${networkInfo.bgColor} dark:from-gray-700 dark:to-gray-600 rounded-lg px-3 py-1 animated-card`}>
                      <span className={`${networkInfo.textColor} dark:text-gray-300 text-xs flex items-center gap-1`}>
                        <span>{networkInfo.icon}</span>
                        {networkInfo.name}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Language Toggle */}
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{t('language')}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
                      className="text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-gray-700 animated-button flex items-center gap-2"
                    >
                      <Globe className="h-4 w-4" />
                      <span className="text-xs font-medium">{language === 'zh' ? '中文' : 'English'}</span>
                    </Button>
                  </div>
                </div>

                {/* Theme Toggle */}
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{t('theme')}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleTheme}
                      className="text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-gray-700 animated-button"
                    >
                      {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Wallet Connection */}
                <div className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{t('wallet')}</span>
                    <WalletConnect compact />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <div className="w-6 h-6 rounded-lg overflow-hidden animated-card">
                <Image
                  src="https://oikbmogyevlxggbzfpnp.supabase.co/storage/v1/object/public/some-imgs/pyro-wings-batch-no-bg.png"
                  alt="PyroWingSwap Logo"
                  width={60}
                  height={60}
                  priority
                  className="w-6 h-6 object-contain"
                />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white gradient-text" data-text="PyroWingSwap">PyroWingSwap</h1>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-gray-700 animated-button flex-shrink-0"
              ref={mobileMenuButtonRef}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="mt-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-lg shadow-xl border border-orange-200/50 dark:border-gray-700/50 py-3 relative z-60" ref={mobileMenuRef}>
              {/* Navigation Links */}
              <div className="px-4 py-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block w-full px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 animated-tab mb-2 ${
                      pathname === item.href
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-orange-100/80 dark:hover:bg-gray-700/80'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-orange-200/50 dark:border-gray-700/50 my-3"></div>

              {/* Network Status */}
              <div className="px-4 py-3 border-b border-orange-200/50 dark:border-gray-700/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">{t('network')}</span>
                  <div className={`bg-gradient-to-r ${networkInfo.bgColor} dark:from-gray-700 dark:to-gray-600 rounded-lg px-3 py-1 animated-card`}>
                    <span className={`${networkInfo.textColor} dark:text-gray-300 text-xs font-medium flex items-center gap-1`}>
                      <span>{networkInfo.icon}</span>
                      {networkInfo.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Language Toggle */}
              <div className="px-4 py-3 border-b border-orange-200/50 dark:border-gray-700/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">{t('language')}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
                    className="text-gray-700 dark:text-gray-300 hover:bg-orange-100/80 dark:hover:bg-gray-700/80 animated-button flex items-center gap-2"
                  >
                    <Globe className="h-4 w-4" />
                    <span className="text-xs font-medium">{language === 'zh' ? '中文' : 'English'}</span>
                  </Button>
                </div>
              </div>

              {/* Theme Toggle */}
              <div className="px-4 py-3 border-b border-orange-200/50 dark:border-gray-700/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">{t('theme')}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleTheme}
                    className="text-gray-700 dark:text-gray-300 hover:bg-orange-100/80 dark:hover:bg-gray-700/80 animated-button"
                  >
                    {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Wallet Connection */}
              <div className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">{t('wallet')}</span>
                  <WalletConnect compact />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
