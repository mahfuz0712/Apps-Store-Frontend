import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../apis/v1/v1";
import swal from "sweetalert";

const OTPVerification = () => {
  const [OTP, setOTP] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [remainingTime, setRemainingTime] = useState(120); // 2 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from URL query params or session storage
  const queryParams = new URLSearchParams(location.search);
  const emailFromQuery = queryParams.get("email");
  const Email = emailFromQuery;

  // Timer to unset session variables and navigate to /login after 2 minutes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!canResend) {
        sessionStorage.clear();
        navigate("/login");
      }
    }, 2 * 60 * 1000); // 2 minutes in milliseconds

    // Cleanup the timer when the component unmounts
    return () => clearTimeout(timer);
  }, [navigate, canResend]);

  // Countdown timer logic
  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval); // Stop the interval when time reaches 0
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const handleVerifyAndRegister = async () => {
    // Clear previous errors
    setError("");
    
    if (!Email) {
      setError("Email is required. Please go back to the signup page.");
      return;
    }
    
    if (!OTP || OTP.length !== 6 || !/^\d+$/.test(OTP)) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      const TestUsersURL = import.meta.env.VITE_TEST_USERS;
      setLoading(true);
      const response = await api.post(TestUsersURL, {
        Email: Email,
        OTP: OTP,
      });
      setLoading(false);
      
      if (response.data?.success) {
        swal({
          title: "Registration Successful!",
          text: "Your account has been created successfully. You can now login.",
          icon: "success",
          button: {
            text: "Login Now",
            className: "bg-indigo-600 hover:bg-indigo-700",
          },
        }).then(() => {
          navigate("/login");
        });
      } else {
        setError(response.data.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      setLoading(false);
      setError(
        "Error verifying OTP: " +
          (error.response?.data?.message || error.message || "Unknown error")
      );
    }
  };

  const handleResendOTP = async () => {
    if (!Email) {
      setError("Email is required to resend OTP");
      return;
    }

    try {
      setResendLoading(true);
      const SendOTP = import.meta.env.VITE_SEND_OTP;
      const response = await api.post(SendOTP, {
        Email: Email,
        resend: true,
      });

      if (response.data?.success) {
        // Reset timer
        setRemainingTime(120);
        setCanResend(false);
        
        swal({
          title: "OTP Resent",
          text: "A new OTP has been sent to your email",
          icon: "success",
        });
      } else {
        setError(response.data.message || "Failed to resend OTP");
      }
    } catch (error) {
      setError("Error resending OTP: " + (error.response?.data?.message || error.message));
    } finally {
      setResendLoading(false);
    }
  };

  // Format remaining time as mm:ss
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  // Handle OTP input change with validation
  const handleOTPChange = (e) => {
    const value = e.target.value;
    // Only allow digits and max length of 6
    if (/^\d*$/.test(value) && value.length <= 6) {
      setOTP(value);
      if (error && value.length === 6) {
        setError("");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 pt-20 pb-10">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
            <svg 
              className="w-8 h-8 text-indigo-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Verify Your Email
          </h2>
          <p className="text-gray-600">
            We've sent a 6-digit verification code to
            <br />
            <span className="font-medium text-indigo-600">{Email}</span>
          </p>
        </div>

        <div className="mb-6">
          <input
            type="text"
            value={OTP}
            onChange={handleOTPChange}
            placeholder="Enter 6-digit OTP"
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center text-xl tracking-wider"
            maxLength={6}
          />
          {error && (
            <p className="mt-2 text-sm text-red-600">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </span>
            </p>
          )}
        </div>

        <button
          onClick={handleVerifyAndRegister}
          disabled={loading || OTP.length !== 6}
          className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-sm font-medium rounded-xl transition-all shadow-sm hover:shadow disabled:opacity-70 disabled:cursor-not-allowed mb-4 flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Verifying...
            </>
          ) : (
            "Verify & Complete Registration"
          )}
        </button>

        <div className="text-center">
          <p className={`font-medium ${remainingTime < 30 ? "text-red-500" : "text-gray-600"}`}>
            Time remaining: {formatTime(remainingTime)}
          </p>

          {canResend && (
            <button
              onClick={handleResendOTP}
              disabled={resendLoading}
              className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center justify-center mx-auto"
            >
              {resendLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Resending...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Resend OTP
                </>
              )}
            </button>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            Didn't receive the email? Check your spam folder or{" "}
            <button 
              onClick={() => navigate("/login")}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              try again with a different email
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
