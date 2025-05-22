const express = require('express');
const router = express.Router();
const Book = require('../model/Book');

// POST - Add a new book
router.post('/add', async (req, res) => {
    try {
        const {
          title,
          description,
          image,
          originalPrice,
          price,
          quantity,
          discount,
          isFeatured
        } = req.body;
    
        const inStock = quantity > 0;
    
        const newBook = new Book({
          title,
          description,
          image,
          originalPrice,
          price,
          quantity,
          discount,
          isFeatured: isFeatured ?? false,
          inStock
        });
    
        const savedBook = await newBook.save();
        res.status(201).json(savedBook);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to add book' });
      }
    });
    
  

// GET - Featured books
router.get('/featured', async (req, res) => {
  try {
    const books = await Book.find({ isFeatured: true, inStock: true });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching featured books' });
  }
});

// GET - Book by ID
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching book details' });
  }
});

module.exports = router;
