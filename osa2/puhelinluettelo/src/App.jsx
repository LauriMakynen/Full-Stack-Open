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
 const addPerson = (event) => {
  event.preventDefault()

  const name = newName.trim()
  const number = newNumber.trim()
  if (!name || !number) return

  const nameExists = persons.some(p => p.name === name)
  if (nameExists) {
    alert(`${name} is already added to phonebook`)
    return
  }

  const personObject = { name, number }
// Tallenna uusi henkilö backend-palvelimelle ja päivitä frontendin tilaa, jotta uusi henkilö näkyy luettelossa.
  personService.create(personObject).then(returnedPerson => {
    setPersons(persons.concat(returnedPerson))
    setNewName('')
    setNewNumber('')
  })}

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