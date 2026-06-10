import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets_frontend/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import { toast } from "react-toastify";
import api from "../service/api";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, token, getDoctorsData } =
    useContext(AppContext);

  const navigate = useNavigate();

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  // Get doctor info
  useEffect(() => {
    const doc = doctors.find((d) => d._id === docId);
    setDocInfo(doc || null);
  }, [doctors, docId]);

  // Generate slots
  useEffect(() => {
    if (!docInfo) return;

    const getSlots = () => {
      const today = new Date();
      let allSlots = [];

      for (let i = 0; i < 7; i++) {
        let date = new Date(today);
        date.setDate(today.getDate() + i);

        let start = new Date(date);
        start.setHours(10, 0, 0, 0);

        let end = new Date(date);
        end.setHours(20, 30, 0, 0);

        let temp = start;
        let slots = [];

        while (temp <= end) {
          slots.push({
            datetime: new Date(temp),
            time: temp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          });

          temp.setMinutes(temp.getMinutes() + 30);
        }

        allSlots.push(slots);
      }

      setDocSlots(allSlots);
    };

    getSlots();
  }, [docInfo]);

  // Book appointment
  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Please login first");
      return navigate("/login");
    }

    if (!docSlots.length || !docSlots[slotIndex]?.length) {
      toast.error("Please select a slot date");
      return;
    }

    if (!slotTime) {
      toast.error("Please select time");
      return;
    }

    try {
      const dateObj = docSlots[slotIndex][0].datetime;

      const slotDate = `${dateObj.getDate()}_${
        dateObj.getMonth() + 1
      }_${dateObj.getFullYear()}`;

      const { data } = await api.post("/api/user/book-appointment", {
        docId,
        slotDate,
        slotTime,
      });

      if (data.success) {
        toast.success("Appointment booked successfully");
        getDoctorsData();
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed");
    }
  };

  if (!docInfo) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4">
        <img
          className={`w-72 rounded-lg ${docInfo.available ? "" : "opacity-50"}`}
          src={docInfo.image}
          alt=""
        />

        <div className="flex-1 border p-6 rounded-lg">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            {docInfo.name}
            <img src={assets.verified_icon} className="w-5" />
          </h2>

          <p className="text-sm text-gray-600 mt-2">
            {docInfo.speciality} • {docInfo.experience}
          </p>

          <p className="mt-3 text-gray-500">{docInfo.about}</p>

          <p className="mt-4 font-medium">
            Fee: {currencySymbol}
            {docInfo.fees}
          </p>
        </div>
      </div>

      {/* Slots */}
      {docInfo.available && (
        <div className="mt-6">
          <h3 className="font-medium">Select Date & Time</h3>

          {/* Dates */}
          <div className="flex gap-2 overflow-x-auto mt-3">
            {docSlots.map((slot, index) => (
              <button
                key={index}
                onClick={() => setSlotIndex(index)}
                className={`px-4 py-2 border rounded ${
                  slotIndex === index ? "bg-primary text-white" : ""
                }`}
              >
                {slot[0] && daysOfWeek[slot[0].datetime.getDay()]}
                <br />
                {slot[0] && slot[0].datetime.getDate()}
              </button>
            ))}
          </div>

          {/* Times */}
          <div className="flex gap-2 flex-wrap mt-4">
            {docSlots[slotIndex]?.map((item, index) => (
              <button
                key={index}
                onClick={() => setSlotTime(item.time)}
                className={`px-3 py-1 border rounded ${
                  slotTime === item.time ? "bg-primary text-white" : ""
                }`}
              >
                {item.time}
              </button>
            ))}
          </div>

          <button
            onClick={bookAppointment}
            className="mt-6 bg-primary text-white px-6 py-2 rounded"
          >
            Book Appointment
          </button>
        </div>
      )}

      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
    </div>
  );
};

export default Appointment;