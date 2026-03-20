import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { ShoppingBag, UserRound, LayoutGrid } from "lucide-react";
import { useDemo } from "../contexts/DemoProvider";

function NavItem({
  to,
  label,
  icon,
  badge,
}: {
  to: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => (isActive ? "navLink navLink--active" : "navLink")}
    >
      <span className="navIcon">{icon}</span>
      <span className="navLabel">{label}</span>
      {typeof badge === "number" && badge > 0 ? <span className="navBadge">{badge}</span> : null}
    </NavLink>
  );
}

export function SiteLayout() {
  const { cartCount, user, signOut } = useDemo();
  const navigate = useNavigate();

  return (
    <div className="appShell">
      <header className="topBar">
        <div className="topBar__left" role="banner">
          <div className="brand" onClick={() => navigate("/shop")} role="button" tabIndex={0}>
            <div className="brand__mark" aria-hidden="true">
              🛍️
            </div>
            <div className="brand__text">
              <div className="brand__name">ShopSphere</div>
              <div className="brand__tag">Clothes • Shoes • Electronics</div>
            </div>
          </div>
        </div>

        <div className="topBar__right">
          <nav className="topNav" aria-label="Primary navigation">
            <NavItem to="/shop" label="Shop" icon={<LayoutGrid size={18} />} />
            <NavItem
              to="/cart"
              label="Cart"
              icon={<ShoppingBag size={18} />}
              badge={cartCount}
            />
            <NavItem to="/orders" label="Orders" icon={<span aria-hidden="true">📦</span>} />
            <NavItem to="/account" label="Account" icon={<UserRound size={18} />} />
          </nav>

          <div className="authChip">
            {user ? (
              <div className="authChip__inner">
                <span className="authChip__name">{user.name}</span>
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => {
                    signOut();
                    navigate("/shop");
                  }}
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => navigate("/register")}
              >
                Create account
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="main">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="footer__inner">
          Dummy e-commerce demo with static products + mocked API calls.
        </div>
      </footer>
    </div>
  );
}

