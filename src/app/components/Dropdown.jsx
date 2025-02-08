import { useState, useEffect } from "react";

const CustomDropdown = ({ options, nameField, onSelect, initialValue, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

  // Set the initial value if provided
  useEffect(() => {
    if (initialValue) {
      setSelectedValue(initialValue);
    }
  }, [initialValue]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (value) => {
    setSelectedValue(value);
    setIsOpen(false);
    if (onSelect) {
      onSelect(value);
    }
  };

  return (
    <div className={`relative select-none ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}>
      <div
        className={`block min-w-44 text-end px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none ${
          disabled ? "" : "focus:ring focus:border-blue-500 cursor-pointer"
        }`}
        onClick={handleToggle}
      >
        {selectedValue || nameField}
      </div>
      {isOpen && !disabled && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md max-h-48 overflow-y-auto shadow-lg">
          <ul>
            {options.map((value, index) => (
              <li
                key={index}
                onClick={() => handleSelect(value)}
                className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
              >
                {value}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none px-2">
        <svg
          className="w-4 h-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default CustomDropdown;
