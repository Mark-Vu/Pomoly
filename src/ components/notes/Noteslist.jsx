import '../../assets/styles/notes.css'
import Note from './Note';
import AddNote from './AddNote';
function NotesList( {notes} ) {
    return (
        <div className='notes-list-container'>
            <div className='notes-list'>
                {notes.map((note)=> (
                    <Note 
                        key={note.id} 
                        title={note.title} 
                        date={note.date}
                        content={note.content}
                        last_modified_date={note.last_modified_date}
                        last_modified_time={note.last_modified_time}
                    />
                ))}
                <AddNote/>
            </div >
        </div>
    )
}

export default NotesList;