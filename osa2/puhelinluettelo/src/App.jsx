import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' },
  ]) 
  const [newName, setNewName] = useState('')

  const addPerson = (event) => {
    event.preventDefault()

    const nameexists = persons.some(person => person.name === newName)
    if (nameexists) {
      alert(`${newName} is already added to phonebook`)
    } else {
      const personObject = {
        name: newName,
      }
      setPersons(persons.concat(personObject))
      setNewName('')
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>
        {persons.map(person => (
          <li key={person.name}>
            {person.name}
          </li>
        ))}
        {/* debug: <div>{newName}</div> */}
      </div>
    </div>
  )
}

export default App