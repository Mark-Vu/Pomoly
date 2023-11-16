import '../../assets/styles/notes.css'
import Note from './Note';
import AddNote from './AddNote';
import {nanoid} from 'nanoid';

function NotesList( {noteList, saveNewNote, deleteNote} ) {
    console.log(noteList)
    return (
        <div className='notes-list-container'>
            <div className='notes-list'>
                {noteList && noteList.map((note) => (
                    <Note 
                        key={note.id || nanoid()}
                        props={note} 
                        deleteNote={deleteNote}
                    />
                ))}
                <AddNote saveNewNote={saveNewNote}/>
            </div >
        </div>
    )
}

export default NotesList;