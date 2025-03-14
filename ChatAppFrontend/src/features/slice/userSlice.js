import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
	name: "user",
	initialState: {},
	reducers: {
		saveUserProfile(state, action) {
			return action.payload;
		},
	},
});

const { actions, reducer } = userSlice;
export const { saveUserProfile } = actions;
export default reducer;
	