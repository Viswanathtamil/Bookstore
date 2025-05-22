const express = require('express');
const router = express.Router();
const User = require('../model/User');



/* The `//register` route in the provided JavaScript code is handling the registration of a new user.
When a POST request is made to the `/register` endpoint, it expects the request body to contain the
user's `name`, `email`, and `password`. */
//register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email already exists' });

    const newUser = new User({ name, email, password });
    await newUser.save();

    // Send back the new user's id and name in the response
    res.json({
      success: true,
      message: 'Registered successfully',
      name: newUser.name,
      _id: newUser._id,  // <-- here is the user id
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


// Create or login user (simplified)
router.post('/login', async (req, res) => {
  const { email, name } = req.body;
  let user = await User.findOne({ email });
  if (!user) user = await User.create({ email, name });
  res.json(user);
});

// Update user cart
router.post('/:id/cart', async (req, res) => {
  const { cart } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { cart }, { new: true });
  res.json(user);
});

module.exports = router;

