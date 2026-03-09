const fs = require("fs")
const path = require("path")
const AdmZip = require("adm-zip")
const fse = require("fs-extra")

// 🔧 CHANGE THESE PATHS
const MODS_FOLDER =
  "C:/Users/Huijb/curseforge/minecraft/Instances/PixelSprings/mods"

const MC_VERSION_JAR =
  "C:/Users/Huijb/AppData/Roaming/.minecraft/versions/1.20.4/1.20.4.jar"

const OUTPUT_FOLDER =
  "C:/Users/Huijb/OneDrive/Bureaublad/Pixelsprings/pixelsprings-market/public/item-icons"


// --------------------------------------
// Utility: extract selected texture types
// --------------------------------------
async function extractFromJar(jarPath, options) {
  const zip = new AdmZip(jarPath)
  const entries = zip.getEntries()

  for (const entry of entries) {
    if (!entry.entryName.startsWith("assets/")) continue
    if (!entry.entryName.endsWith(".png")) continue

    const parts = entry.entryName.split("/")
    const modid = parts[1]

    const isItemTexture = entry.entryName.includes("/textures/item/")
    const isBlockTexture = entry.entryName.includes("/textures/block/")

    // Decide what to allow
    const allowItem = options.items && isItemTexture
    const allowBlock = options.blocks && isBlockTexture

    if (!allowItem && !allowBlock) continue

    const fileName = parts[parts.length - 1]
    const outputDir = path.join(OUTPUT_FOLDER, modid)
    const outputPath = path.join(outputDir, fileName)

    await fse.ensureDir(outputDir)

    // 🛑 Skip if already exists (prevents overwriting modded items)
    if (fs.existsSync(outputPath)) continue

    fs.writeFileSync(outputPath, entry.getData())
    console.log(`Extracted: ${modid}/${fileName}`)
  }
}


// --------------------------------------
// Main Extraction Flow
// --------------------------------------
async function extractTextures() {
  console.log("Starting extraction...\n")

  // 1️⃣ Extract MOD item textures only
  const modFiles = fs
    .readdirSync(MODS_FOLDER)
    .filter(f => f.endsWith(".jar"))

  console.log(`Found ${modFiles.length} mod jars\n`)

  for (const modFile of modFiles) {
    const jarPath = path.join(MODS_FOLDER, modFile)

    await extractFromJar(jarPath, {
      items: true,
      blocks: false
    })
  }

  // 2️⃣ Extract VANILLA item + block textures
  console.log("\nExtracting vanilla textures...\n")

  await extractFromJar(MC_VERSION_JAR, {
    items: true,
    blocks: true
  })

  console.log("\nDone. Clean texture extraction complete.")
}

extractTextures()