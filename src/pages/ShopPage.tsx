import { useEffect, useMemo, useState } from "react";
import type { Category, Product } from "../types";
import { CATEGORIES_LIST, PRODUCTS } from "../data/products";
import { searchProducts } from "../api/mockApi";
import { ProductCard } from "../components/ProductCard";
import { useDemo } from "../contexts/DemoProvider";

const CATEGORIES: Array<Category | "All"> = ["All", ...CATEGORIES_LIST];

function SkeletonCard() {
  return (
    <div className="productCard productCard--skeleton" aria-hidden="true">
      <div className="productCard__media" />
      <div className="productCard__body">
        <div className="skeletonLine skeletonLine--short" />
        <div className="skeletonLine" />
        <div className="skeletonLine skeletonLine--muted" />
        <div className="skeletonRow">
          <div className="skeletonStars" />
          <div className="skeletonLine skeletonLine--tiny" />
        </div>
        <div className="skeletonBtn" />
      </div>
    </div>
  );
}

export function ShopPage() {
  const { addToCart } = useDemo();

  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>(PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categoryForApi = useMemo(() => {
    return selectedCategory === "All" ? undefined : selectedCategory;
  }, [selectedCategory]);

  useEffect(() => {
    let cancelled = false;
    const handle = window.setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const next = await searchProducts(query, categoryForApi);
        if (!cancelled) setResults(next);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Search failed.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 350);

    return () => {
      cancelled = true;
      window.clearTimeout(handle);
    };
  }, [categoryForApi, query]);

  return (
    <div className="page">
      <div className="pageHeader pageHeader--shop">
        <div className="pageHeader__left">
          <div className="pageHeader__title">Shop</div>
          <div className="pageHeader__subtitle">Search across clothes, shoes, and electronics.</div>
        </div>
        <div className="searchBar">
          <input
            className="input searchBar__input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products (e.g. hoodie, boots, charger)"
          />
          <div className="searchBar__hint">{results.length} results</div>
        </div>
      </div>

      <div className="chipRow" role="tablist" aria-label="Categories">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            className={c === selectedCategory ? "chip chip--active" : "chip"}
            onClick={() => setSelectedCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {error ? <div className="alert alert--error">{error}</div> : null}

      {loading ? (
        <div className="grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="emptyState">
          <div className="emptyState__title">No matches</div>
          <div className="emptyState__text">Try a different search term or category.</div>
        </div>
      ) : (
        <div className="grid">
          {results.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onAdd={() => addToCart(p.id, 1)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

