import React, { useContext } from "react";
import AuthContext from "./authentication/AuthContext";

export default function Header() {
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
