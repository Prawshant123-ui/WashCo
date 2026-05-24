import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import API from "../api/axios";
import { Car, Bike, ImagePlus, ChevronDown } from "lucide-react";

export default function BookNow() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({
    offer: searchParams.get("offer") || "",
    vehicleType: "car",
    vehicleModel: "",
    vehicleNumber: "",
    washType: "mild",
  });

  useEffect(() => {
    API.get("/offers?limit=100").then(({ data }) => setOffers(data.offers));
  }, []);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.offer) { toast.error("Please select an offer"); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append("image", image);
      await API.post("/bookings", fd);
      toast.success("Booking created successfully!");
      navigate("/my-bookings");
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  const selectedOffer = offers.find((o) => o._id === form.offer);

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "Syne, sans-serif" }}>
            Book a Wash
          </h1>
          <p className="text-gray-500 mt-1">Fill in your vehicle details to schedule a wash</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6"
        >
          {/* Offer select */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Select Offer *</label>
            <div className="relative">
              <select
                required
                value={form.offer}
                onChange={(e) => setForm({ ...form, offer: e.target.value })}
                className="w-full appearance-none border border-gray-200 rounded-xl py-3 px-4 pr-9 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Choose a package --</option>
                {offers.map((o) => (
                  <option key={o._id} value={o._id}>{o.title} — Rs. {o.price}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {selectedOffer && (
              <div className="mt-2 p-3 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-700">
                {selectedOffer.description}
              </div>
            )}
          </div>

          {/* Vehicle type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Vehicle Type *</label>
            <div className="flex gap-3">
              {["car", "bike"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm({ ...form, vehicleType: t })}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-medium text-sm transition-all ${
                    form.vehicleType === t
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-500 hover:border-blue-200"
                  }`}
                >
                  {t === "car" ? <Car size={16} /> : <Bike size={16} />}
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle model & number */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Vehicle Model *</label>
              <input
                type="text"
                required
                value={form.vehicleModel}
                onChange={(e) => setForm({ ...form, vehicleModel: e.target.value })}
                className="w-full border border-gray-200 rounded-xl py-3 px-4 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Honda City"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Vehicle Number *</label>
              <input
                type="text"
                required
                value={form.vehicleNumber}
                onChange={(e) => setForm({ ...form, vehicleNumber: e.target.value })}
                className="w-full border border-gray-200 rounded-xl py-3 px-4 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. BA 12 PA 1234"
              />
            </div>
          </div>

          {/* Wash type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Wash Type *</label>
            <div className="flex gap-3">
              {[
                { val: "mild", label: "Mild Wash", desc: "Basic exterior clean" },
                { val: "deep", label: "Deep Wash", desc: "Full interior + exterior" },
              ].map((w) => (
                <button
                  key={w.val}
                  type="button"
                  onClick={() => setForm({ ...form, washType: w.val })}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 text-left transition-all ${
                    form.washType === w.val
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-blue-200"
                  }`}
                >
                  <div className={`text-sm font-semibold ${form.washType === w.val ? "text-blue-700" : "text-gray-700"}`}>{w.label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{w.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Vehicle Photo (optional)</label>
            <label className="block cursor-pointer">
              <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
              {preview ? (
                <div className="relative rounded-xl overflow-hidden border border-blue-200 h-40">
                  <img src={preview} alt="preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-white text-sm font-medium">Change photo</span>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-200 rounded-xl h-40 flex flex-col items-center justify-center gap-2 hover:border-blue-300 hover:bg-blue-50/50 transition-all">
                  <ImagePlus size={24} className="text-gray-300" />
                  <span className="text-sm text-gray-400">Click to upload a photo</span>
                </div>
              )}
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : "Confirm Booking"}
          </button>
        </motion.form>
      </div>
    </div>
  );
}
