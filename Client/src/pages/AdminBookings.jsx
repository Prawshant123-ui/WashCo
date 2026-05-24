import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../api/axios";
import toast from "react-hot-toast";
import {
  ClipboardList, Loader2, ChevronDown, Search, Trash2, SlidersHorizontal
} from "lucide-react";

const STATUS_OPTIONS = ["pending", "confirmed", "completed"];
const statusColors = {
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  confirmed: "bg-blue-100 text-blue-700 border-blue-200",
  completed: "bg-green-100 text-green-700 border-green-200",
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterVehicle, setFilterVehicle] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showCompleted, setShowCompleted] = useState(false);

  const fetchBookings = async (p = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: p, limit: 10 });
      if (filterStatus) params.append("status", filterStatus);
      if (filterVehicle) params.append("vehicleType", filterVehicle);
      const { data } = await API.get(`/bookings/admin?${params}`);
      setBookings(data.bookings);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch { toast.error("Failed to load bookings"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBookings(page); }, [page, filterStatus, filterVehicle]);

  const handleStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await API.put(`/bookings/${id}/status`, { status });
      toast.success(`Status updated to ${status}`);
      fetchBookings(page);
    } catch { toast.error("Failed to update status"); }
    finally { setUpdatingId(null); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this booking permanently?")) return;
    setDeletingId(id);
    try {
      await API.delete(`/bookings/${id}`);
      toast.success("Booking deleted");
      fetchBookings(page);
    } catch { toast.error("Failed to delete"); }
    finally { setDeletingId(null); }
  };

  const handleBulkDeleteCompleted = async () => {
    if (!window.confirm("Delete all completed bookings? This cannot be undone.")) return;
    const completed = bookings.filter((b) => b.status === "completed");
    try {
      await Promise.all(completed.map((b) => API.delete(`/bookings/${b._id}`)));
      toast.success(`Deleted ${completed.length} completed booking(s)`);
      fetchBookings(page);
    } catch { toast.error("Failed to bulk delete"); }
  };

  const completedCount = bookings.filter((b) => b.status === "completed").length;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <ClipboardList size={16} />
            <span className="text-sm font-medium uppercase tracking-widest">Manage</span>
          </div>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "Syne, sans-serif" }}>Bookings</h1>
              <p className="text-gray-500 mt-1">{total} total booking{total !== 1 ? "s" : ""}</p>
            </div>
            {completedCount > 0 && (
              <button
                onClick={handleBulkDeleteCompleted}
                className="flex items-center gap-2 border border-red-200 text-red-500 hover:bg-red-50 font-medium px-4 py-2.5 rounded-xl transition-all text-sm"
              >
                <Trash2 size={15} />
                Delete {completedCount} completed
              </button>
            )}
          </div>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
            <SlidersHorizontal size={14} className="text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
              className="text-sm text-gray-600 bg-transparent focus:outline-none"
            >
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
            <select
              value={filterVehicle}
              onChange={(e) => { setFilterVehicle(e.target.value); setPage(1); }}
              className="text-sm text-gray-600 bg-transparent focus:outline-none"
            >
              <option value="">All Vehicles</option>
              <option value="car">Car</option>
              <option value="bike">Bike</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="animate-spin text-blue-500" size={32} />
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {["Customer", "Offer", "Vehicle", "Number", "Wash", "Status", "Date", "Actions"].map((h) => (
                        <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-16 text-gray-400">
                          <ClipboardList size={32} className="mx-auto mb-2 opacity-30" />
                          No bookings found
                        </td>
                      </tr>
                    ) : (
                      bookings.map((b, i) => (
                        <motion.tr
                          key={b._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.04 }}
                          className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <div className="font-medium text-gray-800">{b.user?.name || "—"}</div>
                            <div className="text-xs text-gray-400">{b.user?.email}</div>
                          </td>
                          <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{b.offer?.title || "—"}</td>
                          <td className="py-3 px-4 text-gray-600 capitalize whitespace-nowrap">{b.vehicleType} · {b.vehicleModel}</td>
                          <td className="py-3 px-4">
                            <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{b.vehicleNumber}</span>
                          </td>
                          <td className="py-3 px-4 capitalize text-gray-600">{b.washType}</td>
                          <td className="py-3 px-4">
                            <div className="relative">
                              <select
                                value={b.status}
                                onChange={(e) => handleStatus(b._id, e.target.value)}
                                disabled={updatingId === b._id}
                                className={`appearance-none text-xs font-semibold px-3 py-1.5 pr-7 rounded-full border cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 ${statusColors[b.status]} ${updatingId === b._id ? "opacity-50" : ""}`}
                              >
                                {STATUS_OPTIONS.map((s) => (
                                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                ))}
                              </select>
                              <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-400 whitespace-nowrap">
                            {new Date(b.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short" })}
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleDelete(b._id)}
                              disabled={deletingId === b._id}
                              className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-all disabled:opacity-40"
                            >
                              {deletingId === b._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                            </button>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i} onClick={() => setPage(i + 1)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${page === i + 1 ? "bg-blue-600 text-white" : "bg-white text-gray-500 border border-gray-200 hover:border-blue-300"}`}>
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
