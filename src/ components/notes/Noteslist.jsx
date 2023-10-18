import '../../assets/styles/notes.css'
import Note from './Note';
import AddNote from './AddNote';
import {nanoid} from 'nanoid';

function NotesList( {notes, handleSaveNewNote} ) {
    return (
        <div className='notes-list-container'>
            <div className='notes-list'>
                {notes && notes.map((note)=> (
                    <Note 
                        key={note.id || nanoid()} 
                        title={note.title} 
                        date={note.date}
                        content={note.content}
                        last_modified_date={note.last_modified_date}
                        last_modified_time={note.last_modified_time}
                    />
                ))}
                <AddNote handleSaveNewNote={handleSaveNewNote}/>
            </div >
        </div>
    )
}

export default NotesList;