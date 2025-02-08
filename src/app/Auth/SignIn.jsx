"use clinet";

import { useCallback, useContext, useState } from "react";
import Loading from "../components/Loading";
import InputField from "../components/InputField";
import axios from "axios";
import VerifyEmail from "../components/verfiyEmail";
import { useDispatch } from "react-redux";
import {login} from "../store/slices/authSlice";
const SignIn = () => {
  const dispatch = useDispatch();
  const [showVerifyEmail, setShowVerifyEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleFormDataChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailPattern.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (formData.email && formData.email.length < 3) {
      newErrors.email = "Email must be at least 3 characters long.";
    }

    if (!formData.password || formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    } else {
      const passwordPattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      if (!passwordPattern.test(formData.password)) {
        newErrors.password =
          "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!validateForm()) {
        return;
      }
      try {
        setLoading(true);
        const response = await axios.post(
          `http://localhost:3001/users/login`,
          formData
        );
        dispatch(login(response.data.data.token));
        
        setLoading(false);
        setErrors({ form: " " });
        setShowVerifyEmail(false);
      } catch (err) {
        setLoading(false);

        if (err.response && err.response.data) {
          const errorMessage = err.response.data.message;
          if (errorMessage.includes("verify your account")) {
            setShowVerifyEmail(true);
            setErrors({
              form: "We sent a code to your email, please verify your account before logging in.",
            });
          } else if (errorMessage === "Email or password are incorrect") {
            setErrors({ form: "Email or password are incorrect." });
            setShowVerifyEmail(false);
          } else {
            setErrors({ form: errorMessage });
            setShowVerifyEmail(false);
          }
        } else {
          setErrors({ form: "Something went wrong!" });
          setShowVerifyEmail(false);
        }
      }
    },
    [validateForm, formData, dispatch]
  );

  // console.log("userData: ", userData);

  if (loading) return <Loading />;

  return (
    <>
      {showVerifyEmail && <VerifyEmail email={formData.email} />}
      <form onSubmit={handleSubmit}>
        {errors.form && (
          <div>
            <div className="text-red-600 text-md">{`${errors.form}`}</div>
          </div>
        )}

        <div className="flex flex-col gap-5 items-center relative">
          <div className="flex flex-col w-full text-right">
            <InputField
              labelName="البريد الالكتروني"
              onChange={(value) => {
                handleFormDataChange("email", value);
              }}
              type="email"
              placeholder="mayer@example.com"
            />
            {errors.email && (
              <p className="text-red-600 text-sm">{errors.email}</p>
            )}
          </div>
          <div className="flex flex-col w-full text-right">
            <InputField
              labelName="كلمة السر"
              onChange={(value) => {
                handleFormDataChange("password", value);
              }}
              type="password"
              placeholder="•••••••••"
            />
            {errors.password && (
              <p className="text-red-600 text-sm">{errors.password}</p>
            )}
          </div>
          <div className="text-gray-900 cursor-pointer hover:underline">
            هل نسيت كلمة المرور؟
          </div>
          <button
            className="bg-darkSlate text-textColor rounded-sm px-24 py-3 cursor-pointer border border-gray-900 hover:bg-transparent hover:text-darkSlate"
            type="submit"
          >
            تسجيل الدخول
          </button>
        </div>
      </form>
    </>
  );
};

export default SignIn;
