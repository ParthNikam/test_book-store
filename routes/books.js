import { Router } from 'express'
import Book from '../models/book.js'
import Author from '../models/author.js'


const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

const router = Router()

// All Books Route
router.get('/', async (req, res) => {
  let query = Book.find()
  if (req.query.title != null && req.query.title != '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'))
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
    query = query.lte('publishDate', req.query.publishedBefore)
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
    query = query.gte('publishDate', req.query.publishedAfter)
  }

  try {
    const books = await query.exec()
    res.render('books/index', {
      books: books,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})


// New Book Route
router.get('/new', async (req, res) => {
  renderFormPage(res, new Book(), 'new', false)
})


// Create Book Route
router.post('/', async (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    description: req.body.description
  })

  try {
    saveCover(book, req.body.cover)
    const newBook = await book.save()
    res.redirect(`books/${newBook.id}`)
  } catch {
    renderFormPage(res, book, 'new', true)
  }
})


// Show book by Id
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('author').exec()
    res.render('books/show', {book: book})

  } catch {
    res.redirect('/')
  }
})


// Edit Book Route
router.get('/:id/edit', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
    renderFormPage(res, book, 'edit', false)
  } catch {
    res.redirect('/')
  }
})


// Update Book Route
router.put('/:id', async (req, res) => {
  let book;

  try {
    book = await Book.findById(req.params.id)
    book.title = req.body.title
    book.author = req.body.author
    book.publishDate = new Date(req.body.publishDate)
    book.pageCount = req.body.pageCount
    book.description = req.body.description

    if (req.body.cover != null && req.body.cover !== '') {
      saveCover(book, req.body.cover)
    }

    await book.save()
    res.redirect(`books/${book.id}`)

  } catch {
    if (book != null) {
      renderFormPage(res, book, 'edit', true)
    } else {
      res.redirect('/')
    }
  }
})


// Delete Book Page 
router.delete('/:id', async (req, res) => {
  let book;
  try {
    book = await Book.findById(req.params.id)
    await book.remove()
    res.redirect('/books')
  } catch {
    if (book != null) { 
      res.render('book/show', {
        book: book,
        errorMessage: "Could not remove book."
      })
    } else {
      res.redirect('/')
    }
  }
})


async function renderFormPage(res, book, form, hasError = false) {
  try {
    const authors = await Author.find({})
    const params = {
      authors: authors,
      book: book
    }
    if (hasError) {
      if (form == 'edit') {
        params.errorMessage = 'Error Updating Book'
      } else {
        params.errorMessage = 'Error Creating Book'
      }
    }
    res.render(`books/${form}`, params)
  } catch {
    res.redirect('/books')
  }
}


function saveCover(book, coverEncoded) {
  if (coverEncoded == null) return
  const cover = JSON.parse(coverEncoded)
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    book.coverImage = new Buffer.from(cover.data, 'base64')
    book.coverImageType = cover.type
  }
}

export default router
