import { useMemo } from "react"
import type { Shop, Offer, CurrencyConversion, SearchCriteria } from "../domain/types"

const currencyConversion: CurrencyConversion = {
  "Silver Coins": 1 / 256,
  "Gold Coins": 1 / 16,
  Money: 1
}

/**
 * Transform a collection of shops into sorted, filtered offers based on
 * `criteria`. Returns an empty array when there are no criteria specified
 * (matching the previous behaviour where an empty search produced nothing).
 */
export function useOffers(
  shops: Shop[],
  criteria: SearchCriteria
): Offer[] {
  return useMemo(() => {
    const allOffers: Offer[] = shops.flatMap((shop) =>
      shop.items.map((item) => ({
        ...item,
        shopId: shop.id,
        shopName: shop.name,
        shopLocation: shop.location
      }))
    )

    const hasCriteria =
      Boolean(
        criteria.text?.trim() ||
        criteria.shop?.trim() ||
        criteria.mod?.trim()
      )

    const filtered = hasCriteria
      ? allOffers.filter((offer) => {
          // text search against displayName
          if (
            criteria.text &&
            !offer.displayName
              .toLowerCase()
              .includes(criteria.text.toLowerCase())
          ) {
            return false
          }
          // shop name filter
          if (
            criteria.shop &&
            !offer.shopName.toLowerCase().includes(criteria.shop.toLowerCase())
          ) {
            return false
          }
          // mod filter - look at the part before the colon of the item ID
          if (criteria.mod) {
            const modid = offer.id.split(":")[0]
            if (!modid.toLowerCase().includes(criteria.mod.toLowerCase())) {
              return false
            }
          }
          return true
        })
      : []

    filtered.sort((a, b) => {
      const priceA = a.cost * (currencyConversion[a.currency] ?? 1)
      const priceB = b.cost * (currencyConversion[b.currency] ?? 1)
      return priceA - priceB
    })

    return filtered
  }, [shops, criteria])
}
