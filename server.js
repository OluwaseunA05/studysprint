const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/studysprint')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const Session = mongoose.model('Session', {
  user_id: String,
  duration: Number,
  name: String,
  date: { type: Date, default: Date.now }
});

const User = mongoose.model('User', {
  username: String,
  password: String
});


app.post('/sessions', async (req, res) => {
  try {
    const { user_id, duration, name } = req.body;

    const newSession = new Session({
      user_id,
      duration,
      name
    });

    await newSession.save();
    res.json({ message: 'Session saved!' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving session');
  }
});

app.get('/sessions', async (req, res) => {
  try {
    const sessions = await Session.find().sort({ date: -1 });
    res.json(sessions);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching sessions');
  }
});

app.delete('/sessions/:id', async (req, res) => {
  try {
    await Session.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting" });
  }
});

app.put('/sessions/:id', async (req, res) => {
  try {
    const { duration } = req.body;

    const updated = await Session.findByIdAndUpdate(
      req.params.id,
      { duration },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating session');
  }
});

// REGISTER
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = new User({ username, password });
    await user.save();

    res.json({ message: "User created!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error registering user" });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username, password });

  if (user) {
    res.json({ message: "Login successful" });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

app.get('/', (req, res) => {
  res.send('Backend is running');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
