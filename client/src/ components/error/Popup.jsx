import { useState, useEffect } from 'react';
import '../../assets/styles/error.css';

const Popup = ({ type, message, timeout }) => {
  // Types: alert (red), warning (yellow), success {green}
  // Time: In millisecond (3000ms = 3s)
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout]);

  return (
    <div className={isVisible ? `popup active` : 'popup fade-out'} >
      <div className={`popup ${type}`}>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Popup;
