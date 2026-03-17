require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()
// Määritellään morgan-token, joka näyttää POST-pyynnön datan JSON-muodossa
morgan.token('post-data', (request) => {
  return request.method === 'POST'
    ? JSON.stringify(request.body)
    : ''
})

// Middlewaret
app.use(express.json())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'))
// Reittien määrittely
app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>')
})

//Hakee kaikki henkilöt tietokannasta ja palauttaa ne JSON-muodossa
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})
//Hakee yksittäisen henkilön tietokannasta id:n perusteella ja palauttaa sen JSON-muodossa
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

//Yksittäisen henkilön poistaminen tietokannasta id:n perusteella
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

//Laajennetaan käsittely HTTP PUT -pyynnöille, jotka päivittävät henkilön tietokannassa id:n perusteella
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).json({ error: 'person not found' })
      }

      person.name = name
      person.number = number

      person.save()
        .then(updatedPerson => {
          response.json(updatedPerson)
        })
    })
    .catch(error => next(error))
})


// Luo uuden henkilön tietokantaan ja palauttaa sen JSON-muodossa
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ error: 'name is missing' })
  }

  if (!body.number) {
    return response.status(400).json({ error: 'number is missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(error => next(error))
})

// Hakee tietoa puhelinluettelosta
app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    const info = `Phonebook has info for ${persons.length} people`
    const date = new Date()
    response.send(`<p>${info}</p><p>${date}</p>`)
  })
})

// Poistaa henkilön tietokannasta id:n perusteella
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// Käsky, joka käsittelee tuntemattomat reitit ja palauttaa 404-virheen
app.use(unknownEndpoint)

// Virheenkäsittelijä, joka käsittelee virheet ja palauttaa niistä tietoa JSON-muodossa
const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

// Käynnistää palvelimen määritettyyn porttiin
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})