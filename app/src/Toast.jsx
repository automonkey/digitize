import React, { useEffect, useRef } from 'react';
import './Toast.css';

const Toast = ({ message, type, onClose }) => {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const timer = setTimeout(() => onCloseRef.current(), 4000);
    return () => clearTimeout(timer);
  }, []);

  const icon = type === 'success' ? (
    <svg className="toast-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="#16a34a" />
      <path d="M7 13l3 3 7-7" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg className="toast-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="#dc2626" />
      <path d="M8 8l8 8M16 8l-8 8" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );

  return (
    <div className={`toast toast-${type}`} role="alert">
      {icon}
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={onClose} aria-label="Close">×</button>
    </div>
  );
};

export default Toast;
