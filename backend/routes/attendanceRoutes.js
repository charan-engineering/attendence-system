const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const User = require('../models/User');

// Mark Attendance (Authenticated User)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const attendanceRecord = new Attendance({
      userId: req.user.id,
      name: user.name
    });

    await attendanceRecord.save();
    res.status(201).json({ message: 'Attendance marked successfully', record: attendanceRecord });
  } catch (err) {
    console.error('Error marking attendance:', err);
    res.status(500).json({ error: 'Failed to mark attendance' });
  }
});

// Get all attendance records (Admin Only)
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const records = await Attendance.find().sort({ timestamp: -1 }).populate('userId', 'email role');
    res.status(200).json(records);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch attendance records' });
  }
});

// Delete Attendance Record (Admin Only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await Attendance.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Record removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
