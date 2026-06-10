import { assets } from "../assets/assets_frontend/assets";

const Contact = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-gray-500 uppercase">
        <p>
          Contact <span className="text-gray-700 font-medium">Us</span>
        </p>
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-10 justify-center mb-28 text-sm">
        <img className="w-full md:max-w-[360px]" src={assets.contact_image} alt="" />
        <div className="flex flex-col justify-center gap-6 items-start">
          <p className="font-semibold text-lg text-gray-600 uppercase">Our Office</p>
          <p className="text-gray-500">Thapathali-2,Kathmandu<br />Nepal</p>
          <p className="text-gray-500">Email: bhogendra@gmail.com</p>
          <p className="font-semibold text-lg text-gray-600 uppercase">Careers at Prescripto</p>
          <p className="text-gray-500">Learn more about our teams and job openings.</p>
          <button className="border border-primary text-primary px-8 py-4 text-sm hover:bg-primary hover:text-white transition-all duration-500">Explore Jobs</button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
