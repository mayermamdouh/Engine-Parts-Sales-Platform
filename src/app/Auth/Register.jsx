"use client";
import { useCallback, useContext, useState } from "react";
import InputField from "../components/InputField";
import Loading from "../components/Loading";
import axios from "axios";
import VerifyEmail from "../components/verfiyEmail";
import { useDispatch } from "react-redux";


const SignUp = () => {
const dispatch = useDispatch();
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [register, setRegister] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleFormDataChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.firstName || formData.firstName.length < 3) {
      newErrors.firstName = "First Name must be at least 3 characters.";
    }

    if (!formData.lastName || formData.lastName.length < 3) {
      newErrors.lastName = "Last Name must be at least 3 characters.";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailPattern.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password || formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    } else {
      const lowerCasePattern = /[a-z]/;
      const upperCasePattern = /[A-Z]/;
      const numberPattern = /\d/;
      const specialCharPattern = /[@$!%*?&]/;

      if (!lowerCasePattern.test(formData.password)) {
        newErrors.password =
          "Password must include at least one lowercase letter.";
      } else if (!upperCasePattern.test(formData.password)) {
        newErrors.password =
          "Password must include at least one uppercase letter.";
      } else if (!numberPattern.test(formData.password)) {
        newErrors.password = "Password must include at least one number.";
      } else if (!specialCharPattern.test(formData.password)) {
        newErrors.password =
          "Password must include at least one special character (@$!%*?&).";
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
          `http://localhost:3001/users/register`,
          formData
        );

        if (response.data.status === "success") {
          setUserData(response.data);
   
          dispatch(login(response.data.data.user.token))
          setRegister(true);
          setLoading(false);
        }
      } catch (err) {
        setLoading(false);
        const errorMessage =
          err.response && err.response.data && err.response.data.message
            ? err.response.data.message
            : "Something went wrong!";
        setErrors({ form: errorMessage });
      }
    },
    [validateForm, formData, dispatch]
  );

  if (loading) return <Loading />;

  return (
    <>
      {register && <VerifyEmail email={userData?.data?.user?.email} />}
      <form onSubmit={handleSubmit}>
        {errors.form && <p className="text-red-600 text-md">{errors.form}</p>}
        <div className="flex flex-col gap-5 items-center ">
          <div className="flex flex-col w-full text-right">
            <InputField
              labelName="الإسم الأول"
              onChange={(value) => {
                handleFormDataChange("firstName", value);
              }}
              type="text"
              placeholder="mayer"
            />
            {errors.firstName && (
              <p className="text-red-600 text-sm">{errors.firstName}</p>
            )}
          </div>
          <div className="flex flex-col w-full text-right">
            <InputField
              labelName="الإسم الأخير"
              onChange={(value) => {
                handleFormDataChange("lastName", value);
              }}
              type="text"
              placeholder="mamdouh"
            />
            {errors.lastName && (
              <p className="text-red-600 text-sm">{errors.lastName}</p>
            )}
          </div>

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
            />
            {errors.password && (
              <p className="text-red-600 text-sm">{errors.password}</p>
            )}
          </div>
          <button
            className="bg-darkSlate text-textColor rounded-sm px-24 py-3 cursor-pointer border border-gray-900 hover:bg-transparent hover:text-gray-950"
            type="submit"
          >
            انشاء حساب
          </button>
        </div>
      </form>
    </>
  );
};

export default SignUp;
