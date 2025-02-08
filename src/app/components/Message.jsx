"use client";
import { useEffect } from "react";

const Message = ({ message, setMessage }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      setMessage("");
    }, 2000);
    return () => clearTimeout(timeout);
  }, [message, setMessage]);

  const backgroundColor = message.toLowerCase().includes("successfully")
    ? "bg-green-500"
    : "bg-red-500";

  return (
    <div
      className={`flex items-center justify-center my-2 mr-3 overflow-hidden fixed top-16 right-4 z-30`}
    >
      <div
        className={`${backgroundColor} overflow-hidden rounded-sm shadow-lg text-center text-white transition-all duration-300 transform ${
          message ? "translate-x-0 p-4" : "translate-x-full p-0"
        }`}
      >
        {message}
      </div>
    </div>
  );
};

export default Message;
