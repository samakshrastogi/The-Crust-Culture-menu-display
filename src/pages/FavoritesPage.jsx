import { useState, useMemo } from 'react'
import { FiArrowRight, FiAward, FiHeart, FiMenu, FiTrash2 } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import MenuSectionCard from '../components/MenuSectionCard'
import MenuItemSheet from '../components/MenuItemSheet'
import FoodImage from '../components/FoodImage'
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

  // Popular suggestions when favorites is empty
  const popularSuggestions = useMemo(() => {
    const targetNames = [
      'Farmhouse Pizza',
      'Cheesy Corn Paneer',
      'Paneer Tikka Stuffed',
      'Veg Loaded Pizza',
    ]
    const all = menuSections.flatMap((s) =>
      s.items.map((item) => ({
        ...item,
        sectionId: s.id,
        sectionTitle: s.title,
        sectionImage: s.image,
      })),
    )
    return all.filter((i) => targetNames.includes(i.name)).slice(0, 4)
  }, [])

  const toggleFavorite = (itemId) => {
    setFavorites((current) =>
      current.includes(itemId) ? current.filter((id) => id !== itemId) : [...current, itemId],
    )
  }

  const totalFavorites = favoriteSections.reduce((acc, section) => acc + section.items.length, 0)

  return (
    <div className="mx-auto max-w-5xl px-3 py-4 pb-24 sm:px-6 sm:py-8">
      {/* Header Banner */}
      <section className="mb-6 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-7 shadow-sm transition-colors">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[var(--orange)] to-amber-500 text-white shadow-md shadow-orange-500/20">
              <FiHeart className="text-2xl fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-extrabold tracking-tight text-[var(--text)] sm:text-3xl">
                  My Favorites
                </h1>
                <span className="rounded-full bg-[var(--orange)]/10 px-2.5 py-0.5 text-xs font-black text-[var(--orange)] border border-[var(--orange)]/20">
                  {totalFavorites} {totalFavorites === 1 ? 'item' : 'items'}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-[var(--muted)] sm:text-sm">
                Your handpicked collection of loved wood-fired crusts & gourmet sides.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/menu"
              className="touch-target inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-2 text-xs font-bold text-[var(--text)] transition hover:border-[var(--orange)] hover:text-[var(--orange)] sm:text-sm"
            >
              <FiMenu className="text-sm" />
              <span>Browse Menu</span>
            </Link>

            {totalFavorites > 0 && (
              <button
                type="button"
                onClick={() => setFavorites([])}
                className="touch-target inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-3.5 py-2 text-xs font-bold text-red-600 dark:text-red-400 transition hover:bg-red-500/20 active:scale-95"
                title="Clear all saved favorites"
              >
                <FiTrash2 className="text-sm" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Empty State */}
      {totalFavorites === 0 ? (
        <div className="space-y-8">
          <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-8 text-center shadow-sm sm:p-12">
            <div className="relative mx-auto mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-amber-500/15 via-orange-500/15 to-red-500/10 border border-amber-500/20 text-[var(--orange)] shadow-inner sm:h-20 sm:w-20">
              <FiHeart className="text-3xl sm:text-4xl text-[var(--orange)] animate-pulse" />
            </div>
            <h2 className="mt-2 text-xl font-extrabold text-[var(--text)] sm:text-2xl">
              No favorites saved yet
            </h2>
            <p className="mt-2 text-xs text-[var(--muted)] max-w-md mx-auto leading-relaxed sm:text-sm">
              Whenever you spot something tempting on our menu, tap the heart icon to save it here
              for instant ordering whenever you visit.
            </p>
            <div className="mt-6 flex justify-center">
              <Link
                to="/menu"
                className="touch-target inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[var(--orange)] to-[#ea580c] px-6 py-3 text-xs font-black text-white shadow-lg shadow-orange-500/25 transition-all duration-200 hover:shadow-orange-500/40 hover:-translate-y-0.5 active:translate-y-0 sm:text-sm"
              >
                <span>Explore Full Menu</span>
                <FiArrowRight className="text-base" />
              </Link>
            </div>
          </div>

          {/* Chef's Recommendations to Get Started */}
          {popularSuggestions.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FiAward className="text-[var(--gold)] text-lg" />
                <h3 className="font-display text-lg font-bold text-[var(--text)] sm:text-xl">
                  Popular Chef Recommendations
                </h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5">
                {popularSuggestions.map((item) => {
                  const isFav = favorites.includes(item.id)

                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3 transition hover:border-[var(--gold)] hover:shadow-md cursor-pointer"
                    >
                      <div>
                        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
                          <FoodImage
                            src={item.image || item.sectionImage}
                            alt={item.name}
                            category="Pizza"
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleFavorite(item.id)
                            }}
                            className={`absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition ${
                              isFav
                                ? 'bg-[var(--orange)] text-white'
                                : 'bg-black/50 text-white hover:bg-black/70'
                            }`}
                            aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                          >
                            <FiHeart className={`text-sm ${isFav ? 'fill-current' : ''}`} />
                          </button>
                        </div>

                        <p className="mt-2.5 text-[10px] font-bold uppercase tracking-wider text-[var(--gold)]">
                          {item.sectionTitle}
                        </p>
                        <h4 className="mt-0.5 text-sm font-extrabold text-[var(--text)] line-clamp-1 group-hover:text-[var(--orange)] transition-colors">
                          {item.name}
                        </h4>
                      </div>

                      <div className="mt-3 flex items-center justify-between border-t border-[var(--line)]/60 pt-2 text-xs">
                        <span className="text-[10px] sm:text-[11px] font-bold text-amber-600 dark:text-amber-400">
                          ★ Chef Choice
                        </span>
                        <span className="font-bold text-[var(--orange)] text-[11px] group-hover:underline">
                          View details &rarr;
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Populated Favorites List */
        <div className="flex flex-col gap-5">
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
