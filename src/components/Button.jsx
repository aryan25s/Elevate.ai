import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({ 
  children, 
  variant = 'primary', 
  to, 
  onClick, 
  className = '', 
  type = 'button',
  ...props 
}) => {
  const baseClass = `btn btn-${variant} ${className}`;

  if (to) {
    return (
      <Link to={to} className={baseClass} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={baseClass} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

export default Button;