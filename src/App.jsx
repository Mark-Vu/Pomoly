import  Timer  from './ components/timer/Timer';
import HomePage from './ components/authentication/HomePage';
import { Navigate, Route, Routes } from "react-router-dom";
import {AuthContextProvider} from "./ components/authentication/AuthContext.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx"
import SecondPage from './ components/second_page/SecondPage'; 
import './assets/styles/app.css'
import Header from './ components/Header.jsx';
import Settings from './ components/Settings.jsx';
import React, { useState } from 'react';
import backgroundImage1 from './assets/images/background1.jpg';
import backgroundImage2 from './assets/images/background2.jpg';
import backgroundImage3 from './assets/images/background3.jpg';
import backgroundImage4 from './assets/images/background4.jpg';
import backgroundImage5 from './assets/images/background5.jpg';
import backgroundImage6 from './assets/images/background6.jpg';
import backgroundImage7 from './assets/images/background7.jpg';

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
  const [showTimer, setShowTimer] = useState(true);

  const toggleView = () => {
    setShowTimer(!showTimer);
  };

  return (
    <div className='app'>
      {/* <Header /> */}
      <button onClick={toggleView} className="toggle-view-button">
        {showTimer ? 'Show Second Page' : 'Show Timer'}
      </button>
      {showTimer ? <Timer /> : <SecondPage />}
    </div>
  );
}