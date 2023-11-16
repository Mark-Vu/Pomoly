import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faCalendar, faStickyNote } from '@fortawesome/free-solid-svg-icons';
import '../../assets/styles/bottombar.css';

export default function BottomBar({ selected, onHomeClick, onCalendarClick, onNoteClick }) {
  return (
    <div className="bottom-bar">
      <div className={`fa-icon ${selected === 'calendar' ? 'active' : ''}`} onClick={onCalendarClick}>
        <FontAwesomeIcon icon={faCalendar} />
      </div>
      <div className={`fa-icon ${selected === 'timer' ? 'active' : ''}`} onClick={onHomeClick}>
        <FontAwesomeIcon icon={faHome} />
      </div>
      <div className={`fa-icon ${selected === 'noteslist' ? 'active' : ''}`} onClick={onNoteClick}>
        <FontAwesomeIcon icon={faStickyNote} />
      </div>
    </div>
  );
}