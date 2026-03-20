import { useDemo } from "../contexts/DemoProvider";

export function ToastHost() {
  const { toasts } = useDemo();

  if (toasts.length === 0) return null;

  return (
    <div className="toastHost" aria-live="polite" aria-relevant="additions">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast--${t.kind}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}

