const fs = require("fs")
const path = require("path")
const csv = require("csv-parser")

const CSV_FOLDER = "./ShopCSVs"
const ITEMS_FILE = "./pixelsprings-market/src/data/items.json"
const OUTPUT_FILE = "./pixelsprings-market/src/data/shops.json"

// currency mapping
const currencyMap = {
  "Silver Coins": "economy:creepercoin2",
  "Gold Coins": "economy:creepercoin",
  "Money": "economy:para_png"
}

// load item registry
const registry = JSON.parse(fs.readFileSync(ITEMS_FILE))

// normalize names for matching
function normalize(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
}

// build lookup table
const itemLookup = {}
registry.forEach(id => {
  const name = id.split(":")[1]
    .replace(/_/g, " ")
  itemLookup[normalize(name)] = id
})

// slugify shop id
function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

// find item id
function findItemId(displayName) {

  const normalized = normalize(displayName)

  // exact match first
  if (itemLookup[normalized]) {
    return itemLookup[normalized]
  }

  // fuzzy match
  for (const key in itemLookup) {
    if (key.includes(normalized) || normalized.includes(key)) {
      return itemLookup[key]
    }
  }

  console.warn("Unknown item:", displayName)
  return "minecraft:stone"
}

// parse CSV
async function parseCsv(filePath) {

  return new Promise(resolve => {

    const items = []

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", row => {

  const displayName = (row["Product"] || "").trim()

  if (!displayName) return

  const currency = (row["Currency Type"] || "").trim()

  items.push({
    id: findItemId(displayName),
    displayName,
    cost: Number(row["Cost"]),
    currency: currency,
    currencyItemId: currencyMap[currency],
    amountReceived: Number(row["Per Units"])
  })

})
      .on("end", () => resolve(items))

  })

}

async function main() {

  const files = fs
    .readdirSync(CSV_FOLDER)
    .filter(f => f.endsWith(".csv"))

  const existingShops = JSON.parse(fs.readFileSync(OUTPUT_FILE))
  const shopIndex = Object.fromEntries(existingShops.map(shop => [shop.id, shop]))

  let addedShops = 0
  let updatedShops = 0
  let appendedItems = 0

  for (const file of files) {
    const shopName = path.basename(file, ".csv")
    const id = slugify(shopName)
    const items = await parseCsv(path.join(CSV_FOLDER, file))

    if (!shopIndex[id]) {
      shopIndex[id] = {
        id,
        name: shopName,
        owner: "Unknown",
        location: { x: 0, z: 0 },
        items
      }
      addedShops++
    } else {
      const existing = shopIndex[id]
      const existingItemKeys = new Set(existing.items.map(i => `${i.id}|${i.displayName}|${i.cost}|${i.currency}`))
      for (const item of items) {
        const key = `${item.id}|${item.displayName}|${item.cost}|${item.currency}`
        if (!existingItemKeys.has(key)) {
          existing.items.push(item)
          appendedItems++
        }
      }
      updatedShops++
    }
  }

  const out = Object.values(shopIndex)
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(out, null, 2))

  console.log(`Shops generated: ${addedShops}`)
  console.log(`Existing shops updated: ${updatedShops}`)
  console.log(`New items appended: ${appendedItems}`)
}

main()