import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiHeart, FiShare2 } from 'react-icons/fi'
import { gsap, staggerCards } from '../animations/gsapAnimations'
import CategoryTabs from '../components/CategoryTabs'
import FoodCard from '../components/FoodCard'
import ItemModal from '../components/ItemModal'
import SearchBar from '../components/SearchBar'
import SkeletonLoader from '../components/SkeletonLoader'
import menuData from '../data/menu.json'
import { useLocalStorage } from '../hooks/useLocalStorage'

export default function MenuPage() {
  const [searchParams] = useSearchParams()
  const requestedCategory = searchParams.get('category')
  const [activeCategory, setActiveCategory] = useState(
    menuData.categories.includes(requestedCategory) ? requestedCategory : 'All',
  )
  const [query, setQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [favorites, setFavorites] = useLocalStorage('crust-favorites', [])
  const [loading, setLoading] = useState(true)
  const gridRef = useRef(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 360)
    return () => window.clearTimeout(timer)
  }, [])

  const filteredItems = useMemo(() => {
    return menuData.items.filter((item) => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory
      const matchesQuery = `${item.name} ${item.description} ${item.category}`
        .toLowerCase()
        .includes(query.toLowerCase().trim())
      return matchesCategory && matchesQuery
    })
  }, [activeCategory, query])

  useEffect(() => {
    if (loading || !gridRef.current) {
      return undefined
    }

    const context = staggerCards(gridRef)
    return () => context.revert()
  }, [activeCategory, query, loading])

  const toggleFavorite = (itemId) => {
    setFavorites((current) =>
      current.includes(itemId) ? current.filter((id) => id !== itemId) : [...current, itemId],
    )
  }

  const shareMenu = async () => {
    const url = `${window.location.origin}/menu`
    if (navigator.share) {
      await navigator.share({
        title: 'The Crust Culture Menu',
        text: 'Browse The Crust Culture digital menu.',
        url,
      })
      return
    }

    await navigator.clipboard.writeText(url)
  }

  const handleCategoryChange = (category) => {
    gsap.to(gridRef.current, {
      opacity: 0,
      y: 12,
      duration: 0.15,
      onComplete: () => setActiveCategory(category),
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <section className="mb-6 rounded-[2rem] border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[var(--gold)]">
              Scan, browse, choose
            </p>
            <h1 className="font-display mt-3 text-4xl font-semibold leading-tight text-[var(--text)] sm:text-6xl">
              The Crust Culture Menu
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--muted)]">
              Built for table QR access with quick filters, large touch targets, and rich item
              details.
            </p>
          </div>
          <button
            type="button"
            onClick={shareMenu}
            className="touch-target inline-flex items-center justify-center gap-2 rounded-full bg-[var(--cream)] px-5 font-black text-[#24150b]"
          >
            <FiShare2 /> Share menu
          </button>
        </div>
      </section>

      <div className="mb-4 grid gap-3 lg:grid-cols-[1fr_320px]">
        <CategoryTabs
          categories={menuData.categories}
          activeCategory={activeCategory}
          onChange={handleCategoryChange}
        />
        <SearchBar value={query} onChange={setQuery} />
      </div>

      <div className="mb-5 flex items-center justify-between gap-4 text-sm text-[var(--muted)]">
        <p>
          Showing <span className="font-black text-[var(--gold)]">{filteredItems.length}</span> items
        </p>
        <p className="flex items-center gap-2">
          <FiHeart className="text-[var(--orange)]" />
          {favorites.length} saved
        </p>
      </div>

      {loading ? (
        <SkeletonLoader count={9} />
      ) : (
        <div ref={gridRef} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <FoodCard
              key={item.id}
              item={item}
              onSelect={setSelectedItem}
              isFavorite={favorites.includes(item.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}

      {!loading && filteredItems.length === 0 && (
        <div className="rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface)] p-8 text-center">
          <p className="text-lg font-black text-[var(--text)]">No dishes matched your search.</p>
          <p className="mt-2 text-sm text-[var(--muted)]">Try another category or remove a keyword.</p>
        </div>
      )}

      <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  )
}
