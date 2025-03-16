/* eslint-disable react/prop-types */
import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { FaUserLarge } from "react-icons/fa6";
import { TfiThemifyFavicon } from "react-icons/tfi";
import { IoSettingsOutline } from "react-icons/io5";
import { RiLogoutCircleLine } from "react-icons/ri";
import { useNavigate } from "react-router";
import { logout } from "../../services/UserSettingService/UserSettingService";

const ChatSideBar = ({ onSidebarItemClick }) => {
	const [isRotated, setIsRotated] = useState(false);
	const [isUserClicked, setIsUserClicked] = useState(false);
	const navigate = useNavigate();

	const handleSidebarClick = useCallback(
		(type) => {
			if (type === "user") {
				setIsUserClicked((prev) => !prev);
				onSidebarItemClick(isUserClicked ? "chat" : "user");
			} else if (type === "settings") {
				setIsRotated((prev) => !prev);
				onSidebarItemClick(isRotated ? "chat" : "settings");
			} else {
				onSidebarItemClick(type);
			}
		},
		[isUserClicked, isRotated, onSidebarItemClick]
	);
	
	const handleLogout = async () => {
		try {
			sessionStorage.removeItem("accessToken");
			await logout();
			toast.success("User logout successfully!");
			navigate("/");
		} catch (error) {
			toast.error('Error in Logout: ', error?.message);
		}	
	}

	return (
		<div className='border-r border-gray-200  w-16 h-full flex flex-col items-center py-4 space-y-6'>
			<TfiThemifyFavicon
				title='chats'
				className='text-gray-600 text-2xl cursor-pointer hover:text-blue-600'
				onClick={() => handleSidebarClick("chat")}
			/>
			<FaUserLarge
				title='profile'
				className='text-gray-500 text-2xl cursor-pointer hover:text-blue-600'
				onClick={() => handleSidebarClick("user")}
			/>
			<IoSettingsOutline
				title='setting'
				className={`text-gray-600 text-2xl cursor-pointer hover:text-cyan-400 transform transition-transform duration-300 ${
					isRotated ? "rotate-180" : ""
				}`}
				onClick={() => handleSidebarClick("settings")}
			/>
			<RiLogoutCircleLine
				title='logout'
				className='text-gray-500 text-2xl cursor-pointer hover:text-red-800'
				onClick={handleLogout}
			/>
		</div>
	);
};

export default ChatSideBar;
