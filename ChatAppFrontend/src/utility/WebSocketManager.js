import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addChat, updateChatList } from "../features/slice/chatListSlice";
import {
	addIncomingMessage,
	addSentMessage,
	getChatId,
	updateMessageStatus,
} from "../features/slice/messageSlice";
import useWebSocket from "../hooks/useWebSocket";
import toast from "react-hot-toast";
import {
	addGroupSendMessage,
	incomingGroupMessage,
} from "../features/slice/groupChatSlice";

const websocketUrl = import.meta.env.VITE_API_GATEWAY_URL;

const WebSocketManager = ({ selectedChat, tempChat, setTempChat }) => {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);
	const { pendingChatIds } = useSelector((state) => state.messages);
	const { contacts } = useSelector((state) => state.contacts);

	const { groupsInfo } = useSelector((state) => state.groupChats);

	const groupTopics = useMemo(() => {
		return Object.keys(groupsInfo).map(
			(groupId) => `/topic/group-${groupId}`
		);
	}, [groupsInfo]);

	const topics = useMemo(
		() => [
			`/queue/${user.senderId}`,
			`/queue/status-read-${user.senderId}`,
			`/queue/status-delivered-${user.senderId}`,
			`/queue/group-add-${user.senderId}`,
			...groupTopics,
		],
		[user.senderId, groupTopics]
	);

	const handleIncomingGroupNotification = (topic, notificatinoBody) => {
		dispatch(addChat({ chat: notificatinoBody }));
	};

	const handleIncomingGroupMessage = (topic, groupMessage) => {
		const groupId = topic.split("/topic/group-")[1];
		if (groupMessage.sender === user.senderId) return;
		dispatch(
			incomingGroupMessage({
				groupId,
				incomingMessage: groupMessage,
				isGroupOpen: selectedChat === groupId,
			})
		);
	};

	const handleIncomingMessage = (topic, newMessage) => {
		// Convert newMessage into an array
		const messagesArray = Array.isArray(newMessage)
			? newMessage
			: [newMessage];

		// Group messages by chatId
		const groupMessagesByChatId = messagesArray.reduce((acc, msg) => {
			const { chatId, message } = msg;
			if (!acc[chatId]) {
				acc[chatId] = [];
			}
			acc[chatId].push({ message });
			return acc;
		}, {});

		// Process each chatId and its messages
		Object.entries(groupMessagesByChatId).forEach(([chatId, messages]) => {
			messages.forEach(({ message }) => {
				const isChatOpen = selectedChat === message.sender;
				const date = new Date();
				const timeZoneOffset = date.getTimezoneOffset() * 60 * 1000;
				const local = date - timeZoneOffset;
				const isoD = new Date(local).toISOString().slice(0, -1);
				const deliveredStatusBody = {
					chatId: chatId,
					sender: message.sender,
					status: "delivered",
					sentTimestamp: message.sentTimestamp,
					messageDeliveredTimestamp: isoD,
				};

				const readStatusBody = {
					chatId: chatId,
					sender: message.sender,
					status: "read",
					sentTimestamp: message.sentTimestamp,
					messageReadTimestamp: "",
				};

				sendMessage("/app/status", deliveredStatusBody);

				dispatch(updateChatList({ message, contacts }));
				if (isChatOpen) {
					const isoR = new Date(local).toISOString().slice(0, -1);
					readStatusBody.messageReadTimestamp = isoR;
					sendMessage("/app/status", readStatusBody);
					dispatch(
						addIncomingMessage({
							chatId,
							message,
							flag: true,
						})
					); // Add message to privateMessages
				} else {
					dispatch(
						addIncomingMessage({
							chatId,
							message,
							flag: false,
						})
					); // Add message to unreaeMessages
				}
			});
		});
	};
	// handle incoming status
	const handleIncomingMessageStatus = (topic, statusBody) => {
		const status = topic.split("-")[1];
		if (status === "read") {
			dispatch(updateMessageStatus(statusBody));
			return;
		}
		dispatch(updateMessageStatus(statusBody));
	};

	const [sendGroupNotification, sendMessage, isConnected] = useWebSocket(
		user?.senderId ? user.senderId : null,
		`${websocketUrl}/ws`,
		handleIncomingMessage,
		handleIncomingMessageStatus,
		handleIncomingGroupNotification,
		handleIncomingGroupMessage,
		user?.senderId ? topics : []
	);
	const handleSendMessage = useCallback(
		(type, destination, message, file) => {
			if (!isConnected) {
				toast.error("WebSocket is not connected");
				return;
			}
			if (!selectedChat) {
				toast.error("Select a chat first!");
				return;
			}
			const date = new Date();
			const timeZoneOffset = date.getTimezoneOffset() * 60 * 1000;
			const local = date - timeZoneOffset;
			if (type === "group") {
				const isoG = new Date(local).toISOString().slice(0, -1);
				const groupMessageBody = {
					sender: user.senderId,
					groupId: selectedChat,
					content: message,
					sentTimestamp: isoG,
				};
				sendMessage(destination, groupMessageBody);
				dispatch(
					addGroupSendMessage({
						groupId: selectedChat,
						message: groupMessageBody,
					})
				);
				return;
			}
			const receiverId = selectedChat;
			const chatId = pendingChatIds[receiverId];
			const sentTimestamp = new Date(local).toISOString().slice(0, -1);
			const newMessage = {
				participants: [user.senderId, receiverId],
				message,
				sentTimestamp,
			};

			sendMessage(destination, newMessage);

			if (chatId) {
				// If a chatId already exists, update the Redux store optimistically.
				dispatch(addSentMessage({ chatId, message: newMessage }));
			} else {
				// If no chatId exists, do not add optimistically.
				// Directly dispatch getChatId which will create the chat entry with the message.
				dispatch(
					getChatId({
						senderId: user.senderId,
						receiverId,
						tempMessage: newMessage,
					})
				);
				if (tempChat) {
					dispatch(
						addChat({
							chat: {
								id: tempChat.receiverId,
								name: tempChat.contactName,
								profilePhoto: tempChat.contactProfilePhoto,
								latestMessage: newMessage.message,
								type: type,
							},
						})
					);
				}
			}

			
			setTempChat(null);
		},
		[
			isConnected,
			selectedChat,
			user.senderId,
			pendingChatIds,
			tempChat,
			sendMessage,
			dispatch,
			setTempChat,
		]
	);
	const webSocketValues = useMemo(
		() => ({
			sendGroupNotification,
			sendMessage,
			handleSendMessage,
			isConnected,
		}),
		[isConnected, sendGroupNotification, sendMessage, handleSendMessage]
	);

	return webSocketValues;
};

export default WebSocketManager;
