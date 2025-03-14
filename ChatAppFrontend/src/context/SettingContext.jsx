/* eslint-disable react/prop-types */
import { createContext } from "react";

const SettingContext = createContext();
export const SettingContextProvider = ({ children, value }) => {
	return (
		<SettingContext.Provider value={value}>
			{children}
		</SettingContext.Provider>
	)
}