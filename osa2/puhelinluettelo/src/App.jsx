import { useEffect, useState } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'  
import './index.css'

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
  const [notification, setNotification] = useState(null)

  // Näytä ilmoitus onnistuneista ja epäonnistuneista toiminnoista. Ilmoitus katoaa 5 sekunnin kuluttua.
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }
  // Lisää uusi henkilö puhelinluetteloon. Jos henkilö on jo luettelossa, kysy käyttäjältä, haluaako hän päivittää vanhan numeron uudella.
  const addPerson = (event) => {
    event.preventDefault()

  const name = newName.trim()
  const number = newNumber.trim()
  if (!name || !number) return

  const existingPerson = persons.find(p => p.name === name)
  
    if (existingPerson) {
      const ok = window.confirm(`${name} is already added to phonebook. Replace the number?`)
      if (!ok) return

      const changedPerson = { ...existingPerson, number }

      // Päivitä henkilön numero. Jos päivitys onnistuu, näytä onnistumisilmoitus. Jos päivitys epäonnistuu, näytä virheilmoitus ja poista henkilö luettelosta.
      personService.
      update(existingPerson.id, changedPerson)
        .then(returnedPerson => {
          setPersons(
          persons.map(p => p.id !== existingPerson.id ? p : returnedPerson
          )
        )
          setNewName('')
          setNewNumber('')
          showNotification(`Updated ${returnedPerson.name}'s number`, 'success')
        })

        .catch(() => {
          showNotification(`Information of ${existingPerson.name} has already been removed from server`, 'error')
          setPersons(
            persons.filter(p => p.id !== existingPerson.id))
        })

    } 
    else {
      const newPerson = { name, number }

      personService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          showNotification(`Added ${returnedPerson.name}`, 'success')
        })
         .catch(() => {
          showNotification(`Failed to add ${name}. Please try again later.`, 'error')
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
      <Notification notification={notification} />
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