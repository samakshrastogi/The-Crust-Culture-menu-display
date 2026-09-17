import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  FiArrowRight,
  FiGrid,
  FiHeart,
  FiRotateCcw,
  FiSearch,
  FiX,
} from 'react-icons/fi'
import { animateFavoritePop, gsap, scrollToTop } from '../animations/gsapAnimations'
import LiveStatusBadge from '../components/LiveStatusBadge'
import MenuImageStrip from '../components/MenuImageStrip'
import MenuItemSheet from '../components/MenuItemSheet'
import MenuSectionCard from '../components/MenuSectionCard'
import SearchBar from '../components/SearchBar'
import SkeletonLoader from '../components/SkeletonLoader'
import { menuSections } from '../data/menuSections'
import { useLocalStorage } from '../hooks/useLocalStorage'

const isRestrictedTime = () => {
  const hours = new Date().getHours()
  return hours >= 23 || hours < 6
}

const initialSections = isRestrictedTime()
  ? menuSections.filter((s) => s.title !== 'Everyday Classics' && s.title !== 'Classic Veg Combos')
  : menuSections

const initialCategories = initialSections.map((s) => s.title)

const initialAllMenuItems = initialSections.flatMap((section) =>
  section.items.map((item) => ({
    ...item,
    sectionId: section.id,
    sectionTitle: section.title,
    sectionImage: section.image,
  })),
)

function getItemMinPrice(item) {
  if (!item?.prices?.length) return 0
  const numericPrices = item.prices
    .map((p) => {
      const match = String(p.value || '').match(/(\d+)/)
      return match ? parseInt(match[1], 10) : 0
    })
    .filter((v) => v > 0)
  return numericPrices.length ? Math.min(...numericPrices) : 0
}

function isItemMatch(item, sectionTitle, query) {
  const search = query.toLowerCase().trim()
  if (!search) return true

  const words = search.split(/\s+/).filter(Boolean)
  const itemText = `${sectionTitle} ${item.name} ${item.toppings || ''} ${item.tag || ''} ${item.description || ''}`.toLowerCase()

  return words.every((word) => {
    if (itemText.includes(word)) return true
    if (word.endsWith('s') && itemText.includes(word.slice(0, -1))) return true
    if (word.endsWith('es') && itemText.includes(word.slice(0, -2))) return true
    if (word === 'maggi' && itemText.includes('maggie')) return true
    if (word === 'maggie' && itemText.includes('maggi')) return true
    if (word === 'fry' && itemText.includes('fries')) return true
    if (word === 'fries' && itemText.includes('fry')) return true
    return false
  })
}

const VIBE_FILTERS = [
  { id: 'all', label: 'All Items', icon: '🍽️' },
  { id: 'bestsellers', label: 'Bestsellers', icon: '🔥' },
  { id: 'paneer', label: 'Royal Paneer', icon: '👑' },
  { id: 'spicy', label: 'Spicy', icon: '🌶️' },
  { id: 'under99', label: 'Under ₹99', icon: '⚡' },
  { id: 'drinks', label: 'Drinks & Shakes', icon: '🥤' },
]

function matchesVibe(item, section, vibeId) {
  if (vibeId === 'all') return true
  if (vibeId === 'bestsellers') {
    return Boolean(
      item.tag ||
      section.title.includes('Loaded') ||
      section.title.includes('Everyday Classics')
    )
  }
  if (vibeId === 'paneer') {
    const text = `${item.name} ${item.toppings || ''} ${section.title}`.toLowerCase()
    return text.includes('paneer')
  }
  if (vibeId === 'spicy') {
    const text = `${item.name} ${item.toppings || ''} ${item.tag || ''}`.toLowerCase()
    return text.includes('chilli') || text.includes('chili') || text.includes('spicy') || text.includes('peri peri') || text.includes('tandoori')
  }
  if (vibeId === 'under99') {
    const minPrice = getItemMinPrice(item)
    return minPrice > 0 && minPrice <= 99
  }
  if (vibeId === 'drinks') {
    return section.title.includes('Drinks') || /coffee|shake|tea|chai|soda|beverage/i.test(item.name)
  }
  return true
}

