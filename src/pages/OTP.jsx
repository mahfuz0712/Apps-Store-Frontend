import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../apis/v1/v1";
import swal from "sweetalert";
const OTPVerification = () => {
  const [OTP, setOTP] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [remainingTime, setRemainingTime] = useState(120); // 2 minutes in seconds
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from URL query params or session storage
  const queryParams = new URLSearchParams(location.search);
  const emailFromQuery = queryParams.get("email");
  const Email = emailFromQuery || sessionStorage.getItem("EmailForSignUp");

  // Timer to unset session variables and navigate to /login after 2 minutes
  useEffect(() => {
    const timer = setTimeout(() => {
      sessionStorage.clear();
      navigate("/login");
    }, 1 * 60 * 1000); // 1 minutes in milliseconds

    // Cleanup the timer when the component unmounts
    return () => clearTimeout(timer);
  }, [navigate]);

  // Countdown timer logic
  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval); // Stop the interval when time reaches 0
          return 0;
        }
        return prev - 1;
      });
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const handleVerifyAndRegister = async () => {
    if (!Email || !OTP) {
      setError("Email and OTP are required");
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
          title: "Congratulations",
          text: response.data.message,
          icon: "success",
          button: {
            text: "ok",
            onClick: navigate("/login"),
          },
        });
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setLoading(false);
      setError(
        "Error verifying OTP: " +
          (error.response ? error.response.data : error.message)
      );
    }
  };

  // Format remaining time as mm:ss
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 pt-20 pb-10">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Verify OTP
        </h2>

        <div className="text-center mb-6">
          <p className="text-gray-600">
            <br />
            an OTP was sent to <span className="font-medium">{Email}</span>
          </p>
        </div>

        <div className="mb-6">
          <input
            type="text"
            value={OTP}
            onChange={(e) => setOTP(e.target.value)}
            placeholder="Enter OTP"
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-xl tracking-wider"
            maxLength={6}
          />
        </div>

        <button
          onClick={handleVerifyAndRegister}
          disabled={loading || remainingTime === 0}
          className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm font-medium rounded-xl transition-all shadow-sm hover:shadow disabled:bg-gray-400 disabled:from-gray-400 disabled:to-gray-500 mb-4"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <div className="text-center">
          <p
            className={`font-medium ${
              remainingTime < 30 ? "text-red-500" : "text-gray-600"
            }`}
          >
            Time remaining: {formatTime(remainingTime)}
          </p>

          {error && <p className="mt-4 text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
