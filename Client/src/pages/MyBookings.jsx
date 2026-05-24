import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api/axios";
import toast from "react-hot-toast";
import { CalendarCheck, Car, Bike, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";

const statusConfig = {
  pending: { color: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock, label: "Pending" },
  confirmed: { color: "bg-blue-100 text-blue-700 border-blue-200", icon: CheckCircle2, label: "Confirmed" },
  completed: { color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle2, label: "Completed" },
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/bookings/my-bookings")
      .then(({ data }) => setBookings(data))
      .catch(() => toast.error("Failed to load bookings"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <CalendarCheck size={16} />
            <span className="text-sm font-medium uppercase tracking-widest">Your History</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "Syne, sans-serif" }}>My Bookings</h1>
          <p className="text-gray-500 mt-1">{bookings.length} booking{bookings.length !== 1 ? "s" : ""} found</p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="animate-spin text-blue-500" size={32} />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
            <CalendarCheck size={40} className="mx-auto mb-3 text-gray-200" />
            <p className="text-gray-400 font-medium">No bookings yet</p>
            <a href="/offers" className="inline-block mt-4 text-sm text-blue-600 font-medium hover:underline">Browse offers →</a>
          </div>
        ) : (
          <AnimatePresence>
            <div className="space-y-4">
              {bookings.map((b, i) => {
                const cfg = statusConfig[b.status] || statusConfig.pending;
                const Icon = cfg.icon;
                return (
                  <motion.div
                    key={b._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                  >
                    <div className="flex">
                      {b.image && (
                        <div className="w-24 sm:w-32 shrink-0">
                          <img src={`/${b.image}`} alt="vehicle" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 p-5">
                        <div className="flex items-start justify-between flex-wrap gap-2">
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">{b.offer?.title || "Package"}</h3>
                            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                {b.vehicleType === "bike" ? <Bike size={13} /> : <Car size={13} />}
                                {b.vehicleModel}
                              </span>
                              <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{b.vehicleNumber}</span>
                            </div>
                          </div>
                          <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${cfg.color}`}>
                            <Icon size={12} />
                            {cfg.label}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 mt-3 flex-wrap">
                          <div className="text-sm">
                            <span className="text-gray-400">Wash: </span>
                            <span className="font-medium text-gray-700 capitalize">{b.washType}</span>
                          </div>
                          {b.offer?.price && (
                            <div className="text-sm">
                              <span className="text-gray-400">Price: </span>
                              <span className="font-semibold text-blue-700">Rs. {b.offer.price}</span>
                            </div>
                          )}
                          <div className="text-xs text-gray-400">
                            {new Date(b.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
