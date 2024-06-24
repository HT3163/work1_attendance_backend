const User = require('../models/User');
const Attendance = require('../models/Attendance');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {

  // console.log(req.body)

  const { name, email, password, rollNumber } = req.body.formData;
  const avatar = req.body.url
  


  try {

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      name, email, password, rollNumber, avatar
    });

    await user.save();

    const payload = { user: { id: user.id, role: user.role, rollNumber: user.rollNumber } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '20h' }, (err, token) => {
      if (err) throw err;
      res.json({ token, role: user.role, userid: user.id, avatar: user.avatar, name: user.name, email: user.email, rollNumber: user.rollNumber, grade: user.grade });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    const payload = { user: { id: user.id, role: user.role, rollNumber: user.rollNumber } };

    // console.log(user)

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '20h' }, (err, token) => {
      if (err) throw err;
      res.json({ token, role: user.role, id: user.id, avatar: user.avatar, name: user.name, email: user.email, rollNumber: user.rollNumber, grade: user.grade });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.markAttendance = async (req, res) => {
  const { status } = req.body;
  // console.log(req.user);

  try {

    const today1 = new Date();
    const year = today1.getFullYear();
    const month = String(today1.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so add 1
    const day = String(today1.getDate()).padStart(2, '0');

    const formattedToday = `${year}-${month}-${day}`;

    // Convert today's date to a Date object
    const todayDate = new Date(formattedToday);
    console.log(todayDate)

    // Query to find existing attendance for today
    const attendanceExists = await Attendance.findOne({
      user: req.user.id,
      date: {
        $gte: todayDate,
        $lt: new Date(todayDate.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (attendanceExists) {
      return res.status(400).json({ msg: 'Attendance already marked for today' });
    }

    // Create a new attendance record
    const attendance = new Attendance({ user: req.user.id, status, date: todayDate, rollNumber: req.user.rollNumber });
    await attendance.save();

    res.json({ msg: 'Attendance marked' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


exports.viewAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ user: req.user.id }).sort({ date: -1 });
    res.json(attendance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.editProfile = async (req, res) => {
  console.log(req.body)
  const { url } = req.body;
  try {
    console.log(req.user.id)
    console.log(url)
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    user.avatar = url;
    await user.save();
    res.json({ msg: 'Profile updated' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.sendLeaveRequest = async (req, res) => {
  const { date, reason } = req.body;
  try {
    const attendance = new Attendance({ user: req.user.id, date, status: 'leave', reason, rollNumber: req.user.rollNumber });
    await attendance.save();
    res.json({ msg: 'Leave request sent' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
