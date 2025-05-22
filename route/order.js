const express = require('express');
const router = express.Router();
const Order = require('../model/Order');
const Book = require('../model/Book');
const User = require('../model/User');

router.post('/', async (req, res) => {
  const { userId, items } = req.body;
  console.log("bvch",userId)
  if (!userId || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Invalid order data' });
  }

  try {
    // Fetch all book details from DB for the given book IDs in items
    const bookIds = items.map(item => item.bookId);
    const books = await Book.find({ _id: { $in: bookIds } });

    if (books.length !== items.length) {
      return res.status(400).json({ error: 'One or more books not found' });
    }

    // Calculate total price and prepare order items array
    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const book = books.find(b => b._id.toString() === item.bookId);
      if (!book) {
        return res.status(400).json({ error: `Book with id ${item.bookId} not found` });
      }

      if (book.inStock === false) {
        return res.status(400).json({ error: `Book "${book.title}" is out of stock` });
      }

      total += book.price * item.quantity;

      orderItems.push({
        book: book._id,
        quantity: item.quantity
      });
    }

    // Create the order
    const order = await Order.create({
      user: userId,
      items: orderItems,
      total
    });

    // Update books quantity and inStock status
    for (const item of orderItems) {
      const book = books.find(b => b._id.toString() === item.book.toString());
      const newQuantity = (book.quantity || 0) - item.quantity;

      await Book.findByIdAndUpdate(book._id, {
        quantity: newQuantity,
        inStock: newQuantity > 0
      });
    }

    // Clear user's cart
    await User.findByIdAndUpdate(userId, { cart: [] });

    res.json({ message: 'Order placed successfully', order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

module.exports = router;
