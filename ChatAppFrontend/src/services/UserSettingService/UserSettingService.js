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
		console.log("Signup Response: ", response.data);
		return response;
	} catch (error) {
		Error(error, 'signup')
	}
};

// Post Request for Otp Verify
export const otpVerify = async (otpData) => {
	console.log("Otp data: ",otpData);
	const sub_path = "verify-otp";
	const keepLoggedIn = otpData.keepLoggedIn;
	const otpVerifyBody = { otp: otpData.otp, context: otpData.context };
	try {
		const response = await userSettingService.post(
			`/${basePath_1}/${sub_path}/${keepLoggedIn}`,
			otpVerifyBody
		);
		console.log("OTP verify response: ", response.data);
		return response;
	} catch (error) {
			Error(error, 'otp verify');
	}
};

// Post Request for Saving User: name, about, profile (i am just sending file name)
export const saveUser = async (userSaveData) => {
	console.log("User save data: ", userSaveData);
	const sub_path = "save";
	try {
		const response = await userSettingService.post(
			`/${basePath_2}/${sub_path}`,
			userSaveData
		);
		console.info("User Save Response: ", response.data);
	} catch (error) {
		Error(error, 'save user data')
	}
};

// Get the user data : username, about, profile
export const getUser = async () => {
	try {
		const response = await userSettingService.get(`/${basePath_2}/`);
		console.info("User data: ", response);
		return response;
	} catch (error) {
		Error(error, 'getting user data');
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
		console.log("Update user response: " + response.data);
		return response;
	} catch (error) {
		Error(error, 'update user data');
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
		console.log("Login Response: " + response.data);
		return response;
	} catch (error) {
		Error(error, 'user login');
	}
};

// Call Refresh Token Api
export const refreshToken = async () => {
	const sub_path = 'refresh-token';
	try {
		const response = await userSettingService.get(
			`/${basePath_1}/${sub_path}`
		);
		console.log("Refresh Token Response: ", response.data.accessToken);
		return response;
	} catch (error) {
		Error(error, 'refresh token');
	}
}

// add contact to the user list
export const saveContact = async (addContactData) => {
	const sub_path = 'addContact';
	try {
		const response = await userSettingService.post(`/${basePath_3}/${sub_path}`, addContactData);
		console.log("Add contact response: ",response.data);
		return response;
	} catch(error) {
		Error(error, 'Add contact');
	}
}


const Error = (error, apiName) => {
	console.error(
		`Error in ${apiName} call: `,
		error.response ? error.response.data : error.message
	);
	throw error;
}