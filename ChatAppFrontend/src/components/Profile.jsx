import { useState } from "react";
import toast from "react-hot-toast";
import { PiCameraThin } from "react-icons/pi";// Camera icon from lucide-react
import { useNavigate } from "react-router";

const ProfileForm = () => {
  const [username, setUsername] = useState("");
  const [about, setAbout] = useState("");
  const [image, setImage] = useState(null);
const navigate = useNavigate();
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!username) {
      alert("Username is required");
      return;
    }

    toast.success("Profile saved");
    navigate('/chat');
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-10 lg:p-12 w-full max-w-[90%] sm:max-w-[60%] md:max-w-[40%] lg:max-w-[30%] mx-auto mt-6 border border-gray-200">
      {/* Profile Image Input */}
      <div className="relative w-28 h-28 mb-6">
        <input
          type="file"
          id="profileImage"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
        <label htmlFor="profileImage" className="cursor-pointer">
          <div
            className="w-full h-full rounded-full border-2 border-gray-300 flex items-center justify-center overflow-hidden"
            style={{
              backgroundImage: image ? `url(${image})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {!image && (
              <span className="text-gray-400 text-sm font-medium">Upload</span>
            )}
          </div>
          <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full">
            <PiCameraThin size={18} />
          </div>
        </label>
      </div>

      {/* Username Input */}
      <div className="w-full mb-4">
        <label
          className="text-base sm:text-lg font-medium text-gray-700"
          htmlFor="username"
        >
          Username <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 sm:p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* About Input */}
      <div className="w-full mb-6">
        <label
          className="text-base sm:text-lg font-medium text-gray-700"
          htmlFor="about"
        >
          About (optional)
        </label>
        <textarea
          id="about"
          name="about"
          placeholder="Tell us about yourself (optional)"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          className="w-full p-2 sm:p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          rows="3"
        ></textarea>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full py-2 sm:py-3 bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-900 text-white font-semibold text-base sm:text-lg rounded-lg shadow-md transform transition duration-300 hover:scale-105 hover:shadow-xl"
      >
        Save
      </button>
    </div>
  );
};

export default ProfileForm;
