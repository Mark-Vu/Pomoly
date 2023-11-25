import React, { useRef } from 'react';

function AddNote( {saveNewNote} ) {
    const [title, setTitle] = React.useState('Untitled Note')
    const [content, setContent] = React.useState('')
    const contentRef = useRef(); // Create a reference to the content textarea

    function handleTitleChange(event) {
        setTitle(event.target.value);
    }


    function handleContentChange(event) {
        setContent(event.target.value);
    }

    function handleTitleKeyPress(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            contentRef.current.focus(); // Move focus to the content textarea
        }
    }

    function handleSaveClick() {
        saveNewNote(title, content)
        setTitle('Untitled Note');
        setContent('');
    }
    
    return (
        <div className="note new">
            <textarea
                rows='1'
                cols='10'
                style={{fontWeight: 'bold', fontSize: '1.5rem'}}
                onChange={handleTitleChange}
                onKeyDown={handleTitleKeyPress}
                value={title}
            ></textarea>
            <textarea
                ref={contentRef} // Attach the reference to the content textarea
                rows='7'
                cols='10'
                placeholder="Jot down your thoughts here..."
                style={{fontWeight: 'bold', fontSize: '1rem'}}
                onChange={handleContentChange}
                value={content}
            ></textarea>
        
            <div className="note-footer">
                <button className="save" onClick={handleSaveClick}>Add</button>
            </div>
        </div>
    )
}

export default AddNote