const SEARCH_SUGGESTIONS = [
  { label: '🍕 Veg Loaded Pizza', query: 'Veg Loaded' },
  { label: '🥖 Stuffed Garlic Bread', query: 'Garlic Bread' },
  { label: '🥤 Cold Coffee', query: 'Cold Coffee' },
  { label: '👑 Paneer Tikka', query: 'Paneer' },
]

export default function MenuPage() {
  const [searchParams] = useSearchParams()
  const requestedCategory = searchParams.get('category')
  const [activeCategory, setActiveCategory] = useState(
    initialCategories.includes(requestedCategory) ? requestedCategory : 'All',
  )
  const [activeVibeFilter, setActiveVibeFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [favorites, setFavorites] = useLocalStorage('crust-favorites', [])
  const [loading, setLoading] = useState(true)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [activeScrollSection, setActiveScrollSection] = useState(initialSections[0]?.id || '')
  const [showStickyBar, setShowStickyBar] = useState(false)
  const sectionsRef = useRef(null)
  const stickyScrollRef = useRef(null)
  const [columns, setColumns] = useState(() => {
    if (typeof window === 'undefined') return 1
    return window.innerWidth >= 768 ? 2 : 1
  })

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      const next = width >= 768 ? 2 : 1
      setColumns((prev) => (prev !== next ? next : prev))
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 300)
    return () => window.clearTimeout(timer)
  }, [])

  // ScrollSpy & Sticky Sub-Header Controller
  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY
          setShowStickyBar(scrollY > 160)

          // Check if user is scrolled near bottom of page
          const isAtBottom =
            window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60

          if (isAtBottom && initialSections.length > 0) {
            setActiveScrollSection(initialSections[initialSections.length - 1].id)
            ticking = false
            return
          }

          // Find section in view
          const offset = window.innerWidth >= 640 ? 150 : 135
          for (const section of initialSections) {
            const el = document.getElementById(section.id)
            if (el) {
              const rect = el.getBoundingClientRect()
              if (rect.top <= offset && rect.bottom > offset) {
                setActiveScrollSection(section.id)
                break
              }
            }
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Auto-center active category pill in sticky bar
  useEffect(() => {
    if (!stickyScrollRef.current || !activeScrollSection) return
    const activeBtn = stickyScrollRef.current.querySelector(`[data-section-btn="${activeScrollSection}"]`)
    if (activeBtn) {
      const container = stickyScrollRef.current
      const containerWidth = container.clientWidth
      const btnLeft = activeBtn.offsetLeft
      const btnWidth = activeBtn.clientWidth
      container.scrollTo({
        left: btnLeft - containerWidth / 2 + btnWidth / 2,
        behavior: 'smooth',
      })
    }
  }, [activeScrollSection])

  // Sections filtered by query, category, and vibe
  const filteredSections = useMemo(() => {
    return initialSections
      .map((section) => {
        if (activeCategory !== 'All' && section.title !== activeCategory) {
          return { ...section, items: [] }
        }

        const items = section.items.filter((item) => {
          const matchQuery = isItemMatch(item, section.title, query)
          const matchVibe = matchesVibe(item, section, activeVibeFilter)
          return matchQuery && matchVibe
        })

        return { ...section, items }
      })
      .filter((section) => section.items.length > 0)
  }, [query, activeCategory, activeVibeFilter])

  // Distribute sections across columns balancing heights so all columns stay filled with zero dead whitespace
  const columnBuckets = useMemo(() => {
    if (filteredSections.length <= 1) {
      return [filteredSections]
    }

    const colCount = Math.min(columns, filteredSections.length)
    if (colCount <= 1) {
      return [filteredSections]
    }

    const buckets = Array.from({ length: colCount }, () => [])
    const heights = Array(colCount).fill(0)

    for (const section of filteredSections) {
      let minCol = 0
      for (let i = 1; i < colCount; i++) {
        if (heights[i] < heights[minCol]) {
          minCol = i
        }
      }

      buckets[minCol].push(section)
      // Estimate section height: ~50px header + ~56px per dish row
      heights[minCol] += 50 + (section.items?.length || 0) * 56
    }

    return buckets
  }, [filteredSections, columns])

  const visibleItemCount = filteredSections.reduce((total, section) => total + section.items.length, 0)
  const totalMenuItemsCount = initialAllMenuItems.length
  const favoriteCount = favorites.filter((id) => initialAllMenuItems.some((item) => item.id === id)).length

  useEffect(() => {
    if (loading || !sectionsRef.current) {
      return undefined
    }

    const cards = sectionsRef.current.querySelectorAll('[data-card]')
    gsap.killTweensOf(cards)
    gsap.set(sectionsRef.current, { opacity: 1, y: 0 })
    gsap.fromTo(
      cards,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.22, stagger: 0.03, ease: 'power2.out', clearProps: 'all' },
    )

    return () => gsap.killTweensOf(cards)
  }, [activeCategory, activeVibeFilter, query, loading])

  const toggleFavorite = useCallback((itemId, triggerElement) => {
    animateFavoritePop(triggerElement)
    setFavorites((current) =>
      current.includes(itemId) ? current.filter((id) => id !== itemId) : [...current, itemId],
    )
  }, [setFavorites])

  const handleCategoryChange = useCallback((category) => {
    setActiveCategory(category)
    setQuery('')
    setIsDrawerOpen(false)
    scrollToTop()
  }, [])

  const handleScrollToSection = useCallback((sectionId) => {
    setActiveScrollSection(sectionId)

    const needsReset = activeCategory !== 'All' || activeVibeFilter !== 'all' || query
    if (needsReset) {
      setActiveCategory('All')
      setActiveVibeFilter('all')
      setQuery('')
    }

    const scrollToTarget = () => {
      const target = document.getElementById(sectionId)
      if (target) {
        const headerOffset = window.innerWidth >= 640 ? 115 : 105
        const targetY = target.getBoundingClientRect().top + window.scrollY - headerOffset
        window.scrollTo({
          top: Math.max(0, targetY),
          behavior: 'smooth',
        })
        return true
      }
      return false
    }

    if (!needsReset) {
      scrollToTarget()
    } else {
      setTimeout(scrollToTarget, 60)
      setTimeout(scrollToTarget, 180)
    }
  }, [activeCategory, activeVibeFilter, query])

  const handleResetFilters = useCallback(() => {
    setQuery('')
    setActiveCategory('All')
    setActiveVibeFilter('all')
  }, [])

  return (
    <div className="mx-auto max-w-6xl px-2.5 pb-20 pt-2 sm:px-6 sm:pb-24 sm:pt-3 lg:px-8">
      {/* 1. Search and Status Row (Compact, Single Row on all screens) */}
      <div className="mb-2 flex items-center gap-2 sm:mb-2.5 sm:gap-3">
        <div className="min-w-0 flex-1">
          <SearchBar value={query} onChange={setQuery} />
        </div>
        <div className="shrink-0">
          <LiveStatusBadge />
        </div>
      </div>

      {/* 2. Smart Vibe & Budget Filters */}
      <div className="no-scrollbar mb-2 flex items-center gap-1.5 overflow-x-auto py-0.5 sm:mb-2.5 sm:gap-2">
        {VIBE_FILTERS.map((filter) => {
          const isActive = activeVibeFilter === filter.id
          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => {
                setActiveVibeFilter(filter.id)
                if (activeCategory !== 'All') setActiveCategory('All')
              }}
              className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-extrabold transition-all duration-200 cursor-pointer sm:px-3 sm:py-1.2 sm:text-xs ${
                isActive
                  ? 'bg-gradient-to-r from-[var(--orange)] to-[#ea580c] text-white shadow-xs scale-102'
                  : 'border border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--gold)]/50'
              }`}
            >
              <span className="text-xs leading-none">{filter.icon}</span>
              <span>{filter.label}</span>
            </button>
          )
        })}
      </div>

      {/* 3. Visual Category Photo Strip */}
      {(!query || filteredSections.length > 0) && (
        <MenuImageStrip
          sections={initialSections}
          activeCategory={activeCategory}
          onSelect={handleCategoryChange}
        />
      )}

      {/* Sticky Sub-Header with Category ScrollSpy Navigation */}
      <div
        className={`sticky top-[52px] sm:top-[58px] z-30 transition-all duration-300 ${
          showStickyBar
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-2 pointer-events-none'
        } -mx-2.5 sm:-mx-6 lg:-mx-8 px-2.5 sm:px-6 lg:px-8 py-1.5 bg-[var(--bg)]/95 backdrop-blur-xl border-b border-[var(--line)] shadow-xs mb-2.5`}
      >
        <div className="mx-auto  flex items-center justify-between gap-2">
          {/* Scrollable category pills */}
          <div
            ref={stickyScrollRef}
            className="no-scrollbar flex items-center gap-1.5 overflow-x-auto py-0.5"
          >
            {initialSections.map((section) => {
              const isCurrent = activeScrollSection === section.id
              return (
                <button
                  key={section.id}
                  data-section-btn={section.id}
                  type="button"
                  onClick={() => handleScrollToSection(section.id)}
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold transition-all duration-200 cursor-pointer ${
                    isCurrent
                      ? 'bg-gradient-to-r from-[var(--orange)] to-[#ea580c] text-white shadow-xs'
                      : 'border border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--gold)]/40'
                  }`}
                >
                  <span>{section.title}</span>
                </button>
              )
            })}
          </div>

          {/* Quick Category Drawer Button */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="shrink-0 inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--surface-strong)] px-2.5 py-1 text-[11px] font-black text-[var(--text)] hover:border-[var(--orange)] transition cursor-pointer"
            title="All Categories"
          >
            <FiGrid className="text-[var(--orange)] text-xs" />
            <span className="hidden min-[480px]:inline">Categories</span>
          </button>
        </div>
      </div>

      {/* Active Filter Banner */}
      {(query || activeCategory !== 'All' || activeVibeFilter !== 'all') && (
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--orange)]/30 bg-[var(--orange)]/10 px-3 py-1.5 sm:mb-2.5 sm:px-3.5 sm:py-2 text-xs font-bold text-[var(--orange)]">
          <div className="flex items-center gap-2">
            {query ? (
              <span>
                Search: &ldquo;<span className="text-[var(--text)] font-extrabold">{query}</span>&rdquo;
              </span>
            ) : activeCategory !== 'All' ? (
              <span>
                Category: <span className="text-[var(--text)] font-extrabold">{activeCategory}</span>
              </span>
            ) : (
              <span>
                Filter: <span className="text-[var(--text)] font-extrabold">{VIBE_FILTERS.find((f) => f.id === activeVibeFilter)?.label}</span>
              </span>
            )}
            <span className="rounded-full bg-[var(--orange)] px-2 py-0.2 text-[10px] text-white font-black">
              {visibleItemCount} items
            </span>
          </div>

          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1 rounded-full bg-[var(--surface)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--text)] border border-[var(--line)] transition hover:border-[var(--orange)] cursor-pointer"
          >
            <FiRotateCcw className="text-xs" />
            <span>Reset</span>
          </button>
        </div>
      )}

      {/* Count & Favorites Bar */}
      <div className="mb-2 flex items-center justify-between gap-3 text-[11px] font-semibold text-[var(--muted)] sm:mb-2.5 sm:text-xs">
        <p>
          Showing <span className="font-extrabold text-[var(--text)]">{visibleItemCount}</span> dishes
        </p>
        <p className="flex items-center gap-1.5">
          <FiHeart className="text-[var(--orange)] fill-[var(--orange)] text-xs sm:text-sm" />
          <span>{favoriteCount} saved</span>
        </p>
      </div>

      {/* Sections Display */}
      {loading ? (
        <SkeletonLoader count={8} />
      ) : (
        <div ref={sectionsRef}>
          {filteredSections.length === 1 ? (
            <div className="max-w-2xl sm:max-w-3xl mx-auto">
              <MenuSectionCard
                key={`${filteredSections[0].id}-${query ? 'search' : activeCategory}-${activeVibeFilter}`}
                section={filteredSections[0]}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                onSelectItem={setSelectedItem}
                query={query}
              />
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-2.5 sm:gap-3 md:gap-3.5 items-start">
              {columnBuckets.map((bucket, colIdx) => (
                <div
                  key={colIdx}
                  className="flex flex-1 flex-col gap-2.5 sm:gap-3 md:gap-3.5 min-w-0 w-full"
                >
                  {bucket.map((section) => (
                    <MenuSectionCard
                      key={`${section.id}-${query ? 'search' : activeCategory}-${activeVibeFilter}`}
                      section={section}
                      favorites={favorites}
                      onToggleFavorite={toggleFavorite}
                      onSelectItem={setSelectedItem}
                      query={query}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Smart Zero Results State & Suggestions */}
      {!loading && visibleItemCount === 0 && (
        <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 text-center sm:p-10 shadow-xs space-y-4">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[var(--orange)]/10 text-xl text-[var(--orange)]">
            <FiSearch />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black text-[var(--text)] sm:text-lg">
              No dishes found
            </h3>
            <p className="text-xs text-[var(--muted)] max-w-sm mx-auto">
              We couldn&apos;t find any items matching your current filters. Try one of our popular dishes below:
            </p>
          </div>

          {/* Clickable Recovery Suggestions */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {SEARCH_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion.label}
                type="button"
                onClick={() => {
                  setQuery(suggestion.query)
                  setActiveCategory('All')
                  setActiveVibeFilter('all')
                }}
                className="rounded-full border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-1 text-xs font-bold text-[var(--text)] hover:border-[var(--orange)] hover:text-[var(--orange)] transition cursor-pointer"
              >
                {suggestion.label}
              </button>
            ))}
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[var(--orange)] to-[#ea580c] px-5 py-2 text-xs font-black text-white shadow-md transition hover:brightness-105 cursor-pointer"
            >
              <span>Show All Menu Dishes</span>
              <FiArrowRight className="text-xs" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Category Quick Drawer Button (Mobile) */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30 md:hidden">
        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center gap-2 rounded-full bg-[#1c120c] px-4 py-2 text-xs font-black text-white shadow-2xl border border-white/20 backdrop-blur-xl transition hover:scale-105 active:scale-95 cursor-pointer"
        >
          <FiGrid className="text-sm text-[var(--orange)]" />
          <span>Categories</span>
          <span className="flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-[var(--orange)] px-1 text-[9px] font-black text-white">
            {initialSections.length}
          </span>
        </button>
      </div>

      {/* Mobile Category Selection Drawer Modal */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs md:hidden">
          <div className="max-h-[80vh] w-full overflow-y-auto rounded-t-3xl border-t border-[var(--line)] bg-[var(--surface)] p-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FiGrid className="text-[var(--orange)] text-base" />
                <h3 className="font-display text-base font-black text-[var(--text)]">
                  Menu Categories
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full border border-[var(--line)] text-[var(--text)] cursor-pointer"
                aria-label="Close categories drawer"
              >
                <FiX />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setIsDrawerOpen(false)
                  handleResetFilters()
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className={`flex items-center justify-between rounded-xl p-2.5 text-left font-extrabold text-xs transition cursor-pointer ${
                  activeCategory === 'All' && activeScrollSection === initialSections[0]?.id
                    ? 'bg-[var(--orange)] text-white'
                    : 'bg-[var(--bg-soft)] text-[var(--text)] hover:bg-[var(--line)]/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">🍽️</span>
                  <span>All Dishes</span>
                </div>
                <span className="text-[10px] font-bold opacity-80">
                  {totalMenuItemsCount} items
                </span>
              </button>

              {initialSections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => {
                    setIsDrawerOpen(false)
                    handleScrollToSection(section.id)
                  }}
                  className={`flex items-center justify-between rounded-xl p-2 text-left font-extrabold text-xs transition cursor-pointer ${
                    activeScrollSection === section.id
                      ? 'bg-[var(--orange)] text-white'
                      : 'bg-[var(--bg-soft)] text-[var(--text)] hover:bg-[var(--line)]/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={section.image}
                      alt=""
                      className="h-7 w-7 rounded-lg object-cover border border-white/20"
                    />
                    <span className="truncate">{section.title}</span>
                  </div>
                  <span className="shrink-0 text-[10px] font-bold opacity-80 ml-2">
                    {section.items.length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Item Detail Sheet */}
      {selectedItem && (
        <MenuItemSheet
          item={selectedItem}
          favorites={favorites}
          onClose={() => setSelectedItem(null)}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </div>
  )
}

