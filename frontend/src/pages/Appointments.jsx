import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import api from "../service/api";
import { toast } from "react-toastify";
import ConfirmModal from "../components/ConfirmModal";

const Appointments = () => {
  const { token, getDoctorsData, currencySymbol } = useContext(AppContext);

  const [appointments, setAppointments] = useState([]);
  const [modalContext, setModalContext] = useState(null);
  const [loading, setLoading] = useState(false);

  // Format date safely
  const formatDateString = (dateStr = "") => {
    const parts = dateStr.split("_");
    if (parts.length !== 3) return dateStr;

    const [day, month, year] = parts;
    const date = new Date(`${year}-${month}-${day}`);

    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // GET APPOINTMENTS
  const getUserAppointments = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/api/user/appointments");

      if (data.success) {
        setAppointments(data.appointments?.reverse() || []);
      } else {
        toast.error(data.message || "Failed to fetch appointments");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  // CANCEL
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await api.post("/api/user/cancel-appointment", {
        appointmentId,
      });

      if (data.success) {
        toast.success("Appointment cancelled");
        await getUserAppointments();
        getDoctorsData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Cancel failed");
    }
  };

  // PAYMENT
  const makePayment = async (appointmentId) => {
    try {
      const { data } = await api.post("/api/user/make-payment", {
        appointmentId,
      });

      if (data.success) {
        toast.success("Payment successful");
        await getUserAppointments();
        setModalContext(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment failed");
    }
  };

  const handlePayClick = (appointmentId) => {
    setModalContext({ type: "payment", appointmentId });
  };

  const handleCancelClick = (appointmentId) => {
    setModalContext({ type: "cancel", appointmentId });
  };

  const selectedAppointment =
    modalContext &&
    appointments.find((a) => a._id === modalContext.appointmentId);

  useEffect(() => {
    if (token) getUserAppointments();
  }, [token]);

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
        My Appointments
      </p>

      {loading && <p className="mt-4 text-gray-500">Loading...</p>}

      <div>
        {appointments.map((doc) => (
          <div
            key={doc._id}
            className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-3 border-b"
          >
            {/* Doctor Image */}
            <img
              className="w-32 bg-indigo-50 rounded"
              src={doc?.docId?.image || doc?.docData?.image || ""}
              alt="doctor"
            />


            {/* Details */}
            <div className="md:flex-1 text-sm text-zinc-600">
              <p className="text-neutral-800 font-semibold">
                {doc?.docId?.name || doc?.docData?.name}
              </p>


              <p>{doc?.docId?.speciality || doc?.docData?.speciality}</p>


              <p className="text-zinc-700 font-medium mt-1">Address:</p>
              <p className="text-xs">{doc?.docId?.address?.line1 || doc?.docData?.address?.line1}</p>

              <p className="text-xs">{doc?.docId?.address?.line2 || doc?.docData?.address?.line2}</p>


              <p className="text-xs mt-1">
                <span className="text-sm text-neutral-700 font-medium">
                  Date & Time:
                </span>{" "}
                {formatDateString(doc.slotDate)} | {doc.slotTime}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 justify-end">
              {!doc.payment && !doc.cancelled && !doc.isCompleted && (
                <button
                  onClick={() => handlePayClick(doc._id)}
                  className="text-sm py-2 border rounded hover:bg-primary hover:text-white"
                >
                  Pay Online
                </button>
              )}

              {doc.payment && !doc.cancelled && !doc.isCompleted && (
                <button className="text-sm text-white bg-green-500 py-2 rounded">
                  Payment Completed
                </button>
              )}

              {!doc.cancelled && !doc.isCompleted && (
                <button
                  onClick={() => handleCancelClick(doc._id)}
                  className="text-sm py-2 border rounded hover:bg-red-600 hover:text-white"
                >
                  Cancel
                </button>
              )}

              {doc.cancelled && (
                <button className="text-sm text-red-500 border rounded py-2">
                  Cancelled
                </button>
              )}

              {doc.isCompleted && (
                <button className="text-sm text-green-500 border rounded py-2">
                  Completed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {modalContext && selectedAppointment && (
        <ConfirmModal
          title={
            modalContext.type === "payment"
              ? "Confirm Payment"
              : "Cancel Appointment"
          }
          message={
            modalContext.type === "payment"
              ? `Pay ${currencySymbol}${selectedAppointment.docData.fees}?`
              : "Cancel this appointment?"
          }
          confirmText={modalContext.type === "payment" ? "Pay" : "Cancel"}
          cancelText="No"
          onConfirm={() => {
            modalContext.type === "payment"
              ? makePayment(modalContext.appointmentId)
              : cancelAppointment(modalContext.appointmentId);
            setModalContext(null);
          }}
          onCancel={() => setModalContext(null)}
        />
      )}
    </div>
  );
};

export default Appointments;