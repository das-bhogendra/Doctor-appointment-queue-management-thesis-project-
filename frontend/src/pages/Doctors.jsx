import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import DoctorCard from "../components/DoctorCard";

const Doctors = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { doctors } = useContext(AppContext);

  const [filterDoc, setFilterDoc] = useState([]);

  const specialityList = [
    { name: "General physician", slug: "general-physician" },
    { name: "Gynecologist", slug: "gynecologist" },
    { name: "Pediatricians", slug: "pediatricians" },
    { name: "Neurologist", slug: "neurologist" },
    { name: "Cardiologist", slug: "cardiologist" },
  ];

  // ✅ NORMALIZER (IMPORTANT FIX)
  const normalize = (text) =>
    text?.toLowerCase().trim().replace(/\s+/g, "-");

  useEffect(() => {
    if (!doctors || doctors.length === 0) return;

    if (slug) {
      const filtered = doctors.filter(
        (doc) => normalize(doc.speciality) === slug
      );
      setFilterDoc(filtered);
    } else {
      setFilterDoc(doctors);
    }
  }, [doctors, slug]);

  return (
    <div>
      <h2 className="text-lg font-semibold">Doctors</h2>

      {/* FILTER BUTTONS */}
      <div className="flex gap-2 flex-wrap my-3">
        {specialityList.map((item) => (
          <button
            key={item.slug}
            onClick={() => navigate(`/doctors/${item.slug}`)}
            className={`border px-3 py-1 rounded ${
              slug === item.slug ? "bg-blue-500 text-white" : ""
            }`}
          >
            {item.name}
          </button>
        ))}

        {/* RESET BUTTON */}
        <button
          onClick={() => navigate("/doctors")}
          className="border px-3 py-1 rounded bg-gray-200"
        >
          All
        </button>
      </div>

      {/* DOCTOR LIST */}
      <div className="grid grid-cols-2 gap-4">
        {filterDoc.length > 0 ? (
          filterDoc.map((doctor) => (
            <DoctorCard key={doctor._id} doctor={doctor} />
          ))
        ) : (
          <p className="text-gray-500">No doctors found</p>
        )}
      </div>
    </div>
  );
};

export default Doctors;