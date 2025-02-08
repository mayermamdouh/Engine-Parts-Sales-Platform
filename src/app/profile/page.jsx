"use client";
import { useEffect, useState } from "react";
import InputField from "../components/InputField";
import Loading from "../components/Loading";
import axios from "axios";
import VerifyEmail from "../components/verfiyEmail";
import Message from "../components/Message";
import { useSelector } from "react-redux";

export default function Profile() {
  const { userId, token } = useSelector(state=>state.auth);
  const [loading, setLoading] = useState(true);
  const [smallLoading, setSmallLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [formData, setFormData] = useState({});
  const [resetPasswordData, setResetPasswordData] = useState({
    newPassword: "",
    currentPassword: "",
  });

  const [showVerifyEmail, setShowVerifyEmail] = useState(false);
  const [errors, setErrors] = useState({});
  const [isVerified, setIsVerified] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (userId) {
      setLoading(true);
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3001/users/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setFormData(response.data.data.user);
          setInitialData(response.data.data.user);

          setLoading(false);
        } catch (error) {
          setLoading(false);
          console.error("Error fetching user data:", error);
        }
      };
      fetchData();
    }
  }, [userId, isVerified, token]);

  const handleResentCode = async (e) => {
    setSmallLoading(true);
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:3001/users/resend-otp`,
        { email: formData.email }
      );

      if (response.data.status === "success") {
        setShowVerifyEmail(true);
        setErrors({ form: " " });
        setSmallLoading(false);
        setMessage("A new OTP has been sent to your email");
      }
    } catch (err) {
      const errorMessage =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "Something went wrong!";
      setErrors({ form: errorMessage });
    }
  };

  const handleUpdateUser = async (e) => {
    setSmallLoading(true);
    e.preventDefault();
    try {
      const response = await axios.patch(
        `http://localhost:3001/users/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        console.log("response.data.data.user: ", response.data.data.user);
        setFormData(response.data.data.user);
        setInitialData(response.data.data.user);

        setSmallLoading(false);
        setMessage("User profile updated successfully");
      }
    } catch (err) {
      const errorMessage =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "Something went wrong!";
      setErrors({ form: errorMessage });
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!resetPasswordData.currentPassword) {
      newErrors.currentPassword = "Current password is required.";
    }
    if (!resetPasswordData.newPassword) {
      newErrors.newPassword = "New password is required.";
    } else if (resetPasswordData.newPassword.length < 8) {
      newErrors.newPassword =
        "New password must be at least 8 characters long.";
    } else {
      const lowerCasePattern = /[a-z]/;
      const upperCasePattern = /[A-Z]/;
      const numberPattern = /\d/;
      const specialCharPattern = /[@$!%*?&]/;
      if (!lowerCasePattern.test(resetPasswordData.newPassword)) {
        newErrors.newPassword =
          "Password must include at least one lowercase letter.";
      } else if (!upperCasePattern.test(resetPasswordData.newPassword)) {
        newErrors.newPassword =
          "Password must include at least one uppercase letter.";
      } else if (!numberPattern.test(resetPasswordData.newPassword)) {
        newErrors.newPassword = "Password must include at least one number.";
      } else if (!specialCharPattern.test(resetPasswordData.newPassword)) {
        newErrors.newPassword =
          "Password must include at least one special character (@$!%*?&).";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3001/users/${userId}`,
        resetPasswordData
      );

      if (response.data.status === "success") {
        setMessage("Password reset successfully.");
        setErrors({});
        setResetPasswordData({ newPassword: "", currentPassword: "" });
      }
    } catch (err) {
      const errorMessage =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "Something went wrong!";
      setErrors({ formResetPassword: errorMessage });
    }
  };

  const isDataChanged =
    JSON.stringify(formData) !== JSON.stringify(initialData);

  const handleFormDataChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleResetPasswordChange = (field, value) => {
    setResetPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) return <Loading />;

  return (
    <>
      <Message message={message} setMessage={setMessage} />

      {showVerifyEmail && !isVerified && (
        <VerifyEmail
          email={formData.email}
          onVerified={(status) => {
            setIsVerified(status);
            setShowVerifyEmail(false);
          }}
        />
      )}
      <div className="flex flex-col p-8 text-right h-screen">
        <div className="flex flex-col gap-5">
          <div className="text-3xl text-black">حسابي</div>

          <div className="flex flex-row flex-wrap-reverse  justify-end w-full gap-10">
            {/* Left Section */}
            <div className="flex flex-col basis-[46%] items-end">
              <div className="text-2xl text-gray-600  mb-3">
                تغيير كلمة المرور
              </div>
              {errors.formResetPassword && (
                <div>
                  <div className="text-red-600 text-md">{`${errors.formResetPassword}`}</div>
                </div>
              )}
              <div className="flex flex-row gap-3 flex-wrap justify-end">
                <InputField
                  value={resetPasswordData.currentPassword}
                  labelName="كلمة السر الحالية"
                  onChange={(value) =>
                    handleResetPasswordChange("currentPassword", value)
                  }
                  type="password"
                />
              </div>
              {errors.currentPassword && (
                <p className="text-red-600 text-sm">{errors.currentPassword}</p>
              )}
              <div className="flex flex-col items-center justify-end flex-wrap-reverse mt-3">
                <InputField
                  value={resetPasswordData.newPassword}
                  labelName="كلمة السر الجديدة"
                  onChange={(value) =>
                    handleResetPasswordChange("newPassword", value)
                  }
                  type="password"
                />
              </div>
              {errors.newPassword && (
                <p className="text-red-600 text-sm">{errors.newPassword}</p>
              )}
              <button
                onClick={handleResetPassword}
                className="bg-darkSlate text-textColor rounded-sm px-20 py-1 cursor-pointer border border-gray-900 hover:bg-transparent hover:text-darkSlate mt-5"
              >
                تخزين
              </button>
            </div>
            {/* Right Section */}
            <div className="flex flex-col basis-[46%] items-end ">
              <div className="text-2xl text-gray-600  mb-3">
                معلوماتي الشخصية
              </div>
              {errors.form && (
                <div>
                  <div className="text-red-600 text-md">{`${errors.form}`}</div>
                </div>
              )}
              <div className="flex flex-row gap-5 flex-wrap justify-end">
                <InputField
                  value={formData.lastName}
                  labelName="الإسم الأخير"
                  onChange={(value) => handleFormDataChange("lastName", value)}
                  type="text"
                />
                <InputField
                  value={formData.firstName}
                  labelName="الإسم الأول"
                  onChange={(value) => handleFormDataChange("firstName", value)}
                  type="text"
                />
              </div>
              <div className="flex flex-col items-center justify-end flex-wrap-reverse mt-3">
                <InputField
                  value={formData.email}
                  labelName=" البريد الالكتروني"
                  onChange={(value) => handleFormDataChange("lastName", value)}
                  type="text"
                  disabled={true}
                />
                {formData.verified ? (
                  <div className="rounded-md font-bold p-1 text-center text-xs text-green-500">
                    Verified
                  </div>
                ) : (
                  <>
                    {smallLoading ? (
                      <div className="mt-6">
                        <Loading small={true} />
                      </div>
                    ) : (
                      <div
                        onClick={handleResentCode}
                        className="rounded-md font-bold p-1 mt-1 text-red-600 text-xs cursor-pointer hover:bg-red-700 hover:text-white hover:scale-105 transition-transform duration-300"
                      >
                        Not verified? Resend code
                      </div>
                    )}
                  </>
                )}
              </div>
              <button
                onClick={handleUpdateUser}
                disabled={!isDataChanged} // Disable button if no changes
                className={`bg-darkSlate text-textColor rounded-sm px-20 py-1  border border-gray-900 mt-5 
             ${
               !isDataChanged
                 ? "opacity-50 "
                 : "hover:bg-transparent hover:text-darkSlate transition-all cursor-pointer"
             }`}
              >
                حفظ
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
