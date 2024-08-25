require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  full_name: String,
  dob: String,
  email: String,
  roll_number: String
});

const User = mongoose.model('User', userSchema);

app.post('/bfhl', async (req, res) => {
  try {
    let { data, full_name, dob, email, roll_number } = req.body;
    
    // If data is not provided or invalid, use a default value
    if (!Array.isArray(data)) {
      console.warn("Invalid or missing data, using default value");
      data = ["A", "1", "B", "2"];
    }

    // Ensure user info fields are strings
    full_name = String(full_name || '');
    dob = String(dob || '');
    email = String(email || '');
    roll_number = String(roll_number || '');

    // Save or update user info
    await User.findOneAndUpdate(
      { email },
      { full_name, dob, email, roll_number },
      { upsert: true, new: true }
    );

    const numbers = data.filter(item => !isNaN(item));
    const alphabets = data.filter(item => isNaN(item));
    const highest_lowercase = alphabets
      .filter(char => char.length === 1 && char === char.toLowerCase())
      .sort()
      .pop();

    res.json({
      is_success: true,
      user_id: `${full_name}_${dob}`,
      email,
      roll_number,
      numbers,
      alphabets,
      highest_lowercase_alphabet: highest_lowercase ? [highest_lowercase] : []
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ is_success: false, error: "Internal server error" });
  }
});

app.get('/bfhl', (req, res) => {
  res.json({ operation_code: 1 });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});