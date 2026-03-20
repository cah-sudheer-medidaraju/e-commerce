import { Navigate, Route, Routes } from "react-router-dom";
import { SiteLayout } from "./components/SiteLayout";
import { ToastHost } from "./components/ToastHost";
import { RegisterPage } from "./pages/RegisterPage";
import { ShopPage } from "./pages/ShopPage";
import { CartPage } from "./pages/CartPage";
import { OrdersPage } from "./pages/OrdersPage";
import { AccountPage } from "./pages/AccountPage";

export default function App() {
  return (
    <>
      <ToastHost />
      <Routes>
        <Route path="/" element={<SiteLayout />}>
          <Route index element={<Navigate to="/shop" replace />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="register" element={<RegisterPage />} />

          <Route path="*" element={<Navigate to="/shop" replace />} />
        </Route>
      </Routes>
    </>
  );
}
