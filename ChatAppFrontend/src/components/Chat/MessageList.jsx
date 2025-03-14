/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import MessageBubble from "./MessageBubble";
import { useBackdropContext } from "../../constant/constants";

const MessageList = ({ selectedChat, chat }) => {
	const user = useSelector((state) => state.user);
	const senderId = user.senderId;
	const { privateMessages, pendingChatIds } = useSelector(
		(state) => state.messages
	);
	const { groupMessages } = useSelector((state) => state.groupChats);
	const {setAddContactClicked}= useBackdropContext();
	

	const chatId = selectedChat ? pendingChatIds[selectedChat] : null;
	const { contacts } = useSelector(state => state.contacts);
	//   Fetch messages from the correct Redux slice
	const messages =
		chat?.type === "private"
			? privateMessages[chatId]?.messages || []
			: groupMessages[selectedChat]?.messages || [];

	if (messages.length === 0) {
		return (
			<div className='flex-1 p-4 flex justify-center items-center text-center'>
				<p className='text-gray-500'>
					Start chatting with {chat?.name || chat?.contactName}...
				</p>
			</div>
		);
	}

	return (
		<>
			{chat?.type === "private" &&
				contacts.some((contact) => contact.receiverId !== selectedChat) && (
					<div className=' flex justify-center text-center'>
						<p>Not a contact.</p>
						<b
						onClick={(e) => { e.stopPropagation(); setAddContactClicked(true) }}
							className='underline cursor-pointer'
						>
							Add Contact
						</b>
					</div>
				)}
			<div
				className='flex-1 p-4 flex flex-col-reverse overflow-auto'
				style={{ scrollbarWidth: "thin", msOverflowStyle: "none" }}
			>
				<div className='mx-6 space-y-1'>
					{messages.length > 0 ?  ( messages.map((message, index) => {
						const isSender = message.sender === senderId;
						const isFirstSender =
							index === 0 ||
							messages[index - 1].sender === senderId;
						const isFirstReceiver =
							index === 0 ||
							messages[index - 1].sender !== senderId;

						return (
							<MessageBubble
								key={index}
								message={message}
								isSender={isSender}
								isFirstSender={isFirstSender}
								isFirstReceiver={isFirstReceiver}
								timestamp={message.sentTime}
								chatType={chat?.type} //   Pass `chatType` to MessageBubble
							/>
						);
					})) : (
							<p className='text-gray-500 text-center'>Start chatting with {chat?.name || chat?.contactName}...</p>
					) }
				</div>
			</div>
		</>
	);
};
export default MessageList;