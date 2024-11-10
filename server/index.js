// server.js
const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/bookrec', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.error('MongoDB connection error:', err));

// Schemas and Models
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const bookSchema = new mongoose.Schema({
    ISBN: String,
    title: String,
    author: String,
    yearOfPublication: Number,
    publisher: String,
    imageUrlS: String,
    imageUrlM: String,
    imageUrlL: String,
});

const userDataSchema = new mongoose.Schema({
    username: { type: String, required: true },
    ISBN: String,
    title: String,
    author: String,
    yearOfPublication: Number,
    publisher: String,
    status: { type: String }, // e.g., 'read'
    rating: { type: Number, min: 1, max: 5 },
});

const ratingSchema = new mongoose.Schema({
    username: { type: String, required: true },
    ISBN: String,
    title: String,
    rating: { type: Number, required: true, min: 1, max: 5 },
});

const User = mongoose.model('User', userSchema, 'users');
const Book = mongoose.model('Book', bookSchema, 'books');
const UserData = mongoose.model('UserData', userDataSchema, 'userdata');
const Rating = mongoose.model('Rating', ratingSchema, 'ratings');

// Routes
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.json({ error: 'Username already exists.' });
        }

        // Check if email already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.json({ error: 'Email is already registered.' });
        }

        // Create new user
        const newUser = new User({ username, email, password });
        await newUser.save();
        res.json(newUser);
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).json({ error: 'Server error during registration.' });
    }
});

app.post('/login', async (req, res) => {
    const { name, password } = req.body;
    try {
        const user = await User.findOne({ username: name });
        if (user) {
            if (user.password === password) {
                res.json("Success");
            } else {
                res.json("The password is incorrect");
            }
        } else {
            res.json("User doesn't exist");
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json("Server error. Please try again.");
    }
});

// Add "Add to Read" route
app.post('/addToRead', async (req, res) => {
    const { username, ISBN, title, author, yearOfPublication, publisher } = req.body;
    try {
      // Validate input data
      if (!username || !title) {
        return res.status(400).json({ error: "Invalid input data" });
      }
      // Create a new document in the collection (adjust based on your schema)
      const newEntry = new UserData({
        username,
        ISBN,
        title,
        author,
        yearOfPublication,
        publisher,
        status: "to-read",
      });
      await newEntry.save();
      res.json({ message: "Book added to read list" });
    } catch (error) {
      console.error("Error adding book to read list:", error);
      res.status(500).json({ error: "Failed to add book to read list" });
    }
  });
  

// Add "Rate Book" route
app.post('/rateBook', async (req, res) => {
    const { username, ISBN, title, rating } = req.body;
    try {
        const newRating = new Rating({ username, ISBN, title, rating });
        await newRating.save();
        res.json({ message: "Book rated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to rate book" });
    }
});

require('dotenv').config();
// Set up the Nodemailer transporter with your email provider (Gmail example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
  
  app.post('/send-feedback', (req, res) => {
    const { name, email, message } = req.body;
  
    const mailOptions = {
      from: email,
      to: 'sivampradheep@gmail.com', // your company's email
      subject: 'New Feedback Submission',
      text: `You have received a new feedback submission:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).send('Error sending feedback');
      }
      res.status(200).send('Feedback sent successfully');
    });
  });

  app.get('/userdata/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const userData = await UserData.find({ username });
        res.json(userData);
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ error: "Failed to fetch user data" });
    }
});

  

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
