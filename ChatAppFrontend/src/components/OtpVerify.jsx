/* eslint-disable react/prop-types */
import { useState } from "react";
import toast from "react-hot-toast";

const OtpVerify = ({onVerified}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerified, setIsVerified] = useState(false);
  const [isOtpComplete, setIsOtpComplete] = useState(false); // State to track if OTP is fully entered
  
  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (newOtp.every((digit) => digit !== "")) {
        setIsOtpComplete(true);
      } else {
        setIsOtpComplete(false);
      }

      // Move to the next box automatically
      if (value.length === 1 && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleVerify = () => {
    // Simulating OTP verification
    if (otp.join("") === "123456") {      
      toast.promise(
        new Promise((resolve) => setTimeout(resolve, 3000)),
        {
          loading: 'Saving...',
          success: 'Otp verified successfully',
          error: 'Error verifying OTP',
            }
          ).then(() => {
            setIsVerified(true);
            onVerified();
        }
      );
    //   alert("OTP Verified!");
    } else {
        toast.error("Invalid Otp")
    //   alert("Invalid OTP");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 md:p-10 lg:p-12 w-full max-w-[28%] mx-auto mt-6 border border-gray-200 rounded-2xl shadow-xl">
      <h2 className="font-bold font-mono text-transparent bg-gradient-to-r from-blue-950 via-cyan-600 to-purple-950 bg-clip-text text-2xl mb-6">
        Enter OTP
      </h2>

      <div className="flex space-x-2 mb-6">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="password"
            value={digit}
            onChange={(e) => handleOtpChange(e, index)}
            maxLength="1"
            className="w-12 h-12 text-center text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ))}
      </div>

      <button
        onClick={handleVerify}
        disabled={!isOtpComplete}
        className={`w-full py-3  text-black font-semibold text-lg rounded-lg shadow-md transform transition duration-300 hover:scale-105 hover:shadow-xl  ${isOtpComplete ? "text-white bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-900" : "bg-transparent border border-gray-300 text-gray-300 cursor-not-allowed"}`}
      >
        Verify
      </button>

      {isVerified && <p className="mt-4 text-green-600">OTP Verified Successfully!</p>}
    </div>
  );
};

export default OtpVerify;
