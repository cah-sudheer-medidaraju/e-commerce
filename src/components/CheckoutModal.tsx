import { useMemo, useState } from "react";
import type { PaymentMethod } from "../types";
import { useDemo } from "../contexts/DemoProvider";

const PAYMENT_METHODS: PaymentMethod[] = ["Card", "UPI", "Cash on Delivery"];

export function CheckoutModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { user, placeOrder, isPlacingOrder } = useDemo();

  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Card");
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return user && shippingAddress.trim().length >= 6 && !isPlacingOrder;
  }, [isPlacingOrder, shippingAddress, user]);

  if (!open) return null;

  return (
    <div className="modalOverlay" role="dialog" aria-modal="true" aria-label="Checkout">
      <div className="modal">
        <div className="modal__header">
          <div className="modal__title">Place your order</div>
          <button type="button" className="btn btn--ghost btn--sm" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="modal__body">
          {!user ? (
            <div className="emptyCard">
              <div className="emptyCard__title">Create an account to checkout</div>
              <div className="emptyCard__text">
                Orders are tied to your demo account. Click below to register.
              </div>
              <a className="btn btn--primary" href="/register" onClick={(e) => e.stopPropagation()}>
                Register
              </a>
            </div>
          ) : null}

          <div className="formGrid">
            <label className="field">
              <span className="field__label">Shipping address</span>
              <textarea
                className="input input--textarea"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="House/Flat, Street, City, ZIP"
                rows={4}
                disabled={!user || isPlacingOrder}
              />
            </label>

            <label className="field">
              <span className="field__label">Payment method</span>
              <select
                className="input"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                disabled={!user || isPlacingOrder}
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {error ? <div className="alert alert--error">{error}</div> : null}
        </div>

        <div className="modal__footer">
          <button
            type="button"
            className="btn btn--primary"
            disabled={!canSubmit}
            onClick={async () => {
              setError(null);
              try {
                await placeOrder({ shippingAddress, paymentMethod });
                onClose();
              } catch (err) {
                const msg = err instanceof Error ? err.message : "Checkout failed.";
                setError(msg);
              }
            }}
          >
            {isPlacingOrder ? "Placing..." : "Place order"}
          </button>
          <button type="button" className="btn btn--secondary" onClick={onClose} disabled={isPlacingOrder}>
            Keep shopping
          </button>
        </div>
      </div>
    </div>
  );
}

