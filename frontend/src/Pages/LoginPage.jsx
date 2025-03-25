import { useState } from "react";
import axios from "axios"; // For making HTTP requests
import Navbar from "../Pages/NavBar";
import Footer from "../Pages/Footer";
import b from "../assets/b.jpg";
// import axios from "axios";
// import logo from "../assets/logo.png";
const LoginPage = () => {
  const [isAnimated, setIsAnimated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Clear messages when form input changes
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    if (errorMessage || successMessage) {
      setErrorMessage("");
      setSuccessMessage("");
    }
  };

  // Basic form validation
  const validateForm = () => {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address");
      return false;
    }

    // Password validation
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e, userType) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append("username", email); // FastAPI expects "username"
      formData.append("password", password);

      const API = import.meta.env.VITE_API_BASE_URL;

      const response = await axios.post(`${API}/login`, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const { access_token, role, profile } = response.data;

      if (access_token) {
        // ✅ Save token, role, and profile
        localStorage.setItem("authToken", access_token);
        localStorage.setItem("role", role);
        localStorage.setItem("userProfile", JSON.stringify(profile));

        setSuccessMessage(`Successfully logged in as ${role}`);

        setTimeout(() => {
          // ✅ Use role to route dynamically
          if (role === "educator") {
            window.location.href = "/educator-dashboard";
          } else {
            window.location.href = "/admin";
          }
        }, 1000);
      } else {
        setErrorMessage("Login failed. Please try again.");
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(
          error.response.status === 401
            ? "Invalid email or password. Please try again."
            : error.response.status === 404
            ? "User account not found. Please check your credentials."
            : error.response.data?.detail ||
              "Login failed. Please try again later."
        );
      } else if (error.request) {
        setErrorMessage(
          "Cannot connect to server. Please check your internet connection and try again."
        );
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  // Message display component
  const MessageDisplay = ({ error, success }) => {
    if (!error && !success) return null;

    return (
      <div
        className={`mt-4 p-2 rounded-md text-sm ${
          error ? "bg-red-100 text-red-700" : "bg-green-100 text-green-800"
        }`}
      >
        {error || success}
      </div>
    );
  };

  return (
    <div>
      <Navbar />
      <div
        className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-200 to-indigo-100 p-6"
        style={{ backgroundImage: `url(${b})` }}
      >
        <div className="mb-8 flex items-center justify-center text-center">
          <img
            src="https://ishanyaindia.org/wp-content/uploads/2020/02/Ishanya_logo.png"
            alt="Ishanya Logo"
            className="w-20 h-20 mr-3"
          />
          <h1 className="text-4xl font-bold text-black">
            Welcome to Ishanya Portal!
          </h1>
        </div>

        <div className="w-full max-w-2xl bg-white relative overflow-hidden rounded-lg shadow-2xl min-h-[400px]">
          {/* Educator Login Form */}
          <div
            className={`absolute top-0 left-0 h-full w-1/2 transition-all duration-700 ease-in-out z-20 ${
              isAnimated ? "translate-x-full opacity-0" : "opacity-100"
            }`}
          >
            <div className="p-8">
              <h1 className="text-2xl font-bold text-indigo-600">
                Educator Login
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Access your classroom details
              </p>

              <form
                className="mt-6"
                onSubmit={(e) => handleSubmit(e, "educator")}
              >
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="educator-email"
                  >
                    Email
                  </label>
                  <input
                    id="educator-email"
                    type="email"
                    value={email}
                    onChange={handleInputChange(setEmail)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="educator-password"
                  >
                    Password
                  </label>
                  <input
                    id="educator-password"
                    type="password"
                    value={password}
                    onChange={handleInputChange(setPassword)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>

                <MessageDisplay error={errorMessage} success={successMessage} />

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full mt-4 bg-indigo-600 text-white font-bold py-2 px-4 rounded-md ${
                    isLoading
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:bg-indigo-700"
                  }`}
                >
                  {isLoading ? "Signing in..." : "Sign In as Educator"}
                </button>
              </form>
              <a
                href="#"
                className="block text-center text-sm text-indigo-600 mt-4 hover:text-indigo-800"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          {/* Admin Login Form */}
          <div
            className={`absolute top-0 left-0 h-full w-1/2 transition-all duration-700 ease-in-out ${
              isAnimated
                ? "translate-x-full opacity-100 z-20"
                : "opacity-0 z-10"
            }`}
          >
            <div className="p-8">
              <h1 className="text-2xl font-bold text-indigo-600">
                Admin Login
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Manage school operations and records
              </p>

              <form className="mt-6" onSubmit={(e) => handleSubmit(e, "admin")}>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="admin-email"
                  >
                    Email
                  </label>
                  <input
                    id="admin-email"
                    type="email"
                    value={email}
                    onChange={handleInputChange(setEmail)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="admin-password"
                  >
                    Password
                  </label>
                  <input
                    id="admin-password"
                    type="password"
                    value={password}
                    onChange={handleInputChange(setPassword)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>

                <MessageDisplay error={errorMessage} success={successMessage} />

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full mt-4 bg-indigo-600 text-white font-bold py-2 px-4 rounded-md ${
                    isLoading
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:bg-indigo-700"
                  }`}
                >
                  {isLoading ? "Signing in..." : "Sign In as Admin"}
                </button>
              </form>
              <a
                href="#"
                className="block text-center text-sm text-indigo-600 mt-4 hover:text-indigo-800"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          {/* Overlay Container */}
          <div
            className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-30 ${
              isAnimated ? "-translate-x-full" : ""
            }`}
          >
            <div
              className={`bg-gradient-to-r from-blue-800 via-purple-800 to-indigo-800 relative -left-full h-full w-[200%] ${
                isAnimated ? "translate-x-1/2" : "translate-x-0"
              } transition-transform duration-700 ease-in-out`}
            >
              {/* Left Overlay Panel */}
              <div
                className={`w-1/2 h-full absolute flex justify-center items-center top-0 ${
                  isAnimated ? "translate-x-0" : "-translate-x-20"
                } transition-transform duration-700 ease-in-out`}
              >
                <div className="p-6 text-center">
                  <h1 className="text-2xl font-bold text-white mb-4">
                    Educator Login
                  </h1>
                  <p className="text-white">Access classroom details</p>
                  <button
                    className="mt-6 py-2 px-4 bg-transparent rounded-full text-white border-2 border-white 
             hover:bg-white hover:bg-opacity-10 hover:text-black transition-colors duration-200"
                    onClick={() => setIsAnimated(!isAnimated)}
                  >
                    Switch to Teacher
                  </button>
                </div>
              </div>

              {/* Right Overlay Panel */}
              <div
                className={`w-1/2 h-full absolute flex justify-center items-center top-0 right-0 ${
                  isAnimated ? "translate-x-20" : "translate-x-0"
                } transition-transform duration-700 ease-in-out`}
              >
                <div className="p-6 text-center">
                  <h1 className="text-2xl font-bold text-white mb-4">
                    Admin Login
                  </h1>
                  <p className="text-white">
                    Manage school operations and users
                  </p>
                  <button
                    className="mt-6 py-2 px-4 bg-transparent rounded-full text-white border-2 border-white 
             hover:bg-white hover:bg-opacity-10 hover:text-black transition-colors duration-200"
                    onClick={() => setIsAnimated(!isAnimated)}
                  >
                    Switch to Admin
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
