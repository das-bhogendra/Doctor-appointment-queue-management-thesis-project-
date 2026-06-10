import { useContext, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";
import adminApi from "../../service/adminApi";

const AddDoctor = () => {
  const { backendUrl } = useContext(AdminContext);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    experience: "",
    fees: "",
    speciality: "",
    degree: "",
    address1: "",
    address2: "",
    about: "",
  });

  const [docImg, setDocImg] = useState(null);

  // input handler
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      experience: "",
      fees: "",
      speciality: "",
      degree: "",
      address1: "",
      address2: "",
      about: "",
    });
    setDocImg(null);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!docImg) {
      return toast.error("Please upload doctor image");
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("image", docImg);
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("experience", form.experience);
      formData.append("fees", Number(form.fees));
      formData.append("speciality", form.speciality);
      formData.append("degree", form.degree);
      formData.append("about", form.about);

      formData.append(
        "address",
        JSON.stringify({
          line1: form.address1,
          line2: form.address2,
        })
      );

      // Ensure Authorization header is present (avoid backend "No token provided")
      const { data } = await adminApi.post(
        "/api/admin/add-doctor",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("aToken") || ""}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message || "Doctor added successfully");
        resetForm();
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || "Server error. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full">
      <p className="mb-3 text-lg font-medium">Add Doctor</p>

      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">

        {/* IMAGE UPLOAD */}
        <div className="flex items-center gap-4 mb-8">
          <label htmlFor="doc-img">
            <img
              className="w-16 bg-gray-100 rounded-full cursor-pointer"
              src={
                docImg ? URL.createObjectURL(docImg) : assets.upload_area
              }
              alt=""
            />
          </label>

          <input
            onChange={(e) => setDocImg(e.target.files[0])}
            type="file"
            id="doc-img"
            hidden
          />

          <p>Upload Doctor Picture</p>
        </div>

        {/* FORM GRID */}
        <div className="flex flex-col lg:flex-row gap-10">

          {/* LEFT */}
          <div className="flex flex-col gap-3 w-full">

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Doctor Name"
              className="border p-2 rounded"
              required
            />

            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="border p-2 rounded"
              type="email"
              required
            />

            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="border p-2 rounded"
              type="password"
              required
            />

            <select
              name="experience"
              value={form.experience}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            >
              <option value="">Experience</option>
              <option value="1 year">1 year</option>
              <option value="2 years">2 years</option>
              <option value="5 years">5 years</option>
              <option value="10 years">10 years</option>
            </select>

            <input
              name="fees"
              value={form.fees}
              onChange={handleChange}
              placeholder="Fees"
              type="number"
              className="border p-2 rounded"
              required
            />
          </div>

          {/* RIGHT */}
          <div className="flex flex-col gap-3 w-full">

            <select
              name="speciality"
              value={form.speciality}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            >
              <option value="">Speciality</option>
              <option value="Cardiologist">Cardiologist</option>
              <option value="Dermatologist">Dermatologist</option>
              <option value="Neurologist">Neurologist</option>
            </select>

            <input
              name="degree"
              value={form.degree}
              onChange={handleChange}
              placeholder="Education"
              className="border p-2 rounded"
              required
            />

            <input
              name="address1"
              value={form.address1}
              onChange={handleChange}
              placeholder="Address Line 1"
              className="border p-2 rounded"
              required
            />

            <input
              name="address2"
              value={form.address2}
              onChange={handleChange}
              placeholder="Address Line 2"
              className="border p-2 rounded"
            />

          </div>
        </div>

        {/* ABOUT */}
        <textarea
          name="about"
          value={form.about}
          onChange={handleChange}
          placeholder="About doctor..."
          rows={5}
          className="w-full mt-4 border p-2 rounded"
          required
        />

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-white px-10 py-3 mt-5 rounded-full"
        >
          {loading ? "Adding..." : "Add Doctor"}
        </button>
      </div>
    </form>
  );
};

export default AddDoctor;