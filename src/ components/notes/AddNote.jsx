import React, { useRef } from 'react';

function AddNote( {handleSaveNewNote} ) {
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
        handleSaveNewNote(title, content)
        setTitle('Untitled Note');
        setContent('');
    }
    
    return (
        <div className="note new">
            <textarea
                rows='1'
                cols='10'
                style={{fontWeight: 'bold', fontSize: '1.5em'}}
                onChange={handleTitleChange}
                onKeyDown={handleTitleKeyPress}
                value={title}
            ></textarea>
            <textarea
                ref={contentRef} // Attach the reference to the content textarea
                rows='7'
                cols='10'
                placeholder="Type to add a note..."
                onChange={handleContentChange}
                value={content}
            ></textarea>
        
            <div className="note-footer">
                <small>200 remaining</small>
                <button className="save" onClick={handleSaveClick}>Save</button>
            </div>
        </div>
    )
}

export default AddNote
