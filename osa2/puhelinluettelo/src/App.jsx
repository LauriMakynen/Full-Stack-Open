import { useEffect, useState } from 'react'
import personService from './services/persons'

const Filter = ({ filter, handleFilterChange }) => (
  <div>
    filter shown with <input value={filter} onChange={handleFilterChange} />
  </div>
)

const PersonForm = ({
  addPerson,
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange,
}) => (
  <form onSubmit={addPerson}>
    <div>
      name: <input value={newName} onChange={handleNameChange} />
    </div>
    <div>
      number: <input value={newNumber} onChange={handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)
// Näytä kaikki henkilöt, joiden nimi sisältää suodattimen tekstin. Suodattimen teksti syötetään erilliseen kenttään.
const Persons = ({ persons, deletePerson }) => (
  <div>
    {persons.map(person => (
      <li key={person.id}>
        {person.name} {person.number}
        <button onClick={() => deletePerson(person.id, person.name)}> 
          Delete
        </button>
      </li>
    ))}
  </div>
)

const App = () => {
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [persons, setPersons] = useState([]) 


  // Lisää uusi henkilö puhelinluetteloon, jos nimeä ei vielä ole luettelossa. Jos nimi on jo luettelossa, näytä alert-viesti.
  //2.15 muutos edelliseen; nyt lisätty nummero korvaa aiemman
 const addPerson = (event) => {
  event.preventDefault()

  const name = newName.trim()
  const number = newNumber.trim()
  if (!name || !number) return

  const existingPerson = persons.find(p => p.name === name)
  if (existingPerson) {
    const ok = window.confirm(`${name} is already added to phonebook. Replace the number?`)
    if (!ok) return
    //Consolin seurantaa varten, jotta näkee milloin numero päivitetään vanhan henkilön tietoihin
    console.log('Updating number for', name)
    const changedPerson = { ...existingPerson, number }
    personService.update(existingPerson.id, changedPerson)
      .then(returnedPerson => {
        setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson))
        setNewName('')
        setNewNumber('')
      })
  } else {
    const newPerson = { name, number }
    personService.create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
  } 
}

// Poista henkilö puhelinluettelosta. Näytä varmistusdialogi ennen henkilön poistoa.
  const deletePerson = (id, name) => {
    const ok = window.confirm(`Delete ${name}?`)
    if (!ok) return
    
    personService.remove(id).then(() => {
      setPersons(persons.filter(p => p.id !== id))
    })
  }
// Näytä vain ne henkilöt, joiden nimi sisältää suodattimen tekstin. Suodattimen teksti syötetään erilliseen kenttään.
  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setFilter(event.target.value)

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  useEffect(() => {
    personService.getAll()
    .then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])


  return (
    <div>
      <h2>Phonebook</h2>

      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      <h2>add a new</h2>

      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} deletePerson={deletePerson} />
    </div>
  )
}

export default App