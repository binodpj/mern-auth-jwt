import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { appContent } from "../contexts/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const NavBar = () => {
  const navigate = useNavigate();
  const { backendUrl, isLoggedIn, setIsLoggedIn, userData } =
    useContext(appContent);

  const submitHandler = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;

    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/logout`);
      if (data) {
        setIsLoggedIn(false);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex justify-between p-6 sm:px-20">
      <h1 className="text-2xl font-semibold">MERN auth</h1>

      {isLoggedIn ? (
        <div className=" relative group cursor-pointer flex flex-col justify-center items-center">
          <p className="text-2xl bg-blue-900 text-white px-3 py-1 rounded-full">
            {userData?.name?.[0].toUpperCase()}
          </p>
          <div className="absolute hidden group-hover:block top-10 right-0 w-24 bg-gray-100 rounded-xl">
            <p
              onClick={submitHandler}
              className="px-4 py-2 cursor-pointer hover:bg-gray-200 rounded-xl "
            >
              Log Out
            </p>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="border rounded-2xl px-4 py-1 text-sm cursor-pointer hover:bg-gray-100"
        >
          Login
        </button>
      )}
    </div>
  );
};

export default NavBar;
