/* eslint-disable react/prop-types */
import { useState } from "react";
import toast from "react-hot-toast";
import { FaUserLarge } from "react-icons/fa6";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { IoSettingsOutline } from "react-icons/io5";
import { RiLogoutCircleLine } from "react-icons/ri";
import { useNavigate } from "react-router";

const Chat_SideBar = ({ onSidebarItemClick }) => {
  const [isRotated, setIsRotated] = useState(false);
  const navigate = useNavigate();
  const handleSettingClicked = ()=>{
    const newRotationState = !isRotated;
    setIsRotated(newRotationState);


    if(newRotationState){
      onSidebarItemClick("settings");
    } else {
      onSidebarItemClick("chat");
    }
  }
  const handleLogoutClicked = ()=>{
    toast.remove("User logout successfully!")
    navigate('/');
  }
  return (
    <div className="bg-gray-50 w-16 h-full flex flex-col items-center justify-start py-4 space-y-6">
      <HiOutlineChatBubbleLeftRight
        className="text-gray-600 text-2xl cursor-pointer hover:text-blue-600"
        onClick={() => onSidebarItemClick("chat")}
      />
      <FaUserLarge
        className="text-gray-500 text-2xl cursor-pointer hover:text-blue-600"
        onClick={() => onSidebarItemClick("user")}
      />
      <IoSettingsOutline
          className={`text-gray-600 text-2xl cursor-pointer hover:text-blue-600 transform transition-transform duration-300 ${
            isRotated ? "rotate-180" : ""
          }`}
        onClick={() => handleSettingClicked()}
      />
      <RiLogoutCircleLine className="text-gray-500 text-2xl cursor-pointer hover:text-blue-600" 
      onClick={handleLogoutClicked}/>
    </div>
  );
};

export default Chat_SideBar;
