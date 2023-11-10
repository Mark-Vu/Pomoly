import React from 'react';
import Header from './Header';

function Settings({ onClose }) {
    return (
      <div className="settings-container">
        <button onClick={onClose} className="close-button">
          Close
        </button>
        <div className="settings-content">
          {/* Profile Settings */}
          <div className="profile-settings">
            <Header /> {/* Include your Header component for profile settings */}
            {/* Add other profile settings options here */}
          </div>
  
          {/* Background Settings */}
          <div className="background-settings">
            <BackgroundOptions /> {/* Create this component for background options */}
          </div>
        </div>
      </div>
    );
  }
  
  export default Settings;