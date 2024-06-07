import React from 'react';
import './appButton.css';

const AppButton = ({btnClassName, title, type, onClick, disabled}) => {
  return (
    <>
      <button
        onClick={onClick}
        type={type === 'submit' ? 'submit' : 'button'}
        className={`app-button ${btnClassName}`}
        disabled={disabled}
      >
        {title}
      </button>
    </>
  );
};

export default AppButton;
