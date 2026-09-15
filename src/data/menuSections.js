const rawMenuSections = [
  {
    title: "Extra Toppings",
    labels: ["S", "M", "L"],
    items: [
      { name: "Veggies", prices: ["20", "40", "50"] },
      { name: "Cheese", prices: ["30", "60", "90"] },
      { name: "Paneer", prices: ["30", "50", "80"] },
      { name: "Cheese Burst", prices: ["60", "90", "120"] },
      { name: "Extra Dip", prices: ["25", "40"] },
      { name: "Oregano", prices: ["2 Rs"] },
      { name: "Chilli Flakes", prices: ["2 Rs"] },
      { name: "Ketchup", prices: ["2 Rs"] },
    ],
  },
  {
    title: "Everyday Classics",
    labels: ["S", "M", "L"],
    items: [
      { name: "Classic", prices: ["49 (Packaging Fee 10 Rs)"] },
      { name: "Onion", prices: ["89", "189", "269"] },
      { name: "Tomato", prices: ["89", "189", "269"] },
      { name: "Capsicum", prices: ["89", "189", "269"] },
      { name: "Golden Corn", prices: ["99", "189", "299"] },
      { name: "Golden Corn + Onion", prices: ["99", "199", "299"] },
      { name: "Onion + Capsicum", prices: ["99", "199", "299"] },
      { name: "Tomato + Golden Corn", prices: ["99", "199", "299"] },
      { name: "Golden Corn + Jalapeno", prices: ["99", "199", "299"] },
      { name: "Capsicum + Red Paprika", prices: ["99", "199", "299"] },
    ],
  },
  {
    title: "Veggie & Cheese Loaded Pizzas",
    labels: ["S", "M", "L"],
    items: [
      { name: "Margherita", prices: ["119", "229", "329"] },
      { name: "Double Cheese Margherita", prices: ["149", "289", "349"] },
      {
        name: "Corn & Cheese",
        toppings: "(Golden Corn, Mozzarella Cheese)",
        prices: ["129", "239", "349"],
      },
      {
        name: "Fiesta Popper",
        toppings: "(Capsicum, Jalapeno, Red Pepper, Mozzarella Cheese)",
        prices: ["139", "239", "329"],
      },
      {
        name: "Four Seasons Veg",
        toppings: "(Corn, Capsicum, Tomato, Mozzarella Cheese)",
        prices: ["139", "249", "349"],
      },
      {
        name: "Sweet Fiesta",
        toppings: "(Sweet Corn, Jalapeno, Mozzarella Cheese)",
        prices: ["149", "249", "349"],
      },
      {
        name: "Mexican Pizza",
        toppings: "(Onion, Capsicum, Jalapeno, Tomato, Mozzarella Cheese)",
        prices: ["149", "249", "349"],
      },
      {
        name: "Fresh Veggie",
        toppings: "(Onion, Capsicum, Mozzarella Cheese)",
        prices: ["149", "249", "349"],
      },
      {
        name: "Black Gold Pizza",
        toppings: "(Black Olive, Corn, Capsicum, Mozzarella Cheese)",
        prices: ["149", "249", "349"],
      },
      {
        name: "Veg Loaded Pizza",
        toppings: "(Corn, Tomato, Jalapeno, Mushroom, Mozzarella Cheese)",
        prices: ["169", "289", "369"],
      },
      {
        name: "Classic Indian Pizza",
        toppings: "(Onion, Tomato, Corn, Capsicum, Jalapeno, Mozzarella Cheese)",
        prices: ["169", "289", "369"],
      },
      {
        name: "Farmhouse Pizza",
        toppings: "(Onion, Capsicum, Tomato, Mushroom, Mozzarella Cheese)",
        prices: ["199", "299", "399"],
      },
      {
        name: "Extravaganza Pizza",
        toppings:
          "(Onion, Capsicum, Tomato, Mushroom, Sweet Corn, Black Olives, Extra Cheese)",
        prices: ["229", "329", "419"],
      },
      {
        name: "Paradise Pizza",
        toppings:
          "(Corn, Olives, Capsicum, Red Pepper, Extra Cheese)",
        prices: ["229", "329", "419"],
      },
    ],
  },
  {
    title: "Royal Paneer Pizza",
    labels: ["S", "M", "L"],
    items: [
      { name: "Paneer Capsicum", prices: ["149", "269", "349"] },
      { name: "Paneer Onion", prices: ["149", "269", "349"] },
      { name: "Paneer Onion Capsicum", prices: ["159", "269", "349"] },
      {
        name: "Cheesy Corn Paneer",
        toppings: "(Golden Corn, Paneer, Mozzarella Cheese)",
        prices: ["159", "269", "349"],
      },
      {
        name: "Hot Peri Paneer",
        toppings: "(Peri Peri, Paneer, Hot Sauce, Red Paprika, Mozzarella Cheese)",
        prices: ["169", "269", "349"],
      },
      {
        name: "Paneer Special",
        toppings: "(Red Pepper, Onion, Capsicum, Paneer, Mozzarella Cheese)",
        prices: ["179", "279", "349"],
      },
      {
        name: "Veg Paneer Loaded",
        toppings: "(Onion, Capsicum, Corn, Paneer, Mozzarella Cheese)",
        prices: ["179", "279", "349"],
      },
      {
        name: "Peppy Paneer",
        toppings: "(Capsicum, Red Pepper, Paneer, Mozzarella Cheese)",
        prices: ["179", "289", "349"],
      },
      {
        name: "Paneer Makhani",
        toppings: "(Capsicum, Onion, Red Pepper, Paneer Tikka, Mozzarella Cheese)",
        prices: ["199", "299", "379"],
      },
      {
        name: "Loaded Indi Tandoori",
        toppings: "(Capsicum, Red Pepper, Paneer Tikka, Mozzarella Cheese)",
        prices: ["229", "329", "419"],
      },
      {
        name: "Double Paneer Premium",
        toppings: "(Onion, Capsicum, Red Pepper, Double Paneer, Mozzarella Cheese)",
        prices: ["229", "329", "419"],
      },
    ],
  },
  {
    title: "Garlic Breads & Sides",
    labels: [""],
    items: [
      {
        name: "Veg Parcel",
        toppings: "(Seasoned Veggies, Creamy Mozzarella & Herb Marinara)",
        prices: ["49"],
      },
      {
        name: "Indi Tandoori Parcel",
        toppings: "(Tandoori Spiced Veggies, Paneer & Rich Herb Butter)",
        prices: ["69"],
      },
      {
        name: "Garlic Bread",
        toppings: "(Freshly Baked Artisan Loaf, Roasted Garlic Butter & Parsley)",
        prices: ["99"],
      },
      {
        name: "Veggie Garlic Bread",
        toppings: "(Melted Mozzarella, Sweet Corn, Bell Peppers & Garlic Butter)",
        prices: ["149"],
      },
      {
        name: "Garlic Bread Stuffed",
        toppings: "(Loaded Melted Mozzarella, Golden Sweet Corn, Jalapenos & Herb Butter)",
        prices: ["149"],
      },
      {
        name: "Paneer Tikka Stuffed",
        toppings: "(Smoky Paneer Tikka, Molten Mozzarella Cheese & Garlic Herb Butter)",
        prices: ["169"],
      },
      { name: "Veg Nuggets", labels: ["H", "F"], prices: ["49", "89"] },
    ],
  },
  {
    title: "Burgers & Street Bites",
    labels: [""],
    items: [
      { name: "Aloo Tikki Burger", prices: ["49"] },
      { name: "Veg Burger", prices: ["59"] },
      { name: "Cheese Burger", prices: ["79"] },
      { name: "Paneer Burger", prices: ["79"] },
      { name: "Double Cheese Burger", prices: ["99"] },
      { name: "Cheese & Paneer Burger", prices: ["119"] },
    ],
  },
  {
    title: "Momos",
    labels: ["H", "F"],
    items: [
      { name: "Veg Fried Momos", prices: ["49", "89"] },
      { name: "Paneer Fried Momos", prices: ["69", "119"] },
    ],
  },
  {
    title: "Taco",
    labels: [""],
    items: [
      { name: "Veg Taco", prices: ["69"] },
      { name: "Indi Tandoori", prices: ["89"] },
    ],
  },
  {
    title: "Grilled Sandwiches",
    labels: [""],
    items: [
      { name: "Veg Grill Sandwich", prices: ["79"] },
      { name: "Veg Sweet Corn Sandwich", prices: ["89"] },
      { name: "Paneer Special Sandwich", prices: ["99"] },
      { name: "Cheese Special Sandwich", prices: ["99"] },
      { name: "Cheese & Paneer Special", prices: ["119"] },
      { name: "Corn & Cheese Sandwich", prices: ["119"] },
    ],
  },
  {
    title: "French Fries",
    labels: ["H", "F"],
    items: [
      { name: "Salted Fries", prices: ["69", "129"] },
      { name: "Peri Peri Fries", prices: ["79", "129"] },
      { name: "Butter Masala Fries", prices: ["99", "149"] },
      { name: "Cheese Loaded Fries", prices: ["119", "169"] },
      { name: "Chilli Potato", prices: ["119", "199"] },
      { name: "Honey Chilli Potato", prices: ["129", "199"] },
    ],
  },
  {
    title: "Maggie Special",
    labels: ["H", "F"],
    items: [
      { name: "Plain Maggie", prices: ["49", "89"] },
      { name: "Veggie Maggie", prices: ["59", "99"] },
      { name: "Cheese Maggie", prices: ["79", "129"] },
      { name: "Paneer Maggie", prices: ["79", "129"] },
      { name: "Schezwan Maggie", prices: ["79", "129"] },
      { name: "Spicy Dry Maggie", prices: ["79", "129"] },
    ],
  },
  {
    title: "Mumbai Street Special",
    labels: [""],
    items: [
      { name: "Vada Pav", prices: ["49"] },
      { name: "Pav Bhaji (2 Pav)", prices: ["129"] },
      { name: "Extra Pav", prices: ["49"] },
    ],
  },
  {
    title: "Sweet Corn Specials",
    labels: [""],
    items: [
      { name: "Salted", prices: ["49"] },
      { name: "Peri Peri", prices: ["49"] },
      { name: "Chat Masala", prices: ["49"] },
      { name: "Black Pepper", prices: ["49"] },
      { name: "Hot & Spicy", prices: ["49"] },
      { name: "Tandoori", prices: ["69"] },
      { name: "Mint", prices: ["69"] },
      { name: "Schezwan", prices: ["69"] },
      { name: "Butter Masala", prices: ["69"] },
      { name: "Creamy", prices: ["69"] },
      { name: "Cheese", prices: ["99"] },
    ],
  },
  {
    title: "Wok Rice Bowls",
    labels: ["H", "F"],
    items: [
      { name: "Veg Fried Rice", prices: ["99", "149"] },
      { name: "Veg Schezwan Rice", prices: ["119", "169"] },
      { name: "Paneer Fried Rice", prices: ["129", "199"] },
      { name: "Chinese Rice", prices: ["129", "199"] },
      { name: "Manchurian Rice", prices: ["149", "229"] },
    ],
  },
  {
    title: "Wraps",
    labels: [""],
    items: [
      { name: "Veg", prices: ["89"] },
      { name: "Aloo Tikki", prices: ["109"] },
      { name: "Cheese & Corn", prices: ["149"] },
      { name: "Paneer Tikka", prices: ["149"] },
    ],
  },
  {
    title: "Drinks Corner",
    labels: ["H", "F"],
    items: [
      { name: "Ginger Tea", prices: ["19"] },
      { name: "Masala Chai", prices: ["29"] },
      { name: "Lemon Honey Tea", prices: ["49"] },
      { name: "Hot Coffee", prices: ["49"] },
      { name: "Black Coffee", prices: ["49"] },
      { name: "Sweet Lassi", prices: ["49"] },
      { name: "Shikanji", prices: ["49"] },
      { name: "Lemon Soda", prices: ["69"] },
      { name: "Cold Coffee", prices: ["59", "79"] },
      { name: "Cold Coffee with Ice Cream", prices: ["119"] },
    ],
  },
  {
    title: "Poha Corner",
    labels: ["", ""],
    items: [{ name: "Classic Veg Poha", prices: ["79", "119"] }],
  },
];

