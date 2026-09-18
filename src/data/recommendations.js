import { allMenuItems } from './menuSections'

const SIDE_NAMES = [
  { name: 'Garlic Bread Stuffed', pairingBadge: 'Top Pizza Companion' },
  { name: 'Veggie Garlic Bread', pairingBadge: 'Cheesy Garlic' },
  { name: 'Veg Parcel', pairingBadge: 'Pocket Friendly' },
  { name: 'Paneer Tikka Stuffed', pairingBadge: 'Chef Signature' },
  { name: 'Indi Tandoori Parcel', pairingBadge: 'Desi Spice' },
  { name: 'Garlic Bread', pairingBadge: 'Fresh Sourdough' },
  { name: 'Aloo Tikki Burger', pairingBadge: 'Crispy Patty' },
  { name: 'Veg Taco', pairingBadge: 'Mexican Crunch' },
]

const DRINK_NAMES = [
  { name: 'Cold Coffee with Ice Cream', pairingBadge: 'Chilled Refresher' },
  { name: 'Lemon Soda', pairingBadge: 'Fizzy & Tangy' },
  { name: 'Cold Coffee', pairingBadge: 'Smooth Brew' },
  { name: 'Sweet Lassi', pairingBadge: 'Creamy Classic' },
  { name: 'Shikanji', pairingBadge: 'Desi Cooler' },
  { name: 'Masala Chai', pairingBadge: 'Warm Desi Brew' },
  { name: 'Hot Coffee', pairingBadge: 'Rich Roast' },
  { name: 'Lemon Honey Tea', pairingBadge: 'Soothing Sip' },
]

const FRIES_NAMES = [
  { name: 'Peri Peri Fries', pairingBadge: 'Crispy & Spicy' },
  { name: 'Cheese Loaded Fries', pairingBadge: 'Melted Mozzarella' },
  { name: 'Veg Nuggets', pairingBadge: 'Crunchy Starter' },
  { name: 'Veg Fried Momos', pairingBadge: 'Crisp Street Bite' },
  { name: 'Salted Fries', pairingBadge: 'Golden Classic' },
  { name: 'Butter Masala Fries', pairingBadge: 'Rich Butter Spice' },
  { name: 'Paneer Fried Momos', pairingBadge: 'Crispy Dumpling' },
  { name: 'Chilli Potato', pairingBadge: 'Desi Wok Tossed' },
]

const DIP_NAMES = [
  { name: 'Extra Dip', pairingBadge: 'Creamy Garlic Mayo' },
  { name: 'Cheese Burst', pairingBadge: 'Molten Cheese Center' },
  { name: 'Cheese', pairingBadge: 'Extra Mozzarella' },
  { name: 'Paneer', pairingBadge: 'Tikka Paneer' },
  { name: 'Oregano', pairingBadge: 'Herb Seasoning' },
  { name: 'Chilli Flakes', pairingBadge: 'Extra Spice Kick' },
  { name: 'Ketchup', pairingBadge: 'Classic Sachet' },
  { name: 'Veggies', pairingBadge: 'Fresh Garden Veg' },
]

function mapToItems(list) {
  return list
    .map(({ name, pairingBadge }) => {
      const item = allMenuItems.find((i) => i.name.toLowerCase() === name.toLowerCase())
      return item ? { ...item, pairingBadge } : null
    })
    .filter(Boolean)
}

export const recommendationCatalog = {
  sides: mapToItems(SIDE_NAMES),
  drinks: mapToItems(DRINK_NAMES),
  fries: mapToItems(FRIES_NAMES),
  dips: mapToItems(DIP_NAMES),
}
