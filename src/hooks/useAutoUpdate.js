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
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 8000)

        const response = await fetch(`/version.json?t=${Date.now()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
          },
          signal: controller.signal,
        })
        clearTimeout(timeoutId)

        if (!response.ok) return

        const data = await response.json()
        if (!data?.version) return

        if (!currentVersion) {
          currentVersion = data.version
        } else if (data.version !== currentVersion) {
          // New deployment detected: notify without interrupting user session
          setUpdateAvailable(true)
        }
      } catch {
        // Network offline, aborted or failed request
      } finally {
        isChecking = false
      }
    }

    let interval = null

    const startPolling = () => {
      if (!interval) {
        interval = setInterval(checkVersion, 60 * 1000)
      }
    }

    const stopPolling = () => {
      if (interval) {
        clearInterval(interval)
        interval = null
      }
    }

    // Initial check on mount if visible
    if (document.visibilityState === 'visible') {
      checkVersion()
      startPolling()
    }

    // Pause polling when tab is hidden, resume and check immediately when tab becomes visible
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        checkVersion()
        startPolling()
      } else {
        stopPolling()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      stopPolling()
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  return { updateAvailable, reloadApp: () => window.location.reload() }
}
