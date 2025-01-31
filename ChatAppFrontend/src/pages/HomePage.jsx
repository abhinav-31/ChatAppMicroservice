import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { SiLetsencrypt } from "react-icons/si";
import { useState } from "react";
import OtpVerify from "../components/OtpVerify";
import ProfileForm from "../components/Profile";

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOtp,setIsOtp] = useState(false);
  const [step, setStep] = useState("otp");
  const [flow, setFlow] = useState("");

  const handleOtpComponent = (e)=>{
    setIsOtp(e);
  }
  const handleOtpVerification = () => {
    // Call this after successful OTP verification
    setStep("profile");
  };
  const handleCreateAccountClick = () => {
    setFlow("create_account");
    navigate("/create_account");
  };

  const handleLoginClick = () => {
    setFlow("sign_in");
    navigate("/login");
  };

  return (
    <div className="bg-white h-screen w-screen flex justify-center items-center overflow-hidden">
      <div className="border border-gray-200 rounded-lg shadow-xl transform scale-105 w-full max-w-[90%] xl:max-w-[94%] h-[92vh]">
        <div className="flex flex-col px-4 py-8 sm:px-6 lg:px-16 xl:px-24 h-full">
          {/* Header Section */}
          <div className="text-center">
            <img
              src="chat_logo.svg"
              alt="Chat Logo"
              className="h-12 w-12 sm:h-16 sm:w-16 mx-auto"
            />
            <h2 className="font-bold font-mono mt-6 sm:mt-8 text-transparent bg-gradient-to-r from-blue-950 via-cyan-600 to-purple-950 bg-clip-text text-2xl sm:text-4xl">
              Welcome to Chat App
            </h2>
          </div>

           {/* Conditional Buttons or OTP Section */}
           {isOtp ? (
            // Render OTP Verification Component when isOtp is true
            <>
            {step === "otp" && <OtpVerify onVerified={handleOtpVerification} />}
            {step === "profile"&& flow === "create_account" && <ProfileForm />}
            </>
          ) : (
            // Render Buttons when isOtp is false
            location.pathname === "/" && (
              <div className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-xl p-6 sm:p-10 lg:p-12 w-full max-w-[90%] sm:max-w-[60%] md:max-w-[40%] lg:max-w-[30%] xl:max-w-[28%] mx-auto mt-8 sm:mt-10 h-auto sm:h-[40%] border border-gray-200">
                <button
                  onClick={handleCreateAccountClick}
                  className="w-full py-3 sm:py-4 bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-900 text-white font-semibold rounded-lg shadow-md transform transition duration-300 hover:scale-105 hover:shadow-xl"
                >
                  Create Account
                </button>
                <button
                  onClick={handleLoginClick}
                  className="mt-4 sm:mt-6 w-full py-3 sm:py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-fuchsia-700 text-white font-semibold rounded-lg shadow-md transform transition duration-300 hover:scale-105 hover:shadow-xl"
                >
                  Sign In
                </button>
              </div>
            )
          )}
          {/* Nested Routes */}
          {!isOtp && <Outlet context={{ handleOtpComponent }} />}
          <div className="flex items-center justify-center p-4 max-w-[28%] mx-auto mt-4 ">
                <SiLetsencrypt className="text-black-600 w-5 h-4 mr-2" />
                <p className="text-gray-700 font-medium text-sm sm:text-base text-center">
                  Your messages are end-to-end encrypted.
                </p>
              </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
