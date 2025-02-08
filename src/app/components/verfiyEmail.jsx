import { useRef, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import { MdOutlineVerifiedUser } from "react-icons/md";

export default function VerifyEmail({ email, onVerified }) {
  const inputsRef = useRef([]);
  const [open, setOpen] = useState(true);
  const [verifyDataMessage, setVerifyDataMessage] = useState();
  const [errors, setErrors] = useState({});
  const [verifyed, setVerifyed] = useState(false);
  const [resendOtpMessage, setResendOtpMessage] = useState();
  const [timer, setTimer] = useState(0); // Initialize timer to 0

  // Function to start the timer countdown
  const startTimer = () => {
    setTimer(180); // Reset timer to 3 minutes (180 seconds)
  };

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval); // Stop the timer when it hits 0
    }

    return () => clearInterval(interval); // Clean up the interval on unmount
  }, [timer]);

  // Handle input change
  const handleChange = (index, event) => {
    const value = event.target.value;
    if (/^\d$/.test(value)) {
      // Move to next input
      if (index < inputsRef.current.length - 1) {
        inputsRef.current[index + 1].focus();
      }
    } else {
      event.target.value = ""; // Clear invalid input
    }
  };

  // Handle backspace to focus on the previous input
  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !event.target.value && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  // Add focus to first input on load
  useEffect(() => {
    if (inputsRef.current.length > 0) {
      inputsRef.current[0].focus();
    }
  }, []);

  const handleCloseVerfiy = () => {
    setOpen(false);
  };

  const handleSubmitVerfiy = async (e) => {
    e.preventDefault();
    // Check if all inputs are filled with digits
    const allFilled = inputsRef.current.every((input) =>
      /^\d$/.test(input.value)
    );
    if (!allFilled) {
      setErrors({ form: "Please enter all digits in the OTP fields." });
      return;
    }

    try {
      const otp = inputsRef.current.map((input) => input.value).join("");
      const response = await axios.post(
        `http://localhost:3001/users/verify-email`,
        { otp }
      );
      console.log("response verfiyed: ", response.data);
      if (response.data.status === "success") {
        setVerifyDataMessage(response.data.data.message);
        localStorage.setItem("isVerified", response.data.data.isVerified);
        setVerifyed(true);
         if (onVerified) {
           onVerified(true);
         }
      }
    } catch (err) {
      const errorMessage =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "Something went wrong!";
      setErrors({ form: errorMessage });
    }
  };

  const handleResentCode = async (e) => {
    e.preventDefault();
    if (timer > 0) return;

    startTimer();

    try {
      const response = await axios.post(
        `http://localhost:3001/users/resend-otp`,
        { email }
      );
      console.log("response resend: ", response.data);
      if (response.data.status === "success") {
        setResendOtpMessage(response.data.message);
      }
    } catch (err) {
      const errorMessage =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "Something went wrong!";
      setErrors({ form: errorMessage });
    }
  };

  return (
    <div
      className={`fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50
        transition-all transform ${
          open ? "translate-y-0 opacity-100" : "translate-y-[-100%] opacity-0"
        } 
        duration-300 ease-in-out`}
    >
      <div className="bg-white px-6 py-6 mx-auto shadow-xl rounded-2xl w-full max-w-md">
        <div className="mx-auto flex w-full flex-col ">
          <IoMdClose
            onClick={handleCloseVerfiy}
            className="h-7 w-7 text-black cursor-pointer"
          />
          {!verifyed ? (
            <div>
              <div className="flex flex-col items-center justify-center text-center gap-3 mb-10">
                {errors.form && (
                  <div>
                    <div className="text-red-600 text-md">{`${errors.form}`}</div>
                  </div>
                )}
                <div className="font-semibold text-3xl text-black">
                  <div>Email Verification</div>
                </div>
                <div className=" text-sm font-medium text-secondColor ">
                  We have sent a code to your email {email}
                </div>
              </div>
              <div>
                <form onSubmit={handleSubmitVerfiy}>
                  <div className="flex flex-col space-y-16">
                    <div className="flex flex-row items-center justify-between gap-2">
                      {[...Array(6)].map((_, index) => (
                        <div key={index} className="w-16 h-16">
                          <input
                            ref={(el) => (inputsRef.current[index] = el)}
                            className="w-full h-full text-secondColor flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-secondColor"
                            type="text"
                            maxLength="1"
                            onChange={(e) => handleChange(index, e)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col space-y-5">
                      <div>
                        <button
                          type="submit"
                          className="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-3 bg-secondColor border-none text-white text-md shadow-sm"
                        >
                          Verify Account
                        </button>
                      </div>

                      <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                        <div>Didn&apos;t receive the code?</div>
                        <div
                          onClick={handleResentCode}
                          className={`flex flex-row items-center text-secondColor ${
                            timer > 0 ? "select-none" : "cursor-pointer"
                          }`}
                        >
                          {timer > 0
                            ? `${Math.floor(timer / 60)}:${
                                timer % 60 < 10 ? "0" : ""
                              }${timer % 60}`
                            : "Resend"}
                        </div>
                      </div>
                      {resendOtpMessage && (
                        <div className="text-center text-secondColor">
                          {resendOtpMessage}
                        </div>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center ">
              <MdOutlineVerifiedUser className="text-secondColor h-44 w-44" />
              <div className="text-xl text-black text-center">
                {verifyDataMessage}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
