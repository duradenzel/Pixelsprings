import { useState, useEffect } from "react"
import type { Shop, SearchCriteria } from "../domain/types"
import { useOffers } from "./useOffers"
import { OfferRow } from "./OfferRow"
import { SearchBar } from "./SearchBar"

interface Props {
  shops: Shop[]
  selectedShop?: Shop | null
  onSelectShop: (shop: Shop | null) => void
}

export function Sidebar({ shops, selectedShop, onSelectShop }: Props) {
  const [criteria, setCriteria] = useState<SearchCriteria>({})
  const [collapsed, setCollapsed] = useState(false)

  // when another shop becomes selected (e.g. via map click), update the
  // text filter so the list shows only that shop's offers; clearing occurs
  // when null is passed.
  useEffect(() => {
    const id = setTimeout(() => {
      if (selectedShop) {
        setCriteria({ shop: selectedShop.name })
      } else {
        setCriteria({})
      }
    }, 0)
    return () => clearTimeout(id)
  }, [selectedShop])

  // whenever the list of shops is replaced we clear the search criteria.
  // this is mainly for HMR/data reloads; it doesn't run while the user types.
  // deferring with a timeout avoids React's "cascading renders" warning.
  useEffect(() => {
    const id = setTimeout(() => setCriteria({}), 0)
    return () => clearTimeout(id)
  }, [shops])

  // compute suggestion lists from the shops data
  const shopOptions = Array.from(new Set(shops.map(s => s.name))).sort()
  const modOptions = Array.from(
    new Set(
      shops.flatMap(s => s.items.map(i => i.id.split(":")[0]))
    )
  ).sort()

  const offers = useOffers(shops, criteria)

  return (
    <div
      className={`transition-all duration-200 flex flex-col bg-gray-800 border-r-4 border-gray-900 text-white ${
        collapsed ? "w-10" : "w-80"
      }`}
    >
      <button
        onClick={() => setCollapsed(c => !c)}
        className="p-2 focus:outline-none text-gray-300 bg-gray-800 hover:text-white w-10 self-end"
      >
        {collapsed ? ">" : "<"}
      </button>

      {!collapsed && (
        <>
          <div className="p-4">
            <SearchBar
              criteria={criteria}
              onChange={setCriteria}
              shopOptions={shopOptions}
              modOptions={modOptions}
            />
          </div>
          <div className="px-4 flex-1 overflow-y-auto">
            {offers.map((offer) => (
              <OfferRow
                key={`${offer.shopId}-${offer.id}-${offer.displayName}`}
                offer={offer}
                onClick={() =>
                  onSelectShop({
                    id: offer.shopId,
                    name: offer.shopName,
                    location: offer.shopLocation,
                    owner: "",
                    items: []
                  })
                }
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
