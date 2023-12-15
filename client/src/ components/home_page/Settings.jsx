import BackgroundOptions from './BackgroundOptions';
import React, { useState, useContext } from "react";
import AuthContext from "../authentication/AuthContext";
import '../../assets/styles/settings.css';
import paintbrush from '../../assets/images/paintbrush.png';
import profile from '../../assets/images/profile.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from "@fortawesome/free-solid-svg-icons";

function Logout() {
  const { logout, user } = useContext(AuthContext);
  
  function handleLogout() {
    try {
      logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  const [activeTab, setActiveTab] = useState('logout');

  return (
    <>
    <div className="profile-header">
      <h1>Profile</h1>
    </div>
    <div className="main-profile">
      <div className="input-group">
        <label htmlFor="username">Name</label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Enter your username"
          value={user.name || ''}
          // onChange={/* function to handle name change */}
          readOnly // not editable
        />
      </div>
      <div className="input-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          value={user.email || ''}
          // onChange={/* function to handle email change */}
          readOnly // not editable
        />
      </div>
    </div>
    <button className="logout-btn" onClick={handleLogout}>
      Sign Out
    </button>
    </> 
  );
}

function Settings({ onClose, showSettings, onChangeBackground }) {
  const [activeTab, setActiveTab] = useState('logout');

  return (
    <>
      {showSettings && (
        <div className="settings-overlay" onClick={onClose}></div>
      )}
      <div className={`settings-container ${showSettings ? 'slide-in' : 'slide-out'}`}>
        <div className="close-tab">
          <FontAwesomeIcon icon={ faClose } style={{ cursor: 'pointer' }} onClick={onClose} />
        </div>
        <div className="main-settings">
          <div className="left-settings">
          <div className="tabs">
            <div className={`tab ${activeTab === 'logout' ? 'active' : ''}`} onClick={() => setActiveTab('logout')}>
              <img src={profile} alt="Profile" />
              <button>
                Profile
              </button>
            </div>
            <div className={`tab ${activeTab === 'background' ? 'active' : ''}`} onClick={() => setActiveTab('background')}>
              <img src={paintbrush} alt="Paintbrush" />
              <button>
                Background
              </button>
            </div>
          </div>
          </div>
          <div className="right-settings">
            <div className="tab-content">
              {activeTab === 'logout' && <Logout />}
              {activeTab === 'background' && <BackgroundOptions onChangeBackground={onChangeBackground} />}
            </div>
          </div>
        </div>
    </div>
    </>
  );
} export default Settings;