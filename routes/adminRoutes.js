const express = require('express');
const router = express.Router();
const { getAllUsers, getAllAttendance, editAttendance, deleteAttendance, generateUserReport, generateSystemReport, approvedLeave, gradeSystem } = require('../controllers/adminController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

router.get('/users', auth, adminAuth, getAllUsers);
router.get('/attendance', auth, adminAuth, getAllAttendance);
router.put('/attendance/:id', auth, adminAuth, editAttendance);
router.delete('/attendance/:id', auth, adminAuth, deleteAttendance);
router.post('/user-report', auth, adminAuth, generateUserReport);
router.post('/system-report', auth, adminAuth, generateSystemReport);
router.put('/approvedleave', auth, adminAuth, approvedLeave);
router.put('/grade', auth, adminAuth, gradeSystem);

module.exports = router;
