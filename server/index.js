require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const uploadDir = path.join(__dirname, 'uploads', 'blogs');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({ storage: multer.memoryStorage() });

const auth = require('./middleware/auth');
const User = require('./models/User');
const Project = require('./models/Project');
const Experience = require('./models/Experience');
const Education = require('./models/Education');
const Contact = require('./models/Contact');
const Skill = require('./models/Skill');
const LoginAttempt = require('./models/LoginAttempt');
const Settings = require('./models/Settings');
const ActivityLog = require('./models/ActivityLog');
const Hire = require('./models/Hire');
const Blog = require('./models/Blog');

// Helper to log activity
const logActivity = async (action, details, category = 'CRUD', req = null) => {
  try {
    const ip = req ? (req.headers['x-forwarded-for'] || req.socket.remoteAddress) : 'System';
    await ActivityLog.create({ action, details, category, ip });
  } catch (err) {
    console.error('Logging failed:', err);
  }
};

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Auth Routes ---
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      await new LoginAttempt({ username, ip, success: false }).save();
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await new LoginAttempt({ username, ip, success: false }).save();
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    await new LoginAttempt({ username, ip, success: true }).save();
    await logActivity('Logged In', 'Successful admin login', 'Auth', req);
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, username: user.username });
  } catch (err) {
    await logActivity('Failed Login Attempt', `Attempted username: ${username}`, 'Security', req);
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
      await logActivity('Changed Password', 'Admin updated credentials', 'Auth', req);
    } else {
      await logActivity('Updated Username', `New username: ${username}`, 'Auth', req);
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
  await logActivity('Added Project', `Title: ${req.body.title}`, 'CRUD', req);
  res.status(201).json(newProject);
});
app.put('/api/projects/:id', auth, async (req, res) => {
  const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
  await logActivity('Updated Project', `ID: ${req.params.id}`, 'CRUD', req);
  res.json(updated);
});
app.delete('/api/projects/:id', auth, async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  await logActivity('Deleted Project', `ID: ${req.params.id}`, 'CRUD', req);
  res.json({ message: 'Deleted' });
});

