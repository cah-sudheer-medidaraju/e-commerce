import { useState } from "react";
import { Minus, Plus } from "lucide-react";

export function QuantityStepper({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (next: number) => Promise<void>;
  disabled?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const isDisabled = Boolean(disabled) || busy;

  return (
    <div className="stepper" aria-label="Quantity">
      <button
        type="button"
        className="stepper__btn"
        disabled={isDisabled || value <= 1}
        onClick={async () => {
          setBusy(true);
          try {
            await onChange(Math.max(1, value - 1));
          } finally {
            setBusy(false);
          }
        }}
        aria-label="Decrease quantity"
      >
        <Minus size={16} />
      </button>
      <div className="stepper__value" aria-live="polite">
        {value}
      </div>
      <button
        type="button"
        className="stepper__btn"
        disabled={isDisabled}
        onClick={async () => {
          setBusy(true);
          try {
            await onChange(value + 1);
          } finally {
            setBusy(false);
          }
        }}
        aria-label="Increase quantity"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}

