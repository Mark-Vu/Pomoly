import { MdDeleteForever } from 'react-icons/md';

function Note( {title, date, content, last_modified_date, last_modified_time} ) {
    return (
        <div className="note">
            <h2>{title}</h2>
            <span>{content}</span>
            <div className="old-note-footer">
                <div className="note-details">
                    <small>Created: {date}</small>
                    <small className='note-modified'>modified: {last_modified_date} - {last_modified_time}</small>
                </div>
                <MdDeleteForever className='old-note-delete-icon' size="1.3em"></MdDeleteForever>
            </div>
        </div>
    )
}
export default Note;
