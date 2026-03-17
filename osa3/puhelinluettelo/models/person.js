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

//Määritellään personSchema, joka kuvaa henkilön tietorakenteen MongoDB:ssä.
//Schema määrittelee, että henkilöllä on name-kenttä, joka on merkkijono ja vaaditaan,
// sekä number-kenttä, joka on myös merkkijono ja vaaditaan.
//Lisäksi name-kentälle määritellään validointisääntö, joka estää numeroiden käytön nimessä.
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [3, 'name must be at least 3 characters long'],
    validate: {
      validator: (value) => !/\d/.test(value),
      message: 'name cannot contain numbers'
    }
  },
  number: {
    type: String,
    required: true,
    minlength: [8, 'phone number must be at least 8 characters long'],
    validate: {
      validator: (value) => /^(\d{2}-\d{5,}|\d{3}-\d{4,})$/.test(value),
      message: 'phone number must be in format XX-XXXX... or XXX-XXXX...'
    }
  },
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