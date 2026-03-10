const MC_BOUNDS = {
  minX: -320,
  maxX: 206,
  minZ: -592,
  maxZ: -129
}

const IMAGE = {
  width: 528,
  height: 480
}

export function mcToLeaflet(x: number, z: number): [number, number] {
  const xRatio = (x - MC_BOUNDS.minX) / (MC_BOUNDS.maxX - MC_BOUNDS.minX)
  const zRatio = (z - MC_BOUNDS.minZ) / (MC_BOUNDS.maxZ - MC_BOUNDS.minZ)

  const pixelX = xRatio * IMAGE.width
  const pixelY = IMAGE.height - (zRatio * IMAGE.height) 

  return [pixelY, pixelX]
}