const sectionImages = {
  "extra-toppings": "/images/extra-toppings.jpg",
  "everyday-classics": "/images/pizza-margherita.jpg",
  "classic-veg-combos": "/images/pizza-veggie.jpg",
  "veggie-cheese-loaded-pizzas": "/images/pizza-veggie.jpg",
  "signature-veg-pizzas": "/images/pizza-margherita.jpg",
  "royal-paneer-pizza": "/images/pizza-paneer.jpg",
  "royal-paneer-collection": "/images/pizza-paneer.jpg",
  "garlic-breads-sides": "/images/garlic-bread.jpg",
  "grilled-sandwiches": "/images/grilled-sandwich.jpg",
  "burgers-street-bites": "/images/veg-burger.jpg",
  momos: "/images/veg-momos.jpg",
  "momo-specials": "/images/veg-momos.jpg",
  taco: "/images/veg-tacos.jpg",
  "french-fries": "/images/french-fries.jpg",
  "fry-fiesta": "/images/french-fries.jpg",
  "maggie-special": "/images/masala-maggie.jpg",
  "maggi-mania": "/images/masala-maggie.jpg",
  "mumbai-street-special": "/images/vada-pav.jpg",
  "sweet-corn-specials": "/images/pizza-veggie.jpg",
  "wok-rice-bowls": "/images/fried-rice.jpg",
  wraps: "/images/kathi-wrap.jpg",
  "drinks-corner": "/images/cold-coffee.jpg",
  "poha-corner": "/images/vada-pav.jpg",
  "crispy-starters": "/images/garlic-bread.jpg",
  "indo-chinese-specials": "/images/fried-rice.jpg",
  "south-indian-specials": "/images/vada-pav.jpg",
  "protein-shakes-salads": "/images/kathi-wrap.jpg",
};