// Blogs
app.get('/api/blogs', async (req, res) => {
  try {
    const data = await Blog.find().sort('-createdAt');
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/blogs/:slug', async (req, res) => {
  try {
    const data = await Blog.findOne({ slug: req.params.slug });
    if (!data) return res.status(404).json({ message: 'Blog not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/blogs', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Cover Image is required' });
    }

    let imageFilename = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.svg';
    if (req.file.mimetype === 'image/svg+xml') {
      fs.writeFileSync(path.join(uploadDir, imageFilename), req.file.buffer);
    } else {
      const webpBuffer = await sharp(req.file.buffer)
        .resize(1200, 600, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 60 })
        .toBuffer();
      const base64Image = webpBuffer.toString('base64');
      const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1200 600"><image href="data:image/webp;base64,${base64Image}" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" /></svg>`;
      fs.writeFileSync(path.join(uploadDir, imageFilename), svgContent);
    }

    const newBlog = new Blog({
      ...req.body,
      tags: req.body.tags ? JSON.parse(req.body.tags) : [],
      image: imageFilename
    });
    await newBlog.save();
    await logActivity('Added Blog', `Title: ${req.body.title}`, 'CRUD', req);
    res.status(201).json(newBlog);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

app.put('/api/blogs/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.body.tags) {
      updateData.tags = JSON.parse(req.body.tags);
    }
    
    if (req.file) {
      let imageFilename = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.svg';
      if (req.file.mimetype === 'image/svg+xml') {
        fs.writeFileSync(path.join(uploadDir, imageFilename), req.file.buffer);
      } else {
        const webpBuffer = await sharp(req.file.buffer)
          .resize(1200, 600, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 60 })
          .toBuffer();
        const base64Image = webpBuffer.toString('base64');
        const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1200 600"><image href="data:image/webp;base64,${base64Image}" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" /></svg>`;
        fs.writeFileSync(path.join(uploadDir, imageFilename), svgContent);
      }
      updateData.image = imageFilename;
    }

    const updated = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });
    await logActivity('Updated Blog', `ID: ${req.params.id}`, 'CRUD', req);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

app.delete('/api/blogs/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (blog && blog.image) {
      const imgPath = path.join(uploadDir, blog.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }
    await logActivity('Deleted Blog', `ID: ${req.params.id}`, 'CRUD', req);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

// Experiences
app.get('/api/experience', async (req, res) => {
  const data = await Experience.find().sort('order');
  res.json(data);
});
app.post('/api/experience', auth, async (req, res) => {
  const entry = new Experience(req.body);
  await entry.save();
  await logActivity('Added Experience', `Role: ${req.body.role}`, 'CRUD', req);
  res.status(201).json(entry);
});
app.put('/api/experience/:id', auth, async (req, res) => {
  const updated = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
  await logActivity('Updated Experience', `ID: ${req.params.id}`, 'CRUD', req);
  res.json(updated);
});
app.delete('/api/experience/:id', auth, async (req, res) => {
  await Experience.findByIdAndDelete(req.params.id);
  await logActivity('Deleted Experience', `ID: ${req.params.id}`, 'CRUD', req);
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
  await logActivity('Added Education', `Degree: ${req.body.degree}`, 'CRUD', req);
  res.status(201).json(entry);
});
app.put('/api/education/:id', auth, async (req, res) => {
  const updated = await Education.findByIdAndUpdate(req.params.id, req.body, { new: true });
  await logActivity('Updated Education', `ID: ${req.params.id}`, 'CRUD', req);
  res.json(updated);
});
app.delete('/api/education/:id', auth, async (req, res) => {
  await Education.findByIdAndDelete(req.params.id);
  await logActivity('Deleted Education', `ID: ${req.params.id}`, 'CRUD', req);
  res.json({ message: 'Deleted' });
});

// Skills
app.get('/api/skills', async (req, res) => {
  const data = await Skill.find().sort('order');
  res.json(data);
});
app.post('/api/skills', auth, async (req, res) => {
  const entry = new Skill(req.body);
  await entry.save();
  await logActivity('Added Skill', `Name: ${req.body.name}`, 'CRUD', req);
  res.status(201).json(entry);
});
app.put('/api/skills/:id', auth, async (req, res) => {
  const updated = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
  await logActivity('Updated Skill', `ID: ${req.params.id}`, 'CRUD', req);
  res.json(updated);
});
app.delete('/api/skills/:id', auth, async (req, res) => {
  await Skill.findByIdAndDelete(req.params.id);
  await logActivity('Deleted Skill', `ID: ${req.params.id}`, 'CRUD', req);
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

// Notifications
app.get('/api/notifications/count', auth, async (req, res) => {
  try {
    const [messages, proposals, security] = await Promise.all([
      Contact.countDocuments({ read: false }),
      Hire.countDocuments({ read: false }),
      LoginAttempt.countDocuments({ success: false, read: false })
    ]);
    res.json({ total: messages + proposals + security, messages, proposals, security });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/notifications/mark-read', auth, async (req, res) => {
  const { type } = req.body;
  try {
    if (type === 'messages') await Contact.updateMany({ read: false }, { read: true });
    if (type === 'proposals') await Hire.updateMany({ read: false }, { read: true });
    if (type === 'security') await LoginAttempt.updateMany({ read: false }, { read: true });
    res.json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Skills
app.get('/api/skills', async (req, res) => {
  try {
    const skills = await Skill.find().sort({ order: 1 });
    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Activity Logs
app.get('/api/activity-logs', auth, async (req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ timestamp: -1 }).limit(100);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/activity-logs', auth, async (req, res) => {
  try {
    await ActivityLog.deleteMany({});
    await logActivity('Cleared Logs', 'All activity logs were deleted', 'Security', req);
    res.json({ message: 'All logs cleared' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Settings
app.get('/api/settings', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/settings', auth, async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate({}, req.body, { upsert: true, new: true });
    await logActivity('Updated Settings', 'General contact info updated', 'CRUD', req);
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// --- Seed Admin User ---
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
