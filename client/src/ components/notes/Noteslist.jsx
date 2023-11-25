import '../../assets/styles/notes.css';
import Note from './Note';
import AddNote from './AddNote';
import { nanoid } from 'nanoid';
import React, { useState } from 'react';

function NotesList({ noteList, saveNewNote, deleteNote }) {
  const [isPanelOpen, setIsPanelOpen] = useState(false); // State to manage the panel visibility

  // Function to toggle the panel
  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  return (
    <div className='notes-list-container'>
      <div className={`panel ${isPanelOpen ? 'show' : 'hide'}`}>
        <button 
          onClick={togglePanel}
          className={`panel-btn ${isPanelOpen ? 'show' : 'hide'}`}>
          {isPanelOpen ? 'Close' : 'Add a Note'}
        </button>
        <div className="panel-content">
          <h1>Customize Your Memo</h1>
          <AddNote saveNewNote={saveNewNote}/>
        </div>
      </div>

      <div className='notes-list'>
        {noteList && noteList.map((note) => (
          <Note
            key={note.id || nanoid()}
            props={note}
            deleteNote={deleteNote}
          />
        ))}
      </div>
    </div>
  );
}

export default NotesList;