const imageCollections = {
  toppings: [
    "/images/topping-veggies.jpg",
    "/images/topping-cheese.jpg",
    "/images/topping-paneer.jpg",
    "/images/topping-cheese-burst.jpg",
    "/images/topping-extra-dip.jpg",
    "/images/topping-oregano.jpg",
    "/images/topping-chilli-flakes.jpg",
    "/images/topping-ketchup.jpg",
  ],
  pizza: [
    "/images/pizza-margherita.jpg",
    "/images/pizza-veggie.jpg",
    "/images/pizza-paneer.jpg",
  ],
  paneerPizza: [
    "/images/tandoori-paneer-pizza.jpg",
    "/images/pizza-paneer.jpg",
    "/images/cheesy-corn-pizza.jpg",
  ],
  sides: [
    "/images/garlic-bread-stuffed.jpg",
    "/images/veg-parcel.jpg",
    "/images/garlic-bread.jpg",
  ],
  sandwiches: [
    "/images/grilled-sandwich.jpg",
  ],
  burgers: [
    "/images/veg-burger.jpg",
  ],
  street: [
    "/images/vada-pav.jpg",
  ],
  corn: [
    "/images/cheesy-corn-pizza.jpg",
    "/images/pizza-veggie.jpg",
    "/images/masala-maggie.jpg",
  ],
  maggi: [
    "/images/masala-maggie.jpg",
  ],
  momo: [
    "/images/veg-momos.jpg",
  ],
  fries: [
    "/images/cheese-loaded-fries.jpg",
    "/images/peri-peri-fries.jpg",
    "/images/honey-chilli-potato.jpg",
    "/images/french-fries.jpg",
  ],
  wraps: [
    "/images/kathi-wrap.jpg",
  ],
  drinks: [
    "/images/cold-coffee.jpg",
    "/images/lemon-soda.jpg",
    "/images/cold-coffee-icecream.jpg",
    "/images/masala-chai.jpg",
  ],
  poha: [
    "/images/vada-pav.jpg",
  ],
  crispy: [
    "/images/garlic-bread.jpg",
    "/images/french-fries.jpg",
  ],
  chinese: [
    "/images/fried-rice.jpg",
  ],
  southIndian: [
    "/images/vada-pav.jpg",
  ],
  tacos: [
    "/images/veg-tacos.jpg",
  ],
  protein: [
    "/images/kathi-wrap.jpg",
  ],
};

