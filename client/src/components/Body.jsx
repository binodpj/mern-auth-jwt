import React, { useContext } from "react";
import { appContent } from "../contexts/AppContext";

const Body = () => {
  const { userData, isLoggedIn } = useContext(appContent);
  return (
    <div className="flex flex-col justify-between items-center gap-2 mt-20 mx-8 sm:mx-20">
      <img src="./header_img.png" alt="Header" className="w-40 sm:w-80" />
      {isLoggedIn && userData && (
        <p className="flex text-xl font-semibold">
          Hey {userData.name}{" "}
          <img src="./hand_wave.png" alt="" className="w-6" />
        </p>
      )}

      {!isLoggedIn && (
        <p className="flex text-xl font-semibold">
          Hey Developer <img src="./hand_wave.png" alt="" className="w-6" />
        </p>
      )}
      <h2 className="text-4xl font-semibold">Welcome to our app</h2>
      <p className="text-center text-sm">
        Let's start with quick product tour and we will have you up and running
        in no time
      </p>
      <button className="border rounded-2xl px-4 py-1 text-sm cursor-pointer hover:bg-gray-100 mt-2">
        Get Started
      </button>
    </div>
  );
};

export default Body;
