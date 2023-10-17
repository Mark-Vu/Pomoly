import { MdDeleteForever } from 'react-icons/md';

function Note( {title, date, content, last_modified_date, last_modified_time} ) {
    return (
        <div className="note">
            <h2>{title}  <span>Last modified: {last_modified_date} {last_modified_time}</span></h2>
            <span>{content}</span>
            <div className="note-footer">
                <small>{date}</small>
                <MdDeleteForever className='delete-icon' size="1.3em"></MdDeleteForever>
            </div>
        </div>
    )
}
export default Note;