const sectionImageCollections = {
  "extra-toppings": imageCollections.toppings,
  "everyday-classics": imageCollections.pizza,
  "classic-veg-combos": imageCollections.pizza,
  "veggie-cheese-loaded-pizzas": imageCollections.pizza,
  "signature-veg-pizzas": imageCollections.pizza,
  "royal-paneer-pizza": imageCollections.paneerPizza,
  "royal-paneer-collection": imageCollections.paneerPizza,
  "garlic-breads-sides": imageCollections.sides,
  "grilled-sandwiches": imageCollections.sandwiches,
  "burgers-street-bites": imageCollections.burgers,
  momos: imageCollections.momo,
  "momo-specials": imageCollections.momo,
  taco: imageCollections.tacos,
  "french-fries": imageCollections.fries,
  "fry-fiesta": imageCollections.fries,
  "maggie-special": imageCollections.maggi,
  "maggi-mania": imageCollections.maggi,
  "mumbai-street-special": imageCollections.street,
  "sweet-corn-specials": imageCollections.corn,
  "wok-rice-bowls": imageCollections.chinese,
  wraps: imageCollections.wraps,
  "drinks-corner": imageCollections.drinks,
  "poha-corner": imageCollections.poha,
  "crispy-starters": imageCollections.crispy,
  "indo-chinese-specials": imageCollections.chinese,
  "south-indian-specials": imageCollections.southIndian,
  "protein-shakes-salads": imageCollections.protein,
};

