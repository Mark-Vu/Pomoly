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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

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
  const [selected, setSelected] = useState('timer');
  // Handlers for the BottomBar component clicks
  const showTimer = () => {
    setSelected('timer');
    setActiveComponent('timer');
  };

  const showCalendar = () => {
    setSelected('calendar');
    setActiveComponent('calendar');
  };

  const showNotesList = () => {
    setSelected('noteslist');
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
      <div className="footer">
        <div className="bottom-line">
          <BottomBar selected={selected} onHomeClick={showTimer} onCalendarClick={showCalendar} onNoteClick={showNotesList}/>
          <button onClick={toggleSettings} className="settings-button">
            <FontAwesomeIcon icon={faCog} /> 
          </button>
        </div>
      </div>
    </div>
  );
}