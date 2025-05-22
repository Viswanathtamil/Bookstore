const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

// MongoDB URI
const MONGODB_URI = "mongodb+srv://mrviswa31:yZBGqPXNv6zHCvMP@cluster0.fhwd0qg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB error:', err));

// Routes
const authRoutes = require('./route/user');
const bookRoutes= require('./route/book');
const orderRoutes= require('./route//order');
app.use('/auth', authRoutes);
app.use("/book",bookRoutes);
app.use("/order",orderRoutes);


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
