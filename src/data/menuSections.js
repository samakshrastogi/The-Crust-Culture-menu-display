const rawMenuSections = [
  {
    title: 'Extra Toppings',
    labels: ['S', 'M', 'L'],
    items: [
      { name: 'Veggies', prices: ['20', '40', '60'] },
      { name: 'Cheese', prices: ['30', '60', '90'] },
      { name: 'Paneer', prices: ['30', '50', '80'] },
      { name: 'Cheese Burst', prices: ['60', '90', '120'] },
      { name: 'Extra Dip', prices: ['25', '40'] },
      { name: 'Oregano, Chilli Flakes, Ketchup', prices: ['2 Rs'] },
    ],
  },
  {
    title: 'Everyday Classics',
    labels: ['S', 'M', 'L'],
    items: [
      { name: 'Classic', prices: ['49 (Packaging Fee 10 Rs)'] },
      { name: 'Onion', prices: ['89', '179', '269'] },
      { name: 'Tomato', prices: ['89', '179', '269'] },
      { name: 'Capsicum', prices: ['89', '179', '269'] },
      { name: 'Golden Corn', prices: ['99', '189', '299'] },
      { name: 'Margherita', prices: ['99', '219', '299'] },
      { name: 'Golden Corn & Cheese', prices: ['129', '219', '329'] },
      { name: 'Double Cheese Margherita', prices: ['129', '219', '329'] },
    ],
  },
  {
    title: 'Classic Veg Combos',
    labels: ['S', 'M', 'L'],
    items: [
      { name: 'Golden Corn + Onion', prices: ['99', '199', '299'] },
      { name: 'Onion + Capsicum', prices: ['99', '199', '299'] },
      { name: 'Tomato + Golden Corn', prices: ['99', '199', '299'] },
      { name: 'Golden Corn + Jalapeno', prices: ['99', '199', '299'] },
      { name: 'Capsicum + Red Peperika', prices: ['99', '199', '299'] },
    ],
  },
  {
    title: 'Signature Veg Pizzas',
    labels: ['S', 'M', 'L'],
    items: [
      { name: 'Fiesta Popper', toppings: '(Capsicum, Jalapeno, Red Pepper)', prices: ['139', '239', '329'] },
      {
        name: 'Four Seasons Veg Pizza',
        toppings: '(Golden Corn, Onion, Capsicum, Tomato, Cheese)',
        prices: ['139', '249', '349'],
      },
      { name: 'Sweet Fiesta', toppings: '(Sweet Corn, Jalapeno, Cheese)', prices: ['149', '249', '349'] },
      {
        name: 'Maxican Pizza',
        toppings: '(Onion, Capsicum, Jalapeno, Tomato, Cheese)',
        prices: ['149', '269', '349'],
      },
      { name: 'Fresh Veggie', toppings: '(Onion, Capsicum, Extra Cheese)', prices: ['149', '269', '349'] },
      {
        name: 'Black Gold Pizza',
        toppings: '(Black Olive, Golden Corn, Capsicum, Cheese)',
        prices: ['149', '269', '349'],
      },
      {
        name: 'Veg Loaded Pizza',
        toppings: '(Golden Corn, Tomato, Jalapeno, Mushroom, Cheese)',
        prices: ['169', '289', '369'],
      },
      {
        name: 'Classic Indian Pizza',
        toppings: '(Onion, Tomato, Golden Corn, Capsicum, Jalapeno, Cheese)',
        prices: ['169', '289', '369'],
      },
      {
        name: 'Farmhouse Pizza',
        toppings: '(Onion, Capsicum, Tomato, Mushroom, Cheese)',
        prices: ['199', '329', '399'],
      },
      {
        name: 'Extravaganza Pizza',
        toppings: '(Onion, Capsicum, Tomato, Mushroom, Golden Corn, Black Olive, Extra Cheese)',
        prices: ['229', '329', '419'],
      },
      {
        name: 'Paradise Pizza',
        toppings: '(Golden Corn, Black Olive, Capsicum, Red Pepper, Extra Cheese)',
        prices: ['229', '329', '419'],
      },
    ],
  },
  {
    title: 'Royal Paneer Collection',
    labels: ['S', 'M', 'L'],
    items: [
      { name: 'Paneer Capsicum', prices: ['149', '249', '349'] },
      { name: 'Paneer Onion', prices: ['149', '249', '349'] },
      { name: 'Paneer Onion Capsicum', prices: ['159', '269', '349'] },
      { name: 'Cheesy Corn Paneer', toppings: '(Golden Corn, Paneer, Cheese)', prices: ['159', '269', '349'] },
      {
        name: 'Hot Peri Paneer',
        toppings: '(Peri Peri, Paneer, Hot Sauce, Red Peprika, Cheese)',
        prices: ['169', '269', '349'],
      },
      {
        name: 'Paneer Special',
        toppings: '(Red Pepper, Onion, Capsicum, Paneer, Cheese)',
        prices: ['189', '299', '369'],
      },
      {
        name: 'Veg + Paneer Loaded',
        toppings: '(Onion, Capsicum, Golden Corn, Paneer, Cheese)',
        prices: ['189', '299', '369'],
      },
      { name: 'Pappy Paneer', toppings: '(Capsicum, Red Pepper, Paneer, Cheese)', prices: ['199', '299', '369'] },
      {
        name: 'Loaded Indi Tandoori',
        toppings: '(Capsicum, Red Pepper, Paneer Tikka, Cheese)',
        prices: ['199', '299', '369'],
      },
      {
        name: 'Paneer Makhni',
        toppings: '(Cheese, Capsicum, Onion, Red Pepper, Paneer Tikka)',
        prices: ['199', '299', '369'],
      },
      {
        name: 'Double Paneer Premium',
        toppings: '(Onion, Capsicum, Red Pepper, Double Paneer, Extra Cheese)',
        prices: ['229', '349', '469'],
      },
    ],
  },
  {
    title: 'Garlic Breads & Sides',
    labels: [''],
    items: [
      { name: 'Veg Parcel', prices: ['49'] },
      { name: 'Indi Tandoori', prices: ['69'] },
      { name: 'Garlic Bread', prices: ['99'] },
      { name: 'Garlic Bread Stuffed', prices: ['149'] },
      { name: 'Paneer Tikka Stuffed', prices: ['169'] },
    ],
  },
  {
    title: 'Grilled Sandwiches',
    labels: [''],
    items: [
      { name: 'Veg Grill Sandwich', prices: ['89'] },
      { name: 'Veg, Golden Corn', prices: ['99'] },
      { name: 'Paneer Special', prices: ['119'] },
      { name: 'Cheese Special', prices: ['119'] },
      { name: 'Cheese & Paneer Special', prices: ['139'] },
      { name: 'Golden Corn & Cheese', prices: ['139'] },
    ],
  },
  {
    title: 'Burgers & Street Bites',
    labels: [''],
    items: [
      { name: 'Aloo Tikki Burger', prices: ['49'] },
      { name: 'Veg Burger', prices: ['59'] },
      { name: 'Cheese Burger', prices: ['79'] },
      { name: 'Paneer Burger', prices: ['79'] },
      { name: 'Double Cheese', prices: ['99'] },
      { name: 'Cheese & Paneer', prices: ['119'] },
    ],
  },
  {
    title: 'Mumbai Street Special',
    labels: [''],
    items: [
      { name: 'Vada Pav', prices: ['49'] },
      { name: 'Pav Bhaji (2 Pav)', prices: ['99'] },
      { name: 'Extra Pav', prices: ['29'] },
    ],
  },
  {
    title: 'Sweet Corn Specials',
    labels: [''],
    items: [
      { name: 'Salted', prices: ['49'] },
      { name: 'Peri Peri', prices: ['49'] },
      { name: 'Chat Masala', prices: ['49'] },
      { name: 'Black Pepper', prices: ['49'] },
      { name: 'Hot & Spicy', prices: ['49'] },
      { name: 'Tandoori', prices: ['69'] },
      { name: 'Mint', prices: ['69'] },
      { name: 'Schezwan', prices: ['69'] },
      { name: 'Butter Masala', prices: ['69'] },
      { name: 'Creamy', prices: ['69'] },
      { name: 'Cheese', prices: ['99'] },
    ],
  },
  {
    title: 'Maggi Mania',
    labels: ['H', 'F'],
    items: [
      { name: 'Plain Maggie', prices: ['49', '89'] },
      { name: 'Veggie Maggie', prices: ['59', '99'] },
      { name: 'Cheese Maggie', prices: ['79', '149'] },
      { name: 'Paneer Maggie', prices: ['79', '149'] },
      { name: 'Spicy Dry Maggie', prices: ['79', '149'] },
      { name: 'Schezwan Maggie', prices: ['79', '149'] },
    ],
  },
  {
    title: 'Momo Specials',
    labels: ['H', 'F'],
    items: [
      { name: 'Veg Fried Momo', prices: ['49', '99'] },
      { name: 'Paneer Fried Momo', prices: ['69', '129'] },
    ],
  },
  {
    title: 'Fry Fiesta',
    labels: ['H', 'F'],
    items: [
      { name: 'Classic Salted', prices: ['69', '129'] },
      { name: 'Peri Peri Fries', prices: ['79', '129'] },
      { name: 'Butter Masala', prices: ['89', '169'] },
      { name: 'Cheese Fries', prices: ['99', '179'] },
      { name: 'Chilli Potato', prices: ['119', '199'] },
      { name: 'Honey Chilli Potato', prices: ['129', '199'] },
    ],
  },
  {
    title: 'Wraps',
    labels: [''],
    items: [
      { name: 'Veg', prices: ['99'] },
      { name: 'Aloo Tikki', prices: ['109'] },
      { name: 'Cheese & Corn', prices: ['119'] },
      { name: 'Paneer Tikka', prices: ['129'] },
    ],
  },
  {
    title: 'Drinks Corner',
    labels: ['H', 'F'],
    items: [
      { name: 'Ginger Tea', prices: ['19'] },
      { name: 'Masala Chai', prices: ['29'] },
      { name: 'Lemon Honey Tea', prices: ['49'] },
      { name: 'Hot Coffee', prices: ['49'] },
      { name: 'Black Coffee', prices: ['49'] },
      { name: 'Sweet Lassi', prices: ['49'] },
      { name: 'Shikanji', prices: ['49'] },
      { name: 'Lemon Soda', prices: ['69'] },
      { name: 'Cold Coffee', prices: ['59', '79'] },
      { name: 'Cold Coffee with Ice Cream', prices: ['119'] },
    ],
  },
]

