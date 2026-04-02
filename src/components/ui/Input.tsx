import React from "react";

interface InputProps {
  id?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  name?: string;
  required?: boolean;
  min?: string;
  max?: string;
}

export const Input: React.FC<InputProps> = ({
  id,
  type = "text",
  placeholder = "",
  value,
  onChange,
  className = "",
  disabled = false,
  name,
  required = false,
  min,
  max,
}) => {
  const baseStyles =
    "w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed";

  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      name={name}
      required={required}
      min={min}
      max={max}
      className={`${baseStyles} ${className}`}
    />
  );
};
