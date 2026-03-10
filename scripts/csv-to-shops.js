// const fs = require("fs")
// const path = require("path")
// const csv = require("csv-parser")

// const CSV_FOLDER = "./ShopCSVs"
// const ITEMS_FILE = "./pixelsprings-market/src/data/items.json"
// const OUTPUT_FILE = "./pixelsprings-market/src/data/shops.json"
// const REPORT_FILE = "./pixelsprings-market/src/data/csv-import-report.json"

// // currency mapping
// const currencyMap = {
//   "Silver Coins": "economy:creepercoin2",
//   "Gold Coins": "economy:creepercoin",
//   "Money": "economy:para_png"
// }

// // load item registry
// const registry = JSON.parse(fs.readFileSync(ITEMS_FILE))

// // normalize names for matching
// function normalize(str) {
//   return str
//     .toLowerCase()
//     .replace(/[^a-z0-9 ]/g, "")
// }

// // build lookup table
// const itemLookup = {}
// registry.forEach(id => {
//   const name = id.split(":")[1]
//     .replace(/_/g, " ")
//   itemLookup[normalize(name)] = id
// })

// // slugify shop id
// function slugify(name) {
//   return name
//     .toLowerCase()
//     .replace(/[^a-z0-9]+/g, "-")
//     .replace(/^-|-$/g, "")
// }

// // explicit manual overrides for ambiguous / special names (normalized keys)
// const manualItemNames = {
//   "aqua dashers": "artifacts:aqua_dashers",
//   "aqua infinity": "minecraft:enchanted_book",
//   "ash": "supplementaries:ash",
//   "charismatic ii": "minecraft:enchanted_book",
//   "multishot": "minecraft:enchanted_book",
//   "smite v": "minecraft:enchanted_book",
//   "impaling v": "minecraft:enchanted_book",
//   "jaspar": "quark:jasper",
//   "anchony": "croptopia:anchovy",
//   "piercing iv": "minecraft:enchanted_book",
//   "punch ii": "minecraft:enchanted_book",
//   "channeling": "minecraft:enchanted_book",
//   "mending": "minecraft:enchanted_book",
//   "sharpness v": "minecraft:enchanted_book",
//   "punch": "minecraft:enchanted_book",
//   "piercing": "minecraft:enchanted_book",
//   "smite": "minecraft:enchanted_book",
//   "sharpness": "minecraft:enchanted_book",
//   "lure": "minecraft:enchanted_book",
//   "unbreaking": "minecraft:enchanted_book",
//   "looting": "minecraft:enchanted_book",
//   "aqua affinity": "minecraft:enchanted_book",
//   "unbreaking 3": "minecraft:enchanted_book",
//   "respiration 3": "minecraft:enchanted_book",
//   "aqua-dashers": "artifacts:aqua_dashers",
//   "grey chandalier (moa)": "moa_decor_lights:candelabro_g",
// }

// // normalized manual lookup table
// const manualItemLookup = {}
// for (const [key, value] of Object.entries(manualItemNames)) {
//   manualItemLookup[normalize(key)] = value
// }

// // find item id
// function findItemId(displayName) {

//   const normalized = normalize(displayName)

//   // manual override first (normalized)
//   if (manualItemLookup[normalized]) {
//     return manualItemLookup[normalized]
//   }

//   // exact normalized match
//   if (itemLookup[normalized]) {
//     return itemLookup[normalized]
//   }

//   const normTokens = normalized.split(/\s+/).filter(Boolean)

//   // direct token matches (word-based) with 3+ chars to avoid short false hits
//   let tokenMatches = []
//   for (const [key, id] of Object.entries(itemLookup)) {
//     const keyTokens = key.split(/\s+/).filter(Boolean)
//     const shared = keyTokens.filter(t => normTokens.includes(t) && t.length >= 3)
//     if (shared.length > 0) {
//       tokenMatches.push({ key, id, score: shared.length })
//     }
//   }

//   if (tokenMatches.length > 0) {
//     tokenMatches.sort((a, b) => b.score - a.score)
//     return tokenMatches[0].id
//   }

//   // relaxed substring match with word boundary awareness after strict checks
//   for (const [key, id] of Object.entries(itemLookup)) {
//     if (normalized === key) {
//       return id
//     }
//     if (new RegExp(`\\b${key.replace(/\\s+/g, "\\\s+")}\\b`).test(normalized)) {
//       return id
//     }
//     if (new RegExp(`\\b${normalized.replace(/\\s+/g, "\\\s+")}\\b`).test(key)) {
//       return id
//     }
//   }

//   console.warn("Unknown item:", displayName)
//   return "minecraft:stone"
// }

// // report storage
// const reportRows = []

// // parse CSV
// async function parseCsv(filePath) {

//   return new Promise(resolve => {

//     const items = []

//     fs.createReadStream(filePath)
//       .pipe(csv())
//       .on("data", row => {

//   const displayName = (row["Product"] || "").trim()

//   if (!displayName) return

//   const currency = (row["Currency Type"] || "").trim()

//   const selectedId = findItemId(displayName)

//   reportRows.push({
//     shopCsv: path.basename(filePath),
//     displayName,
//     currency,
//     cost: Number(row["Cost"]),
//     resolvedId: selectedId,
//     unresolved: selectedId === "minecraft:stone"
//   })

//   items.push({
//     id: selectedId,
//     displayName,
//     cost: Number(row["Cost"]),
//     currency: currency,
//     currencyItemId: currencyMap[currency],
//     amountReceived: Number(row["Per Units"])
//   })

// })
//       .on("end", () => resolve(items))

//   })

// }

// async function main() {

//   const files = fs
//     .readdirSync(CSV_FOLDER)
//     .filter(f => f.endsWith(".csv"))

//   const existingShops = JSON.parse(fs.readFileSync(OUTPUT_FILE))
//   const shopIndex = Object.fromEntries(existingShops.map(shop => [shop.id, shop]))

//   let addedShops = 0
//   let updatedShops = 0
//   let appendedItems = 0

//   for (const file of files) {
//     const shopName = path.basename(file, ".csv")
//     const id = slugify(shopName)
//     const items = await parseCsv(path.join(CSV_FOLDER, file))

//     if (!shopIndex[id]) {
//       shopIndex[id] = {
//         id,
//         name: shopName,
//         owner: "Unknown",
//         location: { x: 0, z: 0 },
//         items
//       }
//       addedShops++
//     } else {
//       const existing = shopIndex[id]
//       const existingItemKeys = new Set(existing.items.map(i => `${i.id}|${i.displayName}|${i.cost}|${i.currency}`))
//       for (const item of items) {
//         const key = `${item.id}|${item.displayName}|${item.cost}|${item.currency}`
//         if (!existingItemKeys.has(key)) {
//           existing.items.push(item)
//           appendedItems++
//         }
//       }
//       updatedShops++
//     }
//   }

//   const out = Object.values(shopIndex)
//   fs.writeFileSync(OUTPUT_FILE, JSON.stringify(out, null, 2))

//   // write a detailed report about resolved and unresolved CSV product names
//   fs.writeFileSync(REPORT_FILE, JSON.stringify(reportRows, null, 2))

//   console.log(`Shops generated: ${addedShops}`)
//   console.log(`Existing shops updated: ${updatedShops}`)
//   console.log(`New items appended: ${appendedItems}`)
//   console.log(`Report generated: ${REPORT_FILE}`)
// }

// main()