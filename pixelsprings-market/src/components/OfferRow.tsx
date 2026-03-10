import type { Offer } from "../domain/types"
import { ItemIcon } from "./ItemIcon"

interface OfferRowProps {
  offer: Offer
  onClick: () => void
}

export function OfferRow({ offer, onClick }: OfferRowProps) {
  return (
    <div
      onClick={onClick}
      className="bg-gray-700 border-2 border-gray-900 mb-2 p-2 flex items-center cursor-pointer hover:bg-gray-600"
    >
      <div className="flex-shrink-0">
        <ItemIcon
          itemId={offer.currencyItemId}
          amount={offer.cost}
          alt={offer.currency}
        />
      </div>

      <span className="mx-2 text-xl text-gray-300">→</span>

      <div className="flex-shrink-0">
        <ItemIcon
          itemId={offer.id}
          amount={offer.amountReceived}
          alt={offer.displayName}
        />
      </div>

      <div className="ml-3 flex-1">
        <div>{offer.displayName}</div>
        <div className="text-sm opacity-70">{offer.shopName}</div>
      </div>
    </div>
  )
}
