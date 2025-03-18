import userSettingService from "../../config/UserSettingServiceAxiosConfig";

const basePath_1 = "auth";
const basePath_2 = "user";
const basePath_3 = "contacts";
// Post Request for Sign-up
export const signup = async (signUpData) => {
	const sub_path = "sign-up";
	try {
		const response = await userSettingService.post(
			`/${basePath_1}/${sub_path}`,
			signUpData
		);
		return response;
	} catch (error) {
		handleError(error, 'signup')
	}
};

// Post Request for Otp Verify
export const otpVerify = async (otpData) => {
	const sub_path = "verify-otp";
	const keepLoggedIn = otpData.keepLoggedIn;
	const otpVerifyBody = { otp: otpData.otp, context: otpData.context };
	try {
		const response = await userSettingService.post(
			`/${basePath_1}/${sub_path}/${keepLoggedIn}`,
			otpVerifyBody
		);
		return response;
	} catch (error) {
			handleError(error, 'otp verify');
	}
};

// Post Request for Saving User: name, about, profile (i am just sending file name)
export const saveUser = async (userSaveData) => {
	const sub_path = "save";
	try {
		await userSettingService.post(
			`/${basePath_2}/${sub_path}`,
			userSaveData
		);
	} catch (error) {
		handleError(error, 'save user data')
	}
};

// Get the user data : username, about, profile
export const getUser = async () => {
	try {
		const response = await userSettingService.get(`/${basePath_2}/`);
		return response;
	} catch (error) {
		handleError(error, 'getting user data');
	}
};

// Update the user data : username, about, profile
export const updateUser = async (updateUserData) => {
	const sub_path = "update-user";
	try {
		const response = await userSettingService.patch(
			`/${basePath_2}/${sub_path}`,
			updateUserData
		);
		return response;
	} catch (error) {
		handleError(error, 'update user data');
	}
};

// Login
export const loginUser = async (loginData) => {
	const sub_path = "login";
	try {
		const response = await userSettingService.post(
			`/${basePath_1}/${sub_path}`,
			loginData
		);
		return response;
	} catch (error) {
		handleError(error, 'user login');
	}
};

// Call Refresh Token Api
export const refreshToken = async () => {
	const sub_path = 'refresh-token';
	try {
		const response = await userSettingService.get(
			`/${basePath_1}/${sub_path}`
		);
		return response;
	} catch (error) {
		handleError(error, 'refresh token');
	}
}

// add contact to the user list
export const saveContact = async (addContactData) => {
	const sub_path = 'addContact';
	try {
		const response = await userSettingService.post(`/${basePath_3}/${sub_path}`, addContactData);
		return response;
	} catch(error) {
		handleError(error, 'Add contact');
	}
}

export const logout = async () => {
	const sub_path = 'logout';
	try {
		const response = await userSettingService.get(`/${basePath_1}/${sub_path}`);
		return response;
	} catch (error) {
		handleError(error, 'Logout');
	}
}

const handleError = (error, apiName) => {
	console.error(
		`Error in ${apiName} call: `,
		error.response ? error.response.data : error.message
	);
	throw error;
}