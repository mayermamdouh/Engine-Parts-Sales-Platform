import { useState } from "react";
import { RiEyeLine } from "react-icons/ri";
import { RiEyeOffLine } from "react-icons/ri";

const InputField = ({ labelName, onChange, type, placeholder, value, disabled }) => {
  const [passwordVisible, setPasswordVisible] = useState(true);

  const handleChange = (e) => {
    if (onChange) onChange(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  return (
    <div className="min-w-60">
      <label
        htmlFor={labelName}
        className="block mb-1 font-medium text-gray-900 text-md"
      >
        {labelName || "no label"}
      </label>
      <div className="relative">
        <input
          type={type === "password" && passwordVisible ? "password" : "text"}
          id={labelName}
          value={value}
          onChange={handleChange}
          className="bg-gray-50 border-2 text-gray-900 border-gray-300 focus:border-black outline-none text-sm rounded-lg block w-full p-2.5 text-right"
          placeholder={placeholder || ""}
          required
          disabled={disabled}
        />
        {type === "password" && (
          <div
            onClick={togglePasswordVisibility}
            className="absolute top-1/2 left-3 transform -translate-y-1/2 cursor-pointer"
          >
            {passwordVisible ? <RiEyeOffLine size={20} /> : <RiEyeLine size={20} />}
          </div>
        )}
      </div>
    </div>
  );
};

export default InputField;
