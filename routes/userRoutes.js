const express = require('express');
const router = express.Router();
const { registerUser, loginUser, markAttendance, viewAttendance, editProfile, sendLeaveRequest } = require('../controllers/userController');
const auth = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/attendance', auth, markAttendance);
router.get('/attendance', auth, viewAttendance);
router.put('/profile', auth, editProfile);
router.post('/leave', auth, sendLeaveRequest);

module.exports = router;
