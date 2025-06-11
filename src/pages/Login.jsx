import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../apis/v1/v1";
import swal from "sweetalert";
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  Gift,
  ArrowRight,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [emailForLogin, setEmailForLogin] = useState("");
  const [passwordForLogin, setPasswordForLogin] = useState("");
  const [loading, setLoading] = useState(false);

  // Sign Up Modal States
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [Name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [PhoneNumber, setPhoneNumber] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState("");

  // Developer Application Modal States
  const [showDevModal, setShowDevModal] = useState(false);
  const [fullName, setFullName] = useState("");
  const [devEmail, setDevEmail] = useState("");
  const [devPhone, setDevPhone] = useState("");
  const [transactionID, setTransactionID] = useState("");

  // Disable body scroll when modal is open
  useEffect(() => {
    if (showSignUpModal || showDevModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showSignUpModal, showDevModal]);

  const loginHandler = async (event) => {
    event.preventDefault();

    switch (true) {
      case !emailForLogin && !passwordForLogin:
        return swal({
          title: "Error",
          text: "Email and Password both are required",
          icon: "error",
        });

      case !emailForLogin:
        return swal({
          title: "Error",
          text: "Email is required",
          icon: "error",
        });

      case !passwordForLogin:
        return swal({
          title: "Error",
          text: "Password is required",
          icon: "error",
        });

      default:
        try {
          setLoading(true);
          const result = await login(emailForLogin, passwordForLogin);

          if (result.success) {
            // Navigate based on role
            if (result.role === "Admin" || result.role === "admin") {
                navigate("/admin");
            } else if (result.role === "Developer" || result.role === "developer") {
                navigate("/developer/dashboard");
              } else {
                navigate("/");
            }
          } else {
            swal({
              title: "Login failed",
              text: result.message || "Authentication failed",
              icon: "error",
            });
          }
        } catch (error) {
          swal({
            title: "Error",
            text: `Could not connect to the server: ${error.message}`,
            icon: "error",
          });
        } finally {
          setLoading(false);
        }
    }
  };

  // Password strength checker
  const checkPasswordStrength = (password) => {
    let strength = 0;
    let feedback = "";

    if (password.length >= 8) {
      strength += 1;
    } else {
      feedback = "Password should be at least 8 characters long";
      setPasswordStrength(strength);
      setPasswordFeedback(feedback);
      return;
    }

    if (/[A-Z]/.test(password)) {
      strength += 1;
    } else {
      feedback = "Add an uppercase letter";
      setPasswordStrength(strength);
      setPasswordFeedback(feedback);
      return;
    }

    if (/[a-z]/.test(password)) {
      strength += 1;
    } else {
      feedback = "Add a lowercase letter";
      setPasswordStrength(strength);
      setPasswordFeedback(feedback);
      return;
    }

    if (/[0-9]/.test(password)) {
      strength += 1;
    } else {
      feedback = "Add a number";
      setPasswordStrength(strength);
      setPasswordFeedback(feedback);
      return;
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      strength += 1;
    } else {
      feedback = "Add a special character";
      setPasswordStrength(strength);
      setPasswordFeedback(feedback);
      return;
    }

    // Set feedback based on final strength
    if (strength <= 2) {
      feedback = "Weak password";
    } else if (strength <= 4) {
      feedback = "Medium strength password";
    } else {
      feedback = "Strong password";
    }

    setPasswordStrength(strength);
    setPasswordFeedback(feedback);
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (newPassword) {
      checkPasswordStrength(newPassword);
    } else {
      setPasswordStrength(0);
      setPasswordFeedback("");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Enhanced validation
    if (!Name.trim()) {
      return swal({
        title: "Error",
        text: "Please enter your full name",
        icon: "error",
      });
    }

    if (!Email.trim()) {
      return swal({
        title: "Error",
        text: "Please enter your email address",
        icon: "error",
      });
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email)) {
      return swal({
        title: "Error",
        text: "Please enter a valid email address",
        icon: "error",
      });
    }

    if (!PhoneNumber.trim()) {
      return swal({
        title: "Error",
        text: "Please enter your phone number",
        icon: "error",
      });
    }

    // Phone number validation for Bangladesh (11 digits starting with 01)
    const phoneRegex = /^01\d{9}$/;
    if (!phoneRegex.test(PhoneNumber)) {
      return swal({
        title: "Error",
        text: "Please enter a valid phone number (e.g., 01XXXXXXXXX)",
        icon: "error",
      });
    }

    if (!Password) {
      return swal({
        title: "Error",
        text: "Please enter a password",
        icon: "error",
      });
    }

    // Password strength validation
    if (passwordStrength < 3) {
      return swal({
        title: "Weak Password",
        text: `Please create a stronger password. ${passwordFeedback}`,
        icon: "warning",
      });
    }

    if (Password !== ConfirmPassword) {
      return swal({
        title: "Error",
        text: "Passwords do not match",
        icon: "error",
      });
    }

    try {
      setLoading(true);
      const SendOTP = import.meta.env.VITE_SEND_OTP;
      const response = await api.post(SendOTP, {
        Name: Name,
        Email: Email,
        Phone: PhoneNumber,
        Password: Password,
      });

      if (response.data?.success) {
        // Show success message before redirecting
        swal({
          title: "Success!",
          text: "OTP has been sent to your email. Please verify to complete registration.",
          icon: "success",
          buttons: {
            confirm: {
              text: "Verify Now",
              value: true,
              visible: true,
              className: "bg-indigo-600 hover:bg-indigo-700",
              closeModal: true,
            },
          },
        }).then(() => {
          setShowSignUpModal(false);
          // Redirect to OTP verification
          navigate(`/otp?email=${Email}`);
        });
      } else {
        swal({
          title: "Registration Failed",
          text: response.data.message || "Could not send OTP. Please try again.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Signup error:", error);
      swal({
        title: "Error",
        text: error.response?.data?.message || "Could not connect to the server. Please try again later.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDevApplication = async (e) => {
    e.preventDefault();

    if (!fullName || !devEmail || !devPhone || !transactionID) {
      return toast.error("Please fill in all fields");
    }

    setLoading(true);
    try {
      // Implement your developer application logic here
      const CreateApplicantURl = import.meta.env.VITE_CREATE_APPLICANT;
      const response = await api.post(CreateApplicantURl, {
        Name: fullName,
        Email: devEmail,
        Phone: devPhone,
        BkashTransactionID: transactionID,
        Applied: new Date(),
      });
      if (!response.data.success) {
        return swal({
          title: "Application failed",
          text: response.data.message,
          icon: "error",
        });
      }
      // Show success message with SweetAlert
      swal({
        title: "Application Submitted!",
        text: "Your application will be reviewed and you will be notified within 72 hours via email. If you don't receive an email from us within this time, you will be refunded immediately.",
        icon: "success",
        buttons: {
          confirm: {
            text: "Got it!",
            value: true,
            visible: true,
            className: "bg-indigo-600 hover:bg-indigo-700",
            closeModal: true,
          },
        },
      });

      setShowDevModal(false);

      // Reset form
      setFullName("");
      setDevEmail("");
      setDevPhone("");
      setTransactionID("");
    } catch (error) {
      console.error("Developer application error:", error);
      toast.error("Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 pt-20 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-2">
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account to continue
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={loginHandler}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {Mail && <Mail className="h-5 w-5 text-gray-400" />}
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={emailForLogin}
                  onChange={(e) => setEmailForLogin(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {Lock && <Lock className="h-5 w-5 text-gray-400" />}
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={passwordForLogin}
                  onChange={(e) => setPasswordForLogin(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/reset-password"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                isLoading={loading}
                fullWidth
                rightIcon={
                  ArrowRight ? <ArrowRight className="h-4 w-4" /> : null
                }
              >
                Sign in
              </Button>
            </div>
          </form>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={() => setShowSignUpModal(true)}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>

      {/* Sign Up Modal */}
      {showSignUpModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm bg-white/30">
          <div className="bg-white p-0 rounded-xl shadow-2xl w-full max-w-4xl z-10 animate-fade-in overflow-hidden">
            {/* Modal Header with Gradient */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-700 px-8 py-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  {User && <User className="h-6 w-6 mr-3" />}
                  Create an Account
                </h2>
                <button
                  onClick={() => setShowSignUpModal(false)}
                  className="text-white/80 hover:text-white focus:outline-none bg-white/10 hover:bg-white/20 rounded-full p-1 transition-colors"
                >
                  {X && <X className="w-6 h-6" />}
                </button>
              </div>
              <p className="text-indigo-100 mt-2 max-w-xl">
                Join Mahfuz's Apps Store to download and manage your favorite
                applications
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              {/* Benefits Panel - Left Side */}
              <div className="bg-indigo-50 p-6 md:p-8">
                <div className="sticky top-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Account Benefits
                  </h3>

                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 bg-indigo-100 rounded-full p-1 mt-1">
                        <svg
                          className="h-5 w-5 text-indigo-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-900">
                          Download Apps
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">
                          Access all applications in our store
                        </p>
                      </div>
                    </li>

                    <li className="flex items-start">
                      <div className="flex-shrink-0 bg-indigo-100 rounded-full p-1 mt-1">
                        <svg
                          className="h-5 w-5 text-indigo-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-900">
                          Save Favorites
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">
                          Bookmark apps you love for quick access
                        </p>
                      </div>
                    </li>

                    <li className="flex items-start">
                      <div className="flex-shrink-0 bg-indigo-100 rounded-full p-1 mt-1">
                        <svg
                          className="h-5 w-5 text-indigo-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-900">
                          Rate & Review
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">
                          Share your experience with the community
                        </p>
                      </div>
                    </li>

                    <li className="flex items-start">
                      <div className="flex-shrink-0 bg-indigo-100 rounded-full p-1 mt-1">
                        <svg
                          className="h-5 w-5 text-indigo-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-900">
                          Early Access
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">
                          Get updates about new releases first
                        </p>
                      </div>
                    </li>
                  </ul>

                  <div className="mt-8 p-4 bg-white rounded-lg border border-indigo-100 shadow-sm">
                    <h4 className="text-sm font-medium text-gray-900 flex items-center">
                      <svg
                        className="h-5 w-5 text-indigo-600 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Are you a developer?
                    </h4>
                    <p className="text-xs text-gray-600 mt-2">
                      If you want to publish your apps on our platform, you can
                      <button
                        type="button"
                        onClick={() => {
                          setShowSignUpModal(false);
                          setShowDevModal(true);
                        }}
                        className="ml-1 font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        apply for a developer account
                      </button>
                      instead.
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Panel - Right Side */}
              <div className="md:col-span-2 p-6 md:p-8 bg-white">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Your Information
                </h3>

                <form onSubmit={handleSignUp} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="relative">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Full Name
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          {User && <User className="h-5 w-5 text-gray-400" />}
                        </div>
                        <input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={Name}
                          onChange={(e) => setName(e.target.value)}
                          className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <label
                        htmlFor="signup-email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email Address
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          {Mail && <Mail className="h-5 w-5 text-gray-400" />}
                        </div>
                        <input
                          id="signup-email"
                          type="email"
                          placeholder="you@example.com"
                          value={Email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone Number
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {Phone && <Phone className="h-5 w-5 text-gray-400" />}
                      </div>
                      <input
                        id="phone"
                        type="text"
                        placeholder="01XXXXXXXXX"
                        value={PhoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="relative">
                      <label
                        htmlFor="signup-password"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Password
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          {Lock && <Lock className="h-5 w-5 text-gray-400" />}
                        </div>
                        <div className="space-y-1">
                          <input
                            id="signup-password"
                            type="password"
                            placeholder="Create a password"
                            value={Password}
                            onChange={handlePasswordChange}
                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                          />
                          {Password && (
                            <>
                              <div className="flex w-full h-1 mt-1 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${
                                    passwordStrength <= 2
                                      ? "bg-red-500"
                                      : passwordStrength <= 4
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                                  }`}
                                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                                ></div>
                              </div>
                              <p className={`text-xs ${
                                passwordStrength <= 2
                                  ? "text-red-500"
                                  : passwordStrength <= 4
                                  ? "text-yellow-500"
                                  : "text-green-500"
                              }`}>
                                {passwordFeedback}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="relative">
                      <label
                        htmlFor="confirm-password"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Confirm Password
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          {Lock && <Lock className="h-5 w-5 text-gray-400" />}
                        </div>
                        <input
                          id="confirm-password"
                          type="password"
                          placeholder="Confirm your password"
                          value={ConfirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg mt-6">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="privacy"
                          name="privacy"
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          required
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="privacy"
                          className="font-medium text-gray-700"
                        >
                          I agree to the privacy policy
                        </label>
                        <p className="text-gray-500">
                          By signing up, you agree to our{" "}
                          <Link to="/terms" className="text-indigo-600">
                            terms of service
                          </Link>{" "}
                          and{" "}
                          <Link to="/privacy" className="text-indigo-600">
                            privacy policy
                          </Link>
                          .
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowSignUpModal(false)}
                      className="mr-3"
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      isLoading={loading}
                      rightIcon={loading ? null : <ArrowRight className="h-4 w-4" />}
                    >
                      {loading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Developer Application Modal */}
      {showDevModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm bg-white/30">
          <div className="bg-white p-0 rounded-xl shadow-2xl w-full max-w-4xl z-10 animate-fade-in overflow-hidden">
            {/* Modal Header with Gradient */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-700 px-8 py-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  {Gift && <Gift className="h-6 w-6 mr-3" />}
                  Developer Application
                </h2>
                <button
                  onClick={() => setShowDevModal(false)}
                  className="text-white/80 hover:text-white focus:outline-none bg-white/10 hover:bg-white/20 rounded-full p-1 transition-colors"
                >
                  {X && <X className="w-6 h-6" />}
                </button>
              </div>
              <p className="text-indigo-100 mt-2 max-w-xl">
                Join our developer community and start publishing your apps on
                Mahfuz's Apps Store
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              {/* Instructions Panel - Left Side */}
              <div className="bg-indigo-50 p-6 md:p-8">
                <div className="sticky top-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                    <span className="bg-indigo-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm mr-3">
                      ?
                    </span>
                    How It Works
                  </h3>

                  <div className="space-y-6">
                    <div className="relative pl-8 before:content-[''] before:absolute before:left-3 before:top-7 before:h-full before:w-[2px] before:bg-indigo-200 last:before:h-0">
                      <div className="absolute left-0 top-1 bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium">
                        1
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">
                        Make Payment
                      </h4>
                      <p className="text-sm text-gray-600">
                        Send{" "}
                        <span className="font-medium text-indigo-700">
                          500 BDT
                        </span>{" "}
                        via bKash to:
                        <span className="flex items-center mt-1 bg-white px-3 py-2 rounded-md border border-indigo-100 font-medium text-indigo-800">
                          <CreditCard className="h-4 w-4 mr-2 text-indigo-600" />
                          01876891680
                        </span>
                      </p>
                    </div>

                    <div className="relative pl-8 before:content-[''] before:absolute before:left-3 before:top-7 before:h-full before:w-[2px] before:bg-indigo-200 last:before:h-0">
                      <div className="absolute left-0 top-1 bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium">
                        2
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">
                        Get Transaction ID
                      </h4>
                      <p className="text-sm text-gray-600">
                        Copy the Transaction ID from your bKash payment
                        confirmation message
                      </p>
                    </div>

                    <div className="relative pl-8 before:content-[''] before:absolute before:left-3 before:top-7 before:h-full before:w-[2px] before:bg-indigo-200 last:before:h-0">
                      <div className="absolute left-0 top-1 bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium">
                        3
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">
                        Complete Form
                      </h4>
                      <p className="text-sm text-gray-600">
                        Fill out the application form with your accurate contact
                        information
                      </p>
                    </div>

                    <div className="relative pl-8">
                      <div className="absolute left-0 top-1 bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium">
                        4
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">
                        Wait for Approval
                      </h4>
                      <p className="text-sm text-gray-600">
                        Your application will be reviewed within 72 hours
                      </p>
                    </div>
                  </div>

                  {/* Refund policy moved to form section */}
                </div>
              </div>

              {/* Form Panel - Right Side */}
              <div className="md:col-span-2 p-6 md:p-8 bg-white">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Developer Information
                </h3>

                <form onSubmit={handleDevApplication} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="relative">
                      <label
                        htmlFor="dev-name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Full Name
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          {User && <User className="h-5 w-5 text-gray-400" />}
                        </div>
                        <input
                          id="dev-name"
                          type="text"
                          placeholder="Enter your full name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <label
                        htmlFor="dev-email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email Address
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          {Mail && <Mail className="h-5 w-5 text-gray-400" />}
                        </div>
                        <input
                          id="dev-email"
                          type="email"
                          placeholder="you@example.com"
                          value={devEmail}
                          onChange={(e) => setDevEmail(e.target.value)}
                          className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="relative">
                      <label
                        htmlFor="dev-phone"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Phone Number
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          {Phone && <Phone className="h-5 w-5 text-gray-400" />}
                        </div>
                        <input
                          id="dev-phone"
                          type="tel"
                          placeholder="01XXXXXXXXX"
                          value={devPhone}
                          onChange={(e) => setDevPhone(e.target.value)}
                          className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <label
                        htmlFor="transaction"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        bKash Transaction ID
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          {CreditCard && (
                            <CreditCard className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <input
                          id="transaction"
                          type="text"
                          placeholder="e.g. 8N7DG5RE2M"
                          value={transactionID}
                          onChange={(e) => setTransactionID(e.target.value)}
                          className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg mt-6">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="terms"
                          name="terms"
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          required
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="terms"
                          className="font-medium text-gray-700"
                        >
                          I agree to the terms and conditions
                        </label>
                        <p className="text-gray-500">
                          By applying, you agree to our developer guidelines and
                          content policies.
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-400 p-3 rounded-r-md">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          {AlertCircle && (
                            <AlertCircle className="h-5 w-5 text-amber-500" />
                          )}
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-amber-800">
                            Refund Policy
                          </h3>
                          <div className="mt-2 text-sm text-amber-700">
                            <p>
                              If your application is rejected, your payment will
                              be refunded within 5 business days.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowDevModal(false)}
                      className="mr-3"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" isLoading={loading}>
                      Submit Application
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
