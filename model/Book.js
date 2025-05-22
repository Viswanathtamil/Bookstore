const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  originalPrice: Number,
  price:Number,
  quantity:Number,
  discount:String,
  isFeatured: { type: Boolean, default: false },
  inStock: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
