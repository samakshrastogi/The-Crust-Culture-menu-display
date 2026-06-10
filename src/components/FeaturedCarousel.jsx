import { Autoplay, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import FoodImage from './FoodImage'
import VegIndicator from './VegIndicator'

export default function FeaturedCarousel({ items, onSelect }) {
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      spaceBetween={16}
      slidesPerView={1.08}
      centeredSlides={false}
      autoplay={{ delay: 2600, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      breakpoints={{
        640: { slidesPerView: 2.15 },
        1024: { slidesPerView: 3 },
      }}
      className="!pb-11"
    >
      {items.map((item) => (
        <SwiperSlide key={item.id}>
          <button
            type="button"
            onClick={() => onSelect(item)}
            className="group w-full overflow-hidden rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface)] text-left shadow-xl"
          >
            <div className="relative aspect-[16/11] overflow-hidden">
              <FoodImage
                src={item.image}
                alt={item.name}
                category={item.category}
                className="h-full w-full transition duration-500 group-hover:scale-105"
              />
              <span className="absolute left-4 top-4 rounded-full bg-[var(--gold)] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#21140b]">
                Featured
              </span>
            </div>
            <div className="space-y-3 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <VegIndicator veg={item.veg} />
                  <h3 className="font-bold text-[var(--text)]">{item.name}</h3>
                </div>
                <span className="font-black text-[var(--gold)]">₹{item.price}</span>
              </div>
              <p className="line-clamp-2 text-sm leading-6 text-[var(--muted)]">{item.description}</p>
            </div>
          </button>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
