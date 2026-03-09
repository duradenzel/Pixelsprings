import { useState } from "react"
import shops from "./data/shops.json"
import { MapView } from "./map/MapView"
import { Sidebar } from "./components/Sidebar"
import type { Shop } from "./domain/types"

export default function App() {
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null)

  return (
    <div className="flex h-screen">
      <Sidebar
        shops={shops}
        selectedShop={selectedShop}
        onSelectShop={setSelectedShop}
      />
      <MapView
        shops={shops}
        selectedShop={selectedShop}
        onSelectShop={setSelectedShop}
      />
    </div>
  )
}