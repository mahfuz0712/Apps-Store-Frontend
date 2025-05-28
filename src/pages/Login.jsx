import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";

const Login = () => {
  const navigate = useNavigate();
  const [emailForLogin, setEmailForLogin] = useState("");
  const [passwordForLogin, setPasswordForLogin] = useState("");

  const [loading, setLoading] = useState(false);

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
            email: emailForLogin,
            password: passwordForLogin,
          });

          if (response.data.success) {
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
            } else {
              sessionStorage.setItem("isAdmin", "false");
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>
        <form onSubmit={loginHandler} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={emailForLogin}
              onChange={(e) => setEmailForLogin(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={passwordForLogin}
              onChange={(e) => setPasswordForLogin(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-300 disabled:bg-gray-400"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
