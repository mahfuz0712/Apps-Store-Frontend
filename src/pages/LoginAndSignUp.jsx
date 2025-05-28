import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import "../styles/Login.css";

const LoginAndSignUp = () => {
  const navigate = useNavigate();
  const [NameForSignUp, setNameForSignUp] = useState("");
  const [EmailForSignUp, setEmailForSignUp] = useState("");
  const [PasswordForSignUp, setPasswordForSignUp] = useState("");
  const [PhoneForSignUp, setPhoneForSignUp] = useState("");
  const [EmailForLogin, setEmailForLogin] = useState("");
  const [PasswordForLogin, setPasswordForLogin] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const SignUpHandler = async (event) => {
    // Prevents form from refreshing the page
    event.preventDefault();
    if (
      !EmailForSignUp ||
      !NameForSignUp ||
      !PasswordForSignUp ||
      !PhoneForSignUp
    ) {
      return swal({
        title: "Error",
        text: "Please fill in all fields",
        icon: "error",
      });
    }
    // Generate 6 digit otp at backend and send to this Name & Email
    try {
      const postData = {
        Name: NameForSignUp,
        Email: EmailForSignUp,
        Phone: PhoneForSignUp,
      };
      const sendOtpUrl = import.meta.env.VITE_SEND_OTP;
      const OTPresponse = await axios.post(sendOtpUrl, postData);
      if (OTPresponse.data.success) {
        // Redirect to the otp page after 10 milie seconds if the otp is sent
        setTimeout(() => {
          sessionStorage.setItem("NameForSignUp", NameForSignUp);
          sessionStorage.setItem("EmailForSignUp", EmailForSignUp);
          sessionStorage.setItem("PhoneForSignUp", PhoneForSignUp);
          sessionStorage.setItem("PasswordForSignUp", PasswordForSignUp);
          sessionStorage.setItem("OtpSent", true);
          navigate("/otp"); // replace "/otp" with your desired route
        }, 10);
      } else {
        swal({
          title: "Error",
          text: OTPresponse.data.message,
          icon: "error",
        });
      }
    } catch (error) {
      // openModal("Cound not connect to server", error);
      swal({
        title: "Error",
        text: `Could not connect to server: ${error}`,
        icon: "error",
      });
    }
  };

  const LoginHandler = async (event) => {
    event.preventDefault(); // Prevents form from refreshing the page
    const requestData = {
      Email: EmailForLogin,
      Password: PasswordForLogin,
    };
    if (!EmailForLogin && !PasswordForLogin) {
      return swal({
        title: "Error",
        text: "Email and Password both are required",
        icon: "error",
      });
    }
    if (!EmailForLogin) {
      return swal({
        title: "Error",
        text: "Email is required",
        icon: "error",
      });
    }
    if (!PasswordForLogin) {
      return swal({
        title: "Error",
        text: "Password is required",
        icon: "error",
      });
    }
  
    const loginUrl = import.meta.env.VITE_LOGIN;
    try {
      const response = await axios.post(loginUrl, requestData);
      if (response.data.success) {
        // Example after successful login
        const userName = response.data.user.name;
        const userEmail = response.data.user.email;
        const userPhone = response.data.user.phone;
        const userAvatar = response.data.user.avatar;
        const userCoverImage = response.data.user.coverImage;
        const userRole = response.data.user.role;
        const userCreated_at = response.data.user.created_at;
        const userUpdated_at = response.data.user.updated_at;
        const userGitToken = response.data.user.git_token;
        // Save user data to local storage or session storage
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: userName,
            email: userEmail,
            phone: userPhone,
            avatar: userAvatar,
            coverImage: userCoverImage,
            role: userRole,
            created_at: userCreated_at,
            updated_at: userUpdated_at,
            git_token: userGitToken,
          })
        );
        sessionStorage.setItem("isLoggedIn", "true");
        navigate("/");
      } else {
        swal({
          title: "Failed Login",
          text: response.data.message,
          icon: "error",
        });
      }
    } catch (error) {
      swal({
        title: "Error",
        text: `Could not connect to the server ${error}`,
        icon: "error",
      });
    }
  };

  return (
    <div className={`container ${isSignUp ? "right-panel-active" : ""}`}>
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>
              To keep connected with us please login with your personal info
            </p>
            <button className="ghost" onClick={() => setIsSignUp(false)}>
              Login
            </button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Hello</h1>
            <p>Enter your personal details and start journey with us</p>
            <button className="ghost" onClick={() => setIsSignUp(true)}>
              Sign Up
            </button>
          </div>
        </div>
      </div>

      <div className="form-container sign-in-container">
        <form onSubmit={LoginHandler}>
          <h1>Login</h1>
          <input
            type="email"
            placeholder="Email"
            value={EmailForLogin}
            onChange={(e) => setEmailForLogin(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={PasswordForLogin}
            onChange={(e) => setPasswordForLogin(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      </div>

      <div className="form-container sign-up-container">
        <form onSubmit={SignUpHandler}>
          <h1>Create Account</h1>
          <input
            type="text"
            placeholder="Name"
            value={NameForSignUp}
            onChange={(e) => setNameForSignUp(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={EmailForSignUp}
            onChange={(e) => setEmailForSignUp(e.target.value)}
          />
          <input
            type="text"
            placeholder="Contact"
            maxLength={11}
            value={PhoneForSignUp}
            onChange={(e) => setPhoneForSignUp(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={PasswordForSignUp}
            onChange={(e) => setPasswordForSignUp(e.target.value)}
          />
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default LoginAndSignUp;
