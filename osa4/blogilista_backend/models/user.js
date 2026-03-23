const mongoose = require('mongoose');
// Käyttäjään liittyvä skeema, joka määrittelee, että käyttäjällä on käyttäjätunnus, nimi,
// salasana ja blogit, joita hän on luonut. Käyttäjään liittyy myös toJSON-muunnos, joka poistaa tietokentät id, _id, __v ja passwordHash,
//  kun käyttäjätiedot muunnetaan JSON-muotoon. 22-3-2026
const userSchema = new mongoose.Schema({
    username: {
         type: String,
          required: true,
           unique: true
         }, 
    name : String,
    passwordHash: String,
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ]
});

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
    }
});


const User = mongoose.model('User', userSchema);

module.exports = User;