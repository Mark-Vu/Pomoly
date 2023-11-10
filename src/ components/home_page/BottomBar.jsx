import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faCalendar, faStickyNote } from '@fortawesome/free-solid-svg-icons';
import '../../assets/styles/bottombar.css';

export default function BottomBar({ onHomeClick, onCalendarClick, onNoteClick }) {
  return (
    <div className="bottom-bar">
      <div className="fa-icon"><FontAwesomeIcon icon={faCalendar} onClick={onCalendarClick} /></div>
      <div className="fa-icon"><FontAwesomeIcon icon={faHome} onClick={onHomeClick} /></div>
      <div className="fa-icon"><FontAwesomeIcon icon={faStickyNote} onClick={onNoteClick} /></div>
    </div>
  );
}