const sectionImages = {
  'extra-toppings': 'https://images.unsplash.com/photo-1511689660979-10d2b1aada49?auto=format&fit=crop&w=600&q=75',
  'everyday-classics': 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=600&q=75',
  'classic-veg-combos': 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=600&q=75',
  'signature-veg-pizzas': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=75',
  'royal-paneer-collection': 'https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?auto=format&fit=crop&w=600&q=75',
  'garlic-breads-sides': 'https://images.unsplash.com/photo-1573140401552-3fab0b24306f?auto=format&fit=crop&w=600&q=75',
  'grilled-sandwiches': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=75',
  'burgers-street-bites': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=75',
  'mumbai-street-special': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=75',
  'sweet-corn-specials': 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=75',
  'maggi-mania': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=75',
  'momo-specials': 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?auto=format&fit=crop&w=600&q=75',
  'fry-fiesta': 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=75',
  wraps: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=600&q=75',
  'drinks-corner': 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=600&q=75',
  'crispy-starters': 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=75',
  'indo-chinese-specials': 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=600&q=75',
  'south-indian-specials': 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=75',
  'protein-shakes-salads': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=75',
}

const itemMetadata = {
  margherita: {
    tag: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=600&q=75',
  },
  'double-cheese-margherita': {
    tag: 'Must Try',
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=600&q=75',
  },
  'fiesta-popper': {
    tag: 'Spicy',
    image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=600&q=75',
  },
  'farmhouse-pizza': {
    tag: 'Popular',
    image: 'https://images.unsplash.com/photo-1601924582970-9238bcb495d9?auto=format&fit=crop&w=600&q=75',
  },
  'double-paneer-premium': {
    tag: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?auto=format&fit=crop&w=600&q=75',
  },
  'loaded-indi-tandoori': {
    tag: 'Must Try',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=75',
  },
  'garlic-bread-stuffed': {
    tag: 'Popular',
    image: 'https://images.unsplash.com/photo-1573140401552-3fab0b24306f?auto=format&fit=crop&w=600&q=75',
  },
  'paneer-tikka-stuffed': {
    tag: 'Must Try',
    image: 'https://images.unsplash.com/photo-1573140401552-3fab0b24306f?auto=format&fit=crop&w=600&q=75',
  },
  'aloo-tikki-burger': {
    tag: 'Value Pick',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=75',
  },
  'cheese-paneer': {
    tag: 'Popular',
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=600&q=75',
  },
  'vada-pav': {
    tag: 'Value Pick',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=75',
  },
  'cheese-maggie': {
    tag: 'Popular',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=75',
  },
  'paneer-fried-momo': {
    tag: 'Must Try',
    image: 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?auto=format&fit=crop&w=600&q=75',
  },
  'peri-peri-fries': {
    tag: 'Spicy',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=75',
  },
  'cold-coffee': {
    tag: 'Popular',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=75',
  },
  'cold-coffee-with-ice-cream': {
    tag: 'Must Try',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=75',
  },
}

function hasValidPrice(price) {
  return Boolean(String(price || '').trim()) && String(price).trim() !== '__'
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function cleanSection(section) {
  const sectionId = slugify(section.title)
  const items = section.items
    .map((item) => {
      const itemId = `${sectionId}-${slugify(item.name)}`
      const metadata = itemMetadata[slugify(item.name)] || {}
      const prices = item.prices
        .map((price, index) => ({
          label: section.labels[index] || '',
          value: String(price || '').trim(),
        }))
        .filter((price) => hasValidPrice(price.value))

      return {
        ...item,
        id: itemId,
        image: metadata.image,
        tag: metadata.tag,
        veg: true,
        prices,
      }
    })
    .filter((item) => item.prices.length > 0)

  return {
    ...section,
    id: sectionId,
    image: sectionImages[sectionId] || '',
    items,
  }
}

export const menuSections = rawMenuSections.map(cleanSection).filter((section) => section.items.length > 0)

export const menuCategories = menuSections.map((section) => section.title)

export const allMenuItems = menuSections.flatMap((section) =>
  section.items.map((item) => ({
    ...item,
    sectionId: section.id,
    sectionTitle: section.title,
    sectionImage: section.image,
  })),
)
