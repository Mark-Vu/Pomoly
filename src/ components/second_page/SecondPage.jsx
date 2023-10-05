import Calendar from './calendar/Calendar';
import ToggleSwitch from './ToggleSwitch';
import "../../assets/styles/secondPage.css"
import { useState } from 'react';

const SecondPage = () => {
    const [mode, setMode] = useState("Note")

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
            {mode === "Calendar" ? <Calendar /> : <div>Render your Note component here</div>}
        </div>
    )
}

export default SecondPage;
