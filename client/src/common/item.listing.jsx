import { useMemo, useState } from "react";
import { Filter } from "./filter";
import { ItemCard } from "./item.card";
import { CATEGORIES } from "../products.js";

/**
 * ItemListing — Premium product grid with responsive breakpoints
 * Features modern spacing, empty states, and smooth transitions
 */
export const ItemListing = ({ products, onSelect = () => {} }) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = activeCategory === "All" || p.category === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(search.trim().toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, search]);

  return (
    <section id="shop" className="bg-neutral-50 py-20 sm:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 tracking-tight">
            Shop NOVA
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 mt-4 max-w-2xl mx-auto">
            Every product, one place. Filter by category or search by name.
          </p>
        </div>

        <Filter
          categories={CATEGORIES}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          searchValue={search}
          onSearchChange={setSearch}
        />

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {filtered.map((product) => (
              <ItemCard key={product.id} product={product} onPurchase={onSelect} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 mb-4">
              <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-neutral-900">No products match that search.</p>
            <p className="text-sm text-neutral-500 mt-2">
              Try a different name or clear the category filter.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
