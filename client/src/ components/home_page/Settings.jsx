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

  return (
    <div>
      <button onClick={handleLogout}>
        Logout
      </button>
      <div>{user.name}</div>
    </div> 
  );
}

function Settings({ onClose }) {
  const [activeTab, setActiveTab] = useState('logout');

  return (
    <>
      <div className="settings-overlay" onClick={onClose}></div>
      <div className="settings-container">
        <div className="close-tab">
          <FontAwesomeIcon icon={ faClose } style={{ cursor: 'pointer' }} onClick={onClose} />
        </div>
        <div className="main-settings">
          <div className="left-settings">
            <div className="tabs">
              <div className="tab">
                <img src={profile} alt="Profile" />
                <button onClick={() => setActiveTab('logout')} className={activeTab === 'logout' ? 'active' : ''}>
                  Profile
                </button>
              </div>
              <div className="tab">
                <img src={paintbrush} alt="Paintbrush" />
                <button onClick={() => setActiveTab('background')} className={activeTab === 'background' ? 'active' : ''}>
                  Background
                </button>
              </div>
            </div>
          </div>
          <div className="right-settings">
            <div className="tab-content">
              {activeTab === 'logout' && <Logout />}
              {activeTab === 'background' && <BackgroundOptions />}
            </div>
          </div>
        </div>
    </div>
    </>
  );
} export default Settings;