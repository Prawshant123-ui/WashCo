import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Offers from "./pages/Offers";
import BookNow from "./pages/BookNow";
import MyBookings from "./pages/MyBookings";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOffers from "./pages/AdminOffers";
import AdminBookings from "./pages/AdminBookings";

function AppRoutes() {
  const { user } = useAuth();

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to={user.role === "admin" ? "/admin/dashboard" : "/offers"} replace />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/offers" replace />} />

        {/* User routes */}
        <Route path="/offers" element={<ProtectedRoute><Offers /></ProtectedRoute>} />
        <Route path="/book" element={<ProtectedRoute><BookNow /></ProtectedRoute>} />
        <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />

        {/* Admin routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/offers" element={<ProtectedRoute adminOnly><AdminOffers /></ProtectedRoute>} />
        <Route path="/admin/bookings" element={<ProtectedRoute adminOnly><AdminBookings /></ProtectedRoute>} />

        {/* Redirect root */}
        <Route path="/" element={
          user
            ? <Navigate to={user.role === "admin" ? "/admin/dashboard" : "/offers"} replace />
            : <Navigate to="/login" replace />
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster
        position="top-right"
        toastOptions={{
          style: { fontFamily: "DM Sans, sans-serif", fontSize: "14px", borderRadius: "12px" },
          success: { iconTheme: { primary: "#2563eb", secondary: "white" } },
        }}
      />
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
