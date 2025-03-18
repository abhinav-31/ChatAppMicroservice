/* eslint-disable react/prop-types */
import { BiSearchAlt } from "react-icons/bi";
import { SiAircall } from "react-icons/si";
import { HiUserGroup } from "react-icons/hi";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { HiMiniUser } from "react-icons/hi2";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreateGroupModal from "../Modal/CreateGroupModal";
import { moveUnreadGroupMessagesToGroupMessages } from "../../features/slice/groupChatSlice";
import { moveUnreadMessagesToMessages } from "../../features/slice/messageSlice";
import {
	useBackdropContext,
	useWebSocketContext,
} from "../../constant/constants";
import ChatListItem from "./ChatListItem";
import ChatSearch from "./ChatSearch";

const ChatChatList = ({ onChatSelect, chatWidth }) => {
	const [searchQuery, setSearchQuery] = useState("");
	const { sendMessage, isConnected } = useWebSocketContext();
	const dispatch = useDispatch();
	const { senderId } = useSelector((state) => state.user);
	const { createGroupClicked, setCreateGroupClicked } = useBackdropContext();
	const { unreadMessages } = useSelector((state) => state.messages);
	const { unreadGroupMessages } = useSelector((state) => state.groupChats);
	const [selectedFilter, setSelectedFilter] = useState("all"); 

	const setFilter = (type) => {
		if (selectedFilter !== type) {
			setSelectedFilter(type);
		}
	};
	const handleSelectedChat = useCallback(
		(type, chatId) => {
			if (!isConnected) {
				console.warn(
					"WebSocket not connected, skipping message status updates"
				);
				return; // Skip if not connected
			}

			if (
				type === "group" &&
				unreadGroupMessages[chatId]?.unreadCount > 0
			) {
				const messagesToMark =
					unreadGroupMessages[chatId]?.messages || [];
				dispatch(
					moveUnreadGroupMessagesToGroupMessages({ groupId: chatId })
				);
				messagesToMark.forEach((message) => {
					const seenByBody = {
						groupId: chatId,
						userId: senderId,
						sentTimestamp: message.sentTime,
					};
					sendMessage("/app/seenBy", seenByBody);
				});
			} else if (
				type === "private" &&
				unreadMessages[chatId]?.unreadCount > 0
			) {
				const messagesToMark =
					unreadMessages[chatId]?.messages?.filter(
						(msg) => !msg.readTime
					) || [];
				dispatch(moveUnreadMessagesToMessages({ chatId }));
				if (messagesToMark.length > 0) {
					const date = new Date();
					messagesToMark.forEach((message) => {
						const readStatusBody = {
							chatId: chatId,
							sender: message.sender,
							status: "read",
							sentTimestamp: message.sentTime,
							messageReadTimestamp: date
								.toISOString()
								.slice(0, -1),
						};
						sendMessage("/app/status", readStatusBody);
					});
				}
			}
		},
		[
			isConnected,
			dispatch,
			sendMessage,
			unreadGroupMessages,
			unreadMessages,
			senderId,
		]
	);

	const { chatOrder } = useSelector((state) => state.chatLists);

	return (
		<div
			className='bg-white flex flex-col h-full overflow-hidden border-r border-r-gray-200'
			style={{ width: chatWidth }}
		>
			{/* Header */}
			<div className='m-2 flex justify-between items-center border-b border-gray-200'>
				<h1 className='text-xl font-semibold'>Chats</h1>
			</div>

			{/* Search Bar */}
			<div className='p-2 flex flex-col gap-2 border-b border-gray-200'>
				<div className='relative flex items-center border border-gray-300 rounded-4xl'>
					<div className='absolute left-4 cursor-pointer z-50'>
						<BiSearchAlt size={24} />
					</div>
					<input
						type='text'
						placeholder='Search...'
						onChange={(e) => setSearchQuery(e.target.value)}
						className='w-full pl-12 p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-4xl'
					/>
				</div>
			</div>

			{/* Buttons below search bar */}
			<div className='p-2 flex gap-4 border-b border-gray-200 justify-evenly'>
				{["all", "private", "group"].map((type) => (
					<button
						key={type}
						className={`relative flex items-center gap-2 px-4 py-2 text-sm rounded-xl group ${
							selectedFilter.current === type
								? "bg-gray-300"
								: "hover:bg-gray-100"
						}`}
						onClick={() => setFilter(type)}
					>
						{/* Icon Based on Type */}
						{type === "all" ? (
							<SiAircall size={18} />
						) : type === "private" ? (
							<HiMiniUser size={18} />
						) : (
							<HiUserGroup size={18} />
						)}

						{/* Tooltip with Correct Hover Effect */}
						<span className='absolute left-1/2 transform translate-x-4 bottom-6 bg-gray-300 text-black text-xs px-2 py-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50'>
							{type === "all"
								? "All"
								: type === "private"
								? "Private"
								: "Group Chat"}
						</span>
					</button>
				))}	
				<button
					onClick={(e) => {
						e.stopPropagation();
						setCreateGroupClicked((prev) => !prev);
					}}
					className='flex items-center gap-2 px-4 py-2 text-sm rounded-xl hover:bg-gray-100 group relative'
				>
					<AiOutlineUsergroupAdd size={18} />
					<span className='absolute transform -translate-2 bottom-4 bg-gray-300 text-black text-xs px-2 py-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50'>
						Create Group
					</span>
				</button>
			</div>

			{searchQuery.length > 0 ? (
				<div className='overflow-y-auto flex-1'>
					<ChatSearch
						searchQuery={searchQuery}
						onChatSelect={onChatSelect}
						handleSelectedChat={handleSelectedChat}
					/>
				</div>
			) : (
				<div className='overflow-y-auto flex-1'>
					{chatOrder.map((chatListId) => {
						return (
							<ChatListItem
								key={chatListId}
								chatListId={chatListId}
								onChatSelect={onChatSelect}
								handleSelectedChat={handleSelectedChat}
								selectedFilter={selectedFilter}
							/>
						);
					})}
				</div>
			)}

			{/* Create Group Modal */}
			{createGroupClicked && (
				<CreateGroupModal
					createGroupClicked={createGroupClicked}
					setCreateGroupClicked={setCreateGroupClicked}
					chatWidth={chatWidth} // Pass chatWidth here
				/>
			)}
		</div>
	);
};

export default ChatChatList;
