import React from "react";

interface CardProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ className = "", children, onClick }) => {
  const baseStyles = "bg-white rounded-lg border border-gray-200 shadow-sm p-6";

  return (
    <div 
      className={`${baseStyles} ${className}`} 
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children }) => {
  return <div className="mb-4 border-b pb-4">{children}</div>;
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className = "" }) => {
  return <div className={`space-y-4 ${className}`}>{children}</div>;
};

interface CardFooterProps {
  children: React.ReactNode;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children }) => {
  return <div className="mt-4 border-t pt-4 flex gap-2">{children}</div>;
};

interface CardTitleProps {
  children: React.ReactNode;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children }) => {
  return <h2 className="text-xl font-semibold text-gray-900">{children}</h2>;
};

interface CardDescriptionProps {
  children: React.ReactNode;
}

export const CardDescription: React.FC<CardDescriptionProps> = ({
  children,
}) => {
  return <p className="text-sm text-gray-600">{children}</p>;
};
