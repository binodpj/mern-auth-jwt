import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { appContent } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EmailVerify = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const { backendUrl, setIsLoggedIn, setUserData, getUserData } =
    useContext(appContent);

  const submitHandler = async (e) => {
    setLoading(true);
    e.preventDefault();
    axios.defaults.withCredentials = true;

    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/verify-email`, {
        otp,
      });
      //console.log(data);
      if (data.success) {
        getUserData();
        setIsLoggedIn(true);
        setUserData(data.userData);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <h1
        onClick={() => navigate("/")}
        className="text-2xl font-semibold absolute left-6 top-6 sm:left-24"
      >
        MERN auth
      </h1>

      <div className="h-screen grid items-center justify-center bg-gray-200">
        <div className="bg-gray-800 text-white px-6 py-6 rounded-xl">
          <h2 className="text-2xl text-center font-semibold">
            Verify Your Email
          </h2>
          <p className="text-xs text-center text-blue-200 mt-2 mb-4">
            Enter 6 digit OTP sent to your email
          </p>

          <form onSubmit={submitHandler} className="flex flex-col gap-4">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="bg-gray-600 px-6 py-1.5 rounded-2xl w-64 text-center"
            />

            <button
              type="submit"
              className={`w-64 bg-blue-700 py-1.5 rounded-xl cursor-pointer hover:bg-blue-500 ${
                loading && "bg-blue-500"
              }`}
              disabled={loading}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmailVerify;
