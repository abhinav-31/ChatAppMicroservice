/* eslint-disable react/prop-types */
import { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ChatListItem = memo(
	({ chatListId, onChatSelect, handleSelectedChat, selectedFilter }) => {
		const chat = useSelector(
			(state) => state.chatLists.chatList[chatListId]
		);
		const { privateMessages, unreadMessages, pendingChatIds } = useSelector(
			(state) => state.messages
		);
		const { groupMessages, unreadGroupMessages } = useSelector(
			(state) => state.groupChats
		);
		const chatId = pendingChatIds[chatListId];

		const latestMessage =
			unreadMessages[chatId]?.latestMessage ||
			unreadGroupMessages[chatListId]?.latestMessage ||
			privateMessages[chatId]?.latestMessage ||
			groupMessages[chatListId]?.latestMessage ||
			chat.latestMessage ||
			"";

		const unreadCount =
			unreadMessages[chatId]?.unreadCount ||
			unreadGroupMessages[chatListId]?.unreadCount ||
			chat?.unreadCount ||
			"";

		const [isVisible, setIsVisible] = useState(true);
		useEffect(() => {
			setIsVisible(
				selectedFilter === "all" || chat.type === selectedFilter
			);
		}, [selectedFilter, chat.type]); // Triggers only when filter type changes

		if (!isVisible) return null;

		return (
			<div
				className={`h-16 flex items-center hover:bg-gray-100 gap-3 cursor-pointer ${
					chat.type === "private" ? "bg-white " : ""
				}`}
				onClick={() => {
					onChatSelect(chatListId);
					handleSelectedChat(
						chat.type,
						chat.type === "private" ? chatId : chatListId
					);
				}}
			>
				<div className='shrink-0 md:ml-2'>
					<img
						src={chat.profilePhoto}
						alt={chat.profilePhoto}
						className={`md:w-13 h-13 border border-gray-200 rounded-full ${
							unreadMessages[chatId]?.messages.length
								? "border border-green-400"
								: ""
						}`}
					/>
				</div>
				<div className='flex items-center h-[100%] w-[80%] border-b border-b-gray-200'>
					<div className='flex-1 pt-1 '>
						<p className='font-medium mt-2'>{chat.name}</p>
						<p className='text-sm text-gray-500 truncate'>
							{latestMessage.length > 24
								? latestMessage.substring(0, 24) + "..."
								: latestMessage}
						</p>
					</div>
					{unreadCount > 0 && (
						<div className='bg-gradient-to-tl from-violet-500 text-white text-center rounded-lg w-6 h-6 flex justify-center items-center p-2 mr-2'>
							{unreadCount}
						</div>
					)}
				</div>
			</div>
		);
	}
);

ChatListItem.displayName = "ChatListItem";

export default ChatListItem;
