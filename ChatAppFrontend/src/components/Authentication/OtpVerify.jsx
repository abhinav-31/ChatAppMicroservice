/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { otpVerify } from "../../services/UserSettingService/UserSettingService";
import { useAuthFlow } from "../../constant/constants";
import {  useNavigate } from "react-router";

const OtpVerify = ({ length = 6 }) => {
	const [otp, setOtp] = useState(Array(length).fill(""));
	const inputRef = useRef([]);
	const { context, resetContext } = useAuthFlow();
	const navigate = useNavigate();

	const handleOtpChange = (e, index) => {
		const value = e.target.value;

		if (otp.every((digit) => digit === "")) {
			// If all boxes are empty and user tries to enter number from middle box
			if (index !== 0) {
				setOtp(Array(length).fill("")); // Reset OTP fields
				inputRef.current[0].focus(); // Move focus to the first box
				return;
			}
		}

		if (value.match(/^\d$/)) {
			const newOtp = [...otp];
			newOtp[index] = value;
			setOtp(newOtp);

			// Move to the next box if available
			if (index < length - 1 && inputRef.current[index + 1]) {
				inputRef.current[index + 1].focus();
			}
		}
	};

	const handleKeyDown = (e, index) => {
		if (e.key === "Backspace") {
			e.preventDefault(); // Prevent default backspace behavior

			const newOtp = [...otp];

			if (newOtp[index] !== "") {
				// If the current box has a digit, delete it and move focus to the previous box
				newOtp[index] = "";
				setOtp(newOtp);
				if (index > 0) {
					inputRef.current[index - 1]?.focus();
				}
			} else {
				// If the current box is empty, move to the previous non-empty box
				let prevIndex = index - 1;
				while (prevIndex >= 0 && newOtp[prevIndex] === "") {
					prevIndex--;
				}
				if (prevIndex >= 0) {
					inputRef.current[prevIndex]?.focus();
				} else {
					// If all boxes are empty and user presses Backspace, move focus to the first box
					inputRef.current[0]?.focus();
				}
			}
		}
	};

	const handleVerify = async () => {
		const keepLoggedIn =
			context === "signup"
				? false
				: sessionStorage.getItem("keepLoggedIn")==='true';
		const otpData = { otp: otp.join(""), context, keepLoggedIn };
		try {
		const response =	await toast
				.promise(otpVerify(otpData), {
					loading: "Verifying otp...",
					success: "OTP verified successfully",
					error: "Error verifying otp",
				});
			if (context === 'signup') {
				navigate('/profile');
			} else if(context === 'login') {
				if (response?.data) {
					sessionStorage.setItem("accessToken", response.data.accessToken);
				}
				navigate('/chat');
				resetContext();
			}
			
		} catch (error) {
			toast.error("Error in otp verification " + error?.message);
			setOtp(Array(length).fill(""));
		}
	};

	return (
		<div className='flex flex-col items-center justify-center  p-6 sm:p-8 md:p-10 lg:p-12 w-full max-w-lg mx-auto mt-6 border border-gray-200 rounded-2xl shadow-xl'>
			<h2 className='font-bold font-mono text-transparent bg-gradient-to-r from-blue-950 via-cyan-600 to-purple-950 bg-clip-text text-2xl mb-6'>
				Enter OTP
			</h2>

			<div className='flex space-x-2 mb-6'>
				{otp.map((digit, index) => (
					<input
						key={index}
						ref={(el) => (inputRef.current[index] = el)}
						type='text'
						value={digit}
						onChange={(e) => handleOtpChange(e, index)}
						onKeyDown={(e) => handleKeyDown(e, index)}
						maxLength='1'
						className='w-10.5 h-12 text-center text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-11.5 md:w-13.5 lg:w-15.5'
					/>
				))}
			</div>

			<button
				onClick={handleVerify}
				disabled={otp.includes("")} // Only enable when all digits are entered
				className={`w-full py-3 font-semibold text-lg rounded-lg shadow-md transition duration-300 cursor-pointer ${
					otp.includes("")
						? "bg-transparent border border-gray-300 text-gray-300 cursor-not-allowed"
						: "text-white bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-900 hover:scale-105 hover:shadow-xl"
				}`}
			>
				Verify
			</button>
		</div>
	);
};

export default OtpVerify;
