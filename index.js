const express = require('express');
const { resolve } = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const app = express();
const port = 3010;
const dotenv= require('dotenv');

dotenv.config();
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log("Error connecting toDatabase:", err));

  const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
const User = mongoose.model('User', userSchema);

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
  }
  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ message: 'User not found.' });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
  
          res.status(200).json({ message: 'Login successful!'});
      } else {
          res.status(401).json({ message: 'Invalid credentials.' });
      }
  } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'An error occurred during login.' });
  }
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});


