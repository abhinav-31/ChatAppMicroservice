import chatNotificationService from "../../config/ChatNotificationServiceAxiosConfig";

const basePath_1 = 'private-chat';
const basePath_2 = 'group-chat';
export const fetchPrivateChats = async (senderId) => {
	try {
		const response = await chatNotificationService.get(`/${basePath_1}/${senderId}`);
		return response;
	} catch (error) {
		Error(error, 'fetchPrivateChat');
	}
}

export const fetchChatId = async (senderId, receiverId)=>{
	const sub_path = 'chatId'
	try {
		const response = await chatNotificationService.get(`/${basePath_1}/${sub_path}/${senderId}/${receiverId}`);
		return response;
	} catch (error) {
		Error(error, 'fetchChatId');
	}
}

// create group
export const createGroup = async (groupMetaData) => {
	const sub_path = 'create';
	try {
		const response = await chatNotificationService.post(`/${basePath_2}/${sub_path}`, groupMetaData);
		return response;
	} catch (error) {
		Error(error, 'createGroup');
	}
}


// get all group chats 
export const getAllGroupChats = async (userId) => {
	const sub_path = "getGroupChat";
	try {
		const response = await chatNotificationService.get(`/${basePath_2}/${sub_path}/${userId}`);
		return response.data;
	} catch (error) {
		Error(error, 'GetAllGroupChats')
	}
}


const Error = (error, apiName) => {
	console.error(
		`Error in ${apiName} call: `,
		error.response ? error.response.data : error.message
	);
	throw error;
};

