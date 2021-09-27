const mongoose = require('mongoose')

const recetteSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true
  },
  ingredients: {
    type: String,
    required: true
  },
  preparation: {
    type: String,
    required: true
  },
  publishDate: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  coverImage: {
    type: Buffer,
    required: true
  },
  coverImageType: {
    type: String,
    required: true
  },
  personne: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Personne'
  }
})

recetteSchema.virtual('coverImagePath').get(function() {
  if (this.coverImage != null && this.coverImageType != null) {
    return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
  }
})

module.exports = mongoose.model('Recette', recetteSchema)