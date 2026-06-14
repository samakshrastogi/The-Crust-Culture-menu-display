import { useState, useMemo } from 'react'
import { FiHeart } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import MenuSectionCard from '../components/MenuSectionCard'
import MenuItemSheet from '../components/MenuItemSheet'
import { menuSections } from '../data/menuSections'
import { useLocalStorage } from '../hooks/useLocalStorage'

export default function FavoritesPage() {
  const [favorites, setFavorites] = useLocalStorage('crust-favorites', [])
  const [selectedItem, setSelectedItem] = useState(null)

  const favoriteSections = useMemo(() => {
    return menuSections
      .map((section) => {
        const items = section.items
          .map((item) => ({
            ...item,
            sectionId: section.id,
            sectionTitle: section.title,
            sectionImage: section.image,
          }))
          .filter((item) => favorites.includes(item.id))

        return { ...section, items }
      })
      .filter((section) => section.items.length > 0)
  }, [favorites])

  const toggleFavorite = (itemId) => {
    setFavorites((current) =>
      current.includes(itemId) ? current.filter((id) => id !== itemId) : [...current, itemId],
    )
  }

  const totalFavorites = favoriteSections.reduce((acc, section) => acc + section.items.length, 0)

  return (
    <div className="mx-auto max-w-2xl px-3 py-4 pb-20 sm:px-6 sm:py-6">
      <section className="mb-4 overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 shadow-sm sm:mb-6 sm:p-5">
        <div className="flex items-center gap-3">
          <FiHeart className="text-2xl text-[var(--orange)] fill-[var(--orange)] sm:text-3xl" />
          <h1 className="font-display text-2xl font-semibold leading-tight text-[var(--text)] sm:text-3xl">
            My Favorites
          </h1>
        </div>
        <p className="mt-1.5 text-xs text-[var(--muted)] sm:text-sm">
          Saved dishes from your local storage.
        </p>
      </section>

      {totalFavorites === 0 ? (
        <div className="rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface)] p-8 text-center shadow-sm sm:p-12">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--bg-soft)] text-xl text-[var(--orange)] sm:h-16 sm:w-16 sm:text-2xl">
            <FiHeart />
          </div>
          <h2 className="mt-3 text-lg font-black text-[var(--text)] sm:mt-4 sm:text-xl">No favorites saved yet</h2>
          <p className="mt-1.5 text-xs text-[var(--muted)] max-w-md mx-auto leading-relaxed sm:text-sm">
            Browse our menu. Tap the heart icon on any dish to save it here!
          </p>
          <Link
            to="/menu"
            className="touch-target mt-4 inline-flex items-center justify-center rounded-full bg-[var(--orange)] px-5 py-2 text-xs font-black text-white shadow-lg transition hover:bg-[#ea580c] sm:mt-6 sm:px-6 sm:text-sm"
          >
            Explore Menu
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {favoriteSections.map((section) => (
            <MenuSectionCard
              key={section.id}
              section={section}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onSelectItem={setSelectedItem}
              query=""
            />
          ))}
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
