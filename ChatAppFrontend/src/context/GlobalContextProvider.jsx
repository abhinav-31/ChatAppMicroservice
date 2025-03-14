/* eslint-disable react/prop-types */
import { useState, createContext, useMemo } from "react";
import { AuthFlowProvider } from "./AuthFlowContext";
import { WebSocketProvider } from "./WebSocketContext";
import WebSocketManager from "../utility/WebSocketManager.js";
import { BackdropProvider } from "./BackdropContext.jsx";

//   Create Global Context
const GlobalContext = createContext();

//   Export a Hook to Use Global Context

export const GlobalContextProvider = ({ children }) => {
	//   State for Chat and WebSocket Management
	const [tempChat, setTempChat] = useState(null);
	const [selectedChat, setSelectedChat] = useState(null);

	//   Get WebSocket functions from WebSocketManager
	const {
		isConnected,
		sendMessage,
		handleSendMessage,
		sendGroupNotification,
	} = WebSocketManager({
		tempChat,
		setTempChat,
		selectedChat,
	});

	const contextValue = useMemo(
		() => ({ selectedChat, setSelectedChat, setTempChat, tempChat }),
		[selectedChat, tempChat]
	);

	return (
		<GlobalContext.Provider value={contextValue}>
			<WebSocketProvider
				value={{
					isConnected,
					sendMessage,
					handleSendMessage,
					sendGroupNotification,
				}}
			>
				<AuthFlowProvider>
					<BackdropProvider>
						{children}
					</BackdropProvider>
				</AuthFlowProvider>
			</WebSocketProvider>
		</GlobalContext.Provider>
	);
};

export default GlobalContext;
