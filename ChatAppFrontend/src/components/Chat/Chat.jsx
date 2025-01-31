import { useState, useRef, useEffect, useCallback } from "react";
import ChatSideBar from "./ChatSideBar";
import ChatChatList from "./ChatChatList";
import ChatMessageBox from "./ChatMessageBox";
import Settings from "../Settings/Settings";
import Profile from "../Authentication/Profile";
import AddContact from "../Modal/AddContactModal";
import {
	getUser,
	refreshToken,
} from "../../services/UserSettingService/UserSettingServiceAuth";
import { useDispatch, useSelector } from "react-redux";
import { saveUserProfile } from "../../features/slice/userSlice";
import toast from "react-hot-toast";

import { BiSolidContact } from "react-icons/bi";
import ContactListModal from "../Modal/ContactListModal";
import { deleteChat, fetchChatLists } from "../../features/slice/chatListSlice";

import { useBackdropContext, useGlobalContext } from "../../constant/constants";
import { useNavigate } from "react-router";

const Chat = () => {
	const { showContacts, setShowContacts, closeAll } = useBackdropContext();
	const { setTempChat, selectedChat, setSelectedChat } = useGlobalContext();
	const [selectedSidebarItem, setSelectedSidebarItem] = useState("chat"); // Default to "chat"
	const navigate = useNavigate();
	// Redux
	const dispatch = useDispatch();
	const { chatList } = useSelector((state) => state.chatLists);
	const { contacts } = useSelector((state) => state.contacts);
	const user = useSelector((state) => state.user);
	
	const senderId = user.senderId;

	// Ref and State for Resizing
	const chatRef = useRef(null);
	const [isResizing, setIsResizing] = useState(false);
	const [chatWidth, setChatWidth] = useState(320); // Initial width of the chat box

	// Fetch User Data
	const getUserData = useCallback(async () => {
		try {
			const response = await getUser();
			dispatch(saveUserProfile(response.data));
		} catch (error) {
			toast.error(error.message);
		}
	}, [dispatch]);

	const handleMouseDown = () => {
		setIsResizing(true);
	};

	const handleMouseMove = (e) => {
		if (isResizing) {
			const newWidth =
				e.clientX - chatRef.current.getBoundingClientRect().left;

			if (newWidth > 200 && newWidth < 500) {
				setChatWidth(newWidth);
			}
		}
	};

	const handleMouseUp = () => {
		setIsResizing(false);
	};

	// Handle Chat Message Box Related Event
	const handleCloseChat = () => {
		setSelectedChat(null);
	};

	const handleDeleteChat = () => {
		if (selectedChat) {
			dispatch(deleteChat({ receiverId: selectedChat }));

			setSelectedChat(null);
		}
	};

	// Handle  ChatSideBar related event
	const handleSidebarItemClick = (item) => {
		setSelectedSidebarItem(item);
	};
	
	const handleSelectContact = (contactId) => {
		const existingChat = !!chatList[contactId];
		if (existingChat) {
			setSelectedChat(contactId); // open existing chat
		} else {
			const contact = contacts.find(
				(contact) => contact.receiverId === contactId
			);
			setTempChat(contact); // Store selected contact temporarily
			setSelectedChat(contactId); // Show message box
		}
		setShowContacts(false); // Hide contact list
	};

	useEffect(() => {
		const auth = async () => {
			try {
				const accessToken = sessionStorage.getItem("accessToken");
				if (!accessToken && accessToken === "undefined") {
					const response = await refreshToken();
					sessionStorage.setItem(
						"accessToken",
						response.data.accessToken
					);
					toast.success("Welcome To ChatApp");
				}
			} catch (error) {
				toast.error(error.message);
				navigate("/");
			}
		};
		auth();
		if (!user.senderId) {
			getUserData();
		}
	}, []);

	useEffect(() => {
		if (senderId) {
			dispatch(fetchChatLists(senderId));
		}
	}, [dispatch, senderId]);

	return (
		<div
			onClick={closeAll}
			className='bg-white h-screen w-screen flex justify-center items-center overflow-hidden'
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
		>
			<div
				ref={chatRef}
				className='relative border border-gray-200 rounded-lg shadow-xl transform scale-105 w-full max-w-[90%] xl:max-w-[94%] h-[92vh] flex'
				style={{ transition: "width 0.1s ease" }}
			>
				{/* Sidebar */}
				<ChatSideBar onSidebarItemClick={handleSidebarItemClick} />

				{/* Conditional content based on selected sidebar item */}
				{selectedSidebarItem === "settings" && <Settings />}
				{selectedSidebarItem === "chat" && (
					<div className='relative flex flex-col w-[chatwidth]'>
						<ChatChatList
							selectedChat={selectedChat}
							onChatSelect={setSelectedChat}
							chatWidth={chatWidth}
						/>
						{/* Add Contact Modal */}
						<AddContact />

						{/* Floating Add Contact Button */}
						<button
							className='absolute bottom-4 right-4 bg-gradient-to-r from-cyan-600 via-violet-600 to-fuchsia-600 text-white p-3 rounded-2xl shadow-lg hover:bg-blue-600 transition z-50 cursor-pointer'
							onClick={(e) => {
								e.stopPropagation();
								setShowContacts(!showContacts);
							}}
						>
							<BiSolidContact size={24} />
						</button>
						{/* Contact List Modal */}
						<ContactListModal
							handleSelectContact={handleSelectContact}
						/>
					</div>
				)}
				{selectedSidebarItem === "user" && <Profile />}

				{/* Resizable Border */}
				<button
					aria-label='Resize chat'
					className='cursor-ew-resize bg-transparent'
					onMouseDown={handleMouseDown} // Start resizing
					style={{
						width: "2px",
						height: "100%",
						border: "none",
						padding: 0,
					}}
				/>

				{/* Message Box */}
				<ChatMessageBox
					selectedChat={selectedChat}
					handleDeleteChat={handleDeleteChat}
					handleCloseChat={handleCloseChat}
				/>
			</div>
		</div>
	);
};

export default Chat;
