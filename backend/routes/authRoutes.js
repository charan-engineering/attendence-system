const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, faceDescriptor } = req.body;
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({ name, email, password, faceDescriptor });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // If it's the very first user, let's make them an admin automatically for testing purposes.
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      user.role = 'admin';
    }

    await user.save();

    const payload = {
      user: { id: user.id, role: user.role }
    };

    jwt.sign(payload, process.env.JWT_SECRET || 'secretkey', { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.status(201).json({ token, role: user.role, name: user.name, faceDescriptor: user.faceDescriptor });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: { id: user.id, role: user.role }
    };

    jwt.sign(payload, process.env.JWT_SECRET || 'secretkey', { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token, role: user.role, name: user.name, faceDescriptor: user.faceDescriptor });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
