import React, { useRef } from 'react';

function AddNote( { saveNewNote, bgColor, titleColor, contentColor } ) {
    const [title, setTitle] = React.useState('Untitled Note')
    const [content, setContent] = React.useState('')
    const contentRef = useRef(); 

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
        <div className="note new" style={{ backgroundColor: bgColor }}>
            <textarea
                rows='1'
                cols='10'
                style={{fontWeight: 'bold', fontSize: '1.5rem', color: titleColor}}
                onChange={handleTitleChange}
                onKeyDown={handleTitleKeyPress}
                value={title}
            ></textarea>
            <textarea
                ref={contentRef}
                rows='7'
                cols='10'
                placeholder="Jot down your thoughts here..."
                style={{fontSize: '1rem', color: contentColor}}
                onChange={handleContentChange}
                value={content}
                className='new-content'
            ></textarea>
        
            <div className="note-footer">
                <button className="save" onClick={handleSaveClick}>Add</button>
            </div>
        </div>
    )
}

export default AddNote
