import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from "@fortawesome/free-solid-svg-icons";
import React from 'react';

function Note( {props, deleteNote, bgColor, titleColor, contentColor} ) {
    return (
        <div className="note" style={{ backgroundColor: bgColor, color: contentColor }}>
            <FontAwesomeIcon 
                icon={faClose}
                className='old-note-delete-icon' 
                onClick={()=>deleteNote(props.id)}
            />
            <h2 style={{ color: titleColor }}>{props.title}</h2>
            <div className="old-content">{props.content}</div>
            <div className="old-note-footer">
                <div className="note-details">
                    <small>Created: {props.date}</small>
                    <small className='note-modified'>Modified: {props.last_modified_date} - {props.last_modified_time}</small>
                </div>
            </div>
        </div>
    )
}
export default Note;
