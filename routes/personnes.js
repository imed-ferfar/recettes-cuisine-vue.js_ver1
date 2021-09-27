const express = require('express')
const router = express.Router() 
const Personne = require('../models/personne')

const Recette = require('../models/recette')


// Get all  : test
router.get('/', async(req,res) =>{
  let searchOptions = {}
  if(req.query.nom != null && req.query.nom !== ''){
    searchOptions.nom = new RegExp(req.query.nom, 'i')
  }
  try {
    const personnes = await Personne.find(searchOptions)
    res.render('personnes/index',{ 
      personnes : personnes,
      searchOptions : req.query
    })
  }catch{
    res.redirect('/')
  }
 // res.send('liste personnes')
})




//New Authors
router.get('/new',(req,res) =>{
    res.render('personnes/new',{ personne : new Personne() })
})

//Create Author 
router.post('/',async(req,res) =>{
  const personne = new Personne({
    nom:req.body.nom,
    prenom:req.body.prenom,
    courriel:req.body.courriel
  })
  try{
    const newPersonne = await personne.save()
    // res.redirect(`authors/${newAuthor.id}`)
    res.redirect(`personnes`)
  }catch{
    res.render('personnes/new',{
      personne: personne,
      errorMessage: 'Erreur de création de cuisinier'
    })
  }
})


//find Author by id
router.get('/:id', async (req, res) => {
  try {
    const personne = await Personne.findById(req.params.id)
    const recettes = await Recette.find({ personne: personne.id }).limit(5).exec()
    res.render('personnes/show', {
      personne: personne,
      recettesCuisinier: recettes
    })
  } catch (err){
    console.log(err)
    res.redirect('/')
  }
  //res.send('Show author'+req.params.id )
})

//edit Author by id
router.get('/:id/edit', async (req, res) => {
  try {
    const personne = await Personne.findById(req.params.id)
    res.render('personnes/edit', { personne: personne })
  } catch {
    res.redirect('/personnes')
  }
})

//put Author by id
router.put('/:id', async (req, res) => {
  let personne
  try {
    personne = await Personne.findById(req.params.id)
    personne.nom = req.body.nom
    personne.prenom = req.body.prenom
    personne.courriel = req.body.courriel
    await personne.save()
    res.redirect(`/personnes/${personne.id}`)
  } catch {
    if (personne == null) {
      res.redirect('/')
    } else {
      res.render('personne/edit', {
        personne: personne,
        errorMessage: 'Erreur de modification du cuisinier!'
      })
    }
  }
})

//Supprimer cuisinier par id
router.delete('/:id', async (req, res) => {
  let personne
  try {
    personne = await Personne.findById(req.params.id)
    await personne.remove()
    res.redirect('/personnes')
  } catch(err) {
    console.log(err)
    if (personne == null) {
      res.redirect('/')
    } else {
      res.redirect(`/personnes/${personne.id}`)
    }
  }
})
// Delete Book Page
router.delete('/:id', async (req, res) => {
  let book
  try {
    book = await Book.findById(req.params.id)
    await book.remove()
    res.redirect('/books')
  } catch {
    if (book != null) {
      res.render('books/show', {
        book: book,
        errorMessage: 'Could not remove book'
      })
    } else {
      res.redirect('/')
    }
  }
})



    

module.exports = router