import BackgroundOptions from './BackgroundOptions';
import React, { useState, useContext } from "react";
import AuthContext from "../authentication/AuthContext";

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
    <div>
      <div className="tabs">
        <button onClick={() => setActiveTab('logout')} className={activeTab === 'logout' ? 'active' : ''}>
          Profile
        </button>
        <button onClick={() => setActiveTab('background')} className={activeTab === 'background' ? 'active' : ''}>
          Background
        </button>
      </div>
      <div className="tab-content">
        {activeTab === 'logout' && <Logout />}
        {activeTab === 'background' && <BackgroundOptions />}
      </div>
    </div>
  );
} export default Settings;