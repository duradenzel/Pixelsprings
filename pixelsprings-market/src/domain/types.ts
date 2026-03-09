

export interface ShopItem {
  id: string         // registry ID or temporary display name
  displayName: string
  cost: number
  currency: string
  amountReceived: number
  currencyItemId: string  // registry ID for the currency, used to display the correct icon
}

export interface Shop {
  id: string
  name: string
  owner: string
  location: { x: number; z: number }
  items: ShopItem[]
}

// An offer is a shop item augmented with its originating shop information.
export interface Offer extends ShopItem {
  shopId: string
  shopName: string
  shopLocation: { x: number; z: number }
}

// helper types used by sidebar filtering/sorting
export type CurrencyConversion = Record<string, number>

// criteria passed to the search bar / filtering logic. All fields are
// optional; absence means "don't filter on this property".
export interface SearchCriteria {
  /** free‑text portion that looks at the displayName of the item */
  text?: string
  /** shop name substring */
  shop?: string
  /** mod identifier (the part before the colon in a registry id) */
  mod?: string
}
