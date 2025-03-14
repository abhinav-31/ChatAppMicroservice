import { Route, Routes } from "react-router";
import "./App.css";
import HomePage from "./pages/HomePage";
import AuthForm from "./components/Authentication/AuthForm";

import { Toaster } from "react-hot-toast";
import Chat from "./components/Chat/Chat";
import OtpVerify from "./components/Authentication/OtpVerify";
import ProfileForm from "./components/Authentication/Profile";

function App() {
	return (
		<>
			<Routes>
				<Route path='/' element={<HomePage />}>
					<Route path='/login' element={<AuthForm />} />
					<Route path='/create_account' element={<AuthForm />} />
					<Route path='/otpVerify' element={<OtpVerify />} />
					<Route path='/profile' element={<ProfileForm />} />
				</Route>
				<Route path='/chat' element={<Chat />} />
			</Routes>
			<Toaster position='top-center' reverseOrder={false} />
		</>
	);
}

export default App;
