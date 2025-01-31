import { useState } from "react";
import toast from "react-hot-toast";
import { FaGlobe } from "react-icons/fa";

const AppLanguages = () => {
  // State to track selected language
  const [selectedLanguage, setSelectedLanguage] = useState("English (default)");

  const languageOptions = [
    { name: "English (default)", icon: <FaGlobe /> },
    { name: "Hindi", icon: <FaGlobe /> },
    { name: "Marathi", icon: <FaGlobe /> },
  ];

  return (
    <div className="flex flex-col h-full w-full">
      {/* Language Options List */}
      <div className="flex-1 overflow-y-auto">
        {languageOptions.map((option, index) => (
          <div
            key={index}
            className={`flex items-center gap-4 p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100 ${
              selectedLanguage === option.name ? "bg-gray-200" : ""
            }`}
            onClick={() => {
              if (selectedLanguage !== option.name) { // Only show toast if language actually changes
                setSelectedLanguage(option.name);
                toast.success(`Language Changed to ${option.name}`);
              }
            }}// Set language on click
          >
            <div className="text-gray-600">{option.icon}</div>
            <p className="font-medium">{option.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppLanguages;
