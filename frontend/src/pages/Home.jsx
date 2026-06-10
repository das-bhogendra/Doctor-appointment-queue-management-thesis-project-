import { useNavigate } from "react-router-dom";

import Hero from "../components/Hero";
import SpecialityMenu from "../components/SpecialityMenu";
import TopDoctors from "../components/TopDoctors";
import Banner from "../components/Banner";

const Home = () => {
  const navigate = useNavigate();

  const handleBookAppointment = () => {
    console.log("Book Appointment clicked");
    navigate("/doctors");
  };

  return (
    <div>
      {/* HERO SECTION */}
      <Hero />

      {/* BOOK APPOINTMENT BUTTON */}
      <div className="flex justify-center my-6">
        <button
          onClick={handleBookAppointment}
          className="bg-primary text-white px-6 py-3 rounded-full text-sm font-medium hover:scale-105 transition-all"
        >
          Book Appointment
        </button>
      </div>

      {/* SPECIALITY */}
      <SpecialityMenu />

      {/* TOP DOCTORS */}
      <TopDoctors />

      {/* BANNER */}
      <Banner />
    </div>
  );
};

export default Home;