import { useNavigate } from "react-router-dom";

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/appointment/${doctor._id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="border rounded-lg p-3 cursor-pointer hover:shadow-md transition-all"
    >
      {/* DOCTOR IMAGE */}
      <img
        src={doctor.image}
        alt={doctor.name}
        className="w-full h-40 object-cover rounded"
      />

      {/* DOCTOR INFO */}
      <div className="mt-2">
        <p className="font-semibold text-gray-800">{doctor.name}</p>
        <p className="text-sm text-gray-500">{doctor.speciality}</p>

        <p className="text-xs text-gray-400 mt-1">
          Experience: {doctor.experience || "N/A"}
        </p>
      </div>
    </div>
  );
};

export default DoctorCard;