/* eslint-disable react/prop-types */
import { FaEnvelope, FaPhone, FaUserPlus } from "react-icons/fa";
import { FaA, FaPhotoFilm } from "react-icons/fa6";
import BlockUser from "./BlockUser";
import LastSeenAndOnline from "./LastSeenAndOnline"
import PhoneNumber from "./PhoneNumber";
import ProfilePhotos from "./ProfilePhoto"
import About from "./About"
const Privacy = ({ onNavigate }) => {
  const privacyOptions = [
    { name: "Block User", icon: <FaEnvelope />, component: <BlockUser /> },
    { name: "Phone Number", icon: <FaPhone /> ,component:<PhoneNumber/> },
    { name: "Last Seen & Online", icon: <FaUserPlus />, component:<LastSeenAndOnline/> },
    { name: "Profile Photos", icon: <FaPhotoFilm />, component: <ProfilePhotos/> },
    { name: "About", icon: <FaA /> ,component: <About/>},
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {/* Block User option rendered first */}
        <div
          className={`flex items-center gap-4 p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100`}
          onClick={() => onNavigate("Block User", <BlockUser />)}
        >
          <div className="text-gray-600">{<FaEnvelope />}</div>
          <p className="font-medium">Block User</p>
        </div>

        {/* Text "Who can see my personal info" below Block User */}
        <div className="p-4 text-sm text-gray-600">
          Who can see my personal info
        </div>

        {/* Rest of the privacy options */}
        {privacyOptions.slice(1).map((option, index) => (
          <div
            key={index}
            className={`flex items-center gap-4 p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100`}
            onClick={() => onNavigate(option.name, option.component)}
          >
            <div className="text-gray-600">{option.icon}</div>
            <p className="font-medium">{option.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Privacy;
