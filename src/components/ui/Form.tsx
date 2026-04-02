import React from "react";

interface FormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  className?: string;
  children: React.ReactNode;
}

export const Form: React.FC<FormProps> = ({
  onSubmit,
  className = "",
  children,
}) => {
  return (
    <form onSubmit={onSubmit} className={`space-y-4 ${className}`}>
      {children}
    </form>
  );
};

interface FormGroupProps {
  children: React.ReactNode;
}

export const FormGroup: React.FC<FormGroupProps> = ({ children }) => {
  return <div className="space-y-1">{children}</div>;
};

interface FormLabelProps {
  htmlFor?: string;
  children: React.ReactNode;
}

export const FormLabel: React.FC<FormLabelProps> = ({ htmlFor, children }) => {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
      {children}
    </label>
  );
};

interface FormErrorProps {
  children: React.ReactNode;
}

export const FormError: React.FC<FormErrorProps> = ({ children }) => {
  return <p className="text-sm text-red-600">{children}</p>;
};
