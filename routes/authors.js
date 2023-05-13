import { Router } from "express";
import Author from "../models/author.js";


const router = Router();


// all authors route
router.get('/', async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name !== '') {
    searchOptions.name = new RegExp(req.query.name, 'i');
  }
  try {
    const authors = await Author.find(searchOptions)
    res.render("authors/index", {
      authors: authors, 
      searchOptions: req.query
    })
  } catch {
    res.redirect("/")
  }

})

// new author route
router.get('/new', (req, res) => {
  res.render("authors/new", {author: new Author()});
})

// create author route
router.post('/', async (req, res) => {
  const author = new Author({
    name: req.body.name
  });

  try {
    const newAuthor = await author.save();
    console.log("no error yet.")
    res.redirect("authors");
  } catch {
    console.log("error occured")
    res.render("authors/new", {
      author: author,
      errorMessage: "Error creating author"
    })
  }
});




export default router;