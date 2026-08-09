import { Search } from "lucide-react";

/**
 * Filter — Premium category pills and search input with smooth interactions
 * Features modern pill design, hover states, and responsive layout
 */
export const Filter = ({
  categories,
  activeCategory,
  onCategoryChange,
  searchValue,
  onSearchChange,
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by category">
        {categories.map((cat) => {
          const active = cat === activeCategory;
          return (
            <button
              key={cat}
              role="tab"
              aria-selected={active}
              onClick={() => onCategoryChange(cat)}
              className={`text-sm font-medium px-4 py-2 rounded-full border transition-all duration-200 active:scale-95 ${
                active
                  ? "bg-neutral-900 text-white border-neutral-900 shadow-sm"
                  : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300 hover:text-neutral-900"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <label className="relative w-full lg:max-w-xs">
        <span className="sr-only">Search products</span>
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
        />
        <input
          type="search"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search products..."
          className="w-full h-11 rounded-full border border-neutral-200 bg-white pl-11 pr-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
        />
      </label>
    </div>
  );
};
