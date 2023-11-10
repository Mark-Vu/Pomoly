import { Navigate, Route, Routes } from "react-router-dom";
import React, { useState } from 'react';
import {AuthContextProvider} from "./ components/authentication/AuthContext.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx"
import './assets/styles/app.css'
import Settings from './ components/home_page/Settings.jsx';
import BottomBar from './ components/home_page/BottomBar.jsx';
import Calendar from './ components/calendar/Calendar.jsx';
import NotesList from './ components/notes/Noteslist';
import  Timer  from './ components/timer/Timer';
import HomePage from './ components/authentication/HomePage';

export default function App() {
  let isAuthenticated = localStorage.getItem("userProfile");
  return (
    <>
        <AuthContextProvider>
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <HomePage />
                )
              }
            />
            <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <ProtectedRoute accessBy="authenticated">

                  <DashboardLayout />
                </ProtectedRoute>
              ) : (
                <Navigate to="/" />
              )
            }
          />
          </Routes>
        </AuthContextProvider>
    </>
  );
}

function DashboardLayout() {
  const [activeComponent, setActiveComponent] = useState('timer');
  const [showSettings, setShowSettings] = useState(false);

  // Handlers for the BottomBar component clicks
  const showTimer = () => {
    setActiveComponent('timer');
  };

  const showCalendar = () => {
    setActiveComponent('calendar');
  };

  const showNotesList = () => {
    setActiveComponent('noteslist');
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  return (
    <div className='app'>
      {activeComponent === 'timer' && <Timer />}
      {activeComponent === 'calendar' && <Calendar />}
      {activeComponent === 'noteslist' && <NotesList />}

      {showSettings && <Settings onClose={toggleSettings} />}

      <BottomBar onHomeClick={showTimer} onCalendarClick={showCalendar} onNoteClick={showNotesList}/>

      {/* Remove the toggle view button as it's now redundant with the bottom bar */}
      {/* <button onClick={toggleSettings} className="settings-button">
        Settings
      </button> */}
    </div>
  );
}