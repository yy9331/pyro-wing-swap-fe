'use client'

// ReactNode is imported but not used in this file

export function ErrorBanner({ message, onClose }: { message: string; onClose: () => void }) {
  if (!message) return null
  return (
    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
      <div className="text-red-600 dark:text-red-400 text-sm">{message}</div>
      <button onClick={onClose} className="text-red-500 dark:text-red-300 text-xs mt-1 hover:text-red-400 dark:hover:text-red-200">
        关闭
      </button>
    </div>
  )
}

export function SuccessBanner({ message, onClose }: { message: string; onClose: () => void }) {
  if (!message) return null
  return (
    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
      <div className="text-green-600 dark:text-green-400 text-sm">{message}</div>
      <button onClick={onClose} className="text-green-500 dark:text-green-300 text-xs mt-1 hover:text-green-400 dark:hover:text-green-200">
        关闭
      </button>
    </div>
  )
}


