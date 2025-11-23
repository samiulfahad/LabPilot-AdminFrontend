import React from "react";

const InputField = ({ label, name, value, onChange, type = "text", disabled = false, ...props }) => {
  return (
    <div className="flex flex-col sm:flex-row border border-gray-300 rounded-lg">
      <label
        className={`w-full sm:w-32 px-3 py-2 text-sm font-medium border-b sm:border-b-0 sm:border-r border-gray-300 flex items-center ${
          disabled ? "bg-gray-100 text-gray-400" : "bg-gray-50 text-gray-700"
        } rounded-t-lg sm:rounded-t-none sm:rounded-l-lg`}
      >
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`flex-1 px-3 py-2 rounded-b-lg sm:rounded-b-none sm:rounded-r-lg focus:outline-none ${
          disabled
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        }`}
        {...props}
      />
    </div>
  );
};

export default InputField;
