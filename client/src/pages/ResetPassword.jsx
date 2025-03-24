import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { appContent } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [sentMail, setSentMail] = useState(false);
  const { backendUrl, setIsLoggedIn } = useContext(appContent);

  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-reset-password-otp`,
        { email }
      );
      if (data.success) {
        setSentMail(true);
        toast.success(data.message);
      } else {
        toast.message(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const handlePasswordSubmit = async (e) => {
    try {
      e.preventDefault();
      const { data } = await axios.post(
        `${backendUrl}/api/auth/reset-password`,
        { email, otp, newPassword }
      );

      if (data.success) {
        setIsLoggedIn(false);
        navigate("/login");
        toast.success("Password changed successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
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
      {!sentMail ? (
        <div>
          <div className="h-screen grid items-center justify-center bg-gray-200">
            <div className="bg-gray-800 text-white px-6 py-6 rounded-xl">
              <h2 className="text-2xl text-center font-semibold">
                Reset Password
              </h2>
              <p className="text-xs text-center text-blue-200 mt-2 mb-4">
                Enter your registered email address
              </p>

              <form
                onSubmit={handleEmailSubmit}
                className="flex flex-col gap-4"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="abc@example.com"
                  className="bg-gray-600 px-6 py-1.5 rounded-2xl w-64 text-center"
                />

                <button
                  type="submit"
                  className="w-64 bg-blue-700 py-1.5 rounded-xl cursor-pointer hover:bg-blue-500"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="h-screen grid items-center justify-center bg-gray-200">
            <div className="bg-gray-800 text-white px-6 py-6 rounded-xl">
              <h2 className="text-2xl text-center font-semibold">
                Change Password
              </h2>
              <p className="text-xs text-center text-blue-200 mt-2 mb-4">
                Enter otp and new password
              </p>

              <form
                onSubmit={handlePasswordSubmit}
                className="flex flex-col gap-4"
              >
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="bg-gray-600 px-6 py-1.5 rounded-2xl w-64 text-center"
                />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="bg-gray-600 px-6 py-1.5 rounded-2xl w-64 text-center"
                />

                <button
                  type="submit"
                  className="w-64 bg-blue-700 py-1.5 rounded-xl cursor-pointer hover:bg-blue-500"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
