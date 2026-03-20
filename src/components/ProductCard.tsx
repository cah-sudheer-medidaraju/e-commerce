import { useMemo, useState } from "react";
import type { Product } from "../types";

function categoryMeta(category: Product["category"]): { emoji: string; gradient: string } {
  switch (category) {
    case "Clothes":
      return { emoji: "👕", gradient: "linear-gradient(135deg,#ff4d8d,#7c3aed)" };
    case "Shoes":
      return { emoji: "👟", gradient: "linear-gradient(135deg,#22c55e,#06b6d4)" };
    case "Electronics":
      return { emoji: "🎧", gradient: "linear-gradient(135deg,#60a5fa,#a78bfa)" };
    default:
      return { emoji: "🛍️", gradient: "linear-gradient(135deg,#f97316,#f43f5e)" };
  }
}

export function ProductCard({ product, onAdd }: { product: Product; onAdd: () => Promise<void> }) {
  const [busy, setBusy] = useState(false);
  const meta = useMemo(() => categoryMeta(product.category), [product.category]);
  const stars = Math.round(product.rating);

  return (
    <div className="productCard">
      <div className="productCard__media" style={{ backgroundImage: meta.gradient }}>
        <div className="productCard__emoji" aria-hidden="true">
          {meta.emoji}
        </div>
      </div>

      <div className="productCard__body">
        <div className="productCard__top">
          <div className="productCard__category">{product.category}</div>
          <div className="productCard__price">${product.price.toFixed(2)}</div>
        </div>

        <div className="productCard__name">{product.name}</div>
        <div className="productCard__desc">{product.description}</div>

        <div className="productCard__rating" aria-label={`Rating ${product.rating} out of 5`}>
          <div className="stars">
            {Array.from({ length: 5 }).map((_, idx) => (
              <span key={idx} className={idx < stars ? "stars__star stars__star--on" : "stars__star"}>
                ★
              </span>
            ))}
          </div>
          <div className="productCard__ratingText">{product.rating.toFixed(1)}</div>
        </div>

        <button
          type="button"
          className="btn btn--primary btn--full"
          disabled={!product.inStock || busy}
          onClick={async () => {
            setBusy(true);
            try {
              await onAdd();
            } finally {
              setBusy(false);
            }
          }}
        >
          {busy ? "Adding..." : product.inStock ? "Add to cart" : "Out of stock"}
        </button>
      </div>
    </div>
  );
}

