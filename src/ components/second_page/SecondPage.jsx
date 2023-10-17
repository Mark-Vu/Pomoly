import Calendar from './calendar/Calendar';
import NotesList from '../notes/Noteslist';
import ToggleSwitch from './ToggleSwitch';
import "../../assets/styles/secondPage.css"
import React, { useState } from 'react';
import api from '../authentication/api';

const SecondPage = () => {
    const [mode, setMode] = useState("Note")
    const date = new Date();

    // Get the year, month, and day
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so add 1
    const day = String(date.getDate()).padStart(2, '0');

    // Format the date as "yyyy/mm/dd"
    const formattedDate = `${year}/${month}/${day}`;
    const [notes, setNotes] = useState([
        {
            id: 1,
            title: "Untitled",
            content: "HEYYYY this is my first note",
            date: formattedDate,
            last_modified_time: "13:10:45",
            last_modified_date: formattedDate 
        }
    ])
    // React.useEffect(() => {
    //     async function fetchNotes() {
    //       try {
    //         const response = await api.get("http://127.0.0.1:5000/note/info", {
    //           withCredentials: true,
    //         });
    //         const data = await response.data;
    
    //         // Update the todoList state with the fetched data.
    //         setNotes(data);
    //       } catch (error) {
    //         console.error("Error fetching data:", error);
    //       }
    //     }
    //       fetchNotes();
    //     }, []);

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
            {mode === "Calendar" ? <Calendar /> : <NotesList notes={notes}/>}
        </div>
    )
}

export default SecondPage;
