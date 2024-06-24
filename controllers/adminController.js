const User = require('../models/User');
const Attendance = require('../models/Attendance');
const { default: mongoose, Mongoose } = require('mongoose');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
exports.getAllAttendance = async (req, res) => {
  try {
    const atten = await Attendance.find();
    res.json(atten);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.editAttendance = async (req, res) => {
  const { status } = req.body;
  try {
    let attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ msg: 'Attendance not found' });
    }
    attendance.status = status;
    await attendance.save();
    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteAttendance = async (req, res) => {
  try {
    await Attendance.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Attendance removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.generateUserReport = async (req, res) => {
  const { userId, from, to } = req.body;
  // console.log(req.body)
  try {
    const attendance = await Attendance.find({ rollNumber: userId, date: { $gte: new Date(from), $lte: new Date(to) } }).sort({ date: -1 });
    
    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.generateSystemReport = async (req, res) => {
  const { from, to } = req.body;
  try {
    const attendance = await Attendance.find({ date: { $gte: new Date(from), $lte: new Date(to) } }).sort({ date: -1 });
    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.approvedLeave = async (req, res) => {
  const { status } = req.body;
  // console.log(req.body)
  try {
    const attendance = await Attendance.find({rollNumber: req.body.roll, date: req.body.date, }).sort({ date: -1 });
    // console.log(attendance)
    
    if (!attendance) {
      return res.status(404).json({ msg: 'Attendance not found' });
    }
    attendance[0].status = status;
    await attendance[0].save();
    console.log(attendance[0])
    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.gradeSystem = async (req, res) => {
  console.log('abcsd')
  const { userId,attendedDays } = req.body;
  // const userId = "6677148aa9073d5c9332ae36"
  // console.log(userId,attendedDays)
  let grade;
  if (attendedDays >= 26) {
    grade = 'A';
  } else if (attendedDays >= 20) {
    grade = 'B';
  } else if (attendedDays >= 15) {
    grade = 'C';
  } else if (attendedDays >= 10) {
    grade = 'D';
  } else {
    grade = 'F';
  }
  try {
    const user = await User.find({rollNumber: userId});
    console.log(user)
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    user[0].grade = grade;
    console.log(user)
    await user[0].save();
    res.json({ msg: `Grade set to ${grade}` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
