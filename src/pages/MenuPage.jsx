import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  FiArrowRight,
  FiGrid,
  FiHeart,
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

const quickTags = [
  { label: '🍕 Pizzas', term: 'pizza' },
  { label: '🧀 Paneer Special', term: 'paneer' },
  { label: '🥖 Garlic Bread', term: 'garlic bread' },
  { label: '🍔 Burgers', term: 'burger' },
  { label: '🥪 Sandwiches', term: 'sandwich' },
  { label: '🥟 Momos', term: 'momo' },
  { label: '🍟 Fries', term: 'fries' },
  { label: '🍜 Maggie', term: 'maggie' },
  { label: '🥤 Drinks & Shakes', term: 'drink' },
]

export default function MenuPage() {
  const [searchParams] = useSearchParams()
  const requestedCategory = searchParams.get('category')
  const [activeCategory, setActiveCategory] = useState(
    initialCategories.includes(requestedCategory) ? requestedCategory : 'All',
  )
  const [query, setQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [favorites, setFavorites] = useLocalStorage('crust-favorites', [])
  const [loading, setLoading] = useState(true)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const sectionsRef = useRef(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 300)
    return () => window.clearTimeout(timer)
  }, [])

  // Sections filtered by search query
  const filteredSections = useMemo(() => {
    return initialSections
      .map((section) => {
        const items = section.items.filter((item) =>
          isItemMatch(item, section.title, query),
        )

        return { ...section, items }
      })
      .filter((section) => section.items.length > 0)
  }, [query])

  // Sections currently displayed (respecting activeCategory when not searching)
  const displayedSections = useMemo(() => {
    if (query) {
      return filteredSections
    }
    if (activeCategory === 'All') {
      return initialSections
    }
    return initialSections.filter((s) => s.title === activeCategory)
  }, [query, activeCategory, filteredSections])

  const visibleItemCount = displayedSections.reduce((total, section) => total + section.items.length, 0)
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
  }, [activeCategory, query, loading])

  const toggleFavorite = (itemId, triggerElement) => {
    animateFavoritePop(triggerElement)
    setFavorites((current) =>
      current.includes(itemId) ? current.filter((id) => id !== itemId) : [...current, itemId],
    )
  }

  const handleCategoryChange = (category) => {
    setActiveCategory(category)
    setQuery('')
    setIsDrawerOpen(false)
    scrollToTop()
  }

  const handleQuickTagClick = (tag) => {
    if (query === tag.term) {
      setQuery('')
    } else {
      setQuery(tag.term)
      setActiveCategory('All')
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-2.5 pb-20 pt-2 sm:px-6 sm:pb-24 sm:pt-3 lg:px-8">
      {/* Search and Status Row (Compact, Single Row on all screens) */}
      <div className="mb-2 flex items-center gap-2 sm:mb-3 sm:gap-3">
        <div className="min-w-0 flex-1">
          <SearchBar value={query} onChange={setQuery} />
        </div>
        <div className="shrink-0">
          <LiveStatusBadge />
        </div>
      </div>

      {/* Quick Search Chips */}
      <div className="no-scrollbar mb-2 flex items-center gap-1.5 overflow-x-auto py-0.5 sm:mb-2.5 sm:gap-2">
        <button
          type="button"
          onClick={() => {
            setQuery('')
            setActiveCategory('All')
          }}
          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold transition sm:px-3 sm:py-1.5 sm:text-xs ${
            !query && activeCategory === 'All'
              ? 'bg-[var(--orange)] text-white shadow-xs'
              : 'border border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--text)]'
          }`}
        >
          All Items ({totalMenuItemsCount})
        </button>

        {quickTags.map((tag) => {
          const isActive = query.toLowerCase() === tag.term.toLowerCase()
          return (
            <button
              key={tag.label}
              type="button"
              onClick={() => handleQuickTagClick(tag)}
              className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold transition sm:px-3 sm:py-1.5 sm:text-xs ${
                isActive
                  ? 'bg-gradient-to-r from-[var(--orange)] to-amber-500 text-white shadow-xs'
                  : 'border border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--gold)]'
              }`}
            >
              {tag.label}
            </button>
          )
        })}
      </div>

      {/* Visual Category Photo Strip */}
      {(!query || filteredSections.length > 0) && (
        <MenuImageStrip
          sections={initialSections}
          activeCategory={activeCategory}
          onSelect={handleCategoryChange}
        />
      )}

      {/* Active Filter / Search Banner */}
      {(query || activeCategory !== 'All') && (
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--orange)]/30 bg-[var(--orange)]/10 px-3 py-1.5 sm:mb-2.5 sm:px-3.5 sm:py-2 text-xs font-bold text-[var(--orange)]">
          <div className="flex items-center gap-2">
            {query ? (
              <span>
                Search results for &ldquo;<span className="text-[var(--text)] font-extrabold">{query}</span>&rdquo;
              </span>
            ) : (
              <span>
                Filtered by category: <span className="text-[var(--text)] font-extrabold">{activeCategory}</span>
              </span>
            )}
            <span className="rounded-full bg-[var(--orange)] px-2 py-0.5 text-[10px] text-white font-black">
              {visibleItemCount} items
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              setQuery('')
              setActiveCategory('All')
            }}
            className="inline-flex items-center gap-1 rounded-full bg-[var(--surface)] px-2.5 py-0.5 text-[11px] font-bold text-[var(--text)] border border-[var(--line)] transition hover:border-[var(--orange)]"
          >
            <FiX className="text-xs" />
            <span>Reset to All</span>
          </button>
        </div>
      )}

      {/* Count & Favorites Bar */}
      <div className="mb-2 flex items-center justify-between gap-3 text-[11px] font-semibold text-[var(--muted)] sm:mb-2.5 sm:text-xs">
        <p>
          Showing <span className="font-extrabold text-[var(--text)]">{visibleItemCount}</span> delicious dishes
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
          {/* Mobile view (single column < 768px) */}
          <div className="flex flex-col gap-2.5 sm:gap-3 md:hidden">
            {displayedSections.map((section) => (
              <MenuSectionCard
                key={`${section.id}-${query ? 'search' : activeCategory}`}
                section={section}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                onSelectItem={setSelectedItem}
                query={query}
              />
            ))}
          </div>

          {/* Tablet & Desktop view (2 columns masonry >= 768px) */}
          <div className="hidden md:block">
            {displayedSections.length === 1 ? (
              <div className="max-w-3xl mx-auto">
                <MenuSectionCard
                  key={`${displayedSections[0].id}-${query ? 'search' : activeCategory}`}
                  section={displayedSections[0]}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  onSelectItem={setSelectedItem}
                  query={query}
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3.5 items-start">
                <div className="flex flex-col gap-3.5">
                  {displayedSections
                    .filter((_, idx) => idx % 2 === 0)
                    .map((section) => (
                      <MenuSectionCard
                        key={`${section.id}-${query ? 'search' : activeCategory}`}
                        section={section}
                        favorites={favorites}
                        onToggleFavorite={toggleFavorite}
                        onSelectItem={setSelectedItem}
                        query={query}
                      />
                    ))}
                </div>
                <div className="flex flex-col gap-3.5">
                  {displayedSections
                    .filter((_, idx) => idx % 2 !== 0)
                    .map((section) => (
                      <MenuSectionCard
                        key={`${section.id}-${query ? 'search' : activeCategory}`}
                        section={section}
                        favorites={favorites}
                        onToggleFavorite={toggleFavorite}
                        onSelectItem={setSelectedItem}
                        query={query}
                      />
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Zero Results State */}
      {!loading && visibleItemCount === 0 && (
        <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-8 text-center sm:p-12 shadow-sm">
          <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-[var(--orange)]/10 text-2xl text-[var(--orange)]">
            <FiSearch />
          </div>
          <h3 className="text-lg font-black text-[var(--text)] sm:text-xl">
            No dishes matched your search
          </h3>
          <p className="mt-1.5 text-xs text-[var(--muted)] max-w-sm mx-auto sm:text-sm">
            We couldn&apos;t find any items matching &ldquo;{query}&rdquo;. Try another dish name or explore our categories.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setActiveCategory('All')
            }}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[var(--orange)] to-[#ea580c] px-6 py-2.5 text-xs font-black text-white shadow-md transition hover:brightness-105"
          >
            <span>Show All Dishes</span>
            <FiArrowRight className="text-xs" />
          </button>
        </div>
      )}

      {/* Floating Category Quick Drawer Button (Mobile) */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30 md:hidden">
        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center gap-2 rounded-full bg-[#1c120c] px-5 py-2.5 text-xs font-black text-white shadow-2xl border border-white/20 backdrop-blur-xl transition hover:scale-105 active:scale-95"
        >
          <FiGrid className="text-sm text-[var(--orange)]" />
          <span>Categories</span>
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--orange)] px-1 text-[10px] font-black text-white">
            {initialSections.length}
          </span>
        </button>
      </div>

      {/* Mobile Category Selection Drawer Modal */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs md:hidden">
          <div className="max-h-[80vh] w-full overflow-y-auto rounded-t-3xl border-t border-[var(--line)] bg-[var(--surface)] p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FiGrid className="text-[var(--orange)] text-base" />
                <h3 className="font-display text-lg font-black text-[var(--text)]">
                  Menu Categories
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full border border-[var(--line)] text-[var(--text)]"
                aria-label="Close categories drawer"
              >
                <FiX />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleCategoryChange('All')}
                className={`flex items-center justify-between rounded-xl p-3 text-left font-extrabold text-xs transition ${
                  activeCategory === 'All'
                    ? 'bg-[var(--orange)] text-white'
                    : 'bg-[var(--bg-soft)] text-[var(--text)] hover:bg-[var(--line)]/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">🍽️</span>
                  <span>All Dishes</span>
                </div>
                <span className="text-[11px] font-bold opacity-80">
                  {totalMenuItemsCount} items
                </span>
              </button>

              {initialSections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => handleCategoryChange(section.title)}
                  className={`flex items-center justify-between rounded-xl p-2.5 text-left font-extrabold text-xs transition ${
                    activeCategory === section.title
                      ? 'bg-[var(--orange)] text-white'
                      : 'bg-[var(--bg-soft)] text-[var(--text)] hover:bg-[var(--line)]/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={section.image}
                      alt=""
                      className="h-8 w-8 rounded-lg object-cover border border-white/20"
                    />
                    <span className="truncate">{section.title}</span>
                  </div>
                  <span className="shrink-0 text-[11px] font-bold opacity-80 ml-2">
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
