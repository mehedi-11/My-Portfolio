require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const auth = require('./middleware/auth');
const User = require('./models/User');
const Project = require('./models/Project');
const Experience = require('./models/Experience');
const Education = require('./models/Education');
const Contact = require('./models/Contact');
const Hire = require('./models/Hire');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Auth Routes ---
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/auth/profile', auth, async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) return res.status(400).json({ message: 'Username already taken' });
      user.username = username;
    }

    if (password) {
      user.password = password;
    }

    await user.save();
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

// --- Public Portfolio Route ---
app.get('/api/portfolio', async (req, res) => {
  try {
    const [projects, experience, education] = await Promise.all([
      Project.find().sort('order'),
      Experience.find().sort('order'),
      Education.find().sort('order')
    ]);
    res.json({ projects, experience, education });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// --- CRUD Routes (Protected) ---

// Projects
app.get('/api/projects', async (req, res) => {
  const data = await Project.find().sort('order');
  res.json(data);
});
app.post('/api/projects', auth, async (req, res) => {
  const newProject = new Project(req.body);
  await newProject.save();
  res.status(201).json(newProject);
});
app.put('/api/projects/:id', auth, async (req, res) => {
  const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});
app.delete('/api/projects/:id', auth, async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

// Experiences
app.get('/api/experience', async (req, res) => {
  const data = await Experience.find().sort('order');
  res.json(data);
});
app.post('/api/experience', auth, async (req, res) => {
  const entry = new Experience(req.body);
  await entry.save();
  res.status(201).json(entry);
});
app.put('/api/experience/:id', auth, async (req, res) => {
  const updated = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});
app.delete('/api/experience/:id', auth, async (req, res) => {
  await Experience.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

// Education
app.get('/api/education', async (req, res) => {
  const data = await Education.find().sort('order');
  res.json(data);
});
app.post('/api/education', auth, async (req, res) => {
  const entry = new Education(req.body);
  await entry.save();
  res.status(201).json(entry);
});
app.put('/api/education/:id', auth, async (req, res) => {
  const updated = await Education.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});
app.delete('/api/education/:id', auth, async (req, res) => {
  await Education.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

// Contacts & Hire (Public POST, Protected GET/DELETE)
app.post('/api/contacts', async (req, res) => {
  const newContact = new Contact(req.body);
  await newContact.save();
  res.status(201).json({ message: 'Message received' });
});
app.get('/api/contacts', auth, async (req, res) => {
  const data = await Contact.find().sort('-createdAt');
  res.json(data);
});
app.delete('/api/contacts/:id', auth, async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

app.post('/api/hire', async (req, res) => {
  const newHire = new Hire(req.body);
  await newHire.save();
  res.status(201).json({ message: 'Proposal received' });
});
app.get('/api/hire', auth, async (req, res) => {
  const data = await Hire.find().sort('-createdAt');
  res.json(data);
});
app.delete('/api/hire/:id', auth, async (req, res) => {
  await Hire.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

// --- Seed Admin User (Temporary/One-time) ---
app.post('/api/auth/seed', async (req, res) => {
  try {
    const existing = await User.findOne({ username: 'admin' });
    if (existing) return res.status(400).json({ message: 'Admin already exists' });
    
    const admin = new User({ username: 'admin', password: 'adminpassword' });
    await admin.save();
    res.json({ message: 'Admin seeded successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
