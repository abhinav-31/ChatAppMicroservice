/* eslint-disable react/prop-types */
import EmojiPicker from "emoji-picker-react";
import { useRef, useState, useCallback } from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import {
	useBackdropContext,
	useGlobalContext,
	useWebSocketContext,
} from "../../constant/constants";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const ChatMessageBox = ({
	selectedChat,
	handleDeleteChat,
	handleCloseChat,
}) => {
	const { handleSendMessage } = useWebSocketContext();
	const emojiPickerRef = useRef(null);
	const { tempChat } = useGlobalContext();
	const chat =
		useSelector((state) => state.chatLists.chatList[selectedChat]) ||
		tempChat;

	const {
		showEmojiPicker,
		setShowEmojiPicker,
		isDropdownOpen,
		setIsDropdownOpen,
		showAttachmentOptions,
		setShowAttachmentOptions,
	} = useBackdropContext();

	const [message, setMessage] = useState("");
	const [selectedFile, setSelectedFile] = useState(null);

	const fileInputRef = useRef(null);

	// Handle emoji selection
	const handleEmojiClick = useCallback((emoji) => {
		setMessage((prev) => prev + emoji.emoji);
		setShowEmojiPicker(false);
	}, [setShowEmojiPicker]);

	// Handle file selection
	const handleFileSelect = useCallback((event) => {
		const file = event.target.files[0];
		if (file) setSelectedFile(file.name);
	}, []);

	// Open file picker for attachments
	const openFilePicker = useCallback(
		() => {
			fileInputRef.current?.click();
			setShowAttachmentOptions(false);
		},
		[setShowAttachmentOptions]
	);

	// Send message when user presses send
	const sendMessage = useCallback(() => {
		if (message.trim() || selectedFile) {
			let destination = "";
			let chatType = chat?.type || "private";
			let receiverId = selectedChat || tempChat?.receiverId;
			
			if (chatType === "private") {
				destination = "/app/chat-app";
			} else if (chatType === "group") {
				destination = "/app/group-chat";
			}
			
			if (receiverId) {
				handleSendMessage(chatType, destination, message, selectedFile);
			} else {
				toast.error("Receiver Id is missing, cannot send message");
			}
			setMessage("");
			setSelectedFile(null);
		}
	}, [message, selectedFile, handleSendMessage]);

	// Toggle dropdown menu
	const toggleDropdown = useCallback(() => {
		setIsDropdownOpen((prev) => !prev);
	}, [setIsDropdownOpen]);

	return (
		<div
			className='flex-1 bg-gradient-to-r h-full flex items-center justify-center relative '
			// onClick={handleWrapperClick}
		>
			{selectedChat ? (
				<div className='w-full h-full flex flex-col'>
					<ChatHeader
						selectedChat={selectedChat}
						chat={chat}
						toggleDropdown={toggleDropdown}
						isDropdownOpen={isDropdownOpen}
						setIsDropdownOpen={setIsDropdownOpen}
						handleDeleteChat={handleDeleteChat}
						handleCloseChat={handleCloseChat}
					/>
					<MessageList selectedChat={selectedChat} chat={chat} />
					<MessageInput
						selectedChat={selectedChat}
						message={message}
						setMessage={setMessage}
						setShowEmojiPicker={setShowEmojiPicker}
						showAttachmentOptions={showAttachmentOptions}
						setShowAttachmentOptions={setShowAttachmentOptions}
						openFilePicker={openFilePicker}
						handleFileSelect={handleFileSelect}
						sendMessage={sendMessage}
						fileInputRef={fileInputRef}
						chatType={chat?.type}
						chat={chat}
						
					/>

					{showEmojiPicker && (
						<div
							ref={emojiPickerRef}
							className='absolute bottom-17 left-10'
							onClick={(e) => e.stopPropagation()}
						>
							<EmojiPicker onEmojiClick={handleEmojiClick} />
						</div>
					)}
				</div>
			) : (
				<div className=' text-black text-lg font-medium'>
					Select a chat to start messaging...
				</div>
			)}
		</div>
	);
};

export default ChatMessageBox;
