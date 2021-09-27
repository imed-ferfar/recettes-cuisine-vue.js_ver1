const mongoose = require('mongoose') 
const Personne = require('./personne')
 
const personneSchema = new mongoose.Schema({
  nom: { 
    type: String, 
    required: true 
  },
  prenom: { 
    type: String, 
    required: true 
  },
  courriel: { 
    type: String, 
    required: true 
  }
})

/*
personneSchema.pre('remove', function(next) {
  Personne.find({ personne: this.id }, (err, personnes) => {
    if (err) {
      next(err)
    } else if (personnes.length > 0) {
      next(new Error('Cette persone a une recette encore!'))
    } else {
      next()
    }
  })
})*/


 module.exports = mongoose.model('Personne', personneSchema)