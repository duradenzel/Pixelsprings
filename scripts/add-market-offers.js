const fs = require('fs');
const path = require('path');

const ITEMS_FILE = path.resolve(__dirname, '../pixelsprings-market/src/data/items.json');
const SHOPS_FILE = path.resolve(__dirname, '../pixelsprings-market/src/data/shops.json');

const items = JSON.parse(fs.readFileSync(ITEMS_FILE, 'utf-8'));
const shops = JSON.parse(fs.readFileSync(SHOPS_FILE, 'utf-8'));

function normalize(str) {
  return String(str || '')
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/[^a-z0-9 ]/g, '')
    .trim();
}

const itemLookup = {};
items.forEach(id => {
  const name = id.split(':')[1]?.replace(/_/g, ' ') || '';
  itemLookup[normalize(name)] = id;
});

const manualItemNames = {
  'aqua dashers': 'artifacts:aqua_dashers',
  'aqua infinity': 'minecraft:enchanted_book',
  'ash': 'supplementaries:ash',
  'charismatic ii': 'minecraft:enchanted_book',
  'multishot': 'minecraft:enchanted_book',
  'smite v': 'minecraft:enchanted_book',
  'impaling v': 'minecraft:enchanted_book',
  'jaspar': 'quark:jasper',
  'anchony': 'croptopia:anchovy',
  'piercing iv': 'minecraft:enchanted_book',
  'punch ii': 'minecraft:enchanted_book',
  'channeling': 'minecraft:enchanted_book',
  'mending': 'minecraft:enchanted_book',
  'sharpness v': 'minecraft:enchanted_book',
  'punch': 'minecraft:enchanted_book',
  'piercing': 'minecraft:enchanted_book',
  'smite': 'minecraft:enchanted_book',
  'sharpness': 'minecraft:enchanted_book',
  'lure': 'minecraft:enchanted_book',
  'unbreaking': 'minecraft:enchanted_book',
  'looting': 'minecraft:enchanted_book',
  'aqua affinity': 'minecraft:enchanted_book',
  'unbreaking 3': 'minecraft:enchanted_book',
  'respiration 3': 'minecraft:enchanted_book',
  'aqua-dashers': 'artifacts:aqua_dashers',
  'grey chandalier moa': 'moa_decor_lights:candelabro_g'
};

const currencyItemId = {
  'Silver Coins': 'economy:creepercoin2',
  'Gold Coins': 'economy:creepercoin',
  'Golden Coins': 'economy:creepercoin',
  'Money': 'economy:para_png'
};

function findItemId(displayName) {
  const n = normalize(displayName);
  if (manualItemNames[n]) return manualItemNames[n];
  if (itemLookup[n]) return itemLookup[n];

  const tokens = new Set(n.split(/\s+/).filter(Boolean));
  let best = { id: null, score: 0 };

  for (const [key, id] of Object.entries(itemLookup)) {
    const keyTokens = key.split(/\s+/).filter(Boolean);
    const shared = keyTokens.filter(t => t.length >= 3 && tokens.has(t));
    if (shared.length > best.score) {
      best = { id, score: shared.length };
    }
  }

  if (best.id) return best.id;
  return null;
}

