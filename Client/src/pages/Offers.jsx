import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { Tag, Clock, Car, Bike, ChevronRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const VehicleIcon = ({ type }) => type === "bike" ? <Bike size={14} /> : <Car size={14} />;

const badge = { car: "bg-blue-100 text-blue-700", bike: "bg-indigo-100 text-indigo-700", Others: "bg-gray-100 text-gray-600" };

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOffers = async (p = 1) => {
    setLoading(true);
    try {
      const { data } = await API.get(`/offers?page=${p}&limit=9`);
      setOffers(data.offers);
      setTotalPages(data.totalPages);
    } catch {
      toast.error("Failed to load offers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOffers(page); }, [page]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Tag size={16} />
            <span className="text-sm font-medium uppercase tracking-widest">Available Packages</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900" style={{ fontFamily: "Syne, sans-serif" }}>
            Wash Offers
          </h1>
          <p className="text-gray-500 mt-2">Choose a package that suits your vehicle and budget</p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="animate-spin text-blue-500" size={32} />
          </div>
        ) : offers.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <Tag size={40} className="mx-auto mb-3 opacity-30" />
            <p>No offers available right now.</p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {offers.map((offer) => (
              <motion.div
                key={offer._id}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
              >
                <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-700" />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-bold text-lg text-gray-900 leading-tight">{offer.title}</h3>
                    <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${badge[offer.vehicleType] || badge.Others}`}>
                      <VehicleIcon type={offer.vehicleType} />
                      {offer.vehicleType}
                    </span>
                  </div>

                  <p className="text-gray-500 text-sm leading-relaxed mb-5">{offer.description}</p>

                  <div className="flex items-center gap-3 mb-5">
                    {offer.duration && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Clock size={13} />
                        <span>{offer.duration}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-blue-700">Rs. {offer.price}</span>
                    </div>
                    <Link
                      to={`/book?offer=${offer._id}`}
                      className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all group-hover:gap-2"
                    >
                      Book <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                  page === i + 1 ? "bg-blue-600 text-white" : "bg-white text-gray-500 border border-gray-200 hover:border-blue-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
