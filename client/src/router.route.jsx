import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";
import { MainLayout } from "./layout/main.layout";

import {
  LandingPage,
  SigninPage,
  SignupPage,
  Dashboard,
  NotFoundPage,
  CategoriesPage,
  CouponsPage,
  ReviewsPage,
  ProductsPage,
  CartPage,
  CheckoutPage,
  OrdersPage,
  PaymentSuccessPage,
  PaymentCancelPage,
  WishlistPage,
  AddressesPage,
  ReturnsPage,
  ProfilePage,
} from "./pages";

import { AdminSignIn } from "./components/modules/admin/auth";
import { SuperAdminSignIn } from "./components/modules/super-admin/auth";
import { AdminDashboard, AdminPermissions, AdminRoles, AdminUsers, AdminCoupons, AdminReturns, AdminOrders, AdminReviews } from "./components/modules/admin/pages";
import { SuperAdminDashboard, SuperAdminPermissions, SuperAdminRoles, SuperAdminUsers, SuperAdminSettings, SuperAdminAudit, SuperAdminProducts, SuperAdminCategories, SuperAdminOrders, SuperAdminCoupons, SuperAdminReturns, SuperAdminReviews } from "./components/modules/super-admin/pages";
import { AdminMainLayout } from "./components/modules/admin/layout";
import { SuperAdminMainLayout } from "./components/modules/super-admin/layout";

export const RouterRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<SigninPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Admin Auth Routes */}
      <Route path="/admin/signin" element={<AdminSignIn />} />

      {/* Super Admin Auth Routes */}
      <Route path="/super-admin/signin" element={<SuperAdminSignIn />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/coupons" element={<CouponsPage />} />
          <Route path="/dashboard/reviews" element={<ReviewsPage />} />
          <Route path="/dashboard/cart" element={<CartPage />} />
          <Route path="/dashboard/checkout" element={<CheckoutPage />} />
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
          <Route path="/payment/cancel" element={<PaymentCancelPage />} />
          <Route path="/dashboard/orders" element={<OrdersPage />} />
          <Route path="/dashboard/wishlist" element={<WishlistPage />} />
          <Route path="/dashboard/addresses" element={<AddressesPage />} />
          <Route path="/dashboard/returns" element={<ReturnsPage />} />
          <Route path="/dashboard/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Admin Protected Routes */}
      <Route element={<RoleProtectedRoute allowedRoles={["admin", "super_admin"]} />}>
        <Route element={<AdminMainLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<ProductsPage />} />
          <Route path="/admin/categories" element={<CategoriesPage />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/coupons" element={<AdminCoupons />} />
          <Route path="/admin/returns" element={<AdminReturns />} />
          <Route path="/admin/permissions" element={<AdminPermissions />} />
          <Route path="/admin/roles" element={<AdminRoles />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
        </Route>
      </Route>

      {/* Super Admin Protected Routes */}
      <Route element={<RoleProtectedRoute allowedRoles={["super_admin"]} />}>
        <Route element={<SuperAdminMainLayout />}>
          <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
          <Route path="/super-admin/products" element={<SuperAdminProducts />} />
          <Route path="/super-admin/categories" element={<SuperAdminCategories />} />
          <Route path="/super-admin/orders" element={<SuperAdminOrders />} />
          <Route path="/super-admin/coupons" element={<SuperAdminCoupons />} />
          <Route path="/super-admin/returns" element={<SuperAdminReturns />} />
          <Route path="/super-admin/users" element={<SuperAdminUsers />} />
          <Route path="/super-admin/reviews" element={<SuperAdminReviews />} />
          <Route path="/super-admin/permissions" element={<SuperAdminPermissions />} />
          <Route path="/super-admin/roles" element={<SuperAdminRoles />} />
          <Route path="/super-admin/settings" element={<SuperAdminSettings />} />
          <Route path="/super-admin/audit" element={<SuperAdminAudit />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default RouterRoutes;