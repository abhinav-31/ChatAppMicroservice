import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/userSlice";
import contactReducer from "./slice/contactSlice";
import messageReducer from "./slice/messageSlice";
import chatListReduceer from "./slice/chatListSlice";
import groupChatReducer from "./slice/groupChatSlice";
const store = configureStore({
	reducer: {
		user: userReducer,
		contacts: contactReducer,
		messages: messageReducer,
		chatLists: chatListReduceer,
		groupChats: groupChatReducer,
	},
});

export default store;
