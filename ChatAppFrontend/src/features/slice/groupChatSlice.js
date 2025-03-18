import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import {
	createGroup,
	getAllGroupChats,
} from "../../services/ChatNotificationService/ChatNotificationService";

//   Thunk to create a new group chat
export const createGroupChat = createAsyncThunk(
	"group/createGroupChat",
	async (groupMetaData, { rejectWithValue }) => {
		try {
			const response = await createGroup(groupMetaData);
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

//   Thunk to fetch all group chats
export const fetchAllGroupChat = createAsyncThunk(
	"groupChats/fetchAllGroupChat",
	async (senderId, { rejectWithValue }) => {
		try {
			const groupChats = await getAllGroupChats(senderId);

			//   Use reduce for better performance
			const groupChatData = groupChats.reduce((acc, groupChat) => {
				const {
					groupId,
					groupName,
					groupAdmin,
					groupMembers,
					groupMessages,
					unreadGroupMessages,
				} = groupChat;

				acc[groupId] = {
					groupName,
					groupAdmin,
					groupMembers,
					groupMessages: groupMessages.map(
						({ sender, content, sentTimestamp, seenBy }) => ({
							sender,
							content,
							sentTime: sentTimestamp,
							seenBy,
						})
					),
					unreadGroupMessages: unreadGroupMessages.map(
						({ sender, content, sentTimestamp, seenBy }) => ({
							sender,
							content,
							sentTime: sentTimestamp,
							seenBy,
						})
					),
					latestMessage:
						unreadGroupMessages.length > 0
							? unreadGroupMessages[
									unreadGroupMessages.length - 1
							  ].content //   Prioritize unread messages
							: groupMessages.length > 0
							? groupMessages[groupMessages.length - 1].content
							: "",
				};

				return acc;
			}, {});
			return groupChatData;
		} catch (error) {
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

//   Redux Slice
const groupChatSlice = createSlice({
	name: "groupChats",
	initialState: {
		groupMessages: {}, // Stores messages for each group
		unreadGroupMessages: {}, // Stores unread messages
		groupsInfo: {}, // Stores group metadata
		status: "idle",
		error: null,
	},
	reducers: {
		//   Add a sent message to the Redux state
		addGroupSendMessage(state, action) {
			const { groupId, message } = action.payload;
			if (!state.groupMessages[groupId]) {
				state.groupMessages[groupId] = {
					messages: [],
					latestMessage: "",
				};
			}
			state.groupMessages[groupId].messages.push({
				sender: message.sender,
				content: message.content,
				sentTime: message.sentTimestamp,
			});
			state.groupMessages[groupId].latestMessage = message.content;
		},

		//   Handle incoming messages
		incomingGroupMessage(state, action) {
			const { groupId, isGroupOpen, incomingMessage } = action.payload;

			if (!state.groupMessages[groupId]) {
				state.groupMessages[groupId] = {
					messages: [],
					latestMessage: "",
				};
			}

			if (isGroupOpen) {
				//   Directly store message if group is open
				state.groupMessages[groupId].messages.push({
					sender: incomingMessage.sender,
					content: incomingMessage.content,
					sentTime: incomingMessage.sentTimestamp || "",
				});
				state.groupMessages[groupId].latestMessage =
					incomingMessage.content;
			} else {
				//   Store unread messages separately
				if (!state.unreadGroupMessages[groupId]) {
					state.unreadGroupMessages[groupId] = {
						messages: [],
						unreadCount: 0,
						latestMessage: "",
					};
				}
				state.unreadGroupMessages[groupId].messages.push({
					sender: incomingMessage.sender,
					content: incomingMessage.content,
					sentTime: incomingMessage.sentTimestamp || "",
				});
				state.unreadGroupMessages[groupId].unreadCount += 1;
				state.unreadGroupMessages[groupId].latestMessage =
					incomingMessage.content;
			}

			//   Update latest message under `groupsInfo`
			if (!state.groupsInfo[groupId]) {
				state.groupsInfo[groupId] = {
					groupName: "",
					latestMessage: "",
				};
			}
			state.groupsInfo[groupId].latestMessage = incomingMessage.content;
		},

		//   Move unread messages to main chat messages
		moveUnreadGroupMessagesToGroupMessages(state, action) {
			const { groupId } = action.payload;
			const existingMessages = current(
				state.groupMessages[groupId]?.messages || []
			);
			const unreadMessages = current(
				state.unreadGroupMessages[groupId]?.messages || []
			);

			//   Merge and sort messages
			const mergedMessages = [
				...existingMessages,
				...unreadMessages,
			].sort((a, b) => a.sentTime - b.sentTime);

			//   Update state
			state.groupMessages[groupId] = {
				...state.groupMessages[groupId],
				messages: mergedMessages,
				latestMessage:
					mergedMessages.length > 0
						? mergedMessages[mergedMessages.length - 1].content
						: state.groupMessages[groupId]?.latestMessage || "",
			};
			delete state.unreadGroupMessages[groupId]; //   Remove unread messages
		},
	},

	//   Async Thunks Handling
	extraReducers: (builder) => {
		builder
			.addCase(createGroupChat.pending, (state) => {
				state.status = "loading";
			})
			.addCase(createGroupChat.fulfilled, (state, action) => {
				state.status = "succeeded";
				const { groupId, groupAdmin, groupName, members } =
					action.payload;

				state.groupsInfo[groupId] = {
					groupAdmin: groupAdmin,
					groupName: groupName,
					groupMembers: members,
				};
			})
			.addCase(fetchAllGroupChat.pending, (state) => {
				state.status = "loading";
			})
			.addCase(fetchAllGroupChat.fulfilled, (state, action) => {
				state.status = "succeeded";

				Object.entries(action.payload).forEach(
					([groupId, groupChatData]) => {
						//   Sort messages by sentTime
						const sortedGroupMessages = [
							...groupChatData.groupMessages,
						].sort((a, b) => a.sentTime - b.sentTime);
						const sortedUnreadMessages = [
							...groupChatData.unreadGroupMessages,
						].sort((a, b) => a.sentTime - b.sentTime);

						//   Extract latest messages efficiently
						const latestGroupMessage =
							sortedGroupMessages.length > 0
								? sortedGroupMessages[
										sortedGroupMessages.length - 1
								  ].content
								: "";

						const latestUnreadMessage =
							sortedUnreadMessages.length > 0
								? sortedUnreadMessages[
										sortedUnreadMessages.length - 1
								  ].content
								: "";

						//   Store group messages **only if they exist**
						if (sortedGroupMessages.length > 0) {
							state.groupMessages[groupId] = {
								messages: sortedGroupMessages,
								latestMessage: latestGroupMessage,
							};
						}

						//   Store unread messages **only if they exist**
						if (sortedUnreadMessages.length > 0) {
							state.unreadGroupMessages[groupId] = {
								messages: sortedUnreadMessages,
								latestMessage: latestUnreadMessage,
								unreadCount: sortedUnreadMessages.length,
							};
						}

						//   Store group metadata
						state.groupsInfo[groupId] = {
							groupName: groupChatData.groupName,
							groupAdmin: groupChatData.groupAdmin,
							groupMembers: groupChatData.groupMembers,
							latestMessage: latestGroupMessage, // Ensuring consistency
						};
					}
				);
			});
	},
});

//   Export actions & reducer
export const {
	addGroupSendMessage,
	incomingGroupMessage,
	moveUnreadGroupMessagesToGroupMessages,
} = groupChatSlice.actions;
export default groupChatSlice.reducer;
