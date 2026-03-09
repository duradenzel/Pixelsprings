// src/map/MapView.tsx
import { MapContainer, ImageOverlay, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { Shop } from "../domain/types"
import { mcToLeaflet } from "./coordinateMapper"
import { useEffect } from "react"

interface Props {
  shops: Shop[]
  selectedShop?: Shop | null
  onSelectShop: (shop: Shop | null) => void
}

function MapEffect({ selectedShop }: { selectedShop?: Shop | null }) {
  const map = useMap()

  useEffect(() => {
    if (selectedShop) {
      const [y, x] = mcToLeaflet(selectedShop.location.x, selectedShop.location.z)
      map.setView([y, x], 2) // zoom adjustable
    }
  }, [selectedShop, map])

  return null
}

const bounds: [[number, number], [number, number]] = [
  [0, 0],
  [544, 624]
]

export function MapView({ shops, selectedShop, onSelectShop }: Props) {
  // fix default marker paths
 

  return (
    <MapContainer
      crs={L.CRS.Simple}
      bounds={bounds}
      maxBounds={bounds}
      minZoom={-1}
      maxZoom={4}
      className="h-full w-full"
    >
      <ImageOverlay url="/map/shopping-district.png" bounds={bounds} />
      {shops.map(shop => (
        <Marker
          key={shop.id}
          position={mcToLeaflet(shop.location.x, shop.location.z)}
          opacity={!selectedShop ? 0.8 : shop.id === selectedShop.id ? 1 : 0.3}
          eventHandlers={{
            click: () => onSelectShop(shop)
          }}
        >
          <Popup>
            <strong>{shop.name}</strong><br />
            Owner: {shop.owner}
          </Popup>
        </Marker>
      ))}
      <MapEffect selectedShop={selectedShop} />
    </MapContainer>
  )
}