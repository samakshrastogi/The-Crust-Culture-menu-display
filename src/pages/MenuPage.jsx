import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiHeart } from 'react-icons/fi'
import { animateFavoritePop, gsap, scrollToElement, scrollToTop } from '../animations/gsapAnimations'
import CategoryTabs from '../components/CategoryTabs'
import MenuImageStrip from '../components/MenuImageStrip'
import MenuItemSheet from '../components/MenuItemSheet'
import MenuSectionCard from '../components/MenuSectionCard'
import SearchBar from '../components/SearchBar'
import SkeletonLoader from '../components/SkeletonLoader'
import { allMenuItems, menuCategories, menuSections } from '../data/menuSections'
import { useLocalStorage } from '../hooks/useLocalStorage'

export default function MenuPage() {
  const [searchParams] = useSearchParams()
  const requestedCategory = searchParams.get('category')
  const [activeCategory, setActiveCategory] = useState(
    menuCategories.includes(requestedCategory) ? requestedCategory : 'All',
  )
  const [query, setQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [favorites, setFavorites] = useLocalStorage('crust-favorites', [])
  const [loading, setLoading] = useState(true)
  const sectionsRef = useRef(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 360)
    return () => window.clearTimeout(timer)
  }, [])

  const filteredSections = useMemo(() => {
    const search = query.toLowerCase().trim()

    return menuSections
      .map((section) => {
        const items = section.items.filter((item) => {
          if (!search) {
            return true
          }

          return `${section.title} ${item.name} ${item.toppings || ''}`.toLowerCase().includes(search)
        })

        return { ...section, items }
      })
      .filter((section) => section.items.length > 0)
  }, [query])

  const visibleItemCount = filteredSections.reduce((total, section) => total + section.items.length, 0)

  const favoriteCount = favorites.filter((id) => allMenuItems.some((item) => item.id === id)).length

  const searchSuggestions = useMemo(() => {
    const search = query.toLowerCase().trim()
    if (!search) {
      return []
    }

    return allMenuItems
      .filter((item) => `${item.sectionTitle} ${item.name} ${item.toppings || ''}`.toLowerCase().includes(search))
      .slice(0, 6)
  }, [query])

  useEffect(() => {
    if (loading || !sectionsRef.current) {
      return undefined
    }

    const cards = sectionsRef.current.querySelectorAll('[data-card]')
    gsap.set(sectionsRef.current, { opacity: 1, y: 0 })
    gsap.fromTo(
      cards,
      { y: 10 },
      { y: 0, duration: 0.22, stagger: 0.025, ease: 'power2.out', clearProps: 'transform' },
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

    window.setTimeout(() => {
      if (category === 'All') {
        scrollToTop()
        return
      }

      scrollToElement(document.getElementById(category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')))
    }, 0)
  }

  return (
    <div className="mx-auto max-w-7xl px-3 pb-12 pt-3 sm:px-6 sm:pb-16 sm:pt-6 lg:px-8">
      <section className="mb-3 overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 sm:mb-6 sm:rounded-[2rem] sm:p-8">
        <h1 className="font-display max-w-full text-2xl font-semibold leading-tight text-[var(--text)] sm:mt-3 sm:text-6xl">
          The Crust Culture Menu
        </h1>
      </section>

      <div className="mb-3 grid gap-2 sm:mb-4 sm:gap-3 lg:grid-cols-[1fr_320px]">
        <CategoryTabs
          categories={menuCategories}
          activeCategory={activeCategory}
          onChange={handleCategoryChange}
        />
        <SearchBar value={query} onChange={setQuery} />
      </div>

      <MenuImageStrip sections={menuSections} activeCategory={activeCategory} onSelect={handleCategoryChange} />

      {searchSuggestions.length > 0 && (
        <section className="mb-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-2 sm:mb-5">
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {searchSuggestions.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedItem(item)}
                className="shrink-0 rounded-full border border-[var(--line)] bg-[var(--bg-soft)] px-3 py-2 text-xs font-bold text-[var(--text)]"
              >
                {item.name}
              </button>
            ))}
          </div>
        </section>
      )}

      <div className="mb-3 flex items-center justify-between gap-4 text-xs text-[var(--muted)] sm:mb-5 sm:text-sm">
        <p>
          Showing <span className="font-black text-[var(--gold)]">{visibleItemCount}</span> priced items
        </p>
        <p className="flex items-center gap-2">
          <FiHeart className="text-[var(--orange)]" />
          {favoriteCount} saved
        </p>
      </div>

      {loading ? (
        <SkeletonLoader count={9} />
      ) : (
        <div ref={sectionsRef} className="grid gap-3 lg:grid-cols-2 lg:gap-4">
          {filteredSections.map((section) => (
            <MenuSectionCard
              key={section.id}
              section={section}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onSelectItem={setSelectedItem}
              query={query}
            />
          ))}
        </div>
      )}

      {!loading && visibleItemCount === 0 && (
        <div className="rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface)] p-8 text-center">
          <p className="text-lg font-black text-[var(--text)]">No dishes matched your search.</p>
          <p className="mt-2 text-sm text-[var(--muted)]">Try another category or remove a keyword.</p>
        </div>
      )}
      <MenuItemSheet
        item={selectedItem}
        favorites={favorites}
        onClose={() => setSelectedItem(null)}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  )
}
