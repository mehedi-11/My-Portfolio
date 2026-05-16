const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Database URI from your configuration
const MONGODB_URI = "mongodb+srv://mehedi_admin_19:zHsDUbbSlpdxumBi@myportfolio.orsho4o.mongodb.net/portfolio?retryWrites=true&w=majority";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

async function seedAdmin() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!');

    const existing = await User.findOne({ username: 'admin' });
    if (existing) {
      console.log('Admin user already exists. Updating password...');
      existing.password = await bcrypt.hash('adminpassword', 10);
      await existing.save();
    } else {
      console.log('Creating new admin user...');
      const hashedPassword = await bcrypt.hash('adminpassword', 10);
      const admin = new User({
        username: 'admin',
        password: hashedPassword
      });
      await admin.save();
    }

    console.log('Success! You can now login with:');
    console.log('Username: admin');
    console.log('Password: adminpassword');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding admin:', err);
    process.exit(1);
  }
}

seedAdmin();
