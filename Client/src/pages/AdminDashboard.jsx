import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import API from "../api/axios";
import { LayoutDashboard, ClipboardList, Tag, TrendingUp, Clock, CheckCircle2, CheckCheck } from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get("/bookings/admin?limit=100"),
      API.get("/offers?limit=100"),
    ]).then(([b, o]) => {
      setBookings(b.data.bookings || []);
      setOffers(o.data.offers || []);
    }).finally(() => setLoading(false));
  }, []);

  const statusCount = {
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    completed: bookings.filter((b) => b.status === "completed").length,
  };

  const washCount = {
    deep: bookings.filter((b) => b.washType === "deep").length,
    mild: bookings.filter((b) => b.washType === "mild").length,
  };

  const vehicleCount = {
    car: bookings.filter((b) => b.vehicleType === "car").length,
    bike: bookings.filter((b) => b.vehicleType === "bike").length,
  };

  const doughnutData = {
    labels: ["Pending", "Confirmed", "Completed"],
    datasets: [{
      data: [statusCount.pending, statusCount.confirmed, statusCount.completed],
      backgroundColor: ["#fbbf24", "#3b82f6", "#22c55e"],
      borderColor: ["#f59e0b", "#2563eb", "#16a34a"],
      borderWidth: 2,
      hoverOffset: 6,
    }],
  };

  const barData = {
    labels: ["Deep Wash", "Mild Wash"],
    datasets: [{
      label: "Bookings",
      data: [washCount.deep, washCount.mild],
      backgroundColor: ["#3b82f6", "#93c5fd"],
      borderRadius: 8,
      borderSkipped: false,
    }],
  };

  const vehicleBarData = {
    labels: ["Car", "Bike"],
    datasets: [{
      label: "Bookings",
      data: [vehicleCount.car, vehicleCount.bike],
      backgroundColor: ["#1d4ed8", "#60a5fa"],
      borderRadius: 8,
      borderSkipped: false,
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false }, tooltip: { mode: "index" } },
    scales: {
      y: { beginAtZero: true, grid: { color: "#f1f5f9" }, ticks: { stepSize: 1 } },
      x: { grid: { display: false } },
    },
  };

  const stats = [
    { label: "Total Bookings", value: bookings.length, icon: ClipboardList, color: "bg-blue-100 text-blue-600" },
    { label: "Active Offers", value: offers.length, icon: Tag, color: "bg-indigo-100 text-indigo-600" },
    { label: "Pending", value: statusCount.pending, icon: Clock, color: "bg-amber-100 text-amber-600" },
    { label: "Completed", value: statusCount.completed, icon: CheckCheck, color: "bg-green-100 text-green-600" },
  ];

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <LayoutDashboard size={16} />
            <span className="text-sm font-medium uppercase tracking-widest">Admin Panel</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "Syne, sans-serif" }}>Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of all bookings and offers</p>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                  <Icon size={18} />
                </div>
                <div className="text-3xl font-bold text-gray-900">{s.value}</div>
                <div className="text-sm text-gray-500 mt-1">{s.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Doughnut */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
          >
            <h3 className="font-bold text-gray-800 mb-1 flex items-center gap-2">
              <TrendingUp size={16} className="text-blue-500" />
              Booking Status
            </h3>
            <p className="text-xs text-gray-400 mb-5">Distribution of all bookings</p>
            <div className="flex justify-center">
              <div className="w-52 h-52">
                <Doughnut data={doughnutData} options={{ responsive: true, cutout: "65%", plugins: { legend: { position: "bottom", labels: { boxWidth: 12, padding: 12 } } } }} />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              {[
                { label: "Pending", val: statusCount.pending, color: "bg-amber-400" },
                { label: "Confirmed", val: statusCount.confirmed, color: "bg-blue-500" },
                { label: "Completed", val: statusCount.completed, color: "bg-green-500" },
              ].map((s) => (
                <div key={s.label} className="p-2 rounded-lg bg-gray-50">
                  <div className={`w-2 h-2 rounded-full ${s.color} mx-auto mb-1`} />
                  <div className="text-lg font-bold text-gray-800">{s.val}</div>
                  <div className="text-xs text-gray-400">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Wash type bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
          >
            <h3 className="font-bold text-gray-800 mb-1">Wash Type Breakdown</h3>
            <p className="text-xs text-gray-400 mb-5">Deep vs mild wash bookings</p>
            <Bar data={barData} options={chartOptions} />
          </motion.div>

          {/* Vehicle type bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
          >
            <h3 className="font-bold text-gray-800 mb-1">Vehicle Type</h3>
            <p className="text-xs text-gray-400 mb-5">Car vs bike distribution</p>
            <Bar data={vehicleBarData} options={chartOptions} />
          </motion.div>
        </div>

        {/* Recent bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mt-6"
        >
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <ClipboardList size={16} className="text-blue-500" />
            Recent Bookings
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Customer", "Offer", "Vehicle", "Wash", "Status", "Date"].map((h) => (
                    <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 8).map((b) => {
                  const sc = { pending: "bg-amber-100 text-amber-700", confirmed: "bg-blue-100 text-blue-700", completed: "bg-green-100 text-green-700" };
                  return (
                    <tr key={b._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-3 font-medium text-gray-800">{b.user?.name || "—"}</td>
                      <td className="py-3 px-3 text-gray-500">{b.offer?.title || "—"}</td>
                      <td className="py-3 px-3 text-gray-500">{b.vehicleModel}</td>
                      <td className="py-3 px-3 capitalize text-gray-500">{b.washType}</td>
                      <td className="py-3 px-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${sc[b.status]}`}>{b.status}</span>
                      </td>
                      <td className="py-3 px-3 text-gray-400">{new Date(b.createdAt).toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {bookings.length === 0 && (
              <p className="text-center py-8 text-gray-400">No bookings yet.</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
