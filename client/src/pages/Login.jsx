import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { appContent } from "../contexts/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedIn, getUserData } = useContext(appContent);

  const [loading, setLoading] = useState(false);
  const [state, setState] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleAuthState = () =>
    setState(state === "signup" ? "login" : "signup");

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    axios.defaults.withCredentials = true;

    try {
      const url = `${backendUrl}/api/auth/${
        state === "signup" ? "register" : "login"
      }`;
      const { data } = await axios.post(url, formData);

      if (!data.success) return toast.error(data.message);

      if (state === "signup") {
        const { data: otpData } = await axios.post(
          `${backendUrl}/api/auth/send-verify-otp`,
          {
            email: formData.email,
          }
        );
        if (otpData.success) {
          setIsLoggedIn(true);
          getUserData();
          toast.success(otpData.message);
          return navigate("/email-verify");
        }
      } else {
        setIsLoggedIn(true);
        getUserData();
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-200">
      <h1
        onClick={() => navigate("/")}
        className="text-2xl font-semibold absolute left-6 top-6 sm:left-24"
      >
        MERN Auth
      </h1>

      <div className="bg-gray-800 text-white px-6 py-6 rounded-xl">
        <AuthHeader state={state} />
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {state === "signup" && (
            <InputField
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
            />
          )}
          <InputField
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email ID"
          />
          <InputField
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
          />

          <button
            type="submit"
            className={`w-64 bg-blue-700 py-1.5 rounded-xl hover:bg-blue-500 ${
              loading && "bg-blue-500"
            }`}
            disabled={loading}
          >
            {state === "signup" ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <AuthFooter
          state={state}
          toggleAuthState={toggleAuthState}
          navigate={navigate}
        />
      </div>
    </div>
  );
};

const AuthHeader = ({ state }) => (
  <div>
    <h2 className="text-2xl text-center font-semibold">
      {state === "signup" ? "Create Account" : "Login"}
    </h2>
    <p className="text-xs text-center text-blue-200 mt-2 mb-4">
      {state === "signup" ? "Create your account" : "Login to your account"}
    </p>
  </div>
);

const InputField = ({ name, type = "text", value, onChange, placeholder }) => (
  <input
    name={name}
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="bg-gray-600 px-6 py-1.5 rounded-2xl w-64"
    required
  />
);

const AuthFooter = ({ state, toggleAuthState, navigate }) => (
  <div className="text-[10px] text-center mt-2">
    {state === "signup" ? (
      <p>
        Already have an account?{" "}
        <span
          onClick={toggleAuthState}
          className="text-blue-600 cursor-pointer"
        >
          Login here
        </span>
      </p>
    ) : (
      <>
        <p>
          Create new Account?{" "}
          <span
            onClick={toggleAuthState}
            className="text-blue-600 cursor-pointer"
          >
            Click here
          </span>
        </p>
        <p
          onClick={() => navigate("/reset-password")}
          className="text-[12px] text-blue-600 cursor-pointer mt-1"
        >
          Forgot Password?
        </p>
      </>
    )}
  </div>
);

export default Login;
