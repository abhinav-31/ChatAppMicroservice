/* eslint-disable react/prop-types */

import { useState } from "react";
import { FaUser, FaLock, FaComment, FaBell, FaGlobe } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import AccountSection from "./Accounts/AccountSection";
import Privacy from "./Privacy/Privacy";
import Chats from "./Chats/Chats";
import Notification from "./Notification";
import AppLanguages from "./AppLanguages";

const Settings = ({ user }) => {
  const [path, setPath] = useState([]); // for navigation history

  const handleNavigation = (name, component) => {
    setPath(prev => [...prev, { name, component }]); 
  };

  const settingsOptions = [
    { name: "Accounts", icon: <FaUser />, component: <AccountSection onNavigate={handleNavigation} /> },
    { name: "Privacy", icon: <FaLock />, component: <Privacy onNavigate={handleNavigation}/> },
    { name: "Chats", icon: <FaComment />, component: <Chats onNavigate={handleNavigation} /> },
    { name: "Notification", icon: <FaBell />, component: <Notification onNavigate={handleNavigation}/> },
    { name: "App Language", icon: <FaGlobe />, component: <AppLanguages onNavigate={handleNavigation}/> },
  ];

 
  const handleBack = () => {
    setPath(prev => prev.slice(0, -1)); // Removes ONLY the last entry
  };

  const currentSection = path.length > 0 ? path[path.length - 1] : null;

  return (
    <div className="bg-white flex flex-col h-full overflow-hidden w-80">
      {/* Show User Profile Only on Main Menu */}
      {!currentSection && (
        <div className="p-6 flex items-center gap-4 border-b border-gray-200">
          <img src={user.image} alt={user.name} className="w-14 h-14 border border-gray-300 rounded-full" />
          <p className="text-lg font-semibold">{user.name}</p>
        </div>
      )}

      {/* Render Header for Nested Sections */}
      {currentSection && (
        <div className="p-4 flex justify-between items-center gap-4 border-b border-gray-200">
          <button className="text-blue-500 cursor-pointer" onClick={handleBack}>
            <IoArrowBack className="text-2xl" />
          </button>
          <p className="text-lg font-semibold flex-1 text-center">{currentSection.name}</p>
          <div className="w-8" />
        </div>
      )}

      {/* Render Current Section or Main Menu */}
      <div className="overflow-y-auto flex-1">
        {currentSection ? (
          currentSection.component
        ) : (
          settingsOptions.map((option, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
              onClick={() => handleNavigation(option.name, option.component)}
            >
              <div className="text-gray-600">{option.icon}</div>
              <p className="font-medium">{option.name}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Settings;