const itemMetadata = {
  veggies: {
    tag: "Fresh Cut",
    image: "/images/topping-veggies.jpg",
  },
  cheese: {
    tag: "Mozzarella",
    image: "/images/topping-cheese.jpg",
  },
  paneer: {
    tag: "Fresh Malai",
    image: "/images/topping-paneer.jpg",
  },
  "cheese-burst": {
    tag: "Molten Lava",
    image: "/images/topping-cheese-burst.jpg",
  },
  "extra-dip": {
    tag: "Garlic Mayo",
    image: "/images/topping-extra-dip.jpg",
  },
  oregano: {
    tag: "Herbs",
    image: "/images/topping-oregano.jpg",
  },
  "chilli-flakes": {
    tag: "Spicy",
    image: "/images/topping-chilli-flakes.jpg",
  },
  ketchup: {
    tag: "Sauce",
    image: "/images/topping-ketchup.jpg",
  },
  margherita: {
    tag: "Best Seller",
    image: "/images/pizza-margherita.jpg",
  },
  "double-cheese-margherita": {
    tag: "Must Try",
    image: "/images/pizza-margherita.jpg",
  },
  "fiesta-popper": {
    tag: "Spicy",
    image: "/images/pizza-veggie.jpg",
  },
  "farmhouse-pizza": {
    tag: "Popular",
    image: "/images/pizza-veggie.jpg",
  },
  "corn-cheese": {
    tag: "Popular",
    image: "/images/cheesy-corn-pizza.jpg",
  },
  "golden-corn": {
    tag: "Popular",
    image: "/images/cheesy-corn-pizza.jpg",
  },
  "golden-corn-onion": {
    tag: "Popular",
    image: "/images/cheesy-corn-pizza.jpg",
  },
  "cheesy-corn-paneer": {
    tag: "Popular",
    image: "/images/cheesy-corn-pizza.jpg",
  },
  "hot-peri-paneer": {
    tag: "Spicy",
    image: "/images/tandoori-paneer-pizza.jpg",
  },
  "paneer-special": {
    tag: "Chef Special",
    image: "/images/pizza-paneer.jpg",
  },
  "loaded-indi-tandoori": {
    tag: "Must Try",
    image: "/images/tandoori-paneer-pizza.jpg",
  },
  "double-paneer-premium": {
    tag: "Best Seller",
    image: "/images/tandoori-paneer-pizza.jpg",
  },
  "paneer-makhani": {
    tag: "Rich & Creamy",
    image: "/images/tandoori-paneer-pizza.jpg",
  },
  "peppy-paneer": {
    tag: "Popular",
    image: "/images/pizza-paneer.jpg",
  },
  "garlic-bread": {
    tag: "Classic",
    image: "/images/garlic-bread.jpg",
  },
  "garlic-bread-stuffed": {
    tag: "Popular",
    image: "/images/garlic-bread-stuffed.jpg",
  },
  "veggie-garlic-bread": {
    tag: "Must Try",
    image: "/images/garlic-bread-stuffed.jpg",
  },
  "paneer-tikka-stuffed": {
    tag: "Must Try",
    image: "/images/paneer-tikka-stuffed.jpg",
  },
  "veg-parcel": {
    tag: "Special",
    image: "/images/veg-parcel.jpg",
  },
  "indi-tandoori-parcel": {
    tag: "Must Try",
    image: "/images/veg-parcel.jpg",
  },
  "aloo-tikki-burger": {
    tag: "Value Pick",
    image: "/images/veg-burger.jpg",
  },
  "cheese-paneer": {
    tag: "Popular",
    image: "/images/veg-burger.jpg",
  },
  "vada-pav": {
    tag: "Value Pick",
    image: "/images/vada-pav.jpg",
  },
  "cheese-maggie": {
    tag: "Popular",
    image: "/images/masala-maggie.jpg",
  },
  "paneer-fried-momo": {
    tag: "Must Try",
    image: "/images/veg-momos.jpg",
  },
  "salted-fries": {
    tag: "Classic",
    image: "/images/french-fries.jpg",
  },
  "peri-peri-fries": {
    tag: "Spicy",
    image: "/images/peri-peri-fries.jpg",
  },
  "cheese-loaded-fries": {
    tag: "Best Seller",
    image: "/images/cheese-loaded-fries.jpg",
  },
  "chilli-potato": {
    tag: "Crispy",
    image: "/images/honey-chilli-potato.jpg",
  },
  "honey-chilli-potato": {
    tag: "Must Try",
    image: "/images/honey-chilli-potato.jpg",
  },
  "cold-coffee": {
    tag: "Popular",
    image: "/images/cold-coffee.jpg",
  },
  "cold-coffee-with-ice-cream": {
    tag: "Must Try",
    image: "/images/cold-coffee-icecream.jpg",
  },
  "lemon-soda": {
    tag: "Refreshing",
    image: "/images/lemon-soda.jpg",
  },
  shikanji: {
    tag: "Refreshing",
    image: "/images/lemon-soda.jpg",
  },
  "masala-chai": {
    tag: "Best Seller",
    image: "/images/masala-chai.jpg",
  },
  "ginger-tea": {
    tag: "Popular",
    image: "/images/masala-chai.jpg",
  },
  "veg-nuggets": {
    tag: "Crispy",
    image: "/images/garlic-bread.jpg",
  },
  "double-cheese-burger": {
    tag: "Popular",
    image: "/images/veg-burger.jpg",
  },
  "cheese-paneer-burger": {
    tag: "Popular",
    image: "/images/veg-burger.jpg",
  },
  "veg-fried-momos": {
    tag: "Must Try",
    image: "/images/veg-momos.jpg",
  },
  "paneer-fried-momos": {
    tag: "Must Try",
    image: "/images/veg-momos.jpg",
  },
  "veg-taco": {
    tag: "Popular",
    image: "/images/veg-tacos.jpg",
  },
};