const shopOffers = {
  'toni-tortellini': [
    { name: 'Meat Pizza', amount: 1, cost: 3, currency: 'Golden Coins' },
    { name: 'Cheese Pizza', amount: 1, cost: 2, currency: 'Golden Coins' },
    { name: 'Lasagne', amount: 8, cost: 2, currency: 'Golden Coins' },
    { name: 'Chocolate Pie', amount: 1, cost: 1, currency: 'Golden Coins' },
    { name: 'Tomato Mozzarella Salad', amount: 1, cost: 4, currency: 'Golden Coins' },
    { name: 'Pasta With Meatballs', amount: 4, cost: 2, currency: 'Golden Coins' },
    { name: 'Pasta With Mutton Chop', amount: 4, cost: 2, currency: 'Golden Coins' },
    { name: 'Noir Wine', amount: 1, cost: 10, currency: 'Golden Coins' }
  ],
  'taco-bell': [
    { name: 'Ghostly Chili', amount: 1, cost: 3, currency: 'Golden Coins' },
    { name: 'Tamales', amount: 1, cost: 3, currency: 'Golden Coins' },
    { name: 'Fajitas', amount: 1, cost: 2, currency: 'Golden Coins' },
    { name: 'Fish Taco', amount: 1, cost: 2, currency: 'Golden Coins' },
    { name: 'Chicken Taco', amount: 1, cost: 2, currency: 'Golden Coins' },
    { name: 'Taco', amount: 1, cost: 2, currency: 'Golden Coins' },
    { name: 'Stuffed Burrito', amount: 1, cost: 6, currency: 'Golden Coins' },
    { name: 'Beef Burrito', amount: 1, cost: 4, currency: 'Golden Coins' },
    { name: 'Burrito', amount: 1, cost: 2, currency: 'Golden Coins' }
  ],
  'marijuana-dispensery': [
    { name: 'Joint', amount: 1, cost: 2, currency: 'Golden Coins' },
    { name: 'Weed Brownie', amount: 4, cost: 2, currency: 'Golden Coins' },
    { name: 'Weed Bud', amount: 1, cost: 1, currency: 'Golden Coins' }
  ],
  'ice-cream-parlor': [
    { name: 'Pecan Ice Cream', amount: 2, cost: 1, currency: 'Golden Coins' },
    { name: 'Vanila Ice Cream', amount: 2, cost: 1, currency: 'Golden Coins' }
  ],
  'honey-vibe': [
    { name: 'Toast With Honey', amount: 4, cost: 1, currency: 'Golden Coins' },
    { name: 'Honey Jar', amount: 3, cost: 1, currency: 'Golden Coins' },
    { name: 'Honey Jar Block', amount: 1, cost: 1, currency: 'Golden Coins' },
    { name: 'Honeycomb', amount: 32, cost: 1, currency: 'Golden Coins' },
    { name: 'Honey Bottle', amount: 16, cost: 1, currency: 'Golden Coins' },
    { name: 'Honeycomb Block', amount: 64, cost: 1, currency: 'Golden Coins' },
    { name: 'Honey Block', amount: 32, cost: 1, currency: 'Golden Coins' },
    { name: 'Honeycomb Lamp', amount: 1, cost: 1, currency: 'Golden Coins' }
  ],
  'bees-tea-parlor': [
    { name: 'Green Tea', amount: 2, cost: 1, currency: 'Golden Coins' },
    { name: 'Rooibos Tea', amount: 2, cost: 1, currency: 'Golden Coins' },
    { name: 'Coffee', amount: 2, cost: 1, currency: 'Golden Coins' },
    { name: 'Black Tea', amount: 2, cost: 1, currency: 'Golden Coins' },
    { name: 'Yerba Mate Tea', amount: 2, cost: 1, currency: 'Golden Coins' },
    { name: 'Hibiscus Tea', amount: 2, cost: 1, currency: 'Golden Coins' }
  ],
  'bottled-wine': [
    { name: 'Magnetic Wine', amount: 1, cost: 8, currency: 'Money' },
    { name: 'Stal Wine', amount: 1, cost: 8, currency: 'Money' },
    { name: 'Apple Wine', amount: 1, cost: 8, currency: 'Money' },
    { name: 'Red Wine', amount: 1, cost: 8, currency: 'Money' },
    { name: 'Solaris Wine', amount: 1, cost: 8, currency: 'Money' }
  ],
  'black-market': [
    { name: 'Smithing Template (Netherite Upgrade)', amount: 1, cost: 20, currency: 'Gold Coins' },
    { name: 'Totem of Undying', amount: 1, cost: 15, currency: 'Gold Coins' },
    { name: 'Steak', amount: 64, cost: 1, currency: 'Gold Coins' },
    { name: 'Bottle o\' Enchanting', amount: 16, cost: 1, currency: 'Gold Coins' },
    { name: 'Diamond', amount: 2, cost: 1, currency: 'Gold Coins' },
    { name: 'Netherite Ingot', amount: 1, cost: 1, currency: 'Money' },
    { name: 'Wither Skeleton Skull', amount: 1, cost: 10, currency: 'Gold Coins' },
    { name: 'Nether Star', amount: 1, cost: 32, currency: 'Gold Coins' },
    { name: 'Iron Ingot', amount: 32, cost: 8, currency: 'Gold Coins' },
    { name: 'Wither Projectile\'s Head', amount: 1, cost: 6, currency: 'Gold Coins' },
    { name: 'Wither\'s Head', amount: 1, cost: 3, currency: 'Gold Coins' },
    { name: 'Blue Wither Projectile\'s Head', amount: 1, cost: 8, currency: 'Gold Coins' },
    { name: 'Enchanted Book (Unbreaking 3)', amount: 1, cost: 10, currency: 'Gold Coins' },
    { name: 'Enchanted Book (Mending)', amount: 1, cost: 20, currency: 'Gold Coins' },
    { name: 'Enchanted Book (Fortune 3)', amount: 1, cost: 16, currency: 'Gold Coins' },
    { name: 'Enchanted Book (Looting 3)', amount: 1, cost: 16, currency: 'Gold Coins' },
    { name: 'Enchanted Book (Sharpness 5)', amount: 1, cost: 16, currency: 'Gold Coins' },
    { name: 'Enchanted Book (Protection 4)', amount: 1, cost: 20, currency: 'Gold Coins' },
    { name: 'Sugar', amount: 64, cost: 4, currency: 'Gold Coins' },
    { name: 'Honey Block', amount: 1, cost: 5, currency: 'Gold Coins' },
    { name: 'Honey Bottle', amount: 4, cost: 3, currency: 'Gold Coins' },
    { name: 'Honeycomb', amount: 16, cost: 1, currency: 'Gold Coins' },
    { name: 'Honeycomb Block', amount: 64, cost: 10, currency: 'Gold Coins' },
    { name: 'Hellbark Log', amount: 64, cost: 3, currency: 'Gold Coins' },
    { name: 'Mangrove Log', amount: 64, cost: 3, currency: 'Gold Coins' },
    { name: 'Crimson Stem', amount: 64, cost: 3, currency: 'Gold Coins' },
    { name: 'Spruce Log', amount: 64, cost: 3, currency: 'Gold Coins' },
    { name: 'Dark Oak Log', amount: 64, cost: 3, currency: 'Gold Coins' },
    { name: 'Jungle Log', amount: 64, cost: 3, currency: 'Gold Coins' },
    { name: 'Oak Log', amount: 64, cost: 3, currency: 'Gold Coins' },
    { name: 'Acacia Log', amount: 64, cost: 3, currency: 'Gold Coins' },
    { name: 'Birch Log', amount: 64, cost: 3, currency: 'Gold Coins' },
    { name: 'Cherry Log', amount: 64, cost: 3, currency: 'Gold Coins' },
    { name: 'Warped Stem', amount: 64, cost: 3, currency: 'Gold Coins' },
    { name: 'Flourishing Archwood Log', amount: 64, cost: 3, currency: 'Gold Coins' },
    { name: 'Cascading Archwood Log', amount: 64, cost: 3, currency: 'Gold Coins' },
    { name: 'Vexing Archwood Log', amount: 64, cost: 3, currency: 'Gold Coins' },
    { name: 'Blazing Archwood Log', amount: 64, cost: 3, currency: 'Gold Coins' }
  ]
};

const unresolved = new Set();
let appendCount = 0;
let unknownShop = [];

for (const [shopId, offers] of Object.entries(shopOffers)) {
  const shop = shops.find(s => s.id === shopId);
  if (!shop) {
    unknownShop.push(shopId);
    continue;
  }

  for (const offer of offers) {
    const itemId = findItemId(offer.name);
    if (!itemId) {
      unresolved.add(offer.name);
      continue;
    }
    const currency = offer.currency;
    const currencyItem = currencyItemId[currency];
    if (!currencyItem) {
      console.warn('currency mapping missing', currency);
      continue;
    }

    const exists = shop.items.some(i =>
      i.id === itemId && i.displayName === offer.name && i.cost === offer.cost && i.currency === currency
    );
    if (exists) continue;

    shop.items.push({
      id: itemId,
      displayName: offer.name,
      cost: offer.cost,
      currency,
      currencyItemId: currencyItem,
      amountReceived: offer.amount
    });
    appendCount++;
  }
}

console.log('unknown shops:', unknownShop);
console.log('unresolved items:', [...unresolved]);
console.log('new items added:', appendCount);

fs.writeFileSync(SHOPS_FILE, JSON.stringify(shops, null, 2));
console.log('shops.json updated');
