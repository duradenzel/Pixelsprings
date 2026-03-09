const MC_BOUNDS = {
  minX: -350,
  maxX: 150,
  minZ: -700,
  maxZ: -100
}

const IMAGE = {
  width: 624,
  height: 544
}

export function mcToLeaflet(x: number, z: number): [number, number] {
  const xRatio = (x - MC_BOUNDS.minX) / (MC_BOUNDS.maxX - MC_BOUNDS.minX)
  const zRatio = (z - MC_BOUNDS.minZ) / (MC_BOUNDS.maxZ - MC_BOUNDS.minZ)

  const pixelX = xRatio * IMAGE.width
  const pixelY = IMAGE.height - (zRatio * IMAGE.height) 

  return [pixelY, pixelX]
}