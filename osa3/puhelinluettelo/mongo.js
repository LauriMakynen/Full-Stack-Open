const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://Harjoitus1:${password}@cluster1.wc5bnd7.mongodb.net/puhelinluettelo?retryWrites=true&w=majority`



mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

//Määritellään Person-malli, joka käyttää personSchemaa. Tämä malli edustaa henkilöitä tietokannassa.
const Person = mongoose.model('Person', personSchema)

//Jos vain salasaana on annettu komentoriviparametrina, tulostetaan kaikki tietokannassa olevat henkilöt ja heidän puhelinnumeronsa. Jos komentoriviparametreja on annettu kolme, luodaan uusi henkilö ja tallennetaan se tietokantaan.
if (process.argv.length === 3) {
  Person.find({}).then(persons => {
    console.log('phonebook:')
    persons.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name: name,
    number: number,
  })

  //Tallenna uusi henkilö tietokantaan ja sulje yhteys, kun tallennus on valmis.
  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}