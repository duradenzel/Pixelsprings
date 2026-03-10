import type { SearchCriteria } from "../domain/types"

interface SearchBarProps {
  criteria: SearchCriteria
  onChange: (c: SearchCriteria) => void
  shopOptions?: string[]
  modOptions?: string[]
}

/**
 * A set of small inputs allowing the user to filter the offers list by
 * item name, shop name, or mod.  The parent component maintains the
 * criteria state and passes it back via `onChange`.
 */
export function SearchBar({ criteria, onChange, shopOptions = [], modOptions = [] }: SearchBarProps) {
  const update = (field: keyof SearchCriteria, raw: string) => {
    // trim whitespace so a lone space doesn't count as criteria.
    const value = raw.trim()

    const next: SearchCriteria = { ...criteria, [field]: value }
    // preserve shop (especially when selected via map) while typing text
    if (field === "text") {
      next.text = value
    }
    onChange(next)
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold">Search</span>
        <button
          type="button"
          onClick={() => onChange({})}
          className="text-sm text-gray-400 hover:text-white"
        >
          Clear all
        </button>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Item</label>
        <div className="flex">
          <input
            type="text"
            value={criteria.text || ""}
            onChange={(e) => update("text", e.target.value)}
            placeholder="e.g. diamond sword"
            className="w-full p-2 bg-gray-700 border-2 border-gray-900 text-white"
          />
          <button
            type="button"
            onClick={() => onChange({})}
            className="ml-2 px-2 bg-gray-600 hover:bg-gray-500 rounded"
          >
            ✕
          </button>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Shop</label>
        <input
          type="text"
          list="shop-list"
          value={criteria.shop || ""}
          onChange={(e) => update("shop", e.target.value)}
          placeholder="shop name"
          className="w-full p-2 bg-gray-700 border-2 border-gray-900 text-white"
        />
        {shopOptions && (
          <datalist id="shop-list">
            {shopOptions.map((s) => (
              <option value={s} key={s} />
            ))}
          </datalist>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Mod</label>
        <input
          type="text"
          list="mod-list"
          value={criteria.mod || ""}
          onChange={(e) => update("mod", e.target.value)}
          placeholder="mod id"
          className="w-full p-2 bg-gray-700 border-2 border-gray-900 text-white"
        />
        {modOptions && (
          <datalist id="mod-list">
            {modOptions.map((m) => (
              <option value={m} key={m} />
            ))}
          </datalist>
        )}
      </div>
    </div>
  )
}
