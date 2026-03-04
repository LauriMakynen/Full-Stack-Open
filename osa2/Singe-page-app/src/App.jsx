import { useState, useEffect } from 'react'
import Note from './components/Note'
import axios from 'axios'
import noteService from './services/notes'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('a new note...')
  const [showAll, setShowAll] = useState(true)


 const toggleImportanceOf = id => {
  const note = notes.find(n => n.id === id)
  const changedNote = { ...note, important: !note.important }

  noteService
    .update(id, changedNote).then(returnedNote => {
      setNotes(notes.map(note => note.id !== id ? note : returnedNote))
    })

    .catch(error => {
      alert(
        `the note '${note.content}' was already deleted from server`
      )
      setNotes(notes.filter(n => n.id !== id))
    })
}


useEffect(() => {
  console.log('effect')
 noteService
  .getAll()
  .then(initialNotes => {
    setNotes(initialNotes)
  })
}, [])

console.log('render', notes.length, 'notes')  

  // Lisätty jsx tallenus webissä
  const addNote = event => {
  event.preventDefault()
  const noteObject = {
    content: newNote,
    important: Math.random() > 0.5,
  }


  noteService
    .create(noteObject)
    .then(returnedNote => {
      setNotes(notes.concat(returnedNote))
      setNewNote('')
    })
}

  //Muistiinpanojen määrittelevän tärkeyden määrittely

  const Note = ({ note, toggleImportance }) => {
    const label = note.important
      ? 'make not important'
      : 'make important'

    return (
      <li>
        {note.content}
        <button onClick={toggleImportance}>{label}</button>   
      </li>
    )
  }
    const handleNoteChange = (event) => {
      console.log(event.target.value)
      setNewNote(event.target.value)
    }

    const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)
  return (
    <div>
      <h1>Notes</h1>
      <ul>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </ul>

      <ul>
        {notesToShow.map(note => 
          <Note key={note.id} note={note} 
          toggleImportanceOf={() => toggleImportanceOf(note.id)}/>
        )}
      </ul>

    <form  onSubmit={addNote}>
      <input value={newNote} onChange={handleNoteChange} />
      <button type="submit">save</button>
    </form>
    </div>
  )
}

export default App 