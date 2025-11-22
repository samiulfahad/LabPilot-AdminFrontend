const InputField = ({ label, name, value, onChange, type = "text", disabled = false, ...props }) => {
  return (
    <div className="flex border border-gray-300 rounded-lg">
      <label
        className={`w-32 px-3 py-1 text-sm font-medium border-r border-gray-300 rounded-l-lg flex items-center ${
          disabled ? "bg-gray-100 text-gray-500" : "bg-gray-50 text-gray-700"
        }`}
      >
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`flex-1 px-3 py-1 rounded-r-lg focus:outline-none ${
          disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
        }`}
        {...props}
      />
    </div>
  );
};

export default InputField;
