/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";

const ChatSearch = ({ searchQuery, onChatSelect, handleSelectedChat }) => {
	const { privateMessages, unreadMessages } = useSelector(
		(state) => state.messages
	);
	const { groupMessages, unreadGroupMessages, groupsInfo } = useSelector(
		(state) => state.groupChats
	);
	const { contacts } = useSelector((state) => state.contacts);
	if (!searchQuery?.trim()) {
		return null;
	} 
	// 🔍 Filter messages
	const filterMessages = (messages, isGroup = false) => {
		return Object.entries(messages).flatMap(([chatID, chatData]) =>
			(chatData.messages || [])
				.filter((msg) =>
					msg.content
						?.toLowerCase()
						.includes(searchQuery.toLowerCase())
				)
				.map((msg) => ({
					chatID,
					content: msg.content,
					isGroup,
					receiverId: isGroup ? null : chatData.id, // Receiver ID for private chats
				}))
		);
	};

	// Collect all search results
	const searchResults = [
		...filterMessages(privateMessages, false),
		...filterMessages(unreadMessages, false),
		...filterMessages(groupMessages, true),
		...filterMessages(unreadGroupMessages, true),
	];

	// 🔥 Highlight searched words
	const highlightText = (text, query) => {
		if (!query) return text;
		const regex = new RegExp(`(${query})`, "gi");
		return text.split(regex).map((part, i) =>
			part.toLowerCase() === query.toLowerCase() ? (
				<span key={i} className='bg-yellow-100'>
					{part}
				</span>
			) : (
				part
			)
		);
	};

	return (
		
		<>
			{
				searchQuery &&
				(
					<div>
						{searchResults.length === 0 ? (
							<p className='text-gray-500'>No results found.</p>
						) : (
							searchResults.map(
								(
									{ chatID, content, isGroup, receiverId },
									index
								) => {
									const contact = contacts.find(
										(c) => c.receiverId === receiverId
									);
									const contactName = isGroup
										? groupsInfo[chatID]?.groupName ||
										"Unknown Group"
										: contact?.contactName || "Unknown Contact";
									const profilePhoto = isGroup
										? groupsInfo[chatID]?.profilePhoto
										: contact?.profilePhoto;

									return (
										<div
											key={index}
											className='h-16 flex items-center hover:bg-gray-100 gap-3 cursor-pointer bg-white'
											onClick={() => {
												onChatSelect(
													isGroup
														? chatID
														: receiverId
												);
												handleSelectedChat(
													isGroup
														? ("group", chatID)
														: ("private",
														  receiverId)
												);
											}}
										>
											<div className='shrink-0 md:ml-2'>
												<img
													src={
														profilePhoto ||
														"/default-profile.png"
													}
													alt={contactName}
													className='md:w-13 h-13 border border-gray-200 rounded-full'
												/>
											</div>
											<div className='flex items-center h-[100%] w-[80%] border-b border-b-gray-200'>
												<div className='flex-1 pt-1'>
													<p className='font-medium mt-2'>
														{contactName}
													</p>
													<p className='text-sm text-gray-500 truncate'>
														{highlightText(
															content.length > 24
																? content.substring(
																		0,
																		24
																  ) + "..."
																: content,
															searchQuery
														)}
													</p>
												</div>
											</div>
										</div>
									);
								}
							)
						)}
					</div>
				)}
		</>);
};

export default ChatSearch;
