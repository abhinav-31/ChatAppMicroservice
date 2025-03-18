import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userSettingService from "../../config/UserSettingServiceAxiosConfig";

export const fetchContacts = createAsyncThunk("contacts/fetchContacts", async () => {
	const response = await userSettingService.get("/contacts/");
	return response.data;
});

const contactSlice = createSlice({
	name: "contacts",
	initialState: {
		contacts: [],
		status: "idle",
		error: null,
	},
	reducers: {
		addContact(state, action) {
			const newContact = action.payload;
			state.contacts.push(newContact);
			
			state.status = "updated";
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchContacts.pending, (state) => {
				state.status = "loading";
			})
			.addCase(fetchContacts.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.contacts = action.payload;
			})
			.addCase(fetchContacts.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message;
			});
	},
});

const { actions, reducer } = contactSlice;
export const { addContact } = actions;
export default reducer;
