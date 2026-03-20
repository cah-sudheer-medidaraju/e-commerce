import { useMemo } from "react";
import { Trash2, RefreshCcw } from "lucide-react";
import type { OrderStatus } from "../types";
import { PRODUCTS } from "../data/products";
import { useDemo } from "../contexts/DemoProvider";

const STATUS_OPTIONS: OrderStatus[] = ["Processing", "Shipped", "Delivered", "Cancelled"];

function shortId(id: string): string {
  const s = id.replace("order_", "");
  return s.length > 10 ? `${s.slice(0, 6)}…${s.slice(-3)}` : s;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export function OrdersPage() {
  const { user, orders, loadingOrders, deleteOrder, updateOrderStatus } = useDemo();

  const productsById = useMemo(() => new Map(PRODUCTS.map((p) => [p.id, p])), []);

  if (!user) {
    return (
      <div className="page">
        <div className="pageHeader">
          <div className="pageHeader__title">Orders</div>
          <div className="pageHeader__subtitle">Create an account to view your order history.</div>
        </div>
        <div className="emptyCard emptyCard--center">
          <div className="emptyCard__title">No account yet</div>
          <div className="emptyCard__text">Orders are tied to your local demo account.</div>
          <a className="btn btn--primary" href="/register">
            Create account
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="page page--wide">
      <div className="pageHeader">
        <div className="pageHeader__title">Your orders</div>
        <div className="pageHeader__subtitle">Delete and update order status (dummy API calls).</div>
      </div>

      {loadingOrders ? (
        <div className="loadingBlock">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="emptyCard emptyCard--center">
          <div className="emptyCard__title">No orders yet</div>
          <div className="emptyCard__text">Add items to your cart, then place an order.</div>
          <a className="btn btn--primary" href="/shop">
            Go to shop
          </a>
        </div>
      ) : (
        <div className="ordersList">
          {orders.map((o) => {
            const items = o.items.map((it) => {
              const p = productsById.get(it.productId);
              return { ...it, name: p?.name ?? it.productId };
            });

            return (
              <div key={o.id} className="orderCard">
                <div className="orderCard__header">
                  <div>
                    <div className="orderCard__id">Order {shortId(o.id)}</div>
                    <div className="mutedText">{formatDate(o.createdAt)}</div>
                  </div>
                  <div className="orderCard__right">
                    <div className={`status status--${o.status.replace(" ", "").toLowerCase()}`}>
                      {o.status}
                    </div>
                    <div className="orderCard__total">${o.total.toFixed(2)}</div>
                  </div>
                </div>

                <div className="orderCard__grid">
                  <div className="orderCard__section">
                    <div className="field__label">Shipping</div>
                    <div className="orderCard__text">{o.shippingAddress}</div>
                    <div className="mutedText">Payment: {o.paymentMethod}</div>
                  </div>

                  <div className="orderCard__section">
                    <div className="field__label">Items</div>
                    <div className="orderItems">
                      {items.map((it) => (
                        <div key={it.productId} className="orderItemRow">
                          <div className="orderItemRow__name">
                            {it.name} <span className="mutedText">x{it.quantity}</span>
                          </div>
                          <div className="orderItemRow__price">
                            ${(it.unitPrice * it.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="orderCard__section orderCard__section--actions">
                    <label className="field">
                      <span className="field__label">Update status</span>
                      <select
                        className="input"
                        value={o.status}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderStatus)}
                        disabled={loadingOrders}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </label>

                    <button
                      type="button"
                      className="btn btn--danger btn--full"
                      onClick={() => deleteOrder(o.id)}
                      disabled={loadingOrders}
                    >
                      <RefreshCcw size={16} /> Delete
                    </button>
                    <button
                      type="button"
                      className="btn btn--ghost btn--full"
                      onClick={() => {
                        // Small nudge to place another order.
                        window.location.href = "/cart";
                      }}
                      disabled={loadingOrders}
                    >
                      Back to cart
                    </button>
                  </div>
                </div>

                <div className="orderCard__footer">
                  <button
                    type="button"
                    className="btn btn--icon btn--ghost"
                    onClick={() => deleteOrder(o.id)}
                    disabled={loadingOrders}
                    aria-label="Delete order"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="mutedText">Actions call mocked API endpoints.</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

