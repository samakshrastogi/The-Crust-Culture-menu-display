import { useEffect, useMemo, useRef, useState, useCallback, useDeferredValue, lazy, Suspense } from 'react'
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
import MenuSectionCard from '../components/MenuSectionCard'
import SearchBar from '../components/SearchBar'
import SearchDishCard from '../components/SearchDishCard'
import { menuSections } from '../data/menuSections'
import { useLocalStorage } from '../hooks/useLocalStorage'

const MenuItemSheet = lazy(() => import('../components/MenuItemSheet'))

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
  const deferredQuery = useDeferredValue(query)
  const [selectedItem, setSelectedItem] = useState(null)
  const [favorites, setFavorites] = useLocalStorage('crust-favorites', [])
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


  // Lightweight Sticky Sub-Header Controller (monitors scroll threshold)
  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setShowStickyBar(window.scrollY > 160)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Zero-Reflow Hardware Accelerated ScrollSpy via IntersectionObserver
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
          setActiveScrollSection(visible[0].target.id)
        }
      },
      {
        rootMargin: '-120px 0px -55% 0px',
        threshold: [0, 0.15],
      },
    )

    initialSections.forEach((sec) => {
      const el = document.getElementById(sec.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
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

  // Sections filtered by deferred query, category, and vibe
  const filteredSections = useMemo(() => {
    return initialSections
      .map((section) => {
        if (activeCategory !== 'All' && section.title !== activeCategory) {
          return { ...section, items: [] }
        }

        const items = section.items.filter((item) => {
          const matchQuery = isItemMatch(item, section.title, deferredQuery)
          const matchVibe = matchesVibe(item, section, activeVibeFilter)
          return matchQuery && matchVibe
        })

        return { ...section, items }
      })
      .filter((section) => section.items.length > 0)
  }, [deferredQuery, activeCategory, activeVibeFilter])

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

  const allSearchItems = useMemo(() => {
    if (!deferredQuery?.trim()) return []
    return initialSections.flatMap((section) =>
      section.items
        .filter((item) => {
          const matchQuery = isItemMatch(item, section.title, deferredQuery)
          const matchVibe = matchesVibe(item, section, activeVibeFilter)
          return matchQuery && matchVibe
        })
        .map((item) => ({
          ...item,
          sectionTitle: section.title,
          sectionImage: section.image,
        })),
    )
  }, [deferredQuery, activeVibeFilter])

  const searchCategories = useMemo(() => {
    if (!deferredQuery?.trim()) return []
    const catMap = new Map()
    allSearchItems.forEach((item) => {
      catMap.set(item.sectionTitle, (catMap.get(item.sectionTitle) || 0) + 1)
    })
    return Array.from(catMap.entries()).map(([title, count]) => ({ title, count }))
  }, [allSearchItems, deferredQuery])

  const searchItems = useMemo(() => {
    if (activeCategory === 'All') return allSearchItems
    return allSearchItems.filter((item) => item.sectionTitle === activeCategory)
  }, [allSearchItems, activeCategory])

  const visibleItemCount = deferredQuery?.trim()
    ? searchItems.length
    : filteredSections.reduce((total, section) => total + section.items.length, 0)
  const totalMenuItemsCount = initialAllMenuItems.length
  const favoriteCount = favorites.filter((id) => initialAllMenuItems.some((item) => item.id === id)).length

  useEffect(() => {
    if (!sectionsRef.current) {
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
  }, [activeCategory, activeVibeFilter, deferredQuery])

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
    <div className="mx-auto  px-2.5 pb-20 pt-2 sm:px-6 sm:pb-24 sm:pt-3 lg:px-8">
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

      {/* 3. Visual Category Photo Strip (hidden when searching) */}
      {!query && (
        <MenuImageStrip
          sections={initialSections}
          activeCategory={activeCategory}
          onSelect={handleCategoryChange}
        />
      )}

      {/* Sticky Sub-Header with Category ScrollSpy Navigation (hidden when searching) */}
      {!query && (
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
      )}

      {/* Active Search Mode UI */}
      {query ? (
        <div className="space-y-3 pt-1">
          {/* Search Header Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--orange)]/30 bg-gradient-to-r from-[var(--orange)]/10 via-[var(--surface)] to-[var(--surface-strong)]/60 p-3 sm:p-3.5 shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="grid h-8 w-8 sm:h-9 sm:w-9 shrink-0 place-items-center rounded-xl bg-[var(--orange)] text-white shadow-xs">
                <FiSearch className="text-sm sm:text-base" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs sm:text-sm font-extrabold text-[var(--text)]">
                    Results for &ldquo;<span className="text-[var(--orange)] font-black">{query}</span>&rdquo;
                  </span>
                  <span className="rounded-full bg-[var(--orange)] px-2 py-0.2 text-[10px] font-black text-white shadow-2xs">
                    {allSearchItems.length} {allSearchItems.length === 1 ? 'dish' : 'dishes'}
                  </span>
                </div>
                <p className="text-[11px] font-medium text-[var(--muted)]">
                  {searchCategories.length === 1
                    ? `Found in ${searchCategories[0]?.title}`
                    : `Found across ${searchCategories.length} categories`}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1 text-xs font-bold text-[var(--text)] transition hover:border-[var(--orange)] hover:text-[var(--orange)] cursor-pointer active:scale-95 shadow-2xs shrink-0"
            >
              <FiX className="text-xs" />
              <span>Clear Search</span>
            </button>
          </div>

          {/* Quick Category Filter Pills within Search Results */}
          {searchCategories.length > 1 && (
            <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto py-0.5">
              <button
                type="button"
                onClick={() => setActiveCategory('All')}
                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer ${
                  activeCategory === 'All'
                    ? 'bg-gradient-to-r from-[var(--orange)] to-[#ea580c] text-white shadow-xs'
                    : 'border border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--gold)]/40'
                }`}
              >
                All ({allSearchItems.length})
              </button>
              {searchCategories.map((cat) => (
                <button
                  key={cat.title}
                  type="button"
                  onClick={() => setActiveCategory(activeCategory === cat.title ? 'All' : cat.title)}
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer ${
                    activeCategory === cat.title
                      ? 'bg-gradient-to-r from-[var(--orange)] to-[#ea580c] text-white shadow-xs'
                      : 'border border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--gold)]/40'
                  }`}
                >
                  {cat.title} ({cat.count})
                </button>
              ))}
            </div>
          )}

          {/* Search Results Dish Grid */}
          {searchItems.length > 0 ? (
            <div ref={sectionsRef}>
              {searchItems.length === 1 ? (
                <div className="max-w-xl mx-auto">
                  <SearchDishCard
                    key={`${searchItems[0].id}-${searchItems[0].sectionTitle}`}
                    item={searchItems[0]}
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                    onSelectItem={setSelectedItem}
                    query={query}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3 md:gap-3.5">
                  {searchItems.map((item) => (
                    <SearchDishCard
                      key={`${item.id}-${item.sectionTitle}`}
                      item={item}
                      favorites={favorites}
                      onToggleFavorite={toggleFavorite}
                      onSelectItem={setSelectedItem}
                      query={query}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </div>
      ) : (
        /* Regular Menu Display */
        <>
          {/* Active Filter Banner */}
          {(activeCategory !== 'All' || activeVibeFilter !== 'all') && (
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--orange)]/30 bg-[var(--orange)]/10 px-3 py-1.5 sm:mb-2.5 sm:px-3.5 sm:py-2 text-xs font-bold text-[var(--orange)]">
              <div className="flex items-center gap-2">
                {activeCategory !== 'All' ? (
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
          <div ref={sectionsRef}>
            {filteredSections.length === 1 ? (
              <div className="max-w-2xl sm:max-w-3xl mx-auto">
                <MenuSectionCard
                  key={`${filteredSections[0].id}-${activeCategory}-${activeVibeFilter}`}
                  section={filteredSections[0]}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  onSelectItem={setSelectedItem}
                  query={deferredQuery}
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
                        key={`${section.id}-${activeCategory}-${activeVibeFilter}`}
                        section={section}
                        favorites={favorites}
                        onToggleFavorite={toggleFavorite}
                        onSelectItem={setSelectedItem}
                        query={deferredQuery}
                      />
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Smart Zero Results State & Suggestions */}
      {visibleItemCount === 0 && (
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
        <Suspense fallback={null}>
          <MenuItemSheet
            item={selectedItem}
            favorites={favorites}
            onClose={() => setSelectedItem(null)}
            onToggleFavorite={toggleFavorite}
          />
        </Suspense>
      )}
    </div>
  )
}

