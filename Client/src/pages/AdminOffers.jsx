import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api/axios";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, Tag, X, Loader2, Check, ToggleLeft, ToggleRight } from "lucide-react";

const emptyForm = { title: "", description: "", price: "", vehicleType: "car", duration: "", isActive: true };

function OfferModal({ offer, onClose, onSave }) {
  const [form, setForm] = useState(offer || emptyForm);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (offer?._id) {
        await API.put(`/offers/${offer._id}`, form);
        toast.success("Offer updated!");
      } else {
        await API.post("/offers", form);
        toast.success("Offer created!");
      }
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving offer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="font-bold text-lg text-gray-900" style={{ fontFamily: "Syne, sans-serif" }}>
            {offer?._id ? "Edit Offer" : "New Offer"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title *</label>
            <input type="text" required value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-gray-200 rounded-xl py-2.5 px-4 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Premium Car Wash" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description *</label>
            <textarea required value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full border border-gray-200 rounded-xl py-2.5 px-4 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="What's included in this package?" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Price (Rs.) *</label>
              <input type="number" required min={0} value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full border border-gray-200 rounded-xl py-2.5 px-4 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Duration</label>
              <input type="text" value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className="w-full border border-gray-200 rounded-xl py-2.5 px-4 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 45 min" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Vehicle Type *</label>
              <select value={form.vehicleType}
                onChange={(e) => setForm({ ...form, vehicleType: e.target.value })}
                className="w-full border border-gray-200 rounded-xl py-2.5 px-4 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="car">Four wheeler</option>
                <option value="bike">Two wheeler</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
              <button type="button"
                onClick={() => setForm({ ...form, isActive: !form.isActive })}
                className={`flex items-center gap-2 w-full border rounded-xl py-2.5 px-4 text-sm font-medium transition-all ${
                  form.isActive ? "border-green-200 bg-green-50 text-green-700" : "border-gray-200 bg-gray-50 text-gray-500"
                }`}>
                {form.isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                {form.isActive ? "Active" : "Inactive"}
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 font-medium py-2.5 rounded-xl hover:bg-gray-50 transition-all text-sm">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2 text-sm">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
              {offer?._id ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function AdminOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | "new" | offer object
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOffers = async (p = 1) => {
    setLoading(true);
    try {
      const { data } = await API.get(`/offers?page=${p}&limit=9&admin=true`);
      setOffers(data.offers);
      setTotalPages(data.totalPages);
    } catch { toast.error("Failed to load offers"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOffers(page); }, [page]);

  const handleDelete = async (id) => {
  if (!window.confirm("Delete this offer?")) return;
  try {
    await API.delete(`/offers/${id}`);
    toast.success("Offer deleted");
    fetchOffers(page);
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to delete");
    console.error(err.response); // ← add this to see exact error
  }
};
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <Tag size={16} />
              <span className="text-sm font-medium uppercase tracking-widest">Manage</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "Syne, sans-serif" }}>Offers</h1>
          </div>
          <button
            onClick={() => setModal("new")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-all text-sm"
          >
            <Plus size={16} /> New Offer
          </button>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="animate-spin text-blue-500" size={32} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {offers.map((offer, i) => (
              <motion.div
                key={offer._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className={`h-1.5 ${offer.isActive ? "bg-gradient-to-r from-blue-500 to-blue-700" : "bg-gray-200"}`} />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-gray-900">{offer.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${offer.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {offer.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">{offer.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-blue-700">Rs. {offer.price}</span>
                      <span className="text-xs text-gray-400 ml-2 capitalize">· {offer.vehicleType}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setModal(offer)}
                        className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-all"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(offer._id)}
                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-all"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${page === i + 1 ? "bg-blue-600 text-white" : "bg-white text-gray-500 border border-gray-200 hover:border-blue-300"}`}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {modal && (
          <OfferModal
            offer={modal === "new" ? null : modal}
            onClose={() => setModal(null)}
            onSave={() => { setModal(null); fetchOffers(page); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
