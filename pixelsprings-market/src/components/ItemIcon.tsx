
interface ItemIconProps {
  itemId?: string
  amount: number
  alt: string
}

export function ItemIcon({ itemId, amount, alt }: ItemIconProps) {
  if (!itemId) {
    return (
      <div className="w-11 h-11 bg-gray-700 border-2 border-gray-900 flex items-center justify-center">
        <span className="text-xs text-gray-300">?</span>
      </div>
    )
  }

  const [modid, itemName] = itemId.split(":")
  const iconPath = `/item-icons/${modid}/${itemName}.png`

  return (
    <div className="w-11 h-11 bg-gray-600 border-2 border-gray-900 flex items-center justify-center relative">
      <img
        src={iconPath}
        alt={alt}
        className="w-8 h-8"
        style={{ imageRendering: "pixelated" }}
        onError={(e) => {
          e.currentTarget.style.display = "none"
        }}
      />
      {amount > 1 && (
        <span className="absolute bottom-1 right-1 text-xs text-shadow">
          {amount}
        </span>
      )}
    </div>
  )
}
