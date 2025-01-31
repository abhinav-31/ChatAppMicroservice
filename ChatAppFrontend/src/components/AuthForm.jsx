import { useState } from "react";
import { useLocation, useOutletContext } from "react-router-dom";

const AuthForm = () => {
  const location = useLocation();
  const {handleOtpComponent} = useOutletContext();
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  
  const path = location.pathname.split("/").pop();
  const isLogin = path === "login";
  const title = isLogin ? "Sign In" : "Create an Account";

  const handleSubmit = () => {
    console.log(handleOtpComponent);
    handleOtpComponent(true);
    console.log(`${title} form submitted`);
  };

  const handleKeepLoggedIn = ()=>{
    setKeepLoggedIn(true);
  }

  return (
    <div className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-10 lg:p-12 w-full max-w-[90%] sm:max-w-[60%] md:max-w-[40%] lg:max-w-[30%] mx-auto mt-6 border border-gray-200">
      {/* Title */}
      <h2 className="font-bold font-mono text-transparent bg-gradient-to-r from-blue-950 via-cyan-600 to-purple-950 bg-clip-text text-xl sm:text-2xl mb-4 sm:mb-6">
        {title}
      </h2>

      {/* Email Input */}
      <div className="w-full mb-4">
        <label
          className="text-base sm:text-lg font-medium text-gray-700"
          htmlFor="email"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          className="w-full p-2 sm:p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Phone Input */}
      <div className="w-full mb-6">
        <label
          className="text-base sm:text-lg font-medium text-gray-700"
          htmlFor="phone"
        >
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          placeholder="Enter your phone number"
          className="w-full p-2 sm:p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="w-full py-2 sm:py-3 bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-900 text-white font-semibold text-base sm:text-lg rounded-lg shadow-md transform transition duration-300 hover:scale-105 hover:shadow-xl"
      >
        Continue
      </button>
      {isLogin && (
        <div className="flex items-center mt-5 mb-6">
          <input
            type="checkbox"
            id="keepLoggedIn"
            className="mr-2 h-4 w-4 text-blue-600"
            onClick={handleKeepLoggedIn}
          />
          <label htmlFor="keepLoggedIn" className="text-gray-700 text-sm sm:text-base">
            Keep me logged in
          </label>
        </div>
      )}
    </div>
  );
};

export default AuthForm;
