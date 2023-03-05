// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// define the book model
let Book = require('../models/books');

  // find all books in the books collection
  router.get('/', (req, res, next) => {
    // find all books in the books collection, sorted by title
    Book.find().sort({ Title: 1 }).exec((err, books) => {
        if (err) {
            return console.error(err);
        } else {
            res.render('books/index', {
                title: 'Books',
                books: books
            });
        }
    });
});

//  GET the Book Details page in order to add a new Book
router.get('/add', (req, res, next) => {

  const newBook = new Book();

  res.render('books/details',{
      title: 'Books',
      books: newBook // pass the new book instance to the view
  });
});

// POST process the Book Details page and create a new Book - CREATE

router.post('/add', (req, res, next) => {

  let newBook = Book({
      "Title" : req.body.title,
      "Author" : req.body.author,
      "Genre" : req.body.genre,
      "Description" : req.body.description,
      "Price" : req.body.price
  });
  Book.create(newBook,(err,book)=>{
      if(err)
      {
          console.log(err);
          res.end(err);
      }
      else
      {
          res.redirect('/books');
      }
  });

});


// GET the Book Details page in order to edit an existing Book
router.get('/:id', (req, res, next) => {
  // Find the book by id
  let id = req.params.id;
  Book.findById(id,(err,bookToEdit)=> {
      res.render('books/details', {
          title: 'Edit Book',
          books: bookToEdit // pass the new book instance to the view
      });
  });
});

// POST - process the information passed from the details form and update the document
router.post('/:id', (req, res, next) => {
  // Find the book by id and update the fields
  Book.findByIdAndUpdate(
      req.params.id,
      {
          Title: req.body.title,
          Price: req.body.price,
          Author: req.body.author,
          Genre: req.body.genre,
          Description: req.body.description
      },
      (err, book) => {
          if (err) {
              return console.error(err);
          } else {
              res.redirect('/books');
          }
      }
  );
});

// GET - process the delete by user id
router.get('/delete/:id', (req, res, next) => {

  let id = req.params.id;
  Book.remove({ _id: id }, (err) => {
      if (err) {
          console.log(err);
          res.end(err);
      }
      else {
          res.redirect('/books');
      }
  });
});


module.exports = router;
