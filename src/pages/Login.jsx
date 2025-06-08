import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import { X, Mail, Lock, User, Phone, Gift, ArrowRight, CreditCard, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import Button from "../components/Button";

const Login = () => {
  const navigate = useNavigate();
  const [emailForLogin, setEmailForLogin] = useState("");
  const [passwordForLogin, setPasswordForLogin] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Sign Up Modal States
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Developer Application Modal States
  const [showDevModal, setShowDevModal] = useState(false);
  const [fullName, setFullName] = useState("");
  const [devEmail, setDevEmail] = useState("");
  const [devPhone, setDevPhone] = useState("");
  const [transactionID, setTransactionID] = useState("");
  
  // Disable body scroll when modal is open
  useEffect(() => {
    if (showSignUpModal || showDevModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
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
          const loginUrl = import.meta.env.VITE_LOGIN;
          const response = await axios.post(loginUrl, {
            Email: emailForLogin,
            Password: passwordForLogin,
          });

          if (response.data?.success) {
            const userData = response.data.user;
            localStorage.setItem(
              "user",
              JSON.stringify({
                name: userData.name,
                role: userData.role,
                email: userData.email,
                phone: userData.phone,
                avatar: userData.avatar,
                coverImage: userData.coverImage,
                created_at: userData.created_at,
                updated_at: userData.updated_at,
                git_token: userData.git_token,
              })
            );
            if (userData.role === "admin") {
              sessionStorage.setItem("isAdmin", "true");
              sessionStorage.setItem("isLoggedIn", "true");
              navigate("/admin");
            } else if (userData.role === "developer") {
              sessionStorage.setItem("isDeveloper", "true");
              sessionStorage.setItem("isLoggedIn", "true");
              navigate("/developer/dashboard");
            } else {
              sessionStorage.setItem("isLoggedIn", "true");
              navigate("/");
            }
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
            text: `Could not connect to the server: ${error.message}`,
            icon: "error",
          });
        } finally {
          setLoading(false);
        }
    }
  };
  
  const handleSignUp = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return swal({
        title: "Error",
        text: "Passwords do not match",
        icon: "error",
      });
    }
    
    try {
      setLoading(true);
      const signUpUrl = import.meta.env.VITE_SIGNUP;
      const response = await axios.post(signUpUrl, {
        Name: name,
        Email: email,
        Phone: phone,
        Password: password,
      });
      
      if (response.data?.success) {
        setShowSignUpModal(false);
        // Redirect to OTP verification
        navigate(`/otp?email=${email}`);
      } else {
        swal({
          title: "Registration Failed",
          text: response.data.message,
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
  };
  
  const handleDevApplication = async (e) => {
    e.preventDefault();
    
    if (!fullName || !devEmail || !devPhone || !transactionID) {
      return toast.error("Please fill in all fields");
    }
    
    setLoading(true);
    try {
      // Implement your developer application logic here
      
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
            closeModal: true
          }
        }
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account to continue
          </p>
        </div>
        
        <div className="mt-8 bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={loginHandler}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
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
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                isLoading={loading}
                fullWidth
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Sign in
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </a>
              </div>

              <div>
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.647.349-1.086.635-1.337-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0110 2.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.934.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.137 18.163 20 14.418 20 10 20 4.477 15.523 0 10 0z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
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
                  <User className="h-6 w-6 mr-3" />
                  Create an Account
                </h2>
                <button
                  onClick={() => setShowSignUpModal(false)}
                  className="text-white/80 hover:text-white focus:outline-none bg-white/10 hover:bg-white/20 rounded-full p-1 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-indigo-100 mt-2 max-w-xl">
                Join Mahfuz's Apps Store to download and manage your favorite applications
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              {/* Benefits Panel - Left Side */}
              <div className="bg-indigo-50 p-6 md:p-8">
                <div className="sticky top-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Account Benefits</h3>
                  
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 bg-indigo-100 rounded-full p-1 mt-1">
                        <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-900">Download Apps</h4>
                        <p className="text-xs text-gray-600 mt-1">Access all applications in our store</p>
                      </div>
                    </li>
                    
                    <li className="flex items-start">
                      <div className="flex-shrink-0 bg-indigo-100 rounded-full p-1 mt-1">
                        <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-900">Save Favorites</h4>
                        <p className="text-xs text-gray-600 mt-1">Bookmark apps you love for quick access</p>
                      </div>
                    </li>
                    
                    <li className="flex items-start">
                      <div className="flex-shrink-0 bg-indigo-100 rounded-full p-1 mt-1">
                        <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-900">Rate & Review</h4>
                        <p className="text-xs text-gray-600 mt-1">Share your experience with the community</p>
                      </div>
                    </li>
                    
                    <li className="flex items-start">
                      <div className="flex-shrink-0 bg-indigo-100 rounded-full p-1 mt-1">
                        <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-900">Early Access</h4>
                        <p className="text-xs text-gray-600 mt-1">Get updates about new releases first</p>
                      </div>
                    </li>
                  </ul>
                  
                  <div className="mt-8 p-4 bg-white rounded-lg border border-indigo-100 shadow-sm">
                    <h4 className="text-sm font-medium text-gray-900 flex items-center">
                      <svg className="h-5 w-5 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Your Information</h3>
                
                <form onSubmit={handleSignUp} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="relative">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="relative">
                      <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="signup-email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="phone"
                        type="tel"
                        placeholder="01XXXXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="relative">
                      <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="signup-password"
                          type="password"
                          placeholder="Create a password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="relative">
                      <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="confirm-password"
                          type="password"
                          placeholder="Confirm your password"
                          value={confirmPassword}
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
                        <label htmlFor="privacy" className="font-medium text-gray-700">I agree to the privacy policy</label>
                        <p className="text-gray-500">By signing up, you agree to our terms of service and privacy policy.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowSignUpModal(false)}
                      className="mr-3"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      isLoading={loading}
                    >
                      Create Account
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
                  <Gift className="h-6 w-6 mr-3" />
                  Developer Application
                </h2>
                <button
                  onClick={() => setShowDevModal(false)}
                  className="text-white/80 hover:text-white focus:outline-none bg-white/10 hover:bg-white/20 rounded-full p-1 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-indigo-100 mt-2 max-w-xl">
                Join our developer community and start publishing your apps on Mahfuz's Apps Store
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
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Make Payment</h4>
                      <p className="text-sm text-gray-600">
                        Send <span className="font-medium text-indigo-700">500 BDT</span> via bKash to: 
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
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Get Transaction ID</h4>
                      <p className="text-sm text-gray-600">
                        Copy the Transaction ID from your bKash payment confirmation message
                      </p>
                    </div>
                    
                    <div className="relative pl-8 before:content-[''] before:absolute before:left-3 before:top-7 before:h-full before:w-[2px] before:bg-indigo-200 last:before:h-0">
                      <div className="absolute left-0 top-1 bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium">
                        3
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Complete Form</h4>
                      <p className="text-sm text-gray-600">
                        Fill out the application form with your accurate contact information
                      </p>
                    </div>
                    
                    <div className="relative pl-8">
                      <div className="absolute left-0 top-1 bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium">
                        4
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Wait for Approval</h4>
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
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Developer Information</h3>
                
                <form onSubmit={handleDevApplication} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="relative">
                      <label htmlFor="dev-name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
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
                      <label htmlFor="dev-email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
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
                      <label htmlFor="dev-phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
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
                      <label htmlFor="transaction" className="block text-sm font-medium text-gray-700 mb-1">
                        bKash Transaction ID
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <CreditCard className="h-5 w-5 text-gray-400" />
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
                        <label htmlFor="terms" className="font-medium text-gray-700">I agree to the terms and conditions</label>
                        <p className="text-gray-500">By applying, you agree to our developer guidelines and content policies.</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-400 p-3 rounded-r-md">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <AlertCircle className="h-5 w-5 text-amber-500" />
                        </div>
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-amber-800">Refund Policy</h4>
                          <p className="text-xs text-amber-700 mt-1">
                            If you don't receive a response within 72 hours, your payment will be automatically refunded.
                          </p>
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
                    <Button
                      type="submit"
                      isLoading={loading}
                    >
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
