import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDemo } from "../contexts/DemoProvider";

export function RegisterPage() {
  const navigate = useNavigate();
  const { registerAccount } = useDemo();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="page">
      <div className="pageHeader">
        <div className="pageHeader__title">Create your account</div>
        <div className="pageHeader__subtitle">Dummy registration + mocked API calls.</div>
      </div>

      <div className="authCard">
        <div className="authCard__title">Welcome to ShopSphere</div>
        <div className="authCard__text">
          Your account is stored locally in this browser. It unlocks checkout and order history.
        </div>

        <form
          className="form"
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            setBusy(true);
            try {
              await registerAccount({ name, email, password });
              navigate("/shop");
            } catch (err) {
              const msg = err instanceof Error ? err.message : "Registration failed.";
              setError(msg);
            } finally {
              setBusy(false);
            }
          }}
        >
          <label className="field">
            <span className="field__label">Full name</span>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Sudheer Medidaraju"
              autoComplete="name"
              required
              disabled={busy}
            />
          </label>

          <label className="field">
            <span className="field__label">Email</span>
            <input
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              type="email"
              autoComplete="email"
              required
              disabled={busy}
            />
          </label>

          <label className="field">
            <span className="field__label">Password</span>
            <input
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 chars (dummy)"
              type="password"
              autoComplete="new-password"
              required
              disabled={busy}
            />
          </label>

          {error ? <div className="alert alert--error">{error}</div> : null}

          <button className="btn btn--primary btn--full" type="submit" disabled={busy}>
            {busy ? "Creating..." : "Create account"}
          </button>
          <button
            className="btn btn--secondary btn--full"
            type="button"
            onClick={() => navigate("/shop")}
            disabled={busy}
          >
            Continue without account
          </button>
        </form>
      </div>
    </div>
  );
}

