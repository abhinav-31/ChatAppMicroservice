/* eslint-disable react/prop-types */
import { FaEnvelope, FaPhone, FaUserPlus, FaTrash } from "react-icons/fa";
import EmailAddress from "./EmailAddress";
import PhoneNumber from "./PhoneNumber";
import DeleteAccount from "./DeleteAccount";

const AccountSection = ({ onNavigate }) => {
  const accountOptions = [
    { name: "Email Address", icon: <FaEnvelope />, component: <EmailAddress /> },
    { name: "Phone Number", icon: <FaPhone />,component:<PhoneNumber/> },
    { name: "Add Contacts", icon: <FaUserPlus /> },
    { name: "Delete Account", icon: <FaTrash />, danger: true , component:<DeleteAccount/> },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {accountOptions.map((option, index) => (
          <div
            key={index}
            className={`flex items-center gap-4 p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100 ${
              option.danger ? "text-red-500" : ""
            }`}
            onClick={() => option.component && onNavigate(option.name, option.component)}
          >
            <div className="text-gray-600">{option.icon}</div>
            <p className="font-medium">{option.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountSection;
