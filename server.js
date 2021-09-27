if (process.env.NODE_ENV !=='production'){
    require('dotenv').config()
}


const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const mongoose = require('mongoose')
//mongoose.connect("=mongodb://localhost/mybrary", { useNewUrlParser: true })   
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection

db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to Mongoose')) 

const indexRouter = require('./routes/index')

const personnesRouter = require('./routes/personnes')
const recettesRouter = require('./routes/recettes')


app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}))



app.use('/',indexRouter)

app.use('/personnes',personnesRouter)
app.use('/recettes',recettesRouter)


app.listen(process.env.PORT || 3000)   