function hasValidPrice(price) {
  const normalizedPrice = String(price || "").trim();
  return (
    Boolean(normalizedPrice) && !/^[-_\u2013\u2014]+$/.test(normalizedPrice)
  );
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getItemImage(sectionId, index) {
  const images =
    sectionImageCollections[sectionId] ||
    [sectionImages[sectionId]].filter(Boolean);
  return images[index % images.length] || "";
}

function cleanSection(section) {
  const sectionId = slugify(section.title);
  const items = section.items
    .map((item, index) => {
      const itemId = `${sectionId}-${slugify(item.name)}`;
      const metadata = itemMetadata[slugify(item.name)] || {};
      const prices = item.prices
        .map((price, index) => ({
          label: (item.labels && item.labels[index]) ?? section.labels[index] ?? "",
          value: String(price || "").trim(),
        }))
        .filter((price) => hasValidPrice(price.value));

      return {
        ...item,
        id: itemId,
        image: metadata.image || getItemImage(sectionId, index),
        tag: metadata.tag,
        veg: true,
        prices,
      };
    })
    .filter((item) => item.prices.length > 0);

  return {
    ...section,
    id: sectionId,
    image: sectionImages[sectionId] || "",
    items,
  };
}

const baseProcessedSections = rawMenuSections
  .map(cleanSection)
  .filter((section) => section.items.length > 0);

export const menuSections = (() => {
  const drinksCorner = baseProcessedSections.find(
    (s) => s.title === "Drinks Corner",
  );
  const rest = baseProcessedSections.filter(
    (s) => s.title !== "Drinks Corner",
  );

  const result = [...rest];
  if (drinksCorner) result.push(drinksCorner);
  return result;
})();

export const menuCategories = menuSections.map((section) => section.title);

export const allMenuItems = menuSections.flatMap((section) =>
  section.items.map((item) => ({
    ...item,
    sectionId: section.id,
    sectionTitle: section.title,
    sectionImage: section.image,
  })),
);
