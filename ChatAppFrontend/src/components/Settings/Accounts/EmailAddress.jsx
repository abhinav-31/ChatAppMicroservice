/* eslint-disable react/no-unescaped-entities */
import { FaEnvelope } from "react-icons/fa";
import { useState } from "react";
import { MdModeEdit } from "react-icons/md";
import toast from "react-hot-toast";

const EmailAddress = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState("email@gmail.com");
  const [tempEmail, setTempEmail] = useState(email);

  const handleSave = () => {
    setEmail(tempEmail);
    setIsEditing(false);
    toast.success("New Email: " + tempEmail);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Email Icon Section */}
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 rounded-full">
            <svg className="w-16 h-16">
              <defs>
                <linearGradient
                  id="gradientId"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#06b6d4" /> {/* Cyan-600 */}
                  <stop offset="50%" stopColor="#6366f1" /> {/* Indigo-500 */}
                  <stop offset="100%" stopColor="#d946ef" /> {/* Fuchsia-600 */}
                </linearGradient>
              </defs>
              <FaEnvelope
                className="text-6xl"
                style={{ fill: "url(#gradientId)" }}
              />
            </svg>
          </div>
          <p className="text-gray-700 text-center max-w-xs">
            Email helps you access your account. It isn't visible to others.
          </p>
        </div>

        {/* Email Input Section */}
        <div className="space-y-4">
          <label className="block text-gray-600 font-medium">Email</label>
          <div className="flex items-center justify-between border border-gray-200 p-2  rounded-xl">
            {isEditing ? (
              <input
                type="email"
                value={tempEmail}
                onChange={(e) => setTempEmail(e.target.value)}
                className="flex-1 outline-none"
                autoFocus
              />
            ) : (
              <p className="text-gray-800 flex-1">{email}</p>
            )}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-blue-500 hover:text-blue-600 -ml-2 cursor-pointer"
            >
              <MdModeEdit className="text-xl" />
            </button>
          </div>

          {/* Save Button */}
          {isEditing && (
            <div className="flex">
              <button
                onClick={handleSave}
                className="flex w-full justify-center items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailAddress;
