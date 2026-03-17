const mongoose = require('mongoose')

mongoose.set('strictQuery', false)


const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url, { family: 4 })

  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

//Määritellään toJSON-muunnos, joka muuttaa MongoDB:n _id-kentän id-kentäksi ja poistaa _id- ja __v-kentät JSON-muodossa.
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Person', personSchema)


/*
const mongoose = require('mongoose')


//Tarkistetaan, että komentoriviparametreja on annettu riittävästi. Jos parametreja on vähemmän kuin kolme, tulostetaan ohje ja lopetetaan ohjelma.
const password = process.argv[2]
const url = `mongodb+srv://Harjoitus1:${password}@cluster1.wc5bnd7.mongodb.net/puhelinluettelo?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

//Määritellään toJSON-muunnos, joka muuttaa MongoDB:n _id-kentän id-kentäksi ja poistaa _id- ja __v-kentät JSON-muodossa.
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

*/
