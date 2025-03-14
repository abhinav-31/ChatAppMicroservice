/* eslint-disable react/prop-types */
import { createContext } from "react";

const WebSocketContext = createContext();
export const WebSocketProvider = ({ children, value }) => {
	return (
		<WebSocketContext.Provider value={value}>
			{children}
		</WebSocketContext.Provider>
	)
}

export default WebSocketContext;