const express = require('express')
const router = express.Router() 
const Recette = require('../models/recette')
 

// Get all  : test
/*router.get('/', (req, res) => {
  res.send('Salam Imed :)') 
}) */

// Get all  :
/*router.get('/', (req, res) => {
  res.render('index') 
}) */

router.get('/', async (req, res) => {
  let recettes
  try {
    recettes = await Recette.find().sort({ createdAt: 'desc' }).limit(9).exec()
  } catch {
    recettes = []
  }
  res.render('index', { recettes: recettes })
})


module.exports = router