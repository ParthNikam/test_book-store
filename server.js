import express from 'express'
import expressLayouts from 'express-ejs-layouts'
import bodyParser from 'body-parser'
import methodOverride from 'method-override'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config()


import indexRouter from './routes/index.js'
import authorRouter from './routes/authors.js'
import bookRouter from './routes/books.js'


const app = express()

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))

// const DATABASE_URL="mongodb://127.0.0.1/zliber"
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', error => console.error(error))


app.use('/', indexRouter)
app.use('/authors', authorRouter)
app.use('/books', bookRouter)


app.listen(process.env.PORT || 3000)