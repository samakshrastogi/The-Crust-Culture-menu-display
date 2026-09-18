import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled UI render error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6 text-center bg-[var(--bg)] text-[var(--text)]">
          <div className="max-w-md p-6 rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-lg space-y-3">
            <span className="text-3xl" role="img" aria-label="Pizza">
              🍕
            </span>
            <h2 className="font-display text-lg font-black">Something went wrong</h2>
            <p className="text-xs text-[var(--muted)]">
              We encountered an issue loading this section of the menu. Please reload to try again.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-full bg-[var(--orange)] text-white text-xs font-bold shadow-xs hover:brightness-110 cursor-pointer active:scale-95 transition"
            >
              Reload Menu
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
