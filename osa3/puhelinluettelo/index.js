const express = require('express')
const app = express()
const morgan = require('morgan')


let persons = [
  {
    "id": 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    "id": 2,
    name: "Ada Lovelace", 
    number: "39-44-5323523"
  },
  { 
    "id": 3,
    name: "Dan Abramov",
    number: "123-456-789"
  },
  {
    "id": 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122" 
  }
]

morgan.token('post-data', (request) => {
  return request.method === 'POST'
  ? JSON.stringify(request.body) : ''
})

//Käytetään middelware morgan-kirjastoa HTTP-pyyntöjen lokittamiseen
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'))
app.use(express.json())
app.use(express.static('dist'))

//Sivun juuriosoitteeseen vastataan tekstillä "Hello World"
app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})    

//Sivun /api/persons osoitteeseen vastataan koko puhelinluettelo JSON-muodossa
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)

  if (person) {
    return response.json(person)
  }
  response.status(404).end()
})

//Haetaan kaikki henkilöt ja palautetaan ne JSON-muodossa
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

//Poistetaan henkilö id:n perusteella
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)
  response.status(204).end()
})

//Lisätään uusi henkilö
const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(p => p.id))
    : 0
  return maxId + 1
}

//Vastaanotetaan POST-pyyntö ja lisätään uusi henkilö luetteloon
app.post('/api/persons', express.json(), (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ error: 'Name is missing' })
  }
  
  if (!body.number) {
    return response.status(400).json({ error: 'Number is missing' })
  }

  const nameExists = persons.some(p => p.name === body.name)
  if (nameExists) {
    return response.status(400).json({ error: 'Name must be unique' })
  }

  //Tarkistetaan, onko nimi jo luettelossa
  const newPerson = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  console.log('Adding new person:', newPerson)
  persons = persons.concat(newPerson)
  response.json(newPerson)
})

//Sivun /info osoitteeseen vastataan tekstillä, jossa kerrotaan montako henkilöä puhelinluettelossa on ja päivämäärä
app.get('/info', (request, response) => {
  const info = `Phonebook has info for ${persons.length} people`
  const date = new Date()
  response.send(`<p>${info}</p><p>${date}</p>`)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3002
app.listen(PORT)
console.log(`Server running on port ${PORT}`)