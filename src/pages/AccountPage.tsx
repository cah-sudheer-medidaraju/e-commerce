import { useState } from "react";
import { useDemo } from "../contexts/DemoProvider";

export function AccountPage() {
  const { user, signOut } = useDemo();
  const [copied, setCopied] = useState(false);

  if (!user) {
    return (
      <div className="page">
        <div className="pageHeader">
          <div className="pageHeader__title">Account</div>
          <div className="pageHeader__subtitle">Create an account to unlock checkout and orders.</div>
        </div>
        <div className="emptyCard emptyCard--center">
          <div className="emptyCard__title">Not signed in</div>
          <div className="emptyCard__text">This demo stores a user in your browser only.</div>
          <a className="btn btn--primary" href="/register">
            Create account
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="pageHeader">
        <div className="pageHeader__title">Account details</div>
        <div className="pageHeader__subtitle">Local demo data (static products + mocked API).</div>
      </div>

      <div className="profileCard">
        <div className="profileCard__row">
          <div className="profileAvatar" aria-hidden="true">
            {user.name.slice(0, 1).toUpperCase()}
          </div>
          <div>
            <div className="profileCard__name">{user.name}</div>
            <div className="mutedText">{user.email}</div>
          </div>
        </div>

        <div className="profileCard__grid">
          <div className="profileField">
            <div className="field__label">Member since</div>
            <div>{new Date(user.createdAt).toLocaleDateString()}</div>
          </div>
          <div className="profileField">
            <div className="field__label">Demo actions</div>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => {
                void navigator.clipboard
                  .writeText(user.email)
                  .then(() => setCopied(true))
                  .finally(() => window.setTimeout(() => setCopied(false), 900));
              }}
            >
              {copied ? "Copied!" : "Copy email"}
            </button>
          </div>
        </div>

        <button
          type="button"
          className="btn btn--danger btn--full"
          onClick={() => {
            signOut();
          }}
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

