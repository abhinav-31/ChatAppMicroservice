import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
	loginUser,
	signup,
} from "../../services/UserSettingService/UserSettingServiceAuth";
import { useAuthFlow } from "../../constant/constants";

const AuthForm = () => {
	const [email, setEmail] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const { context } = useAuthFlow();
	const title = context === "signup" ? "create_account" : "login";
	const isLogin = context === 'login';
	const [isSubmitting, setIsSubmitting] = useState(false);

	const navigate = useNavigate();

	const handleContinue = async () => {
		if (title !== "login" && !email) {
			toast.error("Please fill email");
			return;
		}
		if (!phoneNumber) {
			toast.error("Please fill phonenumber");
			return;
		}
		setIsSubmitting(true);

		const formattedNumber = phoneNumber.startsWith("+91")
			? phoneNumber
			: `+91${phoneNumber}`;
		try {
			// signup
			if (title === "create_account") {
				const signupData = {
					email,
					phoneNumber: formattedNumber,
				};
				const signUpResponse = await signup(signupData);
				toast.success(signUpResponse.data);
			} else if (title === "login") {
				const loginData = {
					phoneNumber: formattedNumber,
				};
				const loginResponse = await loginUser(loginData);
				toast.success(loginResponse.data);
			}
			navigate("/otpVerify");
			// handleOtpComponent(true);
		} catch (error) {
			toast.error("Error: " + error.message);
			// reset the fields
			setEmail("");
			setPhoneNumber("");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleKeepLoggedIn = (event) => {
		const isChecked = event.target.checked;
		if (isChecked) {
			sessionStorage.setItem("keepLoggedIn", "true"); // Store 'true' in sessionStorage
		} else {
			sessionStorage.removeItem("keepLoggedIn"); // Remove the key if unchecked
		}
	};
	useEffect(() => {
		console.log("Set Title: " + title);
	}, []);
	return (
		<div className='flex flex-col items-center justify-center bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-10 lg:p-12 w-full max-w-[90%] sm:max-w-[60%] md:max-w-[40%] lg:max-w-[30%] mx-auto mt-6 border border-gray-200'>
			{/* Title */}
			<h2 className='mb-4 font-mono text-xl font-bold text-transparent bg-gradient-to-r from-blue-950 via-cyan-600 to-purple-950 bg-clip-text sm:text-2xl sm:mb-6'>
				{title}
			</h2>

			{/* Email Input */}
			<div
				className='w-full mb-4'
				hidden={title === "login" ? true : false}
			>
				<label
					className='text-base font-medium text-gray-700 sm:text-lg'
					htmlFor='email'
				>
					Email
				</label>
				<input
					type='email'
					id='email'
					name='email'
					placeholder='Enter your email'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className='w-full p-2 mt-2 border border-gray-300 rounded-lg sm:p-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
				/>
			</div>

			{/* Phone Input */}
			<div className='w-full mb-6'>
				<label
					className='text-base font-medium text-gray-700 sm:text-lg'
					htmlFor='phone'
				>
					Phone Number
				</label>
				<input
					type='tel'
					id='phone'
					name='phone'
					value={phoneNumber}
					onChange={(e) => setPhoneNumber(e.target.value)}
					placeholder='Enter your phone number'
					className='w-full p-2 mt-2 border border-gray-300 rounded-lg sm:p-3 focus:outline-none focus:ring-2 focus:ring-green-500'
				/>
			</div>

			{/* Submit Button */}
			<button
				disabled={isSubmitting}
				onClick={handleContinue}
				className='w-full py-2 text-base font-semibold text-white transition duration-300 transform rounded-lg shadow-md cursor-pointer sm:py-3 bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-900 sm:text-lg hover:scale-105 hover:shadow-xl'
			>
				{isSubmitting ? "Processing..." : "Continue"}
			</button>
			{isLogin && (
				<div className='flex items-center mt-5 mb-6'>
					<input
						type='checkbox'
						id='keepLoggedIn'
						className='w-4 h-4 mr-2 text-blue-600'
						onClick={handleKeepLoggedIn}
					/>
					<label
						htmlFor='keepLoggedIn'
						className='text-sm text-gray-700 sm:text-base'
					>
						Keep me logged in
					</label>
				</div>
			)}
		</div>
	);
};

export default AuthForm;
