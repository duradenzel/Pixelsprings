import { useState } from "react"

interface ItemIconProps {
  itemId?: string
  amount: number
  alt: string
}

export function ItemIcon({ itemId, amount, alt }: ItemIconProps) {
  const [fallbackIndex, setFallbackIndex] = useState(0)

  if (!itemId) {
    return (
      <div className="w-11 h-11 bg-gray-700 border-2 border-gray-900 flex items-center justify-center">
        <span className="text-xs text-gray-300">?</span>
      </div>
    )
  }

  const [modid, itemName] = itemId.split(":")
  const candidatePaths = [
    `/item-icons/${modid}/${itemName}.png`,
    `/item-icons/${modid}/${itemName}_top.png`,
    `/item-icons/${modid}/${itemName}_side.png`,
    `/item-icons/${modid}/${itemName}_bottom.png`,
    `/item-icons/${modid}/${itemName}_01.png`,
    `/item-icons/${modid}/${itemName}_02.png`,
    `/item-icons/${modid}/${itemName}_icon.png`
  ]

  const src = candidatePaths[fallbackIndex] || ""

  return (
    <div className="w-11 h-11 bg-gray-600 border-2 border-gray-900 flex items-center justify-center relative">
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-8 h-8"
          style={{ imageRendering: "pixelated" }}
          onError={() => {
            if (fallbackIndex < candidatePaths.length - 1) {
              setFallbackIndex(fallbackIndex + 1)
            }
          }}
        />
      ) : (
        <span className="text-xs text-gray-300">?</span>
      )}
      {amount > 1 && (
        <span className="absolute bottom-1 right-1 text-xs text-shadow">
          {amount}
        </span>
      )}
    </div>
  )
}
