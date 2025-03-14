/* eslint-disable react/prop-types */
import { createContext, useCallback, useState } from "react";
import useWebSocket from "../hooks/useWebSocket";

const AuthFlowContext = createContext();

export const AuthFlowProvider = ({ children }) => {
	const [flow, setFlow] = useState("");
	const [context, setContext] = useState("");
	const [isOtp, setIsOtp] = useState(false);
	const [step, setStep] = useState("otp");

	useWebSocket();
	
	const resetContext = useCallback(() => {
		setFlow("");
		setContext("");
		setIsOtp(false);
		setStep("otp");
	}, []);

	return (
		<AuthFlowContext.Provider
			value={{
				flow,
				setFlow,
				context,
				setContext,
				isOtp,
				setIsOtp,
				step,
				setStep,
				resetContext,
			}}
		>
			{children}
		</AuthFlowContext.Provider>
	);
};

export default AuthFlowContext;