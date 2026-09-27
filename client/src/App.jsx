import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

// ==========================================
// Auth
// ==========================================

import AuthLayout from "./components/auth/layout.jsx";
import AuthLogin from "./pages/auth/login.jsx";
import AuthRegister from "./pages/auth/register.jsx";

// ==========================================
// Admin
// ==========================================

import AdminLayout from "./components/admin-view/layout.jsx";
import AdminDashboard from "./pages/admin-view/dashboard.jsx";
import AdminProducts from "./pages/admin-view/products.jsx";
import AdminOrders from "./pages/admin-view/orders.jsx";
import AdminFeatures from "./pages/admin-view/features.jsx";

// ==========================================
// Shopping
// ==========================================

import ShoppingLayout from "./components/shopping-view/layout.jsx";
import ShoppingHome from "./pages/shopping-view/home.jsx";
import ShoppingListing from "./pages/shopping-view/listing.jsx";
import ShoppingCheckout from "./pages/shopping-view/checkout.jsx";
import ShoppingAccount from "./pages/shopping-view/account.jsx";
import SearchPage from "./pages/shopping-view/search.jsx";

// ==========================================
// Common
// ==========================================

import CheckAuth from "./components/common/check-auth.jsx";
import UnauthPage from "./pages/unauth-page/index.jsx";

// ==========================================
// PayPal
// ==========================================

import PayPalReturn from "./pages/shopping-view/paypal-return.jsx";
import PayPalCancel from "./pages/shopping-view/paypal-cancel.jsx";
import PaymentSuccess from "./pages/shopping-view/payment-success.jsx";

// ==========================================
// Auth Store
// ==========================================

import { checkAuth } from "./store/auth-slice";

// ==========================================
// UI
// ==========================================

import { Skeleton } from "@/components/ui/skeleton";

// ==========================================
// App
// ==========================================

function App() {
  const {
    user,
    isAuthenticated,
    isLoading,
  } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  // ==========================================
  // Check Authentication
  // ==========================================

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // ==========================================
  // Loading State
  // ==========================================

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center overflow-x-hidden bg-white px-4">
        <Skeleton className="h-[300px] w-full max-w-[800px] bg-black" />
      </div>
    );
  }

  // ==========================================
  // Application Routes
  // ==========================================

  return (
    <div className="flex min-h-screen w-full min-w-0 flex-col overflow-x-hidden bg-white">
      <main className="w-full min-w-0 max-w-full">
        <Routes>

          {/* ==========================================
                        ROOT ROUTE
          ========================================== */}

          <Route
            path="/"
            element={
              <CheckAuth
                isAuthenticated={isAuthenticated}
                user={user}
                isLoading={isLoading}
              />
            }
          />

          {/* ==========================================
                        AUTH ROUTES
          ========================================== */}

          <Route
            element={
              <CheckAuth
                isAuthenticated={isAuthenticated}
                user={user}
                isLoading={isLoading}
              />
            }
          >
            <Route
              path="/auth"
              element={<AuthLayout />}
            >
              <Route
                path="login"
                element={<AuthLogin />}
              />

              <Route
                path="register"
                element={<AuthRegister />}
              />
            </Route>
          </Route>

          {/* ==========================================
                        ADMIN ROUTES
          ========================================== */}

          <Route
            element={
              <CheckAuth
                isAuthenticated={isAuthenticated}
                user={user}
                isLoading={isLoading}
              />
            }
          >
            <Route
              path="/admin"
              element={<AdminLayout />}
            >
              <Route
                path="dashboard"
                element={<AdminDashboard />}
              />

              <Route
                path="products"
                element={<AdminProducts />}
              />

              <Route
                path="orders"
                element={<AdminOrders />}
              />

              <Route
                path="features"
                element={<AdminFeatures />}
              />
            </Route>
          </Route>

          {/* ==========================================
                        SHOPPING ROUTES
          ========================================== */}

          <Route
            element={
              <CheckAuth
                isAuthenticated={isAuthenticated}
                user={user}
                isLoading={isLoading}
              />
            }
          >
            <Route
              path="/shop"
              element={<ShoppingLayout />}
            >
              <Route
                path="home"
                element={<ShoppingHome />}
              />

              <Route
                path="listing"
                element={<ShoppingListing />}
              />

              <Route
                path="search"
                element={<SearchPage />}
              />

              <Route
                path="checkout"
                element={<ShoppingCheckout />}
              />

              <Route
                path="account"
                element={<ShoppingAccount />}
              />
            </Route>
          </Route>

          {/* ==========================================
                        PAYPAL ROUTES
          ========================================== */}

          <Route
            path="/shop/paypal-return"
            element={<PayPalReturn />}
          />

          <Route
            path="/shop/paypal-cancel"
            element={<PayPalCancel />}
          />

          <Route
            path="/shop/payment-success"
            element={<PaymentSuccess />}
          />

          {/* ==========================================
                        UNAUTHORIZED
          ========================================== */}

          <Route
            path="/unauth-page"
            element={<UnauthPage />}
          />

          {/* ==========================================
                        404
          ========================================== */}

          <Route
            path="*"
            element={
              <div className="flex min-h-screen w-full items-center justify-center px-4">
                <h1 className="text-center text-2xl font-bold">
                  Page Not Found
                </h1>
              </div>
            }
          />

        </Routes>
      </main>
    </div>
  );
}

export default App;