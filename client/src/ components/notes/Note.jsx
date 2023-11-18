import { MdDeleteForever } from 'react-icons/md';
import React from 'react';

function Note( {props, deleteNote} ) {
    return (
        <div className="note">
            <h2>{props.title}</h2>
            <span>{props.content}</span>
            <div className="old-note-footer">
                <div className="note-details">
                    <small>Created: {props.date}</small>
                    <small className='note-modified'>modified: {props.last_modified_date} - {props.last_modified_time}</small>
                </div>
                <MdDeleteForever 
                    className='old-note-delete-icon' 
                    size="1.3em"
                    onClick={()=>deleteNote(props.id)}
                >
                </MdDeleteForever>
            </div>
        </div>
    )
}
export default Note;
