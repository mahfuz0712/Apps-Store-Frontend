import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/OTP.css";

const OTPVerification = () => {
  const [OTP, setOTP] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [remainingTime, setRemainingTime] = useState(120); // 2 minutes in seconds
  const navigate = useNavigate();
  const Name = sessionStorage.getItem("NameForSignUp");
  const Email = sessionStorage.getItem("EmailForSignUp");
  const Phone = sessionStorage.getItem("PhoneForSignUp");
  const Password = sessionStorage.getItem("PasswordForSignUp");

  // Timer to unset session variables and navigate to /login after 2 minutes
  useEffect(() => {
    const timer = setTimeout(() => {
      sessionStorage.clear();
      navigate("/login");
    }, 2 * 60 * 1000); // 2 minutes in milliseconds

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
    if (!Name || !Email || !Phone || !Password || !OTP) {
      setError("All fields are required");
      return;
    }
    try {
      const postData = {
        Name: Name,
        Email: Email,
        Phone: Phone,
        Password: Password,
        OTP: OTP,
      };
      const registerURL = import.meta.env.VITE_REGISTER;
      setLoading(true);
      const response = await axios.post(registerURL, postData);
      setLoading(false);
      if (response.data.success) {
        console.log(response.data.message);
        navigate("/login");
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setLoading(false);
      setError("Error verifying OTP: " + (error.response ? error.response.data : error.message));
    }
  };

  // Format remaining time as mm:ss
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <div>
      <div className="otp-container">
        <h2>Verify OTP</h2>
        <p className="otp-owner-info">Hi {Name} <br />an OTP was sent to {Email}</p>
        <input
          type="text"
          className="otp-input"
          value={OTP}
          onChange={(e) => setOTP(e.target.value)}
          placeholder="Enter OTP"
        />
        <button className="otp-button" onClick={handleVerifyAndRegister} disabled={loading}>
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
        <p className="timer-message">Time remaining: {formatTime(remainingTime)}</p>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default OTPVerification;
