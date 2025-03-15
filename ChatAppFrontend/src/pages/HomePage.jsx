import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { SiLetsencrypt } from "react-icons/si";
import { useAuthFlow } from "../constant/constants";
import { useEffect } from "react";
import { refreshToken } from "../services/UserSettingService/UserSettingService";
import toast from "react-hot-toast";

const HomePage = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { setContext } = useAuthFlow();

	const handleActionClick = (type) => {
		if (type === "create_account") {
			setContext("signup");
			navigate("/create_account");
		} else {
			setContext("login");
			navigate("/login");
		}
	};

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const accessToken = sessionStorage.getItem("accessToken");

				//   If accessToken is present, navigate to chat
				if (accessToken && accessToken !== "undefined") {
					navigate("/chat");
					return;
				}

				const response = await refreshToken();
				sessionStorage.setItem(
					"accessToken",
					response.data.accessToken
				);

				navigate("/chat");
			} catch (error) {
				//   Show "Please Login" only if user has visited before
				if (sessionStorage.getItem("firstVisit")) {
					toast.error("Please Login: ", error);
				} else {
					sessionStorage.setItem("firstVisit", "true");
					toast.success(`Welcome to ChatApp
						Create your account`);
				}

				navigate("/");
			}
		};

		checkAuth();
	}, [navigate]);
	return (
		<div className='bg-white h-screen w-screen flex justify-center items-center overflow-hidden'>
			<div className=' border border-gray-200 rounded-lg shadow-xl transform scale-105 w-full max-w-[90%] xl:max-w-[94%] h-[92vh]'>
				<div className='flex flex-col px-4 py-8 sm:px-6 lg:px-16 xl:px-24 h-full'>
					{/* Header Section */}
					<div className='text-center'>
						<img
							src='chat_logo.svg'
							alt='Chat Logo'
							className='h-12 w-12 sm:h-16 sm:w-16 mx-auto'
						/>
						<h2 className='font-bold font-mono mt-6 sm:mt-8 text-transparent bg-gradient-to-r from-blue-950 via-cyan-600 to-purple-950 bg-clip-text text-2xl sm:text-4xl'>
							Welcome to Chat App
						</h2>
					</div>

					{/* Render Buttons when isOtp is false */}
					{location.pathname === "/" && (
						<div className='flex flex-col items-center justify-center bg-gradient-to-l from-zinc-100 via-blue-100 to-gray-100 rounded-2xl shadow-xl p-6 sm:p-10 lg:p-12 w-full max-w-[90%] sm:max-w-[60%] md:max-w-[40%] lg:max-w-[30%] xl:max-w-[28%] mx-auto mt-8 sm:mt-10 h-auto sm:h-[40%] border border-gray-200'>
							<button
								onClick={() =>
									handleActionClick("create_account")
								}
								className='w-full py-3 sm:py-4 bg-gradient-to-r from-fuchsia-600 via-blue-600 to-cyan-500 text-white font-semibold rounded-lg shadow-md transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer'
							>
								Create Account
							</button>
							<button
								onClick={() => handleActionClick("login")}
								className='mt-4 sm:mt-6 w-full py-3 sm:py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-fuchsia-700 text-white font-semibold rounded-lg shadow-md transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer'
							>
								Sign In
							</button>
						</div>
					)}

					{/* Nested Routes */}
					<Outlet />
					<div className='flex items-center justify-center p-4 max-w-[28%] mx-auto mt-4 '>
						<SiLetsencrypt className='text-black-600 w-5 h-4 mr-2' />
						<p className='text-gray-700 font-medium text-sm sm:text-base text-center'>
							Your messages are end-to-end encrypted.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HomePage;
