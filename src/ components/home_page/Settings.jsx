import BackgroundOptions from './BackgroundOptions';
import React, { useContext } from "react";
import AuthContext from "../authentication/AuthContext";

function Header() {
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
    return (
        <div>
            <Header />
        </div>
    );
  }
  
  export default Settings;