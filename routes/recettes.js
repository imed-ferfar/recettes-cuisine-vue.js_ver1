const express = require('express')
const router = express.Router()
const Recette = require('../models/recette')
const Personne = require('../models/personne')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

// Tous les recettes
router.get('/', async (req, res) => {
  let query = Recette.find()
  if (req.query.titre != null && req.query.titre != '') {
    query = query.regex('titre', new RegExp(req.query.titre, 'i'))
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
    query = query.lte('publishDate', req.query.publishedBefore)
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
    query = query.gte('publishDate', req.query.publishedAfter)
  }
  try {
    const recettes = await query.exec()
    res.render('recettes/index', {
      recettes: recettes,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
  //res.send('liste des recettes')
})

// Nouvelle recette
router.get('/new', async (req, res) => {
  renderNewPage(res, new Recette())
})

// Creer une recette
router.post('/', async (req, res) => {
  const recette = new Recette({
    titre: req.body.titre,
    personne: req.body.personne,
    publishDate: new Date(req.body.publishDate),
    ingredients: req.body.ingredients,
    preparation: req.body.preparation
  })
  try {
    saveCover(recette, req.body.cover)
    const newRecette = await recette.save()
    // res.redirect(`recettes/${newRecette.id}`)
    res.redirect(`recettes`)
  } catch(err) {
    console.log(err)
    renderNewPage(res, recette, true)
  }
})

// Afficher recette
router.get('/:id', async (req, res) => {
  try {
    const recette = await Recette.findById(req.params.id)
                           .populate('personne').exec()
    res.render('recettes/show', { recette: recette })
  } catch {
    res.redirect('/')
  }
})

// Modifier recette
router.get('/:id/edit', async (req, res) => {
  try {
    const recette = await Recette.findById(req.params.id)
    renderEditPage(res, recette)
  } catch {
    res.redirect('/')
  }
})

// Confirmer modification recette
router.put('/:id', async (req, res) => {
  let recette
  try {
    recette = await Recette.findById(req.params.id)
    recette.titre = req.body.titre
    recette.personne = req.body.personne
    recette.publishDate = new Date(req.body.publishDate)
    recette.ingredients = req.body.ingredients
    recette.preparation = req.body.preparation
    if (req.body.cover != null && req.body.cover !== '') {
      saveCover(recette, req.body.cover)
    }
    await recette.save()
    res.redirect(`/recettes/${recette.id}`)
  } catch {
    if (recette != null) {
      renderEditPage(res, recette, true)
    } else {
      redirect('/')
    }
  }
})

// Supprimer recette
router.delete('/:id', async (req, res) => {
  let recette
  try {
    recette = await Recette.findById(req.params.id)
    await recette.remove()
    res.redirect('/recettes')
  } catch {
    if (recette != null) {
      res.render('recettes/show', {
        recette: recette,
        errorMessage: 'Echèc de suppression de la recette!'
      })
    } else {
      res.redirect('/')
    }
  }
})


//==================================
async function renderNewPage(res, recette, hasError = false) {
  try {
    const personnes = await Personne.find({})
    const params = {
      personnes: personnes,
      recette: recette
    }
    if (hasError) params.errorMessage = 'Erreur de creation de la recette'
    res.render('recettes/new', params)
  } catch {
    res.redirect('/recettes')
    //renderNewPage(res, recette, true)
  }
}

//==================================
function saveCover(recette, coverEncoded) {
  if (coverEncoded == null) return
  const cover = JSON.parse(coverEncoded)
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    recette.coverImage = new Buffer.from(cover.data, 'base64')
    recette.coverImageType = cover.type
  }
}
//==================================
async function renderEditPage(res, recette, hasError = false) {
  renderFormPage(res, recette, 'edit', hasError)
}
//==================================
async function renderFormPage(res, recette, form, hasError = false) {
  try {
    const personnes = await Personne.find({})
    const params = {
      personnes: personnes,
      recette: recette
    }
    if (hasError) {
      if (form === 'edit') {
        params.errorMessage = 'Erreur de modification de la recette'
      } else {
        params.errorMessage = 'Erreur de création de la recette'
      }
    }
    res.render(`recettes/${form}`, params)
  } catch {
    res.redirect('/recettes')
  }
}


module.exports = router