import { useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { PRODUCTS } from "../data/products";
import { CheckoutModal } from "../components/CheckoutModal";
import { QuantityStepper } from "../components/QuantityStepper";
import { useDemo } from "../contexts/DemoProvider";

export function CartPage() {
  const { cart, cartTotal, loadingCart, updateCartItem, deleteCartItem } = useDemo();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const itemsDetailed = useMemo(() => {
    return cart.items
      .map((it) => {
        const p = PRODUCTS.find((x) => x.id === it.productId);
        if (!p) return null;
        return { ...it, product: p, lineTotal: p.price * it.quantity };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
  }, [cart.items]);

  return (
    <div className="page page--wide">
      <div className="pageHeader">
        <div className="pageHeader__title">Your cart</div>
        <div className="pageHeader__subtitle">Update quantities or remove items (dummy API calls).</div>
      </div>

      <div className="cartLayout">
        <div className="cartList">
          {loadingCart ? (
            <div className="loadingBlock">Loading cart...</div>
          ) : itemsDetailed.length === 0 ? (
            <div className="emptyCard emptyCard--center">
              <div className="emptyCard__title">Cart is empty</div>
              <div className="emptyCard__text">Add some clothes, shoes, or electronics to get started.</div>
              <a className="btn btn--primary" href="/shop">
                Browse products
              </a>
            </div>
          ) : (
            <div className="cartRows">
              {itemsDetailed.map((it) => (
                <div key={it.productId} className="cartRow">
                  <div className="cartRow__media" aria-hidden="true">
                    <div className="cartRow__emoji">
                      {it.product.category === "Clothes" ? "👕" : null}
                      {it.product.category === "Shoes" ? "👟" : null}
                      {it.product.category === "Electronics" ? "🎧" : null}
                    </div>
                  </div>

                  <div className="cartRow__main">
                    <div className="cartRow__titleRow">
                      <div className="cartRow__name">{it.product.name}</div>
                      <div className="cartRow__price">${it.product.price.toFixed(2)}</div>
                    </div>
                    <div className="cartRow__meta">
                      <span className="badge">{it.product.category}</span>
                      <span className="mutedText">{it.product.description}</span>
                    </div>

                    <div className="cartRow__actions">
                      <QuantityStepper
                        value={it.quantity}
                        disabled={loadingCart}
                        onChange={(next) => updateCartItem(it.productId, next)}
                      />
                      <button
                        type="button"
                        className="btn btn--danger btn--icon"
                        onClick={() => deleteCartItem(it.productId)}
                        disabled={loadingCart}
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="cartRow__total">
                    <div className="cartRow__totalLabel">Line total</div>
                    <div className="cartRow__totalValue">${it.lineTotal.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className="cartSummary">
          <div className="summaryCard">
            <div className="summaryCard__title">Order summary</div>
            <div className="summaryRow">
              <div className="mutedText">Items</div>
              <div>{itemsDetailed.reduce((sum, it) => sum + it.quantity, 0)}</div>
            </div>
            <div className="summaryRow">
              <div className="mutedText">Total</div>
              <div className="summaryTotal">${cartTotal.toFixed(2)}</div>
            </div>

            <button
              type="button"
              className="btn btn--primary btn--full"
              disabled={itemsDetailed.length === 0}
              onClick={() => setCheckoutOpen(true)}
            >
              Place order
            </button>

            <div className="summaryNote">
              Dummy checkout collects shipping address + payment method and creates an order in localStorage.
            </div>
          </div>
        </aside>
      </div>

      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </div>
  );
}

