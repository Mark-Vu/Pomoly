import '../../assets/styles/notes.css';
import Note from './Note';
import AddNote from './AddNote';
import { nanoid } from 'nanoid';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from "@fortawesome/free-solid-svg-icons";

function NotesList({ noteList, saveNewNote, deleteNote }) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('addNote');

  const [bgColor, setBgColor] = useState(localStorage.getItem('bgColor') || '#ffffff');
  const [titleColor, setTitleColor] = useState(localStorage.getItem('titleColor') || '#000000');
  const [contentColor, setContentColor] = useState(localStorage.getItem('contentColor') || '#000000');

  const openPanel = () => {
    setIsPanelOpen(true);
    setActiveTab('addNote'); 
  };

  const openCustomizePanel = () => {
    setIsPanelOpen(true);
    setActiveTab('customizeNote');
  };

  const closePanel = () => setIsPanelOpen(false);

  useEffect(() => {
    document.querySelectorAll('.note').forEach(note => {
      note.style.backgroundColor = bgColor;
      note.style.color = contentColor;
      note.querySelectorAll('h2').forEach(title => {
        title.style.color = titleColor;
      });
    });
  }, [bgColor, titleColor, contentColor]);

  const saveStylePreferences = () => {
    localStorage.setItem('bgColor', bgColor);
    localStorage.setItem('titleColor', titleColor);
    localStorage.setItem('contentColor', contentColor);
  };

  return (
    <div className='notes-list-container'>
      <div className={`panel ${isPanelOpen ? 'show' : 'hide'}`}>
        <button onClick={openPanel} className="panel-btn">
          <div className="btn-text">Add A Note</div>
        </button>
        <button onClick={openCustomizePanel} className="custom-btn">
          <div className="btn-text">Style Your Note</div>
        </button>
        <div className="panel-content">
          <FontAwesomeIcon icon={faClose} style={{ cursor: 'pointer' }} onClick={closePanel} />

          {activeTab === 'addNote' && (
            <>
              <h1>Add A Note</h1>
              <AddNote 
                saveNewNote={saveNewNote} 
                bgColor={bgColor} 
                titleColor={titleColor} 
                contentColor={contentColor}
              />
            </>
          )}

          {activeTab === 'customizeNote' && (
            <div className='custom-note'>
              <h1>Style Your Note</h1>
              <div className='color-picker'>
                <label>Background Color</label>
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
              </div>
              <div className='color-picker'>
                <label>Title Color</label>
                <input type="color" value={titleColor} onChange={(e) => setTitleColor(e.target.value)} />
              </div>
              <div className='color-picker'>
                <label>Content Color</label>
                <input type="color" value={contentColor} onChange={(e) => setContentColor(e.target.value)} />
              </div>
              <button onClick={saveStylePreferences}>Save</button>
            </div>
          )}
        </div>
      </div>

      <div className='notes-list'>
        {noteList && noteList.map((note) => (
          <Note
            key={note.id || nanoid()}
            props={note}
            deleteNote={deleteNote}
            bgColor={bgColor}
            titleColor={titleColor}
            contentColor={contentColor}
          />
        ))}
      </div>
    </div>
  );
}

export default NotesList;
