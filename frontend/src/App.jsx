import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import Appointments from "./pages/Appointments";
import Appointment from "./pages/Appointment";
import NotFound from "./pages/NotFound";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <div className="mx-4 sm:mx-[10%]">
      <ToastContainer />
      <Navbar />
      <ScrollToTop />

      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Doctors list page */}
        <Route path="/doctors" element={<Doctors />} />

        {/* filter by speciality */}
        <Route path="/doctors/:slug" element={<Doctors />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />

        {/* static pages */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* profile */}
        <Route path="/profile" element={<Profile />} />

        {/* appointments */}
        <Route path="/my-appointments" element={<Appointments />} />

        {/* ⭐ IMPORTANT ROUTE (Doctor booking page) */}
        <Route path="/appointment/:docId" element={<Appointment />} />

        {/* fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;