const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  cart: [{
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    quantity: { type: Number, default: 1 },
  }]
});

module.exports = mongoose.model('User', userSchema);
