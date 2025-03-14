import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchContacts } from "./contactSlice";
import { fetchAllPrivateChats } from "./messageSlice";
import { fetchAllGroupChat } from "./groupChatSlice";

export const fetchChatLists = createAsyncThunk(
	"chatLists/fetchChatLists",
	async (senderId, { dispatch, getState }) => {
		// Fetch contacts and messages
		await dispatch(fetchContacts());
		await dispatch(fetchAllPrivateChats(senderId));
		await dispatch(fetchAllGroupChat(senderId));

		// Get updated state
		const { contacts } = getState().contacts;
		const { privateMessages, unreadMessages, pendingChatIds } = getState().messages;
		const { groupsInfo, groupMessages, unreadGroupMessages } =
			getState().groupChats;

		const chatList = {};

		//   Process private chats (known & unknown contacts)
		Object.entries(pendingChatIds).forEach(([receiverId, chatId]) => {
			const contact = contacts.find((contact) => contact.receiverId === receiverId);
			const messages = privateMessages[chatId]?.messages || unreadMessages[chatId]?.messages || [];
			
			chatList[receiverId] = {
				name: contact?.contactName || "Unknown Contact",
				profilePhoto: contact?.contactProfilePhoto || "pimg.png",
				latestMessage: messages.length ? messages[messages.length - 1].content : "",
				unreadCount: unreadMessages?.length || 0,
				type: "private",
				latestTimestamp: messages.length ? messages[messages.length - 1].sentTime : "",
			}
		})

		//   Process group chats
		Object.entries(groupsInfo).forEach(([groupId, group]) => {
			const messages = groupMessages[groupId]?.messages || unreadGroupMessages[groupId]?.messages || [];
			chatList[groupId] = {
				name: group.groupName,
				profilePhoto: "gimg.png",
				latestMessage: messages.length
					? messages[messages.length - 1].content
					: "",
				unreadCount: unreadGroupMessages?.length || 0,
				type: "group",
				latestTimestamp: messages.length
					? messages[messages.length - 1].sentTime
					: "",
			};
			
		});

		// Sort chatList by latestTimestamp (descending order)
		const chatOrder = Object.entries(chatList).sort((a, b) => b[1].latestTimestamp - a[1].latestTimestamp).map(([id]) => id);

		return {chatList, chatOrder};
	}
);

const chatListSlice = createSlice({
	name: "chatLists",
	initialState: {
		chatList: {},
		chatOrder:[],
		status: "idle",
		error: null,
	},
	reducers: {
		addChat(state, action) {
			const { chat } = action.payload;
			if (!state.chatList[chat.id]) {
				state.chatList[chat.id]={
					name: "",
					profilePhoto: "",
					latestMessage: "",
					type:"",
				}
			}
			state.chatList[chat.id] = {
				name: chat.name,
				profilePhoto: chat.profilePhoto,
				latestMessage: chat.latestMessage,
				type: chat.type,
			};
			
			if(!state.chatOrder.find(id=> id===chat.id)){
			state.chatOrder.unshift(chat.id);
			}
		},
		updateChatList(state, action) {
			const { message, contacts } = action.payload;
			const chatIndex = !!state.chatList[message.sender];

			if (chatIndex) {
				// If chat already exists,
				//update the latest message
				state.chatList[message.sender].latestMessage = message.content;
				
				// and update the contact name if contactName: Unknown Contact
			} else {
				// Add new chat entry, but check if sender in the message is in contacts
				const existingContact = contacts.find(
					(contact) => contact.receiverId === message.sender
				);

				state.chatList.unshift({
					id: message.sender,
					name: existingContact
						? existingContact.contactName
						: "Unknown Contact",
					profilePhoto: existingContact
						? existingContact.contactProfilePhoto
						: "pimg.jpg",
					latestMessage: message.content,
				});
			}
		},
		updateChatListForUnknownContact(state, action) {
			const { receiverId, contactName, contactProfilePhoto } =
				action.payload;
			// find the chat
			const unknownContact = !!state.chatList[receiverId];
			if (unknownContact) {
				// update the contactName
				unknownContact.contactName = contactName;
				// update the contactProfilePhoto
				unknownContact.contactProfilePhoto = contactProfilePhoto;
			}
		},
		deleteChat(state, action) {
			const { receiverId } = action.payload;
			delete state.chatList[receiverId];
		},
		updateChatOrder(state, action) {
			
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchChatLists.pending, (state) => {
				state.status = "loading";
			})
			.addCase(fetchChatLists.fulfilled, (state, action) => {
				state.status = "succeeded";
				const { chatList, chatOrder } = action.payload;
				state.chatList = chatList;
				state.chatOrder = chatOrder;
			})
			.addCase(fetchChatLists.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message;
			});
	},
});

const { actions, reducer } = chatListSlice;
export const {
	updateChatList,
	deleteChat,
	addChat,
	updateChatListForUnknownContact,
} = actions;
export default reducer;
