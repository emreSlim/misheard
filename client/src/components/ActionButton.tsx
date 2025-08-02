import React from 'react';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ children, className = '', ...props }) => (
  <button
    type="submit"
    className={`bg-blue-600 text-white px-6 py-2 rounded-full shadow hover:bg-blue-700 transition font-semibold flex items-center gap-2 mx-auto disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    {...props}
  >
    {children}
  </button>
);
