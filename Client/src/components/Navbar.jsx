import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { LogOut, LayoutDashboard, Car, CalendarCheck, ClipboardList, Tag } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isAdmin = user?.role === "admin";

  const userLinks = [
    { to: "/offers", label: "Offers", icon: Tag },
    { to: "/book", label: "Book Now", icon: Car },
    { to: "/my-bookings", label: "My Bookings", icon: CalendarCheck },
  ];

  const adminLinks = [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/offers", label: "Offers", icon: Tag },
    { to: "/admin/bookings", label: "Bookings", icon: ClipboardList },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-blue-100 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Car size={16} className="text-white" />
          </div>
          <span className="font-display text-xl font-bold text-blue-700 tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
            WashCo
          </span>
          {isAdmin && (
            <span className="ml-1 text-xs font-mono bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
              Admin
            </span>
          )}
        </Link>

        <div className="flex items-center gap-1">
          {links.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                <Icon size={15} />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-sm text-gray-500 font-medium">
            {user?.name}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={15} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
