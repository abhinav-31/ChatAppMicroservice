import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import {
	fetchChatId,
	fetchPrivateChats,
} from "../../services/ChatNotificationService/ChatNotificationService";

// Async Thunks
export const fetchAllPrivateChats = createAsyncThunk(
	"messages/fetchMessages",
	async (senderId, { rejectWithValue }) => {
		try {
			const response = await fetchPrivateChats(senderId);
			const privateChats = response.data;

			const chatPrivateMessagesObject = {};
			const chatUnreadMessagesObject = {};

			// Process private messages
			privateChats.forEach((chat) => {
				if (chat.privateMessages.length === 0) return;
				const messages = chat.privateMessages.map((message) => ({
					sender: message.sender,
					receiver: message.receiver,
					content: message.content,
					status: message.status,
					sentTime: message.sentTimestamp,
					readTime: message.messageReadTimestamp || "",
					deliveredTime: message.messageDeliveredTimestamp || "",
				}));

				chatPrivateMessagesObject[chat.chatId] = {
					messages,
					latestMessage: messages.length
						? messages[messages.length - 1].content
						: "",
					unreadCount: messages.filter(
						(msg) => !msg.readTime || msg.readTime === ""
					).length,
					id: chat.members.find((memb) => memb !== senderId), // receiver of the privateChat from logged-in user
				};
			});

			// Process unread messages
			privateChats.forEach((chat) => {
				if (chat.unreadMessages.length === 0) return;
				const messages = chat.unreadMessages.map((message) => ({
					sender: message.sender,
					receiver: message.receiver,
					content: message.content,
					status: message.status,
					sentTime: message.sentTimestamp,
					readTime: message.messageReadTimestamp || "",
					deliveredTime: message.messageDeliveredTimestamp || "",
				}));

				chatUnreadMessagesObject[chat.chatId] = {
					messages,
					latestMessage: messages.length
						? messages[messages.length - 1].content
						: "",
					unreadCount: messages.length,
					id: chat.members.find((memb) => memb !== senderId), // receiver of the privateChat from logged-in user
				};
			});
			return { chatPrivateMessagesObject, chatUnreadMessagesObject };
		} catch (error) {
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

export const getChatId = createAsyncThunk(
	"chatId/fetchChatId",
	async ({ senderId, receiverId, tempMessage }, { rejectWithValue }) => {
		try {
			const response = await fetchChatId(senderId, receiverId);
			"Response For getChatID: ", response.data);
			return {
				receiverId,
				chatId: response.data,
				tempMessage,
			};
		} catch (error) {
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

// Redux Slice
const messageSlice = createSlice({
	name: "messages",
	initialState: {
		privateMessages: {}, //   Plain object, not a function
		unreadMessages: {},
		pendingChatIds: {},
		status: "idle",
		error: null,
	},
	reducers: {
		addIncomingMessage(state, action) {
			const { chatId, message, flag } = action.payload;

			if (flag) {
				if (!state.privateMessages[chatId]) {
					state.privateMessages[chatId] = {
						messages: [],
						latestMessage: "",
						unreadCount: 0,
						id: "",
					};
				}
				// push the message under specific chatId
				state.privateMessages[chatId].messages.push({
					sender: message.sender,
					receiver: message.receiver,
					content: message.content,
					status: message.status,
					sentTime: message?.sentTimestamp || "",
					deliveredTime: message?.messageDeliveredTimestamp || "",
					readTime: message?.messageReadTimestamp || "",
				});
				state.privateMessages[chatId].latestMessage = message.content;
				state.privateMessages[chatId].unreadCount = 0;
				if (!state.privateMessages[chatId]?.id) {
					state.privateMessages[chatId].id = message.sender;
				}
			} else {
				if (!state.unreadMessages[chatId]) {
					state.unreadMessages[chatId] = {
						messages: [],
						latestMessage: "",
						unreadCount: 0,
						id: "",
					};
				}
				state.unreadMessages[chatId].messages.push({
					sender: message.sender,
					receiver: message.receiver,
					content: message.content,
					status: message.status,
					sentTime: message?.sentTimestamp || "",
					deliveredTime: message?.messageDeliveredTimestamp || "",
					readTime: message?.messageReadTimestamp || "",
				});
				state.unreadMessages[chatId].latestMessage = message.content;
				state.unreadMessages[chatId].unreadCount += 1;
				if (!state.unreadMessages[chatId]?.id) {
					state.unreadMessages[chatId].id = message.sender;
				}
			}
		},
		updateMessageStatus(state, action) {
			const {
				chatId,
				sentTimestamp,
				status,
				messageDeliveredTimestamp,
				messageReadTimestamp,
			} = action.payload;

			// Ensure chatId exists in state.messages
			if (!state.privateMessages[chatId]) return;

			// Update messages under privateMessage only (not unreadMessages)
			const message = state.privateMessages[chatId].messages.find(
				(msg) => msg.sentTime === sentTimestamp
			);

			if (message) {
				message.status = status || message.status || "sent";
				if (messageDeliveredTimestamp)
					message.deliveredTime = messageDeliveredTimestamp;
				if (messageReadTimestamp)
					message.readTime = messageReadTimestamp;
			}
		},
		moveUnreadMessagesToMessages(state, action) {
			const { chatId } = action.payload;
			if (!state.unreadMessages[chatId]) return;

			// Convert Immer Proxies to Plain Objects
			const existingMessages = state.privateMessages[chatId]?.messages
				? [...state.privateMessages[chatId].messages]
				: [];
			const unreadMessages = state.unreadMessages[chatId].messages
				? [...state.unreadMessages[chatId].messages]
				: [];

			// Merge existing and unread messages
			const mergedMessages = [...existingMessages, ...unreadMessages];
			mergedMessages.sort((a, b) => a.sentTime - b.sentTime);

			// Update state with sorted messages
			state.privateMessages[chatId] = {
				...state.privateMessages[chatId],
				messages: mergedMessages,
				latestMessage:
					mergedMessages.length > 0
						? mergedMessages[mergedMessages.length - 1].content
						: state.privateMessages[chatId]?.latestMessage || "",
			};
			// Remove unread messages
			delete state.unreadMessages[chatId];
		},
		addSentMessage(state, action) {
			const { chatId, message } = action.payload;

			if (!state.privateMessages[chatId]) {
				state.privateMessages[chatId] = {
					messages: [],
					latestMessage: "",
					unreadCount: 0,
					id: "",
				};
			}

			state.privateMessages[chatId].messages.push({
				sender: message.participants[0],
				receiver: message.participants[1],
				content: message.message,
				status: message?.status || "sent",
				sentTime: message.sentTimestamp,
				deliveredTime: message?.messageDeliveredTimestamp || "",
				readTime: message?.messageReadTimestamp || "",
			});
			state.privateMessages[chatId].latestMessage = message.message;
			state.privateMessages[chatId].id = message.participants[1];
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchAllPrivateChats.pending, (state) => {
				state.status = "loading";
			})
			.addCase(fetchAllPrivateChats.fulfilled, (state, action) => {
				state.status = "succeeded";
				const { chatPrivateMessagesObject, chatUnreadMessagesObject } =
					action.payload;

				// Reset states
				state.privateMessages = {};
				state.unreadMessages = {};

				// Helper function for processing messages
				const processMessages = (
					messageObject,
					targetState,
					includeUnreadCount
				) => {
					if (!messageObject) return;
					Object.entries(messageObject).forEach(
						([chatId, chatData]) => {
							initializeChatData(
								targetState,
								chatId,
								chatData,
								includeUnreadCount
							);
							sortAndStoreMessages(targetState, chatId, chatData);
							initializePendingChatIds(chatData.id, chatId);
						}
					);
				};

				const initializeChatData = (
					targetState,
					chatId,
					chatData,
					includeUnreadCount
				) => {
					targetState[chatId] = {
						messages: [],
						latestMessage: chatData.latestMessage,
						id: chatData.id,
					};

					if (includeUnreadCount) {
						state.unreadMessages[chatId].unreadCount =
							chatData.unreadCount;
					}
				};

				const sortAndStoreMessages = (
					targetState,
					chatId,
					chatData
				) => {
					chatData.messages
						.sort((a, b) => a.sentTime - b.sentTime)
						.forEach((message) => {
							targetState[chatId].messages.push(message);
						});
				};

				const initializePendingChatIds = (id, chatId) => {
					state.pendingChatIds[id] = chatId;
				};

				// Process private and unread messages
				processMessages(
					chatPrivateMessagesObject,
					state.privateMessages,
					false
				);
				processMessages(
					chatUnreadMessagesObject,
					state.unreadMessages,
					true
				);
			})
			.addCase(fetchAllPrivateChats.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload;
			})
			.addCase(getChatId.fulfilled, (state, action) => {
				const { chatId, tempMessage } = action.payload;
				"Temp Message: ", tempMessage);
				// Prevent duplicate message insertion
				if (!state.privateMessages[chatId]) {
					state.privateMessages[chatId] = {
						messages: [],
						latestMessage: "",
						unreadCount: 0,
					};
				}

				if (
					tempMessage &&
					!state.privateMessages[chatId].messages.some(
						(msg) => msg.sentTimestamp === tempMessage.sentTimestamp
					)
				) {
					state.privateMessages[chatId].messages.push({
						sender: tempMessage.participants[0],
						receiver: tempMessage.participants[1],
						content: tempMessage.message,
						status: tempMessage.status || "sent",
						sentTimestamp: tempMessage.sentTimestamp,
						readTime: "", // Empty initially
						deliveredTime: "", // Empty initially
					});
				}

				state.pendingChatIds[tempMessage.participants[1]] = chatId;
			})
			.addCase(getChatId.rejected, (state, action) => {
				state.error = action.payload;
			});
	},
});

// Export actions and reducer
const { actions, reducer } = messageSlice;
export const {
	addIncomingMessage,
	addSentMessage,
	updateMessageStatus,
	moveUnreadMessagesToMessages,
} = actions;
export default reducer;
