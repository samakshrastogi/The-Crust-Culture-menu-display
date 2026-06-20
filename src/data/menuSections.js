const rawMenuSections = [
  {
    title: "Extra Toppings",
    labels: ["S", "M", "L"],
    items: [
      { name: "Veggies", prices: ["20", "40", "60"] },
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
      { name: "Margherita", prices: ["119", "249", "329"] },
      { name: "Golden Corn & Cheese", prices: ["129", "249", "329"] },
      { name: "Double Cheese Margherita", prices: ["149", "269", "349"] },
    ],
  },
  {
    title: "Classic Veg Combos",
    labels: ["S", "M", "L"],
    items: [
      { name: "Golden Corn + Onion", prices: ["99", "199", "299"] },
      { name: "Onion + Capsicum", prices: ["99", "199", "299"] },
      { name: "Tomato + Golden Corn", prices: ["99", "199", "299"] },
      { name: "Golden Corn + Jalapeno", prices: ["99", "199", "299"] },
      { name: "Capsicum + Red Peperika", prices: ["99", "199", "299"] },
    ],
  },
  {
    title: "Signature Veg Pizzas",
    labels: ["S", "M", "L"],
    items: [
      {
        name: "Fiesta Popper",
        toppings: "(Capsicum, Jalapeno, Red Pepper)",
        prices: ["139", "239", "329"],
      },
      {
        name: "Four Seasons Veg Pizza",
        toppings: "(Golden Corn, Onion, Capsicum, Tomato, Cheese)",
        prices: ["139", "249", "349"],
      },
      {
        name: "Sweet Fiesta",
        toppings: "(Sweet Corn, Jalapeno, Cheese)",
        prices: ["149", "249", "349"],
      },
      {
        name: "Maxican Pizza",
        toppings: "(Onion, Capsicum, Jalapeno, Tomato, Cheese)",
        prices: ["149", "269", "349"],
      },
      {
        name: "Fresh Veggie",
        toppings: "(Onion, Capsicum, Extra Cheese)",
        prices: ["149", "269", "349"],
      },
      {
        name: "Black Gold Pizza",
        toppings: "(Black Olive, Golden Corn, Capsicum, Cheese)",
        prices: ["149", "269", "349"],
      },
      {
        name: "Veg Loaded Pizza",
        toppings: "(Golden Corn, Tomato, Jalapeno, Mushroom, Cheese)",
        prices: ["169", "289", "369"],
      },
      {
        name: "Classic Indian Pizza",
        toppings: "(Onion, Tomato, Golden Corn, Capsicum, Jalapeno, Cheese)",
        prices: ["169", "289", "369"],
      },
      {
        name: "Farmhouse Pizza",
        toppings: "(Onion, Capsicum, Tomato, Mushroom, Cheese)",
        prices: ["199", "329", "399"],
      },
      {
        name: "Extravaganza Pizza",
        toppings:
          "(Onion, Capsicum, Tomato, Mushroom, Golden Corn, Black Olive, Extra Cheese)",
        prices: ["229", "329", "419"],
      },
      {
        name: "Paradise Pizza",
        toppings:
          "(Golden Corn, Black Olive, Capsicum, Red Pepper, Extra Cheese)",
        prices: ["229", "329", "419"],
      },
    ],
  },
  {
    title: "Royal Paneer Collection",
    labels: ["S", "M", "L"],
    items: [
      { name: "Paneer Capsicum", prices: ["149", "249", "349"] },
      { name: "Paneer Onion", prices: ["149", "249", "349"] },
      { name: "Paneer Onion Capsicum", prices: ["159", "269", "349"] },
      {
        name: "Cheesy Corn Paneer",
        toppings: "(Golden Corn, Paneer, Cheese)",
        prices: ["159", "269", "349"],
      },
      {
        name: "Hot Peri Paneer",
        toppings: "(Peri Peri, Paneer, Hot Sauce, Red Peprika, Cheese)",
        prices: ["169", "269", "349"],
      },
      {
        name: "Paneer Special",
        toppings: "(Red Pepper, Onion, Capsicum, Paneer, Cheese)",
        prices: ["189", "299", "369"],
      },
      {
        name: "Veg + Paneer Loaded",
        toppings: "(Onion, Capsicum, Golden Corn, Paneer, Cheese)",
        prices: ["189", "299", "369"],
      },
      {
        name: "Pappy Paneer",
        toppings: "(Capsicum, Red Pepper, Paneer, Cheese)",
        prices: ["199", "299", "369"],
      },
      {
        name: "Loaded Indi Tandoori",
        toppings: "(Capsicum, Red Pepper, Paneer Tikka, Cheese)",
        prices: ["199", "299", "369"],
      },
      {
        name: "Paneer Makhni",
        toppings: "(Cheese, Capsicum, Onion, Red Pepper, Paneer Tikka)",
        prices: ["199", "299", "369"],
      },
      {
        name: "Double Paneer Premium",
        toppings: "(Onion, Capsicum, Red Pepper, Double Paneer, Extra Cheese)",
        prices: ["229", "349", "469"],
      },
    ],
  },
  {
    title: "Garlic Breads & Sides",
    labels: [""],
    items: [
      { name: "Veg Parcel", prices: ["49"] },
      { name: "Indi Tandoori", prices: ["69"] },
      { name: "Garlic Bread", prices: ["99"] },
      { name: "Garlic Bread Stuffed", prices: ["149"] },
      { name: "Paneer Tikka Stuffed", prices: ["169"] },
    ],
  },
  {
    title: "Grilled Sandwiches",
    labels: [""],
    items: [
      { name: "Veg Grill Sandwich", prices: ["89"] },
      { name: "Veg, Golden Corn", prices: ["99"] },
      { name: "Paneer Special", prices: ["119"] },
      { name: "Cheese Special", prices: ["119"] },
      { name: "Cheese & Paneer Special", prices: ["139"] },
      { name: "Golden Corn & Cheese", prices: ["139"] },
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
      { name: "Double Cheese", prices: ["99"] },
      { name: "Cheese & Paneer", prices: ["119"] },
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
    title: "Maggi Mania",
    labels: ["H", "F"],
    items: [
      { name: "Plain Maggie", prices: ["49", "89"] },
      { name: "Veggie Maggie", prices: ["59", "99"] },
      { name: "Cheese Maggie", prices: ["79", "149"] },
      { name: "Paneer Maggie", prices: ["79", "149"] },
      { name: "Spicy Dry Maggie", prices: ["79", "149"] },
      { name: "Schezwan Maggie", prices: ["79", "149"] },
    ],
  },
  {
    title: "Momo Specials",
    labels: ["H", "F"],
    items: [
      { name: "Veg Fried Momo", prices: ["49", "99"] },
      { name: "Paneer Fried Momo", prices: ["69", "129"] },
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
    title: "Fry Fiesta",
    labels: ["H", "F"],
    items: [
      { name: "Classic Salted", prices: ["69", "129"] },
      { name: "Peri Peri Fries", prices: ["79", "129"] },
      { name: "Butter Masala", prices: ["89", "169"] },
      { name: "Cheese Fries", prices: ["99", "179"] },
      { name: "Chilli Potato", prices: ["119", "199"] },
      { name: "Honey Chilli Potato", prices: ["129", "199"] },
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
  {
    title: "Egg Specials",
    labels: [""],
    items: [
      { name: "Veg Omelette", prices: ["79"] },
      { name: "Bread Omelette", prices: ["99"] },
      { name: "Egg Burger", prices: ["99"] },
      { name: "Half Fry with Bread", prices: ["99"] },
      { name: "Egg Bhurji Pav", prices: ["129"] },
      { name: "Egg Sandwich", prices: ["129"] },
      { name: "Egg Fried Rice", prices: ["149"] },
    ],
  },
];

const sectionImages = {
  "extra-toppings":
    "https://images.unsplash.com/photo-1511689660979-10d2b1aada49?auto=format&fit=crop&w=600&q=75",
  "everyday-classics":
    "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=600&q=75",
  "classic-veg-combos":
    "https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=600&q=75",
  "signature-veg-pizzas":
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=75",
  "royal-paneer-collection":
    "https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?auto=format&fit=crop&w=600&q=75",
  "garlic-breads-sides":
    "https://images.unsplash.com/photo-1573140401552-3fab0b24306f?auto=format&fit=crop&w=600&q=75",
  "grilled-sandwiches":
    "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=75",
  "burgers-street-bites":
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=75",
  "mumbai-street-special":
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=75",
  "sweet-corn-specials":
    "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=75",
  "maggi-mania":
    "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=75",
  "momo-specials":
    "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?auto=format&fit=crop&w=600&q=75",
  "fry-fiesta":
    "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=75",
  wraps:
    "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=600&q=75",
  "drinks-corner":
    "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=600&q=75",
  "poha-corner":
    "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=600&q=75",
  "egg-specials":
    "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=75",
  "crispy-starters":
    "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=75",
  "indo-chinese-specials":
    "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=600&q=75",
  "south-indian-specials":
    "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=75",
  "protein-shakes-salads":
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=75",
};

const imageCollections = {
  toppings: [
    "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1511689660979-10d2b1aada49?auto=format&fit=crop&w=600&q=75",
  ],
  pizza: [
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1601924582971-c86e7b34eec4?auto=format&fit=crop&w=600&q=75",
  ],
  paneerPizza: [
    "https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1620374645498-af6bd681a946?auto=format&fit=crop&w=600&q=75",
  ],
  sides: [
    "https://images.unsplash.com/photo-1604909052743-94e838986d24?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1573140401552-3fab0b24306f?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=600&q=75",
  ],
  sandwiches: [
    "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1481070555726-e2fe8357725c?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1567234669003-dce7a7a88821?auto=format&fit=crop&w=600&q=75",
  ],
  burgers: [
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=600&q=75",
  ],
  street: [
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=600&q=75",
  ],
  corn: [
    "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1571680322279-a226e6a4cc2a?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1598514983318-2f64f8f4796c?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1506808547685-e2ba962ded60?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1511689660979-10d2b1aada49?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=600&q=75",
  ],
  maggi: [
    "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1637024698421-533d83c7b883?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1618841557871-b4664fbf0cb3?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=75",
  ],
  momo: [
    new URL("../assets/item-images/momo/fried-momo.jpg", import.meta.url).href,
    new URL("../assets/item-images/momo/fried-momo.jpg", import.meta.url).href,
  ],
  fries: [
    "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1623238912680-26fc5ffb57e0?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=600&q=75",
  ],
  wraps: [
    "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=75",
  ],
  drinks: [
    "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=75",
  ],
  poha: [
    "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=600&q=75",
  ],
  eggs: [
    "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1481070555726-e2fe8357725c?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=75",
  ],
  crispy: [
    "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1604909052743-94e838986d24?auto=format&fit=crop&w=600&q=75",
  ],
  chinese: [
    "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=75",
  ],
  southIndian: [
    "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1610192244261-3f33de3f72e1?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1617692855027-33b14f061079?auto=format&fit=crop&w=600&q=75",
  ],
  protein: [
    "https://images.unsplash.com/photo-1622484211148-a645df14f0ed?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=600&q=75",
  ],
};

const sectionImageCollections = {
  "extra-toppings": imageCollections.toppings,
  "everyday-classics": imageCollections.pizza,
  "classic-veg-combos": imageCollections.pizza,
  "signature-veg-pizzas": imageCollections.pizza,
  "royal-paneer-collection": imageCollections.paneerPizza,
  "garlic-breads-sides": imageCollections.sides,
  "grilled-sandwiches": imageCollections.sandwiches,
  "burgers-street-bites": imageCollections.burgers,
  "mumbai-street-special": imageCollections.street,
  "sweet-corn-specials": imageCollections.corn,
  "maggi-mania": imageCollections.maggi,
  "momo-specials": imageCollections.momo,
  "fry-fiesta": imageCollections.fries,
  wraps: imageCollections.wraps,
  "drinks-corner": imageCollections.drinks,
  "poha-corner": imageCollections.poha,
  "egg-specials": imageCollections.eggs,
  "crispy-starters": imageCollections.crispy,
  "indo-chinese-specials": imageCollections.chinese,
  "south-indian-specials": imageCollections.southIndian,
  "protein-shakes-salads": imageCollections.protein,
};

const itemMetadata = {
  margherita: {
    tag: "Best Seller",
    image:
      "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=600&q=75",
  },
  "double-cheese-margherita": {
    tag: "Must Try",
    image:
      "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=600&q=75",
  },
  "fiesta-popper": {
    tag: "Spicy",
    image:
      "https://images.unsplash.com/photo-1594007654729-407eedc4be65?auto=format&fit=crop&w=600&q=75",
  },
  "farmhouse-pizza": {
    tag: "Popular",
    image:
      "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?auto=format&fit=crop&w=600&q=75",
  },
  "double-paneer-premium": {
    tag: "Best Seller",
    image:
      "https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?auto=format&fit=crop&w=600&q=75",
  },
  "loaded-indi-tandoori": {
    tag: "Must Try",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=75",
  },
  "garlic-bread-stuffed": {
    tag: "Popular",
    image:
      "https://images.unsplash.com/photo-1573140401552-3fab0b24306f?auto=format&fit=crop&w=600&q=75",
  },
  "paneer-tikka-stuffed": {
    tag: "Must Try",
    image:
      "https://images.unsplash.com/photo-1573140401552-3fab0b24306f?auto=format&fit=crop&w=600&q=75",
  },
  "aloo-tikki-burger": {
    tag: "Value Pick",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=75",
  },
  "cheese-paneer": {
    tag: "Popular",
    image:
      "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=600&q=75",
  },
  "vada-pav": {
    tag: "Value Pick",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=75",
  },
  "cheese-maggie": {
    tag: "Popular",
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=75",
  },
  "paneer-fried-momo": {
    tag: "Must Try",
    image:
      "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?auto=format&fit=crop&w=600&q=75",
  },
  "peri-peri-fries": {
    tag: "Spicy",
    image:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=75",
  },
  "cold-coffee": {
    tag: "Popular",
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=75",
  },
  "cold-coffee-with-ice-cream": {
    tag: "Must Try",
    image:
      "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=75",
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
          label: section.labels[index] || "",
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
  const eggSpecials = baseProcessedSections.find(
    (s) => s.title === "Egg Specials",
  );
  const drinksCorner = baseProcessedSections.find(
    (s) => s.title === "Drinks Corner",
  );
  const rest = baseProcessedSections.filter(
    (s) => s.title !== "Egg Specials" && s.title !== "Drinks Corner",
  );

  const result = [...rest];
  if (eggSpecials) result.push(eggSpecials);
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
