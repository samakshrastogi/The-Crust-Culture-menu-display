import { useEffect, useState } from 'react'

export function useAutoUpdate() {
  const [updateAvailable, setUpdateAvailable] = useState(false)

  useEffect(() => {
    // Only active in production builds; Vite HMR handles local development
    if (import.meta.env.DEV) return

    let currentVersion = null
    let isChecking = false

    const checkVersion = async () => {
      if (isChecking) return
      isChecking = true

      try {
        const response = await fetch(`/version.json?t=${Date.now()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
          },
        })

        if (!response.ok) return

        const data = await response.json()
        if (!data?.version) return

        if (!currentVersion) {
          currentVersion = data.version
        } else if (data.version !== currentVersion) {
          // New deployment detected
          setUpdateAvailable(true)

          // If user is currently typing in an input, wait until blur or 8s timeout
          const isTyping = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)
          if (!isTyping) {
            window.location.reload()
          } else {
            const onBlur = () => {
              window.location.reload()
            }
            document.activeElement.addEventListener('blur', onBlur, { once: true })
            setTimeout(() => {
              window.location.reload()
            }, 8000)
          }
        }
      } catch {
        // Network offline or failed request
      } finally {
        isChecking = false
      }
    }

    // Initial check on mount
    checkVersion()

    // Poll every 30 seconds
    const interval = setInterval(checkVersion, 30 * 1000)

    // Check immediately when user switches back to the tab
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        checkVersion()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  return { updateAvailable }
}
