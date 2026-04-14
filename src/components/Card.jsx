import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

const Card = ({ title, description, icon, to, buttonText = 'Learn More' }) => {
  return (
    <div className="card">
      <div className="card-icon">{icon}</div>
      <h3 className="card-title">{title}</h3>
      <p className="card-description">{description}</p>
      {to && (
        <div style={{ marginTop: 'auto' }}>
          <Button variant="outline" to={to} style={{ width: '100%', justifyContent: 'center' }}>
            {buttonText}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Card;