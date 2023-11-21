import { Navigate, Route, Routes } from "react-router-dom";
import React, { useState } from 'react';
import {AuthContextProvider} from "./ components/authentication/AuthContext.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx"
import './assets/styles/app.css'
import Settings from './ components/home_page/Settings.jsx';
import BottomBar from './ components/home_page/BottomBar.jsx';
import Calendar from './ components/calendar/Calendar.jsx';
import NotesList from './ components/notes/Noteslist.jsx';
import  Timer  from './ components/timer/Timer.jsx';
import HomePage from './ components/authentication/HomePage.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import api from "./ components/authentication/Api.jsx";
import backgroundIm1 from "./assets/images/backgroundIm1.jpg"

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


  // Fetch event to do list
  const [todoList, setTodoList] = React.useState({});
  React.useEffect(() => {
    async function fetchTodoList() {
      try {
        const response = await api.get("/calendar");
        const data = await response.data;
        setTodoList(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

      fetchTodoList();
    }, []);


  // Fetch notes
  const [noteList, setNoteList] = React.useState({});
  React.useEffect(() => {
    async function fetchNoteList() {
      try {
        const response = await api.get("/note");
        const data = await response.data;
        setNoteList(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchNoteList();
  }, [])
  console.log(noteList)

  const saveNewNote = async (title, content) => {
    const date = new Date();
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
    const newNote = {
      title: title,
      content: content,
      date: date.toLocaleDateString('en-US', dateOptions), // e.g., "May 22, 2019"
      last_modified_date: date.toLocaleDateString('en-US', dateOptions), // e.g., "May 22, 2019"
      last_modified_time: date.toLocaleTimeString('en-US', timeOptions) // e.g., "20:38"
    }
    try {
      const response = await api.put('/note', newNote);
      // Status: 200 => added note ok
      console.log(response.data.message)
      setNoteList([...noteList, {...newNote, id: response.data.note_id}]);
    } catch (error) {
      console.log(error)
    }
  }

  const deleteNote = async (id) => {
    try {
      const response = await api.delete(`/note/${id}`);
      // Status: 200 => added note ok
      console.log(response.data.message)
    } catch (error) {
      console.log(error)
    }
    // Update in the front end
    const newNoteList = noteList.filter((note)=>note.id !== id);
    setNoteList(newNoteList);
    
  }

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
  
  const [backgroundImage, setBackgroundImage] = useState(() => {
    return localStorage.getItem('userBackground') || backgroundIm1;
  });

  const handleChangeBackground = (newBackground) => {
    setBackgroundImage(newBackground);
    localStorage.setItem('userBackground', newBackground);
  };

  return (
    <div className='app' style={{ backgroundImage: `url(${backgroundImage})` }}>
      {activeComponent === 'timer' && <Timer />}
      {activeComponent === 'calendar' && <Calendar todoList={todoList} handleSetTodo={setTodoList}/>}
      {activeComponent === 'noteslist' && <NotesList noteList={noteList} saveNewNote={saveNewNote} deleteNote={deleteNote}/>}

      {showSettings && <div className="settings-overlay" onClick={toggleSettings}></div>}

      <Settings 
        showSettings={showSettings} 
        onClose={toggleSettings} 
        onChangeBackground={handleChangeBackground} 
      />

      <div className="footer">
        <div className="bottom-line">
          <BottomBar 
            selected={selected}
            onHomeClick={showTimer} 
            onCalendarClick={showCalendar} 
            onNoteClick={showNotesList}
          />
          <button onClick={toggleSettings} className="settings-button">
            <FontAwesomeIcon icon={faCog} /> 
          </button>
        </div>
      </div>
    </div>
  );
}