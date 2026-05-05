import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";
import Loader         from "../components/common/Loader";

// Lazy-loaded pages (Code Splitting)
const HomePage         = lazy(() => import("../pages/HomePage"));
const CategoriesPage   = lazy(() => import("../pages/CategoriesPage"));
const SearchPage       = lazy(() => import("../pages/SearchPage"));
const WatchPage        = lazy(() => import("../pages/WatchPage"));
const LoginPage        = lazy(() => import("../pages/LoginPage"));
const SignupPage       = lazy(() => import("../pages/SignupPage"));
const ProfileSelectPage= lazy(() => import("../pages/ProfileSelectPage"));
const UserProfilePage  = lazy(() => import("../pages/UserProfilePage"));
const MyListPage       = lazy(() => import("../pages/MyListPage"));
const ErrorPage        = lazy(() => import("../pages/ErrorPage"));

const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<Loader />}>{children}</Suspense>
);

export default function AppRoutes() {
  return (
    <SuspenseWrapper>
      <Routes>
        {/* Public */}
        <Route path="/login"  element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/browse"       element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/categories"   element={<ProtectedRoute><CategoriesPage /></ProtectedRoute>} />
        <Route path="/search"       element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
        <Route path="/watch/:type/:id" element={<ProtectedRoute><WatchPage /></ProtectedRoute>} />
        <Route path="/profiles"     element={<ProtectedRoute><ProfileSelectPage /></ProtectedRoute>} />
        <Route path="/profile"      element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
        <Route path="/my-list"      element={<ProtectedRoute><MyListPage /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </SuspenseWrapper>
  );
}