import Calendar from './calendar/Calendar';
import NotesList from '../notes/Noteslist';
import ToggleSwitch from './ToggleSwitch';
import "../../assets/styles/secondPage.css"
import React, { useState } from 'react';
import api from '../authentication/api';
import Cookies from 'js-cookie';


const SecondPage = () => {
    const [mode, setMode] = useState("Note")

    const [notes, setNotes] = useState([])
    React.useEffect(() => {
        async function fetchNotes() {
          try {
            const response = await api.get("http://127.0.0.1:5000/note/info", {
              withCredentials: true,
            });
            const data = await response.data;
    
            // Update the todoList state with the fetched data.
            setNotes(data);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        }
          fetchNotes();
        }, []);
    // Note 
    //     {
    //         id: 1,
    //         title: "Untitled",
    //         content: "HEYYYY this is my first note",
    //         date: formattedDate,
    //         last_modified_time: "13:10:45",
    //         last_modified_date: formattedDate 
    //     }
    // ])

    async function saveNewNote(title, text) {
      const date = new Date();
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const formattedDate = date.toLocaleString('en-EN', options);
      
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const formattedTime = `${hours}:${minutes}`;
      console.log(formattedTime)
      console.log(formattedDate)
      const newNote = {
        title: title,
        content: text,
        date: formattedDate,
        last_modified_time: formattedTime,
        last_modified_date: formattedDate
      }
      try {
        const response = await api.post('http://127.0.0.1:5000/note/add-note', newNote, {
          withCredentials: true,
          headers: {
            "X-CSRF-TOKEN": Cookies.get('csrf_access_token'),
          },
        });
        setNotes((prevNotes)=> {
          return [...prevNotes, newNote];
        })
      } catch (error) {
        console.log(error)
      }
    }
    
    const handleModeSwitch = () => {
        const newMode = mode === "Note" ? "Calendar" : "Note";
        setMode(newMode);
    };
    
    return (
        <div className='second-page__container'>
            <ToggleSwitch
                leftLabel="Note"
                rightLabel="Calendar"
                onToggle={handleModeSwitch} 
            />
            {mode === "Calendar" ? <Calendar /> : <NotesList 
                                                    notes={notes} 
                                                    handleSaveNewNote={saveNewNote}/>}
        </div>
    )
}

export default SecondPage;
