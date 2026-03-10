

export interface ShopItem {
  id: string         
  displayName: string
  cost: number
  currency: string
  amountReceived: number
  currencyItemId?: string  
}

export interface Shop {
  id: string
  name: string
  owner: string
  location: { x: number; z: number }
  items: ShopItem[]
}

export interface Offer extends ShopItem {
  shopId: string
  shopName: string
  shopLocation: { x: number; z: number }
}

export type CurrencyConversion = Record<string, number>


export interface SearchCriteria {
  text?: string
  shop?: string
  mod?: string
}
